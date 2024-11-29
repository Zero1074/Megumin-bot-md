const handler = async (m, { conn }) => {
    const menuText = `
*╭═══╮*
*│  Menú del Bot  │*
*╰═══╯*

*Comandos disponibles:*
- .menu: Muestra este menú
- .ppt: Juega piedra, papel o tijera
- .daily: Reclama tu regalo diario
- .work: Realiza un trabajo para ganar experiencia
- .crime: Realiza un crimen para intentar ganar dinero y experiencia

*╭═══╮*
*│  Gracias por usar Megumin Bot!  │*
*╰═══╯*
    `;
    
    await conn.sendMessage(m.chat, { text: menuText }, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^menu$/i;

export default handler;
