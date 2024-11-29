"use strict";

import './config.js'; // Configuración inicial
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@adiwajshing/baileys';
import { Low, JSONFile } from 'lowdb';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import chalk from 'chalk';
import { createRequire } from 'module';

const __dirname = path.resolve();
const require = createRequire(import.meta.url);

// Cargar base de datos
global.db = new Low(new JSONFile(path.join(__dirname, 'database.json')));
await global.db.read();
global.db.data ||= { users: {}, chats: {} };

// Configuración de la conexión
const { state, saveCreds } = await useMultiFileAuthState('auth');
const { version } = await fetchLatestBaileysVersion();

const conn = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    version,
    logger: pino({ level: 'silent' }), // Cambia a 'info' para más detalles
});

// Eventos de conexión
conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        console.log('Conexión cerrada, intentando reconectar...');
        if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            conn = makeWASocket({ auth: state });
        } else {
            console.log('Sesión cerrada, por favor vuelve a escanear el código QR.');
        }
    } else if (connection === 'open') {
        console.log('Conectado correctamente.');
    }
});

// Cargar plugins
const pluginFolder = path.join(__dirname, 'plugins');
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function loadPlugins() {
    for (const filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
            const file = path.join(pluginFolder, filename);
            const module = await import(file);
            global.plugins[filename] = module.default || module;
        } catch (err) {
            console.error(`Error al cargar el plugin ${filename}:`, err);
        }
    }
}

await loadPlugins();

// Manejar mensajes
conn.ev.on('messages.upsert', async (m) => {
    // Aquí puedes manejar los mensajes recibidos y ejecutar comandos
    const msg = m.messages[0];
    if (!msg.key.fromMe) {
        const command = msg.body.trim().split(' ')[0]; // Extraer el comando
        if (command in global.plugins) {
            await global.plugins[command](msg, { conn });
        }
    }
});

// Guardar credenciales
conn.ev.on('creds.update', saveCreds);

// Iniciar el bot
console.log(chalk.green('Bot iniciado...'));
