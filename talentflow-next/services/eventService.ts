import api from './api';

export interface Event {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  type: 'interview' | 'meeting' | 'deadline' | 'reminder' | 'training' | 'conference' | 'workshop' | 'presentation' | 'review' | 'other';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceRule?: any;
  completionPercentage: number;
  isCompleted: boolean;
  location?: string;
  locationDetails?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    isOnline?: boolean;
    meetingUrl?: string;
    room?: string;
  };
  attendees?: string[];
  externalAttendees?: string[];
  reminders?: Array<{
    type: 'email' | 'push' | 'sms';
    time: number;
    sent: boolean;
  }>;
  tags?: string[];
  metadata?: any;
  isPrivate: boolean;
  isActive: boolean;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdById: string;
  jobId?: string;
  candidateId?: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  type?: Event['type'];
  status?: Event['status'];
  priority?: Event['priority'];
  isAllDay?: boolean;
  isRecurring?: boolean;
  recurrenceType?: Event['recurrenceType'];
  recurrenceRule?: any;
  location?: string;
  locationDetails?: Event['locationDetails'];
  attendees?: string[];
  externalAttendees?: string[];
  reminders?: Event['reminders'];
  tags?: string[];
  metadata?: any;
  isPrivate?: boolean;
  jobId?: string;
  candidateId?: string;
  companyId?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  completionPercentage?: number;
  isCompleted?: boolean;
  cancellationReason?: string;
}

class EventService {
  private baseUrl = '/events';

  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get(this.baseUrl);
      
      // Перевіряємо структуру відповіді
      if (response.data?.data?.events && Array.isArray(response.data.data.events)) {
        return response.data.data.events;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEventsByMonth(year: number, month: number): Promise<Event[]> {
    try {
      const response = await api.get(`${this.baseUrl}/month/${year}/${month}`);
      
      // Перевіряємо структуру відповіді
      if (response.data?.data?.events && Array.isArray(response.data.data.events)) {
        return response.data.data.events;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching events by month:', error);
      return [];
    }
  }

  async getEventById(id: string): Promise<Event | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const response = await api.post(this.baseUrl, eventData);
      return response.data?.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, eventData);
      return response.data?.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async markEventCompleted(id: string, isCompleted: boolean): Promise<Event> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}/complete`, {
        completionPercentage: isCompleted ? 100 : 0
      });
      return response.data?.data;
    } catch (error) {
      console.error('Error marking event as completed:', error);
      throw error;
    }
  }

  getEventColor(event: Event): string {
    const colors = {
      interview: '#3b82f6', // blue
      meeting: '#10b981', // green
      deadline: '#ef4444', // red
      reminder: '#f59e0b', // yellow
      training: '#06b6d4', // cyan
      conference: '#8b5cf6', // purple
      workshop: '#f97316', // orange
      presentation: '#84cc16', // lime
      review: '#ec4899', // pink
      other: '#6b7280' // gray
    };
    return colors[event.type] || colors.other;
  }

  getEventPriorityColor(priority: Event['priority']): string {
    const colors = {
      low: '#6b7280', // gray
      medium: '#3b82f6', // blue
      high: '#f59e0b', // yellow
      urgent: '#ef4444' // red
    };
    return colors[priority] || colors.medium;
  }

  formatEventTime(event: Event): string {
    if (event.isAllDay) {
      return 'Весь день';
    }

    const startTime = new Date(event.startDate);
    const endTime = event.endDate ? new Date(event.endDate) : null;

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    if (endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }

    return formatTime(startTime);
  }

  formatEventDate(event: Event): string {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('uk-UA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    if (endDate && !event.isAllDay) {
      const isSameDay = startDate.toDateString() === endDate.toDateString();
      if (isSameDay) {
        return formatDate(startDate);
      }
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    return formatDate(startDate);
  }

  isEventToday(event: Event): boolean {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    
    return today.toDateString() === eventDate.toDateString();
  }

  isEventUpcoming(event: Event): boolean {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    
    return eventDate > now;
  }

  isEventOverdue(event: Event): boolean {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    
    return eventDate < now && !event.isCompleted;
  }

  getUpcomingEvents(events: Event[], limit: number = 5): Event[] {
    return events
      .filter(event => this.isEventUpcoming(event))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);
  }

  getTodayEvents(events: Event[]): Event[] {
    return events
      .filter(event => this.isEventToday(event))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  getOverdueEvents(events: Event[]): Event[] {
    return events
      .filter(event => this.isEventOverdue(event))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  searchEvents(events: Event[], query: string): Event[] {
    const lowercaseQuery = query.toLowerCase();
    
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      (event.description && event.description.toLowerCase().includes(lowercaseQuery)) ||
      (event.location && event.location.toLowerCase().includes(lowercaseQuery)) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  filterEventsByType(events: Event[], type: Event['type']): Event[] {
    return events.filter(event => event.type === type);
  }

  filterEventsByPriority(events: Event[], priority: Event['priority']): Event[] {
    return events.filter(event => event.priority === priority);
  }

  getEventStats(events: Event[]): {
    total: number;
    completed: number;
    upcoming: number;
    overdue: number;
    byType: Record<Event['type'], number>;
    byPriority: Record<Event['priority'], number>;
  } {
    const stats = {
      total: events.length,
      completed: events.filter(event => event.isCompleted).length,
      upcoming: events.filter(event => this.isEventUpcoming(event)).length,
      overdue: events.filter(event => this.isEventOverdue(event)).length,
      byType: {
        interview: 0,
        meeting: 0,
        deadline: 0,
        reminder: 0,
        training: 0,
        conference: 0,
        workshop: 0,
        presentation: 0,
        review: 0,
        other: 0
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      }
    };

    events.forEach(event => {
      stats.byType[event.type]++;
      stats.byPriority[event.priority]++;
    });

    return stats;
  }
}

export const eventService = new EventService();