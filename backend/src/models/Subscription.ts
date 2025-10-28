import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  planName: string;

  @Column({
    type: 'enum',
    enum: ['basic', 'premium', 'enterprise', 'custom'],
    default: 'basic'
  })
  planType: 'basic' | 'premium' | 'enterprise' | 'custom';

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: ['monthly', 'quarterly', 'yearly', 'custom', 'lifetime'],
    default: 'monthly'
  })
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'custom' | 'lifetime';

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'cancelled', 'expired', 'suspended'],
    default: 'active'
  })
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'suspended';

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextBillingDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt?: Date;

  @Column({ type: 'text', nullable: true })
  suspensionReason?: Date;

  @Column({ type: 'jsonb' })
  features: {
    maxJobs?: number;
    maxApplications?: number;
    aiMatching?: boolean;
    prioritySupport?: boolean;
    analytics?: boolean;
    customBranding?: boolean;
    apiAccess?: boolean;
  };

  @Column({ type: 'int', default: 0 })
  jobsPosted: number;

  @Column({ type: 'int', default: 0 })
  applicationsReceived: number;

  @Column({ type: 'int', default: 0 })
  aiMatches: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastBillingDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndDate?: Date;

  @Column({ default: false })
  isTrial: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
