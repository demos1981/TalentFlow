import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const getButtonClasses = () => {
      let classes = 'btn';
      
      // Варіанти
      switch (variant) {
        case 'primary':
          classes += ' btn-primary';
          break;
        case 'secondary':
          classes += ' btn-secondary';
          break;
        case 'outline':
          classes += ' btn-outline';
          break;
        case 'ghost':
          classes += ' btn-ghost';
          break;
        case 'link':
          classes += ' btn-link';
          break;
        case 'destructive':
          classes += ' btn-danger';
          break;
        default:
          classes += ' btn-primary';
      }
      
      // Розміри
      switch (size) {
        case 'sm':
          classes += ' btn-sm';
          break;
        case 'lg':
          classes += ' btn-lg';
          break;
        default:
          classes += ' btn-md';
      }
      
      if (loading) {
        classes += ' loading';
      }
      
      return `${classes} ${className}`.trim();
    };

    return (
      <button
        className={getButtonClasses()}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="loading-spinner mr-2"></span>}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
