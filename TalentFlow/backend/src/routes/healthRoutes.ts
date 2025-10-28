import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { validateDto } from '../middleware/dtoValidation';
import { MetricsDto, ServiceParamDto } from '../dto/HealthDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Публічні маршрути (не потребують авторизації)
// Базові health checks
router.get('/', healthController.getHealth);
router.get('/detailed', healthController.getDetailedHealth);
router.get('/ready', healthController.getReadiness);
router.get('/live', healthController.getLiveness);

// Метрики та моніторинг
router.get('/metrics',
  validateDto(MetricsDto, true),
  healthController.getMetrics
);

// Специфічні перевірки
router.get('/database', healthController.getDatabaseHealth);
router.get('/external', healthController.getExternalServicesHealth);
router.get('/external/:service',
  validateDto(ServiceParamDto, true),
  healthController.getExternalServiceHealth
);
router.get('/system-load', healthController.getSystemLoad);

export default router;