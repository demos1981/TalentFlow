import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { CompanyUser, CompanyUserRole, CompanyUserStatus } from '../models/CompanyUser';
import { User, UserRole } from '../models/User';
import { Company } from '../models/Company';
import bcrypt from 'bcrypt';

export class CompanyUserService {
  private companyUserRepository: Repository<CompanyUser>;
  private userRepository: Repository<User>;
  private companyRepository: Repository<Company>;

  constructor() {
    this.companyUserRepository = AppDataSource.getRepository(CompanyUser);
    this.userRepository = AppDataSource.getRepository(User);
    this.companyRepository = AppDataSource.getRepository(Company);
  }

  /**
   * Отримання всіх користувачів компанії
   */
  async getCompanyUsers(companyId: string, filters?: {
    role?: CompanyUserRole;
    status?: CompanyUserStatus;
    search?: string;
  }): Promise<CompanyUser[]> {
    try {
      const queryBuilder = this.companyUserRepository
        .createQueryBuilder('companyUser')
        .leftJoinAndSelect('companyUser.user', 'user')
        .where('companyUser.companyId = :companyId', { companyId });

      if (filters?.role) {
        queryBuilder.andWhere('companyUser.role = :role', { role: filters.role });
      }

      if (filters?.status) {
        queryBuilder.andWhere('companyUser.status = :status', { status: filters.status });
      }

      if (filters?.search) {
        queryBuilder.andWhere(
          '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search) OR LOWER(companyUser.title) LIKE LOWER(:search))',
          { search: `%${filters.search}%` }
        );
      }

      return await queryBuilder
        .orderBy('companyUser.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new Error(`Error getting company users: ${error.message}`);
    }
  }

  /**
   * Отримання користувача компанії за ID
   */
  async getCompanyUserById(id: string): Promise<CompanyUser | null> {
    try {
      return await this.companyUserRepository.findOne({
        where: { id },
        relations: ['user', 'company']
      });
    } catch (error) {
      throw new Error(`Error getting company user: ${error.message}`);
    }
  }

  /**
   * Запрошення нового користувача до компанії
   */
  async inviteUser(
    companyId: string,
    invitedBy: string,
    userData: {
      email: string;
      firstName?: string;
      lastName?: string;
      title?: string;
      department?: string;
      role?: CompanyUserRole;
      permissions?: any;
    }
  ): Promise<{ companyUser: CompanyUser; user: User; isNewUser: boolean }> {
    try {
      // Перевіряємо чи компанія існує
      const company = await this.companyRepository.findOne({ where: { id: companyId } });
      if (!company) {
        throw new Error('Company not found');
      }

      // Перевіряємо чи хто запрошує має права
      const inviter = await this.companyUserRepository.findOne({
        where: { companyId, userId: invitedBy }
      });

      if (!inviter || !inviter.permissions?.canManageUsers) {
        throw new Error('No permission to invite users');
      }

      // Перевіряємо чи користувач вже існує
      let user = await this.userRepository.findOne({ where: { email: userData.email } });
      let isNewUser = false;

      if (!user) {
        // Створюємо нового користувача
        const defaultPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);

        user = this.userRepository.create({
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          password: hashedPassword,
          role: UserRole.EMPLOYER,
          companyId: companyId,
          isActive: false, // Буде активовано після підтвердження
          emailVerified: false
        });

        user = await this.userRepository.save(user);
        isNewUser = true;

        // TODO: Відправити email з посиланням для активації та встановлення пароля
      }

      // Перевіряємо чи користувач вже доданий до компанії
      const existing = await this.companyUserRepository.findOne({
        where: { companyId, userId: user.id }
      });

      if (existing) {
        throw new Error('User already added to company');
      }

      // Створюємо запис CompanyUser
      const companyUser = this.companyUserRepository.create({
        companyId,
        userId: user.id,
        role: userData.role || CompanyUserRole.RECRUITER,
        status: CompanyUserStatus.PENDING,
        title: userData.title,
        department: userData.department,
        permissions: userData.permissions || this.getDefaultPermissions(userData.role || CompanyUserRole.RECRUITER),
        invitedBy,
        invitedAt: new Date()
      });

      const savedCompanyUser = await this.companyUserRepository.save(companyUser);

      return { companyUser: savedCompanyUser, user, isNewUser };
    } catch (error) {
      throw new Error(`Error inviting user: ${error.message}`);
    }
  }

  /**
   * Оновлення користувача компанії
   */
  async updateCompanyUser(
    id: string,
    userId: string,
    updateData: {
      title?: string;
      department?: string;
      role?: CompanyUserRole;
      status?: CompanyUserStatus;
      permissions?: any;
      notes?: string;
    }
  ): Promise<CompanyUser> {
    try {
      const companyUser = await this.companyUserRepository.findOne({
        where: { id },
        relations: ['company']
      });

      if (!companyUser) {
        throw new Error('Company user not found');
      }

      // Перевіряємо чи користувач має права
      const updater = await this.companyUserRepository.findOne({
        where: { companyId: companyUser.companyId, userId }
      });

      if (!updater || !updater.permissions?.canManageUsers) {
        throw new Error('No permission to update users');
      }

      // Не можна змінити власника
      if (companyUser.role === CompanyUserRole.OWNER && updateData.role !== CompanyUserRole.OWNER) {
        throw new Error('Cannot change owner role');
      }

      // Оновлюємо дані
      Object.assign(companyUser, updateData);
      companyUser.updatedAt = new Date();

      return await this.companyUserRepository.save(companyUser);
    } catch (error) {
      throw new Error(`Error updating company user: ${error.message}`);
    }
  }

