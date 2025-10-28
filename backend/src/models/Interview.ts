import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable, Index } from 'typeorm';
import { User } from './User';
import { Application } from './Application';
import { Job } from './Job';

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  ONSITE = 'onsite',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  FINAL = 'final',
  SCREENING = 'screening',
  PANEL = 'panel'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no-show'
}

export enum InterviewResult {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  ON_HOLD = 'on-hold',
  WITHDRAWN = 'withdrawn'
}

@Entity('interviews')
@Index(['status', 'scheduledDate'])
@Index(['type', 'status'])
@Index(['applicationId'])
@Index(['createdById'])
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicationId' })
  application?: Application;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @Column({ type: 'enum', enum: InterviewType })
  type: InterviewType;

  @Column({ type: 'enum', enum: InterviewStatus, default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Column({ type: 'enum', enum: InterviewResult, nullable: true })
  result?: InterviewResult;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'int' })
  duration: number; // в хвилинах

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  meetingLink?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  overallRating?: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  technicalSkills?: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  communicationSkills?: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  culturalFit?: number;

  @Column({ type: 'boolean', nullable: true })
  wouldRecommend?: boolean;

  @Column({ type: 'text', nullable: true })
  nextSteps?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @ManyToMany(() => User, user => user.interviews)
  @JoinTable({
    name: 'interview_interviewers',
    joinColumn: { name: 'interviewId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  interviewers?: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}