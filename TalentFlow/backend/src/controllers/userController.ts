import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  GeneralUserSearchDto, 
  UserSearchDto,
  UserStatsDto, 
  UserProfileDto, 
  ChangePasswordDto 
} from '../dto/UserDto';

export const userController = {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const searchDto: UserSearchDto = {
        search: query.search as string,
        role: query.role as any,
        status: query.status as any,
        location: query.location as string,
        city: query.city as string,
        country: query.country as string,
        skills: query.skills ? (query.skills as string).split(',') : undefined,
        isActive: query.isActive ? query.isActive === 'true' : undefined,
        isEmailVerified: query.isEmailVerified ? query.isEmailVerified === 'true' : undefined,
        createdAfter: query.createdAfter as string,
        createdBefore: query.createdBefore as string,
        lastLoginAfter: query.lastLoginAfter as string,
        lastLoginBefore: query.lastLoginBefore as string,
        page: query.page ? parseInt(query.page as string) : 1,
        limit: query.limit ? parseInt(query.limit as string) : 20,
        sortBy: query.sortBy as any,
        sortOrder: query.sortOrder as any
      };

      const result = await userService.getAllUsers(searchDto);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting users',
        error: error.message
      });
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user',
        error: error.message
      });
    }
  },

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDto: CreateUserDto = req.body;
      const user = await userService.createUser(createUserDto);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const updateUserDto: UpdateUserDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const user = await userService.updateUser(id, updateUserDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await userService.deleteUser(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(400).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  },

  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const query = req.query;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsDto: UserStatsDto = {
        period: query.period as any,
        startDate: query.startDate as string,
        endDate: query.endDate as string,
        groupBy: query.groupBy as any
      };

      const stats = await userService.getUserStats(statsDto);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user stats',
        error: error.message
      });
    }
  },

  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const searchDto: UserSearchDto = {
        search: query.search as string,
        role: query.role as any,
        status: query.status as any,
        location: query.location as string,
        city: query.city as string,
        country: query.country as string,
        skills: query.skills ? (query.skills as string).split(',') : undefined,
        isActive: query.isActive ? query.isActive === 'true' : undefined,
        isEmailVerified: query.isEmailVerified ? query.isEmailVerified === 'true' : undefined,
        createdAfter: query.createdAfter as string,
        createdBefore: query.createdBefore as string,
        lastLoginAfter: query.lastLoginAfter as string,
        lastLoginBefore: query.lastLoginBefore as string,
        page: query.page ? parseInt(query.page as string) : 1,
        limit: query.limit ? parseInt(query.limit as string) : 20,
        sortBy: query.sortBy as any,
        sortOrder: query.sortOrder as any
      };

      const result = await userService.searchUsers(searchDto);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching users',
        error: error.message
      });
    }
  },

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const user = await userService.getUserProfile(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user profile',
        error: error.message
      });
    }
  },

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const updateData: UserProfileDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const user = await userService.updateUserProfile(id, updateData, userId);
      
      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating user profile',
        error: error.message
      });
    }
  },

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const changePasswordDto: ChangePasswordDto = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await userService.changePassword(userId, changePasswordDto);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(400).json({
        success: false,
        message: 'Error changing password',
        error: error.message
      });
    }
  },

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await userService.verifyEmail(userId);
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(400).json({
        success: false,
        message: 'Error verifying email',
        error: error.message
      });
    }
  },

  async getActiveUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getActiveUsers();
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error getting active users:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting active users',
        error: error.message
      });
    }
  },

  async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;
      const users = await userService.getUsersByRole(role as any);
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting users by role',
        error: error.message
      });
    }
  }
};