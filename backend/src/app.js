const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sharedTaskRoutes = require('./routes/sharedTaskRoutes');

const app = express();

// CORS robusto: solo orígenes permitidos y gestión de preflight
const allowedOrigins = [
  'https://proyecto-six-zeta.vercel.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

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