// backend/src/routes/tasks.js
const express = require('express');
const { Task, User, SharedTask } = require('../models');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Validación de datos de entrada
const validateTaskData = (data) => {
  const errors = [];
  if (!data.title || data.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }
  if (data.status && !['pending', 'completed'].includes(data.status)) {
    errors.push('El estado debe ser "pending" o "completed"');
  }
  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    errors.push('La fecha de vencimiento no es válida');
  }
  return errors;
};

// Obtener todas las tareas del usuario
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
});

// Obtener tareas compartidas
router.get('/shared', authenticate, async (req, res) => {
  try {
    const sharedTasks = await SharedTask.findAll({
      where: {
        sharedWithId: req.user.id,
        status: 'accepted'
      },
      include: [
        {
          model: Task,
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'email']
            }
          ]
        }
      ]
    });
    res.json(sharedTasks);
  } catch (error) {
    console.error('Error al obtener tareas compartidas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas compartidas' });
  }
});

// Crear una nueva tarea
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
});

// Actualizar una tarea
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
    }
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});

// Eliminar una tarea
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta tarea' });
    }
    await task.destroy();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
});

// Obtener todas las tareas (solo admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener todas las tareas:', error);
    res.status(500).json({ message: 'Error al obtener todas las tareas' });
  }
});

module.exports = router;