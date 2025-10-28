import React from 'react';
import { Metadata } from 'next';
import Layout from '../../../components/Layout/Layout';
import { ServerCompanyDetailContent } from '../../../components/ServerCompanyDetailContent';

// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array for now - will be populated at build time
  return [];
}

interface CompanyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Деталі компанії - TalentFluent`,
    description: 'Детальна інформація про компанію та її вакансії',
    keywords: 'компанія, роботодавець, вакансії, деталі, найм',
    openGraph: {
      title: `Деталі компанії - TalentFluent`,
      description: 'Детальна інформація про компанію та її вакансії',
      type: 'website',
    },
  };
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <Layout>
      <ServerCompanyDetailContent companyId={id} />
    </Layout>
  );
};

export default CompanyDetailPage;
