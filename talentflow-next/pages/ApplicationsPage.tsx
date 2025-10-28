import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

const ApplicationsPage: React.FC = () => {
  const { t } = useLanguageStore();
  
  // Поки що порожній масив - дані будуть завантажуватися з бекенду
  const applications: any[] = [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="icon" />;
      case 'approved':
        return <CheckCircle className="icon" />;
      case 'rejected':
        return <XCircle className="icon" />;
      default:
        return <FileText className="icon" />;
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('applications')}</h1>
        <p className="dashboard-greeting-subtitle">{t('applicationsDescription')}</p>
      </div>

      <div className="dashboard-sections-grid">
        {applications.map((app) => (
          <div key={app.id} className="dashboard-section-card">
            <div className="application-header">
              <div className="application-candidate">
                <User className="icon" />
                <span>{app.candidate}</span>
              </div>
              <div className={`application-status ${app.status}`}>
                {getStatusIcon(app.status)}
                <span>{app.status === 'pending' ? t('onReview') : t('approved')}</span>
              </div>
            </div>
            
            <div className="application-details">
              <h3>{app.position}</h3>
              <p>{t('companyNotSpecified')}: {app.company}</p>
              <p>{t('experience')}: {app.experience}</p>
              <p>{t('appliedOn')}: {app.appliedDate}</p>
            </div>
            
            <div className="application-actions">
              <button className="btn btn-primary">{t('viewApplication')}</button>
              <button className="btn btn-outline">{t('reject')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
