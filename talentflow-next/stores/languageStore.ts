import { create } from 'zustand';
import { translations } from '../locales/index';

// Типи
export type Language = 'en' | 'pt' | 'fr' | 'uk' | 'ru' | 'de' | 'pl' | 'cs' | 'kk' | 'az' | 'es';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  markets: string;
  population: string;
  gdp: string;
}

// Helper function to get flag with fallback
const getFlag = (emoji: string, fallback: string) => {
  // Check if emoji is supported
  if (typeof navigator !== 'undefined' && 'services' in navigator) {
    return emoji;
  }
  return fallback;
};

// Підтримувані мови
export const supportedLanguages: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    markets: 'US/UK/International',
    population: '1.5B',
    gdp: '$45T'
  },
  {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português',
    flag: '🇵🇹',
    markets: 'Portugal/Brazil',
    population: '260M',
    gdp: '$3.2T'
  },
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    markets: 'France/Canada',
    population: '300M',
    gdp: '$4.8T'
  },
  {
    code: 'uk',
    name: 'Українська',
    nativeName: 'Українська',
    flag: '🇺🇦',
    markets: 'Ukraine',
    population: '40M',
    gdp: '$160B'
  },
  {
    code: 'ru',
    name: 'Русский',
    nativeName: 'Русский',
    flag: '🇷🇺',
    markets: 'Russia/CIS',
    population: '260M',
    gdp: '$2.1T'
  },
  {
    code: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    markets: 'Germany/Austria',
    population: '100M',
    gdp: '$5.2T'
  },
  {
    code: 'pl',
    name: 'Polski',
    nativeName: 'Polski',
    flag: '🇵🇱',
    markets: 'Poland',
    population: '40M',
    gdp: '$688B'
  },
  {
    code: 'cs',
    name: 'Čeština',
    nativeName: 'Čeština',
    flag: '🇨🇿',
    markets: 'Czech Republic',
    population: '10M',
    gdp: '$290B'
  },
  {
    code: 'kk',
    name: 'Kazakh',
    nativeName: 'Қазақша',
    flag: '🇰🇿',
    markets: 'Kazakhstan',
    population: '19M',
    gdp: '$220B'
  },
  {
    code: 'az',
    name: 'Azerbaijani',
    nativeName: 'Azərbaycan',
    flag: '🇦🇿',
    markets: 'Azerbaijan',
    population: '10M',
    gdp: '$54B'
  },
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    markets: 'Spain/Latin America',
    population: '580M',
    gdp: '$6.8T'
  }
];

// RTL мови
const rtlLanguages: Language[] = [];

interface LanguageState {
  currentLanguage: Language;
  isRTL: boolean;
  languages: LanguageInfo[];
}

interface LanguageActions {
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, any>) => string;
  initializeLanguage: () => void;
}

export const useLanguageStore = create<LanguageState & LanguageActions>()((set, get) => ({
      // Початковий стан - завжди англійська
      currentLanguage: 'en',
      isRTL: false,
      languages: supportedLanguages,

      // Дії
      setLanguage: (language: Language) => {
        set({ 
          currentLanguage: language,
          isRTL: rtlLanguages.includes(language)
        });
        
        // Зберігаємо мову в localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('talentflow-language', language);
          document.documentElement.lang = language;
          document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
        }
      },

    t: (key: keyof typeof translations.en, params?: Record<string, any>): string => {
      const { currentLanguage } = get();
      
      let translation = (translations[currentLanguage] as any)?.[key] || (translations.en as any)[key] || key;
      
      // Заміна параметрів в перекладі
      if (params) {
        Object.keys(params).forEach(paramKey => {
          translation = translation.replace(`{${paramKey}}`, params[paramKey]);
        });
      }
      
      return translation;
    },

      initializeLanguage: () => {
        if (typeof window === 'undefined') {
          return;
        }
        
        const savedLanguage = localStorage.getItem('talentflow-language') as Language;
        
        if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
          // Встановлюємо збережену мову без повторного збереження в localStorage
          set({ 
            currentLanguage: savedLanguage,
            isRTL: rtlLanguages.includes(savedLanguage)
          });
          
          // Оновлюємо HTML атрибути
          document.documentElement.lang = savedLanguage;
          document.documentElement.dir = rtlLanguages.includes(savedLanguage) ? 'rtl' : 'ltr';
        } else {
          // Визначаємо мову браузера для незареєстрованих користувачів
          const browserLanguage = navigator.language.split('-')[0] as Language;
          const detectedLanguage = supportedLanguages.some(lang => lang.code === browserLanguage) 
            ? browserLanguage 
            : 'en';
          
          set({ 
            currentLanguage: detectedLanguage,
            isRTL: rtlLanguages.includes(detectedLanguage)
          });
          
          // Оновлюємо HTML атрибути
          document.documentElement.lang = detectedLanguage;
          document.documentElement.dir = rtlLanguages.includes(detectedLanguage) ? 'rtl' : 'ltr';
        }
      },
}));
