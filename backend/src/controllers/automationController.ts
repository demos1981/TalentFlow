import { Request, Response } from 'express';
import { automationService } from '../services/automationService';

export const automationController = {
  async getAllWorkflows(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const result = await automationService.getAllWorkflows(filters);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting workflows:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting workflows',
        error: error.message
      });
    }
  },

  async getAutomationStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await automationService.getWorkflowStats();
      
      res.status(200).json({
        success: true,
        message: 'Automation stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting automation stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting automation stats',
        error: error.message
      });
    }
  },

  async getAutomationTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await automationService.getAutomationTemplates();
      
      res.status(200).json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Error getting automation templates:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting automation templates',
        error: error.message
      });
    }
  },

  async getWorkflowDetails(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;
      const details = await automationService.getWorkflowDetails(workflowId);
      
      res.status(200).json({
        success: true,
        data: details
      });
    } catch (error) {
      console.error('Error getting workflow details:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting workflow details',
        error: error.message
      });
    }
  },

  async createWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const workflowData = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const workflow = await automationService.createWorkflow(workflowData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Workflow created successfully',
        data: workflow
      });
    } catch (error) {
      console.error('Error creating workflow:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating workflow',
        error: error.message
      });
    }
  },

  async updateWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;
      const updateData = req.body;

      const workflow = await automationService.updateWorkflow(workflowId, updateData);
      
      if (!workflow) {
        res.status(404).json({
          success: false,
          message: 'Workflow not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Workflow updated successfully',
        data: workflow
      });
    } catch (error) {
      console.error('Error updating workflow:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating workflow',
        error: error.message
      });
    }
  },

  async runWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;
      const runData = { ...req.body, workflowId };
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const result = await automationService.runWorkflow(runData, userId);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Workflow not found or not active'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Workflow executed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error running workflow:', error);
      res.status(400).json({
        success: false,
        message: 'Error running workflow',
        error: error.message
      });
    }
  },

  async toggleWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;
      const { enabled, reason } = req.body;
      
      const workflow = await automationService.toggleWorkflow({ 
        workflowId, 
        isActive: enabled, 
        reason 
      });
      
      if (!workflow) {
        res.status(404).json({
          success: false,
          message: 'Workflow not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: `Workflow ${enabled ? 'enabled' : 'disabled'} successfully`,
        data: workflow
      });
    } catch (error) {
      console.error('Error toggling workflow:', error);
      res.status(400).json({
        success: false,
        message: 'Error toggling workflow',
        error: error.message
      });
    }
  },

  async deleteWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;

      const deleted = await automationService.deleteWorkflow(workflowId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Workflow not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Workflow deleted successfully',
        data: {
          id: workflowId
        }
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      res.status(400).json({
        success: false,
        message: 'Error deleting workflow',
        error: error.message
      });
    }
  },

  async getWorkflowLogs(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;
      const filters = req.query;
      
      const logs = await automationService.getWorkflowLogs(workflowId, filters);
      
      res.status(200).json({
        success: true,
        message: 'Workflow logs retrieved successfully',
        data: logs
      });
    } catch (error) {
      console.error('Error getting workflow logs:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting workflow logs',
        error: error.message
      });
    }
  }
};


