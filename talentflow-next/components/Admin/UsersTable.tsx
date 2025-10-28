'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/adminService';
import '../../app/admin/admin.css';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  company?: {
    id: string;
    name: string;
  };
}

interface UsersTableProps {
  role?: string;
  title: string;
}

const UsersTable: React.FC<UsersTableProps> = ({ role, title }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getUsers({
        page,
        limit: 10,
        sortBy,
        sortOrder,
        ...(role && { role }),
        ...(search && { search })
      });
      
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, sortBy, sortOrder, search, role]);

  const handleDeactivate = async (userId: string) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await AdminService.deactivateUser(userId);
      loadUsers(); // Reload the table
      alert('User deactivated successfully');
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      await AdminService.activateUser(userId);
      loadUsers(); // Reload the table
      alert('User activated successfully');
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Error activating user');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await AdminService.deleteUser(userId);
      loadUsers(); // Reload the table
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h3 className="admin-table-title">{title}</h3>
      </div>
      
      <div className="p-6">
        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'ASC' | 'DESC');
            }}
            className="admin-select"
          >
            <option value="createdAt-DESC">Newest First</option>
            <option value="createdAt-ASC">Oldest First</option>
            <option value="lastName-ASC">Name A-Z</option>
            <option value="lastName-DESC">Name Z-A</option>
            <option value="lastLoginAt-DESC">Last Login</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Company</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-loading">
                    <div className="admin-loading-spinner"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    <div className="admin-empty-state-icon">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="admin-empty-state-title">No users found</h3>
                    <p className="admin-empty-state-description">Try adjusting your search criteria</p>
                  </td>
                </tr>
            ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="admin-user-avatar">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="admin-user-info">
                          <p className="admin-user-name">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="admin-user-email">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <span className={`admin-status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.emailVerified && (
                          <span className="admin-status-badge verified">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{user.company?.name || '-'}</td>
                    <td>{user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="flex space-x-2">
                        {user.isActive ? (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className="admin-action-btn deactivate"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id)}
                            className="admin-action-btn activate"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="admin-action-btn delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="admin-pagination-btn"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="admin-pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
