import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Loading from '../components/UI/Loading';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthFromToken } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const provider = searchParams.get('provider');

        if (error) {
          console.error('OAuth error:', error);
          setError(`Помилка авторизації: ${error}`);
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
          return;
        }

        if (!token) {
          setError('Токен авторизації не знайдено');
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
          return;
        }

        // Зберігаємо токен та перенаправляємо користувача
        await setAuthFromToken(token);
        
        // Перенаправляємо на dashboard (як LinkedIn)
        navigate('/dashboard', { replace: true });
        
      } catch (error) {
        console.error('Callback handling error:', error);
        setError('Помилка обробки авторизації');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthFromToken]);

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card">
          <div className="auth-callback-error">
            <h2>❌ Помилка авторизації</h2>
            <p>{error}</p>
            <p>Перенаправлення на сторінку входу...</p>
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
          <h2>🔐 Обробка авторизації...</h2>
          <p>Будь ласка, зачекайте, ми завершуємо вхід в систему</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
