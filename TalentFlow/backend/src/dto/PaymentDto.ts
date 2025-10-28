import { IsString, IsOptional, IsEnum, IsNumber, IsUUID, IsDateString, IsInt, Min, Max, IsObject, IsBoolean, IsEmail, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  EXPIRED = 'expired'
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEPA = 'sepa',
  WISE = 'wise',
  REVOLUT = 'revolut',
  OTHER = 'other'
}

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  PREMIUM = 'premium',
  FEATURED_JOB = 'featured_job',
  AI_MATCHING = 'ai_matching',
  RECRUITMENT_SERVICE = 'recruitment_service',
  CONSULTATION = 'consultation',
  TRAINING = 'training',
  CERTIFICATION = 'certification',
  OTHER = 'other'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  UAH = 'UAH',
  PLN = 'PLN',
  CZK = 'CZK',
  HUF = 'HUF',
  RON = 'RON',
  BGN = 'BGN',
  HRK = 'HRK',
  RSD = 'RSD',
  MKD = 'MKD',
  ALL = 'ALL',
  BAM = 'BAM',
  MNT = 'MNT',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  CHF = 'CHF',
  SEK = 'SEK',
  NOK = 'NOK',
  DKK = 'DKK',
  ISK = 'ISK',
  TRY = 'TRY',
  RUB = 'RUB',
  CNY = 'CNY',
  INR = 'INR',
  BRL = 'BRL',
  MXN = 'MXN',
  ZAR = 'ZAR',
  KRW = 'KRW',
  SGD = 'SGD',
  HKD = 'HKD',
  NZD = 'NZD',
  THB = 'THB',
  MYR = 'MYR',
  PHP = 'PHP',
  IDR = 'IDR',
  VND = 'VND'
}

export enum Country {
  US = 'US',
  CA = 'CA',
  GB = 'GB',
  DE = 'DE',
  FR = 'FR',
  IT = 'IT',
  ES = 'ES',
  NL = 'NL',
  BE = 'BE',
  AT = 'AT',
  CH = 'CH',
  SE = 'SE',
  NO = 'NO',
  DK = 'DK',
  FI = 'FI',
  IE = 'IE',
  PT = 'PT',
  GR = 'GR',
  PL = 'PL',
  CZ = 'CZ',
  HU = 'HU',
  RO = 'RO',
  BG = 'BG',
  HR = 'HR',
  SI = 'SI',
  SK = 'SK',
  LT = 'LT',
  LV = 'LV',
  EE = 'EE',
  UA = 'UA',
  BY = 'BY',
  MD = 'MD',
  RU = 'RU',
  TR = 'TR',
  JP = 'JP',
  CN = 'CN',
  IN = 'IN',
  AU = 'AU',
  NZ = 'NZ',
  BR = 'BR',
  MX = 'MX',
  AR = 'AR',
  CL = 'CL',
  CO = 'CO',
  PE = 'PE',
  ZA = 'ZA',
  EG = 'EG',
  NG = 'NG',
  KE = 'KE',
  MA = 'MA',
  SG = 'SG',
  HK = 'HK',
  KR = 'KR',
  TH = 'TH',
  MY = 'MY',
  PH = 'PH',
  ID = 'ID',
  VN = 'VN'
}

export class CreatePaymentDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    jobId?: string;
    companyId?: string;
    subscriptionId?: string;
    featureId?: string;
    [key: string]: any;
  };

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsEnum(Country)
  customerCountry?: Country;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringInterval?: string; // monthly, yearly, etc.

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @IsOptional()
  @IsObject()
  gatewayConfig?: {
    apiKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    [key: string]: any;
  };
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    jobId?: string;
    companyId?: string;
    subscriptionId?: string;
    featureId?: string;
    [key: string]: any;
  };

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsEnum(Country)
  customerCountry?: Country;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringInterval?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class PaymentSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(Country)
  customerCountry?: Country;

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
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class ProcessPaymentDto {
  @IsString()
  gatewayTransactionId: string;

  @IsOptional()
  @IsObject()
  gatewayResponse?: any;

  @IsOptional()
  @IsObject()
  gatewayMetadata?: any;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  processingFee?: number;

  @IsOptional()
  @IsEnum(Currency)
  processingFeeCurrency?: Currency;
}

export class RefundPaymentDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  notifyCustomer?: boolean;
}

export class CancelPaymentDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  notifyCustomer?: boolean;
}

export class CurrencyConversionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(Currency)
  fromCurrency: Currency;

  @IsEnum(Currency)
  toCurrency: Currency;

  @IsOptional()
  @IsDateString()
  date?: string; // For historical rates
}

export class PaymentGeneralStatsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(Currency)
  baseCurrency?: Currency;

  @IsOptional()
  @IsEnum(Country)
  country?: Country;
}


export class PaymentParamDto {
  @IsUUID()
  paymentId: string;
}

export class BulkPaymentActionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  paymentIds: string[];

  @IsEnum(['process', 'cancel', 'refund', 'mark_completed', 'mark_failed'])
  action: 'process' | 'cancel' | 'refund' | 'mark_completed' | 'mark_failed';

  @IsOptional()
  @IsObject()
  actionData?: any;
}

export class PaymentWebhookDto {
  @IsString()
  event: string;

  @IsObject()
  data: any;

  @IsString()
  signature: string;

  @IsString()
  timestamp: string;
}

// Додаємо PaymentStatsDto для сумісності
export class PaymentStatsDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(Currency)
  baseCurrency?: Currency;
}