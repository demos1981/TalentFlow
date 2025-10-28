'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useLanguageStore } from '../../../stores/languageStore';
import { jobService } from '../../../services/jobService';
import api from '../../../services/api';
import { USER_TYPES, JOB_TYPES_OPTIONS, EXPERIENCE_LEVELS_OPTIONS, CURRENCY_OPTIONS, INDUSTRY_OPTIONS, CITIES_UA, COUNTRIES, TOP_SKILLS, MAX_SKILLS_PER_JOB } from '../../../constants';
import { Briefcase, MapPin, Clock, DollarSign, FileText, Plus, X, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import ImportJobModal from '../../../components/UI/ImportJobModal';
import './create-job.css';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  city: string;
  country: string;
  remote: boolean;
  type: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  industry: string;
  skills: string[];
  tags: string[];
  isUrgent: boolean;
  isFeatured: boolean;
  deadline: string;
}

const CreateJobPage: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    city: '',
    country: 'Україна',
    remote: false,
    type: 'full_time',
    experienceLevel: '1_to_3',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    industry: '',
    skills: [],
    tags: [],
    isUrgent: false,
    isFeatured: false,
    deadline: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокування скролу та обробка клавіші Escape при відкритому модальному вікні
  useEffect(() => {
    if (isImportModalOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseModal();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isImportModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  
  // Автокомпліт фільтри
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const addSkill = () => {
    const normalizedSkill = skillInput.trim();
    if (normalizedSkill && !formData.skills.includes(normalizedSkill)) {
      if (formData.skills.length >= MAX_SKILLS_PER_JOB) {
        toast.error(`Максимум ${MAX_SKILLS_PER_JOB} навичок`);
        return;
      }
      // Нормалізація регістру - перша літера велика
      const capitalizedSkill = normalizedSkill.charAt(0).toUpperCase() + normalizedSkill.slice(1);
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, capitalizedSkill]
      }));
      setSkillInput('');
      setShowSkillDropdown(false);
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Обробка імпорту даних з зовнішнього сайту
  const handleImportSuccess = (importedData: Partial<JobFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...importedData
    }));
    toast.success(t('importJobSuccess'));
  };

  // Обробка імпорту вакансії
  const handleImportJob = async () => {
    if (!importUrl.trim()) return;
    
    // Валідація URL
    try {
      new URL(importUrl);
    } catch {
      toast.error('Будь ласка, введіть правильний URL');
      return;
    }
    
    setIsImporting(true);
    try {
      const response = await api.post('/job-parsing/parse', {
        url: importUrl
      });

      setImportedData(response.data.data || response.data);
      toast.success(t('importJobSuccess'));
    } catch (error: any) {
      console.error('Import error:', error);
      let errorMessage = t('importJobError');
      
      // Обробка axios помилок
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = t('unauthorizedMessage');
            break;
          case 403:
            errorMessage = t('forbiddenMessage');
            break;
          case 404:
            errorMessage = t('notFoundMessage');
            break;
          case 500:
            errorMessage = t('serverErrorMessage');
            break;
          default:
            errorMessage = responseData?.message || `${t('errorPrefix')} ${status}`;
        }
      } else if (error.request) {
        errorMessage = t('networkErrorMessage');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  // Використання імпортованих даних
  const handleUseImportedData = () => {
    if (importedData) {
      setFormData(prev => ({
        ...prev,
        title: importedData.title || prev.title,
        description: importedData.description || prev.description,
        city: importedData.location || prev.city,
        country: importedData.country || prev.country,
        industry: importedData.industry || prev.industry,
        requirements: importedData.requirements || prev.requirements,
        benefits: importedData.benefits || prev.benefits,
      }));
      setIsImportModalOpen(false);
      setImportedData(null);
      setImportUrl('');
    }
  };

  // Закриття модального вікна
  const handleCloseModal = () => {
    setIsImportModalOpen(false);
    setImportedData(null);
    setImportUrl('');
  };

  // Компонент модального вікна
  const Modal = () => {
    if (!mounted || !isImportModalOpen) return null;

    const modalContent = (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleCloseModal}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '42rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 10000
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div 
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '1.5rem', 
              height: '1.5rem', 
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🔗
            </div>
            <h2 
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}
            >
              {t('importJobTitle')}
            </h2>
          </div>
          <button 
            onClick={handleCloseModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              {t('importJobDescription')}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('importJobUrlLabel')} *
                </label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder={t('importJobUrlPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={isImporting}
                />
              </div>

              {/* Imported Data Preview */}
              {importedData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">
                    ✅ {t('importJobSuccess')}
                  </h3>
                  <div className="space-y-2 text-sm text-green-700">
                    {importedData.title && (
                      <div><strong>{t('jobTitle')}:</strong> {importedData.title}</div>
                    )}
                    {importedData.company && (
                      <div><strong>{t('company')}:</strong> {importedData.company}</div>
                    )}
                    {importedData.location && (
                      <div><strong>{t('location')}:</strong> {importedData.location}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Supported Platforms */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t('supportedPlatforms')}:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>• LinkedIn</div>
                  <div>• Djinni</div>
                  <div>• Robota.ua</div>
                  <div>• Work.ua</div>
                  <div>• Indeed</div>
                  <div>• Glassdoor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              padding: '1.5rem',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}
          >
            <button 
              onClick={handleCloseModal}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isImporting ? 0.6 : 1,
                pointerEvents: isImporting ? 'none' : 'auto'
              }}
              onMouseEnter={(e) => {
                if (!isImporting) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (!isImporting) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
              disabled={isImporting}
            >
              {t('cancel')}
            </button>
            
            {!importedData ? (
              <button 
                onClick={handleImportJob}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: (!importUrl.trim() || isImporting) ? 0.6 : 1,
                  pointerEvents: (!importUrl.trim() || isImporting) ? 'none' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!importUrl.trim() || isImporting) return;
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (!importUrl.trim() || isImporting) return;
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
                disabled={!importUrl.trim() || isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('importJobLoading')}
                  </>
                ) : (
                  t('importJobButton')
                )}
              </button>
            ) : (
              <button 
                onClick={handleUseImportedData}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#047857';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
              >
                {t('useImportedData')}
              </button>
            )}
          </div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    setIsLoading(true);

    try {
      // Формуємо локацію з міста та країни
      const location = formData.city && formData.country 
        ? `${formData.city}, ${formData.country}`
        : formData.city || formData.country || '';

      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || undefined,
        benefits: formData.benefits || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        location: location || undefined,
        remote: formData.remote,
        type: formData.type,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
        currency: formData.currency,
        industry: formData.industry || undefined,
        skills: formData.skills,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        isUrgent: formData.isUrgent,
        isFeatured: formData.isFeatured,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined
      };


      // Викликаємо API для створення вакансії
      const createdJob = await jobService.createJob(jobData as any);
      
      
      toast.success(t('jobCreatedSuccess'));
      
      router.push('/jobs');
    } catch (error: any) {
      console.error('❌ Error creating job:', error);
      
      // Обробляємо помилки
      if (error.response?.status === 401) {
        toast.error(t('authRequired'));
      } else if (error.response?.status === 400) {
        const message = error.response.data?.message || t('invalidData');
        toast.error(message);
      } else if (error.response?.status === 403) {
        toast.error(t('onlyEmployersCanCreateJobs'));
      } else {
        toast.error(t('errorCreatingJob'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== USER_TYPES.EMPLOYER) {
    return (
      <div className="create-job-page">
      <div className="error-message">
        <h2>{t('accessDenied')}</h2>
        <p>{t('onlyEmployersCanCreate')}</p>
      </div>
      </div>
    );
  }

  return (
    <div className="create-job-page">
      {/* Кнопка назад */}
      <div className="back-button-section">
        <Link href="/jobs" className="back-button">
          <ArrowLeft className="icon" />
          {t('backToJobs')}
        </Link>
      </div>

      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dashboard-title">{t('createJobTitle')}</h1>
              <p className="dashboard-greeting">
                {t('createJobSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="import-job-button"
              data-testid="import-job-button"
            >
              <ExternalLink className="h-5 w-5" />
              <span>{t('importJobFromSite')}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3 className="form-section-title">
            <Briefcase className="icon" />
            {t('basicInformation')}
          </h3>
          
          <div className="form-group">
            <label htmlFor="title" className="form-label">{t('jobTitle')} *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder={t('jobTitlePlaceholder')}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="industry" className="form-label">Галузь *</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Оберіть галузь</option>
                {INDUSTRY_OPTIONS.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city" className="form-label">Місто</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Київ"
                list="cities"
              />
              <datalist id="cities">
                {CITIES_UA.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="country" className="form-label">Країна</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Україна"
                list="countries"
              />
              <datalist id="countries">
                {COUNTRIES.map(country => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                name="remote"
                checked={formData.remote}
                onChange={handleInputChange}
              />
              <span>Віддалена робота</span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type" className="form-label">{t('employmentType')} *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {JOB_TYPES_OPTIONS.map(jobType => (
                  <option key={jobType.value} value={jobType.value}>
                    {jobType.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel" className="form-label">{t('experienceLevel')} *</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {EXPERIENCE_LEVELS_OPTIONS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">
            <DollarSign className="icon" />
            {t('salary')}
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin" className="form-label">{t('minimum')}</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                className="form-input"
                placeholder="3000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax" className="form-label">{t('maximum')}</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                className="form-input"
                placeholder="5000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency" className="form-label">{t('currency')}</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="form-select"
              >
                {CURRENCY_OPTIONS.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">
            <FileText className="icon" />
            {t('descriptionAndRequirements')}
          </h3>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">{t('jobDescription')} *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder={t('jobDescriptionPlaceholder')}
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements" className="form-label">{t('requirements')}</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder={t('requirementsPlaceholder')}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="benefits" className="form-label">{t('benefits')}</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder={t('benefitsPlaceholder')}
              rows={4}
            />
          </div>


          <div className="form-group">
            <label className="form-label">
              {t('skills')} ({formData.skills.length}/{MAX_SKILLS_PER_JOB})
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="form-input flex-1"
                placeholder="JavaScript, React, Node.js..."
                list="skills"
                disabled={formData.skills.length >= MAX_SKILLS_PER_JOB}
              />
              <datalist id="skills">
                {TOP_SKILLS.map(skill => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-outline"
                disabled={formData.skills.length >= MAX_SKILLS_PER_JOB}
              >
                <Plus className="icon" />
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t('tags')}</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="form-input flex-1"
                placeholder={t('addTagPlaceholder')}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-outline"
              >
                <Plus className="icon" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline" className="form-label">{t('deadline')}</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isUrgent"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">
                  {t('urgentJob')}
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  {t('featured')}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="icon animate-spin" />
                {t('creating')}
              </>
            ) : (
              t('createJobButton')
            )}
          </button>
        </div>
      </form>

      {/* Модальне вікно імпорту вакансії */}
      <Modal />
    </div>
  );
};

export default CreateJobPage;
