import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Payment, PaymentStatus, Currency } from '../models/Payment';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { currencyService } from './currencyService';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentSearchDto,
  PaymentStatsDto,
  ProcessPaymentDto,
  RefundPaymentDto,
  CancelPaymentDto,
  CurrencyConversionDto,
  BulkPaymentActionDto
} from '../dto/PaymentDto';

export interface PaymentSearchResult {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: PaymentSearchDto;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  totalAmountUSD: number;
  paymentsByStatus: Array<{ [key: string]: any; count: number; amount: number; amountUSD: number }>;
  paymentsByMethod: Array<{ [key: string]: any; count: number; amount: number; amountUSD: number }>;
  paymentsByType: Array<{ [key: string]: any; count: number; amount: number; amountUSD: number }>;
  paymentsByCurrency: Array<{ [key: string]: any; count: number; amount: number; amountUSD: number }>;
  paymentsByCountry: Array<{ [key: string]: any; count: number; amount: number; amountUSD: number }>;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  averagePaymentAmount: number;
  averagePaymentAmountUSD: number;
  paymentsToday: number;
  paymentsThisWeek: number;
  paymentsThisMonth: number;
  topCustomers: Array<{ customerEmail: string; count: number; amount: number; amountUSD: number }>;
  revenueByMonth: Array<{ month: string; amount: number; amountUSD: number; count: number }>;
  conversionStats: {
    totalConversions: number;
    mostConvertedFrom: string;
    mostConvertedTo: string;
    averageExchangeRate: number;
  };
}

