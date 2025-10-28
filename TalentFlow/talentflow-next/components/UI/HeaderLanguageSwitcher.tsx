'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore } from '../../stores/languageStore';
import { ChevronDown, Globe } from 'lucide-react';

const HeaderLanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage, languages } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header-language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-switcher-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="language-switcher-icon" size={16} />
        <span className="language-switcher-flag">{currentLanguageData?.flag}</span>
        <span className="language-switcher-code">{currentLanguageData?.code.toUpperCase()}</span>
        <ChevronDown className="language-switcher-arrow" size={14} />
      </button>

      {isOpen && (
        <div className="language-dropdown-menu">
          <div className="language-dropdown-content">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`language-dropdown-item ${
                  currentLanguage === language.code ? 'active' : ''
                }`}
              >
                <span className="language-dropdown-flag">{language.flag}</span>
                <div className="language-dropdown-info">
                  <div className="language-dropdown-name">{language.name}</div>
                  <div className="language-dropdown-markets">{language.markets}</div>
                </div>
                {currentLanguage === language.code && (
                  <svg className="language-dropdown-check" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderLanguageSwitcher;