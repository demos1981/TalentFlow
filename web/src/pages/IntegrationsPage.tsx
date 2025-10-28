import React, { useState } from 'react';
import { Link, Puzzle, Search, ExternalLink, Copy, Check, ChevronRight, ChevronDown, Zap, Shield, Users, Briefcase, Calendar, MessageSquare, Settings, Database, Globe, Lock, Mail, Phone, Monitor, Smartphone, CreditCard, FileText, BarChart3, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Play, Pause, Trash2, Edit, Eye, EyeOff } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync?: string;
  syncFrequency: string;
  apiKey?: string;
  webhookUrl?: string;
  features: string[];
  setupSteps: string[];
  documentation: string;
  pricing: 'free' | 'paid' | 'enterprise';
  rating: number;
  users: number;
}

const IntegrationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Інтеграція з LinkedIn для пошуку кандидатів та публікації вакансій',
      category: 'social',
      icon: <Users size={24} />,
      status: 'active',
      lastSync: '2025-08-25T14:30:00Z',
      syncFrequency: 'Щогодини',
      apiKey: 'lk_1234567890abcdef',
      webhookUrl: 'https://api.talentflow.io/webhooks/linkedin',
      features: [
        'Пошук кандидатів',
        'Публікація вакансій',
        'Імпорт профілів',
        'Аналітика активності'
      ],
      setupSteps: [
        'Створіть LinkedIn Developer Account',
        'Отримайте API ключі',
        'Налаштуйте webhook URL',
        'Підтвердіть інтеграцію'
      ],
      documentation: 'https://developer.linkedin.com/docs',
      pricing: 'paid',
      rating: 4.8,
      users: 1250
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Синхронізація з Google Calendar для планування інтерв\'ю',
      category: 'calendar',
      icon: <Calendar size={24} />,
      status: 'active',
      lastSync: '2025-08-25T14:25:00Z',
      syncFrequency: 'Реально часу',
      apiKey: 'gc_9876543210fedcba',
      features: [
        'Автоматичне планування інтерв\'ю',
        'Синхронізація подій',
        'Нагадування',
        'Конфлікт-детекція'
      ],
      setupSteps: [
        'Увійдіть в Google Account',
        'Надайте дозволи для Calendar',
        'Налаштуйте часові зони',
        'Тестуйте синхронізацію'
      ],
      documentation: 'https://developers.google.com/calendar',
      pricing: 'free',
      rating: 4.9,
      users: 2100
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Інтеграція з Slack для сповіщень та командної роботи',
      category: 'communication',
      icon: <MessageSquare size={24} />,
      status: 'inactive',
      syncFrequency: 'Реально часу',
      apiKey: 'sl_abcdef1234567890',
      webhookUrl: 'https://api.talentflow.io/webhooks/slack',
      features: [
        'Сповіщення про нові заявки',
        'Командна комунікація',
        'Автоматичні повідомлення',
        'Інтеграція з каналами'
      ],
      setupSteps: [
        'Створіть Slack App',
        'Налаштуйте OAuth',
        'Додайте бота в робочі простори',
        'Налаштуйте канали'
      ],
      documentation: 'https://api.slack.com/docs',
      pricing: 'free',
      rating: 4.7,
      users: 890
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Інтеграція з Stripe для обробки платежів та підписок',
      category: 'payment',
      icon: <CreditCard size={24} />,
      status: 'active',
      lastSync: '2025-08-25T14:20:00Z',
      syncFrequency: 'Реально часу',
      apiKey: 'sk_test_1234567890abcdef',
      features: [
        'Обробка платежів',
        'Управління підписками',
        'Автоматичне виставлення рахунків',
        'Аналітика платежів'
      ],
      setupSteps: [
        'Створіть Stripe Account',
        'Отримайте API ключі',
        'Налаштуйте webhook endpoints',
        'Протестуйте платежі'
      ],
      documentation: 'https://stripe.com/docs',
      pricing: 'paid',
      rating: 4.9,
      users: 1560
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Інтеграція з Zapier для автоматизації робочих процесів',
      category: 'automation',
      icon: <Zap size={24} />,
      status: 'pending',
      syncFrequency: 'За запитом',
      features: [
        'Автоматизація робочих процесів',
        'Інтеграція з 5000+ сервісів',
        'Тригери та дії',
        'Моніторинг зошитів'
      ],
      setupSteps: [
        'Створіть Zapier Account',
        'Налаштуйте зошити',
        'Підключіть тригери',
        'Тестуйте автоматизацію'
      ],
      documentation: 'https://zapier.com/developer',
      pricing: 'paid',
      rating: 4.6,
      users: 720
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Інтеграція з HubSpot CRM для управління кандидатами',
      category: 'crm',
      icon: <Database size={24} />,
      status: 'error',
      lastSync: '2025-08-25T13:45:00Z',
      syncFrequency: 'Щогодини',
      apiKey: 'hs_1234567890abcdef',
      features: [
        'Синхронізація контактів',
        'Управління лідів',
        'Автоматичні email кампанії',
        'Аналітика взаємодій'
      ],
      setupSteps: [
        'Створіть HubSpot Developer Account',
        'Отримайте API ключі',
        'Налаштуйте поля синхронізації',
        'Протестуйте інтеграцію'
      ],
      documentation: 'https://developers.hubspot.com/docs',
      pricing: 'enterprise',
      rating: 4.5,
      users: 430
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Інтеграція з Mailchimp для email маркетингу',
      category: 'email',
      icon: <Mail size={24} />,
      status: 'active',
      lastSync: '2025-08-25T14:15:00Z',
      syncFrequency: 'Щодня',
      apiKey: 'mc_abcdef1234567890',
      features: [
        'Автоматичні email кампанії',
        'Управління списками',
        'A/B тестування',
        'Аналітика відкриттів'
      ],
      setupSteps: [
        'Створіть Mailchimp Account',
        'Отримайте API ключ',
        'Налаштуйте аудиторії',
        'Створіть шаблони'
      ],
      documentation: 'https://mailchimp.com/developer',
      pricing: 'paid',
      rating: 4.4,
      users: 680
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'Інтеграція з Twilio для SMS та голосових дзвінків',
      category: 'communication',
      icon: <Phone size={24} />,
      status: 'inactive',
      syncFrequency: 'Реально часу',
      apiKey: 'tw_1234567890abcdef',
      features: [
        'SMS сповіщення',
        'Голосові дзвінки',
        'WhatsApp інтеграція',
        'IVR системи'
      ],
      setupSteps: [
        'Створіть Twilio Account',
        'Отримайте Account SID та Auth Token',
        'Налаштуйте номери',
        'Протестуйте дзвінки'
      ],
      documentation: 'https://www.twilio.com/docs',
      pricing: 'paid',
      rating: 4.3,
      users: 320
    }
  ];

  const categories = [
    { id: 'all', name: 'Всі', icon: <Puzzle size={16} /> },
    { id: 'social', name: 'Соціальні мережі', icon: <Users size={16} /> },
    { id: 'calendar', name: 'Календарі', icon: <Calendar size={16} /> },
    { id: 'communication', name: 'Комунікація', icon: <MessageSquare size={16} /> },
    { id: 'payment', name: 'Платежі', icon: <CreditCard size={16} /> },
    { id: 'automation', name: 'Автоматизація', icon: <Zap size={16} /> },
    { id: 'crm', name: 'CRM', icon: <Database size={16} /> },
    { id: 'email', name: 'Email', icon: <Mail size={16} /> }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'inactive':
        return <XCircle size={16} className="text-gray-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активна';
      case 'inactive':
        return 'Неактивна';
      case 'error':
        return 'Помилка';
      case 'pending':
        return 'Очікує';
      default:
        return 'Невідомо';
    }
  };

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free':
        return 'Безкоштовно';
      case 'paid':
        return 'Платна';
      case 'enterprise':
        return 'Корпоративна';
      default:
        return 'Невідомо';
    }
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

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Щойно';
    if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} год тому`;
    return `${Math.floor(diffInMinutes / 1440)} дн тому`;
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Інтеграції</h1>
        <p className="dashboard-greeting-subtitle">Підключення зовнішніх сервісів та автоматизація робочих процесів</p>
      </div>

      <div className="integrations-container">
        {/* Пошук та фільтри */}
        <div className="integrations-header">
          <div className="search-section">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Пошук інтеграцій..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-section">
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
        </div>

        {/* Статистика */}
        <div className="integrations-stats">
          <div className="stat-card">
            <div className="stat-icon active">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{integrations.filter(i => i.status === 'active').length}</h3>
              <p>Активні</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon inactive">
              <XCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{integrations.filter(i => i.status === 'inactive').length}</h3>
              <p>Неактивні</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon error">
              <AlertCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{integrations.filter(i => i.status === 'error').length}</h3>
              <p>Помилки</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">
              <Puzzle size={20} />
            </div>
            <div className="stat-content">
              <h3>{integrations.length}</h3>
              <p>Всього</p>
            </div>
          </div>
        </div>

        {/* Список інтеграцій */}
        <div className="integrations-grid">
          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="integration-card">
              <div className="integration-header">
                <div className="integration-icon">
                  {integration.icon}
                </div>
                <div className="integration-info">
                  <h3>{integration.name}</h3>
                  <p>{integration.description}</p>
                </div>
                <div className="integration-status">
                  {getStatusIcon(integration.status)}
                  <span className="status-text">{getStatusText(integration.status)}</span>
                </div>
              </div>

              <div className="integration-details">
                <div className="detail-row">
                  <span className="detail-label">Остання синхронізація:</span>
                  <span className="detail-value">
                    {integration.lastSync ? formatLastSync(integration.lastSync) : 'Немає даних'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Частота синхронізації:</span>
                  <span className="detail-value">{integration.syncFrequency}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Тариф:</span>
                  <span className="detail-value">{getPricingText(integration.pricing)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Рейтинг:</span>
                  <span className="detail-value">
                    ⭐ {integration.rating} ({integration.users} користувачів)
                  </span>
                </div>
              </div>

              <div className="integration-features">
                <h4>Можливості:</h4>
                <div className="features-list">
                  {integration.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>

              {integration.apiKey && (
                <div className="api-key-section">
                  <h4>API Ключ:</h4>
                  <div className="api-key-wrapper">
                    <input
                      type={showApiKeys[integration.id] ? 'text' : 'password'}
                      value={integration.apiKey}
                      readOnly
                      className="api-key-input"
                    />
                    <button
                      className="visibility-button"
                      onClick={() => toggleApiKeyVisibility(integration.id)}
                    >
                      {showApiKeys[integration.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(integration.apiKey!, `api-${integration.id}`)}
                    >
                      {copiedText === `api-${integration.id}` ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {integration.webhookUrl && (
                <div className="webhook-section">
                  <h4>Webhook URL:</h4>
                  <div className="webhook-wrapper">
                    <input
                      type="text"
                      value={integration.webhookUrl}
                      readOnly
                      className="webhook-input"
                    />
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(integration.webhookUrl!, `webhook-${integration.id}`)}
                    >
                      {copiedText === `webhook-${integration.id}` ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="integration-actions">
                <button className="action-button primary">
                  <Play size={16} />
                  <span>Активувати</span>
                </button>
                <button className="action-button secondary">
                  <Edit size={16} />
                  <span>Налаштувати</span>
                </button>
                <button className="action-button secondary">
                  <ExternalLink size={16} />
                  <span>Документація</span>
                </button>
                <button className="action-button danger">
                  <Trash2 size={16} />
                  <span>Видалити</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Порожній стан */}
        {filteredIntegrations.length === 0 && (
          <div className="empty-state">
            <Puzzle size={48} className="empty-icon" />
            <h3>Інтеграції не знайдено</h3>
            <p>Спробуйте змінити пошуковий запит або категорію</p>
          </div>
        )}

        {/* Швидкі дії */}
        <div className="quick-actions">
          <h3>Швидкі дії</h3>
          <div className="actions-grid">
            <button className="quick-action">
              <RefreshCw size={20} />
              <span>Синхронізувати всі</span>
            </button>
            <button className="quick-action">
              <BarChart3 size={20} />
              <span>Переглянути логи</span>
            </button>
            <button className="quick-action">
              <Settings size={20} />
              <span>Налаштування</span>
            </button>
            <button className="quick-action">
              <ExternalLink size={20} />
              <span>Додати нову</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
