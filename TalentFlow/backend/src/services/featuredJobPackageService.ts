import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { FeaturedJobPackage, PackageType, PackageStatus } from '../models/FeaturedJobPackage';
import { Job } from '../models/Job';

// Тарифи для різних пакетів
const PACKAGE_PRICING = {
  pricePerJob: 25, // Базова ціна за одну гарячу вакансію в USD
  
  // Знижки при купівлі пакетів
  discounts: [
    { minJobs: 30, discount: 20 },
    { minJobs: 20, discount: 15 },
    { minJobs: 15, discount: 10 },
    { minJobs: 10, discount: 8 },
    { minJobs: 5, discount: 5 },
    { minJobs: 1, discount: 0 }
  ]
};

export class FeaturedJobPackageService {
  private packageRepository: Repository<FeaturedJobPackage>;
  private jobRepository: Repository<Job>;

  constructor() {
    this.packageRepository = AppDataSource.getRepository(FeaturedJobPackage);
    this.jobRepository = AppDataSource.getRepository(Job);
  }

  /**
   * Розрахунок ціни пакету з автоматичними знижками
   */
  calculatePackagePrice(quantity: number): {
    originalPrice: number;
    discountPercent: number;
    discountAmount: number;
    finalPrice: number;
    pricePerJob: number;
  } {
    const pricePerJob = PACKAGE_PRICING.pricePerJob;
    const originalPrice = quantity * pricePerJob;

    // Знаходимо відповідну знижку
    const discount = PACKAGE_PRICING.discounts.find(d => quantity >= d.minJobs);
    const discountPercent = discount ? discount.discount : 0;

    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;

    return {
      originalPrice,
      discountPercent,
      discountAmount,
      finalPrice,
      pricePerJob
    };
  }

  /**
   * Створення пакету гарячих вакансій
   */
  async createPackage(
    userId: string,
    companyId: string | undefined,
    quantity: number,
    validityDays: number = 30
  ): Promise<FeaturedJobPackage> {
    try {
      const pricing = this.calculatePackagePrice(quantity);

      // Визначаємо тип пакету за кількістю
      let packageType = PackageType.FREE;
      if (quantity >= 30) packageType = PackageType.ENTERPRISE;
      else if (quantity >= 15) packageType = PackageType.PREMIUM;
      else if (quantity >= 10) packageType = PackageType.BUSINESS;
      else if (quantity >= 5) packageType = PackageType.STARTER;
      else if (quantity > 0) packageType = PackageType.STARTER;

      const expiryDate = validityDays > 0 
        ? new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
        : null;

      const pkg = this.packageRepository.create({
        userId,
        companyId,
        packageType,
        packageName: `Пакет ${quantity} гарячих вакансій`,
        totalFeaturedJobs: quantity,
        usedFeaturedJobs: 0,
        remainingFeaturedJobs: quantity,
        pricePerJob: pricing.pricePerJob,
        originalPrice: pricing.originalPrice,
        discountPercent: pricing.discountPercent,
        discountAmount: pricing.discountAmount,
        finalPrice: pricing.finalPrice,
        currency: 'USD',
        status: PackageStatus.ACTIVE,
        startDate: new Date(),
        expiryDate,
        validityDays
      });

      return await this.packageRepository.save(pkg);
    } catch (error) {
      throw new Error(`Error creating package: ${error.message}`);
    }
  }

