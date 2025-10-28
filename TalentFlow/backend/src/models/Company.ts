import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Job } from './Job';
import { Event } from './Event';
import { Payment } from './Payment';
import { PerformanceMetric, KPITarget, PerformanceAlert } from './Performance';
import { CompanyUser } from './CompanyUser';

@Entity('companies')
@Index(['name'])
@Index(['industry'])
@Index(['size'])
@Index(['isActive'])
@Index(['isVerified'])
@Index(['location'])
@Index(['industry', 'size'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({
    type: 'enum',
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    default: 'small'
  })
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

  @Column({ type: 'int', nullable: true })
  founded?: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  benefits?: string[];

  @Column({ type: 'text', nullable: true })
  culture?: string;

  @Column({ type: 'text', nullable: true })
  mission?: string;

  @Column({ type: 'text', nullable: true })
  vision?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @OneToMany(() => User, user => user.company)
  users?: User[];

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.company, { cascade: true })
  companyUsers?: CompanyUser[];

  @OneToMany(() => Job, job => job.company)
  jobs?: Job[];

  @OneToMany(() => Event, event => event.company)
  events?: Event[];

  @OneToMany(() => Payment, payment => payment.company)
  payments?: Payment[];

  @OneToMany(() => PerformanceMetric, performanceMetric => performanceMetric.company)
  performanceMetrics?: PerformanceMetric[];

  @OneToMany(() => KPITarget, kpiTarget => kpiTarget.company)
  kpiTargets?: KPITarget[];

  @OneToMany(() => PerformanceAlert, performanceAlert => performanceAlert.company)
  performanceAlerts?: PerformanceAlert[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
