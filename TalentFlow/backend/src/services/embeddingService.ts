import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  usage?: {
    promptTokens: number;
    totalTokens: number;
  };
}

export class EmbeddingService {
  private openai: OpenAI;
  private gemini: GoogleGenerativeAI;
  private preferredProvider: 'openai' | 'gemini' = 'gemini'; // Gemini дешевший

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Генерує embedding для тексту
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      if (this.preferredProvider === 'gemini' && process.env.GEMINI_API_KEY) {
        return await this.generateGeminiEmbedding(text);
      } else {
        return await this.generateOpenAIEmbedding(text);
      }
    } catch (error) {
      console.error('Embedding generation failed:', error);
      
      // Fallback до іншого провайдера
      if (this.preferredProvider === 'gemini') {
        return await this.generateOpenAIEmbedding(text);
      } else {
        return await this.generateGeminiEmbedding(text);
      }
    }
  }

  /**
   * Генерує embeddings для масиву текстів (batch processing)
   */
  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];
    
    // Обробляємо по 10 текстів одночасно для економії API викликів
    const batchSize = 10;
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map(text => this.generateEmbedding(text));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Невелика затримка між батчами
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Batch embedding failed for batch ${i / batchSize}:`, error);
        // Продовжуємо з наступним батчем
      }
    }
    
    return results;
  }

  /**
   * Створює текст для embedding з даних вакансії
   */
  createJobEmbeddingText(job: any): string {
    const parts = [
      job.title || '',
      job.description || '',
      job.requirements || '',
      job.benefits || '',
      job.location || '',
      job.industry || '',
      job.skills?.join(' ') || '',
      job.tags?.join(' ') || '',
      job.experienceLevel || '',
      job.type || ''
    ].filter(Boolean);

    return parts.join(' ').substring(0, 8000); // Обмежуємо довжину
  }

  /**
   * Створює текст для embedding з даних кандидата
   */
  createCandidateEmbeddingText(candidate: any): string {
    const parts = [
      candidate.title || '',
      candidate.summary || '',
      candidate.bio || '',
      candidate.skills?.join(' ') || '',
      candidate.location || '',
      candidate.workExperience?.join(' ') || '',
      candidate.education?.join(' ') || '',
      candidate.certifications?.join(' ') || '',
      candidate.languages?.join(' ') || '',
      candidate.achievements?.join(' ') || '',
      candidate.yearsOfExperience?.toString() || ''
    ].filter(Boolean);

    return parts.join(' ').substring(0, 8000); // Обмежуємо довжину
  }

  /**
   * OpenAI embeddings (text-embedding-3-small - найдешевший)
   */
  private async generateOpenAIEmbedding(text: string): Promise<EmbeddingResult> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small', // $0.02 per 1M tokens
      input: text,
    });

    return {
      embedding: response.data[0].embedding,
      model: 'text-embedding-3-small',
      usage: {
        promptTokens: response.usage.prompt_tokens,
        totalTokens: response.usage.total_tokens
      }
    };
  }

  /**
   * Gemini embeddings (безкоштовний тир)
   */
  private async generateGeminiEmbedding(text: string): Promise<EmbeddingResult> {
    const model = this.gemini.getGenerativeModel({ model: 'embedding-001' });
    
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    return {
      embedding,
      model: 'embedding-001',
      usage: {
        promptTokens: Math.ceil(text.length / 4), // Приблизна оцінка
        totalTokens: Math.ceil(text.length / 4)
      }
    };
  }

  /**
   * Розраховує косинусну схожість між двома векторами
   */
  calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Знаходить найближчі вектори до цільового
   */
  findNearestVectors(
    targetVector: number[], 
    candidateVectors: { id: string; vector: number[] }[], 
    topK: number = 20
  ): { id: string; similarity: number }[] {
    const similarities = candidateVectors.map(candidate => ({
      id: candidate.id,
      similarity: this.calculateCosineSimilarity(targetVector, candidate.vector)
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}
