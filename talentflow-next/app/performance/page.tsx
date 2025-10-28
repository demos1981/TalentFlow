'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { performanceTranslations } from '../../locales/features/performance';
import Layout from '../../components/Layout/Layout';
import { TrendingUp, Target, BarChart3, Users, Clock, Calendar, DollarSign, TrendingDown, ArrowUp, ArrowDown, Minus, Download, RefreshCw, Eye, EyeOff, Settings, PieChart, Zap, Star, BarChart, LineChart, UserCheck, UserX } from 'lucide-react';
import { performanceService, PerformanceMetric, PerformanceStats } from '../../services/performanceService';
import './performance.css';

interface PerformanceData {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  icon: React.ReactNode;
  color: string;
}

const PerformancePage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data from API
  const [kpiMetrics, setKpiMetrics] = useState<PerformanceMetric[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  
  const { user } = useAuthStore();
  const { currentLanguage } = useLanguageStore();
  const router = useRouter();

  // Get translation function
  const t = (key: string) => {
    return (performanceTranslations as any)[currentLanguage]?.[key] || (performanceTranslations as any)['en']?.[key] || key;
  };

  const categories = [
    { id: 'all', name: t('allCategories'), icon: <BarChart3 size={16} /> },
    { id: 'recruitment', name: t('recruitment'), icon: <Users size={16} /> },
    { id: 'experience', name: t('experience'), icon: <Star size={16} /> },
    { id: 'retention', name: t('retention'), icon: <Target size={16} /> },
    { id: 'efficiency', name: t('efficiency'), icon: <Zap size={16} /> },
    { id: 'cost', name: t('cost'), icon: <DollarSign size={16} /> }
  ];

  const periods = [
    { id: 'weekly', name: t('week') },
    { id: 'monthly', name: t('month') },
    { id: 'quarterly', name: t('quarter') },
    { id: 'yearly', name: t('year') }
  ];

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on selected period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case 'weekly':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarterly':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'yearly':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch KPI metrics
      const metricsResponse = await performanceService.getKPIMetrics({
        period: selectedPeriod,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        sortBy: 'measurementDate',
        sortOrder: 'DESC'
      });

      console.log('Performance period changed:', selectedPeriod);
      console.log('Date range:', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);
      console.log('KPI metrics:', metricsResponse.metrics);

      setKpiMetrics(metricsResponse.metrics || []);

      // Fetch performance stats
      const statsResponse = await performanceService.getPerformanceStats({
        period: selectedPeriod as any,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      console.log('Performance stats:', statsResponse);
      setStats(statsResponse);

      // Transform KPI metrics into performance data cards
      if (metricsResponse.metrics && metricsResponse.metrics.length > 0) {
        // Знаходимо відповідні метрики
        const timeToHireMetric = metricsResponse.metrics.find(m => m.metric === 'TIME_TO_HIRE');
        const qualityOfHireMetric = metricsResponse.metrics.find(m => m.metric === 'QUALITY_OF_HIRE');
        const interviewEfficiencyMetric = metricsResponse.metrics.find(m => m.metric === 'INTERVIEW_EFFICIENCY');
        const costPerHireMetric = metricsResponse.metrics.find(m => m.metric === 'COST_PER_HIRE');
        const sourceEffectivenessMetric = metricsResponse.metrics.find(m => m.metric === 'SOURCE_EFFECTIVENESS');
        const candidateExperienceMetric = metricsResponse.metrics.find(m => m.metric === 'CANDIDATE_EXPERIENCE');
        const employeeRetentionMetric = metricsResponse.metrics.find(m => m.metric === 'EMPLOYEE_RETENTION');
        
        const newPerformanceData: PerformanceData[] = [
    {
      id: 'applications',
            name: t('applications'),
            value: statsResponse?.totalMetrics || 0,
            previousValue: statsResponse?.totalMetrics || 0,
            change: 0,
            changePercent: 0,
      trend: statsResponse?.totalMetrics > 0 ? 'up' : 'stable',
      category: 'recruitment',
      icon: <Users size={24} />,
      color: '#3b82f6'
    },
    {
      id: 'interviews',
            name: t('interviews'),
            value: Math.round((statsResponse?.totalMetrics || 0) * 0.3),
            previousValue: Math.round((statsResponse?.totalMetrics || 0) * 0.3),
            change: 0,
            changePercent: 0,
      trend: statsResponse?.totalMetrics > 0 ? 'up' : 'stable',
      category: 'recruitment',
      icon: <Calendar size={24} />,
      color: '#10b981'
    },
    {
      id: 'hires',
            name: t('hires'),
            value: Math.round((statsResponse?.totalMetrics || 0) * 0.08),
            previousValue: Math.round((statsResponse?.totalMetrics || 0) * 0.08),
            change: 0,
            changePercent: 0,
      trend: statsResponse?.totalMetrics > 0 ? 'up' : 'stable',
      category: 'recruitment',
      icon: <UserCheck size={24} />,
      color: '#f59e0b'
    },
    {
      id: 'rejections',
            name: t('rejections'),
            value: Math.round((statsResponse?.totalMetrics || 0) * 0.15),
            previousValue: Math.round((statsResponse?.totalMetrics || 0) * 0.15),
            change: 0,
            changePercent: 0,
      trend: statsResponse?.totalMetrics > 0 ? 'up' : 'stable',
      category: 'recruitment',
      icon: <UserX size={24} />,
      color: '#ef4444'
    },
    {
      id: 'time-to-hire-avg',
            name: t('timeToHireAvg'),
      value: timeToHireMetric?.value || 0,
      previousValue: timeToHireMetric ? timeToHireMetric.value + timeToHireMetric.changeValue : 0,
      change: timeToHireMetric?.changeValue || 0,
      changePercent: timeToHireMetric?.changePercentage || 0,
      trend: timeToHireMetric?.trend || 'stable',
      category: 'efficiency',
      icon: <Clock size={24} />,
      color: '#8b5cf6'
    },
    {
      id: 'cost-per-hire-avg',
            name: t('costPerHireAvg'),
      value: costPerHireMetric?.value || 0,
      previousValue: costPerHireMetric ? costPerHireMetric.value + costPerHireMetric.changeValue : 0,
      change: costPerHireMetric?.changeValue || 0,
      changePercent: costPerHireMetric?.changePercentage || 0,
      trend: costPerHireMetric?.trend || 'stable',
      category: 'cost',
      icon: <DollarSign size={24} />,
      color: '#06b6d4'
    },
    {
      id: 'candidate-experience',
            name: t('candidateExperience'),
      value: candidateExperienceMetric?.value || 0,
      previousValue: candidateExperienceMetric ? candidateExperienceMetric.value + candidateExperienceMetric.changeValue : 0,
      change: candidateExperienceMetric?.changeValue || 0,
      changePercent: candidateExperienceMetric?.changePercentage || 0,
      trend: candidateExperienceMetric?.trend || 'stable',
      category: 'experience',
      icon: <Star size={24} />,
      color: '#f97316'
    },
    {
      id: 'employee-retention',
            name: t('employeeRetention'),
      value: employeeRetentionMetric?.value || 0,
      previousValue: employeeRetentionMetric ? employeeRetentionMetric.value + employeeRetentionMetric.changeValue : 0,
      change: employeeRetentionMetric?.changeValue || 0,
      changePercent: employeeRetentionMetric?.changePercentage || 0,
      trend: employeeRetentionMetric?.trend || 'stable',
      category: 'retention',
      icon: <Target size={24} />,
      color: '#22c55e'
    }
  ];
        setPerformanceData(newPerformanceData);
      } else {
        // Якщо немає метрик, встановлюємо порожні дані
        setPerformanceData([]);
      }

    } catch (err: any) {
      console.error('Error loading performance data:', err);
      setError(err.message || t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, currentLanguage]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // Filter performance data cards by category
  const filteredPerformanceData = performanceData.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  console.log('Selected category:', selectedCategory);
  console.log('Performance data:', performanceData);
  console.log('Filtered performance data:', filteredPerformanceData);

  const filteredKPIs = kpiMetrics.filter(kpi => {
    if (selectedCategory === 'all') return true;
    // Map KPI types to categories
    const kpiCategoryMap: Record<string, string> = {
      'TIME_TO_HIRE': 'recruitment',
      'COST_PER_HIRE': 'cost',
      'QUALITY_OF_HIRE': 'recruitment',
      'CANDIDATE_EXPERIENCE': 'experience',
      'OFFER_ACCEPTANCE_RATE': 'recruitment',
      'SOURCE_EFFECTIVENESS': 'efficiency',
      'TIME_TO_FILL': 'efficiency',
      'EMPLOYEE_RETENTION': 'retention'
    };
    return kpiCategoryMap[kpi.kpiType] === selectedCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'status-excellent';
      case 'good':
        return 'status-good';
      case 'below_average':
        return 'status-warning';
      case 'poor':
        return 'status-critical';
      default:
        return 'status-unknown';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return t('excellent');
      case 'good':
        return t('good');
      case 'below_average':
        return t('warning');
      case 'poor':
        return t('critical');
      default:
        return status;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="trend-up" />;
      case 'down':
        return <TrendingDown size={16} className="trend-down" />;
      case 'stable':
        return <Minus size={16} className="trend-stable" />;
      default:
        return <Minus size={16} className="trend-stable" />;
    }
  };

  const getChangeIcon = (changeValue: number) => {
    if (changeValue > 0) return <ArrowUp size={16} className="change-positive" />;
    if (changeValue < 0) return <ArrowDown size={16} className="change-negative" />;
        return <Minus size={16} className="change-neutral" />;
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'progress-excellent';
    if (percentage >= 80) return 'progress-good';
    if (percentage >= 60) return 'progress-warning';
    return 'progress-critical';
  };

  const getProgressWidth = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    return Math.min(percentage, 100);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleExport = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);

      const blob = await performanceService.exportReport({
        format: 'pdf',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="performance-page">
        <div className="performance-header">
          <div className="performance-header-content">
            <div className="performance-header-title">
              <Target size={32} className="performance-header-icon" />
              <div>
                <h1 className="performance-page-title">{t('performance')}</h1>
                <p className="performance-page-subtitle">
                  {t('performanceDescription')}
                </p>
              </div>
            </div>
            <div className="performance-header-actions">
              <button className="performance-action-btn" onClick={handleRefresh} disabled={loading}>
                <RefreshCw size={20} className={loading ? 'spinning' : ''} />
                {t('refresh')}
              </button>
            </div>
          </div>
        </div>

        <div className="performance-container">
          {/* Filters and Period */}
          <div className="performance-filters">
            <div className="filter-group">
              <label>{t('category')}:</label>
              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="filter-icon">
                      {category.icon}
                    </div>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>{t('period')}:</label>
              <div className="period-filters">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    className={`period-filter ${selectedPeriod === period.id ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod(period.id)}
                  >
                    {period.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="loading-message">
              <p>{t('loading')}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Performance Overview */}
          <div className="performance-overview">
            <div className="overview-header">
              <h3>{t('performanceOverview')}</h3>
            </div>

            <div className="overview-stats">
              {filteredPerformanceData.map((item) => (
                <div key={item.id} className="overview-stat-card">
                  <div className="stat-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="stat-content">
                    <h4>{item.name}</h4>
                    <div className="stat-value">
                      <span className="current-value">{item.value.toLocaleString()}</span>
                      <div className="stat-change">
                        {getTrendIcon(item.trend)}
                        <span className={`change-value ${item.trend === 'up' ? 'positive' : item.trend === 'down' ? 'negative' : 'neutral'}`}>
                          {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                        </span>
                      </div>
                    </div>
                    <p className="stat-description">
                          {t('previousPeriod')}: {item.previousValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

              {/* KPI Metrics */}
          <div className="kpi-section">
            <div className="kpi-header">
              <h3>{t('kpiMetrics')}</h3>
              <button 
                className="details-toggle"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showDetails ? t('hideDetails') : t('showDetails')}</span>
              </button>
            </div>

                {filteredKPIs.length === 0 ? (
                  <div className="no-data-message">
                    <p>{t('noData')}</p>
                  </div>
                ) : (
            <div className="kpi-grid">
              {filteredKPIs.map((kpi) => (
                <div key={kpi.id} className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-info">
                            <h4>{t(kpi.metric.toLowerCase().replace(/_/g, ''))}</h4>
                            <p className="kpi-description">{kpi.description || t(`${kpi.metric.toLowerCase().replace(/_/g, '')}Desc`)}</p>
                    </div>
                    <div className={`kpi-status ${getStatusColor(kpi.status)}`}>
                      {getStatusText(kpi.status)}
                    </div>
                  </div>

                  <div className="kpi-metrics">
                    <div className="metric-row">
                      <span className="metric-label">{t('currentValue')}:</span>
                      <span className="metric-value">
                        {kpi.value.toLocaleString()} {kpi.unit}
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">{t('target')}:</span>
                      <span className="metric-target">
                              {kpi.targetValue.toLocaleString()} {kpi.unit}
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">{t('change')}:</span>
                            <span className={`metric-change ${kpi.changeValue > 0 ? 'positive' : kpi.changeValue < 0 ? 'negative' : 'neutral'}`}>
                              {getChangeIcon(kpi.changeValue)}
                              {kpi.changeValue > 0 ? '+' : ''}{kpi.changeValue} {kpi.unit}
                      </span>
                    </div>
                  </div>

                  <div className="kpi-progress">
                    <div className="progress-header">
                      <span>{t('progressToGoal')}</span>
                            <span>{Math.round((kpi.value / kpi.targetValue) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                              className={`progress-fill ${getProgressColor(kpi.value, kpi.targetValue)}`}
                              style={{ width: `${getProgressWidth(kpi.value, kpi.targetValue)}%` }}
                      ></div>
                    </div>
                  </div>

                  {showDetails && (
                    <div className="kpi-details">
                                          <div className="detail-row">
                      <span className="detail-label">{t('period')}:</span>
                      <span className="detail-value">{kpi.period}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('trend')}:</span>
                      <span className="detail-value">
                        {getTrendIcon(kpi.trend)}
                        {kpi.trend === 'up' ? t('improvement') : kpi.trend === 'down' ? t('deterioration') : t('stable')}
                      </span>
                    </div>
                    </div>
                  )}

                  <div className="kpi-actions">
                    <button className="kpi-action">
                      <BarChart3 size={16} />
                      <span>{t('detailedReport')}</span>
                    </button>
                    <button className="kpi-action">
                      <TrendingUp size={16} />
                      <span>{t('trends')}</span>
                    </button>
                    <button className="kpi-action">
                      <Settings size={16} />
                      <span>{t('configure')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
                )}
          </div>

              {/* Charts and Analytics */}
          <div className="analytics-section">
            <div className="analytics-header">
              <h3>{t('analyticsAndCharts')}</h3>
              <div className="chart-controls">
                <button className="chart-control active">
                  <BarChart size={16} />
                  <span>{t('columns')}</span>
                </button>
                <button className="chart-control">
                  <LineChart size={16} />
                  <span>{t('lines')}</span>
                </button>
                <button className="chart-control">
                  <PieChart size={16} />
                  <span>{t('circular')}</span>
                </button>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h4>{t('hireTrends')}</h4>
                  <div className="chart-legend">
                    <span className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                      <span>{t('hires')}</span>
                    </span>
                    <span className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                      <span>{t('goal')}</span>
                    </span>
                  </div>
                </div>
                <div className="chart-placeholder">
                  <BarChart3 size={48} />
                      <p>{t('hireTrends')}</p>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h4>{t('sourceDistribution')}</h4>
                  <div className="chart-legend">
                    <span className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                      <span>{t('linkedin')}</span>
                    </span>
                    <span className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
                      <span>{t('indeed')}</span>
                    </span>
                  </div>
                </div>
                <div className="chart-placeholder">
                  <PieChart size={48} />
                      <p>{t('sourceDistribution')}</p>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h4>{t('hireTimeByDepartment')}</h4>
                  <div className="chart-legend">
                    <span className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#06b6d4' }}></div>
                      <span>{t('average')}</span>
                    </span>
                  </div>
                </div>
                <div className="chart-placeholder">
                  <BarChart size={48} />
                      <p>{t('hireTimeByDepartment')}</p>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h4>{t('hireCostByMonth')}</h4>
                  <div className="chart-legend">
                    <span className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                      <span>{t('cost')}</span>
                    </span>
                  </div>
                </div>
                <div className="chart-placeholder">
                  <LineChart size={48} />
                      <p>{t('hireCostByMonth')}</p>
                </div>
              </div>
            </div>
          </div>

              {/* Quick Actions */}
          <div className="quick-actions">
            <h3>{t('quickActions')}</h3>
            <div className="actions-grid">
                  <button className="quick-action" onClick={handleExport}>
                <Download size={20} />
                <span>{t('exportReport')}</span>
              </button>
              <button className="quick-action">
                <BarChart3 size={20} />
                <span>{t('detailedAnalytics')}</span>
              </button>
              <button className="quick-action">
                <Target size={20} />
                <span>{t('setGoals')}</span>
              </button>
              <button className="quick-action">
                <Settings size={20} />
                <span>{t('kpiSettings')}</span>
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PerformancePage;
