import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User, UserRole, UserStatus } from '../models/User';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserSearchDto, 
  UserStatsDto, 
  UserProfileDto, 
  ChangePasswordDto, 
} from '../dto/UserDto';
import * as bcrypt from 'bcrypt';

export interface UserSearchResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  verified: number;
  byRole: {
    admin: number;
    employer: number;
    candidate: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    suspended: number;
    verified: number;
  };
  newThisMonth: number;
  growth: number;
  emailVerified: number;
  emailUnverified: number;
  lastLoginStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    never: number;
  };
  locationStats: {
    topCountries: { country: string; count: number }[];
    topCities: { city: string; count: number }[];
  };
  generatedAt: Date;
}

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Створення нового користувача
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Хешуємо пароль (простий хеш для демонстрації)
      const hashedPassword = Buffer.from(createUserDto.password).toString('base64');

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const savedUser = await this.userRepository.save(user);
      return Array.isArray(savedUser) ? savedUser[0] : savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Отримання всіх користувачів з фільтрацією та пагінацією
   */
  async getAllUsers(searchDto: UserSearchDto): Promise<UserSearchResult> {
    try {
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const offset = (page - 1) * limit;

      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Фільтри
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      if (searchDto.role) {
        queryBuilder.andWhere('user.role = :role', { role: searchDto.role });
      }

      if (searchDto.status) {
        queryBuilder.andWhere('user.status = :status', { status: searchDto.status });
      }

      if (searchDto.location) {
        queryBuilder.andWhere('user.location ILIKE :location', { location: `%${searchDto.location}%` });
      }

      if (searchDto.city) {
        queryBuilder.andWhere('user.city ILIKE :city', { city: `%${searchDto.city}%` });
      }

      if (searchDto.country) {
        queryBuilder.andWhere('user.country ILIKE :country', { country: `%${searchDto.country}%` });
      }

      if (searchDto.skills && searchDto.skills.length > 0) {
        queryBuilder.andWhere('user.skills && :skills', { skills: searchDto.skills });
      }

      if (searchDto.isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive: searchDto.isActive });
      }

      if (searchDto.isEmailVerified !== undefined) {
        queryBuilder.andWhere('user.emailVerified = :emailVerified', { emailVerified: searchDto.isEmailVerified });
      }

      if (searchDto.createdAfter) {
        queryBuilder.andWhere('user.createdAt >= :createdAfter', { createdAfter: new Date(searchDto.createdAfter) });
      }

      if (searchDto.createdBefore) {
        queryBuilder.andWhere('user.createdAt <= :createdBefore', { createdBefore: new Date(searchDto.createdBefore) });
      }

      if (searchDto.lastLoginAfter) {
        queryBuilder.andWhere('user.lastLoginAt >= :lastLoginAfter', { lastLoginAfter: new Date(searchDto.lastLoginAfter) });
      }

      if (searchDto.lastLoginBefore) {
        queryBuilder.andWhere('user.lastLoginAt <= :lastLoginBefore', { lastLoginBefore: new Date(searchDto.lastLoginBefore) });
      }

      // Сортування
      const sortBy = searchDto.sortBy || 'createdAt';
      const sortOrder = searchDto.sortOrder || 'DESC';
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const users = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  /**
   * Отримання користувача за ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error getting user by id:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Оновлення користувача
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto, updatedBy: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }

      // Оновлюємо поля
      Object.keys(updateUserDto).forEach(key => {
        if (updateUserDto[key] !== undefined) {
          (user as any)[key] = updateUserDto[key];
        }
      });

      user.updatedAt = new Date();
      const savedUser = await this.userRepository.save(user);
      return Array.isArray(savedUser) ? savedUser[0] : savedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Видалення користувача
   */
  async deleteUser(id: string, deletedBy: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }

      // Soft delete - встановлюємо isActive = false
      user.isActive = false;
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      console.log(`User ${id} deleted by ${deletedBy}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Отримання статистики користувачів
   */
  async getUserStats(statsDto: UserStatsDto): Promise<UserStats> {
    try {
      const startDate = statsDto.startDate ? new Date(statsDto.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = statsDto.endDate ? new Date(statsDto.endDate) : new Date();

      // Загальна статистика
      const total = await this.userRepository.count();
      const active = await this.userRepository.count({ where: { isActive: true } });
      const inactive = await this.userRepository.count({ where: { isActive: false } });
      const suspended = await this.userRepository.count({ where: { status: UserStatus.SUSPENDED } });
      const verified = await this.userRepository.count({ where: { status: UserStatus.VERIFIED } });

      // Статистика по ролях
      const byRole = {
        admin: await this.userRepository.count({ where: { role: UserRole.ADMIN } }),
        employer: await this.userRepository.count({ where: { role: UserRole.EMPLOYER } }),
        candidate: await this.userRepository.count({ where: { role: UserRole.CANDIDATE } })
      };

      // Статистика по статусах
      const byStatus = {
        active: await this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
        inactive: await this.userRepository.count({ where: { status: UserStatus.INACTIVE } }),
        suspended: await this.userRepository.count({ where: { status: UserStatus.SUSPENDED } }),
        verified: await this.userRepository.count({ where: { status: UserStatus.VERIFIED } })
      };

      // Нові користувачі цього місяця
      const newThisMonth = await this.userRepository.count({
        where: {
          createdAt: Between(startDate, endDate)
        }
      });

      // Розрахунок росту
      const previousMonthStart = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previousMonthEnd = new Date(startDate);
      const previousMonthCount = await this.userRepository.count({
        where: {
          createdAt: Between(previousMonthStart, previousMonthEnd)
        }
      });

      const growth = previousMonthCount > 0 ? ((newThisMonth - previousMonthCount) / previousMonthCount) * 100 : 0;

      // Статистика верифікації
      const emailVerified = await this.userRepository.count({ where: { emailVerified: true } });
      const emailUnverified = await this.userRepository.count({ where: { emailVerified: false } });

      // Статистика останнього входу
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const lastLoginStats = {
        today: await this.userRepository.count({ where: { lastLoginAt: Between(today, new Date()) } }),
        thisWeek: await this.userRepository.count({ where: { lastLoginAt: Between(thisWeek, new Date()) } }),
        thisMonth: await this.userRepository.count({ where: { lastLoginAt: Between(thisMonth, new Date()) } }),
        never: await this.userRepository.count({ where: { lastLoginAt: null } })
      };

      // Статистика по локаціях
      const locationStats = {
        topCountries: await this.getTopCountries(),
        topCities: await this.getTopCities()
      };

      return {
        total,
        active,
        inactive,
        suspended,
        verified,
        byRole,
        byStatus,
        newThisMonth,
        growth: Math.round(growth * 100) / 100,
        emailVerified,
        emailUnverified,
        lastLoginStats,
        locationStats,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }

  /**
   * Отримання топ країн
   */
  private async getTopCountries(): Promise<{ country: string; count: number }[]> {
    try {
      const result = await this.userRepository
        .createQueryBuilder('user')
        .select('user.country', 'country')
        .addSelect('COUNT(*)', 'count')
        .where('user.country IS NOT NULL')
        .andWhere('user.country != :empty', { empty: '' })
        .groupBy('user.country')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      return result.map(row => ({
        country: row.country,
        count: parseInt(row.count)
      }));
    } catch (error) {
      console.error('Error getting top countries:', error);
      return [];
    }
  }

  /**
   * Отримання топ міст
   */
  private async getTopCities(): Promise<{ city: string; count: number }[]> {
    try {
      const result = await this.userRepository
        .createQueryBuilder('user')
        .select('user.city', 'city')
        .addSelect('COUNT(*)', 'count')
        .where('user.city IS NOT NULL')
        .andWhere('user.city != :empty', { empty: '' })
        .groupBy('user.city')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      return result.map(row => ({
        city: row.city,
        count: parseInt(row.count)
      }));
    } catch (error) {
      console.error('Error getting top cities:', error);
      return [];
    }
  }

  /**
   * Пошук користувачів
   */
  async searchUsers(searchDto: UserSearchDto): Promise<UserSearchResult> {
    return await this.getAllUsers(searchDto);
  }

  /**
   * Отримання профілю користувача
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return null;
      }
      
      // Видаляємо пароль з профілю
      const { password, ...userProfile } = user;
      return userProfile as User;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  /**
   * Оновлення профілю користувача
   */
  async updateUserProfile(userId: string, updateData: UserProfileDto, updatedBy: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Оновлюємо тільки профільні поля
      Object.keys(updateData).forEach(field => {
        if (updateData[field] !== undefined) {
          (user as any)[field] = updateData[field];
        }
      });

      user.updatedAt = new Date();
      const updatedUser = await this.userRepository.save(user);
      
      // Видаляємо пароль з відповіді
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }

  /**
   * Зміна паролю
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Перевіряємо поточний пароль
      const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Перевіряємо, що новий пароль та підтвердження співпадають
      if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      // Хешуємо новий пароль
      const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

      // Оновлюємо пароль
      user.password = hashedNewPassword;
      user.updatedAt = new Date();
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  /**
   * Верифікація email
   */
  async verifyEmail(userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      user.updatedAt = new Date();
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new Error(`Failed to verify email: ${error.message}`);
    }
  }

  /**
   * Оновлення останнього входу
   */
  async updateLastLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      user.lastLoginAt = new Date();
      user.lastActiveAt = new Date();
      user.updatedAt = new Date();
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  }

  /**
   * Отримання користувача за email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  /**
   * Отримання активних користувачів
   */
  async getActiveUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { isActive: true },
        order: { lastActiveAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error getting active users:', error);
      throw new Error(`Failed to get active users: ${error.message}`);
    }
  }

  /**
   * Отримання користувачів по ролі
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { role, isActive: true },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw new Error(`Failed to get users by role: ${error.message}`);
    }
  }
}

export const userService = new UserService();

