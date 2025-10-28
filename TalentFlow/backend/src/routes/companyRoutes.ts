import { Router } from 'express';
import { companyController } from '../controllers/companyController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/CompanyDto';
import { SearchDto, UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Public routes
router.get('/', validateQuery(SearchDto), companyController.getAllCompanies);
router.get('/:id', validateParams(UuidParamDto), companyController.getCompanyById);

// Protected routes
router.use(authenticateToken);

// Company management
router.post('/', requireRole(['admin', 'employer']), validateDto(CreateCompanyDto), companyController.createCompany);
router.put('/:id', requireRole(['admin', 'employer']), validateParams(UuidParamDto), validateDto(UpdateCompanyDto, true), companyController.updateCompany);
router.delete('/:id', requireRole(['admin']), validateParams(UuidParamDto), companyController.deleteCompany);

// Admin only routes
router.post('/:id/verify', requireRole(['admin']), validateParams(UuidParamDto), companyController.verifyCompany);
router.get('/stats/overview', requireRole(['admin']), companyController.getCompanyStats);

// Company jobs statistics (available for employers to see their own stats)
router.get('/:companyId/jobs-stats', companyController.getCompanyJobsStats);

export default router;
