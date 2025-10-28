import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    // Для локальної розробки завжди використовуємо localhost
    const baseURL = import.meta.env.DEV 
      ? 'http://localhost:3000/api'
      : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api');
      
    console.log('API Client: baseURL:', baseURL);
    
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor для додавання токену аутентифікації
    this.instance.interceptors.request.use(
      (config) => {
        // Завжди читаємо токен з localStorage (не кешуємо)
        const token = localStorage.getItem('accessToken');
        console.log('🔐 Request interceptor - Token:', token ? 'EXISTS' : 'NOT FOUND');
        console.log('🔐 Request interceptor - URL:', config.url);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Request interceptor - Authorization header set');
        } else {
          console.log('🔐 Request interceptor - No token, no Authorization header');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor для обробки помилок
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('📡 Response received:', { 
          status: response.status, 
          url: response.config.url,
          dataType: typeof response.data,
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : 'no data'
        });
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Токен недійсний або відсутній
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Сервер відповів з кодом помилки
      return {
        message: error.response.data?.message || 'Помилка сервера',
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        details: error.response.data,
      };
    } else if (error.request) {
      // Запит було відправлено, але відповіді не отримано
      return {
        message: 'Не вдалося зв\'язатися з сервером',
        code: 'NETWORK_ERROR',
        details: error.request,
      };
    } else {
      // Помилка в налаштуванні запиту
      return {
        message: error.message || 'Невідома помилка',
        code: 'REQUEST_ERROR',
        details: error,
      };
    }
  }

  // GET запит
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Додаткова перевірка токена
    const token = localStorage.getItem('accessToken');
    console.log('🔐 GET request - Token check:', token ? 'EXISTS' : 'NOT FOUND');
    console.log('🌐 GET request to:', url);
    
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  // POST запит
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  // PUT запит
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  // Метод для оновлення токена (викликається після реєстрації/логіну)
  updateAuthToken(): void {
    console.log('🔐 ApiClient: Updating auth token...');
    const token = localStorage.getItem('accessToken');
    console.log('🔐 ApiClient: New token:', token ? 'EXISTS' : 'NOT FOUND');
  }

  // PATCH запит
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE запит
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Отримати raw instance для спеціальних випадків
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Створюємо та експортуємо єдиний екземпляр
export const apiClient = new ApiClient();
export default apiClient;
export type { ApiError };
