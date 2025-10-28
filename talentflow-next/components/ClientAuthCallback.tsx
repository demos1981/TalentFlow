'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { USER_TYPES } from '../constants';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import '../app/auth/callback/callback.css';

export const ClientAuthCallback: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuthFromToken, user } = useAuthStore();
  const { t } = useLanguageStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Перевіряємо, чи завантажився клієнт
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleCallback = async () => {
      try {
        const token = searchParams?.get('token');
        const error = searchParams?.get('error');
        const provider = searchParams?.get('provider');


        if (error) {
          if (error === 'user_not_found') {
            // Перенаправляємо на реєстрацію з мінімальним повідомленням
            router.push('/auth?type=register&message=user_not_found');
            return;
          }
          
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
            errorMessage = `${t('authError')}: ${error}`;
          }
          
          setError(errorMessage);
          setIsLoading(false);
          setTimeout(() => {
            router.push('/auth');
          }, 5000);
          return;
        }

        if (!token) {
          console.error('No token received in callback');
          setError(t('authTokenNotFound'));
          setIsLoading(false);
          setTimeout(() => {
            router.push('/auth');
          }, 3000);
          return;
        }

        
        // Зберігаємо токен та перенаправляємо користувача
        await setAuthFromToken(token);
        setIsLoading(false);
        
        
        // Перенаправляємо на dashboard
        // Адміни йдуть на адмін панель, інші на дашборд
        if (user?.role === USER_TYPES.ADMIN) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
      } catch (error: any) {
        console.error('Callback handling error:', error);
        
        // Показуємо більш зрозуміле повідомлення про помилку
        let errorMessage = t('oauthProcessingError');
        
        if (error.message) {
          if (error.message === 'userNotAuthorized') {
            errorMessage = t('userNotAuthorized');
          } else if (error.message === 'userNotFound') {
            errorMessage = t('userNotFound');
          } else if (error.message === 'serverError') {
            errorMessage = t('serverError');
          } else if (error.message === 'tokenProcessingError') {
            errorMessage = t('tokenProcessingError');
          } else {
            errorMessage = error.message;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
        setTimeout(() => {
          router.push('/auth');
        }, 5000); // Збільшуємо час для читання повідомлення
      }
    };

    handleCallback();
  }, [searchParams, router, setAuthFromToken, isClient]);

  // Показуємо завантаження поки не завантажився клієнт
  if (!isClient) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card">
          <div className="auth-callback-loading">
            <Loader2 className="icon loading-icon" />
            <h2>🔐 {t('loading')}...</h2>
            <p>{t('pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card">
          <div className="auth-callback-error">
            <XCircle className="icon error-icon" />
            <h2>❌ {t('oauthError')}</h2>
            <p>{error}</p>
            <div className="auth-callback-actions">
              <button 
                onClick={() => router.push('/auth')}
                className="btn btn-primary"
              >
                {t('goToRegistration')}
              </button>
              {(error.includes('invalid_grant') || error.includes('access_denied')) && (
                <button 
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary"
                  style={{ marginLeft: '10px' }}
                >
                  {t('tryAgain')}
                </button>
              )}
              <p className="redirect-text">{t('autoRedirect')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card">
          <div className="auth-callback-loading">
            <Loader2 className="icon loading-icon" />
            <h2>🔐 {t('processingAuth')}...</h2>
            <p>{t('pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-card">
        <div className="auth-callback-success">
          <CheckCircle className="icon success-icon" />
          <h2>✅ {t('authSuccess')}</h2>
          <p>{t('redirectingToDashboard')}</p>
        </div>
      </div>
    </div>
  );
};
