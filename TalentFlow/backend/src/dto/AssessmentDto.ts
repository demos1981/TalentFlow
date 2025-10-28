import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, IsUUID, IsEnum, Min, Max, IsDateString } from 'class-validator';

// Assessment status enum
export enum AssessmentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

// Assessment type enum
export enum AssessmentType {
  SKILLS = 'skills',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  COGNITIVE = 'cognitive',
  LANGUAGE = 'language',
  CUSTOM = 'custom'
}

// DTO for creating assessment
export class CreateAssessmentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AssessmentType)
  type: AssessmentType;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  timeLimit?: number; // in minutes

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number; // percentage

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  questions?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

// DTO for updating assessment
export class UpdateAssessmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  questions?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

// DTO for assessment search/filters
export class AssessmentSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}

// DTO for completing assessment
export class CompleteAssessmentDto {
  @IsArray()
  answers: any[];

  @IsNumber()
  @Min(0)
  score: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

// DTO for assessment response
export class AssessmentResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AssessmentType)
  type: AssessmentType;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  questions?: any[];

  @IsOptional()
  @IsArray()
  answers?: any[];

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  percentage?: number;

  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

// DTO for assessment statistics
export class AssessmentStatsDto {
  @IsNumber()
  total: number;

  @IsNumber()
  active: number;

  @IsNumber()
  completed: number;

  @IsNumber()
  passed: number;

  @IsNumber()
  failed: number;
}

// DTO for user assessments response
export class UserAssessmentsResponseDto {
  @IsArray()
  assessments: AssessmentResponseDto[];

  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  totalPages: number;
}

// DTO for job assessments response
export class JobAssessmentsResponseDto {
  @IsArray()
  assessments: AssessmentResponseDto[];

  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  totalPages: number;
}

// DTO for assessment list response
export class AssessmentListResponseDto {
  @IsArray()
  assessments: AssessmentResponseDto[];

  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  totalPages: number;
}