// src/components/TaskItem.jsx
import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import '../estilos/TaskItem.css';

const TaskItem = ({ task, onTaskChange, isShared }) => {
  const { updateTask, deleteTask, shareTask, deleteSharedTask } = useTasks();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedStatus, setEditedStatus] = useState(task.status);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareError, setShareError] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const [showShareError, setShowShareError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = task.userId === user?.id;

  useEffect(() => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.status);
  }, [task]);

  const handleStatusChange = async (e) => {
    try {
      setIsLoading(true);
      await updateTask(task.id, { ...task, status: e.target.value });
      onTaskChange();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      setError('Error al actualizar el estado. Inténtalo de nuevo.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        setIsLoading(true);
        await deleteTask(task.id);
        onTaskChange();
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        setError('Error al eliminar la tarea. Inténtalo de nuevo.');
        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteShared = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea compartida?')) {
      try {
        setIsLoading(true);
        await deleteSharedTask(task.sharedTaskId || task.id);
        onTaskChange();
      } catch (error) {
        console.error('Error al eliminar la tarea compartida:', error);
        setError('Error al eliminar la tarea compartida. Inténtalo de nuevo.');
        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setShareError('');
    setShareSuccess('');
    setIsLoading(true);
    setShowShareError(false);

    if (!shareEmail) {
      setShareError('Por favor, ingresa un email válido');
      setShowShareError(true);
      setIsLoading(false);
      setTimeout(() => setShowShareError(false), 3000);
      return;
    }

    try {
      await shareTask(task.id, shareEmail);
      setShareSuccess('Solicitud de compartir enviada correctamente');
      setShareEmail('');
      setSharing(false);
      onTaskChange();
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        setShareError('El usuario no existe en el sistema');
      } else if (error.message.includes('ya compartida')) {
        setShareError('Esta tarea ya ha sido compartida con este usuario');
      } else if (error.message.includes('Sesión expirada')) {
        setShareError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión');
      } else {
        setShareError(error.message || 'Error al compartir la tarea');
      }
      setShowShareError(true);
      setTimeout(() => {
        setSharing(false);
        setShareError('');
        setShowShareError(false);
      }, 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateTask(task.id, {
        ...task,
        title: editedTitle,
        description: editedDescription,
        status: editedStatus
      });
      setEditing(false);
      onTaskChange();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      setError('Error al actualizar la tarea. Inténtalo de nuevo.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
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

  if (editing) {
    return (
      <div className="task-item editing">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="form-input"
          placeholder="Título de la tarea"
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="form-textarea"
          placeholder="Descripción de la tarea"
        />
        <select
          value={editedStatus}
          onChange={(e) => setEditedStatus(e.target.value)}
          className="form-select"
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button onClick={handleSave} className="btn-save" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={() => setEditing(false)} className="btn-cancel" disabled={isLoading}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.isShared ? 'shared' : ''} ${isLoading ? 'loading' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">
          {task.title}
          {task.isShared && <span className="shared-badge">Compartida</span>}
        </h3>
        <div className="task-actions">
          {isOwner && (
            <>
              <button
                onClick={() => setSharing(true)}
                className="btn-share"
                title="Compartir tarea"
                disabled={isLoading}
              >
                Compartir
              </button>
              <button
                onClick={() => setEditing(true)}
                className="btn-edit"
                title="Editar tarea"
                disabled={isLoading}
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="btn-delete"
                title="Eliminar tarea"
                disabled={isLoading}
              >
                Eliminar
              </button>
            </>
          )}
          {isShared && !isOwner && (
            <button
              onClick={handleDeleteShared}
              className="btn-delete"
              title="Eliminar tarea compartida"
              disabled={isLoading}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-details">
        <div className="task-detail">
          <span className="detail-label">Fecha límite:</span>
          <span className="detail-value">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
          </span>
        </div>

        <div className="task-detail">
          <span className="detail-label">Prioridad:</span>
          <span className={`priority-badge priority-${task.priority || 'medium'}`}> 
            {task.priority === 'high' ? 'Alta' :
             task.priority === 'medium' ? 'Media' :
             task.priority === 'low' ? 'Baja' : 'Media'}
          </span>
        </div>

        <div className="task-detail">
          <span className="detail-label">Estado:</span>
          <span className={`status-badge status-${task.status}`}>{
            task.status === 'pending' ? 'Pendiente' :
            task.status === 'in_progress' ? 'En progreso' :
            task.status === 'completed' ? 'Completada' : 'Desconocido'
          }</span>
        </div>

        {task.isShared && (
          <div className="task-detail">
            <span className="detail-label">Compartida con:</span>
            <span className="detail-value">
              {task.sharedWith?.email || 'Usuario desconocido'}
            </span>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {sharing && (
        <form onSubmit={handleShare} className="share-form">
          <input
            type="email"
            value={shareEmail}
            onChange={e => setShareEmail(e.target.value)}
            placeholder="Email del usuario"
            required
            className="form-input"
            disabled={isLoading}
          />
          {showShareError && shareError && (
            <div className="share-error-message">
              {shareError}
              <button type="button" className="close-error-btn" onClick={() => setShowShareError(false)}>
                ×
              </button>
            </div>
          )}
          {shareSuccess && <p className="success-message">{shareSuccess}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-share" disabled={isLoading}>
              {isLoading ? 'Compartiendo...' : 'Compartir'}
            </button>
            <button type="button" onClick={() => setSharing(false)} className="btn-cancel" disabled={isLoading}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskItem;
