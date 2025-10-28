import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users, Briefcase, TrendingUp, Shield, Zap, ArrowRight, CheckCircle, Mail, Menu } from "lucide-react";
import ClientAuthButtons from "../components/ClientAuthButtons";
import useBurger from "@/hooks/useBurger";
import { homeTranslations } from "../locales/pages/home";

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'uk', 'es', 'pl', 'de', 'fr', 'pt', 'ru', 'kk', 'cs', 'az'];
const DEFAULT_LANGUAGE = 'en';

// Function to detect device language
const detectDeviceLanguage = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  try {
    // Get browser language information
    const browserLang = navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage || DEFAULT_LANGUAGE;
    const languages = navigator.languages || [browserLang];
    
    // Check primary language
    const langCode = browserLang.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }
    
    // Check all preferred languages
    for (const lang of languages) {
      const code = lang.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(code)) {
        return code;
      }
    }
    
    // Special case: if user has Ukrainian keyboard layout or Ukrainian system locale
    // Check for Ukrainian in any form
    const hasUkrainian = languages.some(lang => {
      const lowerLang = lang.toLowerCase();
      return lowerLang.includes('uk') || 
             lowerLang.includes('ua') ||
             lowerLang.includes('українська') ||
             lowerLang.includes('ukrainian');
    });
    
    if (hasUkrainian) {
      return 'uk';
    }
    
    // Check timezone for Ukrainian hint
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone && (timezone.includes('Kiev') || timezone.includes('Kyiv') || timezone.includes('Ukraine'))) {
      return 'uk';
    }
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Error detecting language:', error);
    return DEFAULT_LANGUAGE;
  }
};

