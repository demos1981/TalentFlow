import api from './api';

export interface CreateApplicationRequest {
  jobId: string;
  coverLetter?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'approved' | 'interview' | 'hired' | 'rejected';
  coverLetter: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  expectedSalary?: number;
  availableFrom?: string;
  notes?: string;
  employerNotes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  // Дані з Job
  job?: {
    id: string;
    title: string;
    location?: string;
    employmentType?: string;
    company?: {
      id: string;
      name: string;
    };
  };
  // Дані з User (кандидат)
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
  };
}

class ApplicationService {
  // Перевірка чи користувач вже подавав заявку на вакансію
  async checkExistingApplication(jobId: string): Promise<boolean> {
    try {
      const response = await api.get(`/applications?jobId=${jobId}&limit=1`);
      const applications = response.data.data?.applications || response.data.applications || [];
      const hasApplication = applications.length > 0;
      return hasApplication;
    } catch (error: any) {
      console.error('Error checking existing application:', error);
      return false; // При помилці вважаємо, що заявки немає
    }
  }

  // Подача заявки
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    try {
      const requestData = {
        jobId: data.jobId,
        coverLetter: data.coverLetter || 'Зацікавлений у цій позиції'
      };
      
      const response = await api.post('/applications', requestData);
      
      return response.data.data || response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Отримання всіх заявок (з фільтрами)
  async getAllApplications(filters: any = {}): Promise<{ applications: Application[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      // Основні параметри
      queryParams.append('page', (filters.page || 1).toString());
      queryParams.append('limit', (filters.limit || 20).toString());
      
      // Фільтри
      if (filters.jobId) queryParams.append('jobId', filters.jobId);
      if (filters.candidateId) queryParams.append('candidateId', filters.candidateId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const url = `/applications?${queryParams.toString()}`;
      const response = await api.get(url);
      
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  // Отримання заявок роботодавця
  async getEmployerApplications(filters: any = {}): Promise<{ applications: Application[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      // Основні параметри
      queryParams.append('page', (filters.page || 1).toString());
      queryParams.append('limit', (filters.limit || 20).toString());
      
      // Фільтри
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const url = `/applications/employer/my-applications?${queryParams.toString()}`;
      const response = await api.get(url);
      
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  // Отримання заявки за ID
  async getApplicationById(id: string): Promise<Application> {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  // Оновлення статусу заявки (для роботодавців)
  async updateApplicationStatus(id: string, status: string, employerNotes?: string): Promise<Application> {
    try {
      const response = await api.patch(`/applications/${id}/status`, {
        status,
        employerNotes
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();
export default applicationService;
