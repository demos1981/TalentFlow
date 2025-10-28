import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Базовий URL API - проста логіка
const getApiBaseUrl = () => {
  // Якщо localhost - локальний backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // Інакше - production Railway backend
  return 'https://talentflow-backend-production.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();

// Логуємо для діагностики
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📍 Current hostname:', window.location.hostname);
console.log('🔧 Environment:', window.location.hostname === 'localhost' ? 'Development (Local)' : 'Production (Railway)');

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
    const token = localStorage.getItem('accessToken');
    console.log('🔐 API interceptor - Token:', token ? 'EXISTS' : 'NOT FOUND');
    console.log('🔐 API interceptor - URL:', config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 API interceptor - Authorization header set');
    } else {
      console.log('🔐 API interceptor - No token, no Authorization header');
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
    console.log('🔐 Response interceptor - Error status:', error.response?.status);
    console.log('🔐 Response interceptor - Error URL:', error.config?.url);
    
    const originalRequest = error.config as any;

    // Якщо отримали 401 і це не повторний запит
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Спробуємо оновити токен
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          // Оновлюємо токени
          localStorage.setItem('accessToken', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Повторюємо оригінальний запит
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Якщо не вдалося оновити токен, перенаправляємо на логін
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Перенаправляємо на сторінку логіну
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
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
    } else if (error.response?.status >= 500) {
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
    api.post('/auth/refresh', { refreshToken }),

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
