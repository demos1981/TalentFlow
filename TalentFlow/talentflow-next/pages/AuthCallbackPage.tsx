import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import Loading from '../components/UI/Loading';

const AuthCallbackPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuthFromToken } = useAuthStore();
  const { t } = useLanguageStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams?.get('token');
        const error = searchParams?.get('error');
        const provider = searchParams?.get('provider');

        if (error) {
          if (error === 'user_not_found') {
            // Перенаправляємо на реєстрацію з мінімальним повідомленням
            console.log('User not found, redirecting to registration');
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
          setTimeout(() => {
            router.push('/auth');
          }, 5000);
          return;
        }

        if (!token) {
          setError(t('authTokenNotFound'));
          setTimeout(() => {
            router.push('/auth');
          }, 3000);
          return;
        }

        // Зберігаємо токен та перенаправляємо користувача
        await setAuthFromToken(token);
        
        // Перенаправляємо на dashboard (як LinkedIn)
        router.replace('/dashboard');
        
      } catch (error) {
        console.error('Callback handling error:', error);
        setError(t('authProcessingError'));
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuthFromToken]);

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card">
          <div className="auth-callback-error">
            <h2>❌ {t('authError')}</h2>
            <p>{error}</p>
            <p>{t('redirectingToLogin')}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-card">
        <div className="auth-callback-loading">
          <Loading />
          <h2>🔐 {t('processingAuth')}...</h2>
          <p>{t('pleaseWaitCompletingLogin')}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
