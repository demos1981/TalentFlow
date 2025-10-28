import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'employer' | 'admin';
  avatar_url?: string;
  is_verified: boolean;
  is_premium: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  // Аутентифікація
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: string, token: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  
  // Профіль
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updateAvatar: (avatarUrl: string) => void;
  
  // Стан
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Верифікація
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  
  // Скидання пароля
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  // Оновлення токена
  refreshToken: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'employer';
  phone?: string;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Початковий стан
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Аутентифікація
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Реальний API запит
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Невірний email або пароль');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка входу',
            isLoading: false,
          });
          throw error;
        }
      },

      loginWithOAuth: async (provider: string, token: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Реальний API запит
          const response = await fetch('/api/auth/oauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, token }),
          });

          if (!response.ok) {
            throw new Error('Помилка OAuth аутентифікації');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка OAuth входу',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Реальний API запит
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Помилка реєстрації');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка реєстрації',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        
        // TODO: Виклик API для logout
        fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
      },

      // Профіль
      updateProfile: async (profileData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const { user, token } = get();
          if (!user || !token) {
            throw new Error('Не авторизовано');
          }

          // TODO: Реальний API запит
          const response = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
          });

          if (!response.ok) {
            throw new Error('Помилка оновлення профілю');
          }

          const updatedUser = await response.json();
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка оновлення профілю',
            isLoading: false,
          });
          throw error;
        }
      },

      updateAvatar: (avatarUrl: string) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, avatar_url: avatarUrl },
          });
        }
      },

      // Стан
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // Верифікація
      verifyEmail: async (token: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Реальний API запит
          const response = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error('Невірний токен верифікації');
          }

          const { user } = get();
          if (user) {
            set({
              user: { ...user, is_verified: true },
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка верифікації',
            isLoading: false,
          });
          throw error;
        }
      },

      resendVerification: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { user } = get();
          if (!user) {
            throw new Error('Не авторизовано');
          }

          // TODO: Реальний API запит
          const response = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          });

          if (!response.ok) {
            throw new Error('Помилка повторної відправки');
          }

          set({ isLoading: false, error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка повторної відправки',
            isLoading: false,
          });
          throw error;
        }
      },

      // Скидання пароля
      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Реальний API запит
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            throw new Error('Помилка відправки email');
          }

          set({ isLoading: false, error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка відправки email',
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Реальний API запит
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword }),
          });

          if (!response.ok) {
            throw new Error('Помилка скидання пароля');
          }

          set({ isLoading: false, error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка скидання пароля',
            isLoading: false,
          });
          throw error;
        }
      },

      // Оновлення токена
      refreshToken: async () => {
        try {
          const { token } = get();
          if (!token) {
            throw new Error('Немає токена для оновлення');
          }

          // TODO: Реальний API запит
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error('Помилка оновлення токена');
          }

          const data = await response.json();
          
          set({
            token: data.token,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка оновлення токена',
          });
          
          // Якщо не вдалося оновити токен, розлогінюємо користувача
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
