import { Request, Response } from 'express';
import { performanceService } from '../services/performanceService';
import { validateDto } from '../middleware/dtoValidation';
import { CreateKPITargetDto, UpdateKPITargetDto, PerformanceSearchDto, PerformanceStatsDto, ChartDataDto, ComparisonDataDto, TrendsDataDto, BulkKPIActionDto, PerformanceAlertDto, KPITargetParamDto } from '../dto/PerformanceDto';

export const performanceController = {
  /**
   * Отримання KPI метрик
   */
  async getKPIMetrics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: any = req.query;
      const page = parseInt(searchFilters.page) || 1;
      const limit = parseInt(searchFilters.limit) || 20;
      
      const result = await performanceService.getKPIMetrics(searchFilters, page, limit, userId);
      
      res.status(200).json({
        success: true,
        message: 'KPI metrics retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Error getting KPI metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting KPI metrics',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики продуктивності
   */
  async getPerformanceStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: any = req.query;
      const stats = await performanceService.getPerformanceStats(statsFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Performance statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Error getting performance stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting performance statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання даних для графіків
   */
  async getChartData(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const chartData: any = req.query;
      const result = await performanceService.getChartData(chartData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Chart data retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Error getting chart data:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting chart data',
        error: error.message
      });
    }
  },

  /**
   * Отримання даних порівняння
   */
  async getComparisonData(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ComparisonDataDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const comparisonData: ComparisonDataDto = req.query as any;
      const result = await performanceService.getComparisonData(comparisonData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Comparison data retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting comparison data:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting comparison data',
        error: error.message
      });
    }
  },

  /**
   * Отримання даних трендів
   */
  async getTrendsData(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(TrendsDataDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const trendsData: TrendsDataDto = req.query as any;
      const result = await performanceService.getTrendsData(trendsData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Trends data retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting trends data:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting trends data',
        error: error.message
      });
    }
  },

  /**
   * Створення KPI цілі
   */
  async createKPITarget(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreateKPITargetDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const targetData: CreateKPITargetDto = req.body;
      const target = await performanceService.createKPITarget(targetData, userId);
      
      res.status(201).json({
        success: true,
        message: 'KPI target created successfully',
        data: target
      });
    } catch (error) {
      console.error('Error creating KPI target:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating KPI target',
        error: error.message
      });
    }
  },

  /**
   * Оновлення KPI цілі
   */
  async updateKPITarget(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateKPITargetDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { targetId } = req.params;
      const updateData: UpdateKPITargetDto = req.body;
      const target = await performanceService.updateKPITarget(targetId, updateData, userId);
      
      if (!target) {
        res.status(404).json({
          success: false,
          message: 'KPI target not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'KPI target updated successfully',
        data: target
      });
    } catch (error) {
      console.error('Error updating KPI target:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating KPI target',
        error: error.message
      });
    }
  },

  /**
   * Видалення KPI цілі
   */
  async deleteKPITarget(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(KPITargetParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { targetId } = req.params;
      const success = await performanceService.deleteKPITarget(targetId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'KPI target not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'KPI target deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting KPI target:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting KPI target',
        error: error.message
      });
    }
  },

  /**
   * Масові дії з KPI цілями
   */
  async bulkKPIAction(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(BulkKPIActionDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const bulkData: BulkKPIActionDto = req.body;
      const count = await performanceService.bulkKPIAction(bulkData, userId);
      
      res.status(200).json({
        success: true,
        message: `Bulk KPI action completed successfully. ${count} targets affected.`,
        data: { count }
      });
    } catch (error) {
      console.error('Error performing bulk KPI action:', error);
      res.status(400).json({
        success: false,
        message: 'Error performing bulk KPI action',
        error: error.message
      });
    }
  },

  /**
   * Створення алерту продуктивності
   */
  async createPerformanceAlert(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(PerformanceAlertDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const alertData: PerformanceAlertDto = req.body;
      const alert = await performanceService.createPerformanceAlert(alertData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Performance alert created successfully',
        data: alert
      });
    } catch (error) {
      console.error('Error creating performance alert:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating performance alert',
        error: error.message
      });
    }
  }
};