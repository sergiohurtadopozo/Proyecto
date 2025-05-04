const { Task, User, SharedTask } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Crear una nueva tarea
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, isRecurring, recurrenceType } = req.body;
        const userId = req.user.id;

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            userId,
            isRecurring,
            recurrenceType
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};

// Obtener todas las tareas del usuario
exports.getUserTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.findAll({
            where: { userId },
            order: [['dueDate', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: SharedTask,
                    include: [{
                        model: User,
                        as: 'sharedWith',
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ]
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, status, isRecurring, recurrenceType } = req.body;
        const userId = req.user.id;

        const task = await Task.findOne({
            where: { id, userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await task.update({
            title,
            description,
            dueDate,
            priority,
            status,
            isRecurring,
            recurrenceType
        });

        res.json(task);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const task = await Task.findOne({
            where: { id, userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await task.destroy();
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
};

// Obtener tareas por estado
exports.getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const userId = req.user.id;

        const tasks = await Task.findAll({
            where: { 
                userId,
                status
            },
            order: [['dueDate', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: SharedTask,
                    include: [{
                        model: User,
                        as: 'sharedWith',
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ]
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas por estado:', error);
        res.status(500).json({ message: 'Error al obtener las tareas por estado' });
    }
};

// Obtener tareas próximas a vencer
exports.getUpcomingTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = moment().startOf('day');
        const nextWeek = moment().add(7, 'days').endOf('day');

        const tasks = await Task.findAll({
            where: {
                userId,
                dueDate: {
                    [Op.between]: [today.toDate(), nextWeek.toDate()]
                },
                status: {
                    [Op.ne]: 'completed'
                }
            },
            order: [['dueDate', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: SharedTask,
                    include: [{
                        model: User,
                        as: 'sharedWith',
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ]
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas próximas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas próximas' });
    }
};

// Obtener tareas compartidas con el usuario
exports.getSharedTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const sharedTasks = await Task.findAll({
            include: [
                {
                    model: SharedTask,
                    where: {
                        sharedWithId: userId,
                        status: 'accepted'
                    },
                    include: [{
                        model: User,
                        as: 'sharedWith',
                        attributes: ['id', 'username', 'email']
                    }]
                },
                {
                    model: User,
                    attributes: ['id', 'username', 'email']
                }
            ]
        });

        res.json(sharedTasks);
    } catch (error) {
        console.error('Error al obtener las tareas compartidas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas compartidas' });
    }
};

// Obtener solicitudes pendientes de compartir
exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const pendingRequests = await SharedTask.findAll({
            where: {
                sharedWithId: userId,
                status: 'pending'
            },
            include: [
                {
                    model: Task,
                    include: [{
                        model: User,
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ]
        });

        res.json(pendingRequests);
    } catch (error) {
        console.error('Error al obtener las solicitudes pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las solicitudes pendientes' });
    }
}; 