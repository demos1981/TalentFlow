import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { candidateService, CandidateSearchFilters, CandidateSearchResult, CandidateProfile } from '../../services/candidateService';
import SearchFilters from './SearchFilters';
import CandidateList from './CandidateList';
import SearchStats from './SearchStats';
import { Search, Users, Filter, Star, MapPin, Briefcase, Clock } from 'lucide-react';
import './CandidateSearch.css';

const CandidateSearch: React.FC = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<CandidateSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<CandidateSearchFilters>({
    page: 1,
    limit: 20,
    sortBy: 'relevance',
    sortOrder: 'DESC'
  });

  // Перевіряємо чи користувач має право шукати кандидатів
  const canSearchCandidates = user?.isEmployer?.() && user?.canSearchCandidate?.();

  useEffect(() => {
    if (canSearchCandidates) {
      performSearch(currentFilters);
    }
  }, []);

  const performSearch = async (filters: CandidateSearchFilters) => {
    if (!canSearchCandidates) {
      setError('У вас немає прав для пошуку кандидатів');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await candidateService.searchCandidates(filters);
      setSearchResults(results);
      setCurrentFilters(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка пошуку кандидатів');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Partial<CandidateSearchFilters>) => {
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };
    performSearch(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...currentFilters, page };
    performSearch(updatedFilters);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    const updatedFilters = { ...currentFilters, sortBy: sortBy as any, sortOrder, page: 1 };
    performSearch(updatedFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: CandidateSearchFilters = {
      page: 1,
      limit: 20,
      sortBy: 'relevance',
      sortOrder: 'DESC'
    };
    performSearch(defaultFilters);
  };

  if (!canSearchCandidates) {
    return (
      <div className="candidate-search-container">
        <div className="access-denied">
          <Users className="access-denied-icon" />
          <h2>Доступ заборонено</h2>
          <p>Тільки роботодавці можуть шукати кандидатів.</p>
          <p>Якщо ви роботодавець, зверніться до адміністратора для налаштування прав доступу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-search-container">
      {/* Header */}
      <div className="search-header">
        <div className="search-header-content">
          <h1 className="search-title">
            <Users className="search-title-icon" />
            Пошук кандидатів
          </h1>
          <p className="search-subtitle">
            Знайдіть ідеальних кандидатів для ваших вакансій
          </p>
          
          {/* Quick Stats */}
          {searchResults && (
            <div className="quick-stats">
              <div className="stat-item">
                <Users className="stat-icon" />
                <span className="stat-value">{searchResults.total}</span>
                <span className="stat-label">кандидатів знайдено</span>
              </div>
              <div className="stat-item">
                <Star className="stat-icon" />
                <span className="stat-value">{searchResults.totalPages}</span>
                <span className="stat-label">сторінок результатів</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Controls */}
      <div className="search-controls">
        <div className="search-controls-left">
          <button
            className={`btn btn-outline ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="icon" />
            {showFilters ? 'Сховати фільтри' : 'Показати фільтри'}
          </button>
          
          {Object.keys(currentFilters).length > 3 && (
            <button
              className="btn btn-outline btn-danger"
              onClick={handleResetFilters}
            >
              Скинути фільтри
            </button>
          )}
        </div>

        <div className="search-controls-right">
          <div className="sort-controls">
            <label htmlFor="sortBy">Сортування:</label>
            <select
              id="sortBy"
              value={currentFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value, currentFilters.sortOrder || 'DESC')}
              className="form-select"
            >
              <option value="relevance">За релевантністю</option>
              <option value="experience">За досвідом</option>
              <option value="rating">За рейтингом</option>
              <option value="recent">За датою</option>
            </select>
            
            <button
              className={`btn btn-sm ${currentFilters.sortOrder === 'ASC' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSortChange(
                currentFilters.sortBy || 'relevance',
                currentFilters.sortOrder === 'ASC' ? 'DESC' : 'ASC'
              )}
            >
              {currentFilters.sortOrder === 'ASC' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <SearchFilters
            currentFilters={currentFilters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>
      )}

      {/* Search Results */}
      <div className="search-results">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Шукаємо кандидатів...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => performSearch(currentFilters)}
            >
              Спробувати ще раз
            </button>
          </div>
        ) : searchResults ? (
          <>
            <CandidateList
              candidates={searchResults.candidates}
              onPageChange={handlePageChange}
              currentPage={searchResults.page}
              totalPages={searchResults.totalPages}
              total={searchResults.total}
            />
          </>
        ) : (
          <div className="empty-state">
            <Search className="empty-state-icon" />
            <h3>Почніть пошук кандидатів</h3>
            <p>Використайте фільтри вище, щоб знайти ідеальних кандидатів для ваших вакансій.</p>
          </div>
        )}
      </div>

      {/* Search Statistics */}
      {searchResults && searchResults.total > 0 && (
        <div className="search-stats-section">
          <SearchStats />
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;




