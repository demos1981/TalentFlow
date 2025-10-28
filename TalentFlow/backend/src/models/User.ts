import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, Index } from 'typeorm';
import { Company } from './Company';
import { Application } from './Application';
import { Interview } from './Interview';
import { CandidateProfile } from './CandidateProfile';
import { Notification } from './Notification';
import { Job } from './Job';
import { Workflow } from './Workflow';
import { Event } from './Event';
import { File } from './File';
import { Message } from './Message';
import { Chat } from './Chat';
import { Payment } from './Payment';
import { PerformanceMetric, KPITarget, PerformanceAlert } from './Performance';
import { Report, ReportTemplate, ReportSchedule } from './Report';
import { CompanyUser } from './CompanyUser';

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  VERIFIED = 'verified'
}

@Entity('users')
@Index(['email'])
@Index(['role'])
@Index(['isActive'])
@Index(['createdAt'])
@Index(['lastActiveAt'])
@Index(['companyId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, unique: true })
  linkedinId?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATE
  })
  role: UserRole;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  twitter?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @Column({ type: 'int', nullable: true })
  experience?: number;

  @Column({ type: 'text', nullable: true })
  education?: string;

  @Column({ type: 'simple-array', nullable: true })
  certifications?: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  notificationSettings?: any;

  @Column({ type: 'jsonb', nullable: true })
  privacySettings?: any;

  @Column({ type: 'jsonb', nullable: true })
  appearanceSettings?: any;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: any;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ default: false })
  loginAlerts: boolean;

  @Column({ default: false })
  deviceAlerts: boolean;

  @Column({ default: false })
  locationAlerts: boolean;

  @Column({ type: 'jsonb', nullable: true })
  trustedDevices?: any[];

  @Column({ type: 'jsonb', nullable: true })
  trustedIPs?: any[];

  @Column({ type: 'int', default: 30 })
  sessionTimeout: number;

  @Column({ default: false })
  requirePasswordChange: boolean;

  @Column({ type: 'timestamp', nullable: true })
  passwordExpiryDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt?: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;

  @Column({ nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, company => company.users, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @OneToMany(() => Application, application => application.user)
  applications?: Application[];

  @OneToMany(() => Interview, interview => interview.createdBy)
  interviews?: Interview[];

  @OneToMany(() => CandidateProfile, profile => profile.user)
  profiles?: CandidateProfile[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications!: Notification[];

  @ManyToMany(() => Job, job => job.createdByUser)
  createdJobs?: Job[];

  @ManyToMany(() => Job, job => job.applicants)
  appliedJobs?: Job[];

  @OneToMany(() => Workflow, workflow => workflow.creator)
  workflows?: Workflow[];

  @OneToMany(() => Event, event => event.createdBy)
  events?: Event[];

  @OneToMany(() => File, file => file.uploadedBy)
  files?: File[];

  @OneToMany(() => CompanyUser, companyUser => companyUser.user)
  companyMemberships?: CompanyUser[];

  @OneToMany(() => Message, message => message.sender)
  sentMessages?: Message[];

  @OneToMany(() => Chat, chat => chat.createdByUser)
  createdChats?: Chat[];

  @ManyToMany(() => Chat, chat => chat.participantsList)
  chats?: Chat[];

  @OneToMany(() => Payment, payment => payment.user)
  payments?: Payment[];

  @OneToMany(() => PerformanceMetric, performanceMetric => performanceMetric.user)
  performanceMetrics?: PerformanceMetric[];

  @OneToMany(() => KPITarget, kpiTarget => kpiTarget.user)
  kpiTargets?: KPITarget[];

  @OneToMany(() => PerformanceAlert, performanceAlert => performanceAlert.user)
  performanceAlerts?: PerformanceAlert[];

  @OneToMany(() => Report, report => report.user)
  reports?: Report[];

  @OneToMany(() => ReportTemplate, reportTemplate => reportTemplate.user)
  reportTemplates?: ReportTemplate[];

  @OneToMany(() => ReportSchedule, reportSchedule => reportSchedule.user)
  reportSchedules?: ReportSchedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Методи для перевірки прав
  isCandidate(): boolean {
    return this.role === UserRole.CANDIDATE;
  }

  isEmployer(): boolean {
    return this.role === UserRole.EMPLOYER;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canPostJob(): boolean {
    return this.isEmployer() && this.isActive;
  }

  canSearchCandidate(): boolean {
    return this.isEmployer() && this.isActive;
  }

  hasTeamManagementAccess(): boolean {
    return this.isEmployer() && this.isActive;
  }
}
