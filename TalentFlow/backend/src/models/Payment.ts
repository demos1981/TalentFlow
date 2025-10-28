import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { Job } from './Job';

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

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, company => company.payments)
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column({ nullable: true })
  jobId?: string;

  @ManyToOne(() => Job, job => job.payments)
  @JoinColumn({ name: 'jobId' })
  job?: Job;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD
  })
  currency: Currency;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.OTHER
  })
  type: PaymentType;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.STRIPE
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  gatewayTransactionId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    jobId?: string;
    companyId?: string;
    subscriptionId?: string;
    featureId?: string;
    [key: string]: any;
  };

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column({
    type: 'enum',
    enum: Country,
    nullable: true
  })
  customerCountry?: Country;

  @Column({ type: 'text', nullable: true })
  billingAddress?: string;

  @Column({ type: 'text', nullable: true })
  shippingAddress?: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringInterval?: string; // monthly, yearly, etc.

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true })
  paymentGateway?: string;

  @Column({ type: 'jsonb', nullable: true })
  gatewayConfig?: {
    apiKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse?: any;

  @Column({ type: 'jsonb', nullable: true })
  gatewayMetadata?: any;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt?: Date;

  @Column({ type: 'text', nullable: true })
  refundReason?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount?: number;

  @Column({ type: 'text', nullable: true })
  refundNotes?: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancelReason?: string;

  @Column({ type: 'text', nullable: true })
  cancelNotes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  processingFee?: number;

  @Column({
    type: 'enum',
    enum: Currency,
    nullable: true
  })
  processingFeeCurrency?: Currency;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  exchangeRate?: number;

  @Column({
    type: 'enum',
    enum: Currency,
    nullable: true
  })
  originalCurrency?: Currency;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalAmount?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}