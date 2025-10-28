import api from './api';

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  activeUsers: number;
  newUsersToday: number;
  newJobsToday: number;
  newApplicationsToday: number;
  usersByRole: Record<string, number>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface Company {
  id: string;
  name: string;
  email: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users: User[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
  };
  applications: { id: string }[];
}

export interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
  };
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export class AdminService {
  // Отримати статистику платформи
  static async getStats(): Promise<AdminStats> {
    try {
      const response = await api.get('/admin/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // Отримати список користувачів
  static async getUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<{ users: User[]; pagination: PaginationInfo }> {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Отримати користувача за ID
  static async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  // Оновити користувача
  static async updateUser(userId: string, data: {
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    phone?: string;
    location?: string;
    bio?: string;
  }): Promise<User> {
    try {
      const response = await api.put(`/admin/users/${userId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Видалити користувача
  static async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Активувати користувача
  static async activateUser(userId: string): Promise<void> {
    try {
      await api.patch(`/admin/users/${userId}/activate`);
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  // Деактивувати користувача
  static async deactivateUser(userId: string): Promise<void> {
    try {
      await api.patch(`/admin/users/${userId}/deactivate`);
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  // Отримати список компаній
  static async getCompanies(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  } = {}): Promise<{ companies: Company[]; pagination: PaginationInfo }> {
    try {
      const response = await api.get('/admin/companies', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  // Отримати компанію за ID
  static async getCompanyById(companyId: string): Promise<Company> {
    try {
      const response = await api.get(`/admin/companies/${companyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      throw error;
    }
  }

  // Оновити компанію
  static async updateCompany(companyId: string, data: {
    name?: string;
    email?: string;
    website?: string;
    isActive?: boolean;
    description?: string;
  }): Promise<Company> {
    try {
      const response = await api.put(`/admin/companies/${companyId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  // Видалити компанію
  static async deleteCompany(companyId: string): Promise<void> {
    try {
      await api.delete(`/admin/companies/${companyId}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  // Отримати список вакансій
  static async getJobs(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{ jobs: Job[]; pagination: PaginationInfo }> {
    try {
      const response = await api.get('/admin/jobs', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  // Отримати вакансію за ID
  static async getJobById(jobId: string): Promise<Job> {
    try {
      const response = await api.get(`/admin/jobs/${jobId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  }

  // Оновити вакансію
  static async updateJob(jobId: string, data: any): Promise<Job> {
    try {
      const response = await api.put(`/admin/jobs/${jobId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Видалити вакансію
  static async deleteJob(jobId: string): Promise<void> {
    try {
      await api.delete(`/admin/jobs/${jobId}`);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Отримати список заявок
  static async getApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    candidateId?: string;
  } = {}): Promise<{ applications: Application[]; pagination: PaginationInfo }> {
    try {
      const response = await api.get('/admin/applications', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Отримати заявку за ID
  static async getApplicationById(applicationId: string): Promise<Application> {
    try {
      const response = await api.get(`/admin/applications/${applicationId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      throw error;
    }
  }

  // Оновити заявку
  static async updateApplication(applicationId: string, data: {
    status?: string;
    feedback?: string;
  }): Promise<Application> {
    try {
      const response = await api.put(`/admin/applications/${applicationId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  // Видалити заявку
  static async deleteApplication(applicationId: string): Promise<void> {
    try {
      await api.delete(`/admin/applications/${applicationId}`);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  // Отримати системні логи
  static async getSystemLogs(): Promise<{ logs: any[] }> {
    try {
      const response = await api.get('/admin/logs');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  }

  // Отримати логи активності
  static async getActivityLogs(): Promise<{ activities: any[] }> {
    try {
      const response = await api.get('/admin/activity');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  }
}
