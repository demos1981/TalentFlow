import React from 'react';
import { Metadata } from 'next';
import { AuthGuard } from '../../components/AuthGuard';

export const metadata: Metadata = {
  title: 'Авторизація - TalentFlow',
  description: 'Увійдіть в систему TalentFlow',
};

const AuthPageWrapper: React.FC = () => {
  return <AuthGuard />;
};

export default AuthPageWrapper;
