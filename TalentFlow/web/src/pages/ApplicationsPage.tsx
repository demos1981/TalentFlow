import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, User } from 'lucide-react';

const ApplicationsPage: React.FC = () => {
  const applications = [
    {
      id: 1,
      candidate: 'Іван Петренко',
      position: 'Senior React Developer',
      company: 'TechCorp',
      status: 'pending',
      appliedDate: '2024-08-20',
      experience: '5 років'
    },
    {
      id: 2,
      candidate: 'Марія Коваленко',
      position: 'UI/UX Designer',
      company: 'InnovateSoft',
      status: 'approved',
      appliedDate: '2024-08-19',
      experience: '3 роки'
    }
  ];

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
        <h1 className="dashboard-title">Заявки</h1>
        <p className="dashboard-greeting-subtitle">Управління заявками кандидатів</p>
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
                <span>{app.status === 'pending' ? 'На розгляді' : 'Схвалено'}</span>
              </div>
            </div>
            
            <div className="application-details">
              <h3>{app.position}</h3>
              <p>Компанія: {app.company}</p>
              <p>Досвід: {app.experience}</p>
              <p>Подано: {app.appliedDate}</p>
            </div>
            
            <div className="application-actions">
              <button className="btn btn-primary">Переглянути</button>
              <button className="btn btn-outline">Відхилити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
