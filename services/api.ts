import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { USER_TYPES } from '../constants';

// Базовий URL API - безпечний для SSR
const getApiBaseUrl = () => {
  // Спочатку перевіряємо змінні середовища
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Перевіряємо чи ми в браузері
  if (typeof window !== 'undefined') {
    // Якщо localhost - локальний backend (порт 3002)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3002/api';
    }
    
    // Інакше - production Railway backend
    return 'https://talentflow-production-50cc.up.railway.app/api';
  }
  
  // Якщо на сервері - використовуємо production URL
  return 'https://talentflow-production-50cc.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();


// Створюємо axios інстанс
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Інтерцептор для додавання токена до запитів
api.interceptors.request.use(
  (config) => {
    // Перевіряємо чи ми в браузері перед використанням localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Інтерцептор для обробки відповідей
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    
    const originalRequest = error.config as any;

    // Якщо отримали 401 і це не повторний запит
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Спробуємо оновити токен
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              token: refreshToken,
            });

            const { token, refreshToken: newRefreshToken } = response.data.data;
            
            // Перевіряємо, чи токени є рядками
            if (typeof token !== 'string') {
              throw new Error('Invalid token format');
            }
            if (typeof newRefreshToken !== 'string') {
              throw new Error('Invalid refreshToken format');
            }
            
            // Оновлюємо токени
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Повторюємо оригінальний запит
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Якщо не вдалося оновити токен, перенаправляємо на логін
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // НЕ перенаправляємо автоматично - компоненти самі вирішують
          console.warn('Authentication failed. Tokens removed. Manual redirect required.');
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Обробка помилок
    if (error.response?.status === 400) {
      const message = (error.response.data as any)?.message || 'Невірні дані';
      toast.error(message);
    } else if (error.response?.status === 403) {
      toast.error('Доступ заборонено');
    } else if (error.response?.status === 404) {
      toast.error('Ресурс не знайдено');
    } else if (error.response && error.response.status >= 500) {
      toast.error('Помилка сервера. Спробуйте пізніше.');
    }

    return Promise.reject(error);
  }
);

// API для аутентифікації
export const authApi = {
  // Реєстрація
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'candidate' | 'employer';
  }) => api.post('/auth/register', {
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role
  }),

  // Вхід
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // Оновлення токена
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { token: refreshToken }),

  // Вихід
  logout: () => api.post('/auth/logout'),

  // Отримання профілю
  getProfile: () => api.get('/auth/profile'),

  // Оновлення профілю
  updateProfile: (userData: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    bio: string;
    title: string;
    companyName: string;
    linkedin: string;
    facebook: string;
    github: string;
    website: string;
    avatar: string;
  }>) => api.put('/auth/profile', userData),

  // Зміна пароля
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    }),

  // Забули пароль
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  // Скидання пароля
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', {
      token,
      newPassword,
    }),

  // Підтвердження email
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
};

// API для вакансій
export const jobsApi = {
  // Отримання списку вакансій
  getJobs: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    category?: string;
    experience_level?: string;
    employment_type?: string;
    work_type?: string;
    salary_min?: number;
    salary_max?: number;
  }) => api.get('/jobs', { params }),

  // Отримання вакансії за ID
  getJob: (id: string) => api.get(`/jobs/${id}`),

  // Створення вакансії
  createJob: (jobData: any) => api.post('/jobs', jobData),

  // Оновлення вакансії
  updateJob: (id: string, jobData: any) => api.put(`/jobs/${id}`, jobData),

  // Видалення вакансії
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),

  // Подача заявки на вакансію
  applyToJob: (jobId: string, applicationData: {
    cover_letter?: string;
    resume_url?: string;
    expected_salary?: number;
  }) => api.post(`/jobs/${jobId}/apply`, applicationData),

  // Отримання вакансій створених користувачем
  getMyCreatedJobs: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    location?: string;
  }) => api.get('/jobs/my-created', { params }),
};

// API для інтерв'ю
export const interviewsApi = {
  // Отримання списку інтерв'ю
  getInterviews: (params?: {
    search?: string;
    type?: string;
    status?: string;
    result?: string;
    applicationId?: string;
    candidateId?: string;
    jobId?: string;
    interviewerId?: string;
    createdById?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => api.get('/interviews', { params }),

  // Отримання інтерв'ю за ID
  getInterview: (id: string) => api.get(`/interviews/${id}`),

  // Створення інтерв'ю
  createInterview: (interviewData: any) => api.post('/interviews', interviewData),

  // Оновлення інтерв'ю
  updateInterview: (id: string, interviewData: any) => api.put(`/interviews/${id}`, interviewData),

  // Видалення інтерв'ю
  deleteInterview: (id: string) => api.delete(`/interviews/${id}`),

  // Додавання відгуку про інтерв'ю
  addFeedback: (id: string, feedbackData: any) => api.post(`/interviews/${id}/feedback`, feedbackData),

  // Оновлення статусу інтерв'ю
  updateStatus: (id: string, statusData: any) => api.patch(`/interviews/${id}/status`, statusData),

  // Отримання календаря інтерв'ю
  getCalendar: (params: {
    startDate: string;
    endDate: string;
    type?: string;
    status?: string;
    interviewerId?: string;
  }) => api.get('/interviews/calendar/events', { params }),

  // Отримання статистики інтерв'ю
  getStats: (params?: {
    period?: string;
    status?: string;
    type?: string;
    applicationId?: string;
    candidateId?: string;
    jobId?: string;
    interviewerId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/interviews/stats/overview', { params }),
};

// API для кандидатів
export const candidatesApi = {
  // Отримання списку кандидатів
  getCandidates: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    skills?: string[];
    experience_level?: string;
    availability?: string;
  }) => api.get('/candidates', { params }),

  // Отримання кандидата за ID
  getCandidate: (id: string) => api.get(`/candidates/${id}`),

  // Оновлення профілю кандидата
  updateCandidateProfile: (id: string, profileData: any) =>
    api.put(`/candidates/${id}`, profileData),

  // Отримання профілю поточного користувача
  getMyProfile: () => api.get('/candidates/profile'),

  // Оновлення профілю поточного користувача
  updateMyProfile: (profileData: any) =>
    api.put('/candidates/profile', profileData),
};

// API для компаній
export const companiesApi = {
  // Отримання списку компаній
  getCompanies: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
    size?: string;
    location?: string;
  }) => api.get('/companies', { params }),

  // Отримання компанії за ID
  getCompany: (id: string) => api.get(`/companies/${id}`),

  // Створення компанії
  createCompany: (companyData: any) => api.post('/companies', companyData),

  // Оновлення компанії
  updateCompany: (id: string, companyData: any) =>
    api.put(`/companies/${id}`, companyData),

  // Отримання профілю поточної компанії
  getMyCompany: () => api.get('/companies/profile'),

  // Оновлення профілю поточної компанії
  updateMyCompany: (companyData: any) =>
    api.put('/companies/profile', companyData),

  // Отримання статистики вакансій компанії
  getCompanyJobsStats: (companyId: string) =>
    api.get(`/companies/${companyId}/jobs-stats`),
};

