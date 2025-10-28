import { Request, Response } from 'express';
import { featuredJobPackageService } from '../services/featuredJobPackageService';
import { 
  PurchasePackageDto,
  ActivateFeaturedJobDto,
  DeactivateFeaturedJobDto,
  CalculatePriceDto
} from '../dto/FeaturedJobPackageDto';
import { validateDto } from '../middleware/dtoValidation';

export const featuredJobPackageController = {
  /**
   * Розрахунок ціни пакету (для превью перед купівлею)
   */
  async calculatePrice(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CalculatePriceDto)(req, res, () => {});
      if (validationResult) return;

      const { quantity } = req.body;
      const pricing = featuredJobPackageService.calculatePackagePrice(quantity);

      res.status(200).json({
        success: true,
        data: pricing
      });
    } catch (error) {
      console.error('Error calculating price:', error);
      res.status(400).json({
        success: false,
        message: 'Error calculating price',
        error: error.message
      });
    }
  },

  /**
   * Купівля пакету гарячих вакансій
   */
  async purchasePackage(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(PurchasePackageDto)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      const companyId = (req as any).user?.companyId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { quantity, validityDays } = req.body;

      // TODO: Інтеграція з платіжною системою
      // Поки що створюємо пакет одразу
      const pkg = await featuredJobPackageService.createPackage(
        userId,
        companyId,
        quantity,
        validityDays || 30
      );

      res.status(201).json({
        success: true,
        message: 'Package purchased successfully',
        data: pkg
      });
    } catch (error) {
      console.error('Error purchasing package:', error);
      res.status(400).json({
        success: false,
        message: 'Error purchasing package',
        error: error.message
      });
    }
  },

  /**
   * Отримання пакетів користувача
   */
  async getUserPackages(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const packages = await featuredJobPackageService.getUserPackages(userId);

      res.status(200).json({
        success: true,
        data: packages
      });
    } catch (error) {
      console.error('Error getting packages:', error);
      res.status(400).json({
        success: false,
        message: 'Error getting packages',
        error: error.message
      });
    }
  },

  /**
   * Статистика по пакетах
   */
  async getPackageStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const stats = await featuredJobPackageService.getUserPackageStats(userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(400).json({
        success: false,
        message: 'Error getting stats',
        error: error.message
      });
    }
  },

  /**
   * Активація гарячої вакансії
   */
  async activateFeaturedJob(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ActivateFeaturedJobDto)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      const { jobId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const result = await featuredJobPackageService.useFeaturedJob(userId, jobId);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.package
      });
    } catch (error) {
      console.error('Error activating featured job:', error);
      res.status(400).json({
        success: false,
        message: 'Error activating featured job',
        error: error.message
      });
    }
  },

  /**
   * Деактивація гарячої вакансії
   */
  async deactivateFeaturedJob(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(DeactivateFeaturedJobDto)(req, res, () => {});
      if (validationResult) return;

      const { jobId } = req.body;

      const result = await featuredJobPackageService.deactivateFeaturedJob(jobId);

      res.status(200).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error('Error deactivating featured job:', error);
      res.status(400).json({
        success: false,
        message: 'Error deactivating featured job',
        error: error.message
      });
    }
  }
};

