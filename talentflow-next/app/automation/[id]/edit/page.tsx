'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../../../../stores/authStore';
import { useLanguageStore } from '../../../../stores/languageStore';
import Layout from '../../../../components/Layout/Layout';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Zap,
  Settings,
  Clock,
  CheckCircle
} from 'lucide-react';
import './workflow-edit.css';

interface WorkflowEditData {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: string;
  conditions: string[];
  actions: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  isEnabled: boolean;
}

const WorkflowEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [workflow, setWorkflow] = useState<WorkflowEditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCondition, setNewCondition] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        // TODO: Replace with real API call
        // const response = await fetch(`/api/automation/${params.id}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockWorkflow: WorkflowEditData = {
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
          priority: 'medium',
          tags: ['communication', 'email', 'reminder'],
          isEnabled: true
        };
        
        setWorkflow(mockWorkflow);
      } catch (err) {
        setError(t('failedToLoadWorkflow'));
        console.error('Error fetching workflow:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      fetchWorkflow();
    }
  }, [params?.id]);

  const handleSave = async () => {
    if (!workflow) return;
    
    try {
      setIsSaving(true);
      // TODO: Replace with real API call
      // const response = await fetch(`/api/automation/${params.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(workflow)
      // });
      
      console.log('Saving workflow:', workflow);
      router.push(`/automation/${params?.id}`);
    } catch (err) {
      setError(t('failedToSaveWorkflow'));
      console.error('Error saving workflow:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/automation/${params?.id}`);
  };

  const addCondition = () => {
    if (newCondition.trim() && workflow) {
      setWorkflow({
        ...workflow,
        conditions: [...workflow.conditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        conditions: workflow.conditions.filter((_, i) => i !== index)
      });
    }
  };

  const addAction = () => {
    if (newAction.trim() && workflow) {
      setWorkflow({
        ...workflow,
        actions: [...workflow.actions, newAction.trim()]
      });
      setNewAction('');
    }
  };

  const removeAction = (index: number) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        actions: workflow.actions.filter((_, i) => i !== index)
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && workflow) {
      setWorkflow({
        ...workflow,
        tags: [...workflow.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        tags: workflow.tags.filter((_, i) => i !== index)
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="workflow-edit-page">
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
        <div className="workflow-edit-page">
          <div className="error-state">
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
      <div className="workflow-edit-page">
        {/* Header */}
        <div className="workflow-edit-header">
          <div className="workflow-edit-header-content">
            <button onClick={handleCancel} className="back-button">
              <ArrowLeft size={20} />
            </button>
            <h1>{t('editWorkflow')}</h1>
            <div className="workflow-edit-actions">
              <button 
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSaving}
              >
                <X size={16} />
                {t('cancel')}
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="workflow-edit-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>{t('basicInformation')}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('name')}</label>
                <input
                  type="text"
                  value={workflow.name}
                  onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>{t('category')}</label>
                <select
                  value={workflow.category}
                  onChange={(e) => setWorkflow({ ...workflow, category: e.target.value })}
                  className="form-select"
                >
                  <option value="communication">Communication</option>
                  <option value="evaluation">Evaluation</option>
                  <option value="notification">Notification</option>
                  <option value="workflow">Workflow</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('priority')}</label>
                <select
                  value={workflow.priority}
                  onChange={(e) => setWorkflow({ ...workflow, priority: e.target.value as any })}
                  className="form-select"
                >
                  <option value="low">{t('low')}</option>
                  <option value="medium">{t('medium')}</option>
                  <option value="high">{t('high')}</option>
                  <option value="critical">{t('critical')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('status')}</label>
                <select
                  value={workflow.status}
                  onChange={(e) => setWorkflow({ ...workflow, status: e.target.value as any })}
                  className="form-select"
                >
                  <option value="draft">{t('draft')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="error">{t('error')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{t('description')}</label>
              <textarea
                value={workflow.description}
                onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                className="form-textarea"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>{t('trigger')}</label>
              <input
                type="text"
                value={workflow.trigger}
                onChange={(e) => setWorkflow({ ...workflow, trigger: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="form-section">
            <h3>{t('conditions')}</h3>
            <div className="list-container">
              {workflow.conditions.map((condition, index) => (
                <div key={index} className="list-item">
                  <CheckCircle size={16} className="list-icon" />
                  <span>{condition}</span>
                  <button
                    onClick={() => removeCondition(index)}
                    className="remove-button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="add-item">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  placeholder={t('addNewCondition')}
                  className="form-input"
                />
                <button onClick={addCondition} className="add-button">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-section">
            <h3>{t('actions')}</h3>
            <div className="list-container">
              {workflow.actions.map((action, index) => (
                <div key={index} className="list-item">
                  <span className="action-number">{index + 1}</span>
                  <span>{action}</span>
                  <button
                    onClick={() => removeAction(index)}
                    className="remove-button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="add-item">
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAction()}
                  placeholder={t('addNewAction')}
                  className="form-input"
                />
                <button onClick={addAction} className="add-button">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <h3>{t('tags')}</h3>
            <div className="tags-container">
              {workflow.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="tag-remove"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="add-tag">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder={t('addNewTag')}
                className="form-input"
              />
              <button onClick={addTag} className="add-button">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <h3>{t('settings')}</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={workflow.isEnabled}
                  onChange={(e) => setWorkflow({ ...workflow, isEnabled: e.target.checked })}
                />
                <span>{t('enableWorkflow')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkflowEditPage;
