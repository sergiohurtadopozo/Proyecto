import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ background: '#f5f5f5', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#4f46e5', textDecoration: 'none' }}>
            Gestor de Tareas
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/dashboard" style={{ color: '#4b5563', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/tasks" style={{ color: '#4b5563', textDecoration: 'none' }}>Mis Tareas</Link>
          <Link to="/login" style={{ color: '#4b5563', textDecoration: 'none' }}>Iniciar Sesión</Link>
          <Link to="/signup" style={{ color: '#4b5563', textDecoration: 'none' }}>Registrarse</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 