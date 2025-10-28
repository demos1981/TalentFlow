import React, { useState } from 'react';
import { Zap, Search, Plus, Play, Pause, Trash2, Edit, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings, Users, Mail, Calendar, MessageSquare, FileText, BarChart3, Filter, Download, Upload, Copy, Check, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Target, Bell, Shield, Database, Globe, Lock, Workflow, Timer, Repeat, Sparkles } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const workflows: AutomationWorkflow[] = [
    {
      id: 'new-candidate-welcome',
      name: 'Привітання нового кандидата',
      description: 'Автоматичне відправлення привітального email та налаштування профілю для нових кандидатів',
      category: 'onboarding',
      status: 'active',
      trigger: 'Новий кандидат зареєстрований',
      conditions: [
        'Кандидат має валідний email',
        'Профіль заповнений на 80%+',
        'Не є дублікатом'
      ],
      actions: [
        'Відправити привітальний email',
        'Створити профіль кандидата',
        'Додати до бази даних',
        'Надіслати сповіщення HR'
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
      name: 'Автоматичне планування інтерв\'ю',
      description: 'Автоматичне планування інтерв\'ю на основі доступності кандидата та інтерв\'юера',
      category: 'scheduling',
      status: 'active',
      trigger: 'Кандидат пройшов скринінг',
      conditions: [
        'Кандидат має статус "Approved"',
        'Є доступні інтерв\'юери',
        'Кандидат вказав часові слоты'
      ],
      actions: [
        'Перевірити доступність інтерв\'юерів',
        'Запланувати інтерв\'ю',
        'Відправити запрошення кандидату',
        'Створити подію в календарі',
        'Надіслати нагадування'
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
      name: 'Оновлення статусу заявки',
      description: 'Автоматичне оновлення статусу заявки на основі дій кандидата та HR',
      category: 'tracking',
      status: 'active',
      trigger: 'Зміна статусу заявки',
      conditions: [
        'Заявка існує в системі',
        'Новий статус відрізняється від поточного',
        'Користувач має права на зміну'
      ],
      actions: [
        'Оновити статус в базі даних',
        'Відправити сповіщення кандидату',
        'Оновити дашборд',
        'Записати в лог змін',
        'Створити активність'
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
      name: 'Нагадування по email',
      description: 'Автоматичне відправлення нагадувань кандидатам про майбутні інтерв\'ю',
      category: 'communication',
      status: 'active',
      trigger: 'За 24 години до інтерв\'ю',
      conditions: [
        'Інтерв\'ю заплановане',
        'Кандидат має email',
        'Не відправлялося раніше'
      ],
      actions: [
        'Підготувати email шаблон',
        'Відправити нагадування',
        'Оновити статус відправки',
        'Записати в лог'
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
      name: 'Автоматичне оцінювання кандидатів',
      description: 'Автоматичне оцінювання кандидатів на основі їх профілю та відповідей',
      category: 'scoring',
      status: 'draft',
      trigger: 'Кандидат завершив тестування',
      conditions: [
        'Тестування пройдено',
        'Всі відповіді записані',
        'Критерії оцінювання налаштовані'
      ],
      actions: [
        'Проаналізувати відповіді',
        'Розрахувати бал',
        'Порівняти з критеріями',
        'Оновити статус кандидата',
        'Надіслати результат HR'
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
      name: 'Генерація документів',
      description: 'Автоматична генерація трудових договорів та інших документів',
      category: 'documents',
      status: 'error',
      trigger: 'Кандидат прийняв пропозицію',
      conditions: [
        'Пропозиція прийнята',
        'Всі необхідні дані надані',
        'Шаблони документів готові'
      ],
      actions: [
        'Згенерувати трудовий договір',
        'Створити додаткові документи',
        'Відправити на підпис',
        'Зберегти в архів',
        'Надіслати копію HR'
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
      name: 'Привітальний Email',
      description: 'Автоматичне відправлення привітального email новим кандидатам',
      category: 'communication',
      icon: <Mail size={24} />,
      complexity: 'simple',
      estimatedTime: '5 хв',
      popularity: 95,
      tags: ['email', 'onboarding', 'welcome']
    },
    {
      id: 'interview-scheduler',
      name: 'Планувальник інтерв\'ю',
      description: 'Автоматичне планування інтерв\'ю з інтеграцією календаря',
      category: 'scheduling',
      icon: <Calendar size={24} />,
      complexity: 'medium',
      estimatedTime: '15 хв',
      popularity: 88,
      tags: ['scheduling', 'interview', 'calendar']
    },
    {
      id: 'status-tracker',
      name: 'Відстеження статусу',
      description: 'Автоматичне оновлення та відстеження статусу заявок',
      category: 'tracking',
      icon: <BarChart3 size={24} />,
      complexity: 'simple',
      estimatedTime: '10 хв',
      popularity: 92,
      tags: ['tracking', 'status', 'updates']
    },
    {
      id: 'reminder-system',
      name: 'Система нагадувань',
      description: 'Автоматичні нагадування про важливі події та дедлайни',
      category: 'communication',
      icon: <Bell size={24} />,
      complexity: 'medium',
      estimatedTime: '12 хв',
      popularity: 85,
      tags: ['reminders', 'notifications', 'alerts']
    },
    {
      id: 'document-generator',
      name: 'Генератор документів',
      description: 'Автоматична генерація трудових договорів та інших документів',
      category: 'documents',
      icon: <FileText size={24} />,
      complexity: 'complex',
      estimatedTime: '25 хв',
      popularity: 78,
      tags: ['documents', 'contracts', 'generation']
    },
    {
      id: 'candidate-scoring',
      name: 'Оцінювання кандидатів',
      description: 'AI-підтримка для автоматичного оцінювання кандидатів',
      category: 'scoring',
      icon: <Target size={24} />,
      complexity: 'complex',
      estimatedTime: '30 хв',
      popularity: 82,
      tags: ['ai', 'scoring', 'evaluation']
    }
  ];

  const categories = [
    { id: 'all', name: 'Всі', icon: <Zap size={16} /> },
    { id: 'onboarding', name: 'Онбординг', icon: <Users size={16} /> },
    { id: 'scheduling', name: 'Планування', icon: <Calendar size={16} /> },
    { id: 'tracking', name: 'Відстеження', icon: <BarChart3 size={16} /> },
    { id: 'communication', name: 'Комунікація', icon: <MessageSquare size={16} /> },
    { id: 'scoring', name: 'Оцінювання', icon: <Target size={16} /> },
    { id: 'documents', name: 'Документи', icon: <FileText size={16} /> }
  ];

  const statuses = [
    { id: 'all', name: 'Всі статуси', icon: <Eye size={16} /> },
    { id: 'active', name: 'Активні', icon: <CheckCircle size={16} /> },
    { id: 'inactive', name: 'Неактивні', icon: <Pause size={16} /> },
    { id: 'draft', name: 'Чернетки', icon: <Edit size={16} /> },
    { id: 'error', name: 'Помилки', icon: <AlertCircle size={16} /> }
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
        return <CheckCircle size={16} className="text-green-500" />;
      case 'inactive':
        return <Pause size={16} className="text-gray-400" />;
      case 'draft':
        return <Edit size={16} className="text-blue-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активний';
      case 'inactive':
        return 'Неактивний';
      case 'draft':
        return 'Чернетка';
      case 'error':
        return 'Помилка';
      default:
        return 'Невідомо';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Низький';
      case 'medium':
        return 'Середній';
      case 'high':
        return 'Високий';
      case 'critical':
        return 'Критичний';
      default:
        return 'Невідомо';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'complex':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'Простий';
      case 'medium':
        return 'Середній';
      case 'complex':
        return 'Складний';
      default:
        return 'Невідомо';
    }
  };

  const formatLastRun = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Щойно';
    if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} год тому`;
    return `${Math.floor(diffInMinutes / 1440)} дн тому`;
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
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Автоматизація</h1>
        <p className="dashboard-greeting-subtitle">Автоматизація HR процесів та робочих потоків</p>
      </div>

      <div className="automation-container">
        {/* Пошук та фільтри */}
        <div className="automation-header">
          <div className="search-section">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Пошук автоматизацій..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <label>Категорія:</label>
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
              <label>Статус:</label>
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
              <p>Активні</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon inactive">
              <Pause size={20} />
            </div>
            <div className="stat-content">
              <h3>{workflows.filter(w => w.status === 'inactive').length}</h3>
              <p>Неактивні</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon draft">
              <Edit size={20} />
            </div>
            <div className="stat-content">
              <h3>{workflows.filter(w => w.status === 'draft').length}</h3>
              <p>Чернетки</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon error">
              <AlertCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{workflows.filter(w => w.status === 'error').length}</h3>
              <p>Помилки</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">
              <Zap size={20} />
            </div>
            <div className="stat-content">
              <h3>{workflows.length}</h3>
              <p>Всього</p>
            </div>
          </div>
        </div>

        {/* Кнопки дій */}
        <div className="automation-actions">
          <button className="action-button primary" onClick={() => setShowTemplates(true)}>
            <Plus size={16} />
            <span>Створити автоматизацію</span>
          </button>
          <button className="action-button secondary">
            <Upload size={16} />
            <span>Імпортувати</span>
          </button>
          <button className="action-button secondary">
            <Download size={16} />
            <span>Експортувати</span>
          </button>
          <button className="action-button secondary">
            <Settings size={16} />
            <span>Налаштування</span>
          </button>
        </div>

        {/* Шаблони автоматизацій */}
        {showTemplates && (
          <div className="templates-section">
            <div className="templates-header">
              <h3>Шаблони автоматизацій</h3>
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
                    <button className="template-button primary">
                      <Plus size={16} />
                      <span>Використати</span>
                    </button>
                    <button className="template-button secondary">
                      <Eye size={16} />
                      <span>Переглянути</span>
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
            <h3>Робочі процеси ({filteredWorkflows.length})</h3>
            <div className="workflows-actions">
              <button className="workflow-action">
                <RefreshCw size={16} />
                <span>Оновити всі</span>
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
                    <span className="detail-label">Тригер:</span>
                    <span className="detail-value">{workflow.trigger}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Останній запуск:</span>
                    <span className="detail-value">
                      {workflow.lastRun ? formatLastRun(workflow.lastRun) : 'Немає даних'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Запусків:</span>
                    <span className="detail-value">{workflow.executionCount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Успішність:</span>
                    <span className="detail-value">{workflow.successRate}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Час виконання:</span>
                    <span className="detail-value">{workflow.averageExecutionTime}с</span>
                  </div>
                </div>

                <div className="workflow-priority">
                  <span className={`priority-badge ${getPriorityColor(workflow.priority)}`}>
                    {getPriorityText(workflow.priority)}
                  </span>
                </div>

                <div className="workflow-conditions">
                  <h5>Умови:</h5>
                  <ul>
                    {workflow.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>

                <div className="workflow-actions">
                  <h5>Дії:</h5>
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
                    <span>Створено: {workflow.createdBy}</span>
                    <span>Оновлено: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="workflow-controls">
                    <button className="control-button primary">
                      <Play size={16} />
                      <span>Запустити</span>
                    </button>
                    <button className="control-button secondary">
                      <Edit size={16} />
                      <span>Редагувати</span>
                    </button>
                    <button className="control-button secondary">
                      <Eye size={16} />
                      <span>Переглянути</span>
                    </button>
                    <button className="control-button danger">
                      <Trash2 size={16} />
                      <span>Видалити</span>
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
              <h3>Автоматизації не знайдено</h3>
              <p>Спробуйте змінити пошуковий запит або фільтри</p>
            </div>
          )}
        </div>

        {/* Швидкі дії */}
        <div className="quick-actions">
          <h3>Швидкі дії</h3>
          <div className="actions-grid">
            <button className="quick-action">
              <Play size={20} />
              <span>Запустити всі активні</span>
            </button>
            <button className="quick-action">
              <Pause size={20} />
              <span>Зупинити всі</span>
            </button>
            <button className="quick-action">
              <BarChart3 size={20} />
              <span>Переглянути логи</span>
            </button>
            <button className="quick-action">
              <Settings size={20} />
              <span>Налаштування</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPage;
