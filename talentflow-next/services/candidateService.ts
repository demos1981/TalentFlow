import api from './api';

export interface Candidate {
  id: string;
  userId: string;
  title?: string;
  summary?: string;
  bio?: string;
  skills?: string[];
  yearsOfExperience?: number;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  workExperience?: string[];
  achievements?: string[];
  workHistory?: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: Date;
    endDate?: Date;
  }>;
  preferences?: {
    desiredSalary?: number;
    preferredLocation?: string;
    remoteWork?: boolean;
    relocation?: boolean;
    travelPercentage?: number;
    salaryExpectation?: number;
    workType?: string;
    availability?: string;
  };
  rating?: number;
  views?: number;
  isActive?: boolean;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  // Дані з User моделі
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    isActive: boolean;
    lastActiveAt?: string;
  };
}

export interface CandidateFilters {
  skills?: string[];
  experience?: number;
  minExperience?: number;
  maxExperience?: number;
  location?: string;
  city?: string;
  country?: string;
  education?: string;
  remote?: boolean;
  relocation?: boolean;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  languages?: string[];
  certifications?: string[];
  availability?: 'immediate' | '2weeks' | '1month' | '3months';
}

export interface CandidateSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'experience' | 'rating' | 'recent';
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  // Всі фільтри на верхньому рівні (як в бекенді)
  skills?: string[];
  experience?: number;
  minExperience?: number;
  maxExperience?: number;
  location?: string;
  city?: string;
  country?: string;
  education?: string;
  remote?: boolean;
  relocation?: boolean;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  languages?: string[];
  certifications?: string[];
  availability?: 'immediate' | '2weeks' | '1month' | '3months';
}

export interface CandidateSearchResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CandidateService {
  // Пошук кандидатів з фільтрами
  async searchCandidates(params: CandidateSearchParams = {}): Promise<CandidateSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Основні параметри з значеннями за замовчуванням
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('limit', (params.limit || 20).toString());
      
      // Опціональні параметри
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Фільтри (відповідно до бекенду)
      if (params.skills && params.skills.length > 0) {
        params.skills.forEach(skill => queryParams.append('skills', skill));
      }
      if (params.experience !== undefined) queryParams.append('experience', params.experience.toString());
      if (params.minExperience !== undefined) queryParams.append('minExperience', params.minExperience.toString());
      if (params.maxExperience !== undefined) queryParams.append('maxExperience', params.maxExperience.toString());
      if (params.location) queryParams.append('location', params.location);
      if (params.city) queryParams.append('city', params.city);
      if (params.country) queryParams.append('country', params.country);
      if (params.education) queryParams.append('education', params.education);
      if (params.remote !== undefined) queryParams.append('remote', params.remote.toString());
      if (params.relocation !== undefined) queryParams.append('relocation', params.relocation.toString());
      if (params.minSalary !== undefined) queryParams.append('minSalary', params.minSalary.toString());
      if (params.maxSalary !== undefined) queryParams.append('maxSalary', params.maxSalary.toString());
      if (params.currency) queryParams.append('currency', params.currency);
      if (params.languages && params.languages.length > 0) {
        params.languages.forEach(lang => queryParams.append('languages', lang));
      }
      if (params.certifications && params.certifications.length > 0) {
        params.certifications.forEach(cert => queryParams.append('certifications', cert));
      }
      if (params.availability) queryParams.append('availability', params.availability);
      
      const url = `/candidates?${queryParams.toString()}`;
      const response = await api.get(url);
      
      // Бекенд повертає дані у форматі { success: true, data: {...} }
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  // Створення власного профілю кандидата
  async createOwnProfile(candidateData: any): Promise<Candidate> {
    try {
      const response = await api.post('/candidates/profile', candidateData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating candidate profile:', error);
      throw error;
    }
  }

  // Створення нового кандидата (тільки для роботодавців)
  async createCandidate(candidateData: any): Promise<Candidate> {
    try {
      const response = await api.post('/candidates', candidateData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  }

  // Отримання кандидата за ID
  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }

  // Отримання доступних локацій
  async getAvailableLocations(): Promise<Array<{ name: string; count: number }>> {
    try {
      const response = await api.get('/candidates/locations');
      const data = response.data.data || response.data;
      return data.locations || [];
    } catch (error) {
      console.error('Error fetching available locations:', error);
      return [];
    }
  }

  // Отримання доступних навичок
  async getAvailableSkills(): Promise<string[]> {
    try {
      const response = await api.get('/candidates/skills');
      const data = response.data.data || response.data;
      return data.skills || [];
    } catch (error) {
      console.error('Error fetching available skills:', error);
      return [];
    }
  }

  // Отримання популярних навичок
  async getPopularSkills(): Promise<string[]> {
    try {
      const response = await api.get('/candidates/popular-skills');
      const data = response.data.data || response.data;
      return data.skills || [];
    } catch (error) {
      console.error('Error fetching popular skills:', error);
      return [];
    }
  }

  // Отримання рівнів досвіду
  async getExperienceLevels(): Promise<string[]> {
    try {
      const response = await api.get('/candidates/experience-levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching experience levels:', error);
      return [];
    }
  }

  // Отримання доступних відділів
  async getAvailableDepartments(): Promise<string[]> {
    try {
      const response = await api.get('/candidates/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching available departments:', error);
      return [];
    }
  }

  // Збереження кандидата в обране
  async saveCandidate(candidateId: string): Promise<void> {
    try {
      await api.post(`/candidates/${candidateId}/save`);
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw error;
    }
  }

  // Видалення кандидата з обраного
  async unsaveCandidate(candidateId: string): Promise<void> {
    try {
      await api.delete(`/candidates/${candidateId}/save`);
    } catch (error) {
      console.error('Error unsaving candidate:', error);
      throw error;
    }
  }

  // Отримання збережених кандидатів
  async getSavedCandidates(): Promise<Candidate[]> {
    try {
      const response = await api.get('/candidates/saved');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
      return [];
    }
  }

  // Пошук кандидатів за навичками
  async searchCandidatesBySkills(skills: string[]): Promise<Candidate[]> {
    try {
      const queryParams = new URLSearchParams();
      skills.forEach(skill => queryParams.append('skills', skill));
      
      const response = await api.get(`/candidates/search-by-skills?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching candidates by skills:', error);
      return [];
    }
  }

  // Отримання рекомендацій кандидатів
  async getCandidateRecommendations(jobId: string): Promise<Candidate[]> {
    try {
      const response = await api.get(`/candidates/recommended/${jobId}`);
      const data = response.data.data || response.data;
      return data.candidates || data;
    } catch (error) {
      console.error('Error fetching candidate recommendations:', error);
      return [];
    }
  }

  // Отримання статистики пошуку
  async getSearchStats(): Promise<{
    totalCandidates: number;
    activeCandidates: number;
    averageRating: number;
    topSkills: Array<{ name: string; count: number }>;
    locationDistribution: Array<{ location: string; count: number }>;
  }> {
    try {
      const response = await api.get('/candidates/stats');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching search stats:', error);
      return {
        totalCandidates: 0,
        activeCandidates: 0,
        averageRating: 0,
        topSkills: [],
        locationDistribution: []
      };
    }
  }

  // Перевірка чи кандидат в обраному
  isInFavorites(candidateId: string): boolean {
    try {
      const savedCandidates = localStorage.getItem('savedCandidates');
      if (!savedCandidates) return false;
      const candidates = JSON.parse(savedCandidates);
      return candidates.includes(candidateId);
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  }

}

export const candidateService = new CandidateService();
export default candidateService;
