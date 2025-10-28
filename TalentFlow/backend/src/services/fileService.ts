import { AppDataSource } from '../config/database';
import { File, FileType, FileCategory, FileStatus } from '../models/File';
import { User } from '../models/User';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import {
  UploadFileDto,
  GetUploadUrlDto,
  FileSearchDto,
  FileStatsDto,
  UpdateFileMetadataDto
} from '../dto/FileDto';

// Cloudflare R2 configuration
const r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
      // Виправляємо SSL проблеми
      tls: true
    });

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export class FileService {

  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  private getFileRepository() {
    return AppDataSource.getRepository(File);
  }

  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  /**
   * Видалення старих аватарок користувача
   */
  private async deleteOldUserAvatars(userId: string): Promise<void> {
    try {
      // Знаходимо всі старі аватарки користувача
      const oldAvatars = await this.getFileRepository().find({
        where: {
          uploadedById: userId,
          category: FileCategory.PROFILE_PHOTO,
          isActive: true
        }
      });


      // Видаляємо кожен старий файл
      for (const oldAvatar of oldAvatars) {
        try {
          // Видаляємо з R2 storage
          const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: oldAvatar.r2Key
          });
          await r2Client.send(deleteCommand);

          // Видаляємо запис з бази даних
          await this.getFileRepository().remove(oldAvatar);
        } catch (error) {
          console.error(`Error deleting old avatar ${oldAvatar.id}:`, error);
          // Продовжуємо навіть якщо один файл не вдалося видалити
        }
      }
    } catch (error) {
      console.error('Error deleting old user avatars:', error);
      // Не кидаємо помилку, щоб не блокувати завантаження нового файлу
    }
  }

  /**
   * Завантаження файлу через multer
   */
  async uploadFile(file: Express.Multer.File, uploadData: UploadFileDto, userId: string): Promise<File> {
    try {
      // Якщо це аватарка, видаляємо старі аватарки користувача
      if (uploadData.category === 'profile_photo') {
        await this.deleteOldUserAvatars(userId);
      }

      const fileId = uuidv4();
      const fileKey = this.generateFileKey(uploadData.category, uploadData.folder, fileId, file.originalname);
      
      // Завантаження файлу в R2
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          category: uploadData.category,
          type: uploadData.type,
          fileId: fileId
        }
      });

      await r2Client.send(uploadCommand);

      // Створення запису в базі даних
      const fileRecord = this.getFileRepository().create({
        fileName: uploadData.fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        r2Key: fileKey,
        r2Url: uploadData.isPublic || uploadData.category === 'profile_photo' ? `${PUBLIC_URL}/${fileKey}` : undefined,
        type: uploadData.type,
        category: uploadData.category,
        status: FileStatus.READY,
        description: uploadData.description,
        tags: uploadData.tags || [],
        isPublic: uploadData.isPublic || false,
        folder: uploadData.folder,
        metadata: uploadData.metadata,
        uploadedById: userId,
        isActive: true
      });

      return await this.getFileRepository().save(fileRecord);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Отримання pre-signed URL для завантаження
   */
  async getUploadUrl(uploadData: GetUploadUrlDto, userId: string): Promise<{
    uploadUrl: string;
    fileId: string;
    key: string;
    expiresIn: number;
  }> {
    try {
      const fileId = uuidv4();
      const fileKey = this.generateFileKey(uploadData.category, uploadData.folder, fileId, uploadData.fileName);
      
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: uploadData.mimeType,
        Metadata: {
          originalName: uploadData.fileName,
          uploadedBy: userId,
          category: uploadData.category,
          type: uploadData.type,
          fileId: fileId
        }
      });

      const uploadUrl = await getSignedUrl(r2Client, uploadCommand, { expiresIn: 3600 }); // 1 hour

      // Створення запису в базі даних
      const fileRecord = this.getFileRepository().create({
        fileName: uploadData.fileName,
        originalName: uploadData.fileName,
        mimeType: uploadData.mimeType,
        fileSize: uploadData.fileSize,
        r2Key: fileKey,
        r2Url: uploadData.isPublic || uploadData.category === 'profile_photo' ? `${PUBLIC_URL}/${fileKey}` : undefined,
        type: uploadData.type,
        category: uploadData.category,
        status: FileStatus.UPLOADING,
        description: uploadData.description,
        tags: uploadData.tags || [],
        isPublic: uploadData.isPublic || false,
        folder: uploadData.folder,
        metadata: uploadData.metadata,
        uploadedById: userId,
        isActive: true
      });

      await this.getFileRepository().save(fileRecord);
    
    return {
      uploadUrl,
        fileId,
        key: fileKey,
        expiresIn: 3600
      };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw new Error(`Failed to get upload URL: ${error.message}`);
    }
  }

  /**
   * Підтвердження завантаження файлу
   */
  async confirmUpload(fileId: string, userId: string): Promise<File | null> {
    try {
      const file = await this.getFileRepository().findOne({
        where: { id: fileId, uploadedById: userId, isActive: true }
      });

      if (!file) {
        return null;
      }

      file.status = FileStatus.READY;
      file.lastModified = new Date();

      return await this.getFileRepository().save(file);
    } catch (error) {
      console.error('Error confirming upload:', error);
      throw new Error(`Failed to confirm upload: ${error.message}`);
    }
  }

  /**
   * Отримання pre-signed URL для завантаження
   */
  async getDownloadUrl(fileId: string, userId: string): Promise<string> {
    try {
      const file = await this.getFileRepository().findOne({
        where: { id: fileId, isActive: true }
      });
      
      if (!file) {
        throw new Error('Файл не знайдено');
      }

      // Перевіряємо права доступу
      if (!file.isPublic && file.uploadedById !== userId) {
        throw new Error('Недостатньо прав для доступу до файлу');
      }

      const downloadCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: file.r2Key
      });

      const downloadUrl = await getSignedUrl(r2Client, downloadCommand, { expiresIn: 3600 }); // 1 hour

      // Збільшуємо лічильник завантажень
      file.downloadCount++;
      file.lastModified = new Date();
      await this.getFileRepository().save(file);

      return downloadUrl;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error(`Failed to get download URL: ${error.message}`);
    }
  }

  /**
   * Видалення файлу
   */
  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    try {
      const file = await this.getFileRepository().findOne({
        where: { id: fileId, uploadedById: userId, isActive: true }
      });
      
      if (!file) {
        return false;
      }

      // Видалення з R2
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: file.r2Key
        });

        await r2Client.send(deleteCommand);
      } catch (r2Error) {
        console.error('Error deleting file from R2:', r2Error);
        // Продовжуємо видалення з бази даних навіть якщо R2 видалення не вдалося
      }
      
      // Soft delete з бази даних
      file.isActive = false;
      file.status = FileStatus.DELETED;
      file.lastModified = new Date();
      await this.getFileRepository().save(file);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Отримання всіх файлів з фільтрами
   */
  async getAllFiles(
    searchDto: FileSearchDto,
    userId?: string
  ): Promise<{
    files: File[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryBuilder = this.getFileRepository()
        .createQueryBuilder('file')
        .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
        .where('file.isActive = :isActive', { isActive: true });

      // Фільтр по користувачу
      if (userId) {
        queryBuilder.andWhere('file.uploadedById = :userId', { userId });
      }

      // Пошук по тексту
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(file.fileName ILIKE :search OR file.description ILIKE :search OR file.originalName ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      // Фільтри
      if (searchDto.type) {
        queryBuilder.andWhere('file.type = :type', { type: searchDto.type });
      }

      if (searchDto.category) {
        queryBuilder.andWhere('file.category = :category', { category: searchDto.category });
      }

      if (searchDto.status) {
        queryBuilder.andWhere('file.status = :status', { status: searchDto.status });
      }

      if (searchDto.folder) {
        queryBuilder.andWhere('file.folder = :folder', { folder: searchDto.folder });
      }

      if (searchDto.isPublic !== undefined) {
        queryBuilder.andWhere('file.isPublic = :isPublic', { isPublic: searchDto.isPublic });
      }

      if (searchDto.tags && searchDto.tags.length > 0) {
        queryBuilder.andWhere('file.tags && :tags', { tags: searchDto.tags });
      }

      // Сортування
      const sortBy = searchDto.sortBy || 'uploadDate';
      const sortOrder = searchDto.sortOrder || 'DESC';
      queryBuilder.orderBy(`file.${sortBy}`, sortOrder);

      // Пагінація
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const offset = (page - 1) * limit;

      queryBuilder.skip(offset).take(limit);

      const [files, total] = await queryBuilder.getManyAndCount();

      return {
        files,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting all files:', error);
      throw new Error(`Failed to get files: ${error.message}`);
    }
  }

  /**
   * Отримання файлу за ID
   */
  async getFileById(id: string, userId?: string): Promise<File | null> {
    try {
      const whereCondition: any = { id, isActive: true };
      
      if (userId) {
        whereCondition.uploadedById = userId;
      }

      return await this.getFileRepository().findOne({
        where: whereCondition,
        relations: ['uploadedBy']
      });
    } catch (error) {
      console.error('Error getting file by ID:', error);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  /**
   * Оновлення метаданих файлу
   */
  async updateFile(id: string, updateFileDto: UpdateFileMetadataDto, userId: string): Promise<File | null> {
    try {
      const file = await this.getFileRepository().findOne({
        where: { id, uploadedById: userId, isActive: true }
      });

      if (!file) {
        return null;
      }

      Object.assign(file, updateFileDto);
      file.lastModified = new Date();

      return await this.getFileRepository().save(file);
    } catch (error) {
      console.error('Error updating file:', error);
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  /**
   * Отримання публічних файлів
   */
  async getPublicFiles(searchDto: FileSearchDto): Promise<{
    files: File[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryBuilder = this.getFileRepository()
        .createQueryBuilder('file')
        .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
        .where('file.isActive = :isActive', { isActive: true })
        .andWhere('file.isPublic = :isPublic', { isPublic: true })
        .andWhere('file.status = :status', { status: FileStatus.READY });

      // Пошук по тексту
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(file.fileName ILIKE :search OR file.description ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      // Фільтри
      if (searchDto.type) {
        queryBuilder.andWhere('file.type = :type', { type: searchDto.type });
      }

      if (searchDto.category) {
        queryBuilder.andWhere('file.category = :category', { category: searchDto.category });
      }

      if (searchDto.tags && searchDto.tags.length > 0) {
        queryBuilder.andWhere('file.tags && :tags', { tags: searchDto.tags });
      }

      // Сортування
      const sortBy = searchDto.sortBy || 'uploadDate';
      const sortOrder = searchDto.sortOrder || 'DESC';
      queryBuilder.orderBy(`file.${sortBy}`, sortOrder);

      // Пагінація
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const offset = (page - 1) * limit;

      queryBuilder.skip(offset).take(limit);

      const [files, total] = await queryBuilder.getManyAndCount();

      return {
        files,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting public files:', error);
      throw new Error(`Failed to get public files: ${error.message}`);
    }
  }

  /**
   * Пошук файлів
   */
  async searchFiles(search: string, filters: any = {}, userId?: string): Promise<File[]> {
    try {
      const queryBuilder = this.getFileRepository()
        .createQueryBuilder('file')
        .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
        .where('file.isActive = :isActive', { isActive: true })
        .andWhere(
          '(file.fileName ILIKE :search OR file.description ILIKE :search OR file.originalName ILIKE :search)',
          { search: `%${search}%` }
        );

      if (userId) {
        queryBuilder.andWhere('file.uploadedById = :userId', { userId });
      }

      // Додаткові фільтри
      if (filters.type) {
        queryBuilder.andWhere('file.type = :type', { type: filters.type });
      }

      if (filters.category) {
        queryBuilder.andWhere('file.category = :category', { category: filters.category });
      }

      if (filters.status) {
        queryBuilder.andWhere('file.status = :status', { status: filters.status });
      }

      return await queryBuilder
        .orderBy('file.uploadDate', 'DESC')
        .limit(50)
        .getMany();
    } catch (error) {
      console.error('Error searching files:', error);
      throw new Error(`Failed to search files: ${error.message}`);
    }
  }

  /**
   * Отримання статистики файлів
   */
  async getFileStats(statsDto: FileStatsDto): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Array<{ type: string; count: number; size: number }>;
    filesByCategory: Array<{ category: string; count: number; size: number }>;
    filesByStatus: Array<{ status: string; count: number; size: number }>;
    recentUploads: number;
  }> {
    try {
      const queryBuilder = this.getFileRepository()
        .createQueryBuilder('file')
        .where('file.isActive = :isActive', { isActive: true });

      if (statsDto.userId) {
        queryBuilder.andWhere('file.uploadedById = :userId', { userId: statsDto.userId });
      }

      if (statsDto.type) {
        queryBuilder.andWhere('file.type = :type', { type: statsDto.type });
      }

      if (statsDto.category) {
        queryBuilder.andWhere('file.category = :category', { category: statsDto.category });
      }

      if (statsDto.status) {
        queryBuilder.andWhere('file.status = :status', { status: statsDto.status });
      }

      const files = await queryBuilder.getMany();

      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);

      // Статистика по типах
      const filesByType = Object.values(FileType).map(type => ({
        type,
        count: files.filter(file => file.type === type).length,
        size: files.filter(file => file.type === type).reduce((sum, file) => sum + file.fileSize, 0)
      })).filter(item => item.count > 0);

      // Статистика по категоріях
      const filesByCategory = Object.values(FileCategory).map(category => ({
        category,
        count: files.filter(file => file.category === category).length,
        size: files.filter(file => file.category === category).reduce((sum, file) => sum + file.fileSize, 0)
      })).filter(item => item.count > 0);

      // Статистика по статусах
      const filesByStatus = Object.values(FileStatus).map(status => ({
        status,
        count: files.filter(file => file.status === status).length,
        size: files.filter(file => file.status === status).reduce((sum, file) => sum + file.fileSize, 0)
      })).filter(item => item.count > 0);

      // Недавні завантаження (останні 7 днів)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUploads = files.filter(f => f.uploadDate > weekAgo).length;

      return {
        totalFiles,
        totalSize,
        filesByType,
        filesByCategory,
        filesByStatus,
        recentUploads
      };
    } catch (error) {
      console.error('Error getting file stats:', error);
      throw new Error(`Failed to get file stats: ${error.message}`);
    }
  }

  /**
   * Генерація ключа файлу
   */
  private generateFileKey(category: FileCategory, folder: string | undefined, fileId: string, fileName: string): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const folderPath = folder ? `${folder}/` : '';
    const extension = fileName.split('.').pop();
    return `${category}/${folderPath}${timestamp}/${fileId}.${extension}`;
  }

  /**
   * Валідація типу файлу
   */
  validateFileType(mimeType: string, allowedTypes: FileType[]): boolean {
    const mimeTypeMap: { [key: string]: FileType } = {
      'application/pdf': FileType.PDF,
      'application/msword': FileType.DOC,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileType.DOCX,
      'text/plain': FileType.TXT,
      'text/rtf': FileType.RTF,
      'image/jpeg': FileType.JPEG,
      'image/jpg': FileType.JPG,
      'image/png': FileType.PNG,
      'image/gif': FileType.GIF,
      'image/webp': FileType.WEBP,
      'image/svg+xml': FileType.SVG,
      'video/mp4': FileType.MP4,
      'video/avi': FileType.AVI,
      'video/quicktime': FileType.MOV,
      'video/x-ms-wmv': FileType.WMV,
      'audio/mpeg': FileType.MP3,
      'audio/wav': FileType.WAV,
      'audio/aac': FileType.AAC,
      'application/zip': FileType.ZIP,
      'application/x-rar-compressed': FileType.RAR,
      'application/x-tar': FileType.TAR,
      'application/gzip': FileType.GZ
    };

    const fileType = mimeTypeMap[mimeType];
    return fileType ? allowedTypes.includes(fileType) : false;
  }
}

export const fileService = new FileService();