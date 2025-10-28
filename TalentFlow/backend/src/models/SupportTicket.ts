import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HelpArticle } from './HelpArticle';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_FOR_USER = 'waiting_for_user',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketType {
  BUG_REPORT = 'bug_report',
  FEATURE_REQUEST = 'feature_request',
  GENERAL_INQUIRY = 'general_inquiry',
  TECHNICAL_SUPPORT = 'technical_support',
  ACCOUNT_ISSUE = 'account_issue'
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM
  })
  priority: TicketPriority;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.GENERAL_INQUIRY
  })
  type: TicketType;

  @Column()
  userId: string;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ nullable: true })
  relatedArticleId?: string;

  @ManyToOne(() => HelpArticle)
  @JoinColumn({ name: 'relatedArticleId' })
  relatedArticle?: HelpArticle;

  @Column({ type: 'jsonb', nullable: true })
  attachments?: any[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @Column({ nullable: true })
  resolvedAt?: Date;

  @Column({ nullable: true })
  closedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



