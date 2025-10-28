'use client';

import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import SettingsTabs from '../../components/Settings/SettingsTabs';
import ProfileSettings from '../../components/Settings/ProfileSettings';
import NotificationSettings from '../../components/Settings/NotificationSettings';
import SecuritySettings from '../../components/Settings/SecuritySettings';
import './settings.css';

const SettingsPage: React.FC = () => {
  const { t, initializeLanguage, currentLanguage } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'language':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>{t('languageSettings')}</h3>
              <p>{t('languageSettingsDescription')}</p>
            </div>
            <div className="language-settings">
              <p>{t('languageSettingsComingSoon')}</p>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>{t('appearanceSettings')}</h3>
              <p>{t('appearanceSettingsDescription')}</p>
            </div>
            <div className="appearance-settings">
              <p>{t('appearanceSettingsComingSoon')}</p>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>{t('apiKeys')}</h3>
              <p>{t('apiKeysDescription')}</p>
            </div>
            <div className="api-settings">
              <p>{t('apiKeysComingSoon')}</p>
            </div>
          </div>
        );
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <Layout>
      <div className="settings-page" key={currentLanguage}>
        <div className="settings-header">
          <h1 className="settings-title">{t('settingsTitle')}</h1>
          <p className="settings-greeting-subtitle">{t('settingsSubtitle')}</p>
        </div>
        
        <div className="settings-container">
          <div className="settings-sidebar">
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          <div className="settings-content">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
