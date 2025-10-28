import React from 'react';
import { Metadata } from 'next';
import Layout from '../../components/Layout/Layout';
import { ServerCompaniesContent } from '../../components/ServerCompaniesContent';

export const metadata: Metadata = {
  title: 'Компанії - TalentFlow',
  description: 'Знайдіть найкращі компанії та їх вакансії',
  keywords: 'компанії, роботодавці, вакансії, кар\'єра, IT, HR',
  openGraph: {
    title: 'Компанії - TalentFlow',
    description: 'Знайдіть найкращі компанії та їх вакансії',
    type: 'website',
  },
};

const CompaniesPage: React.FC = async () => {
  return (
    <Layout>
      <ServerCompaniesContent />
    </Layout>
  );
};

export default CompaniesPage;