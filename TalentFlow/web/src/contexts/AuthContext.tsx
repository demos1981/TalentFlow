import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import { apiClient } from '../utils/apiClient';

// Типи
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'employer' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  canPostJobs?: boolean;
  canSearchCandidates?: boolean;
  canManageTeam?: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiry: number | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string; expiresIn: number } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'TOKEN_REFRESHED'; payload: { token: string; refreshToken: string; expiresIn: number } };

// Початковий стан
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokenExpiry: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: calculateUserPermissions(action.payload.user),
        isAuthenticated: true,
        isLoading: false,
        error: null,
        tokenExpiry: Date.now() + (action.payload.expiresIn * 1000),
      };
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        tokenExpiry: Date.now() + (action.payload.expiresIn * 1000),
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        tokenExpiry: null,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        tokenExpiry: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Функція для обчислення дозволів користувача
const calculateUserPermissions = (user: any) => {
  return {
    ...user,
    canPostJobs: user.role === 'employer' && user.isActive,
    canSearchCandidates: user.role === 'employer' && user.isActive,
    canManageTeam: user.role === 'employer' && user.isActive
  };
};

// Контекст
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setAuthToken: (token: string) => void;
  setAuthFromToken: (token: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'candidate' | 'employer';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Перевірка аутентифікації при завантаженні
  useEffect(() => {
    checkAuth();
  }, []);

  // Автоматичне перенаправлення при зміні стану аутентифікації
  useEffect(() => {
    if (state.isAuthenticated && window.location.pathname === '/auth') {
      navigate('/dashboard');
    } else if (!state.isAuthenticated && window.location.pathname.startsWith('/dashboard')) {
      navigate('/auth');
    }
  }, [state.isAuthenticated, navigate]);

  // Автоматичне оновлення токена перед закінченням
  useEffect(() => {
    if (!state.tokenExpiry) return;

    const timeUntilExpiry = state.tokenExpiry - Date.now();
    const refreshThreshold = 5 * 60 * 1000; // 5 хвилин до закінчення

    if (timeUntilExpiry <= refreshThreshold) {
      refreshToken();
    }

    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (state.tokenExpiry && currentTime >= state.tokenExpiry - refreshThreshold) {
        refreshToken();
      }
    }, 60000); // Перевіряємо кожну хвилину

    return () => clearInterval(interval);
  }, [state.tokenExpiry]);

  // Функції аутентифікації
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authApi.login(email, password);
      const { user, token, refreshToken, expiresIn } = response.data.data;
      
      // Зберігаємо токени
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user, token, refreshToken, expiresIn } 
      });
      
      // Оновлюємо токен в apiClient
      apiClient.updateAuthToken();
      
      toast.success('Успішний вхід!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Помилка входу';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authApi.register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.userType
      });
      const { user, token, refreshToken, expiresIn } = response.data.data;
      
      // Зберігаємо токени
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      console.log('🔐 Registration: Token saved to localStorage:', token);
      console.log('🔐 Registration: User data:', user);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user, token, refreshToken, expiresIn } 
      });
      
      console.log('🔐 Registration: State updated, checking localStorage...');
      console.log('🔐 Registration: localStorage accessToken:', localStorage.getItem('accessToken'));
      
      // Оновлюємо токен в apiClient
      apiClient.updateAuthToken();
      
      // Автоматично перевіряємо авторизацію після реєстрації
      await checkAuth();
      
      toast.success('Реєстрація успішна!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Помилка реєстрації';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Викликаємо logout на сервері
      if (state.isAuthenticated) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Очищаємо локальне зберігання
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Оновлюємо токен в apiClient (очищаємо)
      apiClient.updateAuthToken();
      
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Вихід виконано');
      navigate('/');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }

      const response = await authApi.refresh(refreshToken);
      const { token, refreshToken: newRefreshToken, expiresIn } = response.data.data;
      
      // Оновлюємо токени
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      dispatch({ 
        type: 'TOKEN_REFRESHED', 
        payload: { token, refreshToken: newRefreshToken, expiresIn } 
      });
      
      // Оновлюємо токен в apiClient
      apiClient.updateAuthToken();
      
      return true;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // Якщо refresh не вдався, виходимо з системи
      if (error.response?.status === 401) {
        await logout();
      }
      
      return false;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    console.log('checkAuth: token:', token);
    
    if (!token) {
      console.log('checkAuth: No token found');
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      console.log('checkAuth: Fetching profile...');
      
      const response = await authApi.getProfile();
      const user = response.data.data;
      console.log('checkAuth: User profile:', user);
      
      // Перевіряємо чи не закінчився токен
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        // Спробуємо оновити токен
        const refreshed = await refreshToken();
        if (!refreshed) {
          throw new Error('Token expired and refresh failed');
        }
      }
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: calculateUserPermissions(user), 
          token, 
          refreshToken: localStorage.getItem('refreshToken') || '', 
          expiresIn: 7 * 24 * 60 * 60 // 7 днів за замовчуванням
        } 
      });
      
      // Оновлюємо токен в apiClient
      apiClient.updateAuthToken();
      
      console.log('checkAuth: Auth success, user:', user);
    } catch (error: any) {
      console.error('checkAuth: Error:', error);
      // Якщо токен недійсний, видаляємо його
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      dispatch({ type: 'AUTH_FAILURE', payload: 'Сесія закінчилася' });
    }
  };

  const setAuthToken = (token: string) => {
    // Декодуємо JWT токен для отримання інформації про користувача
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.userId,
        email: payload.email,
        firstName: '', // Ці дані потрібно отримати з API
        lastName: '',
        role: payload.role,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      
      // Зберігаємо токен
      localStorage.setItem('accessToken', token);
      
      // Встановлюємо стан аутентифікації
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: calculateUserPermissions(user), 
          token, 
          refreshToken: '', 
          expiresIn: 7 * 24 * 60 * 60 // 7 днів за замовчуванням
        } 
      });
      
      // Оновлюємо токен в apiClient
      apiClient.updateAuthToken();
      
      toast.success('Успішний вхід через LinkedIn!');
    } catch (error) {
      console.error('Failed to set auth token:', error);
      toast.error('Помилка обробки токена авторизації');
    }
  };

  const setAuthFromToken = async (token: string) => {
    try {
      // Декодуємо JWT токен для отримання інформації про користувача
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Створюємо користувача з токена (як LinkedIn)
      const user: User = {
        id: payload.userId,
        email: payload.email,
        firstName: '', // Ці дані потрібно отримати з API
        lastName: '',
        role: payload.role,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      
      // Зберігаємо токен
      localStorage.setItem('accessToken', token);
      
      // Встановлюємо стан аутентифікації
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: calculateUserPermissions(user), 
          token, 
          refreshToken: '', 
          expiresIn: 7 * 24 * 60 * 60 // 7 днів за замовчуванням
        } 
      });
      
      toast.success('Успішний вхід через Google!');
    } catch (error) {
      console.error('Failed to set auth from token:', error);
      toast.error('Помилка обробки токена авторизації');
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuth,
    refreshToken,
    setAuthToken,
    setAuthFromToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для використання контексту
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
