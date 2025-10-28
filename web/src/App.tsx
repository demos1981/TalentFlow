import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import CandidatesPage from './pages/CandidatesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import CalendarPage from './pages/CalendarPage';
import CompaniesPage from './pages/CompaniesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import InterviewsPage from './pages/InterviewsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AiMatchingPage from './pages/AiMatchingPage';
import PerformancePage from './pages/PerformancePage';
import AutomationPage from './pages/AutomationPage';
import IntegrationsPage from './pages/IntegrationsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DocsPage from './pages/DocsPage';
import LanguageSettingsPage from './pages/LanguageSettingsPage';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <AuthProvider>
            <div className="app-container">
              <Routes>
                {/* Публічні маршрути */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                
                {/* Захищені маршрути */}
                <Route path="/dashboard" element={
                  <Layout>
                    <DashboardPage />
                  </Layout>
                } />
                <Route path="/jobs" element={
                  <Layout>
                    <JobsPage />
                  </Layout>
                } />
                <Route path="/candidates" element={
                  <Layout>
                    <CandidatesPage />
                  </Layout>
                } />
                <Route path="/profile" element={
                  <Layout>
                    <ProfilePage />
                  </Layout>
                } />
                
                {/* Додаткові сторінки */}
                <Route path="/calendar" element={
                  <Layout>
                    <CalendarPage />
                  </Layout>
                } />
                <Route path="/companies" element={
                  <Layout>
                    <CompaniesPage />
                  </Layout>
                } />
                <Route path="/applications" element={
                  <Layout>
                    <ApplicationsPage />
                  </Layout>
                } />
                <Route path="/interviews" element={
                  <Layout>
                    <InterviewsPage />
                  </Layout>
                } />
                <Route path="/analytics" element={
                  <Layout>
                    <AnalyticsPage />
                  </Layout>
                } />
                <Route path="/ai-matching" element={
                  <Layout>
                    <AiMatchingPage />
                  </Layout>
                } />
                <Route path="/performance" element={
                  <Layout>
                    <PerformancePage />
                  </Layout>
                } />
                <Route path="/automation" element={
                  <Layout>
                    <AutomationPage />
                  </Layout>
                } />
                <Route path="/integrations" element={
                  <Layout>
                    <IntegrationsPage />
                  </Layout>
                } />
                <Route path="/settings" element={
                  <Layout>
                    <SettingsPage />
                  </Layout>
                } />
                <Route path="/language-settings" element={<LanguageSettingsPage />} />
                <Route path="/help" element={
                  <Layout>
                    <HelpPage />
                  </Layout>
                } />
                <Route path="/docs" element={
                  <Layout>
                    <DocsPage />
                  </Layout>
                } />
                
                {/* 404 сторінка */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              
              {/* Глобальні компоненти */}
              <Toaster
                position="top-right"
                toastOptions={{
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
                }}
              />
            </div>
          </AuthProvider>
        </Router>
        </LanguageProvider>
      </ThemeProvider>
      
      {/* React Query DevTools (тільки в development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
