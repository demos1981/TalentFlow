import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsNumber, IsUUID, Min, Max, IsNotEmpty, IsObject } from 'class-validator';
import { HelpType, HelpStatus, HelpPriority } from '../models/HelpArticle';
import { HelpCategoryStatus } from '../models/HelpCategory';

export class CreateHelpCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number = 0;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(HelpCategoryStatus)
  status?: HelpCategoryStatus = HelpCategoryStatus.ACTIVE;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateHelpCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(HelpCategoryStatus)
  status?: HelpCategoryStatus;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class CreateHelpArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(HelpType)
  type: HelpType;

  @IsOptional()
  @IsEnum(HelpStatus)
  status?: HelpStatus = HelpStatus.DRAFT;

  @IsOptional()
  @IsEnum(HelpPriority)
  priority?: HelpPriority = HelpPriority.MEDIUM;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] = [];

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number = 0;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateHelpArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(HelpType)
  type?: HelpType;

  @IsOptional()
  @IsEnum(HelpStatus)
  status?: HelpStatus;

  @IsOptional()
  @IsEnum(HelpPriority)
  priority?: HelpPriority;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class HelpSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(HelpType)
  type?: HelpType;

  @IsOptional()
  @IsEnum(HelpStatus)
  status?: HelpStatus;

  @IsOptional()
  @IsEnum(HelpPriority)
  priority?: HelpPriority;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsUUID()
  createdById?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class HelpRatingDto {
  @IsUUID()
  helpId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  wasHelpful?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class HelpStatsDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(HelpType)
  type?: HelpType;

  @IsOptional()
  @IsEnum(HelpStatus)
  status?: HelpStatus;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}


export class HelpCategoryParamDto {
  @IsUUID()
  categoryId: string;
}

export class HelpArticleParamDto {
  @IsUUID()
  articleId: string;
}