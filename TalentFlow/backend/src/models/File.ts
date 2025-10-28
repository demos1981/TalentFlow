import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './User';

export enum FileType {
  // Документи
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  TXT = 'txt',
  RTF = 'rtf',
  // Зображення
  IMAGE = 'image',
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  GIF = 'gif',
  WEBP = 'webp',
  SVG = 'svg',
  // Відео
  VIDEO = 'video',
  MP4 = 'mp4',
  AVI = 'avi',
  MOV = 'mov',
  WMV = 'wmv',
  // Аудіо
  AUDIO = 'audio',
  MP3 = 'mp3',
  WAV = 'wav',
  AAC = 'aac',
  // Архіви
  ARCHIVE = 'archive',
  ZIP = 'zip',
  RAR = 'rar',
  TAR = 'tar',
  GZ = 'gz',
  // Інше
  OTHER = 'other'
}

export enum FileCategory {
  // Документи
  RESUME = 'resume',
  PORTFOLIO = 'portfolio',
  CONTRACT = 'contract',
  CERTIFICATE = 'certificate',
  // Медіа
  PROFILE_PHOTO = 'profile_photo',
  COMPANY_LOGO = 'company_logo',
  PROJECT_IMAGE = 'project_image',
  // Системні
  TEMP = 'temp',
  SYSTEM = 'system',
  BACKUP = 'backup',
  // Інше
  OTHER = 'other'
}

export enum FileStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
  DELETED = 'deleted'
}

@Entity('files')
@Index(['uploadedBy', 'isActive'])
@Index(['type', 'isActive'])
@Index(['category', 'isActive'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  fileName: string;

  @Column({ type: 'varchar', length: 500 })
  originalName: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'varchar', length: 500 })
  r2Key: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  r2Url?: string;

  @Column({ type: 'enum', enum: FileType })
  type: FileType;

  @Column({ type: 'enum', enum: FileCategory })
  category: FileCategory;

  @Column({ type: 'enum', enum: FileStatus, default: FileStatus.READY })
  status: FileStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  tags?: string[];

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  folder?: string;

  @Column({ type: 'int', default: 0 })
  downloadCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @ManyToOne(() => User, user => user.files, { onDelete: 'CASCADE' })
  uploadedBy: User;

  @Column({ type: 'uuid' })
  uploadedById: string;

  @CreateDateColumn()
  uploadDate: Date;

  @UpdateDateColumn()
  lastModified: Date;
}
