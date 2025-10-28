import { API_BASE_URL } from '../config/api';

export interface ParsedJobData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  city?: string;
  country?: string;
  remote?: boolean;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  industry?: string;
  skills?: string[];
  tags?: string[];
  companyName?: string;
  sourceUrl: string;
  sourcePlatform: string;
}

export interface SupportedPlatform {
  name: string;
  domain: string;
  description: string;
  icon: string;
}

export interface JobParsingResult {
  success: boolean;
  message: string;
  data?: ParsedJobData;
  platform?: string;
  error?: string;
}

export interface UrlValidationResult {
  success: boolean;
  data?: {
    isValid: boolean;
    platform: string;
    supported: boolean;
  };
  error?: string;
}

export interface PlatformsResult {
  success: boolean;
  data?: SupportedPlatform[];
  error?: string;
}

class JobParsingService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  /**
   * Парсинг вакансії з зовнішнього сайту
   */
  async parseJobFromUrl(url: string): Promise<JobParsingResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-parsing/parse`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка парсингу вакансії');
      }

      return data;
    } catch (error) {
      console.error('Error parsing job:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Помилка парсингу вакансії'
      };
    }
  }

  /**
   * Отримати список підтримуваних платформ
   */
  async getSupportedPlatforms(): Promise<PlatformsResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-parsing/platforms`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка завантаження платформ');
      }

      return data;
    } catch (error) {
      console.error('Error loading platforms:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка завантаження платформ'
      };
    }
  }

  /**
   * Перевірити валідність URL для парсингу
   */
  async validateUrl(url: string): Promise<UrlValidationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-parsing/validate-url?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка валідації URL');
      }

      return data;
    } catch (error) {
      console.error('Error validating URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка валідації URL'
      };
    }
  }

  /**
   * Перевірити, чи підтримується платформа
   */
  isPlatformSupported(url: string): boolean {
    const supportedDomains = [
      'linkedin.com',
      'djinni.co',
      'robota.ua',
      'work.ua',
      'indeed.com',
      'glassdoor.com'
    ];

    try {
      const urlObj = new URL(url);
      return supportedDomains.some(domain => 
        urlObj.hostname.includes(domain)
      );
    } catch {
      return false;
    }
  }

  /**
   * Визначити платформу за URL
   */
  detectPlatform(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('linkedin.com')) return 'LinkedIn';
    if (urlLower.includes('djinni.co')) return 'Djinni';
    if (urlLower.includes('robota.ua')) return 'Robota.ua';
    if (urlLower.includes('work.ua')) return 'Work.ua';
    if (urlLower.includes('indeed.com')) return 'Indeed';
    if (urlLower.includes('glassdoor.com')) return 'Glassdoor';
    
    return 'Невідома платформа';
  }

  /**
   * Валідувати URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export const jobParsingService = new JobParsingService();
