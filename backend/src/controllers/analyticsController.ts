import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export const analyticsController = {
  async getKeyMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { companyId, period = 'month' } = req.query;
      const metrics = await analyticsService.getKeyMetrics(period as string, companyId as string);
      
      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error getting key metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting key metrics',
        error: error.message
      });
    }
  },

  /**
   * Отримання комплексної аналітики з реальними даними
   */
  async getRealAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { companyId, period = 'month' } = req.query;
      const analytics = await analyticsService.getRealAnalyticsMetrics(period as string, companyId as string);
      
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error getting real analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting real analytics',
        error: error.message
      });
    }
  },

  async getChartData(req: Request, res: Response): Promise<void> {
    try {
      const chartData = await analyticsService.getChartData();
      
      res.status(200).json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error getting chart data:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting chart data',
        error: error.message
      });
    }
  },

  async getAnalyticsReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await analyticsService.getAnalyticsReports();
      
      res.status(200).json({
        success: true,
        data: reports
      });
    } catch (error) {
      console.error('Error getting analytics reports:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting analytics reports',
        error: error.message
      });
    }
  },

  async getAnalyticsStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await analyticsService.getAnalyticsStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting analytics stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting analytics stats',
        error: error.message
      });
    }
  },

  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const reportData = req.body;
      const report = await analyticsService.createReport(reportData);
      
      res.status(201).json({
        success: true,
        data: report,
        message: 'Report created successfully'
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating report',
        error: error.message
      });
    }
  },

  async getReportDetails(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const report = await analyticsService.getReportDetails(reportId);
      
      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error getting report details:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting report details',
        error: error.message
      });
    }
  },

  async exportAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { format, period, category } = req.query;
      const exportData = await analyticsService.exportAnalytics({ format, period, category });
      
      res.status(200).json({
        success: true,
        data: exportData,
        message: 'Analytics exported successfully'
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error exporting analytics',
        error: error.message
      });
    }
  },

  async getAnalyticsTrends(req: Request, res: Response): Promise<void> {
    try {
      const { metric, period } = req.query;
      const trends = await analyticsService.getAnalyticsTrends({ metric, period });
      
      res.status(200).json({
        success: true,
        data: trends
      });
    } catch (error) {
      console.error('Error getting analytics trends:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting analytics trends',
        error: error.message
      });
    }
  }
};
