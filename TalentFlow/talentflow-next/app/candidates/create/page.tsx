'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { useLanguageStore } from '../../../stores/languageStore';
import { candidateService } from '../../../services/candidateService';
import { USER_TYPES } from '../../../constants';
import Layout from '../../../components/Layout/Layout';
import { 
  User, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Plus, 
  X, 
  Loader2, 
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  GraduationCap,
  Award,
  Languages
} from 'lucide-react';
import toast from 'react-hot-toast';
import './create-candidate.css';

interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  summary: string;
  location: string;
  yearsOfExperience: string;
  skills: string[];
  education: string[];
  certifications: string[];
  languages: string[];
  website: string;
  linkedin: string;
  github: string;
  portfolio: string;
  preferences: {
    salaryExpectation: string;
    preferredLocation: string;
    remoteWork: boolean;
    relocation: boolean;
    workType: string;
    availability: string;
  };
}

const CreateCandidatePage: React.FC = () => {
  const [formData, setFormData] = useState<CandidateFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    summary: '',
    location: '',
    yearsOfExperience: '',
    skills: [],
    education: [],
    certifications: [],
    languages: [],
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    preferences: {
      salaryExpectation: '',
      preferredLocation: '',
      remoteWork: false,
      relocation: false,
      workType: 'full_time',
      availability: 'immediate'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Автоматично заповнюємо форму даними користувача, якщо це кандидат
  React.useEffect(() => {
    if (user?.role === USER_TYPES.CANDIDATE) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || '',
        bio: user.bio || '',
        location: user.location || '',
        yearsOfExperience: user.experience?.toString() || '',
        skills: user.skills || [],
        education: user.education ? [user.education] : [],
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || ''
      }));
    }
  }, [user]);

  // Опції для селектів
  const workTypes = [
    { value: 'full_time', label: t('fullTime') },
    { value: 'part_time', label: t('partTime') },
    { value: 'contract', label: t('contract') },
    { value: 'freelance', label: t('freelance') }
  ];

  const availabilityOptions = [
    { value: 'immediate', label: t('immediate') },
    { value: '2weeks', label: t('twoWeeks') },
    { value: '1month', label: t('oneMonth') },
    { value: '3months', label: t('threeMonths') }
  ];

  // Перевірка доступу - дозволяємо роботодавцям створювати профілі кандидатів та кандидатам створювати свої профілі
  if (!user || (user.role !== USER_TYPES.EMPLOYER && user.role !== USER_TYPES.CANDIDATE)) {
    return (
      <div className="create-candidate-page">
      <div className="error-message">
        <h2>{t('accessDenied')}</h2>
        <p>{t('onlyEmployersAndCandidatesCanAdd')}</p>
      </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [prefKey]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [prefKey]: value
          }
        }));
      }
    } else {
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
    }
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

  const addEducation = () => {
    if (newEducation.trim() && !formData.education.includes(newEducation.trim())) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
    }
  };

  const removeEducation = (eduToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu !== eduToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== langToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error(t('enterValidEmail'));
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Підготовка даних для API (тільки непорожні поля)
      const candidateData: any = {
        // Обов'язкові дані користувача
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim()
      };

      // Додаємо опціональні поля тільки якщо вони не порожні
      if (formData.phone.trim()) candidateData.phone = formData.phone.trim();
      if (formData.title.trim()) candidateData.title = formData.title.trim();
      if (formData.bio.trim()) candidateData.bio = formData.bio.trim();
      if (formData.summary.trim()) candidateData.summary = formData.summary.trim();
      if (formData.location.trim()) candidateData.location = formData.location.trim();
      if (formData.yearsOfExperience.trim()) candidateData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      
      // Масиви тільки якщо не порожні
      if (formData.skills.length > 0) candidateData.skills = formData.skills;
      if (formData.education.length > 0) candidateData.education = formData.education;
      if (formData.certifications.length > 0) candidateData.certifications = formData.certifications;
      if (formData.languages.length > 0) candidateData.languages = formData.languages;
      
      // URL поля тільки якщо не порожні
      if (formData.website.trim()) candidateData.website = formData.website.trim();
      if (formData.linkedin.trim()) candidateData.linkedin = formData.linkedin.trim();
      if (formData.github.trim()) candidateData.github = formData.github.trim();
      if (formData.portfolio.trim()) candidateData.portfolio = formData.portfolio.trim();
      
      // Preferences тільки якщо є непорожні значення
      const preferences: any = {};
      if (formData.preferences.salaryExpectation.trim()) {
        preferences.salaryExpectation = parseInt(formData.preferences.salaryExpectation);
      }
      if (formData.preferences.preferredLocation.trim()) {
        preferences.preferredLocation = formData.preferences.preferredLocation.trim();
      }
      preferences.remoteWork = formData.preferences.remoteWork;
      preferences.relocation = formData.preferences.relocation;
      preferences.workType = formData.preferences.workType;
      preferences.availability = formData.preferences.availability;
      
      candidateData.preferences = preferences;

      // Створюємо кандидата через API
      const result = await candidateService.createOwnProfile(candidateData);
      
      toast.success(t('candidateCreatedSuccess'));
      router.push(`/candidates/${result.id}`);
      
    } catch (error: any) {
      console.error('Error creating candidate:', error);
      toast.error(error.response?.data?.message || t('errorCreatingCandidate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="create-candidate-page">
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">
              {user?.role === USER_TYPES.CANDIDATE ? t('createYourProfile') : t('createCandidate')}
            </h1>
            <p className="dashboard-greeting">
              {user?.role === USER_TYPES.CANDIDATE ? t('createYourProfileSubtitle') : t('createCandidateSubtitle')}
            </p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Основна інформація */}
        <div className="form-section">
          <h3 className="form-section-title">
            <User className="icon" />
            {t('basicInformation')}
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">{t('firstName')} *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                placeholder={t('firstName')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">{t('lastName')} *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                placeholder={t('lastName')}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">{t('email')} *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="candidate@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">{t('phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+380 50 123 4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">{t('position')}</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder={t('jobTitlePlaceholder')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location" className="form-label">{t('location')}</label>
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
              <label htmlFor="yearsOfExperience" className="form-label">{t('yearsOfExperience')}</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="form-input"
                placeholder="5"
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Опис */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FileText className="icon" />
            {t('candidateDescription')}
          </h3>
          
          <div className="form-group">
            <label htmlFor="summary" className="form-label">{t('shortDescription')}</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder={t('candidateSummaryPlaceholder')}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="form-label">{t('detailedDescription')}</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder={t('candidateExperiencePlaceholder')}
              rows={6}
            />
          </div>
        </div>

        {/* Навички */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Briefcase className="icon" />
            {t('skills')}
          </h3>
          
          <div className="skills-input-section">
            <div className="add-skill-group">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="form-input"
                placeholder={t('addSkill')}
              />
              <button
                type="button"
                onClick={addSkill}
                className="add-btn"
              >
                <Plus className="icon" />
                {t('add')}
              </button>
            </div>
            
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
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
          </div>
        </div>

        {/* Освіта */}
        <div className="form-section">
          <h3 className="form-section-title">
            <GraduationCap className="icon" />
            {t('education')}
          </h3>
          
          <div className="education-input-section">
            <div className="add-education-group">
              <input
                type="text"
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                className="form-input"
                placeholder={t('addEducation')}
              />
              <button
                type="button"
                onClick={addEducation}
                className="add-btn"
              >
                <Plus className="icon" />
                {t('add')}
              </button>
            </div>
            
            <div className="education-list">
              {formData.education.map((edu, index) => (
                <span key={index} className="education-tag">
                  {edu}
                  <button
                    type="button"
                    onClick={() => removeEducation(edu)}
                    className="remove-education-btn"
                  >
                    <X className="icon" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Сертифікати */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Award className="icon" />
            {t('certifications')}
          </h3>
          
          <div className="certification-input-section">
            <div className="add-certification-group">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                className="form-input"
                placeholder={t('addCertification')}
              />
              <button
                type="button"
                onClick={addCertification}
                className="add-btn"
              >
                <Plus className="icon" />
                {t('add')}
              </button>
            </div>
            
            <div className="certifications-list">
              {formData.certifications.map((cert, index) => (
                <span key={index} className="certification-tag">
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(cert)}
                    className="remove-certification-btn"
                  >
                    <X className="icon" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Мови */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Languages className="icon" />
            {t('languages')}
          </h3>
          
          <div className="language-input-section">
            <div className="add-language-group">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                className="form-input"
                placeholder={t('addLanguage')}
              />
              <button
                type="button"
                onClick={addLanguage}
                className="add-btn"
              >
                <Plus className="icon" />
                {t('add')}
              </button>
            </div>
            
            <div className="languages-list">
              {formData.languages.map((lang, index) => (
                <span key={index} className="language-tag">
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="remove-language-btn"
                  >
                    <X className="icon" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Контакти */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Globe className="icon" />
            {t('contactInformation')}
          </h3>
          
          <div className="form-group">
            <label htmlFor="website" className="form-label">{t('website')}</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin" className="form-label">{t('linkedin')}</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="github" className="form-label">{t('github')}</label>
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="portfolio" className="form-label">{t('portfolio')}</label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://portfolio.com"
            />
          </div>
        </div>

        {/* Преференції */}
        <div className="form-section">
          <h3 className="form-section-title">
            <DollarSign className="icon" />
            {t('preferences')}
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preferences.salaryExpectation" className="form-label">{t('salaryExpectation')}</label>
              <input
                type="number"
                id="preferences.salaryExpectation"
                name="preferences.salaryExpectation"
                value={formData.preferences.salaryExpectation}
                onChange={handleInputChange}
                className="form-input"
                placeholder="5000"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="preferences.preferredLocation" className="form-label">{t('preferredLocation')}</label>
              <input
                type="text"
                id="preferences.preferredLocation"
                name="preferences.preferredLocation"
                value={formData.preferences.preferredLocation}
                onChange={handleInputChange}
                className="form-input"
                placeholder={t('locationPlaceholder')}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preferences.workType" className="form-label">{t('workType')}</label>
              <select
                id="preferences.workType"
                name="preferences.workType"
                value={formData.preferences.workType}
                onChange={handleInputChange}
                className="form-select"
              >
                {workTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="preferences.availability" className="form-label">{t('availability')}</label>
              <select
                id="preferences.availability"
                name="preferences.availability"
                value={formData.preferences.availability}
                onChange={handleInputChange}
                className="form-select"
              >
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="preferences.remoteWork"
                checked={formData.preferences.remoteWork}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>{t('remoteWork')}</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="preferences.relocation"
                checked={formData.preferences.relocation}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>{t('relocation')}</span>
            </label>
          </div>
        </div>

        {/* Кнопки */}
        <div className="form-actions">
          <button 
            type="button"
            onClick={() => router.push(user?.role === USER_TYPES.CANDIDATE ? "/jobs" : "/candidates")}
            className="btn btn-secondary"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="icon animate-spin" />
                {t('creating')}
              </>
            ) : (
              <>
                <Plus className="icon" />
                {t('createCandidateButton')}
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </Layout>
  );
};

export default CreateCandidatePage;
