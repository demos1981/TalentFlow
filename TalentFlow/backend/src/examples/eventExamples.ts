/**
 * Приклади використання Event API
 */

export const eventExamples = {
  // Створення події
  createEvent: {
    method: 'POST',
    url: '/api/events',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Технічне інтерв\'ю з кандидатом',
      description: 'Інтерв\'ю на позицію Senior Frontend Developer',
      notes: 'Підготувати питання по React та TypeScript',
      startDate: '2024-01-15T10:00:00.000Z',
      endDate: '2024-01-15T11:00:00.000Z',
      type: 'interview',
      priority: 'high',
      isAllDay: false,
      location: 'Офіс, кімната 205',
      locationDetails: {
        address: 'вул. Хрещатик, 22, Київ',
        isOnline: false,
        room: '205'
      },
      attendees: ['user-uuid-1', 'user-uuid-2'],
      externalAttendees: ['candidate@example.com'],
      reminders: [
        { type: 'email', time: 60, sent: false },
        { type: 'push', time: 15, sent: false }
      ],
      tags: ['interview', 'frontend', 'senior'],
      isPrivate: false,
      jobId: 'job-uuid-1',
      candidateId: 'candidate-uuid-1'
    },
    response: {
      success: true,
      message: 'Event created successfully',
      data: {
        id: 'event-uuid',
        title: 'Технічне інтерв\'ю з кандидатом',
        description: 'Інтерв\'ю на позицію Senior Frontend Developer',
        notes: 'Підготувати питання по React та TypeScript',
        startDate: '2024-01-15T10:00:00.000Z',
        endDate: '2024-01-15T11:00:00.000Z',
        type: 'interview',
        status: 'scheduled',
        priority: 'high',
        isAllDay: false,
        isRecurring: false,
        recurrenceType: 'none',
        completionPercentage: 0,
        location: 'Офіс, кімната 205',
        locationDetails: {
          address: 'вул. Хрещатик, 22, Київ',
          isOnline: false,
          room: '205'
        },
        attendees: ['user-uuid-1', 'user-uuid-2'],
        externalAttendees: ['candidate@example.com'],
        reminders: [
          { type: 'email', time: 60, sent: false },
          { type: 'push', time: 15, sent: false }
        ],
        tags: ['interview', 'frontend', 'senior'],
        isPrivate: false,
        isActive: true,
        createdById: 'user-uuid',
        jobId: 'job-uuid-1',
        candidateId: 'candidate-uuid-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  // Отримання всіх подій
  getAllEvents: {
    method: 'GET',
    url: '/api/events?page=1&limit=20&type=interview&status=scheduled',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Events retrieved successfully',
      data: {
        events: [
          {
            id: 'event-uuid-1',
            title: 'Технічне інтерв\'ю з кандидатом',
            description: 'Інтерв\'ю на позицію Senior Frontend Developer',
            startDate: '2024-01-15T10:00:00.000Z',
            endDate: '2024-01-15T11:00:00.000Z',
            type: 'interview',
            status: 'scheduled',
            priority: 'high',
            location: 'Офіс, кімната 205',
            createdBy: {
              id: 'user-uuid',
              firstName: 'Іван',
              lastName: 'Петренко'
            },
            job: {
              id: 'job-uuid-1',
              title: 'Senior Frontend Developer'
            },
            candidate: {
              id: 'candidate-uuid-1',
              firstName: 'Марія',
              lastName: 'Іваненко'
            }
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  // Отримання події за ID
  getEventById: {
    method: 'GET',
    url: '/api/events/event-uuid',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Event retrieved successfully',
      data: {
        id: 'event-uuid',
        title: 'Технічне інтерв\'ю з кандидатом',
        description: 'Інтерв\'ю на позицію Senior Frontend Developer',
        notes: 'Підготувати питання по React та TypeScript',
        startDate: '2024-01-15T10:00:00.000Z',
        endDate: '2024-01-15T11:00:00.000Z',
        type: 'interview',
        status: 'scheduled',
        priority: 'high',
        isAllDay: false,
        isRecurring: false,
        recurrenceType: 'none',
        completionPercentage: 0,
        location: 'Офіс, кімната 205',
        locationDetails: {
          address: 'вул. Хрещатик, 22, Київ',
          isOnline: false,
          room: '205'
        },
        attendees: ['user-uuid-1', 'user-uuid-2'],
        externalAttendees: ['candidate@example.com'],
        reminders: [
          { type: 'email', time: 60, sent: false },
          { type: 'push', time: 15, sent: false }
        ],
        tags: ['interview', 'frontend', 'senior'],
        isPrivate: false,
        isActive: true,
        createdBy: {
          id: 'user-uuid',
          firstName: 'Іван',
          lastName: 'Петренко',
          email: 'ivan@example.com'
        },
        job: {
          id: 'job-uuid-1',
          title: 'Senior Frontend Developer',
          company: {
            name: 'TechCorp Inc.'
          }
        },
        candidate: {
          id: 'candidate-uuid-1',
          firstName: 'Марія',
          lastName: 'Іваненко',
          email: 'maria@example.com'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  // Оновлення події
  updateEvent: {
    method: 'PUT',
    url: '/api/events/event-uuid',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Технічне інтерв\'ю з кандидатом (оновлено)',
      description: 'Інтерв\'ю на позицію Senior Frontend Developer - оновлений опис',
      notes: 'Підготувати питання по React, TypeScript та Node.js',
      priority: 'urgent',
      location: 'Офіс, кімната 210',
      locationDetails: {
        address: 'вул. Хрещатик, 22, Київ',
        isOnline: false,
        room: '210'
      },
      reminders: [
        { type: 'email', time: 120, sent: false },
        { type: 'push', time: 30, sent: false },
        { type: 'sms', time: 5, sent: false }
      ]
    },
    response: {
      success: true,
      message: 'Event updated successfully',
      data: {
        id: 'event-uuid',
        title: 'Технічне інтерв\'ю з кандидатом (оновлено)',
        description: 'Інтерв\'ю на позицію Senior Frontend Developer - оновлений опис',
        notes: 'Підготувати питання по React, TypeScript та Node.js',
        startDate: '2024-01-15T10:00:00.000Z',
        endDate: '2024-01-15T11:00:00.000Z',
        type: 'interview',
        status: 'scheduled',
        priority: 'urgent',
        location: 'Офіс, кімната 210',
        locationDetails: {
          address: 'вул. Хрещатик, 22, Київ',
          isOnline: false,
          room: '210'
        },
        reminders: [
          { type: 'email', time: 120, sent: false },
          { type: 'push', time: 30, sent: false },
          { type: 'sms', time: 5, sent: false }
        ],
        updatedAt: '2024-01-01T12:00:00.000Z'
      }
    }
  },

  // Видалення події
  deleteEvent: {
    method: 'DELETE',
    url: '/api/events/event-uuid',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Event deleted successfully'
    }
  },

  // Отримання подій за день
  getEventsByDay: {
    method: 'GET',
    url: '/api/events/day/2024-01-15',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Events by day retrieved successfully',
      data: [
        {
          id: 'event-uuid-1',
          title: 'Технічне інтерв\'ю з кандидатом',
          startDate: '2024-01-15T10:00:00.000Z',
          endDate: '2024-01-15T11:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: 'event-uuid-2',
          title: 'Планерка команди',
          startDate: '2024-01-15T14:00:00.000Z',
          endDate: '2024-01-15T15:00:00.000Z',
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium'
        }
      ]
    }
  },

  // Отримання подій за місяць
  getEventsByMonth: {
    method: 'GET',
    url: '/api/events/month/2024/1',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Events by month retrieved successfully',
      data: [
        {
          id: 'event-uuid-1',
          title: 'Технічне інтерв\'ю з кандидатом',
          startDate: '2024-01-15T10:00:00.000Z',
          endDate: '2024-01-15T11:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: 'event-uuid-2',
          title: 'Планерка команди',
          startDate: '2024-01-15T14:00:00.000Z',
          endDate: '2024-01-15T15:00:00.000Z',
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium'
        },
        {
          id: 'event-uuid-3',
          title: 'Дедлайн проекту',
          startDate: '2024-01-31T23:59:59.000Z',
          type: 'deadline',
          status: 'scheduled',
          priority: 'urgent'
        }
      ]
    }
  },

  // Отримання подій за тиждень
  getEventsByWeek: {
    method: 'GET',
    url: '/api/events/week/2024/3',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Events by week retrieved successfully',
      data: [
        {
          id: 'event-uuid-1',
          title: 'Технічне інтерв\'ю з кандидатом',
          startDate: '2024-01-15T10:00:00.000Z',
          endDate: '2024-01-15T11:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: 'event-uuid-2',
          title: 'Планерка команди',
          startDate: '2024-01-15T14:00:00.000Z',
          endDate: '2024-01-15T15:00:00.000Z',
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium'
        }
      ]
    }
  },

  // Отримання подій за період
  getEventsByDateRange: {
    method: 'GET',
    url: '/api/events/range?startDate=2024-01-01&endDate=2024-01-31&type=interview',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Events by date range retrieved successfully',
      data: [
        {
          id: 'event-uuid-1',
          title: 'Технічне інтерв\'ю з кандидатом',
          startDate: '2024-01-15T10:00:00.000Z',
          endDate: '2024-01-15T11:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'high'
        }
      ]
    }
  },

  // Отримання майбутніх подій
  getUpcomingEvents: {
    method: 'GET',
    url: '/api/events/upcoming?limit=10',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Upcoming events retrieved successfully',
      data: [
        {
          id: 'event-uuid-1',
          title: 'Технічне інтерв\'ю з кандидатом',
          startDate: '2024-01-15T10:00:00.000Z',
          endDate: '2024-01-15T11:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: 'event-uuid-2',
          title: 'Планерка команди',
          startDate: '2024-01-16T14:00:00.000Z',
          endDate: '2024-01-16T15:00:00.000Z',
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium'
        }
      ]
    }
  },

  // Позначення події як завершеної
  markEventAsCompleted: {
    method: 'PUT',
    url: '/api/events/event-uuid/complete',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      completionPercentage: 100,
      notes: 'Інтерв\'ю пройшло успішно, кандидат підходить'
    },
    response: {
      success: true,
      message: 'Event marked as completed successfully',
      data: {
        id: 'event-uuid',
        title: 'Технічне інтерв\'ю з кандидатом',
        status: 'completed',
        completionPercentage: 100,
        completedAt: '2024-01-15T11:30:00.000Z',
        notes: 'Підготувати питання по React та TypeScript\nCompleted: Інтерв\'ю пройшло успішно, кандидат підходить',
        updatedAt: '2024-01-15T11:30:00.000Z'
      }
    }
  },

  // Скасування події
  cancelEvent: {
    method: 'PUT',
    url: '/api/events/event-uuid/cancel',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      reason: 'Кандидат не зміг прийти через хворобу'
    },
    response: {
      success: true,
      message: 'Event cancelled successfully',
      data: {
        id: 'event-uuid',
        title: 'Технічне інтерв\'ю з кандидатом',
        status: 'cancelled',
        cancelledAt: '2024-01-15T09:30:00.000Z',
        cancellationReason: 'Кандидат не зміг прийти через хворобу',
        updatedAt: '2024-01-15T09:30:00.000Z'
      }
    }
  },

  // Статистика подій
  getEventStats: {
    method: 'GET',
    url: '/api/events/stats?userId=user-uuid&dateFrom=2024-01-01&dateTo=2024-12-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Event statistics retrieved successfully',
      data: {
        totalEvents: 25,
        eventsByType: [
          { type: 'interview', count: 10 },
          { type: 'meeting', count: 8 },
          { type: 'deadline', count: 4 },
          { type: 'reminder', count: 2 },
          { type: 'other', count: 1 }
        ],
        eventsByStatus: [
          { status: 'scheduled', count: 15 },
          { status: 'completed', count: 8 },
          { status: 'cancelled', count: 2 }
        ],
        eventsByPriority: [
          { priority: 'medium', count: 12 },
          { priority: 'high', count: 8 },
          { priority: 'urgent', count: 3 },
          { priority: 'low', count: 2 }
        ],
        upcomingEvents: 15,
        completedEvents: 8,
        cancelledEvents: 2,
        averageDuration: 1.5,
        recentEvents: 5
      }
    }
  },

  // Пошук подій
  searchEvents: {
    method: 'GET',
    url: '/api/events/search?search=інтерв\'ю&type=interview&status=scheduled',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Events search completed successfully',
      data: [
        {
          id: 'event-uuid-1',
          title: 'Технічне інтерв\'ю з кандидатом',
          description: 'Інтерв\'ю на позицію Senior Frontend Developer',
          startDate: '2024-01-15T10:00:00.000Z',
          endDate: '2024-01-15T11:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: 'event-uuid-2',
          title: 'Інтерв\'ю з HR менеджером',
          description: 'Обговорення умов роботи',
          startDate: '2024-01-16T14:00:00.000Z',
          endDate: '2024-01-16T15:00:00.000Z',
          type: 'interview',
          status: 'scheduled',
          priority: 'medium'
        }
      ]
    }
  }
};

export default eventExamples;


