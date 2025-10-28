import { Router } from 'express';
import { aiMatchingController } from '../controllers/aiMatchingController';
import { authenticateToken } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UuidParamDto } from '../dto/CommonDto';
import { 
  GenerateRecommendationsDto, 
  BulkGenerateRecommendationsDto, 
  UpdateRecommendationDto,
  AiMatchingFiltersDto,
  AiMatchingSearchDto
} from '../dto/AIMatchingDto';

const router = Router();

// Middleware для всіх AI Matching роутів
router.use(authenticateToken);

// GET /api/ai-matching/recommendations - Отримати рекомендації
router.get('/recommendations', validateQuery(AiMatchingFiltersDto), aiMatchingController.getRecommendations);

// GET /api/ai-matching/recommendations/:id - Отримати конкретну рекомендацію
router.get('/recommendations/:id', validateParams(UuidParamDto), aiMatchingController.getRecommendationById);

// POST /api/ai-matching/generate - Згенерувати нові рекомендації
router.post('/generate', validateDto(GenerateRecommendationsDto, true), aiMatchingController.generateRecommendations);

// POST /api/ai-matching/bulk-generate - Масово згенерувати рекомендації
router.post('/bulk-generate', validateDto(BulkGenerateRecommendationsDto, true), aiMatchingController.bulkGenerateRecommendations);

// PUT /api/ai-matching/recommendations/:id - Оновити рекомендацію
router.put('/recommendations/:id', validateParams(UuidParamDto), validateDto(UpdateRecommendationDto, true), aiMatchingController.updateRecommendation);

// GET /api/ai-matching/stats - Отримати статистику
router.get('/stats', validateQuery(AiMatchingSearchDto), aiMatchingController.getMatchingStats);

// DELETE /api/ai-matching/cleanup - Видалити застарілі рекомендації
router.delete('/cleanup', aiMatchingController.cleanupOldRecommendations);

// GET /api/ai-matching/health - Перевірка стану сервісу
router.get('/health', aiMatchingController.healthCheck);

// GET /api/ai-matching/ai-health - Перевірка стану AI
router.get('/ai-health', aiMatchingController.aiHealthCheck);

// GET /api/ai-matching/languages - Отримати підтримувані мови
router.get('/languages', aiMatchingController.getSupportedLanguages);

export default router;
