import { Request, Response } from 'express';
import { jobParsingService, JobParsingResult } from '../services/jobParsingService';

export const jobParsingController = {
  /**
   * Парсинг вакансії з зовнішнього сайту
   */
  async parseJobFromUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;
      
      if (!url) {
        res.status(400).json({
          success: false,
          message: 'URL є обов\'язковим параметром'
        });
        return;
      }

      // Валідація URL
      try {
        new URL(url);
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Невірний формат URL'
        });
        return;
      }

      console.log(`🔍 Парсинг вакансії з URL: ${url}`);
      
      const result: JobParsingResult = await jobParsingService.parseJobFromUrl(url);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Помилка парсингу вакансії',
          platform: result.platform
        });
        return;
      }

      res.json({
        success: true,
        message: 'Вакансію успішно спарсено',
        data: result.data,
        platform: result.platform
      });
    } catch (error) {
      console.error('Error in parseJobFromUrl:', error);
      res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера',
        error: error.message
      });
    }
  },

  /**
   * Перевірка підтримуваних платформ
   */
  async getSupportedPlatforms(req: Request, res: Response): Promise<void> {
    try {
      const platforms = [
        {
          name: 'LinkedIn',
          domain: 'linkedin.com',
          description: 'Професійна мережа LinkedIn',
          icon: 'linkedin'
        },
        {
          name: 'Djinni',
          domain: 'djinni.co',
          description: 'Українська IT платформа для пошуку роботи',
          icon: 'djinni'
        },
        {
          name: 'Robota.ua',
          domain: 'robota.ua',
          description: 'Українська платформа пошуку роботи',
          icon: 'robota'
        },
        {
          name: 'Work.ua',
          domain: 'work.ua',
          description: 'Українська платформа пошуку роботи',
          icon: 'workua'
        },
        {
          name: 'Indeed',
          domain: 'indeed.com',
          description: 'Міжнародна платформа пошуку роботи',
          icon: 'indeed'
        },
        {
          name: 'Glassdoor',
          domain: 'glassdoor.com',
          description: 'Платформа пошуку роботи та оглядів компаній',
          icon: 'glassdoor'
        }
      ];

      res.json({
        success: true,
        data: platforms
      });
    } catch (error) {
      console.error('Error in getSupportedPlatforms:', error);
      res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера',
        error: error.message
      });
    }
  },

  /**
   * Перевірка валідності URL для парсингу
   */
  async validateUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        res.status(400).json({
          success: false,
          message: 'URL є обов\'язковим параметром'
        });
        return;
      }

      // Валідація URL
      try {
        new URL(url);
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Невірний формат URL',
          isValid: false
        });
        return;
      }

      // Перевіряємо підтримку платформи
      const platform = jobParsingService['detectPlatform'](url);
      
      res.json({
        success: true,
        data: {
          isValid: !!platform,
          platform: platform || 'unknown',
          supported: !!platform
        }
      });
    } catch (error) {
      console.error('Error in validateUrl:', error);
      res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера',
        error: error.message
      });
    }
  }
};
