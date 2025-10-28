import React from 'react';
import { useLanguageStore } from '../../stores/languageStore';

interface LocalizedTextProps {
  key: string;
  params?: Record<string, any>;
  className?: string;
  children?: React.ReactNode;
}

const LocalizedText: React.FC<LocalizedTextProps> = ({ 
  key, 
  params, 
  className,
  children 
}) => {
  const { t } = useLanguageStore();
  
  return (
    <span className={className}>
      {t(key as any, params)}
      {children}
    </span>
  );
};

export default LocalizedText;
