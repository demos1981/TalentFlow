import { apiClient } from '../utils/apiClient';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync?: string;
  syncFrequency: string;
  apiKey?: string;
  webhookUrl?: string;
  features: string[];
  setupSteps: string[];
  documentation: string;
  pricing: 'free' | 'paid' | 'enterprise';
  rating: number;
  users: number;
  isConfigured: boolean;
}

export interface IntegrationStats {
  total: number;
  active: number;
  inactive: number;
  error: number;
  pending: number;
  categories: Record<string, number>;
  lastSync: {
    successful: number;
    failed: number;
    pending: number;
  };
}

export interface IntegrationDetails {
  id: string;
  name: string;
  description: string;
  status: string;
  lastSync: string;
  syncFrequency: string;
  apiKey: string;
  webhookUrl: string;
  config: {
    apiKey: string;
    apiSecret: string;
    webhookUrl: string;
    syncInterval: number;
    enabled: boolean;
  };
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
    details: string;
  }>;
}

export interface IntegrationLog {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  details: string;
  integrationId: string;
}

export interface LogsResponse {
  logs: IntegrationLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface SyncResponse {
  id: string;
  lastSync: string;
  syncedItems: number;
}

export class IntegrationsService {
  // Отримання списку всіх інтеграцій
  static async getAllIntegrations(): Promise<Integration[]> {
    const response = await apiClient.get('/integrations');
    return response.data.data;
  }

  // Отримання статистики інтеграцій
  static async getIntegrationsStats(): Promise<IntegrationStats> {
    const response = await apiClient.get('/integrations/stats');
    return response.data.data;
  }

  // Отримання деталей інтеграції
  static async getIntegrationDetails(integrationId: string): Promise<IntegrationDetails> {
    const response = await apiClient.get(`/integrations/${integrationId}`);
    return response.data.data;
  }

  // Активування інтеграції
  static async activateIntegration(integrationId: string, config: any): Promise<{ id: string; status: string; lastSync: string }> {
    const response = await apiClient.post(`/integrations/${integrationId}/activate`, { config });
    return response.data.data;
  }

  // Деактивування інтеграції
  static async deactivateIntegration(integrationId: string): Promise<{ id: string; status: string }> {
    const response = await apiClient.post(`/integrations/${integrationId}/deactivate`);
    return response.data.data;
  }

  // Синхронізація інтеграції
  static async syncIntegration(integrationId: string): Promise<SyncResponse> {
    const response = await apiClient.post(`/integrations/${integrationId}/sync`);
    return response.data.data;
  }

  // Оновлення конфігурації інтеграції
  static async updateIntegrationConfig(integrationId: string, config: any): Promise<{ id: string; config: any }> {
    const response = await apiClient.put(`/integrations/${integrationId}/config`, { config });
    return response.data.data;
  }

  // Видалення інтеграції
  static async deleteIntegration(integrationId: string): Promise<{ id: string }> {
    const response = await apiClient.delete(`/integrations/${integrationId}`);
    return response.data.data;
  }

  // Отримання логів інтеграції
  static async getIntegrationLogs(integrationId: string, limit: number = 50, offset: number = 0): Promise<LogsResponse> {
    const response = await apiClient.get(`/integrations/${integrationId}/logs`, {
      params: { limit, offset }
    });
    return response.data.data;
  }
}

export default IntegrationsService;


