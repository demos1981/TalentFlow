import api from './api';

export interface PerformanceMetric {
  id: string;
  kpiType: string;
  metric: string;
  value: number;
  targetValue: number;
  unit: string;
  status: 'excellent' | 'good' | 'below_average' | 'poor';
  trend: 'up' | 'down' | 'stable';
  changeValue: number;
  changePercentage: number;
  period: string;
  description: string;
  measurementDate: string;
  companyId?: string;
  departmentId?: string;
  teamId?: string;
}

export interface PerformanceStats {
  totalMetrics: number;
  averagePerformance: number;
  topPerformingMetrics: Array<{
    metric: string;
    value: number;
    target: number;
    status: string;
  }>;
  underperformingMetrics: Array<{
    metric: string;
    value: number;
    target: number;
    status: string;
  }>;
  kpiAchievement: number;
  trends: Array<{
    period: string;
    value: number;
    target: number;
    trend: string;
  }>;
  comparison: {
    previousPeriod: number;
    previousYear: number;
    benchmark: number;
  };
  recommendations: string[];
  alerts: Array<{
    metric: string;
    message: string;
    severity: string;
  }>;
}

export interface ChartData {
  chartType: string;
  data: Array<{
    label: string;
    value: number;
    target?: number;
    date?: string;
    category?: string;
  }>;
  metadata: {
    metric: string;
    period: string;
    totalRecords: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
  };
}

export interface PerformanceSearchFilters {
  kpiType?: string;
  metric?: string;
  period?: string;
  companyId?: string;
  departmentId?: string;
  teamId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  trend?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PerformanceStatsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  companyId?: string;
  departmentId?: string;
  teamId?: string;
}

export interface ChartDataFilters {
  chartType: string;
  metric: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  departmentId?: string;
  teamId?: string;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

class PerformanceService {
  /**
   * Get KPI Metrics
   */
  async getKPIMetrics(filters?: PerformanceSearchFilters): Promise<{
    metrics: PerformanceMetric[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await api.get('/performance/metrics', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Get Performance Statistics
   */
  async getPerformanceStats(filters?: PerformanceStatsFilters): Promise<PerformanceStats> {
    const response = await api.get('/performance/stats', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Get Chart Data
   */
  async getChartData(filters: ChartDataFilters): Promise<ChartData> {
    const response = await api.get('/performance/charts', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Get Comparison Data
   */
  async getComparisonData(filters: {
    metric: string;
    currentStartDate: string;
    currentEndDate: string;
    compareStartDate: string;
    compareEndDate: string;
    companyId?: string;
    departmentId?: string;
    teamId?: string;
  }): Promise<{
    current: { value: number; period: string; records: number };
    comparison: { value: number; period: string; records: number };
    change: { absolute: number; percentage: number; direction: 'up' | 'down' | 'same' };
    significance: 'high' | 'medium' | 'low';
  }> {
    const response = await api.get('/performance/comparison', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Get Trends Data
   */
  async getTrendsData(filters: {
    metric: string;
    period: string;
    startDate: string;
    endDate: string;
    companyId?: string;
    departmentId?: string;
    teamId?: string;
    forecastPeriods?: number;
  }): Promise<{
    metric: string;
    period: string;
    trends: any[];
    analysis: any;
    forecast: any[];
  }> {
    const response = await api.get('/performance/trends', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Create KPI Target
   */
  async createKPITarget(data: {
    metric: string;
    targetValue: number;
    unit: string;
    period: string;
    startDate: string;
    endDate: string;
    companyId?: string;
    departmentId?: string;
    teamId?: string;
    description?: string;
  }): Promise<any> {
    const response = await api.post('/performance/targets', data);
    return response.data.data;
  }

  /**
   * Update KPI Target
   */
  async updateKPITarget(targetId: string, data: Partial<{
    targetValue: number;
    unit: string;
    period: string;
    startDate: string;
    endDate: string;
    description: string;
  }>): Promise<any> {
    const response = await api.put(`/performance/targets/${targetId}`, data);
    return response.data.data;
  }

  /**
   * Delete KPI Target
   */
  async deleteKPITarget(targetId: string): Promise<boolean> {
    const response = await api.delete(`/performance/targets/${targetId}`);
    return response.data.success;
  }

  /**
   * Export Performance Report
   */
  async exportReport(filters: {
    format: 'pdf' | 'xlsx' | 'csv';
    startDate?: string;
    endDate?: string;
    metrics?: string[];
  }): Promise<Blob> {
    const response = await api.get('/performance/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const performanceService = new PerformanceService();
