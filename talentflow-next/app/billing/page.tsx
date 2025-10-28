'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Layout from '../../components/Layout/Layout';
import { CreditCard, FileText, Download, Calendar, CheckCircle, Star, Zap, Crown } from 'lucide-react';
import StripeCheckout from '../../components/Stripe/StripeCheckout';
import { USER_TYPES } from '../../constants';
import './billing.css';

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  icon: React.ReactNode;
  color: string;
}

const BillingPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { t } = useLanguageStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('premium');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);

  // Визначення планів
  const plans: Plan[] = [
    {
      id: 'basic',
      name: t('planBasic'),
      price: 99,
      period: 'month',
      features: [
        t('planBasicFeature1'),
        t('planBasicFeature2'),
        t('planBasicFeature3'),
        t('planBasicFeature4')
      ],
      icon: <Star className="plan-icon" />,
      color: 'blue',
      isCurrent: currentPlan === 'basic'
    },
    {
      id: 'premium',
      name: t('planPremium'),
      price: 299,
      period: 'month',
      features: [
        t('planPremiumFeature1'),
        t('planPremiumFeature2'),
        t('planPremiumFeature3'),
        t('planPremiumFeature4'),
        t('planPremiumFeature5')
      ],
      icon: <Zap className="plan-icon" />,
      color: 'purple',
      isPopular: true,
      isCurrent: currentPlan === 'premium'
    },
    {
      id: 'enterprise',
      name: t('planEnterprise'),
      price: 599,
      period: 'month',
      features: [
        t('planEnterpriseFeature1'),
        t('planEnterpriseFeature2'),
        t('planEnterpriseFeature3'),
        t('planEnterpriseFeature4'),
        t('planEnterpriseFeature5'),
        t('planEnterpriseFeature6')
      ],
      icon: <Crown className="plan-icon" />,
      color: 'gold',
      isCurrent: currentPlan === 'enterprise'
    }
  ];

  // Ініціалізація авторизації
  useEffect(() => {
    const initAuth = async () => {
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized]);

  // Перевірка доступу
  useEffect(() => {
    if (isInitialized && !authLoading) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else if (user?.role !== USER_TYPES.EMPLOYER) {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, authLoading, isAuthenticated, user, router]);

  // Завантаження рахунків
  useEffect(() => {
    if (isInitialized && user?.role === USER_TYPES.EMPLOYER) {
      loadInvoices();
    }
  }, [isInitialized, user]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      // TODO: Завантажити рахунки з API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock дані
      setInvoices([
        {
          id: '1',
          number: 'INV-2025-001',
          date: new Date().toISOString(),
          amount: 499,
          status: 'paid',
          description: 'Premium Plan - Monthly'
        }
      ]);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // TODO: Завантажити рахунок
    console.log('Download invoice:', invoiceId);
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
  };

  const handleUpgradePlan = async (planId: string) => {
    if (planId === currentPlan) return;
    
    // Показуємо Stripe checkout
    setCheckoutPlanId(planId);
    setShowStripeCheckout(true);
    setSelectedPlan(null);
  };

  const handlePaymentSuccess = async (planId: string) => {
    try {
      setCurrentPlan(planId);
      setShowStripeCheckout(false);
      setCheckoutPlanId(null);
      
      // Оновлення історії платежів
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        amount: plans.find(p => p.id === planId)?.price || 0,
        status: 'paid',
        description: `${plans.find(p => p.id === planId)?.name} - Monthly`
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
    } catch (error) {
      console.error('Payment success handling error:', error);
    }
  };

  const handlePaymentCancel = () => {
    setShowStripeCheckout(false);
    setCheckoutPlanId(null);
  };

  // Показати завантаження
  if (!isInitialized || authLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  // Якщо не авторизований або не роботодавець
  if (!isAuthenticated || user?.role !== USER_TYPES.EMPLOYER) {
    return null;
  }

  return (
    <Layout>
      <div className="billing-page">
        <div className="billing-header">
          <div className="billing-header-content">
            <div className="billing-title-section">
              <CreditCard className="billing-icon" />
              <div>
                <h1 className="billing-title">{t('billingAndServices')}</h1>
                <p className="billing-subtitle">{t('billingDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="billing-content">
          {/* Вибір плану */}
          <div className="billing-section">
            <h2 className="section-title">{t('choosePlan')}</h2>
            <p className="section-subtitle">{t('choosePlanDescription')}</p>
            
            <div className="plans-grid">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`plan-card ${plan.color} ${plan.isCurrent ? 'current' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="plan-popular-badge">
                      {t('mostPopular')}
                    </div>
                  )}
                  
                  <div className="plan-card-header">
                    <div className="plan-icon-container">
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="plan-name">{plan.name}</h3>
                      {plan.isCurrent && (
                        <span className="plan-badge">
                          <CheckCircle className="plan-badge-icon" />
                          {t('currentPlan')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="plan-price">
                    <span className="price-amount">${plan.price}</span>
                    <span className="price-period">/ {t(plan.period)}</span>
                  </div>
                  
                  <div className="plan-features">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="plan-feature">
                        <CheckCircle className="feature-icon" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="plan-actions">
                    {plan.isCurrent ? (
                      <button className="btn-plan-current" disabled>
                        {t('currentPlan')}
                      </button>
                    ) : (
                      <button 
                        className={`btn-plan-select ${selectedPlan === plan.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgradePlan(plan.id);
                        }}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment && selectedPlan === plan.id ? (
                          <>
                            <div className="btn-spinner"></div>
                            {t('processing')}
                          </>
                        ) : (
                          <>
                            {selectedPlan === plan.id ? t('upgradeNow') : t('selectPlan')}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedPlan && selectedPlan !== currentPlan && (
              <div className="plan-upgrade-prompt">
                <div className="upgrade-prompt-content">
                  <h3>{t('confirmUpgrade')}</h3>
                  <p>{t('confirmUpgradeDescription')}</p>
                  <div className="upgrade-prompt-actions">
                    <button 
                      className="btn-cancel"
                      onClick={() => setSelectedPlan(null)}
                    >
                      {t('cancel')}
                    </button>
                    <button 
                      className="btn-confirm"
                      onClick={() => handleUpgradePlan(selectedPlan)}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="btn-spinner"></div>
                          {t('processing')}
                        </>
                      ) : (
                        t('confirmUpgrade')
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Історія платежів */}
          <div className="billing-section">
            <h2 className="section-title">{t('paymentHistory')}</h2>
            
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{t('loading')}</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="empty-state">
                <FileText className="empty-icon" />
                <h3>{t('noInvoices')}</h3>
                <p>{t('noInvoicesDescription')}</p>
              </div>
            ) : (
              <div className="invoices-table-container">
                <table className="invoices-table">
                  <thead>
                    <tr>
                      <th>{t('invoiceNumber')}</th>
                      <th>{t('date')}</th>
                      <th>{t('description')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('status')}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="invoice-number">
                          <FileText className="invoice-icon" />
                          {invoice.number}
                        </td>
                        <td>{new Date(invoice.date).toLocaleDateString()}</td>
                        <td>{invoice.description}</td>
                        <td className="invoice-amount">${invoice.amount}</td>
                        <td>
                          <span className={`status-badge status-${invoice.status}`}>
                            {t(invoice.status)}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="btn-icon-action"
                            title={t('downloadInvoice')}
                          >
                            <Download className="icon-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      {showStripeCheckout && checkoutPlanId && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={handlePaymentCancel}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '32rem',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 10000
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <StripeCheckout
              planId={checkoutPlanId as 'basic' | 'premium' | 'enterprise'}
              onSuccess={() => handlePaymentSuccess(checkoutPlanId)}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BillingPage;

