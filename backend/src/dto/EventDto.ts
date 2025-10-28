import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsNumber, IsUUID, IsDateString, Min, Max, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType, EventStatus, EventPriority, RecurrenceType } from '../models/Event';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus = EventStatus.SCHEDULED;

  @IsOptional()
  @IsEnum(EventPriority)
  priority?: EventPriority = EventPriority.MEDIUM;

  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean = false;

  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrenceType?: RecurrenceType = RecurrenceType.NONE;

  @IsOptional()
  @IsObject()
  recurrenceRule?: any;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsObject()
  locationDetails?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    isOnline?: boolean;
    meetingUrl?: string;
    room?: string;
  };

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  attendees?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  externalAttendees?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReminderDto)
  reminders?: ReminderDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;


  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsEnum(EventPriority)
  priority?: EventPriority;

  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrenceType?: RecurrenceType;

  @IsOptional()
  @IsObject()
  recurrenceRule?: any;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsObject()
  locationDetails?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    isOnline?: boolean;
    meetingUrl?: string;
    room?: string;
  };

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  attendees?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  externalAttendees?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReminderDto)
  reminders?: ReminderDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}


export class EventSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsEnum(EventPriority)
  priority?: EventPriority;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'startDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

export class EventStatsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

export class ReminderDto {
  @IsEnum(['email', 'push', 'sms'])
  type: 'email' | 'push' | 'sms';

  @IsNumber()
  @Min(1)
  @Max(10080) // 1 week in minutes
  time: number;

  @IsOptional()
  @IsBoolean()
  sent?: boolean = false;
}


export class EventByDateDto {
  @IsDateString()
  date: string;
}

export class EventByMonthDto {
  @IsNumber()
  @Min(2020)
  @Max(2030)
  @Type(() => Number)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;
}

export class EventByWeekDto {
  @IsNumber()
  @Min(2020)
  @Max(2030)
  @Type(() => Number)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(53)
  @Type(() => Number)
  week: number;
}

export class EventByDateRangeDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class MarkEventCompletedDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage?: number = 100;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelEventDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}