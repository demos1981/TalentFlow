import { Request, Response } from 'express';
import { getAuthService } from '../services/authService';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const result = await getAuthService().register(userData);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await getAuthService().login({ email, password });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
        invalidError: null
      });
    } catch (error) {
      console.error('Error logging in:', error);
      
      // Визначаємо тип помилки
      let invalidError = null;
      
      if (error.message.includes('does not exist') || error.message.includes('not found')) {
        invalidError = 'User not found';
      } else if (error.message.includes('Invalid password') || error.message.includes('password')) {
        invalidError = 'Invalid password';
      } else if (error.message.includes('deactivated') || error.message.includes('inactive')) {
        invalidError = 'Account deactivated';
      }
      
      res.status(200).json({
        success: false,
        message: 'Login failed',
        data: null,
        invalidError: invalidError
      });
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const newToken = await getAuthService().refreshToken(token);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: newToken
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: error.message
      });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await getAuthService().logout(userId);
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({
        success: false,
        message: 'Error logging out',
        error: error.message
      });
    }
  },

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const profile = await getAuthService().getProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting profile',
        error: error.message
      });
    }
  },

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      // Повертаємо повну інформацію про користувача
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          company: user.company,
          title: user.title,
          location: user.location,
          avatar: user.avatar,
          bio: user.bio,
          phone: user.phone,
          website: user.website,
          linkedin: user.linkedin,
          github: user.github,
          skills: user.skills,
          experience: user.experience,
          education: user.education,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Error getting user data:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user data',
        error: error.message
      });
    }
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const updateData = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const updatedProfile = await getAuthService().updateProfile(userId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  },

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      await getAuthService().changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Error changing password',
        error: error.message
      });
    }
  }
};