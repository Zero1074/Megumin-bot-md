const handler = async (m, { conn }) => {
  let who;

  // Verifica si el comando fue enviado en respuesta a un mensaje
  if (m.quoted) {
    who = m.quoted.sender; // Obtener el ID del usuario del mensaje respondido
  } else if (m.isGroup) {
    who = m.mentionedJid?.[0]; // Obtener el ID del usuario mencionado
  } else {
    who = m.chat; // En un chat privado, el ID es del interlocutor
  }

  if (!who) {
    throw '> menciona o responde a alguien para obtener su foto de perfil.';
  }

  try {
    // Obtener la URL de la foto de perfil del usuario
    const profilePictureUrl = await conn.profilePictureUrl(who, 'image').catch(() => null);

    if (!profilePictureUrl) {
      return conn.reply(m.chat, '> El usuario no tiene una foto de perfil pública.', m);
    }

    // Enviar la foto de perfil
    await conn.sendMessage(
      m.chat,
      { image: { url: profilePictureUrl }, caption: '> Aquí está la foto de perfil.' },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Ocurrió un error al intentar obtener la foto de perfil.', m);
  }
};

// Configuración del comando
handler.help = ['pfp'];
handler.tags = ['info'];
handler.command = /^pfp$/i; // Prefijo del comando (regex)
handler.rowner = false; // No requiere permisos de propietario
export default handler;
