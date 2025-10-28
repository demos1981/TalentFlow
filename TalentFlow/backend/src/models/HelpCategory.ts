import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { HelpArticle } from './HelpArticle';

export enum HelpCategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

@Entity('help_categories')
@Index(['isActive', 'order'])
@Index(['slug'])
export class HelpCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  icon?: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color?: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'int', default: 0 })
  articleCount: number;

  @Column({ type: 'enum', enum: HelpCategoryStatus, default: HelpCategoryStatus.ACTIVE })
  status: HelpCategoryStatus;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @OneToMany(() => HelpArticle, article => article.category)
  articles?: HelpArticle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}