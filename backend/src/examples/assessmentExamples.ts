/**
 * Приклади використання Assessment API
 * 
 * Assessment API дозволяє створювати, керувати та проходити оцінки для кандидатів
 */

// Приклад 1: Створення нової оцінки
export const createAssessmentExample = {
  method: 'POST',
  url: '/api/assessments',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: {
    title: 'JavaScript Developer Assessment',
    description: 'Comprehensive assessment for JavaScript developers',
    type: 'technical',
    jobId: 'job-uuid-here',
    timeLimit: 60, // 60 minutes
    passingScore: 70, // 70% passing score
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the output of console.log(typeof null)?',
        options: ['object', 'null', 'undefined', 'string'],
        correctAnswer: 'object',
        points: 10
      },
      {
        id: 'q2',
        type: 'code',
        question: 'Write a function that returns the sum of two numbers',
        points: 20
      }
    ],
    expiresAt: '2024-12-31T23:59:59Z'
  }
};

// Приклад 2: Отримання всіх оцінок з фільтрами
export const getAllAssessmentsExample = {
  method: 'GET',
  url: '/api/assessments?type=technical&status=active&limit=10&offset=0',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 3: Отримання оцінки за ID
export const getAssessmentByIdExample = {
  method: 'GET',
  url: '/api/assessments/assessment-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 4: Оновлення оцінки
export const updateAssessmentExample = {
  method: 'PUT',
  url: '/api/assessments/assessment-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: {
    title: 'Updated JavaScript Developer Assessment',
    description: 'Updated comprehensive assessment for JavaScript developers',
    timeLimit: 90, // Increased to 90 minutes
    passingScore: 75, // Increased to 75%
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Vue.js']
  }
};

// Приклад 5: Початок проходження оцінки
export const startAssessmentExample = {
  method: 'PATCH',
  url: '/api/assessments/assessment-uuid-here/start',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 6: Завершення оцінки з відповідями
export const completeAssessmentExample = {
  method: 'PATCH',
  url: '/api/assessments/assessment-uuid-here/complete',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: {
    answers: [
      {
        questionId: 'q1',
        answer: 'object',
        timeSpent: 30 // seconds
      },
      {
        questionId: 'q2',
        answer: 'function sum(a, b) { return a + b; }',
        timeSpent: 120 // seconds
      }
    ],
    score: 30, // total points earned
    percentage: 100 // percentage score
  }
};

// Приклад 7: Отримання оцінок користувача
export const getUserAssessmentsExample = {
  method: 'GET',
  url: '/api/assessments/user/my-assessments?page=1&limit=10',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 8: Отримання оцінок для конкретної вакансії
export const getJobAssessmentsExample = {
  method: 'GET',
  url: '/api/assessments/job/job-uuid-here?page=1&limit=10',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 9: Отримання статистики оцінок
export const getAssessmentStatsExample = {
  method: 'GET',
  url: '/api/assessments/stats',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад 10: Видалення оцінки
export const deleteAssessmentExample = {
  method: 'DELETE',
  url: '/api/assessments/assessment-uuid-here',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад відповіді API для створення оцінки
export const createAssessmentResponse = {
  success: true,
  message: 'Assessment created successfully',
  data: {
    id: 'assessment-uuid-here',
    title: 'JavaScript Developer Assessment',
    description: 'Comprehensive assessment for JavaScript developers',
    type: 'technical',
    jobId: 'job-uuid-here',
    userId: 'user-uuid-here',
    timeLimit: 60,
    passingScore: 70,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the output of console.log(typeof null)?',
        options: ['object', 'null', 'undefined', 'string'],
        points: 10
      },
      {
        id: 'q2',
        type: 'code',
        question: 'Write a function that returns the sum of two numbers',
        points: 20
      }
    ],
    isActive: true,
    startedAt: null,
    completedAt: null,
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
};

// Приклад відповіді API для отримання всіх оцінок
export const getAllAssessmentsResponse = {
  success: true,
  message: 'Assessments retrieved successfully',
  data: {
    assessments: [
      {
        id: 'assessment-1-uuid',
        title: 'JavaScript Developer Assessment',
        description: 'Comprehensive assessment for JavaScript developers',
        type: 'technical',
        jobId: 'job-1-uuid',
        userId: 'user-1-uuid',
        timeLimit: 60,
        passingScore: 70,
        skills: ['JavaScript', 'React', 'Node.js'],
        isActive: true,
        startedAt: null,
        completedAt: null,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'assessment-2-uuid',
        title: 'Python Developer Assessment',
        description: 'Assessment for Python developers',
        type: 'technical',
        jobId: 'job-2-uuid',
        userId: 'user-2-uuid',
        timeLimit: 45,
        passingScore: 75,
        skills: ['Python', 'Django', 'Flask'],
        isActive: true,
        startedAt: '2024-01-15T11:00:00Z',
        completedAt: '2024-01-15T11:45:00Z',
        score: 85,
        percentage: 85,
        isPassed: true,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T11:45:00Z'
      }
    ],
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1
  }
};

// Приклад відповіді API для завершення оцінки
export const completeAssessmentResponse = {
  success: true,
  message: 'Assessment completed successfully',
  data: {
    id: 'assessment-uuid-here',
    title: 'JavaScript Developer Assessment',
    description: 'Comprehensive assessment for JavaScript developers',
    type: 'technical',
    jobId: 'job-uuid-here',
    userId: 'user-uuid-here',
    timeLimit: 60,
    passingScore: 70,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the output of console.log(typeof null)?',
        options: ['object', 'null', 'undefined', 'string'],
        points: 10
      },
      {
        id: 'q2',
        type: 'code',
        question: 'Write a function that returns the sum of two numbers',
        points: 20
      }
    ],
    answers: [
      {
        questionId: 'q1',
        answer: 'object',
        timeSpent: 30
      },
      {
        questionId: 'q2',
        answer: 'function sum(a, b) { return a + b; }',
        timeSpent: 120
      }
    ],
    score: 30,
    percentage: 100,
    isPassed: true,
    isActive: true,
    startedAt: '2024-01-15T10:00:00Z',
    completedAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
};

// Приклад відповіді API для статистики оцінок
export const getAssessmentStatsResponse = {
  success: true,
  message: 'Assessment statistics retrieved successfully',
  data: {
    total: 150,
    active: 45,
    completed: 105,
    passed: 78,
    failed: 27
  }
};

// Приклад відповіді API для оцінок користувача
export const getUserAssessmentsResponse = {
  success: true,
  message: 'User assessments retrieved successfully',
  data: {
    assessments: [
      {
        id: 'assessment-1-uuid',
        title: 'JavaScript Developer Assessment',
        description: 'Comprehensive assessment for JavaScript developers',
        type: 'technical',
        jobId: 'job-1-uuid',
        timeLimit: 60,
        passingScore: 70,
        skills: ['JavaScript', 'React', 'Node.js'],
        isActive: true,
        startedAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-01-15T10:30:00Z',
        score: 85,
        percentage: 85,
        isPassed: true,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1
  }
};

// Приклад відповіді API для оцінок вакансії
export const getJobAssessmentsResponse = {
  success: true,
  message: 'Job assessments retrieved successfully',
  data: {
    assessments: [
      {
        id: 'assessment-1-uuid',
        title: 'JavaScript Developer Assessment',
        description: 'Comprehensive assessment for JavaScript developers',
        type: 'technical',
        userId: 'user-1-uuid',
        timeLimit: 60,
        passingScore: 70,
        skills: ['JavaScript', 'React', 'Node.js'],
        isActive: true,
        startedAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-01-15T10:30:00Z',
        score: 85,
        percentage: 85,
        isPassed: true,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1
  }
};

// Приклад відповіді API для початку оцінки
export const startAssessmentResponse = {
  success: true,
  message: 'Assessment started successfully',
  data: {
    id: 'assessment-uuid-here',
    title: 'JavaScript Developer Assessment',
    description: 'Comprehensive assessment for JavaScript developers',
    type: 'technical',
    jobId: 'job-uuid-here',
    userId: 'user-uuid-here',
    timeLimit: 60,
    passingScore: 70,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the output of console.log(typeof null)?',
        options: ['object', 'null', 'undefined', 'string'],
        points: 10
      },
      {
        id: 'q2',
        type: 'code',
        question: 'Write a function that returns the sum of two numbers',
        points: 20
      }
    ],
    isActive: true,
    startedAt: '2024-01-15T10:00:00Z',
    completedAt: null,
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
};

// Приклад відповіді API для оновлення оцінки
export const updateAssessmentResponse = {
  success: true,
  message: 'Assessment updated successfully',
  data: {
    id: 'assessment-uuid-here',
    title: 'Updated JavaScript Developer Assessment',
    description: 'Updated comprehensive assessment for JavaScript developers',
    type: 'technical',
    jobId: 'job-uuid-here',
    userId: 'user-uuid-here',
    timeLimit: 90,
    passingScore: 75,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Vue.js'],
    isActive: true,
    startedAt: null,
    completedAt: null,
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
};

// Приклад відповіді API для видалення оцінки
export const deleteAssessmentResponse = {
  success: true,
  message: 'Assessment deleted successfully'
};

// Приклад відповіді API для помилки
export const errorResponse = {
  success: false,
  message: 'Assessment not found',
  error: 'Assessment with the specified ID was not found'
};


