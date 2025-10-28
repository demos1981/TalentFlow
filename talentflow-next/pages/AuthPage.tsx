"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Building2, Globe } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useLanguageStore, supportedLanguages } from "../stores/languageStore";
import "../app/auth/auth.css";

// Простий перемикач мов
const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguageStore();

  const currentLang = supportedLanguages.find((lang) => lang.code === currentLanguage);

  // Закриваємо випадаючий список при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(".language-switcher")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
  };

  return (
    <div
      className="relative language-switcher"
      style={{ zIndex: 9999, position: "relative" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#374151",
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          position: "relative",
          zIndex: 9999,
        }}
      >
        <Globe
          className="h-4 w-4"
          style={{ width: "16px", height: "16px" }}
        />
        <span style={{ fontSize: "16px" }}>{currentLang?.flag}</span>
        <span
          className="hidden sm:block"
          style={{ fontSize: "14px" }}
        >
          {currentLang?.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "100%",
            marginTop: "8px",
            width: "192px",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            zIndex: 10000,
            maxHeight: "300px",
            overflowY: "auto",
            display: "block",
            visibility: "visible",
            opacity: "1",
            pointerEvents: "auto",
          }}
        >
          <div style={{ padding: "4px 0" }}>
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "8px 16px",
                  fontSize: "14px",
                  backgroundColor: currentLanguage === language.code ? "#eff6ff" : "transparent",
                  color: currentLanguage === language.code ? "#1d4ed8" : "#374151",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  pointerEvents: "auto",
                  zIndex: 10001,
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>{language.flag}</span>
                <span style={{ fontWeight: "500" }}>{language.nativeName}</span>
                {currentLanguage === language.code && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{
                      marginLeft: "auto",
                      width: "16px",
                      height: "16px",
                      color: "#2563eb",
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Простий компонент авторизації
const AuthPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Читаємо тип форми з URL параметрів
  const typeParam = searchParams?.get("type");
  const [isLogin, setIsLogin] = useState(typeParam !== "register");
  
  // Читаємо повідомлення з URL параметрів
  const messageParam = searchParams?.get("message");

  // Використовуємо store
  const { login, register, isLoading, error, clearError, setError } = useAuthStore();
  const { currentLanguage, t, initializeLanguage, setLanguage } = useLanguageStore();


  // Слухаємо зміни URL параметрів
  useEffect(() => {
    const currentType = searchParams?.get("type");
    setIsLogin(currentType !== "register");
  }, [searchParams]);

  // Обробляємо повідомлення з URL параметрів
  useEffect(() => {
    if (messageParam === 'user_not_found') {
      // Показуємо мінімальне повідомлення про те, що потрібна реєстрація
      setError(t('userNotFound'));
      
      // Очищаємо URL параметр після показу повідомлення
      const url = new URL(window.location.href);
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
    }
  }, [messageParam, setError, t, currentLanguage]);

  // Обробляємо помилки з URL параметрів
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      if (errorParam === 'user_not_found') {
        // Перенаправляємо на реєстрацію з мінімальним повідомленням
        router.push('/auth?type=register&message=user_not_found');
        return;
      }
      
      let errorMessage = t('authError');
      
      if (errorParam === 'invalid_grant') {
        errorMessage = t('invalidGrant');
      } else if (errorParam === 'access_denied') {
        errorMessage = t('accessDenied');
      } else if (errorParam === 'auth_failed') {
        errorMessage = t('authError');
      } else if (errorParam === 'token_processing_failed') {
        errorMessage = t('tokenProcessingError');
      } else if (errorParam === 'no_token') {
        errorMessage = t('authTokenNotFound');
      }
      
      setError(errorMessage);
      
      // Очищаємо URL параметр після показу помилки
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, setError, t, router, currentLanguage]);

  // Ініціалізуємо тільки мову - авторизацію контролює AuthGuard
  useEffect(() => {
    initializeLanguage();
    setIsInitialized(true); // Відразу встановлюємо як ініціалізований
  }, [initializeLanguage]);

  // Форма даних
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "candidate",
  });
  const [lastRedirectTime, setLastRedirectTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Стан для валідації помилок
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  // Створюємо стабільну функцію для встановлення помилок
  const setFieldError = useCallback((field: 'email' | 'password', error: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev, [field]: error };
      return newErrors;
    });
  }, []);

  // Відстежуємо зміни в store error
  useEffect(() => {
    if (error) {
      if (error === 'User not found') {
        setFieldError('email', t('userNotFound') || 'Користувач з таким email не існує');
      } else if (error === 'Invalid password') {
        setFieldError('password', t('invalidPassword') || 'Невірний пароль');
      } else if (error === 'Account deactivated') {
        setError(t('accountDeactivated') || 'Обліковий запис деактивовано');
      } else {
        setFieldError('email', error);
      }
    }
  }, [error, setFieldError, t]);


  // ВІДКЛЮЧЕНО: Автоматичні редиректи викликають зациклювання
  // Замість редиректів використовуємо умовний рендеринг

  // Обробка зміни полів
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Очищаємо помилки store та field errors
    clearError();
    setFieldErrors({
      email: "",
      password: "",
    });
  };

  // Простий логін
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    clearError();
    
    // Очищаємо попередні помилки валідації
    setFieldErrors({
      email: "",
      password: "",
    });

    try {
      const result = await login(formData.email, formData.password);
      
      // Перевіряємо, чи є помилка після виклику login
      const { error: storeError } = useAuthStore.getState();
      
      if (storeError) {
        return;
      }
      
      // Якщо немає помилки і є користувач, перенаправляємо
      if (result?.user) {
        // Адміни йдуть на адмін панель, інші на дашборд
        if (result.user.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      // Обробляємо специфічні помилки
      const errorMessage = err?.response?.data?.message || err?.message || '';
      const statusCode = err?.response?.status;
      
      if (statusCode === 404 || errorMessage.includes('does not exist') || errorMessage.includes('not found')) {
        setFieldErrors(prev => ({
          ...prev,
          email: t('userNotFound') || 'Користувач з таким email не існує'
        }));
      } else if (statusCode === 401 || errorMessage.includes('Invalid password') || errorMessage.includes('password')) {
        setFieldErrors(prev => ({
          ...prev,
          password: t('invalidPassword') || 'Невірний пароль'
        }));
      } else if (statusCode === 403 || errorMessage.includes('deactivated')) {
        setError(t('accountDeactivated') || 'Обліковий запис деактивовано');
      } else {
        // Загальна помилка
        setError(errorMessage || t('loginError') || 'Помилка входу');
      }
    }
  };

  // Проста реєстрація
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Валідація
    if (formData.password !== formData.confirmPassword) {
      // setError('Паролі не співпадають');
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: "Test Company",
        role: formData.userType as "candidate" | "employer",
      });
      
      // Адміни йдуть на адмін панель, інші на дашборд
      if (result?.user?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      // Помилка вже встановлена в store
    }
  };

  // Перемикання між формами
  const toggleForm = () => {
    const newType = isLogin ? "register" : "login";
    router.push(`/auth?type=${newType}`);
    clearError();
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "candidate",
    });
  };

  // LinkedIn login
  const handleLinkedInLogin = () => {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://talentflow-production-50cc.up.railway.app'
      : 'http://localhost:3002';
    
    window.location.href = `${apiUrl}/api/auth/linkedin`;
  };

  // Google login
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://talentflow-production-50cc.up.railway.app'
      : 'http://localhost:3002';
    
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  // ПОВНІСТЮ ВІДКЛЮЧЕНО: Не рендеримо нічого якщо не ініціалізовано
  if (!isInitialized || isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-header-top">
              <div className="auth-logo">TF</div>
            </div>
            <h1 className="auth-title">
              <span className="auth-title-accent">Talent</span>Flow
            </h1>
            <p className="auth-subtitle">{t('loading')}...</p>
          </div>

          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('initializing')}...</p>
          </div>
        </div>
      </div>
    );
  }

  // Тепер AuthGuard контролює авторизацію, тому просто рендеримо форму

  return (
    <div className="auth-container" key={currentLanguage}>
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
          <p className="auth-subtitle">{isLogin ? t("login") : t("register")}</p>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          // Форма входу
          <form
            onSubmit={handleLogin}
            className="auth-form"
          >
            <div className="auth-form-group">
              <label className="auth-form-label">{t("email")}</label>
              <div className="auth-form-input-container">
                <Mail className="auth-form-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e as any)}
                  className={`auth-form-input ${fieldErrors.email ? 'auth-form-input-error' : ''}`}
                  placeholder={t("email")}
                  required
                />
              </div>
              {fieldErrors.email && (
                <div className="auth-form-error">{fieldErrors.email}</div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">{t("password")}</label>
              <div className="auth-password-input">
                <Lock className="auth-form-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e as any)}
                  className={`auth-form-input ${fieldErrors.password ? 'auth-form-input-error' : ''}`}
                  placeholder={t("password")}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="auth-form-error">{fieldErrors.password}</div>
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
                  {t("loading")}...
                </div>
              ) : (
                t("login")
              )}
            </button>
          </form>
        ) : (
          // Форма реєстрації
          <form
            onSubmit={handleRegister}
            className="auth-form"
          >
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-form-label">{t("firstName")}</label>
                <div className="auth-form-input-container">
                  <User className="auth-form-icon" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="auth-form-input"
                    placeholder={t("firstName")}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">{t("lastName")}</label>
                <div className="auth-form-input-container">
                  <User className="auth-form-icon" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="auth-form-input"
                    placeholder={t("lastName")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">{t("email")}</label>
              <div className="auth-form-input-container">
                <Mail className="auth-form-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-form-input"
                  placeholder={t("email")}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">{t("userType")}</label>
              <div className="auth-user-type-container">
                <label className="auth-user-type-option">
                  <input
                    type="radio"
                    name="userType"
                    value="candidate"
                    checked={formData.userType === "candidate"}
                    onChange={handleInputChange}
                    className="auth-user-type-radio"
                  />
                  <div className="auth-user-type-content">
                    <User className="auth-user-type-icon" />
                    <span className="auth-user-type-label">{t("candidate")}</span>
                  </div>
                </label>
                <label className="auth-user-type-option">
                  <input
                    type="radio"
                    name="userType"
                    value="employer"
                    checked={formData.userType === "employer"}
                    onChange={handleInputChange}
                    className="auth-user-type-radio"
                  />
                  <div className="auth-user-type-content">
                    <Building2 className="auth-user-type-icon" />
                    <span className="auth-user-type-label">{t("employer")}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">{t("password")}</label>
              <div className="auth-password-input">
                <Lock className="auth-form-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-form-input"
                  placeholder={t("password")}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">{t("confirmPassword")}</label>
              <div className="auth-password-input">
                <Lock className="auth-form-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="auth-form-input"
                  placeholder={t("confirmPassword")}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="auth-loading">
                  <div className="loading"></div>
                  {t("loading")}...
                </div>
              ) : (
                t("register")
              )}
            </button>
          </form>
        )}

        {/* Error Display */}
        {error && (
          <div className="auth-error-center">
            <div className="auth-form-error">{error}</div>
          </div>
        )}

        {/* Social Login Buttons - тільки для логіну */}
        {isLogin && (
          <div 
            className="auth-social"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '24px',
              marginBottom: '24px',
              width: '100%'
            }}
          >
            <button 
              type="button"
              className="auth-social-btn google"
              onClick={() => handleGoogleLogin()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                height: '48px',
                background: 'white',
                border: '1px solid #ea4335',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '0 16px',
                margin: '0',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ea4335'
              }}
            >
              <svg 
                className="auth-social-icon" 
                viewBox="0 0 24 24"
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'block'
                }}
              >
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            <button 
              type="button"
              className="auth-social-btn linkedin"
              onClick={() => handleLinkedInLogin()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                height: '48px',
                background: 'white',
                border: '1px solid #0077b5',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '0 16px',
                margin: '0',
                fontSize: '14px',
                fontWeight: '500',
                color: '#0077b5'
              }}
            >
              <svg 
                className="auth-social-icon" 
                viewBox="0 0 24 24"
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'block'
                }}
              >
                <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>
        )}

        {/* Form Toggle */}
        <div className="auth-form-toggle">
          <p className="auth-form-toggle-text">{isLogin ? t("noAccount") : t("haveAccount")}</p>
          <button
            type="button"
            className="auth-form-toggle-button"
            onClick={toggleForm}
          >
            {isLogin ? t("register") : t("login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
