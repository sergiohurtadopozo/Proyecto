const express = require('express');
const router = express.Router();
const sharedTaskController = require('../controllers/sharedTaskController');
const { authenticate } = require('../middleware/auth');

// Compartir una tarea
router.post('/:taskId/share', authenticate, sharedTaskController.shareTask);

// Responder a una solicitud de compartir
router.put('/:shareId/respond', authenticate, sharedTaskController.respondToShareRequest);

// Obtener tareas compartidas con el usuario
router.get('/shared', authenticate, sharedTaskController.getSharedTasks);

// Obtener solicitudes pendientes
router.get('/pending', authenticate, sharedTaskController.getPendingRequests);

// Eliminar relación de tarea compartida
router.delete('/shared/:sharedTaskId', authenticate, sharedTaskController.deleteSharedTask);

module.exports = router; 