import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { aiInsightsService, AIInsight } from '../services/aiInsightsService';
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
  Search
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Мокові дані для демонстрації
  const getStats = () => {
    if (user?.role === 'employer') {
      return [
        {
          name: 'Активні вакансії',
          value: '24',
          change: '+12%',
          changeType: 'positive',
          icon: Briefcase,
          colorClass: 'blue',
        },
        {
          name: 'Кандидати',
          value: '156',
          change: '+8%',
          changeType: 'positive',
          icon: Users,
          colorClass: 'green',
        },
        {
          name: 'Заявки',
          value: '89',
          change: '+23%',
          changeType: 'positive',
          icon: FileText,
          colorClass: 'purple',
        },
        {
          name: 'Інтерв\'ю',
          value: '12',
          change: '+5%',
          changeType: 'positive',
          icon: MessageSquare,
          colorClass: 'orange',
        },
      ];
    } else if (user?.role === 'candidate') {
      return [
        {
          name: 'Переглянуті вакансії',
          value: '12',
          change: '+3%',
          changeType: 'positive',
          icon: Eye,
          colorClass: 'blue',
        },
        {
          name: 'Подані заявки',
          value: '8',
          change: '+2%',
          changeType: 'positive',
          icon: FileText,
          colorClass: 'green',
        },
        {
          name: 'Інтерв\'ю',
          value: '3',
          change: '+1%',
          changeType: 'positive',
          icon: MessageSquare,
          colorClass: 'purple',
        },
        {
          name: 'Оффери',
          value: '1',
          change: '0%',
          changeType: 'neutral',
          icon: CheckCircle,
          colorClass: 'orange',
        },
      ];
    }
    return [];
  };

  const stats = getStats();

  const getRecentActivities = () => {
    if (user?.role === 'employer') {
      return [
        {
          id: 1,
          type: 'application',
          title: 'Нова заявка на вакансію',
          description: 'Іван Петренко подав заявку на позицію Senior Developer',
          time: '2 хвилини тому',
          status: 'new',
        },
        {
          id: 2,
          type: 'interview',
          title: 'Заплановано інтерв\'ю',
          description: 'Інтерв\'ю з Марією Коваленко на 15:00',
          time: '1 годину тому',
          status: 'scheduled',
        },
        {
          id: 3,
          type: 'hired',
          title: 'Успішний найм',
          description: 'Олександр Сидоренко прийнятий на позицію Product Manager',
          time: '3 години тому',
          status: 'completed',
        },
        {
          id: 4,
          type: 'job',
          title: 'Опубліковано вакансію',
          description: 'Вакансія "UX Designer" опублікована',
          time: '5 годин тому',
          status: 'published',
        },
      ];
    } else if (user?.role === 'candidate') {
      return [
        {
          id: 1,
          type: 'application',
          title: 'Заявка подана',
          description: 'Ваша заявка на позицію Senior Developer подана',
          time: '2 хвилини тому',
          status: 'submitted',
        },
        {
          id: 2,
          type: 'interview',
          title: 'Інтерв\'ю заплановано',
          description: 'Інтерв\'ю з TechCorp заплановано на 15:00',
          time: '1 годину тому',
          status: 'scheduled',
        },
        {
          id: 3,
          type: 'offer',
          title: 'Оффер отримано',
          description: 'Отримано оффер від TechCorp на позицію Product Manager',
          time: '3 години тому',
          status: 'received',
        },
        {
          id: 4,
          type: 'view',
          title: 'Профіль переглянуто',
          description: 'Ваш профіль переглянуто компанією TechCorp',
          time: '5 годин тому',
          status: 'viewed',
        },
      ];
    }
    return [];
  };

  const recentActivities = getRecentActivities();

  const topJobs = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp',
      views: 245,
      applications: 18,
      status: 'active',
      matchRate: 92,
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'DesignStudio',
      views: 189,
      applications: 12,
      status: 'active',
      matchRate: 88,
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupHub',
      views: 156,
      applications: 9,
      status: 'active',
      matchRate: 85,
    },
  ];

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.id) return;
      
      try {
        setInsightsLoading(true);
        const insights = await aiInsightsService.generateLocalInsights(user.id);
        setAiInsights(insights);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
        // Якщо не вдалося отримати інсайти, показуємо fallback
        const fallbackInsights = await aiInsightsService.generateLocalInsights(user.id);
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
    navigate('/jobs/create');
  };


  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            Вітаємо, {user?.firstName || 'Користувач'}! 👋
          </h1>
          <p className="dashboard-greeting-subtitle">
            Ось що відбувається з вашим наймом сьогодні
          </p>
          <div className="dashboard-actions">
            {/* Кнопки тільки для роботодавців */}
            {user?.role === 'employer' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/jobs/create')}>
                  <Plus className="icon" />
                  Створити вакансію
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/candidates/search')}
                >
                  <Users className="icon" />
                  Знайти кандидатів
                </button>
              </>
            )}
            
            {/* Кнопки для кандидатів */}
            {user?.role === 'candidate' && (
              <button className="btn btn-primary" onClick={() => window.location.href = '/jobs'}>
                <Search className="icon" />
                Знайти роботу
              </button>
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
            <h2 className="dashboard-section-title">Остання активність</h2>
            <ul className="activity-list">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </li>
              ))}
            </ul>
            <a href="/activities" className="view-all-link">
              Переглянути всі
            </a>
          </div>

          {/* AI Insights для роботодавців */}
          {user?.role === 'employer' && (
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">AI Інсайти</h2>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    if (user?.id) {
                      aiInsightsService.generateLocalInsights(user.id).then(setAiInsights);
                    }
                  }}
                  disabled={insightsLoading}
                >
                  {insightsLoading ? 'Оновлення...' : 'Оновити'}
                </button>
              </div>
              <ul className="ai-insights-list">
                {insightsLoading ? (
                  <li className="insight-item">Завантаження інсайтів...</li>
                ) : aiInsights.length === 0 ? (
                  <li className="insight-item">Немає доступних інсайтів.</li>
                ) : (
                  aiInsights.map((insight) => (
                    <li key={insight.id} className="insight-item">
                      <div className="insight-item-header">
                        <h3 className="insight-item-title">{insight.title}</h3>
                        <span className={`insight-item-rating ${insight.rating}`}>
                          {insight.rating === 'high' ? 'Високий' : insight.rating === 'medium' ? 'Середній' : 'Низький'}
                        </span>
                      </div>
                      <p className="insight-item-description">{insight.description}</p>
                      <button 
                        className="insight-item-link"
                        onClick={() => {
                          if (insight.action.includes('вакансію') || insight.action.includes('вакансії')) {
                            navigate('/jobs/create');
                          } else if (insight.action.includes('пошук')) {
                            navigate('/candidates/search');
                          } else if (insight.action.includes('AI matching')) {
                            navigate('/ai-matching');
                          } else {
                            // За замовчуванням перенаправляємо на створення вакансії
                            navigate('/jobs/create');
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
          {user?.role === 'candidate' && (
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Корисні поради</h2>
              <ul className="ai-insights-list">
                <li className="insight-item">
                  <div className="insight-item-header">
                    <h3 className="insight-item-title">Оновіть профіль</h3>
                    <span className="insight-item-rating high">Важливо</span>
                  </div>
                  <p className="insight-item-description">Додайте нові навички та досвід для кращого матчингу з вакансіями</p>
                  <a href="/profile" className="insight-item-link">
                    Оновити профіль
                  </a>
                </li>
                <li className="insight-item">
                  <div className="insight-item-header">
                    <h3 className="insight-item-title">Активність</h3>
                    <span className="insight-item-rating medium">Середньо</span>
                  </div>
                  <p className="insight-item-description">Регулярно переглядайте нові вакансії та подавайте заявки</p>
                  <a href="/jobs" className="insight-item-link">
                    Переглянути вакансії
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Права колонка - sidebar */}
        <div className="content-right">
          {/* Top Vacancies для роботодавців */}
          {user?.role === 'employer' && (
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Топ вакансії</h2>
              <ul className="job-list">
                {topJobs.map((job) => (
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
                ))}
              </ul>
            </div>
          )}
          
          {/* Рекомендовані вакансії для кандидатів */}
          {user?.role === 'candidate' && (
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Рекомендовані вакансії</h2>
              <ul className="job-list">
                {topJobs.slice(0, 3).map((job) => (
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
                        {job.matchRate}% match
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <a href="/jobs" className="view-all-link">
                Переглянути всі вакансії
              </a>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default DashboardPage;
