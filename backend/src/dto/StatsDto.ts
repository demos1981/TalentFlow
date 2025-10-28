import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export enum StatsPeriod {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export enum StatsType {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  INTERVIEWS = 'interviews',
  PAYMENTS = 'payments',
  SUBSCRIPTIONS = 'subscriptions',
  REVENUE = 'revenue',
  PERFORMANCE = 'performance',
  SYSTEM = 'system'
}

export class GeneralStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class GeneralUserStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class JobStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class ApplicationStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class InterviewStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  result?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class PaymentStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  method?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class SubscriptionStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  plan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  billingCycle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class RevenueStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(100)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class GeneralPerformanceStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(200)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  endpoint?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class SystemStatsDto {
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

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
  @IsString()
  @MaxLength(200)
  component?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  metric?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;
}

export class StatsComparisonDto {
  @IsEnum(StatsType)
  type: StatsType;

  @IsEnum(StatsPeriod)
  period: StatsPeriod;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  groupBy?: string; // hour, day, week, month

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  filters?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  comparePeriods?: number; // number of periods to compare
}

export class StatsExportDto {
  @IsEnum(StatsType)
  type: StatsType;

  @IsEnum(StatsPeriod)
  period: StatsPeriod;

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
  @IsString()
  @MaxLength(1000)
  filters?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  metrics?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  format?: string; // csv, excel, json, pdf

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fileName?: string;
}

// Додаємо псевдоніми для сумісності
export class UserStatsDto extends GeneralUserStatsDto {}
export class PerformanceStatsDto extends GeneralPerformanceStatsDto {}


