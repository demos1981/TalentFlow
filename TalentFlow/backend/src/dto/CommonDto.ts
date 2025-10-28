import { IsUUID, IsOptional, IsString, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * DTO для валідації UUID параметрів
 */
export class UuidParamDto {
  @IsUUID(4, { message: 'ID має бути валідним UUID' })
  id: string;
}

/**
 * DTO для валідації jobId параметрів
 */
export class JobIdParamDto {
  @IsUUID(4, { message: 'Job ID має бути валідним UUID' })
  jobId: string;
}

/**
 * DTO для валідації candidateId параметрів
 */
export class CandidateIdParamDto {
  @IsUUID(4, { message: 'Candidate ID має бути валідним UUID' })
  candidateId: string;
}

/**
 * DTO для валідації пагінації
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Номер сторінки має бути числом' })
  @Min(1, { message: 'Номер сторінки має бути більше 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Ліміт має бути числом' })
  @Min(1, { message: 'Ліміт має бути більше 0' })
  @Max(100, { message: 'Ліміт не може бути більше 100' })
  limit?: number = 10;
}

/**
 * DTO для валідації пошукових параметрів
 */
export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Пошуковий запит має бути рядком' })
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString({ message: 'Локація має бути рядком' })
  @Transform(({ value }) => value?.trim())
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Досвід має бути числом' })
  @Min(0, { message: 'Досвід не може бути від\'ємним' })
  experience?: number;
}

/**
 * DTO для валідації фільтрів по датах
 */
export class DateFilterDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Дата початку має бути рядком' })
  startDate?: string;

  @IsOptional()
  @IsString({ message: 'Дата кінця має бути рядком' })
  endDate?: string;
}

/**
 * DTO для валідації статусів
 */
export class StatusFilterDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Статус має бути рядком' })
  status?: string;
}

/**
 * Enum для типів сортування
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

/**
 * DTO для валідації сортування
 */
export class SortDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Поле сортування має бути рядком' })
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'Порядок сортування має бути ASC або DESC' })
  sortOrder?: SortOrder = SortOrder.DESC;
}

/**
 * DTO для валідації параметрів аналітики
 */
export class AnalyticsQueryDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Період має бути рядком' })
  @Transform(({ value }) => value?.trim())
  period?: string = 'month';

  @IsOptional()
  @IsString({ message: 'Категорія має бути рядком' })
  @Transform(({ value }) => value?.trim())
  category?: string;

  @IsOptional()
  @IsString({ message: 'ID компанії має бути рядком' })
  @Transform(({ value }) => value?.trim())
  companyId?: string;
}


