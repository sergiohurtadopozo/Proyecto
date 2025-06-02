import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';

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
    <div>
      <h2>Usuarios</h2>
      {error && <div className="error-message">{error}</div>}
      {loading && <div>Cargando...</div>}
      <table style={{ width: '100%', marginBottom: '2rem' }}>
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
                <button onClick={() => handleViewUser(u)}>Ver tareas</button>
                <button onClick={() => handleDeleteUser(u.id)} style={{ color: 'red', marginLeft: 8 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
          <h3>Tareas de {selectedUser.username}</h3>
          {userTasks.length === 0 ? (
            <p>No tiene tareas.</p>
          ) : (
            <ul>
              {userTasks.map(task => (
                <li key={task.id}>
                  <strong>{task.title}</strong> - {task.status} - {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setSelectedUser(null)} style={{ marginTop: 8 }}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default UserList; 