import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Home,
  Briefcase,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getNavigation = () => {
    const baseNavigation = [
      {
        name: t('dashboard'),
        href: '/dashboard',
        icon: Home,
        description: t('dashboard')
      },
      {
        name: t('jobs'),
        href: '/jobs',
        icon: Briefcase,
        description: t('jobs')
      }
    ];

    // Додаємо пункти тільки для роботодавців
    if (user?.role === 'employer') {
      baseNavigation.push(
        {
          name: t('candidates'),
          href: '/candidates',
          icon: Users,
          description: t('candidates')
        },
        {
          name: t('companies'),
          href: '/companies',
          icon: Building2,
          description: t('companies')
        },
        {
          name: t('applications'),
          href: '/applications',
          icon: FileText,
          description: t('applications')
        },
        {
          name: t('interviews'),
          href: '/interviews',
          icon: MessageSquare,
          description: t('interviews')
        }
      );
    }

    // Додаємо календар для всіх
    baseNavigation.push({
      name: t('calendar'),
      href: '/calendar',
      icon: Calendar,
      description: t('calendar')
    });

    return baseNavigation;
  };

  const navigation = getNavigation();

  const getAnalytics = () => {
    // Analytics тільки для роботодавців
    if (user?.role === 'employer') {
      return [
        {
          name: t('analytics'),
          href: '/analytics',
          icon: BarChart3,
          description: t('analytics')
        },
        {
          name: t('aiMatching'),
          href: '/ai-matching',
          icon: Target,
          description: t('aiMatching')
        },
        {
          name: t('performance'),
          href: '/performance',
          icon: TrendingUp,
          description: t('performance')
        }
      ];
    }
    return [];
  };

  const analytics = getAnalytics();

  const getTools = () => {
    // Tools тільки для роботодавців
    if (user?.role === 'employer') {
      return [
        {
          name: t('integrations'),
          href: '/integrations',
          icon: CreditCard,
          description: t('integrations')
        },
        {
          name: t('settings'),
          href: '/settings',
          icon: Settings,
          description: t('settings')
        }
      ];
    }
    return [];
  };

  const tools = getTools();

  return (
    <aside className="sidebar">
      {/* Логотип */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Target className="w-6 h-6" />
        </div>
        <span>TalentFlow</span>
      </div>

      {/* Навігація */}
      <nav className="sidebar-nav">
        {/* Основне */}
        <div className="sidebar-nav-section-title">{t('main')}</div>
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
            title={item.description}
          >
            <item.icon className="sidebar-nav-icon" />
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Аналітика */}
        {analytics.length > 0 && (
          <>
            <div className="sidebar-nav-section-title">{t('analytics')}</div>
            {analytics.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
                title={item.description}
              >
                <item.icon className="sidebar-nav-icon" />
                <span>{item.name}</span>
              </Link>
            ))}
          </>
        )}

        {/* Інструменти */}
        {tools.length > 0 && (
          <>
            <div className="sidebar-nav-section-title">{t('tools')}</div>
            {tools.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
                title={item.description}
              >
                <item.icon className="sidebar-nav-icon" />
                <span>{item.name}</span>
              </Link>
            ))}
          </>
        )}

        {/* Допомога */}
        <div className="sidebar-nav-section-title">{t('help')}</div>
        <Link
          to="/help"
          className={`sidebar-nav-item ${isActive('/help') ? 'active' : ''}`}
          title={t('help')}
        >
          <HelpCircle className="sidebar-nav-icon" />
          <span>{t('help')}</span>
        </Link>
        <Link
          to="/docs"
          className={`sidebar-nav-item ${isActive('/docs') ? 'active' : ''}`}
          title={t('documentation')}
        >
          <BookOpen className="sidebar-nav-icon" />
          <span>{t('documentation')}</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
