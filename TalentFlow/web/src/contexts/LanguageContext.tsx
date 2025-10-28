import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Типи
export type Language = 'en' | 'pt' | 'fr' | 'uk' | 'ru' | 'de' | 'pl' | 'cs';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  markets: string;
  population: string;
  gdp: string;
}

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
  }
];

// RTL мови
const rtlLanguages: Language[] = [];

// Переклади
import { translations } from '../locales/translations';

// Контекст
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, any>) => string;
  supportedLanguages: LanguageInfo[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Хук для використання контексту
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Провайдер
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізація тільки один раз
  useEffect(() => {
    if (isInitialized) return;
    
    const savedLanguage = localStorage.getItem('talentflow-language') as Language;
    
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      const browserLanguage = navigator.language.split('-')[0] as Language;
      if (supportedLanguages.some(lang => lang.code === browserLanguage)) {
        setCurrentLanguage(browserLanguage);
        localStorage.setItem('talentflow-language', browserLanguage);
      } else {
        localStorage.setItem('talentflow-language', 'en');
      }
    }
    
    setIsInitialized(true);
  }, [isInitialized]);

  const setLanguage = useCallback((language: Language) => {
    // Зберігаємо в localStorage
    localStorage.setItem('talentflow-language', language);
    
    // Оновлюємо стан
    setCurrentLanguage(language);
    
    // Оновлюємо HTML атрибути
    document.documentElement.lang = language;
    const isRTL = rtlLanguages.includes(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: keyof typeof translations.en, params?: Record<string, any>): string => {
    let translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
    
    // Заміна параметрів в перекладі
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    
    return translation;
  }, [currentLanguage]);

  const isRTL = rtlLanguages.includes(currentLanguage);

  // Оновлення HTML атрибутів при зміні мови
  useEffect(() => {
    if (!isInitialized) return;
    
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [currentLanguage, isRTL, isInitialized]);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    supportedLanguages,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
