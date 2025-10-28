import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsNotEmpty, IsUUID, IsDateString, IsNumber, Min, Max, IsObject } from 'class-validator';
import { PaymentStatus } from './PaymentDto';
import { Type } from 'class-transformer';

export enum SubscriptionType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

export enum SubscriptionPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  type: SubscriptionType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(BillingCycle)
  @IsNotEmpty()
  billingCycle: BillingCycle;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxJobs?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxApplications?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxInterviews?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxUsers?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean = false;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  trialDays?: number;

  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @IsString()
  @IsOptional()
  stripeProductId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionType)
  @IsOptional()
  type?: SubscriptionType;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxJobs?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxApplications?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxInterviews?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  maxUsers?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  trialDays?: number;

  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @IsString()
  @IsOptional()
  stripeProductId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SubscriptionSearchDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(SubscriptionType)
  @IsOptional()
  type?: SubscriptionType;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

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

  @IsString()
  @IsOptional()
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' = 'name';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

export class UserSubscriptionDto {
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  @IsNotEmpty()
  subscriptionId: string;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus = SubscriptionStatus.ACTIVE;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsDateString()
  @IsOptional()
  nextBillingDate?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus = PaymentStatus.PENDING;

  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SubscriptionUsageDto {
  @IsUUID('4')
  @IsNotEmpty()
  subscriptionId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  jobsUsed?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  applicationsUsed?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  interviewsUsed?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  usersUsed?: number;

  @IsDateString()
  @IsOptional()
  lastUpdated?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SubscriptionUpgradeDto {
  @IsUUID('4')
  @IsNotEmpty()
  currentSubscriptionId: string;

  @IsUUID('4')
  @IsNotEmpty()
  newSubscriptionId: string;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsBoolean()
  @IsOptional()
  prorate?: boolean = true;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class SubscriptionCancelDto {
  @IsUUID('4')
  @IsNotEmpty()
  subscriptionId: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsBoolean()
  @IsOptional()
  immediate?: boolean = false;

  @IsDateString()
  @IsOptional()
  cancelDate?: string;
}