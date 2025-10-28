/**
 * Приклади використання Documents API
 */

export const docsExamples = {
  // Завантаження документа
  uploadDocument: {
    method: 'POST',
    url: '/api/docs/upload',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'multipart/form-data'
    },
    body: {
      file: '<file>', // Файл для завантаження
      type: 'resume',
      description: 'Мій резюме для пошуку роботи',
      tags: ['frontend', 'react', 'typescript'],
      isPublic: false
    },
    response: {
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: 'uuid',
        originalName: 'resume.pdf',
        fileName: 'uuid.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        r2Key: 'documents/userId/resume/uuid.pdf',
        r2Url: 'https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf',
        type: 'resume',
        status: 'ready',
        description: 'Мій резюме для пошуку роботи',
        tags: ['frontend', 'react', 'typescript'],
        isActive: true,
        isPublic: false,
        downloadCount: 0,
        viewCount: 0,
        userId: 'user-uuid',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        uploadedAt: '2024-01-01T00:00:00.000Z',
        processedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  // Отримання документа за ID
  getDocumentById: {
    method: 'GET',
    url: '/api/docs/uuid',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Document retrieved successfully',
      data: {
        id: 'uuid',
        originalName: 'resume.pdf',
        fileName: 'uuid.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        r2Key: 'documents/userId/resume/uuid.pdf',
        r2Url: 'https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf',
        type: 'resume',
        status: 'ready',
        description: 'Мій резюме для пошуку роботи',
        tags: ['frontend', 'react', 'typescript'],
        isActive: true,
        isPublic: false,
        downloadCount: 5,
        viewCount: 12,
        user: {
          id: 'user-uuid',
          firstName: 'Іван',
          lastName: 'Петренко',
          email: 'ivan@example.com'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        uploadedAt: '2024-01-01T00:00:00.000Z',
        processedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  // Оновлення документа
  updateDocument: {
    method: 'PUT',
    url: '/api/docs/uuid',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      description: 'Оновлений опис резюме',
      tags: ['frontend', 'react', 'typescript', 'nextjs'],
      isPublic: true,
      type: 'resume'
    },
    response: {
      success: true,
      message: 'Document updated successfully',
      data: {
        id: 'uuid',
        originalName: 'resume.pdf',
        fileName: 'uuid.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        r2Key: 'documents/userId/resume/uuid.pdf',
        r2Url: 'https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf',
        type: 'resume',
        status: 'ready',
        description: 'Оновлений опис резюме',
        tags: ['frontend', 'react', 'typescript', 'nextjs'],
        isActive: true,
        isPublic: true,
        downloadCount: 5,
        viewCount: 12,
        userId: 'user-uuid',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        uploadedAt: '2024-01-01T00:00:00.000Z',
        processedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  // Пошук документів
  searchDocuments: {
    method: 'GET',
    url: '/api/docs/search?search=resume&type=resume&page=1&limit=20',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Documents search completed successfully',
      data: {
        documents: [
          {
            id: 'uuid1',
            originalName: 'resume.pdf',
            fileName: 'uuid1.pdf',
            mimeType: 'application/pdf',
            size: 1024000,
            type: 'resume',
            status: 'ready',
            description: 'Мій резюме',
            tags: ['frontend', 'react'],
            isActive: true,
            isPublic: true,
            downloadCount: 5,
            viewCount: 12,
            user: {
              id: 'user-uuid',
              firstName: 'Іван',
              lastName: 'Петренко'
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  // Отримання документів користувача
  getUserDocuments: {
    method: 'GET',
    url: '/api/docs/my-documents?page=1&limit=20',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'User documents retrieved successfully',
      data: {
        documents: [
          {
            id: 'uuid1',
            originalName: 'resume.pdf',
            fileName: 'uuid1.pdf',
            mimeType: 'application/pdf',
            size: 1024000,
            type: 'resume',
            status: 'ready',
            description: 'Мій резюме',
            tags: ['frontend', 'react'],
            isActive: true,
            isPublic: false,
            downloadCount: 0,
            viewCount: 0,
            userId: 'user-uuid',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  // Статистика документів
  getDocumentStats: {
    method: 'GET',
    url: '/api/docs/stats?userId=user-uuid&dateFrom=2024-01-01&dateTo=2024-12-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Document statistics retrieved successfully',
      data: {
        totalDocuments: 15,
        documentsByType: {
          resume: 5,
          cover_letter: 3,
          portfolio: 2,
          certificate: 4,
          other: 1
        },
        documentsByStatus: {
          uploading: 0,
          processing: 0,
          ready: 15,
          error: 0,
          deleted: 0
        },
        totalSize: 52428800, // 50MB
        averageSize: 3495253, // ~3.3MB
        recentUploads: 3
      }
    }
  },

  // Отримання URL для завантаження
  getDownloadUrl: {
    method: 'GET',
    url: '/api/docs/uuid/download',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Download URL generated successfully',
      data: {
        downloadUrl: 'https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf?X-Amz-Algorithm=...'
      }
    }
  },

  // Оновлення метаданих документа
  updateDocumentMetadata: {
    method: 'PUT',
    url: '/api/docs/uuid/metadata',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Senior Frontend Developer Resume',
      author: 'Іван Петренко',
      subject: 'Frontend Development',
      keywords: 'React, TypeScript, Next.js, Frontend',
      creator: 'Microsoft Word',
      language: 'uk',
      pageCount: 2
    },
    response: {
      success: true,
      message: 'Document metadata updated successfully',
      data: {
        id: 'uuid',
        originalName: 'resume.pdf',
        fileName: 'uuid.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        type: 'resume',
        status: 'ready',
        description: 'Мій резюме',
        tags: ['frontend', 'react'],
        isActive: true,
        isPublic: false,
        metadata: {
          title: 'Senior Frontend Developer Resume',
          author: 'Іван Петренко',
          subject: 'Frontend Development',
          keywords: 'React, TypeScript, Next.js, Frontend',
          creator: 'Microsoft Word',
          language: 'uk',
          pageCount: 2
        },
        userId: 'user-uuid',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  // Отримання публічних документів
  getPublicDocuments: {
    method: 'GET',
    url: '/api/docs/public?page=1&limit=20',
    response: {
      success: true,
      message: 'Public documents retrieved successfully',
      data: {
        documents: [
          {
            id: 'uuid1',
            originalName: 'portfolio.pdf',
            fileName: 'uuid1.pdf',
            mimeType: 'application/pdf',
            size: 2048000,
            type: 'portfolio',
            status: 'ready',
            description: 'Портфоліо робіт',
            tags: ['design', 'ui', 'ux'],
            isActive: true,
            isPublic: true,
            downloadCount: 25,
            viewCount: 150,
            user: {
              id: 'user-uuid',
              firstName: 'Марія',
              lastName: 'Іваненко'
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  // Видалення документа
  deleteDocument: {
    method: 'DELETE',
    url: '/api/docs/uuid',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Document deleted successfully'
    }
  }
};

export default docsExamples;


