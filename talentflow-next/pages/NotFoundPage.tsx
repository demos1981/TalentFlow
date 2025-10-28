import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

const NotFoundPage: React.FC = () => {
  const { t } = useLanguageStore();
  
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">404 - {t('pageNotFound')}</h1>
          <p className="dashboard-greeting-subtitle">
            {t('pageNotFoundDescription')}
          </p>
        </div>
      </div>

      <div className="dashboard-section-card">
        <div className="dashboard-section-content">
          {/* 404 іконка */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-600 dark:text-gray-300">404</span>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="dashboard-section-title text-center">
            {t('pageNotFound')}
          </h2>
          
          <p className="dashboard-greeting-subtitle text-center">
            {t('pageNotFoundDescription')}
          </p>

          {/* Дії */}
          <div className="dashboard-actions">
            <Link
              href="/"
              className="btn btn-primary btn-lg"
            >
              <Home className="icon" />
              {t('home')}
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline btn-lg"
            >
              <ArrowLeft className="icon" />
              {t('back')}
            </button>
          </div>

          {/* Додаткова допомога */}
          <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="dashboard-section-title text-center">
              {t('cantFindWhatYouLookingFor')}
            </h3>
            
            <div className="dashboard-actions">
              <Link
                href="/jobs"
                className="btn btn-secondary"
              >
                <Search className="icon" />
                {t('searchJobs')}
              </Link>
              
              <Link
                href="/candidates"
                className="btn btn-secondary"
              >
                <Search className="icon" />
                {t('searchCandidates')}
              </Link>
              
              <Link
                href="/contact"
                className="btn btn-outline"
              >
                {t('contactSupport')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
