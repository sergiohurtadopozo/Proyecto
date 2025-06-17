import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../estilos/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">📋</span>
            TaskFlow
          </Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <span className="link-icon">📝</span>
                Mis Tareas
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-icon">👑</span>
                  Panel de Admin
                </Link>
              )}
              <button onClick={() => {
                logout();
                setIsMenuOpen(false);
              }} className="navbar-link navbar-logout">
                <span className="link-icon">🚪</span>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <span className="link-icon">🔑</span>
                Iniciar Sesión
              </Link>
              <Link to="/signup" className="navbar-link signup-link" onClick={() => setIsMenuOpen(false)}>
                <span className="link-icon">✨</span>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 