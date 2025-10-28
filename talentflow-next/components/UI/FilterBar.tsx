import React, { useState } from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import '../../styles/checkboxes.css';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'input' | 'checkbox' | 'multiselect' | 'range';
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FilterBarProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  filterConfigs: FilterConfig[];
  title?: string;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  filterConfigs,
  title = 'Фільтри',
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange(key, value);
  };

  const renderFilterInput = (config: FilterConfig) => {
    const value = filters[config.key];
    
    switch (config.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value || undefined)}
            className="filter-select"
          >
            <option value="">Всі</option>
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            placeholder={config.placeholder || ''}
            value={value || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value || undefined)}
            className="filter-input"
          />
        );

      case 'checkbox':
        return (
          <div className="custom-checkbox">
            <input
              type="checkbox"
              id={`filter-${config.key}`}
              checked={value || false}
              onChange={(e) => handleFilterChange(config.key, e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor={`filter-${config.key}`} className="checkbox-label">
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">{config.label}</span>
            </label>
          </div>
        );

      case 'multiselect':
        return (
          <select
            multiple
            value={value || []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange(config.key, selectedOptions);
            }}
            className="filter-select"
          >
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'range':
        return (
          <div className="range-inputs">
            <input
              type="number"
              placeholder={config.min?.toString() || 'Мін'}
              value={value?.min || ''}
              onChange={(e) => handleFilterChange(config.key, { 
                ...value, 
                min: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="filter-input"
              min={config.min}
              max={config.max}
              step={config.step}
            />
            <span className="range-separator">-</span>
            <input
              type="number"
              placeholder={config.max?.toString() || 'Макс'}
              value={value?.max || ''}
              onChange={(e) => handleFilterChange(config.key, { 
                ...value, 
                max: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="filter-input"
              min={config.min}
              max={config.max}
              step={config.step}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`filter-bar ${className}`}>
      {/* Заголовок та кнопка фільтрів */}
      <div className="filter-bar-header">
        <h3 className="filter-bar-title">{title}</h3>
        <button 
          className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="icon" />
          {showFilters ? 'Приховати фільтри' : 'Фільтри'}
          {hasActiveFilters && (
            <span className="active-filters-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {/* Розширені фільтри */}
      {showFilters && (
        <div className="filter-bar-content">
          <div className="filters-grid">
            {filterConfigs.map((config) => (
              <div key={config.key} className="filter-group">
                {config.type !== 'checkbox' && (
                  <label className="filter-label">{config.label}</label>
                )}
                {renderFilterInput(config)}
              </div>
            ))}
          </div>
          
          {/* Дії з фільтрами */}
          <div className="filter-actions">
            <button 
              className="btn btn-outline" 
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              Скинути всі
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;






