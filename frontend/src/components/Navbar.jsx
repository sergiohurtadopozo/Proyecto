import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../estilos/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          TaskFlow
        </Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className="navbar-link">Mis Tareas</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">Panel de Admin</Link>
              )}
              <button onClick={logout} className="navbar-link navbar-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Iniciar Sesión</Link>
              <Link to="/signup" className="navbar-link">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 