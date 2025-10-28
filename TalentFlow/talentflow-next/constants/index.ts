// App constants
export const APP_NAME = 'TalentMatch Pro';
export const APP_VERSION = '0.1.0';
export const APP_DESCRIPTION = 'AI-підсилена HR платформа для пошуку та найму талановитих спеціалістів';

// API constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://talentflow-production-50cc.up.railway.app/api';
export const API_TIMEOUT = 10000;
export const API_RETRY_ATTEMPTS = 3;

// Pagination constants
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const MAX_PAGE_SIZE = 100;

// Date formats
export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATETIME_FORMAT = 'dd.MM.yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif'
];

// Validation constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const BIO_MAX_LENGTH = 500;
export const DESCRIPTION_MAX_LENGTH = 1000;

// Job constants
export const JOB_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed'
} as const;

export const JOB_URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship'
} as const;

// Job types for backend compatibility (underscore format)
export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  FREELANCE: 'freelance'
} as const;

export const EXPERIENCE_LEVELS = {
  NO_EXPERIENCE: 'no_experience',
  LESS_THAN_1: 'less_than_1',
  FROM_1_TO_3: '1_to_3',
  FROM_3_TO_5: '3_to_5',
  FROM_5_TO_10: '5_to_10',
  MORE_THAN_10: 'more_than_10'
} as const;

export const REMOTE_WORK_OPTIONS = {
  NONE: 'none',
  PARTIAL: 'partial',
  FULL: 'full'
} as const;

// Company constants
export const COMPANY_SIZES = {
  STARTUP: 'startup',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  ENTERPRISE: 'enterprise'
} as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Transportation',
  'Energy',
  'Media & Entertainment',
  'Consulting',
  'Non-profit',
  'Government',
  'Other'
] as const;

// User constants
export const USER_TYPES = {
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
  ADMIN: 'admin'
} as const;

export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
} as const;

// Application constants
export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  INTERVIEWING: 'interviewing',
  OFFERED: 'offered',
  HIRED: 'hired',
  REJECTED: 'rejected'
} as const;

// Interview constants
export const INTERVIEW_TYPES = {
  PHONE: 'phone',
  VIDEO: 'video',
  ON_SITE: 'on-site',
  TECHNICAL: 'technical',
  FINAL: 'final'
} as const;

export const INTERVIEW_STATUSES = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
} as const;

// Subscription constants
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  TRIAL: 'trial'
} as const;

// Payment constants
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  STRIPE: 'stripe'
} as const;

// Notification constants
export const NOTIFICATION_TYPES = {
  APPLICATION: 'application',
  INTERVIEW: 'interview',
  MESSAGE: 'message',
  SYSTEM: 'system',
  PAYMENT: 'payment'
} as const;

// Skill constants
export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const;

export const SKILL_CATEGORIES = {
  PROGRAMMING: 'programming',
  FRAMEWORK: 'framework',
  DATABASE: 'database',
  CLOUD: 'cloud',
  SOFT_SKILL: 'soft_skill',
  OTHER: 'other'
} as const;

// Language constants
export const LANGUAGE_PROFICIENCIES = {
  BASIC: 'basic',
  CONVERSATIONAL: 'conversational',
  FLUENT: 'fluent',
  NATIVE: 'native'
} as const;

// Currency constants
export const CURRENCIES = {
  UAH: 'UAH',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP'
} as const;

// Job creation constants with labels for UI
export const JOB_TYPES_OPTIONS = [
  { value: 'full_time', label: 'Повна зайнятість' },
  { value: 'part_time', label: 'Часткова зайнятість' },
  { value: 'internship', label: 'Стажування' },
  { value: 'freelance', label: 'Фріланс' }
] as const;

