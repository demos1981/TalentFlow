'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Calendar, Users } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

const NotificationSettings: React.FC = () => {
  const { t, initializeLanguage } = useLanguageStore();

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);
  const [notifications, setNotifications] = useState({
    email: {
      newApplications: true,
      interviewReminders: true,
      jobUpdates: false,
      systemUpdates: true,
      marketing: false
    },
    push: {
      newApplications: true,
      interviewReminders: true,
      jobUpdates: true,
      systemUpdates: false,
      marketing: false
    },
    sms: {
      urgentNotifications: true,
      interviewReminders: false
    }
  });

  const handleToggle = (category: string, type: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: !(prev[category as keyof typeof prev] as any)[type]
      }
    }));
  };

  const notificationTypes = [
    {
      id: 'newApplications',
      label: t('newApplications'),
      description: t('newApplicationsDescription'),
      icon: <Users size={16} />
    },
    {
      id: 'interviewReminders',
      label: t('interviewReminders'),
      description: t('interviewRemindersDescription'),
      icon: <Calendar size={16} />
    },
    {
      id: 'jobUpdates',
      label: t('jobUpdates'),
      description: t('jobUpdatesDescription'),
      icon: <Bell size={16} />
    },
    {
      id: 'systemUpdates',
      label: t('systemUpdates'),
      description: t('systemUpdatesDescription'),
      icon: <MessageSquare size={16} />
    },
    {
      id: 'marketing',
      label: t('marketingMessages'),
      description: t('marketingMessagesDescription'),
      icon: <Mail size={16} />
    }
  ];

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3>{t('notificationSettings')}</h3>
        <p>{t('notificationFrequency')}</p>
      </div>

      <div className="notification-settings">
        {/* Email Notifications */}
        <div className="notification-category">
          <div className="category-header">
            <Mail size={20} />
            <h4>{t('emailNotifications')}</h4>
            <p>{t('emailNotificationsDescription')}</p>
          </div>
          
          <div className="notification-items">
            {notificationTypes.map((type) => (
              <div key={`email-${type.id}`} className="notification-item">
                <div className="notification-info">
                  <div className="notification-icon">{type.icon}</div>
                  <div className="notification-details">
                    <label>{type.label}</label>
                    <p>{type.description}</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email[type.id as keyof typeof notifications.email]}
                    onChange={() => handleToggle('email', type.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="notification-category">
          <div className="category-header">
            <Bell size={20} />
            <h4>{t('pushNotifications')}</h4>
            <p>{t('pushNotificationsDescription')}</p>
          </div>
          
          <div className="notification-items">
            {notificationTypes.map((type) => (
              <div key={`push-${type.id}`} className="notification-item">
                <div className="notification-info">
                  <div className="notification-icon">{type.icon}</div>
                  <div className="notification-details">
                    <label>{type.label}</label>
                    <p>{type.description}</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.push[type.id as keyof typeof notifications.push]}
                    onChange={() => handleToggle('push', type.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="notification-category">
          <div className="category-header">
            <Smartphone size={20} />
            <h4>{t('smsNotifications')}</h4>
            <p>{t('smsNotificationsDescription')}</p>
          </div>
          
          <div className="notification-items">
            <div className="notification-item">
              <div className="notification-info">
                <div className="notification-icon"><Bell size={16} /></div>
                <div className="notification-details">
                  <label>{t('urgentNotifications')}</label>
                  <p>{t('urgentNotificationsDescription')}</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.sms.urgentNotifications}
                  onChange={() => handleToggle('sms', 'urgentNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="notification-item">
              <div className="notification-info">
                <div className="notification-icon"><Calendar size={16} /></div>
                <div className="notification-details">
                  <label>{t('interviewReminders')}</label>
                  <p>{t('smsInterviewRemindersDescription')}</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.sms.interviewReminders}
                  onChange={() => handleToggle('sms', 'interviewReminders')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;