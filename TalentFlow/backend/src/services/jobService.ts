import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Job, JobStatus, JobType, ExperienceLevel } from '../models/Job';
import { Application } from '../models/Application';
import {
  CreateJobDto,
  UpdateJobDto,
  JobSearchDto,
  JobStatsDto,
  PublishJobDto,
  PauseJobDto,
  CloseJobDto
} from '../dto/JobDto';

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: JobSearchDto;
}

export interface JobStats {
  totalJobs: number;
  jobsByStatus: Array<{ status: string; count: number }>;
  jobsByType: Array<{ type: string; count: number }>;
  jobsByExperienceLevel: Array<{ level: string; count: number }>;
  publishedJobs: number;
  draftJobs: number;
  pausedJobs: number;
  closedJobs: number;
  totalApplications: number;
  averageApplicationsPerJob: number;
  topSkills: Array<{ skill: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
}

export class JobService {

  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  private getCompanyRepository() {
    return AppDataSource.getRepository(Company);
  }

  private getJobRepository() {
    return AppDataSource.getRepository(Job);
  }

  private getApplicationRepository() {
    return AppDataSource.getRepository(Application);
  }

  /**
   * Пошук вакансій з фільтрами
   */
  async searchJobs(filters: JobSearchDto, page: number = 1, limit: number = 20): Promise<JobSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.getJobRepository()
        .createQueryBuilder('job')
        .where('job.isActive = :isActive', { isActive: true })
        .andWhere('job.status = :status', { status: 'active' }); // Тільки активні

      // Фільтр по пошуку
      if (filters.search) {
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search OR job.requirements ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      // Фільтр по типу
      if (filters.type) {
        queryBuilder.andWhere('job.type = :type', { type: filters.type });
      }

      // Фільтр по рівню досвіду
      if (filters.experienceLevel) {
        queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel: filters.experienceLevel });
      }

      // Фільтр по локації
      if (filters.location) {
        queryBuilder.andWhere('job.location ILIKE :location', { location: `%${filters.location}%` });
      }

      // Фільтр по віддаленій роботі
      if (filters.remote) {
        queryBuilder.andWhere('job.remote ILIKE :remote', { remote: `%${filters.remote}%` });
      }

      // Фільтр по статусу
      if (filters.status) {
        queryBuilder.andWhere('job.status = :status', { status: filters.status });
      }

      // Фільтр по департаменту
      if (filters.department) {
        queryBuilder.andWhere('job.department ILIKE :department', { department: `%${filters.department}%` });
      }

      // Фільтр по зарплаті
      if (filters.salaryMin) {
        queryBuilder.andWhere('job.salaryMin >= :salaryMin', { salaryMin: filters.salaryMin });
      }

      if (filters.salaryMax) {
        queryBuilder.andWhere('job.salaryMax <= :salaryMax', { salaryMax: filters.salaryMax });
      }

      // Фільтр по валюті
      if (filters.currency) {
        queryBuilder.andWhere('job.currency = :currency', { currency: filters.currency });
      }

      // Фільтр по терміновості
      if (filters.isUrgent !== undefined) {
        queryBuilder.andWhere('job.isUrgent = :isUrgent', { isUrgent: filters.isUrgent });
      }

      // Фільтр по рекомендованим
      if (filters.isFeatured !== undefined) {
        queryBuilder.andWhere('job.isFeatured = :isFeatured', { isFeatured: filters.isFeatured });
      }

      // Фільтр по даті
      if (filters.startDate) {
        queryBuilder.andWhere('job.createdAt >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('job.createdAt <= :endDate', { endDate: filters.endDate });
      }

      // Фільтр по компанії
      if (filters.companyId) {
        queryBuilder.andWhere('job.companyId = :companyId', { companyId: filters.companyId });
      }

      // Фільтр по створювачу
      if (filters.createdByUserId) {
        queryBuilder.andWhere('job.createdByUserId = :createdByUserId', { createdByUserId: filters.createdByUserId });
    }

    // Сортування
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'DESC';
      queryBuilder.orderBy(`job.${sortBy}`, sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const jobs = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

    const totalPages = Math.ceil(total / limit);
    
    return {
      jobs,
      total,
      page,
      limit,
      totalPages,
      filters
    };
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error(`Failed to search jobs: ${error.message}`);
    }
  }

