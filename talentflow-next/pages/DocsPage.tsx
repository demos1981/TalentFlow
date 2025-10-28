import React, { useState } from 'react';
import { BookOpen, FileText, Code, Search, ExternalLink, Copy, Check, ChevronRight, ChevronDown, Zap, Shield, Users, Briefcase, Calendar, MessageSquare, Settings, Database, Globe, Lock } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

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
      title: 'Огляд API',
      icon: <BookOpen size={20} />,
      description: 'Загальна інформація про TalentFluent API',
      content: `TalentFluent API - це RESTful API для роботи з HR платформою. API дозволяє управляти вакансіями, кандидатами, компаніями та іншими сутностями системи.

**Основні особливості:**
- RESTful архітектура
- JSON формат даних
- JWT аутентифікація
- Rate limiting
- Валідація вхідних даних
- Детальна документація`,
      codeExample: `curl -X GET "https://api.talentflow.io/health" \\
  -H "Content-Type: application/json"`
    },
    {
      id: 'authentication',
      title: 'Аутентифікація',
      icon: <Lock size={20} />,
      description: 'JWT токени та авторизація',
      content: `Всі API запити (крім публічних ендпоінтів) потребують аутентифікації через JWT токени.

**Процес аутентифікації:**
1. Отримання токена через /auth/login
2. Використання токена в заголовку Authorization
3. Оновлення токена через /auth/refresh`,
      endpoints: [
        {
          method: 'POST',
          path: '/auth/login',
          description: 'Вхід в систему',
          example: `{
  "email": "user@example.com",
  "password": "password123"
}`
        },
        {
          method: 'POST',
          path: '/auth/refresh',
          description: 'Оновлення токена',
          example: `{
  "refreshToken": "your_refresh_token"
}`
        }
      ]
    },
    {
      id: 'jobs',
      title: 'Вакансії',
      icon: <Briefcase size={20} />,
      description: 'Управління вакансіями та робочими місцями',
      content: `API для створення, редагування та управління вакансіями. Підтримує розширені фільтри, пошук та AI-рекомендації.

**Основні функції:**
- Створення та редагування вакансій
- Пошук та фільтрація
- AI-рекомендації кандидатів
- Статистика та аналітика`,
      endpoints: [
        {
          method: 'GET',
          path: '/jobs',
          description: 'Отримання списку вакансій'
        },
        {
          method: 'POST',
          path: '/jobs',
          description: 'Створення нової вакансії'
        },
        {
          method: 'GET',
          path: '/jobs/:id',
          description: 'Отримання деталей вакансії'
        },
        {
          method: 'PUT',
          path: '/jobs/:id',
          description: 'Оновлення вакансії'
        }
      ]
    },
    {
      id: 'candidates',
      title: 'Кандидати',
      icon: <Users size={20} />,
      description: 'Управління кандидатами та профілями',
      content: `API для роботи з кандидатами, їх профілями та заявками. Включає AI-матчинг та рекомендації.

**Функціональність:**
- Управління профілями кандидатів
- AI-матчинг з вакансіями
- Оцінка навичок
- Історія заявок`,
      endpoints: [
        {
          method: 'GET',
          path: '/candidates',
          description: 'Пошук кандидатів'
        },
        {
          method: 'GET',
          path: '/candidates/:id',
          description: 'Профіль кандидата'
        },
        {
          method: 'POST',
          path: '/candidates/:id/assess',
          description: 'Оцінка кандидата'
        }
      ]
    },
    {
      id: 'applications',
      title: 'Заявки',
      icon: <FileText size={20} />,
      description: 'Управління заявками на вакансії',
      content: `API для роботи з заявками кандидатів на вакансії. Включає статуси, коментарі та workflow.

**Статуси заявок:**
- Нова
- Переглянута
- Відібрана
- Інтерв'ю
- Прийнята/Відхилена`,
      endpoints: [
        {
          method: 'GET',
          path: '/applications',
          description: 'Список заявок'
        },
        {
          method: 'POST',
          path: '/applications',
          description: 'Створення заявки'
        },
        {
          method: 'PUT',
          path: '/applications/:id/status',
          description: 'Оновлення статусу'
        }
      ]
    },
    {
      id: 'interviews',
      title: 'Інтерв\'ю',
      icon: <MessageSquare size={20} />,
      description: 'Планування та управління інтерв\'ю',
      content: `API для планування та управління інтерв'ю з кандидатами. Підтримує календар та нагадування.

**Можливості:**
- Планування інтерв'ю
- Інтеграція з календарем
- Нагадування
- Оцінка інтерв'ю`,
      endpoints: [
        {
          method: 'GET',
          path: '/interviews',
          description: 'Список інтерв\'ю'
        },
        {
          method: 'POST',
          path: '/interviews',
          description: 'Створення інтерв\'ю'
        },
        {
          method: 'PUT',
          path: '/interviews/:id',
          description: 'Оновлення інтерв\'ю'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Аналітика',
      icon: <Zap size={20} />,
      description: 'Статистика та звіти',
      content: `API для отримання аналітики та статистики по різних аспектах роботи з персоналом.

**Типи звітів:**
- Статистика найму
- Ефективність рекрутингу
- Аналіз кандидатів
- Продуктивність HR команди`,
      endpoints: [
        {
          method: 'GET',
          path: '/analytics/hiring',
          description: 'Статистика найму'
        },
        {
          method: 'GET',
          path: '/analytics/recruitment',
          description: 'Ефективність рекрутингу'
        },
        {
          method: 'GET',
          path: '/analytics/candidates',
          description: 'Аналіз кандидатів'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Налаштування',
      icon: <Settings size={20} />,
      description: 'API для управління налаштуваннями',
      content: `API для роботи з налаштуваннями користувачів, компаній та системи.

**Типи налаштувань:**
- Профіль користувача
- Налаштування сповіщень
- Безпека
- Інтеграції`,
      endpoints: [
        {
          method: 'GET',
          path: '/settings/user',
          description: 'Налаштування користувача'
        },
        {
          method: 'PUT',
          path: '/settings/profile',
          description: 'Оновлення профілю'
        },
        {
          method: 'PUT',
          path: '/settings/notifications',
          description: 'Налаштування сповіщень'
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
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('apiDocumentation')}</h1>
        <p className="dashboard-greeting-subtitle">{t('completeApiDocumentationAndGuides')}</p>
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
              <span>{t('swaggerUI')}</span>
            </a>
            <a href="http://localhost:3000/health" target="_blank" rel="noopener noreferrer" className="quick-link">
              <Zap size={16} />
              <span>{t('healthCheck')}</span>
            </a>
            <a href="https://github.com/talentflow/api" target="_blank" rel="noopener noreferrer" className="quick-link">
              <Code size={16} />
              <span>{t('github')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
