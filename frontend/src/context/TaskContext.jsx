import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sharedTasks, setSharedTasks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [userTasks, sharedTasksData, pendingRequestsData] = await Promise.all([
        taskService.getTasks().catch(() => []),
        taskService.getSharedTasks().catch(() => []),
        taskService.getPendingRequests().catch(() => [])
      ]);
      setTasks(Array.isArray(userTasks) ? userTasks : []);
      setSharedTasks(Array.isArray(sharedTasksData) ? sharedTasksData : []);
      setPendingRequests(Array.isArray(pendingRequestsData) ? pendingRequestsData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar las tareas');
      setTasks([]);
      setSharedTasks([]);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchTasks();
    }
    // Solo depende de user.id para evitar bucles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addTask = async (taskData) => {
    const originalTasks = [...tasks];
    try {
      setError(null);
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setTasks(originalTasks);
      setError(err.message || 'Error al crear la tarea');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    const originalTasks = [...tasks];
    try {
      setError(null);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...taskData, isLoading: true } : task
      ));

      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...updatedTask, isLoading: false } : task
      ));
      return updatedTask;
    } catch (err) {
      setTasks(originalTasks);
      setError(err.message || 'Error al actualizar la tarea');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    const originalTasks = [...tasks];
    try {
      setError(null);
      setTasks(prev => prev.filter(task => task.id !== id));
      await taskService.deleteTask(id);
    } catch (err) {
      setTasks(originalTasks);
      setError(err.message || 'Error al eliminar la tarea');
      throw err;
    }
  };

  const shareTask = async (taskId, email) => {
    try {
      setError(null);
      await taskService.shareTask(taskId, email);
      // Actualizar inmediatamente las solicitudes pendientes
      const pending = await taskService.getPendingRequests();
      setPendingRequests(pending);
      // Intentar actualizar la tarea compartida en la lista de tareas, pero ignorar error 404
      try {
        const updatedTask = await taskService.getTaskById(taskId);
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, ...updatedTask } : task
        ));
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No hacer nada si la tarea no existe
        } else {
          throw err;
        }
      }
    } catch (err) {
      setError(err.message || 'Error al compartir la tarea');
      throw err;
    }
  };

  const respondToShareRequest = async (shareId, accept) => {
    try {
      setError(null);
      await taskService.respondToShareRequest(shareId, accept);
      // Actualizar inmediatamente las solicitudes pendientes
      const pending = await taskService.getPendingRequests();
      setPendingRequests(pending);
      
      // Si se aceptó la solicitud, actualizar las tareas compartidas
      if (accept) {
        const [userTasks, sharedTasksData] = await Promise.all([
          taskService.getTasks(),
          taskService.getSharedTasks()
        ]);
        setTasks(userTasks);
        setSharedTasks(sharedTasksData);
      }
    } catch (err) {
      setError(err.message || 'Error al responder a la solicitud');
      throw err;
    }
  };

  const deleteSharedTask = async (sharedTaskId) => {
    try {
      setError(null);
      await taskService.deleteSharedTask(sharedTaskId);
      // Actualizar inmediatamente las tareas compartidas
      const [userTasks, sharedTasksData] = await Promise.all([
        taskService.getTasks(),
        taskService.getSharedTasks()
      ]);
      setTasks(userTasks);
      setSharedTasks(sharedTasksData);
    } catch (err) {
      setError(err.message || 'Error al eliminar la tarea compartida');
      throw err;
    }
  };

  const value = {
    tasks,
    sharedTasks,
    pendingRequests,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    shareTask,
    respondToShareRequest,
    deleteSharedTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext; 