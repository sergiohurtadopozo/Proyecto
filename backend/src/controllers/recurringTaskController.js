const RecurringTaskService = require('../services/recurringTaskService');

class RecurringTaskController {
    static async generateRecurringTasks(req, res) {
        try {
            const service = new RecurringTaskService();
            const result = await service.generateRecurringTasks();
            res.json(result);
        } catch (error) {
            console.error('Error generating recurring tasks:', error);
            res.status(500).json({ error: 'Error al generar tareas recurrentes' });
        }
    }

    static async getRecurringTasks(req, res) {
        try {
            const { userId } = req.params;
            const tasks = await Task.findAll({
                where: {
                    userId,
                    isRecurring: true
                },
                include: [{
                    model: Task,
                    as: 'recurringInstances',
                    where: {
                        status: {
                            [Op.ne]: 'completed'
                        }
                    },
                    required: false
                }]
            });
            res.json(tasks);
        } catch (error) {
            console.error('Error getting recurring tasks:', error);
            res.status(500).json({ error: 'Error al obtener tareas recurrentes' });
        }
    }
}

module.exports = RecurringTaskController; 