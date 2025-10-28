import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { BaseService } from './baseService';
import { AppDataSource } from '../config/database';
import { jwtService } from '../utils/jwt';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'employer' | 'admin';
  companyId?: string;
}

export interface AuthResponse {
  user: Partial<User>;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService extends BaseService<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Перевіряємо чи користувач вже існує
      const existingUser = await this.repository.findOne({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Користувач з такою електронною поштою вже існує');
      }

      // Хешуємо пароль
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Створюємо користувача
      const userData = {
        ...data,
        password: hashedPassword,
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const user = await this.create(userData as Partial<User>);

      // Генеруємо токени
      const token = jwtService.generateToken({ id: user.id });
      const refreshToken = jwtService.generateRefreshToken({ id: user.id });
      const expiresIn = this.getTokenExpirationTime();

      // Видаляємо пароль з відповіді
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresIn
      };
    } catch (error) {
      throw new Error(`Registration error: ${error.message}`);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Знаходимо користувача
      const user = await this.repository.findOne({
        where: { email: credentials.email }
      });

      if (!user) {
        throw new Error('User with this email does not exist');
      }

      if (!user.isActive) {
        throw new Error('Account deactivated');
      }

      // Перевіряємо пароль
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Генеруємо токени
      const token = jwtService.generateToken({ id: user.id });
      const refreshToken = jwtService.generateRefreshToken({ id: user.id });
      const expiresIn = this.getTokenExpirationTime();

      // Оновлюємо останній вхід та активність
      await this.repository.update(user.id, {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
        updatedAt: new Date()
      });

      // Видаляємо пароль з відповіді
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresIn
      };
    } catch (error) {
      throw new Error(`Login error: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string; expiresIn: number }> {
    try {
      const decoded = jwtService.verifyRefreshToken(refreshToken) as { id: string };
      
      const user = await this.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isActive) {
        throw new Error('Account deactivated');
      }

      const newToken = jwtService.generateToken({ id: user.id });
      const newRefreshToken = jwtService.generateRefreshToken({ id: user.id });
      const expiresIn = this.getTokenExpirationTime();

      // Оновлюємо lastActiveAt
      await this.repository.update(user.id, {
        lastActiveAt: new Date(),
        updatedAt: new Date()
      });

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token закінчився');
      }
      throw new Error('Невірний refresh token');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Перевіряємо поточний пароль
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Невірний поточний пароль');
      }

      // Хешуємо новий пароль
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Оновлюємо пароль
      await this.repository.update(userId, {
        password: hashedNewPassword,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      throw new Error(`Помилка зміни пароля: ${error.message}`);
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      // Оновлюємо lastActiveAt
      await this.repository.update(userId, {
        lastActiveAt: new Date(),
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      throw new Error(`Помилка виходу: ${error.message}`);
    }
  }

  async verifyEmail(userId: string): Promise<boolean> {
    try {
      await this.repository.update(userId, {
        emailVerified: true,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      throw new Error(`Помилка верифікації email: ${error.message}`);
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
    try {
      const decoded = jwtService.verifyToken(token) as { id: string };
      
      const user = await this.findById(decoded.id);
      if (!user || !user.isActive) {
        return { valid: false, error: 'User not found or inactive' };
      }

      return { valid: true, userId: user.id };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { valid: false, error: 'Token expired' };
      }
      return { valid: false, error: 'Invalid token' };
    }
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    try {
      const user = await this.repository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Видаляємо пароль з відповіді
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error getting profile: ${error.message}`);
    }
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<Partial<User>> {
    try {
      const user = await this.repository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Оновлюємо дані користувача
      const updatedUser = await this.repository.save({
        ...user,
        ...updateData,
        updatedAt: new Date()
      });

      // Видаляємо пароль з відповіді
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }

  // Приватні методи

  private getTokenExpirationTime(): number {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    // Конвертуємо в секунди
    if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn) * 24 * 60 * 60;
    } else if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('s')) {
      return parseInt(expiresIn);
    }
    
    // За замовчуванням 7 днів
    return 7 * 24 * 60 * 60;
  }
}

// Експортуємо екземпляр сервісу для використання в контролері

// Ленива ініціалізація для уникнення проблем з порядком ініціалізації
let _authService: AuthService | null = null;

export const getAuthService = (): AuthService => {
  if (!_authService) {
    if (!AppDataSource.isInitialized) {
      throw new Error('AppDataSource не ініціалізований');
    }
    _authService = new AuthService(AppDataSource.getRepository(User));
  }
  return _authService;
};

// Експортуємо тільки функцію для ленивої ініціалізації
// authService буде створений тільки коли getAuthService() буде викликаний
