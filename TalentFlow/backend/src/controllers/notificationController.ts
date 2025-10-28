import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { validateDto } from '../middleware/dtoValidation';
import { CreateNotificationDto, UpdateNotificationDto, NotificationSearchDto, NotificationStatsDto, MarkAsReadDto, MarkAllAsReadDto, CreateTestNotificationDto, BulkActionDto, NotificationParamDto } from '../dto/NotificationDto';
import { UuidParamDto } from '../dto/CommonDto';

export const notificationController = {
  /**
   * Отримання сповіщень користувача
   */
  async getUserNotifications(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(NotificationSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: NotificationSearchDto = req.query as any;
      const result = await notificationService.getUserNotifications(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting notifications',
        error: error.message
      });
    }
  },

  /**
   * Отримання кількості непрочитаних сповіщень
   */
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const count = await notificationService.getUnreadCount(userId);
      
      res.status(200).json({
        success: true,
        message: 'Unread count retrieved successfully',
        data: { count }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting unread count',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики сповіщень
   */
  async getNotificationStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(NotificationStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: NotificationStatsDto = req.query as any;
      const stats = await notificationService.getNotificationStats(statsFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Notification statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting notification stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting notification statistics',
        error: error.message
      });
    }
  },

  /**
   * Позначення сповіщення як прочитане
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MarkAsReadDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { notificationId } = req.params;
      const markData: MarkAsReadDto = req.body;
      const success = await notificationService.markAsRead(notificationId, userId, markData);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking notification as read',
        error: error.message
      });
    }
  },

  /**
   * Позначення всіх сповіщень як прочитані
   */
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MarkAllAsReadDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const markData: MarkAllAsReadDto = req.body;
      const count = await notificationService.markAllAsRead(userId, markData);
      
      res.status(200).json({
        success: true,
        message: `Marked ${count} notifications as read`,
        data: { count }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking all notifications as read',
        error: error.message
      });
    }
  },

  /**
   * Видалення сповіщення
   */
  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(NotificationParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { notificationId } = req.params;
      const success = await notificationService.deleteNotification(notificationId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting notification',
        error: error.message
      });
    }
  },

  /**
   * Створення сповіщення
   */
  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreateNotificationDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const notificationData: CreateNotificationDto = req.body;
      const notification = await notificationService.createNotification(notificationData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating notification',
        error: error.message
      });
    }
  },

  /**
   * Оновлення сповіщення
   */
  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateNotificationDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { notificationId } = req.params;
      const updateData: UpdateNotificationDto = req.body;
      const notification = await notificationService.updateNotification(notificationId, updateData, userId);
      
      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification updated successfully',
        data: notification
      });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating notification',
        error: error.message
      });
    }
  },

  /**
   * Створення тестового сповіщення
   */
  async createTestNotification(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreateTestNotificationDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const testData: CreateTestNotificationDto = req.body;
      const notification = await notificationService.createTestNotification(testData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Test notification created successfully',
        data: notification
      });
    } catch (error) {
      console.error('Error creating test notification:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating test notification',
        error: error.message
      });
    }
  },

  /**
   * Масові дії зі сповіщеннями
   */
  async bulkAction(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(BulkActionDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const bulkData: BulkActionDto = req.body;
      const count = await notificationService.bulkAction(bulkData, userId);
      
      res.status(200).json({
        success: true,
        message: `Bulk action completed successfully. ${count} notifications affected.`,
        data: { count }
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      res.status(400).json({
        success: false,
        message: 'Error performing bulk action',
        error: error.message
      });
    }
  },

  /**
   * Очищення застарілих сповіщень
   */
  async cleanupExpiredNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const count = await notificationService.cleanupExpiredNotifications();
      
      res.status(200).json({
        success: true,
        message: `Cleanup completed successfully. ${count} notifications cleaned up.`,
        data: { count }
      });
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error cleaning up expired notifications',
        error: error.message
      });
    }
  },

  /**
   * Отримання сповіщень для конкретного користувача
   */
  async getNotificationsForUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { limit = 10 } = req.query;
      const notifications = await notificationService.getNotificationsForUser(userId, Number(limit));
      
      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications
      });
    } catch (error) {
      console.error('Error getting notifications for user:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting notifications for user',
        error: error.message
      });
    }
  }
};