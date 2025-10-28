import React from 'react';
import Link from 'next/link';
import { ServerIcon } from './ServerIcon';

export const ServerFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <ServerIcon name="zap" className="footer-logo" />
              <span className="footer-brand-text">TalentFluent</span>
            </div>
            <p className="footer-description">
              AI-підсилена платформа для ефективного найму персоналу
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Платформа</h3>
            <ul className="footer-links">
              <li><Link href="/jobs">Вакансії</Link></li>
              <li><Link href="/candidates">Кандидати</Link></li>
              <li><Link href="/companies">Компанії</Link></li>
              <li><Link href="/analytics">Аналітика</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Ресурси</h3>
            <ul className="footer-links">
              <li><Link href="/help">Допомога</Link></li>
              <li><Link href="/docs">Документація</Link></li>
              <li><Link href="/blog">Блог</Link></li>
              <li><Link href="/api">API</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Компанія</h3>
            <ul className="footer-links">
              <li><Link href="/about">Про нас</Link></li>
              <li><Link href="/contact">Контакти</Link></li>
              <li><Link href="/careers">Кар'єра</Link></li>
              <li><Link href="/privacy">Конфіденційність</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} TalentFluent. Всі права захищені.</p>
          </div>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="LinkedIn">
              <ServerIcon name="linkedin" className="social-icon" />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <ServerIcon name="twitter" className="social-icon" />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <ServerIcon name="github" className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};