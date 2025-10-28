/**
 * Валідація email адреси
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валідація обов'язкових полів
 */
export const validateRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

/**
 * Валідація довжини рядка
 */
export const validateLength = (value: string, min: number, max?: number): boolean => {
  if (min && value.length < min) return false;
  if (max && value.length > max) return false;
  return true;
};

/**
 * Валідація телефону
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Валідація URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Валідація паролю
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль повинен містити мінімум 8 символів');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль повинен містити принаймні одну велику літеру');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль повинен містити принаймні одну малу літеру');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Пароль повинен містити принаймні одну цифру');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};