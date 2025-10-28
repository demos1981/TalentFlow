import { Router } from 'express';
import { OptimizedAiMatchingController } from '../controllers/optimizedAiMatchingController';
import { authenticateToken } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UuidParamDto, JobIdParamDto, CandidateIdParamDto } from '../dto/CommonDto';

const router = Router();

// Створюємо екземпляр контролера
const optimizedAiMatchingController = new OptimizedAiMatchingController();

// Middleware для всіх оптимізованих AI Matching роутів
router.use(authenticateToken);

// GET /api/optimized-ai-matching/jobs/:jobId/matches - Знайти найкращих кандидатів для вакансії
router.get('/jobs/:jobId/matches', 
  validateParams(JobIdParamDto), 
  optimizedAiMatchingController.findBestMatchesForJob
);

// POST /api/optimized-ai-matching/batch-match - Batch матчинг для множинних вакансій
router.post('/batch-match', optimizedAiMatchingController.batchMatchJobs);

// POST /api/optimized-ai-matching/embeddings/jobs/generate - Генерувати embeddings для вакансій
router.post('/embeddings/jobs/generate', optimizedAiMatchingController.generateJobEmbeddings);

// POST /api/optimized-ai-matching/embeddings/candidates/generate - Генерувати embeddings для кандидатів
router.post('/embeddings/candidates/generate', optimizedAiMatchingController.generateCandidateEmbeddings);

// PUT /api/optimized-ai-matching/embeddings/jobs/:jobId - Оновити embedding для вакансії
router.put('/embeddings/jobs/:jobId', 
  validateParams(JobIdParamDto), 
  optimizedAiMatchingController.updateJobEmbedding
);

// PUT /api/optimized-ai-matching/embeddings/candidates/:candidateId - Оновити embedding для кандидата
router.put('/embeddings/candidates/:candidateId', 
  validateParams(CandidateIdParamDto), 
  optimizedAiMatchingController.updateCandidateEmbedding
);

// GET /api/optimized-ai-matching/stats - Статистика embeddings та матчингу
router.get('/stats', optimizedAiMatchingController.getMatchingStats);

// GET /api/optimized-ai-matching/candidates/:candidateId/similar-jobs - Векторний пошук вакансій для кандидата
router.get('/candidates/:candidateId/similar-jobs', 
  validateParams(CandidateIdParamDto), 
  optimizedAiMatchingController.findSimilarJobs
);

// GET /api/optimized-ai-matching/jobs/:jobId/similar-candidates - Векторний пошук кандидатів для вакансії
router.get('/jobs/:jobId/similar-candidates', 
  validateParams(JobIdParamDto), 
  optimizedAiMatchingController.findSimilarCandidates
);

// POST /api/optimized-ai-matching/test-embedding - Тестувати embedding для тексту
router.post('/test-embedding', optimizedAiMatchingController.testEmbedding);

export default router;
