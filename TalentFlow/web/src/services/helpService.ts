import { apiClient } from '../utils/apiClient';

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articleCount: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  readTime: string;
  difficulty: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
}

export interface SupportContact {
  email: {
    address: string;
    responseTime: string;
    available: boolean;
  };
  phone: {
    number: string;
    hours: string;
    available: boolean;
  };
  chat: {
    available: boolean;
    responseTime: string;
    hours: string;
  };
  video: {
    available: boolean;
    bookingRequired: boolean;
    duration: string;
  };
}

export interface SearchResult {
  type: 'article' | 'faq';
  id: string;
  title?: string;
  question?: string;
  category: string;
  excerpt?: string;
  relevance: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
}

export class HelpService {
  // Отримання категорій допомоги
  static async getHelpCategories(): Promise<HelpCategory[]> {
    const response = await apiClient.get('/help/categories');
    return response.data.data;
  }

  // Отримання статей по категорії
  static async getHelpArticles(categoryId: string): Promise<HelpArticle[]> {
    const response = await apiClient.get(`/help/categories/${categoryId}/articles`);
    return response.data.data;
  }

  // Отримання FAQ
  static async getFAQ(): Promise<FAQItem[]> {
    const response = await apiClient.get('/help/faq');
    return response.data.data;
  }

  // Отримання контактів підтримки
  static async getSupportContacts(): Promise<SupportContact> {
    const response = await apiClient.get('/help/support/contacts');
    return response.data.data;
  }

  // Пошук по допомозі
  static async searchHelp(query: string): Promise<SearchResponse> {
    const response = await apiClient.get('/help/search', {
      params: { query }
    });
    return response.data.data;
  }

  // Оцінка корисності FAQ
  static async rateFAQ(faqId: string, helpful: boolean): Promise<void> {
    await apiClient.post('/help/faq/rate', {
      faqId,
      helpful
    });
  }
}

export default HelpService;


