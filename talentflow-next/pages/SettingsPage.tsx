import React, { useState } from 'react';
import { SettingsTabs, ProfileSettings, NotificationSettings, SecuritySettings } from '../components/Settings';
import { useLanguageStore } from '../stores/languageStore';

const SettingsPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('profile');

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
              <p>{t('selectInterfaceLanguage')}</p>
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
              <h3>{t('appearance')}</h3>
              <p>{t('themeAndInterfaceSettings')}</p>
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
              <p>{t('manageApiKeys')}</p>
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
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('settings')}</h1>
        <p className="dashboard-greeting-subtitle">{t('settingsDescription')}</p>
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
  );
};

export default SettingsPage;
