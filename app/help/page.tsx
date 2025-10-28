'use client';

import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, Search, ChevronDown, ChevronRight, Mail, Phone, MessageCircle, Video, FileText, Users, Settings, Briefcase, Calendar, Zap, ExternalLink, Copy, Check } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import { useLanguageStore } from '../../stores/languageStore';
import './help.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  articles: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
  }>;
}

const HelpPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: t('gettingStarted'),
      icon: <BookOpen size={20} />,
      description: t('gettingStartedDescription'),
      articles: [
        {
          id: 'first-steps',
          title: t('firstSteps'),
          description: t('firstStepsDescription'),
          content: `# ${t('firstSteps')}

## 1. ${t('registration')}
- ${t('registrationStep1')}
- ${t('registrationStep2')}
- ${t('registrationStep3')}

## 2. ${t('profileSetup')}
- ${t('profileSetupStep1')}
- ${t('profileSetupStep2')}
- ${t('profileSetupStep3')}

## 3. ${t('firstJob')}
- ${t('firstJobStep1')}
- ${t('firstJobStep2')}
- ${t('firstJobStep3')}

## 4. ${t('startSearching')}
- ${t('startSearchingStep1')}
- ${t('startSearchingStep2')}
- ${t('startSearchingStep3')}`
        },
        {
          id: 'profile-setup',
          title: t('profileSetup'),
          description: t('profileSetupDescription'),
          content: `# ${t('profileSetup')}

## ${t('basicInformation')}
- ${t('companyName')}
- ${t('logoAndBranding')}
- ${t('companyDescription')}
- ${t('contactInformation')}

## ${t('additionalInformation')}
- ${t('companySize')}
- ${t('industry')}
- ${t('location')}
- ${t('website')}

## ${t('notificationSettings')}
- ${t('emailNotifications')}
- ${t('pushNotifications')}
- ${t('notificationFrequency')}`
        }
      ]
    },
    {
      id: 'jobs',
      title: t('jobs'),
      icon: <Briefcase size={20} />,
      description: t('jobsDescription'),
      articles: [
        {
          id: 'create-job',
          title: t('createJob'),
          description: t('createJobDescription'),
          content: `# ${t('createJob')}

## ${t('step1')}: ${t('basicInformation')}
- ${t('positionTitle')}
- ${t('jobDescription')}
- ${t('candidateRequirements')}
- ${t('responsibilities')}

## ${t('step2')}: ${t('details')}
- ${t('salaryRange')}
- ${t('employmentType')}
- ${t('workLocation')}
- ${t('experienceLevel')}

## ${t('step3')}: ${t('additionalSettings')}
- ${t('keywords')}
- ${t('categories')}
- ${t('tags')}
- ${t('closingDate')}

## ${t('tipsForEffectiveJob')}:
- ${t('tip1')}
- ${t('tip2')}
- ${t('tip3')}
- ${t('tip4')}`
        },
        {
          id: 'job-management',
          title: t('jobManagement'),
          description: t('jobManagementDescription'),
          content: `# ${t('jobManagement')}

## ${t('jobStatuses')}
- **${t('active')}** - ${t('activeDescription')}
- **${t('paused')}** - ${t('pausedDescription')}
- **${t('closed')}** - ${t('closedDescription')}
- **${t('archived')}** - ${t('archivedDescription')}

## ${t('managementFunctions')}
- ${t('editJob')}
- ${t('duplicateJob')}
- ${t('bulkOperations')}
- ${t('exportData')}

## ${t('jobAnalytics')}
- ${t('viewCount')}
- ${t('applicationCount')}
- ${t('conversion')}
- ${t('trafficSources')}`
        }
      ]
    },
    {
      id: 'candidates',
      title: t('candidates'),
      icon: <Users size={20} />,
      description: t('candidatesDescription'),
      articles: [
        {
          id: 'search-candidates',
          title: t('searchCandidates'),
          description: t('searchCandidatesDescription'),
          content: `# ${t('searchCandidates')}

## ${t('basicSearch')}
- ${t('keywordSearch')}
- ${t('locationFilters')}
- ${t('experienceFilters')}
- ${t('skillsFilters')}

## ${t('advancedSearch')}
- ${t('aiRecommendations')}
- ${t('semanticSearch')}
- ${t('socialMediaSearch')}
- ${t('portfolioSearch')}

## ${t('savedSearches')}
- ${t('createSavedSearch')}
- ${t('automaticNotifications')}
- ${t('exportResults')}
- ${t('searchAnalytics')}`
        },
        {
          id: 'ai-matching',
          title: t('aiMatching'),
          description: t('aiMatchingDescription'),
          content: `# ${t('aiMatching')}

## ${t('howAiMatchingWorks')}
- ${t('candidateProfileAnalysis')}
- ${t('jobRequirementsComparison')}
- ${t('compatibilityAssessment')}
- ${t('resultsRanking')}

## ${t('aiConfiguration')}
- ${t('criteriaImportance')}
- ${t('algorithmSettings')}
- ${t('systemTraining')}
- ${t('accuracyAssessment')}

## ${t('matchingResults')}
- ${t('matchPercentage')}
- ${t('detailedAnalysis')}
- ${t('recommendations')}
- ${t('matchingHistory')}`
        }
      ]
    },
    {
      id: 'interviews',
      title: t('interviews'),
      icon: <Calendar size={20} />,
      description: t('interviewsDescription'),
      articles: [
        {
          id: 'schedule-interview',
          title: t('scheduleInterview'),
          description: t('scheduleInterviewDescription'),
          content: `# ${t('scheduleInterview')}

## ${t('formatSelection')}
- ${t('offlineInterview')}
- ${t('videoInterview')}
- ${t('phoneInterview')}
- ${t('groupInterview')}

## ${t('timeSettings')}
- ${t('dateTimeSelection')}
- ${t('interviewDuration')}
- ${t('interviewBuffers')}
- ${t('timeZones')}

## ${t('automation')}
- ${t('automaticReminders')}
- ${t('calendarIntegration')}
- ${t('interviewTemplates')}
- ${t('bulkScheduling')}`
        },
        {
          id: 'interview-tips',
          title: t('interviewTips'),
          description: t('interviewTipsDescription'),
          content: `# ${t('interviewTips')}

## ${t('preparation')}
- ${t('studyResume')}
- ${t('prepareQuestions')}
- ${t('setupEquipment')}
- ${t('planStructure')}

## ${t('conductingInterview')}
- ${t('createComfortableAtmosphere')}
- ${t('structure')}
- ${t('activeListening')}
- ${t('recordAnswers')}

## ${t('candidateEvaluation')}
- ${t('evaluationCriteria')}
- ${t('ratingScale')}
- ${t('feedback')}
- ${t('decisionMaking')}`
        }
      ]
    },
    {
      id: 'analytics',
      title: t('analytics'),
      icon: <Zap size={20} />,
      description: t('analyticsDescription'),
      articles: [
        {
          id: 'dashboard',
          title: t('analyticsDashboard'),
          description: t('analyticsDashboardDescription'),
          content: `# ${t('analyticsDashboard')}

## ${t('keyMetrics')}
- ${t('activeJobsCount')}
- ${t('applicationsCount')}
- ${t('applicationConversion')}
- ${t('timeToClose')}

## ${t('visualization')}
- ${t('chartsAndDiagrams')}
- ${t('trendsOverTime')}
- ${t('periodComparison')}
- ${t('forecasts')}

## ${t('dataExport')}
- ${t('exportFormats')}
- ${t('automaticReports')}
- ${t('reportSettings')}
- ${t('reportDistribution')}`
        },
        {
          id: 'reports',
          title: t('reports'),
          description: t('reportsDescription'),
          content: `# ${t('createReports')}

## ${t('reportTypes')}
- ${t('jobsReport')}
- ${t('candidatesReport')}
- ${t('interviewsReport')}
- ${t('hiringReport')}

## Налаштування звітів
- Вибір періоду
- Фільтри даних
- Групування
- Сортування

## ${t('automation')}
- ${t('reportSchedule')}
- ${t('emailDistribution')}
- ${t('systemIntegration')}
- ${t('apiAccess')}`
        }
      ]
    },
    {
      id: 'settings',
      title: t('settings'),
      icon: <Settings size={20} />,
      description: t('settingsDescription'),
      articles: [
        {
          id: 'account-settings',
          title: t('accountSettings'),
          description: t('accountSettingsDescription'),
          content: `# ${t('accountSettings')}

## ${t('userProfile')}
- ${t('personalInformation')}
- ${t('profilePhoto')}
- ${t('contactData')}
- ${t('biography')}

## ${t('security')}
- ${t('changePassword')}
- ${t('twoFactorAuth')}
- ${t('activeSessions')}
- ${t('activityLog')}

## ${t('notifications')}
- ${t('emailNotifications')}
- ${t('pushNotifications')}
- ${t('smsNotifications')}
- ${t('notificationFrequency')}`
        },
        {
          id: 'company-settings',
          title: t('companySettings'),
          description: t('companySettingsDescription'),
          content: `# ${t('companySettings')}

## ${t('companyInformation')}
- ${t('nameAndLogo')}
- ${t('companyDescription')}
- ${t('contactInformation')}
- ${t('socialNetworks')}

## ${t('recruitmentSettings')}
- ${t('hiringProcess')}
- ${t('interviewStages')}
- ${t('evaluationCriteria')}
- ${t('templates')}

## ${t('integrations')}
- ${t('calendar')}
- ${t('email')}
- ${t('crmSystems')}
- ${t('hrSystems')}`
        }
      ]
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'account-creation',
      question: t('faqAccountCreation'),
      answer: t('faqAccountCreationAnswer'),
      category: 'account',
      tags: [t('registration'), t('account'), t('gettingStarted')]
    },
    {
      id: 'job-posting',
      question: t('faqJobPosting'),
      answer: t('faqJobPostingAnswer'),
      category: 'pricing',
      tags: [t('pricing'), t('plans'), t('jobs')]
    },
    {
      id: 'ai-matching',
      question: t('faqAiMatching'),
      answer: t('faqAiMatchingAnswer'),
      category: 'features',
      tags: [t('ai'), t('matching'), t('candidates')]
    },
    {
      id: 'data-security',
      question: t('faqDataSecurity'),
      answer: t('faqDataSecurityAnswer'),
      category: 'security',
      tags: [t('security'), t('data'), t('gdpr')]
    },
    {
      id: 'support',
      question: t('faqSupport'),
      answer: t('faqSupportAnswer'),
      category: 'support',
      tags: [t('support'), t('contacts'), t('help')]
    },
    {
      id: 'mobile-app',
      question: t('faqMobileApp'),
      answer: t('faqMobileAppAnswer'),
      category: 'mobile',
      tags: [t('mobile'), t('app'), t('ios'), t('android')]
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedContact(type);
      setTimeout(() => setCopiedContact(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const activeCategoryData = helpCategories.find(category => category.id === activeCategory);

  return (
    <Layout>
      <div className="help-page">
        <div className="help-header">
          <h1 className="help-title">{t('helpAndSupport')}</h1>
          <p className="help-subtitle">{t('findAnswersAndGetHelp')}</p>
        </div>

        <div className="help-container">
          {/* Пошук */}
          <div className="help-search">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder={t('searchHelpAndFaq')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="help-content">
            {/* Бічна панель */}
            <div className="help-sidebar">
              <div className="sidebar-sections">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="sidebar-item-icon">
                      {category.icon}
                    </div>
                    <div className="sidebar-item-content">
                      <h4>{category.title}</h4>
                      <p>{category.description}</p>
                    </div>
                    <ChevronRight size={16} className="sidebar-arrow" />
                  </button>
                ))}
              </div>
            </div>

            {/* Основний контент */}
            <div className="help-main">
              {activeCategoryData && (
                <div className="help-section">
                  <div className="section-header">
                    <div className="section-icon">
                      {activeCategoryData.icon}
                    </div>
                    <div className="section-title">
                      <h2>{activeCategoryData.title}</h2>
                      <p>{activeCategoryData.description}</p>
                    </div>
                  </div>

                  <div className="section-content">
                    <div className="articles-grid">
                      {activeCategoryData.articles.map((article) => (
                        <div key={article.id} className="article-card">
                          <div className="article-header">
                            <h3>{article.title}</h3>
                            <p>{article.description}</p>
                          </div>
                          <div className="article-content">
                            <div className="content-preview">
                              {article.content.split('\n').slice(0, 3).map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                              {article.content.split('\n').length > 3 && (
                                <span className="read-more">...{t('readMore')}</span>
                              )}
                            </div>
                          </div>
                          {article.videoUrl && (
                            <div className="article-video">
                              <Video size={16} />
                              <span>{t('videoGuide')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQ секція */}
          <div className="faq-section">
            <div className="faq-header">
              <h2>{t('frequentlyAskedQuestions')}</h2>
              <p>{t('findAnswersToPopularQuestions')}</p>
            </div>
            
            <div className="faq-list">
              {filteredFAQ.map((item) => (
                <div key={item.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    {expandedFAQ === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedFAQ === item.id && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                      <div className="faq-tags">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Контакти підтримки */}
          <div className="support-section">
            <div className="support-header">
              <h2>{t('needAdditionalHelp')}</h2>
              <p>{t('contactOurSupportTeam')}</p>
            </div>
            
            <div className="support-grid">
              <div className="support-card">
                <div className="support-icon">
                  <Mail size={24} />
                </div>
                <h3>{t('emailSupport')}</h3>
                <p>support@talentflow.io</p>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard('support@talentflow.io', 'email')}
                >
                  {copiedContact === 'email' ? <Check size={16} /> : <Copy size={16} />}
                  {t('copy')}
                </button>
              </div>
              
              <div className="support-card">
                <div className="support-icon">
                  <Phone size={24} />
                </div>
                <h3>{t('phone')}</h3>
                <p>+380 44 123 45 67</p>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard('+380 44 123 45 67', 'phone')}
                >
                  {copiedContact === 'phone' ? <Check size={16} /> : <Copy size={16} />}
                  {t('copy')}
                </button>
              </div>
              
              <div className="support-card">
                <div className="support-icon">
                  <MessageCircle size={24} />
                </div>
                <h3>{t('onlineChat')}</h3>
                <p>{t('available247')}</p>
                <button className="chat-button">
                  {t('startChat')}
                </button>
              </div>
              
              <div className="support-card">
                <div className="support-icon">
                  <Video size={24} />
                </div>
                <h3>{t('videoCall')}</h3>
                <p>{t('personalConsultation')}</p>
                <button className="video-button">
                  {t('schedule')}
                </button>
              </div>
            </div>
          </div>

          {/* Корисні посилання */}
          <div className="useful-links">
            <h3>{t('usefulResources')}</h3>
            <div className="links-grid">
              <a href="/docs" className="useful-link">
                <FileText size={16} />
                <span>{t('apiDocumentation')}</span>
              </a>
              <a href="https://talentflow.io/blog" target="_blank" rel="noopener noreferrer" className="useful-link">
                <BookOpen size={16} />
                <span>{t('blog')}</span>
              </a>
              <a href="https://talentflow.io/community" target="_blank" rel="noopener noreferrer" className="useful-link">
                <Users size={16} />
                <span>{t('community')}</span>
              </a>
              <a href="https://talentflow.io/status" target="_blank" rel="noopener noreferrer" className="useful-link">
                <Zap size={16} />
                <span>{t('systemStatus')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
