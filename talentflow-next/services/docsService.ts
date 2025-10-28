import api from './api';

export interface ApiInfo {
  name: string;
  version: string;
  description: string;
  baseUrl: string;
  documentation: {
    swagger: string;
    health: string;
    github: string;
  };
  features: string[];
  rateLimits: {
    requests: string;
    burst: string;
  };
}

export interface ApiStats {
  totalRequests: number;
  activeUsers: number;
  uptime: number;
  endpoints: {
    total: number;
    active: number;
    deprecated: number;
  };
  performance: {
    averageResponseTime: string;
    errorRate: string;
    successRate: string;
  };
  usage: {
    mostUsed: string;
    leastUsed: string;
    topEndpoints: Array<{
      path: string;
      requests: number;
    }>;
  };
}

export interface Endpoint {
  method: string;
  path: string;
  description: string;
}

export interface EndpointCategory {
  category: string;
  endpoints: Endpoint[];
}

export interface CodeExample {
  name: string;
  language: string;
  code: string;
}

export interface CodeExampleCategory {
  title: string;
  description: string;
  examples: CodeExample[];
}

export interface ErrorCode {
  code: number;
  name: string;
  description: string;
  examples: string[];
}

export class DocsService {
  // Отримання загальної інформації про API
  static async getApiInfo(): Promise<ApiInfo> {
    const response = await api.get('/docs/info');
    return response.data.data;
  }

  // Отримання статистики API
  static async getApiStats(): Promise<ApiStats> {
    const response = await api.get('/docs/stats');
    return response.data.data;
  }

  // Отримання списку всіх ендпоінтів
  static async getAllEndpoints(): Promise<EndpointCategory[]> {
    const response = await api.get('/docs/endpoints');
    return response.data.data;
  }

  // Отримання прикладів використання
  static async getCodeExamples(): Promise<Record<string, CodeExampleCategory>> {
    const response = await api.get('/docs/examples');
    return response.data.data;
  }

  // Отримання інформації про помилки
  static async getErrorCodes(): Promise<ErrorCode[]> {
    const response = await api.get('/docs/errors');
    return response.data.data;
  }
}

export default DocsService;




