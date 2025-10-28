import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Assessment } from '../models/Assessment';
import { BaseService } from './baseService';

export class AssessmentService extends BaseService<Assessment> {
  constructor() {
    super(AppDataSource.getRepository(Assessment));
  }

  async createAssessment(assessmentData: any, userId: string): Promise<Assessment> {
    try {
      const assessment = this.repository.create({
        ...assessmentData,
        userId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedAssessment = await this.repository.save(assessment);
      return Array.isArray(savedAssessment) ? savedAssessment[0] : savedAssessment;
    } catch (error) {
      throw new Error(`Error creating assessment: ${error.message}`);
    }
  }

  async getAllAssessments(filters: any): Promise<{ assessments: Assessment[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const skip = (page - 1) * limit;

      const queryBuilder = this.repository.createQueryBuilder('assessment')
        .leftJoinAndSelect('assessment.user', 'user')
        .leftJoinAndSelect('assessment.job', 'job')
        .where('assessment.isActive = :isActive', { isActive: true });

      // Apply filters
      if (filters.userId) {
        queryBuilder.andWhere('assessment.userId = :userId', { userId: filters.userId });
      }

      if (filters.jobId) {
        queryBuilder.andWhere('assessment.jobId = :jobId', { jobId: filters.jobId });
      }

      if (filters.status) {
        if (filters.status === 'completed') {
          queryBuilder.andWhere('assessment.completedAt IS NOT NULL');
        } else if (filters.status === 'active') {
          queryBuilder.andWhere('assessment.completedAt IS NULL');
        }
      }

      if (filters.isPassed !== undefined) {
        queryBuilder.andWhere('assessment.isPassed = :isPassed', { isPassed: filters.isPassed });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(assessment.title ILIKE :search OR assessment.description ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination
      const assessments = await queryBuilder
        .orderBy('assessment.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        assessments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error getting assessments: ${error.message}`);
    }
  }

  async getAssessmentById(id: string): Promise<Assessment | null> {
    try {
      const assessment = await this.repository.findOne({
        where: { id, isActive: true },
        relations: ['user', 'job']
      });

      return assessment;
    } catch (error) {
      throw new Error(`Error getting assessment: ${error.message}`);
    }
  }

  async updateAssessment(id: string, updateData: any): Promise<Assessment | null> {
    try {
      const assessment = await this.repository.findOne({
        where: { id, isActive: true }
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      Object.assign(assessment, updateData, { updatedAt: new Date() });
      const updatedAssessment = await this.repository.save(assessment);

      return updatedAssessment;
    } catch (error) {
      throw new Error(`Error updating assessment: ${error.message}`);
    }
  }

  async deleteAssessment(id: string): Promise<void> {
    try {
      const assessment = await this.repository.findOne({
        where: { id, isActive: true }
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // Soft delete
      assessment.isActive = false;
      assessment.updatedAt = new Date();
      await this.repository.save(assessment);
    } catch (error) {
      throw new Error(`Error deleting assessment: ${error.message}`);
    }
  }

  async getAssessmentsByUser(userId: string, page: number = 1, limit: number = 20): Promise<{ assessments: Assessment[]; total: number }> {
    try {
      const assessments = await this.repository.find({
        where: { userId, isActive: true },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['job']
      });

      const total = await this.repository.count({ where: { userId, isActive: true } });

      return { assessments, total };
    } catch (error) {
      throw new Error(`Error getting user assessments: ${error.message}`);
    }
  }

  async getAssessmentsByJob(jobId: string, page: number = 1, limit: number = 20): Promise<{ assessments: Assessment[]; total: number }> {
    try {
      const assessments = await this.repository.find({
        where: { jobId, isActive: true },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['user']
      });

      const total = await this.repository.count({ where: { jobId, isActive: true } });

      return { assessments, total };
    } catch (error) {
      throw new Error(`Error getting job assessments: ${error.message}`);
    }
  }

  async startAssessment(assessmentId: string): Promise<Assessment | null> {
    try {
      return await this.updateAssessment(assessmentId, {
        startedAt: new Date()
      });
    } catch (error) {
      throw new Error(`Error starting assessment: ${error.message}`);
    }
  }

  async completeAssessment(assessmentId: string, answers: any[], score: number, percentage: number): Promise<Assessment | null> {
    try {
      const isPassed = percentage >= 70; // 70% - passing score
      
      return await this.updateAssessment(assessmentId, {
        completedAt: new Date(),
        score,
        percentage,
        isPassed,
        answers
      });
    } catch (error) {
      throw new Error(`Error completing assessment: ${error.message}`);
    }
  }

  async getAssessmentStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    passed: number;
    failed: number;
  }> {
    try {
      const [
        total,
        active,
        completed,
        passed,
        failed
      ] = await Promise.all([
        this.repository.count(),
        this.repository.count({ where: { isActive: true } }),
        this.repository.count({ where: { completedAt: { not: null } } as any }),
        this.repository.count({ where: { isPassed: true } }),
        this.repository.count({ where: { isPassed: false, completedAt: { not: null } } as any })
      ]);

      return {
        total,
        active,
        completed,
        passed,
        failed
      };
    } catch (error) {
      throw new Error(`Error getting assessment stats: ${error.message}`);
    }
  }
}

export const assessmentService = new AssessmentService();
