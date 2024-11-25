import {watchFile, unwatchFile} from 'fs';
import chalk from 'chalk';
import {fileURLToPath} from 'url';
import moment from 'moment-timezone';

global.botnumber = "";
global.authFile = `MeguminSession`;
global.isBaileysFail = false;
global.defaultLenguaje = 'es';

global.owner = [
  ['5219992095479', '👑 Megumin - Creador 👑', true]
];

global.packname = 'Sticker';
global.author = 'Megumin - Bot';
global.wm = 'Megumin - Bot';
global.wait = '*_[ ⏳ ] Cargando..._*';

global.d = new Date(new Date + 3600000);
global.locale = 'es';
global.dia = d.toLocaleDateString(locale, {weekday: 'long'});
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'});
global.mes = d.toLocaleDateString('es', {month: 'long'});
global.año = d.toLocaleDateString('es', {year: 'numeric'});
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true});

global.wm2 = `${dia} ${fecha}\nMegumin - Bot`;
global.gt = 'Megumin - Bot';
global.meguminbot = 'Megumin - Bot';

global.multiplier = 99;

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'config.js\''));
  import(`${file}?update=${Date.now()}`);
});
