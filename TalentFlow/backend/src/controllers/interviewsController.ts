import { Request, Response } from 'express';
import { interviewsService } from '../services/interviewsService';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
  InterviewSearchDto,
  InterviewFeedbackDto,
  UpdateInterviewStatusDto,
  InterviewCalendarDto,
  InterviewStatsDto} from '../dto/InterviewDto';

export const interviewsController = {
  /**
   * Отримання всіх інтерв'ю з фільтрами
   */
  async getAllInterviews(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: InterviewSearchDto = req.query as any;
      const result = await interviewsService.getAllInterviews(searchFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Interviews retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting interviews:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting interviews',
        error: error.message
      });
    }
  },

  /**
   * Отримання інтерв'ю за ID
   */
  async getInterviewById(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { interviewId } = req.params;
      const interview = await interviewsService.getInterviewById(interviewId, userId);
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Interview retrieved successfully',
        data: interview
      });
    } catch (error) {
      console.error('Error getting interview by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting interview',
        error: error.message
      });
    }
  },

  /**
   * Створення нового інтерв'ю
   */
  async createInterview(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const interviewData: CreateInterviewDto = req.body;
      const interview = await interviewsService.createInterview(interviewData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Interview created successfully',
        data: interview
      });
    } catch (error) {
      console.error('Error creating interview:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating interview',
        error: error.message
      });
    }
  },

  /**
   * Оновлення інтерв'ю
   */
  async updateInterview(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { interviewId } = req.params;
      const updateData: UpdateInterviewDto = req.body;
      const interview = await interviewsService.updateInterview(interviewId, updateData, userId);
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Interview updated successfully',
        data: interview
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating interview',
        error: error.message
      });
    }
  },

  /**
   * Видалення інтерв'ю
   */
  async deleteInterview(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { interviewId } = req.params;
      const success = await interviewsService.deleteInterview(interviewId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Interview deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting interview',
        error: error.message
      });
    }
  },

  /**
   * Додавання відгуку про інтерв'ю
   */
  async addInterviewFeedback(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { interviewId } = req.params;
      const feedbackData: InterviewFeedbackDto = req.body;
      const interview = await interviewsService.addInterviewFeedback(interviewId, feedbackData, userId);
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Interview feedback added successfully',
        data: interview
      });
    } catch (error) {
      console.error('Error adding interview feedback:', error);
      res.status(400).json({
        success: false,
        message: 'Error adding interview feedback',
        error: error.message
      });
    }
  },

  /**
   * Оновлення статусу інтерв'ю
   */
  async updateInterviewStatus(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { interviewId } = req.params;
      const statusData: UpdateInterviewStatusDto = req.body;
      const interview = await interviewsService.updateInterviewStatus(interviewId, statusData, userId);
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Interview status updated successfully',
        data: interview
      });
    } catch (error) {
      console.error('Error updating interview status:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating interview status',
        error: error.message
      });
    }
  },

  /**
   * Отримання календаря інтерв'ю
   */
  async getInterviewCalendar(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const calendarFilters: InterviewCalendarDto = req.query as any;
      const interviews = await interviewsService.getInterviewCalendar(calendarFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Interview calendar retrieved successfully',
        data: interviews
      });
    } catch (error) {
      console.error('Error getting interview calendar:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting interview calendar',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики інтерв'ю
   */
  async getInterviewStats(req: Request, res: Response): Promise<void> {
    try {


      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: InterviewStatsDto = req.query as any;
      const stats = await interviewsService.getInterviewStats(userId);
      
      res.status(200).json({
        success: true,
        message: 'Interview statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting interview stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting interview statistics',
        error: error.message
      });
    }
  }
};