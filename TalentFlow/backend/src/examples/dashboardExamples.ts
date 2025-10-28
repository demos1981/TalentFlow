/**
 * Приклади використання Dashboard API
 */

export const dashboardExamples = {
  // Отримання загальної статистики дашборду
  getDashboardStats: {
    method: 'GET',
    url: '/api/dashboard/stats?period=month&dateFrom=2024-01-01&dateTo=2024-12-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        overview: {
          totalUsers: 1250,
          totalJobs: 450,
          totalApplications: 3200,
          totalCompanies: 180,
          totalCandidates: 1100,
          activeJobs: 380,
          verifiedCompanies: 150,
          totalDocuments: 850
        },
        growth: {
          usersGrowth: 15.5,
          jobsGrowth: 8.2,
          applicationsGrowth: 22.1,
          companiesGrowth: 12.3
        },
        recentActivity: {
          newUsers: 45,
          newJobs: 18,
          newApplications: 120,
          newCompanies: 8
        },
        performance: {
          applicationRate: 7.11,
          interviewRate: 25.5,
          hireRate: 8.2,
          averageTimeToHire: 0
        }
      }
    }
  },

  // Швидкий огляд
  getQuickOverview: {
    method: 'GET',
    url: '/api/dashboard/overview',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Quick overview retrieved successfully',
      data: {
        overview: {
          totalUsers: 1250,
          totalJobs: 450,
          totalApplications: 3200,
          totalCompanies: 180,
          totalCandidates: 1100,
          activeJobs: 380,
          verifiedCompanies: 150,
          totalDocuments: 850
        },
        recentActivity: {
          newUsers: 45,
          newJobs: 18,
          newApplications: 120,
          newCompanies: 8
        }
      }
    }
  },

  // Статистика за період
  getStatsByPeriod: {
    method: 'GET',
    url: '/api/dashboard/period/month',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Period statistics retrieved successfully',
      data: {
        period: 'month',
        data: [
          {
            date: '2024-01-01',
            users: 15,
            jobs: 8,
            applications: 45,
            companies: 3
          },
          {
            date: '2024-01-02',
            users: 12,
            jobs: 6,
            applications: 38,
            companies: 2
          },
          {
            date: '2024-01-03',
            users: 18,
            jobs: 10,
            applications: 52,
            companies: 4
          }
        ]
      }
    }
  },

  // Топ статистика
  getTopStats: {
    method: 'GET',
    url: '/api/dashboard/top?period=month&limit=10',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Top statistics retrieved successfully',
      data: {
        topSkills: [
          { skill: 'JavaScript', count: 245 },
          { skill: 'React', count: 198 },
          { skill: 'TypeScript', count: 156 },
          { skill: 'Node.js', count: 134 },
          { skill: 'Python', count: 112 },
          { skill: 'Java', count: 98 },
          { skill: 'Vue.js', count: 87 },
          { skill: 'Angular', count: 76 },
          { skill: 'PHP', count: 65 },
          { skill: 'C#', count: 54 }
        ],
        topLocations: [
          { location: 'Remote', count: 180 },
          { location: 'New York, USA', count: 95 },
          { location: 'London, UK', count: 78 },
          { location: 'San Francisco, USA', count: 65 },
          { location: 'Berlin, Germany', count: 52 },
          { location: 'Amsterdam, Netherlands', count: 45 },
          { location: 'Toronto, Canada', count: 38 },
          { location: 'Kyiv, Ukraine', count: 32 },
          { location: 'Warsaw, Poland', count: 28 },
          { location: 'Prague, Czech Republic', count: 25 }
        ],
        topCompanies: [
          { company: 'TechCorp Inc.', jobs: 25, applications: 180 },
          { company: 'StartupXYZ', jobs: 18, applications: 145 },
          { company: 'GlobalTech Ltd.', jobs: 15, applications: 120 },
          { company: 'InnovationHub', jobs: 12, applications: 98 },
          { company: 'FutureSoft', jobs: 10, applications: 85 },
          { company: 'DataDriven Co.', jobs: 8, applications: 72 },
          { company: 'CloudFirst', jobs: 7, applications: 65 },
          { company: 'AI Solutions', jobs: 6, applications: 58 },
          { company: 'Blockchain Pro', jobs: 5, applications: 45 },
          { company: 'MobileFirst', jobs: 4, applications: 38 }
        ],
        topJobTypes: [
          { type: 'full_time', count: 280 },
          { type: 'contract', count: 95 },
          { type: 'part_time', count: 45 },
          { type: 'remote', count: 180 },
          { type: 'internship', count: 25 },
          { type: 'freelance', count: 15 }
        ]
      }
    }
  },

  // Аналітика користувачів
  getAnalytics: {
    method: 'GET',
    url: '/api/dashboard/analytics?type=users&period=month&chartType=line&limit=30',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        type: 'users',
        period: 'month',
        chartType: 'line',
        data: [
          { label: '2024-01-01', value: 15, date: '2024-01-01' },
          { label: '2024-01-02', value: 12, date: '2024-01-02' },
          { label: '2024-01-03', value: 18, date: '2024-01-03' },
          { label: '2024-01-04', value: 22, date: '2024-01-04' },
          { label: '2024-01-05', value: 19, date: '2024-01-05' }
        ]
      }
    }
  },

  // Аналітика вакансій
  getJobAnalytics: {
    method: 'GET',
    url: '/api/dashboard/analytics?type=jobs&period=week&chartType=bar&limit=7',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        type: 'jobs',
        period: 'week',
        chartType: 'bar',
        data: [
          { label: '2024-01-01', value: 8, date: '2024-01-01' },
          { label: '2024-01-02', value: 6, date: '2024-01-02' },
          { label: '2024-01-03', value: 10, date: '2024-01-03' },
          { label: '2024-01-04', value: 12, date: '2024-01-04' },
          { label: '2024-01-05', value: 9, date: '2024-01-05' },
          { label: '2024-01-06', value: 7, date: '2024-01-06' },
          { label: '2024-01-07', value: 11, date: '2024-01-07' }
        ]
      }
    }
  },

  // Аналітика заявок
  getApplicationAnalytics: {
    method: 'GET',
    url: '/api/dashboard/analytics?type=applications&period=month&chartType=area&limit=30',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        type: 'applications',
        period: 'month',
        chartType: 'area',
        data: [
          { label: '2024-01-01', value: 45, date: '2024-01-01' },
          { label: '2024-01-02', value: 38, date: '2024-01-02' },
          { label: '2024-01-03', value: 52, date: '2024-01-03' },
          { label: '2024-01-04', value: 48, date: '2024-01-04' },
          { label: '2024-01-05', value: 41, date: '2024-01-05' }
        ]
      }
    }
  },

  // Активність користувачів (тільки для адмінів)
  getUserActivity: {
    method: 'GET',
    url: '/api/dashboard/user-activity?period=week&limit=20',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'User activity retrieved successfully',
      data: {
        period: 'week',
        activities: [
          {
            userId: 'user-uuid-1',
            userName: 'Іван Петренко',
            userEmail: 'ivan@example.com',
            activityType: 'general',
            activityCount: 15,
            lastActivity: '2024-01-15T10:30:00.000Z'
          },
          {
            userId: 'user-uuid-2',
            userName: 'Марія Іваненко',
            userEmail: 'maria@example.com',
            activityType: 'general',
            activityCount: 12,
            lastActivity: '2024-01-15T09:15:00.000Z'
          },
          {
            userId: 'user-uuid-3',
            userName: 'Олексій Коваленко',
            userEmail: 'oleksiy@example.com',
            activityType: 'general',
            activityCount: 8,
            lastActivity: '2024-01-15T08:45:00.000Z'
          }
        ]
      }
    }
  },

  // Статистика доходів (тільки для адмінів)
  getRevenueStats: {
    method: 'GET',
    url: '/api/dashboard/revenue?period=month&currency=USD',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Revenue statistics retrieved successfully',
      data: {
        type: 'revenue',
        period: 'month',
        data: []
      }
    }
  },

  // Статистика конверсій
  getConversionStats: {
    method: 'GET',
    url: '/api/dashboard/conversions?period=month&conversionTypes=["application","interview","hire"]',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Conversion statistics retrieved successfully',
      data: {
        type: 'conversions',
        period: 'month',
        data: []
      }
    }
  },

  // Статистика залучення
  getEngagementStats: {
    method: 'GET',
    url: '/api/dashboard/engagement?period=week&engagementTypes=["views","clicks","shares"]',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Engagement statistics retrieved successfully',
      data: {
        type: 'engagement',
        period: 'week',
        data: []
      }
    }
  }
};

export default dashboardExamples;


