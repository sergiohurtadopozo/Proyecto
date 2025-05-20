import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    return { Authorization: `Bearer ${token}` };
};

const taskService = {
    // Obtener todas las tareas
    getTasks: async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al obtener las tareas');
        }
    },

    // Crear una nueva tarea
    createTask: async (taskData) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, taskData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al crear la tarea');
        }
    },

    // Actualizar una tarea
    updateTask: async (id, taskData) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al actualizar la tarea');
        }
    },

    // Eliminar una tarea
    deleteTask: async (id) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: getAuthHeader()
            });
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al eliminar la tarea');
        }
    },

    // Obtener una tarea por ID
    getTaskById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tasks/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al obtener la tarea');
        }
    },

    // Compartir una tarea
    shareTask: async (taskId, email) => {
        try {
            const response = await axios.post(`${API_URL}/tasks/${taskId}/share`, { email }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al compartir la tarea');
        }
    },

    // Responder a una solicitud de compartir
    respondToShareRequest: async (shareId, accept) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${shareId}/respond`, { accept }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al responder a la solicitud');
        }
    },

    // Obtener tareas compartidas
    getSharedTasks: async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks/shared`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al obtener las tareas compartidas');
        }
    },

    // Obtener solicitudes pendientes
    getPendingRequests: async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks/pending`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al obtener las solicitudes pendientes');
        }
    },

    // Eliminar una tarea compartida
    deleteSharedTask: async (sharedTaskId) => {
        try {
            await axios.delete(`${API_URL}/tasks/shared/${sharedTaskId}`, {
                headers: getAuthHeader()
            });
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al eliminar la tarea compartida');
        }
    },

    // Obtener todas las tareas (solo admin)
    getAllTasks: async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks/all`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al obtener todas las tareas');
        }
    }
};

export { taskService }; 