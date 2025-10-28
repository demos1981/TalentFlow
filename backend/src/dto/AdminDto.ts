import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended'
}

export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended'
}

export enum SystemStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  MAINTENANCE = 'maintenance'
}

export class UpdateUserStatusDto {
  @IsUUID()
  userId: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class ToggleUserBlockDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsDateString()
  blockUntil?: string;

  @IsOptional()
  @IsBoolean()
  permanent?: boolean;
}

export class VerifyCompanyDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  verificationNotes: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  verifiedBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  additionalInfo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  documents?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  verificationLevel?: string;
}

export class SystemLogsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  level?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  action?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  userId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number;
}

export class ErrorStatsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  errorType?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  groupBy?: string; // hour, day, week, month
}

export class AdminPerformanceStatsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  endpoint?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  groupBy?: string; // hour, day, week, month

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];
}

export class CreateBackupDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  name: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tables?: string[];

  @IsOptional()
  @IsBoolean()
  includeFiles?: boolean;

  @IsOptional()
  @IsBoolean()
  includeLogs?: boolean;

  @IsOptional()
  @IsBoolean()
  compress?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  storageLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class RestoreBackupDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason: string;

  @IsOptional()
  @IsBoolean()
  includeFiles?: boolean;

  @IsOptional()
  @IsBoolean()
  includeLogs?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tables?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  createBackupBeforeRestore?: boolean;
}

export class UpdateSecuritySettingsDto {
  @IsOptional()
  @IsBoolean()
  twoFactorAuthRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  passwordExpiryEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(365)
  passwordExpiryDays?: number;

  @IsOptional()
  @IsBoolean()
  loginAttemptsEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(10)
  maxLoginAttempts?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  lockoutDuration?: number; // minutes

  @IsOptional()
  @IsBoolean()
  ipWhitelistEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(45, { each: true })
  allowedIPs?: string[];

  @IsOptional()
  @IsBoolean()
  sessionManagementEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1440)
  sessionTimeout?: number; // minutes

  @IsOptional()
  @IsBoolean()
  auditLoggingEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  dataEncryptionEnabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  encryptionKey?: string;

  @IsOptional()
  @IsBoolean()
  sslRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  corsEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  allowedOrigins?: string[];
}

export class SystemMaintenanceDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  notifyUsers?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  maintenanceMessage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  affectedServices?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class AdminUserSearchDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  query?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}


export class BlockUserDto {
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsBoolean()
  @IsOptional()
  blockMessages?: boolean = true;

  @IsBoolean()
  @IsOptional()
  blockCalls?: boolean = true;
}
