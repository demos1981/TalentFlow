import api from './api';

export interface AiRecommendation {
  id: string;
  type: 'candidate' | 'job';
  title: string;
  subtitle: string;
  matchScore: number;
  skills: string[];
  experience: string;
  location: string;
  salary?: string;
  avatar?: string;
  company?: string;
  postedDate?: string;
  aiReason: string;
  isViewed?: boolean;
  isContacted?: boolean;
  feedbackRating?: number;
  feedbackComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMatchingFilters {
  search?: string;
  location?: string;
  experience?: string;
  salaryRange?: string;
  skills?: string[];
  matchScore?: number;
  type?: 'all' | 'candidates' | 'jobs';
  limit?: number;
  offset?: number;
}

export interface AiMatchingStats {
  totalMatches: number;
  highQualityMatches: number;
  averageMatchScore: number;
  candidatesMatched: number;
  jobsMatched: number;
  lastUpdated: string;
  aiAccuracy: number;
  processingTime: number;
  matchScoreDistribution?: any;
  topSkills?: any[];
  topLocations?: any[];
  // Trend data
  totalMatchesTrend?: number;
  highQualityMatchesTrend?: number;
  averageMatchScoreTrend?: number;
  candidatesMatchedTrend?: number;
  jobsMatchedTrend?: number;
  aiAccuracyTrend?: number;
}

export interface AiMatchingResponse {
  recommendations: AiRecommendation[];
  stats: AiMatchingStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: AiMatchingFilters;
}

export interface GenerateRecommendationsData {
  type?: string;
  candidateId?: string;
  jobId?: string;
  limit?: number;
}

export interface UpdateRecommendationData {
  isViewed?: boolean;
  isContacted?: boolean;
  feedbackRating?: number;
  feedbackComment?: string;
}

class AiMatchingService {

  /**
   * Отримати AI рекомендації з фільтрами
   */
  async getRecommendations(filters: AiMatchingFilters = {}): Promise<AiMatchingResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Додаємо фільтри
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.experience) queryParams.append('experience', filters.experience);
      if (filters.salaryRange) queryParams.append('salaryRange', filters.salaryRange);
      if (filters.matchScore) queryParams.append('minMatchScore', filters.matchScore.toString());
      if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => queryParams.append('skills', skill));
      }
      
      const url = `/ai-matching/recommendations?${queryParams.toString()}`;
      
      const response = await api.get(url);
      return response.data.data; // Бекенд повертає дані в response.data.data
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }

  /**
   * Отримати конкретну рекомендацію за ID
   */
  async getRecommendationById(id: string): Promise<AiRecommendation> {
    try {
      const response = await api.get(`/ai-matching/recommendations/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting recommendation by ID:', error);
      throw error;
    }
  }

  /**
   * Згенерувати нові рекомендації
   */
  async generateRecommendations(data: GenerateRecommendationsData): Promise<AiMatchingResponse> {
    try {
      const response = await api.post('/ai-matching/generate', data);
      return response.data.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Масово згенерувати рекомендації
   */
  async bulkGenerateRecommendations(data: GenerateRecommendationsData): Promise<AiMatchingResponse> {
    try {
      const response = await api.post('/ai-matching/bulk-generate', data);
      return response.data.data;
    } catch (error) {
      console.error('Error bulk generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Оновити рекомендацію
   */
  async updateRecommendation(id: string, data: UpdateRecommendationData): Promise<AiRecommendation> {
    try {
      const response = await api.put(`/ai-matching/recommendations/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating recommendation:', error);
      throw error;
    }
  }

  /**
   * Отримати статистику AI Matching
   */
  async getMatchingStats(): Promise<AiMatchingStats> {
    try {
      const response = await api.get('/ai-matching/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error getting matching stats:', error);
      throw error;
    }
  }

  /**
   * Видалити застарілі рекомендації
   */
  async cleanupOldRecommendations(): Promise<{ cleanedCount: number }> {
    try {
      const response = await api.delete('/ai-matching/cleanup');
      return response.data.data;
    } catch (error) {
      console.error('Error cleaning up old recommendations:', error);
      throw error;
    }
  }

  /**
   * Перевірка стану сервісу
   */
  async healthCheck(): Promise<any> {
    try {
      const response = await api.get('/ai-matching/health');
      return response.data.data;
    } catch (error) {
      console.error('Error checking AI matching health:', error);
      throw error;
    }
  }

  /**
   * Перевірка стану AI
   */
  async aiHealthCheck(): Promise<any> {
    try {
      const response = await api.get('/ai-matching/ai-health');
      return response.data.data;
    } catch (error) {
      console.error('Error checking AI health:', error);
      throw error;
    }
  }

  /**
   * Отримати підтримувані мови
   */
  async getSupportedLanguages(): Promise<{ languages: string[] }> {
    try {
      const response = await api.get('/ai-matching/languages');
      return response.data.data;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      throw error;
    }
  }
}

export const aiMatchingService = new AiMatchingService();
export default aiMatchingService;
