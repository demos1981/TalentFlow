'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobsListApplyButtons } from './JobsListApplyButtons';
import { TruncatedText } from './TruncatedText';
import { useLanguageStore } from '../stores/languageStore';
import { useAuthStore } from '../stores/authStore';
import { USER_TYPES } from '../constants';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Clock,
  Eye,
  UserPlus
} from 'lucide-react';
import './ServerJobsContent.css';
import { jobService } from '../services/jobService';

// Допоміжна функція для отримання назви компанії
const getCompanyName = (company: string | any): string => {
  if (typeof company === 'string') {
    return company;
  }
  return company?.name || 'Компанія не вказана';
};

const getLocalizedJobType = (type: string, t: (key: string) => string) => {
  const typeMap: { [key: string]: string } = {
    'full-time': t('fullTime'),
    'part-time': t('partTime'),
    'contract': t('contract'),
    'freelance': t('freelance'),
    'internship': t('internship'),
    'remote': t('remote')
  };
  return typeMap[type] || type;
};

interface JobsContentWrapperProps {
  companyFilter?: string;
  initialJobs?: any[];
  initialError?: string | null;
}

export const JobsContentWrapper: React.FC<JobsContentWrapperProps> = ({ 
  companyFilter, 
  initialJobs = [], 
  initialError = null 
}) => {
  const { t } = useLanguageStore();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>(Array.isArray(initialJobs) ? initialJobs : []);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      loadJobs();
    }
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { jobs: jobsData, error: jobsError } = await jobService.getJobsWithErrorHandling({
        page: 1,
        limit: 50
      });
      
      
      if (jobsError) {
        setError(jobsError.message || t('errorLoadingData'));
      } else {
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      }
    } catch (err: any) {
      setError(err.message || t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  // Фільтруємо роботи по компанії, якщо вказано фільтр
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  const filteredJobs = companyFilter 
    ? jobsArray.filter(job => getCompanyName(job.company).toLowerCase().includes(companyFilter.toLowerCase()))
    : jobsArray;

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">{t('loading')}...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Jobs Header з фіолетовим дизайном */}
      <div className="purple-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            {companyFilter ? `${t('companyJobs')} "${companyFilter}"` : t('jobs')}
          </h1>
          <p className="dashboard-greeting-subtitle">
            {companyFilter 
              ? `${t('allOpenPositions')} ${companyFilter}`
              : t('findPerfectJob')
            }
          </p>
        </div>
        <div className="header-actions">
          {/* Кнопка "Створити профіль" для кандидатів */}
          {user?.role === USER_TYPES.CANDIDATE && (
            <Link href="/candidates/create" className="add-job-btn create-profile-btn">
              <UserPlus className="icon" />
              {t('createProfile')}
            </Link>
          )}
          {/* Кнопка "Додати вакансію" для роботодавців */}
          {(user?.role === USER_TYPES.EMPLOYER || user?.role === USER_TYPES.ADMIN) && (
            <Link href="/jobs/create" className="add-job-btn">
              <Plus className="icon" />
              {t('addJob')}
            </Link>
          )}
        </div>
      </div>

      {/* Пошук та фільтри - ТІЛЬКИ для кандидатів */}
      {user?.role === USER_TYPES.CANDIDATE && (
        <div className="jobs-search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder={t('searchJobsPlaceholder')}
              className="search-input" 
            />
          </div>
          <button className="filter-toggle-btn">
            <Filter className="icon" />
            {t('filters')}
          </button>
        </div>
      )}

      {/* Список вакансій */}
      <div className="jobs-results">
        {error && (
          <div className="error-banner">
            <p>❌ {error}</p>
            <button 
              onClick={loadJobs}
              className="btn btn-primary"
            >
              {t('tryAgain')}
            </button>
          </div>
        )}

        {!error && filteredJobs && filteredJobs.length >= 0 && (
          <div className="results-header">
            <p className="results-count">
              {(t('foundJobs') || 'Знайдено вакансій: {count}').replace('{count}', (filteredJobs?.length || 0).toString())}{companyFilter ? ` ${t('inCompany') || 'в компанії'} "${companyFilter}"` : ''}
            </p>
          </div>
        )}

        <div className="jobs-grid">
          {filteredJobs && filteredJobs.length > 0 ? filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-company">{getCompanyName(job.company)}</span>
                </div>
              </div>

              <div className="job-details">
                <div className="job-detail">
                  <MapPin className="icon" />
                  <span>{job.location}</span>
                </div>
                <div className="job-detail">
                  <Briefcase className="icon" />
                  <span>{getLocalizedJobType(job.type, (key: string) => t(key as any))}</span>
                </div>
                <div className="job-detail">
                  <DollarSign className="icon" />
                  <span>{job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax} ${job.currency || 'USD'}` : t('salaryNotSpecified')}</span>
                </div>
                <div className="job-detail">
                  <Clock className="icon" />
                  <span>{t('published')} {job.posted ? (() => {
                    try {
                      return new Date(job.posted).toLocaleDateString('uk-UA');
                    } catch {
                      return job.posted;
                    }
                  })() : t('recently')}</span>
                </div>
              </div>

              <div className="job-description">
                <TruncatedText text={job.description} maxLength={200} />
              </div>

              <div className="job-requirements">
                <h4>{t('requirements')}:</h4>
                <div className="requirements-tags">
                  {(job.skills || []).slice(0, 3).map((req: string, index: number) => (
                    <span key={index} className="requirement-tag">
                      {req}
                    </span>
                  ))}
                  {(job.skills || []).length > 3 && (
                    <span className="requirement-tag more">
                      +{(job.skills || []).length - 3} {t('more')}
                    </span>
                  )}
                </div>
              </div>

              <div className="job-footer">
                <Link href={`/jobs/${job.id}`} className="btn btn-outline">
                  <Eye className="icon" />
                  {t('viewDetails')}
                </Link>
                {user?.role === USER_TYPES.CANDIDATE && (
                  <button className="btn btn-primary apply-button">
                    {t('applyForJob')}
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="no-jobs-message">
              <p>{t('noJobsFound')}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Клієнтський компонент для функціональності кнопок подачі заявок */}
      <JobsListApplyButtons jobs={jobsArray.map(job => ({ id: job.id, title: job.title }))} />
    </div>
  );
};
