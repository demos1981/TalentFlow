import { Request, Response } from 'express';
import { helpService } from '../services/helpService';
import { validateDto } from '../middleware/dtoValidation';
import { CreateHelpCategoryDto, UpdateHelpCategoryDto, CreateHelpArticleDto, UpdateHelpArticleDto, HelpSearchDto, HelpRatingDto, HelpStatsDto, HelpCategoryParamDto, HelpArticleParamDto } from '../dto/HelpDto';
import { UuidParamDto } from '../dto/CommonDto';

export const helpController = {
  /**
   * Отримання всіх категорій допомоги
   */
  async getHelpCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await helpService.getHelpCategories();
      
      res.status(200).json({
        success: true,
        message: 'Help categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      console.error('Error getting help categories:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting help categories',
        error: error.message
      });
    }
  },

  /**
   * Отримання категорії за ID
   */
  async getHelpCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UuidParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const { id } = req.params;
      const category = await helpService.getHelpCategoryById(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Help category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Help category retrieved successfully',
        data: category
      });
    } catch (error) {
      console.error('Error getting help category by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting help category',
        error: error.message
      });
    }
  },

  /**
   * Створення нової категорії допомоги
   */
  async createHelpCategory(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreateHelpCategoryDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const categoryData: CreateHelpCategoryDto = req.body;
      const category = await helpService.createHelpCategory(categoryData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Help category created successfully',
        data: category
      });
    } catch (error) {
      console.error('Error creating help category:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating help category',
        error: error.message
      });
    }
  },

  /**
   * Оновлення категорії допомоги
   */
  async updateHelpCategory(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateHelpCategoryDto, false)(req, res, () => {});
      if (validationResult) return;

      const { id } = req.params;
      const updateData: UpdateHelpCategoryDto = req.body;
      const category = await helpService.updateHelpCategory(id, updateData);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Help category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Help category updated successfully',
        data: category
      });
    } catch (error) {
      console.error('Error updating help category:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating help category',
        error: error.message
      });
    }
  },

  /**
   * Видалення категорії допомоги
   */
  async deleteHelpCategory(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UuidParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const { id } = req.params;
      const success = await helpService.deleteHelpCategory(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Help category not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Help category deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting help category:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting help category',
        error: error.message
      });
    }
  },

  /**
   * Отримання статей допомоги за категорією
   */
  async getHelpArticles(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpCategoryParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const { categoryId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const articles = await helpService.getHelpArticles(
        categoryId, 
        Number(page), 
        Number(limit)
      );
      
      res.status(200).json({
        success: true,
        message: 'Help articles retrieved successfully',
        data: articles
      });
    } catch (error) {
      console.error('Error getting help articles:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting help articles',
        error: error.message
      });
    }
  },

  /**
   * Отримання FAQ
   */
  async getFAQ(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const { page = 1, limit = 20, search, categoryId } = req.query;
      
      const faq = await helpService.getFAQ({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        categoryId: categoryId as string
      });
      
      res.status(200).json({
        success: true,
        message: 'FAQ retrieved successfully',
        data: faq
      });
    } catch (error) {
      console.error('Error getting FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting FAQ',
        error: error.message
      });
    }
  },

  /**
   * Отримання контактів підтримки
   */
  async getSupportContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await helpService.getSupportContacts();
      
      res.status(200).json({
        success: true,
        message: 'Support contacts retrieved successfully',
        data: contacts
      });
    } catch (error) {
      console.error('Error getting support contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting support contacts',
        error: error.message
      });
    }
  },

  /**
   * Пошук статей допомоги
   */
  async searchHelp(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const searchFilters: HelpSearchDto = req.query as any;
      const results = await helpService.searchHelp(searchFilters);
      
      res.status(200).json({
        success: true,
        message: 'Help search completed successfully',
        data: results
      });
    } catch (error) {
      console.error('Error searching help:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching help',
        error: error.message
      });
    }
  },

  /**
   * Отримання статті за ID
   */
  async getHelpArticleById(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpArticleParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const { articleId } = req.params;
      const article = await helpService.getHelpArticleById(articleId);
      
      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Help article not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Help article retrieved successfully',
        data: article
      });
    } catch (error) {
      console.error('Error getting help article by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting help article',
        error: error.message
      });
    }
  },

  /**
   * Створення нової статті допомоги
   */
  async createHelpArticle(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreateHelpArticleDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const articleData: CreateHelpArticleDto = req.body;
      const article = await helpService.createHelpArticle(articleData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Help article created successfully',
        data: article
      });
    } catch (error) {
      console.error('Error creating help article:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating help article',
        error: error.message
      });
    }
  },

  /**
   * Оновлення статті допомоги
   */
  async updateHelpArticle(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateHelpArticleDto, false)(req, res, () => {});
      if (validationResult) return;

      const { articleId } = req.params;
      const updateData: UpdateHelpArticleDto = req.body;
      const article = await helpService.updateHelpArticle(articleId, updateData);
      
      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Help article not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Help article updated successfully',
        data: article
      });
    } catch (error) {
      console.error('Error updating help article:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating help article',
        error: error.message
      });
    }
  },

  /**
   * Видалення статті допомоги
   */
  async deleteHelpArticle(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpArticleParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const { articleId } = req.params;
      const success = await helpService.deleteHelpArticle(articleId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Help article not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Help article deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting help article:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting help article',
        error: error.message
      });
    }
  },

  /**
   * Оцінювання статті допомоги
   */
  async rateHelp(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpRatingDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const ratingData: HelpRatingDto = req.body;
      const result = await helpService.rateHelp(ratingData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Rating saved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error rating help:', error);
      res.status(400).json({
        success: false,
        message: 'Error rating help',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики допомоги
   */
  async getHelpStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(HelpStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const statsFilters: HelpStatsDto = req.query as any;
      const stats = await helpService.getHelpStats(statsFilters);
      
      res.status(200).json({
        success: true,
        message: 'Help statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting help stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting help statistics',
        error: error.message
      });
    }
  }
};