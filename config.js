import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Configuración del bot
global.prefix = '.'; // Prefijo para los comandos
global.owner = ['1234567890@s.whatsapp.net']; // Reemplaza con tu número de WhatsApp
global.db = {}; // Base de datos inicial

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
            console.log(chalk.green(`Plugin cargado: ${filename}`));
        } catch (err) {
            console.error(`Error al cargar el plugin ${filename}:`, err);
        }
    }
}

// Comando .menu
global.plugins['menu.js'] = async (m, { conn }) => {
    const menuText = `
*╭═══╮*
*│  Menú del Bot  │*
*╰═══╯*

*Comandos disponibles:*
- .menu: Muestra este menú
- Otras funciones pueden ser añadidas aquí.

*╭═══╮*
*│  Gracias por usar Megumin Bot!  │*
*╰═══╯*
    `;
    await conn.sendMessage(m.chat, { text: menuText }, { quoted: m });
};

// Cargar los plugins al iniciar
loadPlugins().catch(console.error);
