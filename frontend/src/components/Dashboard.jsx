// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api';
import TaskForm from './TaskForm';
import CalendarView from './CalendarView';
import TaskList from './TaskList';
import ShareRequests from './ShareRequests';
import { useTasks } from '../context/TaskContext';
import '../estilos/Dashboard.css';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSharedTasks, setShowSharedTasks] = useState(false);
  const { fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const data = await getProfile();
        setProfile(data);
        await fetchTasks();
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        if (error.message === 'No hay token de autenticación') {
          navigate('/login');
        } else {
          setError('No se pudo cargar el perfil. Por favor, intenta nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, fetchTasks]);

  const handleTaskAdded = () => {
    setShowTaskForm(false);
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p className="loading-message">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p className="error-message">{error}</p>
        <button className="action-button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      {profile && (
        <div className="profile-info">
          <p><strong>Nombre de usuario:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Rol:</strong> {profile.role}</p>
        </div>
      )}

      <div className="dashboard-actions">
        <button 
          className="action-button"
          onClick={() => setShowTaskForm(!showTaskForm)}
        >
          {showTaskForm ? 'Cancelar' : 'Crear Nueva Tarea'}
        </button>
        <button 
          className="action-button secondary"
          onClick={() => setShowSharedTasks(!showSharedTasks)}
        >
          {showSharedTasks ? 'Ver Mis Tareas' : 'Ver Tareas Compartidas'}
        </button>
      </div>

      {showTaskForm && (
        <div className="task-form-overlay">
          <TaskForm onSubmit={handleTaskAdded} onClose={() => setShowTaskForm(false)} />
        </div>
      )}

      {!showSharedTasks && (
        <div className="share-requests-section">
          <h3>Solicitudes de Compartir</h3>
          <ShareRequests onRequestResponded={fetchTasks} />
        </div>
      )}

      <div className="tasks-section">
        <TaskList showSharedTasks={showSharedTasks} onTaskChange={fetchTasks} />
      </div>

      <div className="calendar-section">
        <h3>Calendario de Tareas</h3>
        <CalendarView />
      </div>
    </div>
  );
}

export default Dashboard;
