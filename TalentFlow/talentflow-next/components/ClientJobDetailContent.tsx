'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { JobDetailApplyButton } from './JobDetailApplyButton';
import { 
  ArrowLeft,
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building2,
  Users,
  Calendar,
  CheckCircle,
  Star
} from 'lucide-react';
import './ServerJobDetailContent.css';
import { useLanguageStore } from '../stores/languageStore';

interface ClientJobDetailContentProps {
  job: any;
  error?: string | null;
}

// Допоміжна функція для отримання назви компанії
const getCompanyName = (company: string | any): string => {
  if (typeof company === 'string') {
    return company;
  }
  return company?.name || 'Компанія не вказана';
};

export const ClientJobDetailContent: React.FC<ClientJobDetailContentProps> = ({ job, error }) => {
  const { t, initializeLanguage, currentLanguage } = useLanguageStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    const initLanguage = async () => {
      // Визначаємо мову браузера якщо користувач не зареєстрований
      const browserLanguage = navigator.language.startsWith('uk') ? 'uk' : 'en';
      
      // Перевіряємо чи є збережена мова в localStorage
      const savedLanguage = localStorage.getItem('talentflow-language');
      
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'uk')) {
        // Якщо є збережена мова - використовуємо її
        initializeLanguage();
      } else {
        // Якщо немає збереженої мови - використовуємо мову браузера
        const { setLanguage } = useLanguageStore.getState();
        setLanguage(browserLanguage);
      }
      
      setIsInitialized(true);
    };

    initLanguage();
  }, [initializeLanguage]);

  // Показуємо завантаження поки не ініціалізовано
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Якщо помилка або вакансію не знайдено
  if (error || !job) {
    return (
      <div className="job-detail-container">
        <div className="back-button-section">
          <Link href="/jobs" className="back-button">
            <ArrowLeft className="icon" />
            {t('backToJobs')}
          </Link>
        </div>
        
        <div className="error-state">
          <h1>❌ {error || t('jobNotFound')}</h1>
          <p>{t('jobNotFoundDescription')}</p>
          <Link href="/jobs" className="btn btn-primary">
            {t('returnToJobList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-container">
      {/* Кнопка назад */}
      <div className="back-button-section">
        <Link href="/jobs" className="back-button">
          <ArrowLeft className="icon" />
          {t('backToJobs')}
        </Link>
      </div>

      {/* Заголовок роботи */}
      <div className="job-detail-header">
        <div className="job-title-section">
          <h1 className="job-title">{job.title}</h1>
          <div className="job-company-info">
            <Building2 className="icon" />
            <span className="company-name">
              {getCompanyName(job.company)}
            </span>
          </div>
        </div>
        <div className="job-actions">
          <button className="btn btn-outline">
            <Star className="icon" />
            {t('save')}
          </button>
          <button className="btn btn-primary">
            {t('applyForJob')}
          </button>
        </div>
      </div>

      {/* Основна інформація */}
      <div className="job-details-grid">
        <div className="job-main-info">
          <div className="job-details-section">
            <h2>{t('jobDetails')}</h2>
            <div className="job-details-list">
              <div className="job-detail-item">
                <MapPin className="icon" />
                <span>{job.location}</span>
              </div>
              <div className="job-detail-item">
                <Briefcase className="icon" />
                <span>{job.type}</span>
              </div>
              <div className="job-detail-item">
                <DollarSign className="icon" />
                <span>
                  {job.salaryMin && job.salaryMax 
                    ? `${job.salaryMin} - ${job.salaryMax} ${job.currency || 'USD'}`
                    : t('salaryNotSpecified')
                  }
                </span>
              </div>
              <div className="job-detail-item">
                <Clock className="icon" />
                <span>
                  {t('published')} {job.posted ? (() => {
                    try {
                      return new Date(job.posted).toLocaleDateString(currentLanguage === 'uk' ? 'uk-UA' : 'en-US');
                    } catch {
                      return t('recently');
                    }
                  })() : t('recently')}
                </span>
              </div>
            </div>
          </div>

          <div className="job-description-section">
            <h2>{t('jobDescription')}</h2>
            <p>{job.description}</p>
          </div>

          <div className="job-requirements-section">
            <h2>{t('requirements')}</h2>
            <div className="requirements-list">
              {(job.skills || []).map((skill: string, index: number) => (
                <span key={index} className="requirement-tag">
                  {skill}
                </span>
              ))}
              {job.requirements && (
                <div className="requirements-text">
                  <p>{job.requirements}</p>
                </div>
              )}
            </div>
          </div>

          {job.benefits && (
          <div className="job-benefits-section">
            <h2>{t('benefits')}</h2>
              <div className="benefits-text">
                <p>{job.benefits}</p>
              </div>
          </div>
          )}
        </div>

        <div className="company-info-sidebar">
          <div className="company-card">
            <h3>{t('aboutCompany')}</h3>
            <div className="company-details">
              <div className="company-detail">
                <Building2 className="icon" />
                <span>{getCompanyName(job.company)}</span>
              </div>
              {typeof job.company === 'object' && job.company?.industry && (
              <div className="company-detail">
                <Briefcase className="icon" />
                  <span>{t('industry')}: {job.company.industry}</span>
              </div>
              )}
              {typeof job.company === 'object' && job.company?.size && (
              <div className="company-detail">
                <Users className="icon" />
                  <span>{t('size')}: {job.company.size}</span>
              </div>
              )}
              {typeof job.company === 'object' && job.company?.founded && (
              <div className="company-detail">
                <Calendar className="icon" />
                  <span>{t('founded')}: {job.company.founded}</span>
              </div>
              )}
              {typeof job.company === 'object' && job.company?.rating && (
              <div className="company-detail">
                <Star className="icon" />
                  <span>{t('rating')}: {job.company.rating}/5</span>
                </div>
              )}
              {job.department && (
                <div className="company-detail">
                  <Briefcase className="icon" />
                  <span>{t('department')}: {job.department}</span>
              </div>
              )}
            </div>
            {typeof job.company === 'object' && job.company?.description && (
              <p className="company-description">{job.company.description}</p>
            )}
            <Link 
              href={`/jobs?company=${encodeURIComponent(getCompanyName(job.company))}`} 
              className="btn btn-outline full-width"
            >
              {t('viewAllCompanyJobs')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Клієнтський компонент для функціональності кнопки подачі заявки */}
      <JobDetailApplyButton jobId={job.id} jobTitle={job.title} />
    </div>
  );
};
