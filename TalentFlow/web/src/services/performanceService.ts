import { apiClient } from '../utils/apiClient';

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  category: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  period: string;
  description: string;
}

export interface PerformanceData {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  color: string;
}

export interface PerformanceStats {
  overview: {
    totalApplications: number;
    totalInterviews: number;
    totalHires: number;
    totalRejections: number;
    averageTimeToHire: number;
    averageCostPerHire: number;
  };
  trends: {
    applications: { current: number; previous: number; change: number };
    interviews: { current: number; previous: number; change: number };
    hires: { current: number; previous: number; change: number };
    timeToHire: { current: number; previous: number; change: number };
    costPerHire: { current: number; previous: number; change: number };
  };
  categories: Record<string, number>;
}

export interface ChartData {
  hiringTrend: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }>;
  };
  sourceDistribution: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
    }>;
  };
  timeToHireByDepartment: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }>;
  };
  costPerHireTrend: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }>;
  };
}

export interface DetailedReport {
  period: string;
  category: string;
  summary: {
    totalMetrics: number;
    excellent: number;
    good: number;
    warning: number;
    critical: number;
  };
  details: Record<string, {
    metrics: number;
    averageScore: number;
    trend: string;
    recommendations: string[];
  }>;
  insights: string[];
}

export interface ComparisonData {
  metric: string;
  periods: string[];
  data: Record<string, {
    value: number;
    target: number;
    status: string;
  }>;
  trends: {
    currentVsPrevious: number;
    currentVsYearAgo: number;
    improvement: boolean;
  };
}

export class PerformanceService {
  // Отримання KPI метрик
  static async getKPIMetrics(): Promise<KPIMetric[]> {
    const response = await apiClient.get('/performance/kpi');
    return response.data.data;
  }

  // Отримання даних продуктивності
  static async getPerformanceData(): Promise<PerformanceData[]> {
    const response = await apiClient.get('/performance/data');
    return response.data.data;
  }

  // Отримання статистики продуктивності
  static async getPerformanceStats(): Promise<PerformanceStats> {
    const response = await apiClient.get('/performance/stats');
    return response.data.data;
  }

  // Отримання даних для графіків
  static async getChartData(chartType?: string, period?: string): Promise<ChartData> {
    const response = await apiClient.get('/performance/charts', {
      params: { chartType, period }
    });
    return response.data.data;
  }

  // Отримання детального звіту
  static async getDetailedReport(period?: string, category?: string): Promise<DetailedReport> {
    const response = await apiClient.get('/performance/report', {
      params: { period, category }
    });
    return response.data.data;
  }

  // Оновлення цілей KPI
  static async updateKPITargets(kpiId: string, newTarget: number): Promise<{ id: string; target: number; updatedAt: string }> {
    const response = await apiClient.put('/performance/kpi/targets', {
      kpiId,
      newTarget
    });
    return response.data.data;
  }

  // Експорт звіту
  static async exportReport(format?: string, period?: string, category?: string): Promise<any> {
    const response = await apiClient.post('/performance/export', {
      format,
      period,
      category
    });
    return response.data.data;
  }

  // Отримання порівняння з попередніми періодами
  static async getComparisonData(metric?: string, periods?: string[]): Promise<ComparisonData> {
    const response = await apiClient.get('/performance/comparison', {
      params: { metric, periods }
    });
    return response.data.data;
  }
}

export default PerformanceService;


