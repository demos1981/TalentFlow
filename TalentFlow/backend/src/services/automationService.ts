import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Workflow, ExecutionStatus, WorkflowStatus, WorkflowType } from '../models/Workflow';
import { 
  CreateWorkflowDto, 
  UpdateWorkflowDto, 
  WorkflowSearchDto,
  RunWorkflowDto,
  ToggleWorkflowDto,
  CreateWorkflowTemplateDto
} from '../dto/AutomationDto';

export class AutomationService {
  private workflowRepository: Repository<Workflow>;

  constructor() {
    this.workflowRepository = AppDataSource.getRepository(Workflow);
  }

  async createWorkflow(createWorkflowDto: CreateWorkflowDto, creatorId: string): Promise<Workflow> {
    const workflow = this.workflowRepository.create({
      ...createWorkflowDto,
      createdBy: creatorId,
      executionCount: 0,
      successCount: 0,
      failureCount: 0
    });

    return await this.workflowRepository.save(workflow);
  }

  async updateWorkflow(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<Workflow | null> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      return null;
    }

    Object.assign(workflow, updateWorkflowDto);
    return await this.workflowRepository.save(workflow);
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const result = await this.workflowRepository.delete(id);
    return result.affected > 0;
  }

  async getWorkflowById(id: string): Promise<Workflow | null> {
    return await this.workflowRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });
  }

  async getAllWorkflows(filters?: any): Promise<Workflow[]> {
    const queryBuilder = this.workflowRepository.createQueryBuilder('workflow')
      .leftJoinAndSelect('workflow.createdBy', 'createdBy');

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('workflow.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.type) {
      queryBuilder.andWhere('workflow.type = :type', { type: filters.type });
    }

    if (filters?.status) {
      queryBuilder.andWhere('workflow.status = :status', { status: filters.status });
    }

    return await queryBuilder
      .orderBy('workflow.name', 'ASC')
      .getMany();
  }

  async getActiveWorkflows(): Promise<Workflow[]> {
    return await this.workflowRepository.find({
      where: { isActive: true },
      relations: ['createdBy'],
      order: { name: 'ASC' }
    });
  }

  async searchWorkflows(searchDto: WorkflowSearchDto): Promise<{ workflows: Workflow[], total: number }> {
    const queryBuilder = this.workflowRepository.createQueryBuilder('workflow')
      .leftJoinAndSelect('workflow.createdBy', 'createdBy');

    if (searchDto.query) {
      queryBuilder.andWhere(
        '(workflow.name ILIKE :query OR workflow.description ILIKE :query)',
        { query: `%${searchDto.query}%` }
      );
    }

    if (searchDto.type) {
      queryBuilder.andWhere('workflow.type = :type', { type: searchDto.type });
    }

    if (searchDto.status) {
      queryBuilder.andWhere('workflow.status = :status', { status: searchDto.status });
    }

    if (searchDto.triggerType) {
      queryBuilder.andWhere('workflow.triggerType = :triggerType', { triggerType: searchDto.triggerType });
    }

    if (searchDto.isActive !== undefined) {
      queryBuilder.andWhere('workflow.isActive = :isActive', { isActive: searchDto.isActive });
    }

    if (searchDto.isTemplate !== undefined) {
      queryBuilder.andWhere('workflow.isTemplate = :isTemplate', { isTemplate: searchDto.isTemplate });
    }

    if (searchDto.tags && searchDto.tags.length > 0) {
      queryBuilder.andWhere('workflow.tags && :tags', { tags: searchDto.tags });
    }

    if (searchDto.dateFrom) {
      queryBuilder.andWhere('workflow.createdAt >= :dateFrom', { dateFrom: searchDto.dateFrom });
    }

    if (searchDto.dateTo) {
      queryBuilder.andWhere('workflow.createdAt <= :dateTo', { dateTo: searchDto.dateTo });
    }

    const page = searchDto.page || 1;
    const limit = searchDto.limit || 10;

    queryBuilder
      .orderBy('workflow.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [workflows, total] = await queryBuilder.getManyAndCount();

    return { workflows, total };
  }

  async getWorkflowsByType(type: WorkflowType): Promise<Workflow[]> {
    return await this.workflowRepository.find({
      where: { type, isActive: true },
      relations: ['createdBy'],
      order: { name: 'ASC' }
    });
  }

  async getWorkflowTemplates(): Promise<Workflow[]> {
    return await this.workflowRepository.find({
      where: { isTemplate: true },
      relations: ['createdBy'],
      order: { name: 'ASC' }
    });
  }

  async runWorkflow(runWorkflowDto: RunWorkflowDto, userId: string): Promise<Workflow | null> {
    const workflow = await this.workflowRepository.findOne({ where: { id: runWorkflowDto.workflowId } });
    if (!workflow || !workflow.isActive) {
      return null;
    }

    try {
      // Оновлюємо статистику виконання
      workflow.executionCount++;
      workflow.lastExecutedAt = new Date();
      workflow.lastExecutionStatus = ExecutionStatus.RUNNING;
      workflow.lastErrorMessage = null;

      await this.workflowRepository.save(workflow);

      // Here you would implement the actual workflow execution logic
      // For now, we'll just simulate a successful execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Оновлюємо статус на успішне виконання
      workflow.lastExecutionStatus = ExecutionStatus.COMPLETED;
      workflow.successCount++;

      await this.workflowRepository.save(workflow);

      return workflow;
    } catch (error) {
      // Оновлюємо статус на помилку
      workflow.lastExecutionStatus = ExecutionStatus.FAILED;
      workflow.failureCount++;
      workflow.lastErrorMessage = error.message;

      await this.workflowRepository.save(workflow);

      return workflow;
    }
  }

  async toggleWorkflow(toggleWorkflowDto: ToggleWorkflowDto): Promise<Workflow | null> {
    const workflow = await this.workflowRepository.findOne({ where: { id: toggleWorkflowDto.workflowId } });
    if (!workflow) {
      return null;
    }

    workflow.isActive = toggleWorkflowDto.isActive;
    workflow.status = toggleWorkflowDto.isActive ? WorkflowStatus.ACTIVE : WorkflowStatus.INACTIVE;

    if (toggleWorkflowDto.reason) {
      workflow.notes = (workflow.notes || '') + `\n${new Date().toISOString()}: ${toggleWorkflowDto.reason}`;
    }

    return await this.workflowRepository.save(workflow);
  }


  async createWorkflowTemplate(createWorkflowTemplateDto: CreateWorkflowTemplateDto, creatorId: string): Promise<Workflow> {
    const template = this.workflowRepository.create({
      ...createWorkflowTemplateDto,
      createdBy: creatorId,
      isTemplate: true,
      isActive: false,
      executionCount: 0,
      successCount: 0,
      failureCount: 0
    });

    return await this.workflowRepository.save(template);
  }

  async getWorkflowStats(): Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    inactiveWorkflows: number;
    templateWorkflows: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    workflowsByType: any[];
    recentWorkflows: Workflow[];
  }> {
    const totalWorkflows = await this.workflowRepository.count();
    const activeWorkflows = await this.workflowRepository.count({ where: { isActive: true } });
    const inactiveWorkflows = await this.workflowRepository.count({ where: { isActive: false } });
    const templateWorkflows = await this.workflowRepository.count({ where: { isTemplate: true } });

    // Підраховуємо загальну статистику виконань
    const totalExecutionsResult = await this.workflowRepository
      .createQueryBuilder('workflow')
      .select('SUM(workflow.executionCount)', 'total')
      .getRawOne();
    const totalExecutions = parseInt(totalExecutionsResult?.total || '0');

    const successfulExecutionsResult = await this.workflowRepository
      .createQueryBuilder('workflow')
      .select('SUM(workflow.successCount)', 'total')
      .getRawOne();
    const successfulExecutions = parseInt(successfulExecutionsResult?.total || '0');

    const failedExecutionsResult = await this.workflowRepository
      .createQueryBuilder('workflow')
      .select('SUM(workflow.failureCount)', 'total')
      .getRawOne();
    const failedExecutions = parseInt(failedExecutionsResult?.total || '0');

    const workflowsByType = await this.workflowRepository
      .createQueryBuilder('workflow')
      .select('workflow.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('workflow.type')
      .getRawMany();

    const recentWorkflows = await this.workflowRepository.find({
      relations: ['creator'],
      order: { lastExecutedAt: 'DESC' },
      take: 10
    });

    return {
      totalWorkflows,
      activeWorkflows,
      inactiveWorkflows,
      templateWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      workflowsByType,
      recentWorkflows
    };
  }

  async getWorkflowHealth(id: string): Promise<{
    status: string;
    lastExecution: Date | null;
    lastError: string | null;
    executionCount: number;
    errorCount: number;
    successRate: number;
  }> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const successRate = workflow.executionCount > 0 
      ? (workflow.successCount / workflow.executionCount) * 100 
      : 0;

    return {
      status: workflow.status,
      lastExecution: workflow.lastExecutedAt || null,
      lastError: workflow.lastErrorMessage || null,
      executionCount: workflow.executionCount,
      errorCount: workflow.failureCount,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  async validateWorkflow(workflowId: string): Promise<{ valid: boolean; errors: string[] }> {
    const workflow = await this.workflowRepository.findOne({ where: { id: workflowId } });
    if (!workflow) {
      return { valid: false, errors: ['Workflow not found'] };
    }

    const errors: string[] = [];

    // Validate trigger configuration
    if (workflow.triggerConfig) {
      try {
        const triggerConfig = typeof workflow.triggerConfig === 'string' ? JSON.parse(workflow.triggerConfig) : workflow.triggerConfig;
        if (typeof triggerConfig !== 'object' || triggerConfig === null) {
          errors.push('Trigger configuration must be a valid object');
        }
      } catch (error) {
        errors.push('Invalid trigger configuration JSON');
      }
    }

    // Validate actions
    try {
      const actions = typeof workflow.actions === 'string' ? JSON.parse(workflow.actions) : workflow.actions;
      if (!Array.isArray(actions) || actions.length === 0) {
        errors.push('Actions must be a non-empty array');
      }
    } catch (error) {
      errors.push('Invalid actions JSON');
    }

    // Validate conditions if present
    if (workflow.conditions) {
      try {
        const conditions = typeof workflow.conditions === 'string' ? JSON.parse(workflow.conditions) : workflow.conditions;
        if (typeof conditions !== 'object' || conditions === null) {
          errors.push('Conditions must be a valid object');
        }
      } catch (error) {
        errors.push('Invalid conditions JSON');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  async duplicateWorkflow(workflowId: string, newName: string, creatorId: string): Promise<Workflow | null> {
    const originalWorkflow = await this.workflowRepository.findOne({ where: { id: workflowId } });
    if (!originalWorkflow) {
      return null;
    }

    const duplicatedWorkflow = this.workflowRepository.create({
      name: newName,
      description: originalWorkflow.description,
      type: originalWorkflow.type,
      triggerType: originalWorkflow.triggerType,
      triggerConfig: originalWorkflow.triggerConfig,
      actions: originalWorkflow.actions,
      conditions: originalWorkflow.conditions,
      tags: originalWorkflow.tags,
      priority: originalWorkflow.priority,
      timeout: originalWorkflow.timeout,
      maxRetries: originalWorkflow.maxRetries,
      errorHandling: originalWorkflow.errorHandling,
      createdBy: creatorId,
      isActive: false,
      isTemplate: false,
      executionCount: 0,
      successCount: 0,
      failureCount: 0
    });

    return await this.workflowRepository.save(duplicatedWorkflow);
  }

  async getAvailableWorkflowTemplates(): Promise<any[]> {
    // This would typically come from a configuration file or external service
    return [
      {
        name: 'Application Received',
        type: 'application',
        triggerType: 'event',
        description: 'Automatically send confirmation email when application is received',
        actions: ['send_email', 'create_task', 'update_record'],
        category: 'applications'
      },
      {
        name: 'Interview Scheduled',
        type: 'interview',
        triggerType: 'event',
        description: 'Send calendar invite and reminder notifications',
        actions: ['send_email', 'create_calendar_event', 'send_notification'],
        category: 'interviews'
      },
      {
        name: 'Payment Completed',
        type: 'payment',
        triggerType: 'event',
        description: 'Send receipt and update subscription status',
        actions: ['send_email', 'update_record', 'send_notification'],
        category: 'payments'
      },
      {
        name: 'Daily Report',
        type: 'reporting',
        triggerType: 'schedule',
        description: 'Generate and send daily activity report',
        actions: ['generate_report', 'send_email'],
        category: 'reporting'
      }
    ];
  }

  // Додаємо методи, які використовуються в контролері
  async getAutomationTemplates(): Promise<any[]> {
    return await this.getAvailableWorkflowTemplates();
  }

  async getWorkflowDetails(workflowId: string): Promise<Workflow | null> {
    return await this.getWorkflowById(workflowId);
  }

  async getWorkflowLogs(workflowId: string, filters?: any): Promise<{ logs: any[], total: number }> {
    // Повертаємо пустий масив, оскільки не зберігаємо логи
    return { logs: [], total: 0 };
  }
}

export const automationService = new AutomationService();
