'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { AnalyticsService, AnalyticsMetric, AnalyticsChart, AnalyticsReport } from '../../services/analyticsService';
import { CVExportService } from '../../services/cvExportService';
import { 
  BarChart3, TrendingUp, Users, Briefcase, Calendar, DollarSign, Target, Award, 
  PieChart, LineChart, BarChart, Activity, Filter, Download, RefreshCw, Settings, 
  Eye, EyeOff, ArrowUp, ArrowDown, Minus, Clock, CheckCircle, XCircle, AlertCircle, 
  Star, UserCheck, FileText, Database, Globe, Lock, Shield, Zap
} from 'lucide-react';
import './analytics.css';

// Використовуємо типи з AnalyticsService

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'all' | 'linear' | 'circular'>('all');
  const [selectedChart, setSelectedChart] = useState<any>(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Settings state
  const [chartSettings, setChartSettings] = useState({
    title: '',
    showValues: true,
    colorScheme: 'default'
  });
  
  // Map для збереження налаштувань кожного графіка
  const [chartSettingsMap, setChartSettingsMap] = useState<{[key: string]: any}>({});
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Функції для отримання масивів
  const getMonths = () => t('months') as unknown as string[];
  const getJobCategoriesLabels = () => t('jobCategoriesLabels') as unknown as string[];
  const getConversionLabels = () => t('conversionLabels') as unknown as string[];

  // Завантаження реальних даних з бекенду
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`🔄 Fetching analytics data for period: ${selectedPeriod} category: ${selectedCategory}`);
        
        // Отримуємо реальні дані аналітики з параметрами
        const realAnalytics = await AnalyticsService.getRealAnalytics(selectedPeriod, selectedCategory);
        
        console.log('✅ Analytics data received:', realAnalytics);
        setAnalyticsData(realAnalytics);
      } catch (err) {
        console.error('❌ Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedPeriod, selectedCategory]);

  // Функція для створення метрик з реальних даних
  const getAnalyticsMetrics = (): any[] => {
    if (!analyticsData?.users) return [];

    const { users, jobs, applications, interviews, companies } = analyticsData;

    return [
      {
        id: 'total-users',
        name: t('totalUsers'),
        value: users?.total || 0,
        previousValue: users?.new || 0,
        change: users?.growthRate || 0,
        changePercent: users?.growthRate || 0,
        trend: (users?.growthRate || 0) > 0 ? 'up' : 
               (users?.growthRate || 0) < 0 ? 'down' : 'stable',
        category: 'users',
        icon: <Users size={24} />,
        color: '#3b82f6',
        description: t('totalUsersDesc')
      },
      {
        id: 'active-jobs',
        name: t('activeJobs'),
        value: jobs?.active || 0,
        previousValue: jobs?.closed || 0,
        change: jobs?.growthRate || 0,
        changePercent: jobs?.growthRate || 0,
        trend: (jobs?.growthRate || 0) > 0 ? 'up' : 
               (jobs?.growthRate || 0) < 0 ? 'down' : 'stable',
        category: 'jobs',
        icon: <Briefcase size={24} />,
        color: '#10b981',
        description: t('activeJobsDesc')
      },
      {
        id: 'applications',
        name: t('totalApplications'),
        value: applications?.total || 0,
        previousValue: 0,
        change: applications?.conversionRate || 0,
        changePercent: applications?.conversionRate || 0,
        trend: (applications?.conversionRate || 0) > 0 ? 'up' : 'stable',
        category: 'applications',
        icon: <FileText size={24} />,
        color: '#f59e0b',
        description: t('totalApplicationsDesc')
      },
      {
        id: 'interviews',
        name: t('totalInterviews'),
        value: interviews?.total || 0,
        previousValue: 0,
        change: 0,
        changePercent: 0,
        trend: 'stable',
        category: 'interviews',
        icon: <Calendar size={24} />,
        color: '#8b5cf6',
        description: t('totalInterviewsDesc')
      },
      {
        id: 'companies',
        name: t('companies'),
        value: companies?.total || 0,
        previousValue: companies?.new || 0,
        change: companies?.active || 0,
        changePercent: companies?.active || 0,
        trend: (companies?.active || 0) > 0 ? 'up' : 'stable',
        category: 'companies',
        icon: <Briefcase size={24} />,
        color: '#06b6d4',
        description: t('companies')
      },
      {
        id: 'satisfaction',
        name: t('userSatisfaction'),
        value: 4.6, // Satisfaction data would need to be added to backend
        previousValue: 4.4,
        change: 0.2,
        changePercent: 4.5,
        trend: 'up' as const,
        category: 'satisfaction',
        icon: <Star size={24} />,
        color: '#f97316',
        description: t('userSatisfactionDesc')
      }
    ];
  };

  // Функція для отримання даних попереднього періоду (заглушка)
  const getPreviousPeriodData = () => {
    // В реальному додатку це має бути окремий запит до API
    return {
      totalUsers: Math.floor((analyticsData?.metrics?.totalUsers || 0) * 0.9),
      activeJobs: Math.floor((analyticsData?.metrics?.activeJobs || 0) * 0.85),
      totalApplications: Math.floor((analyticsData?.metrics?.totalApplications || 0) * 0.88),
      totalInterviews: Math.floor((analyticsData?.metrics?.totalInterviews || 0) * 0.86),
      hiredCandidates: Math.floor((analyticsData?.metrics?.hiredCandidates || 0) * 0.85),
      hireRate: ((analyticsData?.metrics?.hiredCandidates || 0) * 0.85 / (analyticsData?.metrics?.totalApplications || 1) * 100).toFixed(2)
    };
  };

  const analyticsMetrics = getAnalyticsMetrics();

  // Функція для отримання кольорової схеми
  const getColorScheme = (scheme: string = 'default') => {
    const schemes = {
      default: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'],
      blue: ['#1e3a8a', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
      green: ['#14532d', '#166534', '#22c55e', '#4ade80', '#86efac', '#dcfce7'],
      purple: ['#581c87', '#7e22ce', '#a855f7', '#c084fc', '#e9d5ff', '#f3e8ff'],
      orange: ['#7c2d12', '#c2410c', '#f97316', '#fb923c', '#fdba74', '#fed7aa']
    };
    return schemes[scheme as keyof typeof schemes] || schemes.default;
  };

  // Функція для створення графіків з реальних даних
  const getAnalyticsCharts = (): any[] => {
    if (!analyticsData?.users) return [];

    const { users, jobs, applications } = analyticsData;

    // Визначаємо тип графіка на основі вибору користувача
    const getChartTypeForData = (dataType: string) => {
      if (chartType === 'linear') {
        return dataType === 'user-growth' || dataType === 'applications-trend' ? 'line' : 'bar';
      } else if (chartType === 'circular') {
        return 'pie';
      }
      // Для 'all' використовуємо оригінальні типи
      return dataType === 'user-growth' ? 'line' : 
             dataType === 'job-categories' ? 'pie' : 
             dataType === 'applications-trend' ? 'bar' : 'doughnut';
    };

    return [
      {
        id: 'user-growth',
        title: chartSettingsMap['user-growth']?.title || t('userGrowth'),
        type: getChartTypeForData('user-growth'),
        data: {
          labels: users?.monthlyGrowth?.map((item: any) => item.month) || [],
          datasets: [
            {
              label: t('users'),
              data: users?.monthlyGrowth?.map((item: any) => item.count) || [],
              backgroundColor: getColorScheme(chartSettingsMap['user-growth']?.colorScheme || 'default')[0],
              borderColor: getColorScheme(chartSettingsMap['user-growth']?.colorScheme || 'default')[0]
            }
          ]
        }
      },
      {
        id: 'job-categories',
        title: chartSettingsMap['job-categories']?.title || t('jobCategories'),
        type: getChartTypeForData('job-categories'),
        data: {
          labels: jobs?.byCategory?.map((item: any) => item.category) || [],
          datasets: [
            {
              label: t('vacancies'),
              data: jobs?.byCategory?.map((item: any) => parseInt(item.count)) || [],
              backgroundColor: getColorScheme(chartSettingsMap['job-categories']?.colorScheme || 'default')
            }
          ]
        }
      },
      {
        id: 'applications-trend',
        title: chartSettingsMap['applications-trend']?.title || t('applicationsTrend'),
        type: getChartTypeForData('applications-trend'),
        data: {
          labels: applications?.monthlyTrend?.map((item: any) => item.month) || [],
          datasets: [
            {
              label: t('applications'),
              data: applications?.monthlyTrend?.map((item: any) => item.count) || [],
              backgroundColor: getColorScheme(chartSettingsMap['applications-trend']?.colorScheme || 'default')[2]
            }
          ]
        }
      },
      {
        id: 'conversion-funnel',
        title: chartSettingsMap['conversion-funnel']?.title || t('conversionFunnel'),
        type: getChartTypeForData('conversion-funnel'),
        data: {
          labels: getConversionLabels(),
          datasets: [
            {
              label: t('quantity'),
              data: [
                applications?.total || 0,
                0, // interviews?.total || 0,
                applications?.byStatus?.find((item: any) => item.status === 'hired')?.count || 0
              ],
              backgroundColor: getColorScheme(chartSettingsMap['conversion-funnel']?.colorScheme || 'default').slice(0, 3)
            }
          ]
        }
      }
    ];
  };

  const analyticsCharts = useMemo(() => getAnalyticsCharts(), [analyticsData, chartType, chartSettingsMap]);

  // Фільтруємо графіки на основі вибраного типу
  const filteredCharts = analyticsCharts.filter(chart => {
    if (chartType === 'all') return true;
    if (chartType === 'linear') {
      return chart.type === 'line' || chart.type === 'bar';
    }
    if (chartType === 'circular') {
      return chart.type === 'pie' || chart.type === 'doughnut';
    }
    return true;
  });

  // Функція для створення звітів з реальних даних
  const getAnalyticsReports = (): any[] => {
    if (!analyticsData?.users) return [];

    const { users, jobs, applications, interviews, companies } = analyticsData;

    return [
      {
        id: 'monthly-summary',
        name: t('monthlyReport'),
        description: t('monthlyReportDesc'),
        category: 'summary',
        lastUpdated: new Date().toISOString(),
        dataPoints: 156,
        status: 'active',
        icon: <BarChart3 size={20} />
      },
      {
        id: 'user-engagement',
        name: t('userEngagement'),
        description: t('userEngagementDesc'),
        category: 'users',
        lastUpdated: new Date().toISOString(),
        dataPoints: 89,
        status: 'active',
        icon: <Users size={20} />
      },
      {
        id: 'recruitment-efficiency',
        name: t('recruitmentEfficiency'),
        description: t('recruitmentEfficiencyDesc'),
        category: 'recruitment',
        lastUpdated: new Date().toISOString(),
        dataPoints: 234,
        status: 'active',
        icon: <Target size={20} />
      },
      {
        id: 'revenue-analysis',
        name: t('revenueAnalysis'),
        description: t('revenueAnalysisDesc'),
        category: 'revenue',
        lastUpdated: new Date().toISOString(),
        dataPoints: 67,
        status: 'active',
        icon: <DollarSign size={20} />
      },
      {
        id: 'satisfaction-report',
        name: t('satisfactionReport'),
        description: t('satisfactionReportDesc'),
        category: 'satisfaction',
        lastUpdated: new Date().toISOString(),
        dataPoints: 123,
        status: 'active',
        icon: <Star size={20} />
      },
      {
        id: 'performance-dashboard',
        name: t('performanceDashboard'),
        description: t('performanceDashboardDesc'),
        category: 'performance',
        lastUpdated: new Date().toISOString(),
        dataPoints: 189,
        status: 'draft',
        icon: <Activity size={20} />
      }
    ];
  };

  const analyticsReports = getAnalyticsReports();

  // Функція для оновлення даних
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Отримуємо реальні дані аналітики
      const realAnalytics = await AnalyticsService.getRealAnalytics();
      setAnalyticsData(realAnalytics);
    } catch (err) {
      console.error('Error refreshing analytics data:', err);
      setError(t('errorUpdatingAnalytics'));
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для експорту даних
  const handleExport = async () => {
    try {
      const exportData = {
        period: selectedPeriod,
        category: selectedCategory,
        data: analyticsData,
        generatedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${selectedPeriod}-${selectedCategory}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting analytics:', err);
      setError(t('error'));
    }
  };

  // Функція для перегляду деталей метрики
  const handleViewDetails = (metricId: string) => {
    setSelectedReport(metricId);
    // Тут можна додати модальне вікно з деталями
    console.log('Viewing details for metric:', metricId);
  };

  // Функція для налаштувань
  const handleSettings = () => {
    setShowAdvanced(!showAdvanced);
  };

  // Функція для перегляду деталей графіка
  const handleViewChart = (chart: any) => {
    setSelectedChart(chart);
    setShowChartModal(true);
  };

  // Функція для експорту графіка в PDF
  const handleExportChart = async (chartId: string) => {
    try {
      const chart = analyticsCharts.find(c => c.id === chartId);
      if (!chart) return;

      // Генеруємо SVG графік для PDF
      const generateChartSVG = (chartType: string, data: any, labels: string[]) => {
        if (chartType === 'line' || chartType === 'bar') {
          const maxValue = Math.max(...data);
          const barWidth = 40;
          const chartWidth = labels.length * (barWidth + 10);
          const chartHeight = 200;
          
          let svgContent = `<svg width="${chartWidth}" height="${chartHeight}" style="border: 1px solid #ddd; margin: 20px 0;">`;
          
          data.forEach((value: number, index: number) => {
            const barHeight = (value / maxValue) * (chartHeight - 40);
            const x = index * (barWidth + 10) + 5;
            const y = chartHeight - barHeight - 20;
            
            svgContent += `
              <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${chart.data.datasets[0].backgroundColor || '#3b82f6'}" stroke="${chart.data.datasets[0].borderColor || '#2563eb'}" stroke-width="1"/>
              <text x="${x + barWidth/2}" y="${chartHeight - 5}" text-anchor="middle" font-size="12">${labels[index]}</text>
              <text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-size="11" font-weight="bold">${value}</text>
            `;
          });
          
          svgContent += '</svg>';
          return svgContent;
        }
        
        if (chartType === 'pie' || chartType === 'doughnut') {
          const total = data.reduce((sum: number, val: number) => sum + val, 0);
          if (total === 0) return `<div style="text-align: center; margin: 20px; color: #666;">${t('noData')}</div>`;
          
          const size = 200;
          const centerX = size / 2;
          const centerY = size / 2;
          const radius = chartType === 'doughnut' ? 60 : 80;
          const innerRadius = chartType === 'doughnut' ? 30 : 0;
          
          let cumulativePercentage = 0;
          let svgContent = `<svg width="${size}" height="${size}" style="border: 1px solid #ddd; margin: 20px 0;">`;
          
          data.forEach((value: number, index: number) => {
            const percentage = (value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const x3 = centerX + innerRadius * Math.cos(endAngleRad);
            const y3 = centerY + innerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(startAngleRad);
            const y4 = centerY + innerRadius * Math.sin(startAngleRad);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            let pathData;
            if (chartType === 'doughnut') {
              pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                'Z'
              ].join(' ');
            } else {
              pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
            }
            
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];
            svgContent += `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="white" stroke-width="2"/>`;
            
            cumulativePercentage += percentage;
          });
          
          if (chartType === 'doughnut') {
            svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" fill="white" stroke="#e5e7eb" stroke-width="2"/>`;
            svgContent += `<text x="${centerX}" y="${centerY - 5}" text-anchor="middle" font-size="16" font-weight="bold">${total}</text>`;
            svgContent += `<text x="${centerX}" y="${centerY + 10}" text-anchor="middle" font-size="10">Всього</text>`;
          }
          
          svgContent += '</svg>';
          return svgContent;
        }
        
        return '<div style="text-align: center; margin: 20px; color: #666;">Тип графіка не підтримується для експорту</div>';
      };

      // Створюємо HTML контент для PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${chart.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .chart-title { font-size: 24px; font-weight: bold; color: #333; }
            .chart-data { margin-top: 20px; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .data-table th { background-color: #f2f2f2; }
            .chart-visualization { margin-top: 30px; text-align: center; }
            .export-info { margin-top: 30px; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .header { margin-bottom: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="chart-title">${chart.title}</h1>
            <p>${t('chartType')}: ${chart.type}</p>
          </div>
          
          <div class="chart-data">
            <h3>${t('chartData')}:</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>{t('monthCategory')}</th>
                  <th>{t('value')}</th>
                </tr>
              </thead>
              <tbody>
                ${chart.data.labels.map((label: string, index: number) => `
                  <tr>
                    <td>${label}</td>
                    <td>${chart.data.datasets[0].data[index] || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="chart-visualization">
            <h3>Візуальне представлення:</h3>
            ${generateChartSVG(chart.type, chart.data.datasets[0].data, chart.data.labels)}
          </div>
          
          <div class="export-info">
            <p>Експортовано: ${new Date().toLocaleString('uk-UA')}</p>
            <p>Джерело: TalentFlow Analytics</p>
          </div>
        </body>
        </html>
      `;

      // Створюємо blob з HTML контентом
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      // Відкриваємо в новому вікні для друку/збереження як PDF
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      
      // Альтернативно, можна використати jsPDF для створення PDF
      // Поки що використовуємо простіший підхід з HTML
    } catch (err) {
      console.error('Error exporting chart:', err);
      setError(t('error'));
    }
  };

  // Функція для налаштувань графіка
  const handleChartSettings = (chart: any) => {
    setSelectedChart(chart);
    // Завантажуємо збережені налаштування або встановлюємо за замовчуванням
    const savedSettings = chartSettingsMap[chart.id] || {
      title: chart.title,
      showValues: true,
      colorScheme: 'default'
    };
    setChartSettings(savedSettings);
    setShowSettingsModal(true);
  };

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
        return <ArrowUp size={16} className="trend-icon positive" />;
      case 'down':
        return <ArrowDown size={16} className="trend-icon negative" />;
      case 'stable':
        return <Minus size={16} className="trend-icon neutral" />;
      default:
        return <Minus size={16} className="trend-icon neutral" />;
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
    
    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return `${diffInMinutes} ${t('minutesAgo')}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t('hoursAgo')}`;
    return `${Math.floor(diffInMinutes / 1440)} ${t('daysAgo')}`;
  };

  const handleViewReport = (reportId: string) => {
    console.log('🔍 handleViewReport called with:', reportId);
    const report = analyticsReports.find((r: any) => r.id === reportId);
    console.log('📊 Found report:', report);
    if (report) {
      setSelectedReport(report);
      setShowReportModal(true);
      console.log('✅ Report modal should be opening now');
    } else {
      console.error('❌ Report not found:', reportId);
    }
  };


  const handleExportReport = async (reportId: string) => {
    try {
      console.log('🔄 handleExportReport called with:', reportId);
      
      // Перевіряємо, чи дані завантажені
      if (!analyticsData) {
        console.error('❌ Analytics data is not loaded yet');
        return;
      }

      // Використовуємо оброблені дані звітів
      const analyticsReports = getAnalyticsReports();
      
      if (!analyticsReports || !Array.isArray(analyticsReports)) {
        console.error('❌ Reports data is not available or not an array');
        return;
      }

      // Знаходимо звіт за ID
      const report = analyticsReports.find((r: any) => r.id === reportId);
      if (!report) {
        console.error('❌ Report not found');
        return;
      }

      console.log('📊 Found report for export:', report);

      // Генеруємо HTML для PDF
      const generateReportHTML = (report: any) => {
        let reportData = '';
        
        if (report.id === 'monthly-summary') {
          reportData = `
            <tr><td>👥 {t('totalUsers')}</td><td>${analyticsData.users?.total?.toLocaleString() || '0'}</td></tr>
            <tr><td>💼 {t('totalJobs')}</td><td>${analyticsData.jobs?.total?.toLocaleString() || '0'}</td></tr>
            <tr><td>📝 {t('totalApplications')}</td><td>${analyticsData.applications?.total?.toLocaleString() || '0'}</td></tr>
            <tr><td>🎤 {t('totalInterviews')}</td><td>${analyticsData.interviews?.total?.toLocaleString() || '0'}</td></tr>
            <tr><td>🏢 {t('totalCompanies')}</td><td>${analyticsData.companies?.total?.toLocaleString() || '0'}</td></tr>
          `;
        } else if (report.id === 'user-engagement' && analyticsData.users) {
          reportData = `
            <tr><td>👥 {t('totalUsers')}</td><td>${analyticsData.users.total.toLocaleString()}</td></tr>
            <tr><td>🆕 {t('newUsers')}</td><td>${analyticsData.users.new.toLocaleString()}</td></tr>
            <tr><td>✅ {t('activeUsers')}</td><td>${analyticsData.users.active.toLocaleString()}</td></tr>
            <tr><td>📈 {t('growthRate')}</td><td>${analyticsData.users.growthRate}%</td></tr>
          `;
        } else if (report.id === 'recruitment-efficiency' && analyticsData.jobs && analyticsData.applications) {
          reportData = `
            <tr><td>💼 {t('totalJobs')}</td><td>${analyticsData.jobs.total.toLocaleString()}</td></tr>
            <tr><td>✅ {t('activeJobs')}</td><td>${analyticsData.jobs.active.toLocaleString()}</td></tr>
            <tr><td>📝 {t('totalApplications')}</td><td>${analyticsData.applications.total.toLocaleString()}</td></tr>
            <tr><td>🎯 {t('conversionRate')}</td><td>${analyticsData.applications.conversionRate}%</td></tr>
          `;
        } else if (report.id === 'satisfaction-report' && analyticsData.interviews) {
          reportData = `
            <tr><td>🎤 {t('totalInterviews')}</td><td>${analyticsData.interviews.total.toLocaleString()}</td></tr>
            <tr><td>📊 {t('completedInterviews')}</td><td>${analyticsData.interviews.completed?.toLocaleString() || '0'}</td></tr>
            <tr><td>⏰ {t('averageDuration')}</td><td>${analyticsData.interviews.averageDuration || '30'} {t('minutes')}</td></tr>
            <tr><td>⭐ {t('averageRating')}</td><td>${analyticsData.interviews.averageRating || '4.5'} ⭐</td></tr>
          `;
        } else if (report.id === 'performance-dashboard' && analyticsData.companies) {
          reportData = `
            <tr><td>🏢 {t('totalCompanies')}</td><td>${analyticsData.companies.total.toLocaleString()}</td></tr>
            <tr><td>🆕 {t('newCompanies')}</td><td>${analyticsData.companies.new.toLocaleString()}</td></tr>
            <tr><td>✅ {t('activeCompanies')}</td><td>${analyticsData.companies.active.toLocaleString()}</td></tr>
            <tr><td>📈 {t('growthRate')}</td><td>${analyticsData.companies.growthRate}%</td></tr>
          `;
        } else if (report.id === 'revenue-analysis' && analyticsData.applications) {
          reportData = `
            <tr><td>💰 {t('totalRevenue')}</td><td>$${(analyticsData.applications.total * 50).toLocaleString()}</td></tr>
            <tr><td>📝 {t('totalApplications')}</td><td>${analyticsData.applications.total.toLocaleString()}</td></tr>
            <tr><td>💵 {t('averageCostPerApplication')}</td><td>$50</td></tr>
            <tr><td>📈 {t('nextMonthForecast')}</td><td>$${((analyticsData.applications.total * 1.1) * 50).toLocaleString()}</td></tr>
          `;
        }

        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${report.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
                line-height: 1.6;
              }
              .header { 
                border-bottom: 2px solid #3b82f6; 
                padding-bottom: 10px; 
                margin-bottom: 20px; 
              }
              .header h1 { 
                color: #3b82f6; 
                margin: 0; 
                font-size: 24px;
              }
              .header p { 
                color: #666; 
                margin: 5px 0 0 0; 
                font-style: italic;
              }
              .report-info { 
                background: #f8fafc; 
                padding: 15px; 
                border-radius: 8px; 
                margin-bottom: 20px; 
              }
              .report-info h3 { 
                margin-top: 0; 
                color: #3b82f6; 
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 15px;
              }
              th, td { 
                padding: 12px; 
                text-align: left; 
                border-bottom: 1px solid #e2e8f0; 
              }
              th { 
                background: #f1f5f9; 
                font-weight: bold; 
                color: #475569;
              }
              .footer { 
                margin-top: 30px; 
                padding-top: 15px; 
                border-top: 1px solid #e2e8f0; 
                font-size: 12px; 
                color: #64748b; 
                text-align: right;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${report.name}</h1>
              <p>${report.description}</p>
            </div>
            
            <div class="report-info">
              <h3>{t('reportInformation')}</h3>
              <p><strong>{t('category')}:</strong> ${report.category}</p>
              <p><strong>{t('status')}:</strong> ${report.status.toUpperCase()}</p>
              <p><strong>{t('dataPoints')}:</strong> ${report.dataPoints}</p>
              <p><strong>{t('lastUpdated')}:</strong> ${new Date(report.lastUpdated).toLocaleString('uk-UA')}</p>
            </div>
            
            <div class="report-data">
              <h3>{t('reportData')}</h3>
              <table>
                <thead>
                  <tr>
                    <th>{t('indicator')}</th>
                    <th>{t('value')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData}
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              {t('generated')}: ${new Date().toLocaleString('uk-UA')}
            </div>
          </body>
          </html>
        `;
      };

      // Генеруємо HTML
      const htmlContent = generateReportHTML(report);
      console.log('📄 Generated HTML for report:', htmlContent.substring(0, 200) + '...');

      // Створюємо нове вікно для друку
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Чекаємо завантаження та друкуємо
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
        };
        
        console.log('✅ Report PDF export initiated');
      } else {
        console.error('❌ Failed to open print window');
      }
    } catch (error) {
      console.error('❌ Error exporting report:', error);
    }
  };



  if (isLoading) {
    return (
      <Layout>
        <div className="analytics-page">
          <div className="loading-spinner">
            <RefreshCw size={24} className="animate-spin" />
            <span>{t('loading')}...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="analytics-page">
          <div className="error-state">
            <AlertCircle size={48} className="error-icon" />
            <h2>{t('errorLoadingData')}</h2>
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="retry-button"
            >
              <RefreshCw size={16} />
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="analytics-page">
        <div className="analytics-header">
          <div className="analytics-header-content">
            <h1>{t('analytics')}</h1>
            <p>{t('reportsAndMetrics')}</p>
          </div>
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
              <button 
                className="action-button"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>{t('refresh')}</span>
              </button>
              <button 
                className="action-button"
                onClick={handleExport}
                disabled={isLoading || !analyticsData}
              >
                <Download size={16} />
                <span>{t('export')}</span>
              </button>
              <button 
                className="action-button"
                onClick={handleSettings}
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
                <button 
                  className="view-toggle"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
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
                    <div className="metric-actions">
                      <button 
                        className="metric-action"
                        onClick={() => handleViewDetails(metric.id)}
                        title={t('viewDetails')}
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="metric-action"
                        onClick={handleExport}
                        title={t('export')}
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        className="metric-action"
                        onClick={handleSettings}
                        title={t('settings')}
                      >
                        <Settings size={14} />
                      </button>
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
                            {t('previous')}: {formatValue(metric.previousValue, metric.category)}
                          </span>
                          <span className="change-value">
                            {t('change')}: {metric.change > 0 ? '+' : ''}{formatValue(metric.change, metric.category)}
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
                <button 
                  className={`chart-control ${chartType === 'all' ? 'active' : ''}`}
                  onClick={() => setChartType('all')}
                >
                  <BarChart3 size={16} />
                  <span>{t('all')}</span>
                </button>
                <button 
                  className={`chart-control ${chartType === 'linear' ? 'active' : ''}`}
                  onClick={() => setChartType('linear')}
                >
                  <LineChart size={16} />
                  <span>{t('linear')}</span>
                </button>
                <button 
                  className={`chart-control ${chartType === 'circular' ? 'active' : ''}`}
                  onClick={() => setChartType('circular')}
                >
                  <PieChart size={16} />
                  <span>{t('circular')}</span>
                </button>
              </div>
            </div>

            <div className="charts-grid">
              {filteredCharts.map((chart) => (
                <div key={chart.id} className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">
                      {getChartIcon(chart.type)}
                      <h4>{chart.title}</h4>
                    </div>
                    <div className="chart-actions">
                      <button 
                        className="chart-action"
                        onClick={() => handleViewChart(chart)}
                        title={t('viewDetails')}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="chart-action"
                        onClick={() => handleExportChart(chart.id)}
                        title={t('export')}
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        className="chart-action"
                        onClick={() => handleChartSettings(chart)}
                        title={t('settings')}
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="chart-content">
                    {chartType === 'all' ? (
                      // Режим "All" - показуємо тільки цифри як раніше
                    <div className="chart-placeholder">
                      {getChartIcon(chart.type)}
                      <p>{chart.title}</p>
                      <div className="chart-data-preview">
                        <div className="data-points">
                          {chart.data.labels.slice(0, 3).map((label: any, index: number) => (
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
                    ) : (
                      // Режими "Linear" та "Circular" - показуємо візуальні графіки
                      <div className="chart-visualization">
                        {chart.type === 'line' && (
                          <div className="line-chart">
                            <svg width="100%" height="150" className="line-chart-svg">
                              {(() => {
                                const data = chart.data.datasets[0].data;
                                const labels = chart.data.labels;
                                const nonZeroData = data.filter((v: number) => v > 0);
                                if (nonZeroData.length === 0) {
                                  return (
                                    <text
                                      x="50%"
                                      y="50%"
                                      textAnchor="middle"
                                      fontSize="14"
                                      fill="#6b7280"
                                    >
{t('noData')}
                                    </text>
                                  );
                                }
                                const maxValue = Math.max(...nonZeroData);
                                
                                const width = 280;
                                const height = 120;
                                const padding = 20;
                                const chartWidth = width - padding * 2;
                                const chartHeight = height - padding * 2;
                                
                                // Створюємо точки для лінії
                                const points = data.map((value: number, index: number) => {
                                  const x = padding + (index / (data.length - 1)) * chartWidth;
                                  const y = padding + chartHeight - (value / maxValue) * chartHeight;
                                  return `${x},${y}`;
                                }).join(' ');
                                
                                // Створюємо лінію
                                const linePath = data.map((value: number, index: number) => {
                                  const x = padding + (index / (data.length - 1)) * chartWidth;
                                  const y = padding + chartHeight - (value / maxValue) * chartHeight;
                                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ');
                                
                                return (
                                  <>
                                    <path
                                      d={linePath}
                                      fill="none"
                                      stroke={chart.data.datasets[0].borderColor || chart.data.datasets[0].backgroundColor || '#3b82f6'}
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    {data.map((value: number, index: number) => {
                                      const x = padding + (index / (data.length - 1)) * chartWidth;
                                      const y = padding + chartHeight - (value / maxValue) * chartHeight;
                                      return (
                                        <g key={index}>
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill={chart.data.datasets[0].backgroundColor || '#3b82f6'}
                                            stroke="white"
                                            strokeWidth="2"
                                          />
                               <text
                                 x={x}
                                 y={y - 8}
                                 textAnchor="middle"
                                 fontSize="9"
                                 fontWeight="700"
                                 fill={chart.data.datasets[0].backgroundColor || '#3b82f6'}
                               >
                                 {value}
                               </text>
                                        </g>
                                      );
                                    })}
                                    {labels.map((label: string, index: number) => {
                                      const x = padding + (index / (labels.length - 1)) * chartWidth;
                                      return (
                               <text
                                 key={index}
                                 x={x}
                                 y={height - 8}
                                 textAnchor="middle"
                                 fontSize="8"
                                 fill="#6b7280"
                               >
                                 {label}
                               </text>
                                      );
                                    })}
                                  </>
                                );
                              })()}
                            </svg>
                  </div>
                        )}
                        
                        {chart.type === 'bar' && (
                          <div className="bar-chart">
                            {(() => {
                              const data = chart.data.datasets[0].data;
                              const nonZeroData = data.filter((v: number) => v > 0);
                              if (nonZeroData.length === 0) {
                                return (
                                  <div className="chart-placeholder">
                                    <p>{t('noData')}</p>
                                  </div>
                                );
                              }
                              return (
                                <div className="chart-bars">
                                  {data.map((value: number, index: number) => (
                                    <div key={index} className="chart-bar">
                                      {value > 0 && (
                                        <div 
                                          className="bar-fill" 
                                          style={{ 
                                            height: `${Math.max(20, (value / Math.max(...nonZeroData)) * 100)}px`,
                                            backgroundColor: Array.isArray(chart.data.datasets[0].backgroundColor) 
                                              ? chart.data.datasets[0].backgroundColor[index % chart.data.datasets[0].backgroundColor.length]
                                              : chart.data.datasets[0].backgroundColor || '#3b82f6'
                                          }}
                                        />
                                      )}
                                      <div className="bar-value">{value}</div>
                                      <div className="bar-label">{chart.data.labels[index]}</div>
                </div>
              ))}
            </div>
                              );
                            })()}
                          </div>
                        )}
                        
                        {(chart.type === 'pie' || chart.type === 'doughnut') && (
                          <div className="pie-chart">
                            {(() => {
                              const data = chart.data.datasets[0].data;
                              const total = data.reduce((sum: number, val: number) => sum + val, 0);
                              if (total === 0) {
                                return (
                                  <div className="pie-no-data">
                                    <div className="no-data-message">{t('noData')}</div>
                                    <div className="pie-segments">
                                      {data.map((value: number, index: number) => {
                                        const percentage = 0;
                                        return (
                                          <div key={index} className="pie-segment">
                                            <div 
                                              className="segment-color" 
                                              style={{ backgroundColor: Array.isArray(chart.data.datasets[0].backgroundColor) 
                                                ? chart.data.datasets[0].backgroundColor[index % chart.data.datasets[0].backgroundColor.length]
                                                : '#3b82f6'
                                              }}
                                            />
                                            <span className="segment-label">{chart.data.labels[index]}: {value} ({percentage.toFixed(1)}%)</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              return (
                            <div className="pie-container">
                              <div className="pie-svg-container">
                                <svg width="80" height="80" className="pie-svg">
                                  {(() => {
                                    let cumulativePercentage = 0;
                                    const centerX = 40;
                                    const centerY = 40;
                                    const radius = chart.type === 'doughnut' ? 25 : 30;
                                    const innerRadius = chart.type === 'doughnut' ? 12 : 0;
                                    
                                    return data.map((value: number, index: number) => {
                                      if (value === 0) return null;
                                      
                                      const percentage = (value / total) * 100;
                                      const startAngle = (cumulativePercentage / 100) * 360;
                                      const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                                      
                                      const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                                      const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                                      
                                      const x1 = centerX + radius * Math.cos(startAngleRad);
                                      const y1 = centerY + radius * Math.sin(startAngleRad);
                                      const x2 = centerX + radius * Math.cos(endAngleRad);
                                      const y2 = centerY + radius * Math.sin(endAngleRad);
                                      
                                      const x3 = centerX + innerRadius * Math.cos(endAngleRad);
                                      const y3 = centerY + innerRadius * Math.sin(endAngleRad);
                                      const x4 = centerX + innerRadius * Math.cos(startAngleRad);
                                      const y4 = centerY + innerRadius * Math.sin(startAngleRad);
                                      
                                      const largeArcFlag = percentage > 50 ? 1 : 0;
                                      
                                      let pathData;
                                      if (chart.type === 'doughnut') {
                                        pathData = [
                                          `M ${x1} ${y1}`,
                                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                          `L ${x3} ${y3}`,
                                          `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                                          'Z'
                                        ].join(' ');
                                      } else {
                                        pathData = [
                                          `M ${centerX} ${centerY}`,
                                          `L ${x1} ${y1}`,
                                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                          'Z'
                                        ].join(' ');
                                      }
                                      
                                      cumulativePercentage += percentage;
                                      
                                      const colors = Array.isArray(chart.data.datasets[0].backgroundColor) 
                                        ? chart.data.datasets[0].backgroundColor 
                                        : ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];
                                      
                                      return (
                                        <path
                                          key={index}
                                          d={pathData}
                                          fill={colors[index % colors.length]}
                                          stroke="white"
                                          strokeWidth="2"
                                        />
                                      );
                                    });
                                  })()}
                                  {chart.type === 'doughnut' && (
                                    <circle
                                      cx="40"
                                      cy="40"
                                      r="12"
                                      fill="white"
                                      stroke="#e5e7eb"
                                      strokeWidth="2"
                                    />
                                  )}
                                </svg>
                                {chart.type === 'doughnut' && (
                                  <div className="pie-center-overlay">
                                    <div className="pie-total">
                                      {chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)}
                                    </div>
                                    <div className="pie-label">{t('total')}</div>
                                  </div>
                                )}
                              </div>
                              <div className="pie-segments">
                                {chart.data.datasets[0].data.map((value: number, index: number) => {
                                  const total = chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
                                  const percentage = total > 0 ? (value / total) * 100 : 0;
                                  return (
                                    <div key={index} className="pie-segment">
                                      <div 
                                        className="segment-color" 
                                        style={{ backgroundColor: Array.isArray(chart.data.datasets[0].backgroundColor) 
                                          ? chart.data.datasets[0].backgroundColor[index % chart.data.datasets[0].backgroundColor.length]
                                          : '#3b82f6'
                                        }}
                                      />
                                      <span className="segment-label">{chart.data.labels[index]}: {value} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Звіти */}
          <div className="reports-section">
            <div className="reports-header">
              <h3>{t('analyticalReports')}</h3>
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
                        {report.status === 'active' ? t('active') : report.status === 'draft' ? t('draft') : t('archived')}
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
                    <button 
                      className="report-button primary"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <Eye size={16} />
                      <span>{t('view')}</span>
                    </button>
                    <button 
                      className="report-button secondary"
                      onClick={() => handleExportReport(report.id)}
                    >
                      <Download size={16} />
                      <span>{t('export')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

        {/* Модальне вікно для перегляду деталей графіка */}
        {showChartModal && selectedChart && (
          <div className="modal-overlay" onClick={() => setShowChartModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedChart.title}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowChartModal(false)}
                >
                  ×
                    </button>
                  </div>
              <div className="modal-body">
                <div className="chart-details">
                  <div className="chart-info">
                    <p><strong>{t('chartType')}:</strong> {selectedChart.type}</p>
                    <p><strong>{t('dataPoints')}:</strong> {selectedChart.data.labels.length}</p>
                </div>
                  <div className="chart-data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>{t('label')}</th>
                          <th>{t('value')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedChart.data.labels.map((label: string, index: number) => (
                          <tr key={index}>
                            <td>{label}</td>
                            <td>{selectedChart.data.datasets[0].data[index]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
            </div>
          </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальне вікно для налаштувань графіка */}
        {showSettingsModal && selectedChart && (
          <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t('chartSettings')}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowSettingsModal(false)}
                >
                  ×
                </button>
        </div>
              <div className="modal-body">
                <div className="settings-form">
                  <div className="form-group">
                    <label>{t('chartName')}</label>
                    <input 
                      type="text" 
                      value={chartSettings.title} 
                      onChange={(e) => setChartSettings({...chartSettings, title: e.target.value})}
                      placeholder={t('chartNamePlaceholder')}
                    />
      </div>
                  
                  
                  
                  <div className="form-group">
                    <label>{t('colorScheme')}</label>
                    <select 
                      value={chartSettings.colorScheme}
                      onChange={(e) => setChartSettings({...chartSettings, colorScheme: e.target.value})}
                    >
                      <option value="default">{t('defaultColorScheme')}</option>
                      <option value="blue">{t('blueColorScheme')}</option>
                      <option value="green">{t('greenColorScheme')}</option>
                      <option value="purple">{t('purpleColorScheme')}</option>
                      <option value="orange">{t('orangeColorScheme')}</option>
                    </select>
                  </div>
                  
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={chartSettings.showValues}
                        onChange={(e) => setChartSettings({...chartSettings, showValues: e.target.checked})}
                      />
                      <span>{t('showValues')}</span>
                    </label>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        // Зберігаємо налаштування для поточного графіка
                        if (selectedChart) {
                          setChartSettingsMap(prev => ({
                            ...prev,
                            [selectedChart.id]: { ...chartSettings }
                          }));
                        }
                        setShowSettingsModal(false);
                      }}
                    >
                      {t('save')}
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowSettingsModal(false)}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальне вікно для перегляду деталей звіту */}
        {showReportModal && selectedReport && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedReport.name}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowReportModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="report-details">
                  <div className="report-info">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: 'var(--border-radius-lg)', 
                        background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 'var(--space-4)'
                      }}>
                        {selectedReport.icon}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--color-primary-600)', fontSize: '18px' }}>
                          {selectedReport.name}
                        </h3>
                        <p style={{ margin: 'var(--space-1) 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                          {selectedReport.description}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div>
                        <p><strong>{t('category')}:</strong> {selectedReport.category}</p>
                        <p><strong>{t('dataPoints')}:</strong> {selectedReport.dataPoints}</p>
                      </div>
                      <div>
                        <p><strong>{t('status')}:</strong> 
                          <span style={{
                            marginLeft: 'var(--space-2)',
                            padding: '2px 8px',
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: selectedReport.status === 'active' ? 'var(--color-success-100)' : 'var(--color-warning-100)',
                            color: selectedReport.status === 'active' ? 'var(--color-success-600)' : 'var(--color-warning-600)'
                          }}>
                            {selectedReport.status.toUpperCase()}
                          </span>
                        </p>
                        <p><strong>{t('lastUpdated')}:</strong> {new Date(selectedReport.lastUpdated).toLocaleString('uk-UA')}</p>
                      </div>
                    </div>
                  </div>
                  
                  {analyticsData && (
                    <div className="report-data-table">
                      <h3>{t('reportData')}</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>{t('indicator')}</th>
                            <th>{t('value')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.id === 'monthly-summary' && (
                            <>
                              <tr>
                                <td>👥 {t('totalUsers')}</td>
                                <td>{analyticsData.users?.total?.toLocaleString() || '0'}</td>
                              </tr>
                              <tr>
                                <td>💼 {t('totalJobs')}</td>
                                <td>{analyticsData.jobs?.total?.toLocaleString() || '0'}</td>
                              </tr>
                              <tr>
                                <td>📝 {t('totalApplications')}</td>
                                <td>{analyticsData.applications?.total?.toLocaleString() || '0'}</td>
                              </tr>
                              <tr>
                                <td>🎤 {t('totalInterviews')}</td>
                                <td>{analyticsData.interviews?.total?.toLocaleString() || '0'}</td>
                              </tr>
                              <tr>
                                <td>🏢 {t('totalCompanies')}</td>
                                <td>{analyticsData.companies?.total?.toLocaleString() || '0'}</td>
                              </tr>
                            </>
                          )}
                          {selectedReport.id === 'user-engagement' && analyticsData.users && (
                            <>
                              <tr>
                                <td>👥 {t('totalUsers')}</td>
                                <td>{analyticsData.users.total.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>🆕 {t('newUsers')}</td>
                                <td>{analyticsData.users.new.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>✅ {t('activeUsers')}</td>
                                <td>{analyticsData.users.active.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>📈 {t('growthRate')}</td>
                                <td style={{ color: analyticsData.users.growthRate >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)' }}>
                                  {analyticsData.users.growthRate >= 0 ? '↗️ ' : '↘️ '}{analyticsData.users.growthRate}%
                                </td>
                              </tr>
                            </>
                          )}
                          {selectedReport.id === 'recruitment-efficiency' && analyticsData.jobs && analyticsData.applications && (
                            <>
                              <tr>
                                <td>💼 {t('totalJobs')}</td>
                                <td>{analyticsData.jobs.total.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>✅ {t('activeJobs')}</td>
                                <td>{analyticsData.jobs.active.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>📝 {t('totalApplications')}</td>
                                <td>{analyticsData.applications.total.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>🎯 {t('conversionRate')}</td>
                                <td>{analyticsData.applications.conversionRate}%</td>
                              </tr>
                            </>
                          )}
                          {selectedReport.id === 'satisfaction-report' && analyticsData.interviews && (
                            <>
                              <tr>
                                <td>🎤 {t('totalInterviews')}</td>
                                <td>{analyticsData.interviews.total.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>📊 {t('completedInterviews')}</td>
                                <td>{analyticsData.interviews.completed?.toLocaleString() || '0'}</td>
                              </tr>
                              <tr>
                                <td>⏰ {t('averageDuration')}</td>
                                <td>{analyticsData.interviews.averageDuration || '30'} {t('minutes')}</td>
                              </tr>
                              <tr>
                                <td>⭐ {t('averageRating')}</td>
                                <td style={{ color: 'var(--color-primary-600)' }}>
                                  {analyticsData.interviews.averageRating || '4.5'} ⭐
                                </td>
                              </tr>
                            </>
                          )}
                          {selectedReport.id === 'performance-dashboard' && analyticsData.companies && (
                            <>
                              <tr>
                                <td>🏢 {t('totalCompanies')}</td>
                                <td>{analyticsData.companies.total.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>🆕 {t('newCompanies')}</td>
                                <td>{analyticsData.companies.new.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>✅ {t('activeCompanies')}</td>
                                <td>{analyticsData.companies.active.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>📈 {t('growthRate')}</td>
                                <td style={{ color: analyticsData.companies.growthRate >= 0 ? 'var(--color-success-600)' : 'var(--color-error-600)' }}>
                                  {analyticsData.companies.growthRate >= 0 ? '↗️ ' : '↘️ '}{analyticsData.companies.growthRate}%
                                </td>
                              </tr>
                            </>
                          )}
                          {selectedReport.id === 'revenue-analysis' && analyticsData.applications && (
                            <>
                              <tr>
                                <td>💰 {t('totalRevenue')}</td>
                                <td style={{ color: 'var(--color-success-600)' }}>
                                  ${(analyticsData.applications.total * 50).toLocaleString()}
                                </td>
                              </tr>
                              <tr>
                                <td>📝 {t('totalApplications')}</td>
                                <td>{analyticsData.applications.total.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td>💵 {t('averageCostPerApplication')}</td>
                                <td>$50</td>
                              </tr>
                              <tr>
                                <td>📈 {t('nextMonthForecast')}</td>
                                <td style={{ color: 'var(--color-primary-600)' }}>
                                  ${((analyticsData.applications.total * 1.1) * 50).toLocaleString()}
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer" style={{ 
                padding: 'var(--space-4) var(--space-6)', 
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--space-3)',
                background: 'var(--color-gray-25)'
              }}>
                <button 
                  className="btn-primary"
                  onClick={() => handleExportReport(selectedReport.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <Download size={16} />
{t('export')}
                </button>
              </div>
            </div>
          </div>
        )}
    </Layout>
  );
};

export default AnalyticsPage;
