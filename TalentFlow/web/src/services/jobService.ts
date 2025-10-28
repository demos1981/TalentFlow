import { apiClient } from '../utils/apiClient';

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  companyId: string;
  location: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  experience: string;
  experienceLevel: string;
  posted: string;
  views: number;
  applications: number;
  isRemote: boolean;
  isUrgent: boolean;
  skills: string[];
  requirements?: string;
  benefits?: string;
  department?: string;
  tags?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  isUrgent?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  department?: string;
  company?: string;
}

export interface JobSearchParams {
  page?: number;
  limit?: number;
  filters?: JobFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class JobService {
  // Отримання публічних вакансій (тільки ACTIVE)
  async getPublicJobs(params: JobSearchParams = {}): Promise<JobSearchResponse> {
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
        if (params.filters.type) queryParams.append('type', params.filters.type);
        if (params.filters.experienceLevel) queryParams.append('experienceLevel', params.filters.experienceLevel);
        if (params.filters.isRemote !== undefined) queryParams.append('isRemote', params.filters.isRemote.toString());
        if (params.filters.isUrgent !== undefined) queryParams.append('isUrgent', params.filters.isUrgent.toString());
        if (params.filters.salaryMin) queryParams.append('salaryMin', params.filters.salaryMin.toString());
        if (params.filters.salaryMax) queryParams.append('salaryMax', params.filters.salaryMax.toString());
        if (params.filters.department) queryParams.append('department', params.filters.department);
        if (params.filters.company) queryParams.append('company', params.filters.company);
        if (params.filters.skills && params.filters.skills.length > 0) {
          params.filters.skills.forEach(skill => queryParams.append('skills', skill));
        }
      }
      
      const url = `/jobs?${queryParams.toString()}`;
      console.log('🌐 API call URL (Public):', url);
      console.log('🔍 Query params:', queryParams.toString());
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching public jobs:', error);
      throw error;
    }
  }

  // Отримання особистих вакансій користувача (включаючи draft, active, paused, closed)
  async getPersonalJobs(params: JobSearchParams = {}): Promise<JobSearchResponse> {
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
        if (params.filters.type) queryParams.append('type', params.filters.type);
        if (params.filters.experienceLevel) queryParams.append('experienceLevel', params.filters.experienceLevel);
        if (params.filters.isRemote !== undefined) queryParams.append('isRemote', params.filters.isRemote.toString());
        if (params.filters.isUrgent !== undefined) queryParams.append('isUrgent', params.filters.isUrgent.toString());
        if (params.filters.salaryMin) queryParams.append('salaryMin', params.filters.salaryMin.toString());
        if (params.filters.salaryMax) queryParams.append('salaryMax', params.filters.salaryMax.toString());
        if (params.filters.department) queryParams.append('department', params.filters.department);
        if (params.filters.company) queryParams.append('company', params.filters.company);
        if (params.filters.skills && params.filters.skills.length > 0) {
          params.filters.skills.forEach(skill => queryParams.append('skills', skill));
        }
      }
      
      const url = `/jobs/personal?${queryParams.toString()}`;
      console.log('🌐 API call URL (Personal):', url);
      console.log('🔍 Query params:', queryParams.toString());
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching personal jobs:', error);
      throw error;
    }
  }

  // Отримання всіх вакансій з фільтрами (для зворотної сумісності)
  async getJobs(params: JobSearchParams = {}): Promise<JobSearchResponse> {
    return this.getPublicJobs(params);
  }

  // Отримання вакансії за ID
  async getJobById(id: string): Promise<Job> {
    try {
      const response = await apiClient.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  }

  // Створення нової вакансії
  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await apiClient.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Оновлення вакансії
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await apiClient.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Видалення вакансії
  async deleteJob(id: string): Promise<void> {
    try {
      await apiClient.delete(`/jobs/${id}`);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Подача заявки на вакансію
  async applyToJob(jobId: string, applicationData: any): Promise<any> {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  }

  // Отримання популярних навичок
  async getPopularSkills(): Promise<string[]> {
    try {
      const response = await apiClient.get('/jobs/popular-skills');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular skills:', error);
      return [];
    }
  }

  // Отримання доступних локацій
  async getAvailableLocations(): Promise<string[]> {
    try {
      const response = await apiClient.get('/jobs/available-locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching available locations:', error);
      return [];
    }
  }

  // Отримання типів вакансій
  async getJobTypes(): Promise<string[]> {
    try {
      const response = await apiClient.get('/jobs/types');
      return response.data;
    } catch (error) {
      console.error('Error fetching job types:', error);
      return [];
    }
  }

  // Отримання рівнів досвіду
  async getExperienceLevels(): Promise<string[]> {
    try {
      const response = await apiClient.get('/jobs/experience-levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching experience levels:', error);
      return [];
    }
  }

  // Збереження вакансії в обране
  async saveJob(jobId: string): Promise<void> {
    try {
      await apiClient.post(`/jobs/${jobId}/save`);
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  // Видалення вакансії з обраного
  async unsaveJob(jobId: string): Promise<void> {
    try {
      await apiClient.delete(`/jobs/${jobId}/save`);
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  }

  // Отримання збережених вакансій
  async getSavedJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get('/jobs/saved');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return [];
    }
  }

  // Пошук вакансій за навичками
  async searchJobsBySkills(skills: string[]): Promise<Job[]> {
    try {
      const queryParams = new URLSearchParams();
      skills.forEach(skill => queryParams.append('skills', skill));
      
      const response = await apiClient.get(`/jobs/search-by-skills?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching jobs by skills:', error);
      return [];
    }
  }
}

export const jobService = new JobService();
export default jobService;
