'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { applicationService } from '../services/applicationService';
import { USER_TYPES } from '../constants/index';
import toast from 'react-hot-toast';

interface JobDetailApplyButtonProps {
  jobId: string;
  jobTitle: string;
}

export const JobDetailApplyButton: React.FC<JobDetailApplyButtonProps> = ({ jobId, jobTitle }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    // Приховуємо кнопку "Подати заявку" для роботодавців
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

    // Перевіряємо існуючу заявку та оновлюємо стан кнопки для кандидатів
    const checkExistingApplication = async () => {
      if (user.role !== USER_TYPES.CANDIDATE) return;

      const applyButtons = document.querySelectorAll('.btn-primary');
      
      for (const button of applyButtons) {
        const buttonElement = button as HTMLButtonElement;
        const buttonText = buttonElement.textContent?.trim();
        
        if (buttonText === 'Подати заявку') {
          const hasExistingApplication = await applicationService.checkExistingApplication(jobId);
          
          if (hasExistingApplication) {
            console.log('Found existing application, updating button');
            buttonElement.innerHTML = '✓ Заявку подано';
            buttonElement.style.backgroundColor = '#10b981';
            buttonElement.style.color = 'white';
            buttonElement.style.border = 'none';
            buttonElement.className = buttonElement.className.replace('btn-primary', 'btn-success');
          }
        }
      }
    };

    // Додаємо невеликий delay для завантаження DOM
    const timer = setTimeout(() => {
      checkExistingApplication();
    }, 500);

    // Знаходимо статичну кнопку "Подати заявку" і додаємо обробник подій
    const applyButtons = document.querySelectorAll('.btn-primary');
    
    const handleApplyClick = async (event: Event) => {
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
          jobId,
          coverLetter: 'Зацікавлений у цій позиції'
        });
        
        // Показуємо успіх
        const currentButtonText = button.innerHTML;
        if (currentButtonText.includes('✓ Заявку подано')) {
          toast.success(`Додаткова заявка на позицію "${jobTitle}" подана!`);
        } else {
          toast.success(`Заявка на позицію "${jobTitle}" подана!`);
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
    
    applyButtons.forEach((button) => {
      const buttonText = button.textContent?.trim();
      if (buttonText === 'Подати заявку') {
        button.addEventListener('click', handleApplyClick);
        
        // Зберігаємо посилання на обробник для очищення
        (button as any).__clickHandler = handleApplyClick;
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
  }, [jobId, jobTitle, user]);

  return null; // Компонент невидимий
};
