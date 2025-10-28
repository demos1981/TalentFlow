/**
 * Приклади використання Performance API
 */

export const performanceExamples = {
  // Отримання KPI метрик
  getKPIMetrics: {
    method: 'GET',
    url: '/api/performance/metrics?page=1&limit=20&kpiType=recruitment&metric=time_to_hire&period=monthly&status=good',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'KPI metrics retrieved successfully',
      data: {
        metrics: [
          {
            id: '1',
            kpiType: 'recruitment',
            metric: 'time_to_hire',
            value: 25.5,
            targetValue: 20.0,
            previousValue: 28.0,
            benchmarkValue: 22.0,
            unit: 'days',
            period: 'monthly',
            status: 'good',
            trend: 'down',
            variance: 27.5,
            changeRate: -8.9,
            measurementDate: '2024-01-15T00:00:00.000Z',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-01-31T23:59:59.999Z',
            userId: 'user-1',
            companyId: 'company-1',
            jobId: 'job-1',
            departmentId: 'engineering',
            teamId: 'backend',
            description: 'Average time to hire for engineering positions',
            metadata: {
              source: 'hr_system',
              calculationMethod: 'average',
              dataPoints: 15,
              confidence: 0.95
            },
            breakdown: {
              byDepartment: {
                'engineering': 25.5,
                'marketing': 22.0,
                'sales': 30.0
              },
              byTeam: {
                'backend': 25.5,
                'frontend': 24.0,
                'devops': 27.0
              },
              byLocation: {
                'New York': 26.0,
                'San Francisco': 24.0,
                'Remote': 27.0
              }
            },
            factors: {
              internal: ['interview_process', 'hiring_team_availability'],
              external: ['market_conditions', 'candidate_availability'],
              controllable: ['interview_process', 'hiring_team_availability'],
              uncontrollable: ['market_conditions', 'candidate_availability']
            },
            notes: 'Improved from previous month due to process optimization',
            createdBy: 'user-1',
            isActive: true,
            isArchived: false,
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          kpiType: 'recruitment',
          metric: 'time_to_hire',
          period: 'monthly',
          status: 'good'
        }
      }
    }
  },

  // Отримання статистики продуктивності
  getPerformanceStats: {
    method: 'GET',
    url: '/api/performance/stats?startDate=2024-01-01&endDate=2024-01-31&period=monthly',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Performance statistics retrieved successfully',
      data: {
        totalMetrics: 25,
        averagePerformance: 78.5,
        topPerformingMetrics: [
          {
            metric: 'candidate_experience',
            value: 4.8,
            target: 4.5,
            status: 'excellent'
          },
          {
            metric: 'offer_acceptance_rate',
            value: 85.0,
            target: 80.0,
            status: 'excellent'
          },
          {
            metric: 'recruiter_efficiency',
            value: 92.0,
            target: 90.0,
            status: 'excellent'
          }
        ],
        underperformingMetrics: [
          {
            metric: 'time_to_hire',
            value: 25.5,
            target: 20.0,
            status: 'below_average'
          },
          {
            metric: 'cost_per_hire',
            value: 3500.0,
            target: 3000.0,
            status: 'below_average'
          },
          {
            metric: 'quality_of_hire',
            value: 3.2,
            target: 4.0,
            status: 'below_average'
          }
        ],
        kpiAchievement: 68.5,
        trends: [
          {
            period: '2024-01',
            value: 75.0,
            target: 80.0,
            trend: 'up'
          },
          {
            period: '2024-02',
            value: 78.0,
            target: 80.0,
            trend: 'up'
          },
          {
            period: '2024-03',
            value: 80.0,
            target: 80.0,
            trend: 'stable'
          }
        ],
        comparison: {
          previousPeriod: 5.2,
          previousYear: 12.8,
          benchmark: 2.1
        },
        recommendations: [
          'Зменшити час найму на 15% через оптимізацію процесу інтерв\'ю',
          'Покращити якість найму через кращий скринінг кандидатів',
          'Знизити вартість найму через використання внутрішніх ресурсів',
          'Покращити досвід кандидатів через швидший фідбек та прозорість процесу',
          'Підвищити рівень прийняття пропозицій через конкурентні умови та швидший процес'
        ],
        alerts: [
          {
            metric: 'time_to_hire',
            message: 'Time to hire exceeds target by 27.5%',
            severity: 'high'
          },
          {
            metric: 'cost_per_hire',
            message: 'Cost per hire exceeds target by 16.7%',
            severity: 'medium'
          }
        ]
      }
    }
  },

  // Отримання даних для графіків
  getChartData: {
    method: 'GET',
    url: '/api/performance/charts?chartType=line&metric=time_to_hire&period=monthly&startDate=2024-01-01&endDate=2024-12-31&groupBy=month',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Chart data retrieved successfully',
      data: {
        chartType: 'line',
        data: [
          {
            label: '2024-01',
            value: 25.5,
            target: 20.0,
            date: '2024-01-01'
          },
          {
            label: '2024-02',
            value: 24.0,
            target: 20.0,
            date: '2024-02-01'
          },
          {
            label: '2024-03',
            value: 22.5,
            target: 20.0,
            date: '2024-03-01'
          },
          {
            label: '2024-04',
            value: 21.0,
            target: 20.0,
            date: '2024-04-01'
          },
          {
            label: '2024-05',
            value: 20.5,
            target: 20.0,
            date: '2024-05-01'
          },
          {
            label: '2024-06',
            value: 19.5,
            target: 20.0,
            date: '2024-06-01'
          }
        ],
        metadata: {
          metric: 'time_to_hire',
          period: 'monthly',
          totalRecords: 150,
          averageValue: 22.2,
          minValue: 18.0,
          maxValue: 28.0
        }
      }
    }
  },

  // Отримання даних порівняння
  getComparisonData: {
    method: 'GET',
    url: '/api/performance/comparison?metric=time_to_hire&period=monthly&currentStartDate=2024-01-01&currentEndDate=2024-01-31&compareStartDate=2023-01-01&compareEndDate=2023-01-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Comparison data retrieved successfully',
      data: {
        current: {
          value: 25.5,
          period: '2024-01-01 - 2024-01-31',
          records: 15
        },
        comparison: {
          value: 28.0,
          period: '2023-01-01 - 2023-01-31',
          records: 12
        },
        change: {
          absolute: -2.5,
          percentage: -8.9,
          direction: 'down'
        },
        significance: 'medium'
      }
    }
  },

  // Отримання даних трендів
  getTrendsData: {
    method: 'GET',
    url: '/api/performance/trends?metric=time_to_hire&period=monthly&startDate=2024-01-01&endDate=2024-12-31&forecastPeriods=6',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Trends data retrieved successfully',
      data: {
        metric: 'time_to_hire',
        period: 'monthly',
        trends: [
          {
            period: '2024-01',
            value: 25.5,
            target: 20.0,
            trend: 'down'
          },
          {
            period: '2024-02',
            value: 24.0,
            target: 20.0,
            trend: 'down'
          },
          {
            period: '2024-03',
            value: 22.5,
            target: 20.0,
            trend: 'down'
          },
          {
            period: '2024-04',
            value: 21.0,
            target: 20.0,
            trend: 'down'
          },
          {
            period: '2024-05',
            value: 20.5,
            target: 20.0,
            trend: 'down'
          },
          {
            period: '2024-06',
            value: 19.5,
            target: 20.0,
            trend: 'down'
          }
        ],
        analysis: {
          direction: 'down',
          strength: 'strong',
          forecast: 'continuing downward trend'
        },
        forecast: [
          {
            period: '2024-07',
            value: 18.5,
            target: 20.0,
            confidence: 0.85
          },
          {
            period: '2024-08',
            value: 17.5,
            target: 20.0,
            confidence: 0.80
          },
          {
            period: '2024-09',
            value: 16.5,
            target: 20.0,
            confidence: 0.75
          },
          {
            period: '2024-10',
            value: 15.5,
            target: 20.0,
            confidence: 0.70
          },
          {
            period: '2024-11',
            value: 14.5,
            target: 20.0,
            confidence: 0.65
          },
          {
            period: '2024-12',
            value: 13.5,
            target: 20.0,
            confidence: 0.60
          }
        ]
      }
    }
  },

  // Створення KPI цілі
  createKPITarget: {
    method: 'POST',
    url: '/api/performance/targets',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      kpiType: 'recruitment',
      metric: 'time_to_hire',
      targetValue: 20.0,
      unit: 'days',
      period: 'monthly',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-12-31T23:59:59.999Z',
      description: 'Target time to hire for engineering positions',
      companyId: 'company-1',
      departmentId: 'engineering',
      teamId: 'backend',
      metadata: {
        priority: 'high',
        category: 'recruitment',
        weight: 0.3
      }
    },
    response: {
      success: true,
      message: 'KPI target created successfully',
      data: {
        id: '1',
        kpiType: 'recruitment',
        metric: 'time_to_hire',
        targetValue: 20.0,
        unit: 'days',
        period: 'monthly',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
        description: 'Target time to hire for engineering positions',
        userId: 'user-1',
        companyId: 'company-1',
        jobId: null,
        departmentId: 'engineering',
        teamId: 'backend',
        metadata: {
          priority: 'high',
          category: 'recruitment',
          weight: 0.3
        },
        notes: null,
        createdBy: 'user-1',
        isActive: true,
        isArchived: false,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Оновлення KPI цілі
  updateKPITarget: {
    method: 'PUT',
    url: '/api/performance/targets/1',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      targetValue: 18.0,
      unit: 'days',
      period: 'monthly',
      description: 'Updated target time to hire for engineering positions',
      metadata: {
        priority: 'high',
        category: 'recruitment',
        weight: 0.4
      }
    },
    response: {
      success: true,
      message: 'KPI target updated successfully',
      data: {
        id: '1',
        kpiType: 'recruitment',
        metric: 'time_to_hire',
        targetValue: 18.0,
        unit: 'days',
        period: 'monthly',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
        description: 'Updated target time to hire for engineering positions',
        userId: 'user-1',
        companyId: 'company-1',
        jobId: null,
        departmentId: 'engineering',
        teamId: 'backend',
        metadata: {
          priority: 'high',
          category: 'recruitment',
          weight: 0.4
        },
        notes: null,
        createdBy: 'user-1',
        isActive: true,
        isArchived: false,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T11:00:00.000Z'
      }
    }
  },

  // Видалення KPI цілі
  deleteKPITarget: {
    method: 'DELETE',
    url: '/api/performance/targets/1',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'KPI target deleted successfully'
    }
  },

  // Масові дії з KPI цілями
  bulkKPIAction: {
    method: 'POST',
    url: '/api/performance/targets/bulk-action',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      targetIds: ['1', '2', '3'],
      action: 'update',
      actionData: {
        isActive: true,
        metadata: {
          priority: 'high'
        }
      }
    },
    response: {
      success: true,
      message: 'Bulk KPI action completed successfully. 3 targets affected.',
      data: { count: 3 }
    }
  },

  // Створення алерту продуктивності
  createPerformanceAlert: {
    method: 'POST',
    url: '/api/performance/alerts',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      metric: 'time_to_hire',
      threshold: 25.0,
      condition: 'above',
      message: 'Time to hire exceeds 25 days',
      isActive: true,
      notifyUsers: ['user-1', 'user-2'],
      metadata: {
        priority: 'high',
        category: 'recruitment'
      }
    },
    response: {
      success: true,
      message: 'Performance alert created successfully',
      data: {
        id: '1',
        metric: 'time_to_hire',
        threshold: 25.0,
        condition: 'above',
        message: 'Time to hire exceeds 25 days',
        isActive: true,
        notifyUsers: ['user-1', 'user-2'],
        metadata: {
          priority: 'high',
          category: 'recruitment'
        },
        userId: 'user-1',
        companyId: 'company-1',
        createdBy: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Приклад помилки (KPI ціль не знайдена)
  getKPITargetError: {
    method: 'GET',
    url: '/api/performance/targets/non-existent-id',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: false,
      message: 'KPI target not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createKPITargetError: {
    method: 'POST',
    url: '/api/performance/targets',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      kpiType: 'recruitment',
      metric: 'time_to_hire',
      targetValue: 20.0,
      unit: 'days',
      period: 'monthly'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default performanceExamples;
