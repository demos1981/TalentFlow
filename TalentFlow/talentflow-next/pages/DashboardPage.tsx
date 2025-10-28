import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { aiInsightsService, AIInsight } from '../services/aiInsightsService';
import { DashboardService, DashboardStats, DashboardActivity, DashboardJob, DashboardInsight } from '../services/dashboardService';
import { USER_TYPES } from '../constants';
import { formatTimeAgo } from '../utils/timeUtils';
import '../styles/dashboard-fix.css';

import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Target,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  Eye,
  FileText,
  Building2,
  Plus,
  Search,
  UserPlus
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  console.log('🎯 DashboardPage: Component rendering...');
  
  const { user } = useAuthStore();
  const { t, currentLanguage, initializeLanguage } = useLanguageStore();
  const router = useRouter();


  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  // Стан для реальних даних
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<DashboardActivity[]>([]);
  const [topJobs, setTopJobs] = useState<DashboardJob[]>([]);
  const [dashboardInsights, setDashboardInsights] = useState<DashboardInsight[]>([]);
  const [loading, setLoading] = useState(true);

  // Завантаження даних з бекенду
  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('🔍 Dashboard: Starting data fetch...');
      console.log('👤 User:', user);
      console.log('🆔 User ID:', user?.id);
      console.log('🎭 User Role:', user?.role);
      
      if (!user?.id) {
        console.log('❌ Dashboard: No user ID, skipping data fetch');
        return;
      }

      try {
        setLoading(true);
        console.log('📊 Dashboard: Fetching stats...');
        
        // Завантажуємо статистику
        const stats = await DashboardService.getDashboardStats(user.id, user.role);
        console.log('📈 Dashboard: Stats received:', stats);
        setDashboardStats(stats);

        // Завантажуємо активність
        const activities = await DashboardService.getRecentActivities(user.id, user.role);
        setRecentActivities(activities);

        // Завантажуємо вакансії
        if (user.role === USER_TYPES.EMPLOYER) {
          const jobs = await DashboardService.getTopJobs(user.id, user.role);
          setTopJobs(jobs);
        } else if (user.role === USER_TYPES.CANDIDATE) {
          const recommendedJobs = await DashboardService.getRecommendedJobs(user.id);
          setTopJobs(recommendedJobs);
        }

        // Завантажуємо інсайти
        const insights = await DashboardService.getDashboardInsights(user.id, user.role);
        setDashboardInsights(insights);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, user?.role]);

  // Форматування трендів
  const formatTrend = (trend: number | undefined | null) => {
    if (trend === undefined || trend === null || isNaN(trend)) {
      return '0%';
    }
    const sign = trend >= 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  // Форматування статистики для відображення
  const getStats = () => {
    if (!dashboardStats) return [];

    if (user?.role === USER_TYPES.EMPLOYER) {
      return [
        {
          name: t('activeJobs'),
          value: dashboardStats.activeJobs.toString(),
          change: formatTrend(dashboardStats.activeJobsTrend),
          changeType: (dashboardStats.activeJobsTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: Briefcase,
          colorClass: 'blue',
        },
        {
          name: t('candidates'),
          value: dashboardStats.candidates.toString(),
          change: formatTrend(dashboardStats.candidatesTrend),
          changeType: (dashboardStats.candidatesTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: Users,
          colorClass: 'green',
        },
        {
          name: t('applications'),
          value: dashboardStats.applications.toString(),
          change: formatTrend(dashboardStats.applicationsTrend),
          changeType: (dashboardStats.applicationsTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: FileText,
          colorClass: 'purple',
        },
        {
          name: t('interviews'),
          value: dashboardStats.interviews.toString(),
          change: formatTrend(dashboardStats.interviewsTrend),
          changeType: (dashboardStats.interviewsTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: MessageSquare,
          colorClass: 'orange',
        },
      ];
    } else if (user?.role === USER_TYPES.CANDIDATE) {
      return [
        {
          name: t('viewedJobs'),
          value: dashboardStats.views.toString(),
          change: formatTrend(dashboardStats.viewsTrend),
          changeType: (dashboardStats.viewsTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: Eye,
          colorClass: 'blue',
        },
        {
          name: t('submittedApplications'),
          value: dashboardStats.applications.toString(),
          change: formatTrend(dashboardStats.applicationsTrend),
          changeType: (dashboardStats.applicationsTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: FileText,
          colorClass: 'green',
        },
        {
          name: t('interviews'),
          value: dashboardStats.interviews.toString(),
          change: formatTrend(dashboardStats.interviewsTrend),
          changeType: (dashboardStats.interviewsTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: MessageSquare,
          colorClass: 'purple',
        },
        {
          name: t('offers'),
          value: dashboardStats.offers.toString(),
          change: formatTrend(dashboardStats.offersTrend),
          changeType: (dashboardStats.offersTrend || 0) >= 0 ? 'positive' : 'negative',
          icon: CheckCircle,
          colorClass: 'orange',
        },
      ];
    }
    return [];
  };

  const stats = getStats();

  // Використовуємо реальні дані з бекенду
  const activities = recentActivities;

  // Використовуємо реальні дані з бекенду
  const jobs = topJobs;

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.id) return;
      
      try {
        setInsightsLoading(true);
        const insights = await aiInsightsService.generateLocalInsights(user.id, t);
        setAiInsights(insights);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
        // Якщо не вдалося отримати інсайти, показуємо fallback
        const fallbackInsights = await aiInsightsService.generateLocalInsights(user.id, t);
        setAiInsights(fallbackInsights);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, [user?.id]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <FileText className="icon" />;
      case 'interview':
        return <Calendar className="icon" />;
      case 'hired':
        return <CheckCircle className="icon" />;
      case 'job':
        return <Briefcase className="icon" />;
      default:
        return <FileText className="icon" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'var(--color-success-500)';
      case 'scheduled':
        return 'var(--color-warning-500)';
      case 'completed':
        return 'var(--color-primary-500)';
      case 'published':
        return 'var(--color-info-500)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateEvent = () => {
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const handleCreateTestJob = () => {
    router.push('/jobs/create');
  };


  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            {t('welcome')}, {user?.firstName || t('user')}! 👋
          </h1>
          <p className="dashboard-greeting-subtitle">
            {t('dashboardSubtitle')}
          </p>
          <div className="dashboard-actions">
            {/* Кнопки тільки для роботодавців */}
            {user?.role === USER_TYPES.EMPLOYER && (
              <>
                <button className="btn btn-primary" onClick={() => router.push('/jobs/create')}>
                  <Plus className="icon" />
                  {t('createJob')}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => router.push('/candidates/search')}
                >
                  <Users className="icon" />
                  {t('findCandidates')}
                </button>
              </>
            )}
            
            {/* Кнопки для кандидатів */}
            {user?.role === USER_TYPES.CANDIDATE && (
              <>
                <button className="btn btn-secondary" onClick={() => router.push('/candidates/create')}>
                  <UserPlus className="icon" />
                  {t('createProfile')}
                </button>
                <button className="btn btn-primary" onClick={() => window.location.href = '/jobs'}>
                  <Search className="icon" />
                  {t('findJob')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-summary-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="summary-card">
              <div className="summary-card-icon">
                <IconComponent className="icon" />
              </div>
              <span className="summary-card-label">{stat.name}</span>
              <span className="summary-card-value">{stat.value}</span>
              <span className={`summary-card-change ${stat.changeType === 'negative' ? 'negative' : ''}`}>
                {stat.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="main-content-area">
        {/* Ліва колонка - основний контент */}
        <div className="content-left">
          {/* Recent Activities */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">{t('recentActivity')}</h2>
            <ul className="activity-list">
              {loading ? (
                <li className="activity-item">{t('loadingActivities')}</li>
              ) : activities.length === 0 ? (
                <li className="activity-item">{t('noRecentActivity')}</li>
              ) : (
                activities.map((activity) => (
                <li key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-time">
                      {typeof activity.time === 'string' && /[а-яёіїєґ]/i.test(activity.time) 
                        ? activity.time 
                        : formatTimeAgo(activity.time, (key: string) => t(key as any), currentLanguage)
                      }
                    </div>
                  </div>
                </li>
                ))
              )}
            </ul>
            <a href="/activities" className="view-all-link">
              {t('viewAll')}
            </a>
          </div>

          {/* AI Insights для роботодавців */}
          {user?.role === USER_TYPES.EMPLOYER && (
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">{t('aiInsights')}</h2>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    if (user?.id) {
                      aiInsightsService.generateLocalInsights(user.id, t).then(setAiInsights);
                    }
                  }}
                  disabled={insightsLoading}
                >
                  {insightsLoading ? t('updatingInsights') : t('updateInsights')}
                </button>
              </div>
              <ul className="ai-insights-list">
                {loading ? (
                  <li className="insight-item">{t('loadingInsights')}</li>
                ) : dashboardInsights.length === 0 ? (
                  <li className="insight-item">{t('noInsights')}</li>
                ) : (
                  dashboardInsights.map((insight) => (
                    <li key={insight.id} className="insight-item">
                      <div className="insight-item-header">
                        <h3 className="insight-item-title">{insight.title}</h3>
                        <span className={`insight-item-rating ${insight.rating}`}>
                          {insight.rating === 'high' ? t('high') : insight.rating === 'medium' ? t('medium') : t('low')}
                        </span>
                      </div>
                      <p className="insight-item-description">{insight.description}</p>
                      <button 
                        className="insight-item-link"
                        onClick={() => {
                          if (insight.action.includes('вакансію') || insight.action.includes('вакансії')) {
                            router.push('/jobs/create');
                          } else if (insight.action.includes('пошук')) {
                            router.push('/candidates/search');
                          } else if (insight.action.includes('AI matching')) {
                            router.push('/ai-matching');
                          } else {
                            // За замовчуванням перенаправляємо на створення вакансії
                            router.push('/jobs/create');
                          }
                        }}
                      >
                        {insight.action}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          
          {/* Корисні поради для кандидатів */}
          {user?.role === USER_TYPES.CANDIDATE && (
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">{t('usefulTips')}</h2>
              <ul className="ai-insights-list">
                <li className="insight-item">
                  <div className="insight-item-header">
                    <h3 className="insight-item-title">{t('updateProfile')}</h3>
                    <span className="insight-item-rating high">{t('high')}</span>
                  </div>
                  <p className="insight-item-description">{t('updateProfileDescription')}</p>
                  <a href="/profile" className="insight-item-link">
                    {t('updateProfile')}
                  </a>
                </li>
                <li className="insight-item">
                  <div className="insight-item-header">
                    <h3 className="insight-item-title">{t('activity')}</h3>
                    <span className="insight-item-rating medium">{t('medium')}</span>
                  </div>
                  <p className="insight-item-description">{t('activityDescription')}</p>
                  <a href="/jobs" className="insight-item-link">
                    {t('viewJobs')}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Права колонка - sidebar */}
        <div className="content-right">
          {/* Top Vacancies для роботодавців */}
          {user?.role === USER_TYPES.EMPLOYER && (
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">{t('topJobs')}</h2>
              <ul className="job-list">
                {loading ? (
                  <li className="job-item">{t('loadingJobs')}</li>
                ) : jobs.length === 0 ? (
                  <li className="job-item">{t('noJobs')}</li>
                ) : (
                  jobs.map((job) => (
                  <li key={job.id} className="job-item">
                    <div className="job-header">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                      </div>
                    </div>
                    <div className="job-stats">
                      <span className="job-stat">
                        <Eye className="icon" />
                        {job.views}
                      </span>
                      <span className="job-stat">
                        <FileText className="icon" />
                        {job.applications}
                      </span>
                      <span className="job-stat">
                        <CheckCircle className="icon" />
                        {job.matchRate}%
                      </span>
                    </div>
                  </li>
                  ))
                )}
              </ul>
            </div>
          )}
          
          {/* Рекомендовані вакансії для кандидатів */}
          {user?.role === USER_TYPES.CANDIDATE && (
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">{t('recommendedJobs')}</h2>
              <ul className="job-list">
                {loading ? (
                  <li className="job-item">{t('loadingRecommendations')}</li>
                ) : jobs.length === 0 ? (
                  <li className="job-item">{t('noRecommendations')}</li>
                ) : (
                  jobs.slice(0, 3).map((job) => (
                  <li key={job.id} className="job-item">
                    <div className="job-header">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                      </div>
                    </div>
                    <div className="job-stats">
                      <span className="job-stat">
                        <Star className="icon" />
                          {job.matchRate}% {t('match')}
                      </span>
                    </div>
                  </li>
                  ))
                )}
              </ul>
              <a href="/jobs" className="view-all-link">
                {t('viewAllJobs')}
              </a>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default DashboardPage;
