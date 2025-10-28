import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Job, JobStatus } from '../models/Job';
import AiRecommendation, { RecommendationType, MatchScore } from '../models/AiRecommendation';
import { openAIService } from './openAIService';

export interface AiMatchingFilters {
  type?: string;
  minMatchScore?: string | number;
  candidateId?: string;
  jobId?: string;
  search?: string;
  location?: string;
  skills?: string[];
  limit?: number;
  offset?: number;
}

export interface GenerateRecommendationsData {
  type?: string;
  candidateId?: string;
  jobId?: string;
  limit?: number;
}

export interface UpdateRecommendationData {
  isViewed?: boolean;
  isContacted?: boolean;
  feedbackRating?: number;
  feedbackComment?: string;
}

export interface AiMatchingResponse {
  recommendations: any[];
  stats: any;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: AiMatchingFilters;
}

export interface AiMatchingStats {
  totalMatches: number;
  highQualityMatches: number;
  averageMatchScore: number;
  candidatesMatched: number;
  jobsMatched: number;
  lastUpdated: string;
  aiAccuracy: number;
  processingTime: number;
  matchScoreDistribution?: any[];
  topSkills?: any[];
  topLocations?: any[];
}

export class AiMatchingService {
  private readonly logger = console;

  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  private getJobRepository() {
    return AppDataSource.getRepository(Job);
  }

  private getAiRecommendationRepository() {
    return AppDataSource.getRepository(AiRecommendation);
  }

