import { Repository, Not, IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Job } from '../models/Job';
import { CandidateProfile } from '../models/CandidateProfile';
import { User, UserRole } from '../models/User';
import { EmbeddingService } from './embeddingService';

export interface VectorSearchResult {
  id: string;
  similarity: number;
  data: any;
}

export interface VectorSearchOptions {
  minSimilarity?: number;
  limit?: number;
  includeInactive?: boolean;
}

export class VectorSearchService {
  private embeddingService: EmbeddingService;
  private jobRepository: Repository<Job>;
  private candidateRepository: Repository<CandidateProfile>;
  private userRepository: Repository<User>;

  constructor() {
    this.embeddingService = new EmbeddingService();
    this.jobRepository = AppDataSource.getRepository(Job);
    this.candidateRepository = AppDataSource.getRepository(CandidateProfile);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Знаходить найближчі вакансії до кандидата
   */
  async findSimilarJobs(
    candidateId: string, 
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    try {
      const { minSimilarity = 0.3, limit = 20, includeInactive = false } = options;

      // Отримуємо кандидата з embedding
      const candidate = await this.candidateRepository.findOne({
        where: { userId: candidateId },
        relations: ['user']
      });

      if (!candidate || !candidate.embedding) {
        console.warn(`No embedding found for candidate ${candidateId}`);
        return [];
      }

      // SQL запит для векторного пошуку (косинусна схожість)
      const query = `
        SELECT 
          j.id,
          j.title,
          j.description,
          j.location,
          j.salary_min as "salaryMin",
          j.salary_max as "salaryMax",
          j.currency,
          j.skills,
          j.experience_level as "experienceLevel",
          j.type,
          j.company_id as "companyId",
          j.created_at as "createdAt",
          j.updated_at as "updatedAt",
          -- Косинусна схожість
          (
            SELECT 
              CASE 
                WHEN (candidate_embedding.norm = 0 OR job_embedding.norm = 0) THEN 0
                ELSE (candidate_embedding.embedding <#> job_embedding.embedding) * -1
              END
            FROM (
              SELECT 
                embedding,
                sqrt(sum(unnest(embedding) * unnest(embedding))) as norm
              FROM candidate_profiles 
              WHERE user_id = $1
            ) candidate_embedding,
            (
              SELECT 
                embedding,
                sqrt(sum(unnest(embedding) * unnest(embedding))) as norm
              FROM jobs 
              WHERE id = j.id
            ) job_embedding
          ) as similarity
        FROM jobs j
        WHERE j.is_active = true
          AND j.status = 'active'
          AND j.embedding IS NOT NULL
          ${includeInactive ? '' : 'AND j.is_active = true'}
        ORDER BY similarity DESC
        LIMIT $2
      `;

      const results = await AppDataSource.query(query, [candidateId, limit * 2]);

      // Фільтруємо за мінімальною схожістю
      const filteredResults = results
        .filter((result: any) => result.similarity >= minSimilarity)
        .slice(0, limit)
        .map((result: any) => ({
          id: result.id,
          similarity: result.similarity,
          data: {
            id: result.id,
            title: result.title,
            description: result.description,
            location: result.location,
            salaryMin: result.salaryMin,
            salaryMax: result.salaryMax,
            currency: result.currency,
            skills: result.skills,
            experienceLevel: result.experienceLevel,
            type: result.type,
            companyId: result.companyId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
          }
        }));

      return filteredResults;
    } catch (error) {
      console.error('Error in vector job search:', error);
      return [];
    }
  }

  /**
   * Знаходить найближчих кандидатів до вакансії
   */
  async findSimilarCandidates(
    jobId: string, 
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    try {
      const { minSimilarity = 0.1, limit = 20, includeInactive = false } = options;

      // Отримуємо вакансію з embedding
      const job = await this.jobRepository.findOne({
        where: { id: jobId }
      });

      if (!job || !job.embedding) {
        console.warn(`No embedding found for job ${jobId}`);
        return [];
      }

      // SQL запит для векторного пошуку
      const query = `
        SELECT 
          cp.user_id as id,
          cp.title,
          cp.summary,
          cp.location,
          cp.skills,
          cp.years_of_experience as "yearsOfExperience",
          u.first_name as "firstName",
          u.last_name as "lastName",
          u.email,
          u.avatar,
          -- Косинусна схожість
          (
            SELECT 
              CASE 
                WHEN (job_embedding.norm = 0 OR candidate_embedding.norm = 0) THEN 0
                ELSE (job_embedding.embedding <#> candidate_embedding.embedding) * -1
              END
            FROM (
              SELECT 
                embedding,
                sqrt(sum(unnest(embedding) * unnest(embedding))) as norm
              FROM jobs 
              WHERE id = $1
            ) job_embedding,
            (
              SELECT 
                embedding,
                sqrt(sum(unnest(embedding) * unnest(embedding))) as norm
              FROM candidate_profiles 
              WHERE user_id = cp.user_id
            ) candidate_embedding
          ) as similarity
        FROM candidate_profiles cp
        JOIN users u ON u.id = cp.user_id
        WHERE u.role = 'candidate'
          AND u.is_active = true
          AND cp.embedding IS NOT NULL
          AND cp.is_active = true
        ORDER BY similarity DESC
        LIMIT $2
      `;

      const results = await AppDataSource.query(query, [jobId, limit * 2]);

      // Фільтруємо за мінімальною схожістю
      const filteredResults = results
        .filter((result: any) => result.similarity >= minSimilarity)
        .slice(0, limit)
        .map((result: any) => ({
          id: result.id,
          similarity: result.similarity,
          data: {
            id: result.id,
            title: result.title,
            summary: result.summary,
            location: result.location,
            skills: result.skills,
            yearsOfExperience: result.yearsOfExperience,
            user: {
              firstName: result.firstName,
              lastName: result.lastName,
              email: result.email,
              avatar: result.avatar
            }
          }
        }));

      return filteredResults;
    } catch (error) {
      console.error('Error in vector candidate search:', error);
      return [];
    }
  }

  /**
   * Генерує embeddings для всіх вакансій без embeddings
   */
  async generateJobEmbeddings(batchSize: number = 10): Promise<void> {
    try {
      const jobsWithoutEmbeddings = await this.jobRepository
        .createQueryBuilder('job')
        .where('job.embedding IS NULL')
        .andWhere('job.isActive = :isActive', { isActive: true })
        .limit(batchSize)
        .getMany();

      if (jobsWithoutEmbeddings.length === 0) {
        console.log('No jobs need embedding generation');
        return;
      }

      console.log(`Generating embeddings for ${jobsWithoutEmbeddings.length} jobs...`);

      for (const job of jobsWithoutEmbeddings) {
        try {
          const embeddingText = this.embeddingService.createJobEmbeddingText(job);
          const embeddingResult = await this.embeddingService.generateEmbedding(embeddingText);

          await this.jobRepository.update(job.id, {
            embeddingText,
            embedding: embeddingResult.embedding,
            embeddingUpdatedAt: new Date()
          });

          console.log(`Generated embedding for job: ${job.title}`);
        } catch (error) {
          console.error(`Failed to generate embedding for job ${job.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error generating job embeddings:', error);
    }
  }

  /**
   * Генерує embeddings для всіх кандидатів без embeddings
   */
  async generateCandidateEmbeddings(batchSize: number = 10): Promise<void> {
    try {
      const candidatesWithoutEmbeddings = await this.candidateRepository
        .createQueryBuilder('candidate')
        .leftJoin('candidate.user', 'user')
        .where('candidate.embedding IS NULL')
        .andWhere('user.isActive = :isActive', { isActive: true })
        .limit(batchSize)
        .getMany();

      if (candidatesWithoutEmbeddings.length === 0) {
        console.log('No candidates need embedding generation');
        return;
      }

      console.log(`Generating embeddings for ${candidatesWithoutEmbeddings.length} candidates...`);

      for (const candidate of candidatesWithoutEmbeddings) {
        try {
          const embeddingText = this.embeddingService.createCandidateEmbeddingText(candidate);
          const embeddingResult = await this.embeddingService.generateEmbedding(embeddingText);

          await this.candidateRepository.update(candidate.id, {
            embeddingText,
            embedding: embeddingResult.embedding,
            embeddingUpdatedAt: new Date()
          });

          console.log(`Generated embedding for candidate: ${candidate.userId}`);
        } catch (error) {
          console.error(`Failed to generate embedding for candidate ${candidate.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error generating candidate embeddings:', error);
    }
  }

  /**
   * Оновлює embedding для конкретної вакансії
   */
  async updateJobEmbedding(jobId: string): Promise<void> {
    try {
      const job = await this.jobRepository.findOne({ where: { id: jobId } });
      if (!job) {
        throw new Error(`Job ${jobId} not found`);
      }

      const embeddingText = this.embeddingService.createJobEmbeddingText(job);
      const embeddingResult = await this.embeddingService.generateEmbedding(embeddingText);

      await this.jobRepository.update(jobId, {
        embeddingText,
        embedding: embeddingResult.embedding,
        embeddingUpdatedAt: new Date()
      });

      console.log(`Updated embedding for job: ${job.title}`);
    } catch (error) {
      console.error(`Error updating job embedding for ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Оновлює embedding для конкретного кандидата
   */
  async updateCandidateEmbedding(candidateId: string): Promise<void> {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: { userId: candidateId },
        relations: ['user']
      });
      
      if (!candidate) {
        throw new Error(`Candidate ${candidateId} not found`);
      }

      const embeddingText = this.embeddingService.createCandidateEmbeddingText(candidate);
      const embeddingResult = await this.embeddingService.generateEmbedding(embeddingText);

      await this.candidateRepository.update(candidate.id, {
        embeddingText,
        embedding: embeddingResult.embedding,
        embeddingUpdatedAt: new Date()
      });

      console.log(`Updated embedding for candidate: ${candidateId}`);
    } catch (error) {
      console.error(`Error updating candidate embedding for ${candidateId}:`, error);
      throw error;
    }
  }

  /**
   * Отримує статистику embeddings
   */
  async getEmbeddingStats(): Promise<{
    totalJobs: number;
    jobsWithEmbeddings: number;
    totalCandidates: number;
    candidatesWithEmbeddings: number;
  }> {
    try {
      const [totalJobs, jobsWithEmbeddings, totalCandidates, candidatesWithEmbeddings] = await Promise.all([
        this.jobRepository.count({ where: { isActive: true } }),
        this.jobRepository.count({ where: { isActive: true, embedding: Not(IsNull()) } }),
        this.candidateRepository.count({ where: { isActive: true } }),
        this.candidateRepository.count({ where: { isActive: true, embedding: Not(IsNull()) } })
      ]);

      return {
        totalJobs,
        jobsWithEmbeddings,
        totalCandidates,
        candidatesWithEmbeddings
      };
    } catch (error) {
      console.error('Error getting embedding stats:', error);
      return {
        totalJobs: 0,
        jobsWithEmbeddings: 0,
        totalCandidates: 0,
        candidatesWithEmbeddings: 0
      };
    }
  }
}
