'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { useLanguageStore } from '../../../stores/languageStore';
import { companyUsersApi } from '../../../services/api';
import toast from 'react-hot-toast';
import '../../../styles/checkboxes.css';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  User as UserIcon,
  Mail,
  Shield,
  CheckCircle
} from 'lucide-react';

interface CompanyUser {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  role: string;
  status: string;
  title?: string;
  department?: string;
  permissions: {
    canPublishJobsSelf?: boolean;
    canViewOthersJobs?: boolean;
    canManageOthersJobs?: boolean;
    canViewCandidateContacts?: boolean;
    canActivateServices?: boolean;
    canMakePayments?: boolean;
    canManageUsers?: boolean;
    canManagePaymentCards?: boolean;
    canEditCompanyInfo?: boolean;
    canManageJobTemplates?: boolean;
  };
  invitedAt?: string;
  acceptedAt?: string;
  createdAt: string;
}

const CompanyUsersPage: React.FC = () => {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Інформація про компанію з поточного користувача
  const companyId = user?.companyId || user?.company;

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (user.role !== 'employer' && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await companyUsersApi.getCompanyUsers(companyId);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('errorLoadingData'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm(t('confirmRemoveUser'))) {
      return;
    }

    try {
      await companyUsersApi.removeCompanyUser(userId);
      toast.success(t('userRemoved'));
      fetchUsers();
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast.error(error.response?.data?.message || t('errorRemovingUser'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'inactive':
        return '#6b7280';
      case 'suspended':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': t('statusActive'),
      'pending': t('statusPending'),
      'inactive': t('statusInactive'),
      'suspended': t('statusSuspended')
    };
    return statusMap[status] || status;
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
            {t('companyUsers')}
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            {t('companyUsersManagement')}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowInviteModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--color-primary-600)',
            borderColor: 'transparent'
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          {t('inviteUser')}
        </button>
      </div>

      {/* Users Count */}
      <div style={{
        marginBottom: 'var(--space-6)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-primary)'
      }}>
        {users.length} {users.length === 1 ? 'користувач' : 'користувачів'}
      </div>

      {/* Users List */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-2xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)'
      }}>
        {users.map((companyUser, index) => (
          <div
            key={companyUser.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--space-5)',
              borderBottom: index < users.length - 1 ? '1px solid var(--color-border)' : 'none',
              borderLeft: `4px solid ${getStatusColor(companyUser.status)}`,
              transition: 'all 0.2s ease'
            }}
          >
            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)'
              }}>
                {companyUser.user.firstName} {companyUser.user.lastName}
              </div>
              {companyUser.title && (
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  {companyUser.title}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{
              flex: 1,
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-primary-600)'
            }}>
              {companyUser.user.email}
            </div>

            {/* Status */}
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--border-radius-full)',
              background: `${getStatusColor(companyUser.status)}15`,
              color: getStatusColor(companyUser.status),
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginRight: 'var(--space-4)'
            }}>
              {getStatusText(companyUser.status)}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={() => {
                  setSelectedUser(companyUser);
                  setShowEditModal(true);
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-lg)',
                  color: 'var(--color-primary-600)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary-50)';
                  e.currentTarget.style.borderColor = 'var(--color-primary-500)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <Edit style={{ width: 16, height: 16 }} />
              </button>

              {companyUser.role !== 'owner' && (
                <button
                  onClick={() => handleRemoveUser(companyUser.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-lg)',
                    color: 'var(--color-error-600)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-error-50)';
                    e.currentTarget.style.borderColor = 'var(--color-error-500)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                </button>
              )}
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-8)',
            color: 'var(--color-text-secondary)'
          }}>
            <UserIcon style={{ 
              width: 48, 
              height: 48, 
              color: 'var(--color-text-tertiary)',
              margin: '0 auto var(--space-4)'
            }} />
            <p style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--space-2)'
            }}>
              {t('noData')}
            </p>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-tertiary)'
            }}>
              Запросіть користувачів для роботи з кабінетом
            </p>
          </div>
        )}
      </div>

      {/* Edit User Modal - буде реалізовано окремим компонентом */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={() => {
            fetchUsers();
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Invite User Modal - буде реалізовано окремим компонентом */}
      {showInviteModal && companyId && (
        <InviteUserModal
          companyId={companyId}
          onClose={() => setShowInviteModal(false)}
          onSave={() => {
            fetchUsers();
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
};

// Модальне вікно для редагування користувача
const EditUserModal: React.FC<{
  user: CompanyUser;
  onClose: () => void;
  onSave: () => void;
}> = ({ user: companyUser, onClose, onSave }) => {
  const { t } = useLanguageStore();
  const [permissions, setPermissions] = useState(companyUser.permissions);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await companyUsersApi.updatePermissions(companyUser.id, permissions);
      toast.success(t('permissionsUpdated'));
      onSave();
    } catch (error: any) {
      console.error('Error updating permissions:', error);
      toast.error(error.response?.data?.message || t('errorUpdatingUser'));
    } finally {
      setIsSaving(false);
    }
  };

  const permissionsList = [
    { key: 'canPublishJobsSelf', section: 'jobPermissions' },
    { key: 'canViewOthersJobs', section: 'jobPermissions' },
    { key: 'canManageOthersJobs', section: 'jobPermissions' },
    { key: 'canViewCandidateContacts', section: 'jobPermissions' },
    { key: 'canActivateServices', section: 'servicePermissions' },
    { key: 'canMakePayments', section: 'servicePermissions' },
    { key: 'canManageUsers', section: 'managementPermissions' },
    { key: 'canManagePaymentCards', section: 'managementPermissions' },
    { key: 'canEditCompanyInfo', section: 'managementPermissions' },
    { key: 'canManageJobTemplates', section: 'managementPermissions' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-4)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-2xl)',
        padding: 'var(--space-6)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: 'var(--shadow-2xl)'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-6)'
        }}>
          {t('userPermissions')}
        </h2>

        <div style={{
          marginBottom: 'var(--space-6)',
          padding: 'var(--space-4)',
          background: 'var(--color-surface-secondary)',
          borderRadius: 'var(--border-radius-lg)'
        }}>
          <div style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-1)'
          }}>
            {companyUser.user.firstName} {companyUser.user.lastName}
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)'
          }}>
            {companyUser.user.email}
          </div>
          {companyUser.title && (
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-tertiary)',
              marginTop: 'var(--space-1)'
            }}>
              {companyUser.title}
            </div>
          )}
        </div>

        {/* Permissions Groups */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          {/* Вакансії */}
          <h3 style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)'
          }}>
            {t('jobPermissions')}
          </h3>
          
          {permissionsList.filter(p => p.section === 'jobPermissions').map((perm) => {
            const isChecked = (permissions as any)[perm.key] || false;
            return (
              <label key={perm.key} style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-2)',
                background: isChecked ? 'var(--color-primary-50)' : 'transparent',
                border: `1px solid ${isChecked ? 'var(--color-primary-200)' : 'var(--color-border)'}`,
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setPermissions({
                    ...permissions,
                    [perm.key]: e.target.checked
                  })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: 'var(--space-3)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  {t(perm.key as any)}
                </span>
              </label>
            );
          })}

          {/* Послуги */}
          <h3 style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginTop: 'var(--space-5)',
            marginBottom: 'var(--space-3)'
          }}>
            {t('servicePermissions')}
          </h3>
          
          {permissionsList.filter(p => p.section === 'servicePermissions').map((perm) => {
            const isChecked = (permissions as any)[perm.key] || false;
            return (
              <label key={perm.key} style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-2)',
                background: isChecked ? 'var(--color-primary-50)' : 'transparent',
                border: `1px solid ${isChecked ? 'var(--color-primary-200)' : 'var(--color-border)'}`,
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setPermissions({
                    ...permissions,
                    [perm.key]: e.target.checked
                  })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: 'var(--space-3)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  {t(perm.key as any)}
                </span>
              </label>
            );
          })}

          {/* Управління */}
          <h3 style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginTop: 'var(--space-5)',
            marginBottom: 'var(--space-3)'
          }}>
            {t('managementPermissions')}
          </h3>
          
          {permissionsList.filter(p => p.section === 'managementPermissions').map((perm) => {
            const isChecked = (permissions as any)[perm.key] || false;
            return (
              <label key={perm.key} style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-2)',
                background: isChecked ? 'var(--color-primary-50)' : 'transparent',
                border: `1px solid ${isChecked ? 'var(--color-primary-200)' : 'var(--color-border)'}`,
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setPermissions({
                    ...permissions,
                    [perm.key]: e.target.checked
                  })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: 'var(--space-3)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  {t(perm.key as any)}
                </span>
              </label>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'flex-end'
        }}>
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSaving}
          >
            {t('cancel')}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? t('saving') : t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Модальне вікно для запрошення користувача
