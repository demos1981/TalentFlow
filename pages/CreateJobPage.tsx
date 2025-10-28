import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { useRouter } from 'next/navigation';
import { USER_TYPES } from '../constants';
import '../styles/createJobPage.css';
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Plus,
  X
} from 'lucide-react';
import { jobService } from '../services/jobService';
import '../styles/checkboxes.css';

interface CreateJobForm {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  type: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  department: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
  isFeatured: boolean;
  deadline: string;
}

const CreateJobPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateJobForm>({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    type: '',
    experienceLevel: '',
    salaryMin: 0,
    salaryMax: 0,
    currency: 'USD',
    department: '',
    skills: [],
    isRemote: false,
    isUrgent: false,
    isFeatured: false,
    deadline: new Date().toISOString().split('T')[0] // Поточна дата як значення за замовчуванням
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  
  // Опції для селектів
  const jobTypes = [t('fullTime'), t('partTime'), t('contract'), t('internship')];
  const experienceLevels = ['Junior', 'Middle', 'Senior', 'Lead', 'Architect'];
  const currencies = ['USD', 'EUR', 'UAH', 'PLN'];
  const departments = ['IT', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
  
  // Перевірка доступу
  useEffect(() => {
    if (!user || user.role !== USER_TYPES.EMPLOYER || !user.canPostJobs) {
              router.push('/dashboard');
    }
      }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? Number(value) : 0
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError(t('fillRequiredFields'));
      return;
    }
    
    // Валідація дедлайну
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      
      if (deadlineDate < now) {
        setError(t('deadlineMustBeTodayOrFuture'));
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Submitting job data:', formData);
      
      await jobService.createJob(formData);
      
      // Перенаправляємо на сторінку вакансій
              router.push('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      setError(t('errorCreatingJob'));
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== USER_TYPES.EMPLOYER || !user.canPostJobs) {
    return null;
  }

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-top">
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => router.push('/jobs')}
            >
              <ArrowLeft className="icon" />
              {t('backToJobs')}
            </button>
          </div>
          <h1 className="dashboard-title">{t('createJob')}</h1>
          <p className="dashboard-greeting-subtitle">
            {t('createAttractiveJobForBestCandidates')}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="dashboard-sections-grid">
        <div className="dashboard-section-card">
          <form onSubmit={handleSubmit} className="create-job-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {/* Основна інформація */}
            <div className="form-section">
              <h3 className="form-section-title">{t('basicInformation')}</h3>
              
              <div className="form-group">
                <label htmlFor="title" className="form-label required">
                  {t('jobTitle')}
                </label>
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
              
              <div className="form-group">
                <label htmlFor="description" className="form-label required">
                  {t('jobDescription')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder={t('jobDescriptionPlaceholder')}
                  rows={6}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    {t('jobType')}
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">{t('selectType')}</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="experienceLevel" className="form-label">
                    {t('experienceLevel')}
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">{t('selectLevel')}</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Локація та віддалена робота */}
            <div className="form-section">
              <h3 className="form-section-title">{t('locationAndWork')}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    {t('location')}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t('locationPlaceholder')}
                  />
                </div>
                
                <div className="form-group">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      id="isRemote"
                      name="isRemote"
                      checked={formData.isRemote}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <label htmlFor="isRemote" className="checkbox-label">
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-text">{t('remoteWork')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Зарплата */}
            <div className="form-section">
              <h3 className="form-section-title">{t('salary')}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salaryMin" className="form-label">
                    {t('minSalary')}
                  </label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin || ''}
                    onChange={handleNumberChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="salaryMax" className="form-label">
                    {t('maxSalary')}
                  </label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax || ''}
                    onChange={handleNumberChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="currency" className="form-label">
                    {t('currency')}
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Вимоги та переваги */}
            <div className="form-section">
              <h3 className="form-section-title">{t('requirementsAndBenefits')}</h3>
              
              <div className="form-group">
                <label htmlFor="requirements" className="form-label">
                  {t('requirements')}
                </label>
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
                <label htmlFor="benefits" className="form-label">
                  {t('benefitsAndPerks')}
                </label>
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
            </div>
            
            {/* Навички */}
            <div className="form-section">
              <h3 className="form-section-title">{t('skills')}</h3>
              
              <div className="form-group">
                <label htmlFor="newSkill" className="form-label">
                  {t('addSkill')}
                </label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="form-input"
                    placeholder={t('addSkillPlaceholder')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn btn-primary btn-sm"
                    disabled={!newSkill.trim()}
                  >
                    <Plus className="icon" />
                    {t('add')}
                  </button>
                </div>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="skills-list">
                  {formData.skills.map(skill => (
                    <span key={skill} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="remove-skill-btn"
                      >
                        <X className="icon" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Додаткові налаштування */}
            <div className="form-section">
              <h3 className="form-section-title">{t('additionalSettings')}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department" className="form-label">
                    {t('department')}
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">{t('selectDepartment')}</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="deadline" className="form-label">
                    {t('applicationDeadline')}
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <label htmlFor="isUrgent" className="checkbox-label">
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-text">{t('urgentJob')}</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <label htmlFor="isFeatured" className="checkbox-label">
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-text">{t('featuredJob')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Кнопки дій */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.push('/jobs')}
                className="btn btn-outline"
                disabled={loading}
              >
                {t('cancel')}
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t('creating') : t('createJob')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;

