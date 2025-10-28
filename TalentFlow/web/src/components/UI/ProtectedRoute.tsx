import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallbackPath = '/dashboard'
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute: user:', user);
    console.log('ProtectedRoute: allowedRoles:', allowedRoles);
    console.log('ProtectedRoute: requiredPermissions:', requiredPermissions);
    
    if (!user) {
      console.log('ProtectedRoute: No user, redirecting to /auth');
      // Якщо користувач не авторизований, перенаправляємо на логін
      navigate('/auth', { replace: true });
      return;
    }

    // Перевіряємо роль
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      console.log('ProtectedRoute: User role not allowed, redirecting to:', fallbackPath);
      navigate(fallbackPath, { replace: true });
      return;
    }

    // Перевіряємо права
    if (requiredPermissions.length > 0) {
      console.log('ProtectedRoute: User permissions check:', {
        canPostJobs: user.canPostJobs,
        canSearchCandidates: user.canSearchCandidates,
        canManageTeam: user.canManageTeam,
        role: user.role,
        isActive: user.isActive
      });
      
      const hasAllPermissions = requiredPermissions.every(permission => {
        const hasPermission = user[permission as keyof typeof user] === true;
        console.log(`ProtectedRoute: Permission ${permission}:`, hasPermission);
        return hasPermission;
      });
      
      if (!hasAllPermissions) {
        console.log('ProtectedRoute: User missing permissions, redirecting to:', fallbackPath);
        navigate(fallbackPath, { replace: true });
        return;
      }
    }
    
    console.log('ProtectedRoute: Access granted');
  }, [user, navigate, allowedRoles, requiredPermissions, fallbackPath]);

  // Якщо користувач не авторизований або не має прав, не показуємо контент
  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => {
      return user[permission as keyof typeof user] === true;
    });
    
    if (!hasAllPermissions) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
