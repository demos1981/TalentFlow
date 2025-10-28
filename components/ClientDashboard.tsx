'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { aiInsightsService, AIInsight } from '../services/aiInsightsService';
import { DashboardService, DashboardStats, DashboardActivity, DashboardJob, DashboardInsight } from '../services/dashboardService';
import { USER_TYPES } from '../constants';
import { ClientOnly } from './ClientOnly';
import Layout from './Layout/Layout';
import { formatTimeAgo } from '../utils/timeUtils';
import '../app/dashboard/dashboard.css';

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

export const ClientDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { t, currentLanguage, initializeLanguage } = useLanguageStore();
  const router = useRouter();
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  
  // Стан для реальних даних
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<DashboardActivity[]>([]);
  const [topJobs, setTopJobs] = useState<DashboardJob[]>([]);
  const [dashboardInsights, setDashboardInsights] = useState<DashboardInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const fetchInProgress = useRef(false);

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  // Завантаження даних з бекенду
  useEffect(() => {
    if (!user?.id || dataFetched || fetchInProgress.current) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        fetchInProgress.current = true;
        setLoading(true);
        
        // Завантажуємо статистику
        const stats = await DashboardService.getDashboardStats(user.id, user.role);
        setDashboardStats(stats);

        // Завантажуємо активність
        const activities = await DashboardService.getRecentActivities(user.id, user.role);
        setRecentActivities(activities);

        // Завантажуємо рекомендовані вакансії тільки для кандидатів
        if (user?.role === 'candidate') {
          const recommendedJobs = await DashboardService.getRecommendedJobs(user.id);
          setTopJobs(recommendedJobs);
        }

        // Завантажуємо інсайти
        const insights = await DashboardService.getDashboardInsights(user.id, user.role);
        setDashboardInsights(insights);

        setDataFetched(true);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchDashboardData();
  }, [user?.id, user?.role, dataFetched]);

  // Функція для оновлення даних
  const refreshData = () => {
    setDataFetched(false);
    fetchInProgress.current = false;
    setLoading(true);
  };

  // AI Insights effect
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return;

    const fetchInsights = async () => {
      setInsightsLoading(true);
      try {
        const insights = await aiInsightsService.generateLocalInsights(user.id, t);
        setAiInsights(insights);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, [user?.id, isAuthenticated]);

  // Форматування трендів
  const formatTrend = (trend: number | undefined | null) => {
    if (trend === undefined || trend === null || isNaN(trend)) {
      return '0.0%';
    }
    const sign = trend >= 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  // Отримання реальних даних статистики
  const getStats = () => {
    if (!dashboardStats) {
      // Fallback дані якщо ще не завантажились
      return user?.role === USER_TYPES.EMPLOYER ? [
        { name: t('activeJobs'), value: '0', change: '0%', changeType: 'neutral', icon: Briefcase, color: 'blue' },
        { name: t('candidates'), value: '0', change: '0%', changeType: 'neutral', icon: Users, color: 'green' },
        { name: t('interviews'), value: '0', change: '0%', changeType: 'neutral', icon: Calendar, color: 'purple' },
        { name: t('conversion'), value: '0%', change: '0%', changeType: 'neutral', icon: TrendingUp, color: 'orange' }
      ] : [
        { name: t('applicationsSubmitted'), value: '0', change: '0%', changeType: 'neutral', icon: FileText, color: 'blue' },
        { name: t('views'), value: '0', change: '0%', changeType: 'neutral', icon: MessageSquare, color: 'green' },
        { name: t('interviews'), value: '0', change: '0%', changeType: 'neutral', icon: Calendar, color: 'purple' },
        { name: t('offers'), value: '0', change: '0%', changeType: 'neutral', icon: Star, color: 'orange' }
      ];
    }

    if (user?.role === USER_TYPES.EMPLOYER) {
      return [
        {
          name: t('activeJobs'),
          value: dashboardStats.activeJobs.toString(),
          change: formatTrend(dashboardStats.activeJobsTrend),
          changeType: dashboardStats.activeJobsTrend && dashboardStats.activeJobsTrend > 0 ? 'positive' : 'neutral',
          icon: Briefcase,
          color: 'blue'
        },
        {
          name: t('candidates'),
          value: dashboardStats.candidates.toString(),
          change: formatTrend(dashboardStats.candidatesTrend),
          changeType: dashboardStats.candidatesTrend && dashboardStats.candidatesTrend > 0 ? 'positive' : 'neutral',
          icon: Users,
          color: 'green'
        },
        {
          name: t('interviews'),
          value: dashboardStats.interviews.toString(),
          change: formatTrend(dashboardStats.interviewsTrend),
          changeType: dashboardStats.interviewsTrend && dashboardStats.interviewsTrend > 0 ? 'positive' : 'neutral',
          icon: Calendar,
          color: 'purple'
        },
        {
          name: t('conversion'),
          value: `${dashboardStats.conversionRate}%`,
          change: formatTrend(dashboardStats.conversionRateTrend),
          changeType: dashboardStats.conversionRateTrend && dashboardStats.conversionRateTrend > 0 ? 'positive' : 'neutral',
          icon: TrendingUp,
          color: 'orange'
        }
      ];
    } else {
      return [
        {
          name: t('applicationsSubmitted'),
          value: dashboardStats.applications.toString(),
          change: formatTrend(dashboardStats.applicationsTrend),
          changeType: dashboardStats.applicationsTrend && dashboardStats.applicationsTrend > 0 ? 'positive' : 'neutral',
          icon: FileText,
          color: 'blue'
        },
        {
          name: t('views'),
          value: dashboardStats.views.toString(),
          change: formatTrend(dashboardStats.viewsTrend),
          changeType: dashboardStats.viewsTrend && dashboardStats.viewsTrend > 0 ? 'positive' : 'neutral',
          icon: MessageSquare,
          color: 'green'
        },
        {
          name: t('interviews'),
          value: dashboardStats.interviews.toString(),
          change: formatTrend(dashboardStats.interviewsTrend),
          changeType: dashboardStats.interviewsTrend && dashboardStats.interviewsTrend > 0 ? 'positive' : 'neutral',
          icon: Calendar,
          color: 'purple'
        },
        {
          name: t('offers'),
          value: dashboardStats.offers.toString(),
          change: formatTrend(dashboardStats.offersTrend),
          changeType: dashboardStats.offersTrend && dashboardStats.offersTrend > 0 ? 'positive' : 'neutral',
          icon: Star,
          color: 'orange'
        }
      ];
    }
  };


  const getRecentActivity = () => {
    // Використовуємо тільки реальні дані з бекенду
    return recentActivities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      time: activity.time,
      icon: activity.type === 'application' ? FileText : 
            activity.type === 'interview' ? Calendar : 
            activity.type === 'hired' ? CheckCircle : Star,
      color: activity.type === 'application' ? 'blue' : 
             activity.type === 'interview' ? 'green' : 
             activity.type === 'hired' ? 'purple' : 'orange'
    }));
  };

  const getUpcomingEvents = (): Array<{
    id: number;
    title: string;
    time: string;
    date: string;
    type: string;
    candidate: string;
    position: string;
  }> => {
    // Поки що повертаємо порожній масив - можна додати реальні дані пізніше
    return [];
  };

  const stats = getStats();
  const recentActivity = getRecentActivity();
  const upcomingEvents = getUpcomingEvents();

  // Тепер AuthGuard контролює авторизацію, тому просто рендеримо дашборд

  return (
    <ClientOnly>
      {/* Основний контент dashboard */}
      <Layout>
          <div className="dashboard-page">
            {/* Header */}
            <div className="dashboard-header">
              <div className="dashboard-header-content">
                <h1>{t('dashboardTitle')}</h1>
                <p>{t('dashboardSubtitle')}</p>
              </div>
              <div className="dashboard-header-actions">
                {/* Кнопка "Створити профіль" для кандидатів */}
                {user?.role === USER_TYPES.CANDIDATE && (
                  <Link 
                    href="/candidates/create" 
                    className="add-dashboard-btn create-profile-btn"
                  >
                    <UserPlus className="icon" />
                    {t('createProfile')}
                  </Link>
                )}
                {/* Кнопка "Створити вакансію" для роботодавців */}
                {user?.role === USER_TYPES.EMPLOYER && (
                  <Link 
                    href="/jobs/create" 
                    className="add-dashboard-btn"
                  >
                    <Plus className="icon" />
                    {t('createVacancy')}
                  </Link>
                )}
                {/* Кнопка "Знайти роботу" для кандидатів */}
                {user?.role === USER_TYPES.CANDIDATE && (
                  <Link 
                    href="/jobs" 
                    className="add-dashboard-btn find-job-btn"
                  >
                    <Search className="icon" />
                    {t('findJob')}
                  </Link>
                )}
              </div>
            </div>

            {/* AI Insights Section */}
            {aiInsights.length > 0 && (
              <div className="dashboard-section">
                <div className="dashboard-section-header">
                  <div>
                  <h2 className="dashboard-section-title">
                    <Target className="dashboard-section-icon" />
                      {t('aiRecommendations')}
                  </h2>
                  <p className="dashboard-section-subtitle">
                      {t('aiRecommendationsSubtitle')}
                  </p>
                  </div>
                </div>
                <div className="ai-insights-grid">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="ai-insight-card">
                      <div className="ai-insight-header">
                        <div className="ai-insight-icon">
                          {insight.rating === 'high' && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {insight.rating === 'medium' && <Clock className="w-5 h-5 text-yellow-500" />}
                          {insight.rating === 'low' && <Eye className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="ai-insight-priority">
                          {insight.rating === 'high' && <span className="priority-high">{t('high')}</span>}
                          {insight.rating === 'medium' && <span className="priority-medium">{t('medium')}</span>}
                          {insight.rating === 'low' && <span className="priority-low">{t('low')}</span>}
                        </div>
                      </div>
                      <h3 className="ai-insight-title">{insight.title}</h3>
                      <p className="ai-insight-description">{insight.description}</p>
                      {insight.action && (
                        <button className="ai-insight-action">
                          {insight.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <TrendingUp className="dashboard-section-icon" />
                  {t('statistics')}
                </h2>
              </div>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-header">
                      <div className={`stat-icon stat-icon-${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className={`stat-change stat-change-${stat.changeType}`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-name">{stat.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <MessageSquare className="dashboard-section-icon" />
                  {t('recentActivity')}
                </h2>
              </div>
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon activity-icon-${activity.color}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="activity-content">
                      <h3 className="activity-title">{activity.title}</h3>
                      <p className="activity-description">{activity.description}</p>
                      <span className="activity-time">
                        {typeof activity.time === 'string' && /[а-яёіїєґ]/i.test(activity.time) 
                          ? activity.time 
                          : formatTimeAgo(activity.time, (key: string) => t(key as any), currentLanguage)
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events - показуємо тільки якщо є події */}
            {upcomingEvents.length > 0 && (
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <Calendar className="dashboard-section-icon" />
                  {t('upcomingEvents')}
                </h2>
              </div>
              <div className="events-list">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">
                      <div className="event-time-text">
                        {typeof event.time === 'string' && /[а-яёіїєґ]/i.test(event.time) 
                          ? event.time 
                          : formatTimeAgo(event.time, (key: string) => t(key as any), currentLanguage)
                        }
                      </div>
                      <div className="event-date-text">{event.date}</div>
                    </div>
                    <div className="event-content">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description">
                        {event.candidate} - {event.position}
                      </p>
                    </div>
                    <div className="event-actions">
                      <button className="event-action-btn">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Recommended Jobs Section - only for candidates */}
            {user?.role === USER_TYPES.CANDIDATE && topJobs.length > 0 && (
              <div className="dashboard-section">
                <div className="dashboard-section-header">
                  <h2 className="dashboard-section-title">
                    <Briefcase className="dashboard-section-icon" />
                    {t('recommendedJobs')}
                  </h2>
                </div>
                <div className="jobs-grid">
                  {topJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="job-card">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>
                        <span className="job-company">{job.company}</span>
                      </div>
                      <div className="job-details">
                        <span className="job-views">{job.views} {t('views')}</span>
                        <span className="job-applications">{job.applications} {t('applications')}</span>
                        <span className="job-status">{job.status}</span>
                      </div>
                      <div className="job-actions">
                        <Link href={`/jobs/${job.id}`} className="job-view-btn">
                          <Eye className="w-4 h-4" />
                          {t('viewJob')}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dashboard-section-footer">
                  <Link href={(user?.role as string) === USER_TYPES.EMPLOYER ? '/my-jobs' : '/jobs'} className="view-all-link">
                    {t('viewAllJobs')}
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <Briefcase className="dashboard-section-icon" />
                  {t('quickActions')}
                </h2>
              </div>
              <div className="quick-actions-grid">
                {user?.role === USER_TYPES.EMPLOYER ? (
                  <>
                    <Link href="/jobs/create" className="quick-action-card">
                      <Plus className="quick-action-icon" />
                      <h3>{t('createVacancy')}</h3>
                      <p>{t('publishNewVacancy')}</p>
                    </Link>
                    <Link href="/candidates" className="quick-action-card">
                      <Search className="quick-action-icon" />
                      <h3>{t('findCandidates')}</h3>
                      <p>{t('searchBySkillsAndExperience')}</p>
                    </Link>
                    <Link href="/interviews" className="quick-action-card">
                      <Calendar className="quick-action-icon" />
                      <h3>{t('scheduleInterview')}</h3>
                      <p>{t('createNewInterview')}</p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/candidates/create" className="quick-action-card">
                      <UserPlus className="quick-action-icon" />
                      <h3>{t('createProfile')}</h3>
                      <p>{t('createYourProfileSubtitle')}</p>
                    </Link>
                    <Link href="/jobs" className="quick-action-card">
                      <Search className="quick-action-icon" />
                      <h3>{t('findJob')}</h3>
                      <p>{t('viewAvailableJobs')}</p>
                    </Link>
                    <Link href="/applications" className="quick-action-card">
                      <Building2 className="quick-action-icon" />
                      <h3>{t('myApplications')}</h3>
                      <p>{t('viewApplicationStatus')}</p>
                    </Link>
                    <Link href="/interviews" className="quick-action-card">
                      <Calendar className="quick-action-icon" />
                      <h3>{t('myInterviews')}</h3>
                      <p>{t('scheduledMeetings')}</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Layout>
    </ClientOnly>
  );
};
