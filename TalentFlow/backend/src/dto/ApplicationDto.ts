import { IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum ApplicationSource {
  WEBSITE = 'website',
  LINKEDIN = 'linkedin',
  INDEED = 'indeed',
  GLASSDOOR = 'glassdoor',
  REFERRAL = 'referral',
  DIRECT = 'direct',
  OTHER = 'other'
}

export class CreateApplicationDto {
  @IsUUID()
  jobId: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  coverLetter: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  githubUrl?: string;

  @IsOptional()
  @IsEnum(ApplicationSource)
  source?: ApplicationSource;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  expectedSalary?: number;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referralSource?: string;
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  coverLetter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  githubUrl?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  expectedSalary?: number;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referralSource?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  employerNotes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  rating?: number;
}

export class ApplicationSearchDto {
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsUUID()
  employerId?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsEnum(ApplicationSource)
  source?: ApplicationSource;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
