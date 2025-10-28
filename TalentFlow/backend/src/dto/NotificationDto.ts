import { IsString, IsOptional, IsEnum, IsBoolean, IsUUID, IsDateString, IsInt, Min, Max, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType, NotificationPriority } from '../models/Notification';

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WEBHOOK = 'webhook'
}

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsOptional()
  @IsObject()
  metadata?: {
    relatedId?: string;
    relatedType?: string;
    actionUrl?: string;
    senderId?: string;
    [key: string]: any;
  };

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  sendSms?: boolean;

  @IsOptional()
  @IsBoolean()
  sendPush?: boolean;

  @IsOptional()
  @IsBoolean()
  isPersistent?: boolean;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsOptional()
  @IsObject()
  metadata?: {
    relatedId?: string;
    relatedType?: string;
    actionUrl?: string;
    senderId?: string;
    [key: string]: any;
  };

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  sendSms?: boolean;

  @IsOptional()
  @IsBoolean()
  sendPush?: boolean;

  @IsOptional()
  @IsBoolean()
  isPersistent?: boolean;
}

export class NotificationSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  isPersistent?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class NotificationStatsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class MarkAsReadDto {
  @IsOptional()
  @IsDateString()
  readAt?: string;
}

export class MarkAllAsReadDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  notificationIds?: string[];

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;
}

export class CreateTestNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsOptional()
  @IsObject()
  metadata?: {
    relatedId?: string;
    relatedType?: string;
    actionUrl?: string;
    senderId?: string;
    [key: string]: any;
  };

  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;
}


export class NotificationParamDto {
  @IsUUID()
  notificationId: string;
}

export class BulkActionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  notificationIds: string[];

  @IsEnum(['mark_read', 'mark_unread', 'archive', 'delete'])
  action: 'mark_read' | 'mark_unread' | 'archive' | 'delete';
}