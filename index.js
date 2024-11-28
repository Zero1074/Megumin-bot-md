const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

async function startBot() {
    const conn = new WAConnection();

    // Evento para generar un código QR
    conn.on('qr', (qr) => {
        console.log('🔒 Escanea este código QR con tu WhatsApp para conectarte:');
        console.log(qr); // El QR aparecerá en la terminal
    });

    // Evento de conexión exitosa
    conn.on('open', () => {
        console.log('✅ Bot conectado exitosamente a WhatsApp.');
        // Guardar credenciales para evitar reescaneo del QR
        const authInfo = conn.base64EncodedAuthInfo();
        fs.writeFileSync('session.json', JSON.stringify(authInfo, null, '\t'));
    });

    // Cargar sesión previa si existe
    if (fs.existsSync('./session.json')) {
        conn.loadAuthInfo('./session.json');
    }

    // Evento para escuchar mensajes
    conn.on('chat-update', async (chat) => {
        if (!chat.hasNewMessage) return;
        const message = chat.messages.all()[0];
        if (!message.message || message.key.fromMe) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || "";

        console.log(📩 Mensaje recibido de ${sender}: ${text});

        // Responder al comando ".menu"
        if (text === '.menu') {
            const menuText = `
📜 Menú del Bot:
1. Opción 1: Descripción
2. Opción 2: Descripción
...

🤖 Este es un bot básico en desarrollo.
            `;
            await conn.sendMessage(sender, menuText, MessageType.text);
            console.log(✅ Menú enviado a ${sender});
        }
    });

    // Conectar al servidor de WhatsApp
    await conn.connect();
}

startBot();
