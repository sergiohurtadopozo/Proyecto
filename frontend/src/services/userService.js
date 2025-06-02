import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');
  return { Authorization: `Bearer ${token}` };
};

export const userService = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/auth/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}; 