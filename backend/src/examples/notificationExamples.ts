/**
 * Приклади використання Notification API
 */

export const notificationExamples = {
  // Отримання сповіщень користувача
  getUserNotifications: {
    method: 'GET',
    url: '/api/notifications?page=1&limit=20&type=new_application&isRead=false',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications: [
          {
            id: '1',
            userId: 'user-1',
            type: 'new_application',
            title: 'Нова заявка на вакансію',
            message: 'Отримано нову заявку на посаду Senior Developer від John Doe',
            priority: 'high',
            status: 'unread',
            channel: 'in_app',
            isRead: false,
            isPersistent: false,
            metadata: {
              relatedId: 'application-1',
              relatedType: 'application',
              actionUrl: '/applications/application-1',
              senderId: 'user-2',
              imageUrl: 'https://example.com/avatar.jpg',
              buttonText: 'Переглянути заявку',
              buttonUrl: '/applications/application-1'
            },
            isDeleted: false,
            createdBy: 'system',
            sendEmail: true,
            sendSms: false,
            sendPush: true,
            readAt: null,
            expiresAt: null,
            sentAt: '2024-01-15T14:30:00.000Z',
            deliveredAt: '2024-01-15T14:30:05.000Z',
            failedAt: null,
            failureReason: null,
            retryCount: 0,
            user: {
              id: 'user-1',
              firstName: 'Jane',
              lastName: 'Smith'
            },
            createdAt: '2024-01-15T14:30:00.000Z',
            updatedAt: '2024-01-15T14:30:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          type: 'new_application',
          isRead: false
        }
      }
    }
  },

  // Отримання кількості непрочитаних сповіщень
  getUnreadCount: {
    method: 'GET',
    url: '/api/notifications/unread-count',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Unread count retrieved successfully',
      data: { count: 5 }
    }
  },

  // Отримання статистики сповіщень
  getNotificationStats: {
    method: 'GET',
    url: '/api/notifications/stats?startDate=2024-01-01&endDate=2024-01-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Notification statistics retrieved successfully',
      data: {
        totalNotifications: 150,
        notificationsByType: [
          { type: 'new_application', count: 45 },
          { type: 'interview_scheduled', count: 30 },
          { type: 'system_message', count: 25 },
          { type: 'job_match', count: 20 },
          { type: 'application_status_changed', count: 15 },
          { type: 'candidate_message', count: 10 },
          { type: 'interview_reminder', count: 5 }
        ],
        notificationsByPriority: [
          { priority: 'medium', count: 80 },
          { priority: 'high', count: 45 },
          { priority: 'low', count: 20 },
          { priority: 'urgent', count: 5 }
        ],
        notificationsByStatus: [
          { status: 'read', count: 100 },
          { status: 'unread', count: 45 },
          { status: 'archived', count: 5 }
        ],
        notificationsByChannel: [
          { channel: 'in_app', count: 120 },
          { channel: 'email', count: 20 },
          { channel: 'push', count: 10 }
        ],
        unreadNotifications: 45,
        readNotifications: 100,
        archivedNotifications: 5,
        deletedNotifications: 0,
        notificationsToday: 15,
        notificationsThisWeek: 80,
        notificationsThisMonth: 150,
        averageNotificationsPerDay: 11.4,
        topNotificationTypes: [
          { type: 'new_application', count: 45 },
          { type: 'interview_scheduled', count: 30 },
          { type: 'system_message', count: 25 },
          { type: 'job_match', count: 20 },
          { type: 'application_status_changed', count: 15 }
        ],
        deliveryStats: {
          sent: 140,
          delivered: 135,
          failed: 5,
          successRate: 96.4
        }
      }
    }
  },

  // Позначення сповіщення як прочитане
  markAsRead: {
    method: 'PATCH',
    url: '/api/notifications/1/read',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      readAt: '2024-01-15T15:00:00.000Z'
    },
    response: {
      success: true,
      message: 'Notification marked as read'
    }
  },

  // Позначення всіх сповіщень як прочитані
  markAllAsRead: {
    method: 'POST',
    url: '/api/notifications/mark-all-read',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      type: 'new_application',
      priority: 'high'
    },
    response: {
      success: true,
      message: 'Marked 3 notifications as read',
      data: { count: 3 }
    }
  },

  // Видалення сповіщення
  deleteNotification: {
    method: 'DELETE',
    url: '/api/notifications/1',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Notification deleted successfully'
    }
  },

  // Створення сповіщення
  createNotification: {
    method: 'POST',
    url: '/api/notifications',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      userId: 'user-2',
      type: 'interview_scheduled',
      title: 'Заплановано інтерв\'ю',
      message: 'Ваше інтерв\'ю на посаду Senior Developer заплановано на 20 січня о 14:00',
      priority: 'high',
      metadata: {
        relatedId: 'interview-1',
        relatedType: 'interview',
        actionUrl: '/interviews/interview-1',
        senderId: 'user-1',
        imageUrl: 'https://example.com/company-logo.jpg',
        buttonText: 'Переглянути деталі',
        buttonUrl: '/interviews/interview-1'
      },
      expiresAt: '2024-01-20T14:00:00.000Z',
      channel: 'in_app',
      sendEmail: true,
      sendSms: false,
      sendPush: true,
      isPersistent: true
    },
    response: {
      success: true,
      message: 'Notification created successfully',
      data: {
        id: '2',
        userId: 'user-2',
        type: 'interview_scheduled',
        title: 'Заплановано інтерв\'ю',
        message: 'Ваше інтерв\'ю на посаду Senior Developer заплановано на 20 січня о 14:00',
        priority: 'high',
        status: 'unread',
        channel: 'in_app',
        isRead: false,
        isPersistent: true,
        metadata: {
          relatedId: 'interview-1',
          relatedType: 'interview',
          actionUrl: '/interviews/interview-1',
          senderId: 'user-1',
          imageUrl: 'https://example.com/company-logo.jpg',
          buttonText: 'Переглянути деталі',
          buttonUrl: '/interviews/interview-1'
        },
        isDeleted: false,
        createdBy: 'user-1',
        sendEmail: true,
        sendSms: false,
        sendPush: true,
        readAt: null,
        expiresAt: '2024-01-20T14:00:00.000Z',
        sentAt: null,
        deliveredAt: null,
        failedAt: null,
        failureReason: null,
        retryCount: 0,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:00:00.000Z'
      }
    }
  },

  // Оновлення сповіщення
  updateNotification: {
    method: 'PUT',
    url: '/api/notifications/1',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Нова заявка на вакансію (Оновлено)',
      message: 'Отримано нову заявку на посаду Senior Developer від John Doe. Додано додаткову інформацію.',
      priority: 'urgent',
      metadata: {
        relatedId: 'application-1',
        relatedType: 'application',
        actionUrl: '/applications/application-1',
        senderId: 'user-2',
        imageUrl: 'https://example.com/avatar.jpg',
        buttonText: 'Переглянути заявку',
        buttonUrl: '/applications/application-1',
        updated: true
      }
    },
    response: {
      success: true,
      message: 'Notification updated successfully',
      data: {
        id: '1',
        userId: 'user-1',
        type: 'new_application',
        title: 'Нова заявка на вакансію (Оновлено)',
        message: 'Отримано нову заявку на посаду Senior Developer від John Doe. Додано додаткову інформацію.',
        priority: 'urgent',
        status: 'unread',
        channel: 'in_app',
        isRead: false,
        isPersistent: false,
        metadata: {
          relatedId: 'application-1',
          relatedType: 'application',
          actionUrl: '/applications/application-1',
          senderId: 'user-2',
          imageUrl: 'https://example.com/avatar.jpg',
          buttonText: 'Переглянути заявку',
          buttonUrl: '/applications/application-1',
          updated: true
        },
        isDeleted: false,
        createdBy: 'system',
        sendEmail: true,
        sendSms: false,
        sendPush: true,
        readAt: null,
        expiresAt: null,
        sentAt: '2024-01-15T14:30:00.000Z',
        deliveredAt: '2024-01-15T14:30:05.000Z',
        failedAt: null,
        failureReason: null,
        retryCount: 0,
        createdAt: '2024-01-15T14:30:00.000Z',
        updatedAt: '2024-01-15T15:30:00.000Z'
      }
    }
  },

  // Створення тестового сповіщення
  createTestNotification: {
    method: 'POST',
    url: '/api/notifications/test',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Тестове сповіщення',
      message: 'Це тестове сповіщення для перевірки функціональності',
      type: 'system_message',
      priority: 'medium',
      metadata: {
        relatedId: 'test-1',
        relatedType: 'test',
        actionUrl: '/test',
        senderId: 'user-1'
      },
      channel: 'in_app'
    },
    response: {
      success: true,
      message: 'Test notification created successfully',
      data: {
        id: '3',
        userId: 'user-1',
        type: 'system_message',
        title: 'Тестове сповіщення',
        message: 'Це тестове сповіщення для перевірки функціональності',
        priority: 'medium',
        status: 'unread',
        channel: 'in_app',
        isRead: false,
        isPersistent: false,
        metadata: {
          relatedId: 'test-1',
          relatedType: 'test',
          actionUrl: '/test',
          senderId: 'user-1'
        },
        isDeleted: false,
        createdBy: null,
        sendEmail: false,
        sendSms: false,
        sendPush: false,
        readAt: null,
        expiresAt: null,
        sentAt: null,
        deliveredAt: null,
        failedAt: null,
        failureReason: null,
        retryCount: 0,
        createdAt: '2024-01-15T16:00:00.000Z',
        updatedAt: '2024-01-15T16:00:00.000Z'
      }
    }
  },

  // Масові дії зі сповіщеннями
  bulkAction: {
    method: 'POST',
    url: '/api/notifications/bulk-action',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      notificationIds: ['1', '2', '3'],
      action: 'mark_read'
    },
    response: {
      success: true,
      message: 'Bulk action completed successfully. 3 notifications affected.',
      data: { count: 3 }
    }
  },

  // Очищення застарілих сповіщень
  cleanupExpiredNotifications: {
    method: 'POST',
    url: '/api/notifications/cleanup',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Cleanup completed successfully. 25 notifications cleaned up.',
      data: { count: 25 }
    }
  },

  // Отримання сповіщень для користувача (швидкий доступ)
  getNotificationsForUser: {
    method: 'GET',
    url: '/api/notifications/quick?limit=5',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Notifications retrieved successfully',
      data: [
        {
          id: '1',
          userId: 'user-1',
          type: 'new_application',
          title: 'Нова заявка на вакансію',
          message: 'Отримано нову заявку на посаду Senior Developer від John Doe',
          priority: 'high',
          status: 'unread',
          channel: 'in_app',
          isRead: false,
          isPersistent: false,
          metadata: {
            relatedId: 'application-1',
            relatedType: 'application',
            actionUrl: '/applications/application-1',
            senderId: 'user-2'
          },
          isDeleted: false,
          createdBy: 'system',
          sendEmail: true,
          sendSms: false,
          sendPush: true,
          readAt: null,
          expiresAt: null,
          sentAt: '2024-01-15T14:30:00.000Z',
          deliveredAt: '2024-01-15T14:30:05.000Z',
          failedAt: null,
          failureReason: null,
          retryCount: 0,
          createdAt: '2024-01-15T14:30:00.000Z',
          updatedAt: '2024-01-15T14:30:00.000Z'
        }
      ]
    }
  },

  // Приклад помилки (сповіщення не знайдено)
  markAsReadError: {
    method: 'PATCH',
    url: '/api/notifications/non-existent-id/read',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: false,
      message: 'Notification not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createNotificationError: {
    method: 'POST',
    url: '/api/notifications',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      userId: 'user-2',
      type: 'system_message',
      title: 'Test'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default notificationExamples;


