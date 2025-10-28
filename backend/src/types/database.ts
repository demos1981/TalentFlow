// Database types and enums

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived'
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}

export enum WorkLocation {
  REMOTE = 'remote',
  OFFICE = 'office',
  HYBRID = 'hybrid'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  JOB_POSTING = 'job_posting',
  PREMIUM_FEATURES = 'premium_features',
  AD_BOOST = 'ad_boost'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial'
}

export enum SubscriptionPlan {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export enum CompanySize {
  STARTUP = '1-10',
  SMALL = '11-50',
  MEDIUM = '51-200',
  LARGE = '201-1000',
  ENTERPRISE = '1000+'
}

export enum Experience {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  PRINCIPAL = 'principal'
}

export enum EducationLevel {
  HIGH_SCHOOL = 'high_school',
  ASSOCIATE = 'associate',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  PROFESSIONAL = 'professional'
}

export enum NotificationType {
  APPLICATION = 'application',
  INTERVIEW = 'interview',
  MESSAGE = 'message',
  PAYMENT = 'payment',
  SYSTEM = 'system',
  PROMOTION = 'promotion'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum FileType {
  RESUME = 'resume',
  COVER_LETTER = 'cover_letter',
  PORTFOLIO = 'portfolio',
  CERTIFICATE = 'certificate',
  PHOTO = 'photo',
  DOCUMENT = 'document'
}

export enum AssessmentType {
  TECHNICAL = 'technical',
  PERSONALITY = 'personality',
  COGNITIVE = 'cognitive',
  LANGUAGE = 'language',
  CUSTOM = 'custom'
}

export enum AssessmentDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum Currency {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR'
}

export enum Language {
  UK = 'uk',
  EN = 'en',
  RU = 'ru'
}

export enum Timezone {
  KIEV = 'Europe/Kiev',
  UTC = 'UTC',
  NEW_YORK = 'America/New_York',
  LONDON = 'Europe/London'
}
