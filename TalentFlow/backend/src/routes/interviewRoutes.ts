import { Router } from 'express';
import { interviewsController } from '../controllers/interviewsController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
  InterviewSearchDto,
  InterviewFeedbackDto,
  UpdateInterviewStatusDto,
  InterviewCalendarDto,
  InterviewStatsDto,
  InterviewParamDto
} from '../dto/InterviewDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Основні CRUD операції
router.get('/',
  validateDto(InterviewSearchDto, true),
  interviewsController.getAllInterviews
);
router.get('/:interviewId',
  validateDto(InterviewParamDto, true),
  interviewsController.getInterviewById
);
router.post('/',
  validateDto(CreateInterviewDto, false),
  interviewsController.createInterview
);
router.put('/:interviewId',
  validateDto(UpdateInterviewDto, false),
  interviewsController.updateInterview
);
router.delete('/:interviewId',
  validateDto(InterviewParamDto, true),
  interviewsController.deleteInterview
);

// Спеціальні операції
router.post('/:interviewId/feedback',
  validateDto(InterviewFeedbackDto, false),
  interviewsController.addInterviewFeedback
);
router.patch('/:interviewId/status',
  validateDto(UpdateInterviewStatusDto, false),
  interviewsController.updateInterviewStatus
);

// Календар та статистика
router.get('/calendar/events',
  validateDto(InterviewCalendarDto, true),
  interviewsController.getInterviewCalendar
);
router.get('/stats/overview',
  validateDto(InterviewStatsDto, true),
  interviewsController.getInterviewStats
);

export default router;
