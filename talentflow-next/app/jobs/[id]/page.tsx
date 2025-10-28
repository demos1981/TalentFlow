import React from 'react';
import { Metadata } from 'next';
import Layout from '../../../components/Layout/Layout';
import { ServerJobDetailContent } from '../../../components/ServerJobDetailContent';

// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array for now - will be populated at build time
  return [];
}

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Деталі вакансії - TalentFluent`,
    description: 'Детальна інформація про вакансію',
    keywords: 'вакансія, робота, деталі, найм, кар\'єра',
    openGraph: {
      title: `Деталі вакансії - TalentFluent`,
      description: 'Детальна інформація про вакансію',
      type: 'website',
    },
  };
}

const JobDetailPage: React.FC<JobDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <Layout>
      <ServerJobDetailContent jobId={id} />
    </Layout>
  );
};

export default JobDetailPage;
