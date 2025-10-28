/**
 * Приклади використання Message API
 */

export const messageExamples = {
  // Отримання чатів користувача
  getUserChats: {
    method: 'GET',
    url: '/api/messages/chats?page=1&limit=20&type=direct',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Chats retrieved successfully',
      data: {
        chats: [
          {
            id: '1',
            name: 'John Doe',
            type: 'direct',
            status: 'active',
            participants: ['user-1', 'user-2'],
            createdBy: 'user-1',
            description: null,
            settings: null,
            metadata: null,
            lastMessageAt: '2024-01-15T14:30:00.000Z',
            lastMessageId: 'msg-1',
            unreadCount: 3,
            blockedUsers: null,
            blockReason: null,
            blockMessages: false,
            blockCalls: false,
            isActive: true,
            avatar: null,
            archivedAt: null,
            deletedAt: null,
            participantsList: [
              {
                id: 'user-1',
                firstName: 'Jane',
                lastName: 'Smith'
              },
              {
                id: 'user-2',
                firstName: 'John',
                lastName: 'Doe'
              }
            ],
            createdByUser: {
              id: 'user-1',
              firstName: 'Jane',
              lastName: 'Smith'
            },
            lastMessage: {
              id: 'msg-1',
              content: 'Hello! How are you?',
              type: 'text',
              status: 'read',
              createdAt: '2024-01-15T14:30:00.000Z'
            },
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T14:30:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          type: 'direct'
        }
      }
    }
  },

  // Створення чату
  createChat: {
    method: 'POST',
    url: '/api/messages/chats',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Project Discussion',
      type: 'group',
      participants: ['user-2', 'user-3'],
      description: 'Discussion about the new project',
      settings: {
        notifications: true,
        muteUntil: null
      },
      metadata: {
        projectId: 'project-1',
        priority: 'high'
      }
    },
    response: {
      success: true,
      message: 'Chat created successfully',
      data: {
        id: '2',
        name: 'Project Discussion',
        type: 'group',
        status: 'active',
        participants: ['user-1', 'user-2', 'user-3'],
        createdBy: 'user-1',
        description: 'Discussion about the new project',
        settings: {
          notifications: true,
          muteUntil: null
        },
        metadata: {
          projectId: 'project-1',
          priority: 'high'
        },
        lastMessageAt: null,
        lastMessageId: null,
        unreadCount: 0,
        blockedUsers: null,
        blockReason: null,
        blockMessages: false,
        blockCalls: false,
        isActive: true,
        avatar: null,
        archivedAt: null,
        deletedAt: null,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:00:00.000Z'
      }
    }
  },

  // Оновлення чату
  updateChat: {
    method: 'PUT',
    url: '/api/messages/chats/2',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Project Discussion (Updated)',
      description: 'Updated discussion about the new project',
      settings: {
        notifications: false,
        muteUntil: '2024-01-20T00:00:00.000Z'
      }
    },
    response: {
      success: true,
      message: 'Chat updated successfully',
      data: {
        id: '2',
        name: 'Project Discussion (Updated)',
        type: 'group',
        status: 'active',
        participants: ['user-1', 'user-2', 'user-3'],
        createdBy: 'user-1',
        description: 'Updated discussion about the new project',
        settings: {
          notifications: false,
          muteUntil: '2024-01-20T00:00:00.000Z'
        },
        metadata: {
          projectId: 'project-1',
          priority: 'high'
        },
        lastMessageAt: null,
        lastMessageId: null,
        unreadCount: 0,
        blockedUsers: null,
        blockReason: null,
        blockMessages: false,
        blockCalls: false,
        isActive: true,
        avatar: null,
        archivedAt: null,
        deletedAt: null,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:30:00.000Z'
      }
    }
  },

  // Отримання повідомлень чату
  getChatMessages: {
    method: 'GET',
    url: '/api/messages/chats/1/messages?page=1&limit=50',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Messages retrieved successfully',
      data: {
        messages: [
          {
            id: 'msg-1',
            chatId: '1',
            senderId: 'user-2',
            content: 'Hello! How are you?',
            type: 'text',
            status: 'read',
            attachments: null,
            metadata: null,
            replyToId: null,
            replyTo: null,
            replies: null,
            editedAt: null,
            isEdited: false,
            isDeleted: false,
            deletedAt: null,
            isRead: true,
            readAt: '2024-01-15T14:35:00.000Z',
            isEncrypted: false,
            reason: null,
            deliveredAt: '2024-01-15T14:30:30.000Z',
            failedAt: null,
            sender: {
              id: 'user-2',
              firstName: 'John',
              lastName: 'Doe'
            },
            chat: {
              id: '1',
              name: 'John Doe'
            },
            createdAt: '2024-01-15T14:30:00.000Z',
            updatedAt: '2024-01-15T14:35:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
        filters: {}
      }
    }
  },

  // Відправка повідомлення
  sendMessage: {
    method: 'POST',
    url: '/api/messages/chats/1/messages',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      content: 'I\'m doing great! How about you?',
      type: 'text',
      attachments: null,
      metadata: null,
      replyToId: null,
      isEncrypted: false
    },
    response: {
      success: true,
      message: 'Message sent successfully',
      data: {
        id: 'msg-2',
        chatId: '1',
        senderId: 'user-1',
        content: 'I\'m doing great! How about you?',
        type: 'text',
        status: 'sent',
        attachments: null,
        metadata: null,
        replyToId: null,
        replyTo: null,
        replies: null,
        editedAt: null,
        isEdited: false,
        isDeleted: false,
        deletedAt: null,
        isRead: false,
        readAt: null,
        isEncrypted: false,
        reason: null,
        deliveredAt: null,
        failedAt: null,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:00:00.000Z'
      }
    }
  },

  // Оновлення повідомлення
  updateMessage: {
    method: 'PUT',
    url: '/api/messages/messages/msg-2',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      content: 'I\'m doing great! How about you? (Updated)',
      metadata: {
        edited: true
      }
    },
    response: {
      success: true,
      message: 'Message updated successfully',
      data: {
        id: 'msg-2',
        chatId: '1',
        senderId: 'user-1',
        content: 'I\'m doing great! How about you? (Updated)',
        type: 'text',
        status: 'sent',
        attachments: null,
        metadata: {
          edited: true
        },
        replyToId: null,
        replyTo: null,
        replies: null,
        editedAt: '2024-01-15T15:05:00.000Z',
        isEdited: true,
        isDeleted: false,
        deletedAt: null,
        isRead: false,
        readAt: null,
        isEncrypted: false,
        reason: null,
        deliveredAt: null,
        failedAt: null,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:05:00.000Z'
      }
    }
  },

  // Оновлення статусу повідомлення
  updateMessageStatus: {
    method: 'PATCH',
    url: '/api/messages/messages/msg-2/status',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      status: 'delivered',
      reason: 'Successfully delivered',
      timestamp: '2024-01-15T15:01:00.000Z'
    },
    response: {
      success: true,
      message: 'Message status updated successfully',
      data: {
        id: 'msg-2',
        chatId: '1',
        senderId: 'user-1',
        content: 'I\'m doing great! How about you? (Updated)',
        type: 'text',
        status: 'delivered',
        attachments: null,
        metadata: {
          edited: true
        },
        replyToId: null,
        replyTo: null,
        replies: null,
        editedAt: '2024-01-15T15:05:00.000Z',
        isEdited: true,
        isDeleted: false,
        deletedAt: null,
        isRead: false,
        readAt: null,
        isEncrypted: false,
        reason: 'Successfully delivered',
        deliveredAt: '2024-01-15T15:01:00.000Z',
        failedAt: null,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:01:00.000Z'
      }
    }
  },

  // Видалення повідомлення
  deleteMessage: {
    method: 'DELETE',
    url: '/api/messages/messages/msg-2',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Message deleted successfully'
    }
  },

  // Позначення чату як прочитаний
  markChatAsRead: {
    method: 'POST',
    url: '/api/messages/chats/1/read',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Chat marked as read'
    }
  },

  // Блокування користувача
  blockUser: {
    method: 'POST',
    url: '/api/messages/chats/1/block',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      userId: 'user-2',
      reason: 'Inappropriate behavior',
      blockMessages: true,
      blockCalls: true
    },
    response: {
      success: true,
      message: 'User blocked successfully'
    }
  },

  // Розблокування користувача
  unblockUser: {
    method: 'POST',
    url: '/api/messages/chats/1/unblock',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      userId: 'user-2'
    },
    response: {
      success: true,
      message: 'User unblocked successfully'
    }
  },

  // Пошук повідомлень
  searchMessages: {
    method: 'GET',
    url: '/api/messages/search?search=hello&type=text&page=1&limit=20',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Messages retrieved successfully',
      data: {
        messages: [
          {
            id: 'msg-1',
            chatId: '1',
            senderId: 'user-2',
            content: 'Hello! How are you?',
            type: 'text',
            status: 'read',
            attachments: null,
            metadata: null,
            replyToId: null,
            replyTo: null,
            replies: null,
            editedAt: null,
            isEdited: false,
            isDeleted: false,
            deletedAt: null,
            isRead: true,
            readAt: '2024-01-15T14:35:00.000Z',
            isEncrypted: false,
            reason: null,
            deliveredAt: '2024-01-15T14:30:30.000Z',
            failedAt: null,
            sender: {
              id: 'user-2',
              firstName: 'John',
              lastName: 'Doe'
            },
            chat: {
              id: '1',
              name: 'John Doe'
            },
            createdAt: '2024-01-15T14:30:00.000Z',
            updatedAt: '2024-01-15T14:35:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          search: 'hello',
          type: 'text'
        }
      }
    }
  },

  // Отримання непрочитаних повідомлень
  getUnreadMessages: {
    method: 'GET',
    url: '/api/messages/unread',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Unread messages retrieved successfully',
      data: [
        {
          id: 'msg-3',
          chatId: '1',
          senderId: 'user-2',
          content: 'Are you available for a call?',
          type: 'text',
          status: 'delivered',
          attachments: null,
          metadata: null,
          replyToId: null,
          replyTo: null,
          replies: null,
          editedAt: null,
          isEdited: false,
          isDeleted: false,
          deletedAt: null,
          isRead: false,
          readAt: null,
          isEncrypted: false,
          reason: null,
          deliveredAt: '2024-01-15T16:00:00.000Z',
          failedAt: null,
          sender: {
            id: 'user-2',
            firstName: 'John',
            lastName: 'Doe'
          },
          chat: {
            id: '1',
            name: 'John Doe'
          },
          createdAt: '2024-01-15T16:00:00.000Z',
          updatedAt: '2024-01-15T16:00:00.000Z'
        }
      ]
    }
  },

  // Отримання статистики повідомлень
  getMessageStats: {
    method: 'GET',
    url: '/api/messages/stats?startDate=2024-01-01&endDate=2024-01-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Message statistics retrieved successfully',
      data: {
        totalMessages: 150,
        messagesByType: [
          { type: 'text', count: 120 },
          { type: 'image', count: 20 },
          { type: 'file', count: 10 }
        ],
        messagesByStatus: [
          { status: 'read', count: 100 },
          { status: 'delivered', count: 30 },
          { status: 'sent', count: 20 }
        ],
        totalChats: 5,
        activeChats: 4,
        unreadMessages: 15,
        messagesToday: 25,
        messagesThisWeek: 80,
        messagesThisMonth: 150,
        averageMessagesPerChat: 30.0,
        topChats: [
          { chatId: '1', messageCount: 50 },
          { chatId: '2', messageCount: 40 },
          { chatId: '3', messageCount: 30 }
        ]
      }
    }
  },

  // Приклад помилки (чат не знайдено)
  getChatMessagesError: {
    method: 'GET',
    url: '/api/messages/chats/non-existent-id/messages',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: false,
      message: 'Chat not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createChatError: {
    method: 'POST',
    url: '/api/messages/chats',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Test Chat'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default messageExamples;


