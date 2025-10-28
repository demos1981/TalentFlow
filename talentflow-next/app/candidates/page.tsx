'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { candidateService, type Candidate } from '../../services/candidateService';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Clock,
  Eye,
  User,
  Star,
  Mail,
  GraduationCap
} from 'lucide-react';
import './candidates.css';

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const { user, isLoading: authLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізуємо авторизацію один раз
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { checkAuth } = useAuthStore.getState();
        await checkAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Завантаження кандидатів з API
  useEffect(() => {
    // Не робимо нічого поки авторизація не ініціалізована
    if (!isInitialized || authLoading) {
      return;
    }
    
    if (!user) {
      router.replace('/auth');
      return;
    }
    
    if (user) {
      // Якщо є користувач - пробуємо завантажити (api сам додасть токен)
      loadCandidates();
    } else {
      setIsLoading(false);
    }
  }, [user, authLoading, isInitialized, router]);

  // Пошук при зміні фільтрів з debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCandidates();
    }, 500); // Затримка 500мс для debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, experienceFilter]);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setAuthError(false);
      
      const response = await candidateService.searchCandidates({});
      setCandidates(response.candidates || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAuthError(true);
        setCandidates([]);
      } else {
        setCandidates([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const searchCandidates = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Формуємо параметри пошуку відповідно до бекенду
      const searchParams: any = {
        page: 1,
        limit: 20,
        sortBy: 'recent',
        sortOrder: 'DESC'
      };
      
      if (searchTerm) {
        searchParams.location = searchTerm; // Пошук по локації
      }
      
      if (experienceFilter !== 'all') {
        // Мапимо фільтри на числові значення досвіду
        if (experienceFilter === 'junior') {
          searchParams.maxExperience = 2;
        } else if (experienceFilter === 'middle') {
          searchParams.minExperience = 3;
          searchParams.maxExperience = 4;
        } else if (experienceFilter === 'senior') {
          searchParams.minExperience = 5;
        }
      }

      const response = await candidateService.searchCandidates(searchParams);
      setCandidates(response.candidates || []);
      setAuthError(false);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAuthError(true);
        setCandidates([]);
      } else {
        setCandidates([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Використовуємо candidates напряму, оскільки фільтрація відбувається на сервері
  const filteredCandidates = candidates;

  const handleViewCandidate = (candidateId: string) => {
    router.push(`/candidates/${candidateId}`);
  };

  const handleContactCandidate = (candidateId: string) => {
    console.log('Contacting candidate:', candidateId);
    // TODO: Implement contact logic
  };

  // Показуємо завантаження поки не ініціалізовано
  if (!isInitialized || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">{t('initializing')}...</p>
        </div>
      </div>
    );
  }

  // Якщо не авторизований - перенаправляємо на auth
  if (!user) {
    return null; // router.replace('/auth') вже викликано в useEffect
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="dashboard-container">
          <div className="loading-spinner">{t('loading')}...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Candidates Header з фіолетовим дизайном */}
        <div className="purple-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">{t('candidates')}</h1>
            <p className="dashboard-greeting-subtitle">
              {t('candidatesSubtitle')}
            </p>
          </div>
          <Link href="/candidates/create" className="add-candidate-btn">
            <Plus className="icon" />
            {t('addCandidate')}
          </Link>
        </div>

        {/* Пошук та фільтри */}
        <div className="candidates-search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={t('searchCandidatesPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters-group">
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="experience-filter"
            >
              <option value="all">{t('allLevels')}</option>
              <option value="junior">{t('juniorLevel')}</option>
              <option value="middle">{t('middleLevel')}</option>
              <option value="senior">{t('seniorLevel')}</option>
            </select>
            <button className="filter-toggle-btn">
              <Filter className="icon" />
              {t('filters')}
            </button>
          </div>
        </div>

        {/* Список кандидатів */}
        <div className="candidates-results">
          <div className="results-header">
            <p className="results-count">
              {t('foundCandidates').replace('{count}', filteredCandidates.length.toString())}
            </p>
          </div>

      <div className="candidates-grid">
            {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-header">
                  <div className="candidate-title-section">
                    <h3 className="candidate-title">
                      {candidate.user 
                        ? `${candidate.user.firstName} ${candidate.user.lastName}`
                        : candidate.title || t('candidate')
                      }
                    </h3>
                    <span className="candidate-location">
                      <MapPin className="icon" />
                      {candidate.location || t('notSpecified')}
                    </span>
                  </div>
                </div>

            <div className="candidate-details">
                  <div className="candidate-detail">
                    <Briefcase className="icon" />
                    <span>
                      {candidate.yearsOfExperience 
                        ? t('yearsOfExperience').replace('{years}', candidate.yearsOfExperience.toString())
                        : t('experienceNotSpecified')
                      }
                    </span>
                  </div>
                  <div className="candidate-detail">
                    <GraduationCap className="icon" />
                    <span>
                      {candidate.education && candidate.education.length > 0
                        ? candidate.education[0]
                        : t('educationNotSpecified')
                      }
                    </span>
              </div>
                  <div className="candidate-detail">
                    <DollarSign className="icon" />
                    <span>
                      {candidate.preferences?.salaryExpectation
                        ? `${candidate.preferences.salaryExpectation} USD`
                        : candidate.preferences?.desiredSalary
                        ? `${candidate.preferences.desiredSalary} USD`
                        : t('salaryNotSpecified')
                      }
                    </span>
                  </div>
                  <div className="candidate-detail">
                    <Clock className="icon" />
                    <span>{new Date(candidate.updatedAt).toLocaleDateString('uk-UA')}</span>
                  </div>
            </div>

                <div className="candidate-description">
                  <p>{candidate.bio || candidate.summary || candidate.title || t('descriptionNotSpecified')}</p>
                </div>

            <div className="candidate-skills">
                  {candidate.skills && candidate.skills.length > 0 ? (
                    <>
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
                      {candidate.skills.length > 4 && (
                        <span className="skill-tag more">
                          {t('moreSkills').replace('{count}', (candidate.skills.length - 4).toString())}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="skill-tag">{t('skillsNotSpecified')}</span>
                  )}
                  </div>

                <div className="candidate-footer">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleViewCandidate(candidate.id)}
                  >
                    <Eye className="icon" />
                    {t('viewProfile')}
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleContactCandidate(candidate.id)}
                  >
                    <Mail className="icon" />
                    {t('contact')}
                  </button>
            </div>
          </div>
        ))}
      </div>
          </div>

        {filteredCandidates.length === 0 && !isLoading && (
          <div className="empty-state">
            <User className="icon" />
            {authError ? (
              <>
                <h3>{t('authError')}</h3>
                <p>{t('sessionExpired')}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/auth')}
                  style={{ marginTop: '16px' }}
                >
                  {t('logIn')}
                </button>
              </>
            ) : (
              <>
                <h3>{t('noCandidatesFound')}</h3>
                <p>
                  {!user 
                    ? t('logInToViewCandidates')
                    : t('tryChangingSearch')
                  }
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CandidatesPage;