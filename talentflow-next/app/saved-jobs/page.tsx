'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useSavedJobsStore, useSavedJobsCount } from '../../stores/savedJobsStore';
import { useLanguageStore } from '../../stores/languageStore';
import { MapPin, Briefcase, DollarSign, Star } from 'lucide-react';
import Link from 'next/link';
import { jobService } from '../../services/jobService';
import './saved-jobs.css';

const SavedJobsPage: React.FC = () => {
  const { savedJobIds, removeJob } = useSavedJobsStore();
  const count = useSavedJobsCount();
  const { t } = useLanguageStore();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedJobs();
  }, [savedJobIds.length]);

  const loadSavedJobs = async () => {
    if (savedJobIds.length === 0) {
      setSavedJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { jobs, error: jobsError } = await jobService.getJobsWithErrorHandling({
        page: 1,
        limit: 100
      });

      if (jobsError) {
        setError(jobsError.message || t('errorLoadingData'));
      } else {
        // Фільтруємо вакансії за збереженими ID
        const filteredJobs = jobs.filter((job: any) => savedJobIds.includes(job.id));
        setSavedJobs(filteredJobs);
      }
    } catch (err: any) {
      setError(err.message || t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (company: string | any): string => {
    if (typeof company === 'string') {
      return company;
    }
    return company?.name || 'Компанія не вказана';
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="purple-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">{t('savedJobs')}</h1>
            <p className="dashboard-greeting-subtitle">
              {count > 0 
                ? `${count} ${t('saved')}`
                : t('noSavedJobs')
              }
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="empty-state">
            <div className="loading-spinner">{t('loading')}...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && savedJobs.length === 0 && (
          <div className="empty-state">
            <Star className="empty-icon" />
            <h2>{t('noSavedJobsYet')}</h2>
            <p>{t('saveJobsDescription')}</p>
            <Link href="/jobs" className="btn btn-primary">
              {t('browseJobs')}
            </Link>
          </div>
        )}

        {!loading && !error && savedJobs.length > 0 && (
          <div className="jobs-grid">
            {savedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-title-section">
                    <Link href={`/jobs/${job.id}`} className="job-title">
                      {job.title}
                    </Link>
                    <div className="job-company">{getCompanyName(job.company)}</div>
                  </div>
                </div>

                <div className="job-details">
                  <div className="job-detail-item">
                    <MapPin className="icon" />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail-item">
                    <Briefcase className="icon" />
                    <span>{job.type}</span>
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="job-detail-item">
                      <DollarSign className="icon" />
                      <span>{job.salaryMin} - {job.salaryMax} {job.currency || 'USD'}</span>
                    </div>
                  )}
                </div>

                <div className="job-actions">
                  <Link href={`/jobs/${job.id}`} className="btn btn-primary">
                    {t('view')}
                  </Link>
                  <button
                    onClick={() => {
                      removeJob(job.id);
                      // Оновлюємо список локально
                      setSavedJobs(savedJobs.filter(j => j.id !== job.id));
                    }}
                    className="btn btn-outline btn-unsave"
                  >
                    <Star className="icon filled" />
                    {t('unsave')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedJobsPage;
