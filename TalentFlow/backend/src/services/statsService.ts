import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { Interview } from '../models/Interview';
import { Payment } from '../models/Payment';
import { Subscription } from '../models/Subscription';
import { 
  GeneralStatsDto, 
  UserStatsDto, 
  JobStatsDto, 
  ApplicationStatsDto, 
  InterviewStatsDto, 
  PaymentStatsDto, 
  SubscriptionStatsDto, 
  RevenueStatsDto, 
  PerformanceStatsDto, 
  SystemStatsDto, 
  StatsComparisonDto, 
  StatsExportDto 
} from '../dto/StatsDto';

export class StatsService {
  private userRepository: Repository<User>;
  private jobRepository: Repository<Job>;
  private applicationRepository: Repository<Application>;
  private interviewRepository: Repository<Interview>;
  private paymentRepository: Repository<Payment>;
  private subscriptionRepository: Repository<Subscription>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.jobRepository = AppDataSource.getRepository(Job);
    this.applicationRepository = AppDataSource.getRepository(Application);
    this.interviewRepository = AppDataSource.getRepository(Interview);
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.subscriptionRepository = AppDataSource.getRepository(Subscription);
  }

  async getGeneralStats(statsDto: GeneralStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const [totalUsers, totalJobs, totalApplications, totalInterviews, totalPayments, totalSubscriptions] = await Promise.all([
        this.userRepository.count({ 
          where: { 
            createdAt: Between(dateFrom, dateTo) 
          } 
        }),
        this.jobRepository.count({ 
          where: { 
            createdAt: Between(dateFrom, dateTo),
            isActive: true 
          } 
        }),
        this.applicationRepository.count({ 
          where: { 
            createdAt: Between(dateFrom, dateTo) 
          } 
        }),
        this.interviewRepository.count({ 
          where: { 
            createdAt: Between(dateFrom, dateTo) 
          } 
        }),
        this.paymentRepository.count({ 
          where: { 
            createdAt: Between(dateFrom, dateTo) 
          } 
        }),
        this.subscriptionRepository.count({ 
          where: { 
            createdAt: Between(dateFrom, dateTo) 
          } 
        })
      ]);

      return {
        totalUsers,
        totalJobs,
        totalApplications,
        totalInterviews,
        totalPayments,
        totalSubscriptions,
        period: {
          from: dateFrom,
          to: dateTo
        }
      };
    } catch (error) {
      console.error('Error getting general stats:', error);
      throw new Error(`Failed to get general stats: ${error.message}`);
    }
  }

  async getUserStats(statsDto: UserStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.userRepository.createQueryBuilder('user')
        .where('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt <= :dateTo', { dateTo });

      if (statsDto.role) {
        queryBuilder.andWhere('user.role = :role', { role: statsDto.role });
      }

      if (statsDto.status) {
        queryBuilder.andWhere('user.status = :status', { status: statsDto.status });
      }

      if (statsDto.location) {
        queryBuilder.andWhere('user.location ILIKE :location', { location: `%${statsDto.location}%` });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`user.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'count':
              queryBuilder.addSelect('COUNT(*)', 'count');
              break;
            case 'new_users':
              queryBuilder.addSelect('COUNT(CASE WHEN user.createdAt >= :dateFrom THEN 1 END)', 'newUsers');
              break;
            case 'active_users':
              queryBuilder.addSelect('COUNT(CASE WHEN user.status = \'active\' THEN 1 END)', 'activeUsers');
              break;
            case 'blocked_users':
              queryBuilder.addSelect('COUNT(CASE WHEN user.status = \'blocked\' THEN 1 END)', 'blockedUsers');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }

  async getJobStats(statsDto: JobStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.jobRepository.createQueryBuilder('job')
        .where('job.createdAt >= :dateFrom', { dateFrom })
        .andWhere('job.createdAt <= :dateTo', { dateTo });

      if (statsDto.status) {
        queryBuilder.andWhere('job.status = :status', { status: statsDto.status });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('job.type = :type', { type: statsDto.type });
      }

      if (statsDto.location) {
        queryBuilder.andWhere('job.location ILIKE :location', { location: `%${statsDto.location}%` });
      }

      if (statsDto.industry) {
        queryBuilder.andWhere('job.industry ILIKE :industry', { industry: `%${statsDto.industry}%` });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`job.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'count':
              queryBuilder.addSelect('COUNT(*)', 'count');
              break;
            case 'new_jobs':
              queryBuilder.addSelect('COUNT(CASE WHEN job.createdAt >= :dateFrom THEN 1 END)', 'newJobs');
              break;
            case 'active_jobs':
              queryBuilder.addSelect('COUNT(CASE WHEN job.status = \'active\' THEN 1 END)', 'activeJobs');
              break;
            case 'closed_jobs':
              queryBuilder.addSelect('COUNT(CASE WHEN job.status = \'closed\' THEN 1 END)', 'closedJobs');
              break;
            case 'remote_jobs':
              queryBuilder.addSelect('COUNT(CASE WHEN job.workMode = \'remote\' THEN 1 END)', 'remoteJobs');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting job stats:', error);
      throw new Error(`Failed to get job stats: ${error.message}`);
    }
  }

  async getApplicationStats(statsDto: ApplicationStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.applicationRepository.createQueryBuilder('application')
        .where('application.createdAt >= :dateFrom', { dateFrom })
        .andWhere('application.createdAt <= :dateTo', { dateTo });

      if (statsDto.status) {
        queryBuilder.andWhere('application.status = :status', { status: statsDto.status });
      }

      if (statsDto.source) {
        queryBuilder.andWhere('application.source = :source', { source: statsDto.source });
      }

      if (statsDto.jobType) {
        queryBuilder.andWhere('application.jobType = :jobType', { jobType: statsDto.jobType });
      }

      if (statsDto.location) {
        queryBuilder.andWhere('application.location ILIKE :location', { location: `%${statsDto.location}%` });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`application.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'count':
              queryBuilder.addSelect('COUNT(*)', 'count');
              break;
            case 'new_applications':
              queryBuilder.addSelect('COUNT(CASE WHEN application.createdAt >= :dateFrom THEN 1 END)', 'newApplications');
              break;
            case 'pending_applications':
              queryBuilder.addSelect('COUNT(CASE WHEN application.status = \'pending\' THEN 1 END)', 'pendingApplications');
              break;
            case 'accepted_applications':
              queryBuilder.addSelect('COUNT(CASE WHEN application.status = \'accepted\' THEN 1 END)', 'acceptedApplications');
              break;
            case 'rejected_applications':
              queryBuilder.addSelect('COUNT(CASE WHEN application.status = \'rejected\' THEN 1 END)', 'rejectedApplications');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting application stats:', error);
      throw new Error(`Failed to get application stats: ${error.message}`);
    }
  }

  async getInterviewStats(statsDto: InterviewStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.interviewRepository.createQueryBuilder('interview')
        .where('interview.createdAt >= :dateFrom', { dateFrom })
        .andWhere('interview.createdAt <= :dateTo', { dateTo });

      if (statsDto.status) {
        queryBuilder.andWhere('interview.status = :status', { status: statsDto.status });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('interview.type = :type', { type: statsDto.type });
      }

      if (statsDto.result) {
        queryBuilder.andWhere('interview.result = :result', { result: statsDto.result });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`interview.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'count':
              queryBuilder.addSelect('COUNT(*)', 'count');
              break;
            case 'new_interviews':
              queryBuilder.addSelect('COUNT(CASE WHEN interview.createdAt >= :dateFrom THEN 1 END)', 'newInterviews');
              break;
            case 'scheduled_interviews':
              queryBuilder.addSelect('COUNT(CASE WHEN interview.status = \'scheduled\' THEN 1 END)', 'scheduledInterviews');
              break;
            case 'completed_interviews':
              queryBuilder.addSelect('COUNT(CASE WHEN interview.status = \'completed\' THEN 1 END)', 'completedInterviews');
              break;
            case 'passed_interviews':
              queryBuilder.addSelect('COUNT(CASE WHEN interview.result = \'passed\' THEN 1 END)', 'passedInterviews');
              break;
            case 'failed_interviews':
              queryBuilder.addSelect('COUNT(CASE WHEN interview.result = \'failed\' THEN 1 END)', 'failedInterviews');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting interview stats:', error);
      throw new Error(`Failed to get interview stats: ${error.message}`);
    }
  }

  async getPaymentStats(statsDto: PaymentStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
        .where('payment.createdAt >= :dateFrom', { dateFrom })
        .andWhere('payment.createdAt <= :dateTo', { dateTo });

      if (statsDto.status) {
        queryBuilder.andWhere('payment.status = :status', { status: statsDto.status });
      }

      if (statsDto.method) {
        queryBuilder.andWhere('payment.paymentMethod = :method', { method: statsDto.method });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('payment.type = :type', { type: statsDto.type });
      }

      if (statsDto.currency) {
        queryBuilder.andWhere('payment.currency = :currency', { currency: statsDto.currency });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`payment.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'count':
              queryBuilder.addSelect('COUNT(*)', 'count');
              break;
            case 'total_amount':
              queryBuilder.addSelect('SUM(payment.amount)', 'totalAmount');
              break;
            case 'avg_amount':
              queryBuilder.addSelect('AVG(payment.amount)', 'avgAmount');
              break;
            case 'max_amount':
              queryBuilder.addSelect('MAX(payment.amount)', 'maxAmount');
              break;
            case 'min_amount':
              queryBuilder.addSelect('MIN(payment.amount)', 'minAmount');
              break;
            case 'completed_payments':
              queryBuilder.addSelect('COUNT(CASE WHEN payment.status = \'completed\' THEN 1 END)', 'completedPayments');
              break;
            case 'failed_payments':
              queryBuilder.addSelect('COUNT(CASE WHEN payment.status = \'failed\' THEN 1 END)', 'failedPayments');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw new Error(`Failed to get payment stats: ${error.message}`);
    }
  }

  async getSubscriptionStats(statsDto: SubscriptionStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.subscriptionRepository.createQueryBuilder('subscription')
        .where('subscription.createdAt >= :dateFrom', { dateFrom })
        .andWhere('subscription.createdAt <= :dateTo', { dateTo });

      if (statsDto.status) {
        queryBuilder.andWhere('subscription.status = :status', { status: statsDto.status });
      }

      if (statsDto.plan) {
        queryBuilder.andWhere('subscription.plan = :plan', { plan: statsDto.plan });
      }

      if (statsDto.billingCycle) {
        queryBuilder.andWhere('subscription.billingCycle = :billingCycle', { billingCycle: statsDto.billingCycle });
      }

      if (statsDto.currency) {
        queryBuilder.andWhere('subscription.currency = :currency', { currency: statsDto.currency });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`subscription.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'count':
              queryBuilder.addSelect('COUNT(*)', 'count');
              break;
            case 'total_revenue':
              queryBuilder.addSelect('SUM(subscription.price)', 'totalRevenue');
              break;
            case 'avg_revenue':
              queryBuilder.addSelect('AVG(subscription.price)', 'avgRevenue');
              break;
            case 'active_subscriptions':
              queryBuilder.addSelect('COUNT(CASE WHEN subscription.status = \'active\' THEN 1 END)', 'activeSubscriptions');
              break;
            case 'cancelled_subscriptions':
              queryBuilder.addSelect('COUNT(CASE WHEN subscription.status = \'cancelled\' THEN 1 END)', 'cancelledSubscriptions');
              break;
            case 'expired_subscriptions':
              queryBuilder.addSelect('COUNT(CASE WHEN subscription.status = \'expired\' THEN 1 END)', 'expiredSubscriptions');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      throw new Error(`Failed to get subscription stats: ${error.message}`);
    }
  }

  async getRevenueStats(statsDto: RevenueStatsDto): Promise<any> {
    try {
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
        .where('payment.createdAt >= :dateFrom', { dateFrom })
        .andWhere('payment.createdAt <= :dateTo', { dateTo })
        .andWhere('payment.status = :status', { status: 'completed' });

      if (statsDto.source) {
        queryBuilder.andWhere('payment.source = :source', { source: statsDto.source });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('payment.type = :type', { type: statsDto.type });
      }

      if (statsDto.currency) {
        queryBuilder.andWhere('payment.currency = :currency', { currency: statsDto.currency });
      }

      if (statsDto.groupBy) {
        queryBuilder.groupBy(`payment.${statsDto.groupBy}`);
      }

      if (statsDto.metrics && statsDto.metrics.length > 0) {
        statsDto.metrics.forEach(metric => {
          switch (metric) {
            case 'total_revenue':
              queryBuilder.addSelect('SUM(payment.amount)', 'totalRevenue');
              break;
            case 'avg_revenue':
              queryBuilder.addSelect('AVG(payment.amount)', 'avgRevenue');
              break;
            case 'max_revenue':
              queryBuilder.addSelect('MAX(payment.amount)', 'maxRevenue');
              break;
            case 'min_revenue':
              queryBuilder.addSelect('MIN(payment.amount)', 'minRevenue');
              break;
            case 'transaction_count':
              queryBuilder.addSelect('COUNT(*)', 'transactionCount');
              break;
          }
        });
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting revenue stats:', error);
      throw new Error(`Failed to get revenue stats: ${error.message}`);
    }
  }

  async getPerformanceStats(statsDto: PerformanceStatsDto): Promise<any> {
    try {
      // This would typically come from performance monitoring tools
      // For now, we'll simulate performance metrics
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const metrics = [];
      const currentDate = new Date(dateFrom);

      while (currentDate <= dateTo) {
        const dayMetrics = {
          date: currentDate.toISOString().split('T')[0],
          responseTime: Math.random() * 1000 + 100,
          throughput: Math.random() * 1000 + 500,
          errorRate: Math.random() * 5,
          uptime: 99.9 + Math.random() * 0.1
        };

        metrics.push(dayMetrics);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return metrics;
    } catch (error) {
      console.error('Error getting performance stats:', error);
      throw new Error(`Failed to get performance stats: ${error.message}`);
    }
  }

  async getSystemStats(statsDto: SystemStatsDto): Promise<any> {
    try {
      // This would typically come from system monitoring tools
      // For now, we'll simulate system metrics
      const dateFrom = statsDto.dateFrom ? new Date(statsDto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = statsDto.dateTo ? new Date(statsDto.dateTo) : new Date();

      const metrics = [];
      const currentDate = new Date(dateFrom);

      while (currentDate <= dateTo) {
        const dayMetrics = {
          date: currentDate.toISOString().split('T')[0],
          cpuUsage: Math.random() * 100,
          memoryUsage: Math.random() * 100,
          diskUsage: Math.random() * 100,
          networkUsage: Math.random() * 100,
          activeConnections: Math.floor(Math.random() * 1000),
          queueLength: Math.floor(Math.random() * 100)
        };

        metrics.push(dayMetrics);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return metrics;
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw new Error(`Failed to get system stats: ${error.message}`);
    }
  }

  async getStatsComparison(comparisonDto: StatsComparisonDto): Promise<any> {
    try {
      const currentPeriod = await this.getStatsForPeriod(comparisonDto.type, comparisonDto.period, 0);
      const previousPeriod = await this.getStatsForPeriod(comparisonDto.type, comparisonDto.period, comparisonDto.comparePeriods || 1);

      return {
        current: currentPeriod,
        previous: previousPeriod,
        comparison: this.calculateComparison(currentPeriod, previousPeriod)
      };
    } catch (error) {
      console.error('Error getting stats comparison:', error);
      throw new Error(`Failed to get stats comparison: ${error.message}`);
    }
  }

  async exportStats(exportDto: StatsExportDto): Promise<any> {
    try {
      const stats = await this.getStatsForPeriod(exportDto.type, exportDto.period, 0);
      
      return {
        type: exportDto.type,
        period: exportDto.period,
        data: stats,
        exportedAt: new Date().toISOString(),
        format: exportDto.format || 'json'
      };
    } catch (error) {
      console.error('Error exporting stats:', error);
      throw new Error(`Failed to export stats: ${error.message}`);
    }
  }

  private async getStatsForPeriod(type: string, period: string, periodsBack: number): Promise<any> {
    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case 'hour':
          startDate.setHours(endDate.getHours() - (periodsBack + 1));
          break;
        case 'day':
          startDate.setDate(endDate.getDate() - (periodsBack + 1));
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - (periodsBack + 1) * 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - (periodsBack + 1));
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - (periodsBack + 1) * 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - (periodsBack + 1));
          break;
        default:
          startDate.setDate(endDate.getDate() - (periodsBack + 1));
      }

      switch (type) {
        case 'users':
          return await this.getUserStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'jobs':
          return await this.getJobStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'applications':
          return await this.getApplicationStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'interviews':
          return await this.getInterviewStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'payments':
          return await this.getPaymentStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'subscriptions':
          return await this.getSubscriptionStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'revenue':
          return await this.getRevenueStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'performance':
          return await this.getPerformanceStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        case 'system':
          return await this.getSystemStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
        default:
          return await this.getGeneralStats({ dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() });
      }
    } catch (error) {
      console.error('Error getting stats for period:', error);
      throw new Error(`Failed to get stats for period: ${error.message}`);
    }
  }

  private calculateComparison(current: any, previous: any): any {
    try {
      if (!current || !previous) {
        return { change: 0, percentage: 0 };
      }

      const currentValue = typeof current === 'number' ? current : current.count || 0;
      const previousValue = typeof previous === 'number' ? previous : previous.count || 0;

      const change = currentValue - previousValue;
      const percentage = previousValue > 0 ? (change / previousValue) * 100 : 0;

      return {
        change,
        percentage,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      };
    } catch (error) {
      console.error('Error calculating comparison:', error);
      return { change: 0, percentage: 0, trend: 'stable' };
    }
  }
}

export const statsService = new StatsService();