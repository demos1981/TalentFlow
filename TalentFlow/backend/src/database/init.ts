import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Company } from '../models/Company';
import { Job, JobStatus, ExperienceLevel, JobType } from '../models/Job';
import bcrypt from 'bcryptjs';

export const initializeDatabaseData = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Створюємо базові дані тільки якщо база порожня
    const userCount = await AppDataSource.getRepository(User).count();
    if (userCount === 0) {
      console.log('🌱 Ініціалізація базових даних...');

      // Створюємо адміністратора
      const adminPassword = await bcrypt.hash('admin123', 12);
      const admin = AppDataSource.getRepository(User).create({
        email: 'admin@talentmatch.pro',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date()
      });
      await AppDataSource.getRepository(User).save(admin);

      // Створюємо тестову компанію
      const company = AppDataSource.getRepository(Company).create({
        name: 'TechCorp Solutions',
        description: 'Інноваційна IT компанія, що спеціалізується на розробці програмного забезпечення',
        industry: 'Technology',
        size: 'medium',
        founded: 2020,
        location: 'Київ, Україна',
        address: 'вул. Хрещатик, 1',
        phone: '+380441234567',
        email: 'info@techcorp.ua',
        isActive: true,
        isVerified: true,
        verifiedAt: new Date()
      });
      await AppDataSource.getRepository(Company).save(company);

      // Створюємо тестового роботодавця
      const employerPassword = await bcrypt.hash('employer123', 12);
      const employer = AppDataSource.getRepository(User).create({
        email: 'employer@techcorp.ua',
        password: employerPassword,
        firstName: 'Іван',
        lastName: 'Петренко',
        role: UserRole.EMPLOYER,
        companyId: company.id,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date()
      });
      await AppDataSource.getRepository(User).save(employer);

      // Створюємо тестову вакансію
      const jobData = {
        title: 'Senior Full Stack Developer',
        description: 'Шукаємо досвідченого Full Stack розробника для роботи над інноваційними проектами',
        companyId: company.id,
        requirements: 'Досвід роботи 5+ років, Знання Node.js, React, TypeScript, Досвід роботи з PostgreSQL, Знання Docker та CI/CD',
        skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
        location: 'Київ, Україна',
        type: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.FROM_3_TO_5,
        salaryMin: 4000,
        salaryMax: 8000,
        currency: 'USD',
        industry: 'Інформаційні технології (IT)',
        tags: ['Full Stack', 'Senior', 'React', 'Node.js'],
        benefits: 'Медичне страхування, Гнучкий графік, Віддалена робота',
        status: JobStatus.ACTIVE,
        createdByUserId: employer.id
      };
      const job = AppDataSource.getRepository(Job).create(jobData);
      await AppDataSource.getRepository(Job).save(job);

      // Створюємо тестового кандидата
      const candidatePassword = await bcrypt.hash('candidate123', 12);
      const candidate = AppDataSource.getRepository(User).create({
        email: 'candidate@example.com',
        password: candidatePassword,
        firstName: 'Марія',
        lastName: 'Іваненко',
        role: UserRole.CANDIDATE,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        experience: 3,
        location: 'Київ, Україна'
      });
      await AppDataSource.getRepository(User).save(candidate);

      console.log('✅ Базові дані успішно створені');
    } else {
      console.log('ℹ️ База даних вже містить дані, пропускаємо ініціалізацію');
    }
  } catch (error) {
    console.error('❌ Помилка ініціалізації базових даних:', error);
    throw error;
  }
};

export const clearDatabaseData = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log('🗑️ Очищення бази даних...');

    // Видаляємо дані в зворотному порядку через foreign keys
    await AppDataSource.getRepository(Job).clear();
    await AppDataSource.getRepository(Company).clear();
    await AppDataSource.getRepository(User).clear();

    console.log('✅ База даних очищена');
  } catch (error) {
    console.error('❌ Помилка очищення бази даних:', error);
    throw error;
  }
};
