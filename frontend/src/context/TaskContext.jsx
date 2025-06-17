import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ownTasks, shared, pending] = await Promise.all([
        taskService.getTasks(),
        taskService.getSharedTasks(),
        taskService.getPendingRequests()
      ]);
      setTasks(ownTasks);
      setSharedTasks(shared);
      setPendingRequests(pending);
    } catch (err) {
      setError(err.message || 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (taskData) => {
    const tempId = Date.now();
    try {
      setError(null);
      const tempTask = {
        ...taskData,
        id: tempId,
        isLoading: true
      };
      setTasks(prev => [...prev, tempTask]);

      const newTask = await taskService.createTask(taskData);
      setTasks(prev => prev.map(task => 
        task.id === tempId ? { ...newTask, isLoading: false } : task
      ));
      return newTask;
    } catch (err) {
      setTasks(prev => prev.filter(task => task.id !== tempId));
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
      const pending = await taskService.getPendingRequests();
      setPendingRequests(pending);
    } catch (err) {
      setError(err.message || 'Error al compartir la tarea');
      throw err;
    }
  };

  const respondToShareRequest = async (shareId, accept) => {
    try {
      setError(null);
      await taskService.respondToShareRequest(shareId, accept);
      const pending = await taskService.getPendingRequests();
      setPendingRequests(pending);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Error al responder a la solicitud');
      throw err;
    }
  };

  const deleteSharedTask = async (sharedTaskId) => {
    try {
      setError(null);
      await taskService.deleteSharedTask(sharedTaskId);
      await fetchTasks();
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