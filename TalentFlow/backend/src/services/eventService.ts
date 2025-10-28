import { AppDataSource } from '../config/database';
import { Event, EventType, EventStatus, EventPriority } from '../models/Event';
import { User } from '../models/User';
import { Job } from '../models/Job';
import { CandidateProfile } from '../models/CandidateProfile';
import { Company } from '../models/Company';
import {
  CreateEventDto,
  UpdateEventDto,
  EventSearchDto,
  EventStatsDto,
  MarkEventCompletedDto,
  CancelEventDto
} from '../dto/EventDto';

export class EventService {

  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  private getEventRepository() {
    return AppDataSource.getRepository(Event);
  }

  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  private getJobRepository() {
    return AppDataSource.getRepository(Job);
  }

  private getCandidateProfileRepository() {
    return AppDataSource.getRepository(CandidateProfile);
  }

  private getCompanyRepository() {
    return AppDataSource.getRepository(Company);
  }

  /**
   * Створення нової події
   */
  async createEvent(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    try {
      const eventRepository = this.getEventRepository();
      const event = eventRepository.create({
        ...createEventDto,
        createdById: userId,
        isActive: true
      });

      return await eventRepository.save(event);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  /**
   * Отримання всіх подій з фільтрами
   */
  async getAllEvents(
    searchDto: EventSearchDto,
    userId?: string
  ): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true });

      // Фільтр по користувачу
      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      // Пошук по тексту
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(event.title ILIKE :search OR event.description ILIKE :search OR event.notes ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      // Фільтри
      if (searchDto.type) {
        queryBuilder.andWhere('event.type = :type', { type: searchDto.type });
      }

      if (searchDto.status) {
        queryBuilder.andWhere('event.status = :status', { status: searchDto.status });
      }

      if (searchDto.priority) {
        queryBuilder.andWhere('event.priority = :priority', { priority: searchDto.priority });
      }

      if (searchDto.startDate) {
        queryBuilder.andWhere('event.startDate >= :startDate', { startDate: searchDto.startDate });
      }

      if (searchDto.endDate) {
        queryBuilder.andWhere('event.endDate <= :endDate', { endDate: searchDto.endDate });
      }

      if (searchDto.location) {
        queryBuilder.andWhere('event.location ILIKE :location', { location: `%${searchDto.location}%` });
      }

      if (searchDto.jobId) {
        queryBuilder.andWhere('event.jobId = :jobId', { jobId: searchDto.jobId });
      }

      if (searchDto.candidateId) {
        queryBuilder.andWhere('event.candidateId = :candidateId', { candidateId: searchDto.candidateId });
      }

      if (searchDto.companyId) {
        queryBuilder.andWhere('event.companyId = :companyId', { companyId: searchDto.companyId });
      }

      if (searchDto.tags && searchDto.tags.length > 0) {
        queryBuilder.andWhere('event.tags && :tags', { tags: searchDto.tags });
      }

      if (searchDto.isRecurring !== undefined) {
        queryBuilder.andWhere('event.isRecurring = :isRecurring', { isRecurring: searchDto.isRecurring });
      }

      if (searchDto.isPrivate !== undefined) {
        queryBuilder.andWhere('event.isPrivate = :isPrivate', { isPrivate: searchDto.isPrivate });
      }

      if (searchDto.createdBy) {
        queryBuilder.andWhere('event.createdById = :createdBy', { createdBy: searchDto.createdBy });
      }

      // Сортування
      const sortBy = searchDto.sortBy || 'startDate';
      const sortOrder = searchDto.sortOrder || 'ASC';
      queryBuilder.orderBy(`event.${sortBy}`, sortOrder);

      // Пагінація
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const offset = (page - 1) * limit;

      queryBuilder.skip(offset).take(limit);

      const [events, total] = await queryBuilder.getManyAndCount();

      return {
        events,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting all events:', error);
      throw new Error(`Failed to get events: ${error.message}`);
    }
  }

  /**
   * Отримання події за ID
   */
  async getEventById(id: string, userId?: string): Promise<Event | null> {
    try {
      const whereCondition: any = { id, isActive: true };
      
      if (userId) {
        whereCondition.createdById = userId;
      }

      const eventRepository = this.getEventRepository();
      return await eventRepository.findOne({
        where: whereCondition,
        relations: ['createdBy', 'job', 'candidate', 'company']
      });
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw new Error(`Failed to get event: ${error.message}`);
    }
  }

