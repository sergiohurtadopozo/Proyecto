// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Validación de datos de entrada
const validateUserData = (data) => {
  const errors = [];
  if (!data.username || data.username.trim().length < 3) {
    errors.push('El nombre de usuario debe tener al menos 3 caracteres');
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('El correo electrónico no es válido');
  }
  if (!data.password || data.password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  return errors;
};

// Obtener información del usuario actual
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id', 'username', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error en /me:', err);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
});

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, secretCode } = req.body;

    // Validar datos de entrada
    const errors = validateUserData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Verificar si ya existe
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Definir rol
    const role = secretCode?.trim() === process.env.ADMIN_SECRET ? 'admin' : 'user';

    // Crear usuario
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responder con token y datos mínimos
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en /register:', err);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/users', authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
    res.json(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/users/:id', authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
