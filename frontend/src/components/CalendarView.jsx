// src/components/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { getTasks, updateTask } from '../api';
import { useTasks } from '../context/TaskContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../estilos/CalendarView.css';

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const { tasks, fetchTasks, loading, error } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      // Aquí deberías usar updateTask del contexto si lo tienes disponible
      // await updateTask(taskId, { status: newStatus });
      // Por ahora, solo recargamos las tareas
      await fetchTasks();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevDate = new Date(date.getFullYear(), date.getMonth(), -i);
      days.push(prevDate);
    }
    return days;
  };

  const getNextMonthDays = (date) => {
    const totalDays = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const remainingDays = 42 - (totalDays + firstDay);
    const days = [];
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
      days.push(nextDate);
    }
    return days;
  };

  const getCurrentMonthDays = (date) => {
    const totalDays = getDaysInMonth(date);
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const hasTasks = (date) => {
    return tasks.some(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const renderCalendarDays = () => {
    const prevDays = getPreviousMonthDays(currentDate);
    const currentDays = getCurrentMonthDays(currentDate);
    const nextDays = getNextMonthDays(currentDate);
    const allDays = [...prevDays, ...currentDays, ...nextDays];

    return allDays.map((date, index) => {
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const dayClasses = [
        'calendar-day',
        isToday(date) ? 'today' : '',
        hasTasks(date) ? 'has-tasks' : '',
        !isCurrentMonth ? 'other-month' : ''
      ].filter(Boolean).join(' ');
      const tasksForDay = getTasksForDate(date);

      return (
        <div
          key={index}
          className={dayClasses}
          onClick={() => handleDateClick(date)}
        >
          {date.getDate()}
          {tasksForDay.length > 0 && (
            <span className="day-tasks">{tasksForDay.length} 📌</span>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="calendar-container">
        <p className="loading-message">Cargando calendario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {currentDate.toLocaleString('es', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="calendar-nav">
          <button onClick={handlePrevMonth}>Anterior</button>
          <button onClick={handleNextMonth}>Siguiente</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <div className="task-list">
          <h3>Tareas para {selectedDate.toLocaleDateString('es')}</h3>
          {getTasksForDate(selectedDate).map(task => (
            <div key={task.id} className="task-item">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarView;
