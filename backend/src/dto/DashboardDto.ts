import { IsString, IsOptional, IsEnum, IsObject, IsArray, IsNumber, Min, Max, IsDateString } from 'class-validator';

export enum DashboardPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all'
}

export enum AnalyticsType {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  COMPANIES = 'companies',
  REVENUE = 'revenue',
  CONVERSIONS = 'conversions',
  ENGAGEMENT = 'engagement'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  DOUGHNUT = 'doughnut'
}

export class DashboardStatsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.MONTH;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

export class AnalyticsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsEnum(AnalyticsType)
  type: AnalyticsType;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.MONTH;

  @IsOptional()
  @IsObject()
  filters?: any;

  @IsOptional()
  @IsEnum(ChartType)
  chartType?: ChartType = ChartType.LINE;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  limit?: number = 30;
}

export class TopStatsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.MONTH;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class UserActivityDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.WEEK;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class RevenueStatsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.MONTH;

  @IsOptional()
  @IsString()
  currency?: string = 'USD';
}

export class ConversionStatsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.MONTH;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conversionTypes?: string[];
}

export class EngagementStatsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.WEEK;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  engagementTypes?: string[];
}


