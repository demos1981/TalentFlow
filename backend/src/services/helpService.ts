import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { HelpCategory } from '../models/HelpCategory';
import { HelpArticle } from '../models/HelpArticle';
import { HelpRating } from '../models/HelpRating';
import {
  CreateHelpCategoryDto,
  UpdateHelpCategoryDto,
  CreateHelpArticleDto,
  UpdateHelpArticleDto,
  HelpSearchDto,
  HelpRatingDto,
  HelpStatsDto
} from '../dto/HelpDto';
import { HelpType, HelpStatus } from '../models/HelpArticle';

export class HelpService {
  private userRepository: Repository<User>;
  private helpCategoryRepository: Repository<HelpCategory>;
  private helpArticleRepository: Repository<HelpArticle>;
  private helpRatingRepository: Repository<HelpRating>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.helpCategoryRepository = AppDataSource.getRepository(HelpCategory);
    this.helpArticleRepository = AppDataSource.getRepository(HelpArticle);
    this.helpRatingRepository = AppDataSource.getRepository(HelpRating);
  }

  /**
   * Отримання всіх категорій допомоги
   */
  async getHelpCategories(): Promise<HelpCategory[]> {
    try {
      return await this.helpCategoryRepository.find({
        where: { isActive: true },
        order: { order: 'ASC', createdAt: 'ASC' }
      });
    } catch (error) {
      console.error('Error getting help categories:', error);
      throw new Error(`Failed to get help categories: ${error.message}`);
    }
  }

  /**
   * Отримання категорії за ID
   */
  async getHelpCategoryById(id: string): Promise<HelpCategory | null> {
    try {
      return await this.helpCategoryRepository.findOne({
        where: { id, isActive: true },
        relations: ['articles']
      });
    } catch (error) {
      console.error('Error getting help category by ID:', error);
      throw new Error(`Failed to get help category: ${error.message}`);
    }
  }

  /**
   * Створення нової категорії допомоги
   */
  async createHelpCategory(categoryData: CreateHelpCategoryDto, userId: string): Promise<HelpCategory> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const category = this.helpCategoryRepository.create({
        ...categoryData,
        slug: categoryData.slug || this.generateSlug(categoryData.name)
      });

      return await this.helpCategoryRepository.save(category);
    } catch (error) {
      console.error('Error creating help category:', error);
      throw new Error(`Failed to create help category: ${error.message}`);
    }
  }

  /**
   * Оновлення категорії допомоги
   */
  async updateHelpCategory(id: string, updateData: UpdateHelpCategoryDto): Promise<HelpCategory | null> {
    try {
      const category = await this.helpCategoryRepository.findOne({ where: { id } });
      if (!category) {
        return null;
      }

      if (updateData.name && !updateData.slug) {
        updateData.slug = this.generateSlug(updateData.name);
      }

      Object.assign(category, updateData);
      return await this.helpCategoryRepository.save(category);
    } catch (error) {
      console.error('Error updating help category:', error);
      throw new Error(`Failed to update help category: ${error.message}`);
    }
  }

  /**
   * Видалення категорії допомоги
   */
  async deleteHelpCategory(id: string): Promise<boolean> {
    try {
      const category = await this.helpCategoryRepository.findOne({ where: { id } });
      if (!category) {
        return false;
      }

      await this.helpCategoryRepository.remove(category);
      return true;
    } catch (error) {
      console.error('Error deleting help category:', error);
      throw new Error(`Failed to delete help category: ${error.message}`);
    }
  }

  /**
   * Отримання статей допомоги за категорією
   */
  async getHelpArticles(categoryId: string, page: number = 1, limit: number = 20): Promise<{
    articles: HelpArticle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      const [articles, total] = await this.helpArticleRepository.findAndCount({
        where: {
          categoryId,
          status: HelpStatus.PUBLISHED,
          isPublic: true
        },
        relations: ['category', 'createdBy'],
        order: { order: 'ASC', createdAt: 'DESC' },
        skip: offset,
        take: limit
      });

      return {
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting help articles:', error);
      throw new Error(`Failed to get help articles: ${error.message}`);
    }
  }

  /**
   * Отримання FAQ
   */
  async getFAQ(filters: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }): Promise<{
    articles: HelpArticle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const { page = 1, limit = 20, search, categoryId } = filters;
      const offset = (page - 1) * limit;

      const queryBuilder = this.helpArticleRepository.createQueryBuilder('article')
        .leftJoinAndSelect('article.category', 'category')
        .leftJoinAndSelect('article.createdBy', 'createdBy')
        .where('article.type = :type', { type: HelpType.FAQ })
        .andWhere('article.status = :status', { status: HelpStatus.PUBLISHED })
        .andWhere('article.isPublic = :isPublic', { isPublic: true });

      if (categoryId) {
        queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });
      }

      if (search) {
        queryBuilder.andWhere(
          '(article.title ILIKE :search OR article.description ILIKE :search OR article.content ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      const [articles, total] = await queryBuilder
        .orderBy('article.order', 'ASC')
        .addOrderBy('article.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return {
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting FAQ:', error);
      throw new Error(`Failed to get FAQ: ${error.message}`);
    }
  }

  /**
   * Отримання контактів підтримки
   */
  async getSupportContacts(): Promise<any[]> {
    try {
      // Повертаємо статичні контакти підтримки
      return [
        {
          id: '1',
          name: 'Технічна підтримка',
          email: 'support@talentflow.com',
          phone: '+380 44 123 45 67',
          department: 'Технічна підтримка',
          description: 'Допомога з технічними питаннями',
          workingHours: ['Пн-Пт: 9:00-18:00', 'Сб: 10:00-16:00'],
          isActive: true,
          order: 1
        },
        {
          id: '2',
          name: 'HR підтримка',
          email: 'hr@talentflow.com',
          phone: '+380 44 123 45 68',
          department: 'HR відділ',
          description: 'Допомога з HR питаннями',
          workingHours: ['Пн-Пт: 10:00-17:00'],
          isActive: true,
          order: 2
        }
      ];
    } catch (error) {
      console.error('Error getting support contacts:', error);
      throw new Error(`Failed to get support contacts: ${error.message}`);
    }
  }

  /**
   * Пошук статей допомоги
   */
  async searchHelp(filters: HelpSearchDto): Promise<{
    articles: HelpArticle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        type,
        status,
        priority,
        categoryId,
        tags,
        isFeatured,
        isPublic,
        createdById,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = filters;

      const offset = (page - 1) * limit;

      const queryBuilder = this.helpArticleRepository.createQueryBuilder('article')
        .leftJoinAndSelect('article.category', 'category')
        .leftJoinAndSelect('article.createdBy', 'createdBy')
        .where('1=1');

      if (search) {
        queryBuilder.andWhere(
          '(article.title ILIKE :search OR article.description ILIKE :search OR article.content ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (type) {
        queryBuilder.andWhere('article.type = :type', { type });
      }

      if (status) {
        queryBuilder.andWhere('article.status = :status', { status });
      }

      if (priority) {
        queryBuilder.andWhere('article.priority = :priority', { priority });
      }

      if (categoryId) {
        queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });
      }

      if (tags && tags.length > 0) {
        queryBuilder.andWhere('article.tags && :tags', { tags });
      }

      if (isFeatured !== undefined) {
        queryBuilder.andWhere('article.isFeatured = :isFeatured', { isFeatured });
      }

      if (isPublic !== undefined) {
        queryBuilder.andWhere('article.isPublic = :isPublic', { isPublic });
      }

      if (createdById) {
        queryBuilder.andWhere('article.createdById = :createdById', { createdById });
      }

      const [articles, total] = await queryBuilder
        .orderBy(`article.${sortBy}`, sortOrder)
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return {
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error searching help:', error);
      throw new Error(`Failed to search help: ${error.message}`);
    }
  }

  /**
   * Отримання статті за ID
   */
  async getHelpArticleById(id: string): Promise<HelpArticle | null> {
    try {
      return await this.helpArticleRepository.findOne({
        where: { id },
        relations: ['category', 'createdBy', 'ratings']
      });
    } catch (error) {
      console.error('Error getting help article by ID:', error);
      throw new Error(`Failed to get help article: ${error.message}`);
    }
  }

  /**
   * Створення нової статті допомоги
   */
  async createHelpArticle(articleData: CreateHelpArticleDto, userId: string): Promise<HelpArticle> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const article = this.helpArticleRepository.create({
        ...articleData,
        createdById: userId,
        slug: articleData.slug || this.generateSlug(articleData.title)
      });

      return await this.helpArticleRepository.save(article);
    } catch (error) {
      console.error('Error creating help article:', error);
      throw new Error(`Failed to create help article: ${error.message}`);
    }
  }

  /**
   * Оновлення статті допомоги
   */
  async updateHelpArticle(id: string, updateData: UpdateHelpArticleDto): Promise<HelpArticle | null> {
    try {
      const article = await this.helpArticleRepository.findOne({ where: { id } });
      if (!article) {
        return null;
      }

      if (updateData.title && !updateData.slug) {
        updateData.slug = this.generateSlug(updateData.title);
      }

      Object.assign(article, updateData);
      return await this.helpArticleRepository.save(article);
    } catch (error) {
      console.error('Error updating help article:', error);
      throw new Error(`Failed to update help article: ${error.message}`);
    }
  }

  /**
   * Видалення статті допомоги
   */
  async deleteHelpArticle(id: string): Promise<boolean> {
    try {
      const article = await this.helpArticleRepository.findOne({ where: { id } });
      if (!article) {
        return false;
      }

      await this.helpArticleRepository.remove(article);
      return true;
    } catch (error) {
      console.error('Error deleting help article:', error);
      throw new Error(`Failed to delete help article: ${error.message}`);
    }
  }

  /**
   * Оцінювання статті допомоги
   */
  async rateHelp(ratingData: HelpRatingDto, userId: string): Promise<HelpRating> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const article = await this.helpArticleRepository.findOne({ where: { id: ratingData.helpId } });
      if (!article) {
        throw new Error('Help article not found');
      }

      // Перевіряємо, чи користувач вже оцінював цю статтю
      const existingRating = await this.helpRatingRepository.findOne({
        where: { helpId: ratingData.helpId, userId }
      });

      if (existingRating) {
        // Оновлюємо існуючу оцінку
        existingRating.rating = ratingData.rating;
        existingRating.comment = ratingData.comment;
        existingRating.wasHelpful = ratingData.wasHelpful;
        existingRating.metadata = ratingData.metadata;

        const savedRating = await this.helpRatingRepository.save(existingRating);
        await this.updateArticleRating(article.id);
        return savedRating;
      } else {
        // Створюємо нову оцінку
        const rating = this.helpRatingRepository.create({
          ...ratingData,
          userId
        });

        const savedRating = await this.helpRatingRepository.save(rating);
        await this.updateArticleRating(article.id);
        return savedRating;
      }
    } catch (error) {
      console.error('Error rating help:', error);
      throw new Error(`Failed to rate help: ${error.message}`);
    }
  }

  /**
   * Оновлення рейтингу статті
   */
  private async updateArticleRating(articleId: string): Promise<void> {
    try {
      const ratings = await this.helpRatingRepository.find({
        where: { helpId: articleId }
      });

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
        : 0;

      const helpfulCount = ratings.filter(rating => rating.wasHelpful === true).length;
      const notHelpfulCount = ratings.filter(rating => rating.wasHelpful === false).length;

      await this.helpArticleRepository.update(articleId, {
        rating: Math.round(averageRating * 100) / 100,
        ratingCount: ratings.length,
        helpfulCount,
        notHelpfulCount
      });
    } catch (error) {
      console.error('Error updating article rating:', error);
    }
  }

  /**
   * Отримання статистики допомоги
   */
  async getHelpStats(statsDto: HelpStatsDto): Promise<any> {
    try {
      const queryBuilder = this.helpArticleRepository.createQueryBuilder('article');

      if (statsDto.categoryId) {
        queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId: statsDto.categoryId });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('article.type = :type', { type: statsDto.type });
      }

      if (statsDto.status) {
        queryBuilder.andWhere('article.status = :status', { status: statsDto.status });
      }

      if (statsDto.dateFrom && statsDto.dateTo) {
        queryBuilder.andWhere('article.createdAt BETWEEN :dateFrom AND :dateTo', {
          dateFrom: statsDto.dateFrom,
          dateTo: statsDto.dateTo
        });
      }

      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        averageRating,
        totalViews,
        totalRatings
      ] = await Promise.all([
        queryBuilder.getCount(),
        queryBuilder.clone().andWhere('article.status = :status', { status: HelpStatus.PUBLISHED }).getCount(),
        queryBuilder.clone().andWhere('article.status = :status', { status: HelpStatus.DRAFT }).getCount(),
        queryBuilder.clone().select('AVG(article.rating)', 'avgRating').getRawOne(),
        queryBuilder.clone().select('SUM(article.viewCount)', 'totalViews').getRawOne(),
        queryBuilder.clone().select('SUM(article.ratingCount)', 'totalRatings').getRawOne()
      ]);

      return {
        totalArticles,
        publishedArticles,
        draftArticles,
        averageRating: parseFloat(averageRating?.avgRating || '0'),
        totalViews: parseInt(totalViews?.totalViews || '0'),
        totalRatings: parseInt(totalRatings?.totalRatings || '0'),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting help stats:', error);
      throw new Error(`Failed to get help stats: ${error.message}`);
    }
  }

  /**
   * Генерація slug з тексту
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const helpService = new HelpService();