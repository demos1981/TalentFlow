import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity('candidate_profiles')
@Index(['userId'])
@Index(['location'])
@Index(['yearsOfExperience'])
@Index(['isActive'])
@Index(['skills'])
@Index(['location', 'yearsOfExperience'])
@Index(['skills', 'location'])
export class CandidateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, user => user.profiles)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @Column({ type: 'int', nullable: true })
  yearsOfExperience?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  linkedin?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  github?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  portfolio?: string;

  @Column({ type: 'simple-array', nullable: true })
  education?: string[];

  @Column({ type: 'simple-array', nullable: true })
  certifications?: string[];

  @Column({ type: 'simple-array', nullable: true })
  languages?: string[];

  @Column({ type: 'simple-array', nullable: true })
  workExperience?: string[];

  @Column({ type: 'simple-array', nullable: true })
  achievements?: string[];

  @Column({ type: 'jsonb', nullable: true })
  workHistory?: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: Date;
    endDate?: Date;
  }>;

  // Векторні поля для AI матчингу
  @Column({ type: 'text', nullable: true })
  embeddingText?: string;

  @Column({ type: 'jsonb', nullable: true })
  embedding?: number[];

  @Column({ type: 'timestamp', nullable: true })
  embeddingUpdatedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    desiredSalary?: number;
    preferredLocation?: string;
    remoteWork?: boolean;
    relocation?: boolean;
    travelPercentage?: number;
    salaryExpectation?: number;
    workType?: string;
    availability?: string;
  };

  @Column({ type: 'int', default: 0 })
  views?: number;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @Column({ type: 'boolean', default: true })
  isPublic?: boolean;

  // Зв'язок з подіями (One-to-Many)
  @OneToMany(() => Event, event => event.candidate)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
