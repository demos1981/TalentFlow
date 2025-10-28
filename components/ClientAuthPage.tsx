'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { USER_TYPES } from '../constants';
import { Eye, EyeOff, Mail, Lock, User, Building, Chrome, Linkedin, AlertCircle, ArrowRight } from 'lucide-react';
import { getOAuthUrl } from '../config/oauth';
import { ClientOnly } from './ClientOnly';
import '../app/auth/auth.css';

const ClientAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    role: USER_TYPES.EMPLOYER
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuthStore();
  const router = useRouter();

  // Захист: якщо вже авторизований - перенаправляємо на dashboard
  useEffect(() => {
    const { isLoading, isAuthenticated } = useAuthStore.getState();
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        // Адміни йдуть на адмін панель, інші на дашборд
        if (user?.role === USER_TYPES.ADMIN) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 100);
    }
  }, [user?.role, router]);

  // Показуємо завантаження поки перевіряємо авторизацію
  const { isLoading: authLoading, isAuthenticated } = useAuthStore.getState();
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Якщо вже авторизований - не показуємо контент
  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await useAuthStore.getState().login(formData.email, formData.password);
      } else {
        await useAuthStore.getState().register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          role: formData.role as 'candidate' | 'employer'
        });
      }
    } catch (err: any) {
      setError(err.message || 'Помилка авторизації');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'linkedin') => {
    const oauthUrl = getOAuthUrl(provider);
    window.location.href = oauthUrl;
  };

  return (
    <ClientOnly>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              <span className="auth-title-accent">Talent</span>Fluent
            </h1>
            <p className="auth-subtitle">
              {isLogin ? 'Увійдіть у свій акаунт' : 'Створіть новий акаунт'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Увійти
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Зареєструватися
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <AlertCircle className="auth-error-icon" />
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="auth-field">
                  <label className="auth-label">
                    <User className="auth-label-icon" />
                    Ім'я
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Введіть ваше ім'я"
                    required={!isLogin}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">
                    <User className="auth-label-icon" />
                    Прізвище
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Введіть ваше прізвище"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="auth-field">
              <label className="auth-label">
                <Mail className="auth-label-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="auth-input"
                placeholder="Введіть ваш email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                <Lock className="auth-label-icon" />
                Пароль
              </label>
              <div className="auth-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Введіть ваш пароль"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="auth-field">
                  <label className="auth-label">
                    <Building className="auth-label-icon" />
                    Компанія
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Назва вашої компанії"
                    required={!isLogin}
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">
                    <User className="auth-label-icon" />
                    Роль
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="auth-select"
                    required={!isLogin}
                  >
                    <option value={USER_TYPES.EMPLOYER}>Роботодавець</option>
                    <option value={USER_TYPES.CANDIDATE}>Кандидат</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  {isLogin ? 'Вхід...' : 'Реєстрація...'}
                </div>
              ) : (
                <>
                  {isLogin ? 'Увійти' : 'Зареєструватися'}
                  <ArrowRight className="auth-submit-icon" />
                </>
              )}
            </button>
          </form>

          {/* OAuth кнопки - тільки для логіну */}
          {isLogin && (
            <>
              <div className="auth-divider">
                <span>або</span>
              </div>

              <div className="auth-oauth">
                <button
                  type="button"
                  className="auth-oauth-button auth-oauth-google"
                  onClick={() => handleOAuthLogin('google')}
                >
                  <Chrome className="auth-oauth-icon" />
                  Продовжити з Google
                </button>
                <button
                  type="button"
                  className="auth-oauth-button auth-oauth-linkedin"
                  onClick={() => handleOAuthLogin('linkedin')}
                >
                  <Linkedin className="auth-oauth-icon" />
                  Продовжити з LinkedIn
                </button>
              </div>
            </>
          )}

          <div className="auth-footer">
            <p>
              {isLogin ? 'Немає акаунта?' : 'Вже є акаунт?'}
              <button
                type="button"
                className="auth-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Зареєструватися' : 'Увійти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export { ClientAuthPage };

