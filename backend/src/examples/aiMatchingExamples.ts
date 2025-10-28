/**
 * Приклади використання AI Matching API з підтримкою всіх 8 мов
 * 
 * Підтримувані мови:
 * - en (English)
 * - pt (Portuguese) 
 * - fr (French)
 * - uk (Ukrainian)
 * - ru (Russian)
 * - de (German)
 * - pl (Polish)
 * - cs (Czech)
 */

// Приклад 1: Отримання рекомендацій для кандидата українською мовою
export const getRecommendationsUkrainian = {
  method: 'GET',
  url: '/api/ai-matching/recommendations',
  query: {
    candidateId: 'candidate-uuid-here',
    language: 'uk',
    minMatchScore: 70,
    limit: 10
  },
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Accept-Language': 'uk'
  }
};

// Приклад 2: Генерація рекомендацій для вакансії німецькою мовою
export const generateRecommendationsGerman = {
  method: 'POST',
  url: '/api/ai-matching/generate',
  body: {
    jobId: 'job-uuid-here',
    language: 'de',
    limit: 15
  },
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json',
    'Accept-Language': 'de'
  }
};

// Приклад 3: Масове генерування рекомендацій французькою мовою
export const bulkGenerateRecommendationsFrench = {
  method: 'POST',
  url: '/api/ai-matching/bulk-generate',
  body: {
    candidateIds: ['candidate-1-uuid', 'candidate-2-uuid'],
    language: 'fr',
    limit: 20
  },
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json',
    'Accept-Language': 'fr'
  }
};

// Приклад 4: Оновлення рекомендації з відгуком польською мовою
export const updateRecommendationPolish = {
  method: 'PUT',
  url: '/api/ai-matching/recommendations/recommendation-uuid-here',
  body: {
    isViewed: true,
    isContacted: false,
    feedbackRating: 4,
    feedbackComment: 'Dobra rekomendacja, ale brakuje niektórych umiejętności'
  },
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json',
    'Accept-Language': 'pl'
  }
};

// Приклад 5: Отримання статистики чеською мовою
export const getStatsCzech = {
  method: 'GET',
  url: '/api/ai-matching/stats',
  query: {
    language: 'cs',
    period: 'last_30_days'
  },
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Accept-Language': 'cs'
  }
};

// Приклад 6: Пошук рекомендацій португальською мовою
export const searchRecommendationsPortuguese = {
  method: 'GET',
  url: '/api/ai-matching/recommendations',
  query: {
    search: 'desenvolvedor',
    location: 'São Paulo',
    skills: ['JavaScript', 'React', 'Node.js'],
    language: 'pt',
    minMatchScore: 80
  },
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Accept-Language': 'pt'
  }
};

// Приклад 7: Перевірка здоров'я AI сервісу російською мовою
export const checkAIHealthRussian = {
  method: 'GET',
  url: '/api/ai-matching/ai-health',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Accept-Language': 'ru'
  }
};

// Приклад 8: Отримання підтримуваних мов
export const getSupportedLanguages = {
  method: 'GET',
  url: '/api/ai-matching/languages',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
};

