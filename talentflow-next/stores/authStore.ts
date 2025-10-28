import { create } from 'zustand';
import { authApi } from '../services/api';

// Типи
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'candidate' | 'employer' | 'admin';
  company?: string;
  companyId?: string;
  companyName?: string;
  title?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  canPostJobs?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRedirecting: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ user: User } | undefined>;
  register: (userData: RegisterData) => Promise<{ user: User } | undefined>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  setAuthFromToken: (token: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  forceInitialized: () => void;
  setRedirecting: (redirecting: boolean) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  role: 'candidate' | 'employer';
}

// Глобальний флаг для запобігання зациклюванню
let globalRedirectLock = false;
let globalInitializationLock = false;

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
      // Початковий стан
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isRedirecting: false,

      // Дії
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
      
      setRedirecting: (redirecting: boolean) => set({ isRedirecting: redirecting }),

      checkAuth: async () => {
        if (typeof window === 'undefined') return;
        
        // Не перевіряємо авторизацію на сторінці авторизації
        if (window.location.pathname === '/auth') {
          set({ isLoading: false });
          return;
        }
        
        // Додатковий захист від зациклювання
        const currentState = get();
        if (currentState.isLoading || currentState.isRedirecting || globalRedirectLock || globalInitializationLock) {
          return;
        }
        
        // Встановлюємо глобальний замок
        globalRedirectLock = true;
        globalInitializationLock = true;
        
        try {
          set({ isLoading: true });
          
          const token = localStorage.getItem('accessToken');
          if (token) {
            try {
              // Перевіряємо токен через API
              const response = await authApi.getProfile();
              const user = response.data.data;
              
              // Конвертуємо дані користувача в наш формат
              const userData: User = {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                company: user.companyName || user.company?.name || '',
                companyId: user.companyId,
                companyName: user.companyName,
                title: user.title || '',
                location: user.location || '',
                bio: user.bio,
                avatar: user.avatar,
                phone: user.phone,
                website: user.website,
                linkedin: user.linkedin,
                facebook: user.facebook,
                github: user.github,
                skills: user.skills || [],
                experience: user.experience,
                education: user.education,
                canPostJobs: user.role === 'employer',
              };
              
              // Оновлюємо дані в localStorage
              localStorage.setItem('userData', JSON.stringify(userData));
              
              set({
                user: userData, 
                isAuthenticated: true,
                isLoading: false,
                error: null 
              });
              
              // Скидаємо глобальний замок
              globalRedirectLock = false;
              globalInitializationLock = false;
            } catch (apiError) {
              // Якщо API повернув помилку, очищаємо токени
              console.error('❌ Auth check API error:', apiError);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userData');
              set({ 
                user: null, 
                isAuthenticated: false, 
                isLoading: false, 
                error: 'Authentication failed' 
              });
              
              // Скидаємо глобальний замок
              globalRedirectLock = false;
              globalInitializationLock = false;
            }
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false, 
              error: null 
            });
            
            // Скидаємо глобальний замок
            globalRedirectLock = false;
          }
        } catch (error) {
          console.error('❌ Auth check error:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          set({
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: 'Authentication check failed' 
          });
          
          // Скидаємо глобальний замок
          globalRedirectLock = false;
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Викликаємо реальний API
          const response = await authApi.login(email, password);
          
          // Перевіряємо success поле
          if (!response.data.success) {
            // Якщо success: false, встановлюємо помилку
            const invalidError = response.data.invalidError;
            set({
              user: null, 
              isAuthenticated: false, 
              isLoading: false,
              error: invalidError || 'Login failed'
            });
            return;
          }
          
          const { user, token, refreshToken } = response.data.data;
          
          // Конвертуємо дані користувача в наш формат
          const userData: User = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            company: user.companyName || user.company?.name || '',
            companyId: user.companyId,
            companyName: user.companyName,
            title: user.title || '',
            location: user.location || '',
            bio: user.bio,
            avatar: user.avatar,
            phone: user.phone,
            website: user.website,
            linkedin: user.linkedin,
            facebook: user.facebook,
            github: user.github,
            skills: user.skills || [],
            experience: user.experience,
            education: user.education,
            canPostJobs: user.role === 'employer',
          };
          
          // Зберігаємо токени та дані користувача
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userData', JSON.stringify(userData));
          }
          
          set({
            user: userData, 
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
          
          // Повертаємо дані користувача для редиректу
          return { user: userData };
          
          // Автоматично встановлюємо авторизацію з токеном
          // await get().setAuthFromToken(token);
          
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Помилка входу';
          set({
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: errorMessage 
          });
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          
          // Викликаємо реальний API
          const response = await authApi.register({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role
          });
          
          const { user, token, refreshToken } = response.data.data;
          
          // Конвертуємо дані користувача в наш формат
          const newUser: User = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            company: user.companyName || user.company?.name || userData.company || '',
            companyId: user.companyId,
            companyName: user.companyName,
            title: user.title || (user.role === 'employer' ? 'HR Manager' : 'Developer'),
            location: user.location || 'Київ, Україна',
            bio: user.bio,
            avatar: user.avatar,
            phone: user.phone,
            website: user.website,
            linkedin: user.linkedin,
            facebook: user.facebook,
            github: user.github,
            skills: user.skills || [],
            experience: user.experience,
            education: user.education,
            canPostJobs: user.role === 'employer',
          };
          
          // Зберігаємо токени та дані користувача
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userData', JSON.stringify(newUser));
          }
          
          set({
            user: newUser, 
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
          
          // Повертаємо дані користувача для редиректу
          return { user: newUser };
          
          // Автоматично встановлюємо авторизацію з токеном
          // await get().setAuthFromToken(token);
          
        } catch (error: any) {
          console.error('Register error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Помилка реєстрації';
          set({
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: errorMessage 
          });
        }
      },

      logout: async () => {
        try {
          // Викликаємо API для logout тільки якщо є токен
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          if (token) {
            await authApi.logout();
          }
        } catch (error) {
          console.warn('Logout API error (ignoring):', error);
          // Продовжуємо з локальним logout навіть якщо API не спрацював
        }
        
        // Очищаємо локальні дані
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
        }
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false, 
          error: null 
        });
        
        // Перенаправляємо на головну сторінку
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        try {
          const currentUser = get().user;
          if (currentUser) {
            // Розбиваємо name на firstName та lastName якщо потрібно
            let firstName = userData.firstName;
            let lastName = userData.lastName;
            
            if (userData.name && !firstName && !lastName) {
              const nameParts = userData.name.trim().split(' ');
              firstName = nameParts[0];
              lastName = nameParts.slice(1).join(' ') || nameParts[0];
            }
            
            // Викликаємо API для оновлення профілю
            const response = await authApi.updateProfile({
              firstName: firstName,
              lastName: lastName,
              phone: userData.phone,
              location: userData.location,
              bio: userData.bio,
              title: userData.title,
              companyName: userData.company,
              linkedin: userData.linkedin,
              facebook: userData.facebook,
              github: userData.github,
              website: userData.website,
              avatar: userData.avatar,
            });
            
            const updatedUserData = response.data.data;
            
            // Конвертуємо дані користувача в наш формат
            const updatedUser: User = {
              ...currentUser,
              firstName: updatedUserData.firstName || firstName,
              lastName: updatedUserData.lastName || lastName,
              name: `${updatedUserData.firstName || firstName} ${updatedUserData.lastName || lastName}`,
              phone: updatedUserData.phone,
              location: updatedUserData.location,
              bio: updatedUserData.bio,
              title: updatedUserData.title,
              company: updatedUserData.companyName || updatedUserData.company?.name,
              companyId: updatedUserData.companyId,
              companyName: updatedUserData.companyName,
              linkedin: updatedUserData.linkedin,
              facebook: updatedUserData.facebook,
              github: updatedUserData.github,
              website: updatedUserData.website,
              avatar: updatedUserData.avatar || userData.avatar || currentUser.avatar,
            };
            
            // Оновлюємо в localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('userData', JSON.stringify(updatedUser));
            }
            
            set({ user: updatedUser });
          }
        } catch (error: any) {
          console.error('Update profile error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Помилка оновлення профілю';
          set({ error: errorMessage });
          throw error; // Перекидаємо помилку, щоб компонент міг її обробити
        }
      },

      setAuthFromToken: async (token: string) => {
        try {
          // Декодуємо JWT токен для отримання userId
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Отримуємо повну інформацію про користувача з API
          const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api'}/auth/me`;
          
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Обробляємо різні типи помилок
            if (response.status === 401) {
              throw new Error('userNotAuthorized');
            } else if (response.status === 404) {
              throw new Error('userNotFound');
            } else if (response.status === 500) {
              throw new Error('serverError');
            } else {
              throw new Error(errorData.message || `serverError`);
            }
          }
          
          const userData = await response.json();
          
          // Створюємо користувача з даних API
          const userInfo = userData.data || userData;
          const fullName = (userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : '') ||
                          userInfo.name || '';
          
          const user: User = {
            id: userInfo.id || payload.userId || '1',
            email: userInfo.email || payload.email || 'user@example.com',
            name: fullName,
            firstName: userInfo.firstName || '',
            lastName: userInfo.lastName || '',
            role: userInfo.role || payload.role || 'employer',
            company: userInfo.company || 'OAuth Company',
            title: userInfo.title || 'User',
            location: userInfo.location || 'Unknown',
            avatar: userInfo.avatar || userInfo.picture,
            bio: userInfo.bio,
            phone: payload.phone,
            website: payload.website,
            linkedin: payload.linkedin,
            github: payload.github,
            skills: payload.skills,
            experience: payload.experience,
            education: payload.education,
          };
          
          // Зберігаємо токен та дані користувача
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userData', JSON.stringify(user));
          }
          
          set({
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          
        } catch (error: any) {
          console.error('setAuthFromToken: Error:', error);
          
          // Очищаємо токен з localStorage якщо він недійсний
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userData');
          }
          
          set({
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error.message || 'tokenProcessingError' 
          });
          throw error;
        }
      },

      forceInitialized: () => {
        set({ isLoading: false });
      },
}));