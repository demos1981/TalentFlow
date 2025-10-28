import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
    <span className={className}>
      {t(key as any, params)}
      {children}
    </span>
  );
};

export default LocalizedText;
