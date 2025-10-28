'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { USER_TYPES } from '../constants';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Plus, 
  Heart, 
  Share2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Eye, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { jobService, Job, JobFilters } from '../services/jobService';
import UserDebug from './UI/UserDebug';

export const ClientJobsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  
  // Стан для пошуку та фільтрів
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Стан для даних
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // Стан для пагінації
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Стан для опцій фільтрів
  const [locations, setLocations] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  
  // Стан для активного таба
  const [activeTab, setActiveTab] = useState<'public' | 'personal'>('public');
  
  // Мемоізуємо фільтри, щоб уникнути зайвих рендерів
  const memoizedFilters = useMemo(() => {
    console.log('🔄 memoizedFilters updated:', filters);
    return filters;
  }, [filters]);

  // Завантаження вакансій
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading jobs with filters:', memoizedFilters);
      console.log('Search query:', searchQuery);
      console.log('Active tab:', activeTab);
      
      const response = await jobService.getJobs({
        ...memoizedFilters,
        search: searchQuery,
        page: currentPage,
        limit: pageSize
      });
      
      console.log('Jobs response:', response);
      
      setJobs(response.jobs || []);
      setTotalJobs(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
      
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      setError(err.message || 'Помилка завантаження вакансій');
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters, searchQuery, currentPage, pageSize, activeTab]);

  // Завантаження опцій фільтрів
  const loadFilterOptions = useCallback(async () => {
    try {
      const [locationsRes, jobTypesRes, experienceRes, industriesRes] = await Promise.all([
        jobService.getAvailableLocations(),
        jobService.getJobTypes(),
        jobService.getExperienceLevels(),
        jobService.getAvailableIndustries()
      ]);
      
      setLocations(locationsRes || []);
      setJobTypes(jobTypesRes || []);
      setExperienceLevels(experienceRes || []);
      setIndustries(industriesRes || []);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  }, []);

  // Ефекти
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  // Обробники
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleTabChange = useCallback((tab: 'public' | 'personal') => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  // Локалізація типів роботи
  const getLocalizedJobType = useCallback((type: string) => {
    const typeMap: { [key: string]: string } = {
      'full-time': t('fullTime'),
      'part-time': t('partTime'),
      'contract': t('contract'),
      'freelance': t('freelance'),
      'internship': t('internship'),
      'remote': t('remote')
    };
    return typeMap[type] || type;
  }, [t]);

  return (
    <div className="dashboard-container">
      {/* Jobs Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">{t('jobs')}</h1>
          <p className="dashboard-greeting-subtitle">
            {user?.role === USER_TYPES.CANDIDATE 
              ? t('findBestJob')
              : t('findBestJobOrHire')
            }
          </p>
          <div className="dashboard-actions">
            {(user?.role === USER_TYPES.EMPLOYER || user?.role === USER_TYPES.ADMIN) && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  console.log('JobsPage: Create job button clicked');
                  console.log('JobsPage: User:', user);
                  console.log('JobsPage: User role:', user?.role);
                  router.push('/jobs/create');
                }}
              >
                <Plus className="icon" />
                {t('createJob')}
              </button>
            )}
            <button 
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="icon" />
              {showFilters ? t('hideFilters') : t('filters')}
            </button>
          </div>
        </div>
      </div>

      {/* Debug інформація про користувача */}
      <UserDebug />
      
      {/* Таби для переключення між публічними та особистими вакансіями */}
      <div className="jobs-tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-button ${activeTab === 'public' ? 'active' : ''}`}
          onClick={() => handleTabChange('public')}
        >
          Публічні
        </button>
        {(user?.role === USER_TYPES.EMPLOYER || user?.role === USER_TYPES.ADMIN) && (
          <button
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            {t('myJobs')}
          </button>
        )}
      </div>

      {/* Пошук та фільтри */}
      <div className="jobs-search-section">
        {/* Пошук - ТІЛЬКИ для кандидатів */}
        {user?.role === USER_TYPES.CANDIDATE && (
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder={t('searchJobsPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="clear-search-btn"
                >
                  <X className="icon" />
                </button>
              )}
            </div>
            <button
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="icon" />
              {t('filters')}
            </button>
          </div>
        )}

        {/* Фільтри */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>{t('filters')}</h3>
              <button onClick={clearFilters} className="clear-filters-btn">
                {t('clearAll')}
              </button>
            </div>
            
            <div className="filters-grid">
              {/* Локація */}
              <div className="filter-group">
                <label>{t('location')}</label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange({ ...filters, location: e.target.value || undefined })}
                >
                  <option value="">{t('allLocations')}</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Тип роботи */}
              <div className="filter-group">
                <label>{t('jobType')}</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange({ ...filters, type: e.target.value || undefined })}
                >
                  <option value="">{t('allTypes')}</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{getLocalizedJobType(type)}</option>
                  ))}
                </select>
              </div>

              {/* Рівень досвіду */}
              <div className="filter-group">
                <label>{t('experienceLevel')}</label>
                <select
                  value={filters.experienceLevel || ''}
                  onChange={(e) => handleFilterChange({ ...filters, experienceLevel: e.target.value || undefined })}
                >
                  <option value="">{t('allLevels')}</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Галузь */}
              <div className="filter-group">
                <label>Галузь</label>
                <select
                  value={filters.industry || ''}
                  onChange={(e) => handleFilterChange({ ...filters, industry: e.target.value || undefined })}
                >
                  <option value="">Всі галузі</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Результати */}
      <div className="jobs-results">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('loading')}...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadJobs} className="btn btn-primary">
              {t('retry')}
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase className="empty-icon" />
            <h3>{t('noJobsFound')}</h3>
            <p>{t('noJobsFoundDescription')}</p>
            <button onClick={clearFilters} className="btn btn-primary">
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <>
            <div className="results-header">
              <p className="results-count">
                {t('foundJobs', { count: totalJobs })}
              </p>
            </div>

            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-title-section">
                      <h3 className="job-title">{job.title}</h3>
                      <span className="job-company">{typeof job.company === 'string' ? job.company : job.company?.name || 'Компанія не вказана'}</span>
                    </div>
                    <div className="job-actions-header">
                      <button className="icon-btn">
                        <Heart className="icon" />
                      </button>
                      <button className="icon-btn">
                        <Share2 className="icon" />
                      </button>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="job-detail">
                      <MapPin className="icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail">
                      <Briefcase className="icon" />
                      <span>{getLocalizedJobType(job.type)}</span>
                    </div>
                    <div className="job-detail">
                      <DollarSign className="icon" />
                      <span>{job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax} ${job.currency || 'USD'}` : 'Зарплата не вказана'}</span>
                    </div>
                    <div className="job-detail">
                      <Clock className="icon" />
                      <span>{t('published')} {job.createdAt}</span>
                    </div>
                  </div>

                  <div className="job-description">
                    <p>{job.description}</p>
                  </div>

                  <div className="job-requirements">
                    <h4>{t('requirements')}:</h4>
                    <div className="requirements-tags">
                      {job.requirements?.split(',').slice(0, 3).map((req, index) => (
                        <span key={index} className="requirement-tag">
                          {req}
                        </span>
                      ))}
                      {job.requirements && job.requirements.length > 3 && (
                        <span className="requirement-tag more">
                          +{job.requirements.length - 3} {t('more')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="job-footer">
                    <button 
                      className="btn btn-outline"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <Eye className="icon" />
                      {t('viewDetails')}
                    </button>
                    {user?.role === USER_TYPES.CANDIDATE && (
                      <button className="btn btn-primary">
                        {t('applyNow')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Пагінація */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {t('previous')}
                </button>
                
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {t('next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};