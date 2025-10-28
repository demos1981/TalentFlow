import { z } from 'zod';

// Базові схеми
export const emailSchema = z
  .string()
  .min(1, 'Email обов\'язковий')
  .email('Невірний формат email');

export const passwordSchema = z
  .string()
  .min(8, 'Пароль має бути не менше 8 символів')
  .max(128, 'Пароль має бути не більше 128 символів')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль має містити малу літеру, велику літеру та цифру');

export const nameSchema = z
  .string()
  .min(2, 'Ім\'я має бути не менше 2 символів')
  .max(50, 'Ім\'я має бути не більше 50 символів')
  .regex(/^[а-яА-Яa-zA-Z\s'-]+$/, 'Ім\'я може містити тільки літери, пробіли, дефіси та апострофи');

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Невірний формат телефону')
  .optional()
  .or(z.literal(''));

export const urlSchema = z
  .string()
  .url('Невірний формат URL')
  .optional()
  .or(z.literal(''));

// Схеми для авторизації
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль обов\'язковий'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Підтвердження пароля обов\'язкове'),
  first_name: nameSchema,
  last_name: nameSchema,
  user_type: z.enum(['candidate', 'employer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Поточний пароль обов\'язковий'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, 'Підтвердження нового пароля обов\'язкове'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Нові паролі не співпадають',
  path: ['confirmNewPassword'],
});

// Схеми для профілю
export const profileUpdateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  phone: phoneSchema,
  location: z.string().max(100, 'Локація має бути не більше 100 символів').optional().or(z.literal('')),
  bio: z.string().max(500, 'Біографія має бути не більше 500 символів').optional().or(z.literal('')),
});

export const companyProfileSchema = z.object({
  name: z.string().min(2, 'Назва компанії має бути не менше 2 символів').max(100, 'Назва компанії має бути не більше 100 символів'),
  description: z.string().min(10, 'Опис має бути не менше 10 символів').max(1000, 'Опис має бути не більше 1000 символів'),
  industry: z.string().min(1, 'Індустрія обов\'язкова'),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  location: z.string().min(1, 'Локація обов\'язкова').max(100, 'Локація має бути не більше 100 символів'),
  website: urlSchema,
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  employee_count: z.number().min(1).optional(),
});

// Схеми для вакансій
export const jobCreateSchema = z.object({
  title: z.string().min(5, 'Назва вакансії має бути не менше 5 символів').max(100, 'Назва вакансії має бути не більше 100 символів'),
  description: z.string().min(50, 'Опис має бути не менше 50 символів').max(5000, 'Опис має бути не більше 5000 символів'),
  location: z.string().min(1, 'Локація обов\'язкова').max(100, 'Локація має бути не більше 100 символів'),
  remote_work: z.enum(['none', 'partial', 'full']),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experience_level: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'executive']),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  currency: z.string().min(3).max(3).default('UAH'),
  skills: z.array(z.string().min(1)).min(1, 'Необхідно вказати хоча б один навик').max(20, 'Максимум 20 навиків'),
  benefits: z.array(z.string().min(1)).max(20, 'Максимум 20 переваг'),
  requirements: z.array(z.string().min(1)).min(1, 'Необхідно вказати хоча б одну вимогу').max(50, 'Максимум 50 вимог'),
  responsibilities: z.array(z.string().min(1)).min(1, 'Необхідно вказати хоча б одну відповідальність').max(50, 'Максимум 50 відповідальностей'),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
}).refine((data) => {
  if (data.salary_min && data.salary_max) {
    return data.salary_max >= data.salary_min;
  }
  return true;
}, {
  message: 'Максимальна зарплата має бути більше або дорівнювати мінімальній',
  path: ['salary_max'],
});

export const jobUpdateSchema = jobCreateSchema.partial();

