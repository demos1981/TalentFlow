// Утиліти для роботи з календарем

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'interview' | 'meeting' | 'review' | 'planning' | 'reminder' | 'deadline';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  participants?: string[];
  location?: string;
  isOnline?: boolean;
  candidateId?: string;
  candidateName?: string;
  position?: string;
  color?: string;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  isWeekend: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
  events: CalendarEvent[];
}

// Отримання назв місяців українською
export const getMonthName = (month: number): string => {
  const months = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];
  return months[month];
};

// Отримання коротких назв днів тижня
export const getDayNames = (): string[] => {
  return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
};

// Перевірка чи дата є сьогодні
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Перевірка чи дата є вихідним
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Неділя, 6 = Субота
};

// Отримання першого дня місяця
export const getFirstDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month, 1);
};

// Отримання останнього дня місяця
export const getLastDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month + 1, 0);
};

// Отримання дня тижня (1-7, де 1 = Понеділок)
export const getDayOfWeek = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 7 : day; // Конвертуємо неділю з 0 в 7
};

// Генерація календаря для місяця
export const generateCalendarMonth = (year: number, month: number, events: CalendarEvent[] = []): CalendarMonth => {
  const firstDay = getFirstDayOfMonth(year, month);
  const lastDay = getLastDayOfMonth(year, month);
  const firstDayOfWeek = getDayOfWeek(firstDay);
  
  // Отримуємо дати з попереднього місяця для заповнення першого тижня
  const prevMonth = new Date(year, month - 1, 0);
  const daysFromPrevMonth = firstDayOfWeek - 1;
  
  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];
  
  // Додаємо дні з попереднього місяця
  for (let i = daysFromPrevMonth; i > 0; i--) {
    const date = new Date(year, month - 1, prevMonth.getDate() - i + 1);
    currentWeek.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: false,
      events: getEventsForDate(date, events),
      isWeekend: isWeekend(date)
    });
  }
  
  // Додаємо дні поточного місяця
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    
    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }
    
    currentWeek.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: false,
      events: getEventsForDate(date, events),
      isWeekend: isWeekend(date)
    });
  }
  
  // Додаємо дні з наступного місяця для заповнення останнього тижня
  const remainingDays = 7 - currentWeek.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    currentWeek.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: false,
      events: getEventsForDate(date, events),
      isWeekend: isWeekend(date)
    });
  }
  
  if (currentWeek.length > 0) {
    weeks.push({ days: currentWeek });
  }
  
  return {
    year,
    month,
    weeks,
    events: events.filter(event => 
      event.startDate.getMonth() === month && 
      event.startDate.getFullYear() === year
    )
  };
};

// Отримання подій для конкретної дати
export const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
  return events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.getDate() === date.getDate() &&
           eventDate.getMonth() === date.getMonth() &&
           eventDate.getFullYear() === date.getFullYear();
  });
};

// Форматування часу
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Форматування дати
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Форматування дати та часу
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Отримання кольору для типу події
export const getEventColor = (type: CalendarEvent['type']): string => {
  const colors = {
    interview: 'var(--color-primary-500)',
    meeting: 'var(--color-secondary-500)',
    review: 'var(--color-success-500)',
    planning: 'var(--color-warning-500)',
    reminder: 'var(--color-info-500)',
    deadline: 'var(--color-danger-500)'
  };
  return colors[type] || colors.meeting;
};

// Отримання іконки для типу події
export const getEventIcon = (type: CalendarEvent['type']): string => {
  const icons = {
    interview: '👥',
    meeting: '📅',
    review: '📋',
    planning: '📝',
    reminder: '⏰',
    deadline: '🚨'
  };
  return icons[type] || icons.meeting;
};

// Перевірка чи подія триває весь день
export const isAllDayEvent = (event: CalendarEvent): boolean => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return diffHours >= 24;
};

// Отримання тривалості події
export const getEventDuration = (event: CalendarEvent): string => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes}хв`;
  } else if (diffMinutes === 0) {
    return `${diffHours}год`;
  } else {
    return `${diffHours}год ${diffMinutes}хв`;
  }
};

// Отримання подій на сьогодні
export const getTodayEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  const today = new Date();
  return getEventsForDate(today, events);
};

// Отримання подій на тиждень
export const getWeekEvents = (events: CalendarEvent[], startDate: Date): CalendarEvent[] => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  return events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

// Отримання подій на місяць
export const getMonthEvents = (events: CalendarEvent[], year: number, month: number): CalendarEvent[] => {
  return events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });
};

// Сортування подій за часом
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.sort((a, b) => {
    const timeA = new Date(a.startDate).getTime();
    const timeB = new Date(b.startDate).getTime();
    return timeA - timeB;
  });
};

// Групування подій за датою
export const groupEventsByDate = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  const grouped: Record<string, CalendarEvent[]> = {};
  
  events.forEach(event => {
    const dateKey = formatDate(new Date(event.startDate));
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });
  
  // Сортуємо події в кожній групі
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey] = sortEventsByTime(grouped[dateKey]);
  });
  
  return grouped;
};

// Перевірка чи дата є в минулому
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Перевірка чи дата є в майбутньому
export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

// Отримання наступного місяця
export const getNextMonth = (year: number, month: number): { year: number; month: number } => {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  } else {
    return { year, month: month + 1 };
  }
};

// Отримання попереднього місяця
export const getPrevMonth = (year: number, month: number): { year: number; month: number } => {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  } else {
    return { year, month: month - 1 };
  }
};

// Створення унікального ID для події
export const generateEventId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Валідація події
export const validateEvent = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];
  
  if (!event.title?.trim()) {
    errors.push('Назва події обов\'язкова');
  }
  
  if (!event.startDate) {
    errors.push('Дата початку обов\'язкова');
  }
  
  if (!event.endDate) {
    errors.push('Дата закінчення обов\'язкова');
  }
  
  if (event.startDate && event.endDate && event.startDate >= event.endDate) {
    errors.push('Дата закінчення повинна бути після дати початку');
  }
  
  if (!event.type) {
    errors.push('Тип події обов\'язковий');
  }
  
  if (!event.priority) {
    errors.push('Пріоритет обов\'язковий');
  }
  
  return errors;
};
