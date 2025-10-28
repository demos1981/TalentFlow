import { Repository, LessThanOrEqual } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Subscription } from '../models/Subscription';
import { User } from '../models/User';
import { 
  CreateSubscriptionDto, 
  UpdateSubscriptionDto, 
  SubscriptionSearchDto, 
  SubscriptionUsageDto, 
  SubscriptionUpgradeDto, 
  SubscriptionCancelDto,
  SubscriptionStatus,
  BillingCycle
} from '../dto/SubscriptionDto';

export class SubscriptionService {
  private subscriptionRepository: Repository<Subscription>;
  private userRepository: Repository<User>;

  constructor() {
    this.subscriptionRepository = AppDataSource.getRepository(Subscription);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto, userId: string): Promise<Subscription> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const startDate = new Date();
      const endDate = new Date();
      
      // Calculate end date based on billing cycle
      switch (createSubscriptionDto.billingCycle) {
        case BillingCycle.MONTHLY:
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case BillingCycle.QUARTERLY:
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case BillingCycle.YEARLY:
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case BillingCycle.LIFETIME:
          endDate.setFullYear(endDate.getFullYear() + 100); // Effectively lifetime
          break;
        default:
          // Handle custom billing cycle
          endDate.setMonth(endDate.getMonth() + 1);
          break;
      }

      const nextBillingDate = createSubscriptionDto.billingCycle === BillingCycle.LIFETIME ? null : new Date(endDate);

