import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();
  
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
  const [departments, setDepartments] = useState<string[]>([]);

  // Перевірка доступу
  useEffect(() => {
    if (!user || user.role !== 'employer') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Завантаження опцій фільтрів
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [locationsData, skillsData, levelsData, deptsData] = await Promise.all([
          candidateService.getAvailableLocations(),
          candidateService.getPopularSkills(),
          candidateService.getExperienceLevels(),
          candidateService.getAvailableDepartments()
        ]);
        
        setLocations(locationsData);
        setSkills(skillsData);
        setExperienceLevels(levelsData);
        setDepartments(deptsData);
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
        filters: {
          ...filters,
          search: searchQuery || undefined
        },
        sortBy: 'relevance',
        sortOrder: 'DESC'
      });
      
      setCandidates(response.candidates);
      setTotalPages(response.totalPages);
      setTotalCandidates(response.total);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setError('Помилка завантаження кандидатів');
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
    if (!min && !max) return 'Не вказано';
    const curr = currency || 'USD';
    if (min && max) return `${min}-${max} ${curr}`;
    if (min) return `від ${min} ${curr}`;
    if (max) return `до ${max} ${curr}`;
    return 'Не вказано';
  };

  // Форматування досвіду
  const formatExperience = (years: number) => {
    if (years === 1) return '1 рік';
    if (years < 5) return `${years} роки`;
    return `${years} років`;
  };

  // Розрахунок релевантності
  const calculateRelevance = (candidate: Candidate) => {
    let score = 0;
    
    // Базовий бал за досвід
    if (candidate.experience) {
      score += Math.min(candidate.experience * 10, 50);
    }
    
    // Бал за навички
    if (candidate.skills) {
      score += candidate.skills.length * 5;
    }
    
    // Бал за освіту
    if (candidate.education) {
      score += 20;
    }
    
    // Бал за сертифікації
    if (candidate.certifications) {
      score += candidate.certifications.length * 10;
    }
    
    return Math.min(score, 100);
  };

  if (!user || user.role !== 'employer') {
    return null;
  }

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Пошук кандидатів</h1>
          <p className="dashboard-greeting-subtitle">
            Знайдіть найкращих спеціалістів для вашої команди
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-input-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Пошук кандидатів за ім'ям, навичками, досвідом..."
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
            {showFilters ? 'Приховати фільтри' : 'Фільтри'}
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
                <label>Локація</label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">Всі локації</option>
                  {Array.isArray(locations) && locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Рівень досвіду</label>
                <select
                  value={filters.experienceLevel || ''}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">Будь-який рівень</option>
                  {Array.isArray(experienceLevels) && experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Відділ</label>
                <select
                  value={filters.department || ''}
                  onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
                  className="filter-select"
                >
                  <option value="">Всі відділи</option>
                  {Array.isArray(departments) && departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Зарплата від</label>
                <input
                  type="number"
                  placeholder="Мін. зарплата"
                  value={filters.salaryMin || ''}
                  onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label>Зарплата до</label>
                <input
                  type="number"
                  placeholder="Макс. зарплата"
                  value={filters.salaryMax || ''}
                  onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label>Навички</label>
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
                Скинути всі
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Завантаження кандидатів...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadCandidates}>
            Спробувати знову
          </button>
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && !error && (
        <div className="dashboard-sections-grid">
          <div className="dashboard-section-card">
            <h2 className="dashboard-section-title">
              Знайдені кандидати ({totalCandidates})
              {Object.keys(filters).length > 0 && (
                <span className="active-filters-count">
                  (фільтрів: {Object.keys(filters).filter(key => filters[key as keyof CandidateFilters]).length})
                </span>
              )}
            </h2>
            
            {candidates.length === 0 ? (
              <div className="empty-state">
                <p>Кандидатів не знайдено</p>
                <button className="btn btn-outline" onClick={clearAllFilters}>
                  Скинути фільтри
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
                              {candidate.avatar ? (
                                <img src={candidate.avatar} alt={candidate.firstName} />
                              ) : (
                                <div className="avatar-placeholder">
                                  {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="candidate-details">
                              <h3 className="candidate-name">
                                {candidate.firstName} {candidate.lastName}
                              </h3>
                              <div className="candidate-title">
                                <Briefcase className="icon" />
                                {candidate.jobTitle || 'Позиція не вказана'}
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
                              title="Зберегти в обране"
                            >
                              <Heart className="icon" />
                            </button>
                            <button className="candidate-action-btn" title="Поділитися">
                              <Share2 className="icon" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="candidate-details-row">
                          <div className="candidate-detail-item">
                            <MapPin className="icon" />
                            <span>{candidate.location || 'Локація не вказана'}</span>
                          </div>
                          <div className="candidate-detail-item">
                            <Clock className="icon" />
                            <span>{candidate.experience ? formatExperience(candidate.experience) : 'Досвід не вказано'}</span>
                          </div>
                          <div className="candidate-detail-item">
                            <DollarSign className="icon" />
                            <span>{formatSalary(candidate.salaryMin, candidate.salaryMax, candidate.currency)}</span>
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
                        
                        {candidate.education && (
                          <div className="candidate-education">
                            <Award className="icon" />
                            <span>{candidate.education}</span>
                          </div>
                        )}
                        
                        <div className="candidate-footer">
                          <div className="candidate-actions-main">
                            <button className="btn btn-primary btn-sm">
                              Запропонувати вакансію
                            </button>
                            <button className="btn btn-outline btn-sm">
                              Переглянути профіль
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
                      Попередня
                    </button>
                    
                    <span className="pagination-info">
                      Сторінка {currentPage} з {totalPages}
                    </span>
                    
                    <button 
                      className="btn btn-outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Наступна
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
