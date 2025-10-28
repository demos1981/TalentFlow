import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable, Index } from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { Application } from './Application';
import { Event } from './Event';
import { Payment } from './Payment';
import { PerformanceMetric, KPITarget } from './Performance';

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
  EXPIRED = 'expired'
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance'
}

export enum ExperienceLevel {
  NO_EXPERIENCE = 'no_experience',
  LESS_THAN_1 = 'less_than_1',
  FROM_1_TO_3 = '1_to_3',
  FROM_3_TO_5 = '3_to_5',
  FROM_5_TO_10 = '5_to_10',
  MORE_THAN_10 = 'more_than_10'
}

@Entity('jobs')
@Index(['companyId'])
@Index(['status'])
@Index(['createdAt'])
@Index(['publishedAt'])
@Index(['title'])
@Index(['location'])
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string;

  @Column({ type: 'boolean', default: false })
  remote: boolean;

  @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  type: JobType;

  @Column({ type: 'enum', enum: ExperienceLevel, default: ExperienceLevel.FROM_1_TO_3 })
  experienceLevel: ExperienceLevel;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMin: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMax: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  industry: string;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status: JobStatus;

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'timestamp', nullable: true })
  featuredUntil?: Date;

  @Column({ nullable: true })
  featuredPackageId?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'int', default: 0 })
  views: number;

  // Векторні поля для AI матчингу
  @Column({ type: 'text', nullable: true })
  embeddingText?: string;

  @Column({ type: 'jsonb', nullable: true })
  embedding?: number[];

  @Column({ type: 'timestamp', nullable: true })
  embeddingUpdatedAt?: Date;

  @Column({ type: 'int', default: 0 })
  applications: number;

  // Зв'язок з компанією (Many-to-One)
  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @ManyToOne(() => Company, company => company.jobs)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // Зв'язок з користувачем, який створив роботу (Many-to-One)
  @Column({ type: 'uuid', nullable: true })
  createdByUserId: string;

  @ManyToOne(() => User, user => user.createdJobs)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  // Зв'язок з користувачами, які відкликалися на роботу (Many-to-Many)
  @ManyToMany(() => User, user => user.appliedJobs)
  @JoinTable({
    name: 'job_applications',
    joinColumn: {
      name: 'jobId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    }
  })
  applicants: User[];

  // Зв'язок з заявками (One-to-Many)
  @OneToMany(() => Application, application => application.job)
  applicationsList: Application[];

  // Зв'язок з подіями (One-to-Many)
  @OneToMany(() => Event, event => event.job)
  events: Event[];

  @OneToMany(() => Payment, payment => payment.job)
  payments: Payment[];

  @OneToMany(() => PerformanceMetric, performanceMetric => performanceMetric.job)
  performanceMetrics: PerformanceMetric[];

  @OneToMany(() => KPITarget, kpiTarget => kpiTarget.job)
  kpiTargets: KPITarget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
