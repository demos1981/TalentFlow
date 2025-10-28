import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Notification, NotificationType, NotificationPriority, NotificationStatus, NotificationChannel } from '../models/Notification';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationSearchDto,
  NotificationStatsDto,
  MarkAsReadDto,
  MarkAllAsReadDto,
  CreateTestNotificationDto,
  BulkActionDto
} from '../dto/NotificationDto';

export interface NotificationSearchResult {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: NotificationSearchDto;
}

export interface NotificationStats {
  totalNotifications: number;
  notificationsByType: Array<{ type: string; count: number }>;
  notificationsByPriority: Array<{ priority: string; count: number }>;
  notificationsByStatus: Array<{ status: string; count: number }>;
  notificationsByChannel: Array<{ channel: string; count: number }>;
  unreadNotifications: number;
  readNotifications: number;
  archivedNotifications: number;
  deletedNotifications: number;
  notificationsToday: number;
  notificationsThisWeek: number;
  notificationsThisMonth: number;
  averageNotificationsPerDay: number;
  topNotificationTypes: Array<{ type: string; count: number }>;
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
    successRate: number;
  };
}

export class NotificationService {
  private notificationRepository: Repository<Notification>;
  private userRepository: Repository<User>;

  constructor() {
    this.notificationRepository = AppDataSource.getRepository(Notification);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Отримання сповіщень користувача
   */
  async getUserNotifications(filters: NotificationSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<NotificationSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.notificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.user', 'user')
        .where('notification.userId = :userId', { userId })
        .andWhere('notification.isDeleted = :isDeleted', { isDeleted: false });

      // Фільтр по пошуку
      if (filters.search) {
        queryBuilder.andWhere(
          '(notification.title ILIKE :search OR notification.message ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      // Фільтр по типу
      if (filters.type) {
        queryBuilder.andWhere('notification.type = :type', { type: filters.type });
      }

      // Фільтр по пріоритету
      if (filters.priority) {
        queryBuilder.andWhere('notification.priority = :priority', { priority: filters.priority });
      }

      // Фільтр по статусу
      if (filters.status) {
        queryBuilder.andWhere('notification.status = :status', { status: filters.status });
      }

      // Фільтр по каналу
      if (filters.channel) {
        queryBuilder.andWhere('notification.channel = :channel', { channel: filters.channel });
      }

      // Фільтр по прочитаності
      if (filters.isRead !== undefined) {
        queryBuilder.andWhere('notification.isRead = :isRead', { isRead: filters.isRead });
      }

      // Фільтр по персистентності
      if (filters.isPersistent !== undefined) {
        queryBuilder.andWhere('notification.isPersistent = :isPersistent', { isPersistent: filters.isPersistent });
      }

      // Фільтр по даті
      if (filters.startDate) {
        queryBuilder.andWhere('notification.createdAt >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('notification.createdAt <= :endDate', { endDate: filters.endDate });
      }

      // Сортування
      queryBuilder.orderBy(`notification.${filters.sortBy}`, filters.sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const notifications = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        filters
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw new Error(`Failed to get user notifications: ${error.message}`);
    }
  }

  /**
   * Отримання кількості непрочитаних сповіщень
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.notificationRepository.count({
        where: {
          userId,
          isRead: false,
          status: NotificationStatus.UNREAD,
          isDeleted: false
        }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  /**
   * Отримання статистики сповіщень
   */
  async getNotificationStats(statsDto: NotificationStatsDto, userId: string): Promise<NotificationStats> {
    try {
      const {
        startDate,
        endDate
      } = statsDto;

      const queryBuilder = this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.userId = :userId', { userId })
        .andWhere('notification.isDeleted = :isDeleted', { isDeleted: false });

      // Фільтр по даті
      if (startDate) {
        queryBuilder.andWhere('notification.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('notification.createdAt <= :endDate', { endDate });
      }

      // Загальна кількість сповіщень
      const totalNotifications = await queryBuilder.getCount();

      // Статистика по типах
      const notificationsByType = await queryBuilder
        .clone()
        .select('notification.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('notification.type')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Статистика по пріоритетах
      const notificationsByPriority = await queryBuilder
        .clone()
        .select('notification.priority', 'priority')
        .addSelect('COUNT(*)', 'count')
        .groupBy('notification.priority')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Статистика по статусах
      const notificationsByStatus = await queryBuilder
        .clone()
        .select('notification.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('notification.status')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Статистика по каналах
      const notificationsByChannel = await queryBuilder
        .clone()
        .select('notification.channel', 'channel')
        .addSelect('COUNT(*)', 'count')
        .groupBy('notification.channel')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Непрочитані сповіщення
      const unreadNotifications = await queryBuilder
        .clone()
        .andWhere('notification.isRead = :isRead', { isRead: false })
        .andWhere('notification.status = :status', { status: NotificationStatus.UNREAD })
        .getCount();

      // Прочитані сповіщення
      const readNotifications = await queryBuilder
        .clone()
        .andWhere('notification.isRead = :isRead', { isRead: true })
        .andWhere('notification.status = :status', { status: NotificationStatus.READ })
        .getCount();

      // Архівні сповіщення
      const archivedNotifications = await queryBuilder
        .clone()
        .andWhere('notification.status = :status', { status: NotificationStatus.ARCHIVED })
        .getCount();

      // Видалені сповіщення
      const deletedNotifications = await this.notificationRepository.count({
        where: {
          userId,
          isDeleted: true
        }
      });

      // Сповіщення сьогодні
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const notificationsToday = await queryBuilder
        .clone()
        .andWhere('notification.createdAt >= :today', { today })
        .getCount();

      // Сповіщення цього тижня
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const notificationsThisWeek = await queryBuilder
        .clone()
        .andWhere('notification.createdAt >= :weekAgo', { weekAgo })
        .getCount();

      // Сповіщення цього місяця
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const notificationsThisMonth = await queryBuilder
        .clone()
        .andWhere('notification.createdAt >= :monthAgo', { monthAgo })
        .getCount();

      // Середня кількість сповіщень на день
      const averageNotificationsPerDay = notificationsThisWeek / 7;

      // Топ типи сповіщень
      const topNotificationTypes = notificationsByType.slice(0, 5);

      // Статистика доставки
      const sentCount = await queryBuilder
        .clone()
        .andWhere('notification.sentAt IS NOT NULL')
        .getCount();

      const deliveredCount = await queryBuilder
        .clone()
        .andWhere('notification.deliveredAt IS NOT NULL')
        .getCount();

      const failedCount = await queryBuilder
        .clone()
        .andWhere('notification.failedAt IS NOT NULL')
        .getCount();

      const successRate = sentCount > 0 ? (deliveredCount / sentCount) * 100 : 0;

      return {
        totalNotifications,
        notificationsByType: notificationsByType.map(item => ({
          type: item.type,
          count: parseInt(item.count)
        })),
        notificationsByPriority: notificationsByPriority.map(item => ({
          priority: item.priority,
          count: parseInt(item.count)
        })),
        notificationsByStatus: notificationsByStatus.map(item => ({
          status: item.status,
          count: parseInt(item.count)
        })),
        notificationsByChannel: notificationsByChannel.map(item => ({
          channel: item.channel,
          count: parseInt(item.count)
        })),
        unreadNotifications,
        readNotifications,
        archivedNotifications,
        deletedNotifications,
        notificationsToday,
        notificationsThisWeek,
        notificationsThisMonth,
        averageNotificationsPerDay: Math.round(averageNotificationsPerDay * 10) / 10,
        topNotificationTypes: topNotificationTypes.map(item => ({
          type: item.type,
          count: parseInt(item.count)
        })),
        deliveryStats: {
          sent: sentCount,
          delivered: deliveredCount,
          failed: failedCount,
          successRate: Math.round(successRate * 10) / 10
        }
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw new Error(`Failed to get notification stats: ${error.message}`);
    }
  }

  /**
   * Позначення сповіщення як прочитане
   */
  async markAsRead(notificationId: string, userId: string, markData?: MarkAsReadDto): Promise<boolean> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        return false;
      }

      notification.isRead = true;
      notification.status = NotificationStatus.READ;
      notification.readAt = markData?.readAt ? new Date(markData.readAt) : new Date();
      notification.updatedAt = new Date();

      await this.notificationRepository.save(notification);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Позначення всіх сповіщень як прочитані
   */
  async markAllAsRead(userId: string, markData?: MarkAllAsReadDto): Promise<number> {
    try {
      const whereConditions: any = {
        userId,
        isRead: false,
        isDeleted: false
      };

      if (markData?.type) {
        whereConditions.type = markData.type;
      }

      if (markData?.priority) {
        whereConditions.priority = markData.priority;
      }

      if (markData?.notificationIds && markData.notificationIds.length > 0) {
        whereConditions.id = markData.notificationIds;
      }

      const result = await this.notificationRepository.update(
        whereConditions,
        { 
          isRead: true, 
          status: NotificationStatus.READ,
          readAt: new Date(),
          updatedAt: new Date()
        }
      );

      return result.affected || 0;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  /**
   * Видалення сповіщення
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        return false;
      }

      // Soft delete
      notification.isDeleted = true;
      notification.status = NotificationStatus.DELETED;
      notification.updatedAt = new Date();
      
      await this.notificationRepository.save(notification);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Створення сповіщення
   */
  async createNotification(notificationData: CreateNotificationDto, createdBy: string): Promise<Notification> {
    try {
      const user = await this.userRepository.findOne({ where: { id: notificationData.userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const notification = this.notificationRepository.create({
        ...notificationData,
        createdBy,
        status: NotificationStatus.UNREAD,
        isRead: false
      });

      const savedNotification = await this.notificationRepository.save(notification);

      // Відправка сповіщення через різні канали
      await this.sendNotification(savedNotification);

      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Оновлення сповіщення
   */
  async updateNotification(notificationId: string, updateData: UpdateNotificationDto, userId: string): Promise<Notification | null> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, userId }
      });
      
      if (!notification) {
        return null;
      }

      // Оновлюємо поля
      Object.assign(notification, updateData);
      notification.updatedAt = new Date();
      
      return await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      throw new Error(`Failed to update notification: ${error.message}`);
    }
  }

  /**
   * Створення тестового сповіщення
   */
  async createTestNotification(testData: CreateTestNotificationDto, userId: string): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create({
        ...testData,
        userId,
        type: testData.type || NotificationType.SYSTEM_MESSAGE,
        priority: testData.priority || NotificationPriority.MEDIUM,
        status: NotificationStatus.UNREAD,
        isRead: false,
        channel: testData.channel || NotificationChannel.IN_APP
      });

      return await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Error creating test notification:', error);
      throw new Error(`Failed to create test notification: ${error.message}`);
    }
  }

  /**
   * Масові дії зі сповіщеннями
   */
  async bulkAction(bulkData: BulkActionDto, userId: string): Promise<number> {
    try {
      const whereConditions: any = {
        id: bulkData.notificationIds,
        userId,
        isDeleted: false
      };

      let updateData: any = { updatedAt: new Date() };

      switch (bulkData.action) {
        case 'mark_read':
          updateData = {
            ...updateData,
            isRead: true,
            status: NotificationStatus.READ,
            readAt: new Date()
          };
          break;
        case 'mark_unread':
          updateData = {
            ...updateData,
            isRead: false,
            status: NotificationStatus.UNREAD,
            readAt: null
          };
          break;
        case 'archive':
          updateData = {
            ...updateData,
            status: NotificationStatus.ARCHIVED
          };
          break;
        case 'delete':
          updateData = {
            ...updateData,
            isDeleted: true,
            status: NotificationStatus.DELETED
          };
          break;
      }

      const result = await this.notificationRepository.update(whereConditions, updateData);
      return result.affected || 0;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      throw new Error(`Failed to perform bulk action: ${error.message}`);
    }
  }

  /**
   * Відправка сповіщення через різні канали
   */
  private async sendNotification(notification: Notification): Promise<void> {
    try {
      // Відправка email
      if (notification.sendEmail) {
        await this.sendEmailNotification(notification);
      }

      // Відправка SMS
      if (notification.sendSms) {
        await this.sendSmsNotification(notification);
      }

      // Відправка push повідомлення
      if (notification.sendPush) {
        await this.sendPushNotification(notification);
      }

      // Відправка webhook
      if (notification.channel === NotificationChannel.WEBHOOK) {
        await this.sendWebhookNotification(notification);
      }

      // Оновлюємо статус відправки
      notification.sentAt = new Date();
      await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Error sending notification:', error);
      notification.failedAt = new Date();
      notification.failureReason = error.message;
      notification.retryCount += 1;
      await this.notificationRepository.save(notification);
    }
  }

  /**
   * Відправка email сповіщення
   */
  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // Dynamic import of emailService to avoid circular dependencies
      const { default: emailServiceModule } = await import('./emailService');
      
      const user = await this.userRepository.findOne({ where: { id: notification.userId } });
      if (!user || !user.email) {
        throw new Error('User not found or email not available');
      }

      const textContent = notification.message.replace(/<[^>]*>/g, '');
      const result = await emailServiceModule.sendEmail(
        user.email,
        notification.title,
        textContent,
        notification.message
      );

      if (result && result.success) {
        notification.deliveredAt = new Date();
        console.log(`Email notification sent successfully to ${user.email}: ${result.messageId}`);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  /**
   * Відправка SMS сповіщення
   */
  private async sendSmsNotification(notification: Notification): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: notification.userId } });
      if (!user || !user.phone) {
        throw new Error('User not found or phone not available');
      }

      // For now, we'll use a mock SMS service
      // In production, integrate with Twilio, AWS SNS, or similar service
      console.log(`[SMS] Sending to ${user.phone}: ${notification.title}`);
      console.log(`[SMS] Content: ${notification.message.replace(/<[^>]*>/g, '')}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.deliveredAt = new Date();
      console.log(`SMS notification sent successfully to ${user.phone}`);
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      throw error;
    }
  }

  /**
   * Відправка push повідомлення
   */
  private async sendPushNotification(notification: Notification): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: notification.userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // For now, we'll use a mock push notification service
      // In production, integrate with Firebase Cloud Messaging, OneSignal, or similar service
      console.log(`[PUSH] Sending to user ${user.id}: ${notification.title}`);
      console.log(`[PUSH] Content: ${notification.message.replace(/<[^>]*>/g, '')}`);
      
      // Simulate push notification sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notification.deliveredAt = new Date();
      console.log(`Push notification sent successfully to user ${user.id}`);
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Відправка webhook сповіщення
   */
  private async sendWebhookNotification(notification: Notification): Promise<void> {
    try {
      const axios = await import('axios');
      
      const webhookUrl = notification.metadata?.webhookUrl;
      if (!webhookUrl) {
        throw new Error('Webhook URL not provided in metadata');
      }

      const webhookData = {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        userId: notification.userId,
        createdAt: notification.createdAt,
        sentAt: notification.sentAt
      };

      const response = await axios.default.post(webhookUrl, webhookData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TalentFlow-Notification-Service/1.0'
        },
        timeout: 10000 // 10 seconds timeout
      });

      if (response.status >= 200 && response.status < 300) {
        notification.deliveredAt = new Date();
        console.log(`Webhook notification sent successfully to ${webhookUrl}`);
      } else {
        throw new Error(`Webhook returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending webhook notification:', error);
      throw error;
    }
  }

  /**
   * Очищення застарілих сповіщень
   */
  async cleanupExpiredNotifications(): Promise<number> {
    try {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 30); // Видаляємо сповіщення старші 30 днів

      const result = await this.notificationRepository.update(
        {
          createdAt: { $lt: expiredDate } as any,
          isPersistent: false,
          status: NotificationStatus.READ
        },
        { 
          isDeleted: true,
          status: NotificationStatus.DELETED,
          updatedAt: new Date()
        }
      );

      return result.affected || 0;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      throw new Error(`Failed to cleanup expired notifications: ${error.message}`);
    }
  }

  /**
   * Отримання сповіщень для конкретного користувача
   */
  async getNotificationsForUser(userId: string, limit: number = 10): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: {
          userId,
          status: NotificationStatus.UNREAD,
          isDeleted: false
        },
        order: {
          priority: 'DESC',
          createdAt: 'DESC'
        },
        take: limit
      });
    } catch (error) {
      console.error('Error getting notifications for user:', error);
      throw new Error(`Failed to get notifications for user: ${error.message}`);
    }
  }
}

// Експортуємо екземпляр сервісу для використання в контролері
export const notificationService = new NotificationService();