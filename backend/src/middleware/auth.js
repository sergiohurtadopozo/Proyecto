// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authenticate(req, res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header) {
      return res.status(401).json({ error: 'Token de autenticación requerido' });
    }

    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload || !payload.id) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }

      // Obtener usuario
      const user = await User.findOne({
        where: { id: payload.id },
        attributes: ['id', 'username', 'email', 'role']
      });

      if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      // Agregar usuario a la request
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('Error al verificar token:', jwtError);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (err) {
    console.error('Error en autenticación:', err);
    return res.status(500).json({ error: 'Error en la autenticación' });
  }
}

module.exports = { authenticate };