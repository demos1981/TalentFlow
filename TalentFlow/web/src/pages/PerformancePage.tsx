import React, { useState } from 'react';
import { TrendingUp, Target, Award, BarChart3, Users, Clock, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign, TrendingDown, ArrowUp, ArrowDown, Minus, Filter, Download, RefreshCw, Eye, EyeOff, Settings, PieChart, Activity, Zap, Star, Trophy, Medal, Crown, TrendingUpIcon, TrendingDownIcon, BarChart, LineChart, PieChart as PieChartIcon, Calendar as CalendarIcon, Clock as ClockIcon, UserCheck, UserX, UserPlus, UserMinus, Briefcase, Mail, Phone, MessageSquare, FileText, Database, Globe, Lock, Shield, Zap as ZapIcon, Target as TargetIcon, Award as AwardIcon } from 'lucide-react';

interface KPIMetric {
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

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

const PerformancePage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  const kpiMetrics: KPIMetric[] = [
    {
      id: 'time-to-hire',
      name: 'Час до найму',
      value: 28,
      target: 25,
      unit: 'днів',
      change: -3,
      changeType: 'increase',
      category: 'recruitment',
      status: 'good',
      trend: 'up',
      period: 'Цей місяць',
      description: 'Середній час від першого контакту до найму кандидата'
    },
    {
      id: 'cost-per-hire',
      name: 'Вартість найму',
      value: 4200,
      target: 4000,
      unit: 'USD',
      change: 200,
      changeType: 'decrease',
      category: 'recruitment',
      status: 'warning',
      trend: 'down',
      period: 'Цей місяць',
      description: 'Середня вартість найму одного кандидата'
    },
    {
      id: 'quality-of-hire',
      name: 'Якість найму',
      value: 87,
      target: 85,
      unit: '%',
      change: 2,
      changeType: 'increase',
      category: 'recruitment',
      status: 'excellent',
      trend: 'up',
      period: 'Цей місяць',
      description: 'Відсоток успішних наймів після 90 днів'
    },
    {
      id: 'candidate-satisfaction',
      name: 'Задоволеність кандидатів',
      value: 4.6,
      target: 4.5,
      unit: '/5',
      change: 0.1,
      changeType: 'increase',
      category: 'experience',
      status: 'excellent',
      trend: 'up',
      period: 'Цей місяць',
      description: 'Середня оцінка досвіду кандидатів'
    },
    {
      id: 'employee-retention',
      name: 'Утримання співробітників',
      value: 92,
      target: 90,
      unit: '%',
      change: 2,
      changeType: 'increase',
      category: 'retention',
      status: 'excellent',
      trend: 'up',
      period: 'Цей місяць',
      description: 'Відсоток співробітників, що залишилися після 12 місяців'
    },
    {
      id: 'recruitment-funnel',
      name: 'Конверсія воронки',
      value: 15,
      target: 12,
      unit: '%',
      change: 3,
      changeType: 'increase',
      category: 'recruitment',
      status: 'excellent',
      trend: 'up',
      period: 'Цей місяць',
      description: 'Відсоток кандидатів, що пройшли весь процес найму'
    },
    {
      id: 'time-to-fill',
      name: 'Час заповнення вакансії',
      value: 45,
      target: 40,
      unit: 'днів',
      change: 5,
      changeType: 'decrease',
      category: 'recruitment',
      status: 'warning',
      trend: 'down',
      period: 'Цей місяць',
      description: 'Середній час від відкриття до закриття вакансії'
    },
    {
      id: 'source-effectiveness',
      name: 'Ефективність джерел',
      value: 78,
      target: 75,
      unit: '%',
      change: 3,
      changeType: 'increase',
      category: 'recruitment',
      status: 'good',
      trend: 'up',
      period: 'Цей місяць',
      description: 'Відсоток успішних наймів з основних джерел'
    }
  ];

