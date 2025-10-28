'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Layout from '../../components/Layout/Layout';
import UsersTable from '../../components/Admin/UsersTable';
import { AdminService } from '../../services/adminService';
import { Users, Briefcase, FileText, Building2 } from 'lucide-react';
import { USER_TYPES } from '../../constants';
import './admin.css';

interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  activeUsers: number;
  newUsersToday: number;
  newJobsToday: number;
  newApplicationsToday: number;
  usersByRole: Record<string, number>;
}

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Ініціалізація аутентифікації
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isInitialized) {
        await checkAuth();
        setIsInitialized(true);
        setAuthLoading(false);
      }
    };
    initializeAuth();
  }, [isInitialized, checkAuth]);

  // Перевірка доступу до адмінки
  useEffect(() => {
    if (isInitialized && !authLoading) {
      if (!isAuthenticated) {
        router.push('/auth?type=login');
        return;
      }

      if (user?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }
  }, [isInitialized, authLoading, isAuthenticated, user, router]);

  // Завантаження статистики
  useEffect(() => {
    if (isInitialized && !authLoading && user?.role === USER_TYPES.ADMIN) {
      loadAdminStats();
    }
  }, [isInitialized, authLoading, user]);

  const loadAdminStats = async () => {
    try {
      setLoadingStats(true);
      const statsData = await AdminService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!isInitialized || authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'employers', name: 'Employers', icon: '🏢' },
    { id: 'candidates', name: 'Candidates', icon: '👥' },
    { id: 'jobs', name: 'Jobs', icon: '💼' }
  ];

  return (
    <Layout>
      <div className="admin-dashboard">
        {/* Header */}
        <div className="admin-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage your TalentFluent platform</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="admin-tabs">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`admin-tab ${
                    activeTab === tab.id ? 'active' : ''
                  } flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon stat-icon-blue">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="admin-stat-value">
                    {loadingStats ? '...' : stats?.totalUsers?.toLocaleString()}
                  </p>
                  <p className="admin-stat-label">Total Users</p>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon stat-icon-green">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <p className="admin-stat-value">
                    {loadingStats ? '...' : stats?.totalJobs?.toLocaleString()}
                  </p>
                  <p className="admin-stat-label">Total Jobs</p>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon stat-icon-orange">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="admin-stat-value">
                    {loadingStats ? '...' : stats?.totalApplications?.toLocaleString()}
                  </p>
                  <p className="admin-stat-label">Applications</p>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon stat-icon-purple">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <p className="admin-stat-value">
                    {loadingStats ? '...' : stats?.totalCompanies?.toLocaleString()}
                  </p>
                  <p className="admin-stat-label">Companies</p>
                </div>
              </div>

              {/* Users by Role */}
              {stats?.usersByRole && (
                <div className="admin-table-container">
                  <div className="admin-table-header">
                    <h3 className="admin-table-title">Users by Role</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(stats.usersByRole).map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">{role}</span>
                          <span className="text-xl font-bold text-gray-900">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'employers' && (
            <UsersTable role="employer" title="Employers Management" />
          )}

          {activeTab === 'candidates' && (
            <UsersTable role="candidate" title="Candidates Management" />
          )}

          {activeTab === 'jobs' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Jobs Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Jobs table will be implemented here...</p>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Applications Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Applications table will be implemented here...</p>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Companies Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Companies table will be implemented here...</p>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">System logs will be implemented here...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
