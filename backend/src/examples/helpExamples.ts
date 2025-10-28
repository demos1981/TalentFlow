/**
 * Приклади використання Help API
 */

export const helpExamples = {
  // Отримання категорій допомоги
  getHelpCategories: {
    method: 'GET',
    url: '/api/help/categories',
    headers: {},
    response: {
      success: true,
      message: 'Help categories retrieved successfully',
      data: [
        {
          id: '1',
          name: 'Початок роботи',
          description: 'Основні кроки для початку роботи з платформою',
          icon: '🚀',
          color: '#3B82F6',
          order: 1,
          isActive: true,
          slug: 'getting-started',
          articleCount: 5,
          status: 'active',
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z'
        },
        {
          id: '2',
          name: 'Пошук роботи',
          description: 'Як знайти та подати заявку на роботу',
          icon: '🔍',
          color: '#10B981',
          order: 2,
          isActive: true,
          slug: 'job-search',
          articleCount: 8,
          status: 'active',
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z'
        }
      ]
    }
  },

  // Отримання категорії за ID
  getHelpCategoryById: {
    method: 'GET',
    url: '/api/help/categories/1',
    headers: {},
    response: {
      success: true,
      message: 'Help category retrieved successfully',
      data: {
        id: '1',
        name: 'Початок роботи',
        description: 'Основні кроки для початку роботи з платформою',
        icon: '🚀',
        color: '#3B82F6',
        order: 1,
        isActive: true,
        slug: 'getting-started',
        articleCount: 5,
        status: 'active',
        articles: [
          {
            id: '1',
            title: 'Як створити профіль',
            description: 'Покрокова інструкція створення профілю',
            content: 'Детальний контент статті...',
            type: 'article',
            status: 'published',
            priority: 'high',
            categoryId: '1',
            tags: ['профіль', 'реєстрація'],
            slug: 'how-to-create-profile',
            isFeatured: true,
            order: 1,
            isPublic: true,
            viewCount: 150,
            rating: 4.5,
            ratingCount: 12,
            helpfulCount: 10,
            notHelpfulCount: 2,
            createdById: 'user-1',
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Створення категорії допомоги
  createHelpCategory: {
    method: 'POST',
    url: '/api/help/categories',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Технічна підтримка',
      description: 'Допомога з технічними питаннями',
      icon: '🔧',
      color: '#F59E0B',
      order: 3,
      isActive: true,
      slug: 'technical-support',
      status: 'active'
    },
    response: {
      success: true,
      message: 'Help category created successfully',
      data: {
        id: '3',
        name: 'Технічна підтримка',
        description: 'Допомога з технічними питаннями',
        icon: '🔧',
        color: '#F59E0B',
        order: 3,
        isActive: true,
        slug: 'technical-support',
        articleCount: 0,
        status: 'active',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Отримання статей за категорією
  getHelpArticles: {
    method: 'GET',
    url: '/api/help/articles/1?page=1&limit=10',
    headers: {},
    response: {
      success: true,
      message: 'Help articles retrieved successfully',
      data: {
        articles: [
          {
            id: '1',
            title: 'Як створити профіль',
            description: 'Покрокова інструкція створення профілю',
            content: 'Детальний контент статті...',
            type: 'article',
            status: 'published',
            priority: 'high',
            categoryId: '1',
            tags: ['профіль', 'реєстрація'],
            slug: 'how-to-create-profile',
            isFeatured: true,
            order: 1,
            isPublic: true,
            viewCount: 150,
            rating: 4.5,
            ratingCount: 12,
            helpfulCount: 10,
            notHelpfulCount: 2,
            createdById: 'user-1',
            category: {
              id: '1',
              name: 'Початок роботи',
              slug: 'getting-started'
            },
            createdBy: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe'
            },
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  },

  // Отримання FAQ
  getFAQ: {
    method: 'GET',
    url: '/api/help/faq?page=1&limit=10&search=профіль',
    headers: {},
    response: {
      success: true,
      message: 'FAQ retrieved successfully',
      data: {
        articles: [
          {
            id: '2',
            title: 'Як змінити пароль?',
            description: 'Інструкція зміни пароля',
            content: 'Детальний контент FAQ...',
            type: 'faq',
            status: 'published',
            priority: 'medium',
            categoryId: '1',
            tags: ['пароль', 'безпека'],
            slug: 'how-to-change-password',
            isFeatured: false,
            order: 2,
            isPublic: true,
            viewCount: 75,
            rating: 4.2,
            ratingCount: 8,
            helpfulCount: 6,
            notHelpfulCount: 2,
            createdById: 'user-1',
            category: {
              id: '1',
              name: 'Початок роботи',
              slug: 'getting-started'
            },
            createdBy: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe'
            },
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  },

  // Пошук допомоги
  searchHelp: {
    method: 'GET',
    url: '/api/help/search?search=профіль&type=article&page=1&limit=10',
    headers: {},
    response: {
      success: true,
      message: 'Help search completed successfully',
      data: {
        articles: [
          {
            id: '1',
            title: 'Як створити профіль',
            description: 'Покрокова інструкція створення профілю',
            content: 'Детальний контент статті...',
            type: 'article',
            status: 'published',
            priority: 'high',
            categoryId: '1',
            tags: ['профіль', 'реєстрація'],
            slug: 'how-to-create-profile',
            isFeatured: true,
            order: 1,
            isPublic: true,
            viewCount: 150,
            rating: 4.5,
            ratingCount: 12,
            helpfulCount: 10,
            notHelpfulCount: 2,
            createdById: 'user-1',
            category: {
              id: '1',
              name: 'Початок роботи',
              slug: 'getting-started'
            },
            createdBy: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe'
            },
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  },

  // Отримання контактів підтримки
  getSupportContacts: {
    method: 'GET',
    url: '/api/help/support-contacts',
    headers: {},
    response: {
      success: true,
      message: 'Support contacts retrieved successfully',
      data: [
        {
          id: '1',
          name: 'Технічна підтримка',
          email: 'support@talentflow.com',
          phone: '+380 44 123 45 67',
          department: 'Технічна підтримка',
          description: 'Допомога з технічними питаннями',
          workingHours: ['Пн-Пт: 9:00-18:00', 'Сб: 10:00-16:00'],
          isActive: true,
          order: 1
        },
        {
          id: '2',
          name: 'HR підтримка',
          email: 'hr@talentflow.com',
          phone: '+380 44 123 45 68',
          department: 'HR відділ',
          description: 'Допомога з HR питаннями',
          workingHours: ['Пн-Пт: 10:00-17:00'],
          isActive: true,
          order: 2
        }
      ]
    }
  },

  // Створення статті допомоги
  createHelpArticle: {
    method: 'POST',
    url: '/api/help/articles',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Як налаштувати сповіщення',
      description: 'Інструкція налаштування сповіщень',
      content: 'Детальний контент статті...',
      type: 'article',
      status: 'published',
      priority: 'medium',
      categoryId: '1',
      tags: ['сповіщення', 'налаштування'],
      slug: 'how-to-setup-notifications',
      isFeatured: false,
      order: 3,
      isPublic: true
    },
    response: {
      success: true,
      message: 'Help article created successfully',
      data: {
        id: '3',
        title: 'Як налаштувати сповіщення',
        description: 'Інструкція налаштування сповіщень',
        content: 'Детальний контент статті...',
        type: 'article',
        status: 'published',
        priority: 'medium',
        categoryId: '1',
        tags: ['сповіщення', 'налаштування'],
        slug: 'how-to-setup-notifications',
        isFeatured: false,
        order: 3,
        isPublic: true,
        viewCount: 0,
        rating: 0,
        ratingCount: 0,
        helpfulCount: 0,
        notHelpfulCount: 0,
        createdById: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Оцінювання статті
  rateHelp: {
    method: 'POST',
    url: '/api/help/rate',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      helpId: '1',
      rating: 5,
      comment: 'Дуже корисна стаття!',
      wasHelpful: true
    },
    response: {
      success: true,
      message: 'Rating saved successfully',
      data: {
        id: 'rating-1',
        helpId: '1',
        userId: 'user-1',
        rating: 5,
        comment: 'Дуже корисна стаття!',
        wasHelpful: true,
        createdAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Отримання статистики
  getHelpStats: {
    method: 'GET',
    url: '/api/help/stats?categoryId=1&type=article',
    headers: {},
    response: {
      success: true,
      message: 'Help statistics retrieved successfully',
      data: {
        totalArticles: 15,
        publishedArticles: 12,
        draftArticles: 3,
        averageRating: 4.3,
        totalViews: 1250,
        totalRatings: 45,
        timestamp: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Приклад помилки (стаття не знайдена)
  getHelpArticleByIdError: {
    method: 'GET',
    url: '/api/help/articles/article/non-existent-id',
    headers: {},
    response: {
      success: false,
      message: 'Help article not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createHelpCategoryError: {
    method: 'POST',
    url: '/api/help/categories',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Тестова категорія'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default helpExamples;


