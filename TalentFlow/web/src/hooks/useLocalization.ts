import { useLanguage } from '../contexts/LanguageContext';

export const useLocalization = () => {
  const { currentLanguage, setLanguage, t, supportedLanguages, isRTL } = useLanguage();

  // Format date according to current language
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = getLocaleForLanguage(currentLanguage);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return dateObj.toLocaleDateString(locale, options || defaultOptions);
  };

  // Format time according to current language
  const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = getLocaleForLanguage(currentLanguage);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    return dateObj.toLocaleTimeString(locale, options || defaultOptions);
  };

  // Format number according to current language
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    const locale = getLocaleForLanguage(currentLanguage);
    
    const defaultOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };

    return new Intl.NumberFormat(locale, options || defaultOptions).format(num);
  };

  // Format currency according to current language
  const formatCurrency = (amount: number, currency = 'USD', options?: Intl.NumberFormatOptions) => {
    const locale = getLocaleForLanguage(currentLanguage);
    
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    return new Intl.NumberFormat(locale, options || defaultOptions).format(amount);
  };

  // Get locale string for specific language
  const getLocaleForLanguage = (language: string): string => {
    const localeMap: Record<string, string> = {
      en: 'en-US',
      pt: 'pt-BR',
      fr: 'fr-FR',
      uk: 'uk-UA',
      ru: 'ru-RU',
      de: 'de-DE',
      pl: 'pl-PL',
      cs: 'cs-CZ'
    };

    return localeMap[language] || 'en-US';
  };

  // Get current locale
  const getCurrentLocale = () => getLocaleForLanguage(currentLanguage);

  // Check if language is supported
  const isLanguageSupported = (language: string) => {
    return supportedLanguages.some(lang => lang.code === language);
  };

  // Get language info by code
  const getLanguageInfo = (languageCode: string) => {
    return supportedLanguages.find(lang => lang.code === languageCode);
  };

  // Get direction for current language
  const getTextDirection = () => isRTL ? 'rtl' : 'ltr';

  return {
    currentLanguage,
    setLanguage,
    t,
    supportedLanguages,
    isRTL,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    getCurrentLocale,
    isLanguageSupported,
    getLanguageInfo,
    getTextDirection
  };
};

export default useLocalization;
