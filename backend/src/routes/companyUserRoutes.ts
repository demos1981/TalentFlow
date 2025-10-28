import { Router } from 'express';
import { companyUserController } from '../controllers/companyUserController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateParams, validateDto, validateQuery } from '../middleware/dtoValidation';
import { 
  InviteCompanyUserDto, 
  UpdateCompanyUserDto, 
  SearchCompanyUsersDto,
  UpdatePermissionsDto
} from '../dto/CompanyUserDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Всі роути вимагають автентифікації
router.use(authenticateToken);

// Отримання користувачів компанії
router.get('/company/:companyId/users', 
  validateParams(UuidParamDto), 
  validateQuery(SearchCompanyUsersDto), 
  companyUserController.getCompanyUsers
);

// Запрошення користувача до компанії
router.post('/company/:companyId/users/invite', 
  validateParams(UuidParamDto),
  validateDto(InviteCompanyUserDto), 
  companyUserController.inviteUser
);

// Отримання користувача компанії за ID
router.get('/users/:id', 
  validateParams(UuidParamDto), 
  companyUserController.getCompanyUserById
);

// Оновлення користувача компанії
router.put('/users/:id', 
  validateParams(UuidParamDto),
  validateDto(UpdateCompanyUserDto, true), 
  companyUserController.updateCompanyUser
);

// Видалення користувача з компанії
router.delete('/users/:id', 
  validateParams(UuidParamDto), 
  companyUserController.removeCompanyUser
);

// Оновлення прав користувача
router.patch('/users/:id/permissions', 
  validateParams(UuidParamDto),
  validateDto(UpdatePermissionsDto), 
  companyUserController.updatePermissions
);

// Прийняття запрошення
router.post('/users/:id/accept', 
  validateParams(UuidParamDto), 
  companyUserController.acceptInvitation
);

// Відхилення запрошення
router.post('/users/:id/reject', 
  validateParams(UuidParamDto), 
  companyUserController.rejectInvitation
);

export default router;

