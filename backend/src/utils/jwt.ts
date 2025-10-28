import jwt from 'jsonwebtoken';

// Простий модуль для роботи з JWT
export const jwtService = {
  // Генерація JWT токена
  generateToken: (payload: object, expiresIn: string = '7d'): string => {
    const secret = process.env.JWT_SECRET || 'your-default-secret-key';
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  },

  // Верифікація JWT токена
  verifyToken: (token: string): any => {
    try {
      const secret = process.env.JWT_SECRET || 'your-default-secret-key';
      return jwt.verify(token, secret);
    } catch (error) {
      throw error; // Передаємо оригінальну помилку
    }
  },

  // Декодування JWT токена без верифікації
  decodeToken: (token: string): any => {
    return jwt.decode(token);
  },

  // Генерація refresh токена
  generateRefreshToken: (payload: object): string => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-default-refresh-secret';
    return jwt.sign(payload, secret, { expiresIn: '30d' });
  },

  // Верифікація refresh токена
  verifyRefreshToken: (token: string): any => {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-default-refresh-secret';
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  // Створення пари токенів (access + refresh)
  generateTokenPair: (payload: object) => {
    const accessToken = jwtService.generateToken(payload, '1h');
    const refreshToken = jwtService.generateRefreshToken(payload);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600 // 1 година в секундах
    };
  },

  // Перевірка чи токен закінчився
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Отримання часу закінчення токена
  getTokenExpiration: (token: string): Date | null => {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }
};
