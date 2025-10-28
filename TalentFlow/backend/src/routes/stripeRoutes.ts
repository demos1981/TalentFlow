import { Router } from 'express';
import { 
  createPaymentIntent, 
  confirmPayment, 
  createSubscription, 
  cancelSubscription, 
  handleWebhook,
  getCustomer,
  getPlans
} from '../controllers/stripeController';

const router = Router();

// Публічні маршрути
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);
router.get('/plans', getPlans);

// Захищені маршрути (потребують авторизації)
router.post('/create-subscription', createSubscription);
router.post('/cancel-subscription', cancelSubscription);
router.get('/customer/:customerId', getCustomer);

// Webhook endpoint (не потребує авторизації, але перевіряє підпис Stripe)
router.post('/webhook', handleWebhook);

export default router;
