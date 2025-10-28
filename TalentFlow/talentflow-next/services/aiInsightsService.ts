import api from './api';
import { Job, CandidateProfile, Application } from '../types';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  rating: 'high' | 'medium' | 'low';
  action: string;
  confidence: number;
  dataPoints: string[];
  category: 'market' | 'hiring' | 'candidates' | 'performance' | 'optimization';
  impact: 'positive' | 'negative' | 'neutral';
  timeframe: 'immediate' | 'short_term' | 'long_term';
}

export interface AIInsightRequest {
  userId: string;
  companyId?: string;
  includeMarketData?: boolean;
  includeHiringMetrics?: boolean;
  includeCandidateAnalysis?: boolean;
}

class AIInsightsService {
  /**
   * Отримує AI інсайти на основі реальних даних користувача
   */
  async getAIInsights(request: AIInsightRequest, t: (key: any, params?: Record<string, any>) => string): Promise<AIInsight[]> {
    try {
      // ТИМЧАСОВО ВІДКЛЮЧЕНО: API виклик викликає 401 помилку
      // const response = await api.post('/ai/insights', request);
      // return response.data.insights || [];
      
      // Використовуємо локальні інсайти
      return this.generateLocalInsights(request.userId, t);
    } catch (error) {
      // Повертаємо fallback інсайти якщо AI сервіс недоступний
      return this.getFallbackInsights(t);
    }
  }

