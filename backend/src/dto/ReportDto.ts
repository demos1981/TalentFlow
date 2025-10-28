import { IsString, IsOptional, IsEnum, IsNumber, IsUUID, IsDateString, IsInt, Min, Max, IsObject, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReportType {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  INTERVIEWS = 'interviews',
  PAYMENTS = 'payments',
  SUBSCRIPTIONS = 'subscriptions',
  ANALYTICS = 'analytics',
  PERFORMANCE = 'performance',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
  HTML = 'html'
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum ReportCategory {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  INTERVIEWS = 'interviews',
  PAYMENTS = 'payments',
  SUBSCRIPTIONS = 'subscriptions',
  ANALYTICS = 'analytics',
  PERFORMANCE = 'performance',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export enum ReportPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export class GenerateReportDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsOptional()
  @IsEnum(ReportCategory)
  category?: ReportCategory;

  @IsOptional()
  @IsEnum(ReportPriority)
  priority?: ReportPriority;

  @IsOptional()
  @IsObject()
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    userIds?: string[];
    companyIds?: string[];
    jobIds?: string[];
    status?: string[];
    [key: string]: any;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsObject()
  parameters?: {
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeCharts?: boolean;
    includeSummary?: boolean;
    [key: string]: any;
  };

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsBoolean()
  isScheduled?: boolean;

  @IsOptional()
  @IsString()
  scheduleFrequency?: ScheduleFrequency;

  @IsOptional()
  @IsDateString()
  scheduleDate?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    notes?: string;
    [key: string]: any;
  };
}

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fileSize?: number;

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    notes?: string;
    [key: string]: any;
  };
}

export class ReportSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportCategory)
  category?: ReportCategory;

  @IsOptional()
  @IsEnum(ReportPriority)
  priority?: ReportPriority;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsUUID()
  generatedBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class ReportTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsOptional()
  @IsEnum(ReportCategory)
  category?: ReportCategory;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsObject()
  defaultFilters?: {
    dateFrom?: string;
    dateTo?: string;
    status?: string[];
    [key: string]: any;
  };

  @IsOptional()
  @IsObject()
  defaultParameters?: {
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeCharts?: boolean;
    includeSummary?: boolean;
    [key: string]: any;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    version?: string;
    [key: string]: any;
  };
}

export class ReportScheduleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  reportId: string;

  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @IsOptional()
  @IsString()
  cronExpression?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];

  @IsOptional()
  @IsObject()
  parameters?: {
    emailSubject?: string;
    emailBody?: string;
    includeCharts?: boolean;
    [key: string]: any;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    notes?: string;
    [key: string]: any;
  };
}

export class ReportExportDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsOptional()
  @IsObject()
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    userIds?: string[];
    companyIds?: string[];
    jobIds?: string[];
    status?: string[];
    [key: string]: any;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsObject()
  parameters?: {
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeCharts?: boolean;
    includeSummary?: boolean;
    [key: string]: any;
  };
}

export class ReportAnalyticsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  groupBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 100;
}


export class ReportParamDto {
  @IsUUID()
  reportId: string;
}

export class TemplateParamDto {
  @IsUUID()
  templateId: string;
}

export class ScheduleParamDto {
  @IsUUID()
  scheduleId: string;
}

export class BulkReportActionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  reportIds: string[];

  @IsEnum(['delete', 'export', 'schedule', 'cancel'])
  action: 'delete' | 'export' | 'schedule' | 'cancel';

  @IsOptional()
  @IsObject()
  actionData?: any;
}

export class ReportPreviewDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsObject()
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    userIds?: string[];
    companyIds?: string[];
    jobIds?: string[];
    status?: string[];
    [key: string]: any;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsObject()
  parameters?: {
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeCharts?: boolean;
    includeSummary?: boolean;
    [key: string]: any;
  };

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
}