import { Request, Response } from 'express';
import { aiMatchingService } from '../services/aiMatchingService';

export const aiMatchingController = {
  async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const recommendations = await aiMatchingService.getRecommendations(query);
      
      res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting recommendations',
        error: error.message
      });
    }
  },

  async generateRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const data = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const recommendations = await aiMatchingService.generateRecommendations(data);
      
      if (recommendations.length === 0) {
        res.status(200).json({
          success: true,
          message: 'AI matching service is temporarily unavailable. Please try again later.',
          data: []
        });
        return;
      }
      
      res.status(201).json({
        success: true,
        message: 'Recommendations generated successfully',
        data: recommendations
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(200).json({
        success: true,
        message: 'AI matching service is temporarily unavailable. Please try again later.',
        data: []
      });
    }
  },

  async updateRecommendation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const data = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const recommendation = await aiMatchingService.updateRecommendation(id, data, userId);
      
      res.status(200).json({
        success: true,
        message: 'Recommendation updated successfully',
        data: recommendation
      });
    } catch (error) {
      console.error('Error updating recommendation:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating recommendation',
        error: error.message
      });
    }
  },

  async getMatchingStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await aiMatchingService.getMatchingStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting matching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting matching stats',
        error: error.message
      });
    }
  },

  async cleanupOldRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const result = await aiMatchingService.cleanupOldRecommendations(userId);
      
      res.status(200).json({
        success: true,
        message: 'Old recommendations cleaned up successfully',
        data: { cleanedCount: result }
      });
    } catch (error) {
      console.error('Error cleaning up old recommendations:', error);
      res.status(400).json({
        success: false,
        message: 'Error cleaning up old recommendations',
        error: error.message
      });
    }
  },

  async getRecommendationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recommendation = await aiMatchingService.getRecommendationById(id);
      
      if (!recommendation) {
        res.status(404).json({
          success: false,
          message: 'Recommendation not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: recommendation
      });
    } catch (error) {
      console.error('Error getting recommendation by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting recommendation',
        error: error.message
      });
    }
  },

  async bulkGenerateRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const data = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const result = await aiMatchingService.bulkGenerateRecommendations(data);
      
      res.status(201).json({
        success: true,
        message: 'Bulk recommendations generated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error bulk generating recommendations:', error);
      res.status(400).json({
        success: false,
        message: 'Error bulk generating recommendations',
        error: error.message
      });
    }
  },

  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const health = await aiMatchingService.healthCheck();
      
      res.status(200).json({
        success: true,
        message: 'AI Matching service health check completed',
        data: health
      });
    } catch (error) {
      console.error('AI Matching health check failed:', error);
      res.status(503).json({
        success: false,
        message: 'AI Matching service is unhealthy',
        error: error.message
      });
    }
  },

  async aiHealthCheck(req: Request, res: Response): Promise<void> {
    try {
      const health = await aiMatchingService.aiHealthCheck();
      
      res.status(200).json({
        success: true,
        message: 'AI service health check completed',
        data: health
      });
    } catch (error) {
      console.error('AI Health check failed:', error);
      res.status(503).json({
        success: false,
        message: 'AI service is unhealthy',
        error: error.message
      });
    }
  },

  async getSupportedLanguages(req: Request, res: Response): Promise<void> {
    try {
      const languages = await aiMatchingService.getSupportedLanguages();
      
      res.status(200).json({
        success: true,
        message: 'Supported languages retrieved successfully',
        data: { languages }
      });
    } catch (error) {
      console.error('Error getting supported languages:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting supported languages',
        error: error.message
      });
    }
  }
};