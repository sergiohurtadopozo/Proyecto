// src/components/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import '../estilos/TaskForm.css';

const TaskForm = ({ task, onSubmit: onSubmitProp, onClose }) => {
  const navigate = useNavigate();
  const { addTask, updateTask } = useTasks();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    ...task
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (formData.title.length < 3) {
      setError('El título debe tener al menos 3 caracteres');
      return false;
    }
    if (formData.description && formData.description.length > 500) {
      setError('La descripción no puede tener más de 500 caracteres');
      return false;
    }
    if (!formData.dueDate) {
      setError('La fecha límite es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (!isAuthenticated) {
        throw new Error('Debe iniciar sesión para crear tareas');
      }

      // Validar que la fecha no sea anterior a hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formData.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        setError('No puedes crear una tarea con fecha anterior a hoy');
        setLoading(false);
        return;
      }

      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await addTask(taskData);
      }

      // Limpiar el formulario después de crear/actualizar
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });

      if (onSubmitProp) {
        onSubmitProp();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error al guardar la tarea:', err);
      setError(err.message);
      
      if (err.message === 'Sesión expirada' || err.message === 'No hay token de autenticación') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#d97706';
      case 'in_progress':
        return '#2563eb';
      case 'completed':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form">
        <div className="task-form-close">
          <button className="close-btn" onClick={onClose} type="button" aria-label="Cerrar formulario">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <h2>{task ? '✏️ Editar Tarea' : '✨ Nueva Tarea'}</h2>
          
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ingresa el título de la tarea"
              required
              className={error && error.includes('título') ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe los detalles de la tarea"
              rows="4"
              className={error && error.includes('descripción') ? 'error' : ''}
            />
            <small className="character-count">
              {formData.description.length}/500 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={{ borderColor: getPriorityColor(formData.priority) }}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ borderColor: getStatusColor(formData.status) }}
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Fecha límite</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className={error && error.includes('fecha') ? 'error' : ''}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Procesando...
                </>
              ) : (
                <>
                  {task ? '💾 Actualizar' : '✨ Crear'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
