import React from 'react';
import { Metadata } from 'next';
import Layout from '../../components/Layout/Layout';
import { ServerJobsContent } from '../../components/ServerJobsContent';

interface JobsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: JobsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const company = params.company as string;
  
  return {
    title: company ? `Вакансії компанії ${company} - TalentFlow` : 'Вакансії - TalentFlow',
    description: company 
      ? `Всі відкриті позиції в компанії ${company}`
      : 'Знайдіть роботу мрії або найкращих кандидатів для вашої компанії',
    keywords: 'вакансії, робота, найм, кар\'єра, IT, HR',
    openGraph: {
      title: company ? `Вакансії компанії ${company} - TalentFlow` : 'Вакансії - TalentFlow',
      description: company 
        ? `Всі відкриті позиції в компанії ${company}`
        : 'Знайдіть роботу мрії або найкращих кандидатів для вашої компанії',
      type: 'website',
    },
  };
}

const JobsPage: React.FC<JobsPageProps> = async ({ searchParams }) => {
  const params = await searchParams;
  const companyFilter = params.company as string;
  
  return (
    <Layout>
      <ServerJobsContent companyFilter={companyFilter} />
    </Layout>
  );
};

export default JobsPage;