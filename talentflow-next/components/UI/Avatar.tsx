import React from 'react';
import { cn } from '@/utils/cn';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  status,
  className,
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  const statusClasses = {
    online: 'bg-green-400 dark:bg-green-500',
    offline: 'bg-gray-400 dark:bg-gray-500',
    away: 'bg-yellow-400 dark:bg-yellow-500',
    busy: 'bg-red-400 dark:bg-red-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderFallback = () => {
    if (fallback) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
          {getInitials(fallback)}
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
        <User className="w-1/2 h-1/2" />
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700',
          sizeClasses[size],
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Якщо зображення не завантажилося, показуємо fallback
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        <div className={cn(
          'absolute inset-0',
          src ? 'hidden' : ''
        )}>
          {renderFallback()}
        </div>
      </div>

      {/* Status indicator */}
      {status && (
        <div className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
          statusClasses[status],
          statusSizes[size]
        )} />
      )}
    </div>
  );
};

// Avatar Group компонент для групи аватарів
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  spacing = 'normal',
  className,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  const spacingClasses = {
    tight: '-ml-1',
    normal: '-ml-2',
    loose: '-ml-3',
  };

  const displayedAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {displayedAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'ring-2 ring-white dark:ring-gray-800 rounded-full',
            index > 0 && spacingClasses[spacing]
          )}
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className={cn(
          'flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium ring-2 ring-white dark:ring-gray-800 rounded-full',
          sizeClasses[size],
          spacingClasses[spacing]
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export { Avatar };
