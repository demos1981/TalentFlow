import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
  debounceMs?: number;
  className?: string;
  showClearButton?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Пошук...",
  onSearch,
  debounceMs = 300,
  className = "",
  showClearButton = true,
  autoFocus = false
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce для пошуку
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  // Синхронізація з зовнішнім значенням
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(localValue);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(localValue);
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-container">
        <Search className="search-icon" />
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="search-input"
          autoFocus={autoFocus}
        />
        {showClearButton && localValue && (
          <button 
            className="clear-search-btn"
            onClick={handleClear}
            title="Очистити пошук"
          >
            <X className="icon" />
          </button>
        )}
        {onSearch && (
          <button
            onClick={handleSearchClick}
            className="search-button"
            title="Почати пошук"
          >
            <Search className="icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;




