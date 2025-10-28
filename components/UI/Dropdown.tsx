import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Виберіть опцію',
  label,
  error,
  disabled = false,
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between rounded-lg border bg-white dark:bg-gray-800 text-left transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600',
            className
          )}
        >
          <div className="flex items-center min-w-0 flex-1">
            {selectedOption?.icon && (
              <span className="mr-2 flex-shrink-0">{selectedOption.icon}</span>
            )}
            <span className={cn(
              'truncate',
              selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          
          <ChevronDown
            className={cn(
              'ml-2 h-4 w-4 flex-shrink-0 transition-transform',
              isOpen && 'rotate-180',
              'text-gray-400 dark:text-gray-500'
            )}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-left text-sm transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  option.value === value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-white'
                )}
              >
                {option.icon && (
                  <span className="mr-2 flex-shrink-0">{option.icon}</span>
                )}
                <span className="flex-1 truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="ml-2 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export { Dropdown };
