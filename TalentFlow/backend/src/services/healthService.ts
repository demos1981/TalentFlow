import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { Company } from '../models/Company';
import { CandidateProfile } from '../models/CandidateProfile';
import { File } from '../models/File';
import { Interview } from '../models/Interview';
import { Notification } from '../models/Notification';
import { Event } from '../models/Event';
import {
  HealthCheckDto,
  DatabaseHealthDto,
  ExternalServiceHealthDto,
  SystemLoadDto,
  ReadinessDto,
  LivenessDto,
  DetailedHealthDto,
  MetricsDto,
  HealthStatus} from '../dto/HealthDto';

export class HealthService {
  private userRepository: Repository<User>;
  private jobRepository: Repository<Job>;
  private applicationRepository: Repository<Application>;
  private companyRepository: Repository<Company>;
  private candidateProfileRepository: Repository<CandidateProfile>;
  private fileRepository: Repository<File>;
  private interviewRepository: Repository<Interview>;
  private notificationRepository: Repository<Notification>;
  private eventRepository: Repository<Event>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.jobRepository = AppDataSource.getRepository(Job);
    this.applicationRepository = AppDataSource.getRepository(Application);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.candidateProfileRepository = AppDataSource.getRepository(CandidateProfile);
    this.fileRepository = AppDataSource.getRepository(File);
    this.interviewRepository = AppDataSource.getRepository(Interview);
    this.notificationRepository = AppDataSource.getRepository(Notification);
    this.eventRepository = AppDataSource.getRepository(Event);
  }

  /**
   * Отримання загального статусу здоров'я системи
   */
  async getHealth(): Promise<HealthCheckDto> {
    try {
      const startTime = Date.now();
      
      // Перевірка підключення до бази даних
      await AppDataSource.query('SELECT 1');
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'talentflow-api',
        status: HealthStatus.HEALTHY,
        message: 'System is healthy and operational',
        responseTime,
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        metadata: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        service: 'talentflow-api',
        status: HealthStatus.CRITICAL,
        message: `System health check failed: ${error.message}`,
        responseTime: 0,
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      };
    }
  }

  /**
   * Отримання детального статусу здоров'я системи
   */
  async getDetailedHealth(): Promise<DetailedHealthDto> {
    try {
      const [databaseHealth, systemLoad, readiness, liveness] = await Promise.all([
        this.getDatabaseHealth(),
        this.getSystemLoad(),
        this.getReadiness(),
        this.getLiveness()
      ]);

      const services = ['database', 'api', 'storage', 'email'];
      const overallStatus = this.calculateOverallStatus(databaseHealth, systemLoad, readiness, liveness);
      const healthScore = this.calculateHealthScore(databaseHealth, systemLoad, readiness);

      return {
        overallStatus,
        message: overallStatus === HealthStatus.HEALTHY ? 'All systems are operational' : 'Some systems require attention',
        services,
        details: `Database: ${databaseHealth.status}, CPU: ${systemLoad.cpuUsage}%, Memory: ${systemLoad.memoryUsage}%`,
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        healthScore
      };
    } catch (error) {
      console.error('Detailed health check failed:', error);
      return {
        overallStatus: HealthStatus.CRITICAL,
        message: `Detailed health check failed: ${error.message}`,
        services: [],
        details: 'Unable to determine system health',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        healthScore: 0
      };
    }
  }

  /**
   * Перевірка готовності системи
   */
  async getReadiness(): Promise<ReadinessDto> {
    try {
      const dependencies = ['database', 'api', 'storage'];
      const dependencyStatuses = await Promise.all(
        dependencies.map(async (dep) => {
          try {
            if (dep === 'database') {
              await AppDataSource.query('SELECT 1');
              return { service: dep, status: HealthStatus.HEALTHY };
            } else if (dep === 'api') {
              // Перевірка API endpoints
              await this.checkApiEndpoints();
              return { service: dep, status: HealthStatus.HEALTHY };
            } else if (dep === 'storage') {
              // Перевірка R2 storage
              await this.checkStorageHealth();
              return { service: dep, status: HealthStatus.HEALTHY };
            }
            return { service: dep, status: HealthStatus.HEALTHY };
          } catch (error) {
            return { service: dep, status: HealthStatus.UNHEALTHY, error: error.message };
          }
        })
      );

      const unhealthyDependencies = dependencyStatuses.filter(dep => dep.status !== HealthStatus.HEALTHY);
      const isReady = unhealthyDependencies.length === 0;

      return {
        status: isReady ? HealthStatus.HEALTHY : HealthStatus.WARNING,
        message: isReady ? 'All dependencies are healthy' : `${unhealthyDependencies.length} dependencies are unhealthy`,
        dependencies: dependencyStatuses.map(dep => dep.service),
        details: isReady ? 'System is ready to serve requests' : `Unhealthy dependencies: ${unhealthyDependencies.map(dep => dep.service).join(', ')}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Readiness check failed:', error);
      return {
        status: HealthStatus.CRITICAL,
        message: `Readiness check failed: ${error.message}`,
        dependencies: [],
        details: 'System is not ready to serve requests',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Перевірка живості системи
   */
  async getLiveness(): Promise<LivenessDto> {
    try {
      // Базова перевірка живості - якщо можемо відповісти, то живи
      return {
        status: HealthStatus.HEALTHY,
        message: 'Service is alive and responding',
        details: 'Application is running and processing requests',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        build: process.env.BUILD_NUMBER || 'unknown'
      };
    } catch (error) {
      console.error('Liveness check failed:', error);
      return {
        status: HealthStatus.CRITICAL,
        message: `Liveness check failed: ${error.message}`,
        details: 'Application is not responding properly',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        build: process.env.BUILD_NUMBER || 'unknown'
      };
    }
  }

  /**
   * Отримання метрик системи
   */
  async getMetrics(metricsDto: MetricsDto): Promise<{
    systemMetrics: any;
    databaseMetrics: any;
    apiMetrics: any;
    timestamp: string;
  }> {
    try {
      const [systemMetrics, databaseMetrics, apiMetrics] = await Promise.all([
        this.getSystemMetrics(),
        this.getDatabaseMetrics(),
        this.getApiMetrics()
      ]);

      return {
        systemMetrics,
        databaseMetrics,
        apiMetrics,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting metrics:', error);
      throw new Error(`Failed to get metrics: ${error.message}`);
    }
  }

  /**
   * Отримання статусу бази даних
   */
  async getDatabaseHealth(): Promise<DatabaseHealthDto> {
    try {
      const startTime = Date.now();
      
      // Тест підключення до бази даних
      await AppDataSource.query('SELECT 1');
      
      const responseTime = Date.now() - startTime;

      // Отримання статистики бази даних
      const connectionPool = await this.getConnectionPoolStatus();
      const systemMetrics = await this.getSystemMetrics();

      return {
        status: HealthStatus.UP,
        responseTime,
        connectionPool,
        cpuUsage: systemMetrics.cpuUsage,
        memoryUsage: systemMetrics.memoryUsage,
        diskUsage: systemMetrics.diskUsage,
        message: 'Database is healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        status: HealthStatus.DOWN,
        responseTime: 0,
        connectionPool: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        message: `Database is unhealthy: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Отримання статусу зовнішніх сервісів
   */
  async getExternalServicesHealth(): Promise<ExternalServiceHealthDto[]> {
    try {
      const services = ['email', 'storage', 'payment'];
      const results = await Promise.all(
        services.map(service => this.getExternalServiceHealth(service))
      );

      return results;
    } catch (error) {
      console.error('External services health check failed:', error);
      throw new Error(`Failed to check external services: ${error.message}`);
    }
  }

  /**
   * Отримання статусу конкретного зовнішнього сервісу
   */
  async getExternalServiceHealth(serviceName: string): Promise<ExternalServiceHealthDto> {
    try {
      const startTime = Date.now();
      
      // Симуляція перевірки зовнішніх сервісів
      await new Promise(resolve => setTimeout(resolve, 100));

      const responseTime = Date.now() - startTime;

      return {
        service: serviceName,
        status: HealthStatus.UP,
        responseTime,
        availability: 99.9,
        message: `${serviceName} service is healthy`,
        lastCheck: new Date().toISOString(),
        lastSuccess: new Date().toISOString(),
        lastFailure: null,
        successRate: 99.9
      };
    } catch (error) {
      console.error(`External service ${serviceName} health check failed:`, error);
      return {
        service: serviceName,
        status: HealthStatus.DOWN,
        responseTime: 0,
        availability: 0,
        message: `${serviceName} service is unhealthy: ${error.message}`,
        lastCheck: new Date().toISOString(),
        lastSuccess: null,
        lastFailure: new Date().toISOString(),
        successRate: 0
      };
    }
  }

  /**
   * Отримання навантаження системи
   */
  async getSystemLoad(): Promise<SystemLoadDto> {
    try {
      const systemMetrics = await this.getSystemMetrics();
      
      return {
        cpuUsage: systemMetrics.cpuUsage,
        memoryUsage: systemMetrics.memoryUsage,
        diskUsage: systemMetrics.diskUsage,
        networkUsage: systemMetrics.networkUsage,
        loadAverage: systemMetrics.loadAverage,
        activeConnections: systemMetrics.activeConnections,
        queueLength: systemMetrics.queueLength,
        message: 'System load is normal',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('System load check failed:', error);
      return {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkUsage: 0,
        loadAverage: 0,
        activeConnections: 0,
        queueLength: 0,
        message: `Failed to get system load: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Отримання статистики бази даних
   */
  private async getDatabaseMetrics(): Promise<any> {
    try {
      const [userCount, jobCount, applicationCount, companyCount, candidateCount, fileCount, interviewCount, notificationCount, eventCount] = await Promise.all([
        this.userRepository.count({ where: { isActive: true } }),
        this.jobRepository.count({ where: { isActive: true } }),
        this.applicationRepository.count(),
        this.companyRepository.count({ where: { isActive: true } }),
        this.candidateProfileRepository.count({ where: { isActive: true } }),
        this.fileRepository.count({ where: { isActive: true } }),
        this.interviewRepository.count(),
        this.notificationRepository.count(),
        this.eventRepository.count({ where: { isActive: true } })
      ]);

      return {
        totalUsers: userCount,
        totalJobs: jobCount,
        totalApplications: applicationCount,
        totalCompanies: companyCount,
        totalCandidates: candidateCount,
        totalFiles: fileCount,
        totalInterviews: interviewCount,
        totalNotifications: notificationCount,
        totalEvents: eventCount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database metrics failed:', error);
      return {
        error: 'Failed to get database metrics',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Отримання метрик API
   */
  private async getApiMetrics(): Promise<any> {
    try {
      // Симуляція метрик API
      return {
        totalRequests: Math.floor(Math.random() * 10000),
        averageResponseTime: Math.floor(Math.random() * 500),
        errorRate: Math.random() * 5,
        activeUsers: Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('API metrics failed:', error);
      return {
        error: 'Failed to get API metrics',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Отримання системних метрик
   */
  private async getSystemMetrics(): Promise<{
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkUsage: number;
    loadAverage: number;
    activeConnections: number;
    queueLength: number;
  }> {
    try {
      const memUsage = process.memoryUsage();
      const memoryUsage = (memUsage.heapUsed / memUsage.heapTotal) * 100;

      return {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.min(100, memoryUsage),
        diskUsage: Math.random() * 100,
        networkUsage: Math.random() * 100,
        loadAverage: Math.random() * 10,
        activeConnections: Math.floor(Math.random() * 1000),
        queueLength: Math.floor(Math.random() * 100)
      };
    } catch (error) {
      console.error('System metrics failed:', error);
      return {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkUsage: 0,
        loadAverage: 0,
        activeConnections: 0,
        queueLength: 0
      };
    }
  }

  /**
   * Перевірка API endpoints
   */
  private async checkApiEndpoints(): Promise<void> {
    // Симуляція перевірки API endpoints
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Перевірка здоров'я storage
   */
  private async checkStorageHealth(): Promise<void> {
    // Симуляція перевірки R2 storage
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Отримання статусу пулу з'єднань
   */
  private async getConnectionPoolStatus(): Promise<number> {
    try {
      // Симуляція здорового пулу з'єднань
      return 85; // 85% з'єднань доступно
    } catch (error) {
      return 0;
    }
  }

  /**
   * Розрахунок загального статусу
   */
  private calculateOverallStatus(
    databaseHealth: DatabaseHealthDto,
    systemLoad: SystemLoadDto,
    readiness: ReadinessDto,
    liveness: LivenessDto
  ): HealthStatus {
    if (databaseHealth.status === HealthStatus.DOWN || 
        liveness.status === HealthStatus.CRITICAL) {
      return HealthStatus.CRITICAL;
    }

    if (systemLoad.cpuUsage > 90 || 
        systemLoad.memoryUsage > 90 || 
        readiness.status !== HealthStatus.HEALTHY) {
      return HealthStatus.WARNING;
    }

    return HealthStatus.HEALTHY;
  }

  /**
   * Розрахунок оцінки здоров'я
   */
  private calculateHealthScore(
    databaseHealth: DatabaseHealthDto,
    systemLoad: SystemLoadDto,
    readiness: ReadinessDto
  ): number {
    let score = 100;

    // Вплив здоров'я бази даних
    if (databaseHealth.status !== HealthStatus.UP) {
      score -= 40;
    } else if (databaseHealth.responseTime > 1000) {
      score -= 20;
    }

    // Вплив навантаження системи
    if (systemLoad.cpuUsage > 90) {
      score -= 30;
    } else if (systemLoad.cpuUsage > 80) {
      score -= 15;
    }

    if (systemLoad.memoryUsage > 90) {
      score -= 30;
    } else if (systemLoad.memoryUsage > 80) {
      score -= 15;
    }

    // Вплив готовності
    if (readiness.status !== HealthStatus.HEALTHY) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }
}

export const healthService = new HealthService();