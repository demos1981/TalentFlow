/**
 * Приклади використання Job API
 */

export const jobExamples = {
  // Пошук вакансій
  searchJobs: {
    method: 'GET',
    url: '/api/jobs/search?search=frontend&type=full_time&experienceLevel=senior&location=Kyiv',
    response: {
      success: true,
      message: 'Jobs retrieved successfully',
      data: {
        jobs: [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            description: 'We are looking for a senior frontend developer with React experience...',
            requirements: '5+ years of React experience, TypeScript, Redux',
            benefits: 'Competitive salary, flexible hours, remote work',
            location: 'Kyiv, Ukraine',
            remote: 'Hybrid',
            type: 'full_time',
            experienceLevel: 'senior',
            salaryMin: 3000,
            salaryMax: 5000,
            currency: 'USD',
            department: 'Engineering',
            skills: ['React', 'TypeScript', 'Redux', 'Next.js'],
            tags: ['frontend', 'react', 'typescript'],
            status: 'active',
            isUrgent: false,
            isFeatured: true,
            isActive: true,
            deadline: '2024-02-15T00:00:00.000Z',
            views: 150,
            applications: 25,
            companyId: 'company-1',
            createdByUserId: 'user-1',
            company: {
              id: 'company-1',
              name: 'Tech Corp',
              logo: 'https://example.com/logo.png'
            },
            createdByUser: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe'
            },
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z',
            publishedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          search: 'frontend',
          type: 'full_time',
          experienceLevel: 'senior',
          location: 'Kyiv'
        }
      }
    }
  },

  // Отримання доступних локацій
  getAvailableLocations: {
    method: 'GET',
    url: '/api/jobs/locations',
    response: {
      success: true,
      message: 'Available locations retrieved successfully',
      data: {
        locations: [
          { name: 'Kyiv, Ukraine', count: 45 },
          { name: 'Lviv, Ukraine', count: 32 },
          { name: 'Kharkiv, Ukraine', count: 28 },
          { name: 'Dnipro, Ukraine', count: 15 },
          { name: 'Odesa, Ukraine', count: 12 }
        ],
        total: 5
      }
    }
  },

  // Отримання типів вакансій
  getJobTypes: {
    method: 'GET',
    url: '/api/jobs/types',
    response: {
      success: true,
      message: 'Job types retrieved successfully',
      data: {
        types: [
          { value: 'full_time', label: 'Full Time', count: 120 },
          { value: 'part_time', label: 'Part Time', count: 45 },
          { value: 'contract', label: 'Contract', count: 30 },
          { value: 'internship', label: 'Internship', count: 25 },
          { value: 'freelance', label: 'Freelance', count: 20 },
          { value: 'remote', label: 'Remote', count: 15 }
        ],
        total: 6
      }
    }
  },

  // Отримання рівнів досвіду
  getExperienceLevels: {
    method: 'GET',
    url: '/api/jobs/experience-levels',
    response: {
      success: true,
      message: 'Experience levels retrieved successfully',
      data: {
        levels: [
          { value: 'entry', label: 'Entry Level', count: 40 },
          { value: 'junior', label: 'Junior', count: 80 },
          { value: 'middle', label: 'Middle', count: 120 },
          { value: 'senior', label: 'Senior', count: 90 },
          { value: 'lead', label: 'Lead', count: 30 },
          { value: 'executive', label: 'Executive', count: 10 }
        ],
        total: 6
      }
    }
  },

  // Отримання доступних енумів
  getAvailableEnums: {
    method: 'GET',
    url: '/api/jobs/enums',
    response: {
      success: true,
      message: 'Available enums retrieved successfully',
      data: {
        jobTypes: [
          { value: 'full_time', label: 'Full Time' },
          { value: 'part_time', label: 'Part Time' },
          { value: 'contract', label: 'Contract' },
          { value: 'internship', label: 'Internship' },
          { value: 'freelance', label: 'Freelance' },
          { value: 'remote', label: 'Remote' }
        ],
        experienceLevels: [
          { value: 'entry', label: 'Entry Level' },
          { value: 'junior', label: 'Junior' },
          { value: 'middle', label: 'Middle' },
          { value: 'senior', label: 'Senior' },
          { value: 'lead', label: 'Lead' },
          { value: 'executive', label: 'Executive' }
        ],
        workModes: [
          { value: 'remote', label: 'Remote' },
          { value: 'onsite', label: 'On-site' },
          { value: 'hybrid', label: 'Hybrid' }
        ],
        salaryTypes: [
          { value: 'fixed', label: 'Fixed' },
          { value: 'range', label: 'Range' },
          { value: 'negotiable', label: 'Negotiable' },
          { value: 'competitive', label: 'Competitive' }
        ]
      }
    }
  },

  // Створення вакансії
  createJob: {
    method: 'POST',
    url: '/api/jobs',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Senior Backend Developer',
      description: 'We are looking for a senior backend developer with Node.js experience...',
      requirements: '5+ years of Node.js experience, PostgreSQL, Docker',
      benefits: 'Competitive salary, flexible hours, remote work',
      location: 'Lviv, Ukraine',
      remote: 'Hybrid',
      type: 'full_time',
      experienceLevel: 'senior',
      salaryMin: 3500,
      salaryMax: 5500,
      currency: 'USD',
      department: 'Engineering',
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
      tags: ['backend', 'nodejs', 'postgresql'],
      isUrgent: false,
      isFeatured: false,
      deadline: '2024-02-20T00:00:00.000Z',
      companyId: 'company-1'
    },
    response: {
      success: true,
      message: 'Job created successfully',
      data: {
        id: '2',
        title: 'Senior Backend Developer',
        description: 'We are looking for a senior backend developer with Node.js experience...',
        requirements: '5+ years of Node.js experience, PostgreSQL, Docker',
        benefits: 'Competitive salary, flexible hours, remote work',
        location: 'Lviv, Ukraine',
        remote: 'Hybrid',
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 3500,
        salaryMax: 5500,
        currency: 'USD',
        department: 'Engineering',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        tags: ['backend', 'nodejs', 'postgresql'],
        status: 'draft',
        isUrgent: false,
        isFeatured: false,
        isActive: true,
        deadline: '2024-02-20T00:00:00.000Z',
        views: 0,
        applications: 0,
        companyId: 'company-1',
        createdByUserId: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Оновлення вакансії
  updateJob: {
    method: 'PUT',
    url: '/api/jobs/2',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Senior Backend Developer (Updated)',
      description: 'Updated description for senior backend developer position...',
      salaryMin: 4000,
      salaryMax: 6000,
      isUrgent: true
    },
    response: {
      success: true,
      message: 'Job updated successfully',
      data: {
        id: '2',
        title: 'Senior Backend Developer (Updated)',
        description: 'Updated description for senior backend developer position...',
        requirements: '5+ years of Node.js experience, PostgreSQL, Docker',
        benefits: 'Competitive salary, flexible hours, remote work',
        location: 'Lviv, Ukraine',
        remote: 'Hybrid',
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 4000,
        salaryMax: 6000,
        currency: 'USD',
        department: 'Engineering',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        tags: ['backend', 'nodejs', 'postgresql'],
        status: 'draft',
        isUrgent: true,
        isFeatured: false,
        isActive: true,
        deadline: '2024-02-20T00:00:00.000Z',
        views: 0,
        applications: 0,
        companyId: 'company-1',
        createdByUserId: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T11:30:00.000Z'
      }
    }
  },

  // Публікація вакансії
  publishJob: {
    method: 'POST',
    url: '/api/jobs/2/publish',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      notes: 'Ready for publication'
    },
    response: {
      success: true,
      message: 'Job published successfully',
      data: {
        id: '2',
        title: 'Senior Backend Developer (Updated)',
        description: 'Updated description for senior backend developer position...',
        requirements: '5+ years of Node.js experience, PostgreSQL, Docker',
        benefits: 'Competitive salary, flexible hours, remote work',
        location: 'Lviv, Ukraine',
        remote: 'Hybrid',
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 4000,
        salaryMax: 6000,
        currency: 'USD',
        department: 'Engineering',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        tags: ['backend', 'nodejs', 'postgresql'],
        status: 'active',
        isUrgent: true,
        isFeatured: false,
        isActive: true,
        deadline: '2024-02-20T00:00:00.000Z',
        views: 0,
        applications: 0,
        companyId: 'company-1',
        createdByUserId: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
        publishedAt: '2024-01-15T12:00:00.000Z'
      }
    }
  },

  // Призупинення вакансії
  pauseJob: {
    method: 'POST',
    url: '/api/jobs/2/pause',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      reason: 'Temporary pause for review'
    },
    response: {
      success: true,
      message: 'Job paused successfully',
      data: {
        id: '2',
        title: 'Senior Backend Developer (Updated)',
        description: 'Updated description for senior backend developer position...',
        requirements: '5+ years of Node.js experience, PostgreSQL, Docker',
        benefits: 'Competitive salary, flexible hours, remote work',
        location: 'Lviv, Ukraine',
        remote: 'Hybrid',
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 4000,
        salaryMax: 6000,
        currency: 'USD',
        department: 'Engineering',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        tags: ['backend', 'nodejs', 'postgresql'],
        status: 'paused',
        isUrgent: true,
        isFeatured: false,
        isActive: true,
        deadline: '2024-02-20T00:00:00.000Z',
        views: 0,
        applications: 0,
        companyId: 'company-1',
        createdByUserId: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T13:00:00.000Z',
        publishedAt: '2024-01-15T12:00:00.000Z'
      }
    }
  },

  // Закриття вакансії
  closeJob: {
    method: 'POST',
    url: '/api/jobs/2/close',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      reason: 'Position filled'
    },
    response: {
      success: true,
      message: 'Job closed successfully',
      data: {
        id: '2',
        title: 'Senior Backend Developer (Updated)',
        description: 'Updated description for senior backend developer position...',
        requirements: '5+ years of Node.js experience, PostgreSQL, Docker',
        benefits: 'Competitive salary, flexible hours, remote work',
        location: 'Lviv, Ukraine',
        remote: 'Hybrid',
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 4000,
        salaryMax: 6000,
        currency: 'USD',
        department: 'Engineering',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        tags: ['backend', 'nodejs', 'postgresql'],
        status: 'closed',
        isUrgent: true,
        isFeatured: false,
        isActive: true,
        deadline: '2024-02-20T00:00:00.000Z',
        views: 0,
        applications: 0,
        companyId: 'company-1',
        createdByUserId: 'user-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
        publishedAt: '2024-01-15T12:00:00.000Z',
        closedAt: '2024-01-15T14:00:00.000Z'
      }
    }
  },

  // Отримання статистики вакансій
  getJobStats: {
    method: 'GET',
    url: '/api/jobs/stats/overview?startDate=2024-01-01&endDate=2024-01-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Job statistics retrieved successfully',
      data: {
        totalJobs: 15,
        jobsByStatus: [
          { status: 'active', count: 8 },
          { status: 'draft', count: 4 },
          { status: 'paused', count: 2 },
          { status: 'closed', count: 1 }
        ],
        jobsByType: [
          { type: 'full_time', count: 10 },
          { type: 'part_time', count: 3 },
          { type: 'contract', count: 2 }
        ],
        jobsByExperienceLevel: [
          { level: 'senior', count: 6 },
          { level: 'middle', count: 5 },
          { level: 'junior', count: 4 }
        ],
        publishedJobs: 8,
        draftJobs: 4,
        pausedJobs: 2,
        closedJobs: 1,
        totalApplications: 45,
        averageApplicationsPerJob: 3.0,
        topSkills: [
          { skill: 'React', count: 8 },
          { skill: 'TypeScript', count: 6 },
          { skill: 'Node.js', count: 4 }
        ],
        topLocations: [
          { location: 'Kyiv, Ukraine', count: 6 },
          { location: 'Lviv, Ukraine', count: 4 },
          { location: 'Kharkiv, Ukraine', count: 3 }
        ]
      }
    }
  },

  // Отримання моїх вакансій
  getMyJobs: {
    method: 'GET',
    url: '/api/jobs/my/jobs?status=draft',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'My jobs retrieved successfully',
      data: {
        jobs: [
          {
            id: '3',
            title: 'My Draft Job',
            description: 'This is my draft job...',
            requirements: 'Some requirements',
            benefits: 'Some benefits',
            location: 'Kyiv, Ukraine',
            remote: 'Remote',
            type: 'full_time',
            experienceLevel: 'middle',
            salaryMin: 2000,
            salaryMax: 3000,
            currency: 'USD',
            department: 'Engineering',
            skills: ['React', 'TypeScript'],
            tags: ['frontend'],
            status: 'draft',
            isUrgent: false,
            isFeatured: false,
            isActive: true,
            views: 0,
            applications: 0,
            companyId: 'company-1',
            createdByUserId: 'user-1',
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          status: 'draft'
        }
      }
    }
  },

  // Отримання конкретної вакансії
  getJob: {
    method: 'GET',
    url: '/api/jobs/1',
    response: {
      success: true,
      message: 'Job retrieved successfully',
      data: {
        id: '1',
        title: 'Senior Frontend Developer',
        description: 'We are looking for a senior frontend developer with React experience...',
        requirements: '5+ years of React experience, TypeScript, Redux',
        benefits: 'Competitive salary, flexible hours, remote work',
        location: 'Kyiv, Ukraine',
        remote: 'Hybrid',
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 3000,
        salaryMax: 5000,
        currency: 'USD',
        department: 'Engineering',
        skills: ['React', 'TypeScript', 'Redux', 'Next.js'],
        tags: ['frontend', 'react', 'typescript'],
        status: 'active',
        isUrgent: false,
        isFeatured: true,
        isActive: true,
        deadline: '2024-02-15T00:00:00.000Z',
        views: 151,
        applications: 25,
        companyId: 'company-1',
        createdByUserId: 'user-1',
        company: {
          id: 'company-1',
          name: 'Tech Corp',
          logo: 'https://example.com/logo.png'
        },
        createdByUser: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe'
        },
        applicationsList: [
          {
            id: 'app-1',
            userId: 'user-2',
            status: 'pending',
            createdAt: '2024-01-16T10:00:00.000Z'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
        publishedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Видалення вакансії
  deleteJob: {
    method: 'DELETE',
    url: '/api/jobs/2',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Job deleted successfully'
    }
  },

  // Приклад помилки (вакансія не знайдена)
  getJobError: {
    method: 'GET',
    url: '/api/jobs/non-existent-id',
    response: {
      success: false,
      message: 'Job not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createJobError: {
    method: 'POST',
    url: '/api/jobs',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Test Job'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default jobExamples;


