import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Company } from '../models/Company';
import { User } from '../models/User';
import { Job, JobStatus } from '../models/Job';
import { BaseService } from './baseService';

export interface CompanySearchFilters {
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface CompanySearchResult {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: CompanySearchFilters;
}

export class CompanyService extends BaseService<Company> {
  private companyRepository: Repository<Company>;
  private userRepository: Repository<User>;
  private jobRepository: Repository<Job>;

  constructor() {
    super(AppDataSource.getRepository(Company));
    this.companyRepository = AppDataSource.getRepository(Company);
    this.userRepository = AppDataSource.getRepository(User);
    this.jobRepository = AppDataSource.getRepository(Job);
  }

  /**
   * Створення нової компанії
   */
  async createCompany(companyData: any, creatorId: string): Promise<Company> {
    try {
      const company = this.companyRepository.create({
        ...companyData,
        isActive: true,
        isVerified: false,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedCompany = await this.companyRepository.save(company);
      return Array.isArray(savedCompany) ? savedCompany[0] : savedCompany;
    } catch (error) {
      throw new Error(`Error creating company: ${error.message}`);
    }
  }

  /**
   * Пошук компаній з фільтрами
   */
  async searchCompanies(filters: CompanySearchFilters, page: number = 1, limit: number = 20): Promise<CompanySearchResult> {
    const offset = (page - 1) * limit;

    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'users')
      .where('company.isActive = :isActive', { isActive: true });

    // Фільтр по індустрії
      if (filters.industry) {
        queryBuilder.andWhere('company.industry ILIKE :industry', { industry: `%${filters.industry}%` });
      }

    // Фільтр по розміру
      if (filters.size) {
        queryBuilder.andWhere('company.size = :size', { size: filters.size });
      }

    // Фільтр по локації
      if (filters.location) {
        queryBuilder.andWhere('company.location ILIKE :location', { location: `%${filters.location}%` });
      }

    // Фільтр по активності
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('company.isActive = :isActive', { isActive: filters.isActive });
      }

    // Фільтр по верифікації
      if (filters.isVerified !== undefined) {
        queryBuilder.andWhere('company.isVerified = :isVerified', { isVerified: filters.isVerified });
      }

    // Сортування
    queryBuilder.orderBy('company.isVerified', 'DESC')
      .addOrderBy('company.createdAt', 'DESC');

      // Підрахунок загальної кількості
    const totalQuery = queryBuilder.clone();
    const total = await totalQuery.getCount();

    // Отримання результатів з пагінацією
    const companies = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      companies,
      total,
      page,
      limit,
      totalPages,
      filters
    };
  }

  /**
   * Отримання всіх компаній
   */
  async getAllCompanies(filters?: any): Promise<Company[]> {
    const queryBuilder = this.companyRepository.createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'users')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .where('company.isActive = :isActive', { isActive: true });

    if (filters?.isVerified !== undefined) {
      queryBuilder.andWhere('company.isVerified = :isVerified', { isVerified: filters.isVerified });
    }

    if (filters?.industry) {
      queryBuilder.andWhere('company.industry ILIKE :industry', { industry: `%${filters.industry}%` });
    }

    if (filters?.size) {
      queryBuilder.andWhere('company.size = :size', { size: filters.size });
    }

    if (filters?.location) {
      queryBuilder.andWhere('company.location ILIKE :location', { location: `%${filters.location}%` });
    }

