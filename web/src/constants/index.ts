// App constants
export const APP_NAME = 'TalentMatch Pro';
export const APP_VERSION = '0.1.0';
export const APP_DESCRIPTION = 'AI-підсилена HR платформа для пошуку та найму талановитих спеціалістів';

// API constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
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

export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive'
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
  AI_MATCHING: import.meta.env.VITE_ENABLE_AI_MATCHING === 'true',
  PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  DARK_MODE: true,
  MULTI_LANGUAGE: false,
  FILE_UPLOAD: true,
  REAL_TIME_CHAT: false,
  VIDEO_INTERVIEWS: false,
  ANALYTICS: true,
  EXPORT_DATA: true
} as const;
