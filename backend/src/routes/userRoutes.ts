import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';
import { UuidParamDto } from '../dto/CommonDto';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  GeneralUserSearchDto as UserSearchDto, 
  UserProfileDto, 
  ChangePasswordDto,
  UserStatsDto 
} from '../dto/UserDto';

const router = Router();

// Public routes
router.post('/', validateDto(CreateUserDto), userController.createUser);

// All other routes require authentication
router.use(authenticateToken);

// Get all users (with pagination and filters)
router.get('/', validateQuery(UserSearchDto), userController.getAllUsers);

// Search users
router.get('/search', validateQuery(UserSearchDto), userController.searchUsers);

// Get active users
router.get('/active', userController.getActiveUsers);

// Get users by role
router.get('/role/:role', userController.getUsersByRole);

// Get user by ID
router.get('/:id', validateParams(UuidParamDto), userController.getUserById);

// Get user profile
router.get('/:id/profile', validateParams(UuidParamDto), userController.getUserProfile);

// Update user (admin only)
router.put('/:id', requireRole(['admin']), validateParams(UuidParamDto), validateDto(UpdateUserDto, true), userController.updateUser);

// Update user profile
router.put('/:id/profile', validateParams(UuidParamDto), validateDto(UserProfileDto, true), userController.updateUserProfile);

// Change password
router.put('/:id/password', validateParams(UuidParamDto), validateDto(ChangePasswordDto), userController.changePassword);

// Verify email
router.put('/:id/verify-email', validateParams(UuidParamDto), userController.verifyEmail);

// Delete user (admin only)
router.delete('/:id', requireRole(['admin']), validateParams(UuidParamDto), userController.deleteUser);

// Get user statistics (admin only)
router.get('/stats/overview', requireRole(['admin']), validateQuery(UserStatsDto), userController.getUserStats);

export default router;
