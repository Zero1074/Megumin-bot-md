import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import cfonts from 'cfonts';
import readline from 'readline';
import chalk from 'chalk';
import fs from 'fs';
import './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { say } = cfonts;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let isRunning = false;

const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

console.log(chalk.yellow.bold('—◉ Iniciando Megumin Bot...'));

function verificarOCrearCarpetaAuth() {
  const authPath = join(__dirname, global.authFile);
  if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath, { recursive: true });
  }
}

function verificarCredsJson() {
  const credsPath = join(__dirname, global.authFile, 'creds.json');
  return fs.existsSync(credsPath);
}

function formatearNumeroTelefono(numero) {
  let formattedNumber = numero.replace(/[^\d+]/g, '');
  if (formattedNumber.startsWith('+52') && !formattedNumber.startsWith('+521')) {
    formattedNumber = formattedNumber.replace('+52', '+521');
  } else if (formattedNumber.startsWith('52') && !formattedNumber.startsWith('521')) {
    formattedNumber = `+521${formattedNumber.slice(2)}`;
  } else if (formattedNumber.startsWith('52') && formattedNumber.length >= 12) {
    formattedNumber = `+${formattedNumber}`;
  } else if (!formattedNumber.startsWith('+')) {
    formattedNumber = `+${formattedNumber}`;
  }
  return formattedNumber;
}

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  say('Megumin Bot', {
    font: 'chrome',
    align: 'center',
    gradient: ['red', 'magenta'],
  });

  verificarOCrearCarpetaAuth();

  if (verificarCredsJson()) {
    const args = [join(__dirname, file), ...process.argv.slice(2)];
    setupMaster({ exec: args[0], args: args.slice(1) });
    const p = fork();
    return;
  }

  const opcion = await question(chalk.yellowBright.bold('—◉ Seleccione una opción (solo el número):\n') + chalk.white.bold('1. Con código QR\n2. Con código de texto de 8 dígitos\n—> '));

  if (opcion === '1') {
    process.argv.push('qr');
  } else if (opcion === '2') {
    const numeroTelefono = await question(chalk.yellowBright.bold('\n—◉ Escriba su número de WhatsApp:\n') + chalk.white.bold('Ejemplo: +5219992095479\n—> '));
    const formattedNumber = formatearNumeroTelefono(numeroTelefono);
    process.argv.push('code', formattedNumber);
  }

  const args = [join(__dirname, file), ...process.argv.slice(2)];
  setupMaster({ exec: args[0], args: args.slice(1) });
  const p = fork();

  p.on('message', (data) => {
    console.log(chalk.green.bold('—◉ RECIBIDO:'), data);
    if (data === 'reset') {
      p.process.kill();
      isRunning = false;
      start(file);
    }
  });

  p.on('exit', () => {
    isRunning = false;
    console.error(chalk.red.bold('[ ERROR ] Ocurrió un error inesperado'));
    process.exit(1);
  });
}

start('main.js');
