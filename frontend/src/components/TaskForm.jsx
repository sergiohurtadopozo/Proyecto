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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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

  return (
    <div className="task-form-container">
      <div className="task-form-close">
        <button className="close-btn" onClick={onClose} type="button">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <h2>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={error && error !== 'fecha' ? 'error' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={error && error !== 'fecha' ? 'error' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Prioridad:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={error && error !== 'fecha' ? 'error' : ''}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={error && error !== 'fecha' ? 'error' : ''}
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Fecha límite:</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className={error === 'fecha' ? 'error' : ''}
          />
        </div>
        {error === 'fecha' && (
          <div className="error-message">No puedes crear una tarea con fecha anterior a hoy.</div>
        )}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : (task ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