// Приклад відповіді API для української мови
export const exampleUkrainianResponse = {
  success: true,
  message: 'Рекомендації успішно отримано',
  data: {
    recommendations: [
      {
        id: 'rec-1',
        type: 'job_recommendation',
        matchScore: 85,
        matchScoreCategory: 'good',
        skillsMatch: {
          matched: ['JavaScript', 'React', 'TypeScript'],
          missing: ['Node.js'],
          score: 80
        },
        experienceMatch: {
          required: '3-5 років',
          candidate: '4 роки',
          score: 90
        },
        locationMatch: {
          required: 'Київ',
          candidate: 'Київ',
          score: 100
        },
        salaryMatch: {
          required: { min: 3000, max: 5000 },
          candidate: { min: 3500, max: 4500 },
          score: 85
        },
        aiReason: 'Відмінний матч по навичках та досвіду. Локація ідеально підходить. Зарплатні очікування відповідають пропозиції.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.85,
          processingTime: 245,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ],
    stats: {
      totalMatches: 150,
      highQualityMatches: 45,
      averageMatchScore: 78.5,
      candidatesMatched: 25,
      jobsMatched: 12,
      lastUpdated: '2024-01-15T10:30:00Z',
      aiAccuracy: 94.5,
      processingTime: 245
    },
    pagination: {
      total: 1,
      limit: 10,
      offset: 0,
      hasMore: false
    },
    filters: {
      candidateId: 'candidate-uuid-here',
      language: 'uk',
      minMatchScore: 70,
      limit: 10
    }
  }
};

// Приклад відповіді API для німецької мови
export const exampleGermanResponse = {
  success: true,
  message: 'Empfehlungen erfolgreich generiert',
  data: {
    recommendations: [
      {
        id: 'rec-2',
        type: 'job_recommendation',
        matchScore: 92,
        matchScoreCategory: 'excellent',
        skillsMatch: {
          matched: ['Python', 'Django', 'PostgreSQL'],
          missing: ['Docker'],
          score: 90
        },
        experienceMatch: {
          required: '5-7 Jahre',
          candidate: '6 Jahre',
          score: 95
        },
        locationMatch: {
          required: 'Berlin',
          candidate: 'Berlin',
          score: 100
        },
        salaryMatch: {
          required: { min: 5000, max: 7000 },
          candidate: { min: 5500, max: 6500 },
          score: 90
        },
        aiReason: 'Hervorragende Übereinstimmung in Fähigkeiten und Erfahrung. Standort ist perfekt. Gehaltserwartungen entsprechen dem Angebot.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.92,
          processingTime: 198,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T10:35:00Z',
        updatedAt: '2024-01-15T10:35:00Z'
      }
    ]
  }
};

// Приклад відповіді API для французької мови
export const exampleFrenchResponse = {
  success: true,
  message: 'Recommandations générées avec succès',
  data: {
    recommendations: [
      {
        id: 'rec-3',
        type: 'job_recommendation',
        matchScore: 78,
        matchScoreCategory: 'good',
        skillsMatch: {
          matched: ['Java', 'Spring Boot', 'MySQL'],
          missing: ['Kubernetes', 'Docker'],
          score: 75
        },
        experienceMatch: {
          required: '2-4 ans',
          candidate: '3 ans',
          score: 85
        },
        locationMatch: {
          required: 'Paris',
          candidate: 'Paris',
          score: 100
        },
        salaryMatch: {
          required: { min: 4000, max: 6000 },
          candidate: { min: 4500, max: 5500 },
          score: 80
        },
        aiReason: 'Bonne correspondance en compétences et expérience. Localisation parfaite. Les attentes salariales correspondent à l\'offre.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.78,
          processingTime: 312,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T10:40:00Z',
        updatedAt: '2024-01-15T10:40:00Z'
      }
    ]
  }
};

// Приклад відповіді API для польської мови
export const examplePolishResponse = {
  success: true,
  message: 'Rekomendacje wygenerowane pomyślnie',
  data: {
    recommendations: [
      {
        id: 'rec-4',
        type: 'job_recommendation',
        matchScore: 88,
        matchScoreCategory: 'good',
        skillsMatch: {
          matched: ['C#', '.NET', 'SQL Server'],
          missing: ['Azure'],
          score: 85
        },
        experienceMatch: {
          required: '4-6 lat',
          candidate: '5 lat',
          score: 90
        },
        locationMatch: {
          required: 'Warszawa',
          candidate: 'Warszawa',
          score: 100
        },
        salaryMatch: {
          required: { min: 6000, max: 8000 },
          candidate: { min: 6500, max: 7500 },
          score: 85
        },
        aiReason: 'Doskonałe dopasowanie umiejętności i doświadczenia. Lokalizacja idealna. Oczekiwania płacowe odpowiadają ofercie.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.88,
          processingTime: 267,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T10:45:00Z',
        updatedAt: '2024-01-15T10:45:00Z'
      }
    ]
  }
};

// Приклад відповіді API для чеської мови
export const exampleCzechResponse = {
  success: true,
  message: 'Doporučení úspěšně vygenerována',
  data: {
    recommendations: [
      {
        id: 'rec-5',
        type: 'job_recommendation',
        matchScore: 82,
        matchScoreCategory: 'good',
        skillsMatch: {
          matched: ['PHP', 'Laravel', 'MySQL'],
          missing: ['Redis', 'Elasticsearch'],
          score: 80
        },
        experienceMatch: {
          required: '3-5 let',
          candidate: '4 roky',
          score: 85
        },
        locationMatch: {
          required: 'Praha',
          candidate: 'Praha',
          score: 100
        },
        salaryMatch: {
          required: { min: 4500, max: 6500 },
          candidate: { min: 5000, max: 6000 },
          score: 82
        },
        aiReason: 'Výborná shoda v dovednostech a zkušenostech. Lokalita je ideální. Platové očekávání odpovídá nabídce.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.82,
          processingTime: 289,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T10:50:00Z',
        updatedAt: '2024-01-15T10:50:00Z'
      }
    ]
  }
};

// Приклад відповіді API для португальської мови
export const examplePortugueseResponse = {
  success: true,
  message: 'Recomendações geradas com sucesso',
  data: {
    recommendations: [
      {
        id: 'rec-6',
        type: 'job_recommendation',
        matchScore: 90,
        matchScoreCategory: 'excellent',
        skillsMatch: {
          matched: ['React', 'Node.js', 'MongoDB'],
          missing: ['GraphQL'],
          score: 88
        },
        experienceMatch: {
          required: '2-4 anos',
          candidate: '3 anos',
          score: 90
        },
        locationMatch: {
          required: 'São Paulo',
          candidate: 'São Paulo',
          score: 100
        },
        salaryMatch: {
          required: { min: 3000, max: 5000 },
          candidate: { min: 3500, max: 4500 },
          score: 85
        },
        aiReason: 'Excelente correspondência em habilidades e experiência. Localização perfeita. Expectativas salariais correspondem à oferta.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.90,
          processingTime: 234,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T10:55:00Z',
        updatedAt: '2024-01-15T10:55:00Z'
      }
    ]
  }
};

// Приклад відповіді API для російської мови
export const exampleRussianResponse = {
  success: true,
  message: 'Рекомендации успешно сгенерированы',
  data: {
    recommendations: [
      {
        id: 'rec-7',
        type: 'job_recommendation',
        matchScore: 86,
        matchScoreCategory: 'good',
        skillsMatch: {
          matched: ['Python', 'Django', 'PostgreSQL'],
          missing: ['Celery', 'Redis'],
          score: 82
        },
        experienceMatch: {
          required: '3-5 лет',
          candidate: '4 года',
          score: 88
        },
        locationMatch: {
          required: 'Москва',
          candidate: 'Москва',
          score: 100
        },
        salaryMatch: {
          required: { min: 80000, max: 120000 },
          candidate: { min: 90000, max: 110000 },
          score: 85
        },
        aiReason: 'Отличное соответствие навыков и опыта. Локация идеальна. Зарплатные ожидания соответствуют предложению.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.86,
          processingTime: 256,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      }
    ]
  }
};

// Приклад відповіді API для англійської мови
export const exampleEnglishResponse = {
  success: true,
  message: 'Recommendations generated successfully',
  data: {
    recommendations: [
      {
        id: 'rec-8',
        type: 'job_recommendation',
        matchScore: 94,
        matchScoreCategory: 'excellent',
        skillsMatch: {
          matched: ['TypeScript', 'React', 'Node.js', 'AWS'],
          missing: ['Docker'],
          score: 92
        },
        experienceMatch: {
          required: '5-7 years',
          candidate: '6 years',
          score: 95
        },
        locationMatch: {
          required: 'Remote',
          candidate: 'Remote',
          score: 100
        },
        salaryMatch: {
          required: { min: 8000, max: 12000 },
          candidate: { min: 9000, max: 11000 },
          score: 90
        },
        aiReason: 'Excellent match in skills and experience. Location is perfect. Salary expectations align with the offer.',
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: 0.94,
          processingTime: 189,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false,
        createdAt: '2024-01-15T11:05:00Z',
        updatedAt: '2024-01-15T11:05:00Z'
      }
    ]
  }
};