export const EXPERIENCE_LEVELS_OPTIONS = [
  { value: 'no_experience', label: 'Без досвіду' },
  { value: 'less_than_1', label: 'До 1 року' },
  { value: '1_to_3', label: 'Від 1 до 3 років' },
  { value: '3_to_5', label: 'Від 3 до 5 років' },
  { value: '5_to_10', label: 'Від 5 до 10 років' },
  { value: 'more_than_10', label: '10+ років' }
] as const;

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'UAH', label: 'UAH (₴)' },
  { value: 'GBP', label: 'GBP (£)' }
] as const;

// Time constants
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  CANDIDATES: '/candidates',
  COMPANIES: '/companies',
  APPLICATIONS: '/applications',
  INTERVIEWS: '/interviews',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
  ABOUT: '/about',
  CONTACT: '/contact'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Помилка мережі. Перевірте з\'єднання.',
  UNAUTHORIZED: 'Необхідна авторизація.',
  FORBIDDEN: 'Доступ заборонено.',
  NOT_FOUND: 'Ресурс не знайдено.',
  VALIDATION_ERROR: 'Помилка валідації даних.',
  SERVER_ERROR: 'Помилка сервера. Спробуйте пізніше.',
  UNKNOWN_ERROR: 'Невідома помилка.',
  INVALID_CREDENTIALS: 'Невірний email або пароль.',
  EMAIL_ALREADY_EXISTS: 'Користувач з таким email вже існує.',
  WEAK_PASSWORD: 'Пароль занадто слабкий.',
  INVALID_EMAIL: 'Невірний формат email.',
  FILE_TOO_LARGE: 'Файл занадто великий.',
  INVALID_FILE_TYPE: 'Непідтримуваний тип файлу.',
  REQUIRED_FIELD: 'Це поле обов\'язкове.',
  MIN_LENGTH: 'Мінімальна довжина: {min} символів.',
  MAX_LENGTH: 'Максимальна довжина: {max} символів.',
  INVALID_PHONE: 'Невірний формат телефону.',
  INVALID_URL: 'Невірний формат URL.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Успішний вхід!',
  REGISTRATION_SUCCESS: 'Реєстрація успішна!',
  PROFILE_UPDATED: 'Профіль оновлено!',
  PASSWORD_CHANGED: 'Пароль змінено!',
  EMAIL_VERIFIED: 'Email підтверджено!',
  JOB_CREATED: 'Вакансію створено!',
  JOB_UPDATED: 'Вакансію оновлено!',
  APPLICATION_SUBMITTED: 'Заявку подано!',
  INTERVIEW_SCHEDULED: 'Інтерв\'ю заплановано!',
  SETTINGS_SAVED: 'Налаштування збережено!',
  FILE_UPLOADED: 'Файл завантажено!',
  DATA_SAVED: 'Дані збережено!',
  OPERATION_SUCCESS: 'Операція виконана успішно!'
} as const;

// Info messages
export const INFO_MESSAGES = {
  LOADING: 'Завантаження...',
  SAVING: 'Збереження...',
  UPLOADING: 'Завантаження файлу...',
  PROCESSING: 'Обробка...',
  NO_DATA: 'Дані не знайдено.',
  NO_RESULTS: 'Результатів не знайдено.',
  SELECT_ITEMS: 'Виберіть елементи для дії.',
  CONFIRM_ACTION: 'Підтвердіть дію.',
  CHANGES_NOT_SAVED: 'У вас є незбережені зміни.',
  SESSION_EXPIRED: 'Сесія закінчилася. Увійдіть знову.'
} as const;

// Warning messages
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'У вас є незбережені зміни.',
  DELETE_CONFIRMATION: 'Ви впевнені, що хочете видалити цей елемент?',
  LEAVE_PAGE: 'Ви впевнені, що хочете покинути сторінку?',
  DATA_LOSS: 'Це може призвести до втрати даних.',
  LIMITED_FEATURES: 'Деякі функції обмежені у безкоштовній версії.',
  UPGRADE_RECOMMENDED: 'Рекомендуємо оновити план для доступу до всіх функцій.'
} as const;

