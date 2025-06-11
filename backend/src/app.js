const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sharedTaskRoutes = require('./routes/sharedTaskRoutes');

const app = express();

// CORS: permitir frontend en Vercel y local, y log para depuración
app.use((req, res, next) => {
  console.log('CORS request:', req.method, req.headers.origin);
  next();
});
app.use(cors({
  origin: [
    'https://proyecto-six-zeta.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors(), (req, res) => {
  console.log('OPTIONS preflight:', req.headers.origin);
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.status(204).send('CORS preflight OK');
});

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
    console.error('Error middleware:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

module.exports = app; 