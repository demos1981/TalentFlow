'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../../../../stores/authStore';
import { useLanguageStore } from '../../../../stores/languageStore';
import Layout from '../../../../components/Layout/Layout';
import { ArrowLeft, Send, MessageSquare, Mail, Phone } from 'lucide-react';


const ContactPage: React.FC = () => {
  const [candidateName, setCandidateName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const params = useParams();
  const candidateId = params?.id as string;

  useEffect(() => {
    // Отримуємо ім'я кандидата (в реальному додатку - з API)
    const mockCandidates: { [key: string]: string } = {
      '1': 'Олена Петренко',
      '2': 'Дмитро Сидоренко',
      '3': 'Анна Коваленко',
      '4': 'Михайло Іванов'
    };
    setCandidateName(mockCandidates[candidateId] || t('candidate'));
  }, [candidateId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    
    // Симуляція відправки повідомлення
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(t('messageSent'));
    setMessage('');
    setIsLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="contact-page">
        <div className="contact-header">
          <button onClick={handleBack} className="back-btn">
            <ArrowLeft className="icon" />
            {t('back')}
          </button>
          <h1>{t('contactWith')} {candidateName}</h1>
        </div>

        <div className="contact-content">
          <div className="contact-info-card">
            <div className="contact-info-header">
              <MessageSquare className="icon" />
              <h2>{t('sendMessage')}</h2>
            </div>
            <p>{t('sendMessageDescription')}</p>
          </div>

          <form onSubmit={handleSendMessage} className="contact-form">
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                {t('yourMessage')}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('writeMessageForCandidate')}
                className="form-textarea"
                rows={6}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="send-btn"
                disabled={isLoading || !message.trim()}
              >
                <Send className="icon" />
                {isLoading ? t('sending') : t('sendMessage')}
              </button>
            </div>
          </form>

          <div className="contact-alternatives">
            <h3>{t('alternativeContactMethods')}</h3>
            <div className="alternative-methods">
              <div className="method-item">
                <Mail className="icon" />
                <div>
                  <h4>{t('email')}</h4>
                  <p>{t('sendEmailDirectly')}</p>
                  <button className="method-btn">{t('openEmail')}</button>
                </div>
              </div>
              <div className="method-item">
                <Phone className="icon" />
                <div>
                  <h4>{t('phone')}</h4>
                  <p>{t('callCandidate')}</p>
                  <button className="method-btn">{t('showNumber')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
