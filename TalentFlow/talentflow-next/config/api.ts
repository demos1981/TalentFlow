// Базовий URL API - безпечний для SSR
const getApiBaseUrl = () => {
  // Спочатку перевіряємо змінні середовища
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Перевіряємо чи ми в браузері
  if (typeof window !== 'undefined') {
    // Якщо localhost - локальний backend (порт 3002)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3002/api';
    }
    
    // Інакше - production Railway backend
    return 'https://talentflow-production-50cc.up.railway.app/api';
  }
  
  // Якщо на сервері - використовуємо production URL
  return 'https://talentflow-production-50cc.up.railway.app/api';
};

export const API_BASE_URL = getApiBaseUrl();
