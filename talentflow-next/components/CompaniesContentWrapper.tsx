'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '../stores/languageStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Users, 
  Star,
  Briefcase,
  CheckCircle,
  Plus
} from 'lucide-react';
import './ServerCompaniesContent.css';

const getLocalizedIndustry = (industry: string, t: (key: string) => string) => {
  const industryMap: { [key: string]: string } = {
    'IT & Технології': t('itAndTech'),
    'Дизайн & Креатив': t('designAndCreative'),
    'Аналітика & Дані': t('analyticsAndData'),
    'Фінанси & Банкінг': t('financeAndBanking')
  };
  return industryMap[industry] || industry;
};

// Мокові дані для клієнтського рендерингу
const mockCompanies = [
  {
    id: '1',
    name: 'TechCorp',
    industry: 'IT & Технології',
    location: 'Київ, Україна',
    companySize: '50-200 співробітників',
    employees: '150+',
    description: 'Провідна IT компанія, що спеціалізується на розробці інноваційних рішень для бізнесу.',
    rating: 4.8,
    activeJobs: 12,
    verified: true,
    founded: '2015',
    website: 'techcorp.ua'
  },
  {
    id: '2',
    name: 'DesignStudio',
    industry: 'Дизайн & Креатив',
    location: 'Львів, Україна',
    companySize: '10-50 співробітників',
    employees: '25+',
    description: 'Креативна студія, що створює унікальні дизайнерські рішення для клієнтів по всьому світу.',
    rating: 4.6,
    activeJobs: 8,
    verified: true,
    founded: '2018',
    website: 'designstudio.com'
  },
  {
    id: '3',
    name: 'DataTech',
    industry: 'Аналітика & Дані',
    location: 'Харків, Україна',
    companySize: '20-100 співробітників',
    employees: '45+',
    description: 'Спеціалісти з обробки великих даних та машинного навчання для різних галузей.',
    rating: 4.7,
    activeJobs: 15,
    verified: false,
    founded: '2017',
    website: 'datatech.ua'
  },
  {
    id: '4',
    name: 'FinancePro',
    industry: 'Фінанси & Банкінг',
    location: 'Одеса, Україна',
    companySize: '100-500 співробітників',
    employees: '300+',
    description: 'Фінансова компанія, що надає інноваційні рішення для банківського сектору.',
    rating: 4.5,
    activeJobs: 20,
    verified: true,
    founded: '2012',
    website: 'financepro.ua'
  }
];

export const CompaniesContentWrapper: React.FC = () => {
  const { t } = useLanguageStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [companies, setCompanies] = useState(mockCompanies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // В реальному додатку тут буде завантаження з API
    setCompanies(mockCompanies);
  }, []);

  const handleAddCompany = () => {
    // Перевіряємо чи користувач авторизований
    if (!user) {
      toast.error(t('authorizationRequired'));
      router.push('/auth');
      return;
    }

    // Перевіряємо чи користувач має право створювати компанії (тільки employer та admin)
    if (user.role !== 'employer' && user.role !== 'admin') {
      toast.error(t('onlyEmployersCanCreateCompanies'));
      return;
    }

    // Поки що показуємо повідомлення, що функція в розробці
    // TODO: Додати модальне вікно або перенаправити на сторінку створення компанії
    toast.success(t('featureInDevelopment'));
    
    // Альтернативно можна перенаправити на сторінку створення компанії:
    // router.push('/companies/create');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">{t('loading')}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-banner">
          <p>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Companies Header з фіолетовим дизайном */}
      <div className="purple-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">{t('companies')}</h1>
          <p className="dashboard-greeting-subtitle">
            Знайдіть найкращі компанії та їх вакансії
          </p>
        </div>
        <button className="add-company-btn" onClick={handleAddCompany}>
          <Plus className="icon" />
          {t('addCompany')}
        </button>
      </div>

      {/* Пошук та фільтри */}
      <div className="companies-search-section">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={t('searchCompaniesPlaceholder')}
            className="search-input"
          />
        </div>
        <button className="filter-toggle-btn">
          <Filter className="icon" />
          {t('filters')}
        </button>
      </div>

      {/* Список компаній */}
      <div className="companies-results">
        <div className="results-header">
          <p className="results-count">
            {t('foundCompanies').replace('{count}', companies.length.toString())}
          </p>
        </div>

        <div className="companies-grid">
          {companies.map((company) => (
            <div key={company.id} className="company-card">
              <div className="company-header">
                <div className="company-title-section">
                  <h3 className="company-title">{company.name}</h3>
                  {company.verified && (
                    <span className="company-verified">
                      <CheckCircle className="icon" />
                      {t('verified')}
                    </span>
                  )}
                </div>
              </div>

              <div className="company-details">
                <div className="company-detail">
                  <Building2 className="icon" />
                  <span>{getLocalizedIndustry(company.industry, (key: string) => t(key as any))}</span>
                </div>
                <div className="company-detail">
                  <MapPin className="icon" />
                  <span>{company.location}</span>
                </div>
                <div className="company-detail">
                  <Users className="icon" />
                  <span>{company.companySize}</span>
                </div>
                <div className="company-detail">
                  <Briefcase className="icon" />
                  <span>{t('activeJobs').replace('{count}', company.activeJobs.toString())}</span>
                </div>
              </div>

              <div className="company-description">
                <p>{company.description}</p>
              </div>

              <div className="company-stats">
                <div className="company-rating">
                  <Star className="icon" />
                  <span className="rating-value">{company.rating}</span>
                  <span className="rating-stars">★★★★★</span>
                </div>
                <div className="company-founded">
                  <span>{t('founded')}: {company.founded}</span>
                </div>
              </div>

              <div className="company-footer">
                <Link href={`/companies/${company.id}`} className="btn btn-outline">
                  {t('viewProfile')}
                </Link>
                <Link href={`/jobs?company=${encodeURIComponent(company.name)}`} className="btn btn-primary">
                  {t('companyJobs')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
