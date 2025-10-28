import { IsString, IsOptional, IsEmail, IsBoolean, IsArray, IsObject, IsEnum, IsNumber, Min, Max, IsUUID, IsDateString, IsUrl, IsPhoneNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook'
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never'
}

export enum PrivacyLevel {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
  CUSTOM = 'custom'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

export enum Language {
  EN = 'en',
  UK = 'uk',
  RU = 'ru',
  DE = 'de',
  FR = 'fr',
  ES = 'es',
  IT = 'it',
  PL = 'pl'
}

export enum Timezone {
  UTC = 'UTC',
  EUROPE_KIEV = 'Europe/Kiev',
  EUROPE_LONDON = 'Europe/London',
  AMERICA_NEW_YORK = 'America/New_York',
  AMERICA_LOS_ANGELES = 'America/Los_Angeles',
  ASIA_TOKYO = 'Asia/Tokyo',
  ASIA_SHANGHAI = 'Asia/Shanghai'
}

export enum SecurityAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET = 'password_reset',
  PROFILE_UPDATE = 'profile_update',
  NOTIFICATION_SETTINGS_UPDATE = 'notification_settings_update',
  PRIVACY_SETTINGS_UPDATE = 'privacy_settings_update',
  APPEARANCE_SETTINGS_UPDATE = 'appearance_settings_update',
  SECURITY_SETTINGS_UPDATE = 'security_settings_update',
  SESSION_TERMINATED = 'session_terminated',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  DEVICE_ADDED = 'device_added',
  DEVICE_REMOVED = 'device_removed',
  IP_ADDED = 'ip_added',
  IP_REMOVED = 'ip_removed',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsEnum(Timezone)
  timezone?: Timezone;

  @IsOptional()
  @IsObject()
  preferences?: {
    [key: string]: any;
  };
}

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsObject()
  email?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    types: NotificationType[];
  };

  @IsOptional()
  @IsObject()
  push?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    types: NotificationType[];
  };

  @IsOptional()
  @IsObject()
  sms?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    types: NotificationType[];
  };

  @IsOptional()
  @IsObject()
  inApp?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    types: NotificationType[];
  };

  @IsOptional()
  @IsObject()
  webhook?: {
    enabled: boolean;
    url?: string;
    types: NotificationType[];
  };

  @IsOptional()
  @IsObject()
  jobAlerts?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    keywords: string[];
    locations: string[];
    salaryMin?: number;
    salaryMax?: number;
    jobTypes: string[];
    workModes: string[];
  };

  @IsOptional()
  @IsObject()
  candidateAlerts?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    skills: string[];
    locations: string[];
    experienceMin?: number;
    experienceMax?: number;
  };

  @IsOptional()
  @IsObject()
  companyAlerts?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    industries: string[];
    locations: string[];
    sizes: string[];
  };

  @IsOptional()
  @IsObject()
  securityAlerts?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    loginAlerts: boolean;
    deviceAlerts: boolean;
    locationAlerts: boolean;
    passwordChangeAlerts: boolean;
    suspiciousActivityAlerts: boolean;
  };

  @IsOptional()
  @IsObject()
  marketingAlerts?: {
    enabled: boolean;
    frequency: NotificationFrequency;
    newsletter: boolean;
    productUpdates: boolean;
    promotions: boolean;
    events: boolean;
  };
}

export class UpdatePrivacySettingsDto {
  @IsOptional()
  @IsEnum(PrivacyLevel)
  profileVisibility?: PrivacyLevel;

  @IsOptional()
  @IsEnum(PrivacyLevel)
  contactInfoVisibility?: PrivacyLevel;

  @IsOptional()
  @IsEnum(PrivacyLevel)
  skillsVisibility?: PrivacyLevel;

  @IsOptional()
  @IsEnum(PrivacyLevel)
  experienceVisibility?: PrivacyLevel;

  @IsOptional()
  @IsEnum(PrivacyLevel)
  educationVisibility?: PrivacyLevel;

  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;

