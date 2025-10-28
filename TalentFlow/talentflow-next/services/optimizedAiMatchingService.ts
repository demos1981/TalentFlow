import api, { jobsApi } from './api';

export interface OptimizedMatchResult {
  candidateId: string;
  jobId: string;
  vectorSimilarity: number;
  aiScore: number;
  overallScore: number;
  reasoning: string;
  confidence: number;
  processingTime: number;
  // Додаткова інформація про кандидата
  candidateName?: string;
  candidateTitle?: string;
  candidateExperience?: number;
  candidateField?: string;
  avatar?: string;
}

export interface BatchMatchResult {
  results: OptimizedMatchResult[];
  totalProcessed: number;
  totalTime: number;
  averageTime: number;
  costEstimate: number;
}

export interface JobWithBestCandidate {
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  jobLocation: string;
  jobSalary?: string;
  jobSkills: string[];
  bestCandidate?: {
    candidateId: string;
    candidateName: string;
    candidateTitle: string;
    candidateLocation: string;
    candidateSkills: string[];
    candidateExperience?: number;
    candidateField?: string;
    overallScore: number;
    aiScore: number;
    vectorSimilarity: number;
    reasoning: string;
    avatar?: string;
  };
  isSearching?: boolean;
  searchError?: string;
}

export interface OptimizedMatchingStats {
  totalJobs: number;
  jobsWithEmbeddings: number;
  totalCandidates: number;
  candidatesWithEmbeddings: number;
  averageVectorSimilarity: number;
  averageAiScore: number;
  cacheStats?: {
    totalEntries: number;
    expiredEntries: number;
    memoryUsage: string;
  };
}

export interface EmbeddingGenerationResult {
  success: boolean;
  message: string;
  processedCount?: number;
  totalCount?: number;
}

class OptimizedAiMatchingService {

  /**
   * Знайти найкращих кандидатів для вакансії
   */
  async findBestMatchesForJob(
    jobId: string, 
    options: {
      vectorTopK?: number;
      aiTopK?: number;
      minVectorSimilarity?: number;
      minAiScore?: number;
      language?: string;
    } = {}
  ): Promise<OptimizedMatchResult[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.vectorTopK) queryParams.append('vectorTopK', options.vectorTopK.toString());
      if (options.aiTopK) queryParams.append('aiTopK', options.aiTopK.toString());
      if (options.minVectorSimilarity) queryParams.append('minVectorSimilarity', options.minVectorSimilarity.toString());
      if (options.minAiScore) queryParams.append('minAiScore', options.minAiScore.toString());
      if (options.language) queryParams.append('language', options.language);
      
