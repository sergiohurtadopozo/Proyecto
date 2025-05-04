const jwt = require('jsonwebtoken');
const { User } = require('../models');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación de admin:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = adminAuth; 