  @IsOptional()
  @IsBoolean()
  showLastSeen?: boolean;

  @IsOptional()
  @IsBoolean()
  showLocation?: boolean;

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;

  @IsOptional()
  @IsBoolean()
  showWebsite?: boolean;

  @IsOptional()
  @IsBoolean()
  showSocialLinks?: boolean;

  @IsOptional()
  @IsBoolean()
  allowMessagesFromStrangers?: boolean;

  @IsOptional()
  @IsBoolean()
  allowProfileViews?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSearchEngines?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blockedUsers?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictedUsers?: string[];

  @IsOptional()
  @IsObject()
  customPrivacy?: {
    [key: string]: PrivacyLevel;
  };
}

export class UpdateAppearanceSettingsDto {
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsEnum(Timezone)
  timezone?: Timezone;

  @IsOptional()
  @IsString()
  customTheme?: string;

  @IsOptional()
  @IsObject()
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    border?: string;
  };

  @IsOptional()
  @IsObject()
  fonts?: {
    family?: string;
    size?: number;
    weight?: string;
  };

  @IsOptional()
  @IsObject()
  layout?: {
    sidebar?: 'left' | 'right' | 'hidden';
    header?: 'fixed' | 'static';
    footer?: 'visible' | 'hidden';
    density?: 'compact' | 'comfortable' | 'spacious';
  };

  @IsOptional()
  @IsObject()
  animations?: {
    enabled?: boolean;
    duration?: number;
    easing?: string;
  };

  @IsOptional()
  @IsObject()
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
  };
}

export class SettingsUpdateSecuritySettingsDto {
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  loginAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  deviceAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  locationAlerts?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trustedDevices?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trustedIPs?: string[];

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(480)
  sessionTimeout?: number; // in minutes

  @IsOptional()
  @IsBoolean()
  requirePasswordChange?: boolean;

  @IsOptional()
  @IsDateString()
  passwordExpiryDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  passwordExpiryDays?: number;

  @IsOptional()
  @IsBoolean()
  requireStrongPassword?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxLoginAttempts?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  lockoutDuration?: number; // in minutes

  @IsOptional()
  @IsBoolean()
  allowConcurrentSessions?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxConcurrentSessions?: number;

  @IsOptional()
  @IsObject()
  passwordPolicy?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    preventReuse?: number; // number of previous passwords to prevent reuse
  };
}

export class SettingsChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @Min(8)
  newPassword: string;

  @IsString()
  confirmPassword: string;
}

export class SecurityLogSearchDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(SecurityAction)
  action?: SecurityAction;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  success?: boolean;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class SessionManagementDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active?: boolean;

  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'lastActivity';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class TerminateSessionDto {
  @IsUUID()
  sessionId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class TerminateAllSessionsDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  keepCurrent?: boolean = true;
}

export class AddTrustedDeviceDto {
  @IsString()
  deviceName: string;

  @IsString()
  deviceType: string;

  @IsString()
  deviceId: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class RemoveTrustedDeviceDto {
  @IsUUID()
  deviceId: string;
}

export class AddTrustedIPDto {
  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class RemoveTrustedIPDto {
  @IsUUID()
  ipId: string;
}


export class SessionIdParamDto {
  @IsUUID()
  sessionId: string;
}

export class DeviceIdParamDto {
  @IsUUID()
  deviceId: string;
}

export class IPIdParamDto {
  @IsUUID()
  ipId: string;
}

// Додаємо псевдоніми для сумісності
export class ChangePasswordDto extends SettingsChangePasswordDto {}
export class UpdateSecuritySettingsDto extends SettingsUpdateSecuritySettingsDto {}

// Додаємо UpdateSettingsDto для сумісності
export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  profile?: any;

  @IsOptional()
  @IsString()
  notifications?: any;

  @IsOptional()
  @IsString()
  privacy?: any;

  @IsOptional()
  @IsString()
  appearance?: any;

  @IsOptional()
  @IsString()
  security?: any;
}