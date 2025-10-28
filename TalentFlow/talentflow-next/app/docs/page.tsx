'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Code, Search, ExternalLink, Copy, Check, ChevronRight, ChevronDown, Zap, Shield, Users, Briefcase, Calendar, MessageSquare, Settings, Database, Globe, Lock } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import { useLanguageStore } from '../../stores/languageStore';
import './docs.css';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string;
  codeExample?: string;
  endpoints?: Array<{
    method: string;
    path: string;
    description: string;
    example?: string;
  }>;
}

const DocsPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const docSections: DocSection[] = [
    {
      id: 'overview',
      title: t('apiOverview'),
      icon: <BookOpen size={20} />,
      description: t('apiOverviewDescription'),
      content: `${t('apiOverviewContent')}

**${t('keyFeatures')}:**
- ${t('restfulArchitecture')}
- ${t('jsonDataFormat')}
- ${t('jwtAuthentication')}
- ${t('rateLimiting')}
- ${t('inputValidation')}
- ${t('detailedDocumentation')}`,
      codeExample: `curl -X GET "https://api.talentflow.io/health" \\
  -H "Content-Type: application/json"`
    },
    {
      id: 'authentication',
      title: t('authentication'),
      icon: <Lock size={20} />,
      description: t('authenticationDescription'),
      content: `${t('authenticationContent')}

**${t('authenticationProcess')}:**
1. ${t('getTokenViaLogin')}
2. ${t('useTokenInHeader')}
3. ${t('refreshTokenViaRefresh')}`,
      endpoints: [
        {
          method: 'POST',
          path: '/auth/login',
          description: t('loginToSystem'),
          example: `{
  "email": "user@example.com",
  "password": "password123"
}`
        },
        {
          method: 'POST',
          path: '/auth/refresh',
          description: t('refreshToken'),
          example: `{
  "refreshToken": "your_refresh_token"
}`
        }
      ]
    },
    {
      id: 'jobs',
      title: t('jobs'),
      icon: <Briefcase size={20} />,
      description: t('jobsApiDescription'),
      content: `${t('jobsApiContent')}

**${t('mainFunctions')}:**
- ${t('createAndEditJobs')}
- ${t('searchAndFilter')}
- ${t('aiRecommendations')}
- ${t('statisticsAndAnalytics')}`,
      endpoints: [
        {
          method: 'GET',
          path: '/jobs',
          description: t('getJobsList')
        },
        {
          method: 'POST',
          path: '/jobs',
          description: t('createNewJob')
        },
        {
          method: 'GET',
          path: '/jobs/:id',
          description: t('getJobDetails')
        },
        {
          method: 'PUT',
          path: '/jobs/:id',
          description: t('updateJob')
        }
      ]
    },
    {
      id: 'candidates',
      title: t('candidates'),
      icon: <Users size={20} />,
      description: t('candidatesApiDescription'),
      content: `${t('candidatesApiContent')}

**${t('functionality')}:**
- ${t('manageCandidateProfiles')}
- ${t('aiMatchingWithJobs')}
- ${t('skillsAssessment')}
- ${t('applicationHistory')}`,
      endpoints: [
        {
          method: 'GET',
          path: '/candidates',
          description: t('searchCandidates')
        },
        {
          method: 'GET',
          path: '/candidates/:id',
          description: t('getCandidateProfile')
        },
        {
          method: 'POST',
          path: '/candidates/:id/assess',
          description: t('assessCandidate')
        }
      ]
    },
    {
      id: 'applications',
      title: t('applications'),
      icon: <FileText size={20} />,
      description: t('applicationsApiDescription'),
      content: `${t('applicationsApiContent')}

**${t('applicationStatuses')}:**
- ${t('new')}
- ${t('viewed')}
- ${t('selected')}
- ${t('interview')}
- ${t('acceptedRejected')}`,
      endpoints: [
        {
          method: 'GET',
          path: '/applications',
          description: t('getApplicationsList')
        },
        {
          method: 'POST',
          path: '/applications',
          description: t('createApplication')
        },
        {
          method: 'PUT',
          path: '/applications/:id/status',
          description: t('updateApplicationStatus')
        }
      ]
    },
    {
      id: 'interviews',
      title: t('interviews'),
      icon: <MessageSquare size={20} />,
      description: t('interviewsApiDescription'),
      content: `${t('interviewsApiContent')}

**${t('capabilities')}:**
- ${t('scheduleInterviews')}
- ${t('calendarIntegration')}
- ${t('reminders')}
- ${t('interviewAssessment')}`,
      endpoints: [
        {
          method: 'GET',
          path: '/interviews',
          description: t('getInterviewsList')
        },
        {
          method: 'POST',
          path: '/interviews',
          description: t('createInterview')
        },
        {
          method: 'PUT',
          path: '/interviews/:id',
          description: t('updateInterview')
        }
      ]
    },
    {
      id: 'analytics',
      title: t('analytics'),
      icon: <Zap size={20} />,
      description: t('analyticsApiDescription'),
      content: `${t('analyticsApiContent')}

**${t('reportTypes')}:**
- ${t('hiringStatistics')}
- ${t('recruitmentEffectiveness')}
- ${t('candidateAnalysis')}
- ${t('hrTeamProductivity')}`,
      endpoints: [
        {
          method: 'GET',
          path: '/analytics/hiring',
          description: t('getHiringStatistics')
        },
        {
          method: 'GET',
          path: '/analytics/recruitment',
          description: t('getRecruitmentEffectiveness')
        },
        {
          method: 'GET',
          path: '/analytics/candidates',
          description: t('getCandidateAnalysis')
        }
      ]
    },
    {
      id: 'settings',
      title: t('settings'),
      icon: <Settings size={20} />,
      description: t('settingsApiDescription'),
      content: `${t('settingsApiContent')}

**${t('settingsTypes')}:**
- ${t('userProfile')}
- ${t('notificationSettings')}
- ${t('security')}
- ${t('integrations')}`,
      endpoints: [
        {
          method: 'GET',
          path: '/settings/user',
          description: t('getUserSettings')
        },
        {
          method: 'PUT',
          path: '/settings/profile',
          description: t('updateProfile')
        },
        {
          method: 'PUT',
          path: '/settings/notifications',
          description: t('updateNotificationSettings')
        }
      ]
    }
  ];

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(sectionId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const activeSectionData = docSections.find(section => section.id === activeSection);

  return (
    <Layout>
      <div className="docs-page">
        <div className="docs-header">
          <h1 className="docs-title">{t('apiDocumentation')}</h1>
          <p className="docs-subtitle">{t('completeApiDocumentationAndGuides')}</p>
        </div>

        <div className="docs-container">
          {/* Пошук */}
          <div className="docs-search">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder={t('searchDocumentation')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="docs-content">
            {/* Бічна панель */}
            <div className="docs-sidebar">
              <div className="sidebar-sections">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="sidebar-item-icon">
                      {section.icon}
                    </div>
                    <div className="sidebar-item-content">
                      <h4>{section.title}</h4>
                      <p>{section.description}</p>
                    </div>
                    <ChevronRight size={16} className="sidebar-arrow" />
                  </button>
                ))}
              </div>
            </div>

            {/* Основний контент */}
            <div className="docs-main">
              {activeSectionData && (
                <div className="docs-section">
                  <div className="section-header">
                    <div className="section-icon">
                      {activeSectionData.icon}
                    </div>
                    <div className="section-title">
                      <h2>{activeSectionData.title}</h2>
                      <p>{activeSectionData.description}</p>
                    </div>
                  </div>

                  <div className="section-content">
                    <div className="content-text">
                      {activeSectionData.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {/* Приклад коду */}
                    {activeSectionData.codeExample && (
                      <div className="code-example">
                        <div className="code-header">
                          <span>{t('usageExample')}</span>
                          <button
                            className="copy-button"
                            onClick={() => copyToClipboard(activeSectionData.codeExample!, activeSectionData.id)}
                          >
                            {copiedCode === activeSectionData.id ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <pre className="code-block">
                          <code>{activeSectionData.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {/* Ендпоінти */}
                    {activeSectionData.endpoints && (
                      <div className="endpoints-section">
                        <h3>{t('apiEndpoints')}</h3>
                        <div className="endpoints-list">
                          {activeSectionData.endpoints.map((endpoint, index) => (
                            <div key={index} className="endpoint-item">
                              <div className="endpoint-header">
                                <span className={`method method-${endpoint.method.toLowerCase()}`}>
                                  {endpoint.method}
                                </span>
                                <span className="endpoint-path">{endpoint.path}</span>
                              </div>
                              <p className="endpoint-description">{endpoint.description}</p>
                              {endpoint.example && (
                                <div className="endpoint-example">
                                  <button
                                    className="copy-button small"
                                    onClick={() => copyToClipboard(endpoint.example!, `${activeSectionData.id}-${index}`)}
                                  >
                                    {copiedCode === `${activeSectionData.id}-${index}` ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                                  <pre className="example-code">
                                    <code>{endpoint.example}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Швидкі посилання */}
          <div className="docs-quick-links">
            <h3>{t('quickLinks')}</h3>
            <div className="quick-links-grid">
              <a href="http://localhost:3000/api-docs" target="_blank" rel="noopener noreferrer" className="quick-link">
                <ExternalLink size={16} />
                <span>Swagger UI</span>
              </a>
              <a href="http://localhost:3000/health" target="_blank" rel="noopener noreferrer" className="quick-link">
                <Zap size={16} />
                <span>{t('healthCheck')}</span>
              </a>
              <a href="https://github.com/talentflow/api" target="_blank" rel="noopener noreferrer" className="quick-link">
                <Code size={16} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocsPage;
