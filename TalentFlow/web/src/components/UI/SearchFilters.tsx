import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  searchPlaceholder?: string;
  showAdvancedFilters?: boolean;
  onToggleAdvancedFilters?: (show: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  searchPlaceholder = "Пошук...",
  showAdvancedFilters = false,
  onToggleAdvancedFilters
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce для пошуку
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="search-filters">
      {/* Пошуковий рядок */}
      <div className="search-input-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="search-input"
        />
        {localSearchQuery && (
          <button 
            className="clear-search-btn"
            onClick={handleClearSearch}
            title="Очистити пошук"
          >
            <X className="icon" />
          </button>
        )}
      </div>

      {/* Кнопка фільтрів */}
      <div className="filters-toggle">
        <button 
          className={`btn ${showAdvancedFilters ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onToggleAdvancedFilters?.(!showAdvancedFilters)}
        >
          <SlidersHorizontal className="icon" />
          {showAdvancedFilters ? 'Приховати фільтри' : 'Фільтри'}
          {hasActiveFilters && (
            <span className="active-filters-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
