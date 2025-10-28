import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
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
  ChevronDown
} from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Функція пошуку
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) return;
    
    // Визначаємо куди перенаправити пошук залежно від ролі та поточної сторінки
    if (user?.role === 'candidate') {
      // Кандидати шукають вакансії
      navigate(`/jobs?search=${encodeURIComponent(query)}`);
    } else if (user?.role === 'employer') {
      // Роботодавці можуть шукати і вакансії, і кандидатів
      if (location.pathname.includes('/candidates')) {
        navigate(`/candidates/search?search=${encodeURIComponent(query)}`);
      } else {
        navigate(`/jobs?search=${encodeURIComponent(query)}`);
      }
    }
  }, [user?.role, navigate, location.pathname]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Світла';
      case 'dark':
        return 'Темна';
      default:
        return 'Системна';
    }
  };

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
          placeholder={
            user?.role === 'candidate' 
              ? "Пошук вакансій..." 
              : "Пошук вакансій, кандидатів..."
          }
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
        {/* Перемикач теми */}
        <button
          onClick={() => {
            const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
            const currentIndex = themes.indexOf(theme);
            const nextIndex = (currentIndex + 1) % themes.length;
            setTheme(themes[nextIndex]);
          }}
          className="header-action-button"
          title={`Поточна тема: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
        </button>

        {/* Сповіщення */}
        <NotificationBell />

        {/* Перемикач мови */}
        <HeaderLanguageSwitcher />

        {/* Профіль користувача */}
        <div className="header-user-menu" onClick={toggleProfile}>
          <div className="header-user-avatar">
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <span className="header-user-name">
            {user?.firstName || 'Користувач'}
          </span>
          <ChevronDown className="header-user-arrow" />
        </div>

        {/* Випадаюче меню профілю */}
        {isProfileOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsProfileOpen(false)}
            >
              <User className="w-4 h-4 inline mr-2" />
              Профіль
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsProfileOpen(false)}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Налаштування
            </Link>
            <hr className="my-2" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Вийти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
