import React, { useState } from 'react';
import { useLanguageStore, supportedLanguages, type LanguageInfo } from '../stores/languageStore';

const LanguageSettingsPage: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguageStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
  };

  const currentLanguageData = supportedLanguages.find((lang: LanguageInfo) => lang.code === currentLanguage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌍 {t('languageSettings')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('languageSettingsDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Основні налаштування */}
        <div className="space-y-6">
          {/* Поточна мова */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('currentLanguage')}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{currentLanguageData?.flag}</span>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {currentLanguageData?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {currentLanguageData?.markets}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                {t('languageUsageDescription')}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{t('interfaceLanguage')}:</span>
              <span className="font-medium text-gray-900">{currentLanguageData?.name}</span>
            </div>
          </div>

          {/* Перемикач мов */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('changeLanguage')}
            </h3>
            
            <div className="space-y-2">
              {supportedLanguages.map((language: LanguageInfo) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    currentLanguage === language.code
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{language.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-xs text-gray-600">{language.markets}</div>
                    </div>
                  </div>
                  
                  {currentLanguage === language.code && (
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Інформація про мову */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('languageInformation')}
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('languageCode')}:</span>
                <span className="font-medium">{currentLanguage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('name')}:</span>
                <span className="font-medium">{currentLanguageData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('markets')}:</span>
                <span className="font-medium">{currentLanguageData?.markets}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика ринків */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🌍 {t('internationalMarkets')}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {t('platformSupportsLanguages', { count: supportedLanguages.length })}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportedLanguages.map((language: LanguageInfo) => {
              const isCurrent = language.code === currentLanguage;
              
              return (
                <div
                  key={language.code}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{language.flag}</span>
                    {isCurrent && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        {t('active')}
                      </span>
                    )}
                  </div>
                  
                  <h4 className={`font-medium mb-1 ${
                    isCurrent ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {language.name}
                  </h4>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {language.markets}
                  </p>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('population')}:</span>
                      <span className="font-medium">{language.population}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('gdp')}:</span>
                      <span className="font-medium">{language.gdp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {supportedLanguages.length}
                </div>
                <div className="text-sm text-gray-600">{t('supportedLanguages')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ~2.5B
                </div>
                <div className="text-sm text-gray-600">{t('totalPopulation')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  $61T+
                </div>
                <div className="text-sm text-gray-600">{t('totalGDP')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Розширені налаштування */}
      <div className="mt-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>{showAdvanced ? t('hide') : t('show')} {t('advancedSettings')}</span>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('advancedLocalizationSettings')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('autoLanguageDetection')}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t('autoLanguageDetectionDescription')}
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoDetect"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoDetect" className="text-sm text-gray-700">
                    {t('autoDetectBrowserLanguage')}
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('settingsStorage')}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t('settingsStorageDescription')}
                </p>
                <div className="text-xs text-gray-500">
                  {t('storedIn')}: localStorage
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('aiRecommendations')}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t('aiRecommendationsDescription')}
                </p>
                <div className="text-xs text-gray-500">
                  {t('currentLanguage')}: {currentLanguageData?.name}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('rtlSupport')}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t('rtlSupportDescription')}
                </p>
                <div className="text-xs text-gray-500">
                  {t('rtlLanguages')}: {t('notSupported')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSettingsPage;
