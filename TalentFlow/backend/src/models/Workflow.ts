import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum WorkflowType {
  APPLICATION = 'application',
  INTERVIEW = 'interview',
  PAYMENT = 'payment',
  REPORTING = 'reporting',
  NOTIFICATION = 'notification',
  INTEGRATION = 'integration',
  CUSTOM = 'custom'
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

export enum TriggerType {
  EVENT = 'event',
  SCHEDULE = 'schedule',
  MANUAL = 'manual',
  WEBHOOK = 'webhook'
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: WorkflowType })
  type: WorkflowType;

  @Column({ type: 'enum', enum: WorkflowStatus, default: WorkflowStatus.DRAFT })
  status: WorkflowStatus;

  @Column({ type: 'enum', enum: TriggerType })
  triggerType: TriggerType;

  @Column({ type: 'jsonb', nullable: true })
  triggerConfig?: any;

  @Column({ type: 'jsonb' })
  actions: any[];

  @Column({ type: 'jsonb', nullable: true })
  conditions?: any;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'int', nullable: true })
  timeout?: number;

  @Column({ type: 'int', default: 0 })
  maxRetries: number;

  @Column({ type: 'jsonb', nullable: true })
  errorHandling?: any;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isTemplate: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, user => user.workflows)
  @JoinColumn({ name: 'createdBy' })
  creator?: User;

  // Мінімальне логування - тільки останній запуск
  @Column({ type: 'timestamp', nullable: true })
  lastExecutedAt?: Date;

  @Column({ type: 'enum', enum: ExecutionStatus, nullable: true })
  lastExecutionStatus?: ExecutionStatus;

  @Column({ type: 'text', nullable: true })
  lastErrorMessage?: string;

  @Column({ type: 'int', default: 0 })
  executionCount: number;

  @Column({ type: 'int', default: 0 })
  successCount: number;

  @Column({ type: 'int', default: 0 })
  failureCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
