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
import UserDebug from '../components/UI/UserDebug';

const JobsPage: React.FC = () => {
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
  const [industrys, setDepartments] = useState<string[]>([]);
  
  // Стан для активного таба
  const [activeTab, setActiveTab] = useState<'public' | 'personal'>('public');
  
  // Мемоізуємо фільтри, щоб уникнути зайвих рендерів
  const memoizedFilters = useMemo(() => {
    console.log('🔄 memoizedFilters updated:', filters);
    return filters;
  }, [filters]);
  
  // Ref для debounce timer
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Завантаження опцій фільтрів
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [locationsData, typesData, levelsData] = await Promise.all([
          jobService.getAvailableLocations(),
          jobService.getJobTypes(),
          jobService.getExperienceLevels()
        ]);
        
        setLocations(locationsData);
        setJobTypes(typesData);
        setExperienceLevels(levelsData);
        setDepartments(['IT', 'HR', 'Marketing', 'Sales', 'Finance']); // Статичні дані
      } catch (error) {
        console.error('Помилка завантаження опцій фільтрів:', error);
      }
    };
    
    loadFilterOptions();
    
    // Cleanup для timer при розмонтуванні
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  // Завантаження вакансій
  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const requestParams = {
        page: currentPage,
        limit: pageSize,
        filters: {
          search: searchQuery,
          ...memoizedFilters
        }
      };
      
      let response;
      if (activeTab === 'personal') {
        console.log('🔍 Loading personal jobs...');
        response = await jobService.getPersonalJobs(requestParams);
      } else {
        console.log('🔍 Loading public jobs...');
        response = await jobService.getPublicJobs(requestParams);
      }
      
      console.log('🚀 loadJobs called with params:', requestParams);
      console.log('🔍 memoizedFilters:', memoizedFilters);
      
      setJobs(response.jobs);
      setTotalJobs(response.total);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      setError(t('errorLoadingJobs'));
      console.error('Помилка завантаження вакансій:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, memoizedFilters, activeTab, t]);

  // Завантаження при зміні параметрів
  useEffect(() => {
    // Додаємо лог для відстеження
    console.log('🔄 useEffect triggered:', { currentPage, pageSize, searchQuery, memoizedFilters, activeTab });
    loadJobs();
  }, [currentPage, pageSize, searchQuery, memoizedFilters, activeTab, loadJobs]);

  // Обробка зміни пошуку
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Обробка зміни фільтрів з debounce
  const handleFilterChange = useCallback((key: keyof JobFilters, value: any) => {
    console.log('handleFilterChange:', key, value);
    
    // Очищаємо попередній timer
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // Встановлюємо новий timer для debounce (300ms)
    filterTimeoutRef.current = setTimeout(() => {
      // Оновлюємо фільтри та сторінку одночасно
      setFilters(prev => {
        const newFilters = {
          ...prev,
          [key]: value
        };
        console.log('🎯 New filters (debounced):', newFilters);
        return newFilters;
      });
      
      // Скидаємо сторінку на 1 одночасно з фільтрами
      setCurrentPage(1);
    }, 300);
  }, []);



  // Очищення всіх фільтрів
  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Обробка збереження вакансії
  const handleSaveJob = useCallback(async (jobId: string) => {
    try {
      await jobService.saveJob(jobId);
      // Оновлюємо список вакансій
      loadJobs();
    } catch (error) {
      console.error('Помилка збереження вакансії:', error);
    }
  }, [loadJobs]);

  // Обробка подачі заявки
  const handleApplyToJob = useCallback(async (jobId: string) => {
    try {
      await jobService.applyToJob(jobId, {}); // Додаємо пустий об'єкт
      // Оновлюємо список вакансій
      loadJobs();
    } catch (error) {
      console.error('Помилка подачі заявки:', error);
    }
  }, [loadJobs]);

  // Форматування дати
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('dayAgo');
    if (diffDays < 7) return t('daysAgo', { count: diffDays });
    if (diffDays < 30) return t('weeksAgo', { count: Math.floor(diffDays / 7) });
    return t('monthsAgo', { count: Math.floor(diffDays / 30) });
  }, [t]);
  
  // Локалізація типу вакансії
  const getLocalizedJobType = useCallback((type: string) => {
    const typeMap: { [key: string]: string } = {
      'full_time': t('fullTime'),
      'part_time': t('partTime'),
      'contract': t('contract'),
      'internship': t('internship'),
      'freelance': t('freelance'),
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
      <div className="jobs-tabs" style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <button
          className={`tab-button ${activeTab === 'public' ? 'active' : ''}`}
          onClick={() => setActiveTab('public')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            background: activeTab === 'public' ? '#3b82f6' : '#f3f4f6',
            color: activeTab === 'public' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {t('allJobs')}
        </button>
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            background: activeTab === 'personal' ? '#3b82f6' : '#f3f4f6',
            color: activeTab === 'personal' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {t('myJobs')}
        </button>
      </div>
      
      {/* Пошук та фільтри */}
      <div className="search-filters">
        {/* Пошуковий рядок - ТІЛЬКИ для кандидатів */}
        {user?.role === USER_TYPES.CANDIDATE && (
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={t('searchJobsPlaceholder')}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => handleSearchChange('')}
                title={t('clearSearch')}
              >
                <X className="icon" />
              </button>
            )}
          </div>
        )}
        
        {/* Розширені фільтри */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filters-grid">
              <div className="filter-group">
                <label>{t('location')}</label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">{t('allLocations')}</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('type')}</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">{t('allTypes')}</option>
                                     {jobTypes.map(type => (
                     <option key={type} value={type}>{getLocalizedJobType(type)}</option>
                   ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('experienceLevel')}</label>
                <select
                  value={filters.experienceLevel || ''}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">{t('anyExperienceLevel')}</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('industry')}</label>
                <select
                  value={filters.industry || ''}
                  onChange={(e) => handleFilterChange('industry', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">{t('allDepartments')}</option>
                  {industrys.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('salaryFrom')}</label>
                <input
                  type="number"
                  placeholder={t('salaryFrom')}
                  value={filters.salaryMin || ''}
                  onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label>{t('salaryTo')}</label>
                <input
                  type="number"
                  placeholder={t('salaryTo')}
                  value={filters.salaryMax || ''}
                  onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="remote"
                    checked={filters.remote || false}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                  />
                  {t('remoteWorkOnly')}
                </label>
              </div>
              
              <div className="filter-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={filters.isUrgent || false}
                    onChange={(e) => handleFilterChange('isUrgent', e.target.checked)}
                  />
                  {t('urgentJobs')}
                </label>
              </div>
            </div>
            
            <div className="filter-actions">

              <button className="btn btn-outline" onClick={clearAllFilters}>
                {t('resetAllFilters')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Стан завантаження */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('loadingJobsMessage')}</p>
        </div>
      )}
      
      {/* Стан помилки */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadJobs}>
            {t('tryAgain')}
          </button>
        </div>
      )}
      
      {/* Список вакансій */}
      {!loading && !error && (
        <div className="dashboard-sections-grid">
          <div className="dashboard-section-card">
            <h2 className="dashboard-section-title">{t('foundJobsCount', { count: totalJobs })}</h2>
            {Object.keys(filters).length > 0 && (
              <span className="active-filters-count">
                {t('activeFiltersCount', { count: Object.keys(filters).filter(key => filters[key as keyof JobFilters]).length })}
              </span>
            )}
            <div className="jobs-list">
              {jobs.length === 0 ? (
                <div className="empty-state">
                  <p>{t('noJobsFoundMessage')}</p>
                  <button className="btn btn-outline" onClick={clearAllFilters}>
                    {t('resetFilters')}
                  </button>
                </div>
              ) : (
                jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div className="job-title-section">
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-company">
                          {typeof job.company === 'string' 
                            ? job.company 
                            : job.company?.name || t('companyNotSpecified')
                          }
                        </div>
                      </div>
                      <div className="job-actions">
                        <button 
                          className="job-action-btn"
                          onClick={() => handleSaveJob(job.id)}
                          title={t('saveToFavorites')}
                        >
                          <Heart className="icon" />
                        </button>
                        <button className="job-action-btn" title={t('share')}>
                          <Share2 className="icon" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="job-details">
                      <div className="job-detail-item">
                        <MapPin className="icon" />
                        <span>{job.location}</span>
                        {job.remote && <span className="remote-badge">{t('remoteBadge')}</span>}
                      </div>
                                             <div className="job-detail-item">
                         <Briefcase className="icon" />
                         <span>{getLocalizedJobType(job.type)}</span>
                       </div>
                      <div className="job-detail-item">
                        <Clock className="icon" />
                        <span>{job.experienceLevel}</span>
                      </div>
                      <div className="job-detail-item">
                        <DollarSign className="icon" />
                        <span>
                          {job.salaryMin && job.salaryMax 
                            ? t('salaryRange', { min: job.salaryMin, max: job.salaryMax })
                            : t('salaryNotSpecified')
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="job-description">
                      {job.description?.substring(0, 200)}... {t('jobDescription')}
                    </div>
                    
                    <div className="job-skills">
                      {job.skills?.slice(0, 5).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                                              {job.skills && job.skills.length > 5 && (
                          <span className="skill-tag more-skills">{t('moreSkills', { count: job.skills.length - 5 })}</span>
                        )}
                    </div>
                    
                    <div className="job-footer">
                      <div className="job-stats">
                        <span className="job-stat">
                          <Eye className="icon" />
                          {t('viewsCount', { count: job.views })}
                        </span>
                        <span className="job-stat">
                          <Briefcase className="icon" />
                          {t('applicationsCount', { count: job.applications })}
                        </span>
                        <span className="job-stat">
                          <Clock className="icon" />
                          {t('postedTime', { time: formatDate(job.createdAt) })}
                        </span>
                      </div>
                      
                      <div className="job-actions-footer">
                        {user?.role === USER_TYPES.CANDIDATE && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApplyToJob(job.id)}
                          >
                            {t('applyForJob')}
                          </button>
                        )}
                        <button className="btn btn-outline btn-sm">
                          {t('viewDetails')}
                        </button>
                      </div>
                    </div>
                    
                    {/* Бейджі */}
                    {job.isUrgent && (
                      <div className="urgent-badge">
                        {t('urgentBadge')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Пагінація */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  {t('previousPage')}
                </button>
                
                <span className="pagination-info">
                  {t('paginationInfo', { current: currentPage, total: totalPages })}
                </span>
                
                <button 
                  className="btn btn-outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  {t('nextPage')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
