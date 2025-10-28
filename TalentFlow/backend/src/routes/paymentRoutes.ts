import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { CreatePaymentDto, UpdatePaymentDto, PaymentSearchDto, PaymentGeneralStatsDto, PaymentStatsDto, ProcessPaymentDto, RefundPaymentDto, CancelPaymentDto, CurrencyConversionDto, BulkPaymentActionDto, PaymentParamDto } from '../dto/PaymentDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Отримання платежів
router.get('/',
  validateDto(PaymentSearchDto, true),
  paymentController.getAllPayments
);

// Отримання статистики платежів
router.get('/stats',
  validateDto(PaymentStatsDto, true),
  paymentController.getPaymentStats
);

// Конвертація валют
router.post('/convert-currency',
  validateDto(CurrencyConversionDto, false),
  paymentController.convertCurrency
);

// Масові дії з платежами
router.post('/bulk-action',
  validateDto(BulkPaymentActionDto, false),
  paymentController.bulkAction
);

// Створення платежу
router.post('/',
  validateDto(CreatePaymentDto, false),
  paymentController.createPayment
);

// Отримання конкретного платежу
router.get('/:paymentId',
  validateDto(PaymentParamDto, true),
  paymentController.getPaymentById
);

// Оновлення платежу
router.put('/:paymentId',
  validateDto(UpdatePaymentDto, false),
  paymentController.updatePayment
);

// Видалення платежу
router.delete('/:paymentId',
  validateDto(PaymentParamDto, true),
  paymentController.deletePayment
);

// Обробка платежу
router.patch('/:paymentId/process',
  validateDto(ProcessPaymentDto, false),
  paymentController.processPayment
);

// Повернення платежу
router.patch('/:paymentId/refund',
  validateDto(RefundPaymentDto, false),
  paymentController.refundPayment
);

// Скасування платежу
router.patch('/:paymentId/cancel',
  validateDto(CancelPaymentDto, false),
  paymentController.cancelPayment
);

export default router;