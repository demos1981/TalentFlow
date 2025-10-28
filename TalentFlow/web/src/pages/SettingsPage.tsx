import React, { useState } from 'react';
import { SettingsTabs, ProfileSettings, NotificationSettings, SecuritySettings } from '../components/Settings';

const SettingsPage: React.FC = () => {
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
              <h3>Налаштування мови</h3>
              <p>Виберіть мову інтерфейсу</p>
            </div>
            <div className="language-settings">
              <p>Функціональність налаштування мови буде додана найближчим часом.</p>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Зовнішній вигляд</h3>
              <p>Налаштування теми та інтерфейсу</p>
            </div>
            <div className="appearance-settings">
              <p>Функціональність налаштування зовнішнього вигляду буде додана найближчим часом.</p>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Інтеграції</h3>
              <p>Підключення зовнішніх сервісів</p>
            </div>
            <div className="integrations-settings">
              <p>Функціональність інтеграцій буде додана найближчим часом.</p>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>API Ключі</h3>
              <p>Управління API ключами</p>
            </div>
            <div className="api-settings">
              <p>Функціональність управління API ключами буде додана найближчим часом.</p>
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
        <h1 className="dashboard-title">Налаштування</h1>
        <p className="dashboard-greeting-subtitle">Управління профілем та системними налаштуваннями</p>
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
