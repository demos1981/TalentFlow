'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { applicationService } from '../services/applicationService';
import { USER_TYPES } from '../constants/index';
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

  useEffect(() => {
    // Приховуємо кнопки "Подати заявку" для роботодавців
    if (!user || user.role === USER_TYPES.EMPLOYER) {
      const applyButtons = document.querySelectorAll('.btn-primary');
      applyButtons.forEach((button) => {
        const buttonText = button.textContent?.trim();
        if (buttonText === 'Подати заявку') {
          (button as HTMLElement).style.display = 'none';
        }
      });
      return;
    }

    // Перевіряємо існуючі заявки та оновлюємо стан кнопок для кандидатів
    const checkExistingApplications = async () => {
      if (user.role !== USER_TYPES.CANDIDATE) {
        return;
      }

      const applyButtons = document.querySelectorAll('.btn-primary');
      
      for (let i = 0; i < applyButtons.length && i < jobs.length; i++) {
        const button = applyButtons[i] as HTMLButtonElement;
        const buttonText = button.textContent?.trim();
        
        if (buttonText === 'Подати заявку') {
          const job = jobs[i];
          const hasExistingApplication = await applicationService.checkExistingApplication(job.id);
          
          if (hasExistingApplication) {
            button.innerHTML = '✓ Заявку подано';
            button.style.backgroundColor = '#10b981';
            button.style.color = 'white';
            button.style.border = 'none';
            button.className = button.className.replace('btn-primary', 'btn-success');
          }
        }
      }
    };

    // Додаємо невеликий delay для завантаження DOM
    const timer = setTimeout(() => {
      checkExistingApplications();
    }, 500);

    // Знаходимо всі статичні кнопки "Подати заявку" і додаємо обробники подій
    const applyButtons = document.querySelectorAll('.btn-primary');
    
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
        button.innerHTML = 'Подача заявки...';
        
        await applicationService.createApplication({
          jobId: job.id,
          coverLetter: 'Зацікавлений у цій позиції'
        });
        
        // Показуємо успіх
        const currentButtonText = button.innerHTML;
        if (currentButtonText.includes('✓ Заявку подано')) {
          toast.success(`Додаткова заявка на позицію "${job.title}" подана!`);
        } else {
          toast.success(`Заявка на позицію "${job.title}" подана!`);
        }
        
        button.innerHTML = '✓ Заявку подано';
        button.className = button.className.replace('btn-primary', 'btn-success');
        
      } catch (error: any) {
        console.error('Error submitting application:', error);
        
        if (error.response?.status === 409) {
          toast.error('Ви вже подали заявку на цю вакансію');
        } else if (error.response?.status === 401) {
          toast.error('Увійдіть в систему для подачі заявки');
          window.location.href = '/auth';
        } else {
          toast.error(error.response?.data?.message || 'Помилка подачі заявки');
        }
        
        // Відновлюємо кнопку
        button.disabled = false;
        button.innerHTML = originalText;
      }
    };
    
    applyButtons.forEach((button, index) => {
      const buttonText = button.textContent?.trim();
      if (buttonText === 'Подати заявку' && jobs[index]) {
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
  }, [jobs, user]);

  return null; // Компонент невидимий
};
