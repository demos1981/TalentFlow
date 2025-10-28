import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsNumber, IsUUID, Min, Max, IsNotEmpty, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { FileType, FileCategory, FileStatus } from '../models/File';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  fileSize: number;

  @IsEnum(FileType)
  type: FileType;

  @IsEnum(FileCategory)
  category: FileCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class GetUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  fileSize: number;

  @IsEnum(FileType)
  type: FileType;

  @IsEnum(FileCategory)
  category: FileCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateFileMetadataDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fileName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class FileSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @IsOptional()
  @IsEnum(FileCategory)
  category?: FileCategory;

  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

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
  sortBy?: string = 'uploadDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class FileStatsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @IsOptional()
  @IsEnum(FileCategory)
  category?: FileCategory;

  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;
}


export class FileKeyParamDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}