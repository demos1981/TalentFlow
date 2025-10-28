import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { CreateNotificationDto, UpdateNotificationDto, NotificationSearchDto, NotificationStatsDto, MarkAsReadDto, MarkAllAsReadDto, CreateTestNotificationDto, BulkActionDto, NotificationParamDto } from '../dto/NotificationDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Отримання сповіщень
router.get('/',
  validateDto(NotificationSearchDto, true),
  notificationController.getUserNotifications
);

// Отримання кількості непрочитаних сповіщень
router.get('/unread-count',
  notificationController.getUnreadCount
);

// Отримання статистики сповіщень
router.get('/stats',
  validateDto(NotificationStatsDto, true),
  notificationController.getNotificationStats
);

// Отримання сповіщень для користувача (швидкий доступ)
router.get('/quick',
  notificationController.getNotificationsForUser
);

// Створення сповіщення
router.post('/',
  validateDto(CreateNotificationDto, false),
  notificationController.createNotification
);

// Створення тестового сповіщення
router.post('/test',
  validateDto(CreateTestNotificationDto, false),
  notificationController.createTestNotification
);

// Масові дії зі сповіщеннями
router.post('/bulk-action',
  validateDto(BulkActionDto, false),
  notificationController.bulkAction
);

// Позначення всіх сповіщень як прочитані
router.post('/mark-all-read',
  validateDto(MarkAllAsReadDto, true),
  notificationController.markAllAsRead
);

// Очищення застарілих сповіщень
router.post('/cleanup',
  notificationController.cleanupExpiredNotifications
);

// Отримання конкретного сповіщення
router.get('/:notificationId',
  validateDto(NotificationParamDto, true),
  notificationController.getUserNotifications
);

// Позначення сповіщення як прочитане
router.patch('/:notificationId/read',
  validateDto(MarkAsReadDto, true),
  notificationController.markAsRead
);

// Оновлення сповіщення
router.put('/:notificationId',
  validateDto(UpdateNotificationDto, false),
  notificationController.updateNotification
);

// Видалення сповіщення
router.delete('/:notificationId',
  validateDto(NotificationParamDto, true),
  notificationController.deleteNotification
);

export default router;