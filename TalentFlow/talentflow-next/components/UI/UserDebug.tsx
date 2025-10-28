import React from 'react';
import { useAuthStore } from '../../stores/authStore';

const UserDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

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
      <p><strong>Ім'я:</strong> {user?.name}</p>
      <p><strong>Роль:</strong> {user?.role}</p>
      <p><strong>Компанія:</strong> {user?.company}</p>
      <p><strong>Посада:</strong> {user?.title}</p>
      <p><strong>Локація:</strong> {user?.location}</p>
      <p><strong>Біо:</strong> {user?.bio}</p>
      <p><strong>Аватар:</strong> {user?.avatar}</p>
      <p><strong>Телефон:</strong> {user?.phone}</p>
      <p><strong>Веб-сайт:</strong> {user?.website}</p>
      <p><strong>LinkedIn:</strong> {user?.linkedin}</p>
      <p><strong>GitHub:</strong> {user?.github}</p>
      <p><strong>Навички:</strong> {user?.skills?.join(', ')}</p>
      <p><strong>Досвід:</strong> {user?.experience}</p>
      <p><strong>Освіта:</strong> {user?.education}</p>
    </div>
  );
};

export default UserDebug;






