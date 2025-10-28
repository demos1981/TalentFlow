import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity('applications')
@Index(['userId'])
@Index(['jobId'])
@Index(['status'])
@Index(['createdAt'])
@Index(['userId', 'status'])
@Index(['jobId', 'status'])
@Index(['createdAt', 'status'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.applications)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  jobId: string;

  @ManyToOne(() => Job, job => job.applicationsList)
  @JoinColumn({ name: 'jobId' })
  job?: Job;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'interview', 'hired', 'rejected'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'interview' | 'hired' | 'rejected';

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments?: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  matchScore?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  shortlistedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  interviewedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  offeredAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  hiredAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
