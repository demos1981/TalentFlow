import React, { useState, useEffect } from 'react';
import { Brain, Target, Zap, Users, Briefcase, Filter, RefreshCw } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';
import { 
  AiMatchingCard, 
  AiMatchingFilters, 
  AiMatchingStats,
  type AiRecommendation
} from '../components/AI';
import type { AiMatchingFilters as AiMatchingFiltersType } from '../components/AI/AiMatchingFilters';
import type { AiMatchingStats as AiMatchingStatsType } from '../components/AI/AiMatchingStats';
import { 
  RecommendationType, 
  FilterType, 
  AI_MATCHING_CONSTANTS 
} from '../constants/aiMatching';

const AiMatchingPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [filters, setFilters] = useState<AiMatchingFiltersType>({
    search: '',
    location: '',
    experience: '',
    salaryRange: '',
    skills: [],
    matchScore: AI_MATCHING_CONSTANTS.DEFAULT_MATCH_SCORE,
    type: AI_MATCHING_CONSTANTS.DEFAULT_FILTER_TYPE
  });
  const [stats, setStats] = useState<AiMatchingStatsType>({
    totalMatches: 0,
    highQualityMatches: 0,
    averageMatchScore: 0,
    candidatesMatched: 0,
    jobsMatched: 0,
    lastUpdated: new Date().toLocaleString('uk-UA'),
    aiAccuracy: 0,
    processingTime: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'jobs'>('overview');

  // Мокові дані для демонстрації
  useEffect(() => {
    const mockRecommendations: AiRecommendation[] = [
      {
        id: '1',
        type: RecommendationType.CANDIDATE,
        title: 'Олександр Петренко',
        subtitle: 'Senior Frontend Developer',
        matchScore: 95,
        skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL'],
        experience: '5+ років',
        location: 'Київ, Україна',
        salary: '120,000 - 180,000 USD',
        avatar: '',
        aiReason: 'Відмінний матч по технічним навичкам та досвіду. Кандидат має релевантний досвід з React та TypeScript, що точно відповідає вимогам вакансії.'
      },
      {
        id: '2',
        type: RecommendationType.JOB,
        title: 'Senior React Developer',
        subtitle: 'TechCorp Ukraine',
        matchScore: 92,
        skills: ['React', 'TypeScript', 'Redux', 'Jest', 'CI/CD'],
        experience: '3+ роки',
        location: 'Київ, Україна',
        salary: '100,000 - 150,000 грн',
        company: 'TechCorp Ukraine',
        postedDate: '2 дні тому',
        aiReason: 'Вакансія ідеально підходить для кандидата з досвідом React розробки. Зарплата та вимоги відповідають рівню досвіду.'
      },
      {
        id: '3',
        type: RecommendationType.CANDIDATE,
        title: 'Марія Іваненко',
        subtitle: 'Full Stack Developer',
        matchScore: 88,
        skills: ['JavaScript', 'Python', 'Django', 'PostgreSQL', 'Docker'],
        experience: '4 роки',
        location: 'Львів, Україна',
        salary: '80,000 - 120,000 грн',
        avatar: '',
        aiReason: 'Хороший матч по технічному стеку. Кандидат має досвід з Python та веб-розробкою, що відповідає вимогам.'
      },
      {
        id: '4',
        type: RecommendationType.JOB,
        title: 'Python Backend Developer',
        subtitle: 'StartupHub',
        matchScore: 85,
        skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis'],
        experience: '2+ роки',
        location: 'Віддалено',
        salary: '70,000 - 110,000 грн',
        company: 'StartupHub',
        postedDate: '1 тиждень тому',
        aiReason: 'Вакансія відповідає технічним навичкам кандидата. Віддалена робота та зарплата також підходять.'
      }
    ];

    const mockStats: AiMatchingStatsType = {
      totalMatches: 156,
      highQualityMatches: 89,
      averageMatchScore: 87,
      candidatesMatched: 78,
      jobsMatched: 78,
      lastUpdated: new Date().toLocaleString('uk-UA'),
      aiAccuracy: 94,
      processingTime: 245
    };

    setRecommendations(mockRecommendations);
    setStats(mockStats);
  }, []);

  const handleFiltersChange = (newFilters: AiMatchingFiltersType) => {
    setFilters(newFilters);
    // Тут буде логіка фільтрації
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      location: '',
      experience: '',
      salaryRange: '',
      skills: [],
      matchScore: AI_MATCHING_CONSTANTS.DEFAULT_MATCH_SCORE,
      type: AI_MATCHING_CONSTANTS.DEFAULT_FILTER_TYPE
    });
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for:', id);
    // Тут буде логіка перегляду деталей
  };

  const handleContact = (id: string) => {
    console.log('Contact for:', id);
    // Тут буде логіка зв\'язку
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Симуляція оновлення даних
    setTimeout(() => {
      setStats((prev: AiMatchingStatsType) => ({
        ...prev,
        lastUpdated: new Date().toLocaleString('uk-UA')
      }));
      setIsLoading(false);
    }, 1000);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.type !== FilterType.ALL) {
      if (filters.type === FilterType.CANDIDATES && rec.type !== RecommendationType.CANDIDATE) return false;
      if (filters.type === FilterType.JOBS && rec.type !== RecommendationType.JOB) return false;
    }
    if (filters.matchScore > rec.matchScore) return false;
    if (filters.search && !rec.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.location && !rec.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.skills.length > 0 && !filters.skills.some((skill: string) => rec.skills.includes(skill))) return false;
    return true;
  });

  return (
    <div className="ai-matching-page">
      {/* Заголовок сторінки */}
      <div className="ai-matching-header">
        <div className="ai-matching-header-content">
          <div className="ai-matching-header-title">
            <Brain size={32} className="ai-matching-header-icon" />
            <div>
              <h1 className="ai-matching-page-title">{t('aiMatching')}</h1>
              <p className="ai-matching-page-subtitle">
                {t('aiMatchingDescription')}
              </p>
            </div>
          </div>
          <button
            className="ai-matching-refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            {t('refresh')}
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="ai-matching-section">
        <AiMatchingStats stats={stats} />
      </div>

      {/* Фільтри */}
      <div className="ai-matching-section">
        <AiMatchingFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />
      </div>

      {/* Таби для перегляду */}
      <div className="ai-matching-section">
        <div className="ai-matching-tabs">
          <button
            className={`ai-matching-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Target size={16} />
            {t('overview')} ({filteredRecommendations.length})
          </button>
          <button
            className={`ai-matching-tab ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            <Users size={16} />
            {t('candidates')} ({filteredRecommendations.filter(r => r.type === 'candidate').length})
          </button>
          <button
            className={`ai-matching-tab ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={16} />
            {t('jobs')} ({filteredRecommendations.filter(r => r.type === 'job').length})
          </button>
        </div>
      </div>

      {/* Рекомендації */}
      <div className="ai-matching-section">
        {filteredRecommendations.length === 0 ? (
          <div className="ai-matching-empty">
            <Brain size={64} className="ai-matching-empty-icon" />
            <h3>{t('noRecommendationsFound')}</h3>
            <p>{t('tryChangingFilters')}</p>
            <button className="ai-matching-btn ai-matching-btn-primary" onClick={handleRefresh}>
              {t('refresh')}
            </button>
          </div>
        ) : (
          <div className="ai-matching-recommendations">
            <div className="ai-matching-recommendations-header">
              <h3 className="ai-matching-recommendations-title">
                {activeTab === 'overview' && t('allRecommendations')}
                {activeTab === 'candidates' && t('candidates')}
                {activeTab === 'jobs' && t('jobs')}
              </h3>
              <span className="ai-matching-recommendations-count">
                {filteredRecommendations.length} {t('results')}
              </span>
            </div>
            
            <div className="ai-matching-recommendations-grid">
              {filteredRecommendations
                .filter(rec => {
                  if (activeTab === 'candidates') return rec.type === RecommendationType.CANDIDATE;
                  if (activeTab === 'jobs') return rec.type === RecommendationType.JOB;
                  return true;
                })
                .map(recommendation => (
                  <AiMatchingCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onViewDetails={handleViewDetails}
                    onContact={handleContact}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Інформація про AI */}
      <div className="ai-matching-section">
        <div className="ai-matching-info">
          <div className="ai-matching-info-content">
            <h3>{t('howAiMatchingWorks')}</h3>
            <div className="ai-matching-info-grid">
              <div className="ai-matching-info-item">
                <Zap size={24} />
                <h4>{t('profileAnalysis')}</h4>
                <p>{t('profileAnalysisDescription')}</p>
              </div>
              <div className="ai-matching-info-item">
                <Target size={24} />
                <h4>{t('semanticSearch')}</h4>
                <p>{t('semanticSearchDescription')}</p>
              </div>
              <div className="ai-matching-info-item">
                <Brain size={24} />
                <h4>{t('machineLearning')}</h4>
                <p>{t('machineLearningDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMatchingPage;
