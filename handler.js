// handler.js

import fs from 'fs';
import path from 'path';

// Cargar todos los comandos desde la carpeta 'commands'
const loadCommands = () => {
    const commands = {};
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        commands[command.command] = command.handler;
    }

    return commands;
};

// Inicializar comandos
global.commands = loadCommands();

// Manejar mensajes
export const messageHandler = async (client, message) => {
    if (message.body.startsWith('!')) { // Cambia el prefijo según sea necesario
        const command = message.body.slice(1).trim().split(' ')[0]; // Extraer el comando
        const args = message.body.split(' ').slice(1); // Extraer los argumentos

        if (global.commands[command]) {
            try {
                await global.commands[command](client, message, args); // Llamar al comando correspondiente
            } catch (error) {
                console.error(`Error al ejecutar el comando ${command}:`, error);
                await client.sendText(message.from, 'Ocurrió un error al procesar tu solicitud.');
            }
        } else {
            await client.sendText(message.from, 'Comando no reconocido. Usa !help para ver la lista de comandos.');
        }
    }
};

// Manejar eventos de conexión
export const stateChangeHandler = (client, state) => {
    console.log('Estado de conexión:', state);
    if (state === 'CONFLICT') {
        client.forceRefocus();
    }
};

// Exportar las funciones del manejador
export default {
    messageHandler,
    stateChangeHandler,
};
