import api from './api';

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  color: string;
  description: string;
}

export interface AnalyticsChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string;
    }>;
  };
  options?: any;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
  dataPoints: number;
  status: 'active' | 'draft' | 'archived';
}

export interface AnalyticsStats {
  overview: {
    totalMetrics: number;
    totalCharts: number;
    totalReports: number;
    lastUpdated: string;
  };
  categories: Record<string, number>;
  trends: {
    positive: number;
    negative: number;
    stable: number;
  };
}

export interface ReportDetails {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  data: {
    metrics: Array<{
      name: string;
      value: number;
      change: number;
    }>;
    charts: Array<{
      type: string;
      title: string;
    }>;
  };
  insights: string[];
  recommendations: string[];
}

export interface AnalyticsTrends {
  metric: string;
  period: string;
  data: {
    current: {
      value: number;
      trend: string;
      change: number;
    };
    previous: {
      value: number;
      trend: string;
      change: number;
    };
    forecast: {
      value: number;
      trend: string;
      confidence: number;
    };
  };
  insights: string[];
}

export class AnalyticsService {
  // Отримання ключових метрик
  static async getKeyMetrics(): Promise<AnalyticsMetric[]> {
    const response = await api.get('/analytics/metrics');
    return response.data.data;
  }

  // Отримання реальної аналітики
  static async getRealAnalytics(period: string = 'month', category?: string, companyId?: string): Promise<any> {
    const params: any = { period };
    if (category) params.category = category;
    if (companyId) params.companyId = companyId;
    
    console.log('📊 AnalyticsService.getRealAnalytics called with:', { period, category, companyId });
    
    const response = await api.get('/analytics/real', { params });
    console.log('📊 AnalyticsService.getRealAnalytics response:', response.data);
    return response.data.data;
  }

  // Отримання даних для графіків
  static async getChartData(chartType?: string, period?: string): Promise<any> {
    const response = await api.get('/analytics/charts', {
      params: { chartType, period }
    });
    return response.data.data;
  }

  // Отримання аналітичних звітів
  static async getAnalyticsReports(): Promise<AnalyticsReport[]> {
    const response = await api.get('/analytics/reports');
    return response.data.data;
  }

  // Отримання статистики аналітики
  static async getAnalyticsStats(): Promise<AnalyticsStats> {
    const response = await api.get('/analytics/stats');
    return response.data.data;
  }

  // Створення нового звіту
  static async createReport(name: string, description: string, category: string, type: string): Promise<any> {
    const response = await api.post('/analytics/reports', {
      name,
      description,
      category,
      type
    });
    return response.data.data;
  }

  // Отримання детального звіту
  static async getReportDetails(reportId: string): Promise<ReportDetails> {
    const response = await api.get(`/analytics/reports/${reportId}`);
    return response.data.data;
  }

  // Експорт аналітичних даних
  static async exportAnalytics(format?: string, period?: string, category?: string): Promise<any> {
    const response = await api.post('/analytics/export', {
      format,
      period,
      category
    });
    return response.data.data;
  }

  // Отримання трендів аналітики
  static async getAnalyticsTrends(metric?: string, period?: string): Promise<AnalyticsTrends> {
    const response = await api.get('/analytics/trends', {
      params: { metric, period }
    });
    return response.data.data;
  }
}

export default AnalyticsService;




