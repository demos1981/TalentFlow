import { Repository, In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Event, EventType, EventStatus } from '../models/Event';
import { Job } from '../models/Job';
import { CandidateProfile } from '../models/CandidateProfile';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
  InterviewSearchDto,
  InterviewFeedbackDto,
  UpdateInterviewStatusDto,
  InterviewCalendarDto,
  InterviewStatsDto
} from '../dto/InterviewDto';

export class InterviewsService {

  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  private getEventRepository() {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Event);
  }

  private getUserRepository() {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(User);
  }

  private getJobRepository() {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Job);
  }

  private getCandidateProfileRepository() {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(CandidateProfile);
  }

  /**
   * Отримання всіх інтерв'ю з фільтрами (використовуємо події з календаря)
   */
  async getAllInterviews(
    searchDto: InterviewSearchDto, 
    userId: string
  ): Promise<{
    interviews: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        type,
        status,
        result,
        applicationId,
        candidateId,
        jobId,
        interviewerId,
        createdById,
        startDate,
        endDate,
        isActive,
        page = 1,
        limit = 20,
        sortBy = 'startDate',
        sortOrder = 'ASC'
      } = searchDto;

      const offset = (page - 1) * limit;

      const queryBuilder = this.getEventRepository()
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('candidate.user', 'candidateUser')
        .where('event.type = :interviewType', { interviewType: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true });

      // Фільтр по користувачу (створювач події)
      queryBuilder.andWhere('event.createdById = :userId', { userId });

      // Фільтр по пошуку
      if (search) {
        queryBuilder.andWhere(
          '(event.title ILIKE :search OR event.description ILIKE :search OR candidate.firstName ILIKE :search OR candidate.lastName ILIKE :search OR job.title ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Фільтр по статусу (мапимо статуси інтерв'ю на статуси подій)
      if (status) {
        const eventStatusMap: { [key: string]: EventStatus } = {
          'scheduled': EventStatus.SCHEDULED,
          'in-progress': EventStatus.IN_PROGRESS,
          'completed': EventStatus.COMPLETED,
          'cancelled': EventStatus.CANCELLED,
          'rescheduled': EventStatus.POSTPONED
        };
        
        if (eventStatusMap[status]) {
          queryBuilder.andWhere('event.status = :status', { status: eventStatusMap[status] });
        }
      }

      // Фільтр по кандидату
      if (candidateId) {
        queryBuilder.andWhere('event.candidateId = :candidateId', { candidateId });
      }

      // Фільтр по роботі
      if (jobId) {
        queryBuilder.andWhere('event.jobId = :jobId', { jobId });
      }

      // Фільтр по створювачу
      if (createdById) {
        queryBuilder.andWhere('event.createdById = :createdById', { createdById });
      }

      // Фільтр по даті початку
      if (startDate) {
        queryBuilder.andWhere('event.startDate >= :startDate', { startDate });
      }

      // Фільтр по даті кінця
      if (endDate) {
        queryBuilder.andWhere('event.startDate <= :endDate', { endDate });
      }

      // Сортування
      const validSortFields = ['startDate', 'createdAt', 'title', 'status'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'startDate';
      queryBuilder.orderBy(`event.${sortField}`, sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Пагінація
      queryBuilder.skip(offset).take(limit);

      const events = await queryBuilder.getMany();

      // Трансформуємо події в формат інтерв'ю для сумісності з фронтендом
      const interviews = events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        applicationId: event.jobId || null, // Використовуємо jobId як applicationId
        createdById: event.createdById,
        type: 'interview', // Завжди interview для подій цього типу
        status: this.mapEventStatusToInterviewStatus(event.status),
        result: null, // Події не мають результату
        scheduledDate: event.startDate,
        duration: event.endDate ? 
          Math.round((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60)) : 
          60, // За замовчуванням 60 хвилин
        location: event.locationDetails?.address || event.location,
        meetingLink: event.locationDetails?.meetingUrl,
        notes: event.notes,
        feedback: null,
        overallRating: null,
        technicalSkills: null,
        communicationSkills: null,
        culturalFit: null,
        wouldRecommend: null,
        nextSteps: null,
        reason: null,
        cancellationReason: null,
        isActive: event.isActive,
        metadata: event.metadata,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        
        // Relations
        application: event.job ? {
          id: event.job.id,
          user: event.candidate?.user ? {
            id: event.candidate.user.id,
            firstName: event.candidate.user.firstName,
            lastName: event.candidate.user.lastName,
            email: event.candidate.user.email,
            phone: event.candidate.phone
          } : null,
          job: {
            id: event.job.id,
            title: event.job.title,
            company: event.job.company ? {
              id: event.job.company.id,
              name: event.job.company.name
            } : null
          }
        } : null,
        createdBy: event.createdBy ? {
          id: event.createdBy.id,
          firstName: event.createdBy.firstName,
          lastName: event.createdBy.lastName,
          email: event.createdBy.email
        } : null,
        interviewers: event.createdBy ? [{
          id: event.createdBy.id,
          firstName: event.createdBy.firstName,
          lastName: event.createdBy.lastName,
          email: event.createdBy.email
        }] : []
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        interviews,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error getting interviews:', error);
      throw new Error(`Failed to get interviews: ${error.message}`);
    }
  }

  /**
   * Мапимо статуси подій на статуси інтерв'ю
   */
  private mapEventStatusToInterviewStatus(eventStatus: EventStatus): string {
    const statusMap: { [key in EventStatus]: string } = {
      [EventStatus.SCHEDULED]: 'scheduled',
      [EventStatus.IN_PROGRESS]: 'in-progress',
      [EventStatus.COMPLETED]: 'completed',
      [EventStatus.CANCELLED]: 'cancelled',
      [EventStatus.POSTPONED]: 'rescheduled'
    };
    
    return statusMap[eventStatus] || 'scheduled';
  }

  /**
   * Отримання статистики інтерв'ю
   */
  async getInterviewStats(userId: string): Promise<any> {
    try {
      const eventRepository = this.getEventRepository();
      
      // Загальна кількість інтерв'ю
      const totalInterviews = await eventRepository.count({
        where: {
          type: EventType.INTERVIEW,
          isActive: true,
          createdById: userId
        }
      });

      // Інтерв'ю по статусах
      const interviewsByStatus = await eventRepository
        .createQueryBuilder('event')
        .select('event.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('event.type = :type', { type: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId })
        .groupBy('event.status')
        .getRawMany();

      // Завершені інтерв'ю
      const completedInterviews = await eventRepository.count({
        where: {
          type: EventType.INTERVIEW,
          status: EventStatus.COMPLETED,
          isActive: true,
          createdById: userId
        }
      });

      const stats = {
        totalInterviews,
        interviewsByStatus,
        completedInterviews
      };
      
      console.log('Interview stats for user', userId, ':', stats);
      return stats;
    } catch (error) {
      console.error('Error getting interview stats:', error);
      throw new Error(`Failed to get interview stats: ${error.message}`);
    }
  }

  /**
   * Отримання інтерв'ю за ID (використовуємо події)
   */
  async getInterviewById(id: string, userId: string): Promise<any | null> {
    try {
      const event = await this.getEventRepository()
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('candidate.user', 'candidateUser')
        .where('event.id = :id', { id })
        .andWhere('event.type = :type', { type: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId })
        .getOne();

      if (!event) {
        return null;
      }

      // Трансформуємо подію в формат інтерв'ю
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        applicationId: event.jobId || null,
        createdById: event.createdById,
        type: 'interview',
        status: this.mapEventStatusToInterviewStatus(event.status),
        result: null,
        scheduledDate: event.startDate,
        duration: event.endDate ? 
          Math.round((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60)) : 
          60,
        location: event.locationDetails?.address || event.location,
        meetingLink: event.locationDetails?.meetingUrl,
        notes: event.notes,
        feedback: null,
        overallRating: null,
        technicalSkills: null,
        communicationSkills: null,
        culturalFit: null,
        wouldRecommend: null,
        nextSteps: null,
        reason: null,
        cancellationReason: null,
        isActive: event.isActive,
        metadata: event.metadata,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        
        // Relations
        application: event.job ? {
          id: event.job.id,
          user: event.candidate?.user ? {
            id: event.candidate.user.id,
            firstName: event.candidate.user.firstName,
            lastName: event.candidate.user.lastName,
            email: event.candidate.user.email,
            phone: event.candidate.phone
          } : null,
          job: {
            id: event.job.id,
            title: event.job.title,
            company: event.job.company ? {
              id: event.job.company.id,
              name: event.job.company.name
            } : null
          }
        } : null,
        createdBy: event.createdBy ? {
          id: event.createdBy.id,
          firstName: event.createdBy.firstName,
          lastName: event.createdBy.lastName,
          email: event.createdBy.email
        } : null,
        interviewers: event.createdBy ? [{
          id: event.createdBy.id,
          firstName: event.createdBy.firstName,
          lastName: event.createdBy.lastName,
          email: event.createdBy.email
        }] : []
      };
    } catch (error) {
      console.error('Error getting interview by ID:', error);
      throw new Error(`Failed to get interview: ${error.message}`);
    }
  }

  /**
   * Оновлення статусу інтерв'ю (використовуємо події)
   */
  async updateInterviewStatus(id: string, statusData: UpdateInterviewStatusDto, userId: string): Promise<any | null> {
    try {
      const event = await this.getEventRepository()
        .createQueryBuilder('event')
        .where('event.id = :id', { id })
        .andWhere('event.type = :type', { type: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId })
        .getOne();

      if (!event) {
        return null;
      }

      // Мапимо статус інтерв'ю на статус події
      const eventStatusMap: { [key: string]: EventStatus } = {
        'scheduled': EventStatus.SCHEDULED,
        'in-progress': EventStatus.IN_PROGRESS,
        'completed': EventStatus.COMPLETED,
        'cancelled': EventStatus.CANCELLED,
        'rescheduled': EventStatus.POSTPONED
      };

      if (statusData.status && eventStatusMap[statusData.status]) {
        event.status = eventStatusMap[statusData.status];
      }

      if (statusData.notes) {
        event.notes = statusData.notes;
      }

      event.updatedAt = new Date();

      const updatedEvent = await this.getEventRepository().save(event);

      // Повертаємо в форматі інтерв'ю
      return this.getInterviewById(id, userId);
    } catch (error) {
      console.error('Error updating interview status:', error);
      throw new Error(`Failed to update interview status: ${error.message}`);
    }
  }

  /**
   * Видалення інтерв'ю (soft delete події)
   */
  async deleteInterview(id: string, userId: string): Promise<boolean> {
    try {
      const event = await this.getEventRepository()
        .createQueryBuilder('event')
        .where('event.id = :id', { id })
        .andWhere('event.type = :type', { type: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId })
        .getOne();

      if (!event) {
        return false;
      }

      event.isActive = false;
      event.updatedAt = new Date();

      await this.getEventRepository().save(event);
      return true;
    } catch (error) {
      console.error('Error deleting interview:', error);
      throw new Error(`Failed to delete interview: ${error.message}`);
    }
  }

  /**
   * Створення інтерв'ю (створюємо подію типу interview)
   */
  async createInterview(createInterviewDto: CreateInterviewDto, userId: string): Promise<any> {
    try {
      const event = this.getEventRepository().create({
        title: createInterviewDto.title,
        description: createInterviewDto.description,
        startDate: new Date(createInterviewDto.scheduledDate),
        endDate: new Date(new Date(createInterviewDto.scheduledDate).getTime() + (createInterviewDto.duration * 60 * 1000)),
        type: EventType.INTERVIEW,
        status: EventStatus.SCHEDULED,
        location: createInterviewDto.location,
        locationDetails: createInterviewDto.meetingLink ? {
          meetingUrl: createInterviewDto.meetingLink,
          isOnline: true
        } : undefined,
        notes: createInterviewDto.notes,
        createdById: userId,
        jobId: createInterviewDto.applicationId,
        isActive: true
      });

      const savedEvent = await this.getEventRepository().save(event);
      return this.getInterviewById(savedEvent.id, userId);
    } catch (error) {
      console.error('Error creating interview:', error);
      throw new Error(`Failed to create interview: ${error.message}`);
    }
  }

  /**
   * Оновлення інтерв'ю (оновлюємо подію)
   */
  async updateInterview(id: string, updateInterviewDto: UpdateInterviewDto, userId: string): Promise<any | null> {
    try {
      const event = await this.getEventRepository()
        .createQueryBuilder('event')
        .where('event.id = :id', { id })
        .andWhere('event.type = :type', { type: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId })
        .getOne();

      if (!event) {
        return null;
      }

      // Оновлюємо поля події
      if (updateInterviewDto.title) event.title = updateInterviewDto.title;
      if (updateInterviewDto.description) event.description = updateInterviewDto.description;
      if (updateInterviewDto.scheduledDate) {
        event.startDate = new Date(updateInterviewDto.scheduledDate);
        if (updateInterviewDto.duration) {
          event.endDate = new Date(new Date(updateInterviewDto.scheduledDate).getTime() + (updateInterviewDto.duration * 60 * 1000));
        }
      }
      if (updateInterviewDto.location) event.location = updateInterviewDto.location;
      if (updateInterviewDto.meetingLink) {
        event.locationDetails = {
          ...event.locationDetails,
          meetingUrl: updateInterviewDto.meetingLink,
          isOnline: true
        };
      }
      if (updateInterviewDto.notes) event.notes = updateInterviewDto.notes;

      event.updatedAt = new Date();

      await this.getEventRepository().save(event);
      return this.getInterviewById(id, userId);
    } catch (error) {
      console.error('Error updating interview:', error);
      throw new Error(`Failed to update interview: ${error.message}`);
    }
  }

  /**
   * Додавання відгуку до інтерв'ю
   */
  async addInterviewFeedback(id: string, feedbackDto: InterviewFeedbackDto, userId: string): Promise<any | null> {
    try {
      const event = await this.getEventRepository()
        .createQueryBuilder('event')
        .where('event.id = :id', { id })
        .andWhere('event.type = :type', { type: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId })
        .getOne();

      if (!event) {
        return null;
      }

      // Додаємо відгук до notes або metadata
      const feedback = {
        overallRating: feedbackDto.overallRating,
        technicalSkills: feedbackDto.technicalSkills,
        communicationSkills: feedbackDto.communicationSkills,
        culturalFit: feedbackDto.culturalFit,
        wouldRecommend: feedbackDto.wouldRecommend,
        feedback: feedbackDto.feedback,
        nextSteps: feedbackDto.nextSteps,
        addedAt: new Date()
      };

      event.metadata = {
        ...event.metadata,
        feedback
      };

      event.updatedAt = new Date();

      await this.getEventRepository().save(event);
      return this.getInterviewById(id, userId);
    } catch (error) {
      console.error('Error adding interview feedback:', error);
      throw new Error(`Failed to add interview feedback: ${error.message}`);
    }
  }

  /**
   * Отримання календаря інтерв'ю
   */
  async getInterviewCalendar(calendarDto: InterviewCalendarDto, userId: string): Promise<any[]> {
    try {
      const { startDate, endDate, type, status } = calendarDto;

      const queryBuilder = this.getEventRepository()
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .leftJoinAndSelect('event.job', 'job')
        .leftJoinAndSelect('event.candidate', 'candidate')
        .leftJoinAndSelect('candidate.user', 'candidateUser')
        .where('event.type = :interviewType', { interviewType: EventType.INTERVIEW })
        .andWhere('event.isActive = :isActive', { isActive: true })
        .andWhere('event.createdById = :userId', { userId });

      if (startDate) {
        queryBuilder.andWhere('event.startDate >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('event.startDate <= :endDate', { endDate });
      }

      if (status) {
        const eventStatusMap: { [key: string]: EventStatus } = {
          'scheduled': EventStatus.SCHEDULED,
          'in-progress': EventStatus.IN_PROGRESS,
          'completed': EventStatus.COMPLETED,
          'cancelled': EventStatus.CANCELLED,
          'rescheduled': EventStatus.POSTPONED
        };
        
        if (eventStatusMap[status]) {
          queryBuilder.andWhere('event.status = :status', { status: eventStatusMap[status] });
        }
      }

      queryBuilder.orderBy('event.startDate', 'ASC');

      const events = await queryBuilder.getMany();

      // Трансформуємо події в формат календаря
      return events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000), // 1 година за замовчуванням
        type: 'interview',
        status: this.mapEventStatusToInterviewStatus(event.status),
        location: event.location,
        meetingLink: event.locationDetails?.meetingUrl,
        notes: event.notes,
        job: event.job ? {
          id: event.job.id,
          title: event.job.title,
          company: event.job.company ? {
            id: event.job.company.id,
            name: event.job.company.name
          } : null
        } : null,
        candidate: event.candidate?.user ? {
          id: event.candidate.user.id,
          firstName: event.candidate.user.firstName,
          lastName: event.candidate.user.lastName,
          email: event.candidate.user.email
        } : null
      }));
    } catch (error) {
      console.error('Error getting interview calendar:', error);
      throw new Error(`Failed to get interview calendar: ${error.message}`);
    }
  }
}

export const interviewsService = new InterviewsService();
