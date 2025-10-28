import { Router } from 'express';
import { statsController } from '../controllers/statsController';
import { validateQuery } from '../middleware/dtoValidation';
import { 
  GeneralStatsDto, 
  UserStatsDto,
  JobStatsDto, 
  ApplicationStatsDto, 
  InterviewStatsDto, 
  PaymentStatsDto, 
  SubscriptionStatsDto, 
  RevenueStatsDto, 
  PerformanceStatsDto,
  SystemStatsDto, 
  StatsComparisonDto, 
  StatsExportDto 
} from '../dto/StatsDto';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';

const router = Router();

// Public stats endpoints
router.get('/', validateQuery(GeneralStatsDto), statsController.getGeneralStats);
router.get('/users', validateQuery(UserStatsDto), statsController.getUserStats);
router.get('/jobs', validateQuery(JobStatsDto), statsController.getJobStats);
router.get('/applications', validateQuery(ApplicationStatsDto), statsController.getApplicationStats);
router.get('/interviews', validateQuery(InterviewStatsDto), statsController.getInterviewStats);

// Protected stats endpoints (require authentication)
router.get('/payments', authenticateToken, validateQuery(PaymentStatsDto), statsController.getPaymentStats);
router.get('/subscriptions', authenticateToken, validateQuery(SubscriptionStatsDto), statsController.getSubscriptionStats);
router.get('/revenue', authenticateToken, requireRole(['admin', 'manager']), validateQuery(RevenueStatsDto), statsController.getRevenueStats);
router.get('/performance', authenticateToken, requireRole(['admin']), validateQuery(PerformanceStatsDto), statsController.getPerformanceStats);
router.get('/system', authenticateToken, requireRole(['admin']), validateQuery(SystemStatsDto), statsController.getSystemStats);

// Advanced stats endpoints
router.get('/comparison', authenticateToken, validateQuery(StatsComparisonDto), statsController.getStatsComparison);
router.get('/export', authenticateToken, validateQuery(StatsExportDto), statsController.exportStats);

export default router;
