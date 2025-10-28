import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsUUID, IsDateString, IsInt, Min, Max, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageType, MessageStatus } from '../models/Message';
import { ChatType, ChatStatus } from '../models/Chat';

export class CreateChatDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsArray()
  @IsUUID('4', { each: true })
  participants: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  settings?: any;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participants?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  settings?: any;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsEnum(ChatStatus)
  status?: ChatStatus;
}

export class ChatSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsOptional()
  @IsEnum(ChatStatus)
  status?: ChatStatus;

  @IsOptional()
  @IsUUID()
  participantId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  hasUnreadMessages?: boolean;

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
  sortBy?: string = 'lastMessageAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class SendMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  attachments?: any[];

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsUUID()
  replyToId?: string;

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;
}

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  attachments?: any[];

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;
}

export class MessageSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @IsOptional()
  @IsUUID()
  chatId?: string;

  @IsOptional()
  @IsUUID()
  senderId?: string;

  @IsOptional()
  @IsUUID()
  recipientId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;

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

export class UpdateMessageStatusDto {
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  timestamp?: string;
}


export class UnblockUserDto {
  @IsUUID()
  userId: string;
}

export class BlockUserDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  blockMessages?: boolean = true;

  @IsOptional()
  @IsBoolean()
  blockCalls?: boolean = true;
}


export class ChatParamDto {
  @IsUUID()
  chatId: string;
}

export class MessageParamDto {
  @IsUUID()
  messageId: string;
}

export class MessageStatsDto {
  @IsOptional()
  @IsUUID()
  chatId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}