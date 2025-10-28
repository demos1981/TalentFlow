'use client';

import React, { useEffect } from 'react';
import { User, Bell, Shield, Globe, Palette, Key } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  const { t, initializeLanguage, currentLanguage } = useLanguageStore();

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'security', label: t('security'), icon: Shield },
    { id: 'language', label: t('languageSettings'), icon: Globe },
    { id: 'appearance', label: t('appearance'), icon: Palette },
    { id: 'api', label: t('apiKeys'), icon: Key },
  ];

  return (
    <div className="settings-tabs" key={currentLanguage}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="icon" size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTabs;