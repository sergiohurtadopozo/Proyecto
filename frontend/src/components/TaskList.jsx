// src/components/TaskList.jsx
import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import '../estilos/TaskList.css';

const TaskList = ({ showSharedTasks, onTaskChange }) => {
  const { tasks, sharedTasks, loading, error } = useTasks();

  if (loading) {
    return <div className="loading">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const currentTasks = showSharedTasks ? sharedTasks : tasks;

  return (
    <div className="task-list">
      {currentTasks.length === 0 ? (
        <div className="no-tasks">
          {showSharedTasks 
            ? 'No tienes tareas compartidas contigo'
            : 'No tienes tareas pendientes'}
        </div>
      ) : (
        currentTasks.map(task => {
          // Si es tarea compartida, desanidar la información
          const isShared = showSharedTasks;
          const taskData = isShared && task.Task ? {
            ...task.Task,
            sharedTaskId: task.id, // id de la relación SharedTask
            sharedWith: task.Task.User, // usuario dueño
          } : task;
          return (
            <TaskItem 
              key={isShared ? `shared-${task.id}` : task.id} 
              task={taskData}
              isShared={isShared}
              onTaskChange={onTaskChange}
            />
          );
        })
      )}
    </div>
  );
};

export default TaskList;
