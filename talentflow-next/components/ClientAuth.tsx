'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { Eye, EyeOff, Mail, Lock, User, Building, Chrome, Linkedin } from 'lucide-react';
import { getOAuthUrl } from '../config/oauth';
import { USER_TYPES } from '../constants';
import '../app/auth/auth.css';

export const ClientAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    role: USER_TYPES.EMPLOYER as 'candidate' | 'employer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  const auth = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Перевіряємо, чи завантажився клієнт
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Показуємо завантаження поки не завантажився клієнт
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  // Захист: якщо вже авторизований - перенаправляємо на dashboard
  useEffect(() => {
    // Додаємо додаткову перевірку для Windows
    if (!auth.isLoading && auth.isAuthenticated && auth.user) {
      console.log('ClientAuth: User authenticated, redirecting to dashboard', {
        isAuthenticated: auth.isAuthenticated,
        user: auth.user?.email,
        isLoading: auth.isLoading
      });
      
      // Використовуємо router.replace замість push для уникнення проблем з історією
      router.replace('/dashboard');
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, router]);

  // Показуємо завантаження поки перевіряємо авторизацію
  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  // Якщо вже авторизований - не показуємо контент
  if (auth.isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await auth.login(formData.email, formData.password);
        if (result?.user?.role === USER_TYPES.ADMIN) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        const result = await auth.register(formData);
        if (result?.user?.role === USER_TYPES.ADMIN) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'linkedin') => {
    try {
      console.log(`Starting ${provider} OAuth flow...`);
      
      // Отримуємо OAuth URL з конфігурації
      const oauthUrl = getOAuthUrl(provider);
      console.log(`${provider} OAuth URL:`, oauthUrl);
      
      // Перенаправляємо на OAuth endpoint
      console.log(`Redirecting to ${oauthUrl}...`);
      window.location.href = oauthUrl;
    } catch (err: any) {
      console.error(`${provider} OAuth error:`, err);
      setError(`Помилка входу через ${provider}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            <span className="auth-title-accent">Talent</span>Fluent
          </h1>
          <p className="auth-subtitle">
            {isLogin ? t('loginToAccount') : t('createNewAccount')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <User className="icon" />
                  Ім'я
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={t('firstName')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  <Building className="icon" />
                  Компанія
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={t('companyName')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">Роль</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value={USER_TYPES.EMPLOYER}>{t('employer')}</option>
                  <option value={USER_TYPES.CANDIDATE}>{t('candidate')}</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="icon" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock className="icon" />
              Пароль
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder={t('password')}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? t('loading') : (isLogin ? t('login') : t('register'))}
          </button>

          {/* Швидкий вхід для тестування */}
          <button
            type="button"
            className="btn btn-secondary btn-full"
            onClick={() => {
              setFormData({
                email: 'test@example.com',
                password: 'password123',
                firstName: t('testUser'),
                lastName: t('testUser'),
                company: 'Test Company',
                role: USER_TYPES.EMPLOYER
              });
            }}
            disabled={isLoading}
          >
            {t('fillTestData')}
          </button>
        </form>

        {/* Соціальні мережі - тільки для логіну */}
        {isLogin && (
          <>
            {/* Розділювач */}
            <div className="auth-divider">
              <span>або</span>
            </div>

            {/* Соціальні мережі */}
            <div className="social-auth">
              <button
                type="button"
                className="btn btn-outline btn-full social-btn google-btn"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <Chrome className="icon" />
                {t('loginWithGoogle')}
              </button>
              
              <button
                type="button"
                className="btn btn-outline btn-full social-btn linkedin-btn"
                onClick={() => handleSocialLogin('linkedin')}
                disabled={isLoading}
              >
                <Linkedin className="icon" />
                {t('loginWithLinkedIn')}
              </button>
            </div>
          </>
        )}

        <div className="auth-footer">
          <p>
            {isLogin ? t('noAccount') : t('haveAccount')}
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? t('register') : t('login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
