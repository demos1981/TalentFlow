import React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    helperText, 
    rows = 4, 
    maxLength, 
    showCharacterCount = false,
    id, 
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharCount(e.target.value.length);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            className={cn(
              'flex w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              success && 'border-green-500 focus:ring-green-500',
              className
            )}
            ref={ref}
            id={textareaId}
            rows={rows}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />
          
          {/* Status icons */}
          {error && (
            <div className="absolute top-3 right-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
          
          {success && !error && (
            <div className="absolute top-3 right-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        
        {/* Character count and helper text */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            {helperText && !error && !success && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {success}
              </p>
            )}
          </div>
          
          {showCharacterCount && maxLength && (
            <span className={cn(
              'text-xs',
              charCount > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
