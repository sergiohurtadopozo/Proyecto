// src/components/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import '../estilos/AdminDashboard.css';
import CalendarView from './CalendarView';
import { taskService } from '../services/taskService';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    totalUsers: 0,
    totalSharedTasks: 0
  });
  const [allTasks, setAllTasks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasks();

  const calculateStats = useCallback((tasksData) => {
    const newStats = {
      totalTasks: tasksData.length,
      completedTasks: tasksData.filter(task => task.status === 'completed').length,
      pendingTasks: tasksData.filter(task => task.status === 'pending').length,
      inProgressTasks: tasksData.filter(task => task.status === 'in_progress').length,
      totalUsers: 0,
      totalSharedTasks: 0
    };
    setStats(newStats);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        if (user.role !== 'admin') {
          navigate('/dashboard');
          return;
        }

        // Obtener todas las tareas si es admin
        const all = await taskService.getAllTasks();
        setAllTasks(all);
        calculateStats(all);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('No se pudieron cargar los datos. Por favor, intenta nuevamente.');
        calculateStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [navigate, user, calculateStats]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
        </div>
        <p className="loading-message">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
        </div>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-actions">
          <button className="action-button primary" onClick={() => setActiveTab('tasks')}>
            Tareas
          </button>
          <button className="action-button secondary" onClick={() => setActiveTab('calendar')}>
            Calendario
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total de Tareas</h3>
          <div className="value">{stats.totalTasks}</div>
        </div>
        <div className="stat-card">
          <h3>Tareas Completadas</h3>
          <div className="value">{stats.completedTasks}</div>
        </div>
        <div className="stat-card">
          <h3>Tareas Pendientes</h3>
          <div className="value">{stats.pendingTasks}</div>
        </div>
        <div className="stat-card">
          <h3>En Progreso</h3>
          <div className="value">{stats.inProgressTasks}</div>
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <>
          <div className="filter-section">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completadas</option>
            </select>
          </div>

          <div className="task-list">
            {allTasks.filter(task => {
              const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   task.description.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
              return matchesSearch && matchesStatus;
            }).length > 0 ? (
              allTasks.filter(task => {
                const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     task.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
                return matchesSearch && matchesStatus;
              }).map(task => (
                <div key={task.id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span className={`status ${task.status}`}>
                    {task.status === 'pending' ? 'Pendiente' :
                     task.status === 'in_progress' ? 'En progreso' : 'Completada'}
                  </span>
                  {task.User && (
                    <p className="user-info">
                      <strong>Creado por:</strong> {task.User.username} ({task.User.email})
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="error-message">No hay tareas que coincidan con los filtros.</p>
            )}
          </div>
        </>
      ) : (
        <CalendarView tasks={allTasks} />
      )}
    </div>
  );
}

export default AdminDashboard;
