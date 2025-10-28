import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';
import { dashboardServiceExtensions } from '../services/dashboardServiceExtensions';
import { validateDto } from '../middleware/dtoValidation';
import {
  DashboardStatsDto,
  AnalyticsDto,
  TopStatsDto,
  UserActivityDto,
  RevenueStatsDto,
  ConversionStatsDto,
  EngagementStatsDto,
  DashboardPeriod
} from '../dto/DashboardDto';

export const dashboardController = {
  /**
   * Отримання загальної статистики дашборду
   */
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(DashboardStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const statsDto: DashboardStatsDto = req.query as any;
      const stats = await dashboardService.getDashboardStats(statsDto);
      
      res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting dashboard statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики за період
   */
  async getStatsByPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'month' } = req.query;

      if (!period || typeof period !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Period parameter is required'
        });
        return;
      }

      // Валідація period
      const validPeriods = Object.values(DashboardPeriod);
      if (!validPeriods.includes(period as DashboardPeriod)) {
        res.status(400).json({
          success: false,
          message: `Invalid period. Must be one of: ${validPeriods.join(', ')}`
        });
        return;
      }

      const stats = await dashboardService.getStatsByPeriod(period);
      
      res.status(200).json({
        success: true,
        message: 'Period statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting stats by period:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting period statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання топ статистики
   */
  async getTopStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(TopStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const topStatsDto: TopStatsDto = req.query as any;
      const topStats = await dashboardService.getTopStats(topStatsDto);
      
      res.status(200).json({
        success: true,
        message: 'Top statistics retrieved successfully',
        data: topStats
      });
    } catch (error) {
      console.error('Error getting top stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting top statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання аналітики
   */
  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(AnalyticsDto, true)(req, res, () => {});
      if (validationResult) return;

      const analyticsDto: AnalyticsDto = req.query as any;
      const analytics = await dashboardService.getAnalytics(analyticsDto);
      
      res.status(200).json({
        success: true,
        message: 'Analytics data retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error getting analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting analytics data',
        error: error.message
      });
    }
  },

  /**
   * Отримання активності користувачів
   */
  async getUserActivity(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UserActivityDto, true)(req, res, () => {});
      if (validationResult) return;

      const userActivityDto: UserActivityDto = req.query as any;
      const activity = await dashboardService.getUserActivity(userActivityDto);
      
      res.status(200).json({
        success: true,
        message: 'User activity retrieved successfully',
        data: activity
      });
    } catch (error) {
      console.error('Error getting user activity:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user activity',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики доходів
   */
  async getRevenueStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(RevenueStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const revenueStatsDto: RevenueStatsDto = req.query as any;
      const analytics = await dashboardService.getAnalytics({
        type: 'revenue' as any,
        period: revenueStatsDto.period,
        userId: revenueStatsDto.userId,
        limit: 30
      });
      
      res.status(200).json({
        success: true,
        message: 'Revenue statistics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error getting revenue stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting revenue statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики конверсій
   */
  async getConversionStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ConversionStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const conversionStatsDto: ConversionStatsDto = req.query as any;
      const analytics = await dashboardService.getAnalytics({
        type: 'conversions' as any,
        period: conversionStatsDto.period,
        userId: conversionStatsDto.userId,
        limit: 30
      });
      
      res.status(200).json({
        success: true,
        message: 'Conversion statistics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error getting conversion stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting conversion statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики залучення
   */
  async getEngagementStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(EngagementStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const engagementStatsDto: EngagementStatsDto = req.query as any;
      const analytics = await dashboardService.getAnalytics({
        type: 'engagement' as any,
        period: engagementStatsDto.period,
        userId: engagementStatsDto.userId,
        limit: 30
      });
      
      res.status(200).json({
        success: true,
        message: 'Engagement statistics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error getting engagement stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting engagement statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання швидкого огляду
   */
  async getQuickOverview(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      const stats = await dashboardService.getDashboardStats({
        userId,
        period: DashboardPeriod.WEEK
      });
      
      res.status(200).json({
        success: true,
        message: 'Quick overview retrieved successfully',
        data: {
          overview: stats.overview,
          recentActivity: stats.recentActivity
        }
      });
    } catch (error) {
      console.error('Error getting quick overview:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting quick overview',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики для конкретного користувача
   */
  async getUserDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role } = req.query;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const stats = await dashboardServiceExtensions.getUserDashboardStats(userId, role as string);
      
      res.status(200).json({
        success: true,
        message: 'User dashboard statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting user dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user dashboard statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання активності для конкретного користувача
   */
  async getUserActivities(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role, limit = 10 } = req.query;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const activities = await dashboardServiceExtensions.getUserActivities(userId, role as string, parseInt(limit as string));
      
      res.status(200).json({
        success: true,
        message: 'User activities retrieved successfully',
        data: activities
      });
    } catch (error) {
      console.error('Error getting user activities:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user activities',
        error: error.message
      });
    }
  },

  /**
   * Отримання вакансій для конкретного користувача
   */
  async getUserJobs(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role, limit = 5 } = req.query;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const jobs = await dashboardServiceExtensions.getUserJobs(userId, role as string, parseInt(limit as string));
      
      res.status(200).json({
        success: true,
        message: 'User jobs retrieved successfully',
        data: jobs
      });
    } catch (error) {
      console.error('Error getting user jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user jobs',
        error: error.message
      });
    }
  },

  /**
   * Отримання інсайтів для конкретного користувача
   */
  async getUserInsights(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role } = req.query;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const insights = await dashboardServiceExtensions.getUserInsights(userId, role as string);
      
      res.status(200).json({
        success: true,
        message: 'User insights retrieved successfully',
        data: insights
      });
    } catch (error) {
      console.error('Error getting user insights:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user insights',
        error: error.message
      });
    }
  },

  /**
   * Отримання рекомендацій для користувача
   */
  async getUserRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit = 5 } = req.query;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      // Отримуємо рекомендації через AI matching service
      const recommendations = await dashboardServiceExtensions.getUserRecommendations(userId, Number(limit));
      
      res.status(200).json({
        success: true,
        message: 'User recommendations retrieved successfully',
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user recommendations',
        error: error.message
      });
    }
  }
};
