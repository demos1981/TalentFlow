import api from './api';

// Типи для дашборду
export interface DashboardStats {
  activeJobs: number;
  candidates: number;
  applications: number;
  interviews: number;
  views: number;
  offers: number;
  hired: number;
  conversionRate: number;
  // Тренди (зміни порівняно з попереднім періодом)
  activeJobsTrend?: number;
  candidatesTrend?: number;
  applicationsTrend?: number;
  interviewsTrend?: number;
  viewsTrend?: number;
  offersTrend?: number;
  hiredTrend?: number;
  conversionRateTrend?: number;
}

export interface DashboardActivity {
  id: string;
  type: 'application' | 'interview' | 'hired' | 'job' | 'offer' | 'view';
  title: string;
  description: string;
  time: string | { timeValue: number; timeUnit: string };
  status: 'new' | 'scheduled' | 'completed' | 'published' | 'submitted' | 'received' | 'viewed';
  userId?: string;
  jobId?: string;
  candidateId?: string;
  companyId?: string;
}

export interface DashboardJob {
  id: string;
  title: string;
  company: string;
  views: number;
  applications: number;
  status: 'active' | 'paused' | 'closed';
  matchRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardInsight {
  id: string;
  title: string;
  description: string;
  rating: 'high' | 'medium' | 'low';
  action: string;
  category: 'hiring' | 'performance' | 'optimization';
  createdAt: string;
}

export class DashboardService {
  // Отримання статистики дашборду
  static async getDashboardStats(userId: string, role: string): Promise<DashboardStats> {
    try {
      
      const response = await api.get(`/dashboard/stats/${userId}`, {
        params: { role }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('❌ DashboardService: Error fetching dashboard stats:', error);
      // Fallback дані
      return {
        activeJobs: 0,
        candidates: 0,
        applications: 0,
        interviews: 0,
        views: 0,
        offers: 0,
        hired: 0,
        conversionRate: 0,
        activeJobsTrend: 0,
        candidatesTrend: 0,
        applicationsTrend: 0,
        interviewsTrend: 0,
        viewsTrend: 0,
        offersTrend: 0,
        hiredTrend: 0,
        conversionRateTrend: 0
      };
    }
  }

  // Отримання останньої активності
  static async getRecentActivities(userId: string, role: string, limit: number = 10): Promise<DashboardActivity[]> {
    try {
      const response = await api.get(`/dashboard/activities/${userId}`, {
        params: { role, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  // Отримання топ вакансій
  static async getTopJobs(userId: string, role: string, limit: number = 5): Promise<DashboardJob[]> {
    try {
      const response = await api.get(`/dashboard/jobs/${userId}`, {
        params: { role, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top jobs:', error);
      return [];
    }
  }

  // Отримання AI інсайтів
  static async getDashboardInsights(userId: string, role: string): Promise<DashboardInsight[]> {
    try {
      const response = await api.get(`/dashboard/insights/${userId}`, {
        params: { role }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard insights:', error);
      return [];
    }
  }

  // Отримання рекомендацій для кандидатів
  static async getRecommendedJobs(userId: string, limit: number = 5): Promise<DashboardJob[]> {
    try {
      const response = await api.get(`/dashboard/recommendations/${userId}`, {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      return [];
    }
  }

  // Отримання статистики для кандидата
  static async getCandidateStats(userId: string): Promise<{
    viewedJobs: number;
    applications: number;
    interviews: number;
    offers: number;
  }> {
    try {
      const response = await api.get(`/dashboard/candidate-stats/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      return {
        viewedJobs: 0,
        applications: 0,
        interviews: 0,
        offers: 0
      };
    }
  }
}

export default DashboardService;
