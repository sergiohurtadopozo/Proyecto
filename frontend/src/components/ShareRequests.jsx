import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import '../estilos/ShareRequests.css';

const ShareRequests = ({ onRequestResponded }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await taskService.getPendingRequests();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar las solicitudes');
      setLoading(false);
    }
  };

  const handleResponse = async (shareId, accept) => {
    try {
      await taskService.respondToShareRequest(shareId, accept);
      fetchRequests();
      if (onRequestResponded) {
        onRequestResponded();
      }
    } catch (error) {
      setError('Error al responder a la solicitud');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No hay solicitudes pendientes
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {request.Task?.title || 'Tarea sin título'}
              </h3>
              <p className="text-sm text-gray-500">
                Compartida por: {request.Task?.User?.email || 'Usuario desconocido'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleResponse(request.id, true)}
                className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleResponse(request.id, false)}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {request.Task?.description || 'Sin descripción'}
          </p>
          {request.Task?.dueDate && (
            <div className="mt-2 text-sm text-gray-500">
              Fecha límite: {new Date(request.Task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShareRequests; 