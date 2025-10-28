import { Request, Response } from 'express';
import { statsService } from '../services/statsService';
import { 
  GeneralStatsDto, 
  GeneralUserStatsDto, 
  UserStatsDto,
  JobStatsDto, 
  ApplicationStatsDto, 
  InterviewStatsDto, 
  PaymentStatsDto, 
  SubscriptionStatsDto, 
  RevenueStatsDto, 
  GeneralPerformanceStatsDto, 
  PerformanceStatsDto,
  SystemStatsDto, 
  StatsComparisonDto, 
  StatsExportDto 
} from '../dto/StatsDto';

export const statsController = {
  async getGeneralStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const generalStatsDto: GeneralStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getGeneralStats(generalStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting general stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting general stats',
        error: error.message
      });
    }
  },

  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const userStatsDto: UserStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        role: query.role as string,
        status: query.status as string,
        location: query.location as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getUserStats(userStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user stats',
        error: error.message
      });
    }
  },

  async getJobStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const jobStatsDto: JobStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        status: query.status as string,
        type: query.type as string,
        location: query.location as string,
        industry: query.industry as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getJobStats(jobStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting job stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting job stats',
        error: error.message
      });
    }
  },

  async getApplicationStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const applicationStatsDto: ApplicationStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        status: query.status as string,
        source: query.source as string,
        jobType: query.jobType as string,
        location: query.location as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getApplicationStats(applicationStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting application stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting application stats',
        error: error.message
      });
    }
  },

  async getInterviewStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const interviewStatsDto: InterviewStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        status: query.status as string,
        type: query.type as string,
        result: query.result as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getInterviewStats(interviewStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting interview stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting interview stats',
        error: error.message
      });
    }
  },

  async getPaymentStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const paymentStatsDto: PaymentStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        status: query.status as string,
        method: query.method as string,
        type: query.type as string,
        currency: query.currency as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getPaymentStats(paymentStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting payment stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payment stats',
        error: error.message
      });
    }
  },

  async getSubscriptionStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const subscriptionStatsDto: SubscriptionStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        status: query.status as string,
        plan: query.plan as string,
        billingCycle: query.billingCycle as string,
        currency: query.currency as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getSubscriptionStats(subscriptionStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting subscription stats',
        error: error.message
      });
    }
  },

  async getRevenueStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const revenueStatsDto: RevenueStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        source: query.source as string,
        type: query.type as string,
        currency: query.currency as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getRevenueStats(revenueStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting revenue stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting revenue stats',
        error: error.message
      });
    }
  },

  async getPerformanceStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const performanceStatsDto: PerformanceStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        service: query.service as string,
        endpoint: query.endpoint as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getPerformanceStats(performanceStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting performance stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting performance stats',
        error: error.message
      });
    }
  },

  async getSystemStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const systemStatsDto: SystemStatsDto = {
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        component: query.component as string,
        metric: query.metric as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        filters: query.filters as string
      };
      
      const stats = await statsService.getSystemStats(systemStatsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting system stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting system stats',
        error: error.message
      });
    }
  },

  async getStatsComparison(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const comparisonDto: StatsComparisonDto = {
        type: query.type as any,
        period: query.period as any,
        groupBy: query.groupBy as string,
        filters: query.filters as string,
        comparePeriods: query.comparePeriods ? parseInt(query.comparePeriods as string) : undefined
      };
      
      const stats = await statsService.getStatsComparison(comparisonDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting stats comparison:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting stats comparison',
        error: error.message
      });
    }
  },

  async exportStats(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const exportDto: StatsExportDto = {
        type: query.type as any,
        period: query.period as any,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        groupBy: query.groupBy as string,
        filters: query.filters as string,
        metrics: query.metrics ? (query.metrics as string).split(',') : undefined,
        format: query.format as string,
        fileName: query.fileName as string
      };
      
      const stats = await statsService.exportStats(exportDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error exporting stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error exporting stats',
        error: error.message
      });
    }
  }
};