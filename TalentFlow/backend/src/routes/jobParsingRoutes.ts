import { Router } from 'express';
import { jobParsingController } from '../controllers/jobParsingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/job-parsing/parse:
 *   post:
 *     summary: Парсинг вакансії з зовнішнього сайту
 *     tags: [Job Parsing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL вакансії для парсингу
 *                 example: "https://www.linkedin.com/jobs/view/1234567890"
 *     responses:
 *       200:
 *         description: Вакансію успішно спарсено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     location:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     salaryMin:
 *                       type: number
 *                     salaryMax:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     type:
 *                       type: string
 *                     experienceLevel:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     sourceUrl:
 *                       type: string
 *                     sourcePlatform:
 *                       type: string
 *                 platform:
 *                   type: string
 *       400:
 *         description: Помилка валідації або парсингу
 *       401:
 *         description: Не авторизовано
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.post('/parse', authenticateToken, jobParsingController.parseJobFromUrl);

/**
 * @swagger
 * /api/job-parsing/platforms:
 *   get:
 *     summary: Отримати список підтримуваних платформ
 *     tags: [Job Parsing]
 *     responses:
 *       200:
 *         description: Список підтримуваних платформ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       domain:
 *                         type: string
 *                       description:
 *                         type: string
 *                       icon:
 *                         type: string
 */
router.get('/platforms', jobParsingController.getSupportedPlatforms);

/**
 * @swagger
 * /api/job-parsing/validate-url:
 *   get:
 *     summary: Перевірити валідність URL для парсингу
 *     tags: [Job Parsing]
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: uri
 *         description: URL для перевірки
 *     responses:
 *       200:
 *         description: Результат валідації URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                     platform:
 *                       type: string
 *                     supported:
 *                       type: boolean
 *       400:
 *         description: Невірний URL
 */
router.get('/validate-url', jobParsingController.validateUrl);

export default router;
