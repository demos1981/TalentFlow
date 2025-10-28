import api from './api';

export interface FileUploadResponse {
  key: string;
  url: string;
  r2Url?: string;
  size: number;
  mimeType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  key: string;
}

export interface FileInfo {
  key: string;
  size: number;
  lastModified: Date;
}

export interface FileListResponse {
  files: FileInfo[];
}

export class FileService {
  /**
   * Завантаження файлу
   */
  static async uploadFile(
    file: File,
    folder: string = 'uploads',
    category: 'profile_photo' | 'company_logo' | 'resume' | 'portfolio' | 'other' = 'other'
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    // Додаємо необхідні поля для валідації API
    formData.append('fileName', file.name);
    formData.append('mimeType', file.type);
    formData.append('fileSize', file.size.toString());
    
    // Визначаємо тип файлу на основі MIME type
    let fileType = 'other';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    } else if (file.type.startsWith('audio/')) {
      fileType = 'audio';
    } else if (file.type.includes('pdf')) {
      fileType = 'pdf';
    } else if (file.type.includes('word')) {
      fileType = 'docx';
    } else if (file.type.includes('zip') || file.type.includes('rar')) {
      fileType = 'archive';
    }
    
    formData.append('type', fileType);
    formData.append('category', category);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  /**
   * Отримання pre-signed URL для завантаження
   */
  static async getUploadUrl(
    fileName: string,
    contentType: string,
    folder: string = 'uploads'
  ): Promise<UploadUrlResponse> {
    const response = await api.post('/files/upload-url', {
      fileName,
      contentType,
      folder,
    });

    return response.data.data;
  }

  /**
   * Отримання pre-signed URL для завантаження
   */
  static async getDownloadUrl(key: string): Promise<DownloadUrlResponse> {
    const response = await api.get(`/files/download-url/${key}`);
    return response.data.data;
  }

  /**
   * Видалення файлу
   */
  static async deleteFile(key: string): Promise<void> {
    await api.delete(`/files/${key}`);
  }

  /**
   * Отримання списку файлів
   */
  static async listFiles(
    prefix: string = '',
    maxKeys: number = 100
  ): Promise<FileListResponse> {
    const response = await api.get('/files/list', {
      params: { prefix, maxKeys },
    });

    return response.data.data;
  }

  /**
   * Завантаження файлу через pre-signed URL
   */
  static async uploadFileWithPresignedUrl(
    file: File,
    uploadUrl: string
  ): Promise<void> {
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  }

  /**
   * Завантаження файлу з прогресом
   */
  static async uploadFileWithProgress(
    file: File,
    folder: string = 'uploads',
    onProgress?: (progress: number) => void,
    category: 'profile_photo' | 'company_logo' | 'resume' | 'portfolio' | 'other' = 'other'
  ): Promise<FileUploadResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data);
          } catch (error) {
            reject(new Error('Помилка парсингу відповіді'));
          }
        } else {
          reject(new Error(`Помилка завантаження: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Помилка мережі'));
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      // Додаємо необхідні поля для валідації API
      formData.append('fileName', file.name);
      formData.append('mimeType', file.type);
      formData.append('fileSize', file.size.toString());
      
      // Визначаємо тип файлу на основі MIME type
      let fileType = 'other';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type.startsWith('audio/')) {
        fileType = 'audio';
      } else if (file.type.includes('pdf')) {
        fileType = 'pdf';
      } else if (file.type.includes('word')) {
        fileType = 'docx';
      } else if (file.type.includes('zip') || file.type.includes('rar')) {
        fileType = 'archive';
      }
      
      formData.append('type', fileType);
      formData.append('category', category);

      xhr.open('POST', `${process.env.VITE_API_URL || 'http://localhost:3000/api'}/files/upload`);
      
      // Додаємо токен авторизації
      const token = localStorage.getItem('accessToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  /**
   * Валідація файлу на фронтенді
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (file.size > maxSize) {
      return { isValid: false, error: 'Файл занадто великий. Максимальний розмір: 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Непідтримуваний тип файлу' };
    }

    return { isValid: true };
  }

  /**
   * Форматування розміру файлу
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Отримання іконки для типу файлу
   */
  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType === 'text/plain') return '📄';
    return '📁';
  }
}

export default FileService;