      const url = `/optimized-ai-matching/jobs/${jobId}/matches?${queryParams.toString()}`;
      const response = await api.get(url);
      return response.data.data.matches || [];
    } catch (error) {
      console.error('Error finding best matches for job:', error);
      throw error;
    }
  }

  /**
   * Batch матчинг для множинних вакансій
   */
  async batchMatchJobs(
    jobIds: string[],
    options: {
      vectorTopK?: number;
      aiTopK?: number;
      minVectorSimilarity?: number;
      minAiScore?: number;
      language?: string;
      maxConcurrent?: number;
    } = {}
  ): Promise<BatchMatchResult> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.vectorTopK) queryParams.append('vectorTopK', options.vectorTopK.toString());
      if (options.aiTopK) queryParams.append('aiTopK', options.aiTopK.toString());
      if (options.minVectorSimilarity) queryParams.append('minVectorSimilarity', options.minVectorSimilarity.toString());
      if (options.minAiScore) queryParams.append('minAiScore', options.minAiScore.toString());
      if (options.language) queryParams.append('language', options.language);
      if (options.maxConcurrent) queryParams.append('maxConcurrent', options.maxConcurrent.toString());
      
      const url = `/optimized-ai-matching/batch-match?${queryParams.toString()}`;
      const response = await api.post(url, { jobIds });
      return response.data.data;
    } catch (error) {
      console.error('Error in batch matching jobs:', error);
      throw error;
    }
  }

  /**
   * Отримати список активних вакансій БЕЗ автоматичного пошуку кандидатів
   */
  async getJobsWithoutCandidates(
    companyId?: string
  ): Promise<JobWithBestCandidate[]> {
    try {
      console.log('🔍 Fetching user jobs with params:', {
        page: 1,
        limit: 50,
        status: 'active'
      });

      // Спочатку отримуємо список активних вакансій користувача
      const jobsResponse = await jobsApi.getMyCreatedJobs({
        page: 1,
        limit: 50,
        status: 'active' // Тільки активні вакансії
      });

      console.log('📊 Jobs response structure:', {
        status: jobsResponse.status,
        dataKeys: Object.keys(jobsResponse.data),
        dataStructure: jobsResponse.data
      });

      const jobs = jobsResponse.data.data?.jobs || jobsResponse.data.data || [];
      console.log(`📋 Found ${jobs.length} jobs for user`);
      
      // Якщо немає вакансій, повертаємо порожній масив
      if (!jobs || jobs.length === 0) {
        console.log('📭 No jobs found for user');
        return [];
      }
      
      // Просто повертаємо вакансії БЕЗ пошуку кандидатів
      const jobsWithoutCandidates: JobWithBestCandidate[] = jobs.map((job: any) => ({
        jobId: job.id,
        jobTitle: job.title,
        jobDescription: job.description,
        jobLocation: job.location,
        jobSalary: job.salaryMin && job.salaryMax 
          ? `${job.salaryMin}-${job.salaryMax} ${job.currency || 'USD'}`
          : undefined,
        jobSkills: job.skills || [],
        // bestCandidate буде undefined - пошук запуститься тільки при натисканні кнопки
        bestCandidate: undefined
      }));

      return jobsWithoutCandidates;
    } catch (error: any) {
      console.error('❌ Error getting jobs without candidates:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params
      });
      throw error;
    }
  }

  /**
   * Пошук кандидатів для конкретної вакансії
   */
  async searchCandidatesForJob(
    jobId: string,
    options: {
      vectorTopK?: number;
      aiTopK?: number;
      minVectorSimilarity?: number;
      minAiScore?: number;
      language?: string;
    } = {}
  ): Promise<OptimizedMatchResult[]> {
    try {
      return await this.findBestMatchesForJob(jobId, options);
    } catch (error) {
      console.error('Error searching candidates for job:', error);
      throw error;
    }
  }

  /**
   * Генерувати embeddings для вакансій
   */
  async generateJobEmbeddings(batchSize: number = 10): Promise<EmbeddingGenerationResult> {
    try {
      const response = await api.post(`/optimized-ai-matching/embeddings/jobs/generate?batchSize=${batchSize}`);
      return {
        success: true,
        message: response.data.message || 'Job embeddings generation started'
      };
    } catch (error: any) {
      console.error('Error generating job embeddings:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate job embeddings'
      };
    }
  }

  /**
   * Генерувати embeddings для кандидатів
   */
  async generateCandidateEmbeddings(batchSize: number = 10): Promise<EmbeddingGenerationResult> {
    try {
      const response = await api.post(`/optimized-ai-matching/embeddings/candidates/generate?batchSize=${batchSize}`);
      return {
        success: true,
        message: response.data.message || 'Candidate embeddings generation started'
      };
    } catch (error: any) {
      console.error('Error generating candidate embeddings:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate candidate embeddings'
      };
    }
  }

  /**
   * Оновити embedding для вакансії
   */
  async updateJobEmbedding(jobId: string): Promise<EmbeddingGenerationResult> {
    try {
      const response = await api.put(`/optimized-ai-matching/embeddings/jobs/${jobId}`);
      return {
        success: true,
        message: response.data.message || 'Job embedding updated'
      };
    } catch (error: any) {
      console.error('Error updating job embedding:', error);
      return {
        success: false,
        message: error.message || 'Failed to update job embedding'
      };
    }
  }

  /**
   * Оновити embedding для кандидата
   */
  async updateCandidateEmbedding(candidateId: string): Promise<EmbeddingGenerationResult> {
    try {
      const response = await api.put(`/optimized-ai-matching/embeddings/candidates/${candidateId}`);
      return {
        success: true,
        message: response.data.message || 'Candidate embedding updated'
      };
    } catch (error: any) {
      console.error('Error updating candidate embedding:', error);
      return {
        success: false,
        message: error.message || 'Failed to update candidate embedding'
      };
    }
  }

  /**
   * Отримати статистику матчингу
   */
  async getMatchingStats(): Promise<OptimizedMatchingStats> {
    try {
      const response = await api.get('/optimized-ai-matching/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error getting matching stats:', error);
      throw error;
    }
  }

  /**
   * Векторний пошук вакансій для кандидата
   */
  async findSimilarJobs(
    candidateId: string,
    options: {
      minSimilarity?: number;
      limit?: number;
      includeInactive?: boolean;
    } = {}
  ): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.minSimilarity) queryParams.append('minSimilarity', options.minSimilarity.toString());
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.includeInactive) queryParams.append('includeInactive', options.includeInactive.toString());
      
      const url = `/optimized-ai-matching/candidates/${candidateId}/similar-jobs?${queryParams.toString()}`;
      const response = await api.get(url);
      return response.data.data.jobs || [];
    } catch (error) {
      console.error('Error finding similar jobs:', error);
      throw error;
    }
  }

  /**
   * Векторний пошук кандидатів для вакансії
   */
  async findSimilarCandidates(
    jobId: string,
    options: {
      minSimilarity?: number;
      limit?: number;
      includeInactive?: boolean;
    } = {}
  ): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.minSimilarity) queryParams.append('minSimilarity', options.minSimilarity.toString());
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.includeInactive) queryParams.append('includeInactive', options.includeInactive.toString());
      
      const url = `/optimized-ai-matching/jobs/${jobId}/similar-candidates?${queryParams.toString()}`;
      const response = await api.get(url);
      return response.data.data.candidates || [];
    } catch (error) {
      console.error('Error finding similar candidates:', error);
      throw error;
    }
  }

  /**
   * Тестувати embedding для тексту
   */
  async testEmbedding(text: string): Promise<any> {
    try {
      const response = await api.post('/optimized-ai-matching/test-embedding', { text });
      return response.data.data;
    } catch (error) {
      console.error('Error testing embedding:', error);
      throw error;
    }
  }
}

export const optimizedAiMatchingService = new OptimizedAiMatchingService();
export default optimizedAiMatchingService;
