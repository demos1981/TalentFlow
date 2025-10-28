import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';

export enum ReportType {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  INTERVIEWS = 'interviews',
  PAYMENTS = 'payments',
  SUBSCRIPTIONS = 'subscriptions',
  ANALYTICS = 'analytics',
  PERFORMANCE = 'performance',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
  HTML = 'html'
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum ReportCategory {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  INTERVIEWS = 'interviews',
  PAYMENTS = 'payments',
  SUBSCRIPTIONS = 'subscriptions',
  ANALYTICS = 'analytics',
  PERFORMANCE = 'performance',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export enum ReportPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.CUSTOM
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    default: ReportFormat.PDF
  })
  format: ReportFormat;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING
  })
  status: ReportStatus;

  @Column({
    type: 'enum',
    enum: ReportCategory,
    default: ReportCategory.CUSTOM
  })
  category: ReportCategory;

  @Column({
    type: 'enum',
    enum: ReportPriority,
    default: ReportPriority.MEDIUM
  })
  priority: ReportPriority;

  @Column({ type: 'jsonb', nullable: true })
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    userIds?: string[];
    companyIds?: string[];
    jobIds?: string[];
    status?: string[];
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  fields?: string[];

  @Column({ type: 'jsonb', nullable: true })
  parameters?: {
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeCharts?: boolean;
    includeSummary?: boolean;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    tags?: string[];
    notes?: string;
    version?: string;
    [key: string]: any;
  };

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize?: number;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  templateId?: string;

  @Column({ default: false })
  isScheduled: boolean;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
    nullable: true
  })
  scheduleFrequency?: ScheduleFrequency;

  @Column({ type: 'timestamp', nullable: true })
  scheduleDate?: Date;

  @Column({ nullable: true })
  generatedBy?: string;

  @ManyToOne(() => User, user => user.reports)
  @JoinColumn({ name: 'generatedBy' })
  user?: User;

  @OneToMany(() => ReportSchedule, schedule => schedule.report)
  schedules?: ReportSchedule[];

  @OneToMany(() => ReportTemplate, 'reportId')
  templates?: ReportTemplate[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('report_templates')
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.CUSTOM
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    default: ReportFormat.PDF
  })
  format: ReportFormat;

  @Column({
    type: 'enum',
    enum: ReportCategory,
    default: ReportCategory.CUSTOM
  })
  category: ReportCategory;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'jsonb', nullable: true })
  fields?: string[];

  @Column({ type: 'jsonb', nullable: true })
  defaultFilters?: {
    dateFrom?: string;
    dateTo?: string;
    status?: string[];
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  defaultParameters?: {
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeCharts?: boolean;
    includeSummary?: boolean;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    tags?: string[];
    version?: string;
    [key: string]: any;
  };

  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, user => user.reportTemplates)
  @JoinColumn({ name: 'createdBy' })
  user?: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('report_schedules')
export class ReportSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  reportId: string;

  @ManyToOne(() => Report, report => report.schedules)
  @JoinColumn({ name: 'reportId' })
  report?: Report;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
    default: ScheduleFrequency.MONTHLY
  })
  frequency: ScheduleFrequency;

  @Column({ nullable: true })
  cronExpression?: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextRun?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastRun?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  recipients?: string[];

  @Column({ type: 'jsonb', nullable: true })
  parameters?: {
    emailSubject?: string;
    emailBody?: string;
    includeCharts?: boolean;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    tags?: string[];
    notes?: string;
    [key: string]: any;
  };

  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, user => user.reportSchedules)
  @JoinColumn({ name: 'createdBy' })
  user?: User;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}