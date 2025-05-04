const { SharedTask, User, Task } = require('../models');
const { Op } = require('sequelize');

// Compartir una tarea con otro usuario
exports.shareTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { email } = req.body;
        const ownerId = req.user.id;

        if (!email) {
            return res.status(400).json({ message: 'El email es requerido' });
        }

        // Verificar que la tarea existe y pertenece al usuario
        const task = await Task.findOne({
            where: { id: taskId, userId: ownerId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Buscar el usuario con el que se quiere compartir
        const sharedWithUser = await User.findOne({ where: { email } });
        if (!sharedWithUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que no se comparta consigo mismo
        if (sharedWithUser.id === ownerId) {
            return res.status(400).json({ message: 'No puedes compartir una tarea contigo mismo' });
        }

        // Verificar que no exista ya una solicitud pendiente o aceptada
        const existingShare = await SharedTask.findOne({
            where: {
                taskId,
                sharedWithId: sharedWithUser.id,
                status: {
                    [Op.in]: ['pending', 'accepted']
                }
            }
        });

        if (existingShare) {
            return res.status(400).json({ 
                message: existingShare.status === 'pending' 
                    ? 'Ya existe una solicitud pendiente para esta tarea' 
                    : 'Esta tarea ya está compartida con este usuario'
            });
        }

        // Crear la solicitud de compartir
        const sharedTask = await SharedTask.create({
            taskId,
            ownerId,
            sharedWithId: sharedWithUser.id,
            status: 'pending'
        });

        res.status(201).json({
            message: 'Solicitud de compartir tarea enviada',
            sharedTask
        });
    } catch (error) {
        console.error('Error al compartir tarea:', error);
        res.status(500).json({ message: 'Error al compartir la tarea' });
    }
};

// Responder a una solicitud de compartir tarea
exports.respondToShareRequest = async (req, res) => {
    try {
        const { shareId } = req.params;
        const { accept } = req.body;
        const userId = req.user.id;

        if (typeof accept !== 'boolean') {
            return res.status(400).json({ message: 'El valor de accept debe ser true o false' });
        }

        const sharedTask = await SharedTask.findOne({
            where: {
                id: shareId,
                sharedWithId: userId,
                status: 'pending'
            },
            include: [{
                model: Task,
                include: [{
                    model: User,
                    attributes: ['username', 'email']
                }]
            }]
        });

        if (!sharedTask) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        sharedTask.status = accept ? 'accepted' : 'rejected';
        sharedTask.respondedAt = new Date();
        await sharedTask.save();

        res.json({
            message: accept ? 'Tarea aceptada' : 'Tarea rechazada',
            sharedTask
        });
    } catch (error) {
        console.error('Error al responder a la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

// Obtener tareas compartidas con el usuario
exports.getSharedTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const sharedTasks = await SharedTask.findAll({
            where: {
                sharedWithId: userId,
                status: 'accepted'
            },
            include: [{
                model: Task,
                include: [{
                    model: User,
                    attributes: ['username', 'email']
                }]
            }]
        });

        res.json(sharedTasks);
    } catch (error) {
        console.error('Error al obtener tareas compartidas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas compartidas' });
    }
};

// Obtener solicitudes pendientes
exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const pendingRequests = await SharedTask.findAll({
            where: {
                sharedWithId: userId,
                status: 'pending'
            },
            include: [{
                model: Task,
                include: [{
                    model: User,
                    attributes: ['username', 'email']
                }]
            }]
        });

        res.json(pendingRequests);
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las solicitudes pendientes' });
    }
};

// Eliminar relación de tarea compartida
exports.deleteSharedTask = async (req, res) => {
    try {
        const { sharedTaskId } = req.params;
        const userId = req.user.id;

        const sharedTask = await SharedTask.findOne({
            where: {
                id: sharedTaskId,
                sharedWithId: userId
            }
        });

        if (!sharedTask) {
            return res.status(404).json({ message: 'Relación de tarea compartida no encontrada' });
        }

        await sharedTask.destroy();
        res.json({ message: 'Tarea compartida eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea compartida:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea compartida' });
    }
}; 