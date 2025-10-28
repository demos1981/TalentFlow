import { Request, Response } from 'express';
import { jobService } from '../services/jobService';
import { CreateJobDto, UpdateJobDto, JobSearchDto, JobStatsDto, PublishJobDto, PauseJobDto, CloseJobDto } from '../dto/JobDto';

export const jobController = {
  /**
   * Пошук вакансій з фільтрами
   */
  async searchJobs(req: Request, res: Response): Promise<void> {
    try {

      const searchFilters: JobSearchDto = req.query as any;
      const result = await jobService.searchJobs(searchFilters);
      
      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching jobs',
        error: error.message
      });
    }
  },

  /**
   * Отримання доступних локацій
   */
  async getAvailableLocations(req: Request, res: Response): Promise<void> {
    try {
      const locations = await jobService.getAvailableLocations();
      
      res.status(200).json({
        success: true,
        message: 'Available locations retrieved successfully',
        data: locations
      });
    } catch (error) {
      console.error('Error getting locations:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting locations',
        error: error.message
      });
    }
  },

  /**
   * Отримання типів вакансій
   */
  async getJobTypes(req: Request, res: Response): Promise<void> {
    try {
      const types = await jobService.getJobTypes();
      
      res.status(200).json({
        success: true,
        message: 'Job types retrieved successfully',
        data: types
      });
    } catch (error) {
      console.error('Error getting job types:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting job types',
        error: error.message
      });
    }
  },

  /**
   * Отримання рівнів досвіду
   */
  async getExperienceLevels(req: Request, res: Response): Promise<void> {
    try {
      const levels = await jobService.getExperienceLevels();
      
      res.status(200).json({
        success: true,
        message: 'Experience levels retrieved successfully',
        data: levels
      });
    } catch (error) {
      console.error('Error getting experience levels:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting experience levels',
        error: error.message
      });
    }
  },

  /**
   * Отримання доступних енумів
   */
  async getAvailableEnums(req: Request, res: Response): Promise<void> {
    try {
      const enums = await jobService.getAvailableEnums();
      
      res.status(200).json({
        success: true,
        message: 'Available enums retrieved successfully',
        data: enums
      });
    } catch (error) {
      console.error('Error getting enums:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting enums',
        error: error.message
      });
    }
  },

  /**
   * Отримання вакансій
   */
  async getJobs(req: Request, res: Response): Promise<void> {
    try {
      const searchFilters: JobSearchDto = req.query as any;
      const result = await jobService.getJobs(searchFilters);
      
      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting jobs',
        error: error.message
      });
    }
  },

  /**
   * Отримання особистих вакансій (поки що те ж саме що getMyCreatedJobs)
   * В майбутньому тут будуть вакансії додані в вибрані/збережені
   */
  async getPersonalJobs(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: JobSearchDto = req.query as any;
      // Поки що повертаємо створені вакансії, в майбутньому - збережені/вибрані
      const result = await jobService.getPersonalJobs(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Personal jobs retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting personal jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting personal jobs',
        error: error.message
      });
    }
  },

  /**
   * Створення вакансії
   */
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const jobData: CreateJobDto = req.body;
      const job = await jobService.createJob(jobData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating job',
        error: error.message
      });
    }
  },

  /**
   * Оновлення вакансії
   */
  async updateJob(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { id } = req.params;
      const updateData: UpdateJobDto = req.body;
      const job = await jobService.updateJob(id, updateData, userId);
      
      if (!job) {
        res.status(404).json({
          success: false,
          message: 'Job not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating job',
        error: error.message
      });
    }
  },

  /**
   * Видалення вакансії
   */
  async deleteJob(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { id } = req.params;
      const success = await jobService.deleteJob(id, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Job not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting job',
        error: error.message
      });
    }
  },

  /**
   * Публікація вакансії
   */
  async publishJob(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { id } = req.params;
      const publishData: PublishJobDto = req.body;
      const job = await jobService.publishJob(id, userId, publishData);
      
      if (!job) {
        res.status(404).json({
          success: false,
          message: 'Job not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job published successfully',
        data: job
      });
    } catch (error) {
      console.error('Error publishing job:', error);
      res.status(400).json({
        success: false,
        message: 'Error publishing job',
        error: error.message
      });
    }
  },

  /**
   * Призупинення вакансії
   */
  async pauseJob(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { id } = req.params;
      const pauseData: PauseJobDto = req.body;
      const job = await jobService.pauseJob(id, userId, pauseData);
      
      if (!job) {
        res.status(404).json({
          success: false,
          message: 'Job not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job paused successfully',
        data: job
      });
    } catch (error) {
      console.error('Error pausing job:', error);
      res.status(400).json({
        success: false,
        message: 'Error pausing job',
        error: error.message
      });
    }
  },

  /**
   * Закриття вакансії
   */
  async closeJob(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { id } = req.params;
      const closeData: CloseJobDto = req.body;
      const job = await jobService.closeJob(id, userId, closeData);
      
      if (!job) {
        res.status(404).json({
          success: false,
          message: 'Job not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job closed successfully',
        data: job
      });
    } catch (error) {
      console.error('Error closing job:', error);
      res.status(400).json({
        success: false,
        message: 'Error closing job',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики вакансій
   */
  async getJobStats(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: JobStatsDto = req.query as any;
      const stats = await jobService.getJobStats(statsFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Job statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting job stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting job statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання вакансій створених користувачем (тільки для роботодавців)
   */
  async getMyCreatedJobs(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      // Перевіряємо, чи користувач роботодавець
      if (userRole !== 'employer') {
        res.status(403).json({
          success: false,
          message: 'Only employers can access created jobs'
        });
        return;
      }

      const searchFilters: JobSearchDto = req.query as any;
      const result = await jobService.getMyCreatedJobs(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Created jobs retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting created jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting created jobs',
        error: error.message
      });
    }
  },

  /**
   * Отримання конкретної вакансії
   */
  async getJob(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      const job = await jobService.getJob(id, userId);
      
      if (!job) {
        res.status(404).json({
          success: false,
          message: 'Job not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job retrieved successfully',
        data: job
      });
    } catch (error) {
      console.error('Error getting job:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting job',
        error: error.message
      });
    }
  }
};
