'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguageStore } from '../../../../stores/languageStore';
import Layout from '../../../../components/Layout/Layout';
import { ArrowLeft, Clock, Sparkles, CheckCircle, XCircle, AlertCircle, Mail, Calendar, BarChart3, Bell, FileText, Target, Users, Settings, Database, Globe, Lock, Workflow, Timer, Repeat, Zap } from 'lucide-react';
import './template-detail.css';

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  popularity: number;
  tags: string[];
}

const TemplateDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguageStore();

  const templateId = params?.id as string;

  // Mock template data - in real app this would come from API
  const templates: AutomationTemplate[] = [
    {
      id: 'welcome-email',
      name: t('welcomeEmail'),
      description: t('welcomeEmailDesc'),
      category: 'onboarding',
      icon: <Mail size={24} />,
      complexity: 'simple',
      estimatedTime: '5 min',
      popularity: 95,
      tags: ['email', 'onboarding', 'welcome']
    },
    {
      id: 'interview-scheduler',
      name: t('interviewScheduler'),
      description: t('interviewSchedulerDesc'),
      category: 'scheduling',
      icon: <Calendar size={24} />,
      complexity: 'medium',
      estimatedTime: '15 min',
      popularity: 88,
      tags: ['scheduling', 'interview', 'calendar']
    },
    {
      id: 'status-tracker',
      name: t('statusTracker'),
      description: t('statusTrackerDesc'),
      category: 'tracking',
      icon: <BarChart3 size={24} />,
      complexity: 'simple',
      estimatedTime: '10 min',
      popularity: 92,
      tags: ['tracking', 'status', 'updates']
    },
    {
      id: 'reminder-system',
      name: t('reminderSystem'),
      description: t('reminderSystemDesc'),
      category: 'notifications',
      icon: <Bell size={24} />,
      complexity: 'medium',
      estimatedTime: '12 min',
      popularity: 85,
      tags: ['reminders', 'notifications', 'alerts']
    },
    {
      id: 'document-generator',
      name: t('documentGenerator'),
      description: t('documentGeneratorDesc'),
      category: 'documents',
      icon: <FileText size={24} />,
      complexity: 'complex',
      estimatedTime: '25 min',
      popularity: 78,
      tags: ['documents', 'contracts', 'generation']
    },
    {
      id: 'candidate-scoring',
      name: t('candidateScoring'),
      description: t('candidateScoringDesc'),
      category: 'ai',
      icon: <Target size={24} />,
      complexity: 'complex',
      estimatedTime: '30 min',
      popularity: 82,
      tags: ['ai', 'scoring', 'evaluation']
    }
  ];

  const template = templates.find(t => t.id === templateId);

  if (!template) {
    return (
      <Layout>
        <div className="template-detail-container">
          <div className="template-not-found">
            <h2>{t('templateNotFound')}</h2>
            <p>{t('templateNotFoundDesc')}</p>
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/automation')}
            >
              <ArrowLeft size={16} />
              {t('backToAutomation')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'green';
      case 'medium': return 'yellow';
      case 'complex': return 'red';
      default: return 'gray';
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'simple': return t('simple');
      case 'medium': return t('medium');
      case 'complex': return t('complex');
      default: return complexity;
    }
  };

  return (
    <Layout>
      <div className="template-detail-container">
        <div className="template-detail-header">
          <button 
            className="back-button"
            onClick={() => router.push('/automation')}
          >
            <ArrowLeft size={20} />
            {t('backToAutomation')}
          </button>
        </div>

        <div className="template-detail-content">
          <div className="template-detail-card">
            <div className="template-detail-icon">
              {template.icon}
            </div>
            
            <div className="template-detail-info">
              <h1>{template.name}</h1>
              <p className="template-description">{template.description}</p>
              
              <div className="template-meta">
                <div className="meta-item">
                  <span className="meta-label">{t('complexity')}:</span>
                  <span className={`complexity-badge ${getComplexityColor(template.complexity)}`}>
                    {getComplexityText(template.complexity)}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">{t('estimatedTime')}:</span>
                  <span className="time-estimate">
                    <Clock size={16} />
                    {template.estimatedTime}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">{t('successRate')}:</span>
                  <span className="popularity">
                    <Sparkles size={16} />
                    {template.popularity}%
                  </span>
                </div>
              </div>
              
              <div className="template-tags">
                {template.tags.map((tag, index) => (
                  <span key={index} className="template-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="template-detail-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                // Navigate to create workflow from template
                router.push(`/automation?template=${templateId}`);
              }}
            >
              <Zap size={20} />
              {t('useThisTemplate')}
            </button>
            
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => router.push('/automation')}
            >
              {t('browseOtherTemplates')}
            </button>
          </div>

          <div className="template-detail-features">
            <h3>{t('templateFeatures')}</h3>
            <div className="features-grid">
              <div className="feature-item">
                <CheckCircle size={20} className="feature-icon success" />
                <div className="feature-content">
                  <h4>{t('automatedExecution')}</h4>
                  <p>{t('automatedExecutionDesc')}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <Settings size={20} className="feature-icon primary" />
                <div className="feature-content">
                  <h4>{t('customizable')}</h4>
                  <p>{t('customizableDesc')}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <BarChart3 size={20} className="feature-icon info" />
                <div className="feature-content">
                  <h4>{t('analytics')}</h4>
                  <p>{t('analyticsDesc')}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <Lock size={20} className="feature-icon warning" />
                <div className="feature-content">
                  <h4>{t('secure')}</h4>
                  <p>{t('secureDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateDetailPage;
