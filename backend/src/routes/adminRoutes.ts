import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';

const router = Router();

// Всі адмін роути вимагають аутентифікації та адмін ролі
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Статистика платформи
router.get('/stats', AdminController.getStats);

// Управління користувачами
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserById);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);
router.patch('/users/:id/activate', AdminController.activateUser);
router.patch('/users/:id/deactivate', AdminController.deactivateUser);

// Управління компаніями
router.get('/companies', AdminController.getCompanies);
router.get('/companies/:id', AdminController.getCompanyById);
router.put('/companies/:id', AdminController.updateCompany);
router.delete('/companies/:id', AdminController.deleteCompany);

// Управління вакансіями
router.get('/jobs', AdminController.getJobs);
router.get('/jobs/:id', AdminController.getJobById);
router.put('/jobs/:id', AdminController.updateJob);
router.delete('/jobs/:id', AdminController.deleteJob);

// Управління заявками
router.get('/applications', AdminController.getApplications);
router.get('/applications/:id', AdminController.getApplicationById);
router.put('/applications/:id', AdminController.updateApplication);
router.delete('/applications/:id', AdminController.deleteApplication);

// Системні логи та активність
router.get('/logs', AdminController.getSystemLogs);
router.get('/activity', AdminController.getActivityLogs);

export default router;