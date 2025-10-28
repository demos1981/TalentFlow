import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';

export interface RoleCheckOptions {
  roles?: string[];
  requireEmployer?: boolean;
  requireCandidate?: boolean;
  requireAdmin?: boolean;
  checkPermissions?: string[];
}

/**
 * Middleware для перевірки ролей та прав доступу
 */
export const roleCheck = (options: RoleCheckOptions = {}) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Перевіряємо чи користувач аутентифікований
      if (!req.user) {
        throw new AppError('Необхідна аутентифікація', 401);
      }

      const { user } = req;

      // Перевіряємо конкретні ролі
      if (options.roles && options.roles.length > 0) {
        if (!options.roles.includes(user.role)) {
          throw new AppError('Недостатньо прав доступу', 403);
        }
      }

      // Перевіряємо чи потрібен роботодавець
      if (options.requireEmployer && !user.isEmployer()) {
        throw new AppError('Доступ тільки для роботодавців', 403);
      }

      // Перевіряємо чи потрібен кандидат
      if (options.requireCandidate && !user.isCandidate()) {
        throw new AppError('Доступ тільки для кандидатів', 403);
      }

      // Перевіряємо чи потрібен адмін
      if (options.requireAdmin && !user.isAdmin()) {
        throw new AppError('Доступ тільки для адміністраторів', 403);
      }

      // Перевіряємо конкретні права
      if (options.checkPermissions && options.checkPermissions.length > 0) {
        for (const permission of options.checkPermissions) {
          switch (permission) {
            case 'canPostJobs':
              if (!user.canPostJob()) {
                throw new AppError('У вас немає прав для створення вакансій', 403);
              }
              break;
            case 'canSearchCandidates':
              if (!user.canSearchCandidate()) {
                throw new AppError('У вас немає прав для пошуку кандидатів', 403);
              }
              break;
            case 'canManageTeam':
              if (!user.hasTeamManagementAccess()) {
                throw new AppError('У вас немає прав для управління командою', 403);
              }
              break;
            default:
              // Якщо невідомий permission, пропускаємо
              break;
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware тільки для роботодавців
 */
export const employerOnly = roleCheck({ requireEmployer: true });

/**
 * Middleware тільки для кандидатів
 */
export const candidateOnly = roleCheck({ requireCandidate: true });

/**
 * Middleware тільки для адміністраторів
 */
export const adminOnly = roleCheck({ requireAdmin: true });

/**
 * Middleware для роботодавців з правом створення вакансій
 */
export const canPostJobs = roleCheck({ 
  requireEmployer: true, 
  checkPermissions: ['canPostJobs'] 
});

/**
 * Middleware для роботодавців з правом пошуку кандидатів
 */
export const canSearchCandidates = roleCheck({ 
  requireEmployer: true, 
  checkPermissions: ['canSearchCandidates'] 
});

/**
 * Middleware для роботодавців з правом управління командою
 */
export const canManageTeam = roleCheck({ 
  requireEmployer: true, 
  checkPermissions: ['canManageTeam'] 
});


