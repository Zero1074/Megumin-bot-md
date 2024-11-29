import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'API está funcionando correctamente!' });
});

// Endpoint para recibir mensajes
app.post('/api/message', (req, res) => {
    const { sender, message } = req.body;
    // Aquí puedes manejar el mensaje recibido
    console.log(`Mensaje de ${sender}: ${message}`);
    res.json({ status: 'Mensaje recibido', sender, message });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en el puerto ${PORT}`);
});

export default app;