  /**
   * Отримання доступних локацій
   */
  async getAvailableLocations(): Promise<{ locations: { name: string; count: number }[]; total: number }> {
    try {
      const locations = await this.getJobRepository()
        .createQueryBuilder('job')
        .select('job.location', 'name')
        .addSelect('COUNT(*)', 'count')
        .where('job.isActive = :isActive', { isActive: true })
        .andWhere('job.location IS NOT NULL')
        .andWhere('job.location != :empty', { empty: '' })
        .groupBy('job.location')
        .orderBy('count', 'DESC')
        .getRawMany();

      return {
        locations: locations.map(item => ({
          name: item.name,
          count: parseInt(item.count)
        })),
        total: locations.length
      };
    } catch (error) {
      console.error('Error getting available locations:', error);
      throw new Error(`Failed to get available locations: ${error.message}`);
    }
  }

  /**
   * Отримання типів вакансій
   */
  async getJobTypes(): Promise<{ types: { value: string; label: string; count: number }[]; total: number }> {
    try {
      const types = await this.getJobRepository()
        .createQueryBuilder('job')
        .select('job.type', 'value')
        .addSelect('COUNT(*)', 'count')
        .where('job.isActive = :isActive', { isActive: true })
        .groupBy('job.type')
        .orderBy('count', 'DESC')
        .getRawMany();

      const typeLabels = {
        [JobType.FULL_TIME]: 'Full Time',
        [JobType.PART_TIME]: 'Part Time',
        [JobType.INTERNSHIP]: 'Internship',
        [JobType.FREELANCE]: 'Freelance'
      };

      return {
        types: types.map(item => ({
          value: item.value,
          label: typeLabels[item.value] || item.value,
          count: parseInt(item.count)
        })),
        total: types.length
      };
    } catch (error) {
      console.error('Error getting job types:', error);
      throw new Error(`Failed to get job types: ${error.message}`);
    }
  }

  /**
   * Отримання рівнів досвіду
   */
  async getExperienceLevels(): Promise<{ levels: { value: string; label: string; count: number }[]; total: number }> {
    try {
      const levels = await this.getJobRepository()
        .createQueryBuilder('job')
        .select('job.experienceLevel', 'value')
        .addSelect('COUNT(*)', 'count')
        .where('job.isActive = :isActive', { isActive: true })
        .groupBy('job.experienceLevel')
        .orderBy('count', 'DESC')
        .getRawMany();

      const levelLabels = {
        [ExperienceLevel.NO_EXPERIENCE]: 'No experience',
        [ExperienceLevel.LESS_THAN_1]: 'Less than 1 year',
        [ExperienceLevel.FROM_1_TO_3]: '1-3 years',
        [ExperienceLevel.FROM_3_TO_5]: '3-5 years',
        [ExperienceLevel.FROM_5_TO_10]: '5-10 years',
        [ExperienceLevel.MORE_THAN_10]: '10+ years'
      };

      return {
        levels: levels.map(item => ({
          value: item.value,
          label: levelLabels[item.value] || item.value,
          count: parseInt(item.count)
        })),
        total: levels.length
      };
    } catch (error) {
      console.error('Error getting experience levels:', error);
      throw new Error(`Failed to get experience levels: ${error.message}`);
    }
  }

