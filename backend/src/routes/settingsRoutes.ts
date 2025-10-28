import { Router } from 'express';
import { settingsController } from '../controllers/settingsController';
import { authenticateToken } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UpdateSettingsDto } from '../dto/SettingsDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();
// settingsController is already imported as an object

// Отримання налаштувань користувача
router.get('/user', authenticateToken, settingsController.getUserSettings.bind(settingsController));

// Оновлення профілю користувача
router.put('/profile', authenticateToken, validateParams(UuidParamDto), validateDto(UpdateSettingsDto, true), settingsController.updateProfile.bind(settingsController));

// Оновлення налаштувань сповіщень
router.put('/notifications', authenticateToken, validateParams(UuidParamDto), validateDto(UpdateSettingsDto, true), settingsController.updateNotificationSettings.bind(settingsController));

// Зміна пароля
router.put('/password', authenticateToken, validateParams(UuidParamDto), validateDto(UpdateSettingsDto, true), settingsController.changePassword.bind(settingsController));

// Завершення сесії
router.delete('/sessions/:sessionId', authenticateToken, settingsController.terminateSession.bind(settingsController));

// Отримання журналу безпеки
router.get('/security/log', authenticateToken, settingsController.getSecurityLog.bind(settingsController));

export default router;