  /**
   * Оновлення події
   */
  async updateEvent(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event | null> {
    try {
      const eventRepository = this.getEventRepository();
      const event = await eventRepository.findOne({
        where: { id, createdById: userId, isActive: true }
      });

      if (!event) {
        return null;
      }

      Object.assign(event, updateEventDto);
      event.updatedAt = new Date();

      return await eventRepository.save(event);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  /**
   * Видалення події (soft delete)
   */
  async deleteEvent(id: string, userId: string): Promise<boolean> {
    try {
      const eventRepository = this.getEventRepository();
      const event = await eventRepository.findOne({
        where: { id, createdById: userId, isActive: true }
      });

      if (!event) {
        return false;
      }

      event.isActive = false;
      event.updatedAt = new Date();

      await eventRepository.save(event);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  /**
   * Отримання подій за місяць
   */
  async getEventsByMonth(year: number, month: number, userId?: string): Promise<Event[]> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      
      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true })
        .andWhere('event.startDate >= :startDate', { startDate })
        .andWhere('event.startDate <= :endDate', { endDate });

      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      return await queryBuilder
        .orderBy('event.startDate', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error getting events by month:', error);
      throw new Error(`Failed to get events by month: ${error.message}`);
    }
  }

  /**
   * Отримання подій за тиждень
   */
  async getEventsByWeek(year: number, week: number, userId?: string): Promise<Event[]> {
    try {
      const startDate = new Date(year, 0, 1 + (week - 1) * 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59);

      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true })
        .andWhere('event.startDate >= :startDate', { startDate })
        .andWhere('event.startDate <= :endDate', { endDate });

      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      return await queryBuilder
        .orderBy('event.startDate', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error getting events by week:', error);
      throw new Error(`Failed to get events by week: ${error.message}`);
    }
  }

  /**
   * Отримання подій за день
   */
  async getEventsByDay(date: string, userId?: string): Promise<Event[]> {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true })
        .andWhere('event.startDate >= :startDate', { startDate })
        .andWhere('event.startDate <= :endDate', { endDate });

      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      return await queryBuilder
        .orderBy('event.startDate', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error getting events by day:', error);
      throw new Error(`Failed to get events by day: ${error.message}`);
    }
  }

  /**
   * Отримання подій за період
   */
  async getEventsByDateRange(
    startDate: string,
    endDate: string,
    filters: any = {},
    userId?: string
  ): Promise<Event[]> {
    try {
      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true })
        .andWhere('event.startDate >= :startDate', { startDate })
        .andWhere('event.startDate <= :endDate', { endDate });

      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      // Додаткові фільтри
      if (filters.type) {
        queryBuilder.andWhere('event.type = :type', { type: filters.type });
      }

      if (filters.status) {
        queryBuilder.andWhere('event.status = :status', { status: filters.status });
      }

      return await queryBuilder
        .orderBy('event.startDate', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error getting events by date range:', error);
      throw new Error(`Failed to get events by date range: ${error.message}`);
    }
  }

  /**
   * Отримання майбутніх подій
   */
  async getUpcomingEvents(limit: number = 10, userId?: string): Promise<Event[]> {
    try {
      const now = new Date();

      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true })
        .andWhere('event.startDate > :now', { now })
        .andWhere('event.status != :cancelled', { cancelled: EventStatus.CANCELLED });

      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      return await queryBuilder
        .orderBy('event.startDate', 'ASC')
        .limit(limit)
        .getMany();
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw new Error(`Failed to get upcoming events: ${error.message}`);
    }
  }

  /**
   * Позначення події як завершеної
   */
  async markEventAsCompleted(
    id: string,
    markCompletedDto: MarkEventCompletedDto,
    userId: string
  ): Promise<Event | null> {
    try {
      const eventRepository = this.getEventRepository();
      const event = await eventRepository.findOne({
        where: { id, createdById: userId, isActive: true }
      });

      if (!event) {
        return null;
      }

      event.status = EventStatus.COMPLETED;
      event.completionPercentage = markCompletedDto.completionPercentage || 100;
      event.completedAt = new Date();
      event.updatedAt = new Date();

      if (markCompletedDto.notes) {
        event.notes = (event.notes || '') + `\nCompleted: ${markCompletedDto.notes}`;
      }

      return await eventRepository.save(event);
    } catch (error) {
      console.error('Error marking event as completed:', error);
      throw new Error(`Failed to mark event as completed: ${error.message}`);
    }
  }

  /**
   * Скасування події
   */
  async cancelEvent(id: string, cancelEventDto: CancelEventDto, userId: string): Promise<Event | null> {
    try {
      const eventRepository = this.getEventRepository();
      const event = await eventRepository.findOne({
        where: { id, createdById: userId, isActive: true }
      });

      if (!event) {
        return null;
      }

      event.status = EventStatus.CANCELLED;
      event.cancelledAt = new Date();
      event.cancellationReason = cancelEventDto.reason;
      event.updatedAt = new Date();

      return await eventRepository.save(event);
    } catch (error) {
      console.error('Error cancelling event:', error);
      throw new Error(`Failed to cancel event: ${error.message}`);
    }
  }

  /**
   * Отримання статистики подій
   */
  async getEventStats(statsDto: EventStatsDto): Promise<{
    totalEvents: number;
    eventsByType: Array<{ type: string; count: number }>;
    eventsByStatus: Array<{ status: string; count: number }>;
    eventsByPriority: Array<{ priority: string; count: number }>;
    upcomingEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    averageDuration: number;
    recentEvents: number;
  }> {
    try {
      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .where('event.isActive = :isActive', { isActive: true });

      if (statsDto.userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId: statsDto.userId });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('event.type = :type', { type: statsDto.type });
      }

      if (statsDto.status) {
        queryBuilder.andWhere('event.status = :status', { status: statsDto.status });
      }

      if (statsDto.dateFrom) {
        queryBuilder.andWhere('event.startDate >= :dateFrom', { dateFrom: statsDto.dateFrom });
      }

      if (statsDto.dateTo) {
        queryBuilder.andWhere('event.startDate <= :dateTo', { dateTo: statsDto.dateTo });
      }

      const events = await queryBuilder.getMany();

      const totalEvents = events.length;

      // Статистика по типах
      const eventsByType = Object.values(EventType).map(type => ({
        type,
        count: events.filter(event => event.type === type).length
      }));

      // Статистика по статусах
      const eventsByStatus = Object.values(EventStatus).map(status => ({
        status,
        count: events.filter(event => event.status === status).length
      }));

      // Статистика по пріоритетах
      const eventsByPriority = Object.values(EventPriority).map(priority => ({
        priority,
        count: events.filter(event => event.priority === priority).length
      }));

      // Майбутні події
      const now = new Date();
      const upcomingEvents = events.filter(event => 
        event.startDate > now && event.status === EventStatus.SCHEDULED
      ).length;

      // Завершені події
      const completedEvents = events.filter(event => 
        event.status === EventStatus.COMPLETED
      ).length;

      // Скасовані події
      const cancelledEvents = events.filter(event => 
        event.status === EventStatus.CANCELLED
      ).length;

      // Середня тривалість
      const eventsWithDuration = events.filter(event => event.endDate);
      const averageDuration = eventsWithDuration.length > 0 
        ? eventsWithDuration.reduce((sum, event) => {
            const duration = (event.endDate!.getTime() - event.startDate.getTime()) / (1000 * 60 * 60);
            return sum + duration;
          }, 0) / eventsWithDuration.length
        : 0;

      // Останні події (останні 7 днів)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentEvents = events.filter(event => event.createdAt >= weekAgo).length;

      return {
        totalEvents,
        eventsByType,
        eventsByStatus,
        eventsByPriority,
        upcomingEvents,
        completedEvents,
        cancelledEvents,
        averageDuration: Math.round(averageDuration * 100) / 100,
        recentEvents
      };
    } catch (error) {
      console.error('Error getting event stats:', error);
      throw new Error(`Failed to get event stats: ${error.message}`);
    }
  }

  /**
   * Пошук подій
   */
  async searchEvents(search: string, filters: any = {}, userId?: string): Promise<Event[]> {
    try {
      const eventRepository = this.getEventRepository();
      const queryBuilder = eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('event.company', 'company')
        .where('event.isActive = :isActive', { isActive: true })
        .andWhere(
          '(event.title ILIKE :search OR event.description ILIKE :search OR event.notes ILIKE :search)',
          { search: `%${search}%` }
        );

      if (userId) {
        queryBuilder.andWhere('event.createdById = :userId', { userId });
      }

      // Додаткові фільтри
      if (filters.type) {
        queryBuilder.andWhere('event.type = :type', { type: filters.type });
      }

      if (filters.status) {
        queryBuilder.andWhere('event.status = :status', { status: filters.status });
      }

      if (filters.priority) {
        queryBuilder.andWhere('event.priority = :priority', { priority: filters.priority });
      }

      return await queryBuilder
        .orderBy('event.startDate', 'ASC')
        .limit(50)
        .getMany();
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error(`Failed to search events: ${error.message}`);
    }
  }
}

export const eventService = new EventService();