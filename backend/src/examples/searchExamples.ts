/**
 * Приклади використання Search API
 * 
 * Search API надає можливість пошуку по вакансіях, кандидатах, компаніях
 * та універсальний пошук по всіх типах контенту.
 */

export const searchExamples = {
  // ===== ПОШУК ВАКАНСІЙ =====
  
  /**
   * Простий пошук вакансій
   */
  searchJobs: {
    method: 'GET',
    url: '/api/search/jobs',
    query: {
      search: 'React Developer',
      location: 'Kyiv',
      page: 1,
      limit: 20
    },
    response: {
      success: true,
      message: 'Jobs search completed successfully',
      data: {
        jobs: [
          {
            id: 'job-uuid-1',
            title: 'Senior React Developer',
            description: 'We are looking for an experienced React developer...',
            company: {
              id: 'company-uuid-1',
              name: 'TechCorp',
              industry: 'Technology'
            },
            location: 'Kyiv, Ukraine',
            jobType: 'full-time',
            workMode: 'hybrid',
            experienceLevel: 'senior',
            salaryMin: 3000,
            salaryMax: 5000,
            salaryCurrency: 'USD',
            skills: ['React', 'TypeScript', 'Node.js'],
            isRemote: true,
            isFeatured: true,
            createdAt: '2024-01-15T10:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        searchTime: 45,
        filters: {
          search: 'React Developer',
          location: 'Kyiv',
          page: 1,
          limit: 20
        }
      }
    }
  },

  /**
   * Розширений пошук вакансій з фільтрами
   */
  searchJobsAdvanced: {
    method: 'GET',
    url: '/api/search/jobs',
    query: {
      search: 'Frontend Developer',
      location: 'Remote',
      jobType: 'full-time',
      workMode: 'remote',
      experienceLevel: 'mid',
      salaryMin: 2000,
      salaryMax: 4000,
      salaryCurrency: 'USD',
      skills: ['React', 'Vue.js', 'JavaScript'],
      isRemote: true,
      isFeatured: true,
      postedAfter: '2024-01-01',
      sortBy: 'salaryMax',
      sortOrder: 'DESC',
      page: 1,
      limit: 10
    },
    response: {
      success: true,
      message: 'Jobs search completed successfully',
      data: {
        jobs: [
          {
            id: 'job-uuid-2',
            title: 'Mid-Level Frontend Developer',
            description: 'Join our team as a Frontend Developer...',
            company: {
              id: 'company-uuid-2',
              name: 'StartupXYZ',
              industry: 'Fintech'
            },
            location: 'Remote',
            jobType: 'full-time',
            workMode: 'remote',
            experienceLevel: 'mid',
            salaryMin: 2500,
            salaryMax: 3500,
            salaryCurrency: 'USD',
            skills: ['React', 'Vue.js', 'JavaScript', 'CSS'],
            isRemote: true,
            isFeatured: true,
            createdAt: '2024-01-20T14:30:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        searchTime: 67,
        filters: {
          search: 'Frontend Developer',
          location: 'Remote',
          jobType: 'full-time',
          workMode: 'remote',
          experienceLevel: 'mid',
          salaryMin: 2000,
          salaryMax: 4000,
          salaryCurrency: 'USD',
          skills: ['React', 'Vue.js', 'JavaScript'],
          isRemote: true,
          isFeatured: true,
          postedAfter: '2024-01-01',
          sortBy: 'salaryMax',
          sortOrder: 'DESC',
          page: 1,
          limit: 10
        }
      }
    }
  },

  // ===== ПОШУК КАНДИДАТІВ =====
  
  /**
   * Простий пошук кандидатів
   */
  searchCandidates: {
    method: 'GET',
    url: '/api/search/candidates',
    query: {
      search: 'JavaScript Developer',
      location: 'Lviv',
      page: 1,
      limit: 20
    },
    response: {
      success: true,
      message: 'Candidates search completed successfully',
      data: {
        candidates: [
          {
            id: 'candidate-uuid-1',
            user: {
              id: 'user-uuid-1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com'
            },
            title: 'Senior JavaScript Developer',
            bio: 'Experienced developer with 5+ years in JavaScript...',
            location: 'Lviv, Ukraine',
            yearsOfExperience: 5,
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
            education: 'Master in Computer Science',
            isAvailable: true,
            isOpenToWork: true,
            createdAt: '2024-01-10T09:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        searchTime: 52,
        filters: {
          search: 'JavaScript Developer',
          location: 'Lviv',
          page: 1,
          limit: 20
        }
      }
    }
  },

  /**
   * Розширений пошук кандидатів з фільтрами
   */
  searchCandidatesAdvanced: {
    method: 'GET',
    url: '/api/search/candidates',
    query: {
      search: 'Full Stack Developer',
      location: 'Kyiv',
      experienceMin: 3,
      experienceMax: 7,
      skills: ['React', 'Node.js', 'PostgreSQL'],
      education: 'Computer Science',
      isAvailable: true,
      isOpenToWork: true,
      workModes: ['remote', 'hybrid'],
      jobTypes: ['full-time', 'contract'],
      sortBy: 'yearsOfExperience',
      sortOrder: 'DESC',
      page: 1,
      limit: 15
    },
    response: {
      success: true,
      message: 'Candidates search completed successfully',
      data: {
        candidates: [
          {
            id: 'candidate-uuid-2',
            user: {
              id: 'user-uuid-2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com'
            },
            title: 'Full Stack Developer',
            bio: 'Passionate full-stack developer with expertise in modern web technologies...',
            location: 'Kyiv, Ukraine',
            yearsOfExperience: 6,
            skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
            education: 'Bachelor in Computer Science',
            isAvailable: true,
            isOpenToWork: true,
            createdAt: '2024-01-12T11:15:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 15,
        totalPages: 1,
        searchTime: 78,
        filters: {
          search: 'Full Stack Developer',
          location: 'Kyiv',
          experienceMin: 3,
          experienceMax: 7,
          skills: ['React', 'Node.js', 'PostgreSQL'],
          education: 'Computer Science',
          isAvailable: true,
          isOpenToWork: true,
          workModes: ['remote', 'hybrid'],
          jobTypes: ['full-time', 'contract'],
          sortBy: 'yearsOfExperience',
          sortOrder: 'DESC',
          page: 1,
          limit: 15
        }
      }
    }
  },

  // ===== ПОШУК КОМПАНІЙ =====
  
  /**
   * Простий пошук компаній
   */
  searchCompanies: {
    method: 'GET',
    url: '/api/search/companies',
    query: {
      search: 'Tech Company',
      location: 'Kyiv',
      page: 1,
      limit: 20
    },
    response: {
      success: true,
      message: 'Companies search completed successfully',
      data: {
        companies: [
          {
            id: 'company-uuid-1',
            name: 'TechCorp Solutions',
            description: 'Leading technology company specializing in web development...',
            industry: 'Technology',
            location: 'Kyiv, Ukraine',
            website: 'https://techcorp.com',
            size: 'medium',
            employeeCount: 150,
            rating: 4.5,
            isVerified: true,
            isHiring: true,
            skills: ['React', 'Node.js', 'Python', 'AWS'],
            benefits: ['Health Insurance', 'Remote Work', 'Learning Budget'],
            createdAt: '2024-01-05T08:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        searchTime: 38,
        filters: {
          search: 'Tech Company',
          location: 'Kyiv',
          page: 1,
          limit: 20
        }
      }
    }
  },

  /**
   * Розширений пошук компаній з фільтрами
   */
  searchCompaniesAdvanced: {
    method: 'GET',
    url: '/api/search/companies',
    query: {
      search: 'Startup',
      industry: 'Fintech',
      size: 'startup',
      isVerified: true,
      isHiring: true,
      ratingMin: 4.0,
      employeeCountMin: 10,
      employeeCountMax: 100,
      location: 'Remote',
      skills: ['React', 'TypeScript'],
      benefits: ['Remote Work', 'Health Insurance'],
      sortBy: 'rating',
      sortOrder: 'DESC',
      page: 1,
      limit: 10
    },
    response: {
      success: true,
      message: 'Companies search completed successfully',
      data: {
        companies: [
          {
            id: 'company-uuid-2',
            name: 'FinTechStartup',
            description: 'Innovative fintech startup revolutionizing digital payments...',
            industry: 'Fintech',
            location: 'Remote',
            website: 'https://fintechstartup.com',
            size: 'startup',
            employeeCount: 25,
            rating: 4.8,
            isVerified: true,
            isHiring: true,
            skills: ['React', 'TypeScript', 'Node.js', 'Blockchain'],
            benefits: ['Remote Work', 'Health Insurance', 'Equity', 'Flexible Hours'],
            createdAt: '2024-01-08T12:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        searchTime: 61,
        filters: {
          search: 'Startup',
          industry: 'Fintech',
          size: 'startup',
          isVerified: true,
          isHiring: true,
          ratingMin: 4.0,
          employeeCountMin: 10,
          employeeCountMax: 100,
          location: 'Remote',
          skills: ['React', 'TypeScript'],
          benefits: ['Remote Work', 'Health Insurance'],
          sortBy: 'rating',
          sortOrder: 'DESC',
          page: 1,
          limit: 10
        }
      }
    }
  },

  // ===== УНІВЕРСАЛЬНИЙ ПОШУК =====
  
  /**
   * Універсальний пошук (потребує авторизації)
   */
  universalSearch: {
    method: 'GET',
    url: '/api/search/universal',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    query: {
      search: 'React Developer',
      types: ['jobs', 'candidates', 'companies'],
      limit: 10
    },
    response: {
      success: true,
      message: 'Universal search completed successfully',
      data: {
        results: [
          {
            type: 'job',
            data: {
              id: 'job-uuid-1',
              title: 'Senior React Developer',
              description: 'We are looking for an experienced React developer...',
              company: {
                id: 'company-uuid-1',
                name: 'TechCorp'
              },
              location: 'Kyiv, Ukraine',
              relevance: 8.5,
              score: 7.2
            },
            relevance: 8.5,
            score: 7.2
          },
          {
            type: 'candidate',
            data: {
              id: 'candidate-uuid-1',
              user: {
                id: 'user-uuid-1',
                firstName: 'John',
                lastName: 'Doe'
              },
              title: 'Senior React Developer',
              location: 'Lviv, Ukraine',
              relevance: 7.8,
              score: 6.5
            },
            relevance: 7.8,
            score: 6.5
          },
          {
            type: 'company',
            data: {
              id: 'company-uuid-1',
              name: 'TechCorp Solutions',
              description: 'Leading technology company specializing in web development...',
              industry: 'Technology',
              location: 'Kyiv, Ukraine',
              relevance: 6.2,
              score: 5.8
            },
            relevance: 6.2,
            score: 5.8
          }
        ],
        total: 3,
        searchTime: 89,
        suggestions: [],
        filters: {
          search: 'React Developer',
          types: ['jobs', 'candidates', 'companies'],
          limit: 10
        }
      }
    }
  },

  // ===== ДОПОМІЖНІ МЕТОДИ =====
  
  /**
   * Отримання типів пошуку
   */
  getSearchTypes: {
    method: 'GET',
    url: '/api/search/types',
    response: {
      success: true,
      message: 'Search types retrieved successfully',
      data: [
        {
          type: 'jobs',
          name: 'Jobs',
          description: 'Search for job opportunities',
          icon: 'briefcase',
          color: 'blue'
        },
        {
          type: 'candidates',
          name: 'Candidates',
          description: 'Search for job candidates',
          icon: 'user',
          color: 'green'
        },
        {
          type: 'companies',
          name: 'Companies',
          description: 'Search for companies',
          icon: 'building',
          color: 'purple'
        },
        {
          type: 'universal',
          name: 'Universal',
          description: 'Search across all content',
          icon: 'search',
          color: 'orange'
        }
      ]
    }
  },

  /**
   * Отримання полів для пошуку вакансій
   */
  getSearchFieldsJobs: {
    method: 'GET',
    url: '/api/search/fields/jobs',
    response: {
      success: true,
      message: 'Search fields retrieved successfully',
      data: [
        { field: 'title', label: 'Job Title', type: 'text', required: false },
        { field: 'description', label: 'Description', type: 'text', required: false },
        { field: 'company', label: 'Company', type: 'text', required: false },
        { field: 'location', label: 'Location', type: 'text', required: false },
        { field: 'jobType', label: 'Job Type', type: 'select', required: false },
        { field: 'workMode', label: 'Work Mode', type: 'select', required: false },
        { field: 'experienceLevel', label: 'Experience Level', type: 'select', required: false },
        { field: 'salaryMin', label: 'Minimum Salary', type: 'number', required: false },
        { field: 'salaryMax', label: 'Maximum Salary', type: 'number', required: false },
        { field: 'skills', label: 'Skills', type: 'multi_select', required: false }
      ]
    }
  },

  /**
   * Отримання фільтрів для пошуку кандидатів
   */
  getSearchFiltersCandidates: {
    method: 'GET',
    url: '/api/search/filters/candidates',
    response: {
      success: true,
      message: 'Search filters retrieved successfully',
      data: [
        { field: 'firstName', type: 'text', label: 'First Name', required: false },
        { field: 'lastName', type: 'text', label: 'Last Name', required: false },
        { field: 'title', type: 'text', label: 'Job Title', required: false },
        { field: 'location', type: 'text', label: 'Location', required: false },
        { field: 'experienceMin', type: 'range', label: 'Minimum Experience', required: false, min: 0, max: 50 },
        { field: 'experienceMax', type: 'range', label: 'Maximum Experience', required: false, min: 0, max: 50 },
        { field: 'skills', type: 'multi_select', label: 'Skills', required: false },
        { field: 'education', type: 'text', label: 'Education', required: false }
      ]
    }
  },

  /**
   * Отримання пропозицій пошуку (потребує авторизації)
   */
  getSearchSuggestions: {
    method: 'GET',
    url: '/api/search/suggestions',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    query: {
      query: 'React',
      types: ['jobs', 'candidates']
    },
    response: {
      success: true,
      message: 'Search suggestions retrieved successfully',
      data: [
        {
          text: 'React',
          type: 'universal',
          category: 'exact',
          confidence: 1.0
        }
      ]
    }
  },

  /**
   * Отримання статистики пошуку (потребує авторизації)
   */
  getSearchStats: {
    method: 'GET',
    url: '/api/search/stats',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    query: {
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      type: 'jobs'
    },
    response: {
      success: true,
      message: 'Search statistics retrieved successfully',
      data: {
        totalSearches: 0,
        uniqueUsers: 0,
        averageResults: 0,
        averageSearchTime: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        topQueries: [],
        topFilters: [],
        topResults: [],
        searchesByType: [],
        searchesByDate: [],
        popularSearches: [],
        searchTrends: []
      }
    }
  }
};

export default searchExamples;