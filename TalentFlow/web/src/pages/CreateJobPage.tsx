import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  const jobTypes = ['Повна зайнятість', 'Часткова зайнятість', 'Контракт', 'Стажування'];
  const experienceLevels = ['Junior', 'Middle', 'Senior', 'Lead', 'Architect'];
  const currencies = ['USD', 'EUR', 'UAH', 'PLN'];
  const departments = ['IT', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
  
  // Перевірка доступу
  useEffect(() => {
    if (!user || user.role !== 'employer' || !user.canPostJobs) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
      setError('Заповніть обов\'язкові поля');
      return;
    }
    
    // Валідація дедлайну
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      
      if (deadlineDate < now) {
        setError('Дедлайн має бути сьогодні або в майбутньому');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Submitting job data:', formData);
      
      await jobService.createJob(formData);
      
      // Перенаправляємо на сторінку вакансій
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Помилка створення вакансії');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'employer' || !user.canPostJobs) {
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
              onClick={() => navigate('/jobs')}
            >
              <ArrowLeft className="icon" />
              Назад до вакансій
            </button>
          </div>
          <h1 className="dashboard-title">Створити вакансію</h1>
          <p className="dashboard-greeting-subtitle">
            Створіть привабливу вакансію для найкращих кандидатів
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
              <h3 className="form-section-title">Основна інформація</h3>
              
              <div className="form-group">
                <label htmlFor="title" className="form-label required">
                  Назва вакансії
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Наприклад: Senior Full-Stack Developer"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label required">
                  Опис вакансії
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Детально опишіть вакансію, обов'язки та вимоги..."
                  rows={6}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Тип роботи
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Оберіть тип</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="experienceLevel" className="form-label">
                    Рівень досвіду
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Оберіть рівень</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Локація та віддалена робота */}
            <div className="form-section">
              <h3 className="form-section-title">Локація та робота</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Локація
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Місто, країна"
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isRemote"
                      checked={formData.isRemote}
                      onChange={handleInputChange}
                    />
                    Віддалена робота
                  </label>
                </div>
              </div>
            </div>
            
            {/* Зарплата */}
            <div className="form-section">
              <h3 className="form-section-title">Зарплата</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salaryMin" className="form-label">
                    Мінімальна зарплата
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
                    Максимальна зарплата
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
                    Валюта
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
              <h3 className="form-section-title">Вимоги та переваги</h3>
              
              <div className="form-group">
                <label htmlFor="requirements" className="form-label">
                  Вимоги
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Опишіть вимоги до кандидата..."
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="benefits" className="form-label">
                  Переваги та бенефіти
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Опишіть переваги роботи у вашій компанії..."
                  rows={4}
                />
              </div>
            </div>
            
            {/* Навички */}
            <div className="form-section">
              <h3 className="form-section-title">Навички</h3>
              
              <div className="form-group">
                <label htmlFor="newSkill" className="form-label">
                  Додати навичку
                </label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="form-input"
                    placeholder="Введіть назву навички"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn btn-primary btn-sm"
                    disabled={!newSkill.trim()}
                  >
                    <Plus className="icon" />
                    Додати
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
              <h3 className="form-section-title">Додаткові налаштування</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department" className="form-label">
                    Відділ
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Оберіть відділ</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="deadline" className="form-label">
                    Дедлайн подачі
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
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleInputChange}
                    />
                    Термінова вакансія
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                    Рекомендована вакансія
                  </label>
                </div>
              </div>
            </div>
            
            {/* Кнопки дій */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="btn btn-outline"
                disabled={loading}
              >
                Скасувати
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Створення...' : 'Створити вакансію'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;

