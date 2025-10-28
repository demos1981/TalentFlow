import { Request, Response } from 'express';
import { candidateService } from '../services/candidateService';

export const candidateController = {
  // Створення власного профілю кандидата
  async createOwnProfile(req: Request, res: Response): Promise<void> {
    try {
      const candidateData = req.body;
      const currentUserId = (req as any).user?.id;
      
      const result = await candidateService.createOwnCandidateProfile(candidateData, currentUserId);
      
      res.status(201).json({
        success: true,
        message: 'Candidate profile created successfully',
        data: result
      });
    } catch (error) {
      console.error('Error creating candidate profile:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating candidate profile',
        error: error.message
      });
    }
  },

  // Створення кандидата (User + Profile) - тільки для роботодавців
  async createCandidate(req: Request, res: Response): Promise<void> {
    try {
      const candidateData = req.body;
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      
      const result = await candidateService.createCandidate(candidateData, currentUserId, currentUserRole);
      
      res.status(201).json({
        success: true,
        message: 'Candidate created successfully',
        data: result
      });
    } catch (error) {
      console.error('Error creating candidate:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating candidate',
        error: error.message
      });
    }
  },

  // Отримання всіх кандидатів з фільтрами (замість /search)
  async getAllCandidates(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      
      const result = await candidateService.searchCandidates(filters, currentUserId, currentUserRole);
      
      res.status(200).json({
        success: true,
        message: 'Candidates retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting candidates:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting candidates',
        error: error.message
      });
    }
  },

  // Отримання кандидата за ID
  async getCandidateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      
      const candidate = await candidateService.getCandidateById(id, currentUserId, currentUserRole);
      
      if (!candidate) {
        res.status(404).json({
          success: false,
          message: 'Candidate not found',
          error: 'The candidate profile you are looking for does not exist or has been deactivated'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Candidate retrieved successfully',
        data: candidate
      });
    } catch (error) {
      console.error('Error getting candidate:', error);
      if (error.message.includes('access denied')) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error getting candidate',
          error: error.message
        });
      }
    }
  },

  // Оновлення кандидата
  async updateCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      
      const result = await candidateService.updateCandidate(id, updateData, currentUserId, currentUserRole);
      
      res.status(200).json({
        success: true,
        message: 'Candidate updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
      if (error.message.includes('access denied')) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: error.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Error updating candidate',
          error: error.message
        });
      }
    }
  },

  // Видалення кандидата
  async deleteCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      
      await candidateService.deleteCandidate(id, currentUserId, currentUserRole);
      
      res.status(200).json({
        success: true,
        message: 'Candidate deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      if (error.message.includes('access denied')) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error deleting candidate',
          error: error.message
        });
      }
    }
  },

  // Збільшення переглядів
  async incrementViews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await candidateService.incrementViews(id);
      
      res.status(200).json({
        success: true,
        message: 'Views incremented successfully'
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      res.status(500).json({
        success: false,
        message: 'Error incrementing views',
        error: error.message
      });
    }
  },

  // Старі методи (переіменовані)
  async searchCandidates(req: Request, res: Response): Promise<void> {
    // Це тепер getAllCandidates
    return candidateController.getAllCandidates(req, res);
  },

  async getCandidateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { candidateId } = req.params;
      const profile = await candidateService.getCandidateProfile(candidateId);
      
      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Candidate profile not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Candidate profile retrieved successfully',
        data: profile
      });
    } catch (error) {
      console.error('Error getting candidate profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting candidate profile',
        error: error.message
      });
    }
  },

  async getRecommendedCandidates(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const { limit = 10 } = req.query;
      const candidates = await candidateService.getRecommendedCandidates(jobId, Number(limit));
      
      res.status(200).json({
        success: true,
        message: 'Recommended candidates retrieved successfully',
        data: candidates
      });
    } catch (error) {
      console.error('Error getting recommended candidates:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting recommended candidates',
        error: error.message
      });
    }
  },

  async getSearchStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await candidateService.getSearchStats();
      
      res.status(200).json({
        success: true,
        message: 'Search statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting search stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting search statistics',
        error: error.message
      });
    }
  },

  async getAvailableSkills(req: Request, res: Response): Promise<void> {
    try {
      const skills = await candidateService.getAvailableSkills();
      
      res.status(200).json({
        success: true,
        message: 'Available skills retrieved successfully',
        data: skills
      });
    } catch (error) {
      console.error('Error getting available skills:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting available skills',
        error: error.message
      });
    }
  },

  async getAvailableLocations(req: Request, res: Response): Promise<void> {
    try {
      const locations = await candidateService.getAvailableLocations();
      
      res.status(200).json({
        success: true,
        message: 'Available locations retrieved successfully',
        data: locations
      });
    } catch (error) {
      console.error('Error getting available locations:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting available locations',
        error: error.message
      });
    }
  }
};