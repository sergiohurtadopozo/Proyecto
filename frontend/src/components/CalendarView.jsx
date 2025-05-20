// src/components/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { getTasks, updateTask } from '../api';
import { useTasks } from '../context/TaskContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../estilos/CalendarView.css';

function CalendarView({ tasks: propTasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSharedTasks, setShowSharedTasks] = useState(false);
  const { tasks, sharedTasks, fetchTasks, loading, error } = useTasks();

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

  // Si se pasan tasks por props (modo admin), solo mostrar esas tareas
  // Si no, permitir alternar entre tareas propias y compartidas
  const calendarTasks = propTasks
    ? propTasks
    : (showSharedTasks ? sharedTasks.map(st => st.Task) : tasks);

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

  const getTasksForDate = (date) => {
    return calendarTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const hasTasks = (date) => getTasksForDate(date).length > 0;

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
            <span className="day-tasks">
              {tasksForDay.length}
            </span>
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
        {/* Solo mostrar el botón de tareas compartidas si NO es admin (no hay propTasks) */}
        {!propTasks && (
          <button
            className="btn-secondary"
            style={{ marginLeft: '1rem' }}
            onClick={() => setShowSharedTasks((prev) => !prev)}
          >
            {showSharedTasks ? 'Ver Mis Tareas' : 'Ver Tareas Compartidas'}
          </button>
        )}
      </div>
      <div className="calendar-grid">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
}

export default CalendarView;
