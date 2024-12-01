"use strict";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'; 

// Importando configuraciones y bibliotecas necesarias
import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { platform } from 'process';
import { existsSync, readdirSync, writeFileSync } from 'fs';
import yargs from 'yargs';
import { makeWASocket, protoType, serialize } from './src/libraries/simple.js';
import { Low, JSONFile } from 'lowdb';
import lodash from 'lodash';
import chalk from 'chalk';
import { Boom } from '@hapi/boom';
import { useMultiFileAuthState, fetchLatestBaileysVersion } from 'baileys';
import NodeCache from 'node-cache';

// Variables globales
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
let stopped = 'close';  
protoType();
serialize();

const __dirname = path.resolve();

// Cargando las opciones del archivo de configuración
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

// Cargando la base de datos
global.db = new Low(new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

// Función para cargar la base de datos
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

// Función para inicializar el bot
async function startBot() {
  console.log(chalk.green.bold('Iniciando el bot...'));

  // Cargar las configuraciones de sesión
  const sessionDir = path.join(__dirname, 'session');
  if (!existsSync(sessionDir)) {
    console.log(chalk.red('Creando carpeta de sesión...'));
    fs.mkdirSync(sessionDir);
  }

  // Crear el socket para la conexión
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    version,
  });

  sock.ev.on('creds.update', saveCreds);

  // Manejador de eventos de conexión
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, isNewLogin } = update;
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot();
      } else {
        console.log(chalk.red('Conexión cerrada.'));
      }
    }
  });

  // Cargar y manejar comandos
  sock.ev.on('messages.upsert', async (message) => {
    const msg = message.messages[0];
    if (!msg.key.fromMe) {
      const command = msg.body.trim().toLowerCase();
      switch (command) {
        case 'ping':
          await sock.sendMessage(msg.key.remoteJid, { text: 'Pong!' });
          break;
        // Agrega más comandos según lo necesario
        default:
          console.log(`Comando no reconocido: ${command}`);
      }
    }
  });
  
  console.log(chalk.green('Bot iniciado correctamente.'));
}

// Iniciar el bot
startBot();
