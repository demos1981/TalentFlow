import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { Interview } from '../models/Interview';
import { Payment } from '../models/Payment';
import { Report, ReportTemplate, ReportSchedule, ReportType, ReportStatus, ScheduleFrequency } from '../models/Report';
import {
  GenerateReportDto,
  UpdateReportDto,
  ReportSearchDto,
  ReportTemplateDto,
  ReportScheduleDto,
  ReportExportDto,
  BulkReportActionDto,
  ReportPreviewDto
} from '../dto/ReportDto';

export interface ReportSearchResult {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ReportSearchDto;
}

export interface ReportStats {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  processingReports: number;
  pendingReports: number;
  reportsByType: Array<{ [key: string]: any; count: number; percentage: number }>;
  reportsByFormat: Array<{ [key: string]: any; count: number; percentage: number }>;
  reportsByStatus: Array<{ [key: string]: any; count: number; percentage: number }>;
  reportsByCategory: Array<{ [key: string]: any; count: number; percentage: number }>;
  totalFileSize: number;
  averageFileSize: number;
  recentReports: Report[];
  popularReportTypes: Array<{ type: string; count: number }>;
  reportUsageStats: {
    totalReports: number;
    completedReports: number;
    failedReports: number;
    totalFileSize: number;
    averageFileSize: number;
    reportsByType: Array<{ type: string; count: number }>;
    reportsByFormat: Array<{ format: string; count: number }>;
  };
}

export class ReportService {
  private reportRepository: Repository<Report>;
  private reportTemplateRepository: Repository<ReportTemplate>;
  private reportScheduleRepository: Repository<ReportSchedule>;
  private userRepository: Repository<User>;
  private companyRepository: Repository<Company>;
  private jobRepository: Repository<Job>;
  private applicationRepository: Repository<Application>;
  private interviewRepository: Repository<Interview>;
  private paymentRepository: Repository<Payment>;

  constructor() {
    this.reportRepository = AppDataSource.getRepository(Report);
    this.reportTemplateRepository = AppDataSource.getRepository(ReportTemplate);
    this.reportScheduleRepository = AppDataSource.getRepository(ReportSchedule);
    this.userRepository = AppDataSource.getRepository(User);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.jobRepository = AppDataSource.getRepository(Job);
    this.applicationRepository = AppDataSource.getRepository(Application);
    this.interviewRepository = AppDataSource.getRepository(Interview);
    this.paymentRepository = AppDataSource.getRepository(Payment);
  }

