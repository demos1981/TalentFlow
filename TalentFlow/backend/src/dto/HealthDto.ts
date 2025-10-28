import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsUUID, Min, Max, IsNotEmpty, IsObject, IsBoolean } from 'class-validator';

export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNHEALTHY = 'unhealthy',
  DOWN = 'down',
  UP = 'up',
  NOT_READY = 'not_ready',
  DEAD = 'dead'
}

export enum ServiceType {
  DATABASE = 'database',
  EMAIL = 'email',
  STORAGE = 'storage',
  PAYMENT = 'payment',
  API = 'api',
  CACHE = 'cache',
  QUEUE = 'queue',
  EXTERNAL = 'external'
}

export class HealthCheckDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsEnum(HealthStatus)
  status: HealthStatus;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @Min(0)
  responseTime: number;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class DatabaseHealthDto {
  @IsEnum(HealthStatus)
  status: HealthStatus;

  @IsNumber()
  @Min(0)
  responseTime: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  connectionPool: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  cpuUsage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  memoryUsage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  diskUsage: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;
}

export class ExternalServiceHealthDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsEnum(HealthStatus)
  status: HealthStatus;

  @IsNumber()
  @Min(0)
  responseTime: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  availability: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  lastCheck: string;

  @IsOptional()
  @IsString()
  lastSuccess?: string;

  @IsOptional()
  @IsString()
  lastFailure?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  successRate: number;
}

export class SystemLoadDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  cpuUsage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  memoryUsage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  diskUsage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  networkUsage: number;

  @IsNumber()
  @Min(0)
  loadAverage: number;

  @IsNumber()
  @Min(0)
  activeConnections: number;

  @IsNumber()
  @Min(0)
  queueLength: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;
}

export class ReadinessDto {
  @IsEnum(HealthStatus)
  status: HealthStatus;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsString({ each: true })
  dependencies: string[];

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;
}

export class LivenessDto {
  @IsEnum(HealthStatus)
  status: HealthStatus;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  build?: string;
}

export class DetailedHealthDto {
  @IsEnum(HealthStatus)
  overallStatus: HealthStatus;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsNumber()
  @Min(0)
  uptime: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  healthScore: number;
}

export class MetricsDto {
  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  groupBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];
}

export class HealthHistoryDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(168) // 7 days
  hours?: number = 24;
}

export class HealthTrendsDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30) // 30 days
  days?: number = 7;
}


export class ServiceParamDto {
  @IsString()
  @IsNotEmpty()
  service: string;
}