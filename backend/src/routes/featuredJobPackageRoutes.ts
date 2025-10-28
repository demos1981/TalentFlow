import { Router } from 'express';
import { featuredJobPackageController } from '../controllers/featuredJobPackageController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { 
  PurchasePackageDto,
  ActivateFeaturedJobDto,
  DeactivateFeaturedJobDto,
  CalculatePriceDto
} from '../dto/FeaturedJobPackageDto';

const router = Router();

// Всі роути вимагають автентифікації
router.use(authenticateToken);

// Розрахунок ціни
router.post('/calculate-price', 
  validateDto(CalculatePriceDto), 
  featuredJobPackageController.calculatePrice
);

// Купівля пакету
router.post('/purchase', 
  validateDto(PurchasePackageDto), 
  featuredJobPackageController.purchasePackage
);

// Отримання пакетів користувача
router.get('/my-packages', 
  featuredJobPackageController.getUserPackages
);

// Статистика
router.get('/stats', 
  featuredJobPackageController.getPackageStats
);

// Активація гарячої вакансії
router.post('/activate', 
  validateDto(ActivateFeaturedJobDto), 
  featuredJobPackageController.activateFeaturedJob
);

// Деактивація гарячої вакансії
router.post('/deactivate', 
  validateDto(DeactivateFeaturedJobDto), 
  featuredJobPackageController.deactivateFeaturedJob
);

export default router;

