'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import NotificationBell from './NotificationBell';
import HeaderLanguageSwitcher from '../UI/HeaderLanguageSwitcher';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Users,
  CreditCard,
  Mail
} from 'lucide-react';
import { USER_TYPES } from '../../constants';

const Header: React.FC = React.memo(() => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen]);
  const toggleProfile = useCallback(() => setIsProfileOpen(!isProfileOpen), [isProfileOpen]);

  // Закрити випадаючі меню при кліку поза ними
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функція пошуку
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) return;
    
    // Визначаємо куди перенаправити пошук залежно від ролі та поточної сторінки
    if (user?.role === USER_TYPES.CANDIDATE) {
      // Кандидати шукають вакансії
      router.push(`/jobs?search=${encodeURIComponent(query)}`);
    } else if (user?.role === USER_TYPES.EMPLOYER) {
      // Роботодавці можуть шукати і вакансії, і кандидатів
      if (pathname?.includes('/candidates')) {
        router.push(`/candidates/search?search=${encodeURIComponent(query)}`);
      } else {
        router.push(`/jobs?search=${encodeURIComponent(query)}`);
      }
    }
  }, [user?.role, router, pathname]);

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
  }, [logout]);

  const getThemeIcon = useMemo(() => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  }, [theme]);

  const getThemeLabel = useMemo(() => {
    switch (theme) {
      case 'light':
        return 'Світла';
      case 'dark':
        return 'Темна';
      default:
        return 'Системна';
    }
  }, [theme]);

  const searchPlaceholder = useMemo(() => {
    return user?.role === USER_TYPES.CANDIDATE 
      ? "Пошук вакансій..." 
      : "Пошук вакансій, кандидатів...";
  }, [user?.role]);

  return (
    <header className="header">
      {/* Пошук */}
      <div className="header-search">
        <Search className="header-search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          placeholder={searchPlaceholder}
          className="header-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch(searchQuery)}
            className="header-search-button"
            title="Почати пошук"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Права частина */}
      <div className="header-actions">
        {/* Кнопка "Зв'язатися з нами" */}
        <Link 
          href="/contact" 
          className="header-action-button"
          title="Зв'язатися з нами"
        >
          <Mail className="w-5 h-5" />
        </Link>

        {/* Перемикач теми */}
        <button
          onClick={toggleTheme}
          className="header-action-button"
          title={`Поточна тема: ${getThemeLabel}`}
        >
          {getThemeIcon}
        </button>

        {/* Сповіщення */}
        <NotificationBell />

        {/* Перемикач мови */}
        <HeaderLanguageSwitcher />

        {/* Профіль користувача */}
        <div className="header-user-menu" ref={profileRef}>
          <div className="header-user-menu-trigger" onClick={toggleProfile}>
            <div className="header-user-avatar">
              {user?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <span className="header-user-name">
              {user?.name || user?.firstName || user?.email || 'Користувач'}
            </span>
            <ChevronDown className="header-user-arrow" />
          </div>

          {/* Випадаюче меню профілю */}
          {isProfileOpen && (
            <div className="user-dropdown-menu">
              <Link
                href="/profile"
                className="user-dropdown-item"
                onClick={() => setIsProfileOpen(false)}
              >
                <User className="user-dropdown-icon" />
                Профіль
              </Link>
              
              {/* Додаткові пункти для роботодавців */}
              {user?.role === USER_TYPES.EMPLOYER && (
                <>
                  <Link
                    href="/company-profile"
                    className="user-dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Building2 className="user-dropdown-icon" />
                    Профіль Компанії
                  </Link>
                  <Link
                    href="/users"
                    className="user-dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Users className="user-dropdown-icon" />
                    Користувачі
                  </Link>
                  <Link
                    href="/billing"
                    className="user-dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <CreditCard className="user-dropdown-icon" />
                    Послуги та рахунки
                  </Link>
                </>
              )}
              
              <Link
                href="/settings"
                className="user-dropdown-item"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings className="user-dropdown-icon" />
                Налаштування
              </Link>
              <hr className="user-dropdown-divider" />
              <button
                onClick={handleLogout}
                className="user-dropdown-item user-dropdown-item-logout"
              >
                <LogOut className="user-dropdown-icon" />
                Вийти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;