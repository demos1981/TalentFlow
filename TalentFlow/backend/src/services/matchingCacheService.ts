import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { OptimizedMatchResult } from './optimizedAiMatchingService';

export interface CachedMatchResult {
  id: string;
  jobId: string;
  candidateId: string;
  vectorSimilarity: number;
  aiScore: number;
  overallScore: number;
  reasoning: string;
  confidence: number;
  createdAt: Date;
  expiresAt: Date;
}

export class MatchingCacheService {
  private cacheRepository: Repository<any>; // Будемо використовувати Redis або створимо таблицю

  constructor() {
    // Поки що використовуємо in-memory кеш, потім можна замінити на Redis
    this.cacheRepository = null as any;
  }

  private memoryCache = new Map<string, CachedMatchResult>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 години

  /**
   * Генерує ключ кешу для пари job-candidate
   */
  private generateCacheKey(jobId: string, candidateId: string): string {
    return `match:${jobId}:${candidateId}`;
  }

  /**
   * Генерує ключ кешу для списку матчів вакансії
   */
  private generateJobMatchesCacheKey(jobId: string, options: any): string {
    const optionsHash = this.hashOptions(options);
    return `job_matches:${jobId}:${optionsHash}`;
  }

  /**
   * Хешує опції для унікального ключа кешу
   */
  private hashOptions(options: any): string {
    const sortedOptions = Object.keys(options)
      .sort()
      .reduce((result, key) => {
        result[key] = options[key];
        return result;
      }, {} as any);
    
    return Buffer.from(JSON.stringify(sortedOptions)).toString('base64').substring(0, 16);
  }

  /**
   * Зберігає результат матчингу в кеш
   */
  async cacheMatchResult(matchResult: OptimizedMatchResult): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(matchResult.jobId, matchResult.candidateId);
      const cachedResult: CachedMatchResult = {
        id: cacheKey,
        jobId: matchResult.jobId,
        candidateId: matchResult.candidateId,
        vectorSimilarity: matchResult.vectorSimilarity,
        aiScore: matchResult.aiScore,
        overallScore: matchResult.overallScore,
        reasoning: matchResult.reasoning,
        confidence: matchResult.confidence,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_TTL)
      };

      this.memoryCache.set(cacheKey, cachedResult);
      
      console.log(`Cached match result for ${matchResult.jobId} -> ${matchResult.candidateId}`);
    } catch (error) {
      console.error('Error caching match result:', error);
    }
  }

  /**
   * Отримує результат матчингу з кешу
   */
  async getCachedMatchResult(jobId: string, candidateId: string): Promise<OptimizedMatchResult | null> {
    try {
      const cacheKey = this.generateCacheKey(jobId, candidateId);
      const cachedResult = this.memoryCache.get(cacheKey);

      if (!cachedResult) {
        return null;
      }

      // Перевіряємо чи не закінчився термін дії
      if (cachedResult.expiresAt < new Date()) {
        this.memoryCache.delete(cacheKey);
        return null;
      }

      return {
        candidateId: cachedResult.candidateId,
        jobId: cachedResult.jobId,
        vectorSimilarity: cachedResult.vectorSimilarity,
        aiScore: cachedResult.aiScore,
        overallScore: cachedResult.overallScore,
        reasoning: cachedResult.reasoning,
        confidence: cachedResult.confidence,
        processingTime: 0
      };
    } catch (error) {
      console.error('Error getting cached match result:', error);
      return null;
    }
  }

  /**
   * Зберігає список матчів для вакансії
   */
  async cacheJobMatches(jobId: string, matches: OptimizedMatchResult[], options: any): Promise<void> {
    try {
      const cacheKey = this.generateJobMatchesCacheKey(jobId, options);
      
      // Зберігаємо тільки ID матчів для економії пам'яті
      const matchIds = matches.map(match => ({
        candidateId: match.candidateId,
        overallScore: match.overallScore,
        vectorSimilarity: match.vectorSimilarity,
        aiScore: match.aiScore
      }));

      const cachedData: any = {
        jobId,
        matches: matchIds,
        total: matches.length,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_TTL)
      };

      this.memoryCache.set(cacheKey, cachedData);
      
      console.log(`Cached ${matches.length} matches for job ${jobId}`);
    } catch (error) {
      console.error('Error caching job matches:', error);
    }
  }

  /**
   * Отримує список матчів для вакансії з кешу
   */
  async getCachedJobMatches(jobId: string, options: any): Promise<OptimizedMatchResult[] | null> {
    try {
      const cacheKey = this.generateJobMatchesCacheKey(jobId, options);
      const cachedData = this.memoryCache.get(cacheKey);

      if (!cachedData) {
        return null;
      }

      // Перевіряємо чи не закінчився термін дії
      if (cachedData.expiresAt < new Date()) {
        this.memoryCache.delete(cacheKey);
        return null;
      }

      // Відновлюємо повні результати матчингу
      const fullMatches: OptimizedMatchResult[] = [];
      
      for (const matchId of (cachedData as any).matches) {
        const fullMatch = await this.getCachedMatchResult(jobId, matchId.candidateId);
        if (fullMatch) {
          fullMatches.push(fullMatch);
        }
      }

      return fullMatches.length > 0 ? fullMatches : null;
    } catch (error) {
      console.error('Error getting cached job matches:', error);
      return null;
    }
  }

  /**
   * Очищає застарілі записи кешу
   */
  async cleanupExpiredCache(): Promise<void> {
    try {
      const now = new Date();
      let cleanedCount = 0;

      for (const [key, value] of this.memoryCache.entries()) {
        if (value.expiresAt < now) {
          this.memoryCache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} expired cache entries`);
      }
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
    }
  }

  /**
   * Отримує статистику кешу
   */
  getCacheStats(): {
    totalEntries: number;
    expiredEntries: number;
    memoryUsage: string;
  } {
    const now = new Date();
    let expiredCount = 0;

    for (const value of this.memoryCache.values()) {
      if (value.expiresAt < now) {
        expiredCount++;
      }
    }

    // Приблизна оцінка використання пам'яті
    const memoryUsage = `${Math.round(this.memoryCache.size * 0.5)} KB`;

    return {
      totalEntries: this.memoryCache.size,
      expiredEntries: expiredCount,
      memoryUsage
    };
  }

  /**
   * Очищає весь кеш
   */
  async clearCache(): Promise<void> {
    try {
      this.memoryCache.clear();
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Інвалідує кеш для конкретної вакансії
   */
  async invalidateJobCache(jobId: string): Promise<void> {
    try {
      let invalidatedCount = 0;

      for (const [key, value] of this.memoryCache.entries()) {
        if (key.includes(`:${jobId}:`) || key.includes(`job_matches:${jobId}:`)) {
          this.memoryCache.delete(key);
          invalidatedCount++;
        }
      }

      console.log(`Invalidated ${invalidatedCount} cache entries for job ${jobId}`);
    } catch (error) {
      console.error('Error invalidating job cache:', error);
    }
  }

  /**
   * Інвалідує кеш для конкретного кандидата
   */
  async invalidateCandidateCache(candidateId: string): Promise<void> {
    try {
      let invalidatedCount = 0;

      for (const [key, value] of this.memoryCache.entries()) {
        if (key.includes(`:${candidateId}`)) {
          this.memoryCache.delete(key);
          invalidatedCount++;
        }
      }

      console.log(`Invalidated ${invalidatedCount} cache entries for candidate ${candidateId}`);
    } catch (error) {
      console.error('Error invalidating candidate cache:', error);
    }
  }
}