  const performanceData: PerformanceData[] = [
    {
      id: 'applications',
      name: 'Заявки',
      value: 1247,
      previousValue: 1189,
      change: 58,
      changePercent: 4.9,
      trend: 'up',
      category: 'recruitment',
      icon: <Users size={24} />,
      color: '#3b82f6'
    },
    {
      id: 'interviews',
      name: 'Інтерв\'ю',
      value: 342,
      previousValue: 298,
      change: 44,
      changePercent: 14.8,
      trend: 'up',
      category: 'recruitment',
      icon: <Calendar size={24} />,
      color: '#10b981'
    },
    {
      id: 'hires',
      name: 'Найми',
      value: 89,
      previousValue: 76,
      change: 13,
      changePercent: 17.1,
      trend: 'up',
      category: 'recruitment',
      icon: <UserCheck size={24} />,
      color: '#f59e0b'
    },
    {
      id: 'rejections',
      name: 'Відмови',
      value: 156,
      previousValue: 142,
      change: 14,
      changePercent: 9.9,
      trend: 'up',
      category: 'recruitment',
      icon: <UserX size={24} />,
      color: '#ef4444'
    },
    {
      id: 'time-to-hire-avg',
      name: 'Час найму (середній)',
      value: 28,
      previousValue: 31,
      change: -3,
      changePercent: -9.7,
      trend: 'up',
      category: 'efficiency',
      icon: <Clock size={24} />,
      color: '#8b5cf6'
    },
    {
      id: 'cost-per-hire-avg',
      name: 'Вартість найму (середня)',
      value: 4200,
      previousValue: 4100,
      change: 100,
      changePercent: 2.4,
      trend: 'down',
      category: 'cost',
      icon: <DollarSign size={24} />,
      color: '#06b6d4'
    }
  ];

  const categories = [
    { id: 'all', name: 'Всі категорії', icon: <BarChart3 size={16} /> },
    { id: 'recruitment', name: 'Рекрутинг', icon: <Users size={16} /> },
    { id: 'experience', name: 'Досвід', icon: <Star size={16} /> },
    { id: 'retention', name: 'Утримання', icon: <Target size={16} /> },
    { id: 'efficiency', name: 'Ефективність', icon: <Zap size={16} /> },
    { id: 'cost', name: 'Вартість', icon: <DollarSign size={16} /> }
  ];

  const periods = [
    { id: 'week', name: 'Тиждень' },
    { id: 'month', name: 'Місяць' },
    { id: 'quarter', name: 'Квартал' },
    { id: 'year', name: 'Рік' }
  ];

