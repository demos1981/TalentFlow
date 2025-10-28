import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Завантажуємо змінні середовища першими
dotenv.config();

import { User } from '../models/User';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { CompanyUser } from '../models/CompanyUser';
import { FeaturedJobPackage } from '../models/FeaturedJobPackage';
import { Application } from '../models/Application';
import { Interview } from '../models/Interview';
import { CandidateProfile } from '../models/CandidateProfile';
import { Assessment } from '../models/Assessment';
import { Payment } from '../models/Payment';
import { Subscription } from '../models/Subscription';
import { Notification } from '../models/Notification';
import { Event } from '../models/Event';
import AiRecommendation from '../models/AiRecommendation';
import { PerformanceMetric, KPITarget, PerformanceAlert } from '../models/Performance';
import { Workflow } from '../models/Workflow';
import { File } from '../models/File';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { Report, ReportTemplate, ReportSchedule } from '../models/Report';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
  username: process.env.PGUSER || process.env.DB_USER || 'talentmatch_user',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'talentmatch_password',
  database: process.env.PGDATABASE || process.env.DB_NAME || 'talentmatch',
  synchronize: process.env.NODE_ENV === 'development' || process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Company,
    Job,
    CompanyUser,
    FeaturedJobPackage,
    Application,
    Interview,
    CandidateProfile,
    Assessment,
    Payment,
    Subscription,
    Notification,
    Event,
    AiRecommendation,
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
  subscribers: ['dist/database/subscribers/*.js'],
});

// Функція для ініціалізації бази даних
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ База даних успішно підключена');
    return true;
  } catch (error) {
    console.error('❌ Помилка підключення до бази даних:', error);
    throw error;
  }
};

// Функція для закриття з'єднання
export const closeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ З\'єднання з базою даних закрито');
    }
  } catch (error) {
    console.error('❌ Помилка закриття з\'єднання з базою даних:', error);
  }
};

// Функція для перевірки стану бази даних
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.query('SELECT 1');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Помилка перевірки здоров\'я бази даних:', error);
    return false;
  }
};

// Функція для отримання статистики бази даних
export const getDatabaseStats = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      throw new Error('База даних не ініціалізована');
    }

    const stats = {
      totalUsers: await AppDataSource.getRepository(User).count(),
      totalCompanies: await AppDataSource.getRepository(Company).count(),
      totalJobs: await AppDataSource.getRepository(Job).count(),
      totalApplications: await AppDataSource.getRepository(Application).count(),
      totalInterviews: await AppDataSource.getRepository(Interview).count(),
      totalPayments: await AppDataSource.getRepository(Payment).count(),
      totalSubscriptions: await AppDataSource.getRepository(Subscription).count(),
      totalAIMatches: 0, // Буде реалізовано пізніше
    };

    return stats;
  } catch (error) {
    console.error('❌ Помилка отримання статистики бази даних:', error);
    throw error;
  }
};
