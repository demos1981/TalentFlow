import { Router } from 'express';
import { fileController, upload } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { UploadFileDto, GetUploadUrlDto, FileSearchDto, FileStatsDto, UpdateFileMetadataDto, FileKeyParamDto } from '../dto/FileDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Публічні маршрути
router.get('/public', 
  validateDto(FileSearchDto, true),
  fileController.getPublicFiles
);

// Захищені маршрути (потребують авторизації)
router.use(authenticateToken);

// Завантаження файлу
router.post('/upload', 
  upload.single('file'),
  validateDto(UploadFileDto),
  fileController.uploadFile
);

// Отримання pre-signed URL для завантаження
router.post('/upload-url',
  validateDto(GetUploadUrlDto),
  fileController.getUploadUrl
);

// Підтвердження завантаження
router.put('/:id/confirm',
  validateDto(UuidParamDto, true),
  fileController.confirmUpload
);

// Отримання всіх файлів користувача
router.get('/my-files',
  validateDto(FileSearchDto, true),
  fileController.getAllFiles
);

// Пошук файлів
router.get('/search',
  fileController.searchFiles
);

// Статистика файлів
router.get('/stats',
  validateDto(FileStatsDto, true),
  fileController.getFileStats
);

// Маршрути для конкретного файлу
router.get('/:id',
  validateDto(UuidParamDto, true),
  fileController.getFileById
);

router.put('/:id',
  validateDto(UpdateFileMetadataDto, true),
  validateDto(UuidParamDto, true),
  fileController.updateFile
);

router.delete('/:id',
  validateDto(UuidParamDto, true),
  fileController.deleteFile
);

// URL для завантаження
router.get('/:id/download',
  validateDto(UuidParamDto, true),
  fileController.getDownloadUrl
);

export default router;