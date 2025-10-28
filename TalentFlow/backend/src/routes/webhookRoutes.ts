import { Router } from 'express';
import { webhookController } from '../controllers/webhookController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UuidParamDto } from '../dto/CommonDto';
import { 
  CreateWebhookDto, 
  UpdateWebhookDto, 
  WebhookSearchDto,
  WebhookPayloadDto,
  TestWebhookDto
} from '../dto/WebhookDto';

const router = Router();

// Публічні маршрути для вхідних webhook'ів
router.post('/incoming', webhookController.handleIncomingWebhook);

// Всі інші маршрути потребують авторизації
router.use(authenticateToken);

// Отримання всіх webhook'ів з фільтрацією
router.get('/', validateQuery(WebhookSearchDto), webhookController.getAllWebhooks);

// Отримання активних webhook'ів
router.get('/active', webhookController.getActiveWebhooks);

// Отримання webhook'ів по події
router.get('/event/:event', webhookController.getWebhooksByEvent);

// Отримання доступних подій
router.get('/events', webhookController.getAvailableEvents);

// Отримання статистики webhook'ів
router.get('/stats', requireRole(['admin', 'manager']), webhookController.getWebhookStats);

// Отримання webhook'а за ID
router.get('/:id', validateParams(UuidParamDto), webhookController.getWebhookById);

// Отримання здоров'я webhook'а
router.get('/:id/health', validateParams(UuidParamDto), webhookController.getWebhookHealth);

// Валідація webhook'а
router.get('/:id/validate', validateParams(UuidParamDto), webhookController.validateWebhook);

// Створення нового webhook'а
router.post('/', validateDto(CreateWebhookDto), webhookController.createWebhook);

// Тестування webhook'а
router.post('/test', validateDto(TestWebhookDto), webhookController.testWebhook);

// Тригер webhook'а
router.post('/:id/trigger', validateParams(UuidParamDto), validateDto(WebhookPayloadDto), webhookController.triggerWebhook);

// Оновлення webhook'а
router.put('/:id', validateParams(UuidParamDto), validateDto(UpdateWebhookDto, true), webhookController.updateWebhook);

// Видалення webhook'а
router.delete('/:id', requireRole(['admin']), validateParams(UuidParamDto), webhookController.deleteWebhook);

export default router;
