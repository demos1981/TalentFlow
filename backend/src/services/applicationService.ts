import { Repository } from 'typeorm';
import { Application } from '../models/Application';
import { BaseService } from './baseService';
import { AppDataSource } from '../config/database';

export class ApplicationService extends BaseService<Application> {
  constructor() {
    super(AppDataSource.getRepository(Application));
  }

  /**
   * Створення нової заявки
   */
  async createApplication(applicationData: any, userId: string): Promise<Application> {
    try {
      const application = this.repository.create({
        ...applicationData,
        userId,
        status: 'pending'
      });
      
      const savedApplication = await this.repository.save(application);
      
      return Array.isArray(savedApplication) ? savedApplication[0] : savedApplication;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error(`Error creating application: ${error.message}`);
    }
  }

  /**
   * Отримання всіх заявок з фільтрацією
   */
  async getAllApplications(filters: any): Promise<{ applications: Application[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const page = parseInt(filters.page as string) || 1;
      const limit = parseInt(filters.limit as string) || 20;
      const offset = (page - 1) * limit;

      const queryBuilder = this.repository.createQueryBuilder('application')
        .leftJoinAndSelect('application.user', 'user')
        .leftJoinAndSelect('application.job', 'job');

      // Фільтри
      if (filters.jobId) {
        queryBuilder.andWhere('application.jobId = :jobId', { jobId: filters.jobId });
      }

      if (filters.candidateId) {
        queryBuilder.andWhere('application.userId = :candidateId', { candidateId: filters.candidateId });
      }

      if (filters.employerId) {
        queryBuilder.andWhere('job.createdByUserId = :employerId', { employerId: filters.employerId });
      }

      if (filters.status) {
        queryBuilder.andWhere('application.status = :status', { status: filters.status });
      }

      if (filters.dateFrom) {
        queryBuilder.andWhere('application.createdAt >= :dateFrom', { dateFrom: new Date(filters.dateFrom) });
      }

      if (filters.dateTo) {
        queryBuilder.andWhere('application.createdAt <= :dateTo', { dateTo: new Date(filters.dateTo) });
      }

      // Сортування
      queryBuilder.orderBy('application.createdAt', 'DESC');

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const applications = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      return {
        applications,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      throw new Error(`Error getting applications: ${error.message}`);
    }
  }

  /**
   * Отримання заявок роботодавця
   */
  async getEmployerApplications(employerId: string, filters: any): Promise<{ applications: Application[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const page = parseInt(filters.page as string) || 1;
      const limit = parseInt(filters.limit as string) || 20;
      const offset = (page - 1) * limit;

      const queryBuilder = this.repository.createQueryBuilder('application')
        .leftJoinAndSelect('application.user', 'user')
        .leftJoinAndSelect('application.job', 'job')
        .where('job.createdByUserId = :employerId', { employerId });

      // Додаткові фільтри
      if (filters.status) {
        queryBuilder.andWhere('application.status = :status', { status: filters.status });
      }

      if (filters.jobId) {
        queryBuilder.andWhere('application.jobId = :jobId', { jobId: filters.jobId });
      }

      if (filters.dateFrom) {
        queryBuilder.andWhere('application.createdAt >= :dateFrom', { dateFrom: new Date(filters.dateFrom) });
      }

      if (filters.dateTo) {
        queryBuilder.andWhere('application.createdAt <= :dateTo', { dateTo: new Date(filters.dateTo) });
      }

      // Сортування
      queryBuilder.orderBy('application.createdAt', 'DESC');

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const applications = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      return {
        applications,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      throw new Error(`Error getting employer applications: ${error.message}`);
    }
  }

  /**
   * Отримання заявки за ID
   */
  async getApplicationById(id: string): Promise<Application | null> {
    try {
      const application = await this.repository.findOne({
        where: { id },
        relations: ['user', 'job']
      });
      return application;
    } catch (error) {
      throw new Error(`Error getting application: ${error.message}`);
    }
  }

  /**
   * Оновлення заявки
   */
  async updateApplication(id: string, updateData: any): Promise<Application | null> {
    try {
      const application = await this.repository.findOne({ where: { id } });
      if (!application) {
        throw new Error('Application not found');
      }

      // Оновлюємо поля
      if (updateData.coverLetter !== undefined) application.coverLetter = updateData.coverLetter;
      if (updateData.attachments !== undefined) application.attachments = updateData.attachments;
      if (updateData.matchScore !== undefined) application.matchScore = updateData.matchScore;
      if (updateData.notes !== undefined) application.notes = updateData.notes;
      if (updateData.status !== undefined) application.status = updateData.status;
      if (updateData.rejectionReason !== undefined) application.rejectionReason = updateData.rejectionReason;

      application.updatedAt = new Date();
      const updatedApplication = await this.repository.save(application);
      return updatedApplication;
    } catch (error) {
      throw new Error(`Error updating application: ${error.message}`);
    }
  }

  /**
   * Видалення заявки
   */
  async deleteApplication(id: string): Promise<void> {
    try {
      const application = await this.repository.findOne({ where: { id } });
      if (!application) {
        throw new Error('Application not found');
      }

      await this.repository.remove(application);
    } catch (error) {
      throw new Error(`Error deleting application: ${error.message}`);
    }
  }

  async getApplicationsByUser(userId: string, page: number = 1, limit: number = 20): Promise<{ applications: Application[]; total: number }> {
    try {
      const applications = await this.repository.find({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['job']
      });

      const total = await this.repository.count({ where: { userId } });

      return { applications, total };
    } catch (error) {
      throw new Error(`Error getting user applications: ${error.message}`);
    }
  }

  async getApplicationsByJob(jobId: string, page: number = 1, limit: number = 20): Promise<{ applications: Application[]; total: number }> {
    try {
      const applications = await this.repository.find({
        where: { jobId },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      const total = await this.repository.count({ where: { jobId } });

      return { applications, total };
    } catch (error) {
      throw new Error(`Помилка отримання заявок на вакансію: ${error.message}`);
    }
  }

  async updateApplicationStatus(applicationId: string, status: string, reviewedBy?: string): Promise<Application | null> {
    try {
      const updateData: any = { status };
      
      if (status === 'approved') {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = reviewedBy;
      } else if (status === 'interview') {
        updateData.interviewedAt = new Date();
      } else if (status === 'hired') {
        updateData.hiredAt = new Date();
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
      }

      return await this.update(applicationId, updateData);
    } catch (error) {
      throw new Error(`Помилка оновлення статусу заявки: ${error.message}`);
    }
  }

  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    interview: number;
    hired: number;
    rejected: number;
  }> {
    try {
      const [
        total,
        pending,
        approved,
        interview,
        hired,
        rejected
      ] = await Promise.all([
        this.repository.count(),
        this.repository.count({ where: { status: 'pending' } }),
        this.repository.count({ where: { status: 'approved' } }),
        this.repository.count({ where: { status: 'interview' } }),
        this.repository.count({ where: { status: 'hired' } }),
        this.repository.count({ where: { status: 'rejected' } })
      ]);

      return {
        total,
        pending,
        approved,
        interview,
        hired,
        rejected
      };
    } catch (error) {
      throw new Error(`Помилка отримання статистики заявок: ${error.message}`);
    }
  }

  async findByEmployer(employerId: string): Promise<Application[]> {
    try {
      // Отримуємо всі заявки на вакансії роботодавця
      // Для цього потрібно з'єднати з таблицею вакансій
      const applications = await this.repository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .where('job.createdByUserId = :employerId', { employerId })
        .orderBy('application.createdAt', 'DESC')
        .getMany();

      return applications;
    } catch (error) {
      throw new Error(`Error getting employer applications: ${error.message}`);
    }
  }
}

export const applicationService = new ApplicationService();
