import { useState } from 'react';

export const useTextTruncation = (text: string, maxLength: number = 200) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, maxLength) + '...';
  
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  
  return {
    displayText,
    shouldTruncate,
    isExpanded,
    toggleExpanded
  };
};
