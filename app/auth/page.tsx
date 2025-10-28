import React from 'react';
import { Metadata } from 'next';
import { AuthGuard } from '../../components/AuthGuard';

export const metadata: Metadata = {
  title: 'Авторизація - TalentFluent',
  description: 'Увійдіть в систему TalentFluent',
};

const AuthPageWrapper: React.FC = () => {
  return <AuthGuard />;
};

export default AuthPageWrapper;
