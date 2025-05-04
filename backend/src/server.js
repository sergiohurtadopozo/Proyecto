// backend/src/server.js
const express = require('express');
const cors = require('cors');
const { init } = require('./models');
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://proyecto-six-zeta.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/tasks', require('./routes/sharedTaskRoutes'));
app.use('/api/profile', require('./routes/profile'));

// Inicializar la base de datos y el servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await init(); // Inicializar la base de datos
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
