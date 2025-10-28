import { IsString, IsOptional, IsEnum, IsNumber, IsUUID, IsDateString, IsInt, Min, Max, IsObject, IsBoolean, IsArray, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export enum SearchType {
  JOBS = 'jobs',
  CANDIDATES = 'candidates',
  COMPANIES = 'companies',
  UNIVERSAL = 'universal'
}

export enum SearchSortBy {
  RELEVANCE = 'relevance',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  NAME = 'name',
  SALARY = 'salary',
  EXPERIENCE = 'experience',
  RATING = 'rating',
  POPULARITY = 'popularity'
}

export enum SearchSortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SearchFilterType {
  TEXT = 'text',
  SELECT = 'select',
  RANGE = 'range',
  MULTI_SELECT = 'multi_select',
  DATE_RANGE = 'date_range',
  BOOLEAN = 'boolean'
}

export class BaseSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

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
  @IsEnum(SearchSortBy)
  sortBy?: SearchSortBy = SearchSortBy.RELEVANCE;

  @IsOptional()
  @IsEnum(SearchSortOrder)
  sortOrder?: SearchSortOrder = SearchSortOrder.DESC;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsObject()
  filters?: {
    [key: string]: any;
  };

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeInactive?: boolean = false;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class JobSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEnum(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
  jobType?: string;

  @IsOptional()
  @IsEnum(['remote', 'hybrid', 'onsite'])
  workMode?: string;

  @IsOptional()
  @IsEnum(['entry', 'mid', 'senior', 'lead', 'executive'])
  experienceLevel?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRemote?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  allowRemote?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isUrgent?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsDateString()
  postedAfter?: string;

  @IsOptional()
  @IsDateString()
  postedBefore?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class CandidateSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  experienceMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  experienceMax?: number;

  @IsOptional()
  @IsString()
  currentCompany?: string;

  @IsOptional()
  @IsString()
  previousCompany?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isOpenToWork?: boolean;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workModes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  industries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departments?: string[];
}

export class CompanySearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['startup', 'small', 'medium', 'large', 'enterprise'])
  size?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  employeeCountMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  employeeCountMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  ratingMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  ratingMax?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isHiring?: boolean;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  perks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departments?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workModes?: string[];
}

export class UniversalSearchDto extends BaseSearchDto {
  @IsString()
  override search: string;

  @IsOptional()
  @IsArray()
  @IsEnum(SearchType, { each: true })
  types?: SearchType[] = [SearchType.JOBS, SearchType.CANDIDATES, SearchType.COMPANIES];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  override limit?: number = 10;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  override includeInactive?: boolean = false;

  @IsOptional()
  @IsString()
  override location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  override skills?: string[];

  @IsOptional()
  @IsObject()
  override filters?: {
    jobs?: Partial<JobSearchDto>;
    candidates?: Partial<CandidateSearchDto>;
    companies?: Partial<CompanySearchDto>;
  };

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  saveSearch?: boolean = true;

  @IsOptional()
  @IsString()
  searchId?: string;
}

export class SearchFilterDto {
  @IsString()
  field: string;

  @IsEnum(SearchFilterType)
  type: SearchFilterType;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean = false;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    [key: string]: any;
  };
}

export class SearchSuggestionDto {
  @IsString()
  text: string;

  @IsEnum(SearchType)
  type: SearchType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  @IsObject()
  metadata?: {
    [key: string]: any;
  };
}

export class SearchAnalyticsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

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

export class SearchHistoryDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

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

export class SearchStatsDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @IsOptional()
  @IsUUID()
  userId?: string;
}


export class SearchParamDto {
  @IsString()
  query: string;
}

export class SearchTypeParamDto {
  @IsEnum(SearchType)
  type: SearchType;
}

// Додаємо відсутні SearchDto класи
export class UserSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  department?: string;
}

export class InterviewSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @IsOptional()
  @IsUUID()
  interviewerId?: string;
}

export class ApplicationSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  candidateId?: string;
}

export class MessageSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class PaymentSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  method?: string;
}

export class PerformanceSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  period?: string;
}

export class ReportSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class NotificationSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class SubscriptionSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  plan?: string;
}

export class AutomationSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class AssessmentSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class EventSearchDto extends BaseSearchDto {
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

export class FileSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class HelpSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class WebhookSearchDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  event?: string;

  @IsOptional()
  @IsString()
  status?: string;
}