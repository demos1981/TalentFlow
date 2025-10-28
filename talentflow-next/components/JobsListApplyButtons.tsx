'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { applicationService } from '../services/applicationService';
import { USER_TYPES } from '../constants/index';
import { useLocalization } from '../hooks/useLocalization';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
}

interface JobsListApplyButtonsProps {
  jobs: Job[];
}

export const JobsListApplyButtons: React.FC<JobsListApplyButtonsProps> = ({ jobs }) => {
  const { user } = useAuthStore();
  const { t } = useLocalization();

  useEffect(() => {
    // Приховуємо кнопки "Подати заявку" для роботодавців
    if (!user || user.role === USER_TYPES.EMPLOYER) {
      const applyButtons = document.querySelectorAll('.apply-button');
      applyButtons.forEach((button) => {
        (button as HTMLElement).style.display = 'none';
      });
      return;
    }

    // Перевіряємо існуючі заявки та оновлюємо стан кнопок для кандидатів
    const checkExistingApplications = async () => {
      if (user.role !== USER_TYPES.CANDIDATE) {
        return;
      }

      const applyButtons = document.querySelectorAll('.apply-button');
      
      for (let i = 0; i < applyButtons.length && i < jobs.length; i++) {
        const button = applyButtons[i] as HTMLButtonElement;
        
        const job = jobs[i];
        const hasExistingApplication = await applicationService.checkExistingApplication(job.id);
        
        if (hasExistingApplication) {
          button.innerHTML = `✓ ${t('applicationSubmitted')}`;
          button.style.backgroundColor = '#10b981';
          button.style.color = 'white';
          button.style.border = 'none';
          button.className = button.className.replace('btn-primary', 'btn-success');
        }
      }
    };

    // Додаємо невеликий delay для завантаження DOM
    const timer = setTimeout(() => {
      checkExistingApplications();
    }, 500);

    // Знаходимо всі статичні кнопки "Подати заявку" і додаємо обробники подій
    const applyButtons = document.querySelectorAll('.apply-button');
    
    const handleApplyClick = async (event: Event, job: Job) => {
      event.preventDefault();
      
      // Перевірка авторизації
      if (!user) {
        toast.error('Увійдіть в систему для подачі заявки');
        window.location.href = '/auth';
        return;
      }

      // Перевірка ролі
      if (user.role !== USER_TYPES.CANDIDATE) {
        toast.error('Тільки кандидати можуть подавати заявки');
        return;
      }

      const button = event.target as HTMLButtonElement;
      const originalText = button.innerHTML;
      
      try {
        // Показуємо індикатор завантаження
        button.disabled = true;
        button.innerHTML = t('submittingApplication');
        
        await applicationService.createApplication({
          jobId: job.id,
          coverLetter: t('interestedInPosition')
        });
        
        // Показуємо успіх
        const currentButtonText = button.innerHTML;
        if (currentButtonText.includes(`✓ ${t('applicationSubmitted')}`)) {
          toast.success(t('additionalApplicationSubmitted', { title: job.title }));
        } else {
          toast.success(t('applicationSubmittedSuccess', { title: job.title }));
        }
        
        button.innerHTML = `✓ ${t('applicationSubmitted')}`;
        button.className = button.className.replace('btn-primary', 'btn-success');
        
      } catch (error: any) {
        console.error('Error submitting application:', error);
        
        if (error.response?.status === 409) {
          toast.error(t('alreadyApplied'));
        } else if (error.response?.status === 401) {
          toast.error(t('loginToApply'));
          window.location.href = '/auth';
        } else {
          toast.error(error.response?.data?.message || t('errorSubmittingApplication'));
        }
        
        // Відновлюємо кнопку
        button.disabled = false;
        button.innerHTML = originalText;
      }
    };
    
    applyButtons.forEach((button, index) => {
      if (jobs[index]) {
        const job = jobs[index];
        const clickHandler = (event: Event) => handleApplyClick(event, job);
        button.addEventListener('click', clickHandler);
        
        // Зберігаємо посилання на обробник для очищення
        (button as any).__clickHandler = clickHandler;
      }
    });

    // Очищуємо обробники при демонтажі
    return () => {
      clearTimeout(timer);
      applyButtons.forEach((button) => {
        if ((button as any).__clickHandler) {
          button.removeEventListener('click', (button as any).__clickHandler);
        }
      });
    };
  }, [jobs, user, t]);

  return null; // Компонент невидимий
};
