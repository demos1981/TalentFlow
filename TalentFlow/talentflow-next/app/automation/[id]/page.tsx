'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { useLanguageStore } from '../../../stores/languageStore';
import Layout from '../../../components/Layout/Layout';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  Settings,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import './workflow-detail.css';

interface WorkflowDetail {
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

const WorkflowDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        // TODO: Replace with real API call
        // const response = await fetch(`/api/automation/${params.id}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockWorkflow: WorkflowDetail = {
          id: params.id as string,
          name: 'Communication Automation',
          description: 'Automated communication workflow for candidate management',
          category: 'communication',
          status: 'active',
          trigger: 'New candidate application',
          conditions: ['Candidate status is "applied"', 'Application is complete'],
          actions: [
            'Prepare email template',
            'Send Reminder',
            'Update send status',
            'Log entry'
          ],
          lastRun: '2025-01-15T10:30:00Z',
          nextRun: '2025-01-16T10:30:00Z',
          executionCount: 45,
          successRate: 98.5,
          averageExecutionTime: 2.3,
          isEnabled: true,
          priority: 'medium',
          tags: ['communication', 'email', 'reminder'],
          createdBy: 'HR Coordinator',
          createdAt: '2025-01-10T09:00:00Z',
          updatedAt: '2025-01-15T14:20:00Z'
        };
        
        setWorkflow(mockWorkflow);
      } catch (err) {
        setError('Failed to load workflow details');
        console.error('Error fetching workflow:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      fetchWorkflow();
    }
  }, [params?.id]);

  const handleEdit = () => {
    router.push(`/automation/${params?.id}/edit`);
  };

  const handleRun = () => {
    // TODO: Implement run workflow
    console.log('Running workflow:', params?.id);
  };

  const handleToggleStatus = () => {
    // TODO: Implement toggle workflow status
    console.log('Toggling workflow status:', params?.id);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="workflow-detail-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('loadingWorkflow')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !workflow) {
    return (
      <Layout>
        <div className="workflow-detail-page">
          <div className="error-state">
            <XCircle size={48} className="error-icon" />
            <h3>{t('error')}</h3>
            <p>{error || t('workflowNotFound')}</p>
            <button onClick={() => router.back()} className="btn btn-primary">
              <ArrowLeft size={16} />
              {t('goBack')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="workflow-detail-page">
        {/* Header */}
        <div className="workflow-header">
          <div className="workflow-header-content">
            <button onClick={() => router.back()} className="back-button">
              <ArrowLeft size={20} />
            </button>
            <div className="workflow-title-section">
              <h1>{workflow.name}</h1>
              <div className="workflow-meta">
                <span className={`status-badge ${workflow.status}`}>
                  {workflow.status}
                </span>
                <span className="priority-badge">{workflow.priority}</span>
                <span className="category-badge">{workflow.category}</span>
              </div>
            </div>
            <div className="workflow-actions">
              <button 
                onClick={handleToggleStatus}
                className={`btn ${workflow.isEnabled ? 'btn-warning' : 'btn-success'}`}
              >
                {workflow.isEnabled ? <Pause size={16} /> : <Play size={16} />}
                {workflow.isEnabled ? t('pause') : t('enable')}
              </button>
              <button onClick={handleRun} className="btn btn-primary">
                <Play size={16} />
                {t('runNow')}
              </button>
              <button onClick={handleEdit} className="btn btn-secondary">
                <Edit size={16} />
                {t('edit')}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="workflow-content">
          <div className="workflow-main">
            {/* Description */}
            <div className="workflow-section">
              <h3>{t('description')}</h3>
              <p>{workflow.description}</p>
            </div>

            {/* Trigger */}
            <div className="workflow-section">
              <h3>{t('trigger')}</h3>
              <div className="trigger-info">
                <Zap size={20} className="trigger-icon" />
                <span>{workflow.trigger}</span>
              </div>
            </div>

            {/* Conditions */}
            <div className="workflow-section">
              <h3>{t('conditions')}</h3>
              <ul className="conditions-list">
                {workflow.conditions.map((condition, index) => (
                  <li key={index}>
                    <CheckCircle size={16} className="condition-icon" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="workflow-section">
              <h3>{t('actions')}</h3>
              <ol className="actions-list">
                {workflow.actions.map((action, index) => (
                  <li key={index}>
                    <span className="action-number">{index + 1}</span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            <div className="workflow-section">
              <h3>{t('tags')}</h3>
              <div className="tags-container">
                {workflow.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="workflow-sidebar">
            {/* Statistics */}
            <div className="workflow-section">
              <h3>{t('statistics')}</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <Activity size={20} />
                  <div>
                    <span className="stat-value">{workflow.executionCount}</span>
                    <span className="stat-label">{t('executions')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <CheckCircle size={20} />
                  <div>
                    <span className="stat-value">{workflow.successRate}%</span>
                    <span className="stat-label">{t('successRate')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Clock size={20} />
                  <div>
                    <span className="stat-value">{workflow.averageExecutionTime}s</span>
                    <span className="stat-label">{t('avgTime')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="workflow-section">
              <h3>{t('schedule')}</h3>
              <div className="schedule-info">
                <div className="schedule-item">
                  <Calendar size={16} />
                  <div>
                    <span className="schedule-label">{t('lastRun')}</span>
                    <span className="schedule-value">
                      {workflow.lastRun ? new Date(workflow.lastRun).toLocaleString() : t('never')}
                    </span>
                  </div>
                </div>
                <div className="schedule-item">
                  <Clock size={16} />
                  <div>
                    <span className="schedule-label">{t('nextRun')}</span>
                    <span className="schedule-value">
                      {workflow.nextRun ? new Date(workflow.nextRun).toLocaleString() : t('notScheduled')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="workflow-section">
              <h3>{t('details')}</h3>
              <div className="metadata">
                <div className="metadata-item">
                  <User size={16} />
                  <span>{t('createdBy')} {workflow.createdBy}</span>
                </div>
                <div className="metadata-item">
                  <Calendar size={16} />
                  <span>{t('createdAt')} {new Date(workflow.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <Settings size={16} />
                  <span>{t('updatedAt')} {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkflowDetailPage;
