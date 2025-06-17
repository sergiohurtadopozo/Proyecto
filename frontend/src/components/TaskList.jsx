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

  // Combinar tareas normales y compartidas
  const allTasks = Array.isArray(tasks) ? tasks : [];
  const allSharedTasks = Array.isArray(sharedTasks) ? sharedTasks : [];
  const combinedTasks = showSharedTasks ? allSharedTasks : allTasks;
  
  // Agregar información de compartido a las tareas que han sido compartidas
  allSharedTasks.forEach(sharedTask => {
    const taskIndex = allTasks.findIndex(task => task.id === sharedTask.Task.id);
    if (taskIndex !== -1) {
      allTasks[taskIndex] = {
        ...allTasks[taskIndex],
        isShared: true,
        sharedWith: sharedTask.Task.User
      };
    }
  });

  // Si estamos en modo "ver tareas compartidas", mostrar solo las tareas compartidas con el usuario
  const currentTasks = showSharedTasks 
    ? allSharedTasks.map(st => ({
        ...st.Task,
        sharedTaskId: st.id,
        sharedWith: st.Task.User
      }))
    : allTasks;

  if (!loading && (!combinedTasks || combinedTasks.length === 0)) {
    return <div className="no-tasks-message">No hay tareas para mostrar.</div>;
  }

  return (
    <div className="task-list">
      {currentTasks.length === 0 ? (
        <div className="no-tasks">
          {showSharedTasks 
            ? 'No tienes tareas compartidas contigo'
            : 'No tienes tareas pendientes'}
        </div>
      ) : (
        currentTasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task}
            isShared={showSharedTasks}
            onTaskChange={onTaskChange}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
