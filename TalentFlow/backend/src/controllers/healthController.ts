import { Request, Response } from 'express';
import { healthService } from '../services/healthService';
import { validateDto } from '../middleware/dtoValidation';
import { MetricsDto, ServiceParamDto } from '../dto/HealthDto';

export const healthController = {
  /**
   * Отримання загального статусу здоров'я
   */
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await healthService.getHealth();
      
      const statusCode = health.status === 'healthy' ? 200 : 503;
      
      res.status(statusCode).json({
        success: true,
        message: 'Health status retrieved successfully',
        data: health
      });
    } catch (error) {
      console.error('Error getting health status:', error);
      res.status(500).json({
        success: false,
        message: 'Health check failed',
        error: error.message,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Health check failed'
        }
      });
    }
  },

  /**
   * Отримання детального статусу здоров'я
   */
  async getDetailedHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await healthService.getDetailedHealth();
      
      const statusCode = health.overallStatus === 'healthy' ? 200 : 503;
      
      res.status(statusCode).json({
        success: true,
        message: 'Detailed health status retrieved successfully',
        data: health
      });
    } catch (error) {
      console.error('Error getting detailed health status:', error);
      res.status(500).json({
        success: false,
        message: 'Detailed health check failed',
        error: error.message,
        data: {
          overallStatus: 'critical',
          message: 'Detailed health check failed',
          services: [],
          details: 'Unable to determine system health',
          timestamp: new Date().toISOString(),
          healthScore: 0
        }
      });
    }
  },

  /**
   * Перевірка готовності системи
   */
  async getReadiness(req: Request, res: Response): Promise<void> {
    try {
      const readiness = await healthService.getReadiness();
      
      const statusCode = readiness.status === 'healthy' ? 200 : 503;
      
      res.status(statusCode).json({
        success: true,
        message: 'System readiness status retrieved successfully',
        data: readiness
      });
    } catch (error) {
      console.error('Error getting system readiness:', error);
      res.status(503).json({
        success: false,
        message: 'Readiness check failed',
        error: error.message,
        data: {
          status: 'not_ready',
          message: 'System is not ready',
          dependencies: [],
          details: 'System is not ready to serve requests',
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Перевірка живості системи
   */
  async getLiveness(req: Request, res: Response): Promise<void> {
    try {
      const liveness = await healthService.getLiveness();
      
      const statusCode = liveness.status === 'healthy' ? 200 : 500;
      
      res.status(statusCode).json({
        success: true,
        message: 'System liveness status retrieved successfully',
        data: liveness
      });
    } catch (error) {
      console.error('Error getting system liveness:', error);
      res.status(500).json({
        success: false,
        message: 'Liveness check failed',
        error: error.message,
        data: {
          status: 'dead',
          message: 'Liveness check failed',
          details: 'Application is not responding properly',
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Отримання метрик системи
   */
  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MetricsDto, true)(req, res, () => {});
      if (validationResult) return;

      const metricsDto: MetricsDto = req.query as any;
      const metrics = await healthService.getMetrics(metricsDto);
      
      res.status(200).json({
        success: true,
        message: 'System metrics retrieved successfully',
        data: metrics
      });
    } catch (error) {
      console.error('Error getting system metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get metrics',
        error: error.message,
        data: {
          error: 'Failed to get metrics',
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Отримання статусу бази даних
   */
  async getDatabaseHealth(req: Request, res: Response): Promise<void> {
    try {
      const dbHealth = await healthService.getDatabaseHealth();
      
      const statusCode = dbHealth.status === 'up' ? 200 : 503;
      
      res.status(statusCode).json({
        success: true,
        message: 'Database health status retrieved successfully',
        data: dbHealth
      });
    } catch (error) {
      console.error('Error getting database health:', error);
      res.status(503).json({
        success: false,
        message: 'Database health check failed',
        error: error.message,
        data: {
          status: 'down',
          responseTime: 0,
          connectionPool: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          message: 'Database health check failed',
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Отримання статусу зовнішніх сервісів
   */
  async getExternalServicesHealth(req: Request, res: Response): Promise<void> {
    try {
      const externalHealth = await healthService.getExternalServicesHealth();
      
      const hasUnhealthyServices = externalHealth.some(service => service.status !== 'up');
      const statusCode = hasUnhealthyServices ? 503 : 200;
      
      res.status(statusCode).json({
        success: true,
        message: 'External services health status retrieved successfully',
        data: externalHealth
      });
    } catch (error) {
      console.error('Error getting external services health:', error);
      res.status(503).json({
        success: false,
        message: 'External services health check failed',
        error: error.message,
        data: {
          status: 'unhealthy',
          message: 'External services health check failed',
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Отримання статусу конкретного зовнішнього сервісу
   */
  async getExternalServiceHealth(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ServiceParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const { service } = req.params;
      const serviceHealth = await healthService.getExternalServiceHealth(service);
      
      const statusCode = serviceHealth.status === 'up' ? 200 : 503;
      
      res.status(statusCode).json({
        success: true,
        message: 'External service health status retrieved successfully',
        data: serviceHealth
      });
    } catch (error) {
      console.error('Error getting external service health:', error);
      res.status(503).json({
        success: false,
        message: 'External service health check failed',
        error: error.message,
        data: {
          service: req.params.service,
          status: 'down',
          responseTime: 0,
          availability: 0,
          message: 'External service health check failed',
          lastCheck: new Date().toISOString(),
          successRate: 0
        }
      });
    }
  },

  /**
   * Отримання навантаження системи
   */
  async getSystemLoad(req: Request, res: Response): Promise<void> {
    try {
      const systemLoad = await healthService.getSystemLoad();
      
      res.status(200).json({
        success: true,
        message: 'System load information retrieved successfully',
        data: systemLoad
      });
    } catch (error) {
      console.error('Error getting system load:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get system load',
        error: error.message,
        data: {
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          networkUsage: 0,
          loadAverage: 0,
          activeConnections: 0,
          queueLength: 0,
          message: 'Failed to get system load',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
};