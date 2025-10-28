import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { Interview } from '../models/Interview';
import { Company } from '../models/Company';
import { Event } from '../models/Event';
import { UserStatus } from '../models/User';
import { JobStatus } from '../models/Job';

// Simple in-memory cache for Railway (no Redis needed)
class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new SimpleCache();

// Cleanup cache every 10 minutes
setInterval(() => cache.cleanup(), 10 * 60 * 1000);

export class AnalyticsService {
  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  /**
   * Отримання даних за останні 3 місяці
   */
  private getDateRangeForPeriod(period: string = 'month') {
    const now = new Date();
    let dateFrom = new Date(now);
    
    switch (period) {
      case 'week':
        dateFrom.setDate(now.getDate() - 3 * 7); // Last 3 weeks
        break;
      case 'month':
        dateFrom.setMonth(now.getMonth() - 3); // Last 3 months
        break;
      case 'quarter':
        dateFrom.setMonth(now.getMonth() - 3 * 3); // Last 3 quarters (9 months)
        break;
      case 'year':
        dateFrom.setFullYear(now.getFullYear() - 3); // Last 3 years
        break;
      default:
        dateFrom.setMonth(now.getMonth() - 3); // Default to last 3 months
    }
    
    return {
      dateFrom,
      dateTo: now
    };
  }

  /**
   * Генерація даних за період
   */
  private async generatePeriodData(
    period: string, 
    dateFrom: Date, 
    dateTo: Date, 
    queryCallback: (start: Date, end: Date) => Promise<number>
  ) {
    const data = [];
    const now = new Date();
    
    if (period === 'week') {
      // 3 тижні
      const weeks = ['Тиждень 1', 'Тиждень 2', 'Тиждень 3'];
      for (let i = 2; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const count = await queryCallback(weekStart, weekEnd);
        data.push({
          period: weeks[2 - i],
          count
        });
      }
    } else if (period === 'month') {
      // 3 місяці
      const months = ['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
                     'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'];
      
      for (let i = 2; i >= 0; i--) {
        const monthStart = new Date(now);
        monthStart.setMonth(monthStart.getMonth() - i, 1);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        
        const count = await queryCallback(monthStart, monthEnd);
        data.push({
          period: months[monthStart.getMonth()],
          count
        });
      }
    } else if (period === 'quarter') {
      // 3 квартали
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      for (let i = 2; i >= 0; i--) {
        const quarterStart = new Date(now);
        quarterStart.setMonth(quarterStart.getMonth() - i * 3, 1);
        const quarterEnd = new Date(quarterStart);
        quarterEnd.setMonth(quarterEnd.getMonth() + 2, 31);
        quarterEnd.setHours(23, 59, 59, 999);
        
        const count = await queryCallback(quarterStart, quarterEnd);
        const quarterIndex = Math.floor(quarterStart.getMonth() / 3);
        data.push({
          period: quarters[quarterIndex],
          count
        });
      }
    } else if (period === 'year') {
      // 3 роки
      for (let i = 2; i >= 0; i--) {
        const yearStart = new Date(now);
        yearStart.setFullYear(yearStart.getFullYear() - i, 0, 1);
        const yearEnd = new Date(yearStart);
        yearEnd.setFullYear(yearEnd.getFullYear() + 1, 0, 0);
        yearEnd.setHours(23, 59, 59, 999);
        
        const count = await queryCallback(yearStart, yearEnd);
        data.push({
          period: yearStart.getFullYear().toString(),
          count
        });
      }
    }
    
    return data;
  }

