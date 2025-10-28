'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useLanguageStore } from '../stores/languageStore';
import { ClientOnly } from './ClientOnly';

// Створюємо QueryClient для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 хвилин
    },
  },
});

// Компонент для ініціалізації stores
const StoreInitializer: React.FC = React.memo(() => {
  const { checkAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { initializeLanguage } = useLanguageStore();

  const initializeStores = useCallback(async () => {
    try {
      await Promise.all([
        checkAuth(),
        new Promise(resolve => setTimeout(() => {
          initializeTheme();
          resolve(void 0);
        }, 50)),
        new Promise(resolve => setTimeout(() => {
          initializeLanguage();
          resolve(void 0);
        }, 100))
      ]);
    } catch (error) {
      console.error('StoreInitializer: Error initializing stores:', error);
    }
  }, [checkAuth, initializeTheme, initializeLanguage]);

  useEffect(() => {
    initializeStores();
  }, [initializeStores]);

  return null;
});

StoreInitializer.displayName = 'StoreInitializer';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = React.memo(({ children }) => {
  const toastOptions = useMemo(() => ({
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }), []);

  const isDevelopment = useMemo(() => process.env.NODE_ENV === 'development', []);
  
  return (
    <ClientOnly>
      <QueryClientProvider client={queryClient}>
        <StoreInitializer />
        {children}
        
        {/* Глобальні компоненти - тільки на клієнті */}
        <Toaster
          position="top-right"
          toastOptions={toastOptions}
        />
        
        {/* React Query DevTools (тільки в development) */}
        {isDevelopment && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ClientOnly>
  );
});

ClientProviders.displayName = 'ClientProviders';
