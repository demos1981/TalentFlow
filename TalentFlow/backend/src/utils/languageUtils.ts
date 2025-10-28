// Підтримувані мови
export const SUPPORTED_LANGUAGES = ['uk', 'en', 'de', 'fr', 'es', 'it', 'pl', 'ru', 'cs', 'pt'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Функція для отримання мови з запиту
export function getLanguageFromRequest(req: any): SupportedLanguage {
  // Спочатку перевіряємо query параметр
  if (req.query?.language && SUPPORTED_LANGUAGES.includes(req.query.language as SupportedLanguage)) {
    return req.query.language as SupportedLanguage;
  }
  
  // Потім перевіряємо заголовок Accept-Language
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const primaryLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(primaryLang as SupportedLanguage)) {
      return primaryLang as SupportedLanguage;
    }
  }
  
  // За замовчуванням українська
  return 'uk';
}

// Функція для валідації мови
export function isValidLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}

// Функція для отримання назви мови
export const languageNames: Record<SupportedLanguage, string> = {
  uk: 'Українська',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
  ru: 'Русский',
  cs: 'Čeština',
  pt: 'Português'
};

export function getLanguageName(language: SupportedLanguage): string {
  return languageNames[language] || language;
}
