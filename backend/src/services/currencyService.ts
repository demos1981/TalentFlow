import axios from 'axios';
import { Currency } from '../models/Payment';

export interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  timestamp: Date;
  source: string;
}

export interface CurrencyConversionResult {
  originalAmount: number;
  originalCurrency: Currency;
  convertedAmount: number;
  convertedCurrency: Currency;
  exchangeRate: number;
  timestamp: Date;
  source: string;
}

export class CurrencyService {
  private readonly EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  private readonly FIXER_API_KEY = process.env.FIXER_API_KEY;
  private readonly CURRENCY_LAYER_API_KEY = process.env.CURRENCY_LAYER_API_KEY;
  
  private cache: Map<string, ExchangeRate> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Конвертація валют
   */
  async convertCurrency(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    date?: Date
  ): Promise<CurrencyConversionResult> {
    try {
      if (fromCurrency === toCurrency) {
        return {
          originalAmount: amount,
          originalCurrency: fromCurrency,
          convertedAmount: amount,
          convertedCurrency: toCurrency,
          exchangeRate: 1,
          timestamp: new Date(),
          source: 'same_currency'
        };
      }

      const exchangeRate = await this.getExchangeRate(fromCurrency, toCurrency, date);
      const convertedAmount = amount * exchangeRate.rate;

      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        convertedCurrency: toCurrency,
        exchangeRate: exchangeRate.rate,
        timestamp: exchangeRate.timestamp,
        source: exchangeRate.source
      };
    } catch (error) {
      console.error('Error converting currency:', error);
      throw new Error(`Failed to convert currency: ${error.message}`);
    }
  }

  /**
   * Отримання курсу валют
   */
  async getExchangeRate(
    fromCurrency: Currency,
    toCurrency: Currency,
    date?: Date
  ): Promise<ExchangeRate> {
    const cacheKey = `${fromCurrency}_${toCurrency}_${date?.toISOString().split('T')[0] || 'latest'}`;
    
    // Перевіряємо кеш
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached;
    }

    try {
      let exchangeRate: ExchangeRate;

      // Спробуємо різні API
      try {
        exchangeRate = await this.getRateFromExchangeRateAPI(fromCurrency, toCurrency, date);
      } catch (error) {
        console.warn('ExchangeRate API failed, trying Fixer API:', error.message);
        try {
          exchangeRate = await this.getRateFromFixerAPI(fromCurrency, toCurrency, date);
        } catch (error) {
          console.warn('Fixer API failed, trying Currency Layer API:', error.message);
          exchangeRate = await this.getRateFromCurrencyLayerAPI(fromCurrency, toCurrency, date);
        }
      }

      // Зберігаємо в кеш
      this.cache.set(cacheKey, exchangeRate);
      
      return exchangeRate;
    } catch (error) {
      console.error('All currency APIs failed:', error);
      throw new Error(`Failed to get exchange rate: ${error.message}`);
    }
  }

  /**
   * Отримання курсу з ExchangeRate API
   */
  private async getRateFromExchangeRateAPI(
    fromCurrency: Currency,
    toCurrency: Currency,
    date?: Date
  ): Promise<ExchangeRate> {
    if (!this.EXCHANGE_RATE_API_KEY) {
      throw new Error('ExchangeRate API key not configured');
    }

    const baseUrl = 'https://api.exchangerate-api.com/v4';
    const endpoint = date 
      ? `${baseUrl}/history/${fromCurrency}/${date.toISOString().split('T')[0]}`
      : `${baseUrl}/latest/${fromCurrency}`;

    const response = await axios.get(endpoint, {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${this.EXCHANGE_RATE_API_KEY}`
      }
    });

    const rates = date ? response.data.rates : response.data.rates;
    const rate = rates[toCurrency];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    return {
      from: fromCurrency,
      to: toCurrency,
      rate,
      timestamp: new Date(response.data.timestamp * 1000),
      source: 'exchangerate-api'
    };
  }

  /**
   * Отримання курсу з Fixer API
   */
  private async getRateFromFixerAPI(
    fromCurrency: Currency,
    toCurrency: Currency,
    date?: Date
  ): Promise<ExchangeRate> {
    if (!this.FIXER_API_KEY) {
      throw new Error('Fixer API key not configured');
    }

    const baseUrl = 'https://api.fixer.io';
    const endpoint = date 
      ? `${baseUrl}/${date.toISOString().split('T')[0]}`
      : `${baseUrl}/latest`;

    const response = await axios.get(endpoint, {
      params: {
        access_key: this.FIXER_API_KEY,
        base: fromCurrency,
        symbols: toCurrency
      },
      timeout: 10000
    });

    const rate = response.data.rates[toCurrency];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    return {
      from: fromCurrency,
      to: toCurrency,
      rate,
      timestamp: new Date(response.data.timestamp * 1000),
      source: 'fixer-api'
    };
  }

  /**
   * Отримання курсу з Currency Layer API
   */
  private async getRateFromCurrencyLayerAPI(
    fromCurrency: Currency,
    toCurrency: Currency,
    date?: Date
  ): Promise<ExchangeRate> {
    if (!this.CURRENCY_LAYER_API_KEY) {
      throw new Error('Currency Layer API key not configured');
    }

    const baseUrl = 'http://api.currencylayer.com';
    const endpoint = date 
      ? `${baseUrl}/historical`
      : `${baseUrl}/live`;

    const response = await axios.get(endpoint, {
      params: {
        access_key: this.CURRENCY_LAYER_API_KEY,
        source: fromCurrency,
        currencies: toCurrency,
        ...(date && { date: date.toISOString().split('T')[0] })
      },
      timeout: 10000
    });

    const rateKey = date ? `historical` : 'live';
    const rate = response.data.quotes[`${fromCurrency}${toCurrency}`];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    return {
      from: fromCurrency,
      to: toCurrency,
      rate,
      timestamp: new Date(response.data.timestamp * 1000),
      source: 'currency-layer-api'
    };
  }

  /**
   * Перевірка валідності кешу
   */
  private isCacheValid(timestamp: Date): boolean {
    return Date.now() - timestamp.getTime() < this.CACHE_DURATION;
  }

  /**
   * Отримання списку підтримуваних валют
   */
  getSupportedCurrencies(): Currency[] {
    return Object.values(Currency);
  }

  /**
   * Отримання інформації про валюту
   */
  getCurrencyInfo(currency: Currency): { code: string; name: string; symbol: string; decimals: number } {
    const currencyInfo: Record<Currency, { name: string; symbol: string; decimals: number }> = {
      [Currency.USD]: { name: 'US Dollar', symbol: '$', decimals: 2 },
      [Currency.EUR]: { name: 'Euro', symbol: '€', decimals: 2 },
      [Currency.GBP]: { name: 'British Pound', symbol: '£', decimals: 2 },
      [Currency.UAH]: { name: 'Ukrainian Hryvnia', symbol: '₴', decimals: 2 },
      [Currency.PLN]: { name: 'Polish Zloty', symbol: 'zł', decimals: 2 },
      [Currency.CZK]: { name: 'Czech Koruna', symbol: 'Kč', decimals: 2 },
      [Currency.HUF]: { name: 'Hungarian Forint', symbol: 'Ft', decimals: 2 },
      [Currency.RON]: { name: 'Romanian Leu', symbol: 'lei', decimals: 2 },
      [Currency.BGN]: { name: 'Bulgarian Lev', symbol: 'лв', decimals: 2 },
      [Currency.HRK]: { name: 'Croatian Kuna', symbol: 'kn', decimals: 2 },
      [Currency.RSD]: { name: 'Serbian Dinar', symbol: 'дин', decimals: 2 },
      [Currency.MKD]: { name: 'Macedonian Denar', symbol: 'ден', decimals: 2 },
      [Currency.ALL]: { name: 'Albanian Lek', symbol: 'L', decimals: 2 },
      [Currency.BAM]: { name: 'Bosnia and Herzegovina Mark', symbol: 'КМ', decimals: 2 },
      [Currency.MNT]: { name: 'Mongolian Tugrik', symbol: '₮', decimals: 2 },
      [Currency.CAD]: { name: 'Canadian Dollar', symbol: 'C$', decimals: 2 },
      [Currency.AUD]: { name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
      [Currency.JPY]: { name: 'Japanese Yen', symbol: '¥', decimals: 0 },
      [Currency.CHF]: { name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
      [Currency.SEK]: { name: 'Swedish Krona', symbol: 'kr', decimals: 2 },
      [Currency.NOK]: { name: 'Norwegian Krone', symbol: 'kr', decimals: 2 },
      [Currency.DKK]: { name: 'Danish Krone', symbol: 'kr', decimals: 2 },
      [Currency.ISK]: { name: 'Icelandic Krona', symbol: 'kr', decimals: 2 },
      [Currency.TRY]: { name: 'Turkish Lira', symbol: '₺', decimals: 2 },
      [Currency.RUB]: { name: 'Russian Ruble', symbol: '₽', decimals: 2 },
      [Currency.CNY]: { name: 'Chinese Yuan', symbol: '¥', decimals: 2 },
      [Currency.INR]: { name: 'Indian Rupee', symbol: '₹', decimals: 2 },
      [Currency.BRL]: { name: 'Brazilian Real', symbol: 'R$', decimals: 2 },
      [Currency.MXN]: { name: 'Mexican Peso', symbol: '$', decimals: 2 },
      [Currency.ZAR]: { name: 'South African Rand', symbol: 'R', decimals: 2 },
      [Currency.KRW]: { name: 'South Korean Won', symbol: '₩', decimals: 0 },
      [Currency.SGD]: { name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
      [Currency.HKD]: { name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2 },
      [Currency.NZD]: { name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2 },
      [Currency.THB]: { name: 'Thai Baht', symbol: '฿', decimals: 2 },
      [Currency.MYR]: { name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2 },
      [Currency.PHP]: { name: 'Philippine Peso', symbol: '₱', decimals: 2 },
      [Currency.IDR]: { name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 2 },
      [Currency.VND]: { name: 'Vietnamese Dong', symbol: '₫', decimals: 0 }
    };

    const info = currencyInfo[currency];
    return {
      code: currency,
      name: info.name,
      symbol: info.symbol,
      decimals: info.decimals
    };
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Отримання статистики кешу
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const currencyService = new CurrencyService();


