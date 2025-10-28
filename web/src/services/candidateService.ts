import { apiClient } from '../utils/apiClient';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  city?: string;
  country?: string;
  skills: string[];
  experience?: number;
  experienceLevel?: string;
  education?: string;
  certifications?: string[];
  jobTitle?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateFilters {
  search?: string;
  location?: string;
  experienceLevel?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  isRemote?: boolean;
}

export interface CandidateSearchParams {
  page?: number;
  limit?: number;
  filters?: CandidateFilters;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
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
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Додаємо фільтри
      if (params.filters) {
        if (params.filters.search) queryParams.append('search', params.filters.search);
        if (params.filters.location) queryParams.append('location', params.filters.location);
        if (params.filters.experienceLevel) queryParams.append('experienceLevel', params.filters.experienceLevel);
        if (params.filters.department) queryParams.append('department', params.filters.department);
        if (params.filters.salaryMin) queryParams.append('salaryMin', params.filters.salaryMin.toString());
        if (params.filters.salaryMax) queryParams.append('salaryMax', params.filters.salaryMax.toString());
        if (params.filters.isRemote !== undefined) queryParams.append('isRemote', params.filters.isRemote.toString());
        if (params.filters.skills && params.filters.skills.length > 0) {
          params.filters.skills.forEach(skill => queryParams.append('skills', skill));
        }
      }
      
      const response = await apiClient.get(`/candidates/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  }

  // Отримання кандидата за ID
  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await apiClient.get(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }

  // Отримання доступних локацій
  async getAvailableLocations(): Promise<string[]> {
    try {
      const response = await apiClient.get('/candidates/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching available locations:', error);
      return [];
    }
  }

  // Отримання популярних навичок
  async getPopularSkills(): Promise<string[]> {
    try {
      const response = await apiClient.get('/candidates/popular-skills');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular skills:', error);
      return [];
    }
  }

  // Отримання рівнів досвіду
  async getExperienceLevels(): Promise<string[]> {
    try {
      const response = await apiClient.get('/candidates/experience-levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching experience levels:', error);
      return [];
    }
  }

  // Отримання доступних відділів
  async getAvailableDepartments(): Promise<string[]> {
    try {
      const response = await apiClient.get('/candidates/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching available departments:', error);
      return [];
    }
  }

  // Збереження кандидата в обране
  async saveCandidate(candidateId: string): Promise<void> {
    try {
      await apiClient.post(`/candidates/${candidateId}/save`);
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw error;
    }
  }

  // Видалення кандидата з обраного
  async unsaveCandidate(candidateId: string): Promise<void> {
    try {
      await apiClient.delete(`/candidates/${candidateId}/save`);
    } catch (error) {
      console.error('Error unsaving candidate:', error);
      throw error;
    }
  }

  // Отримання збережених кандидатів
  async getSavedCandidates(): Promise<Candidate[]> {
    try {
      const response = await apiClient.get('/candidates/saved');
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
      
      const response = await apiClient.get(`/candidates/search-by-skills?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching candidates by skills:', error);
      return [];
    }
  }

  // Отримання рекомендацій кандидатів
  async getCandidateRecommendations(jobId: string): Promise<Candidate[]> {
    try {
      const response = await apiClient.get(`/candidates/recommendations/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate recommendations:', error);
      return [];
    }
  }

  // Отримання статистики пошуку
  async getSearchStats(): Promise<any> {
    try {
      const response = await apiClient.get('/candidates/search-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching search stats:', error);
      return {};
    }
  }
}

export const candidateService = new CandidateService();
export default candidateService;
