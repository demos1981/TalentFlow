import { Request, Response } from 'express';
import { assessmentService } from '../services/assessmentService';

export const assessmentController = {
  async createAssessment(req: Request, res: Response): Promise<void> {
    try {
      const assessmentData = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const assessment = await assessmentService.createAssessment(assessmentData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Assessment created successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error creating assessment:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating assessment',
        error: error.message
      });
    }
  },

  async getAllAssessments(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const result = await assessmentService.getAllAssessments(filters);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting assessments:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting assessments',
        error: error.message
      });
    }
  },

  async getAssessmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const assessment = await assessmentService.getAssessmentById(id);
      
      if (!assessment) {
        res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Assessment retrieved successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error getting assessment:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting assessment',
        error: error.message
      });
    }
  },

  async updateAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const assessment = await assessmentService.updateAssessment(id, updateData);
      
      if (!assessment) {
        res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Assessment updated successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error updating assessment:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating assessment',
        error: error.message
      });
    }
  },

  async deleteAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await assessmentService.deleteAssessment(id);
      
      res.status(200).json({
        success: true,
        message: 'Assessment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      res.status(400).json({
        success: false,
        message: 'Error deleting assessment',
        error: error.message
      });
    }
  },

  async getAssessmentsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { page = 1, limit = 20 } = req.query;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const result = await assessmentService.getAssessmentsByUser(
        userId, 
        parseInt(page as string), 
        parseInt(limit as string)
      );
      
      res.status(200).json({
        success: true,
        message: 'User assessments retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting user assessments:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user assessments',
        error: error.message
      });
    }
  },

  async getAssessmentsByJob(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await assessmentService.getAssessmentsByJob(
        jobId, 
        parseInt(page as string), 
        parseInt(limit as string)
      );
      
      res.status(200).json({
        success: true,
        message: 'Job assessments retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting job assessments:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting job assessments',
        error: error.message
      });
    }
  },

  async startAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const assessment = await assessmentService.startAssessment(id);
      
      if (!assessment) {
        res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Assessment started successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error starting assessment:', error);
      res.status(400).json({
        success: false,
        message: 'Error starting assessment',
        error: error.message
      });
    }
  },

  async completeAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { answers, score, percentage } = req.body;
      
      if (!answers || score === undefined || percentage === undefined) {
        res.status(400).json({
          success: false,
          message: 'Answers, score, and percentage are required'
        });
        return;
      }
      
      const assessment = await assessmentService.completeAssessment(id, answers, score, percentage);
      
      if (!assessment) {
        res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Assessment completed successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error completing assessment:', error);
      res.status(400).json({
        success: false,
        message: 'Error completing assessment',
        error: error.message
      });
    }
  },

  async getAssessmentStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await assessmentService.getAssessmentStats();
      
      res.status(200).json({
        success: true,
        message: 'Assessment statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting assessment stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting assessment statistics',
        error: error.message
      });
    }
  }
};