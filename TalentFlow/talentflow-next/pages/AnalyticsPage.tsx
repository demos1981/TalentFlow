import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, Calendar, DollarSign, Target, Award, PieChart, LineChart, BarChart, Activity, Filter, Download, RefreshCw, Settings, Eye, EyeOff, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Minus, Search, Clock, CheckCircle, XCircle, AlertCircle, Star, Trophy, Medal, Crown, TrendingUpIcon, TrendingDownIcon, Calendar as CalendarIcon, Clock as ClockIcon, UserCheck, UserX, UserPlus, UserMinus, Mail, Phone, MessageSquare, FileText, Database, Globe, Lock, Shield, Zap, Target as TargetIcon, Award as AwardIcon, BarChart3 as BarChart3Icon, PieChart as PieChartIcon, LineChart as LineChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

interface AnalyticsMetric {
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
  description: string;
}

interface AnalyticsChart {
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

interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
  dataPoints: number;
  status: 'active' | 'draft' | 'archived';
  icon: React.ReactNode;
}

const AnalyticsPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const analyticsMetrics: AnalyticsMetric[] = [
    {
      id: 'total-users',
      name: t('totalUsers'),
      value: 1247,
      previousValue: 1189,
      change: 58,
      changePercent: 4.9,
      trend: 'up',
      category: 'users',
      icon: <Users size={24} />,
      color: '#3b82f6',
      description: t('totalUsersDesc')
    },
    {
      id: 'active-jobs',
      name: t('activeJobs'),
      value: 342,
      previousValue: 298,
      change: 44,
      changePercent: 14.8,
      trend: 'up',
      category: 'jobs',
      icon: <Briefcase size={24} />,
      color: '#10b981',
      description: t('activeJobsDesc')
    },
    {
      id: 'applications',
      name: t('totalApplications'),
      value: 2156,
      previousValue: 1892,
      change: 264,
      changePercent: 14.0,
      trend: 'up',
      category: 'applications',
      icon: <FileText size={24} />,
      color: '#f59e0b',
      description: t('totalApplicationsDesc')
    },
    {
      id: 'interviews',
      name: t('totalInterviews'),
      value: 567,
      previousValue: 489,
      change: 78,
      changePercent: 16.0,
      trend: 'up',
      category: 'interviews',
      icon: <Calendar size={24} />,
      color: '#8b5cf6',
      description: t('totalInterviewsDesc')
    },
    {
      id: 'hires',
      name: t('successfulHires'),
      value: 89,
      previousValue: 76,
      change: 13,
      changePercent: 17.1,
      trend: 'up',
      category: 'hires',
      icon: <UserCheck size={24} />,
      color: '#06b6d4',
      description: t('successfulHiresDesc')
    },
    {
      id: 'revenue',
      name: t('totalRevenue'),
      value: 125000,
      previousValue: 112000,
      change: 13000,
      changePercent: 11.6,
      trend: 'up',
      category: 'revenue',
      icon: <DollarSign size={24} />,
      color: '#ef4444',
      description: t('totalRevenueDesc')
    },
    {
      id: 'conversion-rate',
      name: t('conversionRate'),
      value: 15.2,
      previousValue: 13.8,
      change: 1.4,
      changePercent: 10.1,
      trend: 'up',
      category: 'conversion',
      icon: <Target size={24} />,
      color: '#84cc16',
      description: t('conversionRateDesc')
    },
    {
      id: 'satisfaction',
      name: t('userSatisfaction'),
      value: 4.6,
      previousValue: 4.4,
      change: 0.2,
      changePercent: 4.5,
      trend: 'up',
      category: 'satisfaction',
      icon: <Star size={24} />,
      color: '#f97316',
      description: t('userSatisfactionDesc')
    }
  ];

  const analyticsCharts: AnalyticsChart[] = [
    {
      id: 'user-growth',
      title: 'Ріст користувачів',
      type: 'line',
      data: {
        labels: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень'],
        datasets: [
          {
            label: 'Користувачі',
            data: [850, 920, 1050, 1120, 1189, 1247],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb'
          }
        ]
      }
    },
    {
      id: 'job-categories',
      title: 'Розподіл вакансій по категоріях',
      type: 'pie',
      data: {
        labels: ['IT', 'Маркетинг', 'Продажі', 'HR', 'Фінанси', 'Інше'],
        datasets: [
          {
            label: 'Вакансії',
            data: [45, 20, 15, 10, 8, 2],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280']
          }
        ]
      }
    },
    {
      id: 'applications-trend',
      title: 'Тренд заявок',
      type: 'bar',
      data: {
        labels: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень'],
        datasets: [
          {
            label: 'Заявки',
            data: [320, 380, 420, 450, 520, 580],
            backgroundColor: '#f59e0b'
          }
        ]
      }
    },
    {
      id: 'conversion-funnel',
      title: 'Воронка конверсії',
      type: 'doughnut',
      data: {
        labels: ['Заявки', 'Інтерв\'ю', 'Оффери', 'Найми'],
        datasets: [
          {
            label: 'Кількість',
            data: [2156, 567, 134, 89],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
          }
        ]
      }
    }
  ];

  const analyticsReports: AnalyticsReport[] = [
    {
      id: 'monthly-summary',
      name: 'Місячний звіт',
      description: 'Загальний звіт по всіх метриках за місяць',
      category: 'summary',
      lastUpdated: '2025-08-25T14:30:00Z',
      dataPoints: 156,
      status: 'active',
      icon: <BarChart3 size={20} />
    },
    {
      id: 'user-engagement',
      name: 'Активність користувачів',
      description: 'Детальний аналіз активності користувачів',
      category: 'users',
      lastUpdated: '2025-08-25T13:45:00Z',
      dataPoints: 89,
      status: 'active',
      icon: <Users size={20} />
    },
    {
      id: 'recruitment-efficiency',
      name: 'Ефективність рекрутингу',
      description: 'Аналіз ефективності процесу найму',
      category: 'recruitment',
      lastUpdated: '2025-08-25T12:15:00Z',
      dataPoints: 234,
      status: 'active',
      icon: <Target size={20} />
    },
    {
      id: 'revenue-analysis',
      name: 'Аналіз доходів',
      description: 'Детальний аналіз доходів та фінансових показників',
      category: 'revenue',
      lastUpdated: '2025-08-25T11:30:00Z',
      dataPoints: 67,
      status: 'active',
      icon: <DollarSign size={20} />
    },
    {
      id: 'satisfaction-report',
      name: 'Звіт задоволеності',
      description: 'Аналіз задоволеності користувачів та клієнтів',
      category: 'satisfaction',
      lastUpdated: '2025-08-24T16:20:00Z',
      dataPoints: 123,
      status: 'active',
      icon: <Star size={20} />
    },
    {
      id: 'performance-dashboard',
      name: 'Дашборд продуктивності',
      description: 'Комплексний дашборд продуктивності команди',
      category: 'performance',
      lastUpdated: '2025-08-24T15:45:00Z',
      dataPoints: 189,
      status: 'draft',
      icon: <Activity size={20} />
    }
  ];

  const categories = [
    { id: 'all', name: t('allCategories'), icon: <BarChart3 size={16} /> },
    { id: 'users', name: t('users'), icon: <Users size={16} /> },
    { id: 'jobs', name: t('vacancies'), icon: <Briefcase size={16} /> },
    { id: 'applications', name: t('applications'), icon: <FileText size={16} /> },
    { id: 'interviews', name: t('interviews'), icon: <Calendar size={16} /> },
    { id: 'hires', name: t('hires'), icon: <UserCheck size={16} /> },
    { id: 'revenue', name: t('revenue'), icon: <DollarSign size={16} /> },
    { id: 'conversion', name: t('conversion'), icon: <Target size={16} /> },
    { id: 'satisfaction', name: t('satisfaction'), icon: <Star size={16} /> }
  ];

  const periods = [
    { id: 'week', name: t('week') },
    { id: 'month', name: t('month') },
    { id: 'quarter', name: t('quarter') },
    { id: 'year', name: t('year') }
  ];

  const filteredMetrics = analyticsMetrics.filter(metric => 
    selectedCategory === 'all' || metric.category === selectedCategory
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={16} className="text-green-500" />;
      case 'down':
        return <ArrowDown size={16} className="text-red-500" />;
      case 'stable':
        return <Minus size={16} className="text-gray-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line':
        return <LineChart size={20} />;
      case 'bar':
        return <BarChart size={20} />;
      case 'pie':
        return <PieChart size={20} />;
      case 'doughnut':
        return <PieChart size={20} />;
      default:
        return <BarChart3 size={20} />;
    }
  };

  const formatValue = (value: number, category: string) => {
    if (category === 'revenue') {
      return `$${value.toLocaleString()}`;
    }
    if (category === 'satisfaction') {
      return value.toFixed(1);
    }
    if (category === 'conversion') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Щойно';
    if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} год тому`;
    return `${Math.floor(diffInMinutes / 1440)} дн тому`;
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('analytics')}</h1>
        <p className="dashboard-greeting-subtitle">{t('analyticsDescription')}</p>
      </div>

      <div className="analytics-container">
        {/* Фільтри та період */}
        <div className="analytics-filters">
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

          <div className="filter-actions">
            <button className="action-button">
              <RefreshCw size={16} />
              <span>{t('refresh')}</span>
            </button>
            <button className="action-button">
              <Download size={16} />
              <span>{t('export')}</span>
            </button>
            <button 
              className="action-button"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings size={16} />
              <span>{t('settings')}</span>
            </button>
          </div>
        </div>

        {/* Ключові метрики */}
        <div className="analytics-overview">
          <div className="overview-header">
            <h3>{t('keyMetrics')}</h3>
            <div className="overview-actions">
              <button className="view-toggle">
                {showAdvanced ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showAdvanced ? t('hideDetails') : t('showDetails')}</span>
              </button>
            </div>
          </div>

          <div className="metrics-grid">
            {filteredMetrics.map((metric) => (
              <div key={metric.id} className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon" style={{ color: metric.color }}>
                    {metric.icon}
                  </div>
                  <div className="metric-trend">
                    {getTrendIcon(metric.trend)}
                    <span className={`trend-value ${metric.trend === 'up' ? 'positive' : metric.trend === 'down' ? 'negative' : 'neutral'}`}>
                      {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                    </span>
                  </div>
                </div>

                <div className="metric-content">
                  <h4>{metric.name}</h4>
                  <div className="metric-value">
                    {formatValue(metric.value, metric.category)}
                  </div>
                  {showAdvanced && (
                    <div className="metric-details">
                      <p className="metric-description">{metric.description}</p>
                      <div className="metric-comparison">
                        <span className="previous-value">
                          Попередній: {formatValue(metric.previousValue, metric.category)}
                        </span>
                        <span className="change-value">
                          Зміна: {metric.change > 0 ? '+' : ''}{formatValue(metric.change, metric.category)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Графіки */}
        <div className="charts-section">
          <div className="charts-header">
            <h3>{t('chartsAndVisualization')}</h3>
            <div className="chart-controls">
              <button className="chart-control active">
                <BarChart3 size={16} />
                <span>{t('all')}</span>
              </button>
              <button className="chart-control">
                <LineChart size={16} />
                <span>{t('line')}</span>
              </button>
              <button className="chart-control">
                <PieChart size={16} />
                <span>{t('pie')}</span>
              </button>
            </div>
          </div>

          <div className="charts-grid">
            {analyticsCharts.map((chart) => (
              <div key={chart.id} className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">
                    {getChartIcon(chart.type)}
                    <h4>{chart.title}</h4>
                  </div>
                  <div className="chart-actions">
                    <button className="chart-action">
                      <Eye size={16} />
                    </button>
                    <button className="chart-action">
                      <Download size={16} />
                    </button>
                    <button className="chart-action">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>

                <div className="chart-content">
                  <div className="chart-placeholder">
                    {getChartIcon(chart.type)}
                    <p>{chart.title}</p>
                    <div className="chart-data-preview">
                      <div className="data-points">
                        {chart.data.labels.slice(0, 3).map((label, index) => (
                          <div key={index} className="data-point">
                            <span className="data-label">{label}</span>
                            <span className="data-value">
                              {chart.data.datasets[0].data[index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Звіти */}
        <div className="reports-section">
          <div className="reports-header">
            <h3>{t('analyticsReports')}</h3>
            <div className="reports-actions">
              <button className="report-action">
                <FileText size={16} />
                <span>{t('createReport')}</span>
              </button>
            </div>
          </div>

          <div className="reports-grid">
            {analyticsReports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-icon">
                    {report.icon}
                  </div>
                  <div className="report-status">
                    <span className={`status-badge ${report.status}`}>
                      {report.status === 'active' ? 'Активний' : report.status === 'draft' ? 'Чернетка' : 'Архів'}
                    </span>
                  </div>
                </div>

                <div className="report-content">
                  <h4>{report.name}</h4>
                  <p className="report-description">{report.description}</p>
                  
                  <div className="report-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{t('updated')}: {formatDate(report.lastUpdated)}</span>
                    </div>
                    <div className="meta-item">
                      <Database size={14} />
                      <span>{t('dataPoints')}: {report.dataPoints}</span>
                    </div>
                  </div>
                </div>

                <div className="report-actions">
                  <button className="report-button primary">
                    <Eye size={16} />
                    <span>{t('view')}</span>
                  </button>
                  <button className="report-button secondary">
                    <Download size={16} />
                    <span>{t('export')}</span>
                  </button>
                  <button className="report-button secondary">
                    <Settings size={16} />
                    <span>{t('configure')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Швидкі дії */}
        <div className="quick-actions">
          <h3>{t('quickActions')}</h3>
          <div className="actions-grid">
            <button className="quick-action">
              <BarChart3 size={20} />
              <span>{t('createDashboard')}</span>
            </button>
            <button className="quick-action">
              <FileText size={20} />
              <span>{t('generateReport')}</span>
            </button>
            <button className="quick-action">
              <Download size={20} />
              <span>{t('exportData')}</span>
            </button>
            <button className="quick-action">
              <Settings size={20} />
              <span>{t('settings')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
