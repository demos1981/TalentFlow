import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const userRole = user.role || 'user';
      
      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          requiredRoles: allowedRoles,
          userRole: userRole
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error in requireRole middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: error.message
      });
    }
  };
};


