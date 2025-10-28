import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from 'lucide-react';
import {
  CalendarEvent,
  generateCalendarMonth,
  getMonthName,
  getDayNames,
  getEventColor,
  getEventIcon,
  formatTime,
  getEventDuration,
  getNextMonth,
  getPrevMonth,
  isToday,
  isWeekend,
  getTodayEvents,
  sortEventsByTime
} from '../../utils/calendarUtils';

interface CalendarComponentProps {
  events: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
  selectedDate?: Date;
  view?: 'month' | 'week' | 'day';
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onDateSelect,
  onEventClick,
  onAddEvent,
  selectedDate,
  view = 'month'
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Генеруємо календар для поточного місяця
  const calendarData = useMemo(() => {
    return generateCalendarMonth(currentYear, currentMonth, events);
  }, [currentYear, currentMonth, events]);

  // Отримуємо події на сьогодні
  const todayEvents = useMemo(() => {
    return getTodayEvents(events);
  }, [events]);

  // Навігація по місяцях
  const goToPrevMonth = () => {
    const { year, month } = getPrevMonth(currentYear, currentMonth);
    setCurrentDate(new Date(year, month, 1));
  };

  const goToNextMonth = () => {
    const { year, month } = getNextMonth(currentYear, currentMonth);
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Обробка кліку по даті
  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  // Обробка кліку по події
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  // Обробка додавання події
  const handleAddEvent = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddEvent?.(date);
  };

  // Отримання класів для дня календаря
  const getDayClasses = (day: any) => {
    const classes = ['calendar-day'];
    
    if (!day.isCurrentMonth) {
      classes.push('calendar-day-other-month');
    }
    
    if (day.isToday) {
      classes.push('calendar-day-today');
    }
    
    if (day.isSelected) {
      classes.push('calendar-day-selected');
    }
    
    if (day.isWeekend) {
      classes.push('calendar-day-weekend');
    }
    
    if (day.events.length > 0) {
      classes.push('calendar-day-has-events');
    }
    
    if (hoveredDate && day.date.getTime() === hoveredDate.getTime()) {
      classes.push('calendar-day-hovered');
    }
    
    return classes.join(' ');
  };

  // Отримання стилів для події
  const getEventStyle = (event: CalendarEvent) => {
    return {
      backgroundColor: getEventColor(event.type),
      borderLeft: `3px solid ${getEventColor(event.type)}`
    };
  };

  return (
    <div className="calendar-component">
      {/* Заголовок календаря */}
      <div className="calendar-header">
        <div className="calendar-header-left">
          <h2 className="calendar-title">Календар</h2>
          <div className="calendar-navigation">
            <button 
              className="calendar-nav-btn" 
              onClick={goToPrevMonth}
              aria-label="Попередній місяць"
            >
              <ChevronLeft className="icon" />
            </button>
            <h3 className="calendar-month-year">
              {getMonthName(currentMonth)} {currentYear}
            </h3>
            <button 
              className="calendar-nav-btn" 
              onClick={goToNextMonth}
              aria-label="Наступний місяць"
            >
              <ChevronRight className="icon" />
            </button>
          </div>
        </div>
        
        <div className="calendar-header-right">
          <button className="btn btn-secondary" onClick={goToToday}>
            Сьогодні
          </button>
          <button className="btn btn-primary">
            <Plus className="icon" />
            Додати подію
          </button>
        </div>
      </div>

      {/* Сітка календаря */}
      <div className="calendar-grid">
        {/* Заголовки днів тижня */}
        <div className="calendar-week-header">
          {getDayNames().map((dayName, index) => (
            <div key={index} className="calendar-day-header">
              {dayName}
            </div>
          ))}
        </div>

        {/* Дні календаря */}
        <div className="calendar-weeks">
          {calendarData.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {week.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={getDayClasses(day)}
                  onClick={() => handleDateClick(day.date)}
                  onMouseEnter={() => setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div className="calendar-day-number">
                    {day.date.getDate()}
                  </div>
                  
                  {/* Події на цей день */}
                  <div className="calendar-day-events">
                    {day.events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="calendar-day-event"
                        style={getEventStyle(event)}
                        onClick={(e) => handleEventClick(event, e)}
                        title={`${event.title} - ${formatTime(new Date(event.startDate))}`}
                      >
                        <span className="calendar-event-icon">
                          {getEventIcon(event.type)}
                        </span>
                        <span className="calendar-event-title">
                          {event.title}
                        </span>
                        <span className="calendar-event-time">
                          {formatTime(new Date(event.startDate))}
                        </span>
                      </div>
                    ))}
                    
                    {day.events.length > 3 && (
                      <div className="calendar-day-more-events">
                        +{day.events.length - 3} ще
                      </div>
                    )}
                  </div>
                  
                  {/* Кнопка додавання події */}
                  <button
                    className="calendar-day-add-btn"
                    onClick={(e) => handleAddEvent(day.date, e)}
                    title="Додати подію"
                  >
                    <Plus className="icon" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Панель подій на сьогодні */}
      {todayEvents.length > 0 && (
        <div className="calendar-today-events">
          <h3 className="calendar-today-title">Події сьогодні</h3>
          <div className="calendar-today-list">
            {sortEventsByTime(todayEvents).map((event) => (
              <div
                key={event.id}
                className="calendar-today-event"
                style={getEventStyle(event)}
                onClick={() => onEventClick?.(event)}
              >
                <div className="calendar-today-event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="calendar-today-event-content">
                  <h4 className="calendar-today-event-title">
                    {event.title}
                  </h4>
                  <p className="calendar-today-event-time">
                    {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                    <span className="calendar-today-event-duration">
                      ({getEventDuration(event)})
                    </span>
                  </p>
                  {event.candidateName && (
                    <p className="calendar-today-event-candidate">
                      Кандидат: {event.candidateName}
                      {event.position && ` • ${event.position}`}
                    </p>
                  )}
                  {event.participants && event.participants.length > 0 && (
                    <p className="calendar-today-event-participants">
                      Учасники: {event.participants.join(', ')}
                    </p>
                  )}
                </div>
                <div className="calendar-today-event-actions">
                  <button className="calendar-today-event-action-btn">
                    <MoreHorizontal className="icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
