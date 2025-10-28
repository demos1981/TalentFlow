import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';

export enum NotificationType {
  // Для роботодавців
  NEW_APPLICATION = 'new_application',
  APPLICATION_STATUS_CHANGED = 'application_status_changed',
  CANDIDATE_MESSAGE = 'candidate_message',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEW_REMINDER = 'interview_reminder',
  INTERVIEW_CANCELLED = 'interview_cancelled',
  INTERVIEW_COMPLETED = 'interview_completed',
  
  // Для кандидатів
  JOB_MATCH = 'job_match',
  APPLICATION_VIEWED = 'application_viewed',
  INTERVIEW_INVITATION = 'interview_invitation',
  APPLICATION_ACCEPTED = 'application_accepted',
  APPLICATION_REJECTED = 'application_rejected',
  JOB_APPLICATION_DEADLINE = 'job_application_deadline',
  
  // Загальні
  SYSTEM_MESSAGE = 'system_message',
  PROFILE_UPDATE = 'profile_update',
  NEW_MESSAGE = 'new_message',
  SECURITY_ALERT = 'security_alert',
  FEATURE_UPDATE = 'feature_update',
  MAINTENANCE = 'maintenance'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WEBHOOK = 'webhook'
}

@Entity('notifications')
@Index(['userId'])
@Index(['type'])
@Index(['createdAt'])
@Index(['isRead'])
@Index(['userId', 'isRead'])
@Index(['userId', 'type'])
@Index(['createdAt', 'isRead'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD
  })
  status: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP
  })
  channel: NotificationChannel;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isPersistent: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    relatedId?: string;
    relatedType?: string;
    actionUrl?: string;
    senderId?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    [key: string]: any;
  };

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: false })
  sendEmail: boolean;

  @Column({ default: false })
  sendSms: boolean;

  @Column({ default: false })
  sendPush: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}