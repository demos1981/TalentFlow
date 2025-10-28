import React from 'react';
import { JobsContentWrapper } from './JobsContentWrapper';
import { jobService } from '../services/jobService';

interface ServerJobsContentProps {
  companyFilter?: string;
}

export const ServerJobsContent: React.FC<ServerJobsContentProps> = async ({ companyFilter }) => {
  // Отримуємо реальні дані з бекенду через сервіс
  const { jobs, error } = await jobService.getJobsWithErrorHandling({
    page: 1,
    limit: 50
  });

  return (
    <JobsContentWrapper 
      companyFilter={companyFilter}
      initialJobs={jobs}
      initialError={error?.message || null}
    />
  );
};