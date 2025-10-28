/**
 * Приклади використання Candidate API
 * 
 * Candidate API дозволяє пошукати кандидатів, отримувати їх профілі та рекомендації
 */

// Приклад 1: Пошук кандидатів з фільтрами
export const searchCandidatesExample = {
  method: 'GET',
  url: '/api/candidates/search?skills=JavaScript,React&experience=3&location=Remote&remote=true&page=1&limit=10',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 2: Пошук кандидатів з розширеними фільтрами
export const advancedSearchCandidatesExample = {
  method: 'GET',
  url: '/api/candidates/search?skills=JavaScript,TypeScript,React&minExperience=2&maxExperience=5&location=Remote&remote=true&languages=English,Ukrainian&certifications=AWS&availability=immediate&sortBy=rating&sortOrder=DESC&page=1&limit=20',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 3: Отримання профілю кандидата
export const getCandidateProfileExample = {
  method: 'GET',
  url: '/api/candidates/profile/candidate-profile-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 4: Отримання рекомендацій кандидатів для вакансії
export const getRecommendedCandidatesExample = {
  method: 'GET',
  url: '/api/candidates/recommended/job-uuid-here?limit=5',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 5: Отримання статистики пошуку
export const getSearchStatsExample = {
  method: 'GET',
  url: '/api/candidates/stats',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 6: Отримання доступних навичок
export const getAvailableSkillsExample = {
  method: 'GET',
  url: '/api/candidates/skills',
  headers: {}
};

// Приклад 7: Отримання доступних локацій
export const getAvailableLocationsExample = {
  method: 'GET',
  url: '/api/candidates/locations',
  headers: {}
};

// Приклад відповіді API для пошуку кандидатів
export const searchCandidatesResponse = {
  success: true,
  message: 'Candidates search completed successfully',
  data: {
    candidates: [
      {
        id: 'profile-1-uuid',
        title: 'Senior JavaScript Developer',
        summary: 'Experienced full-stack developer with 5+ years of experience',
        bio: 'Passionate developer who loves creating innovative solutions',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'],
        yearsOfExperience: 5,
        location: 'Remote',
        phone: '+380123456789',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        portfolio: 'https://johndoe.dev/portfolio',
        languages: ['English', 'Ukrainian', 'Russian'],
        certifications: ['AWS Certified Developer'],
        education: ['Master of Computer Science - Kyiv Polytechnic Institute'],
        workExperience: [
          'Senior Developer at TechCorp (2020-2024)',
          'Full-stack Developer at StartupXYZ (2018-2020)'
        ],
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Reduced application load time by 40% through optimization'
        ],
        projects: [
          'E-commerce platform with React and Node.js',
          'Real-time chat application with Socket.io'
        ],
        preferences: {
          preferredLocation: 'Remote',
          remoteWork: true,
          salaryExpectation: 5000,
          workType: 'full-time',
          availability: 'immediately'
        },
        rating: 4.5,
        views: 150,
        isActive: true,
        isPublic: true,
        userId: 'user-1-uuid',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'profile-2-uuid',
        title: 'React Developer',
        summary: 'Frontend developer specializing in React and modern JavaScript',
        skills: ['JavaScript', 'React', 'Redux', 'TypeScript', 'CSS', 'HTML'],
        yearsOfExperience: 3,
        location: 'Berlin, Germany',
        rating: 4.2,
        views: 89,
        isActive: true,
        isPublic: true,
        userId: 'user-2-uuid',
        createdAt: '2024-01-14T09:00:00Z',
        updatedAt: '2024-01-14T09:00:00Z'
      }
    ],
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
    filters: {
      skills: ['JavaScript', 'React'],
      experience: 3,
      location: 'Remote',
      remote: true,
      page: 1,
      limit: 10
    }
  }
};

// Приклад відповіді API для отримання профілю кандидата
export const getCandidateProfileResponse = {
  success: true,
  message: 'Candidate profile retrieved successfully',
  data: {
    id: 'profile-uuid-here',
    title: 'Senior JavaScript Developer',
    summary: 'Experienced full-stack developer with 5+ years of experience in JavaScript, React, Node.js, and TypeScript',
    bio: 'Passionate developer who loves creating innovative solutions and working with modern technologies. Always eager to learn and grow in the tech industry.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
    yearsOfExperience: 5,
    location: 'Kyiv, Ukraine',
    phone: '+380123456789',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev/portfolio',
    languages: ['English', 'Ukrainian', 'Russian'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    education: ['Master of Computer Science - Kyiv Polytechnic Institute'],
    workExperience: [
      'Senior Developer at TechCorp (2020-2024)',
      'Full-stack Developer at StartupXYZ (2018-2020)',
      'Junior Developer at WebAgency (2017-2018)'
    ],
    achievements: [
      'Led development of microservices architecture serving 1M+ users',
      'Reduced application load time by 40% through optimization',
      'Mentored 3 junior developers'
    ],
    projects: [
      'E-commerce platform with React and Node.js',
      'Real-time chat application with Socket.io',
      'Task management system with TypeScript'
    ],
    preferences: {
      preferredLocation: 'Kyiv, Ukraine',
      remoteWork: true,
      salaryExpectation: 5000,
      workType: 'full-time',
      availability: 'immediately'
    },
    rating: 4.5,
    views: 151, // Incremented after viewing
    isActive: true,
    isPublic: true,
    userId: 'user-uuid-here',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
};

// Приклад відповіді API для рекомендацій кандидатів
export const getRecommendedCandidatesResponse = {
  success: true,
  message: 'Recommended candidates retrieved successfully',
  data: [
    {
      id: 'profile-1-uuid',
      title: 'Senior JavaScript Developer',
      summary: 'Experienced full-stack developer with 5+ years of experience',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'],
      yearsOfExperience: 5,
      location: 'Kyiv, Ukraine',
      rating: 4.5,
      views: 150,
      isActive: true,
      isPublic: true,
      userId: 'user-1-uuid',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'profile-2-uuid',
      title: 'React Developer',
      summary: 'Frontend developer specializing in React and modern JavaScript',
      skills: ['JavaScript', 'React', 'Redux', 'TypeScript'],
      yearsOfExperience: 3,
      location: 'Lviv, Ukraine',
      rating: 4.2,
      views: 89,
      isActive: true,
      isPublic: true,
      userId: 'user-2-uuid',
      createdAt: '2024-01-14T09:00:00Z',
      updatedAt: '2024-01-14T09:00:00Z'
    }
  ]
};

// Приклад відповіді API для статистики пошуку
export const getSearchStatsResponse = {
  success: true,
  message: 'Search statistics retrieved successfully',
  data: {
    totalCandidates: 150,
    activeCandidates: 120,
    averageRating: 4.2,
    topSkills: [
      { name: 'JavaScript', count: 85 },
      { name: 'React', count: 72 },
      { name: 'TypeScript', count: 68 },
      { name: 'Node.js', count: 55 },
      { name: 'Python', count: 48 },
      { name: 'Vue.js', count: 42 },
      { name: 'Angular', count: 38 },
      { name: 'MongoDB', count: 35 },
      { name: 'PostgreSQL', count: 32 },
      { name: 'Docker', count: 28 }
    ],
    locationDistribution: [
      { location: 'Remote', count: 120 },
      { location: 'New York, USA', count: 85 },
      { location: 'London, UK', count: 72 },
      { location: 'San Francisco, USA', count: 68 },
      { location: 'Berlin, Germany', count: 55 },
      { location: 'Amsterdam, Netherlands', count: 48 },
      { location: 'Toronto, Canada', count: 42 },
      { location: 'Kyiv, Ukraine', count: 38 },
      { location: 'Warsaw, Poland', count: 35 },
      { location: 'Prague, Czech Republic', count: 32 }
    ]
  }
};

// Приклад відповіді API для доступних навичок
export const getAvailableSkillsResponse = {
  success: true,
  message: 'Available skills retrieved successfully',
  data: {
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
      'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
      'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux',
      'Git', 'CI/CD', 'Jenkins', 'GitLab', 'GitHub Actions',
      'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
      'Machine Learning', 'Data Science', 'AI', 'Blockchain',
      'Mobile Development', 'iOS', 'Android', 'React Native', 'Flutter',
      'DevOps', 'Microservices', 'REST API', 'GraphQL', 'WebSocket'
    ],
    total: 50
  }
};

// Приклад відповіді API для доступних локацій
export const getAvailableLocationsResponse = {
  success: true,
  message: 'Available locations retrieved successfully',
  data: {
    locations: [
      { name: 'Remote', count: 3500 },
      { name: 'New York, USA', count: 2800 },
      { name: 'London, UK', count: 2200 },
      { name: 'San Francisco, USA', count: 2100 },
      { name: 'Berlin, Germany', count: 1800 },
      { name: 'Amsterdam, Netherlands', count: 1600 },
      { name: 'Toronto, Canada', count: 1500 },
      { name: 'Kyiv, Ukraine', count: 1250 },
      { name: 'Warsaw, Poland', count: 1200 },
      { name: 'Prague, Czech Republic', count: 1100 },
      { name: 'Vienna, Austria', count: 1000 },
      { name: 'Stockholm, Sweden', count: 950 },
      { name: 'Copenhagen, Denmark', count: 900 },
      { name: 'Zurich, Switzerland', count: 850 },
      { name: 'Dublin, Ireland', count: 800 },
      { name: 'Paris, France', count: 750 },
      { name: 'Madrid, Spain', count: 700 },
      { name: 'Barcelona, Spain', count: 650 },
      { name: 'Milan, Italy', count: 600 },
      { name: 'Rome, Italy', count: 550 },
      { name: 'Lisbon, Portugal', count: 500 },
      { name: 'Brussels, Belgium', count: 450 },
      { name: 'Helsinki, Finland', count: 400 },
      { name: 'Oslo, Norway', count: 350 },
      { name: 'Athens, Greece', count: 250 },
      { name: 'Budapest, Hungary', count: 200 },
      { name: 'Bucharest, Romania', count: 180 },
      { name: 'Sofia, Bulgaria', count: 150 },
      { name: 'Zagreb, Croatia', count: 120 },
      { name: 'Ljubljana, Slovenia', count: 100 },
      { name: 'Bratislava, Slovakia', count: 80 },
      { name: 'Tallinn, Estonia', count: 70 },
      { name: 'Riga, Latvia', count: 60 },
      { name: 'Vilnius, Lithuania', count: 50 }
    ],
    total: 35
  }
};

// Приклад відповіді API для помилки
export const errorResponse = {
  success: false,
  message: 'Candidate profile not found',
  error: 'Candidate profile with the specified ID was not found'
};

// Приклад відповіді API для помилки валідації
export const validationErrorResponse = {
  success: false,
  message: 'Validation error',
  error: 'Invalid query parameters provided'
};