  /**
   * Видалення користувача з компанії
   */
  async removeCompanyUser(id: string, userId: string): Promise<void> {
    try {
      const companyUser = await this.companyUserRepository.findOne({
        where: { id }
      });

      if (!companyUser) {
        throw new Error('Company user not found');
      }

      // Перевіряємо чи користувач має права
      const remover = await this.companyUserRepository.findOne({
        where: { companyId: companyUser.companyId, userId }
      });

      if (!remover || !remover.permissions?.canManageUsers) {
        throw new Error('No permission to remove users');
      }

      // Не можна видалити власника
      if (companyUser.role === CompanyUserRole.OWNER) {
        throw new Error('Cannot remove company owner');
      }

      await this.companyUserRepository.remove(companyUser);
    } catch (error) {
      throw new Error(`Error removing company user: ${error.message}`);
    }
  }

  /**
   * Оновлення прав користувача
   */
  async updatePermissions(
    id: string,
    userId: string,
    permissions: any
  ): Promise<CompanyUser> {
    try {
      const companyUser = await this.companyUserRepository.findOne({
        where: { id }
      });

      if (!companyUser) {
        throw new Error('Company user not found');
      }

      // Перевіряємо чи користувач має права
      const updater = await this.companyUserRepository.findOne({
        where: { companyId: companyUser.companyId, userId }
      });

      if (!updater || !updater.permissions?.canManageUsers) {
        throw new Error('No permission to update permissions');
      }

      companyUser.permissions = { ...companyUser.permissions, ...permissions };
      companyUser.updatedAt = new Date();

      return await this.companyUserRepository.save(companyUser);
    } catch (error) {
      throw new Error(`Error updating permissions: ${error.message}`);
    }
  }

  /**
   * Перевірка прав користувача
   */
  async checkPermission(userId: string, companyId: string, permission: string): Promise<boolean> {
    try {
      const companyUser = await this.companyUserRepository.findOne({
        where: { userId, companyId, status: CompanyUserStatus.ACTIVE }
      });

      if (!companyUser) {
        return false;
      }

      // Owner має всі права
      if (companyUser.role === CompanyUserRole.OWNER) {
        return true;
      }

      return companyUser.permissions?.[permission] === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Отримання дефолтних прав для ролі
   */
  private getDefaultPermissions(role: CompanyUserRole) {
    switch (role) {
      case CompanyUserRole.OWNER:
        return {
          canPublishJobsSelf: true,
          canViewOthersJobs: true,
          canManageOthersJobs: true,
          canViewCandidateContacts: true,
          canActivateServices: true,
          canMakePayments: true,
          canManageUsers: true,
          canManagePaymentCards: true,
          canEditCompanyInfo: true,
          canManageJobTemplates: true
        };

      case CompanyUserRole.ADMIN:
        return {
          canPublishJobsSelf: true,
          canViewOthersJobs: true,
          canManageOthersJobs: true,
          canViewCandidateContacts: true,
          canActivateServices: true,
          canMakePayments: false,
          canManageUsers: true,
          canManagePaymentCards: false,
          canEditCompanyInfo: true,
          canManageJobTemplates: true
        };

      case CompanyUserRole.MANAGER:
        return {
          canPublishJobsSelf: true,
          canViewOthersJobs: true,
          canManageOthersJobs: true,
          canViewCandidateContacts: true,
          canActivateServices: false,
          canMakePayments: false,
          canManageUsers: false,
          canManagePaymentCards: false,
          canEditCompanyInfo: false,
          canManageJobTemplates: false
        };

      case CompanyUserRole.RECRUITER:
        return {
          canPublishJobsSelf: false,
          canViewOthersJobs: true,
          canManageOthersJobs: false,
          canViewCandidateContacts: true,
          canActivateServices: false,
          canMakePayments: false,
          canManageUsers: false,
          canManagePaymentCards: false,
          canEditCompanyInfo: false,
          canManageJobTemplates: false
        };

      case CompanyUserRole.VIEWER:
        return {
          canPublishJobsSelf: false,
          canViewOthersJobs: true,
          canManageOthersJobs: false,
          canViewCandidateContacts: false,
          canActivateServices: false,
          canMakePayments: false,
          canManageUsers: false,
          canManagePaymentCards: false,
          canEditCompanyInfo: false,
          canManageJobTemplates: false
        };

      default:
        return {};
    }
  }

  /**
   * Прийняття запрошення
   */
  async acceptInvitation(id: string, userId: string): Promise<CompanyUser> {
    try {
      const companyUser = await this.companyUserRepository.findOne({
        where: { id, userId }
      });

      if (!companyUser) {
        throw new Error('Invitation not found');
      }

      if (companyUser.status !== CompanyUserStatus.PENDING) {
        throw new Error('Invitation already processed');
      }

      companyUser.status = CompanyUserStatus.ACTIVE;
      companyUser.acceptedAt = new Date();

      // Активуємо користувача якщо він був неактивний
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user && !user.isActive) {
        user.isActive = true;
        await this.userRepository.save(user);
      }

      return await this.companyUserRepository.save(companyUser);
    } catch (error) {
      throw new Error(`Error accepting invitation: ${error.message}`);
    }
  }

  /**
   * Відхилення запрошення
   */
  async rejectInvitation(id: string, userId: string): Promise<void> {
    try {
      const companyUser = await this.companyUserRepository.findOne({
        where: { id, userId, status: CompanyUserStatus.PENDING }
      });

      if (!companyUser) {
        throw new Error('Invitation not found');
      }

      await this.companyUserRepository.remove(companyUser);
    } catch (error) {
      throw new Error(`Error rejecting invitation: ${error.message}`);
    }
  }
}

export const companyUserService = new CompanyUserService();

