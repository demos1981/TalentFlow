import { Request, Response } from 'express';
import { reportService } from '../services/reportService';
import { validateDto } from '../middleware/dtoValidation';
import { GenerateReportDto, UpdateReportDto, ReportSearchDto, ReportTemplateDto, ReportScheduleDto, ReportExportDto, BulkReportActionDto, ReportPreviewDto, ReportParamDto, TemplateParamDto, ScheduleParamDto } from '../dto/ReportDto';

export const reportController = {
  /**
   * Отримання всіх звітів
   */
  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: ReportSearchDto = req.query as any;
      const result = await reportService.getAllReports(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Reports retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting reports:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting reports',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики звітів
   */
  async getReportStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const stats = await reportService.getReportStats(userId);
      
      res.status(200).json({
        success: true,
        message: 'Report statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting report stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting report statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання звіту за ID
   */
  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { reportId } = req.params;
      const report = await reportService.getReportById(reportId, userId);
      
      if (!report) {
        res.status(404).json({
          success: false,
          message: 'Report not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report retrieved successfully',
        data: report
      });
    } catch (error) {
      console.error('Error getting report:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting report',
        error: error.message
      });
    }
  },

  /**
   * Генерація звіту
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(GenerateReportDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const reportData: GenerateReportDto = req.body;
      const report = await reportService.generateReport(reportData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Report generated successfully',
        data: report
      });
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(400).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  },

  /**
   * Оновлення звіту
   */
  async updateReport(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateReportDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { reportId } = req.params;
      const updateData: UpdateReportDto = req.body;
      const report = await reportService.updateReport(reportId, updateData, userId);
      
      if (!report) {
        res.status(404).json({
          success: false,
          message: 'Report not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report updated successfully',
        data: report
      });
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating report',
        error: error.message
      });
    }
  },

  /**
   * Видалення звіту
   */
  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { reportId } = req.params;
      const success = await reportService.deleteReport(reportId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Report not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting report',
        error: error.message
      });
    }
  },

  /**
   * Попередній перегляд звіту
   */
  async previewReport(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportPreviewDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const previewData: ReportPreviewDto = req.body;
      const result = await reportService.previewReport(previewData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Report preview generated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error previewing report:', error);
      res.status(400).json({
        success: false,
        message: 'Error previewing report',
        error: error.message
      });
    }
  },

  /**
   * Експорт звіту
   */
  async exportReport(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportExportDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const exportData: ReportExportDto = req.body;
      const report = await reportService.exportReport(exportData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Report exported successfully',
        data: report
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      res.status(400).json({
        success: false,
        message: 'Error exporting report',
        error: error.message
      });
    }
  },

  /**
   * Масові дії з звітами
   */
  async bulkReportAction(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(BulkReportActionDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const bulkData: BulkReportActionDto = req.body;
      const count = await reportService.bulkReportAction(bulkData, userId);
      
      res.status(200).json({
        success: true,
        message: `Bulk report action completed successfully. ${count} reports affected.`,
        data: { count }
      });
    } catch (error) {
      console.error('Error performing bulk report action:', error);
      res.status(400).json({
        success: false,
        message: 'Error performing bulk report action',
        error: error.message
      });
    }
  },

  /**
   * Створення шаблону звіту
   */
  async createReportTemplate(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportTemplateDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const templateData: ReportTemplateDto = req.body;
      const template = await reportService.createReportTemplate(templateData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Report template created successfully',
        data: template
      });
    } catch (error) {
      console.error('Error creating report template:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating report template',
        error: error.message
      });
    }
  },

  /**
   * Оновлення шаблону звіту
   */
  async updateReportTemplate(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportTemplateDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { templateId } = req.params;
      const updateData: Partial<ReportTemplateDto> = req.body;
      const template = await reportService.updateReportTemplate(templateId, updateData, userId);
      
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Report template not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report template updated successfully',
        data: template
      });
    } catch (error) {
      console.error('Error updating report template:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating report template',
        error: error.message
      });
    }
  },

  /**
   * Видалення шаблону звіту
   */
  async deleteReportTemplate(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(TemplateParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { templateId } = req.params;
      const success = await reportService.deleteReportTemplate(templateId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Report template not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report template deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting report template:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting report template',
        error: error.message
      });
    }
  },

  /**
   * Отримання шаблонів звітів
   */
  async getReportTemplates(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const isPublic = req.query.public === 'true';
      const templates = await reportService.getReportTemplates(userId, isPublic);
      
      res.status(200).json({
        success: true,
        message: 'Report templates retrieved successfully',
        data: templates
      });
    } catch (error) {
      console.error('Error getting report templates:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting report templates',
        error: error.message
      });
    }
  },

  /**
   * Створення розкладу звітів
   */
  async createReportSchedule(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportScheduleDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const scheduleData: ReportScheduleDto = req.body;
      const schedule = await reportService.createReportSchedule(scheduleData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Report schedule created successfully',
        data: schedule
      });
    } catch (error) {
      console.error('Error creating report schedule:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating report schedule',
        error: error.message
      });
    }
  },

  /**
   * Оновлення розкладу звітів
   */
  async updateReportSchedule(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ReportScheduleDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { scheduleId } = req.params;
      const updateData: Partial<ReportScheduleDto> = req.body;
      const schedule = await reportService.updateReportSchedule(scheduleId, updateData, userId);
      
      if (!schedule) {
        res.status(404).json({
          success: false,
          message: 'Report schedule not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report schedule updated successfully',
        data: schedule
      });
    } catch (error) {
      console.error('Error updating report schedule:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating report schedule',
        error: error.message
      });
    }
  },

  /**
   * Видалення розкладу звітів
   */
  async deleteReportSchedule(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ScheduleParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { scheduleId } = req.params;
      const success = await reportService.deleteReportSchedule(scheduleId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Report schedule not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Report schedule deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting report schedule:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting report schedule',
        error: error.message
      });
    }
  },

  /**
   * Отримання розкладів звітів
   */
  async getReportSchedules(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const schedules = await reportService.getReportSchedules(userId);
      
      res.status(200).json({
        success: true,
        message: 'Report schedules retrieved successfully',
        data: schedules
      });
    } catch (error) {
      console.error('Error getting report schedules:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting report schedules',
        error: error.message
      });
    }
  }
};