// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Error en la petición:', error);
    if (error.message === 'Network Error') {
      throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servidor esté corriendo.');
    }
    throw error.response?.data?.message || error.message;
  }
);

// Autenticación
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

// Perfil
export const getProfile = () => {
  return api.get('/auth/me');
};

// Tareas
export const getTasks = () => {
  return api.get('/tasks');
};

export const createTask = (taskData) => {
  return api.post('/tasks', taskData);
};

export const updateTask = (taskId, taskData) => {
  return api.put(`/tasks/${taskId}`, taskData);
};

export const deleteTask = (taskId) => {
  return api.delete(`/tasks/${taskId}`);
};

export const updateProfile = (profileData) => {
  return api.put('/profile', profileData);
};

export default api;