  /**
   * Генерує інсайти на основі локальних даних
   */
  async generateLocalInsights(userId: string, t: (key: any, params?: Record<string, any>) => string): Promise<AIInsight[]> {
    try {
      // ТИМЧАСОВО ВІДКЛЮЧЕНО: API виклики викликають 401 помилки
      // const [jobsResponse, candidatesResponse, applicationsResponse] = await Promise.all([
      //   api.get('/jobs/employer/my-jobs').catch(() => ({ data: { jobs: [] } })),
      //   api.get('/candidates/search?limit=100').catch(() => ({ data: { candidates: [] } })),
      //   api.get('/applications/employer/my-applications').catch(() => ({ data: { applications: [] } }))
      // ]);

      // Використовуємо пусті дані для демонстрації
      const jobsResponse = { data: { jobs: [] } };
      const candidatesResponse = { data: { candidates: [] } };
      const applicationsResponse = { data: { applications: [] } };

      const jobs = jobsResponse.data?.jobs || [];
      const candidates = candidatesResponse.data?.candidates || [];
      const applications = applicationsResponse.data?.applications || [];

      // AI Analysis Data available for processing

      // Аналізуємо дані та генеруємо інсайти
      const insights: AIInsight[] = [];

      // Аналіз вакансій
      if (jobs.length > 0) {
        const activeJobs = jobs.filter((job: Job) => job.status === 'active');
        const closedJobs = jobs.filter((job: Job) => job.status === 'closed');
        
        if (activeJobs.length > 0) {
          const avgSalary = activeJobs.reduce((sum: number, job: Job) => sum + (job.salary_max || 0), 0) / activeJobs.length;
          
          insights.push({
            id: 'job-market-1',
            title: 'Аналіз активних вакансій',
            description: `У вас ${activeJobs.length} активних вакансій з середньою зарплатою ${Math.round(avgSalary)}$`,
            rating: activeJobs.length > 5 ? 'high' : activeJobs.length > 2 ? 'medium' : 'low',
            action: 'Переглянути вакансії',
            confidence: 0.85,
            dataPoints: [`Активних вакансій: ${activeJobs.length}`, `Середня зарплата: ${Math.round(avgSalary)}$`],
            category: 'hiring',
            impact: 'positive',
            timeframe: 'immediate'
          });
        }

        if (closedJobs.length > 0) {
          // Calculate success rate based on applications with 'hired' status for these jobs
          const hiredApplications = applications.filter((app: Application) => 
            closedJobs.some((job: Job) => job.id === app.job_id) && app.status === 'hired'
          );
          const successRate = (hiredApplications.length / closedJobs.length) * 100;
          
          insights.push({
            id: 'hiring-success-1',
            title: 'Ефективність найму',
            description: `Успішність найму: ${Math.round(successRate)}% (${closedJobs.length} закритих вакансій)`,
            rating: successRate > 70 ? 'high' : successRate > 50 ? 'medium' : 'low',
            action: 'Аналізувати процес найму',
            confidence: 0.9,
            dataPoints: [`Закритих вакансій: ${closedJobs.length}`, `Успішність: ${Math.round(successRate)}%`],
            category: 'performance',
            impact: successRate > 70 ? 'positive' : 'negative',
            timeframe: 'short_term'
          });
        }
      }

      // Аналіз кандидатів
      if (candidates.length > 0) {
        const topSkills = this.analyzeTopSkills(candidates);
        const experienceLevels = this.analyzeExperienceLevels(candidates);
        
        insights.push({
          id: 'candidate-analysis-1',
          title: 'Популярні навички кандидатів',
          description: `Топ навички: ${topSkills.slice(0, 3).join(', ')}`,
          rating: 'medium',
          action: 'Оновити вимоги до вакансій',
          confidence: 0.8,
          dataPoints: [`Проаналізовано кандидатів: ${candidates.length}`, `Топ навички: ${topSkills.slice(0, 5).join(', ')}`],
          category: 'candidates',
          impact: 'neutral',
          timeframe: 'short_term'
        });

        insights.push({
          id: 'candidate-analysis-2',
          title: 'Розподіл за досвідом',
          description: `Середній досвід: ${Math.round(experienceLevels.average)} років`,
          rating: 'medium',
          action: 'Налаштувати фільтри пошуку',
          confidence: 0.75,
          dataPoints: [`Середній досвід: ${Math.round(experienceLevels.average)} років`, `Діапазон: ${experienceLevels.min}-${experienceLevels.max} років`],
          category: 'candidates',
          impact: 'neutral',
          timeframe: 'short_term'
        });
      }

      // Аналіз заявок
      if (applications.length > 0) {
        const recentApplications = applications.filter((app: Application) => {
          const appDate = new Date(app.applied_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return appDate > weekAgo;
        });

        if (recentApplications.length > 0) {
          insights.push({
            id: 'applications-trend-1',
            title: t('candidateActivity'),
            description: t('candidateActivityDescription', { count: recentApplications.length }),
            rating: recentApplications.length > 10 ? 'high' : recentApplications.length > 5 ? 'medium' : 'low',
            action: t('viewApplications'),
            confidence: 0.9,
            dataPoints: [`${t('newApplications')}: ${recentApplications.length}`, t('periodLastWeek')],
            category: 'hiring',
            impact: 'positive',
            timeframe: 'immediate'
          });
        }
      }

      // Ринкові інсайти (на основі даних користувача)
      if (jobs.length > 0) {
        const marketInsight = this.generateMarketInsight(jobs, t);
        if (marketInsight) {
          insights.push(marketInsight);
        }
      }

      // Якщо немає інсайтів, показуємо базові
      if (insights.length === 0) {
        // Генеруємо тестові інсайти для демонстрації
        insights.push(
          {
            id: 'demo-1',
            title: t('noDataForAnalysis'),
            description: t('noDataForAnalysisDescription'),
            rating: 'low',
            action: t('createFirstVacancy'),
            confidence: 0.5,
            dataPoints: [t('noVacancies'), t('noCandidates')],
            category: 'optimization',
            impact: 'neutral',
            timeframe: 'immediate'
          },
          {
            id: 'demo-2',
            title: t('gettingStartedRecommendations'),
            description: t('gettingStartedRecommendationsDescription'),
            rating: 'medium',
            action: t('createVacancies'),
            confidence: 0.8,
            dataPoints: [t('minimum3Vacancies'), t('differentExperienceLevels')],
            category: 'hiring',
            impact: 'positive',
            timeframe: 'short_term'
          },
          {
            id: 'demo-3',
            title: t('candidateSearchSettings'),
            description: t('candidateSearchSettingsDescription'),
            rating: 'medium',
            action: t('configureSearch'),
            confidence: 0.7,
            dataPoints: [t('aiMatching'), t('searchFilters')],
            category: 'candidates',
            impact: 'positive',
            timeframe: 'short_term'
          }
        );
      }

      return insights.slice(0, 5); // Повертаємо топ 5 інсайтів
    } catch (error) {
      return this.getFallbackInsights(t);
    }
  }

  /**
   * Аналізує топ навички серед кандидатів
   */
  private analyzeTopSkills(candidates: CandidateProfile[]): string[] {
    const skillCount: { [key: string]: number } = {};
    
    candidates.forEach(candidate => {
      if (candidate.skills && Array.isArray(candidate.skills)) {
        candidate.skills.forEach((skill: any) => {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          skillCount[skillName] = (skillCount[skillName] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCount)
      .sort(([,a], [,b]) => b - a)
      .map(([skill]) => skill);
  }

  /**
   * Аналізує рівень досвіду кандидатів
   */
  private analyzeExperienceLevels(candidates: CandidateProfile[]): { average: number; min: number; max: number } {
    const experiences = candidates
      .map(c => c.experience_years || 0)
      .filter(exp => exp > 0);

    if (experiences.length === 0) {
      return { average: 0, min: 0, max: 0 };
    }

    return {
      average: experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length,
      min: Math.min(...experiences),
      max: Math.max(...experiences)
    };
  }

  /**
   * Генерує ринковий інсайт на основі вакансій
   */
  private generateMarketInsight(jobs: Job[], t: (key: any, params?: Record<string, any>) => string): AIInsight | null {
    const activeJobs = jobs.filter((job: Job) => job.status === 'active');
    if (activeJobs.length === 0) return null;

    const avgSalary = activeJobs.reduce((sum: number, job: Job) => sum + (job.salary_max || 0), 0) / activeJobs.length;
    const jobTypes = activeJobs.map((job: Job) => job.employment_type || 'full-time');
    const mostCommonType = jobTypes.sort((a, b) => 
      jobTypes.filter(v => v === a).length - jobTypes.filter(v => v === b).length
    ).pop();

    return {
      id: 'market-analysis-1',
      title: t('marketAnalysis'),
      description: t('marketAnalysisDescription', { salary: Math.round(avgSalary), type: mostCommonType }),
      rating: 'medium',
      action: t('compareWithMarket'),
      confidence: 0.7,
      dataPoints: [`${t('averageSalary')}: ${Math.round(avgSalary)}$`, `${t('jobTypes')}: ${mostCommonType}`],
      category: 'market',
      impact: 'neutral',
      timeframe: 'short_term'
    };
  }

  /**
   * Fallback інсайти якщо AI сервіс недоступний
   */
  private getFallbackInsights(t: (key: any, params?: Record<string, any>) => string): AIInsight[] {
    return [
      {
        id: 'fallback-1',
        title: t('analysisUnavailable'),
        description: t('analysisUnavailableDescription'),
        rating: 'low',
        action: t('refreshPage'),
        confidence: 0.1,
        dataPoints: [t('aiServiceUnavailable')],
        category: 'optimization',
        impact: 'neutral',
        timeframe: 'immediate'
      }
    ];
  }
}

export const aiInsightsService = new AIInsightsService();
