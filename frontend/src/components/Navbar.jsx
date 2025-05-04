import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navbarStyle = {
  background: '#f5f5f5',
  borderBottom: '1px solid #e5e7eb',
  padding: '1rem 0',
  width: '100%',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const logoStyle = {
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#4f46e5',
  textDecoration: 'none',
  marginBottom: '0.5rem',
};

const linksStyle = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
};

const linkStyle = {
  color: '#4b5563',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  padding: '0.5rem 0',
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          Gestor de Tareas
        </Link>
        <div style={linksStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
              <Link to="/tasks" style={linkStyle}>Mis Tareas</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" style={linkStyle}>Panel de Admin</Link>
              )}
              <button onClick={logout} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Iniciar Sesión</Link>
              <Link to="/signup" style={linkStyle}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 