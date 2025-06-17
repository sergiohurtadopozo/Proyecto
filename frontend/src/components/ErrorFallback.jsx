import React from 'react';

const ErrorFallback = ({ message }) => (
  <div className="error-fallback" style={{ textAlign: 'center', padding: '2rem' }}>
    <div style={{ fontSize: 120, marginBottom: 24 }}>❌</div>
    <h2>¡Ha ocurrido un error!</h2>
    <p style={{ marginBottom: 24 }}>{message || 'Error inesperado. Por favor, recarga la página.'}</p>
    <button className="action-button" onClick={() => window.location.reload()}>
      Recargar página
    </button>
  </div>
);

export default ErrorFallback; 