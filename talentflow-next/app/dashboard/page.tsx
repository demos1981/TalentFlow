import React from 'react';
import { Metadata } from 'next';
import { AuthGuard } from '../../components/AuthGuard';

export const metadata: Metadata = {
  title: 'Дашборд - TalentFlow',
  description: 'Особистий кабінет TalentFlow',
};

const DashboardPageWrapper: React.FC = () => {
  return <AuthGuard />;
};

export default DashboardPageWrapper;