      const subscription = this.subscriptionRepository.create({
        userId,
        planName: createSubscriptionDto.name,
        planType: createSubscriptionDto.type,
        amount: createSubscriptionDto.price,
        currency: createSubscriptionDto.currency,
        billingCycle: createSubscriptionDto.billingCycle,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
        nextBillingDate,
        features: {
          maxJobs: createSubscriptionDto.maxJobs,
          maxApplications: createSubscriptionDto.maxApplications,
          aiMatching: createSubscriptionDto.features?.includes('aiMatching') || false,
          prioritySupport: createSubscriptionDto.features?.includes('prioritySupport') || false,
          analytics: createSubscriptionDto.features?.includes('analytics') || false,
          customBranding: createSubscriptionDto.features?.includes('customBranding') || false,
          apiAccess: createSubscriptionDto.features?.includes('apiAccess') || false,
        },
        autoRenew: true,
        isTrial: createSubscriptionDto.trialDays ? true : false,
        trialEndDate: createSubscriptionDto.trialDays ? new Date(Date.now() + createSubscriptionDto.trialDays * 24 * 60 * 60 * 1000) : null,
        metadata: createSubscriptionDto.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async getAllSubscriptions(searchDto: SubscriptionSearchDto): Promise<{ subscriptions: Subscription[]; total: number; page: number; limit: number }> {
    try {
      const queryBuilder = this.subscriptionRepository.createQueryBuilder('subscription')
        .leftJoinAndSelect('subscription.user', 'user');

      // Apply filters
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(subscription.planName ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      if (searchDto.type) {
        queryBuilder.andWhere('subscription.planType = :type', { type: searchDto.type });
      }

      if (searchDto.status) {
        queryBuilder.andWhere('subscription.status = :status', { status: searchDto.status });
      }

      if (searchDto.billingCycle) {
        queryBuilder.andWhere('subscription.billingCycle = :billingCycle', { billingCycle: searchDto.billingCycle });
      }

      if (searchDto.minPrice !== undefined) {
        queryBuilder.andWhere('subscription.amount >= :minPrice', { minPrice: searchDto.minPrice });
      }

      if (searchDto.maxPrice !== undefined) {
        queryBuilder.andWhere('subscription.amount <= :maxPrice', { maxPrice: searchDto.maxPrice });
      }

      if (searchDto.currency) {
        queryBuilder.andWhere('subscription.currency = :currency', { currency: searchDto.currency });
      }

      // Apply sorting
      const sortBy = searchDto.sortBy || 'createdAt';
      const sortOrder = searchDto.sortOrder || 'DESC';
      queryBuilder.orderBy(`subscription.${sortBy}`, sortOrder);

      // Apply pagination
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const skip = (page - 1) * limit;

      queryBuilder.skip(skip).take(limit);

      const [subscriptions, total] = await queryBuilder.getManyAndCount();

      return {
        subscriptions,
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      throw new Error(`Failed to get subscriptions: ${error.message}`);
    }
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    try {
      return await this.subscriptionRepository.findOne({
        where: { id },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error getting subscription by id:', error);
      throw new Error(`Failed to get subscription: ${error.message}`);
    }
  }

  async updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto, userId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      // Update fields
      if (updateSubscriptionDto.name !== undefined) subscription.planName = updateSubscriptionDto.name;
      if (updateSubscriptionDto.type !== undefined) subscription.planType = updateSubscriptionDto.type;
      if (updateSubscriptionDto.price !== undefined) subscription.amount = updateSubscriptionDto.price;
      if (updateSubscriptionDto.currency !== undefined) subscription.currency = updateSubscriptionDto.currency;
      if (updateSubscriptionDto.billingCycle !== undefined) subscription.billingCycle = updateSubscriptionDto.billingCycle;
      if (updateSubscriptionDto.metadata !== undefined) subscription.metadata = updateSubscriptionDto.metadata;

      // Update features
      if (updateSubscriptionDto.features) {
        subscription.features = {
          maxJobs: updateSubscriptionDto.maxJobs,
          maxApplications: updateSubscriptionDto.maxApplications,
          aiMatching: updateSubscriptionDto.features.includes('aiMatching'),
          prioritySupport: updateSubscriptionDto.features.includes('prioritySupport'),
          analytics: updateSubscriptionDto.features.includes('analytics'),
          customBranding: updateSubscriptionDto.features.includes('customBranding'),
          apiAccess: updateSubscriptionDto.features.includes('apiAccess'),
        };
      }

      subscription.updatedAt = new Date();

      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }
  }

  async deleteSubscription(id: string, userId: string): Promise<void> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      await this.subscriptionRepository.remove(subscription);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }
  }

  async getSubscriptionsByUser(userId: string, page: number = 1, limit: number = 20): Promise<{ subscriptions: Subscription[]; total: number }> {
    try {
      const [subscriptions, total] = await this.subscriptionRepository.findAndCount({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      return { subscriptions, total };
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      throw new Error(`Failed to get user subscriptions: ${error.message}`);
    }
  }

  async cancelSubscription(cancelDto: SubscriptionCancelDto, userId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id: cancelDto.subscriptionId, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = cancelDto.cancelDate ? new Date(cancelDto.cancelDate) : new Date();
      subscription.cancellationReason = cancelDto.reason;
      subscription.autoRenew = false;
      subscription.updatedAt = new Date();

      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  async suspendSubscription(subscriptionId: string, reason: string, userId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id: subscriptionId, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      subscription.status = SubscriptionStatus.SUSPENDED;
      subscription.suspendedAt = new Date();
      subscription.suspensionReason = reason as any;
      subscription.updatedAt = new Date();

      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error suspending subscription:', error);
      throw new Error(`Failed to suspend subscription: ${error.message}`);
    }
  }

  async renewSubscription(subscriptionId: string, userId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id: subscriptionId, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      const newEndDate = new Date();
      
      // Calculate new end date based on billing cycle
      switch (subscription.billingCycle) {
        case 'monthly':
          newEndDate.setMonth(newEndDate.getMonth() + 1);
          break;
        case 'quarterly':
          newEndDate.setMonth(newEndDate.getMonth() + 3);
          break;
        case 'yearly':
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
          break;
        case 'lifetime':
          newEndDate.setFullYear(newEndDate.getFullYear() + 100);
          break;
        default:
          // Handle custom billing cycle
          newEndDate.setMonth(newEndDate.getMonth() + 1);
          break;
      }

      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.endDate = newEndDate;
      subscription.nextBillingDate = subscription.billingCycle === 'lifetime' ? null : newEndDate;
      subscription.autoRenew = true;
      subscription.updatedAt = new Date();

      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error renewing subscription:', error);
      throw new Error(`Failed to renew subscription: ${error.message}`);
    }
  }

  async upgradeSubscription(upgradeDto: SubscriptionUpgradeDto, userId: string): Promise<Subscription | null> {
    try {
      const currentSubscription = await this.subscriptionRepository.findOne({
        where: { id: upgradeDto.currentSubscriptionId, userId }
      });

      if (!currentSubscription) {
        throw new Error('Current subscription not found or access denied');
      }

      const newSubscription = await this.subscriptionRepository.findOne({
        where: { id: upgradeDto.newSubscriptionId }
      });

      if (!newSubscription) {
        throw new Error('New subscription not found');
      }

      // Update current subscription with new plan details
      currentSubscription.planName = newSubscription.planName;
      currentSubscription.planType = newSubscription.planType;
      currentSubscription.amount = newSubscription.amount;
      currentSubscription.currency = newSubscription.currency;
      currentSubscription.billingCycle = upgradeDto.billingCycle || newSubscription.billingCycle;
      currentSubscription.features = newSubscription.features;
      currentSubscription.updatedAt = new Date();

      const savedSubscription = await this.subscriptionRepository.save(currentSubscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw new Error(`Failed to upgrade subscription: ${error.message}`);
    }
  }

  async updateUsage(usageDto: SubscriptionUsageDto, userId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id: usageDto.subscriptionId, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      if (usageDto.jobsUsed !== undefined) subscription.jobsPosted = usageDto.jobsUsed;
      if (usageDto.applicationsUsed !== undefined) subscription.applicationsReceived = usageDto.applicationsUsed;
      if (usageDto.interviewsUsed !== undefined) subscription.aiMatches = usageDto.interviewsUsed;
      if (usageDto.metadata !== undefined) subscription.metadata = usageDto.metadata;

      subscription.updatedAt = new Date();

      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return Array.isArray(savedSubscription) ? savedSubscription[0] : savedSubscription;
    } catch (error) {
      console.error('Error updating subscription usage:', error);
      throw new Error(`Failed to update subscription usage: ${error.message}`);
    }
  }

  async getSubscriptionStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    cancelled: number;
    expired: number;
    suspended: number;
    totalRevenue: number;
    averageValue: number;
  }> {
    try {
      const [
        total,
        active,
        inactive,
        cancelled,
        expired,
        suspended,
        totalRevenue,
        averageValue
      ] = await Promise.all([
        this.subscriptionRepository.count(),
        this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } }),
        this.subscriptionRepository.count({ where: { status: SubscriptionStatus.INACTIVE } }),
        this.subscriptionRepository.count({ where: { status: SubscriptionStatus.CANCELLED } }),
        this.subscriptionRepository.count({ where: { status: SubscriptionStatus.EXPIRED } }),
        this.subscriptionRepository.count({ where: { status: SubscriptionStatus.SUSPENDED } }),
        this.subscriptionRepository
          .createQueryBuilder('subscription')
          .select('SUM(subscription.amount)', 'totalRevenue')
          .where('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
          .getRawOne()
          .then(result => parseFloat(result.totalRevenue) || 0),
        this.subscriptionRepository
          .createQueryBuilder('subscription')
          .select('AVG(subscription.amount)', 'avgValue')
          .where('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
          .getRawOne()
          .then(result => parseFloat(result.avgValue) || 0)
      ]);

      return {
        total,
        active,
        inactive,
        cancelled,
        expired,
        suspended,
        totalRevenue,
        averageValue
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      throw new Error(`Failed to get subscription stats: ${error.message}`);
    }
  }

  async getExpiringSubscriptions(days: number = 7): Promise<Subscription[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      return await this.subscriptionRepository.find({
        where: {
          status: SubscriptionStatus.ACTIVE,
          endDate: LessThanOrEqual(futureDate)
        },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error getting expiring subscriptions:', error);
      throw new Error(`Failed to get expiring subscriptions: ${error.message}`);
    }
  }

  async getTrialSubscriptions(): Promise<Subscription[]> {
    try {
      return await this.subscriptionRepository.find({
        where: {
          isTrial: true,
          status: SubscriptionStatus.ACTIVE
        },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error getting trial subscriptions:', error);
      throw new Error(`Failed to get trial subscriptions: ${error.message}`);
    }
  }
}

export const subscriptionService = new SubscriptionService();