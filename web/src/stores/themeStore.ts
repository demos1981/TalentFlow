import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  isDark: boolean;
}

export interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getSystemTheme: () => 'light' | 'dark';
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Початковий стан
      theme: 'system',
      isDark: false,

      // Встановлення теми
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Визначення реальної теми
        let isDark = false;
        
        if (theme === 'system') {
          isDark = get().getSystemTheme() === 'dark';
        } else {
          isDark = theme === 'dark';
        }
        
        set({ isDark });
        
        // Застосування теми до DOM
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(isDark ? 'dark' : 'light');
      },

      // Перемикання теми
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Отримання системної теми
      getSystemTheme: () => {
        if (typeof window === 'undefined') return 'light';
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Ініціалізація теми при завантаженні
if (typeof window !== 'undefined') {
  const { setTheme, getSystemTheme } = useThemeStore.getState();
  
  // Встановлення початкової теми
  setTheme('system');
  
  // Слухання змін системної теми
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    const currentTheme = useThemeStore.getState().theme;
    if (currentTheme === 'system') {
      const systemTheme = getSystemTheme();
      useThemeStore.setState({ isDark: systemTheme === 'dark' });
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Очищення при unmount
  window.addEventListener('beforeunload', () => {
    mediaQuery.removeEventListener('change', handleChange);
  });
}
