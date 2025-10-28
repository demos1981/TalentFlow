import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { CompanyUser } from '../models/CompanyUser';
import { Application } from '../models/Application';
import { Interview } from '../models/Interview';
import { CandidateProfile } from '../models/CandidateProfile';
import { Assessment } from '../models/Assessment';
import { Notification } from '../models/Notification';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { FeaturedJobPackage } from '../models/FeaturedJobPackage';
import AiRecommendation from '../models/AiRecommendation';
import { Event } from '../models/Event';
import { PerformanceMetric, KPITarget, PerformanceAlert } from '../models/Performance';
import { Workflow } from '../models/Workflow';
import { File } from '../models/File';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { Report, ReportTemplate, ReportSchedule } from '../models/Report';

// Завантажуємо змінні середовища
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5438'),
  username: process.env.PGUSER || process.env.DB_USER || 'talentmatch_user',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'talentmatch_password',
  database: process.env.PGDATABASE || process.env.DB_NAME || 'talentmatch',
  synchronize: process.env.NODE_ENV === 'development' || process.env.DB_SYNCHRONIZE === 'true',
  
  // Оптимізоване логування - тільки помилки та повільні запити
  logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  maxQueryExecutionTime: 1000, // Log slow queries > 1s
  
  entities: [
    User,
    Company,
    Job,
    CompanyUser,
    Application,
    Interview,
    CandidateProfile,
    Assessment,
    Notification,
    Subscription,
    Payment,
    FeaturedJobPackage,
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
    ReportTemplate,
    ReportSchedule
  ],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
  
  // Оптимізований Connection Pool
  extra: {
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    min: 5, // Minimum number of clients in the pool
    idle: 10000, // Close idle clients after 10 seconds
    acquire: 30000, // Maximum time to wait for a connection
    evict: 1000, // How often to run eviction checks
    
    // Query timeout settings
    statement_timeout: 30000, // 30 seconds max query time (prevents hanging queries)
    idle_in_transaction_session_timeout: 60000, // 60 seconds for idle transactions
    
    // Performance settings
    application_name: 'TalentFlow',
    
    // SSL settings for production
    ssl: process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.includes('sslmode=require') 
      ? { rejectUnauthorized: false } 
      : false
  },
  
  // Enable query result caching (60 seconds)
  cache: {
    duration: 60000, // 1 minute cache for repeated queries
    type: 'database',
    ignoreErrors: true, // Don't crash if cache fails
  }
});
