'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { User, Edit, Save, X, Camera, Briefcase, Mail, Phone, Linkedin, Github, Facebook, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { FileService } from '../../services/fileService';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  linkedin: string;
  facebook: string;
  github: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    title: '',
    company: '',
    linkedin: '',
    facebook: '',
    github: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateProfile } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || '',
        company: user.company || '',
        linkedin: user.linkedin || '',
        facebook: user.facebook || '',
        github: user.github || ''
      });
    }
    setIsLoading(false);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast.success(t('operationSuccessful'));
    } catch (error) {
      console.error(t('profileUpdateError'), error);
      toast.error(t('profileUpdateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || '',
        company: user.company || '',
        linkedin: user.linkedin || '',
        facebook: user.facebook || '',
        github: user.github || ''
      });
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валідація файлу
    const validation = FileService.validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Недійсний файл');
      return;
    }

    // Перевірка типу файлу (тільки зображення)
    if (!file.type.startsWith('image/')) {
      toast.error('Дозволені тільки зображення');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // Завантажуємо файл
      const uploadResponse = await FileService.uploadFile(file, 'avatars', 'profile_photo');
      // Оновлюємо профіль користувача з новим URL аватара
      const avatarUrl = uploadResponse.r2Url || uploadResponse.url;
      await updateProfile({ avatar: avatarUrl });
      
      toast.success('Фото успішно завантажено');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Помилка завантаження фото');
    } finally {
      setIsUploadingPhoto(false);
      // Очищуємо input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: 'var(--space-8)',
        background: 'var(--color-background)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-secondary)'
        }}>
          {t('loading')}...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: 'var(--space-8)',
      background: 'var(--color-background)',
      minHeight: '100vh'
    }}>
      {/* Прихований input для завантаження файлів */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-8)',
        padding: 'var(--space-6)',
        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
        borderRadius: 'var(--border-radius-2xl)',
        color: 'var(--color-text-inverse)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <h1 style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-inverse)',
            margin: '0 0 var(--space-2) 0'
          }}>
            {t('profile')}
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            {t('profileManagement')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {isEditing ? (
            <>
              <button
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={isSaving}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-inverse)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <X style={{ width: 16, height: 16 }} />
                {t('cancel')}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--color-primary-600)',
                  borderColor: 'transparent'
                }}
              >
                <Save style={{ width: 16, height: 16 }} />
                {isSaving ? t('saving') : t('save')}
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--color-primary-600)',
                borderColor: 'transparent'
              }}
            >
              <Edit style={{ width: 16, height: 16 }} />
              {t('edit')}
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Основна інформація з аватаром */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-2xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--color-primary-100)',
                boxShadow: 'var(--shadow-md)'
              }}>
              <img 
                src={user?.avatar || '/avatars/default.svg'} 
                alt={user?.name || 'User'}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/avatars/default.svg';
                }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              </div>
              <button 
                onClick={handlePhotoUpload}
                disabled={isUploadingPhoto}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: isUploadingPhoto ? 'var(--color-text-secondary)' : 'var(--color-primary-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  opacity: isUploadingPhoto ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
                title={isUploadingPhoto ? 'Завантаження...' : 'Змінити фото'}
              >
                {isUploadingPhoto ? (
                  <Upload style={{ width: 18, height: 18 }} />
                ) : (
                  <Camera style={{ width: 18, height: 18 }} />
                )}
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)'
              }}>
                {profileData.name}
              </h2>
              {profileData.title && (
                <p style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-primary-600)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-1)'
                }}>
                  {profileData.title}
                </p>
              )}
              {profileData.company && (
                <p style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {profileData.company}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Особиста інформація */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-2xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <User style={{ width: 24, height: 24, color: 'var(--color-primary-600)' }} />
            {t('personalInformation')}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-5)'
          }}>
            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <User style={{ width: 16, height: 16 }} />
                {t('fullName')}
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Mail style={{ width: 16, height: 16 }} />
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Phone style={{ width: 16, height: 16 }} />
                {t('phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Briefcase style={{ width: 16, height: 16 }} />
                {t('position')}
              </label>
              <input
                type="text"
                name="title"
                value={profileData.title}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Briefcase style={{ width: 16, height: 16 }} />
                {t('company')}
              </label>
              <input
                type="text"
                name="company"
                value={profileData.company}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Соціальні мережі */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-2xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <Linkedin style={{ width: 24, height: 24, color: 'var(--color-primary-600)' }} />
            {t('socialNetworks')}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-5)'
          }}>
            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Linkedin style={{ width: 16, height: 16 }} />
                {t('linkedin')}
              </label>
              <input
                type="url"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
                placeholder={t('linkedinPlaceholder')}
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Facebook style={{ width: 16, height: 16 }} />
                {t('facebook')}
              </label>
              <input
                type="url"
                name="facebook"
                value={profileData.facebook}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
                placeholder={t('facebookPlaceholder')}
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <Github style={{ width: 16, height: 16 }} />
                {t('github')}
              </label>
              <input
                type="url"
                name="github"
                value={profileData.github}
                onChange={handleInputChange}
                className="form-input"
                disabled={!isEditing}
                placeholder={t('githubPlaceholder')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