  /**
   * Отримання доступних енумів
   */
  async getAvailableEnums(): Promise<{
    jobTypes: { value: string; label: string }[];
    experienceLevels: { value: string; label: string }[];
    workModes: { value: string; label: string }[];
    salaryTypes: { value: string; label: string }[];
  }> {
    return {
      jobTypes: [
        { value: JobType.FULL_TIME, label: 'Full Time' },
        { value: JobType.PART_TIME, label: 'Part Time' },
        { value: JobType.INTERNSHIP, label: 'Internship' },
        { value: JobType.FREELANCE, label: 'Freelance' }
      ],
      experienceLevels: [
        { value: ExperienceLevel.NO_EXPERIENCE, label: 'No experience' },
        { value: ExperienceLevel.LESS_THAN_1, label: 'Less than 1 year' },
        { value: ExperienceLevel.FROM_1_TO_3, label: '1-3 years' },
        { value: ExperienceLevel.FROM_3_TO_5, label: '3-5 years' },
        { value: ExperienceLevel.FROM_5_TO_10, label: '5-10 years' },
        { value: ExperienceLevel.MORE_THAN_10, label: '10+ years' }
      ],
      workModes: [
        { value: 'remote', label: 'Remote' },
        { value: 'onsite', label: 'On-site' },
        { value: 'hybrid', label: 'Hybrid' }
      ],
      salaryTypes: [
        { value: 'fixed', label: 'Fixed' },
        { value: 'range', label: 'Range' },
        { value: 'negotiable', label: 'Negotiable' },
        { value: 'competitive', label: 'Competitive' }
      ]
    };
  }

  /**
   * Отримання вакансій
   */
  async getJobs(filters: JobSearchDto, page: number = 1, limit: number = 20): Promise<JobSearchResult> {
    return this.searchJobs(filters, page, limit);
  }

  /**
   * Отримання особистих вакансій користувача (всі статуси крім видалених)
   * Використовується для вакансій створених користувачем (createdByUserId)
   */
  async getPersonalJobs(filters: JobSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<JobSearchResult> {
    try {
      const offset = (page - 1) * limit;
      
      const queryBuilder = this.getJobRepository()
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .where('job.createdByUserId = :userId', { userId })
        .andWhere('job.isActive = :isActive', { isActive: true }); // Показуємо всі крім видалених (isActive=false)

      // Застосовуємо додаткові фільтри
      if (filters.search) {
        queryBuilder.andWhere(
          '(job.title ILIKE :search OR job.description ILIKE :search OR job.location ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      if (filters.location) {
        queryBuilder.andWhere('job.location ILIKE :location', { location: `%${filters.location}%` });
      }

      if (filters.type) {
        queryBuilder.andWhere('job.type = :type', { type: filters.type });
      }

      if (filters.experienceLevel) {
        queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel: filters.experienceLevel });
      }

      if (filters.salaryMin) {
        queryBuilder.andWhere('job.salaryMin >= :salaryMin', { salaryMin: filters.salaryMin });
      }

      if (filters.salaryMax) {
        queryBuilder.andWhere('job.salaryMax <= :salaryMax', { salaryMax: filters.salaryMax });
      }

      // НЕ фільтруємо по статусу - показуємо всі (draft, active, paused, closed)
      
      // Сортування
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'DESC';
      queryBuilder.orderBy(`job.${sortBy}`, sortOrder as 'ASC' | 'DESC');

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const jobs = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      return {
        jobs,
        total,
        page,
        limit,
        totalPages,
        filters: filters as JobSearchDto
      };
    } catch (error) {
      console.error('Error getting personal jobs:', error);
      throw new Error(`Failed to get personal jobs: ${error.message}`);
    }
  }

  /**
   * Створення вакансії
   */
  async createJob(jobData: CreateJobDto, userId: string): Promise<Job> {
    try {
      const user = await this.getUserRepository().findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const job = this.getJobRepository().create({
        ...jobData,
        createdByUserId: userId,
        status: JobStatus.DRAFT,
        isActive: true
      });

      return await this.getJobRepository().save(job);
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error(`Failed to create job: ${error.message}`);
    }
  }

