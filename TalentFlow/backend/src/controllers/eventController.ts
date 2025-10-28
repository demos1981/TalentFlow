import { Request, Response } from 'express';
import { eventService } from '../services/eventService';
import {
  CreateEventDto,
  UpdateEventDto,
  EventSearchDto,
  EventStatsDto,
  MarkEventCompletedDto,
  CancelEventDto
} from '../dto/EventDto';

export const eventController = {
  /**
   * Отримання всіх подій з фільтрами
   */
  async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const searchDto: EventSearchDto = req.query as any;
      const userId = (req as any).user?.id;
      
      const result = await eventService.getAllEvents(searchDto, userId);
      
      res.status(200).json({
        success: true,
        message: 'Events retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting events',
        error: error.message
      });
    }
  },

  /**
   * Створення нової події
   */
  async createEvent(req: Request, res: Response): Promise<void> {
    try {

      const createEventDto: CreateEventDto = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const event = await eventService.createEvent(createEventDto, userId);
      
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating event',
        error: error.message
      });
    }
  },

  /**
   * Отримання події за ID
   */
  async getEventById(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      const event = await eventService.getEventById(id, userId);
      
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Event retrieved successfully',
        data: event
      });
    } catch (error) {
      console.error('Error getting event:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting event',
        error: error.message
      });
    }
  },

  /**
   * Оновлення події
   */
  async updateEvent(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const updateEventDto: UpdateEventDto = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      const event = await eventService.updateEvent(id, updateEventDto, userId);
      
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating event',
        error: error.message
      });
    }
  },

  /**
   * Видалення події
   */
  async deleteEvent(req: Request, res: Response): Promise<void> {
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
      
      const success = await eventService.deleteEvent(id, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Event not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting event',
        error: error.message
      });
    }
  },

  /**
   * Отримання подій за місяць
   */
  async getEventsByMonth(req: Request, res: Response): Promise<void> {
    try {

      const { year, month } = req.params;
      const userId = (req as any).user?.id;
      
      const events = await eventService.getEventsByMonth(Number(year), Number(month), userId);
      
      res.status(200).json({
        success: true,
        message: 'Events by month retrieved successfully',
        data: events
      });
    } catch (error) {
      console.error('Error getting events by month:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting events by month',
        error: error.message
      });
    }
  },

  /**
   * Отримання подій за тиждень
   */
  async getEventsByWeek(req: Request, res: Response): Promise<void> {
    try {

      const { year, week } = req.params;
      const userId = (req as any).user?.id;
      
      const events = await eventService.getEventsByWeek(Number(year), Number(week), userId);
      
      res.status(200).json({
        success: true,
        message: 'Events by week retrieved successfully',
        data: events
      });
    } catch (error) {
      console.error('Error getting events by week:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting events by week',
        error: error.message
      });
    }
  },

  /**
   * Отримання подій за день
   */
  async getEventsByDay(req: Request, res: Response): Promise<void> {
    try {

      const { date } = req.params;
      const userId = (req as any).user?.id;
      
      const events = await eventService.getEventsByDay(date, userId);
      
      res.status(200).json({
        success: true,
        message: 'Events by day retrieved successfully',
        data: events
      });
    } catch (error) {
      console.error('Error getting events by day:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting events by day',
        error: error.message
      });
    }
  },

  /**
   * Отримання подій за період
   */
  async getEventsByDateRange(req: Request, res: Response): Promise<void> {
    try {

      const { startDate, endDate, ...filters } = req.query;
      const userId = (req as any).user?.id;
      
      const events = await eventService.getEventsByDateRange(
        startDate as string, 
        endDate as string, 
        filters,
        userId
      );
      
      res.status(200).json({
        success: true,
        message: 'Events by date range retrieved successfully',
        data: events
      });
    } catch (error) {
      console.error('Error getting events by date range:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting events by date range',
        error: error.message
      });
    }
  },

  /**
   * Отримання майбутніх подій
   */
  async getUpcomingEvents(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;
      const userId = (req as any).user?.id;
      
      const events = await eventService.getUpcomingEvents(Number(limit), userId);
      
      res.status(200).json({
        success: true,
        message: 'Upcoming events retrieved successfully',
        data: events
      });
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting upcoming events',
        error: error.message
      });
    }
  },

  /**
   * Позначення події як завершеної
   */
  async markEventAsCompleted(req: Request, res: Response): Promise<void> {
    try {

      const { id } = req.params;
      const markCompletedDto: MarkEventCompletedDto = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      const event = await eventService.markEventAsCompleted(id, markCompletedDto, userId);
      
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Event marked as completed successfully',
        data: event
      });
    } catch (error) {
      console.error('Error marking event as completed:', error);
      res.status(400).json({
        success: false,
        message: 'Error marking event as completed',
        error: error.message
      });
    }
  },

  /**
   * Скасування події
   */
  async cancelEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cancelEventDto: CancelEventDto = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      const event = await eventService.cancelEvent(id, cancelEventDto, userId);
      
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Event cancelled successfully',
        data: event
      });
    } catch (error) {
      console.error('Error cancelling event:', error);
      res.status(400).json({
        success: false,
        message: 'Error cancelling event',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики подій
   */
  async getEventStats(req: Request, res: Response): Promise<void> {
    try {

      const statsDto: EventStatsDto = req.query as any;
      const stats = await eventService.getEventStats(statsDto);
      
      res.status(200).json({
        success: true,
        message: 'Event statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting event stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting event statistics',
        error: error.message
      });
    }
  },

  /**
   * Пошук подій
   */
  async searchEvents(req: Request, res: Response): Promise<void> {
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
      
      const events = await eventService.searchEvents(search, filters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Events search completed successfully',
        data: events
      });
    } catch (error) {
      console.error('Error searching events:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching events',
        error: error.message
      });
    }
  }
};