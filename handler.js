import { generateWAMessageFromContent } from 'baileys';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import fs from 'fs';
import chalk from 'chalk';
import mddd5 from 'md5';
import ws from 'ws';

let mconn;

/**
 * @type {import('baileys')}
 */
const { proto } = (await import('baileys')).default;

const isNumber = (x) => typeof x === 'number' && !isNaN(x);

/**
 * Función de retraso (delay) con base en el tiempo en milisegundos.
 * @param {number} ms - Milisegundos a esperar antes de continuar.
 * @returns {Promise<void>}
 */
const delay = (ms) => {
  if (!isNumber(ms)) throw new Error('El tiempo debe ser un número');
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Función para enviar mensajes usando `generateWAMessageFromContent`
async function sendMessage(to, content) {
  const message = await generateWAMessageFromContent(to, content, {
    quoted: undefined,  // Se puede agregar un mensaje citado si se desea
    messageContextInfo: undefined,
  });
  await mconn.sendMessage(to, message);  // Enviar el mensaje usando el conector (mconn)
}

/**
 * Función para verificar la autenticidad de la sesión del bot.
 */
async function verifyAuth() {
  // Aquí va el código necesario para verificar la sesión, por ejemplo:
  const authPath = join(__dirname, 'auth', 'creds.json');
  if (fs.existsSync(authPath)) {
    console.log(chalk.green('¡Sesión de bot válida!'));
  } else {
    console.log(chalk.red('No se encontró el archivo de autenticación.'));
  }
}

/**
 * Conexión WebSocket y autenticación.
 */
function setupWebSocket() {
  const socket = new ws('ws://localhost:3000');  // URL del WebSocket

  socket.on('open', () => {
    console.log(chalk.green('Conexión WebSocket establecida.'));
  });

  socket.on('message', (data) => {
    console.log(chalk.yellow(`Mensaje recibido: ${data}`));
  });

  socket.on('close', () => {
    console.log(chalk.red('Conexión WebSocket cerrada.'));
  });

  socket.on('error', (err) => {
    console.error(chalk.red(`Error en WebSocket: ${err}`));
  });
}

/**
 * Función principal para iniciar el bot.
 */
async function startBot() {
  // Verificar autenticación
  await verifyAuth();

  // Establecer conexión WebSocket
  setupWebSocket();

  // Inicializar el conector de `baileys`
  const conn = await makeWASocket();  // Usamos makeWASocket directamente
  mconn = conn;  // Guardamos la conexión en mconn

  // Ejemplo de uso del comando `.menu`
  await sendMessage('1234567890@s.whatsapp.net', { text: 'Hola, bienvenido al menú!' });

  // Aquí podrías añadir más lógicas para manejar comandos, respuestas, etc.

  // Realizar un delay de 3 segundos
  await delay(3000);

  console.log(chalk.blue('Bot iniciado y funcionando.'));
}

// Inicializar el bot
startBot();

// Manejando actualizaciones de archivos
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Actualización en \'main.js\' detectada.'));
  import(`${file}?update=${Date.now()}`);
});
