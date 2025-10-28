import { Request, Response } from 'express';
import { companyUserService } from '../services/companyUserService';
import { 
  CreateCompanyUserDto, 
  UpdateCompanyUserDto, 
  InviteCompanyUserDto,
  SearchCompanyUsersDto,
  UpdatePermissionsDto
} from '../dto/CompanyUserDto';
import { validateDto } from '../middleware/dtoValidation';

export const companyUserController = {
  /**
   * Отримання всіх користувачів компанії
   */
  async getCompanyUsers(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const filters = req.query as any;
      const users = await companyUserService.getCompanyUsers(companyId, filters);

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error getting company users:', error);
      res.status(400).json({
        success: false,
        message: 'Error getting company users',
        error: error.message
      });
    }
  },

  /**
   * Отримання користувача компанії за ID
   */
  async getCompanyUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyUser = await companyUserService.getCompanyUserById(id);

      if (!companyUser) {
        res.status(404).json({
          success: false,
          message: 'Company user not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: companyUser
      });
    } catch (error) {
      console.error('Error getting company user:', error);
      res.status(400).json({
        success: false,
        message: 'Error getting company user',
        error: error.message
      });
    }
  },

  /**
   * Запрошення користувача до компанії
   */
  async inviteUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(InviteCompanyUserDto)(req, res, () => {});
      if (validationResult) return;

      const { companyId } = req.params;
      const userId = (req as any).user?.id;
      const inviteData = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const result = await companyUserService.inviteUser(companyId, userId, inviteData);

      res.status(201).json({
        success: true,
        message: result.isNewUser 
          ? 'User invited and account created' 
          : 'User invited to company',
        data: result.companyUser
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      res.status(400).json({
        success: false,
        message: 'Error inviting user',
        error: error.message
      });
    }
  },

  /**
   * Оновлення користувача компанії
   */
  async updateCompanyUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateCompanyUserDto, true)(req, res, () => {});
      if (validationResult) return;

      const { id } = req.params;
      const userId = (req as any).user?.id;
      const updateData = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const updated = await companyUserService.updateCompanyUser(id, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Company user updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating company user:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating company user',
        error: error.message
      });
    }
  },

  /**
   * Видалення користувача з компанії
   */
  async removeCompanyUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await companyUserService.removeCompanyUser(id, userId);

      res.status(200).json({
        success: true,
        message: 'User removed from company successfully'
      });
    } catch (error) {
      console.error('Error removing company user:', error);
      res.status(400).json({
        success: false,
        message: 'Error removing company user',
        error: error.message
      });
    }
  },

  /**
   * Оновлення прав користувача
   */
  async updatePermissions(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdatePermissionsDto)(req, res, () => {});
      if (validationResult) return;

      const { id } = req.params;
      const userId = (req as any).user?.id;
      const { permissions } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const updated = await companyUserService.updatePermissions(id, userId, permissions);

      res.status(200).json({
        success: true,
        message: 'Permissions updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating permissions',
        error: error.message
      });
    }
  },

  /**
   * Прийняття запрошення
   */
  async acceptInvitation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const companyUser = await companyUserService.acceptInvitation(id, userId);

      res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully',
        data: companyUser
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      res.status(400).json({
        success: false,
        message: 'Error accepting invitation',
        error: error.message
      });
    }
  },

  /**
   * Відхилення запрошення
   */
  async rejectInvitation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await companyUserService.rejectInvitation(id, userId);

      res.status(200).json({
        success: true,
        message: 'Invitation rejected successfully'
      });
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      res.status(400).json({
        success: false,
        message: 'Error rejecting invitation',
        error: error.message
      });
    }
  }
};

