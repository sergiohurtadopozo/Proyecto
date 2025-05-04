const express = require('express');
const router = express.Router();
const RecurringTaskController = require('../controllers/recurringTaskController');
const { authenticateToken } = require('../middleware/auth');

// Ruta para generar tareas recurrentes
router.post('/generate', authenticateToken, RecurringTaskController.generateRecurringTasks);

// Ruta para obtener tareas recurrentes de un usuario
router.get('/user/:userId', authenticateToken, RecurringTaskController.getRecurringTasks);

module.exports = router; 