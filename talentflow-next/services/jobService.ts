import api from './api';

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string | {
    id: string;
    name: string;
    description?: string;
    industry?: string;
    size?: string;
    founded?: number;
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  companyId: string;
  city?: string;
  country?: string;
  location?: string;
  type: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  currency?: string;
  experienceLevel: string;
  posted?: string;
  views?: number;
  applications?: number;
  remote: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  skills: string[];
  requirements?: string;
  benefits?: string;
  industry?: string;
  tags?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;
  isActive?: boolean;
  deadline?: string;
  featuredUntil?: string;
  featuredPackageId?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  city?: string;
  country?: string;
  type?: string;
  experienceLevel?: string;
  remote?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  industry?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const jobService = {
  // Отримати всі вакансії з фільтрами
  async getJobs(filters?: JobFilters) {
    const response = await api.get('/jobs', { params: filters });
    // API повертає { success: true, data: { jobs: [...] } }
    return response.data.data || response.data;
  },

  // Отримати вакансію за ID
  async getJobById(id: string) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Створити вакансію
  async createJob(jobData: Partial<Job>) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Оновити вакансію
  async updateJob(id: string, jobData: Partial<Job>) {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Видалити вакансію
  async deleteJob(id: string) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Подати заявку на вакансію
  async applyToJob(jobId: string, applicationData: any) {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  // Зберегти вакансію
  async saveJob(jobId: string) {
    const response = await api.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Видалити вакансію зі збережених
  async unsaveJob(jobId: string) {
    const response = await api.delete(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Отримати збережені вакансії
  async getSavedJobs() {
    const response = await api.get('/jobs/saved');
    return response.data;
  },

  // Отримати мої вакансії (для роботодавців)
  async getMyJobs(filters?: JobFilters) {
    const response = await api.get('/jobs/my', { params: filters });
    return response.data;
  },

  // Змінити статус вакансії
  async updateJobStatus(id: string, status: string) {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  // Закрити вакансію
  async closeJob(id: string) {
    const response = await api.post(`/jobs/${id}/close`);
    return response.data;
  },

  // Отримати статистику вакансій
  async getJobStats() {
    const response = await api.get('/jobs/stats');
    return response.data;
  },

  // Отримати схожі вакансії
  async getSimilarJobs(jobId: string) {
    const response = await api.get(`/jobs/${jobId}/similar`);
    return response.data;
  },

  // Отримати заявки на вакансію
  async getJobApplications(jobId: string) {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  // Пошук вакансій
  async searchJobs(query: string, filters?: JobFilters) {
    const response = await api.get('/jobs/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  },

  // Отримати доступні локації
  async getAvailableLocations() {
    const response = await api.get('/jobs/locations');
    return response.data;
  },

  // Отримати типи вакансій
  async getJobTypes() {
    const response = await api.get('/jobs/types');
    return response.data;
  },

  // Отримати рівні досвіду
  async getExperienceLevels() {
    const response = await api.get('/jobs/experience-levels');
    return response.data;
  },

  // Отримати доступні галузі
  async getAvailableIndustries() {
    const response = await api.get('/jobs/industries');
    return response.data;
  },

  // Отримати доступні департаменти (deprecated - використовувати getAvailableIndustries)
  async getAvailableDepartments() {
    return this.getAvailableIndustries();
  },

  // Отримати вакансії з обробкою помилок (для SSR)
  async getJobsWithErrorHandling(filters?: JobFilters) {
    try {
      const response = await this.getJobs(filters);
      // API повертає { success: true, data: { jobs: [...] } }
      // Але getJobs вже повертає data частину, тому response = { jobs: [...] }
      return { jobs: response.jobs || [], error: null };
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      return { jobs: [], error: error };
    }
  },

  // Отримати персональні вакансії
  async getPersonalJobs(filters?: JobFilters) {
    return this.getMyJobs(filters);
  },

  // Отримати публічні вакансії
  async getPublicJobs(filters?: JobFilters) {
    return this.getJobs(filters);
  }
};

export default jobService;
