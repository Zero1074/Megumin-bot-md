// config.js

// Número de teléfono del bot (en formato internacional)
global.botnumber = process.env.BOT_NUMBER || '+5219999999999'; // Cambia este número por el número de tu bot

// Archivo de sesión para almacenar las credenciales
global.authFile = 'MysticSession'; // Nombre de la carpeta donde se guardarán las sesiones

// Configuración de la base de datos
global.db = {
    data: null,
    READ: false,
};

// Configuración de idiomas
global.defaultLenguaje = 'es'; // Idioma por defecto
global.languages = ['es', 'en']; // Lista de idiomas soportados

// Configuración de opciones del bot
global.opts = {
    self: false, // Si el bot debe funcionar en modo "solo yo"
    pconly: false, // Solo mensajes privados
    gconly: false, // Solo mensajes de grupos
    swonly: false, // Solo mensajes de estado
    autocleartmp: true, // Limpiar archivos temporales automáticamente
};

// Configuraciones adicionales (puedes agregar más según tus necesidades)
global.APIs = {
    // Ejemplo de API externa
    someAPI: 'https://api.example.com',
};

// Claves API (puedes agregar más según tus necesidades)
global.APIKeys = {
    // Ejemplo de clave API
    'https://api.example.com': 'YOUR_API_KEY_HERE',
};

console.log('Configuración del bot cargada correctamente.');
