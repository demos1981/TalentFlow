import { Request, Response } from 'express';
import { webhookService } from '../services/webhookService';
import {
  CreateWebhookDto,
  UpdateWebhookDto,
  WebhookSearchDto,
  WebhookPayloadDto,
  TestWebhookDto
} from '../dto/WebhookDto';

export const webhookController = {
  // Створення нового webhook'а
  async createWebhook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const createWebhookDto: CreateWebhookDto = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authorization required' });
        return;
      }

      const webhook = await webhookService.createWebhook(createWebhookDto, userId);

      res.status(201).json({
        success: true,
        message: 'Webhook created successfully',
        data: webhook
      });
    } catch (error) {
      console.error('Error creating webhook:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating webhook',
        error: error.message
      });
    }
  },

  // Оновлення webhook'а
  async updateWebhook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const updateWebhookDto: UpdateWebhookDto = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authorization required' });
        return;
      }

      const webhook = await webhookService.updateWebhook(id, updateWebhookDto, userId);

      if (!webhook) {
        res.status(404).json({ success: false, message: 'Webhook not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Webhook updated successfully',
        data: webhook
      });
    } catch (error) {
      console.error('Error updating webhook:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating webhook',
        error: error.message
      });
    }
  },

  // Видалення webhook'а
  async deleteWebhook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authorization required' });
        return;
      }

      await webhookService.deleteWebhook(id, userId);

      res.status(200).json({
        success: true,
        message: 'Webhook deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting webhook:', error);
      res.status(400).json({
        success: false,
        message: 'Error deleting webhook',
        error: error.message
      });
    }
  },

  // Отримання webhook'а за ID
  async getWebhookById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const webhook = await webhookService.getWebhookById(id);

      if (!webhook) {
        res.status(404).json({ success: false, message: 'Webhook not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: webhook
      });
    } catch (error) {
      console.error('Error getting webhook by id:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting webhook',
        error: error.message
      });
    }
  },

  // Отримання всіх webhook'ів з фільтрацією
  async getAllWebhooks(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const searchDto: WebhookSearchDto = {
        search: query.search as string,
        event: query.event as string,
        status: query.status as any,
        method: query.method as any,
        isActive: query.isActive ? query.isActive === 'true' : undefined,
        dateFrom: query.dateFrom as string,
        dateTo: query.dateTo as string,
        page: query.page ? parseInt(query.page as string) : 1,
        limit: query.limit ? parseInt(query.limit as string) : 20
      };

      const result = await webhookService.getAllWebhooks(searchDto);

      res.status(200).json({
        success: true,
        data: result.webhooks,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      console.error('Error getting webhooks:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting webhooks',
        error: error.message
      });
    }
  },

  // Отримання активних webhook'ів
  async getActiveWebhooks(req: Request, res: Response): Promise<void> {
    try {
      const webhooks = await webhookService.getActiveWebhooks();

      res.status(200).json({
        success: true,
        data: webhooks
      });
    } catch (error) {
      console.error('Error getting active webhooks:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting active webhooks',
        error: error.message
      });
    }
  },

  // Отримання webhook'ів по події
  async getWebhooksByEvent(req: Request, res: Response): Promise<void> {
    try {
      const { event } = req.params;
      const webhooks = await webhookService.getWebhooksByEvent(event);

      res.status(200).json({
        success: true,
        data: webhooks
      });
    } catch (error) {
      console.error('Error getting webhooks by event:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting webhooks by event',
        error: error.message
      });
    }
  },

  // Тригер webhook'а
  async triggerWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload: WebhookPayloadDto = req.body;

      const result = await webhookService.triggerWebhook(id, payload);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Webhook triggered successfully',
          data: result.response
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Webhook trigger failed',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error triggering webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Error triggering webhook',
        error: error.message
      });
    }
  },

  // Тестування webhook'а
  async testWebhook(req: Request, res: Response): Promise<void> {
    try {
      const testWebhookDto: TestWebhookDto = req.body;

      const result = await webhookService.testWebhook(testWebhookDto);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.details
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          data: result.details
        });
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Error testing webhook',
        error: error.message
      });
    }
  },

  // Отримання статистики webhook'ів
  async getWebhookStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await webhookService.getWebhookStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting webhook stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting webhook stats',
        error: error.message
      });
    }
  },

  // Отримання здоров'я webhook'а
  async getWebhookHealth(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const health = await webhookService.getWebhookHealth(id);

      res.status(200).json({
        success: true,
        data: health
      });
    } catch (error) {
      console.error('Error getting webhook health:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting webhook health',
        error: error.message
      });
    }
  },

  // Валідація webhook'а
  async validateWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validation = await webhookService.validateWebhook(id);

      res.status(200).json({
        success: true,
        data: validation
      });
    } catch (error) {
      console.error('Error validating webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Error validating webhook',
        error: error.message
      });
    }
  },

  // Отримання доступних подій webhook'ів
  async getAvailableEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await webhookService.getAvailableWebhookEvents();

      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error getting available events:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting available events',
        error: error.message
      });
    }
  },

  // Обробка вхідних webhook'ів від зовнішніх сервісів
  async handleIncomingWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { event_type, data, signature } = req.body;

      // Тут має бути логіка верифікації та обробки вхідного webhook'а
      console.log('Incoming webhook received:', { event_type, data });

      // Відповідаємо успішно
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error handling incoming webhook:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  }
};