import { Request, Response } from 'express';
import { applicationService } from '../services/applicationService';

export const applicationController = {
  async createApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationData = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const application = await applicationService.createApplication(applicationData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Application created successfully',
        data: application
      });
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating application',
        error: error.message
      });
    }
  },

  async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      
      // Якщо це кандидат і не вказано candidateId, використовуємо поточного користувача
      if (userRole === 'candidate' && !filters.candidateId) {
        filters.candidateId = userId;
      }
      
      const result = await applicationService.getAllApplications(filters);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting applications:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting applications',
        error: error.message
      });
    }
  },

  async getEmployerApplications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const filters = req.query;
      
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const result = await applicationService.getEmployerApplications(userId, filters);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting employer applications:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting employer applications',
        error: error.message
      });
    }
  },

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const application = await applicationService.getApplicationById(id);
      
      if (!application) {
        res.status(404).json({
          success: false,
          message: 'Application not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error getting application:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting application',
        error: error.message
      });
    }
  },

  async updateApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const application = await applicationService.updateApplication(id, updateData);
      
      if (!application) {
        res.status(404).json({
          success: false,
          message: 'Application not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: application
      });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating application',
        error: error.message
      });
    }
  },

  async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await applicationService.deleteApplication(id);
      
      res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(400).json({
        success: false,
        message: 'Error deleting application',
        error: error.message
      });
    }
  },

  async updateApplicationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, reviewedBy } = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const application = await applicationService.updateApplicationStatus(id, status, reviewedBy || userId);
      
      if (!application) {
        res.status(404).json({
          success: false,
          message: 'Application not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating application status',
        error: error.message
      });
    }
  },

  async getApplicationStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await applicationService.getApplicationStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting application stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting application stats',
        error: error.message
      });
    }
  }
};
