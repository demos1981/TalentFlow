// OAuth Configuration
export const OAUTH_CONFIG = {
  // API URLs - використовуємо єдину змінну
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api',
  
  // Frontend URL for OAuth callbacks
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  
  // OAuth Endpoints
  GOOGLE_AUTH_URL: '/api/auth/google',
  LINKEDIN_AUTH_URL: '/api/auth/linkedin',
  
  // Callback URLs
  CALLBACK_URL: '/auth/callback',
  
  // Environment
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Функція для отримання правильного API URL
export const getApiUrl = (): string => {
  const apiUrl = OAUTH_CONFIG.API_BASE_URL;
  
  console.log('OAuth Config:', {
    IS_PRODUCTION: OAUTH_CONFIG.IS_PRODUCTION,
    API_BASE_URL: OAUTH_CONFIG.API_BASE_URL,
    selected: apiUrl
  });
  
  return apiUrl;
};

// Функція для створення OAuth URL
export const getOAuthUrl = (provider: 'google' | 'linkedin'): string => {
  const apiUrl = getApiUrl();
  const authPath = provider === 'google' 
    ? OAUTH_CONFIG.GOOGLE_AUTH_URL 
    : OAUTH_CONFIG.LINKEDIN_AUTH_URL;
  
  const fullUrl = `${apiUrl}${authPath}`;
  console.log(`OAuth URL for ${provider}:`, fullUrl);
  
  return fullUrl;
};