export class PaymentService {
  private paymentRepository: Repository<Payment>;
  private userRepository: Repository<User>;
  private companyRepository: Repository<Company>;
  private jobRepository: Repository<Job>;

  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.userRepository = AppDataSource.getRepository(User);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.jobRepository = AppDataSource.getRepository(Job);
  }

  /**
   * Отримання всіх платежів
   */
  async getAllPayments(filters: PaymentSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<PaymentSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.user', 'user')
        .leftJoinAndSelect('payment.company', 'company')
        .leftJoinAndSelect('payment.job', 'job')
        .where('payment.createdBy = :userId', { userId })
        .andWhere('payment.isActive = :isActive', { isActive: true });

      // Фільтр по пошуку
      if (filters.search) {
        queryBuilder.andWhere(
          '(payment.description ILIKE :search OR payment.reference ILIKE :search OR payment.customerEmail ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      // Фільтр по статусу
      if (filters.status) {
        queryBuilder.andWhere('payment.status = :status', { status: filters.status });
      }

      // Фільтр по методу
      if (filters.method) {
        queryBuilder.andWhere('payment.paymentMethod = :method', { method: filters.method });
      }

      // Фільтр по типу
      if (filters.type) {
        queryBuilder.andWhere('payment.type = :type', { type: filters.type });
      }

      // Фільтр по валюті
      if (filters.currency) {
        queryBuilder.andWhere('payment.currency = :currency', { currency: filters.currency });
      }

      // Фільтр по користувачу
      if (filters.userId) {
        queryBuilder.andWhere('payment.userId = :userId', { userId: filters.userId });
      }

      // Фільтр по компанії
      if (filters.companyId) {
        queryBuilder.andWhere('payment.companyId = :companyId', { companyId: filters.companyId });
      }

      // Фільтр по роботі
      if (filters.jobId) {
        queryBuilder.andWhere('payment.jobId = :jobId', { jobId: filters.jobId });
      }

      // Фільтр по email клієнта
      if (filters.customerEmail) {
        queryBuilder.andWhere('payment.customerEmail ILIKE :customerEmail', { customerEmail: `%${filters.customerEmail}%` });
      }

      // Фільтр по референсу
      if (filters.reference) {
        queryBuilder.andWhere('payment.reference ILIKE :reference', { reference: `%${filters.reference}%` });
      }

      // Фільтр по платіжному шлюзу
      if (filters.paymentGateway) {
        queryBuilder.andWhere('payment.paymentGateway ILIKE :paymentGateway', { paymentGateway: `%${filters.paymentGateway}%` });
      }

      // Фільтр по сумі
      if (filters.minAmount !== undefined) {
        queryBuilder.andWhere('payment.amount >= :minAmount', { minAmount: filters.minAmount });
      }

      if (filters.maxAmount !== undefined) {
        queryBuilder.andWhere('payment.amount <= :maxAmount', { maxAmount: filters.maxAmount });
      }

      // Фільтр по даті
      if (filters.startDate) {
        queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });
      }

      // Фільтр по повторюваності
      if (filters.isRecurring !== undefined) {
        queryBuilder.andWhere('payment.isRecurring = :isRecurring', { isRecurring: filters.isRecurring });
      }

      // Фільтр по країні (якщо поле існує в моделі)
      if (filters.customerCountry) {
        queryBuilder.andWhere('payment.customerCountry = :customerCountry', { customerCountry: filters.customerCountry });
      }

      // Сортування
      queryBuilder.orderBy(`payment.${filters.sortBy}`, filters.sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const payments = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        payments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        filters
      };
    } catch (error) {
      console.error('Error getting payments:', error);
      throw new Error(`Failed to get payments: ${error.message}`);
    }
  }

  /**
   * Отримання статистики платежів
   */
  async getPaymentStats(statsDto: PaymentStatsDto, userId: string): Promise<PaymentStats> {
    try {
      const {
        startDate,
        endDate,
        baseCurrency = Currency.USD
      } = statsDto;

      const queryBuilder = this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.createdBy = :userId', { userId })
        .andWhere('payment.isActive = :isActive', { isActive: true });

      // Фільтр по даті
      if (startDate) {
        queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate });
      }

      // Загальна кількість платежів
      const totalPayments = await queryBuilder.getCount();

      // Загальна сума в різних валютах
      const totalAmountResult = await queryBuilder
        .clone()
        .select('payment.currency', 'currency')
        .addSelect('SUM(payment.amount)', 'amount')
        .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
        .groupBy('payment.currency')
        .getRawMany();

      let totalAmount = 0;
      let totalAmountUSD = 0;

      for (const result of totalAmountResult) {
        const amount = parseFloat(result.amount || '0');
        totalAmount += amount;

        if (result.currency === baseCurrency) {
          totalAmountUSD += amount;
        } else {
          try {
            const conversion = await currencyService.convertCurrency(
              amount,
              result.currency as Currency,
              baseCurrency
            );
            totalAmountUSD += conversion.convertedAmount;
          } catch (error) {
            console.warn(`Failed to convert ${result.currency} to ${baseCurrency}:`, error.message);
          }
        }
      }

      // Статистика по статусах
      const paymentsByStatus = await this.getPaymentsByField('status', queryBuilder, baseCurrency);

      // Статистика по методах
      const paymentsByMethod = await this.getPaymentsByField('paymentMethod', queryBuilder, baseCurrency);

      // Статистика по типах
      const paymentsByType = await this.getPaymentsByField('type', queryBuilder, baseCurrency);

      // Статистика по валютах
      const paymentsByCurrency = await this.getPaymentsByField('currency', queryBuilder, baseCurrency);

      // Статистика по країнах (якщо поле існує в моделі)
      const paymentsByCountry = await this.getPaymentsByField('customerCountry', queryBuilder, baseCurrency);

      // Статистика по статусах (підрахунок)
      const completedPayments = await queryBuilder
        .clone()
        .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
        .getCount();

      const pendingPayments = await queryBuilder
        .clone()
        .andWhere('payment.status = :status', { status: PaymentStatus.PENDING })
        .getCount();

      const failedPayments = await queryBuilder
        .clone()
        .andWhere('payment.status = :status', { status: PaymentStatus.FAILED })
        .getCount();

      const refundedPayments = await queryBuilder
        .clone()
        .andWhere('payment.status = :status', { status: PaymentStatus.REFUNDED })
        .getCount();

      // Середня сума платежу
      const averagePaymentAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;
      const averagePaymentAmountUSD = totalPayments > 0 ? totalAmountUSD / totalPayments : 0;

      // Платежі сьогодні
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const paymentsToday = await queryBuilder
        .clone()
        .andWhere('payment.createdAt >= :today', { today })
        .getCount();

      // Платежі цього тижня
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const paymentsThisWeek = await queryBuilder
        .clone()
        .andWhere('payment.createdAt >= :weekAgo', { weekAgo })
        .getCount();

      // Платежі цього місяця
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const paymentsThisMonth = await queryBuilder
        .clone()
        .andWhere('payment.createdAt >= :monthAgo', { monthAgo })
        .getCount();

      // Топ клієнти
      const topCustomers = await this.getTopCustomers(queryBuilder, baseCurrency);

      // Доходи по місяцях
      const revenueByMonth = await this.getRevenueByMonth(queryBuilder, baseCurrency);

      // Статистика конвертації
      const conversionStats = await this.getConversionStats(queryBuilder);

      return {
        totalPayments,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalAmountUSD: Math.round(totalAmountUSD * 100) / 100,
        paymentsByStatus,
        paymentsByMethod,
        paymentsByType,
        paymentsByCurrency,
        paymentsByCountry,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        averagePaymentAmount: Math.round(averagePaymentAmount * 100) / 100,
        averagePaymentAmountUSD: Math.round(averagePaymentAmountUSD * 100) / 100,
        paymentsToday,
        paymentsThisWeek,
        paymentsThisMonth,
        topCustomers,
        revenueByMonth,
        conversionStats
      };
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw new Error(`Failed to get payment stats: ${error.message}`);
    }
  }

  /**
   * Отримання статистики по полю
   */
  private async getPaymentsByField(field: string, queryBuilder: any, baseCurrency: Currency): Promise<Array<{ [key: string]: any; count: number; amount: number; amountUSD: number }>> {
    const results = await queryBuilder
      .clone()
      .select(`payment.${field}`, field)
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(payment.amount)', 'amount')
      .addSelect('payment.currency', 'currency')
      .groupBy(`payment.${field}`)
      .addGroupBy('payment.currency')
      .orderBy('count', 'DESC')
      .getRawMany();

    const groupedResults: Map<string, any> = new Map();

    for (const result of results) {
      const key = result[field] || 'unknown';
      const amount = parseFloat(result.amount || '0');
      const count = parseInt(result.count);
      const currency = result.currency as Currency;

      if (!groupedResults.has(key)) {
        groupedResults.set(key, {
          [field]: key,
          count: 0,
          amount: 0,
          amountUSD: 0
        });
      }

      const existing = groupedResults.get(key);
      existing.count += count;
      existing.amount += amount;

      if (currency === baseCurrency) {
        existing.amountUSD += amount;
      } else {
        try {
          const conversion = await currencyService.convertCurrency(amount, currency, baseCurrency);
          existing.amountUSD += conversion.convertedAmount;
        } catch (error) {
          console.warn(`Failed to convert ${currency} to ${baseCurrency}:`, error.message);
        }
      }
    }

    return Array.from(groupedResults.values()).map(item => ({
      ...item,
      amount: Math.round(item.amount * 100) / 100,
      amountUSD: Math.round(item.amountUSD * 100) / 100
    }));
  }

  /**
   * Отримання топ клієнтів
   */
  private async getTopCustomers(queryBuilder: any, baseCurrency: Currency): Promise<Array<{ customerEmail: string; count: number; amount: number; amountUSD: number }>> {
    const results = await queryBuilder
      .clone()
      .select('payment.customerEmail', 'customerEmail')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(payment.amount)', 'amount')
      .addSelect('payment.currency', 'currency')
      .where('payment.customerEmail IS NOT NULL')
      .groupBy('payment.customerEmail')
      .addGroupBy('payment.currency')
      .orderBy('amount', 'DESC')
      .limit(10)
      .getRawMany();

    const groupedResults: Map<string, any> = new Map();

    for (const result of results) {
      const email = result.customerEmail;
      const amount = parseFloat(result.amount || '0');
      const count = parseInt(result.count);
      const currency = result.currency as Currency;

      if (!groupedResults.has(email)) {
        groupedResults.set(email, {
          customerEmail: email,
          count: 0,
          amount: 0,
          amountUSD: 0
        });
      }

      const existing = groupedResults.get(email);
      existing.count += count;
      existing.amount += amount;

      if (currency === baseCurrency) {
        existing.amountUSD += amount;
      } else {
        try {
          const conversion = await currencyService.convertCurrency(amount, currency, baseCurrency);
          existing.amountUSD += conversion.convertedAmount;
        } catch (error) {
          console.warn(`Failed to convert ${currency} to ${baseCurrency}:`, error.message);
        }
      }
    }

    return Array.from(groupedResults.values()).map(item => ({
      ...item,
      amount: Math.round(item.amount * 100) / 100,
      amountUSD: Math.round(item.amountUSD * 100) / 100
    }));
  }

  /**
   * Отримання доходів по місяцях
   */
  private async getRevenueByMonth(queryBuilder: any, baseCurrency: Currency): Promise<Array<{ month: string; amount: number; amountUSD: number; count: number }>> {
    const results = await queryBuilder
      .clone()
      .select('TO_CHAR(payment.createdAt, \'YYYY-MM\')', 'month')
      .addSelect('SUM(payment.amount)', 'amount')
      .addSelect('COUNT(*)', 'count')
      .addSelect('payment.currency', 'currency')
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .groupBy('month')
      .addGroupBy('payment.currency')
      .orderBy('month', 'ASC')
      .limit(12)
      .getRawMany();

    const groupedResults: Map<string, any> = new Map();

    for (const result of results) {
      const month = result.month;
      const amount = parseFloat(result.amount || '0');
      const count = parseInt(result.count);
      const currency = result.currency as Currency;

      if (!groupedResults.has(month)) {
        groupedResults.set(month, {
          month,
          amount: 0,
          amountUSD: 0,
          count: 0
        });
      }

      const existing = groupedResults.get(month);
      existing.count += count;
      existing.amount += amount;

      if (currency === baseCurrency) {
        existing.amountUSD += amount;
      } else {
        try {
          const conversion = await currencyService.convertCurrency(amount, currency, baseCurrency);
          existing.amountUSD += conversion.convertedAmount;
        } catch (error) {
          console.warn(`Failed to convert ${currency} to ${baseCurrency}:`, error.message);
        }
      }
    }

    return Array.from(groupedResults.values()).map(item => ({
      ...item,
      amount: Math.round(item.amount * 100) / 100,
      amountUSD: Math.round(item.amountUSD * 100) / 100
    }));
  }

  /**
   * Отримання статистики конвертації
   */
  private async getConversionStats(queryBuilder: any): Promise<{ totalConversions: number; mostConvertedFrom: string; mostConvertedTo: string; averageExchangeRate: number }> {
    const conversions = await queryBuilder
      .clone()
      .select('payment.originalCurrency', 'fromCurrency')
      .addSelect('payment.currency', 'toCurrency')
      .addSelect('payment.exchangeRate', 'rate')
      .where('payment.originalCurrency IS NOT NULL')
      .andWhere('payment.currency IS NOT NULL')
      .andWhere('payment.exchangeRate IS NOT NULL')
      .getRawMany();

    const totalConversions = conversions.length;
    const fromCurrencies: Map<string, number> = new Map();
    const toCurrencies: Map<string, number> = new Map();
    let totalRate = 0;

    for (const conversion of conversions) {
      const from = conversion.fromCurrency;
      const to = conversion.toCurrency;
      const rate = parseFloat(conversion.rate || '0');

      fromCurrencies.set(from, (fromCurrencies.get(from) || 0) + 1);
      toCurrencies.set(to, (toCurrencies.get(to) || 0) + 1);
      totalRate += rate;
    }

    const mostConvertedFrom = Array.from(fromCurrencies.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const mostConvertedTo = Array.from(toCurrencies.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const averageExchangeRate = totalConversions > 0 ? totalRate / totalConversions : 0;

    return {
      totalConversions,
      mostConvertedFrom,
      mostConvertedTo,
      averageExchangeRate: Math.round(averageExchangeRate * 10000) / 10000
    };
  }

  /**
   * Отримання платежу за ID
   */
  async getPaymentById(paymentId: string, userId: string): Promise<Payment | null> {
    try {
      return await this.paymentRepository.findOne({
        where: { id: paymentId, createdBy: userId },
        relations: ['user', 'company', 'job']
      });
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      throw new Error(`Failed to get payment: ${error.message}`);
    }
  }

  /**
   * Створення платежу
   */
  async createPayment(paymentData: CreatePaymentDto, userId: string): Promise<Payment> {
    try {
      const user = await this.userRepository.findOne({ where: { id: paymentData.userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Конвертація валют якщо потрібно
      let conversionResult: any = null;
      if (paymentData.currency !== Currency.USD) {
        try {
          conversionResult = await currencyService.convertCurrency(
            paymentData.amount,
            paymentData.currency,
            Currency.USD
          );
        } catch (error) {
          console.warn('Currency conversion failed:', error.message);
        }
      }

      const payment = this.paymentRepository.create({
        ...paymentData,
        createdBy: userId,
        status: PaymentStatus.PENDING,
        originalCurrency: conversionResult ? conversionResult.originalCurrency : paymentData.currency,
        originalAmount: conversionResult ? conversionResult.originalAmount : paymentData.amount,
        conversionRate: conversionResult ? conversionResult.exchangeRate : 1
      } as any);

      const savedPayment = await this.paymentRepository.save(payment);
      return Array.isArray(savedPayment) ? savedPayment[0] : savedPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  /**
   * Оновлення платежу
   */
  async updatePayment(paymentId: string, updateData: UpdatePaymentDto, userId: string): Promise<Payment | null> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId, createdBy: userId }
      });
      
      if (!payment) {
        return null;
      }

      // Оновлюємо поля
      Object.assign(payment, updateData);
      payment.updatedAt = new Date();
      
      return await this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error updating payment:', error);
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  /**
   * Видалення платежу
   */
  async deletePayment(paymentId: string, userId: string): Promise<boolean> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId, createdBy: userId }
      });
      
      if (!payment) {
        return false;
      }

      // Soft delete
      payment.isActive = false;
      payment.updatedAt = new Date();
      await this.paymentRepository.save(payment);
      
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
  }

  /**
   * Обробка платежу
   */
  async processPayment(paymentId: string, processData: ProcessPaymentDto, userId: string): Promise<Payment | null> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId, createdBy: userId }
      });
      
      if (!payment) {
        return null;
      }

      payment.status = PaymentStatus.PROCESSING;
      payment.gatewayTransactionId = processData.gatewayTransactionId;
      payment.gatewayResponse = processData.gatewayResponse;
      payment.gatewayMetadata = processData.gatewayMetadata;
      payment.notes = processData.notes;
      payment.updatedAt = new Date();
      
      return await this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  /**
   * Повернення платежу
   */
  async refundPayment(paymentId: string, refundData: RefundPaymentDto, userId: string): Promise<Payment | null> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId, createdBy: userId }
      });
      
      if (!payment) {
        return null;
      }

      const refundAmount = refundData.amount || payment.amount;
      
      payment.status = refundAmount === payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;
      payment.refundAmount = refundAmount;
      payment.refundReason = refundData.reason;
      payment.refundNotes = refundData.notes;
      payment.refundedAt = new Date();
      payment.updatedAt = new Date();
      
      return await this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  }

  /**
   * Скасування платежу
   */
  async cancelPayment(paymentId: string, cancelData: CancelPaymentDto, userId: string): Promise<Payment | null> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId, createdBy: userId }
      });
      
      if (!payment) {
        return null;
      }

      payment.status = PaymentStatus.CANCELLED;
      payment.cancelReason = cancelData.reason;
      payment.cancelNotes = cancelData.notes;
      payment.cancelledAt = new Date();
      payment.updatedAt = new Date();
      
      return await this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error cancelling payment:', error);
      throw new Error(`Failed to cancel payment: ${error.message}`);
    }
  }

  /**
   * Конвертація валют
   */
  async convertCurrency(conversionData: CurrencyConversionDto): Promise<any> {
    try {
      return await currencyService.convertCurrency(
        conversionData.amount,
        conversionData.fromCurrency,
        conversionData.toCurrency,
        conversionData.date ? new Date(conversionData.date) : undefined
      );
    } catch (error) {
      console.error('Error converting currency:', error);
      throw new Error(`Failed to convert currency: ${error.message}`);
    }
  }

  /**
   * Масові дії з платежами
   */
  async bulkAction(bulkData: BulkPaymentActionDto, userId: string): Promise<number> {
    try {
      const whereConditions: any = {
        id: bulkData.paymentIds,
        createdBy: userId,
        isActive: true
      };

      let updateData: any = { updatedAt: new Date() };

      switch (bulkData.action) {
        case 'process':
          updateData = {
            ...updateData,
            status: PaymentStatus.PROCESSING
          };
          break;
        case 'cancel':
          updateData = {
            ...updateData,
            status: PaymentStatus.CANCELLED,
            cancelledAt: new Date()
          };
          break;
        case 'refund':
          updateData = {
            ...updateData,
            status: PaymentStatus.REFUNDED,
            refundedAt: new Date()
          };
          break;
        case 'mark_completed':
          updateData = {
            ...updateData,
            status: PaymentStatus.COMPLETED,
            processedAt: new Date()
          };
          break;
        case 'mark_failed':
          updateData = {
            ...updateData,
            status: PaymentStatus.FAILED,
            failedAt: new Date()
          };
          break;
      }

      const result = await this.paymentRepository.update(whereConditions, updateData);
      return result.affected || 0;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      throw new Error(`Failed to perform bulk action: ${error.message}`);
    }
  }
}

export const paymentService = new PaymentService();