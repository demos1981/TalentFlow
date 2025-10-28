import { Request, Response } from 'express';
import { settingsService } from '../services/settingsService';
import { validateDto } from '../middleware/dtoValidation';
import { UpdateProfileDto, UpdateNotificationSettingsDto, UpdatePrivacySettingsDto, UpdateAppearanceSettingsDto, SettingsUpdateSecuritySettingsDto, UpdateSecuritySettingsDto, SettingsChangePasswordDto, ChangePasswordDto, SecurityLogSearchDto, SessionManagementDto, TerminateSessionDto, TerminateAllSessionsDto, AddTrustedDeviceDto, RemoveTrustedDeviceDto, AddTrustedIPDto, RemoveTrustedIPDto, SessionIdParamDto, DeviceIdParamDto, IPIdParamDto } from '../dto/SettingsDto';
import { UuidParamDto } from '../dto/CommonDto';

export const settingsController = {
  /**
   * Отримання налаштувань користувача
   */
  async getUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      
      res.status(200).json({
        success: true,
        message: 'User settings retrieved successfully',
        data: settings
      });
    } catch (error) {
      console.error('Error getting user settings:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting user settings',
        error: error.message
      });
    }
  },

  /**
   * Оновлення профілю користувача
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateProfileDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const profileData = req.body as UpdateProfileDto;
      const updatedProfile = await settingsService.updateProfile(userId, profileData, req);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  },

  /**
   * Оновлення налаштувань сповіщень
   */
  async updateNotificationSettings(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateNotificationSettingsDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const notificationSettings = req.body as UpdateNotificationSettingsDto;
      const updatedSettings = await settingsService.updateNotificationSettings(userId, notificationSettings, req);
      
      res.status(200).json({
        success: true,
        message: 'Notification settings updated successfully',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating notification settings',
        error: error.message
      });
    }
  },

  /**
   * Оновлення налаштувань приватності
   */
  async updatePrivacySettings(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdatePrivacySettingsDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const privacySettings = req.body as UpdatePrivacySettingsDto;
      const updatedSettings = await settingsService.updatePrivacySettings(userId, privacySettings, req);
      
      res.status(200).json({
        success: true,
        message: 'Privacy settings updated successfully',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating privacy settings',
        error: error.message
      });
    }
  },

  /**
   * Оновлення налаштувань зовнішнього вигляду
   */
  async updateAppearanceSettings(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateAppearanceSettingsDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const appearanceSettings = req.body as UpdateAppearanceSettingsDto;
      const updatedSettings = await settingsService.updateAppearanceSettings(userId, appearanceSettings, req);
      
      res.status(200).json({
        success: true,
        message: 'Appearance settings updated successfully',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating appearance settings',
        error: error.message
      });
    }
  },

  /**
   * Оновлення налаштувань безпеки
   */
  async updateSecuritySettings(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateSecuritySettingsDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const securitySettings = req.body as UpdateSecuritySettingsDto;
      const updatedSettings = await settingsService.updateSecuritySettings(userId, securitySettings, req);
      
      res.status(200).json({
        success: true,
        message: 'Security settings updated successfully',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Error updating security settings:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating security settings',
        error: error.message
      });
    }
  },

  /**
   * Зміна пароля
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ChangePasswordDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const changePasswordDto = req.body as ChangePasswordDto;
      await settingsService.changePassword(userId, changePasswordDto, req);
      
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

  /**
   * Отримання журналу безпеки
   */
  async getSecurityLog(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(SecurityLogSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchDto = req.query as SecurityLogSearchDto;
      const securityLog = await settingsService.getSecurityLog(userId, searchDto);
      
      res.status(200).json({
        success: true,
        message: 'Security log retrieved successfully',
        data: securityLog
      });
    } catch (error) {
      console.error('Error getting security log:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting security log',
        error: error.message
      });
    }
  },

  /**
   * Отримання активних сесій
   */
  async getActiveSessions(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(SessionManagementDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const sessionDto = req.query as SessionManagementDto;
      const sessions = await settingsService.getActiveSessions(userId, sessionDto);
      
      res.status(200).json({
        success: true,
        message: 'Active sessions retrieved successfully',
        data: sessions
      });
    } catch (error) {
      console.error('Error getting active sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting active sessions',
        error: error.message
      });
    }
  },

  /**
   * Завершення сесії
   */
  async terminateSession(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(SessionIdParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { sessionId } = req.params;
      await settingsService.terminateSession(userId, sessionId, req);
      
      res.status(200).json({
        success: true,
        message: 'Session terminated successfully'
      });
    } catch (error) {
      console.error('Error terminating session:', error);
      res.status(400).json({
        success: false,
        message: 'Error terminating session',
        error: error.message
      });
    }
  },

  /**
   * Завершення всіх сесій
   */
  async terminateAllSessions(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(TerminateAllSessionsDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const terminateDto = req.body as TerminateAllSessionsDto;
      await settingsService.terminateAllSessions(userId, terminateDto, req);
      
      res.status(200).json({
        success: true,
        message: 'All sessions terminated successfully'
      });
    } catch (error) {
      console.error('Error terminating all sessions:', error);
      res.status(400).json({
        success: false,
        message: 'Error terminating all sessions',
        error: error.message
      });
    }
  },

  /**
   * Додавання довіреного пристрою
   */
  async addTrustedDevice(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(AddTrustedDeviceDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const deviceDto = req.body as AddTrustedDeviceDto;
      const device = await settingsService.addTrustedDevice(userId, deviceDto, req);
      
      res.status(201).json({
        success: true,
        message: 'Trusted device added successfully',
        data: device
      });
    } catch (error) {
      console.error('Error adding trusted device:', error);
      res.status(400).json({
        success: false,
        message: 'Error adding trusted device',
        error: error.message
      });
    }
  },

  /**
   * Видалення довіреного пристрою
   */
  async removeTrustedDevice(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(DeviceIdParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { deviceId } = req.params;
      await settingsService.removeTrustedDevice(userId, deviceId, req);
      
      res.status(200).json({
        success: true,
        message: 'Trusted device removed successfully'
      });
    } catch (error) {
      console.error('Error removing trusted device:', error);
      res.status(400).json({
        success: false,
        message: 'Error removing trusted device',
        error: error.message
      });
    }
  },

  /**
   * Додавання довіреної IP адреси
   */
  async addTrustedIP(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(AddTrustedIPDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const ipDto = req.body as AddTrustedIPDto;
      const ip = await settingsService.addTrustedIP(userId, ipDto, req);
      
      res.status(201).json({
        success: true,
        message: 'Trusted IP added successfully',
        data: ip
      });
    } catch (error) {
      console.error('Error adding trusted IP:', error);
      res.status(400).json({
        success: false,
        message: 'Error adding trusted IP',
        error: error.message
      });
    }
  },

  /**
   * Видалення довіреної IP адреси
   */
  async removeTrustedIP(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(IPIdParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { ipId } = req.params;
      await settingsService.removeTrustedIP(userId, ipId, req);
      
      res.status(200).json({
        success: true,
        message: 'Trusted IP removed successfully'
      });
    } catch (error) {
      console.error('Error removing trusted IP:', error);
      res.status(400).json({
        success: false,
        message: 'Error removing trusted IP',
        error: error.message
      });
    }
  }
};