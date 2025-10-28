import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3'
}

export enum EndpointMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export enum EndpointCategory {
  AUTH = 'auth',
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  INTERVIEWS = 'interviews',
  ASSESSMENTS = 'assessments',
  PAYMENTS = 'payments',
  SUBSCRIPTIONS = 'subscriptions',
  COMPANIES = 'companies',
  CANDIDATES = 'candidates',
  NOTIFICATIONS = 'notifications',
  MESSAGES = 'messages',
  FILES = 'files',
  SETTINGS = 'settings',
  HELP = 'help',
  INTEGRATIONS = 'integrations',
  AUTOMATION = 'automation',
  EVENTS = 'events',
  WEBHOOKS = 'webhooks',
  REPORTS = 'reports',
  ADMIN = 'admin',
  HEALTH = 'health',
  STATS = 'stats',
  SEARCH = 'search',
  DASHBOARD = 'dashboard',
  ANALYTICS = 'analytics',
  PERFORMANCE = 'performance',
  AI_MATCHING = 'ai_matching'
}

export class ApiInfoDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(200)
  version: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsString()
  @MaxLength(200)
  baseUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  license?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  termsOfService?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  privacyPolicy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  servers?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  tags?: string[];
}

export class ApiStatsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  period?: string;

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
  endpoint?: string;

  @IsOptional()
  @IsEnum(EndpointMethod)
  method?: EndpointMethod;

  @IsOptional()
  @IsEnum(EndpointCategory)
  category?: EndpointCategory;

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

export class EndpointInfoDto {
  @IsString()
  @MaxLength(200)
  path: string;

  @IsEnum(EndpointMethod)
  method: EndpointMethod;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  summary: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string;

  @IsEnum(EndpointCategory)
  category: EndpointCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  parameters?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  requestBody?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  responses?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  examples?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isDeprecated?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  deprecationDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  replacementEndpoint?: string;
}

export class CodeExampleDto {
  @IsString()
  @MaxLength(200)
  language: string;

  @IsString()
  @MaxLength(200)
  framework: string;

  @IsString()
  @MaxLength(200)
  endpoint: string;

  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  version?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsDateString()
  lastUpdated?: string;
}

export class ErrorCodeDto {
  @IsString()
  @MaxLength(100)
  code: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  message: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  severity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  possibleCauses?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  solutions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  examples?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  relatedErrors?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isDeprecated?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  deprecationDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  replacementCode?: string;
}

export class ApiDocumentationDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  version?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  featuredImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  relatedDocs?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class ApiChangelogDto {
  @IsString()
  @MaxLength(200)
  version: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string; // major, minor, patch, breaking

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  improvements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  bugFixes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  breakingChanges?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  deprecations?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}




