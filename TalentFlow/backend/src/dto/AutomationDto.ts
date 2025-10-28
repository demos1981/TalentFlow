import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsBoolean, IsUUID, Min, Max } from 'class-validator';
import { WorkflowType, WorkflowStatus, TriggerType } from '../models/Workflow';

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(WorkflowType)
  type: WorkflowType;

  @IsEnum(WorkflowStatus)
  status: WorkflowStatus;

  @IsEnum(TriggerType)
  triggerType: TriggerType;

  @IsOptional()
  triggerConfig?: any;

  @IsArray()
  actions: any[];

  @IsOptional()
  conditions?: any;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsNumber()
  timeout?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  maxRetries?: number;

  @IsOptional()
  errorHandling?: any;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(WorkflowType)
  type?: WorkflowType;

  @IsOptional()
  @IsEnum(WorkflowStatus)
  status?: WorkflowStatus;

  @IsOptional()
  @IsEnum(TriggerType)
  triggerType?: TriggerType;

  @IsOptional()
  triggerConfig?: any;

  @IsOptional()
  @IsArray()
  actions?: any[];

  @IsOptional()
  conditions?: any;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsNumber()
  timeout?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  maxRetries?: number;

  @IsOptional()
  errorHandling?: any;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class WorkflowSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(WorkflowType)
  type?: WorkflowType;

  @IsOptional()
  @IsEnum(WorkflowStatus)
  status?: WorkflowStatus;

  @IsOptional()
  @IsEnum(TriggerType)
  triggerType?: TriggerType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class RunWorkflowDto {
  @IsUUID()
  workflowId: string;

  @IsOptional()
  inputData?: any;

  @IsOptional()
  @IsString()
  requestId?: string;
}

export class ToggleWorkflowDto {
  @IsUUID()
  workflowId: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateWorkflowTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(WorkflowType)
  type: WorkflowType;

  @IsEnum(TriggerType)
  triggerType: TriggerType;

  @IsOptional()
  triggerConfig?: any;

  @IsArray()
  actions: any[];

  @IsOptional()
  conditions?: any;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsNumber()
  timeout?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  maxRetries?: number;

  @IsOptional()
  errorHandling?: any;
}