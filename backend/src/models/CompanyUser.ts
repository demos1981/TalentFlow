import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { Company } from './Company';
import { User } from './User';

export enum CompanyUserRole {
  OWNER = 'owner',        // Власник компанії
  ADMIN = 'admin',        // Адміністратор
  MANAGER = 'manager',    // Менеджер
  RECRUITER = 'recruiter', // Рекрутер
  VIEWER = 'viewer'       // Переглядач
}

export enum CompanyUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',    // Очікує підтвердження
  SUSPENDED = 'suspended'
}

@Entity('company_users')
@Unique(['companyId', 'userId'])
@Index(['companyId'])
@Index(['userId'])
@Index(['role'])
@Index(['status'])
export class CompanyUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.companyUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.companyMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({
    type: 'enum',
    enum: CompanyUserRole,
    default: CompanyUserRole.RECRUITER
  })
  role: CompanyUserRole;

  @Column({
    type: 'enum',
    enum: CompanyUserStatus,
    default: CompanyUserStatus.PENDING
  })
  status: CompanyUserStatus;

  // Права доступу (Permissions)
  @Column({ type: 'jsonb', default: {} })
  permissions: {
    // Вакансії
    canPublishJobsSelf?: boolean;           // Публікувати вакансії самостійно
    canViewOthersJobs?: boolean;            // Переглядати вакансії від відгуків інших користувачів
    canManageOthersJobs?: boolean;          // Керувати та затверджувати вакансії інших користувачів
    
    // Кандидати та контакти
    canViewCandidateContacts?: boolean;     // Відкривати контакти з бази резюме
    
    // Послуги та оплата
    canActivateServices?: boolean;          // Активувати послуги
    canMakePayments?: boolean;              // Оплата збереженими картками компанії
    
    // Управління
    canManageUsers?: boolean;               // Керувати користувачами
    canManagePaymentCards?: boolean;        // Керувати збереженими картками компанії
    canEditCompanyInfo?: boolean;           // Редагувати інформацію про компанію
    canManageJobTemplates?: boolean;        // Керувати макетами дизайну вакансій
  };

  // Метадані
  @Column({ nullable: true })
  title?: string; // Посада в компанії

  @Column({ nullable: true })
  department?: string; // Відділ

  @Column({ type: 'timestamp', nullable: true })
  invitedAt?: Date;

  @Column({ nullable: true })
  invitedBy?: string; // userId хто запросив

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string; // Примітки від адміністратора

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

