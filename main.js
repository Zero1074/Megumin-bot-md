"use strict";

import { create, Client } from '@open-wa/wa-automate';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Función para crear el cliente de WhatsApp
const start = async (client) => {
    console.log('Bot iniciado');

    // Manejar eventos de mensajes
    client.onMessage(async (message) => {
        if (message.body === '!ping') {
            await client.sendText(message.from, 'Pong!');
        }
        // Puedes agregar más comandos aquí
    });

    // Manejar eventos de conexión
    client.onStateChanged((state) => {
        console.log('Estado de conexión:', state);
        if (state === 'CONFLICT') {
            client.forceRefocus();
        }
    });
};

// Crear el cliente de WhatsApp
create({
    session: 'session-name', // Nombre de la sesión, se guardará en la carpeta de sesión
    multiDevice: true, // Si deseas usar la función multi-dispositivo
    puppeteer: {
        headless: true, // Cambia a false si deseas ver el navegador
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
}).then(start).catch((err) => console.error(err));
