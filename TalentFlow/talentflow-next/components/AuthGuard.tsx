"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useLanguageStore } from "../stores/languageStore";
import { USER_TYPES } from "../constants";
import AuthPage from "../pages/AuthPage";
import { ClientDashboard } from "./ClientDashboard";

export const AuthGuard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізуємо авторизацію один раз
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('AuthGuard: Initializing auth for path:', pathname);
        const { checkAuth } = useAuthStore.getState();
        await checkAuth();
        setIsInitialized(true);
        console.log('AuthGuard: Auth initialized successfully');
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized, pathname]);

  // Редирект для авторизованих користувачів на /auth
  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated && pathname === '/auth') {
      console.log('AuthGuard: Authenticated on /auth, redirecting based on role:', user?.role);
      if (user?.role === USER_TYPES.ADMIN) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, pathname, user?.role, router]);

  // Показуємо завантаження поки не ініціалізовано
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">{t('initializing')}...</p>
        </div>
      </div>
    );
  }

  // Логіка рендерингу на основі авторизації та шляху
  console.log('AuthGuard: Rendering logic - isAuthenticated:', isAuthenticated, 'pathname:', pathname, 'user role:', user?.role);
  
  if (!isAuthenticated) {
    // Якщо не авторизований - показуємо AuthPage
    console.log('AuthGuard: Not authenticated, showing AuthPage');
    return <AuthPage />;
  }

  // Якщо авторизований і на сторінці /auth - показуємо завантаження поки редиректимо
  if (pathname === '/auth') {
    console.log('AuthGuard: Authenticated on /auth, showing loading while redirecting');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Якщо авторизований - показуємо ClientDashboard для всіх інших шляхів
  console.log('AuthGuard: Authenticated, showing ClientDashboard');
  return <ClientDashboard />;
};
