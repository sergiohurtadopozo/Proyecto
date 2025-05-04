import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Configurar axios para incluir el token en todas las peticiones
axios.interceptors.request.use(
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

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo eliminar el token si el error es específicamente de autenticación
      if (error.response.data?.error?.includes('Token')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Respuesta de autenticación inválida');
      }

      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al iniciar sesión');
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Respuesta de registro inválida');
      }

      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al registrar usuario');
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(`${API_URL}/auth/me`);
      const user = response.data;
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        throw new Error('Sesión expirada');
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export { authService }; 