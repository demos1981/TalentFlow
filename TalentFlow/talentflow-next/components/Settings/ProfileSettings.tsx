'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';
import { useAuthStore } from '../../stores/authStore';

const ProfileSettings: React.FC = () => {
  const { t, initializeLanguage } = useLanguageStore();
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyName: '',
    linkedin: '',
    facebook: '',
    github: '',
    avatar: '',
    skills: [] as string[]
  });

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  // Завантажуємо дані користувача
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.title || '',
        companyName: user.companyName || user.company || '',
        linkedin: user.linkedin || '',
        facebook: user.facebook || '',
        github: user.github || '',
        avatar: user.avatar || '',
        skills: user.skills || []
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        title: profile.position,
        companyName: profile.companyName,
        linkedin: profile.linkedin,
        facebook: profile.facebook,
        github: profile.github,
        avatar: profile.avatar,
        skills: profile.skills
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Відновлюємо дані з user
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.title || '',
        companyName: user.companyName || user.company || '',
        linkedin: user.linkedin || '',
        facebook: user.facebook || '',
        github: user.github || '',
        avatar: user.avatar || '',
        skills: user.skills || []
      });
    }
    setNewSkill('');
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: newSkills });
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3>{t('personalInformation')}</h3>
        <p>{t('profileManagement')}</p>
      </div>

      <div className="settings-form">
        {/* Фото профілю */}
        <div className="form-group">
          <label>{t('profilePhoto')}</label>
          <div className="avatar-upload">
            {profile.avatar && (
              <img src={profile.avatar} alt="Profile" className="avatar-preview" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile({ ...profile, avatar: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              disabled={!isEditing}
              className="form-input-file"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('name')}</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              disabled={!isEditing}
              className="form-input"
              placeholder={t('name')}
            />
          </div>
          <div className="form-group">
            <label>{t('lastName')}</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              disabled={!isEditing}
              className="form-input"
              placeholder={t('lastName')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              className="form-input"
              placeholder={t('email')}
            />
          </div>
          <div className="form-group">
            <label>{t('phone')}</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              className="form-input"
              placeholder={t('phone')}
            />
          </div>
        </div>


        <div className="form-row">
          <div className="form-group">
            <label>{t('position')}</label>
            <input
              type="text"
              value={profile.position}
              onChange={(e) => setProfile({ ...profile, position: e.target.value })}
              disabled={!isEditing}
              className="form-input"
              placeholder={t('position')}
            />
          </div>
          <div className="form-group">
            <label>{t('companyName')}</label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              disabled={!isEditing}
              className="form-input"
              placeholder={t('companyName')}
            />
          </div>
        </div>

        {/* Соціальні мережі */}
        <div className="settings-section-header">
          <h4>{t('socialNetworks')}</h4>
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={profile.linkedin}
            onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
            disabled={!isEditing}
            className="form-input"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label>Facebook</label>
          <input
            type="url"
            value={profile.facebook}
            onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
            disabled={!isEditing}
            className="form-input"
            placeholder="https://facebook.com/username"
          />
        </div>

        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            value={profile.github}
            onChange={(e) => setProfile({ ...profile, github: e.target.value })}
            disabled={!isEditing}
            className="form-input"
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group">
          <label>{t('skills')}</label>
          <div className="skills-tags">
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                {isEditing && (
                  <button
                    className="remove-skill"
                    onClick={() => handleRemoveSkill(index)}
                    title={t('removeSkill')}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            {isEditing && (
              <div className="add-skill-container">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t('addSkill')}
                  className="add-skill-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <button 
                  className="add-skill-btn"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                >
                  + {t('addSkill')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              {t('edit')}
            </button>
          ) : (
            <div className="action-buttons">
              <button 
                onClick={handleSave} 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? t('saving') : t('save')}
              </button>
              <button 
                onClick={handleCancel} 
                className="btn btn-secondary"
                disabled={isLoading}
              >
                {t('cancel')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;