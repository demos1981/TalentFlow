import { Router } from 'express';
import { applicationController } from '../controllers/applicationController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { CreateApplicationDto, UpdateApplicationDto, ApplicationSearchDto } from '../dto/ApplicationDto';
import { UuidParamDto } from '../dto/CommonDto';
;

const router = Router();

// Middleware для всіх Application роутів
router.use(authenticateToken);

// Application management
router.post('/', validateDto(CreateApplicationDto), applicationController.createApplication);
router.get('/', validateQuery(ApplicationSearchDto), applicationController.getAllApplications);
router.get('/employer/my-applications', validateQuery(ApplicationSearchDto), applicationController.getEmployerApplications);
router.get('/stats', requireRole(['admin', 'employer']), applicationController.getApplicationStats);
router.get('/:id', validateParams(UuidParamDto), applicationController.getApplicationById);
router.put('/:id', validateParams(UuidParamDto), validateDto(UpdateApplicationDto, true), applicationController.updateApplication);
router.patch('/:id/status', validateParams(UuidParamDto), applicationController.updateApplicationStatus);
router.delete('/:id', validateParams(UuidParamDto), applicationController.deleteApplication);

export default router;
