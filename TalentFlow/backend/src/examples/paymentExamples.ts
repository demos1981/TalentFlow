/**
 * Приклади використання Payment API з підтримкою міжнародних платежів
 */

export const paymentExamples = {
  // Отримання всіх платежів
  getAllPayments: {
    method: 'GET',
    url: '/api/payments?page=1&limit=20&status=completed&currency=USD&customerCountry=US',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Payments retrieved successfully',
      data: {
        payments: [
          {
            id: '1',
            userId: 'user-1',
            companyId: 'company-1',
            jobId: 'job-1',
            amount: 299.99,
            currency: 'USD',
            type: 'premium',
            status: 'completed',
            method: 'stripe',
            transactionId: 'txn_1234567890',
            gatewayTransactionId: 'pi_1234567890',
            description: 'Premium subscription for 1 month',
            metadata: {
              jobId: 'job-1',
              companyId: 'company-1',
              subscriptionId: 'sub_1234567890',
              featureId: 'premium_features'
            },
            customerEmail: 'john.doe@example.com',
            customerName: 'John Doe',
            customerPhone: '+1-555-123-4567',
            customerCountry: 'US',
            billingAddress: '123 Main St, New York, NY 10001, USA',
            shippingAddress: null,
            isRecurring: true,
            recurringInterval: 'monthly',
            expiresAt: null,
            reference: 'PAY-2024-001',
            paymentGateway: 'stripe',
            gatewayConfig: {
              apiKey: 'sk_test_...',
              secretKey: 'sk_test_...',
              webhookSecret: 'whsec_...'
            },
            gatewayResponse: {
              id: 'pi_1234567890',
              object: 'payment_intent',
              status: 'succeeded'
            },
            gatewayMetadata: {
              stripe_payment_intent_id: 'pi_1234567890',
              stripe_charge_id: 'ch_1234567890'
            },
            processedAt: '2024-01-15T14:30:00.000Z',
            failedAt: null,
            failureReason: null,
            refundedAt: null,
            refundReason: null,
            refundAmount: null,
            refundNotes: null,
            cancelledAt: null,
            cancelReason: null,
            cancelNotes: null,
            processingFee: 8.99,
            processingFeeCurrency: 'USD',
            exchangeRate: 1.0,
            originalCurrency: 'USD',
            originalAmount: 299.99,
            notes: 'Payment processed successfully',
            createdBy: 'user-1',
            isActive: true,
            user: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe'
            },
            company: {
              id: 'company-1',
              name: 'Tech Corp'
            },
            job: {
              id: 'job-1',
              title: 'Senior Developer'
            },
            createdAt: '2024-01-15T14:30:00.000Z',
            updatedAt: '2024-01-15T14:30:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        filters: {
          status: 'completed',
          currency: 'USD',
          customerCountry: 'US'
        }
      }
    }
  },

  // Отримання статистики платежів
  getPaymentStats: {
    method: 'GET',
    url: '/api/payments/stats?startDate=2024-01-01&endDate=2024-01-31&baseCurrency=USD',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Payment statistics retrieved successfully',
      data: {
        totalPayments: 150,
        totalAmount: 45000.00,
        totalAmountUSD: 45000.00,
        paymentsByStatus: [
          { status: 'completed', count: 120, amount: 36000.00, amountUSD: 36000.00 },
          { status: 'pending', count: 20, amount: 6000.00, amountUSD: 6000.00 },
          { status: 'failed', count: 10, amount: 3000.00, amountUSD: 3000.00 }
        ],
        paymentsByMethod: [
          { method: 'stripe', count: 80, amount: 24000.00, amountUSD: 24000.00 },
          { method: 'paypal', count: 40, amount: 12000.00, amountUSD: 12000.00 },
          { method: 'bank_transfer', count: 30, amount: 9000.00, amountUSD: 9000.00 }
        ],
        paymentsByType: [
          { type: 'subscription', count: 60, amount: 18000.00, amountUSD: 18000.00 },
          { type: 'premium', count: 40, amount: 12000.00, amountUSD: 12000.00 },
          { type: 'featured_job', count: 30, amount: 9000.00, amountUSD: 9000.00 },
          { type: 'ai_matching', count: 20, amount: 6000.00, amountUSD: 6000.00 }
        ],
        paymentsByCurrency: [
          { currency: 'USD', count: 100, amount: 30000.00, amountUSD: 30000.00 },
          { currency: 'EUR', count: 30, amount: 9000.00, amountUSD: 9900.00 },
          { currency: 'GBP', count: 20, amount: 6000.00, amountUSD: 7500.00 }
        ],
        paymentsByCountry: [
          { country: 'US', count: 80, amount: 24000.00, amountUSD: 24000.00 },
          { country: 'DE', count: 30, amount: 9000.00, amountUSD: 9900.00 },
          { country: 'GB', count: 20, amount: 6000.00, amountUSD: 7500.00 },
          { country: 'UA', count: 20, amount: 6000.00, amountUSD: 150.00 }
        ],
        completedPayments: 120,
        pendingPayments: 20,
        failedPayments: 10,
        refundedPayments: 5,
        averagePaymentAmount: 300.00,
        averagePaymentAmountUSD: 300.00,
        paymentsToday: 5,
        paymentsThisWeek: 25,
        paymentsThisMonth: 150,
        topCustomers: [
          { customerEmail: 'john.doe@example.com', count: 10, amount: 3000.00, amountUSD: 3000.00 },
          { customerEmail: 'jane.smith@example.com', count: 8, amount: 2400.00, amountUSD: 2400.00 },
          { customerEmail: 'bob.wilson@example.com', count: 6, amount: 1800.00, amountUSD: 1800.00 }
        ],
        revenueByMonth: [
          { month: '2024-01', amount: 15000.00, amountUSD: 15000.00, count: 50 },
          { month: '2024-02', amount: 18000.00, amountUSD: 18000.00, count: 60 },
          { month: '2024-03', amount: 12000.00, amountUSD: 12000.00, count: 40 }
        ],
        conversionStats: {
          totalConversions: 50,
          mostConvertedFrom: 'EUR',
          mostConvertedTo: 'USD',
          averageExchangeRate: 1.10
        }
      }
    }
  },

  // Створення платежу
  createPayment: {
    method: 'POST',
    url: '/api/payments',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      userId: 'user-2',
      amount: 299.99,
      currency: 'EUR',
      type: 'premium',
      method: 'stripe',
      description: 'Premium subscription for 1 month',
      metadata: {
        jobId: 'job-2',
        companyId: 'company-2',
        subscriptionId: 'sub_1234567890',
        featureId: 'premium_features'
      },
      customerEmail: 'jane.smith@example.com',
      customerName: 'Jane Smith',
      customerPhone: '+49-30-12345678',
      customerCountry: 'DE',
      billingAddress: 'Hauptstraße 123, 10115 Berlin, Germany',
      shippingAddress: null,
      isRecurring: true,
      recurringInterval: 'monthly',
      expiresAt: '2024-02-15T14:30:00.000Z',
      reference: 'PAY-2024-002',
      paymentGateway: 'stripe',
      gatewayConfig: {
        apiKey: 'sk_test_...',
        secretKey: 'sk_test_...',
        webhookSecret: 'whsec_...'
      }
    },
    response: {
      success: true,
      message: 'Payment created successfully',
      data: {
        id: '2',
        userId: 'user-2',
        companyId: 'company-2',
        jobId: 'job-2',
        amount: 299.99,
        currency: 'EUR',
        type: 'premium',
        status: 'pending',
        method: 'stripe',
        transactionId: null,
        gatewayTransactionId: null,
        description: 'Premium subscription for 1 month',
        metadata: {
          jobId: 'job-2',
          companyId: 'company-2',
          subscriptionId: 'sub_1234567890',
          featureId: 'premium_features'
        },
        customerEmail: 'jane.smith@example.com',
        customerName: 'Jane Smith',
        customerPhone: '+49-30-12345678',
        customerCountry: 'DE',
        billingAddress: 'Hauptstraße 123, 10115 Berlin, Germany',
        shippingAddress: null,
        isRecurring: true,
        recurringInterval: 'monthly',
        expiresAt: '2024-02-15T14:30:00.000Z',
        reference: 'PAY-2024-002',
        paymentGateway: 'stripe',
        gatewayConfig: {
          apiKey: 'sk_test_...',
          secretKey: 'sk_test_...',
          webhookSecret: 'whsec_...'
        },
        gatewayResponse: null,
        gatewayMetadata: null,
        processedAt: null,
        failedAt: null,
        failureReason: null,
        refundedAt: null,
        refundReason: null,
        refundAmount: null,
        refundNotes: null,
        cancelledAt: null,
        cancelReason: null,
        cancelNotes: null,
        processingFee: null,
        processingFeeCurrency: null,
        exchangeRate: 1.10,
        originalCurrency: 'EUR',
        originalAmount: 299.99,
        notes: null,
        createdBy: 'user-1',
        isActive: true,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:00:00.000Z'
      }
    }
  },

  // Конвертація валют
  convertCurrency: {
    method: 'POST',
    url: '/api/payments/convert-currency',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      amount: 100.00,
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      date: '2024-01-15'
    },
    response: {
      success: true,
      message: 'Currency converted successfully',
      data: {
        originalAmount: 100.00,
        originalCurrency: 'EUR',
        convertedAmount: 110.00,
        convertedCurrency: 'USD',
        exchangeRate: 1.10,
        timestamp: '2024-01-15T14:30:00.000Z',
        source: 'exchangerate-api'
      }
    }
  },

  // Обробка платежу
  processPayment: {
    method: 'PATCH',
    url: '/api/payments/2/process',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      gatewayTransactionId: 'pi_1234567890',
      gatewayResponse: {
        id: 'pi_1234567890',
        object: 'payment_intent',
        status: 'succeeded'
      },
      gatewayMetadata: {
        stripe_payment_intent_id: 'pi_1234567890',
        stripe_charge_id: 'ch_1234567890'
      },
      notes: 'Payment processed successfully',
      processingFee: 8.99,
      processingFeeCurrency: 'EUR'
    },
    response: {
      success: true,
      message: 'Payment processed successfully',
      data: {
        id: '2',
        userId: 'user-2',
        companyId: 'company-2',
        jobId: 'job-2',
        amount: 299.99,
        currency: 'EUR',
        type: 'premium',
        status: 'processing',
        method: 'stripe',
        transactionId: null,
        gatewayTransactionId: 'pi_1234567890',
        description: 'Premium subscription for 1 month',
        metadata: {
          jobId: 'job-2',
          companyId: 'company-2',
          subscriptionId: 'sub_1234567890',
          featureId: 'premium_features'
        },
        customerEmail: 'jane.smith@example.com',
        customerName: 'Jane Smith',
        customerPhone: '+49-30-12345678',
        customerCountry: 'DE',
        billingAddress: 'Hauptstraße 123, 10115 Berlin, Germany',
        shippingAddress: null,
        isRecurring: true,
        recurringInterval: 'monthly',
        expiresAt: '2024-02-15T14:30:00.000Z',
        reference: 'PAY-2024-002',
        paymentGateway: 'stripe',
        gatewayConfig: {
          apiKey: 'sk_test_...',
          secretKey: 'sk_test_...',
          webhookSecret: 'whsec_...'
        },
        gatewayResponse: {
          id: 'pi_1234567890',
          object: 'payment_intent',
          status: 'succeeded'
        },
        gatewayMetadata: {
          stripe_payment_intent_id: 'pi_1234567890',
          stripe_charge_id: 'ch_1234567890'
        },
        processedAt: null,
        failedAt: null,
        failureReason: null,
        refundedAt: null,
        refundReason: null,
        refundAmount: null,
        refundNotes: null,
        cancelledAt: null,
        cancelReason: null,
        cancelNotes: null,
        processingFee: 8.99,
        processingFeeCurrency: 'EUR',
        exchangeRate: 1.10,
        originalCurrency: 'EUR',
        originalAmount: 299.99,
        notes: 'Payment processed successfully',
        createdBy: 'user-1',
        isActive: true,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T15:30:00.000Z'
      }
    }
  },

  // Повернення платежу
  refundPayment: {
    method: 'PATCH',
    url: '/api/payments/1/refund',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      amount: 299.99,
      reason: 'Customer requested refund',
      notes: 'Full refund processed',
      notifyCustomer: true
    },
    response: {
      success: true,
      message: 'Payment refunded successfully',
      data: {
        id: '1',
        userId: 'user-1',
        companyId: 'company-1',
        jobId: 'job-1',
        amount: 299.99,
        currency: 'USD',
        type: 'premium',
        status: 'refunded',
        method: 'stripe',
        transactionId: 'txn_1234567890',
        gatewayTransactionId: 'pi_1234567890',
        description: 'Premium subscription for 1 month',
        metadata: {
          jobId: 'job-1',
          companyId: 'company-1',
          subscriptionId: 'sub_1234567890',
          featureId: 'premium_features'
        },
        customerEmail: 'john.doe@example.com',
        customerName: 'John Doe',
        customerPhone: '+1-555-123-4567',
        customerCountry: 'US',
        billingAddress: '123 Main St, New York, NY 10001, USA',
        shippingAddress: null,
        isRecurring: true,
        recurringInterval: 'monthly',
        expiresAt: null,
        reference: 'PAY-2024-001',
        paymentGateway: 'stripe',
        gatewayConfig: {
          apiKey: 'sk_test_...',
          secretKey: 'sk_test_...',
          webhookSecret: 'whsec_...'
        },
        gatewayResponse: {
          id: 'pi_1234567890',
          object: 'payment_intent',
          status: 'succeeded'
        },
        gatewayMetadata: {
          stripe_payment_intent_id: 'pi_1234567890',
          stripe_charge_id: 'ch_1234567890'
        },
        processedAt: '2024-01-15T14:30:00.000Z',
        failedAt: null,
        failureReason: null,
        refundedAt: '2024-01-15T16:00:00.000Z',
        refundReason: 'Customer requested refund',
        refundAmount: 299.99,
        refundNotes: 'Full refund processed',
        cancelledAt: null,
        cancelReason: null,
        cancelNotes: null,
        processingFee: 8.99,
        processingFeeCurrency: 'USD',
        exchangeRate: 1.0,
        originalCurrency: 'USD',
        originalAmount: 299.99,
        notes: 'Payment processed successfully',
        createdBy: 'user-1',
        isActive: true,
        createdAt: '2024-01-15T14:30:00.000Z',
        updatedAt: '2024-01-15T16:00:00.000Z'
      }
    }
  },

  // Скасування платежу
  cancelPayment: {
    method: 'PATCH',
    url: '/api/payments/2/cancel',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      reason: 'Customer cancelled before processing',
      notes: 'Payment cancelled by customer request',
      notifyCustomer: true
    },
    response: {
      success: true,
      message: 'Payment cancelled successfully',
      data: {
        id: '2',
        userId: 'user-2',
        companyId: 'company-2',
        jobId: 'job-2',
        amount: 299.99,
        currency: 'EUR',
        type: 'premium',
        status: 'cancelled',
        method: 'stripe',
        transactionId: null,
        gatewayTransactionId: 'pi_1234567890',
        description: 'Premium subscription for 1 month',
        metadata: {
          jobId: 'job-2',
          companyId: 'company-2',
          subscriptionId: 'sub_1234567890',
          featureId: 'premium_features'
        },
        customerEmail: 'jane.smith@example.com',
        customerName: 'Jane Smith',
        customerPhone: '+49-30-12345678',
        customerCountry: 'DE',
        billingAddress: 'Hauptstraße 123, 10115 Berlin, Germany',
        shippingAddress: null,
        isRecurring: true,
        recurringInterval: 'monthly',
        expiresAt: '2024-02-15T14:30:00.000Z',
        reference: 'PAY-2024-002',
        paymentGateway: 'stripe',
        gatewayConfig: {
          apiKey: 'sk_test_...',
          secretKey: 'sk_test_...',
          webhookSecret: 'whsec_...'
        },
        gatewayResponse: {
          id: 'pi_1234567890',
          object: 'payment_intent',
          status: 'succeeded'
        },
        gatewayMetadata: {
          stripe_payment_intent_id: 'pi_1234567890',
          stripe_charge_id: 'ch_1234567890'
        },
        processedAt: null,
        failedAt: null,
        failureReason: null,
        refundedAt: null,
        refundReason: null,
        refundAmount: null,
        refundNotes: null,
        cancelledAt: '2024-01-15T16:30:00.000Z',
        cancelReason: 'Customer cancelled before processing',
        cancelNotes: 'Payment cancelled by customer request',
        processingFee: 8.99,
        processingFeeCurrency: 'EUR',
        exchangeRate: 1.10,
        originalCurrency: 'EUR',
        originalAmount: 299.99,
        notes: 'Payment processed successfully',
        createdBy: 'user-1',
        isActive: true,
        createdAt: '2024-01-15T15:00:00.000Z',
        updatedAt: '2024-01-15T16:30:00.000Z'
      }
    }
  },

  // Масові дії з платежами
  bulkAction: {
    method: 'POST',
    url: '/api/payments/bulk-action',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      paymentIds: ['1', '2', '3'],
      action: 'mark_completed',
      actionData: {
        processedAt: '2024-01-15T17:00:00.000Z'
      }
    },
    response: {
      success: true,
      message: 'Bulk action completed successfully. 3 payments affected.',
      data: { count: 3 }
    }
  },

  // Приклад помилки (платеж не знайдено)
  getPaymentByIdError: {
    method: 'GET',
    url: '/api/payments/non-existent-id',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: false,
      message: 'Payment not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createPaymentError: {
    method: 'POST',
    url: '/api/payments',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      userId: 'user-2',
      amount: 299.99,
      currency: 'USD',
      type: 'premium'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default paymentExamples;


