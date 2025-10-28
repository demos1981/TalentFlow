import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useLanguageStore } from '../../stores/languageStore';
import '../../styles/checkboxes.css';

export interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'date' | 'range' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  value?: any;
}

export interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  filters?: SearchFilter[];
  onFiltersChange?: (filters: SearchFilter[]) => void;
  sortOptions?: Array<{ value: string; label: string }>;
  onSortChange?: (sortBy: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortOrderChange?: (order: 'asc' | 'desc') => void;
  className?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Пошук...',
  value,
  onChange,
  onSearch,
  filters = [],
  onFiltersChange,
  sortOptions = [],
  onSortChange,
  sortBy,
  sortOrder = 'asc',
  onSortOrderChange,
  className,
  showFilters = false,
  onToggleFilters,
}) => {
  const { t } = useLanguageStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilter[]>(filters);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch?.(value);
    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (filterId: string, newValue: any) => {
    const updatedFilters = localFilters.map(filter =>
      filter.id === filterId ? { ...filter, value: newValue } : filter
    );
    setLocalFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = localFilters.map(filter => ({ ...filter, value: undefined }));
    setLocalFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = localFilters.some(filter => filter.value !== undefined);

  return (
    <div className={cn('relative', className)} ref={searchRef}>
      {/* Основна пошукова панель */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Кнопка пошуку */}
        <Button onClick={handleSearch} size="md">
          Пошук
        </Button>

        {/* Кнопка фільтрів */}
        {filters.length > 0 && (
          <Button
            variant={hasActiveFilters ? 'primary' : 'outline'}
            onClick={onToggleFilters}
            size="md"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Фільтри
            {hasActiveFilters && (
              <span className="ml-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full px-1.5 py-0.5 text-xs font-medium">
                {localFilters.filter(f => f.value !== undefined).length}
              </span>
            )}
          </Button>
        )}

        {/* Сортування */}
        {sortOptions.length > 0 && (
          <div className="flex items-center space-x-1">
            <select
              value={sortBy || ''}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Сортування</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="md"
              onClick={() => onSortOrderChange?.(sortOrder === 'asc' ? 'desc' : 'asc')}
              leftIcon={sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            />
          </div>
        )}
      </div>

      {/* Розширена панель фільтрів */}
      {showFilters && filters.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Фільтри</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Очистити всі
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && filter.options && (
                  <select
                    value={filter.value || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Всі</option>
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'date' && (
                  <Input
                    type="date"
                    value={filter.value || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}

                {filter.type === 'range' && (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder={t('from')}
                      value={filter.value?.min || ''}
                      onChange={(e) => handleFilterChange(filter.id, { ...filter.value, min: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder={t('to')}
                      value={filter.value?.max || ''}
                      onChange={(e) => handleFilterChange(filter.id, { ...filter.value, max: e.target.value })}
                    />
                  </div>
                )}

                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map(option => (
                      <div key={option.value} className="custom-checkbox">
                        <input
                          type="checkbox"
                          id={`${filter.id}-${option.value}`}
                          checked={filter.value?.includes?.(option.value) || false}
                          onChange={(e) => {
                            const currentValues = filter.value || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((v: any) => v !== option.value);
                            handleFilterChange(filter.id, newValues);
                          }}
                          className="checkbox-input"
                        />
                        <label htmlFor={`${filter.id}-${option.value}`} className="checkbox-label">
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-text">{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { SearchInput };
