import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Job } from './Job';
import { CandidateProfile } from './CandidateProfile';
import { Company } from './Company';

export enum EventType {
  INTERVIEW = 'interview',
  MEETING = 'meeting',
  DEADLINE = 'deadline',
  REMINDER = 'reminder',
  TRAINING = 'training',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  PRESENTATION = 'presentation',
  REVIEW = 'review',
  OTHER = 'other'
}

export enum EventStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed'
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

@Entity('events')
@Index(['createdById'])
@Index(['companyId'])
@Index(['jobId'])
@Index(['startDate'])
@Index(['type'])
@Index(['status'])
@Index(['isActive'])
@Index(['startDate', 'endDate'])
@Index(['createdById', 'startDate'])
@Index(['companyId', 'startDate'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'enum', enum: EventType, default: EventType.OTHER })
  type: EventType;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.SCHEDULED })
  status: EventStatus;

  @Column({ type: 'enum', enum: EventPriority, default: EventPriority.MEDIUM })
  priority: EventPriority;

  @Column({ type: 'boolean', default: false })
  isAllDay: boolean;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'enum', enum: RecurrenceType, default: RecurrenceType.NONE })
  recurrenceType: RecurrenceType;

  @Column({ type: 'json', nullable: true })
  recurrenceRule?: any; // RRULE format

  @Column({ type: 'int', default: 0 })
  completionPercentage: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'json', nullable: true })
  locationDetails?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    isOnline?: boolean;
    meetingUrl?: string;
    room?: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  attendees?: string[]; // Array of user IDs

  @Column({ type: 'simple-array', nullable: true })
  externalAttendees?: string[]; // Array of email addresses

  @Column({ type: 'json', nullable: true })
  reminders?: Array<{
    type: 'email' | 'push' | 'sms';
    time: number; // minutes before event
    sent: boolean;
  }>;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'json', nullable: true })
  metadata?: any; // Additional custom data

  @Column({ type: 'boolean', default: false })
  isPrivate: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  // Зв'язки
  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User, user => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'uuid', nullable: true })
  jobId?: string;

  @ManyToOne(() => Job, job => job.events, { nullable: true })
  @JoinColumn({ name: 'jobId' })
  job?: Job;

  @Column({ type: 'uuid', nullable: true })
  candidateId?: string;

  @ManyToOne(() => CandidateProfile, candidate => candidate.events, { nullable: true })
  @JoinColumn({ name: 'candidateId' })
  candidate?: CandidateProfile;

  @Column({ type: 'uuid', nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, company => company.events, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}