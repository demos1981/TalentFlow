import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Простий модуль для роботи з хешуванням
export const hashService = {
  // Хешування паролю
  hashPassword: async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  },

  // Перевірка паролю
  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Генерація випадкового токена
  generateRandomToken: (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
  },

  // Генерація UUID v4
  generateUUID: (): string => {
    return crypto.randomUUID();
  },

  // MD5 хеш
  md5Hash: (data: string): string => {
    return crypto.createHash('md5').update(data).digest('hex');
  },

  // SHA256 хеш
  sha256Hash: (data: string): string => {
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  // SHA512 хеш
  sha512Hash: (data: string): string => {
    return crypto.createHash('sha512').update(data).digest('hex');
  },

  // HMAC SHA256
  hmacSha256: (data: string, secret: string): string => {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  },

  // Генерація salt
  generateSalt: (rounds: number = 12): string => {
    return bcrypt.genSaltSync(rounds);
  },

  // Безпечне порівняння рядків (захист від timing attacks)
  safeStringCompare: (a: string, b: string): boolean => {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  },

  // Генерація коду підтвердження (6 цифр)
  generateVerificationCode: (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Генерація секретного ключа для 2FA
  generate2FASecret: (): string => {
    return crypto.randomBytes(32).toString('hex');
  }
};
