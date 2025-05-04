import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../estilos/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo">
              Gestor de Tareas
            </Link>
          </div>
          
          {isAuthenticated && (
            <div className="navbar-links">
              <Link to="/tasks" className="navbar-link">
                Mis Tareas
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">
                  Panel de Admin
                </Link>
              )}
            </div>
          )}

          <div className="navbar-actions">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="navbar-button logout"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar-button login"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className="navbar-button register"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 