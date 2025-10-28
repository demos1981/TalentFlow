import { Router } from 'express';
import { helpController } from '../controllers/helpController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';
import { validateDto } from '../middleware/dtoValidation';
import { CreateHelpCategoryDto, UpdateHelpCategoryDto, CreateHelpArticleDto, UpdateHelpArticleDto, HelpSearchDto, HelpRatingDto, HelpStatsDto, HelpCategoryParamDto, HelpArticleParamDto } from '../dto/HelpDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Публічні маршрути (не потребують авторизації)
// Категорії допомоги
router.get('/categories', helpController.getHelpCategories);
router.get('/categories/:id',
  validateDto(UuidParamDto, true),
  helpController.getHelpCategoryById
);

// Статті допомоги
router.get('/articles/:categoryId',
  validateDto(HelpCategoryParamDto, true),
  helpController.getHelpArticles
);
router.get('/articles/article/:articleId',
  validateDto(HelpArticleParamDto, true),
  helpController.getHelpArticleById
);

// FAQ та пошук
router.get('/faq',
  validateDto(HelpSearchDto, true),
  helpController.getFAQ
);
router.get('/search',
  validateDto(HelpSearchDto, true),
  helpController.searchHelp
);

// Контакти підтримки
router.get('/support-contacts', helpController.getSupportContacts);

// Статистика (публічна)
router.get('/stats',
  validateDto(HelpStatsDto, true),
  helpController.getHelpStats
);

// Авторизовані маршрути
// Оцінювання
router.post('/rate',
  authenticateToken,
  validateDto(HelpRatingDto, false),
  helpController.rateHelp
);

// Адміністративні маршрути (тільки для адмінів)
// Управління категоріями
router.post('/categories',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  validateDto(CreateHelpCategoryDto, false),
  helpController.createHelpCategory
);
router.put('/categories/:id',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  validateDto(UpdateHelpCategoryDto, false),
  helpController.updateHelpCategory
);
router.delete('/categories/:id',
  authenticateToken,
  requireRole(['admin']),
  validateDto(UuidParamDto, true),
  helpController.deleteHelpCategory
);

// Управління статтями
router.post('/articles',
  authenticateToken,
  requireRole(['admin', 'moderator', 'content_creator']),
  validateDto(CreateHelpArticleDto, false),
  helpController.createHelpArticle
);
router.put('/articles/:articleId',
  authenticateToken,
  requireRole(['admin', 'moderator', 'content_creator']),
  validateDto(UpdateHelpArticleDto, false),
  helpController.updateHelpArticle
);
router.delete('/articles/:articleId',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  validateDto(HelpArticleParamDto, true),
  helpController.deleteHelpArticle
);

export default router;