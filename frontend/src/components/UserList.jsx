import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import '../estilos/AdminDashboard.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser(null);
        setUserTasks([]);
      }
    } catch {
      alert('Error al eliminar usuario');
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    setError('');
    try {
      // Filtrar tareas por usuario usando tasks/all
      const allTasks = await taskService.getAllTasks();
      setUserTasks(allTasks.filter(t => t.User && t.User.id === user.id));
    } catch {
      setError('Error al cargar tareas del usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users-section">
      <h2>Gestión de Usuarios</h2>
      {error && <div className="error-message">{error}</div>}
      {loading && <div>Cargando...</div>}
      <div className="admin-users-table-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="admin-btn admin-btn-view" onClick={() => handleViewUser(u)}>Ver tareas</button>
                  <button className="admin-btn admin-btn-delete" onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <div className="admin-user-tasks-modal">
          <div className="admin-user-tasks-content">
            <h3>Tareas de {selectedUser.username}</h3>
            {userTasks.length === 0 ? (
              <p>No tiene tareas.</p>
            ) : (
              <ul className="admin-user-tasks-list">
                {userTasks.map(task => (
                  <li key={task.id} className="admin-user-task-item">
                    <strong>{task.title}</strong> <span className={`status ${task.status}`}>{task.status}</span> <span className="admin-user-task-date">{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
            <button className="admin-btn admin-btn-close" onClick={() => setSelectedUser(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList; 