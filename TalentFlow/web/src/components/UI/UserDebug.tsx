import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '10px' }}>
        <h3>🔒 Користувач не авторизований</h3>
        <p>isAuthenticated: {isAuthenticated.toString()}</p>
        <p>user: {user ? 'exists' : 'null'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e8', margin: '10px', border: '1px solid #ccc' }}>
      <h3>👤 Інформація про користувача</h3>
      <p><strong>ID:</strong> {user?.id}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Ім'я:</strong> {user?.firstName} {user?.lastName}</p>
      <p><strong>Роль:</strong> {user?.role}</p>
      <p><strong>Активний:</strong> {user?.isActive?.toString()}</p>
      <p><strong>Може створювати вакансії:</strong> {user?.canPostJobs?.toString()}</p>
      <p><strong>Може шукати кандидатів:</strong> {user?.canSearchCandidates?.toString()}</p>
      <p><strong>Може керувати командою:</strong> {user?.canManageTeam?.toString()}</p>
      <p><strong>Email підтверджений:</strong> {user?.emailVerified?.toString()}</p>
      <p><strong>Дата створення:</strong> {user?.createdAt}</p>
    </div>
  );
};

export default UserDebug;




