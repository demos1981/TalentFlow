'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Building, Calendar, FileText, Linkedin, Globe, DollarSign, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../../stores/languageStore';
import { applicationService, Application } from '../../../services/applicationService';
import './application-detail.css';


export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguageStore();
  const applicationId = params?.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplicationById(applicationId);
      setApplication(data);
    } catch (error: any) {
      console.error('Error loading application:', error);
      setError(error.response?.data?.message || t('errorLoadingApplications'));
      toast.error(t('errorLoadingApplications'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status);
      toast.success(t('applicationStatusChanged'));
      loadApplication(); // Перезавантажуємо дані
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('errorUpdatingStatus'));
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('onReview');
      case 'approved':
        return t('approved');
      case 'rejected':
        return t('rejected');
      case 'interview':
        return t('interview');
      case 'hired':
        return t('hired');
      default:
        return t('unknown');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'interview':
        return 'status-interview';
      case 'hired':
        return 'status-hired';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="application-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="application-detail-page">
        <div className="error-container">
          <h2>{t('error')}</h2>
          <p>{error || t('applicationNotFound')}</p>
          <button onClick={() => router.back()} className="back-btn">
            <ArrowLeft className="icon" />
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-detail-page">
      <div className="application-detail-container">
        {/* Header */}
        <div className="application-detail-header">
          <button onClick={() => router.back()} className="back-btn">
            <ArrowLeft className="icon" />
            {t('backToApplications')}
          </button>
          <div className="header-info">
            <h1>{t('applicationDetails')}</h1>
            <div className={`status-badge ${getStatusColor(application.status)}`}>
              {getStatusLabel(application.status)}
            </div>
          </div>
        </div>

        <div className="application-detail-content">
          {/* Candidate Info */}
          <div className="detail-card">
            <div className="card-header">
              <User className="card-icon" />
              <h2>{t('candidateInformation')}</h2>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">{t('name')}:</span>
                  <span className="info-value">
                    {application.candidate?.firstName} {application.candidate?.lastName}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('email')}:</span>
                  <span className="info-value">
                    {application.candidate?.email || t('notSpecified')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('phone')}:</span>
                  <span className="info-value">
                    {application.candidate?.phone || t('notSpecified')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('location')}:</span>
                  <span className="info-value">
                    {application.candidate?.location || t('notSpecified')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="detail-card">
            <div className="card-header">
              <Building className="card-icon" />
              <h2>{t('jobInformation')}</h2>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">{t('position')}:</span>
                  <span className="info-value">{application.job?.title || t('notSpecified')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('company')}:</span>
                  <span className="info-value">{application.job?.company?.name || t('notSpecified')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('location')}:</span>
                  <span className="info-value">{application.job?.location || t('notSpecified')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('employmentType')}:</span>
                  <span className="info-value">{application.job?.employmentType || t('notSpecified')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="detail-card">
            <div className="card-header">
              <FileText className="card-icon" />
              <h2>{t('applicationDetails')}</h2>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">{t('appliedDate')}:</span>
                  <span className="info-value">
                    {new Date(application.createdAt).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('expectedSalary')}:</span>
                  <span className="info-value">
                    {application.expectedSalary ? `${application.expectedSalary} ₴` : t('notSpecified')}
                  </span>
                </div>
              </div>
              
              <div className="cover-letter-section">
                <h3>{t('coverLetter')}:</h3>
                <div className="cover-letter-content">
                  {application.coverLetter || t('coverLetterNotProvided')}
                </div>
              </div>
            </div>
          </div>

          {/* Links & Documents */}
          <div className="detail-card">
            <div className="card-header">
              <Globe className="card-icon" />
              <h2>{t('linksAndDocuments')}</h2>
            </div>
            <div className="card-content">
              <div className="links-grid">
                {application.resumeUrl && (
                  <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="link-item">
                    <FileText className="link-icon" />
                    <span>{t('resume')}</span>
                  </a>
                )}
                {application.portfolioUrl && (
                  <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="link-item">
                    <Globe className="link-icon" />
                    <span>{t('portfolio')}</span>
                  </a>
                )}
                {application.linkedinUrl && (
                  <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-item">
                    <Linkedin className="link-icon" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-card">
            <div className="card-header">
              <Calendar className="card-icon" />
              <h2>{t('actions')}</h2>
            </div>
            <div className="card-content">
              <div className="actions-grid">
                {/* Кнопки для pending статусу */}
                {application.status === 'pending' && (
                  <>
                    <button
                      className="action-btn approve-btn"
                      onClick={() => handleStatusUpdate('approved')}
                    >
                      <span>{t('approve')}</span>
                    </button>
                    <button
                      className="action-btn reject-btn"
                      onClick={() => handleStatusUpdate('rejected')}
                    >
                      <span>{t('reject')}</span>
                    </button>
                  </>
                )}

                {/* Кнопки для approved статусу */}
                {application.status === 'approved' && (
                  <>
                    <button
                      className="action-btn interview-btn"
                      onClick={() => handleStatusUpdate('interview')}
                    >
                      <span>{t('scheduleInterview')}</span>
                    </button>
                    <button
                      className="action-btn reject-btn"
                      onClick={() => handleStatusUpdate('rejected')}
                    >
                      <span>{t('reject')}</span>
                    </button>
                  </>
                )}

                {/* Кнопки для interview статусу */}
                {application.status === 'interview' && (
                  <>
                    <button
                      className="action-btn hire-btn"
                      onClick={() => handleStatusUpdate('hired')}
                    >
                      <span>{t('hire')}</span>
                    </button>
                    <button
                      className="action-btn reject-btn"
                      onClick={() => handleStatusUpdate('rejected')}
                    >
                      <span>{t('reject')}</span>
                    </button>
                  </>
                )}

                {/* Статуси для завершених заявок */}
                {application.status === 'hired' && (
                  <div className="status-message success">
                    <span>{t('candidateHired')}</span>
                  </div>
                )}

                {application.status === 'rejected' && (
                  <div className="status-message rejected">
                    <span>{t('applicationRejected')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
