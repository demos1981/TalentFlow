'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { ClientDashboard } from '../components/ClientDashboard';
import HomePage from '../pages/HomePage';
import './homepage.css';

const HomePageWrapper: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізуємо авторизацію
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { checkAuth } = useAuthStore.getState();
        await checkAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Показуємо завантаження поки не ініціалізовано
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Якщо користувач авторизований - показуємо дашборд
  if (isAuthenticated) {
    return <ClientDashboard />;
  }

  // Якщо не авторизований - показуємо публічну домашню сторінку
  return <HomePage />;
};

export default HomePageWrapper;
