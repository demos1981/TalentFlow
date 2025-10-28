import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middleware/auth';
import { validateDto, validateDtoForUpdate, validateParams } from '../middleware/dtoValidation';
import { CreateEventDto, UpdateEventDto, EventSearchDto, EventStatsDto, EventByDateDto, EventByMonthDto, EventByWeekDto, EventByDateRangeDto, MarkEventCompletedDto, CancelEventDto } from '../dto/EventDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// CRUD операції
router.post('/',
  validateDto(CreateEventDto),
  eventController.createEvent
);

router.get('/',
  validateDto(EventSearchDto, true),
  eventController.getAllEvents
);

router.get('/search',
  eventController.searchEvents
);

router.get('/upcoming',
  eventController.getUpcomingEvents
);

router.get('/stats',
  validateDto(EventStatsDto, true),
  eventController.getEventStats
);

// Маршрути для конкретної події
router.get('/:id',
  validateParams(UuidParamDto),
  eventController.getEventById
);

router.put('/:id',
  validateDtoForUpdate(UpdateEventDto), // Спеціальний middleware для оновлення
  validateParams(UuidParamDto),
  eventController.updateEvent
);

router.patch('/:id',
  validateDtoForUpdate(UpdateEventDto), // Спеціальний middleware для оновлення
  validateParams(UuidParamDto),
  eventController.updateEvent
);

router.delete('/:id',
  validateParams(UuidParamDto),
  eventController.deleteEvent
);

// Дії з подіями
router.put('/:id/complete',
  validateDto(MarkEventCompletedDto, true),
  validateParams(UuidParamDto),
  eventController.markEventAsCompleted
);

router.put('/:id/cancel',
  validateDto(CancelEventDto, true),
  validateParams(UuidParamDto),
  eventController.cancelEvent
);

// Маршрути за датами
router.get('/day/:date',
  validateDto(EventByDateDto, true),
  eventController.getEventsByDay
);

router.get('/month/:year/:month',
  validateDto(EventByMonthDto, true),
  eventController.getEventsByMonth
);

router.get('/week/:year/:week',
  validateDto(EventByWeekDto, true),
  eventController.getEventsByWeek
);

router.get('/range',
  validateDto(EventByDateRangeDto, true),
  eventController.getEventsByDateRange
);

export default router;