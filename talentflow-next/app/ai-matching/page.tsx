'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { optimizedAiMatchingService, JobWithBestCandidate, OptimizedMatchingStats, OptimizedMatchResult } from '../../services/optimizedAiMatchingService';
import { 
  Brain, 
  Search, 
  RefreshCw, 
  User, 
  MapPin, 
  DollarSign, 
  Star, 
  Clock, 
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './ai-matching.css';

// Утиліти для кешування результатів AI matching
const CACHE_KEY_PREFIX = 'ai_matching_cache_';
const CACHE_EXPIRY_HOURS = 24; // Кеш дійсний 24 години

interface CachedResult {
  matches: OptimizedMatchResult[];
  timestamp: number;
  jobId: string;
}

const getCacheKey = (jobId: string): string => `${CACHE_KEY_PREFIX}${jobId}`;

const getCachedResult = (jobId: string): OptimizedMatchResult[] | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(getCacheKey(jobId));
    if (!cached) return null;
    
    const parsed: CachedResult = JSON.parse(cached);
    const now = Date.now();
    const cacheAge = now - parsed.timestamp;
    const maxAge = CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // 24 години в мілісекундах
    
    if (cacheAge > maxAge) {
      // Кеш застарів, видаляємо його
      localStorage.removeItem(getCacheKey(jobId));
      return null;
    }
    
    return parsed.matches;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

const setCachedResult = (jobId: string, matches: OptimizedMatchResult[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData: CachedResult = {
      matches,
      timestamp: Date.now(),
      jobId
    };
    localStorage.setItem(getCacheKey(jobId), JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

const AiMatchingPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobWithBestCandidate[]>([]);
  const [stats, setStats] = useState<OptimizedMatchingStats>({
    totalJobs: 0,
    jobsWithEmbeddings: 0,
    totalCandidates: 0,
    candidatesWithEmbeddings: 0,
    averageVectorSimilarity: 0,
    averageAiScore: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchingJobs, setSearchingJobs] = useState<Set<string>>(new Set());
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Завантаження даних
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const jobsData = await optimizedAiMatchingService.getJobsWithoutCandidates(user?.companyId);
      
      // Завантажуємо кешовані результати для кожної вакансії
      const jobsWithCache = jobsData.map(job => {
        const cachedMatches = getCachedResult(job.jobId);
        if (cachedMatches && cachedMatches.length > 0) {
          const bestMatch = cachedMatches[0];
          return {
            ...job,
            bestCandidate: {
              candidateId: bestMatch.candidateId,
              candidateName: bestMatch.candidateName || t('candidate'),
              candidateTitle: bestMatch.candidateTitle || t('developer'),
              candidateLocation: 'Київ',
              candidateSkills: ['React', 'TypeScript'],
              candidateExperience: bestMatch.candidateExperience,
              candidateField: bestMatch.candidateField,
              overallScore: bestMatch.overallScore,
              aiScore: bestMatch.aiScore,
              vectorSimilarity: bestMatch.vectorSimilarity,
              reasoning: bestMatch.reasoning,
              avatar: bestMatch.avatar
            }
          };
        }
        return job;
      });
      
      // Створюємо статистику на основі отриманих вакансій користувача
      const userStats: OptimizedMatchingStats = {
        totalJobs: jobsData.length, // Кількість вакансій користувача
        jobsWithEmbeddings: 0, // Буде оновлено після генерації embeddings
        totalCandidates: 0, // Загальна кількість кандидатів в системі
        candidatesWithEmbeddings: 0, // Кількість кандидатів з embeddings
        averageVectorSimilarity: 0.75, // Placeholder
        averageAiScore: 82.0 // Placeholder
      };

      setJobs(jobsWithCache);
      setStats(userStats);
      
      console.log(`📊 Loaded ${jobsData.length} jobs for user, ${jobsWithCache.filter(j => j.bestCandidate).length} with cached results`);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleClearCache = () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Очищаємо всі кешовані результати AI matching
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`🗑️ Cleared ${cacheKeys.length} cached AI matching results`);
      
      // Очищаємо результати з UI
      setJobs(prev => prev.map(job => ({
        ...job,
        bestCandidate: undefined,
        searchError: undefined
      })));
      
      alert(`${t('clearCache')}: ${cacheKeys.length} кешованих результатів пошуку`);
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Помилка при очищенні кешу');
    }
  };

  const handleGenerateEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    setError(null);
    
    try {
      console.log('🚀 Starting embeddings generation for all jobs...');
      
      // Генеруємо embeddings для вакансій та кандидатів
      const [jobResult, candidateResult] = await Promise.all([
        optimizedAiMatchingService.generateJobEmbeddings(20),
        optimizedAiMatchingService.generateCandidateEmbeddings(20)
      ]);

      console.log('📊 Embeddings generation results:', { jobResult, candidateResult });

      if (jobResult.success && candidateResult.success) {
        console.log('✅ Embeddings generated successfully, reloading data...');
        // Оновлюємо дані після генерації embeddings
        await loadData();
      } else {
        setError('Failed to generate some embeddings');
      }
    } catch (err: any) {
      console.error('❌ Error generating embeddings:', err);
      setError(err.message || 'Failed to generate embeddings');
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  const handleSearchCandidates = async (jobId: string) => {
    setSearchingJobs(prev => new Set(prev).add(jobId));
    setError(null);
    
    try {
      // Спочатку перевіряємо кеш
      const cachedMatches = getCachedResult(jobId);
      if (cachedMatches && cachedMatches.length > 0) {
        console.log(`💾 Using cached results for job ${jobId}`);
        const bestMatch = cachedMatches[0];
        
        setJobs(prev => prev.map(job => 
          job.jobId === jobId 
            ? {
                ...job,
                bestCandidate: {
                  candidateId: bestMatch.candidateId,
                  candidateName: bestMatch.candidateName || t('candidate'),
                  candidateTitle: bestMatch.candidateTitle || t('developer'),
                  candidateLocation: 'Київ',
                  candidateSkills: ['React', 'TypeScript'],
                  candidateExperience: bestMatch.candidateExperience,
                  candidateField: bestMatch.candidateField,
                  overallScore: bestMatch.overallScore,
                  aiScore: bestMatch.aiScore,
                  vectorSimilarity: bestMatch.vectorSimilarity,
                  reasoning: bestMatch.reasoning,
                  avatar: bestMatch.avatar
                }
              }
            : job
        ));
        console.log(`✅ Updated job ${jobId} with cached candidate`);
        return;
      }
      
      console.log(`🔍 Searching candidates for job ${jobId} (no cache found)...`);
      
      const matches = await optimizedAiMatchingService.searchCandidatesForJob(jobId, {
        vectorTopK: 50,
        aiTopK: 1,
        minVectorSimilarity: 0.3,
        minAiScore: 70,
        language: 'uk'
      });

      console.log(`📊 Found ${matches.length} matches for job ${jobId}`);
      
      // Зберігаємо результати в кеш
      if (matches.length > 0) {
        setCachedResult(jobId, matches);
        console.log(`💾 Cached ${matches.length} results for job ${jobId}`);
      }
      
      const bestMatch = matches[0];
      
      if (bestMatch) {
        // Оновлюємо конкретну вакансію з найкращим кандидатом
        setJobs(prev => prev.map(job => 
          job.jobId === jobId 
            ? {
                ...job,
                bestCandidate: {
                  candidateId: bestMatch.candidateId,
                  candidateName: bestMatch.candidateName || t('candidate'),
                  candidateTitle: bestMatch.candidateTitle || t('developer'),
                  candidateLocation: 'Київ',
                  candidateSkills: ['React', 'TypeScript'],
                  candidateExperience: bestMatch.candidateExperience,
                  candidateField: bestMatch.candidateField,
                  overallScore: bestMatch.overallScore,
                  aiScore: bestMatch.aiScore,
                  vectorSimilarity: bestMatch.vectorSimilarity,
                  reasoning: bestMatch.reasoning,
                  avatar: bestMatch.avatar
                }
              }
            : job
        ));
        console.log(`✅ Updated job ${jobId} with best candidate`);
      } else {
        console.log(`⚠️ No matches found for job ${jobId}`);
        // Показуємо, що кандидат не знайдений
        setJobs(prev => prev.map(job => 
          job.jobId === jobId 
            ? {
                ...job,
                searchError: t('candidateNotFound')
              }
            : job
        ));
      }
    } catch (err: any) {
      console.error('❌ Error searching candidates:', err);
      setError(err.message || 'Failed to search candidates');
      
      // Показуємо помилку для конкретної вакансії
      setJobs(prev => prev.map(job => 
        job.jobId === jobId 
          ? {
              ...job,
              searchError: err.message || t('searchError')
            }
          : job
      ));
    } finally {
      setSearchingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Layout>
      <div className="ai-matching-page">
        {/* Заголовок сторінки */}
        <div className="ai-matching-header">
          <div className="ai-matching-header-content">
            <div className="ai-matching-header-title">
              <Brain size={32} className="ai-matching-header-icon" />
              <div>
                <h1 className="ai-matching-page-title">{t('aiMatchingWithJobs')}</h1>
                <p className="ai-matching-page-subtitle">
                  {t('aiMatchingWithJobsDescription')}
                </p>
              </div>
            </div>
            <div className="ai-matching-header-actions">
              <button
                className="ai-matching-btn ai-matching-btn-primary"
                onClick={handleGenerateEmbeddings}
                disabled={isGeneratingEmbeddings || isLoading}
              >
                {isGeneratingEmbeddings ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                <Brain size={20} />
                )}
                {isGeneratingEmbeddings ? t('generating') : t('generateForAll')}
              </button>
              <button
                className="ai-matching-btn ai-matching-btn-secondary"
                onClick={handleClearCache}
                disabled={isLoading}
                title={t('clearCacheTooltip')}
              >
                <RefreshCw size={20} />
                {t('clearCache')}
              </button>
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
        </div>

        {/* Обробка помилок */}
        {error && (
          <div className="ai-matching-error">
            <div className="ai-matching-error-content">
              <AlertCircle size={20} />
              <p>{error}</p>
              <button 
                className="ai-matching-btn ai-matching-btn-primary"
                onClick={handleRefresh}
              >
                {t('tryAgain')}
              </button>
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="ai-matching-section">
          <div className="ai-matching-stats">
            <div className="ai-matching-stats-header">
              <h3 className="ai-matching-stats-title">
                <Zap size={20} />
                {t('aiMatchingStats')}
              </h3>
              <span className="ai-matching-stats-updated">
                <Clock size={14} />
                {t('updated')}: {new Date().toLocaleString('uk-UA')}
              </span>
            </div>

            <div className="ai-matching-stats-grid">
              <div className="ai-matching-stat-card">
                <div className="ai-matching-stat-icon">
                  <Zap size={24} />
                </div>
                <div className="ai-matching-stat-content">
                  <h4 className="ai-matching-stat-value">{stats.totalJobs}</h4>
                  <p className="ai-matching-stat-label">{t('totalJobs')}</p>
                </div>
              </div>

              <div className="ai-matching-stat-card">
                <div className="ai-matching-stat-icon">
                  <Brain size={24} />
                </div>
                <div className="ai-matching-stat-content">
                  <h4 className="ai-matching-stat-value">{stats.jobsWithEmbeddings}</h4>
                  <p className="ai-matching-stat-label">{t('withEmbeddings')}</p>
                </div>
              </div>

              <div className="ai-matching-stat-card">
                <div className="ai-matching-stat-icon">
                  <User size={24} />
                </div>
                <div className="ai-matching-stat-content">
                  <h4 className="ai-matching-stat-value">{stats.candidatesWithEmbeddings}</h4>
                  <p className="ai-matching-stat-label">{t('candidatesWithEmbeddings')}</p>
                </div>
              </div>

              <div className="ai-matching-stat-card">
                <div className="ai-matching-stat-icon">
                  <Star size={24} />
                </div>
                <div className="ai-matching-stat-content">
                  <h4 className="ai-matching-stat-value">
                    {stats.averageAiScore.toFixed(1)}%
                  </h4>
                  <p className="ai-matching-stat-label">{t('averageAiScore')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Таблиця вакансій */}
        <div className="ai-matching-section">
          <div className="ai-matching-jobs-table">
            <div className="ai-matching-table-header">
              <h2 className="ai-matching-table-title">{t('yourActiveJobs')}</h2>
              <p className="ai-matching-table-subtitle">
                {t('clickToFindCandidate')}
              </p>
            </div>

            {isLoading ? (
              <div className="ai-matching-loading">
                <Loader2 size={32} className="animate-spin" />
                <p>{t('loadingJobs')}</p>
              </div>
            ) : (
              <div className="ai-matching-table-container">
                <table className="ai-matching-table">
                  <thead>
                    <tr>
                      <th>{t('job')}</th>
                      <th>{t('location')}</th>
                      <th>{t('salary')}</th>
                      <th>{t('skills')}</th>
                      <th>{t('bestCandidate')}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.jobId} className="ai-matching-table-row">
                        <td className="ai-matching-job-info">
                          <div className="ai-matching-job-title">{job.jobTitle}</div>
                          <div className="ai-matching-job-description">
                            {job.jobDescription.substring(0, 100)}...
                          </div>
                        </td>
                        <td className="ai-matching-job-location">
                          <MapPin size={16} />
                          {job.jobLocation}
                        </td>
                        <td className="ai-matching-job-salary">
                          {job.jobSalary ? (
                            <>
                        <DollarSign size={16} />
                              {job.jobSalary}
                            </>
                          ) : (
                            t('notSpecified')
                          )}
                        </td>
                        <td className="ai-matching-job-skills">
                          <div className="ai-matching-skills-list">
                            {job.jobSkills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="ai-matching-skill-tag">
                                {skill}
                              </span>
                            ))}
                            {job.jobSkills.length > 3 && (
                              <span className="ai-matching-skill-more">
                                +{job.jobSkills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="ai-matching-candidate-info">
                          {job.bestCandidate ? (
                            <div className="ai-matching-candidate-card">
                              <div className="ai-matching-candidate-header">
                                <div className="ai-matching-candidate-avatar">
                                  {job.bestCandidate.avatar ? (
                                    <img src={job.bestCandidate.avatar} alt="Avatar" />
                                  ) : (
                                    <User size={20} />
                                  )}
                                </div>
                                <div className="ai-matching-candidate-details">
                                  <div className="ai-matching-candidate-name">
                                    <a 
                                      href={`/candidates/${job.bestCandidate.candidateId}`}
                                      className="ai-matching-candidate-link"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {job.bestCandidate.candidateName || t('candidate')}
                                    </a>
                                  </div>
                                  <div className="ai-matching-candidate-title">
                                    {job.bestCandidate.candidateTitle || t('developer')}
                                  </div>
                                  <div className="ai-matching-candidate-experience">
                                    {job.bestCandidate.candidateExperience ? 
                                      `${job.bestCandidate.candidateExperience} ${t('yearsExperience')}` : 
                                      t('experienceNotSpecified')
                                    }
                                  </div>
                                  <div className="ai-matching-candidate-field">
                                    {job.bestCandidate.candidateField || t('fieldNotSpecified')}
                                  </div>
                                </div>
                      </div>
                              <div className="ai-matching-candidate-scores">
                                <div className={`ai-matching-score-badge ${getScoreBadge(job.bestCandidate.overallScore)}`}>
                                  {job.bestCandidate.overallScore.toFixed(0)}%
                                </div>
                                <div className="ai-matching-score-details">
                                  <span className="ai-matching-score-item">
                                    AI: {job.bestCandidate.aiScore.toFixed(0)}%
                            </span>
                                  <span className="ai-matching-score-item">
                                    Vector: {(job.bestCandidate.vectorSimilarity * 100).toFixed(0)}%
                            </span>
                                </div>
                              </div>
                              <div className="ai-matching-candidate-reasoning">
                                {job.bestCandidate.reasoning.substring(0, 80)}...
                              </div>
                            </div>
                          ) : job.searchError ? (
                            <div className="ai-matching-error-state">
                              <XCircle size={16} />
                              <span>{job.searchError}</span>
                            </div>
                          ) : (
                            <div className="ai-matching-no-candidate">
                              <AlertCircle size={16} />
                              <span>{t('candidateNotFound')}</span>
                            </div>
                          )}
                        </td>
                        <td className="ai-matching-actions">
                        <button
                            className="ai-matching-search-btn"
                            onClick={() => handleSearchCandidates(job.jobId)}
                            disabled={searchingJobs.has(job.jobId)}
                          >
                            {searchingJobs.has(job.jobId) ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Search size={16} />
                            )}
                            {searchingJobs.has(job.jobId) ? t('searching') : t('findCandidate')}
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {jobs.length === 0 && (
                  <div className="ai-matching-empty-state">
                    <Brain size={48} />
                    <h3>{t('noActiveJobs')}</h3>
                    <p>{t('createJobToStart')}</p>
                        <button
                      className="ai-matching-btn ai-matching-btn-primary"
                      onClick={() => router.push('/jobs/create')}
                        >
                      {t('createJob')}
                        </button>
                        </div>
                      )}
            </div>
          )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiMatchingPage;