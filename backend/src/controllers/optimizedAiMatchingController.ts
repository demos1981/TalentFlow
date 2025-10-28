import { Request, Response } from 'express';
import { OptimizedAiMatchingService } from '../services/optimizedAiMatchingService';
import { VectorSearchService } from '../services/vectorSearchService';
import { EmbeddingService } from '../services/embeddingService';

export class OptimizedAiMatchingController {
  private optimizedMatchingService: OptimizedAiMatchingService;
  private vectorSearchService: VectorSearchService;
  private embeddingService: EmbeddingService;

  constructor() {
    try {
      this.optimizedMatchingService = new OptimizedAiMatchingService();
      this.vectorSearchService = new VectorSearchService();
      this.embeddingService = new EmbeddingService();
      console.log('✅ OptimizedAiMatchingController initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing OptimizedAiMatchingController:', error);
      throw error;
    }
  }

  /**
   * Знаходить найкращих кандидатів для вакансії (оптимізований матчинг)
   */
  findBestMatchesForJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const {
        vectorTopK = 50,
        aiTopK = 20,
        minVectorSimilarity = 0.3,
        minAiScore = 70,
        language = 'en'
      } = req.query;

      if (!jobId) {
        res.status(400).json({
          success: false,
          message: 'Job ID is required'
        });
        return;
      }

      const results = await this.optimizedMatchingService.findBestMatchesForJob(jobId, {
        vectorTopK: Number(vectorTopK),
        aiTopK: Number(aiTopK),
        minVectorSimilarity: Number(minVectorSimilarity),
        minAiScore: Number(minAiScore),
        language: language as string
      });

      res.json({
        success: true,
        data: {
          jobId,
          matches: results,
          total: results.length,
          processingTime: results[0]?.processingTime || 0
        }
      });
    } catch (error) {
      console.error('Error in findBestMatchesForJob:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Batch матчинг для множинних вакансій
   */
  batchMatchJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobIds } = req.body;
      const {
        vectorTopK = 50,
        aiTopK = 20,
        minVectorSimilarity = 0.3,
        minAiScore = 70,
        language = 'en',
        maxConcurrent = 3
      } = req.query;

      if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'jobIds array is required'
        });
        return;
      }

      const results = await this.optimizedMatchingService.batchMatchJobs(jobIds, {
        vectorTopK: Number(vectorTopK),
        aiTopK: Number(aiTopK),
        minVectorSimilarity: Number(minVectorSimilarity),
        minAiScore: Number(minAiScore),
        language: language as string,
        maxConcurrent: Number(maxConcurrent)
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in batchMatchJobs:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Генерує embeddings для вакансій
   */
  generateJobEmbeddings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { batchSize = 10 } = req.query;

      await this.vectorSearchService.generateJobEmbeddings(Number(batchSize));

      res.json({
        success: true,
        message: `Job embeddings generation started with batch size ${batchSize}`
      });
    } catch (error) {
      console.error('Error in generateJobEmbeddings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Генерує embeddings для кандидатів
   */
  generateCandidateEmbeddings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { batchSize = 10 } = req.query;

      await this.vectorSearchService.generateCandidateEmbeddings(Number(batchSize));

      res.json({
        success: true,
        message: `Candidate embeddings generation started with batch size ${batchSize}`
      });
    } catch (error) {
      console.error('Error in generateCandidateEmbeddings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Оновлює embedding для конкретної вакансії
   */
  updateJobEmbedding = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        res.status(400).json({
          success: false,
          message: 'Job ID is required'
        });
        return;
      }

      await this.vectorSearchService.updateJobEmbedding(jobId);

      res.json({
        success: true,
        message: `Embedding updated for job ${jobId}`
      });
    } catch (error) {
      console.error('Error in updateJobEmbedding:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Оновлює embedding для конкретного кандидата
   */
  updateCandidateEmbedding = async (req: Request, res: Response): Promise<void> => {
    try {
      const { candidateId } = req.params;

      if (!candidateId) {
        res.status(400).json({
          success: false,
          message: 'Candidate ID is required'
        });
        return;
      }

      await this.vectorSearchService.updateCandidateEmbedding(candidateId);

      res.json({
        success: true,
        message: `Embedding updated for candidate ${candidateId}`
      });
    } catch (error) {
      console.error('Error in updateCandidateEmbedding:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Отримує статистику embeddings та матчингу
   */
  getMatchingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('📊 Getting matching stats...');
      
      if (!this.optimizedMatchingService) {
        throw new Error('OptimizedMatchingService not initialized');
      }

      const stats = await this.optimizedMatchingService.getMatchingStats();
      console.log('📈 Stats retrieved:', stats);

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('❌ Error in getMatchingStats:', {
        message: error.message,
        stack: error.stack,
        serviceExists: !!this.optimizedMatchingService
      });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Векторний пошук вакансій для кандидата
   */
  findSimilarJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { candidateId } = req.params;
      const {
        minSimilarity = 0.3,
        limit = 20,
        includeInactive = false
      } = req.query;

      if (!candidateId) {
        res.status(400).json({
          success: false,
          message: 'Candidate ID is required'
        });
        return;
      }

      const results = await this.vectorSearchService.findSimilarJobs(candidateId, {
        minSimilarity: Number(minSimilarity),
        limit: Number(limit),
        includeInactive: includeInactive === 'true'
      });

      res.json({
        success: true,
        data: {
          candidateId,
          jobs: results,
          total: results.length
        }
      });
    } catch (error) {
      console.error('Error in findSimilarJobs:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Векторний пошук кандидатів для вакансії
   */
  findSimilarCandidates = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const {
        minSimilarity = 0.3,
        limit = 20,
        includeInactive = false
      } = req.query;

      if (!jobId) {
        res.status(400).json({
          success: false,
          message: 'Job ID is required'
        });
        return;
      }

      const results = await this.vectorSearchService.findSimilarCandidates(jobId, {
        minSimilarity: Number(minSimilarity),
        limit: Number(limit),
        includeInactive: includeInactive === 'true'
      });

      res.json({
        success: true,
        data: {
          jobId,
          candidates: results,
          total: results.length
        }
      });
    } catch (error) {
      console.error('Error in findSimilarCandidates:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Тестує embedding для тексту
   */
  testEmbedding = async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;

      if (!text) {
        res.status(400).json({
          success: false,
          message: 'Text is required'
        });
        return;
      }

      const result = await this.embeddingService.generateEmbedding(text);

      res.json({
        success: true,
        data: {
          text,
          embeddingLength: result.embedding.length,
          model: result.model,
          usage: result.usage
        }
      });
    } catch (error) {
      console.error('Error in testEmbedding:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}
