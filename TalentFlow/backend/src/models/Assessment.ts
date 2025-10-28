import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  jobId?: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  job?: Job;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['technical', 'personality', 'cognitive', 'language', 'custom'],
    default: 'technical'
  })
  type: 'technical' | 'personality' | 'cognitive' | 'language' | 'custom';

  @Column({ type: 'jsonb' })
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'single-choice' | 'text' | 'code' | 'file';
    options?: string[];
    correctAnswer?: string | string[];
    points: number;
  }>;

  @Column({ type: 'int' })
  timeLimit: number; // в хвилинах

  @Column({ type: 'int' })
  totalPoints: number;

  @Column({ type: 'int' })
  passingScore: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'int', nullable: true })
  score?: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  percentage?: number;

  @Column({ default: false })
  isPassed: boolean;

  @Column({ type: 'jsonb', nullable: true })
  answers?: Array<{
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    points: number;
  }>;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