  /**
   * Отримання активних пакетів користувача
   */
  async getUserPackages(userId: string): Promise<FeaturedJobPackage[]> {
    try {
      return await this.packageRepository.find({
        where: { 
          userId, 
          status: PackageStatus.ACTIVE 
        },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new Error(`Error getting user packages: ${error.message}`);
    }
  }

  /**
   * Використання гарячої вакансії з пакету
   */
  async useFeaturedJob(userId: string, jobId: string): Promise<{
    success: boolean;
    package: FeaturedJobPackage | null;
    message: string;
  }> {
    try {
      // Шукаємо активний пакет з доступними вакансіями
      const packages = await this.packageRepository
        .createQueryBuilder('pkg')
        .where('pkg.userId = :userId', { userId })
        .andWhere('pkg.status = :status', { status: PackageStatus.ACTIVE })
        .andWhere('pkg.remainingFeaturedJobs > 0')
        .andWhere('(pkg.expiryDate IS NULL OR pkg.expiryDate > :now)', { now: new Date() })
        .orderBy('pkg.expiryDate', 'ASC', 'NULLS LAST') // Спочатку використовуємо пакети що скоро закінчуються
        .getMany();

      if (packages.length === 0) {
        return {
          success: false,
          package: null,
          message: 'No active packages available'
        };
      }

      const pkg = packages[0];

      // Оновлюємо лічильники пакету
      pkg.usedFeaturedJobs += 1;
      pkg.remainingFeaturedJobs -= 1;

      if (pkg.remainingFeaturedJobs === 0) {
        pkg.status = PackageStatus.USED;
      }

      // Додаємо jobId до метаданих
      if (!pkg.metadata) {
        pkg.metadata = {};
      }
      if (!pkg.metadata.activatedJobIds) {
        pkg.metadata.activatedJobIds = [];
      }
      pkg.metadata.activatedJobIds.push(jobId);

      await this.packageRepository.save(pkg);

      // Оновлюємо вакансію
      const job = await this.jobRepository.findOne({ where: { id: jobId } });
      if (job) {
        job.isFeatured = true;
        job.featuredUntil = pkg.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів якщо не вказано
        job.featuredPackageId = pkg.id;
        await this.jobRepository.save(job);
      }

      return {
        success: true,
        package: pkg,
        message: 'Featured job activated successfully'
      };
    } catch (error) {
      throw new Error(`Error using featured job: ${error.message}`);
    }
  }

  /**
   * Деактивація гарячої вакансії (повернення в пакет)
   */
  async deactivateFeaturedJob(jobId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const job = await this.jobRepository.findOne({ where: { id: jobId } });
      
      if (!job || !job.isFeatured) {
        return {
          success: false,
          message: 'Job is not featured'
        };
      }

      // Знаходимо пакет
      if (job.featuredPackageId) {
        const pkg = await this.packageRepository.findOne({ 
          where: { id: job.featuredPackageId } 
        });

        if (pkg) {
          // Повертаємо вакансію в пакет
          pkg.usedFeaturedJobs -= 1;
          pkg.remainingFeaturedJobs += 1;
          pkg.status = PackageStatus.ACTIVE;

          // Видаляємо з метаданих
          if (pkg.metadata?.activatedJobIds) {
            pkg.metadata.activatedJobIds = pkg.metadata.activatedJobIds.filter(id => id !== jobId);
          }

          await this.packageRepository.save(pkg);
        }
      }

      // Оновлюємо вакансію
      job.isFeatured = false;
      job.featuredUntil = null;
      job.featuredPackageId = null;
      await this.jobRepository.save(job);

      return {
        success: true,
        message: 'Featured job deactivated successfully'
      };
    } catch (error) {
      throw new Error(`Error deactivating featured job: ${error.message}`);
    }
  }

  /**
   * Перевірка та автоматичне закінчення застарілих пакетів
   */
  async expireOldPackages(): Promise<number> {
    try {
      const expiredPackages = await this.packageRepository
        .createQueryBuilder('pkg')
        .where('pkg.status = :status', { status: PackageStatus.ACTIVE })
        .andWhere('pkg.expiryDate IS NOT NULL')
        .andWhere('pkg.expiryDate < :now', { now: new Date() })
        .getMany();

      for (const pkg of expiredPackages) {
        pkg.status = PackageStatus.EXPIRED;
        await this.packageRepository.save(pkg);

        // Деактивуємо всі активні гарячі вакансії з цього пакету
        if (pkg.metadata?.activatedJobIds) {
          for (const jobId of pkg.metadata.activatedJobIds) {
            await this.deactivateFeaturedJob(jobId);
          }
        }
      }

      return expiredPackages.length;
    } catch (error) {
      throw new Error(`Error expiring packages: ${error.message}`);
    }
  }

  /**
   * Статистика по пакетах користувача
   */
  async getUserPackageStats(userId: string): Promise<{
    totalPackages: number;
    activePackages: number;
    totalFeaturedJobs: number;
    usedFeaturedJobs: number;
    remainingFeaturedJobs: number;
    totalSpent: number;
  }> {
    try {
      const packages = await this.packageRepository.find({
        where: { userId }
      });

      const activePackages = packages.filter(p => p.status === PackageStatus.ACTIVE);

      const stats = packages.reduce((acc, p) => ({
        totalFeaturedJobs: acc.totalFeaturedJobs + p.totalFeaturedJobs,
        usedFeaturedJobs: acc.usedFeaturedJobs + p.usedFeaturedJobs,
        totalSpent: acc.totalSpent + Number(p.finalPrice)
      }), { totalFeaturedJobs: 0, usedFeaturedJobs: 0, totalSpent: 0 });

      const remainingFeaturedJobs = activePackages.reduce((sum, p) => sum + p.remainingFeaturedJobs, 0);

      return {
        totalPackages: packages.length,
        activePackages: activePackages.length,
        totalFeaturedJobs: stats.totalFeaturedJobs,
        usedFeaturedJobs: stats.usedFeaturedJobs,
        remainingFeaturedJobs,
        totalSpent: stats.totalSpent
      };
    } catch (error) {
      throw new Error(`Error getting user package stats: ${error.message}`);
    }
  }
}

export const featuredJobPackageService = new FeaturedJobPackageService();

