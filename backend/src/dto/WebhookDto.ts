import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsNotEmpty, IsUUID, IsUrl, IsNumber, Min, Max, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { WebhookStatus, WebhookMethod } from '../models/Webhook';

export class CreateWebhookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsEnum(WebhookMethod)
  @IsOptional()
  method?: WebhookMethod = WebhookMethod.POST;

  @IsEnum(WebhookStatus)
  @IsOptional()
  status?: WebhookStatus = WebhookStatus.ACTIVE;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  events: string[];

  @IsString()
  @IsOptional()
  secret?: string;

  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsString()
  @IsOptional()
  transformation?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  maxRetries?: number = 3;

  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(30000)
  @Type(() => Number)
  timeout?: number = 5000;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateWebhookDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsEnum(WebhookMethod)
  @IsOptional()
  method?: WebhookMethod;

  @IsEnum(WebhookStatus)
  @IsOptional()
  status?: WebhookStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  events?: string[];

  @IsString()
  @IsOptional()
  secret?: string;

  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsString()
  @IsOptional()
  transformation?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  maxRetries?: number;

  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(30000)
  @Type(() => Number)
  timeout?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class WebhookSearchDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  event?: string;

  @IsEnum(WebhookStatus)
  @IsOptional()
  status?: WebhookStatus;

  @IsEnum(WebhookMethod)
  @IsOptional()
  method?: WebhookMethod;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}

export class WebhookPayloadDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;

  @IsString()
  @IsOptional()
  requestId?: string;

  @IsString()
  @IsOptional()
  timestamp?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class TestWebhookDto {
  @IsUUID('4')
  @IsNotEmpty()
  webhookId: string;

  @IsString()
  @IsOptional()
  event?: string;

  @IsObject()
  @IsOptional()
  testPayload?: Record<string, any>;
}

export class WebhookLogDto {
  @IsUUID('4')
  @IsNotEmpty()
  webhookId: string;

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsString()
  @IsOptional()
  requestId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  responseTime?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  statusCode?: number;

  @IsString()
  @IsOptional()
  requestPayload?: string;

  @IsString()
  @IsOptional()
  responseBody?: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}