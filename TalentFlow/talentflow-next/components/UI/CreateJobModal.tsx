import React, { useState } from 'react';
import { useLanguageStore } from '../../stores/languageStore';
import { jobService } from '../../services/jobService';
import { JOB_TYPES_OPTIONS, EXPERIENCE_LEVELS_OPTIONS, CURRENCY_OPTIONS, INDUSTRY_OPTIONS, CITIES_UA, COUNTRIES, TOP_SKILLS, MAX_SKILLS_PER_JOB } from '../../constants';
import { X, Plus, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (jobData: any) => void;
  onSuccess?: (job: any) => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSubmit, onSuccess }) => {
  const { t } = useLanguageStore();
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    skills: [] as string[],
    tags: [] as string[],
    isUrgent: false,
    isFeatured: false,
    deadline: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Використовуємо константи з constants/index.ts
  const jobTypes = JOB_TYPES_OPTIONS;
  const experienceLevels = EXPERIENCE_LEVELS_OPTIONS;
  const currencies = CURRENCY_OPTIONS;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Заповніть обов\'язкові поля');
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
      
      
      toast.success('Вакансію успішно створено!');
      
      // Викликаємо callback якщо є
      if (onSuccess) {
        onSuccess(createdJob);
      } else if (onSubmit) {
        onSubmit(createdJob);
      }
      
      // Закриваємо модальне вікно
      onClose();
      
      // Очищуємо форму
      setFormData({
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
      
    } catch (error: any) {
      console.error('❌ Error creating job:', error);
      
      // Обробляємо помилки
      if (error.response?.status === 401) {
        toast.error('Необхідна авторизація для створення вакансій');
      } else if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Невірні дані для створення вакансії';
        toast.error(message);
      } else if (error.response?.status === 403) {
        toast.error('Тільки роботодавці можуть створювати вакансії');
      } else {
        toast.error('Помилка при створенні вакансії. Спробуйте пізніше.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isPreview ? 'Перегляд вакансії' : 'Створити нову вакансію'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {isPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{isPreview ? 'Редагувати' : 'Перегляд'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isPreview ? (
            <div className="space-y-6">
              {/* Preview Content */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{formData.title || 'Назва вакансії'}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Тип:</span>
                    <span className="ml-2">{jobTypes.find(t => t.value === formData.type)?.label}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Досвід:</span>
                    <span className="ml-2">{experienceLevels.find(e => e.value === formData.experienceLevel)?.label}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Локація:</span>
                    <span className="ml-2">
                      {formData.city && formData.country 
                        ? `${formData.city}, ${formData.country}` 
                        : formData.city || formData.country || 'Не вказано'}
                      {formData.remote && ' (Віддалено)'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Галузь:</span>
                    <span className="ml-2">{formData.industry || 'Не вказано'}</span>
                  </div>
                </div>

                {formData.salaryMin || formData.salaryMax ? (
                  <div className="mb-4">
                    <span className="font-medium text-gray-600">Зарплата:</span>
                    <span className="ml-2">
                      {formData.salaryMin && formData.salaryMax 
                        ? `${formData.salaryMin} - ${formData.salaryMax} ${formData.currency}`
                        : formData.salaryMin 
                          ? `від ${formData.salaryMin} ${formData.currency}`
                          : `до ${formData.salaryMax} ${formData.currency}`
                      }
                    </span>
                  </div>
                ) : null}

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Опис:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{formData.description || 'Опис не додано'}</p>
                </div>

                {formData.requirements && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Вимоги:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.requirements}</p>
                  </div>
                )}

                {formData.benefits && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Переваги:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.benefits}</p>
                  </div>
                )}

                {formData.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Навички:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Теги:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.deadline && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-600">Дедлайн:</span>
                    <span className="ml-2">{new Date(formData.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Назва вакансії *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('jobTitlePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Галузь *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Оберіть галузь</option>
                    {INDUSTRY_OPTIONS.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип вакансії *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Рівень досвіду *
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Місто
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('cityPlaceholder')}
                    list="cities-modal"
                  />
                  <datalist id="cities-modal">
                    {CITIES_UA.map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Країна
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('countryPlaceholder')}
                    list="countries-modal"
                  />
                  <datalist id="countries-modal">
                    {COUNTRIES.map(country => (
                      <option key={country} value={country} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.remote}
                      onChange={(e) => handleInputChange('remote', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Віддалена робота</span>
                  </label>
                </div>
              </div>

              {/* Salary Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мінімальна зарплата
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимальна зарплата
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Валюта
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опис вакансії *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('jobDescriptionPlaceholder')}
                  required
                />
              </div>

              {/* Requirements and Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вимоги
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('requirementsPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Переваги
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('benefitsPlaceholder')}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Навички
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('addSkillPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Теги
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('addTagPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <Plus className="h-4 w-4" />
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

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дедлайн
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">
                    Термінова вакансія
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                    Рекомендована
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPreview || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 inline mr-2" />
            )}
            {isLoading ? 'Створення...' : 'Створити вакансію'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;
