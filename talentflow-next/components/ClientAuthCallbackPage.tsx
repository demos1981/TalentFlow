'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { USER_TYPES } from '../constants';
import { ClientOnly } from './ClientOnly';

const ClientAuthCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthFromToken, user } = useAuthStore();
  const { t } = useLanguageStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams?.get('token');
        const error = searchParams?.get('error');

        if (error) {
          if (error === 'user_not_found') {
            // Перенаправляємо на реєстрацію з мінімальним повідомленням
            console.log('User not found, redirecting to registration');
            router.push('/auth?type=register&message=user_not_found');
            return;
          }
          
          setStatus('error');
          
          // Обробляємо інші помилки
          console.error('OAuth error:', error);
          let errorMessage = t('authError');
          if (error === 'invalid_grant') {
            errorMessage = t('invalidGrant');
          } else if (error === 'access_denied') {
            errorMessage = t('accessDenied');
          } else if (error === 'auth_failed') {
            errorMessage = t('authError');
          } else {
            errorMessage = t('authError') + ': ' + error;
          }
          
          setMessage(errorMessage);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage(t('authTokenNotFound'));
          return;
        }

        // Встановлюємо токен через контекст
        await setAuthFromToken(token);
        
        setStatus('success');
        setMessage(t('loginSuccess') + '! Перенаправлення...');
        
        // Перенаправляємо на dashboard через 2 секунди
        setTimeout(() => {
          // Адміни йдуть на адмін панель, інші на дашборд
          if (user?.role === USER_TYPES.ADMIN) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 2000);

      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        
        // Обробляємо різні типи помилок
        let errorMessage = t('oauthProcessingError');
        if (error.message === 'userNotAuthorized') {
          errorMessage = t('userNotAuthorized');
        } else if (error.message === 'userNotFound') {
          errorMessage = t('userNotFound');
        } else if (error.message === 'serverError') {
          errorMessage = t('serverError');
        } else if (error.message === 'tokenProcessingError') {
          errorMessage = t('tokenProcessingError');
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setMessage(errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, setAuthFromToken, router]);

  return (
    <ClientOnly>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Обробка авторизації...
              </h2>
              <p className="text-gray-600">
                Будь ласка, зачекайте, поки ми завершимо процес входу.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Успішна авторизація!
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <div className="animate-pulse text-sm text-blue-600">
                Перенаправлення на dashboard...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Помилка авторизації
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <button
                onClick={() => router.push('/auth')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Повернутися до входу
              </button>
            </>
          )}
        </div>
      </div>
    </ClientOnly>
  );
};

export { ClientAuthCallbackPage };

