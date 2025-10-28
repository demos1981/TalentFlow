import api from './api';

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: string;
  conditions: string[];
  actions: string[];
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  isEnabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  error: number;
  categories: Record<string, number>;
  execution: {
    total: number;
    successful: number;
    failed: number;
    averageTime: number;
  };
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  popularity: number;
  tags: string[];
  config: {
    trigger: string;
    conditions: string[];
    actions: string[];
  };
}

export interface WorkflowDetails {
  id: string;
  name: string;
  description: string;
  status: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  config: {
    enabled: boolean;
    priority: string;
    retryAttempts: number;
    timeout: number;
    schedule: string;
  };
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
    details: string;
  }>;
}

export interface WorkflowLog {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  details: string;
  workflowId: string;
}

export interface LogsResponse {
  logs: WorkflowLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface RunResponse {
  id: string;
  executionTime: number;
  result: string;
  timestamp: string;
}

export class AutomationService {
  // Отримання списку всіх автоматизацій
  static async getAllWorkflows(): Promise<AutomationWorkflow[]> {
    const response = await api.get('/automation');
    return response.data.data;
  }

  // Отримання статистики автоматизацій
  static async getAutomationStats(): Promise<AutomationStats> {
    const response = await api.get('/automation/stats');
    return response.data.data;
  }

  // Отримання шаблонів автоматизацій
  static async getAutomationTemplates(): Promise<AutomationTemplate[]> {
    const response = await api.get('/automation/templates');
    return response.data.data;
  }

  // Отримання деталей автоматизації
  static async getWorkflowDetails(workflowId: string): Promise<WorkflowDetails> {
    const response = await api.get(`/automation/${workflowId}`);
    return response.data.data;
  }

  // Створення нової автоматизації
  static async createWorkflow(workflowData: {
    name: string;
    description: string;
    category: string;
    trigger: string;
    conditions: string[];
    actions: string[];
    config?: any;
  }): Promise<AutomationWorkflow> {
    const response = await api.post('/automation', workflowData);
    return response.data.data;
  }

  // Оновлення автоматизації
  static async updateWorkflow(workflowId: string, updateData: any): Promise<AutomationWorkflow> {
    const response = await api.put(`/automation/${workflowId}`, updateData);
    return response.data.data;
  }

  // Запуск автоматизації
  static async runWorkflow(workflowId: string): Promise<RunResponse> {
    const response = await api.post(`/automation/${workflowId}/run`);
    return response.data.data;
  }

  // Активування/деактивування автоматизації
  static async toggleWorkflow(workflowId: string, enabled: boolean): Promise<{ id: string; isEnabled: boolean; status: string }> {
    const response = await api.post(`/automation/${workflowId}/toggle`, { enabled });
    return response.data.data;
  }

  // Видалення автоматизації
  static async deleteWorkflow(workflowId: string): Promise<{ id: string }> {
    const response = await api.delete(`/automation/${workflowId}`);
    return response.data.data;
  }

  // Отримання логів автоматизації
  static async getWorkflowLogs(workflowId: string, limit: number = 50, offset: number = 0): Promise<LogsResponse> {
    const response = await api.get(`/automation/${workflowId}/logs`, {
      params: { limit, offset }
    });
    return response.data.data;
  }
}

export default AutomationService;




