'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { applicationService } from '../services/applicationService';
import { USER_TYPES } from '../constants/index';
import toast from 'react-hot-toast';

interface JobDetailApplyButtonProps {
  jobId: string;
  jobTitle: string;
}

export const JobDetailApplyButton: React.FC<JobDetailApplyButtonProps> = ({ jobId, jobTitle }) => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [existingApplication, setExistingApplication] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Перевіряємо існуючу заявку при завантаженні
  const checkApplication = useCallback(async () => {
    if (user && user.role === USER_TYPES.CANDIDATE) {
      try {
        const hasApplication = await applicationService.checkExistingApplication(jobId);
        setExistingApplication(hasApplication);
      } catch (error) {
        console.error('Error checking application:', error);
      } finally {
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [jobId, user]);

  useEffect(() => {
    checkApplication();
  }, [checkApplication]);

  useEffect(() => {
    if (isChecking || !user) return;

    // Приховуємо кнопку для роботодавців
    if (user.role === USER_TYPES.EMPLOYER) {
      const applyButton = document.querySelector('.apply-button');
      if (applyButton) {
        (applyButton as HTMLElement).style.display = 'none';
      }
      return;
    }

    // Оновлюємо стан кнопки
    const applyButton = document.querySelector('.apply-button') as HTMLButtonElement;
    if (applyButton) {
      if (existingApplication) {
        applyButton.textContent = '✓ ' + (t('applicationSubmitted'));
        applyButton.disabled = true;
        applyButton.style.backgroundColor = '#10b981';
        applyButton.style.color = 'white';
        applyButton.className = applyButton.className.replace('btn-primary', 'btn-success');
      }
    }
  }, [existingApplication, isChecking, user, t]);

  // Додаємо обробник подій
  useEffect(() => {
    if (!user || user.role !== USER_TYPES.CANDIDATE || isChecking) return;

    const applyButton = document.querySelector('.apply-button') as HTMLButtonElement;
    if (!applyButton || existingApplication) return;

    const handleApplyClick = async (event: Event) => {
      event.preventDefault();
      
      // Перевірка авторизації
      if (!user) {
        toast.error(t('loginToApply'));
        window.location.href = '/auth';
        return;
      }

      // Перевірка ролі
      if (user.role !== USER_TYPES.CANDIDATE) {
        toast.error(t('onlyCandidatesCanApply'));
        return;
      }

      const originalText = applyButton.innerHTML;
      
      try {
        // Показуємо індикатор завантаження
        applyButton.disabled = true;
        applyButton.innerHTML = t('submittingApplication');
        
        await applicationService.createApplication({
          jobId,
          coverLetter: t('interestedInPosition') || 'Зацікавлений у цій позиції'
        });
        
        // Показуємо успіх
        toast.success(t('applicationSubmittedSuccess') || `Заявка на позицію "${jobTitle}" подана!`);
        
        setExistingApplication(true);
        applyButton.innerHTML = '✓ ' + (t('applicationSubmitted'));
        applyButton.className = applyButton.className.replace('btn-primary', 'btn-success');
        applyButton.style.backgroundColor = '#10b981';
        applyButton.style.color = 'white';
        
      } catch (error: any) {
        console.error('Error submitting application:', error);
        
        if (error.response?.status === 409) {
          toast.error(t('alreadyApplied'));
          setExistingApplication(true);
        } else if (error.response?.status === 401) {
          toast.error(t('loginToApply'));
          window.location.href = '/auth';
        } else {
          toast.error(error.response?.data?.message || t('errorSubmittingApplication'));
        }
        
        // Відновлюємо кнопку
        applyButton.disabled = false;
        applyButton.innerHTML = originalText;
      }
    };

    applyButton.addEventListener('click', handleApplyClick);

    return () => {
      applyButton.removeEventListener('click', handleApplyClick);
    };
  }, [jobId, jobTitle, user, existingApplication, isChecking, t]);

  return null; // Компонент невидимий
};
