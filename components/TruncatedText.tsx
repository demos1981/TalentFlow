import React from 'react';
import { useTextTruncation } from '../hooks/useTextTruncation';
import { useLanguageStore } from '../stores/languageStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  maxLength = 200, 
  className = '' 
}) => {
  const { displayText, shouldTruncate, isExpanded, toggleExpanded } = useTextTruncation(text, maxLength);
  const { t } = useLanguageStore();

  return (
    <div className={`truncated-text ${className}`}>
      <p>{displayText}</p>
      {shouldTruncate && (
        <button 
          className="show-more-btn"
          onClick={toggleExpanded}
          type="button"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="icon" />
              {t('showLess')}
            </>
          ) : (
            <>
              <ChevronDown className="icon" />
              {t('showMore')}
            </>
          )}
        </button>
      )}
    </div>
  );
};
