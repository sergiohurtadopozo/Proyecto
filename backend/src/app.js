const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sharedTaskRoutes = require('./routes/sharedTaskRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks', sharedTaskRoutes);
app.use('/api/profile', profileRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app; 