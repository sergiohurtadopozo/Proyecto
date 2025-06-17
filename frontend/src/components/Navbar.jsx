import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../estilos/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Cerrar el menú al cambiar de ruta
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="TaskFlow Logo" />
            TaskFlow
          </Link>
        </div>

        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link 
                to="/calendar" 
                className={`navbar-link ${location.pathname === '/calendar' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Calendario
              </Link>
              <Link 
                to="/profile" 
                className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Perfil
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Panel Admin
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="navbar-link navbar-logout"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Iniciar Sesión</Link>
              <Link to="/register" className="navbar-link signup-link">Registrarse</Link>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="navbar-overlay" onClick={closeMenu} />
      )}
    </nav>
  );
};

export default Navbar; 