import { IsString, IsOptional, IsEnum, IsNumber, IsUUID, IsDateString, IsInt, Min, Max, IsObject, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum KPIType {
  RECRUITMENT = 'recruitment',
  HIRING = 'hiring',
  RETENTION = 'retention',
  PRODUCTIVITY = 'productivity',
  QUALITY = 'quality',
  COST = 'cost',
  TIME = 'time',
  SATISFACTION = 'satisfaction',
  DIVERSITY = 'diversity',
  TRAINING = 'training',
  PERFORMANCE = 'performance',
  ENGAGEMENT = 'engagement'
}

export enum PerformanceMetric {
  TIME_TO_HIRE = 'time_to_hire',
  COST_PER_HIRE = 'cost_per_hire',
  QUALITY_OF_HIRE = 'quality_of_hire',
  SOURCE_EFFECTIVENESS = 'source_effectiveness',
  CANDIDATE_EXPERIENCE = 'candidate_experience',
  INTERVIEW_EFFICIENCY = 'interview_efficiency',
  OFFER_ACCEPTANCE_RATE = 'offer_acceptance_rate',
  EMPLOYEE_TURNOVER = 'employee_turnover',
  RETENTION_RATE = 'retention_rate',
  PRODUCTIVITY_INDEX = 'productivity_index',
  ENGAGEMENT_SCORE = 'engagement_score',
  TRAINING_COMPLETION = 'training_completion',
  PERFORMANCE_RATING = 'performance_rating',
  DIVERSITY_INDEX = 'diversity_index',
  RECRUITER_EFFICIENCY = 'recruiter_efficiency',
  PIPELINE_VELOCITY = 'pipeline_velocity',
  CONVERSION_RATE = 'conversion_rate',
  TIME_TO_FILL = 'time_to_fill',
  VACANCY_RATE = 'vacancy_rate',
  INTERNAL_MOBILITY = 'internal_mobility'
}

export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  SCATTER = 'scatter',
  RADAR = 'radar',
  GAUGE = 'gauge',
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap'
}

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml'
}

export enum MetricStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  BELOW_AVERAGE = 'below_average',
  POOR = 'poor'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export class CreateKPITargetDto {
  @IsEnum(KPIType)
  kpiType: KPIType;

  @IsEnum(PerformanceMetric)
  metric: PerformanceMetric;

  @IsNumber()
  @Min(0)
  targetValue: number;

  @IsString()
  unit: string;

  @IsEnum(TimePeriod)
  period: TimePeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    priority?: string;
    category?: string;
    [key: string]: any;
  };
}

export class UpdateKPITargetDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    priority?: string;
    category?: string;
    [key: string]: any;
  };
}

export class PerformanceSearchDto {
  @IsOptional()
  @IsEnum(KPIType)
  kpiType?: KPIType;

  @IsOptional()
  @IsEnum(PerformanceMetric)
  metric?: PerformanceMetric;

  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  compareWith?: string;

  @IsOptional()
  @IsEnum(MetricStatus)
  status?: MetricStatus;

  @IsOptional()
  @IsEnum(TrendDirection)
  trend?: TrendDirection;

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

export class UserPerformanceStatsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;
}

export class ChartDataDto {
  @IsEnum(ChartType)
  chartType: ChartType;

  @IsEnum(PerformanceMetric)
  metric: PerformanceMetric;

  @IsEnum(TimePeriod)
  period: TimePeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsString()
  groupBy?: string; // day, week, month, quarter, year

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filters?: string[];
}

export class ComparisonDataDto {
  @IsEnum(PerformanceMetric)
  metric: PerformanceMetric;

  @IsEnum(TimePeriod)
  period: TimePeriod;

  @IsDateString()
  currentStartDate: string;

  @IsDateString()
  currentEndDate: string;

  @IsDateString()
  compareStartDate: string;

  @IsDateString()
  compareEndDate: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;
}

export class TrendsDataDto {
  @IsEnum(PerformanceMetric)
  metric: PerformanceMetric;

  @IsEnum(TimePeriod)
  period: TimePeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  @Type(() => Number)
  forecastPeriods?: number = 6;
}

export class ExportReportDto {
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsOptional()
  @IsEnum(KPIType)
  kpiType?: KPIType;

  @IsOptional()
  @IsEnum(PerformanceMetric)
  metric?: PerformanceMetric;

  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeCharts?: string[];

  @IsOptional()
  @IsBoolean()
  includeRecommendations?: boolean = true;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class DetailedReportDto {
  @IsOptional()
  @IsEnum(KPIType)
  kpiType?: KPIType;

  @IsOptional()
  @IsEnum(PerformanceMetric)
  metric?: PerformanceMetric;

  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeMetrics?: string[];

  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeAnalysis?: boolean = true;

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
}


export class KPITargetParamDto {
  @IsUUID()
  targetId: string;
}

export class PerformanceMetricParamDto {
  @IsUUID()
  metricId: string;
}

export class BulkKPIActionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  targetIds: string[];

  @IsEnum(['update', 'delete', 'activate', 'deactivate', 'archive'])
  action: 'update' | 'delete' | 'activate' | 'deactivate' | 'archive';

  @IsOptional()
  @IsObject()
  actionData?: any;
}

export class PerformanceAlertDto {
  @IsEnum(PerformanceMetric)
  metric: PerformanceMetric;

  @IsNumber()
  @Min(0)
  threshold: number;

  @IsEnum(['above', 'below', 'equals'])
  condition: 'above' | 'below' | 'equals';

  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notifyUsers?: string[];

  @IsOptional()
  @IsObject()
  metadata?: {
    priority?: string;
    category?: string;
    [key: string]: any;
  };
}

// Додаємо PerformanceStatsDto для сумісності
export class PerformanceStatsDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}