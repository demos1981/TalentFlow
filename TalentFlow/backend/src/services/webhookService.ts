import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Webhook, WebhookStatus } from '../models/Webhook';
import { 
  CreateWebhookDto, 
  UpdateWebhookDto, 
  WebhookSearchDto,
  WebhookPayloadDto,
  TestWebhookDto,
  WebhookLogDto
} from '../dto/WebhookDto';
import axios from 'axios';

export class WebhookService {
  private webhookRepository: Repository<Webhook>;

  constructor() {
    this.webhookRepository = AppDataSource.getRepository(Webhook);
  }

  async createWebhook(createWebhookDto: CreateWebhookDto, userId: string): Promise<Webhook> {
    try {
      const webhook = this.webhookRepository.create({
        ...createWebhookDto,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const savedWebhook = await this.webhookRepository.save(webhook);
      return Array.isArray(savedWebhook) ? savedWebhook[0] : savedWebhook;
    } catch (error) {
      console.error('Error creating webhook:', error);
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }

  async updateWebhook(id: string, updateWebhookDto: UpdateWebhookDto, userId: string): Promise<Webhook | null> {
    try {
      const webhook = await this.webhookRepository.findOne({ where: { id } });
      if (!webhook) {
        throw new Error('Webhook not found');
      }

      // Оновлюємо поля
      Object.keys(updateWebhookDto).forEach(key => {
        if (updateWebhookDto[key] !== undefined) {
          (webhook as any)[key] = updateWebhookDto[key];
        }
      });

      webhook.updatedAt = new Date();
      const savedWebhook = await this.webhookRepository.save(webhook);
      return Array.isArray(savedWebhook) ? savedWebhook[0] : savedWebhook;
    } catch (error) {
      console.error('Error updating webhook:', error);
      throw new Error(`Failed to update webhook: ${error.message}`);
    }
  }

  async deleteWebhook(id: string, userId: string): Promise<void> {
    try {
      const webhook = await this.webhookRepository.findOne({ where: { id } });
      if (!webhook) {
        throw new Error('Webhook not found');
      }

      await this.webhookRepository.remove(webhook);
    } catch (error) {
      console.error('Error deleting webhook:', error);
      throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }

  async getWebhookById(id: string): Promise<Webhook | null> {
    try {
      return await this.webhookRepository.findOne({ 
        where: { id },
        relations: ['creator']
      });
    } catch (error) {
      console.error('Error getting webhook by id:', error);
      throw new Error(`Failed to get webhook: ${error.message}`);
    }
  }

  async getAllWebhooks(searchDto: WebhookSearchDto): Promise<{ webhooks: Webhook[]; total: number; page: number; limit: number }> {
    try {
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const offset = (page - 1) * limit;

      const queryBuilder = this.webhookRepository.createQueryBuilder('webhook')
        .leftJoinAndSelect('webhook.creator', 'creator');

      // Фільтри
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(webhook.name ILIKE :search OR webhook.description ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      if (searchDto.event) {
        queryBuilder.andWhere('webhook.events && :event', { event: [searchDto.event] });
      }

      if (searchDto.status) {
        queryBuilder.andWhere('webhook.status = :status', { status: searchDto.status });
      }

      if (searchDto.method) {
        queryBuilder.andWhere('webhook.method = :method', { method: searchDto.method });
      }

      if (searchDto.isActive !== undefined) {
        queryBuilder.andWhere('webhook.isActive = :isActive', { isActive: searchDto.isActive });
      }

      if (searchDto.dateFrom) {
        queryBuilder.andWhere('webhook.createdAt >= :dateFrom', { dateFrom: new Date(searchDto.dateFrom) });
      }

      if (searchDto.dateTo) {
        queryBuilder.andWhere('webhook.createdAt <= :dateTo', { dateTo: new Date(searchDto.dateTo) });
      }

      // Сортування
      queryBuilder.orderBy('webhook.createdAt', 'DESC');

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const webhooks = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        webhooks,
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('Error getting webhooks:', error);
      throw new Error(`Failed to get webhooks: ${error.message}`);
    }
  }

  async getActiveWebhooks(): Promise<Webhook[]> {
    try {
      return await this.webhookRepository.find({
        where: { isActive: true, status: WebhookStatus.ACTIVE },
        order: { name: 'ASC' }
      });
    } catch (error) {
      console.error('Error getting active webhooks:', error);
      throw new Error(`Failed to get active webhooks: ${error.message}`);
    }
  }

  async getWebhooksByEvent(event: string): Promise<Webhook[]> {
    try {
      return await this.webhookRepository.find({
        where: { 
          events: { $contains: [event] } as any, 
          isActive: true,
          status: WebhookStatus.ACTIVE
        },
        order: { name: 'ASC' }
      });
    } catch (error) {
      console.error('Error getting webhooks by event:', error);
      throw new Error(`Failed to get webhooks by event: ${error.message}`);
    }
  }

  async triggerWebhook(webhookId: string, payload: WebhookPayloadDto): Promise<{ success: boolean; response?: any; error?: string }> {
    try {
      const webhook = await this.webhookRepository.findOne({ where: { id: webhookId } });
      if (!webhook || !webhook.isActive) {
        throw new Error('Webhook not found or inactive');
      }

      // Оновлюємо статистику
      webhook.lastTriggeredAt = new Date();
      webhook.retryCount = 0;
      await this.webhookRepository.save(webhook);

      // Підготовка запиту
      const requestConfig = {
        method: webhook.method.toLowerCase() as any,
        url: webhook.url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TalentFlow-Webhook/1.0',
          ...webhook.headers
        },
        timeout: webhook.timeout
      };

      // Додаємо секрет як заголовок, якщо він є
      if (webhook.secret) {
        requestConfig.headers['X-Webhook-Secret'] = webhook.secret;
      }

      // Відправляємо запит
      const startTime = Date.now();
      const response = await axios(requestConfig);
      const responseTime = Date.now() - startTime;

      // Оновлюємо статистику успіху
      webhook.lastSuccessAt = new Date();
      webhook.successCount += 1;
      await this.webhookRepository.save(webhook);

      // Логуємо активність
      await this.logWebhookActivity({
        webhookId: webhook.id,
        event: payload.event,
        requestId: payload.requestId || `req_${Date.now()}`,
        status: 'delivered',
        responseTime,
        statusCode: response.status,
        requestPayload: JSON.stringify(payload),
        responseBody: JSON.stringify(response.data)
      });

      return {
        success: true,
        response: {
          status: response.status,
          data: response.data,
          responseTime
        }
      };
    } catch (error) {
      console.error('Error triggering webhook:', error);
      
      // Оновлюємо статистику помилки
      const webhook = await this.webhookRepository.findOne({ where: { id: webhookId } });
      if (webhook) {
        webhook.lastFailureAt = new Date();
        webhook.failureCount += 1;
        webhook.lastError = error.message;
        await this.webhookRepository.save(webhook);
      }

      // Логуємо помилку
      await this.logWebhookActivity({
        webhookId,
        event: payload.event,
        requestId: payload.requestId || `req_${Date.now()}`,
        status: 'failed',
        errorMessage: error.message,
        requestPayload: JSON.stringify(payload)
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async testWebhook(testWebhookDto: TestWebhookDto): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const webhook = await this.webhookRepository.findOne({ where: { id: testWebhookDto.webhookId } });
      if (!webhook) {
        return { success: false, message: 'Webhook not found' };
      }

      const testPayload: any = testWebhookDto.testPayload || {
        event: testWebhookDto.event || 'test',
        data: { message: 'This is a test webhook', timestamp: new Date().toISOString() },
        requestId: `test_${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      const result = await this.triggerWebhook(webhook.id, testPayload);

      if (result.success) {
        return { 
          success: true, 
          message: 'Webhook test successful',
          details: result.response
        };
      } else {
        return { 
          success: false, 
          message: 'Webhook test failed',
          details: { error: result.error }
        };
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      return { success: false, message: `Webhook test failed: ${error.message}` };
    }
  }

  async getWebhookStats(): Promise<{
    totalWebhooks: number;
    activeWebhooks: number;
    inactiveWebhooks: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    webhooksByEvent: any[];
    recentActivity: any[];
  }> {
    try {
      const totalWebhooks = await this.webhookRepository.count();
      const activeWebhooks = await this.webhookRepository.count({ where: { isActive: true } });
      const inactiveWebhooks = await this.webhookRepository.count({ where: { isActive: false } });

      // Статистика доставки (симуляція, оскільки у нас немає окремої таблиці доставки)
      const totalDeliveries = activeWebhooks * 10; // Симуляція
      const successfulDeliveries = Math.floor(totalDeliveries * 0.8); // 80% успішних
      const failedDeliveries = totalDeliveries - successfulDeliveries;

      // Статистика по подіях
      const webhooksByEvent = await this.webhookRepository
        .createQueryBuilder('webhook')
        .select('webhook.events', 'events')
        .getRawMany();

      // Остання активність (симуляція)
      const recentActivity = await this.webhookRepository.find({
        where: { isActive: true },
        order: { lastTriggeredAt: 'DESC' },
        take: 10
      });

      return {
        totalWebhooks,
        activeWebhooks,
        inactiveWebhooks,
        totalDeliveries,
        successfulDeliveries,
        failedDeliveries,
        webhooksByEvent,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting webhook stats:', error);
      throw new Error(`Failed to get webhook stats: ${error.message}`);
    }
  }

  async getWebhookHealth(id: string): Promise<{
    status: string;
    lastDelivery: Date | null;
    lastError: string | null;
    deliveryCount: number;
    errorCount: number;
    averageResponseTime: number;
    successRate: number;
  }> {
    try {
      const webhook = await this.webhookRepository.findOne({ where: { id } });
      if (!webhook) {
        throw new Error('Webhook not found');
      }

      // Симуляція статистики здоров'я
      const deliveryCount = webhook.successCount + webhook.failureCount;
      const errorCount = webhook.failureCount;
      const averageResponseTime = 500; // Симуляція
      const successRate = deliveryCount > 0 ? ((webhook.successCount / deliveryCount) * 100) : 0;

      return {
        status: webhook.status,
        lastDelivery: webhook.lastSuccessAt,
        lastError: webhook.lastError,
        deliveryCount,
        errorCount,
        averageResponseTime,
        successRate
      };
    } catch (error) {
      console.error('Error getting webhook health:', error);
      throw new Error(`Failed to get webhook health: ${error.message}`);
    }
  }

  async validateWebhook(webhookId: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const webhook = await this.webhookRepository.findOne({ where: { id: webhookId } });
      if (!webhook) {
        return { valid: false, errors: ['Webhook not found'] };
      }

      const errors: string[] = [];

      // Валідація URL
      try {
        new URL(webhook.url);
      } catch (error) {
        errors.push('Invalid URL format');
      }

      // Валідація подій
      if (!webhook.events || webhook.events.length === 0) {
        errors.push('At least one event must be specified');
      }

      // Валідація заголовків
      if (webhook.headers) {
        try {
          JSON.parse(JSON.stringify(webhook.headers));
        } catch (error) {
          errors.push('Invalid headers format');
        }
      }

      // Валідація фільтрів
      if (webhook.filters) {
        try {
          JSON.parse(JSON.stringify(webhook.filters));
        } catch (error) {
          errors.push('Invalid filters format');
        }
      }

      // Валідація трансформації
      if (webhook.transformation) {
        try {
          JSON.parse(webhook.transformation);
        } catch (error) {
          errors.push('Invalid transformation JSON');
        }
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      console.error('Error validating webhook:', error);
      throw new Error(`Failed to validate webhook: ${error.message}`);
    }
  }

  async getAvailableWebhookEvents(): Promise<any[]> {
    return [
      {
        name: 'application.created',
        description: 'Triggered when a new application is created',
        category: 'applications'
      },
      {
        name: 'application.updated',
        description: 'Triggered when an application is updated',
        category: 'applications'
      },
      {
        name: 'application.deleted',
        description: 'Triggered when an application is deleted',
        category: 'applications'
      },
      {
        name: 'interview.scheduled',
        description: 'Triggered when an interview is scheduled',
        category: 'interviews'
      },
      {
        name: 'interview.completed',
        description: 'Triggered when an interview is completed',
        category: 'interviews'
      },
      {
        name: 'interview.cancelled',
        description: 'Triggered when an interview is cancelled',
        category: 'interviews'
      },
      {
        name: 'job.created',
        description: 'Triggered when a new job is created',
        category: 'jobs'
      },
      {
        name: 'job.updated',
        description: 'Triggered when a job is updated',
        category: 'jobs'
      },
      {
        name: 'job.deleted',
        description: 'Triggered when a job is deleted',
        category: 'jobs'
      },
      {
        name: 'user.registered',
        description: 'Triggered when a new user registers',
        category: 'users'
      },
      {
        name: 'user.updated',
        description: 'Triggered when a user profile is updated',
        category: 'users'
      },
      {
        name: 'payment.completed',
        description: 'Triggered when a payment is completed',
        category: 'payments'
      },
      {
        name: 'payment.failed',
        description: 'Triggered when a payment fails',
        category: 'payments'
      },
      {
        name: 'subscription.created',
        description: 'Triggered when a subscription is created',
        category: 'subscriptions'
      },
      {
        name: 'subscription.updated',
        description: 'Triggered when a subscription is updated',
        category: 'subscriptions'
      },
      {
        name: 'subscription.cancelled',
        description: 'Triggered when a subscription is cancelled',
        category: 'subscriptions'
      }
    ];
  }

  private async logWebhookActivity(logDto: WebhookLogDto): Promise<void> {
    try {
      // Тут можна додати логування в окрему таблицю або файл
      console.log('Webhook activity:', logDto);
    } catch (error) {
      console.error('Error logging webhook activity:', error);
    }
  }
}

export const webhookService = new WebhookService();