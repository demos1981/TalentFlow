import React, { useState } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Calendar, Users } from 'lucide-react';
import { Button } from '../UI/Button';

const NotificationSettings: React.FC = () => {
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
        [type]: !prev[category as keyof typeof prev][type as keyof typeof prev[typeof category]]
      }
    }));
  };

  const notificationTypes = [
    {
      id: 'newApplications',
      label: 'Нові заявки',
      description: 'Отримувати сповіщення про нові заявки на вакансії',
      icon: <Users size={16} />
    },
    {
      id: 'interviewReminders',
      label: 'Нагадування про інтерв\'ю',
      description: 'Нагадування про заплановані інтерв\'ю',
      icon: <Calendar size={16} />
    },
    {
      id: 'jobUpdates',
      label: 'Оновлення вакансій',
      description: 'Сповіщення про зміни у вакансіях',
      icon: <Bell size={16} />
    },
    {
      id: 'systemUpdates',
      label: 'Системні оновлення',
      description: 'Важливі оновлення системи',
      icon: <MessageSquare size={16} />
    },
    {
      id: 'marketing',
      label: 'Маркетингові повідомлення',
      description: 'Пропозиції та новини від TalentFlow',
      icon: <Mail size={16} />
    }
  ];

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3>Налаштування сповіщень</h3>
        <p>Керуйте типом та частотою сповіщень</p>
      </div>

      <div className="notification-settings">
        {/* Email Notifications */}
        <div className="notification-category">
          <div className="category-header">
            <Mail size={20} />
            <h4>Email сповіщення</h4>
            <p>Отримувати сповіщення на email</p>
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
            <h4>Push сповіщення</h4>
            <p>Сповіщення в браузері</p>
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
            <h4>SMS сповіщення</h4>
            <p>Важливі сповіщення на телефон</p>
          </div>
          
          <div className="notification-items">
            <div className="notification-item">
              <div className="notification-info">
                <div className="notification-icon"><Bell size={16} /></div>
                <div className="notification-details">
                  <label>Термінові сповіщення</label>
                  <p>Критично важливі сповіщення</p>
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
                  <label>Нагадування про інтерв\'ю</label>
                  <p>SMS нагадування за день до інтерв\'ю</p>
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
          <Button variant="primary">
            Зберегти налаштування
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;


