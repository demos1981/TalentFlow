import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react';
import LanguageSwitcher from '../components/UI/LanguageSwitcher';

// Схеми валідації
const loginSchema = z.object({
  email: z.string().email('Введіть коректну email адресу'),
  password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
});

const registerSchema = z.object({
  email: z.string().email('Введіть коректну email адресу'),
  password: z.string().min(8, 'Пароль має бути не менше 8 символів'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Ім\'я має бути не менше 2 символів'),
  lastName: z.string().min(2, 'Прізвище має бути не менше 2 символів'),
  userType: z.enum(['candidate', 'employer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();

  // Форма входу
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Форма реєстрації
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Обробка входу
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Помилка обробляється в AuthContext
    }
  };

  // Обробка реєстрації
  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
      });
    } catch (error) {
      // Помилка обробляється в AuthContext
    }
  };

  // Перемикання між формами
  const toggleForm = () => {
    setIsLogin(!isLogin);
    clearError();
    loginForm.reset();
    registerForm.reset();
  };

  // LinkedIn login
  const handleLinkedInLogin = () => {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://talentflow-backend-production.up.railway.app'
      : 'http://localhost:3000';
    
    window.location.href = `${apiUrl}/api/auth/linkedin`;
  };

  // Google login
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://talentflow-backend-production.up.railway.app'
      : 'http://localhost:3000';
    
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <div className="auth-container">
      {/* Auth Card */}
      <div className="auth-card">
        {/* Auth Header */}
        <div className="auth-header">
          <div className="auth-header-top">
            <div className="auth-logo">TF</div>
            <LanguageSwitcher />
          </div>
          <h1 className="auth-title">
            <span className="auth-title-accent">Talent</span>Flow
          </h1>
          <p className="auth-subtitle">
            {isLogin ? t('login') : t('register')}
          </p>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          // Форма входу
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-form-label">Email</label>
              <div className="auth-form-input-container">
                <Mail className="auth-form-icon" />
                <input
                  type="email"
                  {...loginForm.register('email')}
                  className={`auth-form-input ${loginForm.formState.errors.email ? 'error' : ''}`}
                  placeholder="Введіть ваш email"
                />
              </div>
              {loginForm.formState.errors.email && (
                <div className="auth-form-error">
                  {loginForm.formState.errors.email.message}
                </div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Пароль</label>
              <div className="auth-password-input">
                <Lock className="auth-form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...loginForm.register('password')}
                  className={`auth-form-input ${loginForm.formState.errors.password ? 'error' : ''}`}
                  placeholder="Введіть ваш пароль"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <div className="auth-form-error">
                  {loginForm.formState.errors.password.message}
                </div>
              )}
            </div>

            <div className="auth-form-options">
              <label className="auth-remember-me">
                <input type="checkbox" />
                <span>Запам'ятати мене</span>
              </label>
              <a href="#" className="auth-forgot-password">
                Забули пароль?
              </a>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="auth-loading">
                  <div className="loading"></div>
                  Вхід...
                </div>
              ) : (
                'Увійти'
              )}
            </button>
          </form>
        ) : (
          // Форма реєстрації
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="auth-form">
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-form-label">Ім'я</label>
                <div className="auth-form-input-container">
                  <User className="auth-form-icon" />
                  <input
                    type="text"
                    {...registerForm.register('firstName')}
                    className={`auth-form-input ${registerForm.formState.errors.firstName ? 'error' : ''}`}
                    placeholder="Введіть ваше ім'я"
                  />
                </div>
                {registerForm.formState.errors.firstName && (
                  <div className="auth-form-error">
                    {registerForm.formState.errors.firstName.message}
                  </div>
                )}
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Прізвище</label>
                <div className="auth-form-input-container">
                  <User className="auth-form-icon" />
                  <input
                    type="text"
                    {...registerForm.register('lastName')}
                    className={`auth-form-input ${registerForm.formState.errors.lastName ? 'error' : ''}`}
                    placeholder="Введіть ваше прізвище"
                  />
                </div>
                {registerForm.formState.errors.lastName && (
                  <div className="auth-form-error">
                    {registerForm.formState.errors.lastName.message}
                  </div>
                )}
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Email</label>
              <div className="auth-form-input-container">
                <Mail className="auth-form-icon" />
                <input
                  type="email"
                  {...registerForm.register('email')}
                  className={`auth-form-input ${registerForm.formState.errors.email ? 'error' : ''}`}
                  placeholder="Введіть ваш email"
                />
              </div>
              {registerForm.formState.errors.email && (
                <div className="auth-form-error">
                  {registerForm.formState.errors.email.message}
                </div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Тип користувача</label>
              <div className="auth-user-type-container">
                <label className="auth-user-type-option">
                  <input
                    type="radio"
                    {...registerForm.register('userType')}
                    value="candidate"
                    className="auth-user-type-radio"
                  />
                  <div className="auth-user-type-content">
                    <User className="auth-user-type-icon" />
                    <span className="auth-user-type-label">Кандидат</span>
                  </div>
                </label>
                <label className="auth-user-type-option">
                  <input
                    type="radio"
                    {...registerForm.register('userType')}
                    value="employer"
                    className="auth-user-type-radio"
                  />
                  <div className="auth-user-type-content">
                    <Building2 className="auth-user-type-icon" />
                    <span className="auth-user-type-label">Роботодавець</span>
                  </div>
                </label>
              </div>
              {registerForm.formState.errors.userType && (
                <div className="auth-form-error">
                  {registerForm.formState.errors.userType.message}
                </div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Пароль</label>
              <div className="auth-password-input">
                <Lock className="auth-form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerForm.register('password')}
                  className={`auth-form-input ${registerForm.formState.errors.password ? 'error' : ''}`}
                  placeholder="Створіть пароль"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <div className="auth-form-error">
                  {registerForm.formState.errors.password.message}
                </div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Підтвердження пароля</label>
              <div className="auth-password-input">
                <Lock className="auth-form-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerForm.register('confirmPassword')}
                  className={`auth-form-input ${registerForm.formState.errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Підтвердіть пароль"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <div className="auth-form-error">
                  {registerForm.formState.errors.confirmPassword.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="auth-loading">
                  <div className="loading"></div>
                  Реєстрація...
                </div>
              ) : (
                'Зареєструватися'
              )}
            </button>
          </form>
        )}

        {/* Error Display */}
        {error && (
          <div className="auth-form-error">
            {error}
          </div>
        )}

        {/* Form Toggle */}
        <div className="auth-form-toggle">
          <p className="auth-form-toggle-text">
            {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'}
          </p>
          <button
            type="button"
            className="auth-form-toggle-button"
            onClick={toggleForm}
          >
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </div>

        {/* Social Login */}
        <div className="auth-form-divider">
          <div className="auth-form-divider-line">
            <div className="auth-form-divider-border">
              <div className="auth-form-divider-border-line"></div>
            </div>
            <div className="auth-form-divider-text">
              <span>або</span>
            </div>
          </div>
        </div>

        <div className="auth-social-buttons">
          <button 
            type="button"
            className="auth-social-button google"
            onClick={() => handleGoogleLogin()}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button 
            type="button"
            className="auth-social-button linkedin"
            onClick={() => handleLinkedInLogin()}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            Реєструючись, ви погоджуєтесь з нашими{' '}
            <a href="#" className="auth-footer-link">Умовами використання</a>
            {' '}та{' '}
            <a href="#" className="auth-footer-link">Політикою конфіденційності</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
