const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para parsear el cuerpo de las peticiones POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, JavaScript, imágenes)
app.use(express.static('public'));

// Importar rutas
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const rutasRoutes = require('./routes/rutasRoutes');
const detallesRutaRoutes = require('./routes/detallesRutaRoutes');

// Configurar rutas de la API
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/detalles-ruta', detallesRutaRoutes);

// Rutas para servir los archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/vehiculos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vehiculos', 'index.html'));
});

app.get('/conductores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'conductores', 'index.html'));
});

app.get('/rutas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rutas', 'index.html'));
});

app.get('/rutas/ruta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rutas', 'ruta.html'));
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

module.exports = app;