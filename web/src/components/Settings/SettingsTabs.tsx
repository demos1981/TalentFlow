import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Palette, Database, Key } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Профіль', icon: User },
    { id: 'notifications', label: 'Сповіщення', icon: Bell },
    { id: 'security', label: 'Безпека', icon: Shield },
    { id: 'language', label: 'Мова', icon: Globe },
    { id: 'appearance', label: 'Зовнішній вигляд', icon: Palette },
    { id: 'integrations', label: 'Інтеграції', icon: Database },
    { id: 'api', label: 'API Ключі', icon: Key },
  ];

  return (
    <div className="settings-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTabs;


