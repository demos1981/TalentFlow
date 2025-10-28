import { Request, Response } from 'express';
import { StripeService } from '../services/stripeService';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// Створення Payment Intent
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId, userId, customerEmail } = req.body;

    if (!planId || !userId) {
      res.status(400).json({
        success: false,
        message: 'Plan ID and User ID are required'
      });
      return;
    }

    const result = await StripeService.createPaymentIntent(planId, userId, customerEmail);

    res.json({
      success: true,
      clientSecret: result.clientSecret,
      customerId: result.customerId,
      paymentIntentId: result.paymentIntentId
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent'
    });
  }
};

// Підтвердження платежу
export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      res.status(400).json({
        success: false,
        message: 'Payment Intent ID is required'
      });
      return;
    }

    const result = await StripeService.confirmPayment(paymentIntentId);

    res.json({
      success: true,
      paymentConfirmed: result.success,
      planId: result.planId,
      userId: result.userId,
      amount: result.amount
    });
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm payment'
    });
  }
};

// Створення підписки
export const createSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, planId } = req.body;

    if (!customerId || !planId) {
      res.status(400).json({
        success: false,
        message: 'Customer ID and Plan ID are required'
      });
      return;
    }

    const subscription = await StripeService.createSubscription(customerId, planId);

    res.json({
      success: true,
      subscription: subscription
    });
  } catch (error: any) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create subscription'
    });
  }
};

// Відміна підписки
export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      res.status(400).json({
        success: false,
        message: 'Subscription ID is required'
      });
      return;
    }

    const subscription = await StripeService.cancelSubscription(subscriptionId);

    res.json({
      success: true,
      subscription: subscription
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel subscription'
    });
  }
};

// Webhook endpoint
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // Перевіряємо підпис webhook
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    // Обробляємо подію
    await StripeService.handleWebhook(event);
    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Webhook processing failed'
    });
  }
};

// Отримання інформації про клієнта
export const getCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      res.status(400).json({
        success: false,
        message: 'Customer ID is required'
      });
      return;
    }

    const customer = await StripeService.getCustomer(customerId);

    res.json({
      success: true,
      customer: customer
    });
  } catch (error: any) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get customer'
    });
  }
};

// Отримання списку планів
export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      plans: StripeService.getPlans()
    });
  } catch (error: any) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get plans'
    });
  }
};