const HomePage: React.FC = () => {
  const { drawerOpen, isMobile, openDrawer, closeDrawer } = useBurger();
  const [currentLang, setCurrentLang] = useState<string>(DEFAULT_LANGUAGE);
  
  useEffect(() => {
    // Check URL parameter for testing (e.g., ?lang=uk)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
      setCurrentLang(urlLang);
      return;
    }
    
    // Auto-detect from browser
    const detectedLang = detectDeviceLanguage();
    setCurrentLang(detectedLang);
  }, []);
  
  const t = (key: keyof typeof homeTranslations.en): string => {
    return (homeTranslations as any)[currentLang]?.[key] || homeTranslations.en[key];
  };
  

  const features = [
    {
      icon: <Search className="icon" />,
      title: t('aiMatching'),
      description: t('aiMatchingDesc'),
      color: "blue",
    },
    {
      icon: <Users className="icon" />,
      title: t('automatedInterviews'),
      description: t('automatedInterviewsDesc'),
      color: "green",
    },
    {
      icon: <Briefcase className="icon" />,
      title: t('advancedAnalytics'),
      description: t('advancedAnalyticsDesc'),
      color: "purple",
    },
    {
      icon: <TrendingUp className="icon" />,
      title: t('scalability'),
      description: t('scalabilityDesc'),
      color: "orange",
    },
    {
      icon: <Shield className="icon" />,
      title: t('securityGdpr'),
      description: t('securityGdprDesc'),
      color: "red",
    },
    {
      icon: <Zap className="icon" />,
      title: t('fastIntegration'),
      description: t('fastIntegrationDesc'),
      color: "indigo",
    },
  ];

  const stats = [
    { number: t('statHighAccuracy'), label: t('statHighAccuracyLabel') },
    { number: t('statSignificant'), label: t('statSignificantLabel') },
    { number: t('statHighEfficiency'), label: t('statHighEfficiencyLabel') },
    { number: t('stat247'), label: t('stat247Label') },
  ];

  return (
    <div className="dashboard-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-nav">
            <div
              className="dashboard-header-logo"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 12px)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "clamp(32px, 8vw, 40px)",
                  height: "clamp(32px, 8vw, 40px)",
                  backgroundColor: "#6366f1",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "clamp(18px, 4vw, 24px)",
                  fontWeight: "bold",
                }}
              >
                T
              </div>
              <h1
                className="dashboard-title"
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "clamp(20px, 5vw, 32px)",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.025em",
                }}
              >
                <span
                  className="dashboard-title-accent"
                  style={{
                    color: "#6366f1",
                  }}
                >
                  TalentFluent
                </span>
              </h1>
            </div>
            {/* navigation only desktop */}
            {!isMobile && (
              <nav className="dashboard-header-menu">
                <a href="#features">{t('features')}</a>
                <a href="#about">{t('about')}</a>
                <a href="#contact">{t('contact')}</a>
              </nav>
            )}
            {/* button only desktop */}
            {!isMobile && (
              <div className="dashboard-header-actions">
                <ClientAuthButtons t={t} />
              </div>
            )}
            {/* Burger */}
            {isMobile && (
              <button
                className="burger-button"
                onClick={openDrawer}

                // ДОДАНО: Мітка для доступності
                aria-label={t('menu')} 
              >
                <Menu size={32} />
              </button>
            )}
            {/* Drawer menu */}
            {isMobile && drawerOpen && (
              <>
                <div
                  className="drawer-backdrop"
                  onClick={closeDrawer}
                />
                <aside
                  className="drawer-menu"
                  tabIndex={-1}
                >
                  <button
                    className="drawer-close-btn"
                    onClick={closeDrawer}
                  >
                    ×
                  </button>
                  <h2 className="drawer-title">{t('menu')}</h2>
                  <nav className="dashboard-header-menu">
                    <a
                      href="#features"
                      onClick={closeDrawer}
                    >
                      {t('features')}
                    </a>
                    <a
                      href="#about"
                      onClick={closeDrawer}
                    >
                      {t('about')}
                    </a>
                    <a
                      href="#contact"
                      onClick={closeDrawer}
                    >
                      {t('contact')}
                    </a>
                  </nav>
                  <div className="drawer-actions">
                    <ClientAuthButtons t={t} />
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dashboard-section-card">
        <div className="dashboard-section-content">
          <h2 className="dashboard-section-title">{t('heroTitle')}</h2>
          <p className="dashboard-greeting-subtitle">{t('heroSubtitle')}</p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="dashboard-section-card"
      >
        <h2 className="dashboard-section-title">{t('featuresTitle')}</h2>
        <div className="dashboard-sections-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="summary-card"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '32px 24px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
              }}
            >
              <div 
                className="summary-card-icon"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '56px',
                  height: '56px',
                  margin: '0 auto 20px',
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ color: '#64748b', fontSize: '20px' }}>
                  {feature.icon}
                </div>
              </div>
              <h3 
                className="summary-card-label"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}
              >
                {feature.title}
              </h3>
              <p 
                className="summary-card-change"
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  margin: '0'
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="dashboard-section-card">
        <h2 className="dashboard-section-title">{t('statsTitle')}</h2>
        <div className="dashboard-summary-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="summary-card"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '32px 24px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
              }}
            >
              <div 
                className="summary-card-value"
                style={{
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  color: '#334155',
                  lineHeight: '1.2',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em'
                }}
              >
                {stat.number}
              </div>
              <div 
                className="summary-card-label"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: '1.4'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {/* About Section */}
      <section id="about" className="dashboard-section-card">
        <div className="dashboard-section-content">
          <h2 className="dashboard-section-title">{t('aboutTitle')}</h2>
          <p className="dashboard-greeting-subtitle">{t('aboutDescription')}</p>
          
          <div className="dashboard-about-features">
            <h3 className="dashboard-section-title" style={{ fontSize: '24px', marginBottom: '20px' }}>{t('aboutFeatures')}</h3>
            <div className="dashboard-about-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {[
                { key: 'aboutFeature1', icon: <CheckCircle className="icon" style={{ color: '#10b981' }} /> },
                { key: 'aboutFeature2', icon: <CheckCircle className="icon" style={{ color: '#10b981' }} /> },
                { key: 'aboutFeature3', icon: <CheckCircle className="icon" style={{ color: '#10b981' }} /> },
                { key: 'aboutFeature4', icon: <CheckCircle className="icon" style={{ color: '#10b981' }} /> }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="dashboard-about-feature" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {feature.icon}
                  <span>{t(feature.key as any)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section-card">
        <div className="dashboard-section-content">
          <h2 className="dashboard-section-title">{t('ctaTitle')}</h2>
          <p className="dashboard-greeting-subtitle">{t('ctaSubtitle')}</p>
          <div className="dashboard-actions">
            <Link
              href="/auth?type=register"
              className="btn btn-primary btn-lg"
            >
              {t('createAccount')}
              <ArrowRight className="icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="dashboard-section-card"
      >
        <h2 className="dashboard-section-title">{t('contactTitle')}</h2>
        <div className="dashboard-section-content">
          <div className="dashboard-section-contact">
            <Mail
              className="icon"
              style={{
                color: "#4f46e5",
                width: "24px",
                height: "24px",
              }}
            />
            <div>
              <p>{t('contactUs')}</p>
              <a
                href="mailto:mikeleilyash@gmail.com"
                style={{
                  color: "#4f46e5",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                mikeleilyash@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
