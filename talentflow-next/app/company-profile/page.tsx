'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { Building2, Globe, MapPin, Users, Mail, Phone, Save, X, Briefcase, Flame } from 'lucide-react';
import { USER_TYPES } from '../../constants';
import { companiesApi } from '../../services/api';
import './company-profile.css';

const CompanyProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [companyData, setCompanyData] = useState({
    name: '',
    description: '',
    industry: '',
    size: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    logo: '',
    foundedYear: '',
    employees: ''
  });

  const [jobsStats, setJobsStats] = useState({
    normalJobs: 0,
    featuredJobs: 0,
    isLoading: true
  });

  // Ініціалізація авторизації
  useEffect(() => {
    const initAuth = async () => {
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized]);

  // Перевірка доступу
  useEffect(() => {
    if (isInitialized && !authLoading) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else if (user?.role !== USER_TYPES.EMPLOYER) {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, authLoading, isAuthenticated, user, router]);

  // Завантаження даних компанії
  useEffect(() => {
    if (user?.company) {
      // TODO: Завантажити дані компанії з API
      setCompanyData({
        name: user.company || '',
        description: '',
        industry: '',
        size: '',
        website: user.website || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        city: '',
        country: '',
        logo: '',
        foundedYear: '',
        employees: ''
      });
    }
  }, [user]);

  // Завантаження статистики вакансій
  useEffect(() => {
    const loadJobsStats = async () => {
      if (user?.companyId) {
        try {
          setJobsStats(prev => ({ ...prev, isLoading: true }));
          const response = await companiesApi.getCompanyJobsStats(user.companyId);
          const { normalJobs, featuredJobs } = response.data.data;
          setJobsStats({
            normalJobs,
            featuredJobs,
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading jobs stats:', error);
          setJobsStats(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadJobsStats();
  }, [user?.companyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Зберегти дані компанії через API
      console.log('Saving company data:', companyData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Симуляція API запиту
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Відновити оригінальні дані
    if (user?.company) {
      setCompanyData({
        name: user.company || '',
        description: '',
        industry: '',
        size: '',
        website: user.website || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        city: '',
        country: '',
        logo: '',
        foundedYear: '',
        employees: ''
      });
    }
    setIsEditing(false);
  };

  // Показати завантаження
  if (!isInitialized || authLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  // Якщо не авторизований або не роботодавець
  if (!isAuthenticated || user?.role !== USER_TYPES.EMPLOYER) {
    return null;
  }

  return (
    <Layout>
      <div className="company-profile-page">
        <div className="company-profile-header">
          <div className="company-profile-header-content">
            <div className="company-profile-title-section">
              <Building2 className="company-profile-icon" />
              <div>
                <h1 className="company-profile-title">{t('companyProfile')}</h1>
                <p className="company-profile-subtitle">{t('companyProfileDescription')}</p>
              </div>
            </div>
            
            <div className="company-profile-actions">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-primary"
                >
                  {t('edit')}
                </button>
              ) : (
                <div className="company-profile-edit-actions">
                  <button 
                    onClick={handleSave} 
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    <Save className="btn-icon" />
                    {isSaving ? t('saving') : t('save')}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    className="btn btn-secondary"
                    disabled={isSaving}
                  >
                    <X className="btn-icon" />
                    {t('cancel')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="company-profile-content">
          {/* Залишилось вакансій */}
          <div className="company-profile-section jobs-stats-section">
            <h2 className="section-title">Залишилось вакансій</h2>
            
            {jobsStats.isLoading ? (
              <div className="jobs-stats-loading">
                <p>{t('loading')}...</p>
              </div>
            ) : (
              <div className="jobs-stats-grid">
                <div className="jobs-stat-card">
                  <div className="jobs-stat-icon">
                    <Briefcase />
                  </div>
                  <div className="jobs-stat-content">
                    <div className="jobs-stat-label">звичайних:</div>
                    <div className="jobs-stat-value">{jobsStats.normalJobs}</div>
                  </div>
                </div>
                
                <div className="jobs-stat-card featured">
                  <div className="jobs-stat-icon">
                    <Flame />
                  </div>
                  <div className="jobs-stat-content">
                    <div className="jobs-stat-label">гарячих:</div>
                    <div className="jobs-stat-value">{jobsStats.featuredJobs}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Основна інформація */}
          <div className="company-profile-section">
            <h2 className="section-title">{t('basicInformation')}</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Building2 className="form-label-icon" />
                  {t('companyName')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={companyData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder={t('enterCompanyName')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe className="form-label-icon" />
                  {t('website')}
                </label>
                <input
                  type="url"
                  name="website"
                  value={companyData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('companyDescription')}</label>
              <textarea
                name="description"
                value={companyData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="form-textarea"
                placeholder={t('tellAboutCompany')}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t('industry')}</label>
                <select
                  name="industry"
                  value={companyData.industry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">{t('selectIndustry')}</option>
                  <option value="it">{t('industryIT')}</option>
                  <option value="finance">{t('industryFinance')}</option>
                  <option value="healthcare">{t('industryHealthcare')}</option>
                  <option value="education">{t('industryEducation')}</option>
                  <option value="retail">{t('industryRetail')}</option>
                  <option value="manufacturing">{t('industryManufacturing')}</option>
                  <option value="other">{t('industryOther')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users className="form-label-icon" />
                  {t('companySize')}
                </label>
                <select
                  name="size"
                  value={companyData.size}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">{t('selectSize')}</option>
                  <option value="1-10">{t('size1to10')}</option>
                  <option value="11-50">{t('size11to50')}</option>
                  <option value="51-200">{t('size51to200')}</option>
                  <option value="201-500">{t('size201to500')}</option>
                  <option value="501+">{t('size501plus')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Контактна інформація */}
          <div className="company-profile-section">
            <h2 className="section-title">{t('contactInformation')}</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Mail className="form-label-icon" />
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="company@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="form-label-icon" />
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="+380 XX XXX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Локація */}
          <div className="company-profile-section">
            <h2 className="section-title">{t('location')}</h2>
            
            <div className="form-group">
              <label className="form-label">
                <MapPin className="form-label-icon" />
                {t('address')}
              </label>
              <input
                type="text"
                name="address"
                value={companyData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                placeholder={t('streetAddress')}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t('city')}</label>
                <input
                  type="text"
                  name="city"
                  value={companyData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder={t('cityPlaceholder')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('country')}</label>
                <input
                  type="text"
                  name="country"
                  value={companyData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder={t('countryPlaceholder')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;

