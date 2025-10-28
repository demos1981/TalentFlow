import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscriptionService';
import { 
  CreateSubscriptionDto, 
  UpdateSubscriptionDto, 
  SubscriptionSearchDto, 
  UserSubscriptionDto, 
  SubscriptionUsageDto, 
  SubscriptionUpgradeDto, 
  SubscriptionCancelDto 
} from '../dto/SubscriptionDto';

export const subscriptionController = {
  async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const createSubscriptionDto: CreateSubscriptionDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.createSubscription(createSubscriptionDto, userId);
      
      res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating subscription',
        error: error.message
      });
    }
  },

  async getAllSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const searchDto: SubscriptionSearchDto = {
        search: query.search as string,
        type: query.type as any,
        status: query.status as any,
        billingCycle: query.billingCycle as any,
        minPrice: query.minPrice ? parseFloat(query.minPrice as string) : undefined,
        maxPrice: query.maxPrice ? parseFloat(query.maxPrice as string) : undefined,
        currency: query.currency as string,
        isActive: query.isActive ? query.isActive === 'true' : undefined,
        isPopular: query.isPopular ? query.isPopular === 'true' : undefined,
        isRecommended: query.isRecommended ? query.isRecommended === 'true' : undefined,
        page: query.page ? parseInt(query.page as string) : 1,
        limit: query.limit ? parseInt(query.limit as string) : 20,
        sortBy: query.sortBy as any,
        sortOrder: query.sortOrder as any
      };

      const result = await subscriptionService.getAllSubscriptions(searchDto);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting subscriptions',
        error: error.message
      });
    }
  },

  async getSubscriptionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const subscription = await subscriptionService.getSubscriptionById(id);
      
      if (!subscription) {
        res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Error getting subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting subscription',
        error: error.message
      });
    }
  },

  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const updateSubscriptionDto: UpdateSubscriptionDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.updateSubscription(id, updateSubscriptionDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription updated successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating subscription',
        error: error.message
      });
    }
  },

  async deleteSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await subscriptionService.deleteSubscription(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error deleting subscription',
        error: error.message
      });
    }
  },

  async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const result = await subscriptionService.getSubscriptionsByUser(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user subscriptions',
        error: error.message
      });
    }
  },

  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const cancelDto: SubscriptionCancelDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.cancelSubscription(cancelDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error cancelling subscription',
        error: error.message
      });
    }
  },

  async suspendSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.suspendSubscription(id, reason, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription suspended successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error suspending subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error suspending subscription',
        error: error.message
      });
    }
  },

  async renewSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.renewSubscription(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription renewed successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error renewing subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error renewing subscription',
        error: error.message
      });
    }
  },

  async upgradeSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const upgradeDto: SubscriptionUpgradeDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.upgradeSubscription(upgradeDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription upgraded successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      res.status(400).json({
        success: false,
        message: 'Error upgrading subscription',
        error: error.message
      });
    }
  },

  async updateUsage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const usageDto: SubscriptionUsageDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const subscription = await subscriptionService.updateUsage(usageDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'Subscription usage updated successfully',
        data: subscription
      });
    } catch (error) {
      console.error('Error updating subscription usage:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating subscription usage',
        error: error.message
      });
    }
  },

  async getSubscriptionStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await subscriptionService.getSubscriptionStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting subscription stats',
        error: error.message
      });
    }
  },

  async getExpiringSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const subscriptions = await subscriptionService.getExpiringSubscriptions(days);
      
      res.status(200).json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      console.error('Error getting expiring subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting expiring subscriptions',
        error: error.message
      });
    }
  },

  async getTrialSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const subscriptions = await subscriptionService.getTrialSubscriptions();
      
      res.status(200).json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      console.error('Error getting trial subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting trial subscriptions',
        error: error.message
      });
    }
  }
};