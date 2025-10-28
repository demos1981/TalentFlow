/**
 * Приклади використання уніфікованого File API
 */

export const fileExamples = {
  // Завантаження файлу через multer
  uploadFile: {
    method: 'POST',
    url: '/api/files/upload',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'multipart/form-data'
    },
    body: {
      file: '<file-buffer>',
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024000,
      type: 'pdf',
      category: 'resume',
      description: 'Моє резюме',
      tags: ['resume', 'pdf', 'job'],
      isPublic: false,
      folder: 'documents',
      metadata: {
        version: '1.0',
        language: 'uk'
      }
    },
    response: {
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: 'file-uuid',
        fileName: 'resume.pdf',
        originalName: 'resume.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024000,
        r2Key: 'resume/documents/2024-01-15/file-uuid.pdf',
        r2Url: 'https://r2.example.com/resume/documents/2024-01-15/file-uuid.pdf',
        type: 'pdf',
        category: 'resume',
        status: 'ready',
        description: 'Моє резюме',
        tags: ['resume', 'pdf', 'job'],
        isPublic: false,
        folder: 'documents',
        downloadCount: 0,
        isActive: true,
        metadata: {
          version: '1.0',
          language: 'uk'
        },
        uploadedBy: {
          id: 'user-uuid',
          firstName: 'Іван',
          lastName: 'Петренко'
        },
        uploadDate: '2024-01-15T10:00:00.000Z',
        lastModified: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Отримання pre-signed URL для завантаження
  getUploadUrl: {
    method: 'POST',
    url: '/api/files/upload-url',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      fileName: 'portfolio.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048000,
      type: 'pdf',
      category: 'portfolio',
      description: 'Мій портфоліо',
      tags: ['portfolio', 'pdf', 'work'],
      isPublic: true,
      folder: 'portfolio'
    },
    response: {
      success: true,
      message: 'Upload URL generated successfully',
      data: {
        uploadUrl: 'https://r2.example.com/upload-url?signature=...',
        fileId: 'file-uuid',
        key: 'portfolio/portfolio/2024-01-15/file-uuid.pdf',
        expiresIn: 3600
      }
    }
  },

  // Підтвердження завантаження
  confirmUpload: {
    method: 'PUT',
    url: '/api/files/file-uuid/confirm',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'File upload confirmed successfully',
      data: {
        id: 'file-uuid',
        status: 'ready',
        lastModified: '2024-01-15T10:05:00.000Z'
      }
    }
  },

  // Отримання всіх файлів користувача
  getAllFiles: {
    method: 'GET',
    url: '/api/files/my-files?page=1&limit=20&type=pdf&category=resume',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Files retrieved successfully',
      data: {
        files: [
          {
            id: 'file-uuid-1',
            fileName: 'resume.pdf',
            originalName: 'resume.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024000,
            type: 'pdf',
            category: 'resume',
            status: 'ready',
            description: 'Моє резюме',
            tags: ['resume', 'pdf'],
            isPublic: false,
            folder: 'documents',
            downloadCount: 5,
            uploadDate: '2024-01-15T10:00:00.000Z',
            lastModified: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  // Отримання файлу за ID
  getFileById: {
    method: 'GET',
    url: '/api/files/file-uuid',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'File retrieved successfully',
      data: {
        id: 'file-uuid',
        fileName: 'resume.pdf',
        originalName: 'resume.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024000,
        r2Key: 'resume/documents/2024-01-15/file-uuid.pdf',
        r2Url: 'https://r2.example.com/resume/documents/2024-01-15/file-uuid.pdf',
        type: 'pdf',
        category: 'resume',
        status: 'ready',
        description: 'Моє резюме',
        tags: ['resume', 'pdf', 'job'],
        isPublic: false,
        folder: 'documents',
        downloadCount: 5,
        isActive: true,
        metadata: {
          version: '1.0',
          language: 'uk'
        },
        uploadedBy: {
          id: 'user-uuid',
          firstName: 'Іван',
          lastName: 'Петренко',
          email: 'ivan@example.com'
        },
        uploadDate: '2024-01-15T10:00:00.000Z',
        lastModified: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Оновлення метаданих файлу
  updateFile: {
    method: 'PUT',
    url: '/api/files/file-uuid',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      fileName: 'resume_updated.pdf',
      description: 'Оновлене резюме з новими навичками',
      tags: ['resume', 'pdf', 'job', 'updated'],
      isPublic: true,
      metadata: {
        version: '2.0',
        language: 'uk',
        lastUpdated: '2024-01-15'
      }
    },
    response: {
      success: true,
      message: 'File updated successfully',
      data: {
        id: 'file-uuid',
        fileName: 'resume_updated.pdf',
        description: 'Оновлене резюме з новими навичками',
        tags: ['resume', 'pdf', 'job', 'updated'],
        isPublic: true,
        metadata: {
          version: '2.0',
          language: 'uk',
          lastUpdated: '2024-01-15'
        },
        lastModified: '2024-01-15T12:00:00.000Z'
      }
    }
  },

  // Видалення файлу
  deleteFile: {
    method: 'DELETE',
    url: '/api/files/file-uuid',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'File deleted successfully'
    }
  },

  // Отримання URL для завантаження
  getDownloadUrl: {
    method: 'GET',
    url: '/api/files/file-uuid/download',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Download URL generated successfully',
      data: {
        downloadUrl: 'https://r2.example.com/download-url?signature=...',
        expiresIn: 3600
      }
    }
  },

  // Отримання публічних файлів
  getPublicFiles: {
    method: 'GET',
    url: '/api/files/public?type=image&category=profile_photo&page=1&limit=10',
    headers: {},
    response: {
      success: true,
      message: 'Public files retrieved successfully',
      data: {
        files: [
          {
            id: 'file-uuid-1',
            fileName: 'profile_photo.jpg',
            originalName: 'profile_photo.jpg',
            mimeType: 'image/jpeg',
            fileSize: 512000,
            type: 'jpg',
            category: 'profile_photo',
            status: 'ready',
            description: 'Фото профілю',
            tags: ['profile', 'photo'],
            isPublic: true,
            downloadCount: 25,
            uploadDate: '2024-01-15T10:00:00.000Z',
            lastModified: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  },

  // Пошук файлів
  searchFiles: {
    method: 'GET',
    url: '/api/files/search?search=резюме&type=pdf&category=resume',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Files search completed successfully',
      data: [
        {
          id: 'file-uuid-1',
          fileName: 'resume.pdf',
          originalName: 'resume.pdf',
          mimeType: 'application/pdf',
          fileSize: 1024000,
          type: 'pdf',
          category: 'resume',
          status: 'ready',
          description: 'Моє резюме',
          tags: ['resume', 'pdf'],
          isPublic: false,
          folder: 'documents',
          downloadCount: 5,
          uploadDate: '2024-01-15T10:00:00.000Z',
          lastModified: '2024-01-15T10:00:00.000Z'
        }
      ]
    }
  },

  // Статистика файлів
  getFileStats: {
    method: 'GET',
    url: '/api/files/stats?userId=user-uuid&type=pdf',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'File statistics retrieved successfully',
      data: {
        totalFiles: 15,
        totalSize: 15728640, // bytes
        filesByType: [
          { type: 'pdf', count: 8, size: 8388608 },
          { type: 'jpg', count: 5, size: 5242880 },
          { type: 'png', count: 2, size: 2097152 }
        ],
        filesByCategory: [
          { category: 'resume', count: 5, size: 5242880 },
          { category: 'portfolio', count: 3, size: 3145728 },
          { category: 'profile_photo', count: 4, size: 2097152 },
          { category: 'other', count: 3, size: 5242880 }
        ],
        filesByStatus: [
          { status: 'ready', count: 14, size: 15728640 },
          { status: 'uploading', count: 1, size: 0 }
        ],
        recentUploads: 3
      }
    }
  }
};

export default fileExamples;


