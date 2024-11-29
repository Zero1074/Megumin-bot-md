const handler = async (m, { conn }) => {
    // Texto del menú que se enviará al usuario
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
    
    // Envía el mensaje con el texto del menú al chat
    await conn.sendMessage(m.chat, { text: menuText }, { quoted: m });
};

// Configuración del handler
handler.help = ['menu']; // Ayuda para el comando
handler.tags = ['main']; // Etiqueta del comando
handler.command = /^menu$/i; // Expresión regular para el comando

export default handler; // Exporta el handler para que pueda ser utilizado
