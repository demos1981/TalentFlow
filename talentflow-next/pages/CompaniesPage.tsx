import React from 'react';
import { Building2, Users, MapPin, Globe, Star } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

const CompaniesPage: React.FC = () => {
  const { t } = useLanguageStore();
  
  const companies = [
    {
      id: 1,
      name: 'TechCorp',
      industry: 'Технології',
      location: 'Київ, Україна',
      employees: '50-100',
      website: 'techcorp.com',
      rating: 4.8,
      description: 'Інноваційна технологічна компанія, що спеціалізується на розробці програмного забезпечення та цифрових рішень.',
      activeJobs: 12
    },
    {
      id: 2,
      name: 'InnovateSoft',
      industry: 'Розробка ПЗ',
      location: 'Львів, Україна',
      employees: '100-250',
      website: 'innovatesoft.com',
      rating: 4.6,
      description: 'Компанія з розробки програмного забезпечення з фокусом на фінтех та електронну комерцію.',
      activeJobs: 8
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">{t('companies')}</h1>
          <p className="dashboard-greeting-subtitle">
            {t('companyInformation')}
          </p>
        </div>
      </div>

      <div className="dashboard-sections-grid">
        {companies.map((company) => (
          <div key={company.id} className="dashboard-section-card">
            <div className="company-header">
              <div className="company-logo">
                <Building2 className="icon" />
              </div>
              <div className="company-info">
                <h2 className="company-name">{company.name}</h2>
                <div className="company-meta">
                  <span className="company-industry">{company.industry}</span>
                  <span className="company-location">
                    <MapPin className="icon" />
                    {company.location}
                  </span>
                </div>
              </div>
              <div className="company-rating">
                <Star className="icon" />
                {company.rating}
              </div>
            </div>
            
            <div className="company-details">
              <p className="company-description">{company.description}</p>
              
              <div className="company-stats">
                <div className="company-stat">
                  <Users className="icon" />
                  <span>{company.employees} {t('employees')}</span>
                </div>
                <div className="company-stat">
                  <Globe className="icon" />
                  <span>{company.website}</span>
                </div>
                <div className="company-stat">
                  <Building2 className="icon" />
                  <span>{company.activeJobs} {t('activeJobs')}</span>
                </div>
              </div>
            </div>
            
            <div className="company-actions">
              <button className="btn btn-primary">{t('viewCompany')}</button>
              <button className="btn btn-outline">{t('viewJobs')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
