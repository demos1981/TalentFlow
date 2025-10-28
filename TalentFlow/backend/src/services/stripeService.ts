import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export interface PlanConfig {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    amount: 9900, // $99.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 10 job postings',
      'Basic candidate search',
      'Email support',
      'Standard analytics'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    amount: 29900, // $299.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited job postings',
      'Advanced candidate search',
      'AI matching with jobs',
      'Advanced analytics',
      'Priority support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    amount: 59900, // $599.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Premium',
      'Custom integrations',
      'Dedicated account manager',
      'Custom reporting',
      '24/7 phone support',
      'White-label options'
    ]
  }
};

export class StripeService {
  // Створення Payment Intent
  static async createPaymentIntent(planId: string, userId: string, customerEmail?: string) {
    const plan = PLAN_CONFIGS[planId];
    if (!plan) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }

    try {
      // Створюємо або знаходимо клієнта
      let customer: Stripe.Customer;
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            userId: userId
          }
        });
      }

      // Створюємо Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.amount,
        currency: plan.currency,
        customer: customer.id,
        metadata: {
          planId,
          userId,
          planName: plan.name
        },
        description: `TalentFlow ${plan.name} subscription`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe Payment Intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Підтвердження успішного платежу
  static async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          planId: paymentIntent.metadata.planId,
          userId: paymentIntent.metadata.userId,
          amount: paymentIntent.amount,
          customerId: paymentIntent.customer
        };
      } else {
        return {
          success: false,
          status: paymentIntent.status
        };
      }
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // Створення підписки (для повторюваних платежів)
  static async createSubscription(customerId: string, planId: string) {
    const plan = PLAN_CONFIGS[planId];
    if (!plan) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }

    try {
      // Створюємо продукт та ціну (якщо не існує)
      const product = await stripe.products.create({
        name: plan.name,
        description: `TalentFlow ${plan.name}`,
        metadata: {
          planId: plan.id
        }
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.amount,
        currency: plan.currency,
        recurring: {
          interval: plan.interval,
        },
      });

      // Створюємо підписку
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: price.id,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      throw new Error('Failed to create subscription');
    }
  }

  // Відміна підписки
  static async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  // Отримання інформації про клієнта
  static async getCustomer(customerId: string) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return customer;
    } catch (error) {
      console.error('Stripe customer retrieval error:', error);
      throw new Error('Failed to retrieve customer');
    }
  }

  // Обробка webhook подій
  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // TODO: Оновити план користувача в базі даних
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', updatedSubscription.id);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', deletedSubscription.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  static getPlans(): Record<string, PlanConfig> {
    return PLAN_CONFIGS;
  }
}
