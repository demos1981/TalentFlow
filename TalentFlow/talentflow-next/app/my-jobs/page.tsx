'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { USER_TYPES } from '../../constants/index';
import api from '../../services/api';
import { 
  Briefcase, 
  Plus, 
  Edit2, 
  Trash2, 
  Play, 
  Pause, 
  X, 
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import './my-jobs.css';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  company: any;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  status: string;
  isActive: boolean;
  createdAt: string;
  createdByUserId: string;
}

const MyJobsPage: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [jobToChangeStatus, setJobToChangeStatus] = useState<{ id: string; title: string; newStatus: string } | null>(null);

  // Ініціалізуємо авторизацію один раз
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { checkAuth } = useAuthStore.getState();
        await checkAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Завантаження робіт після ініціалізації авторизації
  useEffect(() => {
    if (!isInitialized || isLoading) return;
    
    if (!user) {
      router.replace('/auth');
      return;
    }

    if (user.role !== USER_TYPES.EMPLOYER) {
      router.replace('/jobs');
      return;
    }

    loadMyJobs();
  }, [isInitialized, isLoading, user, router]);

  const loadMyJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const response = await api.get('/jobs/my-created?page=1&limit=50');
      
      if (response.data.success) {
        setJobs(response.data.data.jobs || []);
      } else {
        toast.error(t('jobLoadError'));
      }
    } catch (error: any) {
      console.error('Error loading my jobs:', error);
      toast.error(t('jobLoadError'));
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const getCompanyName = (company: any) => {
    if (typeof company === 'string') return company;
    if (company && typeof company === 'object') {
      return company.name || company.companyName || 'Компанія не вказана';
    }
    return 'Компанія не вказана';
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { text: t('draft'), class: 'draft' },
      active: { text: t('active'), class: 'active' },
      paused: { text: t('paused'), class: 'paused' },
      closed: { text: t('closed'), class: 'closed' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, class: 'draft' };
    
    return (
      <span className={`job-status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    router.push(`/jobs/edit/${jobId}`);
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    setJobToDelete({ id: jobId, title: jobTitle });
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const response = await api.delete(`/jobs/${jobToDelete.id}`);
      
      if (response.data.success) {
        toast.success(t('jobDeleteSuccess'));
        setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      } else {
        toast.error(t('jobDeleteError'));
      }
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(t('jobDeleteError'));
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const handlePublishJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    setJobToChangeStatus({ 
      id: jobId, 
      title: job.title, 
      newStatus: 'active' 
    });
    setShowStatusModal(true);
  };

  const handlePauseJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    setJobToChangeStatus({ 
      id: jobId, 
      title: job.title, 
      newStatus: 'paused' 
    });
    setShowStatusModal(true);
  };

  const handleCloseJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    setJobToChangeStatus({ 
      id: jobId, 
      title: job.title, 
      newStatus: 'closed' 
    });
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!jobToChangeStatus) return;

    try {
      let endpoint = '';
      switch (jobToChangeStatus.newStatus) {
        case 'active':
          endpoint = `/jobs/${jobToChangeStatus.id}/publish`;
          break;
        case 'paused':
          endpoint = `/jobs/${jobToChangeStatus.id}/pause`;
          break;
        case 'closed':
          endpoint = `/jobs/${jobToChangeStatus.id}/close`;
          break;
        default:
          toast.error('Невідомий статус');
          return;
      }

      const response = await api.post(endpoint);
      
      if (response.data.success) {
        toast.success(t('jobStatusChangeSuccess'));
        // Оновлюємо статус в локальному стані
        setJobs(jobs.map(job => 
          job.id === jobToChangeStatus.id 
            ? { ...job, status: jobToChangeStatus.newStatus }
            : job
        ));
      } else {
        toast.error(t('jobStatusChangeError'));
      }
    } catch (error: any) {
      console.error('Error changing job status:', error);
      toast.error(t('jobStatusChangeError'));
    } finally {
      setShowStatusModal(false);
      setJobToChangeStatus(null);
    }
  };

  // Показуємо завантаження поки не ініціалізовано
  if (!isInitialized || isLoading) {
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

  // Якщо не роботодавець - перенаправляємо на jobs
  if (user.role !== USER_TYPES.EMPLOYER) {
    return null; // router.replace('/jobs') вже викликано в useEffect
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="purple-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">{t('myJobsTitle')}</h1>
            <p className="dashboard-greeting-subtitle">{t('myJobsSubtitle')}</p>
          </div>
          <button 
            onClick={() => router.push('/jobs/create')} 
            className="add-job-btn"
          >
            <Plus className="icon" />
            {t('addJob')}
          </button>
        </div>

        {isLoadingJobs && (
          <div className="loading-state">
            <p>{t('loading')}</p>
          </div>
        )}

        {!isLoadingJobs && jobs.length === 0 && (
          <div className="empty-state">
            <Briefcase size={48} />
            <h3>{t('noJobsCreated')}</h3>
            <p>{t('createFirstJob')}</p>
            <button 
              onClick={() => router.push('/jobs/create')} 
              className="create-job-btn"
            >
              <Plus className="create-job-icon" />
              {t('createJob')}
            </button>
          </div>
        )}

        {!isLoadingJobs && jobs.length > 0 && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-company">
                      <Building2 className="icon" />
                      <span>{getCompanyName(job.company)}</span>
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                <div className="job-meta">
                  <div className="job-meta-item">
                    <MapPin className="icon" />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-meta-item">
                    <Briefcase className="icon" />
                    <span>{job.type}</span>
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="job-meta-item">
                      <DollarSign className="icon" />
                      <span>{job.salaryMin} - {job.salaryMax} {job.currency || 'USD'}</span>
                    </div>
                  )}
                  <div className="job-meta-item">
                    <Clock className="icon" />
                    <span>{t('createdOn')} {new Date(job.createdAt).toLocaleDateString('uk-UA')}</span>
                  </div>
                </div>

                <div className="job-description">
                  {job.description}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="job-skills">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                <div className="job-actions">
                  <button
                    onClick={() => handleViewJob(job.id)}
                    className="btn btn-outline"
                  >
                    <Eye className="icon" />
                    {t('view')}
                  </button>
                  
                  <button
                    onClick={() => handleEditJob(job.id)}
                    className="btn btn-outline"
                  >
                    <Edit2 className="icon" />
                    {t('edit')}
                  </button>

                  {/* Status control buttons */}
                  {job.status === 'draft' && (
                    <button
                      onClick={() => handlePublishJob(job.id)}
                      className="btn btn-success"
                    >
                      <Play className="icon" />
                      {t('publish')}
                    </button>
                  )}

                  {job.status === 'active' && (
                    <button
                      onClick={() => handlePauseJob(job.id)}
                      className="btn btn-warning"
                    >
                      <Pause className="icon" />
                      {t('pause')}
                    </button>
                  )}

                  {job.status === 'paused' && (
                    <>
                      <button
                        onClick={() => handlePublishJob(job.id)}
                        className="btn btn-success"
                      >
                        <Play className="icon" />
                        {t('activate')}
                      </button>
                      <button
                        onClick={() => handleCloseJob(job.id)}
                        className="btn btn-warning"
                      >
                        <X className="icon" />
                        {t('close')}
                      </button>
                    </>
                  )}

                  {job.status === 'closed' && (
                    <button
                      onClick={() => handlePublishJob(job.id)}
                      className="btn btn-success"
                    >
                      <Play className="icon" />
                      {t('restore')}
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    className="btn btn-danger"
                  >
                    <Trash2 className="icon" />
                    {t('delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && jobToDelete && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{t('confirmDelete')}</h3>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="modal-close"
                >
                  <X className="icon" />
                </button>
              </div>
              <div className="modal-body">
                <p>{t('confirmDeleteJobMessage')} "{jobToDelete.title}"?</p>
                <p>{t('deleteJobCannotBeUndone')}</p>
              </div>
              <div className="modal-actions">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-outline"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={confirmDeleteJob}
                  className="btn btn-danger"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Modal */}
        {showStatusModal && jobToChangeStatus && (
          <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{t('changeStatus')}</h3>
                <button 
                  onClick={() => setShowStatusModal(false)}
                  className="modal-close"
                >
                  <X className="icon" />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {t('changeStatusMessage')} "{jobToChangeStatus.title}" на "{jobToChangeStatus.newStatus}"?
                </p>
              </div>
              <div className="modal-actions">
                <button 
                  onClick={() => setShowStatusModal(false)}
                  className="btn btn-outline"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={confirmStatusChange}
                  className="btn btn-primary"
                >
                  {t('change')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyJobsPage;