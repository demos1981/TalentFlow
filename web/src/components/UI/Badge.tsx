import React from 'react';
import { cn } from 'class-variance-authority';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', rounded = false, dot = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium';
    
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    };
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm',
    };
    
    const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
    
    const dotClasses = {
      default: 'bg-gray-400 dark:bg-gray-500',
      primary: 'bg-blue-400 dark:bg-blue-500',
      secondary: 'bg-gray-400 dark:bg-gray-500',
      success: 'bg-green-400 dark:bg-green-500',
      warning: 'bg-yellow-400 dark:bg-yellow-500',
      error: 'bg-red-400 dark:bg-red-500',
      info: 'bg-blue-400 dark:bg-blue-500',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses,
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              dotClasses[variant]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
