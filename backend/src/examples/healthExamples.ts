/**
 * Приклади використання Health API
 */

export const healthExamples = {
  // Базовий health check
  getHealth: {
    method: 'GET',
    url: '/api/health',
    headers: {},
    response: {
      success: true,
      message: 'Health status retrieved successfully',
      data: {
        service: 'talentflow-api',
        status: 'healthy',
        message: 'System is healthy and operational',
        responseTime: 45,
        timestamp: '2024-01-15T10:00:00.000Z',
        version: '1.0.0',
        environment: 'development',
        metadata: {
          uptime: 3600,
          memoryUsage: {
            rss: 123456789,
            heapTotal: 98765432,
            heapUsed: 87654321,
            external: 1234567
          },
          nodeVersion: 'v18.17.0'
        }
      }
    }
  },

  // Детальний health check
  getDetailedHealth: {
    method: 'GET',
    url: '/api/health/detailed',
    headers: {},
    response: {
      success: true,
      message: 'Detailed health status retrieved successfully',
      data: {
        overallStatus: 'healthy',
        message: 'All systems are operational',
        services: ['database', 'api', 'storage', 'email'],
        details: 'Database: up, CPU: 45%, Memory: 67%',
        timestamp: '2024-01-15T10:00:00.000Z',
        version: '1.0.0',
        environment: 'development',
        uptime: 3600,
        healthScore: 95
      }
    }
  },

  // Перевірка готовності
  getReadiness: {
    method: 'GET',
    url: '/api/health/ready',
    headers: {},
    response: {
      success: true,
      message: 'System readiness status retrieved successfully',
      data: {
        status: 'healthy',
        message: 'All dependencies are healthy',
        dependencies: ['database', 'api', 'storage'],
        details: 'System is ready to serve requests',
        timestamp: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Перевірка живості
  getLiveness: {
    method: 'GET',
    url: '/api/health/live',
    headers: {},
    response: {
      success: true,
      message: 'System liveness status retrieved successfully',
      data: {
        status: 'healthy',
        message: 'Service is alive and responding',
        details: 'Application is running and processing requests',
        timestamp: '2024-01-15T10:00:00.000Z',
        version: '1.0.0',
        build: '123'
      }
    }
  },

  // Метрики системи
  getMetrics: {
    method: 'GET',
    url: '/api/health/metrics',
    headers: {},
    response: {
      success: true,
      message: 'System metrics retrieved successfully',
      data: {
        systemMetrics: {
          cpuUsage: 45.2,
          memoryUsage: 67.8,
          diskUsage: 23.4,
          networkUsage: 12.1,
          loadAverage: 1.2,
          activeConnections: 156,
          queueLength: 3
        },
        databaseMetrics: {
          totalUsers: 1250,
          totalJobs: 340,
          totalApplications: 890,
          totalCompanies: 45,
          totalCandidates: 1100,
          totalFiles: 2300,
          totalInterviews: 67,
          totalNotifications: 450,
          totalEvents: 89,
          timestamp: '2024-01-15T10:00:00.000Z'
        },
        apiMetrics: {
          totalRequests: 15420,
          averageResponseTime: 245,
          errorRate: 0.8,
          activeUsers: 234,
          timestamp: '2024-01-15T10:00:00.000Z'
        },
        timestamp: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Статус бази даних
  getDatabaseHealth: {
    method: 'GET',
    url: '/api/health/database',
    headers: {},
    response: {
      success: true,
      message: 'Database health status retrieved successfully',
      data: {
        status: 'up',
        responseTime: 23,
        connectionPool: 85,
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 23.4,
        message: 'Database is healthy',
        timestamp: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Статус зовнішніх сервісів
  getExternalServicesHealth: {
    method: 'GET',
    url: '/api/health/external',
    headers: {},
    response: {
      success: true,
      message: 'External services health status retrieved successfully',
      data: [
        {
          service: 'email',
          status: 'up',
          responseTime: 120,
          availability: 99.9,
          message: 'email service is healthy',
          lastCheck: '2024-01-15T10:00:00.000Z',
          lastSuccess: '2024-01-15T10:00:00.000Z',
          lastFailure: null,
          successRate: 99.9
        },
        {
          service: 'storage',
          status: 'up',
          responseTime: 89,
          availability: 99.8,
          message: 'storage service is healthy',
          lastCheck: '2024-01-15T10:00:00.000Z',
          lastSuccess: '2024-01-15T10:00:00.000Z',
          lastFailure: null,
          successRate: 99.8
        },
        {
          service: 'payment',
          status: 'up',
          responseTime: 156,
          availability: 99.7,
          message: 'payment service is healthy',
          lastCheck: '2024-01-15T10:00:00.000Z',
          lastSuccess: '2024-01-15T10:00:00.000Z',
          lastFailure: null,
          successRate: 99.7
        }
      ]
    }
  },

  // Статус конкретного зовнішнього сервісу
  getExternalServiceHealth: {
    method: 'GET',
    url: '/api/health/external/email',
    headers: {},
    response: {
      success: true,
      message: 'External service health status retrieved successfully',
      data: {
        service: 'email',
        status: 'up',
        responseTime: 120,
        availability: 99.9,
        message: 'email service is healthy',
        lastCheck: '2024-01-15T10:00:00.000Z',
        lastSuccess: '2024-01-15T10:00:00.000Z',
        lastFailure: null,
        successRate: 99.9
      }
    }
  },

  // Навантаження системи
  getSystemLoad: {
    method: 'GET',
    url: '/api/health/system-load',
    headers: {},
    response: {
      success: true,
      message: 'System load information retrieved successfully',
      data: {
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 23.4,
        networkUsage: 12.1,
        loadAverage: 1.2,
        activeConnections: 156,
        queueLength: 3,
        message: 'System load is normal',
        timestamp: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Приклад помилки (unhealthy system)
  getHealthError: {
    method: 'GET',
    url: '/api/health',
    headers: {},
    response: {
      success: false,
      message: 'Health check failed',
      error: 'Database connection failed',
      data: {
        service: 'talentflow-api',
        status: 'critical',
        message: 'System health check failed: Database connection failed',
        responseTime: 0,
        timestamp: '2024-01-15T10:00:00.000Z',
        version: '1.0.0',
        environment: 'development'
      }
    }
  },

  // Приклад warning статусу
  getDetailedHealthWarning: {
    method: 'GET',
    url: '/api/health/detailed',
    headers: {},
    response: {
      success: true,
      message: 'Detailed health status retrieved successfully',
      data: {
        overallStatus: 'warning',
        message: 'Some systems require attention',
        services: ['database', 'api', 'storage', 'email'],
        details: 'Database: up, CPU: 95%, Memory: 85%',
        timestamp: '2024-01-15T10:00:00.000Z',
        version: '1.0.0',
        environment: 'development',
        uptime: 3600,
        healthScore: 65
      }
    }
  }
};

export default healthExamples;


