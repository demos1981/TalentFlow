import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Job } from './Job';

export enum RecommendationType {
  CANDIDATE_TO_JOB = 'candidate_to_job',
  JOB_TO_CANDIDATE = 'job_to_candidate'
}

export enum MatchScore {
  EXCELLENT = 'excellent',    // 90-100%
  GOOD = 'good',             // 80-89%
  AVERAGE = 'average',       // 70-79%
  POOR = 'poor'              // 0-69%
}

@Entity('ai_recommendations')
@Index(['candidateId', 'jobId', 'type'], { unique: true })
@Index(['matchScore', 'createdAt'])
@Index(['type', 'isActive'])
export class AiRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RecommendationType,
    comment: 'Тип рекомендації: кандидат для вакансії або вакансія для кандидата'
  })
  type: RecommendationType;

  @Column({ type: 'uuid', nullable: false })
  candidateId: string;

  @Column({ type: 'uuid', nullable: false })
  jobId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  matchScore: number;

  @Column({
    type: 'enum',
    enum: MatchScore,
    default: MatchScore.POOR
  })
  matchScoreCategory: MatchScore;

  @Column({ type: 'jsonb', nullable: true })
  skillsMatch: {
    matched: string[];
    missing: string[];
    score: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  experienceMatch: {
    required: string;
    candidate: string;
    score: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  locationMatch: {
    required: string;
    candidate: string;
    score: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  salaryMatch: {
    required: { min: number; max: number };
    candidate: { min: number; max: number };
    score: number;
  };

  @Column({ type: 'text', nullable: true })
  aiReason: string;

  @Column({ type: 'jsonb', nullable: true })
  aiMetadata: {
    model: string;
    confidence: number;
    processingTime: number;
    features: string[];
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isViewed: boolean;

  @Column({ type: 'boolean', default: false })
  isContacted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  viewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  contactedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  feedback: {
    rating: number;
    comment: string;
    createdAt: Date;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate: User;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  // Virtual fields for API responses
  candidateProfile?: any;
  jobDetails?: any;
}

export default AiRecommendation;
