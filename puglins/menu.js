export async function handler(m) {
  // Comprobar si el mensaje es ".menu"
  if (m.text.toLowerCase() === '.menu') {
    // Responder con "Hola"
    m.reply('Hola');
  }
}

handler.help = ['.menu'];
handler.tags = ['basic'];
handler.command = ['menu']; // El comando es .menu

// Exportar el plugin
export default handler;
