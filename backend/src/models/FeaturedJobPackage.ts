import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Company } from './Company';

export enum PackageType {
  FREE = 'free',           // Безкоштовний
  STARTER = 'starter',     // Стартовий
  BUSINESS = 'business',   // Бізнес
  PREMIUM = 'premium',     // Преміум
  ENTERPRISE = 'enterprise' // Ентерпрайз
}

export enum PackageStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  USED = 'used',
  CANCELLED = 'cancelled'
}

@Entity('featured_job_packages')
export class FeaturedJobPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column({
    type: 'enum',
    enum: PackageType,
    default: PackageType.FREE
  })
  packageType: PackageType;

  @Column()
  packageName: string;

  // Кількість гарячих вакансій в пакеті
  @Column({ type: 'int' })
  totalFeaturedJobs: number;

  // Використано гарячих вакансій
  @Column({ type: 'int', default: 0 })
  usedFeaturedJobs: number;

  // Залишилось гарячих вакансій
  @Column({ type: 'int' })
  remainingFeaturedJobs: number;

  // Ціна за одну гарячу вакансію
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerJob: number;

  // Загальна ціна без знижки
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  // Відсоток знижки (5%, 8%, 10%, 15%, 20%)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  // Сума знижки
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  // Фінальна ціна з знижкою
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalPrice: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.ACTIVE
  })
  status: PackageStatus;

  // Дата початку дії пакету
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  // Дата закінчення дії пакету (null для безстрокового)
  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: Date;

  // Дні дії пакету (30, 60, 90, 365 днів або lifetime)
  @Column({ type: 'int', nullable: true })
  validityDays?: number;

  // ID платежу
  @Column({ nullable: true })
  paymentId?: string;

  // Метадані (історія використання, деталі)
  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    purchaseDate?: Date;
    activatedJobIds?: string[];
    transactionId?: string;
    notes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

