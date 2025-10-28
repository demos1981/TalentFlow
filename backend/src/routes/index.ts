import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import jobRoutes from './jobRoutes';
import applicationRoutes from './applicationRoutes';
import interviewRoutes from './interviewRoutes';
import candidateRoutes from './candidateRoutes';
import assessmentRoutes from './assessmentRoutes';
import paymentRoutes from './paymentRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import dashboardRoutes from './dashboardRoutes';
import analyticsRoutes from './analyticsRoutes';
import adminRoutes from './adminRoutes';
import healthRoutes from './healthRoutes';
import statsRoutes from './statsRoutes';
import searchRoutes from './searchRoutes';
import fileRoutes from './fileRoutes';
import notificationRoutes from './notificationRoutes';
import messageRoutes from './messageRoutes';
import reportRoutes from './reportRoutes';
import webhookRoutes from './webhookRoutes';
import settingsRoutes from './settingsRoutes';
import helpRoutes from './helpRoutes';
import automationRoutes from './automationRoutes';
import performanceRoutes from './performanceRoutes';
import eventRoutes from './eventRoutes';
import aiMatchingRoutes from './aiMatchingRoutes';
import optimizedAiMatchingRoutes from './optimizedAiMatchingRoutes';
import companyUserRoutes from './companyUserRoutes';
import featuredJobPackageRoutes from './featuredJobPackageRoutes';
import jobParsingRoutes from './jobParsingRoutes';
import contactRoutes from './contactRoutes';
import stripeRoutes from './stripeRoutes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/interviews', interviewRoutes);
router.use('/candidates', candidateRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);
router.use('/stats', statsRoutes);
router.use('/search', searchRoutes);
router.use('/files', fileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/reports', reportRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/settings', settingsRoutes);
router.use('/help', helpRoutes);
router.use('/automation', automationRoutes);
router.use('/performance', performanceRoutes);
router.use('/events', eventRoutes);
router.use('/ai-matching', aiMatchingRoutes);
router.use('/optimized-ai-matching', optimizedAiMatchingRoutes);
router.use('/company-users', companyUserRoutes);
router.use('/featured-packages', featuredJobPackageRoutes);
router.use('/job-parsing', jobParsingRoutes);
router.use('/contact', contactRoutes);
router.use('/stripe', stripeRoutes);

// Default API endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TalentMatch Pro API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      users: '/users',
      companies: '/companies',
      jobs: '/jobs',
      applications: '/applications',
      interviews: '/interviews',
      candidates: '/candidates',
      assessments: '/assessments',
      payments: '/payments',
      subscriptions: '/subscriptions',
      dashboard: '/dashboard',
      analytics: '/analytics',
      admin: '/admin',
      health: '/health',
      stats: '/stats',
      search: '/search',
      files: '/files',
      notifications: '/notifications',
      messages: '/messages',
      reports: '/reports',
      webhooks: '/webhooks',
      settings: '/settings',
      help: '/help',
      integrations: '/integrations',
      automation: '/automation',
      performance: '/performance',
      events: '/events',
      aiMatching: '/ai-matching',
      jobParsing: '/job-parsing',
      contact: '/contact',
      stripe: '/stripe'
    }
  });
});

export default router;
