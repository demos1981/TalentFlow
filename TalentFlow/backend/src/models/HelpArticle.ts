import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './User';
import { HelpCategory } from './HelpCategory';
import { HelpRating } from './HelpRating';

export enum HelpType {
  ARTICLE = 'article',
  FAQ = 'faq',
  TUTORIAL = 'tutorial',
  GUIDE = 'guide',
  TROUBLESHOOTING = 'troubleshooting'
}

export enum HelpStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  HIDDEN = 'hidden'
}

export enum HelpPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('help_articles')
@Index(['status', 'isPublic'])
@Index(['type', 'status'])
@Index(['categoryId', 'status'])
@Index(['slug'])
@Index(['isFeatured', 'status'])
export class HelpArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'enum', enum: HelpType })
  type: HelpType;

  @Column({ type: 'enum', enum: HelpStatus, default: HelpStatus.DRAFT })
  status: HelpStatus;

  @Column({ type: 'enum', enum: HelpPriority, default: HelpPriority.MEDIUM })
  priority: HelpPriority;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;

  @ManyToOne(() => HelpCategory, category => category.articles, { onDelete: 'SET NULL' })
  category?: HelpCategory;

  @Column({ type: 'json' })
  tags: string[];

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @Column({ type: 'int', default: 0 })
  notHelpfulCount: number;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @OneToMany(() => HelpRating, rating => rating.article)
  ratings?: HelpRating[];

  // @OneToMany(() => SupportTicket, ticket => ticket.relatedArticle)
  // relatedTickets?: SupportTicket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}