  /**
   * Генерація звіту
   */
  async generateReport(generateReportDto: GenerateReportDto, userId: string): Promise<Report> {
    try {
      const report = this.reportRepository.create({
        ...generateReportDto,
        generatedBy: userId,
        status: ReportStatus.PROCESSING
      });

      const savedReport = await this.reportRepository.save(report);

      try {
        // Генерація звіту на основі типу
        const reportData = await this.generateReportData(generateReportDto, userId);
        
        // Оновлення статусу звіту
        savedReport.status = ReportStatus.COMPLETED;
        savedReport.fileUrl = `/reports/${savedReport.id}.${generateReportDto.format}`;
        savedReport.fileSize = reportData.size;
        savedReport.completedAt = new Date();

        return await this.reportRepository.save(savedReport);
      } catch (error) {
        // Оновлення статусу звіту при помилці
        savedReport.status = ReportStatus.FAILED;
        savedReport.errorMessage = error.message;
        savedReport.completedAt = new Date();

        return await this.reportRepository.save(savedReport);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }

  /**
   * Оновлення звіту
   */
  async updateReport(reportId: string, updateReportDto: UpdateReportDto, userId: string): Promise<Report | null> {
    try {
      const report = await this.reportRepository.findOne({
        where: { id: reportId, generatedBy: userId }
      });

      if (!report) {
        return null;
      }

      Object.assign(report, updateReportDto);
      report.updatedAt = new Date();

      return await this.reportRepository.save(report);
    } catch (error) {
      console.error('Error updating report:', error);
      throw new Error(`Failed to update report: ${error.message}`);
    }
  }

  /**
   * Видалення звіту
   */
  async deleteReport(reportId: string, userId: string): Promise<boolean> {
    try {
      const report = await this.reportRepository.findOne({
        where: { id: reportId, generatedBy: userId }
      });

      if (!report) {
        return false;
      }

      report.isActive = false;
      report.updatedAt = new Date();
      await this.reportRepository.save(report);

      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error(`Failed to delete report: ${error.message}`);
    }
  }

  /**
   * Отримання звіту за ID
   */
  async getReportById(reportId: string, userId: string): Promise<Report | null> {
    try {
      return await this.reportRepository.findOne({
        where: { id: reportId, generatedBy: userId },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error getting report by ID:', error);
      throw new Error(`Failed to get report: ${error.message}`);
    }
  }

  /**
   * Отримання всіх звітів
   */
  async getAllReports(filters: ReportSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<ReportSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.reportRepository
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.user', 'user')
        .where('report.generatedBy = :userId', { userId })
        .andWhere('report.isActive = :isActive', { isActive: true });

      // Фільтри
      if (filters.query) {
        queryBuilder.andWhere(
          '(report.title ILIKE :query OR report.description ILIKE :query)',
          { query: `%${filters.query}%` }
        );
      }

      if (filters.type) {
        queryBuilder.andWhere('report.type = :type', { type: filters.type });
      }

      if (filters.format) {
        queryBuilder.andWhere('report.format = :format', { format: filters.format });
      }

      if (filters.status) {
        queryBuilder.andWhere('report.status = :status', { status: filters.status });
      }

      if (filters.category) {
        queryBuilder.andWhere('report.category = :category', { category: filters.category });
      }

      if (filters.priority) {
        queryBuilder.andWhere('report.priority = :priority', { priority: filters.priority });
      }

      if (filters.dateFrom) {
        queryBuilder.andWhere('report.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
      }

      if (filters.dateTo) {
        queryBuilder.andWhere('report.createdAt <= :dateTo', { dateTo: filters.dateTo });
      }

      if (filters.tags && filters.tags.length > 0) {
        queryBuilder.andWhere('report.metadata->\'tags\' ?| array[:...tags]', { tags: filters.tags });
      }

      // Сортування
      queryBuilder.orderBy(`report.${filters.sortBy}`, filters.sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const reports = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        reports,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        filters
      };
    } catch (error) {
      console.error('Error getting reports:', error);
      throw new Error(`Failed to get reports: ${error.message}`);
    }
  }

  /**
   * Отримання статистики звітів
   */
  async getReportStats(userId: string): Promise<ReportStats> {
    try {
      const queryBuilder = this.reportRepository
        .createQueryBuilder('report')
        .where('report.generatedBy = :userId', { userId })
        .andWhere('report.isActive = :isActive', { isActive: true });

      // Загальна кількість звітів
      const totalReports = await queryBuilder.getCount();

      // Звіти по статусах
      const completedReports = await queryBuilder
        .clone()
        .andWhere('report.status = :status', { status: ReportStatus.COMPLETED })
        .getCount();

      const failedReports = await queryBuilder
        .clone()
        .andWhere('report.status = :status', { status: ReportStatus.FAILED })
        .getCount();

      const processingReports = await queryBuilder
        .clone()
        .andWhere('report.status = :status', { status: ReportStatus.PROCESSING })
        .getCount();

      const pendingReports = await queryBuilder
        .clone()
        .andWhere('report.status = :status', { status: ReportStatus.PENDING })
        .getCount();

      // Звіти по типах
      const reportsByType = await this.getReportsByField('type', queryBuilder, userId);

      // Звіти по форматах
      const reportsByFormat = await this.getReportsByField('format', queryBuilder, userId);

      // Звіти по статусах
      const reportsByStatus = await this.getReportsByField('status', queryBuilder, userId);

      // Звіти по категоріях
      const reportsByCategory = await this.getReportsByField('category', queryBuilder, userId);

      // Розмір файлів
      const fileSizeResult = await queryBuilder
        .clone()
        .select('SUM(report.fileSize)', 'totalSize')
        .addSelect('AVG(report.fileSize)', 'avgSize')
        .where('report.fileSize IS NOT NULL')
        .getRawOne();

      const totalFileSize = parseFloat(fileSizeResult?.totalSize || '0');
      const averageFileSize = parseFloat(fileSizeResult?.avgSize || '0');

      // Останні звіти
      const recentReports = await queryBuilder
        .clone()
        .orderBy('report.createdAt', 'DESC')
        .limit(5)
        .getMany();

      // Популярні типи звітів
      const popularReportTypes = await this.getPopularReportTypes(queryBuilder, userId);

      // Статистика використання
      const reportUsageStats = await this.getReportUsageStats(queryBuilder, userId);

      return {
        totalReports,
        completedReports,
        failedReports,
        processingReports,
        pendingReports,
        reportsByType,
        reportsByFormat,
        reportsByStatus,
        reportsByCategory,
        totalFileSize: Math.round(totalFileSize * 100) / 100,
        averageFileSize: Math.round(averageFileSize * 100) / 100,
        recentReports,
        popularReportTypes,
        reportUsageStats
      };
    } catch (error) {
      console.error('Error getting report stats:', error);
      throw new Error(`Failed to get report stats: ${error.message}`);
    }
  }

  /**
   * Створення шаблону звіту
   */
  async createReportTemplate(templateData: ReportTemplateDto, userId: string): Promise<ReportTemplate> {
    try {
      const template = this.reportTemplateRepository.create({
        ...templateData,
        createdBy: userId
      });

      return await this.reportTemplateRepository.save(template);
    } catch (error) {
      console.error('Error creating report template:', error);
      throw new Error(`Failed to create report template: ${error.message}`);
    }
  }

  /**
   * Оновлення шаблону звіту
   */
  async updateReportTemplate(templateId: string, updateData: Partial<ReportTemplateDto>, userId: string): Promise<ReportTemplate | null> {
    try {
      const template = await this.reportTemplateRepository.findOne({
        where: { id: templateId, createdBy: userId }
      });

      if (!template) {
        return null;
      }

      Object.assign(template, updateData);
      template.updatedAt = new Date();

      return await this.reportTemplateRepository.save(template);
    } catch (error) {
      console.error('Error updating report template:', error);
      throw new Error(`Failed to update report template: ${error.message}`);
    }
  }

  /**
   * Видалення шаблону звіту
   */
  async deleteReportTemplate(templateId: string, userId: string): Promise<boolean> {
    try {
      const template = await this.reportTemplateRepository.findOne({
        where: { id: templateId, createdBy: userId }
      });

      if (!template) {
        return false;
      }

      template.isActive = false;
      template.updatedAt = new Date();
      await this.reportTemplateRepository.save(template);

      return true;
    } catch (error) {
      console.error('Error deleting report template:', error);
      throw new Error(`Failed to delete report template: ${error.message}`);
    }
  }

  /**
   * Отримання шаблонів звітів
   */
  async getReportTemplates(userId: string, isPublic: boolean = false): Promise<ReportTemplate[]> {
    try {
      const queryBuilder = this.reportTemplateRepository
        .createQueryBuilder('template')
        .leftJoinAndSelect('template.user', 'user')
        .where('template.isActive = :isActive', { isActive: true });

      if (isPublic) {
        queryBuilder.andWhere('template.isPublic = :isPublic', { isPublic: true });
      } else {
        queryBuilder.andWhere('template.createdBy = :userId', { userId });
      }

      return await queryBuilder
        .orderBy('template.name', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error getting report templates:', error);
      throw new Error(`Failed to get report templates: ${error.message}`);
    }
  }

  /**
   * Створення розкладу звітів
   */
  async createReportSchedule(scheduleData: ReportScheduleDto, userId: string): Promise<ReportSchedule> {
    try {
      const schedule = this.reportScheduleRepository.create({
        ...scheduleData,
        createdBy: userId
      });

      // Розрахунок наступного запуску
      schedule.nextRun = this.calculateNextRun(scheduleData.frequency, scheduleData.startDate ? new Date(scheduleData.startDate) : undefined);

      return await this.reportScheduleRepository.save(schedule);
    } catch (error) {
      console.error('Error creating report schedule:', error);
      throw new Error(`Failed to create report schedule: ${error.message}`);
    }
  }

  /**
   * Оновлення розкладу звітів
   */
  async updateReportSchedule(scheduleId: string, updateData: Partial<ReportScheduleDto>, userId: string): Promise<ReportSchedule | null> {
    try {
      const schedule = await this.reportScheduleRepository.findOne({
        where: { id: scheduleId, createdBy: userId }
      });

      if (!schedule) {
        return null;
      }

      Object.assign(schedule, updateData);
      schedule.updatedAt = new Date();

      // Перерахунок наступного запуску якщо змінилася частота
      if (updateData.frequency) {
        schedule.nextRun = this.calculateNextRun(updateData.frequency, schedule.startDate || undefined);
      }

      return await this.reportScheduleRepository.save(schedule);
    } catch (error) {
      console.error('Error updating report schedule:', error);
      throw new Error(`Failed to update report schedule: ${error.message}`);
    }
  }

  /**
   * Видалення розкладу звітів
   */
  async deleteReportSchedule(scheduleId: string, userId: string): Promise<boolean> {
    try {
      const schedule = await this.reportScheduleRepository.findOne({
        where: { id: scheduleId, createdBy: userId }
      });

      if (!schedule) {
        return false;
      }

      schedule.isActive = false;
      schedule.updatedAt = new Date();
      await this.reportScheduleRepository.save(schedule);

      return true;
    } catch (error) {
      console.error('Error deleting report schedule:', error);
      throw new Error(`Failed to delete report schedule: ${error.message}`);
    }
  }

  /**
   * Отримання розкладів звітів
   */
  async getReportSchedules(userId: string): Promise<ReportSchedule[]> {
    try {
      return await this.reportScheduleRepository.find({
        where: { createdBy: userId, isActive: true },
        relations: ['report'],
        order: { nextRun: 'ASC' }
      });
    } catch (error) {
      console.error('Error getting report schedules:', error);
      throw new Error(`Failed to get report schedules: ${error.message}`);
    }
  }

  /**
   * Експорт звіту
   */
  async exportReport(exportData: ReportExportDto, userId: string): Promise<Report> {
    try {
      const report = this.reportRepository.create({
        ...exportData,
        generatedBy: userId,
        status: ReportStatus.PROCESSING
      });

      const savedReport = await this.reportRepository.save(report);

      try {
        // Генерація даних для експорту
        const reportData = await this.generateReportData(exportData, userId);
        
        savedReport.status = ReportStatus.COMPLETED;
        savedReport.fileUrl = `/reports/${savedReport.id}.${exportData.format}`;
        savedReport.fileSize = reportData.size;
        savedReport.completedAt = new Date();

        return await this.reportRepository.save(savedReport);
      } catch (error) {
        savedReport.status = ReportStatus.FAILED;
        savedReport.errorMessage = error.message;
        savedReport.completedAt = new Date();

        return await this.reportRepository.save(savedReport);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error(`Failed to export report: ${error.message}`);
    }
  }

  /**
   * Попередній перегляд звіту
   */
  async previewReport(previewData: ReportPreviewDto, userId: string): Promise<any> {
    try {
      const reportData = await this.generateReportData(previewData, userId);
      
      return {
        type: previewData.type,
        format: 'preview',
        data: reportData.data,
        metadata: {
          totalRecords: reportData.totalRecords,
          fields: reportData.fields,
          filters: reportData.filters,
          parameters: reportData.parameters
        }
      };
    } catch (error) {
      console.error('Error previewing report:', error);
      throw new Error(`Failed to preview report: ${error.message}`);
    }
  }

  /**
   * Масові дії з звітами
   */
  async bulkReportAction(bulkData: BulkReportActionDto, userId: string): Promise<number> {
    try {
      const whereConditions: any = {
        id: bulkData.reportIds,
        generatedBy: userId,
        isActive: true
      };

      let updateData: any = { updatedAt: new Date() };

      switch (bulkData.action) {
        case 'delete':
          updateData = { ...updateData, isActive: false };
          break;
        case 'export':
          // Логіка експорту
          break;
        case 'schedule':
          // Логіка планування
          break;
        case 'cancel':
          updateData = { ...updateData, status: ReportStatus.CANCELLED };
          break;
      }

      const result = await this.reportRepository.update(whereConditions, updateData);
      return result.affected || 0;
    } catch (error) {
      console.error('Error performing bulk report action:', error);
      throw new Error(`Failed to perform bulk report action: ${error.message}`);
    }
  }

  // Приватні методи для розрахунків

  private async generateReportData(reportData: any, userId: string): Promise<{ data: any; size: number; totalRecords: number; fields: string[]; filters: any; parameters: any }> {
    const realData = await this.generateRealReportData(reportData.type, reportData.filters, userId);
    
    return {
      data: realData.data,
      size: realData.size,
      totalRecords: realData.totalRecords,
      fields: reportData.fields || realData.fields,
      filters: reportData.filters || {},
      parameters: reportData.parameters || {}
    };
  }

  private generateMockReportData(type: ReportType, filters: any): { data: any[]; size: number; totalRecords: number } {
    const mockData: any[] = [];
    let totalRecords = 0;

    switch (type) {
      case ReportType.USERS:
        totalRecords = 150;
        for (let i = 0; i < Math.min(totalRecords, 10); i++) {
          mockData.push({
            id: `user-${i + 1}`,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: i % 3 === 0 ? 'admin' : i % 2 === 0 ? 'employer' : 'candidate',
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            lastLogin: new Date(Date.now() - i * 2 * 60 * 60 * 1000)
          });
        }
        break;
      case ReportType.JOBS:
        totalRecords = 75;
        for (let i = 0; i < Math.min(totalRecords, 10); i++) {
          mockData.push({
            id: `job-${i + 1}`,
            title: `Job ${i + 1}`,
            company: `Company ${i + 1}`,
            location: i % 2 === 0 ? 'Remote' : 'New York',
            type: i % 3 === 0 ? 'full-time' : i % 2 === 0 ? 'part-time' : 'contract',
            status: i % 4 === 0 ? 'active' : 'draft',
            createdAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000)
          });
        }
        break;
      case ReportType.APPLICATIONS:
        totalRecords = 300;
        for (let i = 0; i < Math.min(totalRecords, 10); i++) {
          mockData.push({
            id: `app-${i + 1}`,
            candidate: `Candidate ${i + 1}`,
            job: `Job ${i + 1}`,
            status: i % 5 === 0 ? 'hired' : i % 4 === 0 ? 'rejected' : 'pending',
            appliedAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
            source: i % 3 === 0 ? 'website' : 'linkedin'
          });
        }
        break;
      case ReportType.INTERVIEWS:
        totalRecords = 120;
        for (let i = 0; i < Math.min(totalRecords, 10); i++) {
          mockData.push({
            id: `interview-${i + 1}`,
            candidate: `Candidate ${i + 1}`,
            job: `Job ${i + 1}`,
            type: i % 3 === 0 ? 'phone' : i % 2 === 0 ? 'video' : 'in-person',
            status: i % 4 === 0 ? 'completed' : 'scheduled',
            scheduledAt: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
            result: i % 4 === 0 ? (i % 2 === 0 ? 'passed' : 'failed') : null
          });
        }
        break;
      case ReportType.PAYMENTS:
        totalRecords = 200;
        for (let i = 0; i < Math.min(totalRecords, 10); i++) {
          mockData.push({
            id: `payment-${i + 1}`,
            user: `User ${i + 1}`,
            amount: (i + 1) * 100,
            currency: 'USD',
            status: i % 5 === 0 ? 'failed' : 'completed',
            method: i % 3 === 0 ? 'stripe' : 'paypal',
            createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000)
          });
        }
        break;
      default:
        totalRecords = 50;
        for (let i = 0; i < Math.min(totalRecords, 10); i++) {
          mockData.push({
            id: `${type}-${i + 1}`,
            name: `${type} ${i + 1}`,
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          });
        }
    }

    return {
      data: mockData,
      size: JSON.stringify(mockData).length,
      totalRecords
    };
  }

  private async generateRealReportData(type: ReportType, filters: any, userId: string): Promise<{ data: any[]; size: number; totalRecords: number; fields: string[] }> {
    let data: any[] = [];
    let totalRecords = 0;
    let fields: string[] = [];

    switch (type) {
      case ReportType.USERS:
        const usersData = await this.generateUsersReport(filters, userId);
        data = usersData.data;
        totalRecords = usersData.totalRecords;
        fields = usersData.fields;
        break;

      case ReportType.JOBS:
        const jobsData = await this.generateJobsReport(filters, userId);
        data = jobsData.data;
        totalRecords = jobsData.totalRecords;
        fields = jobsData.fields;
        break;

      case ReportType.APPLICATIONS:
        const applicationsData = await this.generateApplicationsReport(filters, userId);
        data = applicationsData.data;
        totalRecords = applicationsData.totalRecords;
        fields = applicationsData.fields;
        break;

      case ReportType.INTERVIEWS:
        const interviewsData = await this.generateInterviewsReport(filters, userId);
        data = interviewsData.data;
        totalRecords = interviewsData.totalRecords;
        fields = interviewsData.fields;
        break;

      case ReportType.PAYMENTS:
        const paymentsData = await this.generatePaymentsReport(filters, userId);
        data = paymentsData.data;
        totalRecords = paymentsData.totalRecords;
        fields = paymentsData.fields;
        break;

      default:
        throw new Error(`Unsupported report type: ${type}`);
    }

    return {
      data,
      size: JSON.stringify(data).length,
      totalRecords,
      fields
    };
  }

  // Real data generation methods for each report type

  private async generateUsersReport(filters: any, userId: string): Promise<{ data: any[]; totalRecords: number; fields: string[] }> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .where('user.isActive = :isActive', { isActive: true });

    // Apply filters
    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.status) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }

    if (filters.location) {
      queryBuilder.andWhere('user.location ILIKE :location', { location: `%${filters.location}%` });
    }

    if (filters.dateFrom) {
      queryBuilder.andWhere('user.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      queryBuilder.andWhere('user.createdAt <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    // Get total count
    const totalRecords = await queryBuilder.getCount();

    // Apply pagination if specified
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    // Order by
    queryBuilder.orderBy('user.createdAt', 'DESC');

    const users = await queryBuilder.getMany();

    const data = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      location: user.location,
      city: user.city,
      country: user.country,
      phone: user.phone,
      experience: user.experience,
      skills: user.skills,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      lastActiveAt: user.lastActiveAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      company: user.company ? {
        id: user.company.id,
        name: user.company.name
      } : null
    }));

    const fields = [
      'id', 'firstName', 'lastName', 'email', 'role', 'status', 
      'location', 'city', 'country', 'phone', 'experience', 'skills',
      'isActive', 'emailVerified', 'lastLoginAt', 'lastActiveAt', 
      'createdAt', 'updatedAt', 'company'
    ];

    return { data, totalRecords, fields };
  }

