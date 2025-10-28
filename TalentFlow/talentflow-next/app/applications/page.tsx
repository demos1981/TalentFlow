'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { applicationService, type Application } from '../../services/applicationService';
import { USER_TYPES } from '../../constants/index';
import { FileText, Clock, CheckCircle, XCircle, User, Search, Filter, Eye, ThumbsUp, ThumbsDown, Calendar, Briefcase, Building2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import './applications.css';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізуємо авторизацію один раз
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { checkAuth } = useAuthStore.getState();
        await checkAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Завантаження заявок з API
  useEffect(() => {
    if (!isInitialized || authLoading) return;
    
    if (!user) {
      router.replace('/auth');
      return;
    }
    
    loadApplications();
  }, [user, isInitialized, authLoading, router]);

  const loadApplications = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      let response;
      if (user.role === USER_TYPES.EMPLOYER) {
        // Роботодавець бачить заявки на свої вакансії
        response = await applicationService.getEmployerApplications({
          page: 1,
          limit: 50
        });
      } else if (user.role === USER_TYPES.CANDIDATE) {
        // Кандидат бачить свої заявки
        response = await applicationService.getAllApplications({
          page: 1,
          limit: 50
        });
      } else {
        // Адмін бачить всі заявки
        response = await applicationService.getAllApplications({
          page: 1,
          limit: 50
        });
      }
      
      setApplications(response.applications || []);
    } catch (error: any) {
      console.error('Error loading applications:', error);
      if (error.response?.status === 401) {
        toast.error(t('loginToViewApplications'));
      } else {
        toast.error(t('errorLoadingApplications'));
      }
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="icon" />;
      case 'approved':
        return <CheckCircle className="icon" />;
      case 'rejected':
        return <XCircle className="icon" />;
      case 'interview':
        return <Calendar className="icon" />;
      case 'hired':
        return <ThumbsUp className="icon" />;
      default:
        return <FileText className="icon" />;
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

  const filteredApplications = applications.filter(application => {
    const candidateName = application.candidate 
      ? `${application.candidate.firstName} ${application.candidate.lastName}`.toLowerCase()
      : '';
    const jobTitle = application.job?.title?.toLowerCase() || '';
    const companyName = application.job?.company?.name?.toLowerCase() || '';
    const coverLetter = application.coverLetter?.toLowerCase() || '';
    
    const matchesSearch = 
      candidateName.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase()) ||
      coverLetter.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewApplication = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, 'approved');
      toast.success(t('applicationApproved'));
      loadApplications(); // Перезавантажуємо список
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('errorApprovingApplication'));
    }
  };

  const handleInterviewApplication = async (applicationId: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, 'interview');
      toast.success(t('applicationMovedToInterview'));
      loadApplications(); // Перезавантажуємо список
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('errorUpdatingStatus'));
    }
  };

  const handleHireApplication = async (applicationId: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, 'hired');
      toast.success(t('candidateHired'));
      loadApplications(); // Перезавантажуємо список
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('errorUpdatingStatus'));
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, 'rejected');
      toast.success(t('applicationRejected'));
      loadApplications(); // Перезавантажуємо список
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('errorRejectingApplication'));
    }
  };

  // Показуємо завантаження поки не ініціалізовано
  if (!isInitialized || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">{t('initializing')}...</p>
        </div>
      </div>
    );
  }

  // Якщо не авторизований - перенаправляємо на auth
  if (!user) {
    return null; // router.replace('/auth') вже викликано в useEffect
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="applications-page">
          <div className="loading-spinner">{t('loading')}...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="applications-page">
        <div className="applications-header">
          <div className="applications-header-content">
            <h1>{t('applications')}</h1>
            <p>{t('applicationsDescription')}</p>
          </div>
        </div>

        {/* Пошук та фільтри */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={t('searchApplications')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="rejected">{t('rejected')}</option>
              <option value="interview">{t('interview')}</option>
              <option value="hired">{t('hired')}</option>
            </select>
            <button className="filters-btn">
              <Filter className="icon" />
              {t('filter')}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="applications-stats">
          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock className="icon" />
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {applications.filter(app => app.status === 'pending').length}
              </span>
              <span className="stat-label">{t('pending')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved">
              <CheckCircle className="icon" />
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {applications.filter(app => app.status === 'approved').length}
              </span>
              <span className="stat-label">{t('approved')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon interview">
              <Calendar className="icon" />
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {applications.filter(app => app.status === 'interview').length}
              </span>
              <span className="stat-label">{t('interviews')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon hired">
              <ThumbsUp className="icon" />
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {applications.filter(app => app.status === 'hired').length}
              </span>
              <span className="stat-label">{t('hired')}</span>
            </div>
          </div>
        </div>

        {/* Список заявок */}
        <div className="applications-grid">
          {filteredApplications.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <div className="application-candidate">
                  <div className="candidate-avatar">
                    <User className="icon" />
                  </div>
                  <div className="candidate-info">
                    <h3 className="candidate-name">
                      {application.candidate 
                        ? `${application.candidate.firstName} ${application.candidate.lastName}`
                        : t('candidate')
                      }
                    </h3>
                    <p className="candidate-email">
                      {application.candidate?.email || t('emailNotSpecified')}
                    </p>
                  </div>
                </div>
                <div className={`application-status ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span>{getStatusLabel(application.status)}</span>
                </div>
              </div>
              
              <div className="application-details">
                <div className="position-info">
                  <h4 className="position-title">
                    {application.job?.title || t('jobNotSpecified')}
                  </h4>
                  <div className="company-info">
                    <Building2 className="icon" />
                    <span>
                      {application.job?.company?.name || t('companyNotSpecified')}
                    </span>
                  </div>
                </div>
                
                <div className="application-meta">
                  <div className="meta-item">
                    <Calendar className="icon" />
                    <span>{t('appliedOn')}: {new Date(application.createdAt).toLocaleDateString('uk-UA')}</span>
                  </div>
                  {application.expectedSalary && (
                    <div className="meta-item">
                      <DollarSign className="icon" />
                      <span>{t('expectedSalary')}: {application.expectedSalary} USD</span>
                    </div>
                  )}
                  {application.availableFrom && (
                    <div className="meta-item">
                      <Calendar className="icon" />
                      <span>{t('availableFrom')}: {application.availableFrom}</span>
                    </div>
                  )}
                </div>

                <div className="cover-letter">
                  <p>{application.coverLetter}</p>
                </div>

                {application.notes && (
                  <div className="application-notes">
                    <strong>{t('candidateNotes')}:</strong>
                    <p>{application.notes}</p>
                  </div>
                )}

                {application.employerNotes && (
                  <div className="employer-notes">
                    <strong>{t('employerNotes')}:</strong>
                    <p>{application.employerNotes}</p>
                  </div>
                )}
              </div>
              
              <div className="application-actions">
                <button
                  className="view-btn"
                  onClick={() => handleViewApplication(application.id)}
                >
                  <Eye className="icon" />
                  {t('viewApplication')}
                </button>
                
                
                {/* Кнопки для pending статусу - тільки approve або reject */}
                {application.status === 'pending' && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveApplication(application.id)}
                    >
                      <ThumbsUp className="icon" />
                      {t('approve')}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectApplication(application.id)}
                    >
                      <ThumbsDown className="icon" />
                      {t('reject')}
                    </button>
                  </>
                )}
                
                {/* Кнопки для approved статусу - тільки interview або reject */}
                {application.status === 'approved' && (
                  <>
                    <button
                      className="interview-btn"
                      onClick={() => handleInterviewApplication(application.id)}
                    >
                      <Calendar className="icon" />
                      {t('scheduleInterview')}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectApplication(application.id)}
                    >
                      <ThumbsDown className="icon" />
                      {t('reject')}
                    </button>
                  </>
                )}
                
                {/* Кнопки для interview статусу - тільки hire або reject */}
                {application.status === 'interview' && (
                  <>
                    <button
                      className="hire-btn"
                      onClick={() => handleHireApplication(application.id)}
                    >
                      <ThumbsUp className="icon" />
                      {t('hire')}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectApplication(application.id)}
                    >
                      <ThumbsDown className="icon" />
                      {t('reject')}
                    </button>
                  </>
                )}
                
                {/* Для hired статусу - тільки перегляд */}
                {application.status === 'hired' && (
                  <div className="status-success">
                    <CheckCircle className="icon" />
                    <span>{t('candidateHired')}</span>
                  </div>
                )}
                
                {/* Для rejected статусу - тільки перегляд */}
                {application.status === 'rejected' && (
                  <div className="status-rejected">
                    <XCircle className="icon" />
                    <span>{t('applicationRejected')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="empty-state">
            <FileText className="icon" />
            <h3>{t('noApplicationsFound')}</h3>
            <p>{t('tryDifferentSearch')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApplicationsPage;