  /**
   * Оновлення вакансії
   */
  async updateJob(jobId: string, updateData: UpdateJobDto, userId: string): Promise<Job | null> {
    try {
      const job = await this.getJobRepository().findOne({
        where: { id: jobId },
        relations: ['company', 'createdByUser']
      });
      
      if (!job) {
        return null;
      }

      // Перевіряємо права доступу
      if (job.createdByUserId !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Оновлюємо поля
    Object.assign(job, updateData);

    return await this.getJobRepository().save(job);
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error(`Failed to update job: ${error.message}`);
    }
  }

  /**
   * Видалення вакансії
   */
  async deleteJob(jobId: string, userId: string): Promise<boolean> {
    try {
      const job = await this.getJobRepository().findOne({
        where: { id: jobId }
      });
      
      if (!job) {
        return false;
      }

      // Перевіряємо права доступу
      if (job.createdByUserId !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Soft delete
      job.isActive = false;
      await this.getJobRepository().save(job);
      
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw new Error(`Failed to delete job: ${error.message}`);
    }
  }

  /**
   * Публікація вакансії
   */
  async publishJob(jobId: string, userId: string, publishData?: PublishJobDto): Promise<Job | null> {
    try {
      const job = await this.getJobRepository().findOne({
        where: { id: jobId },
        relations: ['company', 'createdByUser']
      });
      
      if (!job) {
        return null;
      }

      // Перевіряємо права доступу
      if (job.createdByUserId !== userId) {
        throw new Error('Insufficient permissions');
    }

    job.status = JobStatus.ACTIVE;
    job.publishedAt = new Date();

    return await this.getJobRepository().save(job);
    } catch (error) {
      console.error('Error publishing job:', error);
      throw new Error(`Failed to publish job: ${error.message}`);
    }
  }

  /**
   * Призупинення вакансії
   */
  async pauseJob(jobId: string, userId: string, pauseData?: PauseJobDto): Promise<Job | null> {
    try {
      const job = await this.getJobRepository().findOne({
        where: { id: jobId },
        relations: ['company', 'createdByUser']
      });
      
      if (!job) {
        return null;
      }

      // Перевіряємо права доступу
      if (job.createdByUserId !== userId) {
        throw new Error('Insufficient permissions');
    }

    job.status = JobStatus.PAUSED;

    return await this.getJobRepository().save(job);
    } catch (error) {
      console.error('Error pausing job:', error);
      throw new Error(`Failed to pause job: ${error.message}`);
    }
  }

  /**
   * Закриття вакансії
   */
  async closeJob(jobId: string, userId: string, closeData?: CloseJobDto): Promise<Job | null> {
    try {
      const job = await this.getJobRepository().findOne({
        where: { id: jobId },
        relations: ['company', 'createdByUser']
      });
      
      if (!job) {
        return null;
      }

      // Перевіряємо права доступу
      if (job.createdByUserId !== userId) {
        throw new Error('Insufficient permissions');
      }

    job.status = JobStatus.CLOSED;
    job.closedAt = new Date();

    return await this.getJobRepository().save(job);
    } catch (error) {
      console.error('Error closing job:', error);
      throw new Error(`Failed to close job: ${error.message}`);
    }
  }

  /**
   * Отримання статистики вакансій
   */
  async getJobStats(statsDto: JobStatsDto, userId: string): Promise<JobStats> {
    try {
      const {
        companyId,
        createdByUserId,
        startDate,
        endDate
      } = statsDto;

      const queryBuilder = this.getJobRepository()
        .createQueryBuilder('job')
        .where('job.isActive = :isActive', { isActive: true })
        .andWhere('job.status = :status', { status: 'active' }); // Тільки активні

      // Фільтр по компанії
      if (companyId) {
        queryBuilder.andWhere('job.companyId = :companyId', { companyId });
      }

      // Фільтр по створювачу
      if (createdByUserId) {
        queryBuilder.andWhere('job.createdByUserId = :createdByUserId', { createdByUserId });
      }

      // Фільтр по даті
      if (startDate) {
        queryBuilder.andWhere('job.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('job.createdAt <= :endDate', { endDate });
      }

      // Загальна кількість вакансій
      const totalJobs = await queryBuilder.getCount();

      // Статистика по статусах
      const jobsByStatus = await queryBuilder
        .clone()
        .select('job.status', 'status')
        .addSelect('COUNT(*)', 'count')
      .groupBy('job.status')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Статистика по типах
      const jobsByType = await queryBuilder
        .clone()
        .select('job.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('job.type')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Статистика по рівнях досвіду
      const jobsByExperienceLevel = await queryBuilder
        .clone()
        .select('job.experienceLevel', 'level')
        .addSelect('COUNT(*)', 'count')
        .groupBy('job.experienceLevel')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Публіковані вакансії
      const publishedJobs = await queryBuilder
        .clone()
        .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
        .getCount();

      // Чернетки
      const draftJobs = await queryBuilder
        .clone()
        .andWhere('job.status = :status', { status: JobStatus.DRAFT })
        .getCount();

      // Призупинені
      const pausedJobs = await queryBuilder
        .clone()
        .andWhere('job.status = :status', { status: JobStatus.PAUSED })
        .getCount();

      // Закриті
      const closedJobs = await queryBuilder
        .clone()
        .andWhere('job.status = :status', { status: JobStatus.CLOSED })
        .getCount();

      // Загальна кількість заявок
      const totalApplications = await this.getApplicationRepository()
        .createQueryBuilder('application')
        .leftJoin('application.job', 'job')
        .where('job.isActive = :isActive', { isActive: true })
        .getCount();

      const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;

      // Топ навички
      const topSkills = await queryBuilder
        .clone()
        .select('UNNEST(job.skills)', 'skill')
        .addSelect('COUNT(*)', 'count')
        .where('job.skills IS NOT NULL')
        .groupBy('skill')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      // Топ локації
      const topLocations = await queryBuilder
        .clone()
        .select('job.location', 'location')
        .addSelect('COUNT(*)', 'count')
        .where('job.location IS NOT NULL')
        .andWhere('job.location != :empty', { empty: '' })
        .groupBy('job.location')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      return {
        totalJobs,
        jobsByStatus: jobsByStatus.map(item => ({
          status: item.status,
          count: parseInt(item.count)
        })),
        jobsByType: jobsByType.map(item => ({
          type: item.type,
          count: parseInt(item.count)
        })),
        jobsByExperienceLevel: jobsByExperienceLevel.map(item => ({
          level: item.level,
          count: parseInt(item.count)
        })),
        publishedJobs,
        draftJobs,
        pausedJobs,
        closedJobs,
        totalApplications,
        averageApplicationsPerJob: Math.round(averageApplicationsPerJob * 100) / 100,
        topSkills: topSkills.map(item => ({
          skill: item.skill,
          count: parseInt(item.count)
        })),
        topLocations: topLocations.map(item => ({
          location: item.location,
          count: parseInt(item.count)
        }))
      };
    } catch (error) {
      console.error('Error getting job stats:', error);
      throw new Error(`Failed to get job stats: ${error.message}`);
    }
  }

  /**
   * Отримання вакансій створених користувачем (тільки для роботодавців)
   * Alias для getPersonalJobs - показує вакансії де createdByUserId = userId
   */
  async getMyCreatedJobs(filters: JobSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<JobSearchResult> {
    return this.getPersonalJobs(filters, page, limit, userId);
  }

  /**
   * Отримання конкретної вакансії
   */
  async getJob(jobId: string, userId?: string): Promise<Job | null> {
    try {
      const job = await this.getJobRepository().findOne({
        where: { id: jobId, isActive: true },
        relations: ['company', 'createdByUser', 'applicationsList']
      });

      if (!job) {
        return null;
      }

      // Збільшуємо кількість переглядів
      job.views += 1;
      await this.getJobRepository().save(job);

      return job;
    } catch (error) {
      console.error('Error getting job:', error);
      throw new Error(`Failed to get job: ${error.message}`);
    }
  }
}

// Експортуємо екземпляр сервісу для використання в контролері
export const jobService = new JobService();