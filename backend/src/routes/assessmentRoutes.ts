import { Router } from 'express';
import { assessmentController } from '../controllers/assessmentController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UuidParamDto } from '../dto/CommonDto';
import { 
  CreateAssessmentDto, 
  UpdateAssessmentDto, 
  AssessmentSearchDto, 
  CompleteAssessmentDto 
} from '../dto/AssessmentDto';

const router = Router();

// Middleware для всіх Assessment роутів
router.use(authenticateToken);

// Assessment management
router.post('/', requireRole(['admin', 'employer']), validateDto(CreateAssessmentDto), assessmentController.createAssessment);
router.get('/', validateQuery(AssessmentSearchDto), assessmentController.getAllAssessments);
router.get('/stats', requireRole(['admin', 'employer']), assessmentController.getAssessmentStats);
router.get('/user/my-assessments', validateQuery(AssessmentSearchDto), assessmentController.getAssessmentsByUser);
router.get('/job/:jobId', validateParams(UuidParamDto), validateQuery(AssessmentSearchDto), assessmentController.getAssessmentsByJob);
router.get('/:id', validateParams(UuidParamDto), assessmentController.getAssessmentById);
router.put('/:id', requireRole(['admin', 'employer']), validateParams(UuidParamDto), validateDto(UpdateAssessmentDto, true), assessmentController.updateAssessment);
router.patch('/:id/start', validateParams(UuidParamDto), assessmentController.startAssessment);
router.patch('/:id/complete', validateParams(UuidParamDto), validateDto(CompleteAssessmentDto), assessmentController.completeAssessment);
router.delete('/:id', requireRole(['admin']), validateParams(UuidParamDto), assessmentController.deleteAssessment);

export default router;