  private async generateJobsReport(filters: any, userId: string): Promise<{ data: any[]; totalRecords: number; fields: string[] }> {
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.createdByUser', 'createdByUser')
      .where('job.isActive = :isActive', { isActive: true });

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('job.status = :status', { status: filters.status });
    }

    if (filters.type) {
      queryBuilder.andWhere('job.type = :type', { type: filters.type });
    }

    if (filters.experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel: filters.experienceLevel });
    }

    if (filters.location) {
      queryBuilder.andWhere('job.location ILIKE :location', { location: `%${filters.location}%` });
    }

    if (filters.remote) {
      queryBuilder.andWhere('job.remote ILIKE :remote', { remote: `%${filters.remote}%` });
    }

    if (filters.salaryMin) {
      queryBuilder.andWhere('job.salaryMin >= :salaryMin', { salaryMin: filters.salaryMin });
    }

    if (filters.salaryMax) {
      queryBuilder.andWhere('job.salaryMax <= :salaryMax', { salaryMax: filters.salaryMax });
    }

    if (filters.dateFrom) {
      queryBuilder.andWhere('job.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      queryBuilder.andWhere('job.createdAt <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search OR job.requirements ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      queryBuilder.andWhere('job.skills && :skills', { skills: filters.skills });
    }

    // Get total count
    const totalRecords = await queryBuilder.getCount();

    // Apply pagination if specified
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    // Order by
    queryBuilder.orderBy('job.createdAt', 'DESC');

    const jobs = await queryBuilder.getMany();

    const data = jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      location: job.location,
      remote: job.remote,
      type: job.type,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      industry: job.industry,
      skills: job.skills,
      tags: job.tags,
      status: job.status,
      isUrgent: job.isUrgent,
      isFeatured: job.isFeatured,
      isActive: job.isActive,
      deadline: job.deadline,
      views: job.views,
      applications: job.applications,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      publishedAt: job.publishedAt,
      closedAt: job.closedAt,
      company: job.company ? {
        id: job.company.id,
        name: job.company.name
      } : null,
      createdByUser: job.createdByUser ? {
        id: job.createdByUser.id,
        firstName: job.createdByUser.firstName,
        lastName: job.createdByUser.lastName,
        email: job.createdByUser.email
      } : null
    }));

    const fields = [
      'id', 'title', 'description', 'requirements', 'benefits', 'location', 'remote',
      'type', 'experienceLevel', 'salaryMin', 'salaryMax', 'currency', 'department',
      'skills', 'tags', 'status', 'isUrgent', 'isFeatured', 'isActive', 'deadline',
      'views', 'applications', 'createdAt', 'updatedAt', 'publishedAt', 'closedAt',
      'company', 'createdByUser'
    ];

    return { data, totalRecords, fields };
  }

  private async generateApplicationsReport(filters: any, userId: string): Promise<{ data: any[]; totalRecords: number; fields: string[] }> {
    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.company', 'company');

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('application.status = :status', { status: filters.status });
    }

    if (filters.jobId) {
      queryBuilder.andWhere('application.jobId = :jobId', { jobId: filters.jobId });
    }

    if (filters.userId) {
      queryBuilder.andWhere('application.userId = :userId', { userId: filters.userId });
    }

    if (filters.dateFrom) {
      queryBuilder.andWhere('application.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      queryBuilder.andWhere('application.createdAt <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR job.title ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    // Get total count
    const totalRecords = await queryBuilder.getCount();

    // Apply pagination if specified
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    // Order by
    queryBuilder.orderBy('application.createdAt', 'DESC');

    const applications = await queryBuilder.getMany();

    const data = applications.map(application => ({
      id: application.id,
      status: application.status,
      coverLetter: application.coverLetter,
      attachments: application.attachments,
      matchScore: application.matchScore,
      notes: application.notes,
      reviewedAt: application.reviewedAt,
      reviewedBy: application.reviewedBy,
      shortlistedAt: application.shortlistedAt,
      interviewedAt: application.interviewedAt,
      offeredAt: application.offeredAt,
      hiredAt: application.hiredAt,
      rejectedAt: application.rejectedAt,
      rejectionReason: application.rejectionReason,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      user: application.user ? {
        id: application.user.id,
        firstName: application.user.firstName,
        lastName: application.user.lastName,
        email: application.user.email,
        location: application.user.location,
        experience: application.user.experience,
        skills: application.user.skills
      } : null,
      job: application.job ? {
        id: application.job.id,
        title: application.job.title,
        location: application.job.location,
        type: application.job.type,
        experienceLevel: application.job.experienceLevel,
        salaryMin: application.job.salaryMin,
        salaryMax: application.job.salaryMax,
        company: application.job.company ? {
          id: application.job.company.id,
          name: application.job.company.name
        } : null
      } : null
    }));

    const fields = [
      'id', 'status', 'coverLetter', 'attachments', 'matchScore', 'notes',
      'reviewedAt', 'reviewedBy', 'shortlistedAt', 'interviewedAt', 'offeredAt',
      'hiredAt', 'rejectedAt', 'rejectionReason', 'createdAt', 'updatedAt',
      'user', 'job'
    ];

    return { data, totalRecords, fields };
  }

  private async generateInterviewsReport(filters: any, userId: string): Promise<{ data: any[]; totalRecords: number; fields: string[] }> {
    const queryBuilder = this.interviewRepository
      .createQueryBuilder('interview')
      .leftJoinAndSelect('interview.application', 'application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('interview.createdBy', 'createdBy');

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('interview.status = :status', { status: filters.status });
    }

    if (filters.type) {
      queryBuilder.andWhere('interview.type = :type', { type: filters.type });
    }

    if (filters.result) {
      queryBuilder.andWhere('interview.result = :result', { result: filters.result });
    }

    if (filters.dateFrom) {
      queryBuilder.andWhere('interview.scheduledDate >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      queryBuilder.andWhere('interview.scheduledDate <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(interview.title ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR job.title ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    // Get total count
    const totalRecords = await queryBuilder.getCount();

    // Apply pagination if specified
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    // Order by
    queryBuilder.orderBy('interview.scheduledDate', 'DESC');

    const interviews = await queryBuilder.getMany();

    const data = interviews.map(interview => ({
      id: interview.id,
      title: interview.title,
      description: interview.description,
      type: interview.type,
      status: interview.status,
      result: interview.result,
      scheduledDate: interview.scheduledDate,
      duration: interview.duration,
      location: interview.location,
      meetingLink: interview.meetingLink,
      notes: interview.notes,
      feedback: interview.feedback,
      overallRating: interview.overallRating,
      technicalSkills: interview.technicalSkills,
      communicationSkills: interview.communicationSkills,
      culturalFit: interview.culturalFit,
      wouldRecommend: interview.wouldRecommend,
      nextSteps: interview.nextSteps,
      reason: interview.reason,
      startedAt: interview.startedAt,
      completedAt: interview.completedAt,
      cancelledAt: interview.cancelledAt,
      cancellationReason: interview.cancellationReason,
      isActive: interview.isActive,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
      application: interview.application ? {
        id: interview.application.id,
        status: interview.application.status,
        matchScore: interview.application.matchScore
      } : null,
      user: interview.application?.user ? {
        id: interview.application.user.id,
        firstName: interview.application.user.firstName,
        lastName: interview.application.user.lastName,
        email: interview.application.user.email
      } : null,
      job: interview.application?.job ? {
        id: interview.application.job.id,
        title: interview.application.job.title,
        company: interview.application.job.company ? {
          id: interview.application.job.company.id,
          name: interview.application.job.company.name
        } : null
      } : null,
      createdBy: interview.createdBy ? {
        id: interview.createdBy.id,
        firstName: interview.createdBy.firstName,
        lastName: interview.createdBy.lastName,
        email: interview.createdBy.email
      } : null
    }));

    const fields = [
      'id', 'title', 'description', 'type', 'status', 'result', 'scheduledDate',
      'duration', 'location', 'meetingLink', 'notes', 'feedback', 'overallRating',
      'technicalSkills', 'communicationSkills', 'culturalFit', 'wouldRecommend',
      'nextSteps', 'reason', 'startedAt', 'completedAt', 'cancelledAt',
      'cancellationReason', 'isActive', 'createdAt', 'updatedAt', 'application',
      'user', 'job', 'createdBy'
    ];

    return { data, totalRecords, fields };
  }

  private async generatePaymentsReport(filters: any, userId: string): Promise<{ data: any[]; totalRecords: number; fields: string[] }> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.job', 'job')
      .leftJoinAndSelect('job.company', 'company');

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('payment.status = :status', { status: filters.status });
    }

    if (filters.method) {
      queryBuilder.andWhere('payment.method = :method', { method: filters.method });
    }

    if (filters.currency) {
      queryBuilder.andWhere('payment.currency = :currency', { currency: filters.currency });
    }

    if (filters.amountMin) {
      queryBuilder.andWhere('payment.amount >= :amountMin', { amountMin: filters.amountMin });
    }

    if (filters.amountMax) {
      queryBuilder.andWhere('payment.amount <= :amountMax', { amountMax: filters.amountMax });
    }

    if (filters.dateFrom) {
      queryBuilder.andWhere('payment.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      queryBuilder.andWhere('payment.createdAt <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(payment.transactionId ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    // Get total count
    const totalRecords = await queryBuilder.getCount();

    // Apply pagination if specified
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    // Order by
    queryBuilder.orderBy('payment.createdAt', 'DESC');

    const payments = await queryBuilder.getMany();

    const data = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      transactionId: payment.transactionId,
      description: payment.description,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: payment.user ? {
        id: payment.user.id,
        firstName: payment.user.firstName,
        lastName: payment.user.lastName,
        email: payment.user.email
      } : null,
      job: payment.job ? {
        id: payment.job.id,
        title: payment.job.title,
        company: payment.job.company ? {
          id: payment.job.company.id,
          name: payment.job.company.name
        } : null
      } : null
    }));

    const fields = [
      'id', 'amount', 'currency', 'status', 'method', 'transactionId',
      'description', 'metadata', 'createdAt', 'updatedAt', 'user', 'job'
    ];

    return { data, totalRecords, fields };
  }

  private async getReportsByField(field: string, queryBuilder: any, userId: string): Promise<Array<{ [key: string]: any; count: number; percentage: number }>> {
    const results = await queryBuilder
      .clone()
      .select(`report.${field}`, field)
      .addSelect('COUNT(*)', 'count')
      .groupBy(`report.${field}`)
      .orderBy('count', 'DESC')
      .getRawMany();

    const total = results.reduce((sum, result) => sum + parseInt(result.count), 0);

    return results.map(result => {
      const obj: any = {
        count: parseInt(result.count),
        percentage: total > 0 ? Math.round((parseInt(result.count) / total) * 100 * 100) / 100 : 0
      };
      obj[field] = result[field];
      return obj;
    });
  }

  private async getPopularReportTypes(queryBuilder: any, userId: string): Promise<Array<{ type: string; count: number }>> {
    const results = await queryBuilder
      .clone()
      .select('report.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('report.type')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return results.map(result => ({
      type: result.type,
      count: parseInt(result.count)
    }));
  }

  private async getReportUsageStats(queryBuilder: any, userId: string): Promise<any> {
    const totalReports = await queryBuilder.getCount();
    const completedReports = await queryBuilder
      .clone()
      .andWhere('report.status = :status', { status: ReportStatus.COMPLETED })
      .getCount();
    const failedReports = await queryBuilder
      .clone()
      .andWhere('report.status = :status', { status: ReportStatus.FAILED })
      .getCount();

    const fileSizeResult = await queryBuilder
      .clone()
      .select('SUM(report.fileSize)', 'totalSize')
      .addSelect('AVG(report.fileSize)', 'avgSize')
      .where('report.fileSize IS NOT NULL')
      .getRawOne();

    const totalFileSize = parseFloat(fileSizeResult?.totalSize || '0');
    const averageFileSize = parseFloat(fileSizeResult?.avgSize || '0');

    const reportsByType = await this.getReportsByField('type', queryBuilder, userId);
    const reportsByFormat = await this.getReportsByField('format', queryBuilder, userId);

    return {
      totalReports,
      completedReports,
      failedReports,
      totalFileSize: Math.round(totalFileSize * 100) / 100,
      averageFileSize: Math.round(averageFileSize * 100) / 100,
      reportsByType,
      reportsByFormat
    };
  }

  private calculateNextRun(frequency: ScheduleFrequency, startDate?: Date): Date {
    const now = new Date();
    const start = startDate || now;

    switch (frequency) {
      case ScheduleFrequency.DAILY:
        return new Date(start.getTime() + 24 * 60 * 60 * 1000);
      case ScheduleFrequency.WEEKLY:
        return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      case ScheduleFrequency.MONTHLY:
        return new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
      case ScheduleFrequency.QUARTERLY:
        return new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
      case ScheduleFrequency.YEARLY:
        return new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(start.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}

export const reportService = new ReportService();