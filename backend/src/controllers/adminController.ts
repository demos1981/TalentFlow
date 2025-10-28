import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Job, JobStatus } from '../models/Job';
import { Application } from '../models/Application';
import { Company } from '../models/Company';
import { AuthRequest } from '../middleware/auth';

export class AdminController {
  // Отримати статистику платформи
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const jobRepository = AppDataSource.getRepository(Job);
      const applicationRepository = AppDataSource.getRepository(Application);
      const companyRepository = AppDataSource.getRepository(Company);

      // Паралельно отримуємо всі дані
      const [
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        activeUsers,
        newUsersToday,
        newJobsToday,
        newApplicationsToday,
        usersByRole
      ] = await Promise.all([
        userRepository.count(),
        jobRepository.count(),
        applicationRepository.count(),
        companyRepository.count(),
        userRepository.count({ where: { isActive: true } }),
        userRepository.count({
          where: {
            createdAt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }),
        jobRepository.count({
          where: {
            createdAt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }),
        applicationRepository.count({
          where: {
            createdAt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }),
        userRepository
          .createQueryBuilder('user')
          .select('user.role, COUNT(*) as count')
          .groupBy('user.role')
          .getRawMany()
      ]);

      return res.json({
        success: true,
        data: {
          totalUsers,
          totalJobs,
          totalApplications,
          totalCompanies,
          activeUsers,
          newUsersToday,
          newJobsToday,
          newApplicationsToday,
          usersByRole: usersByRole.reduce((acc, item) => {
            acc[item.role] = parseInt(item.count);
            return acc;
          }, {} as Record<string, number>)
        }
      });
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving statistics',
        error: error.message
      });
    }
  }

  // Отримати список користувачів з пагінацією
  static async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, role, search, isActive, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const userRepository = AppDataSource.getRepository(User);

      const queryBuilder = userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'company')
        .select([
          'user.id',
          'user.email',
          'user.firstName',
          'user.lastName',
          'user.role',
          'user.isActive',
          'user.emailVerified',
          'user.createdAt',
          'user.lastLoginAt',
          'user.lastActiveAt',
          'company.id',
          'company.name'
        ]);

      // Фільтри
      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      if (search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive: isActive === 'true' });
      }

      // Сортування
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder as 'ASC' | 'DESC');

      // Пагінація
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      const [users, total] = await queryBuilder.getManyAndCount();

      return res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting users:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Отримати користувача за ID
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { id },
        relations: ['company'],
        select: [
          'id', 'email', 'firstName', 'lastName', 'role', 'isActive', 
          'emailVerified', 'createdAt', 'lastLoginAt', 'lastActiveAt',
          'phone', 'location', 'bio', 'avatar'
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving user',
        error: error.message
      });
    }
  }

  // Оновити користувача
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, role, isActive, emailVerified, phone, location, bio } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Оновлюємо користувача
      await userRepository.update(id, {
        firstName,
        lastName,
        role,
        isActive,
        emailVerified,
        phone,
        location,
        bio,
        updatedAt: new Date()
      });

      const updatedUser = await userRepository.findOne({
        where: { id },
        relations: ['company'],
        select: [
          'id', 'email', 'firstName', 'lastName', 'role', 'isActive', 
          'emailVerified', 'createdAt', 'updatedAt', 'phone', 'location', 'bio'
        ]
      });

      return res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  // Видалити користувача (м'яке видалення)
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      
      const user = await userRepository.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // М'яке видалення - деактивуємо користувача
      await userRepository.update(id, {
        isActive: false,
        updatedAt: new Date()
      });

      return res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }

  // Активувати користувача
  static async activateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);

      await userRepository.update(id, {
        isActive: true,
        updatedAt: new Date()
      });

      return res.json({
        success: true,
        message: 'User activated successfully'
      });
    } catch (error) {
      console.error('Error activating user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error activating user',
        error: error.message
      });
    }
  }

  // Деактивувати користувача
  static async deactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);

      await userRepository.update(id, {
        isActive: false,
        updatedAt: new Date()
      });

      return res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deactivating user',
        error: error.message
      });
    }
  }

  // Отримати список компаній
  static async getCompanies(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, isActive } = req.query;
      const companyRepository = AppDataSource.getRepository(Company);

      const queryBuilder = companyRepository.createQueryBuilder('company')
        .leftJoinAndSelect('company.users', 'users')
        .select([
          'company.id',
          'company.name',
          'company.email',
          'company.website',
          'company.isActive',
          'company.createdAt',
          'company.updatedAt',
          'users.id',
          'users.email',
          'users.firstName',
          'users.lastName',
          'users.role'
        ]);

      // Фільтри
      if (search) {
        queryBuilder.andWhere(
          '(company.name ILIKE :search OR company.email ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('company.isActive = :isActive', { isActive: isActive === 'true' });
      }

      // Сортування
      queryBuilder.orderBy('company.createdAt', 'DESC');

      // Пагінація
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      const [companies, total] = await queryBuilder.getManyAndCount();

      return res.json({
        success: true,
        data: {
          companies,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting companies:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving companies',
        error: error.message
      });
    }
  }

  // Отримати компанію за ID
  static async getCompanyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyRepository = AppDataSource.getRepository(Company);

      const company = await companyRepository.findOne({
        where: { id },
        relations: ['users']
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      return res.json({
        success: true,
        data: company
      });
    } catch (error) {
      console.error('Error getting company by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving company',
        error: error.message
      });
    }
  }

  // Оновити компанію
  static async updateCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, website, isActive, description } = req.body;
      const companyRepository = AppDataSource.getRepository(Company);

      await companyRepository.update(id, {
        name,
        email,
        website,
        isActive,
        description,
        updatedAt: new Date()
      });

      const updatedCompany = await companyRepository.findOne({
        where: { id },
        relations: ['users']
      });

      return res.json({
        success: true,
        data: updatedCompany,
        message: 'Company updated successfully'
      });
    } catch (error) {
      console.error('Error updating company:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating company',
        error: error.message
      });
    }
  }

  // Видалити компанію
  static async deleteCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyRepository = AppDataSource.getRepository(Company);

      await companyRepository.update(id, {
        isActive: false,
        updatedAt: new Date()
      });

      return res.json({
        success: true,
        message: 'Company deactivated successfully'
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting company',
        error: error.message
      });
    }
  }

  // Отримати список вакансій
  static async getJobs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const jobRepository = AppDataSource.getRepository(Job);

      const queryBuilder = jobRepository.createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('job.applications', 'applications')
        .select([
          'job.id',
          'job.title',
          'job.description',
          'job.status',
          'job.createdAt',
          'job.updatedAt',
          'company.id',
          'company.name',
          'applications.id'
        ]);

      // Фільтри
      if (status) {
        queryBuilder.andWhere('job.status = :status', { status });
      }

      if (search) {
        queryBuilder.andWhere(
          '(job.title ILIKE :search OR job.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Сортування
      queryBuilder.orderBy('job.createdAt', 'DESC');

      // Пагінація
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      const [jobs, total] = await queryBuilder.getManyAndCount();

      return res.json({
        success: true,
        data: {
          jobs,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting jobs:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving jobs',
        error: error.message
      });
    }
  }

  // Отримати вакансію за ID
  static async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const jobRepository = AppDataSource.getRepository(Job);

      const job = await jobRepository.findOne({
        where: { id },
        relations: ['company', 'applications']
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      return res.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving job',
        error: error.message
      });
    }
  }

  // Оновити вакансію
  static async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const jobData = req.body;
      const jobRepository = AppDataSource.getRepository(Job);

      await jobRepository.update(id, {
        ...jobData,
        updatedAt: new Date()
      });

      const updatedJob = await jobRepository.findOne({
        where: { id },
        relations: ['company', 'applications']
      });

      return res.json({
        success: true,
        data: updatedJob,
        message: 'Job updated successfully'
      });
    } catch (error) {
      console.error('Error updating job:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating job',
        error: error.message
      });
    }
  }

  // Видалити вакансію
  static async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const jobRepository = AppDataSource.getRepository(Job);

      await jobRepository.update(id, {
        status: JobStatus.CLOSED,
        updatedAt: new Date()
      });

      return res.json({
        success: true,
        message: 'Job closed successfully'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting job',
        error: error.message
      });
    }
  }

  // Отримати список заявок
  static async getApplications(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, jobId, candidateId } = req.query;
      const applicationRepository = AppDataSource.getRepository(Application);

      const queryBuilder = applicationRepository.createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .leftJoinAndSelect('application.candidate', 'candidate')
        .select([
          'application.id',
          'application.status',
          'application.createdAt',
          'application.updatedAt',
          'job.id',
          'job.title',
          'candidate.id',
          'candidate.firstName',
          'candidate.lastName',
          'candidate.email'
        ]);

      // Фільтри
      if (status) {
        queryBuilder.andWhere('application.status = :status', { status });
      }

      if (jobId) {
        queryBuilder.andWhere('application.jobId = :jobId', { jobId });
      }

      if (candidateId) {
        queryBuilder.andWhere('application.candidateId = :candidateId', { candidateId });
      }

      // Сортування
      queryBuilder.orderBy('application.createdAt', 'DESC');

      // Пагінація
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      const [applications, total] = await queryBuilder.getManyAndCount();

      return res.json({
        success: true,
        data: {
          applications,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting applications:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving applications',
        error: error.message
      });
    }
  }

  // Отримати заявку за ID
  static async getApplicationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const applicationRepository = AppDataSource.getRepository(Application);

      const application = await applicationRepository.findOne({
        where: { id },
        relations: ['job', 'candidate']
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      return res.json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error getting application by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving application',
        error: error.message
      });
    }
  }

  // Оновити заявку
  static async updateApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const applicationRepository = AppDataSource.getRepository(Application);

      await applicationRepository.update(id, {
        status,
        updatedAt: new Date()
      });

      const updatedApplication = await applicationRepository.findOne({
        where: { id },
        relations: ['job', 'candidate']
      });

      return res.json({
        success: true,
        data: updatedApplication,
        message: 'Application updated successfully'
      });
    } catch (error) {
      console.error('Error updating application:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating application',
        error: error.message
      });
    }
  }

  // Видалити заявку
  static async deleteApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const applicationRepository = AppDataSource.getRepository(Application);

      await applicationRepository.delete(id);

      return res.json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      return res.status(500).json({
          success: false,
        message: 'Error deleting application',
        error: error.message
      });
    }
  }

  // Отримати системні логи (заглушка)
  static async getSystemLogs(req: Request, res: Response) {
    try {
      return res.json({
        success: true,
        data: {
          logs: [
            {
              id: 1,
              level: 'info',
              message: 'User login successful',
              timestamp: new Date().toISOString(),
              userId: 'user-123',
              ip: '192.168.1.1'
            },
            {
              id: 2,
              level: 'warn',
              message: 'Failed login attempt',
              timestamp: new Date(Date.now() - 300000).toISOString(),
              userId: null,
              ip: '192.168.1.2'
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error getting system logs:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving system logs',
        error: error.message
      });
    }
  }

  // Отримати логи активності
  static async getActivityLogs(req: Request, res: Response) {
    try {
      return res.json({
        success: true,
        data: {
          activities: [
            {
              id: 1,
              type: 'user_login',
              description: 'User logged in',
              userId: 'user-123',
              timestamp: new Date().toISOString()
            },
            {
              id: 2,
              type: 'job_created',
              description: 'New job posted',
              userId: 'user-456',
              timestamp: new Date(Date.now() - 600000).toISOString()
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving activity logs',
        error: error.message
      });
    }
  }
}