// Default values
export const DEFAULTS = {
  USER_AVATAR: '/images/default-avatar.png',
  COMPANY_LOGO: '/images/default-company-logo.png',
  JOB_IMAGE: '/images/default-job-image.png',
  THEME: 'system',
  LANGUAGE: 'uk',
  PAGE_SIZE: 10,
  CURRENCY: 'UAH',
  TIMEZONE: 'Europe/Kiev'
} as const;

// Feature flags
export const FEATURES = {
  AI_MATCHING: process.env.NEXT_PUBLIC_ENABLE_AI_MATCHING === 'true',
  PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  DARK_MODE: true,
  MULTI_LANGUAGE: false,
  FILE_UPLOAD: true,
  REAL_TIME_CHAT: false,
  VIDEO_INTERVIEWS: false,
  ANALYTICS: true,
  EXPORT_DATA: true
} as const;

// Industry options (Галузі)
export const INDUSTRY_OPTIONS = [
  'Інформаційні технології (IT)',
  'Маркетинг, реклама, PR',
  'Фінанси, бухгалтерія, аудит',
  'Банківська справа',
  'Продажі, дистрибуція, e-commerce',
  'Будівництво, архітектура, нерухомість',
  'Виробництво, промисловість',
  'Освіта, тренінги',
  'Логістика, транспорт',
  'Юриспруденція, право',
  'Охорона здоров\'я, фармацевтика',
  'Туризм, готельно-ресторанна справа (HoReCa)',
  'Державний сектор',
  'HR, рекрутинг',
  'Енергетика, екологія',
  'Медіа, комунікації',
  'ТОП-менеджери, керівники',
  'Інше'
] as const;

// Cities of Ukraine for autocomplete
export const CITIES_UA = [
  'Київ', 'Харків', 'Одеса', 'Дніпро', 'Донецьк', 'Запоріжжя', 
  'Львів', 'Кривий Ріг', 'Миколаїв', 'Маріуполь', 'Луганськ', 
  'Вінниця', 'Макіївка', 'Севастополь', 'Сімферополь', 'Херсон',
  'Полтава', 'Чернігів', 'Черкаси', 'Житомир', 'Суми', 'Хмельницький',
  'Чернівці', 'Горлівка', 'Рівне', 'Кам\'янське', 'Кропивницький',
  'Івано-Франківськ', 'Кременчук', 'Тернопіль', 'Луцьк', 'Біла Церква',
  'Краматорськ', 'Мелітополь', 'Ужгород', 'Бердянськ', 'Алчевськ',
  'Нікополь', 'Павлоград', 'Сєвєродонецьк', 'Слов\'янськ'
] as const;

// Countries list
export const COUNTRIES = [
  'Україна', 'Польща', 'Німеччина', 'Чехія', 'США', 'Канада', 
  'Велика Британія', 'Франція', 'Італія', 'Іспанія', 'Нідерланди',
  'Австрія', 'Швейцарія', 'Швеція', 'Данія', 'Норвегія', 'Фінляндія',
  'Португалія', 'Бельгія', 'Ірландія', 'Естонія', 'Латвія', 'Литва'
] as const;

// Top IT skills for autocomplete
export const TOP_SKILLS = [
  // Frontend
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js',
  'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Material UI', 'Bootstrap',
  'Redux', 'MobX', 'Webpack', 'Vite', 'jQuery',
  
  // Backend
  'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift',
  'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel',
  '.NET', 'ASP.NET', 'Ruby on Rails',
  
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL',
  'Oracle', 'Microsoft SQL Server', 'SQLite', 'Cassandra', 'DynamoDB',
  
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin', 'Ionic',
  
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD',
  'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible',
  'Linux', 'Nginx', 'Apache',
  
  // Tools & Practices
  'Git', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
  'JIRA', 'Figma', 'Adobe XD', 'Sketch',
  
  // Testing
  'Jest', 'Cypress', 'Selenium', 'JUnit', 'Mocha', 'Postman',
  
  // Other
  'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'Web3'
] as const;

// Max skills per job
export const MAX_SKILLS_PER_JOB = 15;
