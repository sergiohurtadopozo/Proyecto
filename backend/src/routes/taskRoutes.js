const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

// Rutas para tareas
router.post('/', authenticate, taskController.createTask);
router.get('/', authenticate, taskController.getUserTasks);
router.get('/status/:status', authenticate, taskController.getTasksByStatus);
router.get('/upcoming', authenticate, taskController.getUpcomingTasks);
router.put('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);

// Rutas para tareas compartidas
router.get('/shared', authenticate, taskController.getSharedTasks);
router.get('/pending', authenticate, taskController.getPendingRequests);
router.post('/:id/share', authenticate, taskController.shareTask);
router.put('/:id/respond', authenticate, taskController.respondToShareRequest);

module.exports = router; 