'use client';

import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';

interface ImportJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (jobData: any) => void;
}

interface SupportedPlatform {
  name: string;
  domain: string;
  description: string;
  icon: string;
}

interface ParsedJobData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  city?: string;
  country?: string;
  remote?: boolean;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  industry?: string;
  skills?: string[];
  tags?: string[];
  companyName?: string;
  sourceUrl: string;
  sourcePlatform: string;
}

const ImportJobModal: React.FC<ImportJobModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const { t } = useLanguageStore();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [supportedPlatforms, setSupportedPlatforms] = useState<SupportedPlatform[]>([]);
  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    platform: string;
    supported: boolean;
  } | null>(null);
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Завантажуємо список підтримуваних платформ
  useEffect(() => {
    if (isOpen) {
      loadSupportedPlatforms();
    }
  }, [isOpen]);

  // Валідація URL при зміні
  useEffect(() => {
    if (url.trim()) {
      const timeoutId = setTimeout(() => {
        validateUrl(url);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setUrlValidation(null);
      setError(null);
    }
  }, [url]);

  const loadSupportedPlatforms = async () => {
    try {
      const response = await fetch('/api/job-parsing/platforms');
      const data = await response.json();
      
      if (data.success) {
        setSupportedPlatforms(data.data);
      }
    } catch (error) {
      console.error('Помилка завантаження платформ:', error);
    }
  };

  const validateUrl = async (urlToValidate: string) => {
    try {
      setIsValidating(true);
      setError(null);
      
      const response = await fetch(`/api/job-parsing/validate-url?url=${encodeURIComponent(urlToValidate)}`);
      const data = await response.json();
      
      if (data.success) {
        setUrlValidation(data.data);
        if (!data.data.supported) {
          setError(t('platformNotSupported', { platform: data.data.platform }));
        }
      } else {
        setError(data.message || t('importJobError'));
      }
    } catch (error) {
      setError(t('importJobError'));
      console.error('Помилка валідації:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!url.trim()) {
      setError(t('importJobUrlLabel'));
      return;
    }

    if (!urlValidation?.supported) {
      setError(t('platformNotSupported', { platform: urlValidation?.platform || '' }));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setParsedData(null);

      const response = await fetch('/api/job-parsing/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setParsedData(data.data);
        toast.success(t('importJobSuccess'));
      } else {
        setError(data.message || t('importJobError'));
      }
    } catch (error) {
      setError(t('importJobError'));
      console.error('Помилка імпорту:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseData = () => {
    if (parsedData) {
      // Перетворюємо дані у формат, який очікує форма створення вакансії
      const formData = {
        title: parsedData.title,
        description: parsedData.description,
        requirements: parsedData.requirements || '',
        benefits: parsedData.benefits || '',
        city: parsedData.city || parsedData.location?.split(',')[0] || '',
        country: parsedData.country || 'Україна',
        remote: parsedData.remote || false,
        type: parsedData.type || 'full_time',
        experienceLevel: parsedData.experienceLevel || '1_to_3',
        salaryMin: parsedData.salaryMin?.toString() || '',
        salaryMax: parsedData.salaryMax?.toString() || '',
        currency: parsedData.currency || 'USD',
        industry: parsedData.industry || '',
        skills: parsedData.skills || [],
        tags: parsedData.tags || [],
        isUrgent: false,
        isFeatured: false,
        deadline: ''
      };

      onImportSuccess(formData);
      onClose();
      setUrl('');
      setParsedData(null);
      setError(null);
      setUrlValidation(null);
    }
  };

  const handleClose = () => {
    onClose();
    setUrl('');
    setParsedData(null);
    setError(null);
    setUrlValidation(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      style={{ zIndex: 9999 }}
      data-testid="import-job-modal"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <LinkIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('importJobTitle')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="close-modal-button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="text-gray-600">
            <p>
              {t('importJobDescription')}
            </p>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('importJobUrlLabel')} *
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('importJobUrlPlaceholder')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-500' : urlValidation?.isValid ? 'border-green-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              )}
              {urlValidation?.isValid && !isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
              {error && !isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            
            {/* URL Validation Status */}
            {urlValidation && (
              <div className={`text-sm ${urlValidation.supported ? 'text-green-600' : 'text-red-600'}`} data-testid="url-validation">
                {urlValidation.supported ? (
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{t('platformSupported', { platform: urlValidation.platform })}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{t('platformNotSupported', { platform: urlValidation.platform })}</span>
                  </span>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" data-testid="error-message">
                {error}
              </div>
            )}
          </div>

          {/* Supported Platforms */}
          {supportedPlatforms.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">{t('supportedPlatforms')}:</h3>
              <div className="grid grid-cols-2 gap-2" data-testid="supported-platforms">
                {supportedPlatforms.map((platform) => (
                  <div
                    key={platform.domain}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                      <div className="text-xs text-gray-500">{platform.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parsed Data Preview */}
          {parsedData && (
            <div className="border rounded-lg p-4 bg-green-50" data-testid="parsed-data-preview">
              <h3 className="text-sm font-medium text-green-800 mb-3">
                ✅ {t('importJobSuccess')} {parsedData.sourcePlatform}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{t('jobTitle')}:</span>{' '}
                  <span className="text-gray-900">{parsedData.title}</span>
                </div>
                {parsedData.companyName && (
                  <div>
                    <span className="font-medium text-gray-700">{t('company')}:</span>{' '}
                    <span className="text-gray-900">{parsedData.companyName}</span>
                  </div>
                )}
                {parsedData.location && (
                  <div>
                    <span className="font-medium text-gray-700">{t('location')}:</span>{' '}
                    <span className="text-gray-900">{parsedData.location}</span>
                  </div>
                )}
                {(parsedData.salaryMin || parsedData.salaryMax) && (
                  <div>
                    <span className="font-medium text-gray-700">{t('salary')}:</span>{' '}
                    <span className="text-gray-900">
                      {parsedData.salaryMin && parsedData.salaryMax
                        ? `${parsedData.salaryMin} - ${parsedData.salaryMax} ${parsedData.currency}`
                        : parsedData.salaryMin
                        ? `${t('salaryFrom')} ${parsedData.salaryMin} ${parsedData.currency}`
                        : `${t('salaryTo')} ${parsedData.salaryMax} ${parsedData.currency}`}
                    </span>
                  </div>
                )}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">{t('skills')}:</span>{' '}
                    <span className="text-gray-900">
                      {parsedData.skills.slice(0, 5).join(', ')}
                      {parsedData.skills.length > 5 && ` ${t('and')} ${parsedData.skills.length - 5}...`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          
          {!parsedData ? (
            <button
              onClick={handleImport}
              disabled={!url.trim() || isLoading || !urlValidation?.supported}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('importJobLoading')}</span>
                </>
              ) : (
                <span>{t('importJobButton')}</span>
              )}
            </button>
          ) : (
            <button
              onClick={handleUseData}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('useImportedData')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportJobModal;
