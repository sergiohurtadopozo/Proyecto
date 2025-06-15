// src/components/TaskItem.jsx
import React, { useState } from 'react';
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

  const isOwner = task.userId === user?.id;

  const handleStatusChange = async (e) => {
    try {
      await updateTask(task.id, { ...task, status: e.target.value });
      onTaskChange();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      setError('Error al actualizar el estado');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTask(task.id);
        onTaskChange();
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        setError('Error al eliminar la tarea');
      }
    }
  };

  const handleDeleteShared = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea compartida?')) {
      try {
        await deleteSharedTask(task.sharedTaskId || task.id);
        onTaskChange();
      } catch (error) {
        setError('Error al eliminar la tarea compartida');
      }
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setShareError('');
    setShareSuccess('');

    if (!shareEmail) {
      setShareError('Por favor, ingresa un email válido');
      return;
    }

    try {
      await shareTask(task.id, shareEmail);
      setShareSuccess('Solicitud de compartir enviada correctamente');
      setShareEmail('');
      setSharing(false);
      onTaskChange();
    } catch (error) {
      setShareError(error.message || 'Error al compartir la tarea');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        dueDate: task.dueDate,
        priority: task.priority
      });
      setEditing(false);
      onTaskChange();
      setError('');
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError('Error al actualizar la tarea. Por favor, intenta de nuevo.');
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
    <div className="task-item">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          {isOwner && (
            <>
              <button
                onClick={() => setSharing(true)}
                className="btn-share"
                title="Compartir tarea"
              >
                Compartir
              </button>
              <button
                onClick={() => setEditing(true)}
                className="btn-edit"
                title="Editar tarea"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="btn-delete"
                title="Eliminar tarea"
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
          <span className={`status-badge status-${task.status || 'pending'}`}> 
            {task.status === 'pending' ? 'Pendiente' :
             task.status === 'in_progress' ? 'En Progreso' :
             task.status === 'completed' ? 'Completada' : 'Pendiente'}
          </span>
        </div>

        {task.sharedWith && (
          <div className="task-detail">
            <span className="detail-label">Compartida con:</span>
            <span className="detail-value">
              {task.sharedWith.email}
            </span>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {editing && (
        <form onSubmit={handleEditSubmit} className="task-form-edit">
          <h4>✏️ Editar Tarea</h4>
          
          <div className="form-group">
            <label htmlFor="edit-title">Título</label>
            <input
              id="edit-title"
              type="text"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              placeholder="Ingresa el título de la tarea"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Descripción</label>
            <textarea
              id="edit-description"
              value={editedDescription}
              onChange={e => setEditedDescription(e.target.value)}
              placeholder="Describe los detalles de la tarea"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-status">Estado</label>
            <select
              id="edit-status"
              value={editedStatus}
              onChange={e => setEditedStatus(e.target.value)}
              className="form-select"
              style={{ borderColor: getStatusColor(editedStatus) }}
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setEditing(false)} className="btn-cancel">
              <span>✕</span> Cancelar
            </button>
            <button type="submit" className="btn-save">
              <span>💾</span> Guardar Cambios
            </button>
          </div>
        </form>
      )}

      {sharing && (
        <form onSubmit={handleShare} className="share-form">
          <input
            type="email"
            value={shareEmail}
            onChange={e => setShareEmail(e.target.value)}
            placeholder="Email del usuario"
            required
            className="form-input"
          />
          {shareError && <p className="error-message">{shareError}</p>}
          {shareSuccess && <p className="success-message">{shareSuccess}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-share">Compartir</button>
            <button type="button" onClick={() => setSharing(false)} className="btn-cancel">Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskItem;
