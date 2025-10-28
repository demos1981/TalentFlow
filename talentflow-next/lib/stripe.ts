import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key not found');
      throw new Error('Stripe publishable key is required');
    }
    console.log('Loading Stripe with key:', publishableKey.substring(0, 20) + '...');
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const STRIPE_PRODUCTS = {
  basic: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!,
    amount: 9900, // $99.00 in cents
    name: 'Basic Plan'
  },
  premium: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    amount: 29900, // $299.00 in cents
    name: 'Premium Plan'
  },
  enterprise: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
    amount: 59900, // $599.00 in cents
    name: 'Enterprise Plan'
  }
};
