import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { t } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Мокові дані для демонстрації
  const profileStats = [
    { label: 'Перегляди профілю', value: '1,234', change: '+12%' },
    { label: 'Заявки', value: '45', change: '+8%' },
    { label: 'Інтерв\'ю', value: '12', change: '+15%' },
    { label: 'Рейтинг', value: '4.8', change: '+0.2' }
  ];

  const recentActivity = [
    { action: 'Оновлено профіль', time: '2 години тому', type: 'profile' },
    { action: 'Подано заявку на вакансію', time: '1 день тому', type: 'application' },
    { action: 'Заплановано інтерв\'ю', time: '3 дні тому', type: 'interview' },
    { action: 'Отримано відгук', time: '1 тиждень тому', type: 'feedback' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return <User className="icon" />;
      case 'application':
        return <Briefcase className="icon" />;
      case 'interview':
        return <Calendar className="icon" />;
      case 'feedback':
        return <Mail className="icon" />;
      default:
        return <User className="icon" />;
    }
  };

  return (
    <div className="dashboard-content">
      {/* Profile Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">{t('userProfile')}</h1>
          <p className="dashboard-greeting-subtitle">
            {t('profileManagement')}
          </p>
          <div className="dashboard-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  <Save className="icon" />
                  {t('save')}
                </button>
                <button onClick={handleCancel} className="btn btn-outline">
                  <X className="icon" />
                  {t('cancel')}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <Edit className="icon" />
                {t('edit')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="dashboard-summary-grid">
        {profileStats.map((stat, index) => (
          <div key={index} className="summary-card">
            <div className="summary-card-icon">
              <User className="icon" />
            </div>
            <span className="summary-card-label">{stat.label}</span>
            <span className="summary-card-value">{stat.value}</span>
            <span className="summary-card-change">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Profile Content */}
      <div className="dashboard-sections-grid">
        {/* Profile Form */}
        <div className="dashboard-section-card">
          <h2 className="dashboard-section-title">{t('personalInformation')}</h2>
          <div className="dashboard-section-content">
            <div className="form-group">
              <label className="form-label">{t('firstName')}</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                placeholder={t('firstName')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('lastName')}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                placeholder={t('lastName')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="form-input"
                placeholder={t('email')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                placeholder={t('phone')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('location')}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                placeholder={t('location')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('bio')}</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-textarea"
                rows={4}
                placeholder={t('bio')}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section-card">
          <h2 className="dashboard-section-title">{t('recentActivity')}</h2>
          <ul className="latest-activities-list">
            {recentActivity.map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-item-icon-wrapper">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-item-content">
                  <div className="activity-item-title">{activity.action}</div>
                  <div className="activity-item-time">{activity.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
