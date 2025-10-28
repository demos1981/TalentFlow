/**
 * Приклади використання Report API
 */

export const reportExamples = {
  // Отримання всіх звітів
  getAllReports: {
    method: 'GET',
    url: '/api/reports?page=1&limit=20&type=users&status=completed&format=pdf',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Reports retrieved successfully',
      data: {
        reports: [
          {
            id: '1',
            title: 'Users Report - January 2024',
            description: 'Monthly users report for January 2024',
            type: 'users',
            format: 'pdf',
            status: 'completed',
            category: 'users',
            priority: 'medium',
            filters: {
              dateFrom: '2024-01-01',
              dateTo: '2024-01-31',
              status: ['active']
            },
            fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
            parameters: {
              groupBy: 'role',
              sortBy: 'createdAt',
              sortOrder: 'DESC',
              includeCharts: true,
              includeSummary: true
            },
            metadata: {
              tags: ['monthly', 'users'],
              notes: 'Generated for monthly review'
            },
            fileUrl: '/reports/1.pdf',
            fileSize: 2048576,
            errorMessage: null,
            completedAt: '2024-01-31T23:59:59.999Z',
            expiresAt: '2024-02-28T23:59:59.999Z',
            templateId: null,
            isScheduled: false,
            scheduleFrequency: null,
            scheduleDate: null,
            generatedBy: 'user-1',
            user: {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com'
            },
            isActive: true,
            isArchived: false,
            createdAt: '2024-01-31T10:00:00.000Z',
            updatedAt: '2024-01-31T23:59:59.999Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          page: 1,
          limit: 20,
          type: 'users',
          status: 'completed',
          format: 'pdf'
        }
      }
    }
  },

  // Отримання статистики звітів
  getReportStats: {
    method: 'GET',
    url: '/api/reports/stats',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Report statistics retrieved successfully',
      data: {
        totalReports: 25,
        completedReports: 20,
        failedReports: 3,
        processingReports: 1,
        pendingReports: 1,
        reportsByType: [
          {
            type: 'users',
            count: 8,
            percentage: 32.0
          },
          {
            type: 'jobs',
            count: 6,
            percentage: 24.0
          },
          {
            type: 'applications',
            count: 5,
            percentage: 20.0
          },
          {
            type: 'interviews',
            count: 4,
            percentage: 16.0
          },
          {
            type: 'payments',
            count: 2,
            percentage: 8.0
          }
        ],
        reportsByFormat: [
          {
            format: 'pdf',
            count: 15,
            percentage: 60.0
          },
          {
            format: 'excel',
            count: 7,
            percentage: 28.0
          },
          {
            format: 'csv',
            count: 3,
            percentage: 12.0
          }
        ],
        reportsByStatus: [
          {
            status: 'completed',
            count: 20,
            percentage: 80.0
          },
          {
            status: 'failed',
            count: 3,
            percentage: 12.0
          },
          {
            status: 'processing',
            count: 1,
            percentage: 4.0
          },
          {
            status: 'pending',
            count: 1,
            percentage: 4.0
          }
        ],
        reportsByCategory: [
          {
            category: 'users',
            count: 8,
            percentage: 32.0
          },
          {
            category: 'jobs',
            count: 6,
            percentage: 24.0
          },
          {
            category: 'applications',
            count: 5,
            percentage: 20.0
          },
          {
            category: 'interviews',
            count: 4,
            percentage: 16.0
          },
          {
            category: 'payments',
            count: 2,
            percentage: 8.0
          }
        ],
        totalFileSize: 52428800,
        averageFileSize: 2097152,
        recentReports: [
          {
            id: '1',
            title: 'Users Report - January 2024',
            type: 'users',
            status: 'completed',
            createdAt: '2024-01-31T10:00:00.000Z'
          }
        ],
        popularReportTypes: [
          {
            type: 'users',
            count: 8
          },
          {
            type: 'jobs',
            count: 6
          },
          {
            type: 'applications',
            count: 5
          }
        ],
        reportUsageStats: {
          totalReports: 25,
          completedReports: 20,
          failedReports: 3,
          totalFileSize: 52428800,
          averageFileSize: 2097152,
          reportsByType: [
            {
              type: 'users',
              count: 8
            },
            {
              type: 'jobs',
              count: 6
            }
          ],
          reportsByFormat: [
            {
              format: 'pdf',
              count: 15
            },
            {
              format: 'excel',
              count: 7
            }
          ]
        }
      }
    }
  },

  // Отримання звіту за ID
  getReportById: {
    method: 'GET',
    url: '/api/reports/1',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Report retrieved successfully',
      data: {
        id: '1',
        title: 'Users Report - January 2024',
        description: 'Monthly users report for January 2024',
        type: 'users',
        format: 'pdf',
        status: 'completed',
        category: 'users',
        priority: 'medium',
        filters: {
          dateFrom: '2024-01-01',
          dateTo: '2024-01-31',
          status: ['active']
        },
        fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
        parameters: {
          groupBy: 'role',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          includeCharts: true,
          includeSummary: true
        },
        metadata: {
          tags: ['monthly', 'users'],
          notes: 'Generated for monthly review'
        },
        fileUrl: '/reports/1.pdf',
        fileSize: 2048576,
        errorMessage: null,
        completedAt: '2024-01-31T23:59:59.999Z',
        expiresAt: '2024-02-28T23:59:59.999Z',
        templateId: null,
        isScheduled: false,
        scheduleFrequency: null,
        scheduleDate: null,
        generatedBy: 'user-1',
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        isActive: true,
        isArchived: false,
        createdAt: '2024-01-31T10:00:00.000Z',
        updatedAt: '2024-01-31T23:59:59.999Z'
      }
    }
  },

  // Генерація звіту
  generateReport: {
    method: 'POST',
    url: '/api/reports/generate',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Users Report - February 2024',
      description: 'Monthly users report for February 2024',
      type: 'users',
      format: 'pdf',
      category: 'users',
      priority: 'medium',
      filters: {
        dateFrom: '2024-02-01',
        dateTo: '2024-02-29',
        status: ['active']
      },
      fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
      parameters: {
        groupBy: 'role',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        includeCharts: true,
        includeSummary: true
      },
      metadata: {
        tags: ['monthly', 'users'],
        notes: 'Generated for monthly review'
      }
    },
    response: {
      success: true,
      message: 'Report generated successfully',
      data: {
        id: '2',
        title: 'Users Report - February 2024',
        description: 'Monthly users report for February 2024',
        type: 'users',
        format: 'pdf',
        status: 'processing',
        category: 'users',
        priority: 'medium',
        filters: {
          dateFrom: '2024-02-01',
          dateTo: '2024-02-29',
          status: ['active']
        },
        fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
        parameters: {
          groupBy: 'role',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          includeCharts: true,
          includeSummary: true
        },
        metadata: {
          tags: ['monthly', 'users'],
          notes: 'Generated for monthly review'
        },
        fileUrl: null,
        fileSize: null,
        errorMessage: null,
        completedAt: null,
        expiresAt: null,
        templateId: null,
        isScheduled: false,
        scheduleFrequency: null,
        scheduleDate: null,
        generatedBy: 'user-1',
        isActive: true,
        isArchived: false,
        createdAt: '2024-02-01T10:00:00.000Z',
        updatedAt: '2024-02-01T10:00:00.000Z'
      }
    }
  },

  // Попередній перегляд звіту
  previewReport: {
    method: 'POST',
    url: '/api/reports/preview',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      type: 'users',
      filters: {
        dateFrom: '2024-02-01',
        dateTo: '2024-02-29',
        status: ['active']
      },
      fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
      parameters: {
        groupBy: 'role',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        includeCharts: true,
        includeSummary: true
      },
      limit: 10
    },
    response: {
      success: true,
      message: 'Report preview generated successfully',
      data: {
        type: 'users',
        format: 'preview',
        data: [
          {
            id: 'user-1',
            name: 'User 1',
            email: 'user1@example.com',
            role: 'admin',
            createdAt: '2024-02-01T00:00:00.000Z',
            lastLogin: '2024-02-29T23:59:59.999Z'
          },
          {
            id: 'user-2',
            name: 'User 2',
            email: 'user2@example.com',
            role: 'employer',
            createdAt: '2024-02-02T00:00:00.000Z',
            lastLogin: '2024-02-28T23:59:59.999Z'
          }
        ],
        metadata: {
          totalRecords: 150,
          fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
          filters: {
            dateFrom: '2024-02-01',
            dateTo: '2024-02-29',
            status: ['active']
          },
          parameters: {
            groupBy: 'role',
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            includeCharts: true,
            includeSummary: true
          }
        }
      }
    }
  },

  // Експорт звіту
  exportReport: {
    method: 'POST',
    url: '/api/reports/export',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Users Export - February 2024',
      description: 'Users data export for February 2024',
      type: 'users',
      format: 'excel',
      filters: {
        dateFrom: '2024-02-01',
        dateTo: '2024-02-29',
        status: ['active']
      },
      fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
      parameters: {
        groupBy: 'role',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        includeCharts: false,
        includeSummary: false
      }
    },
    response: {
      success: true,
      message: 'Report exported successfully',
      data: {
        id: '3',
        title: 'Users Export - February 2024',
        description: 'Users data export for February 2024',
        type: 'users',
        format: 'excel',
        status: 'processing',
        category: 'custom',
        priority: 'medium',
        filters: {
          dateFrom: '2024-02-01',
          dateTo: '2024-02-29',
          status: ['active']
        },
        fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
        parameters: {
          groupBy: 'role',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          includeCharts: false,
          includeSummary: false
        },
        metadata: {},
        fileUrl: null,
        fileSize: null,
        errorMessage: null,
        completedAt: null,
        expiresAt: null,
        templateId: null,
        isScheduled: false,
        scheduleFrequency: null,
        scheduleDate: null,
        generatedBy: 'user-1',
        isActive: true,
        isArchived: false,
        createdAt: '2024-02-01T10:00:00.000Z',
        updatedAt: '2024-02-01T10:00:00.000Z'
      }
    }
  },

  // Масові дії з звітами
  bulkReportAction: {
    method: 'POST',
    url: '/api/reports/bulk-action',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      reportIds: ['1', '2', '3'],
      action: 'delete',
      actionData: {}
    },
    response: {
      success: true,
      message: 'Bulk report action completed successfully. 3 reports affected.',
      data: { count: 3 }
    }
  },

  // Створення шаблону звіту
  createReportTemplate: {
    method: 'POST',
    url: '/api/reports/templates',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Monthly Users Report Template',
      description: 'Template for monthly users reports',
      type: 'users',
      format: 'pdf',
      category: 'users',
      isPublic: false,
      fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
      defaultFilters: {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        status: ['active']
      },
      defaultParameters: {
        groupBy: 'role',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        includeCharts: true,
        includeSummary: true
      },
      metadata: {
        tags: ['monthly', 'users', 'template'],
        version: '1.0'
      }
    },
    response: {
      success: true,
      message: 'Report template created successfully',
      data: {
        id: '1',
        name: 'Monthly Users Report Template',
        description: 'Template for monthly users reports',
        type: 'users',
        format: 'pdf',
        category: 'users',
        isPublic: false,
        fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
        defaultFilters: {
          dateFrom: '2024-01-01',
          dateTo: '2024-01-31',
          status: ['active']
        },
        defaultParameters: {
          groupBy: 'role',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          includeCharts: true,
          includeSummary: true
        },
        metadata: {
          tags: ['monthly', 'users', 'template'],
          version: '1.0'
        },
        createdBy: 'user-1',
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        isActive: true,
        isArchived: false,
        createdAt: '2024-02-01T10:00:00.000Z',
        updatedAt: '2024-02-01T10:00:00.000Z'
      }
    }
  },

  // Отримання шаблонів звітів
  getReportTemplates: {
    method: 'GET',
    url: '/api/reports/templates?public=false',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Report templates retrieved successfully',
      data: [
        {
          id: '1',
          name: 'Monthly Users Report Template',
          description: 'Template for monthly users reports',
          type: 'users',
          format: 'pdf',
          category: 'users',
          isPublic: false,
          fields: ['name', 'email', 'role', 'createdAt', 'lastLogin'],
          defaultFilters: {
            dateFrom: '2024-01-01',
            dateTo: '2024-01-31',
            status: ['active']
          },
          defaultParameters: {
            groupBy: 'role',
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            includeCharts: true,
            includeSummary: true
          },
          metadata: {
            tags: ['monthly', 'users', 'template'],
            version: '1.0'
          },
          createdBy: 'user-1',
          user: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          isActive: true,
          isArchived: false,
          createdAt: '2024-02-01T10:00:00.000Z',
          updatedAt: '2024-02-01T10:00:00.000Z'
        }
      ]
    }
  },

  // Створення розкладу звітів
  createReportSchedule: {
    method: 'POST',
    url: '/api/reports/schedules',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      name: 'Monthly Users Report Schedule',
      description: 'Automated monthly users report generation',
      reportId: '1',
      frequency: 'monthly',
      startDate: '2024-03-01T00:00:00.000Z',
      endDate: '2024-12-31T23:59:59.999Z',
      isActive: true,
      recipients: ['user-1@example.com', 'admin@example.com'],
      parameters: {
        emailSubject: 'Monthly Users Report - {{month}} {{year}}',
        emailBody: 'Please find attached the monthly users report for {{month}} {{year}}.',
        includeCharts: true
      },
      metadata: {
        tags: ['monthly', 'users', 'automated'],
        notes: 'Automated monthly report generation'
      }
    },
    response: {
      success: true,
      message: 'Report schedule created successfully',
      data: {
        id: '1',
        name: 'Monthly Users Report Schedule',
        description: 'Automated monthly users report generation',
        reportId: '1',
        report: {
          id: '1',
          title: 'Users Report - January 2024',
          type: 'users',
          format: 'pdf'
        },
        frequency: 'monthly',
        cronExpression: null,
        startDate: '2024-03-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
        nextRun: '2024-03-01T00:00:00.000Z',
        lastRun: null,
        isActive: true,
        recipients: ['user-1@example.com', 'admin@example.com'],
        parameters: {
          emailSubject: 'Monthly Users Report - {{month}} {{year}}',
          emailBody: 'Please find attached the monthly users report for {{month}} {{year}}.',
          includeCharts: true
        },
        metadata: {
          tags: ['monthly', 'users', 'automated'],
          notes: 'Automated monthly report generation'
        },
        createdBy: 'user-1',
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        isArchived: false,
        createdAt: '2024-02-01T10:00:00.000Z',
        updatedAt: '2024-02-01T10:00:00.000Z'
      }
    }
  },

  // Отримання розкладів звітів
  getReportSchedules: {
    method: 'GET',
    url: '/api/reports/schedules',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Report schedules retrieved successfully',
      data: [
        {
          id: '1',
          name: 'Monthly Users Report Schedule',
          description: 'Automated monthly users report generation',
          reportId: '1',
          report: {
            id: '1',
            title: 'Users Report - January 2024',
            type: 'users',
            format: 'pdf'
          },
          frequency: 'monthly',
          cronExpression: null,
          startDate: '2024-03-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z',
          nextRun: '2024-03-01T00:00:00.000Z',
          lastRun: null,
          isActive: true,
          recipients: ['user-1@example.com', 'admin@example.com'],
          parameters: {
            emailSubject: 'Monthly Users Report - {{month}} {{year}}',
            emailBody: 'Please find attached the monthly users report for {{month}} {{year}}.',
            includeCharts: true
          },
          metadata: {
            tags: ['monthly', 'users', 'automated'],
            notes: 'Automated monthly report generation'
          },
          createdBy: 'user-1',
          user: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          isArchived: false,
          createdAt: '2024-02-01T10:00:00.000Z',
          updatedAt: '2024-02-01T10:00:00.000Z'
        }
      ]
    }
  },

  // Приклад помилки (звіт не знайдено)
  getReportError: {
    method: 'GET',
    url: '/api/reports/non-existent-id',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: false,
      message: 'Report not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  generateReportError: {
    method: 'POST',
    url: '/api/reports/generate',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Test Report',
      type: 'users',
      format: 'pdf'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default reportExamples;
