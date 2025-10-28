import { Router } from 'express';
import { performanceController } from '../controllers/performanceController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { CreateKPITargetDto, UpdateKPITargetDto, PerformanceSearchDto, UserPerformanceStatsDto, PerformanceStatsDto, ChartDataDto, ComparisonDataDto, TrendsDataDto, ExportReportDto, DetailedReportDto, BulkKPIActionDto, PerformanceAlertDto, KPITargetParamDto, PerformanceMetricParamDto } from '../dto/PerformanceDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Отримання KPI метрик
router.get('/metrics',
  validateDto(PerformanceSearchDto, true),
  performanceController.getKPIMetrics
);

// Отримання статистики продуктивності
router.get('/stats',
  validateDto(PerformanceStatsDto, true),
  performanceController.getPerformanceStats
);

// Отримання даних для графіків
router.get('/charts',
  validateDto(ChartDataDto, true),
  performanceController.getChartData
);

// Отримання даних порівняння
router.get('/comparison',
  validateDto(ComparisonDataDto, true),
  performanceController.getComparisonData
);

// Отримання даних трендів
router.get('/trends',
  validateDto(TrendsDataDto, true),
  performanceController.getTrendsData
);

// Створення KPI цілі
router.post('/targets',
  validateDto(CreateKPITargetDto, false),
  performanceController.createKPITarget
);

// Масові дії з KPI цілями
router.post('/targets/bulk-action',
  validateDto(BulkKPIActionDto, false),
  performanceController.bulkKPIAction
);

// Створення алерту продуктивності
router.post('/alerts',
  validateDto(PerformanceAlertDto, false),
  performanceController.createPerformanceAlert
);

// Оновлення KPI цілі
router.put('/targets/:targetId',
  validateDto(UpdateKPITargetDto, false),
  performanceController.updateKPITarget
);

// Видалення KPI цілі
router.delete('/targets/:targetId',
  validateDto(KPITargetParamDto, true),
  performanceController.deleteKPITarget
);

export default router;