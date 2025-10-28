import { Router } from 'express';
import { jobController } from '../controllers/jobController';
import { authenticateToken } from '../middleware/auth';
import { validateDto, validateQuery, validateParams } from '../middleware/dtoValidation';
import { CreateJobDto, UpdateJobDto, JobSearchDto, JobStatsDto, PublishJobDto, PauseJobDto, CloseJobDto } from '../dto/JobDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();


// Публічні маршрути (не потребують авторизації)
router.get('/search',
  validateDto(JobSearchDto, true),
  jobController.searchJobs
);
router.get('/locations',
  jobController.getAvailableLocations
);
router.get('/types',
  jobController.getJobTypes
);
router.get('/experience-levels',
  jobController.getExperienceLevels
);
router.get('/enums',
  jobController.getAvailableEnums
);
router.get('/',
  validateQuery(JobSearchDto),
  jobController.getJobs
);

// Вакансії створені користувачем (тільки для роботодавців)
router.get('/my-created',
  authenticateToken,
  validateQuery(JobSearchDto),
  jobController.getMyCreatedJobs
);
// Вакансії додані в вибрані (для всіх користувачів)
router.get('/personal',
  authenticateToken,
  validateQuery(JobSearchDto),
  jobController.getPersonalJobs
);

// CRUD операції
router.post('/',
  authenticateToken,
  validateDto(CreateJobDto, false),
  jobController.createJob
);
router.put('/:id',
  authenticateToken,
  validateDto(UpdateJobDto, false),
  jobController.updateJob
);
router.delete('/:id',
  authenticateToken,
  validateDto(UuidParamDto, true),
  jobController.deleteJob
);

// Управління статусом вакансії
router.post('/:id/publish',
  authenticateToken,
  validateDto(PublishJobDto, false),
  jobController.publishJob
);
router.post('/:id/pause',
  authenticateToken,
  validateDto(PauseJobDto, false),
  jobController.pauseJob
);
router.post('/:id/close',
  authenticateToken,
  validateDto(CloseJobDto, false),
  jobController.closeJob
);

// Статистика
router.get('/stats/overview',
  authenticateToken,
  validateDto(JobStatsDto, true),
  jobController.getJobStats
);

// Публічний роут для перегляду конкретної роботи (має бути в кінці, щоб не перехоплювати інші маршрути)
router.get('/:id',
  validateParams(UuidParamDto),
  jobController.getJob
);

export default router;