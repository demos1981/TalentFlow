import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { jwtService } from '../utils/jwt';

// Розширений Request з користувачем
export interface AuthRequest extends Request {
  user?: User;
}

// Middleware для аутентифікації JWT токена
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    try {
      // Перевіряємо JWT токен
      const decoded = jwtService.verifyToken(token) as { id?: string; userId?: string };
      
      // Знаходимо користувача в базі
      const userRepository = AppDataSource.getRepository(User);
      const userId = decoded.id || decoded.userId;
      const user = await userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Додаємо користувача до request
      req.user = user;
      
      // Оновлюємо lastActiveAt
      await userRepository.update(user.id, {
        lastActiveAt: new Date()
      });

      return next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware для перевірки ролей
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

// Middleware для перевірки власника ресурсу
export const requireOwnership = (resourceType: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Тут можна додати логіку перевірки власності ресурсу
      // Поки що просто пропускаємо
      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

// Middleware для обмеження швидкості запитів
export const rateLimit = (windowMs: number, max: number) => {
  const requests = new Map();
  
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Очищаємо старі запити
      if (requests.has(ip)) {
        requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart));
      }
      
      const currentRequests = requests.get(ip) || [];
      
      if (currentRequests.length >= max) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
      
      currentRequests.push(now);
      requests.set(ip, currentRequests);
      
      return next();
    } catch (error) {
      return next();
    }
  };
};

// Middleware для валідації вхідних даних
export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Тут має бути валідація за схемою
      // Поки що просто пропускаємо
      return next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        code: 'INVALID_INPUT'
      });
    }
  };
};

// Middleware для логування запитів
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    return next();
  } catch (error) {
    return next();
  }
};

// Middleware для обробки помилок
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  try {
    console.error('Error:', err);
    
    // Перевіряємо чи це AppError
    if (err.statusCode && err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        code: err.statusCode === 400 ? 'VALIDATION_ERROR' : 
              err.statusCode === 401 ? 'UNAUTHORIZED' :
              err.statusCode === 403 ? 'FORBIDDEN' :
              err.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
        details: err.details
      });
      return;
    }
    
    // Визначаємо тип помилки для інших випадків
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation error';
      code = 'VALIDATION_ERROR';
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
      code = 'UNAUTHORIZED';
    } else if (err.name === 'ForbiddenError') {
      statusCode = 403;
      message = 'Forbidden';
      code = 'FORBIDDEN';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      message = 'Resource not found';
      code = 'NOT_FOUND';
    }
    
    res.status(statusCode).json({
      success: false,
      message,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};
