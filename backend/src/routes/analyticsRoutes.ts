import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';
import { validateParams, validateQuery } from '../middleware/dtoValidation';
import { SearchDto, UuidParamDto, AnalyticsQueryDto } from '../dto/CommonDto';

const router = Router();

// Middleware для всіх Analytics роутів
router.use(authenticateToken);

// Отримання ключових метрик
router.get('/metrics', validateQuery(AnalyticsQueryDto), analyticsController.getKeyMetrics);

// Отримання реальної аналітики
router.get('/real', validateQuery(AnalyticsQueryDto), analyticsController.getRealAnalytics);

// Отримання даних для графіків
router.get('/charts', validateQuery(SearchDto), analyticsController.getChartData);

// Отримання аналітичних звітів
router.get('/reports', validateQuery(SearchDto), analyticsController.getAnalyticsReports);

// Отримання статистики аналітики
router.get('/stats', validateQuery(SearchDto), analyticsController.getAnalyticsStats);

// Створення нового звіту
router.post('/reports', analyticsController.createReport);

// Отримання детального звіту
router.get('/reports/:reportId', validateParams(UuidParamDto), analyticsController.getReportDetails);

// Експорт аналітичних даних
router.post('/export', analyticsController.exportAnalytics);

// Отримання трендів аналітики
router.get('/trends', validateQuery(SearchDto), analyticsController.getAnalyticsTrends);

export default router;
