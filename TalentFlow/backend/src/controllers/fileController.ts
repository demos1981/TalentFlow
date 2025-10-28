import { Request, Response } from 'express';
import { fileService } from '../services/fileService';
import multer from 'multer';
import { UploadFileDto, GetUploadUrlDto, FileSearchDto, FileStatsDto, UpdateFileMetadataDto } from '../dto/FileDto';
import { FileType } from '../models/File';

// Налаштування multer для завантаження файлів
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Дозволені типи файлів
    const allowedTypes = [
      FileType.PDF, FileType.DOC, FileType.DOCX, FileType.TXT, FileType.RTF,
      FileType.JPG, FileType.JPEG, FileType.PNG, FileType.GIF, FileType.WEBP, FileType.SVG,
      FileType.MP4, FileType.AVI, FileType.MOV, FileType.WMV,
      FileType.MP3, FileType.WAV, FileType.AAC,
      FileType.ZIP, FileType.RAR, FileType.TAR, FileType.GZ
    ];

    if (fileService.validateFileType(file.mimetype, allowedTypes)) {
      cb(null, true);
    } else {
      cb(new Error('Непідтримуваний тип файлу') as any, false);
    }
  }
});

export const fileController = {
  /**
   * Завантаження файлу через multer
   */
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      const uploadData: UploadFileDto = req.body;
      const file = await fileService.uploadFile(req.file, uploadData, userId);
      
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: file
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(400).json({
        success: false,
        message: 'Error uploading file',
        error: error.message
      });
    }
  },

  /**
   * Отримання pre-signed URL для завантаження
   */
  async getUploadUrl(req: Request, res: Response): Promise<void> {
    try {

      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const uploadData: GetUploadUrlDto = req.body;
      const result = await fileService.getUploadUrl(uploadData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Upload URL generated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting upload URL:', error);
      res.status(400).json({
        success: false,
        message: 'Error getting upload URL',
        error: error.message
      });
    }
  },

  /**
   * Підтвердження завантаження файлу
   */
  async confirmUpload(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const file = await fileService.confirmUpload(id, userId);
      
      if (!file) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'File upload confirmed successfully',
        data: file
      });
    } catch (error) {
      console.error('Error confirming upload:', error);
      res.status(400).json({
        success: false,
        message: 'Error confirming upload',
        error: error.message
      });
    }
  },

  /**
   * Отримання pre-signed URL для завантаження
   */
  async getDownloadUrl(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const downloadUrl = await fileService.getDownloadUrl(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Download URL generated successfully',
        data: {
          downloadUrl,
          expiresIn: 3600 // 1 hour
        }
      });
    } catch (error) {
      console.error('Error getting download URL:', error);
      res.status(400).json({
        success: false,
        message: 'Error getting download URL',
        error: error.message
      });
    }
  },

  /**
   * Отримання всіх файлів з фільтрами
   */
  async getAllFiles(req: Request, res: Response): Promise<void> {
    try {

      const searchDto: FileSearchDto = req.query as any;
      const userId = (req as any).user?.id;
      
      const result = await fileService.getAllFiles(searchDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'Files retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting files:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting files',
        error: error.message
      });
    }
  },

  /**
   * Отримання файлу за ID
   */
  async getFileById(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      const file = await fileService.getFileById(id, userId);
      
      if (!file) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'File retrieved successfully',
        data: file
      });
    } catch (error) {
      console.error('Error getting file:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting file',
        error: error.message
      });
    }
  },

  /**
   * Оновлення метаданих файлу
   */
  async updateFile(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const updateFileDto: UpdateFileMetadataDto = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      const file = await fileService.updateFile(id, updateFileDto, userId);
      
      if (!file) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'File updated successfully',
        data: file
      });
    } catch (error) {
      console.error('Error updating file:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating file',
        error: error.message
      });
    }
  },

  /**
   * Видалення файлу
   */
  async deleteFile(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      const success = await fileService.deleteFile(id, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting file',
        error: error.message
      });
    }
  },

  /**
   * Отримання публічних файлів
   */
  async getPublicFiles(req: Request, res: Response): Promise<void> {
    try {

      const searchDto: FileSearchDto = req.query as any;
      const result = await fileService.getPublicFiles(searchDto);
      
      res.status(200).json({
        success: true,
        message: 'Public files retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting public files:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting public files',
        error: error.message
      });
    }
  },

  /**
   * Пошук файлів
   */
  async searchFiles(req: Request, res: Response): Promise<void> {
    try {
      const { search, ...filters } = req.query;
      const userId = (req as any).user?.id;
      
      if (!search || typeof search !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search parameter is required'
        });
        return;
      }
      
      const files = await fileService.searchFiles(search, filters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Files search completed successfully',
        data: files
      });
    } catch (error) {
      console.error('Error searching files:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching files',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики файлів
   */
  async getFileStats(req: Request, res: Response): Promise<void> {
    try {

      const statsDto: FileStatsDto = req.query as any;
      const stats = await fileService.getFileStats(statsDto);
      
      res.status(200).json({
        success: true,
        message: 'File statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting file stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting file statistics',
        error: error.message
      });
    }
  }
};