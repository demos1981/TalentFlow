import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark' | 'system';
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

// Функція для отримання реальної теми
const getActualTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme as 'light' | 'dark';
};

export const useThemeStore = create<ThemeState & ThemeActions>()((set, get) => ({
      // Початковий стан
      theme: 'light',
      actualTheme: 'light',

      // Дії
      setTheme: (newTheme: Theme) => {
        const realTheme = getActualTheme(newTheme);
        
        set({ 
          theme: newTheme, 
          actualTheme: realTheme
        });
        
        // Оновлюємо DOM
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', realTheme);
          document.documentElement.classList.toggle('dark', realTheme === 'dark');
        }
      },

      toggleTheme: () => {
        const themes: Theme[] = ['light', 'dark', 'system'];
        const { theme } = get();
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        get().setTheme(themes[nextIndex]);
      },

      initializeTheme: () => {
        if (typeof window === 'undefined') return;
        
        const savedTheme = localStorage.getItem('theme') as Theme;
        
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          get().setTheme(savedTheme);
        } else {
          get().setTheme('light');
        }
        
        // Слухаємо зміни системної теми
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
          const { theme } = get();
          if (theme === 'system') {
            const realTheme = getActualTheme(theme);
            set({ actualTheme: realTheme });
            document.documentElement.setAttribute('data-theme', realTheme);
            document.documentElement.classList.toggle('dark', realTheme === 'dark');
          }
        };

        mediaQuery.addEventListener('change', handleChange);
      },
}));