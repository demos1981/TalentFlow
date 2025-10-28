import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, Search, ChevronDown, ChevronRight, Mail, Phone, MessageCircle, Video, FileText, Users, Settings, Briefcase, Calendar, Zap, ExternalLink, Copy, Check } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

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
      title: 'Початок роботи',
      icon: <BookOpen size={20} />,
      description: 'Базові кроки для початку роботи з TalentFlow',
      articles: [
        {
          id: 'first-steps',
          title: 'Перші кроки',
          description: 'Як створити акаунт та налаштувати профіль',
          content: `# Перші кроки в TalentFlow

## 1. Реєстрація
- Перейдіть на сторінку реєстрації
- Заповніть обов'язкові поля
- Підтвердіть email адресу

## 2. Налаштування профілю
- Завантажте фото профілю
- Додайте контактну інформацію
- Вкажіть ваші навички та досвід

## 3. Перша вакансія
- Створіть першу вакансію
- Додайте опис та вимоги
- Опублікуйте вакансію

## 4. Початок пошуку
- Використовуйте фільтри для пошуку
- Переглядайте кандидатів
- Відправляйте запрошення на інтерв'ю`
        },
        {
          id: 'profile-setup',
          title: 'Налаштування профілю',
          description: 'Детальний гайд по налаштуванню профілю компанії',
          content: `# Налаштування профілю компанії

## Основна інформація
- Назва компанії
- Логотип та брендинг
- Опис компанії
- Контактна інформація

## Додаткова інформація
- Розмір компанії
- Галузь діяльності
- Локація
- Веб-сайт

## Налаштування сповіщень
- Email сповіщення
- Push сповіщення
- Частота сповіщень`
        }
      ]
    },
    {
      id: 'jobs',
      title: 'Вакансії',
      icon: <Briefcase size={20} />,
      description: 'Управління вакансіями та робочими місцями',
      articles: [
        {
          id: 'create-job',
          title: 'Створення вакансії',
          description: 'Як створити ефективну вакансію',
          content: `# Створення вакансії

## Крок 1: Основна інформація
- Назва позиції
- Опис вакансії
- Вимоги до кандидата
- Обов'язки

## Крок 2: Деталі
- Зарплатний діапазон
- Тип зайнятості
- Локація роботи
- Рівень досвіду

## Крок 3: Додаткові налаштування
- Ключові слова
- Категорії
- Теги
- Закрити дату

## Поради для ефективної вакансії:
- Використовуйте чіткі та зрозумілі описи
- Вказуйте конкретні вимоги
- Додайте інформацію про компанію
- Використовуйте ключові слова для пошуку`
        },
        {
          id: 'job-management',
          title: 'Управління вакансіями',
          description: 'Як ефективно управляти вашими вакансіями',
          content: `# Управління вакансіями

## Статуси вакансій
- **Активна** - Вакансія відкрита для заявок
- **На паузі** - Тимчасово призупинена
- **Закрита** - Вакансія закрита
- **Архівна** - Переміщена в архів

## Функції управління
- Редагування вакансії
- Дублювання вакансії
- Масові операції
- Експорт даних

## Аналітика вакансій
- Кількість переглядів
- Кількість заявок
- Конверсія
- Джерела трафіку`
        }
      ]
    },
    {
      id: 'candidates',
      title: 'Кандидати',
      icon: <Users size={20} />,
      description: 'Пошук та управління кандидатами',
      articles: [
        {
          id: 'search-candidates',
          title: 'Пошук кандидатів',
          description: 'Ефективні методи пошуку кандидатів',
          content: `# Пошук кандидатів

## Базовий пошук
- Пошук за ключовими словами
- Фільтри за локацією
- Фільтри за досвідом
- Фільтри за навичками

## Розширений пошук
- AI-рекомендації
- Семантичний пошук
- Пошук за соціальними мережами
- Пошук за портфоліо

## Збережені пошуки
- Створення збережених пошуків
- Автоматичні сповіщення
- Експорт результатів
- Аналітика пошуку`
        },
        {
          id: 'ai-matching',
          title: 'AI-матчинг',
          description: 'Використання штучного інтелекту для пошуку',
          content: `# AI-матчинг кандидатів

## Як працює AI-матчинг
- Аналіз профілю кандидата
- Порівняння з вимогами вакансії
- Оцінка відповідності
- Ранжування результатів

## Налаштування AI
- Важливість різних критеріїв
- Налаштування алгоритму
- Навчання системи
- Оцінка точності

## Результати матчингу
- Відсоток відповідності
- Детальний аналіз
- Рекомендації
- Історія матчингу`
        }
      ]
    },
    {
      id: 'interviews',
      title: 'Інтерв\'ю',
      icon: <Calendar size={20} />,
      description: 'Планування та проведення інтерв\'ю',
      articles: [
        {
          id: 'schedule-interview',
          title: 'Планування інтерв\'ю',
          description: 'Як ефективно планувати інтерв\'ю',
          content: `# Планування інтерв'ю

## Вибір формату
- Офлайн інтерв'ю
- Відео інтерв'ю
- Телефонне інтерв'ю
- Групове інтерв'ю

## Налаштування часу
- Вибір дати та часу
- Тривалість інтерв'ю
- Буфери між інтерв'ю
- Часові зони

## Автоматизація
- Автоматичні нагадування
- Інтеграція з календарем
- Шаблони інтерв'ю
- Масове планування`
        },
        {
          id: 'interview-tips',
          title: 'Поради для інтерв\'ю',
          description: 'Як провести ефективне інтерв\'ю',
          content: `# Поради для ефективного інтерв'ю

## Підготовка
- Вивчення резюме кандидата
- Підготовка питань
- Налаштування техніки
- Планування структури

## Проведення інтерв'ю
- Створення комфортної атмосфери
- Структурованість
- Активне слухання
- Запис відповідей

## Оцінка кандидата
- Критерії оцінки
- Шкала оцінювання
- Фідбек
- Прийняття рішення`
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Аналітика',
      icon: <Zap size={20} />,
      description: 'Аналітика та звіти',
      articles: [
        {
          id: 'dashboard',
          title: 'Дашборд аналітики',
          description: 'Розуміння основних метрик',
          content: `# Дашборд аналітики

## Основні метрики
- Кількість активних вакансій
- Кількість заявок
- Конверсія заявок
- Час закриття вакансії

## Візуалізація
- Графіки та діаграми
- Тренди з часом
- Порівняння періодів
- Прогнози

## Експорт даних
- Формати експорту
- Автоматичні звіти
- Налаштування звітів
- Розсилка звітів`
        },
        {
          id: 'reports',
          title: 'Звіти',
          description: 'Створення та налаштування звітів',
          content: `# Створення звітів

## Типи звітів
- Звіт по вакансіях
- Звіт по кандидатах
- Звіт по інтерв'ю
- Звіт по найму

## Налаштування звітів
- Вибір періоду
- Фільтри даних
- Групування
- Сортування

## Автоматизація
- Розклад звітів
- Email розсилка
- Інтеграція з іншими системами
- API доступ`
        }
      ]
    },
    {
      id: 'settings',
      title: 'Налаштування',
      icon: <Settings size={20} />,
      description: 'Налаштування системи та профілю',
      articles: [
        {
          id: 'account-settings',
          title: 'Налаштування акаунту',
          description: 'Управління налаштуваннями акаунту',
          content: `# Налаштування акаунту

## Профіль користувача
- Особиста інформація
- Фото профілю
- Контактні дані
- Біографія

## Безпека
- Зміна пароля
- Двофакторна аутентифікація
- Активні сесії
- Лог активності

## Сповіщення
- Email сповіщення
- Push сповіщення
- SMS сповіщення
- Налаштування частоти`
        },
        {
          id: 'company-settings',
          title: 'Налаштування компанії',
          description: 'Управління налаштуваннями компанії',
          content: `# Налаштування компанії

## Інформація про компанію
- Назва та логотип
- Опис компанії
- Контактна інформація
- Соціальні мережі

## Налаштування рекрутингу
- Процес найму
- Етапи інтерв'ю
- Критерії оцінки
- Шаблони

## Інтеграції
- Календар
- Email
- CRM системи
- HR системи`
        }
      ]
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'account-creation',
      question: 'Як створити акаунт в TalentFlow?',
      answer: 'Для створення акаунту перейдіть на сторінку реєстрації, заповніть обов\'язкові поля (email, пароль, назва компанії) та підтвердіть email адресу. Після підтвердження ви зможете увійти в систему та почати роботу.',
      category: 'account',
      tags: ['реєстрація', 'акаунт', 'початок']
    },
    {
      id: 'job-posting',
      question: 'Скільки коштує розміщення вакансії?',
      answer: 'TalentFlow пропонує різні тарифні плани. Базовий план дозволяє розміщувати до 5 вакансій безкоштовно. Для більшої кількості вакансій та розширених функцій доступні платні плани.',
      category: 'pricing',
      tags: ['ціни', 'тарифи', 'вакансії']
    },
    {
      id: 'ai-matching',
      question: 'Як працює AI-матчинг кандидатів?',
      answer: 'AI-матчинг аналізує профіль кандидата та порівнює його з вимогами вакансії. Система враховує навички, досвід, локацію та інші фактори для визначення відсотка відповідності.',
      category: 'features',
      tags: ['AI', 'матчинг', 'кандидати']
    },
    {
      id: 'data-security',
      question: 'Як захищені мої дані?',
      answer: 'TalentFlow використовує найсучасніші методи захисту даних: шифрування, двофакторна аутентифікація, регулярні аудити безпеки та відповідність GDPR. Ваші дані завжди захищені.',
      category: 'security',
      tags: ['безпека', 'дані', 'GDPR']
    },
    {
      id: 'support',
      question: 'Як зв\'язатися з підтримкою?',
      answer: 'Ви можете зв\'язатися з нашою командою підтримки через email, телефон або чат. Відповідаємо протягом 24 годин у робочі дні.',
      category: 'support',
      tags: ['підтримка', 'контакти', 'допомога']
    },
    {
      id: 'mobile-app',
      question: 'Чи є мобільний додаток?',
      answer: 'Так, TalentFlow має мобільний додаток для iOS та Android. Додаток дозволяє управляти вакансіями, переглядати кандидатів та планувати інтерв\'ю з мобільного пристрою.',
      category: 'mobile',
      tags: ['мобільний', 'додаток', 'iOS', 'Android']
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
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('helpAndSupport')}</h1>
        <p className="dashboard-greeting-subtitle">{t('findAnswersAndGetHelp')}</p>
      </div>

      <div className="help-container">
        {/* Пошук */}
        <div className="help-search">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder={t('searchHelpAndFAQ')}
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
  );
};

export default HelpPage;
