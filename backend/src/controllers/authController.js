const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../services/emailService');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Por seguridad, responde igual aunque no exista
    return res.status(200).json({ message: 'Si el correo existe, se enviará un email con instrucciones.' });
  }
  // Genera un token válido por 1 hora
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendPasswordResetEmail(email, resetLink);
  res.status(200).json({ message: 'Si el correo existe, se enviará un email con instrucciones.' });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado.' });
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
}; 