// Схеми для кандидатів
export const candidateProfileSchema = z.object({
  headline: z.string().min(5, 'Заголовок має бути не менше 5 символів').max(100, 'Заголовок має бути не більше 100 символів'),
  summary: z.string().min(50, 'Резюме має бути не менше 50 символів').max(1000, 'Резюме має бути не більше 1000 символів'),
  experience_years: z.number().min(0).max(50),
  availability: z.enum(['immediate', '2-weeks', '1-month', '3-months', 'negotiable']),
  expected_salary_min: z.number().min(0).optional(),
  expected_salary_max: z.number().min(0).optional(),
  preferred_work_type: z.enum(['on-site', 'hybrid', 'remote']),
  portfolio_url: urlSchema,
  linkedin_url: urlSchema,
  github_url: urlSchema,
  resume_url: urlSchema,
}).refine((data) => {
  if (data.expected_salary_min && data.expected_salary_max) {
    return data.expected_salary_max >= data.expected_salary_min;
  }
  return true;
}, {
  message: 'Максимальна очікувана зарплата має бути більше або дорівнювати мінімальній',
  path: ['expected_salary_max'],
});

// Схеми для заявок
export const applicationSchema = z.object({
  cover_letter: z.string().min(100, 'Супровідний лист має бути не менше 100 символів').max(2000, 'Супровідний лист має бути не більше 2000 символів').optional(),
  expected_salary: z.number().min(0).optional(),
  resume_url: urlSchema.optional(),
});

// Схеми для інтерв'ю
export const interviewSchema = z.object({
  type: z.enum(['phone', 'video', 'on-site', 'technical', 'final']),
  scheduled_at: z.string().datetime('Невірний формат дати'),
  duration_minutes: z.number().min(15).max(480), // 15 хв - 8 годин
  location: z.string().max(200).optional(),
  video_url: urlSchema.optional(),
  notes: z.string().max(1000).optional(),
});

// Схеми для повідомлень
export const messageSchema = z.object({
  subject: z.string().min(1, 'Тема обов\'язкова').max(200, 'Тема має бути не більше 200 символів'),
  content: z.string().min(1, 'Текст повідомлення обов\'язковий').max(5000, 'Текст повідомлення має бути не більше 5000 символів'),
});

// Схеми для пошуку та фільтрів
export const searchFiltersSchema = z.object({
  location: z.string().optional(),
  experience_level: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'executive']).optional(),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  remote_work: z.enum(['none', 'partial', 'full']).optional(),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  skills: z.array(z.string()).optional(),
  industry: z.string().optional(),
  company_size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  date_posted: z.enum(['today', 'week', 'month', '3months']).optional(),
});

// Схеми для сортування
export const sortOptionsSchema = z.object({
  field: z.string().min(1),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Схеми для пагінації
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Схеми для файлів
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).default([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]),
});

// Схеми для налаштувань
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['uk', 'en']).default('uk'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }),
  privacy: z.object({
    profile_visibility: z.enum(['public', 'private', 'connections']).default('public'),
    show_salary: z.boolean().default(true),
    show_contact_info: z.boolean().default(false),
  }),
});

// Утиліти для валідації
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  value: any,
  fieldName: string
): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(e => e.path.includes(fieldName));
      return {
        isValid: false,
        error: fieldError?.message || 'Невірне значення',
      };
    }
    return {
      isValid: false,
      error: 'Невідома помилка валідації',
    };
  }
};

export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: any
): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(e => {
        const field = e.path[0] as string;
        if (field) {
          errors[field] = e.message;
        }
      });
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: { general: 'Невідома помилка валідації' },
    };
  }
};

// Експорт всіх схем
export const schemas = {
  // Auth
  login: loginSchema,
  register: registerSchema,
  changePassword: changePasswordSchema,
  
  // Profile
  profileUpdate: profileUpdateSchema,
  companyProfile: companyProfileSchema,
  candidateProfile: candidateProfileSchema,
  
  // Jobs
  jobCreate: jobCreateSchema,
  jobUpdate: jobUpdateSchema,
  
  // Applications & Interviews
  application: applicationSchema,
  interview: interviewSchema,
  
  // Communication
  message: messageSchema,
  
  // Search & Filters
  searchFilters: searchFiltersSchema,
  sortOptions: sortOptionsSchema,
  pagination: paginationSchema,
  
  // Files & Settings
  fileUpload: fileUploadSchema,
  settings: settingsSchema,
  
  // Utilities
  validateField,
  validateForm,
};
