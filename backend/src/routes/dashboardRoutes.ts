import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';
import { validateDto } from '../middleware/dtoValidation';
import {
  DashboardStatsDto,
  AnalyticsDto,
  TopStatsDto,
  UserActivityDto,
  RevenueStatsDto,
  ConversionStatsDto,
  EngagementStatsDto
} from '../dto/DashboardDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Загальна статистика дашборду
router.get('/stats',
  validateDto(DashboardStatsDto, true),
  dashboardController.getDashboardStats
);

// Швидкий огляд
router.get('/overview', dashboardController.getQuickOverview);

// Статистика за період
router.get('/period/:period', dashboardController.getStatsByPeriod);

// Топ статистика
router.get('/top',
  validateDto(TopStatsDto, true),
  dashboardController.getTopStats
);

// Аналітика
router.get('/analytics',
  validateDto(AnalyticsDto, true),
  dashboardController.getAnalytics
);

// Активність користувачів (тільки для адмінів)
router.get('/user-activity',
  requireRole(['admin']),
  validateDto(UserActivityDto, true),
  dashboardController.getUserActivity
);

// Статистика доходів (тільки для адмінів)
router.get('/revenue',
  requireRole(['admin']),
  validateDto(RevenueStatsDto, true),
  dashboardController.getRevenueStats
);

// Статистика конверсій
router.get('/conversions',
  validateDto(ConversionStatsDto, true),
  dashboardController.getConversionStats
);

// Статистика залучення
router.get('/engagement',
  validateDto(EngagementStatsDto, true),
  dashboardController.getEngagementStats
);

// Нові ендпоінти для фронтенду
router.get('/stats/:userId', dashboardController.getUserDashboardStats);
router.get('/activities/:userId', dashboardController.getUserActivities);
router.get('/jobs/:userId', dashboardController.getUserJobs);
router.get('/insights/:userId', dashboardController.getUserInsights);
router.get('/recommendations/:userId', dashboardController.getUserRecommendations);

export default router;