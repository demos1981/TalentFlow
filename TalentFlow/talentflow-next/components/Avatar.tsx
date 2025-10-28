'use client';

import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  className = '', 
  size = 'md',
  fallback = '/avatars/default.svg'
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
        onError={handleError}
      />
    </div>
  );
};

export default Avatar;
