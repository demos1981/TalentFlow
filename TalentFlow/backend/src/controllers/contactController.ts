import { Request, Response } from 'express';
import { sendContactUsEmail } from '../services/emailService';
import { validateEmail, validateRequired } from '../utils/validation';

/**
 * DTO для форми "Зв'язатись з нами"
 */
interface ContactUsRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

/**
 * Валідація даних форми контакту
 */
const validateContactForm = (data: ContactUsRequest): string[] => {
  const errors: string[] = [];

  if (!validateRequired(data.name)) {
    errors.push('Ім\'я є обов\'язковим');
  }

  if (!validateRequired(data.email)) {
    errors.push('Email є обов\'язковим');
  } else if (!validateEmail(data.email)) {
    errors.push('Неправильний формат email');
  }

  if (!validateRequired(data.subject)) {
    errors.push('Тема є обов\'язковою');
  }

  if (!validateRequired(data.message)) {
    errors.push('Повідомлення є обов\'язковим');
  } else if (data.message.length < 10) {
    errors.push('Повідомлення повинно містити мінімум 10 символів');
  }

  if (data.phone && data.phone.length > 0 && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(data.phone)) {
    errors.push('Неправильний формат телефону');
  }

  return errors;
};

/**
 * POST /api/contact - Відправка форми "Зв'язатись з нами"
 */
export const sendContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, phone, language }: ContactUsRequest & { language?: string } = req.body;

    // Валідація даних
    const validationErrors = validateContactForm({ name, email, subject, message, phone });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Помилка валідації',
        errors: validationErrors
      });
    }

    // Відправка email з локалізацією
    await sendContactUsEmail(name, email, subject, message, phone, language || 'en');

    return res.status(200).json({
      success: true,
      message: 'Повідомлення успішно відправлено. Ми зв\'яжемося з вами найближчим часом!'
    });

  } catch (error) {
    console.error('Error sending contact form:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера при відправці повідомлення. Спробуйте пізніше.'
    });
  }
};

/**
 * GET /api/contact/health - Перевірка здоров'я email сервісу
 */
export const checkEmailServiceHealth = async (req: Request, res: Response) => {
  try {
    // Тут можна додати перевірку підключення до AWS SES
    return res.status(200).json({
      success: true,
      message: 'Email service is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email service health check failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Email service is not available'
    });
  }
};
