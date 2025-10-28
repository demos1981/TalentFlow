import { apiClient } from '../utils/apiClient';

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
  async getAIInsights(request: AIInsightRequest): Promise<AIInsight[]> {
    try {
      const response = await apiClient.post('/ai/insights', request);
      return response.data.insights || [];
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Повертаємо fallback інсайти якщо AI сервіс недоступний
      return this.getFallbackInsights();
    }
  }

  /**
   * Генерує інсайти на основі локальних даних
   */
  async generateLocalInsights(userId: string): Promise<AIInsight[]> {
    try {
      // Отримуємо реальні дані користувача
      const [jobsResponse, candidatesResponse, applicationsResponse] = await Promise.all([
        apiClient.get('/jobs/employer/my-jobs').catch(() => ({ data: { jobs: [] } })),
        apiClient.get('/candidates/search?limit=100').catch(() => ({ data: { candidates: [] } })),
        apiClient.get('/applications/employer/my-applications').catch(() => ({ data: { applications: [] } }))
      ]);

      const jobs = jobsResponse.data?.jobs || [];
      const candidates = candidatesResponse.data?.candidates || [];
      const applications = applicationsResponse.data?.applications || [];

      console.log('📊 AI Analysis Data:', { 
        jobsCount: jobs.length, 
        candidatesCount: candidates.length, 
        applicationsCount: applications.length 
      });

      // Детальне логування API відповідей
      console.log('🔍 Jobs API Response:', jobsResponse.data);
      console.log('🔍 Candidates API Response:', candidatesResponse.data);
      console.log('🔍 Applications API Response:', applicationsResponse.data);

      // Аналізуємо дані та генеруємо інсайти
      const insights: AIInsight[] = [];

      // Аналіз вакансій
      if (jobs.length > 0) {
        const activeJobs = jobs.filter(job => job.status === 'active');
        const closedJobs = jobs.filter(job => job.status === 'closed');
        
        if (activeJobs.length > 0) {
          const avgSalary = activeJobs.reduce((sum, job) => sum + (job.salary?.max || 0), 0) / activeJobs.length;
          
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
          const successRate = (closedJobs.filter(job => job.status === 'hired').length / closedJobs.length) * 100;
          
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
        const recentApplications = applications.filter(app => {
          const appDate = new Date(app.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return appDate > weekAgo;
        });

        if (recentApplications.length > 0) {
          insights.push({
            id: 'applications-trend-1',
            title: 'Активність кандидатів',
            description: `За останній тиждень: ${recentApplications.length} нових заявок`,
            rating: recentApplications.length > 10 ? 'high' : recentApplications.length > 5 ? 'medium' : 'low',
            action: 'Переглянути заявки',
            confidence: 0.9,
            dataPoints: [`Нових заявок: ${recentApplications.length}`, `Період: останній тиждень`],
            category: 'hiring',
            impact: 'positive',
            timeframe: 'immediate'
          });
        }
      }

      // Ринкові інсайти (на основі даних користувача)
      if (jobs.length > 0) {
        const marketInsight = this.generateMarketInsight(jobs);
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
            title: 'Дані для аналізу відсутні',
            description: 'Створіть вакансії та починайте найм для отримання AI інсайтів',
            rating: 'low',
            action: 'Створити першу вакансію',
            confidence: 0.5,
            dataPoints: ['Немає вакансій', 'Немає кандидатів'],
            category: 'optimization',
            impact: 'neutral',
            timeframe: 'immediate'
          },
          {
            id: 'demo-2',
            title: 'Рекомендації для початку',
            description: 'Створіть 3-5 вакансій різних рівнів для кращого аналізу ринку',
            rating: 'medium',
            action: 'Створити вакансії',
            confidence: 0.8,
            dataPoints: ['Мінімум 3 вакансії', 'Різні рівні досвіду'],
            category: 'hiring',
            impact: 'positive',
            timeframe: 'short_term'
          },
          {
            id: 'demo-3',
            title: 'Налаштування пошуку кандидатів',
            description: 'Використовуйте фільтри та AI matching для пошуку ідеальних кандидатів',
            rating: 'medium',
            action: 'Налаштувати пошук',
            confidence: 0.7,
            dataPoints: ['AI matching', 'Фільтри пошуку'],
            category: 'candidates',
            impact: 'positive',
            timeframe: 'short_term'
          }
        );
      }

      return insights.slice(0, 5); // Повертаємо топ 5 інсайтів
    } catch (error) {
      console.error('Error generating local insights:', error);
      return this.getFallbackInsights();
    }
  }

  /**
   * Аналізує топ навички серед кандидатів
   */
  private analyzeTopSkills(candidates: any[]): string[] {
    const skillCount: { [key: string]: number } = {};
    
    candidates.forEach(candidate => {
      if (candidate.skills && Array.isArray(candidate.skills)) {
        candidate.skills.forEach((skill: string) => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
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
  private analyzeExperienceLevels(candidates: any[]): { average: number; min: number; max: number } {
    const experiences = candidates
      .map(c => c.yearsOfExperience || c.experience || 0)
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
  private generateMarketInsight(jobs: any[]): AIInsight | null {
    const activeJobs = jobs.filter(job => job.status === 'active');
    if (activeJobs.length === 0) return null;

    const avgSalary = activeJobs.reduce((sum, job) => sum + (job.salary?.max || 0), 0) / activeJobs.length;
    const jobTypes = activeJobs.map(job => job.type || 'full-time');
    const mostCommonType = jobTypes.sort((a, b) => 
      jobTypes.filter(v => v === a).length - jobTypes.filter(v => v === b).length
    ).pop();

    return {
      id: 'market-analysis-1',
      title: 'Ринковий аналіз ваших вакансій',
      description: `Середня зарплата: ${Math.round(avgSalary)}$, популярний тип: ${mostCommonType}`,
      rating: 'medium',
      action: 'Порівняти з ринком',
      confidence: 0.7,
      dataPoints: [`Середня зарплата: ${Math.round(avgSalary)}$`, `Тип вакансій: ${mostCommonType}`],
      category: 'market',
      impact: 'neutral',
      timeframe: 'short_term'
    };
  }

  /**
   * Fallback інсайти якщо AI сервіс недоступний
   */
  private getFallbackInsights(): AIInsight[] {
    return [
      {
        id: 'fallback-1',
        title: 'Аналіз даних недоступний',
        description: 'AI сервіс тимчасово недоступний. Спробуйте пізніше.',
        rating: 'low',
        action: 'Оновити сторінку',
        confidence: 0.1,
        dataPoints: ['AI сервіс недоступний'],
        category: 'optimization',
        impact: 'neutral',
        timeframe: 'immediate'
      }
    ];
  }
}

export const aiInsightsService = new AIInsightsService();