const InviteUserModal: React.FC<{
  companyId: string;
  onClose: () => void;
  onSave: () => void;
}> = ({ companyId, onClose, onSave }) => {
  const { t } = useLanguageStore();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    title: '',
    department: '',
    role: 'recruiter'
  });
  const [permissions, setPermissions] = useState({
    canPublishJobsSelf: false,
    canViewOthersJobs: true,
    canManageOthersJobs: false,
    canViewCandidateContacts: true,
    canActivateServices: false,
    canMakePayments: false,
    canManageUsers: false,
    canManagePaymentCards: false,
    canEditCompanyInfo: false,
    canManageJobTemplates: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    setIsSaving(true);
    try {
      await companyUsersApi.inviteUser(companyId, {
        ...formData,
        permissions
      });
      toast.success(t('userInvited'));
      onSave();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast.error(error.response?.data?.message || t('errorInvitingUser'));
    } finally {
      setIsSaving(false);
    }
  };

  const permissionsList = [
    { key: 'canPublishJobsSelf', section: 'jobPermissions' },
    { key: 'canViewOthersJobs', section: 'jobPermissions' },
    { key: 'canManageOthersJobs', section: 'jobPermissions' },
    { key: 'canViewCandidateContacts', section: 'jobPermissions' },
    { key: 'canActivateServices', section: 'servicePermissions' },
    { key: 'canMakePayments', section: 'servicePermissions' },
    { key: 'canManageUsers', section: 'managementPermissions' },
    { key: 'canManagePaymentCards', section: 'managementPermissions' },
    { key: 'canEditCompanyInfo', section: 'managementPermissions' },
    { key: 'canManageJobTemplates', section: 'managementPermissions' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-4)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-2xl)',
        padding: 'var(--space-6)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: 'var(--shadow-2xl)'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-6)'
        }}>
          {t('inviteUser')}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-5)'
          }}>
            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'block'
              }}>
                {t('firstName')} *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'block'
              }}>
                {t('lastName')} *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-2)',
              display: 'block'
            }}>
              {t('email')} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-5)'
          }}>
            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'block'
              }}>
                {t('position')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)',
                display: 'block'
              }}>
                {t('department')}
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Permissions */}
          <h3 style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)'
          }}>
            {t('permissions')}
          </h3>

          <div style={{ marginBottom: 'var(--space-6)' }}>
          {permissionsList.map((perm) => {
            const isChecked = (permissions as any)[perm.key] || false;
            return (
              <label key={perm.key} style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-2)',
                background: isChecked ? 'var(--color-primary-50)' : 'transparent',
                border: `1px solid ${isChecked ? 'var(--color-primary-200)' : 'var(--color-border)'}`,
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setPermissions({
                    ...permissions,
                    [perm.key]: e.target.checked
                  })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: 'var(--space-3)',
                    marginTop: '2px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.5
                }}>
                  {t(perm.key as any)}
                </span>
              </label>
            );
          })}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSaving}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? t('saving') : t('inviteUser')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyUsersPage;

