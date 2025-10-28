import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from './User';
import { HelpArticle } from './HelpArticle';

@Entity('help_ratings')
@Index(['helpId', 'userId'], { unique: true })
@Index(['helpId'])
@Index(['userId'])
export class HelpRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  helpId: string;

  @ManyToOne(() => HelpArticle, article => article.ratings, { onDelete: 'CASCADE' })
  article: HelpArticle;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'boolean', nullable: true })
  wasHelpful?: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdAt: Date;
}


