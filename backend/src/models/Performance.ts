import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { Job } from './Job';

export enum KPIType {
  RECRUITMENT = 'recruitment',
  HIRING = 'hiring',
  RETENTION = 'retention',
  PRODUCTIVITY = 'productivity',
  QUALITY = 'quality',
  COST = 'cost',
  TIME = 'time',
  SATISFACTION = 'satisfaction',
  DIVERSITY = 'diversity',
  TRAINING = 'training',
  PERFORMANCE = 'performance',
  ENGAGEMENT = 'engagement'
}

export enum PerformanceMetricType {
  TIME_TO_HIRE = 'time_to_hire',
  COST_PER_HIRE = 'cost_per_hire',
  QUALITY_OF_HIRE = 'quality_of_hire',
  SOURCE_EFFECTIVENESS = 'source_effectiveness',
  CANDIDATE_EXPERIENCE = 'candidate_experience',
  INTERVIEW_EFFICIENCY = 'interview_efficiency',
  OFFER_ACCEPTANCE_RATE = 'offer_acceptance_rate',
  EMPLOYEE_TURNOVER = 'employee_turnover',
  RETENTION_RATE = 'retention_rate',
  PRODUCTIVITY_INDEX = 'productivity_index',
  ENGAGEMENT_SCORE = 'engagement_score',
  TRAINING_COMPLETION = 'training_completion',
  PERFORMANCE_RATING = 'performance_rating',
  DIVERSITY_INDEX = 'diversity_index',
  RECRUITER_EFFICIENCY = 'recruiter_efficiency',
  PIPELINE_VELOCITY = 'pipeline_velocity',
  CONVERSION_RATE = 'conversion_rate',
  TIME_TO_FILL = 'time_to_fill',
  VACANCY_RATE = 'vacancy_rate',
  INTERNAL_MOBILITY = 'internal_mobility'
}

export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum MetricStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  BELOW_AVERAGE = 'below_average',
  POOR = 'poor'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

@Entity('performance_metrics')
export class PerformanceMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: KPIType,
    default: KPIType.RECRUITMENT
  })
  kpiType: KPIType;

  @Column({
    type: 'enum',
    enum: PerformanceMetricType,
    default: PerformanceMetricType.TIME_TO_HIRE
  })
  metric: PerformanceMetricType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  targetValue?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  previousValue?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  benchmarkValue?: number;

  @Column()
  unit: string;

  @Column({
    type: 'enum',
    enum: TimePeriod,
    default: TimePeriod.MONTHLY
  })
  period: TimePeriod;

  @Column({
    type: 'enum',
    enum: MetricStatus,
    default: MetricStatus.AVERAGE
  })
  status: MetricStatus;

  @Column({
    type: 'enum',
    enum: TrendDirection,
    default: TrendDirection.STABLE
  })
  trend: TrendDirection;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  variance?: number; // Percentage variance from target

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  changeRate?: number; // Percentage change from previous period

  @Column({ type: 'timestamp' })
  measurementDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, user => user.performanceMetrics)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, company => company.performanceMetrics)
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column({ nullable: true })
  jobId?: string;

  @ManyToOne(() => Job, job => job.performanceMetrics)
  @JoinColumn({ name: 'jobId' })
  job?: Job;

  @Column({ nullable: true })
  departmentId?: string;

  @Column({ nullable: true })
  teamId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    source?: string;
    calculationMethod?: string;
    dataPoints?: number;
    confidence?: number;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  breakdown?: {
    byDepartment?: Record<string, number>;
    byTeam?: Record<string, number>;
    byLocation?: Record<string, number>;
    byRole?: Record<string, number>;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  factors?: {
    internal?: string[];
    external?: string[];
    controllable?: string[];
    uncontrollable?: string[];
    [key: string]: any;
  };

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('kpi_targets')
export class KPITarget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: KPIType,
    default: KPIType.RECRUITMENT
  })
  kpiType: KPIType;

  @Column({
    type: 'enum',
    enum: PerformanceMetricType,
    default: PerformanceMetricType.TIME_TO_HIRE
  })
  metric: PerformanceMetricType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetValue: number;

  @Column()
  unit: string;

  @Column({
    type: 'enum',
    enum: TimePeriod,
    default: TimePeriod.MONTHLY
  })
  period: TimePeriod;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, user => user.kpiTargets)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, company => company.kpiTargets)
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column({ nullable: true })
  jobId?: string;

  @ManyToOne(() => Job, job => job.kpiTargets)
  @JoinColumn({ name: 'jobId' })
  job?: Job;

  @Column({ nullable: true })
  departmentId?: string;

  @Column({ nullable: true })
  teamId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    priority?: string;
    category?: string;
    weight?: number;
    [key: string]: any;
  };

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('performance_alerts')
export class PerformanceAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PerformanceMetricType,
    default: PerformanceMetricType.TIME_TO_HIRE
  })
  metric: PerformanceMetricType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  threshold: number;

  @Column({
    type: 'enum',
    enum: ['above', 'below', 'equals'],
    default: 'above'
  })
  condition: 'above' | 'below' | 'equals';

  @Column({ type: 'text' })
  message: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  notifyUsers?: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    priority?: string;
    category?: string;
    [key: string]: any;
  };

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, user => user.performanceAlerts)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, company => company.performanceAlerts)
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
