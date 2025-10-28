import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Завантажуємо змінні середовища
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { User } from '../models/User';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { Interview } from '../models/Interview';
import { CandidateProfile } from '../models/CandidateProfile';
import { Assessment } from '../models/Assessment';
import { Notification } from '../models/Notification';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { AiRecommendation } from '../models/AiRecommendation';
import { Event } from '../models/Event';
import { PerformanceMetric, KPITarget, PerformanceAlert } from '../models/Performance';
import { Workflow } from '../models/Workflow';
import { File } from '../models/File';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { Report, ReportTemplate, ReportSchedule } from '../models/Report';
import { CompanyUser } from '../models';
import { FeaturedJobPackage } from '../models/FeaturedJobPackage';

export const MigrationDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5438'),
  username: process.env.DB_USER || 'talentmatch_user',
  password: process.env.DB_PASSWORD || 'talentmatch_password',
  database: process.env.DB_NAME || 'talentmatch',
  synchronize: false,
  logging: true,
  entities: [
    User,
    Company,
    Job,
    Application,
    Interview,
    CandidateProfile,
    Assessment,
    Notification,
    Subscription,
    Payment,
    AiRecommendation,
    Event,
    PerformanceMetric,
    KPITarget,
    PerformanceAlert,
    Workflow,
    File,
    Message,
    Chat,
    Report,
    CompanyUser,
    FeaturedJobPackage,
    ReportTemplate,
    ReportSchedule
  ],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});

