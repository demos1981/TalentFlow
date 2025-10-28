'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { Users as UsersIcon, Search, Plus, Mail, Shield, UserPlus, UserMinus } from 'lucide-react';
import { USER_TYPES } from '../../constants';
import './users.css';

interface CompanyUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  lastActiveAt: string;
}

const UsersPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Ініціалізація авторизації
  useEffect(() => {
    const initAuth = async () => {
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized]);

  // Перевірка доступу
  useEffect(() => {
    if (isInitialized && !authLoading) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else if (user?.role !== USER_TYPES.EMPLOYER) {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, authLoading, isAuthenticated, user, router]);

  // Завантаження користувачів компанії
  useEffect(() => {
    if (isInitialized && user?.role === USER_TYPES.EMPLOYER) {
      loadUsers();
    }
  }, [isInitialized, user]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // TODO: Завантажити користувачів компанії з API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock дані
      setUsers([
        {
          id: '1',
          email: user?.email || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          role: 'Owner',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = () => {
    // TODO: Відкрити модальне вікно для запрошення користувача
    console.log('Invite user');
  };

  const handleRemoveUser = (userId: string) => {
    // TODO: Видалити користувача
    console.log('Remove user:', userId);
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Показати завантаження
  if (!isInitialized || authLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  // Якщо не авторизований або не роботодавець
  if (!isAuthenticated || user?.role !== USER_TYPES.EMPLOYER) {
    return null;
  }

  return (
    <Layout>
      <div className="users-page">
        <div className="users-header">
          <div className="users-header-content">
            <div className="users-title-section">
              <UsersIcon className="users-icon" />
              <div>
                <h1 className="users-title">{t('companyUsers')}</h1>
                <p className="users-subtitle">{t('companyUsersDescription')}</p>
              </div>
            </div>
            
            <button onClick={handleInviteUser} className="btn btn-primary">
              <UserPlus className="btn-icon" />
              {t('inviteUser')}
            </button>
          </div>
        </div>

        <div className="users-content">
          {/* Пошук */}
          <div className="users-search">
            <Search className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchUsers')}
              className="search-input"
            />
          </div>

          {/* Список користувачів */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('loading')}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <UsersIcon className="empty-icon" />
              <h3>{t('noUsers')}</h3>
              <p>{t('noUsersDescription')}</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('email')}</th>
                    <th>{t('role')}</th>
                    <th>{t('status')}</th>
                    <th>{t('lastActive')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((companyUser) => (
                    <tr key={companyUser.id}>
                      <td>
                        <div className="user-name">
                          <div className="user-avatar">
                            {companyUser.firstName.charAt(0)}{companyUser.lastName.charAt(0)}
                          </div>
                          {companyUser.firstName} {companyUser.lastName}
                        </div>
                      </td>
                      <td>{companyUser.email}</td>
                      <td>
                        <span className="user-role-badge">
                          <Shield className="role-icon" />
                          {companyUser.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${companyUser.status}`}>
                          {companyUser.status}
                        </span>
                      </td>
                      <td className="text-secondary">
                        {new Date(companyUser.lastActiveAt).toLocaleDateString()}
                      </td>
                      <td>
                        {companyUser.id !== user?.id && (
                          <button
                            onClick={() => handleRemoveUser(companyUser.id)}
                            className="btn-icon-action btn-danger"
                            title={t('removeUser')}
                          >
                            <UserMinus className="icon-sm" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UsersPage;

