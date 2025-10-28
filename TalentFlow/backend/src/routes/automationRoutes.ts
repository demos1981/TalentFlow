import { Router } from 'express';
import { automationController } from '../controllers/automationController';
import { authenticateToken } from '../middleware/auth';
import { validateParams, validateQuery } from '../middleware/dtoValidation';
import { SearchDto, UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Middleware для всіх Automation роутів
router.use(authenticateToken);

// Отримання списку всіх автоматизацій
router.get('/', validateQuery(SearchDto), automationController.getAllWorkflows);

// Отримання статистики автоматизацій
router.get('/stats', automationController.getAutomationStats);

// Отримання шаблонів автоматизацій
router.get('/templates', automationController.getAutomationTemplates);

// Отримання деталей автоматизації
router.get('/:workflowId', validateParams(UuidParamDto), automationController.getWorkflowDetails);

// Створення нової автоматизації
router.post('/', automationController.createWorkflow);

// Оновлення автоматизації
router.put('/:workflowId', validateParams(UuidParamDto), automationController.updateWorkflow);

// Запуск автоматизації
router.post('/:workflowId/run', validateParams(UuidParamDto), automationController.runWorkflow);

// Активування/деактивування автоматизації
router.post('/:workflowId/toggle', validateParams(UuidParamDto), automationController.toggleWorkflow);

// Видалення автоматизації
router.delete('/:workflowId', validateParams(UuidParamDto), automationController.deleteWorkflow);

// Отримання логів автоматизації
router.get('/:workflowId/logs', validateParams(UuidParamDto), automationController.getWorkflowLogs);

export default router;
