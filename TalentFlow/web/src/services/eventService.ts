import { apiClient } from '../utils/apiClient';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  type: 'interview' | 'meeting' | 'deadline' | 'reminder' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule?: any;
  isCompleted: boolean;
  location?: any;
  attendees?: any;
  reminders?: any;
  tags?: string[];
  metadata?: any;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  type?: Event['type'];
  priority?: Event['priority'];
  isAllDay?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: any;
  location?: any;
  attendees?: any;
  reminders?: any;
  tags?: string[];
  metadata?: any;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  isCompleted?: boolean;
}

class EventService {
  private baseUrl = '/events';

  async getEvents(): Promise<Event[]> {
    try {
      console.log('🔍 eventService.getEvents called');
      console.log('🌐 Making request to:', this.baseUrl);
      const response = await apiClient.get(this.baseUrl);
      console.log('📡 Response received:', response.data);
      console.log('📡 Response structure:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        hasDataProperty: !!response.data?.data,
        dataPropertyType: typeof response.data?.data,
        dataPropertyLength: response.data?.data?.length,
        fullResponse: response.data
      });
      
      if (Array.isArray(response.data)) {
        console.log('📡 Response is direct array, returning:', response.data.length);
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        console.log('📡 Response has data property, returning:', response.data.data.length);
        return response.data.data;
      }
      console.warn('⚠️ Unexpected response format:', response.data);
      return [];
    } catch (error) {
      console.error('❌ Помилка завантаження подій:', error);
      return [];
    }
  }

  async getEventsByMonth(year: number, month: number): Promise<Event[]> {
    try {
      console.log('🔍 eventService.getEventsByMonth called with:', { year, month });
      const url = `${this.baseUrl}/month/${year}/${month}`;
      console.log('🌐 Making request to:', url);
      const response = await apiClient.get(url);
      console.log('📡 Response received:', response.data);
      console.log('📡 Response structure:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        hasDataProperty: !!response.data?.data,
        dataPropertyType: typeof response.data?.data,
        dataPropertyLength: response.data?.data?.length,
        fullResponse: response.data
      });
      
      // API може повертати події як напряму масив, так і обгорнутими в { data: [...] }
      if (Array.isArray(response.data)) {
        console.log('📡 Response is direct array, returning:', response.data.length);
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        console.log('📡 Response has data property, returning:', response.data.data.length);
        return response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Помилка завантаження подій за місяць:', error);
      return [];
    }
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/range`, {
        params: { startDate, endDate }
      });
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Помилка завантаження подій за діапазон дат:', error);
      return [];
    }
  }

  async getEventById(id: string): Promise<Event | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      if (response.data && !response.data.success) {
        return response.data;
      } else if (response.data?.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Помилка завантаження події:', error);
      return null;
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event | null> {
    try {
      const response = await apiClient.post(this.baseUrl, eventData);
      if (response.data && !response.data.success) {
        return response.data;
      } else if (response.data?.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Помилка створення події:', error);
      return null;
    }
  }

  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event | null> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, eventData);
      if (response.data && !response.data.success) {
        return response.data;
      } else if (response.data?.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Помилка оновлення події:', error);
      return null;
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error('Помилка видалення події:', error);
      return false;
    }
  }

  async markEventAsCompleted(id: string): Promise<Event | null> {
    return this.updateEvent(id, { isCompleted: true });
  }

  async markEventAsIncomplete(id: string): Promise<Event | null> {
    return this.updateEvent(id, { isCompleted: false });
  }

  // Функція для фільтрації подій за датою
  getEventsForDate(events: Event[], date: Date): Event[] {
    if (!events || !Array.isArray(events)) {
      return [];
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return events.filter(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;

      // Подія починається або закінчується в цей день
      const startsOnDate = eventStartDate >= targetDate && eventStartDate < nextDate;
      const endsOnDate = eventEndDate >= targetDate && eventEndDate < nextDate;
      
      // Подія триває кілька днів і охоплює цей день
      const spansDate = eventStartDate < targetDate && eventEndDate >= nextDate;

      return startsOnDate || endsOnDate || spansDate;
    });
  }

  // Функція для групування подій за типом
  groupEventsByType(events: Event[]): Record<string, Event[]> {
    if (!events || !Array.isArray(events)) {
      return {};
    }

    return events.reduce((groups, event) => {
      const type = event.type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(event);
      return groups;
    }, {} as Record<string, Event[]>);
  }

  // Функція для сортування подій за пріоритетом
  sortEventsByPriority(events: Event[]): Event[] {
    if (!events || !Array.isArray(events)) {
      return [];
    }

    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    return [...events].sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return priorityB - priorityA;
    });
  }

  // Функція для отримання кольору події за типом
  getEventColor(event: Event): string {
    const colorMap = {
      interview: '#4285f4', // Синій
      meeting: '#34a853',   // Зелений
      deadline: '#ea4335',  // Червоний
      reminder: '#fbbc04',  // Жовтий
      other: '#9c27b0'      // Фіолетовий
    };
    
    return colorMap[event.type] || colorMap.other;
  }
}

export const eventService = new EventService();
