import { Router } from 'express';
import { sendContactForm, checkEmailServiceHealth } from '../controllers/contactController';

const router = Router();

/**
 * POST /api/contact
 * Відправка форми "Зв'язатись з нами"
 * 
 * Body:
 * {
 *   "name": "string",
 *   "email": "string", 
 *   "subject": "string",
 *   "message": "string",
 *   "phone": "string" (optional)
 * }
 */
router.post('/', sendContactForm);

/**
 * GET /api/contact/health
 * Перевірка здоров'я email сервісу
 */
router.get('/health', checkEmailServiceHealth);

export default router;
