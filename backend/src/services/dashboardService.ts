import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Job, JobStatus } from '../models/Job';
import { Application } from '../models/Application';
import { Company } from '../models/Company';
import { CandidateProfile } from '../models/CandidateProfile';
import { File } from '../models/File';
import { Interview } from '../models/Interview';
import { Notification } from '../models/Notification';
import {
  DashboardStatsDto,
  AnalyticsDto,
  TopStatsDto,
  UserActivityDto,
  DashboardPeriod,
  AnalyticsType
} from '../dto/DashboardDto';

export class DashboardService {
  private userRepository: Repository<User>;
  private jobRepository: Repository<Job>;
  private applicationRepository: Repository<Application>;
  private companyRepository: Repository<Company>;
  private candidateProfileRepository: Repository<CandidateProfile>;
  private fileRepository: Repository<File>;
  private interviewRepository: Repository<Interview>;
  private notificationRepository: Repository<Notification>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.jobRepository = AppDataSource.getRepository(Job);
    this.applicationRepository = AppDataSource.getRepository(Application);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.candidateProfileRepository = AppDataSource.getRepository(CandidateProfile);
    this.fileRepository = AppDataSource.getRepository(File);
    this.interviewRepository = AppDataSource.getRepository(Interview);
    this.notificationRepository = AppDataSource.getRepository(Notification);
  }

  /**
   * Отримання загальної статистики дашборду
   */
  async getDashboardStats(statsDto: DashboardStatsDto, companyId?: string): Promise<{
    overview: {
      totalUsers: number;
      totalJobs: number;
      totalApplications: number;
      totalCompanies: number;
      totalCandidates: number;
      activeJobs: number;
      verifiedCompanies: number;
      totalFiles: number;
    };
    growth: {
      usersGrowth: number;
      jobsGrowth: number;
      applicationsGrowth: number;
      companiesGrowth: number;
    };
    recentActivity: {
      newUsers: number;
      newJobs: number;
      newApplications: number;
      newCompanies: number;
    };
    performance: {
      applicationRate: number;
      interviewRate: number;
      hireRate: number;
      averageTimeToHire: number;
    };
  }> {
    try {
      const dateFrom = this.getDateFromPeriod(statsDto.period, statsDto.dateFrom);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      // Оптимізована загальна статистика - один запит замість 8
      const statsResult = await AppDataSource.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE "isActive" = true) as "totalUsers",
          (SELECT COUNT(*) FROM jobs WHERE "isActive" = true) as "totalJobs",
          (SELECT COUNT(*) FROM applications) as "totalApplications",
          (SELECT COUNT(*) FROM companies WHERE "isActive" = true) as "totalCompanies",
          (SELECT COUNT(*) FROM candidate_profiles WHERE "isActive" = true) as "totalCandidates",
          (SELECT COUNT(*) FROM jobs WHERE "isActive" = true AND status = 'active') as "activeJobs",
          (SELECT COUNT(*) FROM companies WHERE "isVerified" = true AND "isActive" = true) as "verifiedCompanies",
          (SELECT COUNT(*) FROM files WHERE "isActive" = true) as "totalFiles"
      `);
      
      const {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        totalCandidates,
        activeJobs,
        verifiedCompanies,
        totalFiles
      } = statsResult[0];

      // Ріст за період
      const previousPeriodStart = new Date(dateFrom);
      const previousPeriodEnd = new Date(dateFrom);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));

      // Оптимізовані growth queries - один запит замість 8
      const growthResult = await AppDataSource.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE "isActive" = true AND "createdAt" >= $1 AND "createdAt" <= $2) as "currentUsers",
          (SELECT COUNT(*) FROM users WHERE "isActive" = true AND "createdAt" >= $3 AND "createdAt" <= $4) as "previousUsers",
          (SELECT COUNT(*) FROM jobs WHERE "isActive" = true AND "createdAt" >= $1 AND "createdAt" <= $2) as "currentJobs",
          (SELECT COUNT(*) FROM jobs WHERE "isActive" = true AND "createdAt" >= $3 AND "createdAt" <= $4) as "previousJobs",
          (SELECT COUNT(*) FROM applications WHERE "createdAt" >= $1 AND "createdAt" <= $2) as "currentApplications",
          (SELECT COUNT(*) FROM applications WHERE "createdAt" >= $3 AND "createdAt" <= $4) as "previousApplications",
          (SELECT COUNT(*) FROM companies WHERE "isActive" = true AND "createdAt" >= $1 AND "createdAt" <= $2) as "currentCompanies",
          (SELECT COUNT(*) FROM companies WHERE "isActive" = true AND "createdAt" >= $3 AND "createdAt" <= $4) as "previousCompanies"
      `, [dateFrom, dateTo, previousPeriodStart, previousPeriodEnd]);
      
      const {
        currentUsers,
        previousUsers,
        currentJobs,
        previousJobs,
        currentApplications,
        previousApplications,
        currentCompanies,
        previousCompanies
      } = growthResult[0];

      // Оптимізована остання активність + performance - один запит замість 6
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const activityResult = await AppDataSource.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE "isActive" = true AND "createdAt" >= $1) as "newUsers",
          (SELECT COUNT(*) FROM jobs WHERE "isActive" = true AND "createdAt" >= $1) as "newJobs",
          (SELECT COUNT(*) FROM applications WHERE "createdAt" >= $1) as "newApplications",
          (SELECT COUNT(*) FROM companies WHERE "isActive" = true AND "createdAt" >= $1) as "newCompanies",
          (SELECT COUNT(*) FROM interviews) as "totalInterviews",
          (SELECT COUNT(*) FROM applications WHERE status = 'hired') as "hiredApplications"
      `, [weekAgo]);
      
      const {
        newUsers,
        newJobs,
        newApplications,
        newCompanies,
        totalInterviews,
        hiredApplications
      } = activityResult[0];

      const applicationRate = totalJobs > 0 ? (totalApplications / totalJobs) * 100 : 0;
      const interviewRate = totalApplications > 0 ? (totalInterviews / totalApplications) * 100 : 0;
      const hireRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;

      return {
        overview: {
          totalUsers,
          totalJobs,
          totalApplications,
          totalCompanies,
          totalCandidates,
          activeJobs,
          verifiedCompanies,
          totalFiles
        },
        growth: {
          usersGrowth: this.calculateGrowthRate(currentUsers, previousUsers),
          jobsGrowth: this.calculateGrowthRate(currentJobs, previousJobs),
          applicationsGrowth: this.calculateGrowthRate(currentApplications, previousApplications),
          companiesGrowth: this.calculateGrowthRate(currentCompanies, previousCompanies)
        },
        recentActivity: {
          newUsers,
          newJobs,
          newApplications,
          newCompanies
        },
        performance: {
          applicationRate: Math.round(applicationRate * 100) / 100,
          interviewRate: Math.round(interviewRate * 100) / 100,
          hireRate: Math.round(hireRate * 100) / 100,
          averageTimeToHire: await this.calculateAverageTimeToHire(dateFrom, dateTo, companyId)
        }
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }

  /**
   * Отримання статистики за період
   */
  async getStatsByPeriod(period: string): Promise<{
    period: string;
    data: Array<{
      date: string;
      users: number;
      jobs: number;
      applications: number;
      companies: number;
    }>;
  }> {
    try {
      const dateFrom = this.getDateFromPeriod(period as DashboardPeriod);
      const dateTo = new Date();
      const data = [];

      const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
      const interval = Math.max(1, Math.floor(days / 30)); // Максимум 30 точок

      for (let i = 0; i < days; i += interval) {
        const currentDate = new Date(dateFrom);
        currentDate.setDate(currentDate.getDate() + i);
        
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + interval);

        const [
          users,
          jobs,
          applications,
          companies
        ] = await Promise.all([
          this.userRepository.count({
            where: {
              isActive: true,
              createdAt: { $gte: currentDate, $lte: nextDate } as any
            }
          }),
          this.jobRepository.count({
            where: {
              isActive: true,
              createdAt: { $gte: currentDate, $lte: nextDate } as any
            }
          }),
          this.applicationRepository.count({
            where: {
              createdAt: { $gte: currentDate, $lte: nextDate } as any
            }
          }),
          this.companyRepository.count({
            where: {
              isActive: true,
              createdAt: { $gte: currentDate, $lte: nextDate } as any
            }
          })
        ]);

        data.push({
          date: currentDate.toISOString().split('T')[0],
          users,
          jobs,
          applications,
          companies
        });
      }

      return { period, data };
    } catch (error) {
      console.error('Error getting stats by period:', error);
      throw new Error(`Failed to get stats by period: ${error.message}`);
    }
  }

  /**
   * Отримання топ статистики
   */
  async getTopStats(topStatsDto: TopStatsDto): Promise<{
    topSkills: Array<{ skill: string; count: number }>;
    topLocations: Array<{ location: string; count: number }>;
    topCompanies: Array<{ company: string; jobs: number; applications: number }>;
    topJobTypes: Array<{ type: string; count: number }>;
  }> {
    try {
      const limit = topStatsDto.limit || 10;
      const dateFrom = this.getDateFromPeriod(topStatsDto.period);

      // Топ навички
      const skillsResult = await this.candidateProfileRepository
        .createQueryBuilder('profile')
        .select('UNNEST(profile.skills)', 'skill')
        .addSelect('COUNT(*)', 'count')
        .where('profile.isActive = :isActive', { isActive: true })
        .andWhere('profile.createdAt >= :dateFrom', { dateFrom })
        .groupBy('skill')
        .orderBy('count', 'DESC')
        .limit(limit)
        .getRawMany();

      const topSkills = skillsResult.map(row => ({
        skill: row.skill,
        count: parseInt(row.count)
      }));

      // Топ локації
      const locationsResult = await this.jobRepository
        .createQueryBuilder('job')
        .select('job.location', 'location')
        .addSelect('COUNT(*)', 'count')
        .where('job.isActive = :isActive', { isActive: true })
        .andWhere('job.createdAt >= :dateFrom', { dateFrom })
        .groupBy('job.location')
        .orderBy('count', 'DESC')
        .limit(limit)
        .getRawMany();

      const topLocations = locationsResult.map(row => ({
        location: row.location,
        count: parseInt(row.count)
      }));

      // Топ компанії
      const companiesResult = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoin('job.company', 'company')
        .select('company.name', 'company')
        .addSelect('COUNT(job.id)', 'jobs')
        .addSelect('COUNT(application.id)', 'applications')
        .leftJoin('job.applicationsList', 'application')
        .where('job.isActive = :isActive', { isActive: true })
        .andWhere('job.createdAt >= :dateFrom', { dateFrom })
        .groupBy('company.id, company.name')
        .orderBy('jobs', 'DESC')
        .limit(limit)
        .getRawMany();

      const topCompanies = companiesResult.map(row => ({
        company: row.company,
        jobs: parseInt(row.jobs),
        applications: parseInt(row.applications)
      }));

      // Топ типи робіт
      const jobTypesResult = await this.jobRepository
        .createQueryBuilder('job')
        .select('job.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('job.isActive = :isActive', { isActive: true })
        .andWhere('job.createdAt >= :dateFrom', { dateFrom })
        .groupBy('job.type')
        .orderBy('count', 'DESC')
        .limit(limit)
        .getRawMany();

      const topJobTypes = jobTypesResult.map(row => ({
        type: row.type,
        count: parseInt(row.count)
      }));

      return {
        topSkills,
        topLocations,
        topCompanies,
        topJobTypes
      };
    } catch (error) {
      console.error('Error getting top stats:', error);
      throw new Error(`Failed to get top stats: ${error.message}`);
    }
  }

  /**
   * Отримання аналітики
   */
  async getAnalytics(analyticsDto: AnalyticsDto): Promise<{
    type: string;
    period: string;
    data: Array<{
      label: string;
      value: number;
      date?: string;
    }>;
    chartType: string;
  }> {
    try {
      const dateFrom = this.getDateFromPeriod(analyticsDto.period);
      const dateTo = new Date();
      const limit = analyticsDto.limit || 30;

      let data: Array<{ label: string; value: number; date?: string }> = [];

      switch (analyticsDto.type) {
        case AnalyticsType.USERS:
          data = await this.getUserAnalytics(dateFrom, dateTo, limit);
          break;
        case AnalyticsType.JOBS:
          data = await this.getJobAnalytics(dateFrom, dateTo, limit);
          break;
        case AnalyticsType.APPLICATIONS:
          data = await this.getApplicationAnalytics(dateFrom, dateTo, limit);
          break;
        case AnalyticsType.COMPANIES:
          data = await this.getCompanyAnalytics(dateFrom, dateTo, limit);
          break;
        case AnalyticsType.REVENUE:
          data = await this.getRevenueAnalytics(dateFrom, dateTo, limit);
          break;
        case AnalyticsType.CONVERSIONS:
          data = await this.getConversionAnalytics(dateFrom, dateTo, limit);
          break;
        case AnalyticsType.ENGAGEMENT:
          data = await this.getEngagementAnalytics(dateFrom, dateTo, limit);
          break;
        default:
          throw new Error('Invalid analytics type');
      }

      return {
        type: analyticsDto.type,
        period: analyticsDto.period,
        data,
        chartType: analyticsDto.chartType || 'line'
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  /**
   * Отримання активності користувачів
   */
  async getUserActivity(userActivityDto: UserActivityDto): Promise<{
    period: string;
    activities: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      activityType: string;
      activityCount: number;
      lastActivity: Date;
    }>;
  }> {
    try {
      const dateFrom = this.getDateFromPeriod(userActivityDto.period);
      const limit = userActivityDto.limit || 20;

      const activities = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.lastLoginAt',
          'user.updatedAt'
        ])
        .addSelect('COUNT(application.id)', 'applicationCount')
        .addSelect('COUNT(job.id)', 'jobCount')
        .leftJoin('user.applications', 'application')
        .leftJoin('user.createdJobs', 'job')
        .where('user.isActive = :isActive', { isActive: true })
        .andWhere('user.updatedAt >= :dateFrom', { dateFrom })
        .groupBy('user.id')
        .orderBy('user.updatedAt', 'DESC')
        .limit(limit)
        .getRawMany();

      const formattedActivities = activities.map(activity => ({
        userId: activity.user_id,
        userName: `${activity.user_firstName} ${activity.user_lastName}`,
        userEmail: activity.user_email,
        activityType: 'general',
        activityCount: parseInt(activity.applicationCount) + parseInt(activity.jobCount),
        lastActivity: activity.user_updatedAt
      }));

      return {
        period: userActivityDto.period,
        activities: formattedActivities
      };
    } catch (error) {
      console.error('Error getting user activity:', error);
      throw new Error(`Failed to get user activity: ${error.message}`);
    }
  }

  // Приватні методи для аналітики
  private async getUserAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    const interval = Math.max(1, Math.floor(days / limit));
    const data = [];

    for (let i = 0; i < days; i += interval) {
      const currentDate = new Date(dateFrom);
      currentDate.setDate(currentDate.getDate() + i);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + interval);

      const count = await this.userRepository.count({
        where: {
          isActive: true,
          createdAt: { $gte: currentDate, $lte: nextDate } as any
        }
      });

      data.push({
        label: currentDate.toISOString().split('T')[0],
        value: count,
        date: currentDate.toISOString().split('T')[0]
      });
    }

    return data;
  }

  private async getJobAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    const interval = Math.max(1, Math.floor(days / limit));
    const data = [];

    for (let i = 0; i < days; i += interval) {
      const currentDate = new Date(dateFrom);
      currentDate.setDate(currentDate.getDate() + i);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + interval);

      const count = await this.jobRepository.count({
        where: {
          isActive: true,
          createdAt: { $gte: currentDate, $lte: nextDate } as any
        }
      });

      data.push({
        label: currentDate.toISOString().split('T')[0],
        value: count,
        date: currentDate.toISOString().split('T')[0]
      });
    }

    return data;
  }

  private async getApplicationAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    const interval = Math.max(1, Math.floor(days / limit));
    const data = [];

    for (let i = 0; i < days; i += interval) {
      const currentDate = new Date(dateFrom);
      currentDate.setDate(currentDate.getDate() + i);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + interval);

      const count = await this.applicationRepository.count({
        where: {
          createdAt: { $gte: currentDate, $lte: nextDate } as any
        }
      });

      data.push({
        label: currentDate.toISOString().split('T')[0],
        value: count,
        date: currentDate.toISOString().split('T')[0]
      });
    }

    return data;
  }

  private async getCompanyAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    const interval = Math.max(1, Math.floor(days / limit));
    const data = [];

    for (let i = 0; i < days; i += interval) {
      const currentDate = new Date(dateFrom);
      currentDate.setDate(currentDate.getDate() + i);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + interval);

      const count = await this.companyRepository.count({
        where: {
          isActive: true,
          createdAt: { $gte: currentDate, $lte: nextDate } as any
        }
      });

      data.push({
        label: currentDate.toISOString().split('T')[0],
        value: count,
        date: currentDate.toISOString().split('T')[0]
      });
    }

    return data;
  }

  private async getRevenueAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    try {
      // For now, we'll calculate revenue based on job postings and applications
      // In the future, this should integrate with actual payment data
      const jobs = await this.jobRepository
        .createQueryBuilder('job')
        .select([
          'job.id',
          'job.title',
          'job.createdAt',
          'job.publishedAt',
          'job.status',
          'job.budget'
        ])
        .where('job.createdAt >= :dateFrom', { dateFrom })
        .andWhere('job.createdAt <= :dateTo', { dateTo })
        .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
        .orderBy('job.createdAt', 'DESC')
        .limit(limit)
        .getMany();

      const applications = await this.applicationRepository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .where('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo })
        .andWhere('application.status = :status', { status: 'hired' })
        .getMany();

      // Calculate estimated revenue based on job postings and hires
      const revenueData: Array<{ label: string; value: number; date?: string }> = [];
      
      // Group by month
      const monthlyRevenue = new Map<string, number>();
      
      jobs.forEach(job => {
        const month = job.createdAt.toISOString().substring(0, 7); // YYYY-MM
        const estimatedRevenue = 1000; // Default estimated revenue per job
        monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + estimatedRevenue);
      });

      // Add hired candidates bonus
      applications.forEach(application => {
        const month = application.createdAt.toISOString().substring(0, 7);
        const bonus = 500; // Bonus for successful hire
        monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + bonus);
      });

      // Convert to array format
      monthlyRevenue.forEach((value, month) => {
        revenueData.push({
          label: month,
          value: Math.round(value),
          date: `${month}-01`
        });
      });

      return revenueData.sort((a, b) => a.date!.localeCompare(b.date!));
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
    return [];
    }
  }

  private async getConversionAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    try {
      // Calculate conversion rates by month
      const conversionData: Array<{ label: string; value: number; date?: string }> = [];
      
      // Get applications grouped by month
      const applications = await this.applicationRepository
        .createQueryBuilder('application')
        .select([
          'application.id',
          'application.status',
          'application.createdAt',
          'application.hiredAt'
        ])
        .where('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo })
        .orderBy('application.createdAt', 'ASC')
        .getMany();

      // Group by month and calculate conversion rates
      const monthlyData = new Map<string, { total: number; hired: number; interviewed: number }>();
      
      applications.forEach(application => {
        const month = application.createdAt.toISOString().substring(0, 7); // YYYY-MM
        const data = monthlyData.get(month) || { total: 0, hired: 0, interviewed: 0 };
        
        data.total++;
        if (application.status === 'hired') {
          data.hired++;
        }
        if (application.status === 'interview' || application.status === 'hired') {
          data.interviewed++;
        }
        
        monthlyData.set(month, data);
      });

      // Calculate conversion rates
      monthlyData.forEach((data, month) => {
        const applicationToInterviewRate = data.total > 0 ? (data.interviewed / data.total) * 100 : 0;
        const interviewToHireRate = data.interviewed > 0 ? (data.hired / data.interviewed) * 100 : 0;
        const overallConversionRate = data.total > 0 ? (data.hired / data.total) * 100 : 0;
        
        conversionData.push(
          {
            label: `${month} - App to Interview`,
            value: Math.round(applicationToInterviewRate * 100) / 100,
            date: `${month}-01`
          },
          {
            label: `${month} - Interview to Hire`,
            value: Math.round(interviewToHireRate * 100) / 100,
            date: `${month}-01`
          },
          {
            label: `${month} - Overall Conversion`,
            value: Math.round(overallConversionRate * 100) / 100,
            date: `${month}-01`
          }
        );
      });

      return conversionData.sort((a, b) => a.date!.localeCompare(b.date!));
    } catch (error) {
      console.error('Error getting conversion analytics:', error);
    return [];
    }
  }

  private async getEngagementAnalytics(dateFrom: Date, dateTo: Date, limit: number): Promise<Array<{ label: string; value: number; date?: string }>> {
    try {
      // Calculate user engagement metrics by month
      const engagementData: Array<{ label: string; value: number; date?: string }> = [];
      
      // Get user activity data
      const users = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.lastActiveAt',
          'user.createdAt',
          'user.updatedAt'
        ])
        .where('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt <= :dateTo', { dateTo })
        .orderBy('user.createdAt', 'ASC')
        .getMany();

      // Get job application activity
      const applications = await this.applicationRepository
        .createQueryBuilder('application')
        .select([
          'application.id',
          'application.createdAt',
          'application.updatedAt'
        ])
        .where('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo })
        .orderBy('application.createdAt', 'ASC')
        .getMany();

      // Get interview activity
      const interviews = await this.interviewRepository
        .createQueryBuilder('interview')
        .select([
          'interview.id',
          'interview.createdAt',
          'interview.updatedAt'
        ])
        .where('interview.createdAt >= :dateFrom', { dateFrom })
        .andWhere('interview.createdAt <= :dateTo', { dateTo })
        .orderBy('interview.createdAt', 'ASC')
        .getMany();

      // Group by month and calculate engagement metrics
      const monthlyData = new Map<string, { 
        newUsers: number; 
        activeUsers: number; 
        applications: number; 
        interviews: number;
        totalActivity: number;
      }>();
      
      // Process users
      users.forEach(user => {
        const month = user.createdAt.toISOString().substring(0, 7);
        const data = monthlyData.get(month) || { newUsers: 0, activeUsers: 0, applications: 0, interviews: 0, totalActivity: 0 };
        
        data.newUsers++;
        if (user.lastActiveAt && user.lastActiveAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
          data.activeUsers++;
        }
        data.totalActivity += 2; // New user registration
        
        monthlyData.set(month, data);
      });

      // Process applications
      applications.forEach(application => {
        const month = application.createdAt.toISOString().substring(0, 7);
        const data = monthlyData.get(month) || { newUsers: 0, activeUsers: 0, applications: 0, interviews: 0, totalActivity: 0 };
        
        data.applications++;
        data.totalActivity += 1; // Application activity
        
        monthlyData.set(month, data);
      });

      // Process interviews
      interviews.forEach(interview => {
        const month = interview.createdAt.toISOString().substring(0, 7);
        const data = monthlyData.get(month) || { newUsers: 0, activeUsers: 0, applications: 0, interviews: 0, totalActivity: 0 };
        
        data.interviews++;
        data.totalActivity += 3; // Interview activity (higher weight)
        
        monthlyData.set(month, data);
      });

      // Calculate engagement metrics
      monthlyData.forEach((data, month) => {
        const engagementScore = data.totalActivity / Math.max(data.newUsers, 1); // Activity per new user
        const applicationRate = data.newUsers > 0 ? (data.applications / data.newUsers) * 100 : 0;
        const interviewRate = data.applications > 0 ? (data.interviews / data.applications) * 100 : 0;
        
        engagementData.push(
          {
            label: `${month} - Engagement Score`,
            value: Math.round(engagementScore * 100) / 100,
            date: `${month}-01`
          },
          {
            label: `${month} - Application Rate`,
            value: Math.round(applicationRate * 100) / 100,
            date: `${month}-01`
          },
          {
            label: `${month} - Interview Rate`,
            value: Math.round(interviewRate * 100) / 100,
            date: `${month}-01`
          }
        );
      });

      return engagementData.sort((a, b) => a.date!.localeCompare(b.date!));
    } catch (error) {
      console.error('Error getting engagement analytics:', error);
    return [];
    }
  }

  private getDateFromPeriod(period: DashboardPeriod, customDate?: string): Date {
    if (customDate) {
      return new Date(customDate);
    }

    const now = new Date();
    const dateFrom = new Date(now);

    switch (period) {
      case DashboardPeriod.DAY:
        dateFrom.setDate(now.getDate() - 1);
        break;
      case DashboardPeriod.WEEK:
        dateFrom.setDate(now.getDate() - 7);
        break;
      case DashboardPeriod.MONTH:
        dateFrom.setMonth(now.getMonth() - 1);
        break;
      case DashboardPeriod.QUARTER:
        dateFrom.setMonth(now.getMonth() - 3);
        break;
      case DashboardPeriod.YEAR:
        dateFrom.setFullYear(now.getFullYear() - 1);
        break;
      case DashboardPeriod.ALL:
        dateFrom.setFullYear(2020); // Start from 2020
        break;
      default:
        dateFrom.setMonth(now.getMonth() - 1);
    }

    return dateFrom;
  }

  private calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }

  private async calculateAverageTimeToHire(dateFrom: Date, dateTo: Date, companyId?: string): Promise<number> {
    try {
      const queryBuilder = this.applicationRepository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .where('application.status = :status', { status: 'hired' })
        .andWhere('application.hiredAt IS NOT NULL')
        .andWhere('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo });

      if (companyId) {
        queryBuilder.andWhere('job.companyId = :companyId', { companyId });
      }

      const hiredApplications = await queryBuilder
        .select([
          'application.id',
          'application.createdAt',
          'application.hiredAt'
        ])
        .getMany();

      if (hiredApplications.length === 0) {
        return 0;
      }

      // Calculate average time to hire in days
      const totalDays = hiredApplications.reduce((sum, app) => {
        const timeToHire = app.hiredAt!.getTime() - app.createdAt.getTime();
        return sum + (timeToHire / (1000 * 60 * 60 * 24)); // Convert to days
      }, 0);

      return Math.round((totalDays / hiredApplications.length) * 100) / 100;
    } catch (error) {
      console.error('Error calculating average time to hire:', error);
      return 0;
    }
  }
}

export const dashboardService = new DashboardService();
