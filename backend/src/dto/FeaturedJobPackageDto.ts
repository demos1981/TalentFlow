import { IsNumber, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

// DTO для купівлі пакету
export class PurchasePackageDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  validityDays?: number; // За замовчуванням 30 днів

  @IsOptional()
  @IsString()
  currency?: string; // За замовчуванням USD
}

// DTO для активації гарячої вакансії
export class ActivateFeaturedJobDto {
  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(90)
  featuredDays?: number; // На скільки днів зробити гарячою (за замовчуванням до закінчення пакету)
}

// DTO для деактивації
export class DeactivateFeaturedJobDto {
  @IsUUID()
  jobId: string;
}

// DTO для розрахунку ціни
export class CalculatePriceDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}

