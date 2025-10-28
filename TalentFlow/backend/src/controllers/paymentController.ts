import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { validateDto } from '../middleware/dtoValidation';
import { CreatePaymentDto, UpdatePaymentDto, PaymentSearchDto, PaymentStatsDto, ProcessPaymentDto, RefundPaymentDto, CancelPaymentDto, CurrencyConversionDto, BulkPaymentActionDto, PaymentParamDto } from '../dto/PaymentDto';

export const paymentController = {
  /**
   * Отримання всіх платежів
   */
  async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(PaymentSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: PaymentSearchDto = req.query as any;
      const result = await paymentService.getAllPayments(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting payments:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payments',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики платежів
   */
  async getPaymentStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(PaymentStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: PaymentStatsDto = req.query as any;
      const stats = await paymentService.getPaymentStats(statsFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting payment stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payment statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання платежу за ID
   */
  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(PaymentParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentById(paymentId, userId);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error getting payment:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payment',
        error: error.message
      });
    }
  },

  /**
   * Створення платежу
   */
  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreatePaymentDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const paymentData: CreatePaymentDto = req.body;
      const payment = await paymentService.createPayment(paymentData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating payment',
        error: error.message
      });
    }
  },

  /**
   * Оновлення платежу
   */
  async updatePayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdatePaymentDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { paymentId } = req.params;
      const updateData: UpdatePaymentDto = req.body;
      const payment = await paymentService.updatePayment(paymentId, updateData, userId);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating payment',
        error: error.message
      });
    }
  },

  /**
   * Видалення платежу
   */
  async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(PaymentParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { paymentId } = req.params;
      const success = await paymentService.deletePayment(paymentId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting payment',
        error: error.message
      });
    }
  },

  /**
   * Обробка платежу
   */
  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ProcessPaymentDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { paymentId } = req.params;
      const processData: ProcessPaymentDto = req.body;
      const payment = await paymentService.processPayment(paymentId, processData, userId);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(400).json({
        success: false,
        message: 'Error processing payment',
        error: error.message
      });
    }
  },

  /**
   * Повернення платежу
   */
  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(RefundPaymentDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { paymentId } = req.params;
      const refundData: RefundPaymentDto = req.body;
      const payment = await paymentService.refundPayment(paymentId, refundData, userId);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error refunding payment:', error);
      res.status(400).json({
        success: false,
        message: 'Error refunding payment',
        error: error.message
      });
    }
  },

  /**
   * Скасування платежу
   */
  async cancelPayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CancelPaymentDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { paymentId } = req.params;
      const cancelData: CancelPaymentDto = req.body;
      const payment = await paymentService.cancelPayment(paymentId, cancelData, userId);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment cancelled successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error cancelling payment:', error);
      res.status(400).json({
        success: false,
        message: 'Error cancelling payment',
        error: error.message
      });
    }
  },

  /**
   * Конвертація валют
   */
  async convertCurrency(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CurrencyConversionDto, false)(req, res, () => {});
      if (validationResult) return;

      const conversionData: CurrencyConversionDto = req.body;
      const result = await paymentService.convertCurrency(conversionData);
      
      res.status(200).json({
        success: true,
        message: 'Currency converted successfully',
        data: result
      });
    } catch (error) {
      console.error('Error converting currency:', error);
      res.status(400).json({
        success: false,
        message: 'Error converting currency',
        error: error.message
      });
    }
  },

  /**
   * Масові дії з платежами
   */
  async bulkAction(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(BulkPaymentActionDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const bulkData: BulkPaymentActionDto = req.body;
      const count = await paymentService.bulkAction(bulkData, userId);
      
      res.status(200).json({
        success: true,
        message: `Bulk action completed successfully. ${count} payments affected.`,
        data: { count }
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      res.status(400).json({
        success: false,
        message: 'Error performing bulk action',
        error: error.message
      });
    }
  }
};