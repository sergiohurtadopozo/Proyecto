import React, { useState } from 'react';
import '../estilos/Login.css';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage('Si el correo existe, recibirás instrucciones para restablecer tu contraseña.');
    } catch (err) {
      setError(err.message || 'Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Recuperar Contraseña</h2>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
        {message && <p className="login-message success">{message}</p>}
        {error && <p className="login-message error">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword; 