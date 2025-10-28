import React from 'react';
import { jobService } from '../services/jobService';
import { ClientJobDetailContent } from './ClientJobDetailContent';

interface ServerJobDetailContentProps {
  jobId: string;
}

export const ServerJobDetailContent: React.FC<ServerJobDetailContentProps> = async ({ jobId }) => {
  try {
    // Отримуємо реальні дані з бекенду
    const result = await jobService.getJobById(jobId);
    
    // Перевіряємо структуру відповіді
    if (result.success && result.data) {
      return <ClientJobDetailContent job={result.data} error={null} />;
    } else {
      return <ClientJobDetailContent job={null} error={result.message || 'Job not found'} />;
    }
  } catch (error: any) {
    // Обробляємо помилки
    return <ClientJobDetailContent job={null} error={error.message || 'Failed to load job'} />;
  }
};