  const filteredKPIs = kpiMetrics.filter(kpi => 
    selectedCategory === 'all' || kpi.category === selectedCategory
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Відмінно';
      case 'good':
        return 'Добре';
      case 'warning':
        return 'Попередження';
      case 'critical':
        return 'Критично';
      default:
        return 'Невідомо';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />;
      case 'stable':
        return <Minus size={16} className="text-gray-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp size={16} className="text-green-500" />;
      case 'decrease':
        return <ArrowDown size={16} className="text-red-500" />;
      case 'neutral':
        return <Minus size={16} className="text-gray-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressWidth = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Продуктивність</h1>
        <p className="dashboard-greeting-subtitle">KPI та метрики продуктивності</p>
      </div>

      <div className="performance-container">
        {/* Фільтри та період */}
        <div className="performance-filters">
          <div className="filter-group">
            <label>Категорія:</label>
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
            <label>Період:</label>
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

        {/* Загальна статистика */}
        <div className="performance-overview">
          <div className="overview-header">
            <h3>Загальний огляд продуктивності</h3>
            <div className="overview-actions">
              <button className="action-button">
                <RefreshCw size={16} />
                <span>Оновити</span>
              </button>
              <button className="action-button">
                <Download size={16} />
                <span>Експорт</span>
              </button>
              <button className="action-button">
                <Settings size={16} />
                <span>Налаштування</span>
              </button>
            </div>
          </div>

          <div className="overview-stats">
            {performanceData.map((item) => (
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
                    Попередній період: {item.previousValue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Метрики */}
        <div className="kpi-section">
          <div className="kpi-header">
            <h3>KPI Метрики</h3>
            <button 
              className="details-toggle"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showDetails ? 'Сховати деталі' : 'Показати деталі'}</span>
            </button>
          </div>

          <div className="kpi-grid">
            {filteredKPIs.map((kpi) => (
              <div key={kpi.id} className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-info">
                    <h4>{kpi.name}</h4>
                    <p className="kpi-description">{kpi.description}</p>
                  </div>
                  <div className={`kpi-status ${getStatusColor(kpi.status)}`}>
                    {getStatusText(kpi.status)}
                  </div>
                </div>

                <div className="kpi-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Поточне значення:</span>
                    <span className="metric-value">
                      {kpi.value.toLocaleString()} {kpi.unit}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Ціль:</span>
                    <span className="metric-target">
                      {kpi.target.toLocaleString()} {kpi.unit}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Зміна:</span>
                    <span className={`metric-change ${kpi.changeType === 'increase' ? 'positive' : kpi.changeType === 'decrease' ? 'negative' : 'neutral'}`}>
                      {getChangeIcon(kpi.changeType)}
                      {kpi.change > 0 ? '+' : ''}{kpi.change} {kpi.unit}
                    </span>
                  </div>
                </div>

                <div className="kpi-progress">
                  <div className="progress-header">
                    <span>Прогрес до цілі</span>
                    <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${getProgressColor(kpi.value, kpi.target)}`}
                      style={{ width: `${getProgressWidth(kpi.value, kpi.target)}%` }}
                    ></div>
                  </div>
                </div>

                {showDetails && (
                  <div className="kpi-details">
                    <div className="detail-row">
                      <span className="detail-label">Період:</span>
                      <span className="detail-value">{kpi.period}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Тренд:</span>
                      <span className="detail-value">
                        {getTrendIcon(kpi.trend)}
                        {kpi.trend === 'up' ? 'Покращення' : kpi.trend === 'down' ? 'Погіршення' : 'Стабільно'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Категорія:</span>
                      <span className="detail-value">{kpi.category}</span>
                    </div>
                  </div>
                )}

                <div className="kpi-actions">
                  <button className="kpi-action">
                    <BarChart3 size={16} />
                    <span>Детальний звіт</span>
                  </button>
                  <button className="kpi-action">
                    <TrendingUp size={16} />
                    <span>Тренди</span>
                  </button>
                  <button className="kpi-action">
                    <Settings size={16} />
                    <span>Налаштувати</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Графіки та аналітика */}
        <div className="analytics-section">
          <div className="analytics-header">
            <h3>Аналітика та графіки</h3>
            <div className="chart-controls">
              <button className="chart-control active">
                <BarChart size={16} />
                <span>Стовпчики</span>
              </button>
              <button className="chart-control">
                <LineChart size={16} />
                <span>Лінії</span>
              </button>
              <button className="chart-control">
                <PieChartIcon size={16} />
                <span>Кругова</span>
              </button>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h4>Тренд наймів за місяць</h4>
                <div className="chart-legend">
                  <span className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span>Найми</span>
                  </span>
                  <span className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                    <span>Ціль</span>
                  </span>
                </div>
              </div>
              <div className="chart-placeholder">
                <BarChart3 size={48} />
                <p>Графік тренду наймів</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Розподіл за джерелами</h4>
                <div className="chart-legend">
                  <span className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span>LinkedIn</span>
                  </span>
                  <span className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
                    <span>Indeed</span>
                  </span>
                </div>
              </div>
              <div className="chart-placeholder">
                <PieChartIcon size={48} />
                <p>Кругова діаграма джерел</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Час найму по відділах</h4>
                <div className="chart-legend">
                  <span className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#06b6d4' }}></div>
                    <span>Середній</span>
                  </span>
                </div>
              </div>
              <div className="chart-placeholder">
                <BarChart size={48} />
                <p>Графік часу найму</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Вартість найму по місяцях</h4>
                <div className="chart-legend">
                  <span className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                    <span>Вартість</span>
                  </span>
                </div>
              </div>
              <div className="chart-placeholder">
                <LineChart size={48} />
                <p>Лінійний графік вартості</p>
              </div>
            </div>
          </div>
        </div>

        {/* Швидкі дії */}
        <div className="quick-actions">
          <h3>Швидкі дії</h3>
          <div className="actions-grid">
            <button className="quick-action">
              <Download size={20} />
              <span>Експорт звіту</span>
            </button>
            <button className="quick-action">
              <BarChart3 size={20} />
              <span>Детальна аналітика</span>
            </button>
            <button className="quick-action">
              <Target size={20} />
              <span>Встановити цілі</span>
            </button>
            <button className="quick-action">
              <Settings size={20} />
              <span>Налаштування KPI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
