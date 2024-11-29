import { create, Client } from '@open-wa/wa-automate';

const start = (client) => {
    console.log('Bot iniciado. Escanea el código QR para conectarte.');
};

create().then(client => {
    client.onStateChange((state) => {
        if (state === 'CONNECTED') {
            console.log('Conectado exitosamente!');
        } else if (state === 'DISCONNECTED') {
            console.log('Desconectado. Intenta reconectar.');
        }
    });

    client.onMessage(message => {
        // Aquí puedes agregar más comandos en el futuro.
    });

    start(client);
});