// API для користувачів компанії
export const companyUsersApi = {
  // Отримання користувачів компанії
  getCompanyUsers: (companyId: string, params?: {
    role?: string;
    status?: string;
    search?: string;
  }) => api.get(`/company-users/company/${companyId}/users`, { params }),

  // Отримання користувача за ID
  getCompanyUserById: (id: string) => api.get(`/company-users/users/${id}`),

  // Запрошення користувача
  inviteUser: (companyId: string, userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    department?: string;
    role?: string;
    permissions?: any;
  }) => api.post(`/company-users/company/${companyId}/users/invite`, userData),

  // Оновлення користувача
  updateCompanyUser: (id: string, updateData: any) =>
    api.put(`/company-users/users/${id}`, updateData),

  // Видалення користувача
  removeCompanyUser: (id: string) => api.delete(`/company-users/users/${id}`),

  // Оновлення прав
  updatePermissions: (id: string, permissions: any) =>
    api.patch(`/company-users/users/${id}/permissions`, { permissions }),

  // Прийняття запрошення
  acceptInvitation: (id: string) => api.post(`/company-users/users/${id}/accept`),

  // Відхилення запрошення
  rejectInvitation: (id: string) => api.post(`/company-users/users/${id}/reject`),
};

// API для заявок
export const applicationsApi = {
  // Отримання списку заявок
  getApplications: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    job_id?: string;
    candidate_id?: string;
  }) => api.get('/applications', { params }),

  // Отримання заявки за ID
  getApplication: (id: string) => api.get(`/applications/${id}`),

  // Оновлення статусу заявки
  updateApplicationStatus: (id: string, status: string, feedback?: string) =>
    api.put(`/applications/${id}/status`, { status, feedback }),

  // Отримання заявок поточної компанії
  getMyCompanyApplications: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    job_id?: string;
  }) => api.get('/applications/company', { params }),

  // Отримання заявок поточного кандидата
  getMyApplications: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/applications/my', { params }),
};

// API для AI сервісів
export const aiApi = {
  // AI матчинг
  matchJobCandidate: (jobId: string, candidateId: string) =>
    api.post('/ai/match', { job_id: jobId, candidate_id: candidateId }),

  // Оцінка навичок
  assessSkills: (candidateId: string, skills: string[]) =>
    api.post('/ai/assess', { candidate_id: candidateId, skills }),

  // Автоматичне інтерв'ю
  generateInterview: (jobId: string, candidateId: string) =>
    api.post('/ai/interview', { job_id: jobId, candidate_id: candidateId }),
};

// API для платіжів
export const paymentsApi = {
  // Отримання списку платежів
  getPayments: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => api.get('/payments', { params }),

  // Створення платежу
  createPayment: (paymentData: any) => api.post('/payments', paymentData),

  // Отримання платежу за ID
  getPayment: (id: string) => api.get(`/payments/${id}`),

  // Підтвердження платежу
  confirmPayment: (id: string) => api.post(`/payments/${id}/confirm`),
};

// API для підписок
export const subscriptionsApi = {
  // Отримання поточної підписки
  getCurrentSubscription: () => api.get('/subscriptions/current'),

  // Створення підписки
  createSubscription: (subscriptionData: any) =>
    api.post('/subscriptions', subscriptionData),

  // Оновлення підписки
  updateSubscription: (id: string, subscriptionData: any) =>
    api.put(`/subscriptions/${id}`, subscriptionData),

  // Скасування підписки
  cancelSubscription: (id: string) => api.post(`/subscriptions/${id}/cancel`),
};

// API для сповіщень
export const notificationApi = {
  // Отримання всіх сповіщень користувача
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => api.get('/notifications', { params }),

  // Отримання кількості непрочитаних сповіщень
  getUnreadCount: () => api.get('/notifications/unread-count'),

  // Позначення сповіщення як прочитане
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

  // Позначення всіх сповіщень як прочитані
  markAllAsRead: () => api.put('/notifications/mark-all-read'),

  // Видалення сповіщення
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),

  // Налаштування сповіщень
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (settings: any) => api.put('/notifications/settings', settings),
};

// Експортуємо основний API інстанс
export default api;