  /**
   * Отримання реальних метрик аналітики
   */
  async getRealAnalyticsMetrics(period: string = 'month', companyId?: string): Promise<any> {
    try {
      const { dateFrom, dateTo } = this.getDateRangeForPeriod(period);
      const cacheKey = `analytics_metrics_${companyId || 'all'}_${dateFrom.toISOString()}_${dateTo.toISOString()}`;
      
      // Перевіряємо кеш
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        userStats,
        jobStats,
        applicationStats,
        interviewStats,
        companyStats
      ] = await Promise.all([
        this.getUserAnalytics(period, dateFrom, dateTo, companyId),
        this.getJobAnalytics(period, dateFrom, dateTo, companyId),
        this.getApplicationAnalytics(period, dateFrom, dateTo, companyId),
        this.getInterviewAnalytics(period, dateFrom, dateTo, companyId),
        this.getCompanyAnalytics(period, dateFrom, dateTo, companyId)
      ]);

      const metrics = {
        users: userStats,
        jobs: jobStats,
        applications: applicationStats,
        interviews: interviewStats,
        companies: companyStats,
        period: {
          from: dateFrom.toISOString(),
          to: dateTo.toISOString()
        }
      };

      // Кешуємо на 5 хвилин
      cache.set(cacheKey, metrics, 5 * 60 * 1000);
      
      return metrics;
    } catch (error) {
      console.error('Error getting real analytics metrics:', error);
      throw new Error('Failed to fetch real analytics metrics');
    }
  }

  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  private getJobRepository() {
    return AppDataSource.getRepository(Job);
  }

  private getApplicationRepository() {
    return AppDataSource.getRepository(Application);
  }

  private getInterviewRepository() {
    return AppDataSource.getRepository(Interview);
  }

  private getCompanyRepository() {
    return AppDataSource.getRepository(Company);
  }

  /**
   * Аналітика користувачів за останні 3 місяці
   */
  private async getUserAnalytics(period: string, dateFrom: Date, dateTo: Date, companyId?: string) {
    try {
      const userRepo = this.getUserRepository();
      
      // Загальна статистика користувачів
      const totalUsers = await userRepo.count();
      const newUsers = await userRepo
        .createQueryBuilder('user')
        .where('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt <= :dateTo', { dateTo })
        .getCount();

      // Активні користувачі (заходили за останні 30 днів)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsers = await userRepo
        .createQueryBuilder('user')
        .where('user.lastActiveAt >= :thirtyDaysAgo', { thirtyDaysAgo })
        .getCount();

      // Розподіл по ролях
      const usersByRole = await userRepo
        .createQueryBuilder('user')
        .select('user.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .groupBy('user.role')
        .getRawMany();

      // Статистика за період
      const periodData = await this.generatePeriodData(
        period,
        dateFrom,
        dateTo,
        async (start: Date, end: Date) => {
          return await userRepo
            .createQueryBuilder('user')
            .where('user.createdAt >= :start', { start })
            .andWhere('user.createdAt <= :end', { end })
            .getCount();
        }
      );

      const monthlyData = periodData.map(item => ({
        month: item.period,
        count: item.count
      }));

      return {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        byRole: usersByRole,
        monthlyGrowth: monthlyData,
        growthRate: this.calculateGrowthRate(newUsers, totalUsers - newUsers)
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return {
        total: 0,
        new: 0,
        active: 0,
        byRole: [],
        monthlyGrowth: [],
        growthRate: 0
      };
    }
  }

  /**
   * Аналітика вакансій за останні 3 місяці
   */
  private async getJobAnalytics(period: string, dateFrom: Date, dateTo: Date, companyId?: string) {
    try {
      const jobRepo = this.getJobRepository();
      
      // Загальна статистика вакансій
      let totalJobsQuery = jobRepo
        .createQueryBuilder('job')
        .where('job.createdAt >= :dateFrom', { dateFrom })
        .andWhere('job.createdAt <= :dateTo', { dateTo });
      
      if (companyId) {
        totalJobsQuery = totalJobsQuery.andWhere('job.companyId = :companyId', { companyId });
      }
      
      const totalJobs = await totalJobsQuery.getCount();
      
      const activeJobs = await totalJobsQuery
        .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
        .getCount();
      
      const closedJobs = await totalJobsQuery
        .andWhere('job.status = :status', { status: JobStatus.CLOSED })
        .getCount();

      // Розподіл по індустріях
      const jobsByIndustry = await jobRepo
        .createQueryBuilder('job')
        .select('job.industry', 'industry')
        .addSelect('COUNT(*)', 'count')
        .where('job.createdAt >= :dateFrom', { dateFrom })
        .andWhere('job.createdAt <= :dateTo', { dateTo })
        .andWhere('job.industry IS NOT NULL')
        .groupBy('job.industry')
        .getRawMany();

      // Статистика за період
      const periodData = await this.generatePeriodData(
        period,
        dateFrom,
        dateTo,
        async (start: Date, end: Date) => {
          let query = jobRepo
            .createQueryBuilder('job')
            .where('job.createdAt >= :start', { start })
            .andWhere('job.createdAt <= :end', { end });
          
          if (companyId) {
            query = query.andWhere('job.companyId = :companyId', { companyId });
          }
          
          return await query.getCount();
        }
      );

      const monthlyData = periodData.map(item => ({
        month: item.period,
        count: item.count
      }));

      return {
        total: totalJobs,
        active: activeJobs,
        closed: closedJobs,
        byIndustry: jobsByIndustry,
        monthlyTrend: monthlyData,
        growthRate: this.calculateGrowthRate(activeJobs, closedJobs)
      };
    } catch (error) {
      console.error('Error getting job analytics:', error);
      return {
        total: 0,
        active: 0,
        closed: 0,
        byIndustry: [],
        monthlyTrend: [],
        growthRate: 0
      };
    }
  }

  /**
   * Аналітика заявок за останні 3 місяці
   */
  private async getApplicationAnalytics(period: string, dateFrom: Date, dateTo: Date, companyId?: string) {
    try {
      const applicationRepo = this.getApplicationRepository();
      
      // Загальна статистика заявок
      const totalApplications = await applicationRepo
        .createQueryBuilder('application')
        .where('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo })
        .getCount();
      
      // Заявки по статусах
      const applicationsByStatus = await applicationRepo
        .createQueryBuilder('application')
        .select('application.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo })
        .groupBy('application.status')
        .getRawMany();

      // Статистика за період
      const periodData = await this.generatePeriodData(
        period,
        dateFrom,
        dateTo,
        async (start: Date, end: Date) => {
          return await applicationRepo
            .createQueryBuilder('application')
            .where('application.createdAt >= :start', { start })
            .andWhere('application.createdAt <= :end', { end })
            .getCount();
        }
      );

      const monthlyData = periodData.map(item => ({
        month: item.period,
        count: item.count
      }));

      return {
        total: totalApplications,
        byStatus: applicationsByStatus,
        monthlyTrend: monthlyData,
        conversionRate: this.calculateConversionRate(applicationsByStatus)
      };
    } catch (error) {
      console.error('Error getting application analytics:', error);
      return {
        total: 0,
        byStatus: [],
        monthlyTrend: [],
        conversionRate: 0
      };
    }
  }

  /**
   * Аналітика інтерв'ю за останні 3 місяці
   */
  private async getInterviewAnalytics(period: string, dateFrom: Date, dateTo: Date, companyId?: string) {
    try {
      const interviewRepo = this.getInterviewRepository();
      
      // Загальна статистика інтерв'ю
      const totalInterviews = await interviewRepo
        .createQueryBuilder('interview')
        .where('interview.createdAt >= :dateFrom', { dateFrom })
        .andWhere('interview.createdAt <= :dateTo', { dateTo })
        .getCount();
      
      // Інтерв'ю по статусах
      const interviewsByStatus = await interviewRepo
        .createQueryBuilder('interview')
        .select('interview.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('interview.createdAt >= :dateFrom', { dateFrom })
        .andWhere('interview.createdAt <= :dateTo', { dateTo })
        .groupBy('interview.status')
        .getRawMany();

      return {
        total: totalInterviews,
        byStatus: interviewsByStatus
      };
    } catch (error) {
      console.error('Error getting interview analytics:', error);
      return {
        total: 0,
        byStatus: []
      };
    }
  }

  /**
   * Аналітика компаній за останні 3 місяці
   */
  private async getCompanyAnalytics(period: string, dateFrom: Date, dateTo: Date, companyId?: string) {
    try {
      const companyRepo = this.getCompanyRepository();
      
      // Загальна статистика компаній
      const totalCompanies = await companyRepo.count();
      const newCompanies = await companyRepo
        .createQueryBuilder('company')
        .where('company.createdAt >= :dateFrom', { dateFrom })
        .andWhere('company.createdAt <= :dateTo', { dateTo })
        .getCount();

      // Активні компанії (мають активні вакансії)
      const activeCompanies = await companyRepo
        .createQueryBuilder('company')
        .leftJoin('company.jobs', 'job')
        .where('job.status = :status', { status: JobStatus.ACTIVE })
        .andWhere('company.createdAt >= :dateFrom', { dateFrom })
        .andWhere('company.createdAt <= :dateTo', { dateTo })
        .distinct(true)
        .getCount();

      return {
        total: totalCompanies,
        new: newCompanies,
        active: activeCompanies
      };
    } catch (error) {
      console.error('Error getting company analytics:', error);
      return {
        total: 0,
        new: 0,
        active: 0
      };
    }
  }

  /**
   * Розрахунок темпу зростання
   */
  private calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }

  /**
   * Розрахунок конверсії
   */
  private calculateConversionRate(applicationsByStatus: any[]): number {
    const hiredCount = applicationsByStatus.find(item => item.status === 'hired')?.count || 0;
    const totalCount = applicationsByStatus.reduce((sum, item) => sum + parseInt(item.count), 0);
    
    if (totalCount === 0) return 0;
    return Math.round((hiredCount / totalCount) * 100 * 100) / 100;
  }

  private getEventRepository() {
    return AppDataSource.getRepository(Event);
  }

  async getKeyMetrics(period: string = 'month', companyId?: string): Promise<any> {
    try {
      return await this.getRealAnalyticsMetrics(period, companyId);
    } catch (error) {
      console.error('Error getting key metrics:', error);
      throw new Error('Failed to fetch key metrics');
    }
  }

  async getDashboardData(companyId?: string, days: number = 30): Promise<any> {
    const cacheKey = `dashboard_data_${companyId || 'all'}_${days}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Паралельні запити для швидкості
      const [
        recentActivity,
        topJobs,
        applicationsTrend,
        userGrowth
      ] = await Promise.all([
        this.getRecentActivity(companyId, startDate),
        this.getTopJobs(companyId),
        this.getApplicationsTrend(startDate),
        this.getUserGrowth(startDate)
      ]);

      const result = {
        recentActivity,
        topJobs,
        applicationsTrend,
        userGrowth,
        generatedAt: new Date()
      };

      // Кешуємо на 2 хвилини
      cache.set(cacheKey, result, 2 * 60 * 1000);
      return result;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // Приватні методи для оптимізованих запитів
  private async getRecentActivity(companyId?: string, startDate?: Date) {
    return await this.getEventRepository()
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'user')
      .leftJoinAndSelect('event.job', 'job')
      .where('event.createdAt >= :startDate', { startDate })
      .andWhere(companyId ? 'event.companyId = :companyId' : '1=1', { companyId })
      .orderBy('event.createdAt', 'DESC')
      .limit(10)
      .getMany();
  }

  private async getTopJobs(companyId?: string) {
    return await this.getJobRepository()
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where(companyId ? 'job.companyId = :companyId' : '1=1', { companyId })
      .orderBy('job.applications', 'DESC')
      .limit(5)
      .getMany();
  }

  private async getApplicationsTrend(startDate: Date) {
    return await this.getApplicationRepository()
      .createQueryBuilder('application')
      .select('DATE(application.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('application.createdAt >= :startDate', { startDate })
      .groupBy('DATE(application.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  private async getUserGrowth(startDate: Date) {
    return await this.getUserRepository()
      .createQueryBuilder('user')
      .select('DATE(user.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt >= :startDate', { startDate })
      .groupBy('DATE(user.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }



  async getPerformanceMetrics(companyId?: string, days: number = 30): Promise<any> {
    const cacheKey = `performance_metrics_${companyId || 'all'}_${days}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const whereCondition = companyId ? { companyId } : {};

      // Get all applications in the period
      const applications = await this.getApplicationRepository()
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .where('application.createdAt >= :startDate', { startDate })
        .andWhere(companyId ? 'job.companyId = :companyId' : '1=1', { companyId })
        .getMany();

      // Calculate conversion rates
      const totalApplications = applications.length;
      const shortlisted = applications.filter(app => app.status === 'approved').length;
      const interviewed = applications.filter(app => app.status === 'interview').length;
      const offered = applications.filter(app => app.status === 'hired').length;
      const hired = applications.filter(app => app.status === 'hired').length;

      const conversionRates = {
        applicationToShortlist: totalApplications > 0 ? (shortlisted / totalApplications * 100).toFixed(2) : 0,
        shortlistToInterview: shortlisted > 0 ? (interviewed / shortlisted * 100).toFixed(2) : 0,
        interviewToOffer: interviewed > 0 ? (offered / interviewed * 100).toFixed(2) : 0,
        offerToHire: offered > 0 ? (hired / offered * 100).toFixed(2) : 0,
        overallHireRate: totalApplications > 0 ? (hired / totalApplications * 100).toFixed(2) : 0
      };

      // Calculate average time to hire
      const hiredApplications = applications.filter(app => app.status === 'hired' && app.hiredAt);
      const timeToHire = hiredApplications.length > 0 
        ? hiredApplications.reduce((sum, app) => {
            const timeDiff = new Date(app.hiredAt!).getTime() - new Date(app.createdAt).getTime();
            return sum + (timeDiff / (1000 * 60 * 60 * 24)); // days
          }, 0) / hiredApplications.length
        : 0;

      // Calculate cost per hire (simplified - would need payment data)
      const costPerHire = hired > 0 ? 5000 : 0; // Placeholder

      const result = {
        conversionRates,
        timeToHire: Math.round(timeToHire),
        costPerHire,
        totalApplications,
        shortlisted,
        interviewed,
        offered,
        hired
      };

      // Кешуємо на 10 хвилин
      cache.set(cacheKey, result, 10 * 60 * 1000);
      return result;
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw new Error('Failed to fetch performance metrics');
    }
  }

  async getChartData(companyId?: string, chartType: string = 'applications', days: number = 30): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string | string[];
      tension?: number;
      borderWidth?: number;
    }>;
  }> {
    const cacheKey = `chart_data_${chartType}_${companyId || 'all'}_${days}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const whereCondition = companyId ? { companyId } : {};

      let result;
      switch (chartType) {
        case 'applications':
          result = await this.getApplicationsChartData(startDate, whereCondition);
          break;
        case 'users':
          result = await this.getUsersChartData(startDate, whereCondition);
          break;
        case 'jobs':
          result = await this.getJobsChartData(startDate, whereCondition);
          break;
        case 'interviews':
          result = await this.getInterviewsChartData(startDate, whereCondition);
          break;
        case 'conversion':
          result = await this.getConversionChartData(startDate, whereCondition);
          break;
        default:
          result = await this.getApplicationsChartData(startDate, whereCondition);
      }

      // Кешуємо на 5 хвилин
      cache.set(cacheKey, result, 5 * 60 * 1000);
      return result;
    } catch (error) {
      console.error('Error getting chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  private async getApplicationsChartData(startDate: Date, whereCondition: any): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  }> {
    const data = await this.getApplicationRepository()
      .createQueryBuilder('application')
      .leftJoin('application.job', 'job')
      .select('DATE(application.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('application.createdAt >= :startDate', { startDate })
      .andWhere(Object.keys(whereCondition).length > 0 ? 'job.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('DATE(application.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'Applications',
        data: data.map(item => parseInt(item.count)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    };
  }

  private async getUsersChartData(startDate: Date, whereCondition: any): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  }> {
    const data = await this.getUserRepository()
      .createQueryBuilder('user')
      .select('DATE(user.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt >= :startDate', { startDate })
      .andWhere(Object.keys(whereCondition).length > 0 ? 'user.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('DATE(user.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'New Users',
        data: data.map(item => parseInt(item.count)),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1
      }]
    };
  }

  private async getJobsChartData(startDate: Date, whereCondition: any): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  }> {
    const data = await this.getJobRepository()
      .createQueryBuilder('job')
      .select('DATE(job.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('job.createdAt >= :startDate', { startDate })
      .andWhere(Object.keys(whereCondition).length > 0 ? 'job.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('DATE(job.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'New Jobs',
        data: data.map(item => parseInt(item.count)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }]
    };
  }

  private async getInterviewsChartData(startDate: Date, whereCondition: any): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  }> {
    const data = await this.getInterviewRepository()
      .createQueryBuilder('interview')
      .leftJoin('interview.application', 'application')
      .leftJoin('application.job', 'job')
      .select('DATE(interview.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('interview.createdAt >= :startDate', { startDate })
      .andWhere(Object.keys(whereCondition).length > 0 ? 'job.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('DATE(interview.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'Interviews',
        data: data.map(item => parseInt(item.count)),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        tension: 0.1
      }]
    };
  }

  private async getConversionChartData(startDate: Date, whereCondition: any): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }>;
  }> {
    const applications = await this.getApplicationRepository()
      .createQueryBuilder('application')
      .leftJoin('application.job', 'job')
      .where('application.createdAt >= :startDate', { startDate })
      .andWhere(Object.keys(whereCondition).length > 0 ? 'job.companyId = :companyId' : '1=1', whereCondition)
      .getMany();

    const statusCounts = {
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      interview: applications.filter(app => app.status === 'interview').length,
      hired: applications.filter(app => app.status === 'hired').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Applications by Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)'
        ],
        borderWidth: 1
      }]
    };
  }

  async getAnalyticsReports(companyId?: string): Promise<any> {
    try {
      const whereCondition = companyId ? { companyId } : {};
      
      // Get basic analytics data
      const keyMetrics = await this.getKeyMetrics(companyId);
      const performanceMetrics = await this.getPerformanceMetrics(companyId);
      const dashboardData = await this.getDashboardData(companyId);

      return {
        keyMetrics,
        performanceMetrics,
        dashboardData,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting analytics reports:', error);
      throw new Error('Failed to fetch analytics reports');
    }
  }

  async getAnalyticsStats(companyId?: string): Promise<any> {
    try {
      const whereCondition = companyId ? { companyId } : {};

      // Get detailed statistics
      const [
        userStats,
        jobStats,
        applicationStats,
        interviewStats
      ] = await Promise.all([
        this.getUserStats(whereCondition),
        this.getJobStats(whereCondition),
        this.getApplicationStats(),
        this.getInterviewStats()
      ]);

      return {
        users: userStats,
        jobs: jobStats,
        applications: applicationStats,
        interviews: interviewStats
      };
    } catch (error) {
      console.error('Error getting analytics stats:', error);
      throw new Error('Failed to fetch analytics stats');
    }
  }

  private async getUserStats(whereCondition: any) {
    const total = await this.getUserRepository().count({ where: whereCondition });
    const byRole = await this.getUserRepository()
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where(Object.keys(whereCondition).length > 0 ? 'user.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('user.role')
      .getRawMany();

    const byStatus = await this.getUserRepository()
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(Object.keys(whereCondition).length > 0 ? 'user.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('user.status')
      .getRawMany();

    return {
      total,
      byRole: byRole.reduce((acc, item) => ({ ...acc, [item.role]: parseInt(item.count) }), {}),
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: parseInt(item.count) }), {})
    };
  }

  private async getJobStats(whereCondition: any) {
    const total = await this.getJobRepository().count({ where: whereCondition });
    const byStatus = await this.getJobRepository()
      .createQueryBuilder('job')
      .select('job.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(Object.keys(whereCondition).length > 0 ? 'job.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('job.status')
      .getRawMany();

    const byType = await this.getJobRepository()
      .createQueryBuilder('job')
      .select('job.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where(Object.keys(whereCondition).length > 0 ? 'job.companyId = :companyId' : '1=1', whereCondition)
      .groupBy('job.type')
      .getRawMany();

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: parseInt(item.count) }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: parseInt(item.count) }), {})
    };
  }

  private async getApplicationStats() {
    const total = await this.getApplicationRepository().count();
    const byStatus = await this.getApplicationRepository()
      .createQueryBuilder('application')
      .select('application.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('application.status')
      .getRawMany();

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: parseInt(item.count) }), {})
    };
  }

  private async getInterviewStats() {
    const total = await this.getInterviewRepository().count();
    const byStatus = await this.getInterviewRepository()
      .createQueryBuilder('interview')
      .select('interview.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('interview.status')
      .getRawMany();

    const byType = await this.getInterviewRepository()
      .createQueryBuilder('interview')
      .select('interview.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('interview.type')
      .getRawMany();

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: parseInt(item.count) }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: parseInt(item.count) }), {})
    };
  }

  async createReport(reportData: any): Promise<any> {
    try {
      // In a real implementation, you would save this to a reports table
      const report = {
        id: `report_${Date.now()}`,
        ...reportData,
        createdAt: new Date().toISOString(),
        status: 'generated'
      };

      return report;
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to create report');
    }
  }

  async getReportDetails(reportId: string): Promise<any> {
    try {
      // In a real implementation, you would fetch from a reports table
      return {
        id: reportId,
        data: await this.getAnalyticsReports(),
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting report details:', error);
      throw new Error('Failed to fetch report details');
    }
  }

  async exportAnalytics(options: any): Promise<any> {
    try {
      const data = await this.getAnalyticsReports(options.companyId);
      
      if (options.format === 'csv') {
        return this.convertToCSV(data);
      } else if (options.format === 'json') {
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw new Error('Failed to export analytics');
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion - in production, use a proper CSV library
    const csvRows = [];
    
    // Add key metrics
    csvRows.push('Metric,Value');
    csvRows.push(`Total Users,${data.keyMetrics.totalUsers}`);
    csvRows.push(`Total Jobs,${data.keyMetrics.totalJobs}`);
    csvRows.push(`Total Applications,${data.keyMetrics.totalApplications}`);
    csvRows.push(`Total Interviews,${data.keyMetrics.totalInterviews}`);
    
    return csvRows.join('\n');
  }

  async getAnalyticsTrends(options: any): Promise<{
    trends: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string | string[];
        tension?: number;
        borderWidth?: number;
      }>;
    };
    period: number;
    metric: string;
    generatedAt: string;
  }> {
    try {
      const { companyId, period = 30, metric = 'applications' } = options;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period);

      const whereCondition = companyId ? { companyId } : {};

      let trends: {
        labels: string[];
        datasets: Array<{
          label: string;
          data: number[];
          borderColor?: string;
          backgroundColor?: string | string[];
          tension?: number;
          borderWidth?: number;
        }>;
      };
      
      switch (metric) {
        case 'applications':
          trends = await this.getApplicationsChartData(startDate, whereCondition);
          break;
        case 'users':
          trends = await this.getUsersChartData(startDate, whereCondition);
          break;
        case 'jobs':
          trends = await this.getJobsChartData(startDate, whereCondition);
          break;
        case 'interviews':
          trends = await this.getInterviewsChartData(startDate, whereCondition);
          break;
        default:
          trends = await this.getApplicationsChartData(startDate, whereCondition);
      }

      return {
        trends,
        period,
        metric,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting analytics trends:', error);
      throw new Error('Failed to fetch analytics trends');
    }
  }

  /**
   * Очистити кеш (для тестування або при зміні даних)
   */
  clearCache(): void {
    cache.clear();
  }
}

export const analyticsService = new AnalyticsService();
