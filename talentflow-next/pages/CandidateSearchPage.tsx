import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { USER_TYPES } from '../constants';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building2,
  Eye,
  Heart,
  Share2,
  X,
  SlidersHorizontal,
  Star,
  Award
} from 'lucide-react';
import { candidateService, Candidate, CandidateFilters } from '../services/candidateService';

const CandidateSearchPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  
  // Стан для пошуку та фільтрів
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Стан для даних
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Стан для пагінації
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  
  // Стан для опцій фільтрів
  const [locations, setLocations] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);

  // Перевірка доступу
  useEffect(() => {
    if (!user || user.role !== USER_TYPES.EMPLOYER) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Завантаження опцій фільтрів
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [locationsData, skillsData, levelsData] = await Promise.all([
          candidateService.getAvailableLocations(),
          candidateService.getPopularSkills(),
          candidateService.getExperienceLevels()
        ]);
        
        setLocations(locationsData.map(loc => loc.name));
        setSkills(skillsData);
        setExperienceLevels(levelsData);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);

  // Функція завантаження кандидатів
  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await candidateService.searchCandidates({
        page: currentPage,
        limit: 12,
        ...filters,
        search: searchQuery || undefined,
        sortBy: 'relevance',
        sortOrder: 'DESC'
      });
      
      setCandidates(response.candidates);
      setTotalPages(response.totalPages);
      setTotalCandidates(response.total);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setError(t('errorLoadingCandidates'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchQuery]);

  // Завантаження кандидатів при зміні параметрів
  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Обробка зміни пошуку
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Обробка зміни фільтрів
  const handleFilterChange = (key: keyof CandidateFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  // Скидання всіх фільтрів
  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Збереження кандидата в обране
  const handleSaveCandidate = async (candidateId: string) => {
    try {
      await candidateService.saveCandidate(candidateId);
      loadCandidates();
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  // Форматування зарплати
  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return t('notSpecified');
    const curr = currency || 'USD';
    if (min && max) return `${min}-${max} ${curr}`;
    if (min) return `${t('from')} ${min} ${curr}`;
    if (max) return `${t('to')} ${max} ${curr}`;
    return t('notSpecified');
  };

  // Форматування досвіду
  const formatExperience = (years: number) => {
    if (years === 1) return `1 ${t('year')}`;
    if (years < 5) return `${years} ${t('years')}`;
    return `${years} ${t('years')}`;
  };

  // Розрахунок релевантності
  const calculateRelevance = (candidate: Candidate) => {
    let score = 0;
    
    // Базовий бал за досвід
    if (candidate.yearsOfExperience) {
      score += Math.min(candidate.yearsOfExperience * 10, 50);
    }
    
    // Бал за навички
    if (candidate.skills) {
      score += candidate.skills.length * 5;
    }
    
    // Бал за освіту
    if (candidate.education && candidate.education.length > 0) {
      score += 20;
    }
    
    // Бал за сертифікації
    if (candidate.certifications && candidate.certifications.length > 0) {
      score += candidate.certifications.length * 10;
    }
    
    return Math.min(score, 100);
  };

  if (!user || user.role !== USER_TYPES.EMPLOYER) {
    return null;
  }

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">{t('candidateSearch')}</h1>
          <p className="dashboard-greeting-subtitle">
            {t('findBestSpecialistsForYourTeam')}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-input-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={t('searchCandidatesPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => handleSearchChange('')}
            >
              <X className="icon" />
            </button>
          )}
        </div>
        
        {/* Кнопка фільтрів */}
        <div className="filters-toggle">
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="icon" />
            {showFilters ? t('hideFilters') : t('filters')}
            {Object.keys(filters).length > 0 && (
              <span className="active-filters-badge">
                {Object.keys(filters).filter(key => filters[key as keyof CandidateFilters]).length}
              </span>
            )}
          </button>
        </div>
        
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
                  {Array.isArray(locations) && locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('experienceLevel')}</label>
                <select
                  value={filters.experience || ''}
                  onChange={(e) => handleFilterChange('experience', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-select"
                >
                  <option value="">{t('anyLevel')}</option>
                  {Array.isArray(experienceLevels) && experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('salaryFrom')}</label>
                <input
                  type="number"
                  placeholder={t('minSalary')}
                  value={filters.minSalary || ''}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label>{t('salaryTo')}</label>
                <input
                  type="number"
                  placeholder={t('maxSalary')}
                  value={filters.maxSalary || ''}
                  onChange={(e) => handleFilterChange('maxSalary', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label>{t('skills')}</label>
                <select
                  multiple
                  value={filters.skills || []}
                  onChange={(e) => {
                    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
                    handleFilterChange('skills', selectedSkills);
                  }}
                  className="filter-select"
                >
                  {Array.isArray(skills) && skills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="btn btn-outline" onClick={clearAllFilters}>
                {t('clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('loadingCandidates')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadCandidates}>
            {t('tryAgain')}
          </button>
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && !error && (
        <div className="dashboard-sections-grid">
          <div className="dashboard-section-card">
            <h2 className="dashboard-section-title">
              {t('foundCandidates')} ({totalCandidates})
              {Object.keys(filters).length > 0 && (
                <span className="active-filters-count">
                  ({t('filters')}: {Object.keys(filters).filter(key => filters[key as keyof CandidateFilters]).length})
                </span>
              )}
            </h2>
            
            {candidates.length === 0 ? (
              <div className="empty-state">
                <p>{t('noCandidatesFound')}</p>
                <button className="btn btn-outline" onClick={clearAllFilters}>
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="candidates-list">
                  {candidates.map(candidate => {
                    const relevance = calculateRelevance(candidate);
                    return (
                      <div key={candidate.id} className="candidate-card">
                        <div className="candidate-header">
                          <div className="candidate-info">
                            <div className="candidate-avatar">
                              {candidate.user?.avatar ? (
                                <img src={candidate.user.avatar} alt={candidate.user.firstName} />
                              ) : (
                                <div className="avatar-placeholder">
                                  {candidate.user?.firstName?.charAt(0)}{candidate.user?.lastName?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="candidate-details">
                              <h3 className="candidate-name">
                                {candidate.user?.firstName} {candidate.user?.lastName}
                              </h3>
                              <div className="candidate-title">
                                <Briefcase className="icon" />
                                {candidate.title || t('positionNotSpecified')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="candidate-actions">
                            <div className="relevance-score">
                              <Star className="icon" />
                              {relevance}%
                            </div>
                            <button 
                              className="candidate-action-btn"
                              onClick={() => handleSaveCandidate(candidate.id)}
                              title={t('saveToFavorites')}
                            >
                              <Heart className="icon" />
                            </button>
                            <button className="candidate-action-btn" title={t('share')}>
                              <Share2 className="icon" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="candidate-details-row">
                          <div className="candidate-detail-item">
                            <MapPin className="icon" />
                            <span>{candidate.location || t('locationNotSpecified')}</span>
                          </div>
                          <div className="candidate-detail-item">
                            <Clock className="icon" />
                            <span>{candidate.yearsOfExperience ? formatExperience(candidate.yearsOfExperience) : t('experienceNotSpecified')}</span>
                          </div>
                          <div className="candidate-detail-item">
                            <DollarSign className="icon" />
                            <span>{formatSalary(candidate.preferences?.desiredSalary, candidate.preferences?.salaryExpectation, 'USD')}</span>
                          </div>
                        </div>
                        
                        {candidate.bio && (
                          <p className="candidate-bio">{candidate.bio}</p>
                        )}
                        
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="candidate-skills">
                            {candidate.skills.map(skill => (
                              <span key={skill} className="candidate-skill">{skill}</span>
                            ))}
                          </div>
                        )}
                        
                        {candidate.education && candidate.education.length > 0 && (
                          <div className="candidate-education">
                            <Award className="icon" />
                            <span>{candidate.education.join(', ')}</span>
                          </div>
                        )}
                        
                        <div className="candidate-footer">
                          <div className="candidate-actions-main">
                            <button className="btn btn-primary btn-sm">
                              {t('offerJob')}
                            </button>
                            <button className="btn btn-outline btn-sm">
                              {t('viewProfile')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Пагінація */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="btn btn-outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      {t('previous')}
                    </button>
                    
                    <span className="pagination-info">
                      {t('page')} {currentPage} {t('of')} {totalPages}
                    </span>
                    
                    <button 
                      className="btn btn-outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      {t('next')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearchPage;
