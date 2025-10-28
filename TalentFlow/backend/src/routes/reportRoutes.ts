import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { GenerateReportDto, UpdateReportDto, ReportSearchDto, ReportTemplateDto, ReportScheduleDto, ReportExportDto, ReportAnalyticsDto, BulkReportActionDto, ReportPreviewDto, ReportParamDto, TemplateParamDto, ScheduleParamDto } from '../dto/ReportDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Отримання всіх звітів
router.get('/',
  validateDto(ReportSearchDto, true),
  reportController.getAllReports
);

// Отримання статистики звітів
router.get('/stats',
  reportController.getReportStats
);

// Отримання звіту за ID
router.get('/:reportId',
  validateDto(ReportParamDto, true),
  reportController.getReportById
);

// Генерація звіту
router.post('/generate',
  validateDto(GenerateReportDto, false),
  reportController.generateReport
);

// Попередній перегляд звіту
router.post('/preview',
  validateDto(ReportPreviewDto, false),
  reportController.previewReport
);

// Експорт звіту
router.post('/export',
  validateDto(ReportExportDto, false),
  reportController.exportReport
);

// Масові дії з звітами
router.post('/bulk-action',
  validateDto(BulkReportActionDto, false),
  reportController.bulkReportAction
);

// Оновлення звіту
router.put('/:reportId',
  validateDto(UpdateReportDto, false),
  reportController.updateReport
);

// Видалення звіту
router.delete('/:reportId',
  validateDto(ReportParamDto, true),
  reportController.deleteReport
);

// Шаблони звітів
router.get('/templates',
  reportController.getReportTemplates
);

router.post('/templates',
  validateDto(ReportTemplateDto, false),
  reportController.createReportTemplate
);

router.put('/templates/:templateId',
  validateDto(ReportTemplateDto, false),
  reportController.updateReportTemplate
);

router.delete('/templates/:templateId',
  validateDto(TemplateParamDto, true),
  reportController.deleteReportTemplate
);

// Розклади звітів
router.get('/schedules',
  reportController.getReportSchedules
);

router.post('/schedules',
  validateDto(ReportScheduleDto, false),
  reportController.createReportSchedule
);

router.put('/schedules/:scheduleId',
  validateDto(ReportScheduleDto, false),
  reportController.updateReportSchedule
);

router.delete('/schedules/:scheduleId',
  validateDto(ScheduleParamDto, true),
  reportController.deleteReportSchedule
);

export default router;