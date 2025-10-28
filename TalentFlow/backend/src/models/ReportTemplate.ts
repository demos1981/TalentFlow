import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Report } from './Report';

export enum TemplateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft'
}

@Entity('report_templates')
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  reportId?: string;

  @ManyToOne(() => Report, report => report.templates)
  @JoinColumn({ name: 'reportId' })
  report?: Report;

  @Column({
    type: 'enum',
    enum: TemplateStatus,
    default: TemplateStatus.DRAFT
  })
  status: TemplateStatus;

  @Column({ type: 'jsonb' })
  configuration: any;

  @Column({ type: 'jsonb', nullable: true })
  defaultParameters?: any;

  @Column({ type: 'jsonb', nullable: true })
  layout?: any;

  @Column({ type: 'jsonb', nullable: true })
  styling?: any;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}