  /**
   * Отримати AI рекомендації з фільтрами
   */
  async getRecommendations(filters: AiMatchingFilters): Promise<AiMatchingResponse> {
    try {
      this.logger.log('Getting AI recommendations with filters:', filters);
      
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      const queryBuilder = aiRecommendationRepository
        .createQueryBuilder('recommendation')
        .leftJoinAndSelect('recommendation.candidate', 'candidate')
        .leftJoinAndSelect('recommendation.job', 'job')
        .leftJoinAndSelect('job.company', 'company')
        .where('recommendation.isActive = :isActive', { isActive: true });

      // Apply filters
      if (filters.type) {
        queryBuilder.andWhere('recommendation.type = :type', { type: filters.type });
      }

      if (filters.minMatchScore) {
        const minScore = parseFloat(filters.minMatchScore.toString());
        queryBuilder.andWhere('recommendation.matchScore >= :minScore', { minScore });
      }

      if (filters.candidateId) {
        queryBuilder.andWhere('recommendation.candidateId = :candidateId', { candidateId: filters.candidateId });
      }

      if (filters.jobId) {
        queryBuilder.andWhere('recommendation.jobId = :jobId', { jobId: filters.jobId });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(candidate.firstName ILIKE :search OR candidate.lastName ILIKE :search OR job.title ILIKE :search OR company.name ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      if (filters.location) {
        queryBuilder.andWhere(
          '(candidate.location ILIKE :location OR job.location ILIKE :location)',
          { location: `%${filters.location}%` }
        );
      }

      if (filters.skills && filters.skills.length > 0) {
        queryBuilder.andWhere('recommendation.skillsMatch @> :skills', { skills: JSON.stringify(filters.skills) });
      }

      // Pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      
      queryBuilder
        .orderBy('recommendation.matchScore', 'DESC')
        .addOrderBy('recommendation.createdAt', 'DESC')
        .limit(limit)
        .offset(offset);

      const [recommendations, total] = await queryBuilder.getManyAndCount();

      // Get stats
      const stats = await this.getMatchingStats();

      return {
        recommendations: recommendations.map(rec => ({
          id: rec.id,
          type: rec.type,
          matchScore: rec.matchScore,
          matchScoreCategory: rec.matchScoreCategory,
          skillsMatch: rec.skillsMatch,
          experienceMatch: rec.experienceMatch,
          locationMatch: rec.locationMatch,
          salaryMatch: rec.salaryMatch,
          aiReason: rec.aiReason,
          aiMetadata: rec.aiMetadata,
          isActive: rec.isActive,
          isViewed: rec.isViewed,
          isContacted: rec.isContacted,
          viewedAt: rec.viewedAt,
          contactedAt: rec.contactedAt,
          feedback: rec.feedback,
          createdAt: rec.createdAt,
          updatedAt: rec.updatedAt,
          candidate: rec.candidate ? {
            id: rec.candidate.id,
            firstName: rec.candidate.firstName,
            lastName: rec.candidate.lastName,
            email: rec.candidate.email,
            avatar: rec.candidate.avatar,
            location: rec.candidate.location,
            skills: rec.candidate.skills,
            experience: rec.candidate.experience
          } : null,
          job: rec.job ? {
            id: rec.job.id,
            title: rec.job.title,
            description: rec.job.description,
            location: rec.job.location,
            salaryMin: rec.job.salaryMin,
          salaryMax: rec.job.salaryMax,
            company: rec.job.company ? {
              id: rec.job.company.id,
              name: rec.job.company.name,
              logo: rec.job.company.logo
            } : null
          } : null
        })),
        stats,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        },
        filters
      };
    } catch (error) {
      this.logger.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  /**
   * Отримати рекомендацію за ID
   */
  async getRecommendationById(id: string): Promise<any> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      const recommendation = await aiRecommendationRepository
        .createQueryBuilder('recommendation')
        .leftJoinAndSelect('recommendation.candidate', 'candidate')
        .leftJoinAndSelect('recommendation.job', 'job')
        .leftJoinAndSelect('job.company', 'company')
        .where('recommendation.id = :id', { id })
        .getOne();

      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      return {
        id: recommendation.id,
        type: recommendation.type,
        matchScore: recommendation.matchScore,
        matchScoreCategory: recommendation.matchScoreCategory,
        skillsMatch: recommendation.skillsMatch,
        experienceMatch: recommendation.experienceMatch,
        locationMatch: recommendation.locationMatch,
        salaryMatch: recommendation.salaryMatch,
        aiReason: recommendation.aiReason,
        aiMetadata: recommendation.aiMetadata,
        isActive: recommendation.isActive,
        isViewed: recommendation.isViewed,
        isContacted: recommendation.isContacted,
        viewedAt: recommendation.viewedAt,
        contactedAt: recommendation.contactedAt,
        feedback: recommendation.feedback,
        createdAt: recommendation.createdAt,
        updatedAt: recommendation.updatedAt,
        candidate: recommendation.candidate ? {
          id: recommendation.candidate.id,
          firstName: recommendation.candidate.firstName,
          lastName: recommendation.candidate.lastName,
          email: recommendation.candidate.email,
          avatar: recommendation.candidate.avatar,
          location: recommendation.candidate.location,
          skills: recommendation.candidate.skills,
          experience: recommendation.candidate.experience
        } : null,
        job: recommendation.job ? {
          id: recommendation.job.id,
          title: recommendation.job.title,
          description: recommendation.job.description,
          location: recommendation.job.location,
          salaryMin: recommendation.job.salaryMin,
          salaryMax: recommendation.job.salaryMax,
          company: recommendation.job.company ? {
            id: recommendation.job.company.id,
            name: recommendation.job.company.name,
            logo: recommendation.job.company.logo
          } : null
        } : null
      };
    } catch (error) {
      this.logger.error('Error getting recommendation by ID:', error);
      throw new Error('Failed to get recommendation');
    }
  }

  /**
   * Генерувати нові рекомендації
   */
  async generateRecommendations(data: GenerateRecommendationsData): Promise<any[]> {
    try {
      this.logger.log('Generating new recommendations:', data);

      let recommendations: any[] = [];

      if (data.candidateId && data.jobId) {
        // Генеруємо рекомендацію для конкретного кандидата та вакансії
        recommendations = await this.generateSpecificRecommendation(data.candidateId, data.jobId);
      } else if (data.candidateId) {
        // Генеруємо рекомендації для конкретного кандидата
        recommendations = await this.generateCandidateRecommendations(data.candidateId, data.limit || 10);
      } else if (data.jobId) {
        // Генеруємо рекомендації для конкретної вакансії
        recommendations = await this.generateJobRecommendations(data.jobId, data.limit || 10);
      } else {
        // Генеруємо загальні рекомендації
        recommendations = await this.generateGeneralRecommendations(data.limit || 20);
      }

      // Save recommendations to database
      const savedRecommendations = await this.saveRecommendations(recommendations);

      this.logger.log(`Generated and saved ${savedRecommendations.length} recommendations`);
      return savedRecommendations;
    } catch (error) {
      this.logger.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Масове генерування рекомендацій
   */
  async bulkGenerateRecommendations(data: { type: string; limit?: number }): Promise<any[]> {
    try {
      this.logger.log('Bulk generating recommendations:', data);

      const recommendations = await this.generateGeneralRecommendations(data.limit || 50);
      const savedRecommendations = await this.saveRecommendations(recommendations);

      this.logger.log(`Bulk generated and saved ${savedRecommendations.length} recommendations`);
      return savedRecommendations;
    } catch (error) {
      this.logger.error('Error bulk generating recommendations:', error);
      throw new Error('Failed to bulk generate recommendations');
    }
  }

  /**
   * Оновити статус рекомендації
   */
  async updateRecommendation(id: string, data: UpdateRecommendationData, userId: string): Promise<any> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      const recommendation = await aiRecommendationRepository.findOne({ where: { id } });
      
      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      // Update fields
      if (data.isViewed !== undefined) {
        recommendation.isViewed = data.isViewed;
        if (data.isViewed) {
          recommendation.viewedAt = new Date();
        }
      }

      if (data.isContacted !== undefined) {
        recommendation.isContacted = data.isContacted;
        if (data.isContacted) {
          recommendation.contactedAt = new Date();
        }
      }

      if (data.feedbackRating !== undefined || data.feedbackComment !== undefined) {
        recommendation.feedback = {
          rating: data.feedbackRating || 0,
          comment: data.feedbackComment || '',
          createdAt: new Date()
        };
      }

      recommendation.updatedAt = new Date();

      const updatedRecommendation = await aiRecommendationRepository.save(recommendation);

      return {
        id: updatedRecommendation.id,
        isViewed: updatedRecommendation.isViewed,
        isContacted: updatedRecommendation.isContacted,
        viewedAt: updatedRecommendation.viewedAt,
        contactedAt: updatedRecommendation.contactedAt,
        feedback: updatedRecommendation.feedback,
        updatedAt: updatedRecommendation.updatedAt
      };
    } catch (error) {
      this.logger.error('Error updating recommendation:', error);
      throw new Error('Failed to update recommendation');
    }
  }

  /**
   * Отримати статистику AI Matching
   */
  async getMatchingStats(): Promise<AiMatchingStats> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      
      const [
        totalMatches,
        highQualityMatches,
        averageMatchScore,
        candidatesMatched,
        jobsMatched,
        matchScoreDistribution,
        topSkills,
        topLocations
      ] = await Promise.all([
        aiRecommendationRepository.count({ where: { isActive: true } }),
        aiRecommendationRepository.count({ where: { isActive: true, matchScore: 80 } }),
        aiRecommendationRepository
          .createQueryBuilder('rec')
          .select('AVG(rec.matchScore)', 'avg')
          .where('rec.isActive = :isActive', { isActive: true })
          .getRawOne(),
        aiRecommendationRepository
          .createQueryBuilder('rec')
          .select('COUNT(DISTINCT rec.candidateId)', 'count')
          .where('rec.isActive = :isActive', { isActive: true })
          .getRawOne(),
        aiRecommendationRepository
          .createQueryBuilder('rec')
          .select('COUNT(DISTINCT rec.jobId)', 'count')
          .where('rec.isActive = :isActive', { isActive: true })
          .getRawOne(),
        this.getMatchScoreDistribution(),
        this.getTopSkills(),
        this.getTopLocations()
      ]);

      return {
        totalMatches,
        highQualityMatches,
        averageMatchScore: parseFloat(averageMatchScore?.avg || '0'),
        candidatesMatched: parseInt(candidatesMatched?.count || '0'),
        jobsMatched: parseInt(jobsMatched?.count || '0'),
        lastUpdated: new Date().toISOString(),
        aiAccuracy: 94.5, // This would be calculated based on feedback
        processingTime: 245, // Average processing time
        matchScoreDistribution,
        topSkills,
        topLocations
      };
    } catch (error) {
      this.logger.error('Error getting matching stats:', error);
      throw new Error('Failed to get matching stats');
    }
  }

  /**
   * Очистити старі рекомендації
   */
  async cleanupOldRecommendations(daysOld: number = 30): Promise<number> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await aiRecommendationRepository
        .createQueryBuilder()
        .delete()
        .where('createdAt < :cutoffDate', { cutoffDate })
        .andWhere('isActive = :isActive', { isActive: false })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} old recommendations`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Error cleaning up old recommendations:', error);
      throw new Error('Failed to cleanup old recommendations');
    }
  }

  /**
   * Health check для AI Matching сервісу
   */
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      const count = await aiRecommendationRepository.count();
      
      return {
        status: 'healthy',
        message: `AI Matching service is running. Total recommendations: ${count}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('AI Matching health check failed:', error);
      return {
        status: 'unhealthy',
        message: 'AI Matching service is not responding',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Перевірка здоров'я AI сервісу
   */
  async aiHealthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    try {
      // Перевіряємо, чи доступний OpenAI сервіс
      const isOpenAIAvailable = await openAIService.checkAPIHealth();
      
      if (isOpenAIAvailable) {
      return {
          status: 'healthy',
          message: 'AI service is available and responding',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'degraded',
          message: 'AI service is not responding properly',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      this.logger.error('AI health check failed:', error);
      return {
        status: 'unhealthy',
        message: 'AI service is not available',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Отримати підтримувані мови
   */
  async getSupportedLanguages(): Promise<string[]> {
    return ['en', 'uk', 'ru', 'pl', 'de', 'fr', 'es', 'it', 'pt', 'nl'];
  }

  // Приватні методи для генерації рекомендацій

  private async generateSpecificRecommendation(candidateId: string, jobId: string): Promise<any[]> {
    try {
      const candidate = await this.getUserRepository().findOne({ where: { id: candidateId } });
      const job = await this.getJobRepository().findOne({ 
        where: { id: jobId },
        relations: ['company']
      });

      if (!candidate || !job) {
        throw new Error('Candidate or job not found');
      }

      // Використовуємо OpenAI для аналізу відповідності
      const analysis = await openAIService.calculateAIMatchScore(candidate, job, 'en');
      
      const recommendation = {
        type: RecommendationType.CANDIDATE_TO_JOB,
        candidateId,
        jobId,
        matchScore: analysis.overallScore,
        matchScoreCategory: this.getMatchScoreCategory(analysis.overallScore),
        skillsMatch: {
          matched: [],
          missing: [],
          score: analysis.skillsScore
        },
        experienceMatch: {
          required: job.experienceLevel || 'Not specified',
          candidate: candidate.experience?.toString() || 'Not specified',
          score: analysis.experienceScore
        },
        locationMatch: {
          required: job.location || 'Not specified',
          candidate: candidate.location || 'Not specified',
          score: analysis.locationScore
        },
        salaryMatch: {
          required: { min: job.salaryMin || 0, max: job.salaryMax || 0 },
          candidate: { min: 0, max: 0 },
          score: analysis.salaryScore
        },
        aiReason: analysis.reasoning,
        aiMetadata: {
          model: 'talentflow-matching-v1',
          confidence: analysis.confidence,
          processingTime: 0,
          features: ['skills', 'experience', 'location', 'salary']
        },
        isActive: true,
        isViewed: false,
        isContacted: false
      };

      return [recommendation];
    } catch (error) {
      this.logger.error('Error generating specific recommendation:', error);
      throw error;
    }
  }

  private async generateCandidateRecommendations(candidateId: string, limit: number): Promise<any[]> {
    try {
      const candidate = await this.getUserRepository().findOne({ where: { id: candidateId } });
    if (!candidate) {
      throw new Error('Candidate not found');
    }

      // Знаходимо відповідні вакансії
      const jobs = await this.getJobRepository()
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .where('job.status = :status', { status: JobStatus.ACTIVE })
        .limit(limit * 2) // Беремо більше, щоб відфільтрувати найкращі
        .getMany();

      const recommendations = [];

    for (const job of jobs) {
        try {
          const analysis = await openAIService.calculateAIMatchScore(candidate, job, 'en');
      
          if (analysis.overallScore >= 70) { // Тільки високоякісні рекомендації
            recommendations.push({
              type: RecommendationType.CANDIDATE_TO_JOB,
          candidateId,
          jobId: job.id,
              matchScore: analysis.overallScore,
              matchScoreCategory: this.getMatchScoreCategory(analysis.overallScore),
              skillsMatch: {
                matched: [],
                missing: [],
                score: analysis.skillsScore
              },
              experienceMatch: {
                required: job.experienceLevel || 'Not specified',
                candidate: candidate.experience?.toString() || 'Not specified',
                score: analysis.experienceScore
              },
              locationMatch: {
                required: job.location || 'Not specified',
                candidate: candidate.location || 'Not specified',
                score: analysis.locationScore
              },
              salaryMatch: {
                required: { min: job.salaryMin || 0, max: job.salaryMax || 0 },
                candidate: { min: 0, max: 0 },
                score: analysis.salaryScore
              },
              aiReason: analysis.reasoning,
              aiMetadata: {
                model: 'talentflow-matching-v1',
                confidence: analysis.confidence,
                processingTime: 0,
                features: ['skills', 'experience', 'location', 'salary']
              },
            isActive: true,
            isViewed: false,
              isContacted: false
            });
          }
        } catch (error) {
          this.logger.warn(`Error analyzing match for job ${job.id}:`, error);
        }
      }

      // Сортуємо за matchScore та обмежуємо кількість
      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Error generating candidate recommendations:', error);
      throw error;
    }
  }

  private async generateJobRecommendations(jobId: string, limit: number): Promise<any[]> {
    try {
      const job = await this.getJobRepository().findOne({ 
        where: { id: jobId },
        relations: ['company']
      });
    if (!job) {
      throw new Error('Job not found');
    }

      // Знаходимо відповідних кандидатів
      const candidates = await this.getUserRepository()
        .createQueryBuilder('user')
        .where('user.role = :role', { role: UserRole.CANDIDATE })
        .limit(limit * 2)
        .getMany();

      const recommendations = [];

    for (const candidate of candidates) {
        try {
          const analysis = await openAIService.calculateAIMatchScore(candidate, job, 'en');
      
          if (analysis.overallScore >= 70) {
            recommendations.push({
              type: RecommendationType.JOB_TO_CANDIDATE,
          candidateId: candidate.id,
          jobId,
              matchScore: analysis.overallScore,
              matchScoreCategory: this.getMatchScoreCategory(analysis.overallScore),
              skillsMatch: {
                matched: [],
                missing: [],
                score: analysis.skillsScore
              },
              experienceMatch: {
                required: job.experienceLevel || 'Not specified',
                candidate: candidate.experience?.toString() || 'Not specified',
                score: analysis.experienceScore
              },
              locationMatch: {
                required: job.location || 'Not specified',
                candidate: candidate.location || 'Not specified',
                score: analysis.locationScore
              },
              salaryMatch: {
                required: { min: job.salaryMin || 0, max: job.salaryMax || 0 },
                candidate: { min: 0, max: 0 },
                score: analysis.salaryScore
              },
              aiReason: analysis.reasoning,
              aiMetadata: {
                model: 'talentflow-matching-v1',
                confidence: analysis.confidence,
                processingTime: 0,
                features: ['skills', 'experience', 'location', 'salary']
              },
            isActive: true,
            isViewed: false,
              isContacted: false
            });
          }
        } catch (error) {
          this.logger.warn(`Error analyzing match for candidate ${candidate.id}:`, error);
        }
      }

      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Error generating job recommendations:', error);
      throw error;
    }
  }

  private async generateGeneralRecommendations(limit: number): Promise<any[]> {
    try {
      // Знаходимо активні вакансії та кандидатів
      const [jobs, candidates] = await Promise.all([
        this.getJobRepository()
          .createQueryBuilder('job')
          .leftJoinAndSelect('job.company', 'company')
          .where('job.status = :status', { status: JobStatus.ACTIVE })
          .limit(50)
          .getMany(),
        this.getUserRepository()
          .createQueryBuilder('user')
          .where('user.role = :role', { role: UserRole.CANDIDATE })
          .limit(50)
          .getMany()
      ]);

      const recommendations = [];

      // Генеруємо рекомендації для випадкових пар
      const maxPairs = Math.min(jobs.length, candidates.length, limit);
      
      for (let i = 0; i < maxPairs; i++) {
        const job = jobs[i % jobs.length];
        const candidate = candidates[i % candidates.length];

        try {
          const analysis = await openAIService.calculateAIMatchScore(candidate, job, 'en');
          
          if (analysis.overallScore >= 60) { // Нижчий поріг для загальних рекомендацій
            recommendations.push({
              type: Math.random() > 0.5 ? RecommendationType.CANDIDATE_TO_JOB : RecommendationType.JOB_TO_CANDIDATE,
          candidateId: candidate.id,
          jobId: job.id,
              matchScore: analysis.overallScore,
              matchScoreCategory: this.getMatchScoreCategory(analysis.overallScore),
              skillsMatch: {
                matched: [],
                missing: [],
                score: analysis.skillsScore
              },
              experienceMatch: {
                required: job.experienceLevel || 'Not specified',
                candidate: candidate.experience?.toString() || 'Not specified',
                score: analysis.experienceScore
              },
              locationMatch: {
                required: job.location || 'Not specified',
                candidate: candidate.location || 'Not specified',
                score: analysis.locationScore
              },
              salaryMatch: {
                required: { min: job.salaryMin || 0, max: job.salaryMax || 0 },
                candidate: { min: 0, max: 0 },
                score: analysis.salaryScore
              },
              aiReason: analysis.reasoning,
              aiMetadata: {
                model: 'talentflow-matching-v1',
                confidence: analysis.confidence,
                processingTime: 0,
                features: ['skills', 'experience', 'location', 'salary']
              },
              isActive: true,
              isViewed: false,
              isContacted: false
            });
          }
        } catch (error) {
          this.logger.warn(`Error analyzing match for pair ${i}:`, error);
        }
      }

      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Error generating general recommendations:', error);
      throw error;
    }
  }

  private async saveRecommendations(recommendations: any[]): Promise<any[]> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      
      // Перевіряємо на дублікати
      const existingRecommendations = await aiRecommendationRepository
        .createQueryBuilder('rec')
        .where('rec.candidateId IN (:...candidateIds)', { 
          candidateIds: recommendations.map(r => r.candidateId) 
        })
        .andWhere('rec.jobId IN (:...jobIds)', { 
          jobIds: recommendations.map(r => r.jobId) 
        })
        .getMany();

      const existingPairs = new Set(
        existingRecommendations.map(rec => `${rec.candidateId}-${rec.jobId}`)
      );

      const newRecommendations = recommendations.filter(rec => 
        !existingPairs.has(`${rec.candidateId}-${rec.jobId}`)
      );

      if (newRecommendations.length === 0) {
        this.logger.log('No new recommendations to save (all duplicates)');
        return [];
      }

      const savedRecommendations = await aiRecommendationRepository.save(newRecommendations);
      this.logger.log(`Saved ${savedRecommendations.length} new recommendations`);
      
      return savedRecommendations;
    } catch (error) {
      this.logger.error('Error saving recommendations:', error);
      throw error;
    }
  }

  private getMatchScoreCategory(score: number): MatchScore {
    if (score >= 90) return MatchScore.EXCELLENT;
    if (score >= 80) return MatchScore.GOOD;
    if (score >= 70) return MatchScore.AVERAGE;
    return MatchScore.POOR;
  }

  private async getMatchScoreDistribution(): Promise<any[]> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      
      const distribution = await aiRecommendationRepository
        .createQueryBuilder('rec')
        .select('rec.matchScoreCategory', 'category')
        .addSelect('COUNT(*)', 'count')
        .where('rec.isActive = :isActive', { isActive: true })
        .groupBy('rec.matchScoreCategory')
        .getRawMany();

      return distribution.map(item => ({
        category: item.category,
        count: parseInt(item.count)
      }));
    } catch (error) {
      this.logger.error('Error getting match score distribution:', error);
      return [];
    }
  }

  private async getTopSkills(): Promise<any[]> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      
      const skills = await aiRecommendationRepository
        .createQueryBuilder('rec')
        .select('jsonb_array_elements_text(rec.skillsMatch)', 'skill')
        .addSelect('COUNT(*)', 'count')
        .where('rec.isActive = :isActive', { isActive: true })
        .andWhere('rec.skillsMatch IS NOT NULL')
        .groupBy('skill')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      return skills.map(item => ({
        skill: item.skill,
        count: parseInt(item.count)
      }));
    } catch (error) {
      this.logger.error('Error getting top skills:', error);
      return [];
    }
  }

  private async getTopLocations(): Promise<any[]> {
    try {
      const aiRecommendationRepository = this.getAiRecommendationRepository();
      
      const locations = await aiRecommendationRepository
        .createQueryBuilder('rec')
        .leftJoin('rec.candidate', 'candidate')
        .leftJoin('rec.job', 'job')
        .select('COALESCE(candidate.location, job.location)', 'location')
        .addSelect('COUNT(*)', 'count')
        .where('rec.isActive = :isActive', { isActive: true })
        .andWhere('(candidate.location IS NOT NULL OR job.location IS NOT NULL)')
        .groupBy('COALESCE(candidate.location, job.location)')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      return locations.map(item => ({
        location: item.location,
        count: parseInt(item.count)
      }));
      } catch (error) {
      this.logger.error('Error getting top locations:', error);
      return [];
    }
  }
}

export const aiMatchingService = new AiMatchingService();
export default aiMatchingService;