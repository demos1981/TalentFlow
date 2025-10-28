/**
 * Приклади використання Candidate Profile API
 * 
 * Candidate Profile API дозволяє створювати, керувати та пошукати профілі кандидатів
 */

// Приклад 1: Створення профілю кандидата
export const createCandidateProfileExample = {
  method: 'POST',
  url: '/api/candidate-profiles',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: {
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
    preferences: {
      preferredLocation: 'Kyiv, Ukraine',
      remoteWork: true,
      salaryExpectation: 5000,
      workType: 'full-time',
      availability: 'immediately'
    },
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
    isPublic: true
  }
};

// Приклад 2: Отримання всіх профілів кандидатів з фільтрами
export const getAllCandidateProfilesExample = {
  method: 'GET',
  url: '/api/candidate-profiles?skills=JavaScript,React&experience=3&location=Kyiv&remoteWork=true&page=1&limit=10',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 3: Пошук профілів кандидатів
export const searchCandidateProfilesExample = {
  method: 'GET',
  url: '/api/candidate-profiles/search?search=JavaScript developer&skills=React,Node.js&minRating=4&page=1&limit=20',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 4: Отримання профілю кандидата за ID користувача
export const getCandidateProfileExample = {
  method: 'GET',
  url: '/api/candidate-profiles/user-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 5: Оновлення профілю кандидата
export const updateCandidateProfileExample = {
  method: 'PUT',
  url: '/api/candidate-profiles/user-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: {
    title: 'Lead JavaScript Developer',
    summary: 'Experienced full-stack developer with 6+ years of experience in JavaScript, React, Node.js, and TypeScript. Team lead with strong leadership skills.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'Leadership'],
    yearsOfExperience: 6,
    achievements: [
      'Led development of microservices architecture serving 1M+ users',
      'Reduced application load time by 40% through optimization',
      'Mentored 5 junior developers',
      'Led a team of 8 developers'
    ]
  }
};

// Приклад 6: Збільшення кількості переглядів профілю
export const incrementProfileViewsExample = {
  method: 'PATCH',
  url: '/api/candidate-profiles/user-uuid-here/views',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 7: Оновлення рейтингу профілю
export const updateProfileRatingExample = {
  method: 'PATCH',
  url: '/api/candidate-profiles/user-uuid-here/rating',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: {
    rating: 4.5
  }
};

// Приклад 8: Отримання статистики профілів
export const getProfileStatsExample = {
  method: 'GET',
  url: '/api/candidate-profiles/stats',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 9: Видалення профілю кандидата
export const deleteCandidateProfileExample = {
  method: 'DELETE',
  url: '/api/candidate-profiles/user-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад відповіді API для створення профілю
export const createCandidateProfileResponse = {
  success: true,
  message: 'Candidate profile created successfully',
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
    preferences: {
      preferredLocation: 'Kyiv, Ukraine',
      remoteWork: true,
      salaryExpectation: 5000,
      workType: 'full-time',
      availability: 'immediately'
    },
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
    rating: 0,
    views: 0,
    isActive: true,
    isPublic: true,
    userId: 'user-uuid-here',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
};

// Приклад відповіді API для отримання всіх профілів
export const getAllCandidateProfilesResponse = {
  success: true,
  message: 'Candidate profiles retrieved successfully',
  data: {
    profiles: [
      {
        id: 'profile-1-uuid',
        title: 'Senior JavaScript Developer',
        summary: 'Experienced full-stack developer with 5+ years of experience',
        skills: ['JavaScript', 'React', 'Node.js'],
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
        title: 'Python Developer',
        summary: 'Backend developer specializing in Python and Django',
        skills: ['Python', 'Django', 'PostgreSQL'],
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
    ],
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1
  }
};

// Приклад відповіді API для пошуку профілів
export const searchCandidateProfilesResponse = {
  success: true,
  message: 'Candidate profiles search completed successfully',
  data: {
    profiles: [
      {
        id: 'profile-1-uuid',
        title: 'Senior JavaScript Developer',
        summary: 'Experienced full-stack developer with 5+ years of experience',
        skills: ['JavaScript', 'React', 'Node.js'],
        yearsOfExperience: 5,
        location: 'Kyiv, Ukraine',
        rating: 4.5,
        views: 150,
        isActive: true,
        isPublic: true,
        userId: 'user-1-uuid',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ],
    total: 1
  }
};

// Приклад відповіді API для отримання профілю
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
    preferences: {
      preferredLocation: 'Kyiv, Ukraine',
      remoteWork: true,
      salaryExpectation: 5000,
      workType: 'full-time',
      availability: 'immediately'
    },
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
    rating: 4.5,
    views: 150,
    isActive: true,
    isPublic: true,
    userId: 'user-uuid-here',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
};

// Приклад відповіді API для оновлення профілю
export const updateCandidateProfileResponse = {
  success: true,
  message: 'Candidate profile updated successfully',
  data: {
    id: 'profile-uuid-here',
    title: 'Lead JavaScript Developer',
    summary: 'Experienced full-stack developer with 6+ years of experience in JavaScript, React, Node.js, and TypeScript. Team lead with strong leadership skills.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'Leadership'],
    yearsOfExperience: 6,
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
    preferences: {
      preferredLocation: 'Kyiv, Ukraine',
      remoteWork: true,
      salaryExpectation: 5000,
      workType: 'full-time',
      availability: 'immediately'
    },
    achievements: [
      'Led development of microservices architecture serving 1M+ users',
      'Reduced application load time by 40% through optimization',
      'Mentored 5 junior developers',
      'Led a team of 8 developers'
    ],
    projects: [
      'E-commerce platform with React and Node.js',
      'Real-time chat application with Socket.io',
      'Task management system with TypeScript'
    ],
    rating: 4.5,
    views: 150,
    isActive: true,
    isPublic: true,
    userId: 'user-uuid-here',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
};

// Приклад відповіді API для збільшення переглядів
export const incrementProfileViewsResponse = {
  success: true,
  message: 'Profile views incremented successfully'
};

// Приклад відповіді API для оновлення рейтингу
export const updateProfileRatingResponse = {
  success: true,
  message: 'Profile rating updated successfully'
};

// Приклад відповіді API для статистики профілів
export const getProfileStatsResponse = {
  success: true,
  message: 'Profile statistics retrieved successfully',
  data: {
    total: 150,
    withSkills: 120,
    withExperience: 100,
    withPortfolio: 80,
    averageRating: 4.2
  }
};

// Приклад відповіді API для видалення профілю
export const deleteCandidateProfileResponse = {
  success: true,
  message: 'Candidate profile deleted successfully'
};

// Приклад відповіді API для помилки
export const errorResponse = {
  success: false,
  message: 'Candidate profile not found',
  error: 'Candidate profile with the specified user ID was not found'
};


