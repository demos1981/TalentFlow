import React from 'react';
import Link from 'next/link';
import { ServerIcon } from './ServerIcon';

interface ServerNavigationProps {
  currentPath: string;
}

export const ServerNavigation: React.FC<ServerNavigationProps> = ({ currentPath }) => {
  const navigationItems = [
    { href: '/', label: 'Головна', icon: 'home' },
    { href: '/jobs', label: 'Вакансії', icon: 'briefcase' },
    { href: '/candidates', label: 'Кандидати', icon: 'users' },
    { href: '/companies', label: 'Компанії', icon: 'building' },
    { href: '/about', label: 'Про нас', icon: 'info' },
    { href: '/contact', label: 'Контакти', icon: 'mail' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link href="/" className="navbar-logo">
            <ServerIcon name="zap" className="logo-icon" />
            <span className="logo-text">TalentFluent</span>
          </Link>
        </div>
        
        <div className="navbar-menu">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-item ${currentPath === item.href ? 'active' : ''}`}
            >
              <ServerIcon name={item.icon} className="navbar-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="navbar-actions">
          <Link href="/auth" className="btn btn-outline">
            Увійти
          </Link>
          <Link href="/auth" className="btn btn-primary">
            Реєстрація
          </Link>
        </div>
      </div>
    </nav>
  );
};