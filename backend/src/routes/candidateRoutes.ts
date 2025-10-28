import { Router } from 'express';
import { candidateController } from '../controllers/candidateController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateParams, validateQuery, validateDto } from '../middleware/dtoValidation';
import { SearchCandidatesDto, CreateCandidateDto, UpdateCandidateDto } from '../dto/CandidateDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Публічні роути (без аутентифікації)
router.get('/skills', candidateController.getAvailableSkills);
router.get('/locations', candidateController.getAvailableLocations);

// Захищені роути (потребують аутентифікації)
router.use(authenticateToken);

// CRUD операції для кандидатів
router.post('/profile', candidateController.createOwnProfile); // Створення власного профілю
router.post('/', requireRole(['admin', 'employer']), validateDto(CreateCandidateDto), candidateController.createCandidate); // Створення кандидата роботодавцем
router.get('/', validateQuery(SearchCandidatesDto), candidateController.getAllCandidates); // Замість /search
router.get('/:id', validateParams(UuidParamDto), candidateController.getCandidateById);
router.put('/:id', validateParams(UuidParamDto), validateDto(UpdateCandidateDto, true), candidateController.updateCandidate);
router.delete('/:id', validateParams(UuidParamDto), candidateController.deleteCandidate);

// Додаткові операції
router.get('/recommended/:jobId', validateParams(UuidParamDto), candidateController.getRecommendedCandidates);
router.get('/stats/overview', candidateController.getSearchStats);
router.patch('/:id/views', validateParams(UuidParamDto), candidateController.incrementViews);

export default router;
