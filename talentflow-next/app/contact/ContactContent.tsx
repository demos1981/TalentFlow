'use client';

import React, { useState } from 'react';
import { useLanguageStore } from '../../stores/languageStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ContactContent: React.FC = () => {
  const { t, currentLanguage } = useLanguageStore();
  
  // Стан форми
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Обробник зміни полів
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обробник відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error(t('fillAllFields'));
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/contact', {
        ...formData,
        language: currentLanguage
      });
      
      if (response.data.success) {
        toast.success(response.data.message || t('messageSentSuccessfully'));
        // Очищуємо форму
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: ''
        });
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      
      let errorMessage = t('errorSendingMessage');
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = t('unauthorizedMessage');
      } else if (error.response?.status === 403) {
        errorMessage = t('forbiddenMessage');
      } else if (error.response?.status === 404) {
        errorMessage = t('notFoundMessage');
      } else if (error.response?.status === 500) {
        errorMessage = t('serverErrorMessage');
      } else if (error.request) {
        errorMessage = t('networkErrorMessage');
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">{t('contact')}</h1>
        <p className="contact-description">
          {t('contactDescription')}
        </p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <h2>{t('contactInformation')}</h2>
          
          <div className="contact-methods">
            <div className="contact-method">
              <h3>{t('email')}</h3>
              <p>info@talentflow.ua</p>
              <p>support@talentflow.ua</p>
            </div>
            
            <div className="contact-method">
              <h3>{t('phone')}</h3>
              <p>+380 44 123 45 67</p>
              <p>{t('workingHours')}</p>
            </div>
            
            <div className="contact-method">
              <h3>{t('address')}</h3>
              <p>{t('streetAddress')}</p>
              <p>{t('cityCountry')}</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form">
          <h2>{t('writeToUs')}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('name')} *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">{t('email')} *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">{t('phone')}</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+380 XX XXX XX XX"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">{t('subject')} *</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">{t('message')} *</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? t('sending') : t('send')}
            </button>
          </form>
        </div>
      </div>
      
      <div className="contact-support">
        <h2>{t('support')}</h2>
        <div className="support-options">
          <div className="support-option">
            <h3>{t('technicalSupport')}</h3>
            <p>{t('platformHelp')}</p>
            <a href="mailto:support@talentflow.ua" className="btn btn-outline">
              {t('write')}
            </a>
          </div>
          
          <div className="support-option">
            <h3>{t('businessConsultations')}</h3>
            <p>{t('hiringConsultations')}</p>
            <a href="mailto:business@talentflow.ua" className="btn btn-outline">
              {t('write')}
            </a>
          </div>
          
          <div className="support-option">
            <h3>{t('partnership')}</h3>
            <p>{t('partnershipQuestions')}</p>
            <a href="mailto:partnerships@talentflow.ua" className="btn btn-outline">
              {t('write')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactContent;
