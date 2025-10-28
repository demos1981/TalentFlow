import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsEnum, Min, Max, IsUUID, IsNumberString } from 'class-validator';

// Підтримувані мови
export enum SupportedLanguage {
  EN = 'en',
  PT = 'pt',
  FR = 'fr',
  UK = 'uk',
  RU = 'ru',
  DE = 'de',
  PL = 'pl',
  CS = 'cs'
}

// DTO для фільтрів AI Matching
export class AiMatchingFiltersDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  minMatchScore?: number;

  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsEnum(SupportedLanguage)
  language?: SupportedLanguage;
}

// DTO для генерації рекомендацій
export class GenerateRecommendationsDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsEnum(SupportedLanguage)
  language?: SupportedLanguage;
}

// DTO для масової генерації рекомендацій
export class BulkGenerateRecommendationsDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  candidateIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  jobIds?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsEnum(SupportedLanguage)
  language?: SupportedLanguage;
}

// DTO для оновлення рекомендації
export class UpdateRecommendationDto {
  @IsOptional()
  @IsString()
  isViewed?: boolean;

  @IsOptional()
  @IsString()
  isContacted?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  feedbackRating?: number;

  @IsOptional()
  @IsString()
  feedbackComment?: string;
}

// DTO для пошуку рекомендацій
export class AiMatchingSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsEnum(SupportedLanguage)
  language?: SupportedLanguage;
}

// DTO для статистики AI Matching
export class AiMatchingStatsDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsEnum(SupportedLanguage)
  language?: SupportedLanguage;
}

// DTO для профілю кандидата
export class AIMatchingCandidateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}

// DTO для вимог до роботи
export class JobRequirementsDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  company?: string;
}

// DTO для результату матчингу
export class MatchingResultDto {
  @IsString()
  candidateId: string;

  @IsString()
  jobId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  matchScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  skillsScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  experienceScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  locationScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  salaryScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number;

  @IsString()
  reason: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @IsNumber()
  processingTime: number;
}

// DTO для відповіді AI Matching
export class AiMatchingResponseDto {
  @IsArray()
  recommendations: any[];

  @IsOptional()
  stats?: any;

  @IsOptional()
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };

  @IsOptional()
  filters?: AiMatchingFiltersDto;
}

// DTO для статистики AI Matching
export class AiMatchingStatsResponseDto {
  @IsNumber()
  totalMatches: number;

  @IsNumber()
  highQualityMatches: number;

  @IsNumber()
  averageMatchScore: number;

  @IsNumber()
  candidatesMatched: number;

  @IsNumber()
  jobsMatched: number;

  @IsString()
  lastUpdated: string;

  @IsNumber()
  aiAccuracy: number;

  @IsNumber()
  processingTime: number;

  @IsOptional()
  matchScoreDistribution?: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };

  @IsOptional()
  topSkills?: Array<{
    skill: string;
    count: number;
    averageScore: number;
  }>;

  @IsOptional()
  topLocations?: Array<{
    location: string;
    count: number;
    averageScore: number;
  }>;
}

// DTO для перевірки здоров'я AI
export class AIHealthDto {
  @IsString()
  isHealthy: boolean;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  error?: string;

  @IsString()
  openaiStatus: string;
}

// DTO для перевірки здоров'я сервісу
export class ServiceHealthDto {
  @IsString()
  isHealthy: boolean;

  @IsOptional()
  services?: {
    database: boolean;
    openai: boolean;
  };

  @IsString()
  timestamp: string;
}

// DTO для підтримуваних мов
export class SupportedLanguagesDto {
  @IsArray()
  @IsString({ each: true })
  languages: string[];
}