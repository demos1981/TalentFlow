'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { Zap, Search, Plus, Play, Pause, Trash2, Edit, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings, Users, Mail, Calendar, MessageSquare, FileText, BarChart3, Filter, Download, Upload, Copy, Check, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Target, Bell, Shield, Database, Globe, Lock, Workflow, Timer, Repeat, Sparkles } from 'lucide-react';
import { AutomationService } from '../../services/automationService';
import toast from 'react-hot-toast';
import './automation.css';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: string;
  conditions: string[];
  actions: string[];
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  isEnabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

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

const AutomationPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { t } = useLanguageStore();

  const handleViewWorkflow = (workflowId: string) => {
    router.push(`/automation/${workflowId}`);
  };

  const handleEditWorkflow = (workflowId: string) => {
    router.push(`/automation/${workflowId}/edit`);
  };

  const handleRunWorkflow = async (workflowId: string) => {
    try {
      await AutomationService.runWorkflow(workflowId);
      toast.success(t('workflowExecutedSuccessfully'));
      // Refresh the page to update the workflow data
      window.location.reload();
    } catch (error) {
      console.error('Error running workflow:', error);
      toast.error(t('failedToRunWorkflow'));
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (window.confirm(t('confirmDeleteWorkflow'))) {
      try {
        await AutomationService.deleteWorkflow(workflowId);
        toast.success(t('workflowDeletedSuccessfully'));
        // Refresh the page to update the workflow list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting workflow:', error);
        toast.error(t('failedToDeleteWorkflow'));
      }
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    try {
      // Create a new workflow from template
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        toast.error(t('templateNotFound'));
        return;
      }

      const newWorkflow = await AutomationService.createWorkflow({
        name: template.name,
        description: template.description,
        category: 'template',
        trigger: 'manual',
        conditions: [],
        actions: []
      });

      toast.success(t('workflowCreatedFromTemplate'));
      // Navigate to edit the new workflow
      router.push(`/automation/${newWorkflow.id}/edit`);
    } catch (error) {
      console.error('Error creating workflow from template:', error);
      toast.error(t('failedToCreateWorkflowFromTemplate'));
    }
  };

  const handleViewTemplate = (templateId: string) => {
    // Navigate to template details page
    router.push(`/automation/template/${templateId}`);
  };

  const workflows: AutomationWorkflow[] = [
    {
      id: 'new-candidate-welcome',
      name: t('newCandidateWelcome'),
      description: t('newCandidateWelcomeDesc'),
      category: 'onboarding',
      status: 'active',
      trigger: t('newCandidateRegistered'),
      conditions: [
        t('candidateHasValidEmail'),
        t('profileFilled80Percent'),
        t('notDuplicate')
      ],
      actions: [
        t('sendWelcomeEmail'),
        t('createCandidateProfile'),
        t('addToDatabase'),
        t('notifyHR')
      ],
      lastRun: '2025-08-25T14:30:00Z',
      nextRun: '2025-08-25T15:30:00Z',
      executionCount: 156,
      successRate: 98.5,
      averageExecutionTime: 2.3,
      isEnabled: true,
      priority: 'high',
      tags: ['onboarding', 'email', 'candidate'],
      createdBy: 'HR Manager',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-08-20T16:30:00Z'
    },
    {
      id: 'interview-scheduling',
      name: t('interviewScheduling'),
      description: t('interviewSchedulingDesc'),
      category: 'scheduling',
      status: 'active',
      trigger: t('candidatePassedScreening'),
      conditions: [
        t('candidateApproved'),
        t('interviewersAvailable'),
        t('candidateSpecifiedTimeSlots')
      ],
      actions: [
        t('checkInterviewerAvailability'),
        t('scheduleInterview'),
        t('sendInvitationToCandidate'),
        t('createCalendarEvent'),
        t('sendReminder')
      ],
      lastRun: '2025-08-25T13:45:00Z',
      nextRun: '2025-08-25T14:45:00Z',
      executionCount: 89,
      successRate: 95.2,
      averageExecutionTime: 5.1,
      isEnabled: true,
      priority: 'critical',
      tags: ['scheduling', 'interview', 'calendar'],
      createdBy: 'Recruiter',
      createdAt: '2025-02-10T14:20:00Z',
      updatedAt: '2025-08-18T11:15:00Z'
    },
    {
      id: 'application-status-update',
      name: t('applicationStatusUpdate'),
      description: t('applicationStatusUpdateDesc'),
      category: 'tracking',
      status: 'active',
      trigger: t('statusChange'),
      conditions: [
        t('applicationExists'),
        t('newStatusDifferent'),
        t('userHasRights')
      ],
      actions: [
        t('updateStatusInDatabase'),
        t('sendNotificationToCandidate'),
        t('updateDashboard'),
        t('logChanges'),
        t('createActivity')
      ],
      lastRun: '2025-08-25T14:15:00Z',
      nextRun: '2025-08-25T15:15:00Z',
      executionCount: 342,
      successRate: 99.8,
      averageExecutionTime: 0.8,
      isEnabled: true,
      priority: 'medium',
      tags: ['tracking', 'status', 'notification'],
      createdBy: 'System Admin',
      createdAt: '2025-01-05T09:00:00Z',
      updatedAt: '2025-08-22T13:45:00Z'
    },
    {
      id: 'reminder-emails',
      name: t('reminderEmails'),
      description: t('reminderEmailsDesc'),
      category: 'communication',
      status: 'active',
      trigger: t('hoursBeforeInterview'),
      conditions: [
        t('interviewScheduled'),
        t('candidateHasEmail'),
        t('notSentBefore')
      ],
      actions: [
        t('prepareEmailTemplate'),
        t('sendReminder'),
        t('updateSendStatus'),
        t('logEntry')
      ],
      lastRun: '2025-08-25T08:00:00Z',
      nextRun: '2025-08-26T08:00:00Z',
      executionCount: 67,
      successRate: 97.8,
      averageExecutionTime: 1.2,
      isEnabled: true,
      priority: 'medium',
      tags: ['communication', 'email', 'reminder'],
      createdBy: 'HR Coordinator',
      createdAt: '2025-03-15T11:30:00Z',
      updatedAt: '2025-08-19T10:20:00Z'
    },
    {
      id: 'candidate-scoring',
      name: t('candidateScoring'),
      description: t('candidateScoringDesc'),
      category: 'scoring',
      status: 'draft',
      trigger: t('candidateCompletedTesting'),
      conditions: [
        t('testingCompleted'),
        t('allAnswersRecorded'),
        t('scoringCriteriaSet')
      ],
      actions: [
        t('analyzeAnswers'),
        t('calculateScore'),
        t('compareWithCriteria'),
        t('updateCandidateStatus'),
        t('sendResultToHR')
      ],
      lastRun: undefined,
      nextRun: undefined,
      executionCount: 0,
      successRate: 0,
      averageExecutionTime: 0,
      isEnabled: false,
      priority: 'high',
      tags: ['scoring', 'ai', 'evaluation'],
      createdBy: 'Data Scientist',
      createdAt: '2025-08-20T15:00:00Z',
      updatedAt: '2025-08-25T09:30:00Z'
    },
    {
      id: 'document-generation',
      name: t('documentGeneration'),
      description: t('documentGenerationDesc'),
      category: 'documents',
      status: 'error',
      trigger: t('candidateAcceptedOffer'),
      conditions: [
        t('offerAccepted'),
        t('allRequiredDataProvided'),
        t('documentTemplatesReady')
      ],
      actions: [
        t('generateEmploymentContract'),
        t('createAdditionalDocuments'),
        t('sendForSignature'),
        t('saveToArchive'),
        t('sendCopyToHR')
      ],
      lastRun: '2025-08-25T12:00:00Z',
      nextRun: '2025-08-25T18:00:00Z',
      executionCount: 23,
      successRate: 87.5,
      averageExecutionTime: 8.5,
      isEnabled: true,
      priority: 'critical',
      tags: ['documents', 'contract', 'generation'],
      createdBy: 'Legal Team',
      createdAt: '2025-04-10T16:00:00Z',
      updatedAt: '2025-08-25T12:30:00Z'
    }
  ];

  const templates: AutomationTemplate[] = [
    {
      id: 'welcome-email',
      name: t('welcomeEmail'),
      description: t('welcomeEmailDesc'),
      category: 'communication',
      icon: <Mail size={24} />,
      complexity: 'simple',
      estimatedTime: `5 ${t('minutes')}`,
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
      estimatedTime: `15 ${t('minutes')}`,
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
      estimatedTime: `10 ${t('minutes')}`,
      popularity: 92,
      tags: ['tracking', 'status', 'updates']
    },
    {
      id: 'reminder-system',
      name: t('reminderSystem'),
      description: t('reminderSystemDesc'),
      category: 'communication',
      icon: <Bell size={24} />,
      complexity: 'medium',
      estimatedTime: `12 ${t('minutes')}`,
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
      estimatedTime: `25 ${t('minutes')}`,
      popularity: 78,
      tags: ['documents', 'contracts', 'generation']
    },
    {
      id: 'candidate-scoring',
      name: t('candidateScoringTemplate'),
      description: t('candidateScoringTemplateDesc'),
      category: 'scoring',
      icon: <Target size={24} />,
      complexity: 'complex',
      estimatedTime: `30 ${t('minutes')}`,
      popularity: 82,
      tags: ['ai', 'scoring', 'evaluation']
    }
  ];

  const categories = [
    { id: 'all', name: t('all'), icon: <Zap size={16} /> },
    { id: 'onboarding', name: t('onboarding'), icon: <Users size={16} /> },
    { id: 'scheduling', name: t('scheduling'), icon: <Calendar size={16} /> },
    { id: 'tracking', name: t('tracking'), icon: <BarChart3 size={16} /> },
    { id: 'communication', name: t('communication'), icon: <MessageSquare size={16} /> },
    { id: 'scoring', name: t('scoring'), icon: <Target size={16} /> },
    { id: 'documents', name: t('documents'), icon: <FileText size={16} /> }
  ];

  const statuses = [
    { id: 'all', name: t('allStatuses'), icon: <Eye size={16} /> },
    { id: 'active', name: t('activeStatus'), icon: <CheckCircle size={16} /> },
    { id: 'inactive', name: t('inactiveStatus'), icon: <Pause size={16} /> },
    { id: 'draft', name: t('draftStatus'), icon: <Edit size={16} /> },
    { id: 'error', name: t('errorStatus'), icon: <AlertCircle size={16} /> }
  ];

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || workflow.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="status-active" />;
      case 'inactive':
        return <Pause size={16} className="status-inactive" />;
      case 'draft':
        return <Edit size={16} className="status-draft" />;
      case 'error':
        return <AlertCircle size={16} className="status-error" />;
      default:
        return <AlertCircle size={16} className="status-unknown" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('activeStatus');
      case 'inactive':
        return t('inactiveStatus');
      case 'draft':
        return t('draftStatus');
      case 'error':
        return t('errorStatus');
      default:
        return t('unknown');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      case 'critical':
        return 'priority-critical';
      default:
        return 'priority-unknown';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return t('low');
      case 'medium':
        return t('medium');
      case 'high':
        return t('high');
      case 'critical':
        return t('critical');
      default:
        return t('unknown');
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'complexity-simple';
      case 'medium':
        return 'complexity-medium';
      case 'complex':
        return 'complexity-complex';
      default:
        return 'complexity-unknown';
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return t('simple');
      case 'medium':
        return t('mediumComplexity');
      case 'complex':
        return t('complex');
      default:
        return t('unknown');
    }
  };

  const formatLastRun = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return t('minutesAgo').replace('{minutes}', diffInMinutes.toString());
    if (diffInMinutes < 1440) return t('hoursAgo').replace('{hours}', Math.floor(diffInMinutes / 60).toString());
    return t('daysAgo').replace('{days}', Math.floor(diffInMinutes / 1440).toString());
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Layout>
      <div className="automation-page">
        <div className="automation-header">
          <div className="automation-header-content">
            <div className="automation-header-title">
              <Zap size={32} className="automation-header-icon" />
              <div>
                <h1 className="automation-page-title">{t('automation')}</h1>
                <p className="automation-page-subtitle">
                  {t('automationDescription')}
                </p>
              </div>
            </div>
            <div className="automation-header-actions">
              <button className="automation-action-btn">
                <RefreshCw size={20} />
                {t('refresh')}
              </button>
              <button className="automation-action-btn">
                <Settings size={20} />
                {t('settings')}
              </button>
            </div>
          </div>
        </div>

        <div className="automation-container">
          {/* Пошук та фільтри */}
          <div className="automation-filters">
            <div className="search-section">
              <div className="search-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('searchAutomations')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filters-section">
              <div className="filter-group">
                <label>{t('category')}:</label>
                <div className="category-filters">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="filter-icon">
                        {category.icon}
                      </div>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>{t('status')}:</label>
                <div className="status-filters">
                  {statuses.map((status) => (
                    <button
                      key={status.id}
                      className={`status-filter ${selectedStatus === status.id ? 'active' : ''}`}
                      onClick={() => setSelectedStatus(status.id)}
                    >
                      <div className="filter-icon">
                        {status.icon}
                      </div>
                      <span>{status.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="automation-stats">
            <div className="stat-card">
              <div className="stat-icon active">
                <CheckCircle size={20} />
              </div>
              <div className="stat-content">
                <h3>{workflows.filter(w => w.status === 'active').length}</h3>
                <p>{t('active')}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon inactive">
                <Pause size={20} />
              </div>
              <div className="stat-content">
                <h3>{workflows.filter(w => w.status === 'inactive').length}</h3>
                <p>{t('inactive')}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon draft">
                <Edit size={20} />
              </div>
              <div className="stat-content">
                <h3>{workflows.filter(w => w.status === 'draft').length}</h3>
                <p>{t('drafts')}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon error">
                <AlertCircle size={20} />
              </div>
              <div className="stat-content">
                <h3>{workflows.filter(w => w.status === 'error').length}</h3>
                <p>{t('errors')}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon total">
                <Zap size={20} />
              </div>
              <div className="stat-content">
                <h3>{workflows.length}</h3>
                <p>{t('total')}</p>
              </div>
            </div>
          </div>

          {/* Кнопки дій */}
          <div className="automation-actions">
            <button className="action-button primary" onClick={() => setShowTemplates(true)}>
              <Plus size={16} />
              <span>{t('createAutomation')}</span>
            </button>
            <button className="action-button secondary">
              <Upload size={16} />
              <span>{t('import')}</span>
            </button>
            <button className="action-button secondary">
              <Download size={16} />
              <span>{t('export')}</span>
            </button>
            <button className="action-button secondary">
              <Settings size={16} />
              <span>{t('settings')}</span>
            </button>
          </div>

          {/* Шаблони автоматизацій */}
          {showTemplates && (
            <div className="templates-section">
              <div className="templates-header">
                <h3>{t('automationTemplates')}</h3>
                <button className="close-button" onClick={() => setShowTemplates(false)}>
                  <XCircle size={20} />
                </button>
              </div>
              <div className="templates-grid">
                {templates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-icon">
                      {template.icon}
                    </div>
                    <div className="template-content">
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                      <div className="template-meta">
                        <span className={`complexity-badge ${getComplexityColor(template.complexity)}`}>
                          {getComplexityText(template.complexity)}
                        </span>
                        <span className="time-estimate">
                          <Clock size={14} />
                          {template.estimatedTime}
                        </span>
                        <span className="popularity">
                          <Sparkles size={14} />
                          {template.popularity}%
                        </span>
                      </div>
                      <div className="template-tags">
                        {template.tags.map((tag, index) => (
                          <span key={index} className="template-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="template-actions">
                      <button 
                        className="template-button primary"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Plus size={16} />
                        <span>{t('use')}</span>
                      </button>
                      <button 
                        className="template-button secondary"
                        onClick={() => handleViewTemplate(template.id)}
                      >
                        <Eye size={16} />
                        <span>{t('view')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Список автоматизацій */}
          <div className="workflows-section">
            <div className="workflows-header">
              <h3>{t('workflows')} ({filteredWorkflows.length})</h3>
              <div className="workflows-actions">
                <button className="workflow-action">
                  <RefreshCw size={16} />
                  <span>{t('updateAll')}</span>
                </button>
              </div>
            </div>

            <div className="workflows-grid">
              {filteredWorkflows.map((workflow) => (
                <div key={workflow.id} className="workflow-card">
                  <div className="workflow-header">
                    <div className="workflow-info">
                      <h4>{workflow.name}</h4>
                      <p>{workflow.description}</p>
                    </div>
                    <div className="workflow-status">
                      {getStatusIcon(workflow.status)}
                      <span className="status-text">{getStatusText(workflow.status)}</span>
                    </div>
                  </div>

                  <div className="workflow-details">
                    <div className="detail-row">
                      <span className="detail-label">{t('trigger')}:</span>
                      <span className="detail-value">{workflow.trigger}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('lastRun')}:</span>
                      <span className="detail-value">
                        {workflow.lastRun ? formatLastRun(workflow.lastRun) : t('noData')}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('runs')}:</span>
                      <span className="detail-value">{workflow.executionCount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('success')}:</span>
                      <span className="detail-value">{workflow.successRate}%</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('executionTime')}:</span>
                      <span className="detail-value">{workflow.averageExecutionTime}с</span>
                    </div>
                  </div>

                  <div className="workflow-priority">
                    <span className={`priority-badge ${getPriorityColor(workflow.priority)}`}>
                      {getPriorityText(workflow.priority)}
                    </span>
                  </div>

                  <div className="workflow-conditions">
                    <h5>{t('conditions')}:</h5>
                    <ul>
                      {workflow.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="workflow-actions">
                    <h5>{t('actions')}:</h5>
                    <ul>
                      {workflow.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="workflow-tags">
                    {workflow.tags.map((tag, index) => (
                      <span key={index} className="workflow-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="workflow-footer">
                    <div className="workflow-meta">
                      <span>{t('createdBy')}: {workflow.createdBy}</span>
                      <span>{t('updated')}: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="workflow-controls">
                      <button 
                        className="control-button primary"
                        onClick={() => handleRunWorkflow(workflow.id)}
                      >
                        <Play size={16} />
                        <span>{t('run')}</span>
                      </button>
                      <button 
                        className="control-button secondary"
                        onClick={() => handleEditWorkflow(workflow.id)}
                      >
                        <Edit size={16} />
                        <span>{t('edit')}</span>
                      </button>
                      <button 
                        className="control-button secondary"
                        onClick={() => handleViewWorkflow(workflow.id)}
                      >
                        <Eye size={16} />
                        <span>{t('view')}</span>
                      </button>
                      <button 
                        className="control-button danger"
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                      >
                        <Trash2 size={16} />
                        <span>{t('delete')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Порожній стан */}
            {filteredWorkflows.length === 0 && (
              <div className="empty-state">
                <Zap size={48} className="empty-icon" />
                <h3>{t('noAutomationsFound')}</h3>
                <p>{t('tryChangingSearch')}</p>
              </div>
            )}
          </div>

          {/* Швидкі дії */}
          <div className="quick-actions">
            <h3>{t('quickActions')}</h3>
            <div className="actions-grid">
              <button className="quick-action">
                <Play size={20} />
                <span>{t('runAllActive')}</span>
              </button>
              <button className="quick-action">
                <Pause size={20} />
                <span>{t('stopAll')}</span>
              </button>
              <button className="quick-action">
                <BarChart3 size={20} />
                <span>{t('viewLogs')}</span>
              </button>
              <button className="quick-action">
                <Settings size={20} />
                <span>{t('settings')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AutomationPage;
