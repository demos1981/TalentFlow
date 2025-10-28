'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, Smartphone, Eye, EyeOff } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

const SecuritySettings: React.FC = () => {
  const { t, initializeLanguage } = useLanguageStore();

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [twoFactor, setTwoFactor] = useState({
    enabled: true,
    method: 'app'
  });

  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'MacBook Pro',
      location: 'Київ, Україна',
      lastActive: '2025-08-25 15:30',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'iPhone 15',
      location: 'Київ, Україна',
      lastActive: '2025-08-25 14:15',
      current: false,
      ip: '192.168.1.101'
    }
  ]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Паролі не співпадають');
      return;
    }
    // Тут буде логіка зміни пароля
    console.log('Зміна пароля:', passwords);
  };

  const handleTerminateSession = (sessionId: number) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3>{t('accountSecurity')}</h3>
        <p>{t('accountSecurityDescription')}</p>
      </div>

      <div className="security-settings">
        {/* Password Change */}
        <div className="security-card">
          <div className="card-header">
            <Lock size={20} />
            <h4>{t('changePassword')}</h4>
          </div>
          
          <div className="password-form">
            <div className="form-group">
              <label>{t('currentPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="form-input"
                  placeholder={t('currentPassword')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>{t('newPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  className="form-input"
                  placeholder={t('newPassword')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>{t('confirmNewPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  className="form-input"
                  placeholder={t('confirmNewPassword')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button onClick={handleChangePassword} className="btn btn-primary">
              {t('changePassword')}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="security-card">
          <div className="card-header">
            <Shield size={20} />
            <h4>{t('twoFactorAuth')}</h4>
          </div>
          
          <div className="two-factor-settings">
            <div className="setting-item">
              <div className="setting-info">
                <h5>{t('twoFactorAuth')}</h5>
                <p>{t('twoFactorAuthDescription')}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={twoFactor.enabled}
                  onChange={(e) => setTwoFactor(prev => ({ ...prev, enabled: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {twoFactor.enabled && (
              <div className="form-group">
                <label>{t('authMethod')}</label>
                <select
                  value={twoFactor.method}
                  onChange={(e) => setTwoFactor(prev => ({ ...prev, method: e.target.value }))}
                  className="form-select"
                >
                  <option value="app">{t('authApp')}</option>
                  <option value="sms">{t('smsCode')}</option>
                  <option value="email">{t('emailCode')}</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Active Sessions */}
        <div className="security-card">
          <div className="card-header">
            <Smartphone size={20} />
            <h4>{t('activeSessions')}</h4>
          </div>
          
          <div className="sessions-list">
            {sessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <div className="session-device">
                    <h5>{session.device}</h5>
                    {session.current && <span className="current-badge">{t('currentSession')}</span>}
                  </div>
                  <div className="session-details">
                    <p><strong>{t('ipAddress')}:</strong> {session.ip}</p>
                    <p><strong>{t('location')}:</strong> {session.location}</p>
                    <p><strong>{t('lastActive')}:</strong> {session.lastActive}</p>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    className="btn btn-danger btn-sm"
                  >
                    {t('terminateSession')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Log */}
        <div className="security-card">
          <div className="card-header">
            <Key size={20} />
            <h4>{t('securityLog')}</h4>
          </div>
          
          <div className="security-log">
            <div className="log-item">
              <div className="log-icon success">✓</div>
              <div className="log-content">
                <h5>{t('successfulLogin')}</h5>
                <p>MacBook Pro • Київ, Україна • 2025-08-25 15:30</p>
              </div>
            </div>
            
            <div className="log-item">
              <div className="log-icon warning">⚠</div>
              <div className="log-content">
                <h5>{t('unknownDeviceLogin')}</h5>
                <p>iPhone • Москва, Росія • 2025-08-25 14:15</p>
              </div>
            </div>
            
            <div className="log-item">
              <div className="log-icon info">ℹ</div>
              <div className="log-content">
                <h5>{t('passwordChanged')}</h5>
                <p>MacBook Pro • Київ, Україна • 2025-08-20 10:45</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;