import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalization } from '../hooks/useLocalization';
import LanguageSwitcher from '../components/UI/LanguageSwitcher';

const LanguageSettingsPage: React.FC = () => {
  const { currentLanguage, setLanguage, supportedLanguages, t } = useLanguage();
  const { formatDate, formatNumber, formatCurrency } = useLocalization();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
  };

  const currentLanguageData = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌍 {t('settings')} мов
        </h1>
        <p className="text-lg text-gray-600">
          Налаштуйте мову інтерфейсу та перегляньте інформацію про міжнародні ринки
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Основні налаштування */}
        <div className="space-y-6">
          {/* Поточна мова */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Поточна мова
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
                Ця мова використовується для відображення інтерфейсу, повідомлень та AI-рекомендацій.
              </p>
            </div>

            <LanguageSwitcher />
          </div>

          {/* Перемикач мов */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Змінити мову
            </h3>
            
            <div className="space-y-2">
              {supportedLanguages.map((language) => (
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

          {/* Приклади форматування */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Приклади форматування
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Дата:</span>
                <span className="font-medium">
                  {formatDate(new Date())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Число:</span>
                <span className="font-medium">
                  {formatNumber(1234567.89)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Валюта:</span>
                <span className="font-medium">
                  {formatCurrency(1234.56)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика ринків */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🌍 Міжнародні ринки TalentFlow
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Платформа підтримує {supportedLanguages.length} мов для глобального охоплення
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportedLanguages.map((language) => {
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
                        Активна
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
                      <span className="text-gray-500">Населення:</span>
                      <span className="font-medium">{language.population}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ВВП:</span>
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
                <div className="text-sm text-gray-600">Підтримуваних мов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ~2.5B
                </div>
                <div className="text-sm text-gray-600">Загальне населення</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  $61T+
                </div>
                <div className="text-sm text-gray-600">Сумарний ВВП ринків</div>
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
          <span>{showAdvanced ? 'Сховати' : 'Показати'} розширені налаштування</span>
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
              Розширені налаштування локалізації
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Автоматичне визначення мови</h4>
                <p className="text-sm text-gray-600 mb-3">
                  TalentFlow автоматично визначає мову браузера та встановлює її як основну.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoDetect"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoDetect" className="text-sm text-gray-700">
                    Автоматично визначати мову браузера
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Збереження налаштувань</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ваші мовні налаштування зберігаються локально та синхронізуються між пристроями.
                </p>
                <div className="text-xs text-gray-500">
                  Збережено в: localStorage
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI-рекомендації</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Всі AI-рекомендації генеруються мовою, яку ви обрали.
                </p>
                <div className="text-xs text-gray-500">
                  Поточна мова: {currentLanguageData?.name}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Підтримка RTL</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Підтримка мов з правостороннім написанням (арабська, іврит).
                </p>
                <div className="text-xs text-gray-500">
                  RTL мови: Не підтримуються
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
