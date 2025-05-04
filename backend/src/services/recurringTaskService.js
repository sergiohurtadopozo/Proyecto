const { Task } = require('../models');
const moment = require('moment');

class RecurringTaskService {
    async generateRecurringTasks() {
        try {
            const recurringTasks = await Task.findAll({
                where: {
                    isRecurring: true,
                    status: 'active'
                }
            });

            const generatedTasks = [];

            for (const task of recurringTasks) {
                const lastInstance = await Task.findOne({
                    where: {
                        parentTaskId: task.id
                    },
                    order: [['dueDate', 'DESC']]
                });

                const nextDueDate = this.calculateNextDueDate(task, lastInstance);
                
                if (nextDueDate && nextDueDate.isAfter(moment())) {
                    const newTask = await Task.create({
                        title: task.title,
                        description: task.description,
                        dueDate: nextDueDate.toDate(),
                        priority: task.priority,
                        status: 'pending',
                        userId: task.userId,
                        parentTaskId: task.id,
                        isRecurring: false
                    });

                    generatedTasks.push(newTask);
                }
            }

            return {
                success: true,
                message: 'Tareas recurrentes generadas exitosamente',
                tasks: generatedTasks
            };
        } catch (error) {
            console.error('Error in generateRecurringTasks:', error);
            throw error;
        }
    }

    calculateNextDueDate(task, lastInstance) {
        const now = moment();
        let nextDate;

        if (lastInstance) {
            nextDate = moment(lastInstance.dueDate);
        } else {
            nextDate = moment(task.dueDate);
        }

        switch (task.recurrenceType) {
            case 'daily':
                nextDate.add(1, 'day');
                break;
            case 'weekly':
                nextDate.add(1, 'week');
                break;
            case 'monthly':
                nextDate.add(1, 'month');
                break;
            case 'yearly':
                nextDate.add(1, 'year');
                break;
            default:
                return null;
        }

        return nextDate;
    }
}

module.exports = RecurringTaskService; 