    return await queryBuilder
      .orderBy('company.isVerified', 'DESC')
      .addOrderBy('company.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Отримання компанії за ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id, isActive: true },
      relations: ['users', 'jobs']
    });
  }

  /**
   * Оновлення компанії
   */
  async updateCompany(id: string, updateData: any): Promise<Company | null> {
    try {
      const company = await this.companyRepository.findOne({ where: { id, isActive: true } });
      
      if (!company) {
        return null;
      }

      Object.assign(company, updateData);
      company.updatedAt = new Date();
      
      return await this.companyRepository.save(company);
    } catch (error) {
      throw new Error(`Error updating company: ${error.message}`);
    }
  }

  /**
   * Видалення компанії
   */
  async deleteCompany(id: string): Promise<boolean> {
    try {
      const company = await this.companyRepository.findOne({ where: { id, isActive: true } });
      
      if (!company) {
        return false;
      }

      // М'яке видалення - встановлюємо isActive = false
      company.isActive = false;
      company.updatedAt = new Date();
      await this.companyRepository.save(company);
      
      return true;
    } catch (error) {
      throw new Error(`Error deleting company: ${error.message}`);
    }
  }

  /**
   * Верифікація компанії
   */
  async verifyCompany(id: string): Promise<Company | null> {
    try {
      const company = await this.companyRepository.findOne({ where: { id, isActive: true } });
      
      if (!company) {
        return null;
      }

      company.isVerified = true;
      company.verifiedAt = new Date();
      company.updatedAt = new Date();
      
      return await this.companyRepository.save(company);
    } catch (error) {
      throw new Error(`Error verifying company: ${error.message}`);
    }
  }

  /**
   * Отримання компаній по індустрії
   */
  async getCompaniesByIndustry(industry: string): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { industry, isActive: true },
      relations: ['users', 'jobs'],
      order: { isVerified: 'DESC', createdAt: 'DESC' }
    });
  }

  /**
   * Отримання компаній по розміру
   */
  async getCompaniesBySize(size: string): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { size: size as any, isActive: true },
      relations: ['users', 'jobs'],
      order: { isVerified: 'DESC', createdAt: 'DESC' }
    });
  }

  /**
   * Отримання верифікованих компаній
   */
  async getVerifiedCompanies(): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { isVerified: true, isActive: true },
      relations: ['users', 'jobs'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Отримання статистики компаній
   */
  async getCompanyStats(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    verifiedCompanies: number;
    companiesBySize: Array<{ size: string; count: number }>;
    companiesByIndustry: Array<{ industry: string; count: number }>;
    companiesByLocation: Array<{ location: string; count: number }>;
    averageEmployees: number;
    totalJobs: number;
  }> {
    const totalCompanies = await this.companyRepository.count();
    
    const activeCompanies = await this.companyRepository.count({
      where: { isActive: true }
    });

    const verifiedCompanies = await this.companyRepository.count({
      where: { isVerified: true, isActive: true }
    });

    // Статистика по розмірах
    const companiesBySize = await this.companyRepository
        .createQueryBuilder('company')
        .select('company.size', 'size')
        .addSelect('COUNT(*)', 'count')
      .where('company.isActive = :isActive', { isActive: true })
      .andWhere('company.size IS NOT NULL')
        .groupBy('company.size')
      .orderBy('count', 'DESC')
        .getRawMany();

    // Статистика по індустріях
    const companiesByIndustry = await this.companyRepository
        .createQueryBuilder('company')
        .select('company.industry', 'industry')
        .addSelect('COUNT(*)', 'count')
      .where('company.isActive = :isActive', { isActive: true })
      .andWhere('company.industry IS NOT NULL')
        .groupBy('company.industry')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Статистика по локаціях
    const companiesByLocation = await this.companyRepository
      .createQueryBuilder('company')
      .select('company.location', 'location')
      .addSelect('COUNT(*)', 'count')
      .where('company.isActive = :isActive', { isActive: true })
      .andWhere('company.location IS NOT NULL')
      .groupBy('company.location')
      .orderBy('count', 'DESC')
      .limit(10)
        .getRawMany();

    // Середня кількість співробітників (використовуємо розмір компанії)
    const avgEmployeesResult = await this.companyRepository
      .createQueryBuilder('company')
      .select('AVG(CASE WHEN company.size = \'startup\' THEN 10 WHEN company.size = \'small\' THEN 50 WHEN company.size = \'medium\' THEN 200 WHEN company.size = \'large\' THEN 1000 WHEN company.size = \'enterprise\' THEN 5000 ELSE 0 END)', 'averageEmployees')
      .where('company.isActive = :isActive', { isActive: true })
      .getRawOne();

    const averageEmployees = parseFloat(avgEmployeesResult?.averageEmployees || '0');

    // Загальна кількість вакансій
    const totalJobs = await this.jobRepository.count({
      where: { isActive: true }
      });

      return {
      totalCompanies,
      activeCompanies,
      verifiedCompanies,
      companiesBySize: companiesBySize.map(item => ({
        size: item.size,
        count: parseInt(item.count)
      })),
      companiesByIndustry: companiesByIndustry.map(item => ({
        industry: item.industry,
        count: parseInt(item.count)
      })),
      companiesByLocation: companiesByLocation.map(item => ({
        location: item.location,
        count: parseInt(item.count)
      })),
      averageEmployees: Math.round(averageEmployees),
      totalJobs
    };
  }

  /**
   * Отримання статистики вакансій компанії
   */
  async getCompanyJobsStats(companyId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    featuredJobs: number;
    normalJobs: number;
  }> {
    try {
      // Загальна кількість вакансій
      const totalJobs = await this.jobRepository.count({
        where: { companyId, isActive: true }
      });

      // Активні вакансії
      const activeJobs = await this.jobRepository.count({
        where: { companyId, isActive: true, status: JobStatus.ACTIVE }
      });

      // Гарячі вакансії (з featuredUntil > поточна дата)
      const now = new Date();
      const featuredJobs = await this.jobRepository
        .createQueryBuilder('job')
        .where('job.companyId = :companyId', { companyId })
        .andWhere('job.isActive = :isActive', { isActive: true })
        .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
        .andWhere('job.featuredUntil IS NOT NULL')
        .andWhere('job.featuredUntil > :now', { now })
        .getCount();

      // Звичайні вакансії
      const normalJobs = activeJobs - featuredJobs;

      return {
        totalJobs,
        activeJobs,
        featuredJobs,
        normalJobs
      };
    } catch (error: any) {
      console.error('Error getting company jobs stats:', error);
      throw new Error(`Failed to get company jobs stats: ${error.message}`);
    }
  }
}

export const companyService = new CompanyService();