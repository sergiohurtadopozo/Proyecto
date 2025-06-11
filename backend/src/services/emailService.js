const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendPasswordResetEmail = (to, resetLink) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Recuperación de contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Si no solicitaste este cambio, ignora este correo.</p>`
  });
};

module.exports = { sendPasswordResetEmail }; 