'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { 
  Home,
  Briefcase,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Award,
  UserPlus,
  Brain
} from 'lucide-react';
import { USER_TYPES } from '../../constants';

const Sidebar: React.FC = React.memo(() => {
  const { user } = useAuthStore();
  const { t, initializeLanguage, currentLanguage } = useLanguageStore();
  const pathname = usePathname();
  const router = useRouter();

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // Агресивне попереднє завантаження всіх сторінок
  useEffect(() => {
    const preloadPages = [
      '/dashboard',
      '/jobs',
      '/candidates',
      '/companies',
      '/applications',
      '/interviews',
      '/calendar',
      '/analytics',
      '/ai-matching',
      '/performance',
      '/settings',
      '/help',
      '/docs'
    ];

    // Попереднє завантаження всіх сторінок з невеликою затримкою
    const preloadAll = () => {
      preloadPages.forEach((page, index) => {
        setTimeout(() => {
          router.prefetch(page);
        }, index * 50); // Затримка 50ms між кожним prefetch
      });
    };

    // Запускаємо попереднє завантаження через 1 секунду після завантаження компонента
    const timer = setTimeout(preloadAll, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);

  const navigation = useMemo(() => {
    // Для адмінів показуємо тільки адмін панель
    if ((user?.role as string) === 'admin') {
      return [
        {
          name: 'Admin Panel',
          href: '/admin',
          icon: Home,
          description: 'Admin Panel'
        }
      ];
    }

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

    // Додаємо "Створити профіль" для кандидатів після "Вакансії"
    if (user?.role === USER_TYPES.CANDIDATE) {
      baseNavigation.push({
        name: t('createProfile'),
        href: '/candidates/create',
        icon: UserPlus,
        description: t('createProfile')
      });
    }

    // Додаємо пункти тільки для роботодавців
    if (user?.role === USER_TYPES.EMPLOYER) {
      baseNavigation.push(
        {
          name: t('myJobs'),
          href: '/my-jobs',
          icon: Briefcase,
          description: t('myJobsSubtitle')
        },
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

    // Додаємо календар для всіх (крім адмінів)
    if ((user?.role as string) !== 'admin') {
      baseNavigation.push({
        name: t('calendar'),
        href: '/calendar',
        icon: Calendar,
        description: t('calendar')
      });
    }

    return baseNavigation;
  }, [user?.role, t, currentLanguage]);

  const analytics = useMemo(() => {
    // Analytics тільки для роботодавців (не для адмінів)
    if (user?.role === USER_TYPES.EMPLOYER && (user?.role as string) !== 'admin') {
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
  }, [user?.role, t, currentLanguage]);

  const tools = useMemo(() => {
    // Tools тільки для роботодавців (не для адмінів)
    if (user?.role === USER_TYPES.EMPLOYER && (user?.role as string) !== 'admin') {
      return [
        {
          name: t('settings'),
          href: '/settings',
          icon: Settings,
          description: t('settings')
        }
      ];
    }
    return [];
  }, [user?.role, t, currentLanguage]);

  return (
    <aside className="sidebar" key={currentLanguage}>
      {/* Логотип */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Target className="w-6 h-6" />
        </div>
        <span>TalentFluent</span>
      </div>

      {/* Навігація */}
      <nav className="sidebar-nav">
        {/* Основне */}
        <div className="sidebar-nav-section-title">{t('main')}</div>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
            title={item.description}
            prefetch={true}
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
                href={item.href}
                className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
                title={item.description}
                prefetch={true}
                onClick={() => {}}
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
                href={item.href}
                className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
                title={item.description}
                prefetch={true}
                onClick={() => {}}
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
          href="/help"
          className={`sidebar-nav-item ${isActive('/help') ? 'active' : ''}`}
          title={t('help')}
          prefetch={true}
          onClick={() => {}}
        >
          <HelpCircle className="sidebar-nav-icon" />
          <span>{t('help')}</span>
        </Link>
        <Link
          href="/docs"
          className={`sidebar-nav-item ${isActive('/docs') ? 'active' : ''}`}
          title={t('documentation')}
          prefetch={true}
          onClick={() => {}}
        >
          <BookOpen className="sidebar-nav-icon" />
          <span>{t('documentation')}</span>
        </Link>
      </nav>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;