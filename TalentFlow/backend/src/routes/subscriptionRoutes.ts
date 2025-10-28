import { Router } from 'express';
import { subscriptionController } from '../controllers/subscriptionController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UuidParamDto } from '../dto/CommonDto';
import { 
  CreateSubscriptionDto, 
  UpdateSubscriptionDto, 
  SubscriptionSearchDto,
  SubscriptionCancelDto,
  SubscriptionUpgradeDto,
  SubscriptionUsageDto
} from '../dto/SubscriptionDto';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Subscription management
router.post('/', requireRole(['admin', 'employer']), validateDto(CreateSubscriptionDto), subscriptionController.createSubscription);
router.get('/', validateQuery(SubscriptionSearchDto), subscriptionController.getAllSubscriptions);
router.get('/stats', requireRole(['admin', 'manager']), subscriptionController.getSubscriptionStats);
router.get('/expiring', requireRole(['admin', 'manager']), subscriptionController.getExpiringSubscriptions);
router.get('/trials', requireRole(['admin', 'manager']), subscriptionController.getTrialSubscriptions);
router.get('/user', subscriptionController.getUserSubscriptions);
router.get('/:id', validateParams(UuidParamDto), subscriptionController.getSubscriptionById);
router.put('/:id', validateParams(UuidParamDto), validateDto(UpdateSubscriptionDto, true), subscriptionController.updateSubscription);
router.delete('/:id', requireRole(['admin']), validateParams(UuidParamDto), subscriptionController.deleteSubscription);

// Subscription actions
router.post('/cancel', validateDto(SubscriptionCancelDto), subscriptionController.cancelSubscription);
router.post('/suspend/:id', requireRole(['admin']), validateParams(UuidParamDto), subscriptionController.suspendSubscription);
router.post('/renew/:id', validateParams(UuidParamDto), subscriptionController.renewSubscription);
router.post('/upgrade', validateDto(SubscriptionUpgradeDto), subscriptionController.upgradeSubscription);
router.post('/usage', validateDto(SubscriptionUsageDto), subscriptionController.updateUsage);

export default router;
