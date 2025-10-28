'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLanguageStore } from '../../stores/languageStore';
import { getStripe, STRIPE_PRODUCTS } from '../../lib/stripe';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './StripeCheckout.css';

interface StripeCheckoutProps {
  planId: 'basic' | 'premium' | 'enterprise';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const stripePromise = getStripe();

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ planId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguageStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const router = useRouter();

  // Перевіряємо чи завантажився Stripe
  React.useEffect(() => {
    if (stripe && elements) {
      setStripeLoaded(true);
    }
  }, [stripe, elements]);

  const plan = STRIPE_PRODUCTS[planId];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe not loaded');
      toast.error('Payment system not ready. Please refresh the page.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('Card element not found');
      toast.error('Card information is required.');
      return;
    }

    setIsProcessing(true);

    try {
      // Створюємо Payment Intent на бекенді
      const response = await api.post('/stripe/create-payment-intent', {
        planId,
        amount: plan.amount
      });

      const { clientSecret } = await response.data;

      // Підтверджуємо платіж
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Customer Name', // TODO: Get from user profile
          },
        }
      });

      if (result.error) {
        console.error('Payment failed:', result.error);
        toast.error(result.error.message || t('paymentFailed'));
      } else {
        // Успішний платіж
        toast.success(t('paymentSuccessful'));
        
        // Оновлюємо план користувача
        await api.post('/billing/update-plan', { planId });
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/billing?success=true');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || t('paymentError'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="stripe-checkout">
      <div className="checkout-header">
        <h3>{t('confirmPayment')}</h3>
        <p>{t('confirmPaymentDescription', { plan: plan.name, amount: plan.amount / 100 })}</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="card-element-container">
          <label className="card-element-label">
            {t('cardInformation')}
          </label>
          {!stripeLoaded ? (
            <div className="stripe-loading">
              <div className="loading-spinner"></div>
              <span>Loading payment form...</span>
            </div>
          ) : (
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          )}
        </div>

        <div className="checkout-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
            disabled={isProcessing}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={!stripeLoaded || isProcessing}
            className="btn-pay"
          >
            {isProcessing ? (
              <>
                <div className="btn-spinner"></div>
                {t('processing')}
              </>
            ) : (
              `${t('payNow')} $${plan.amount / 100}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;
