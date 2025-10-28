import { useState, useCallback, useRef } from 'react';
import { z, ZodSchema } from 'zod';

export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface FormState<T> {
  [K in keyof T]: FormField<T[K]>;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  setTouchedAll: (touched: boolean) => void;
  reset: () => void;
  resetField: (field: keyof T) => void;
  validate: () => Promise<boolean>;
  validateField: (field: keyof T) => Promise<boolean>;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleChange: (field: keyof T) => (value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => () => void;
  getFieldProps: (field: keyof T) => {
    value: T[keyof T];
    onChange: (value: T[keyof T]) => void;
    onBlur: () => void;
    error?: string;
    touched: boolean;
  };
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
  validateOnSubmit = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Валідація поля
  const validateField = useCallback(
    async (field: keyof T): Promise<boolean> => {
      if (!validationSchema) return true;

      try {
        const fieldSchema = validationSchema.pick({ [field]: true } as any);
        await fieldSchema.parseAsync({ [field]: values[field] });
        
        // Очищаємо помилку поля
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(e => e.path.includes(field as string));
          if (fieldError) {
            setErrors(prev => ({
              ...prev,
              [field]: fieldError.message,
            }));
          }
        }
        return false;
      }
    },
    [validationSchema, values]
  );

  // Валідація всієї форми
  const validate = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    try {
      await validationSchema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach(e => {
          const field = e.path[0] as keyof T;
          if (field) {
            newErrors[field] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [validationSchema, values]);

  // Встановлення значення поля
  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [field]: value }));
      
      // Валідація при зміні, якщо включено
      if (validateOnChange) {
        validateField(field);
      }
    },
    [validateOnChange, validateField]
  );

  // Встановлення кількох значень
  const setValuesMultiple = useCallback(
    (newValues: Partial<T>) => {
      setValues(prev => ({ ...prev, ...newValues }));
    },
    []
  );

  // Встановлення помилки поля
  const setError = useCallback(
    (field: keyof T, error: string) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    []
  );

  // Встановлення кількох помилок
  const setErrorsMultiple = useCallback(
    (newErrors: Partial<Record<keyof T, string>>) => {
      setErrors(prev => ({ ...prev, ...newErrors }));
    },
    []
  );

  // Встановлення стану "торкнуто" для поля
  const setTouched = useCallback(
    (field: keyof T, touched: boolean) => {
      setTouched(prev => ({ ...prev, [field]: touched }));
    },
    []
  );

  // Встановлення стану "торкнуто" для всіх полів
  const setTouchedAll = useCallback(
    (touched: boolean) => {
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      Object.keys(values).forEach(key => {
        allTouched[key as keyof T] = touched;
      });
      setTouched(allTouched);
    },
    [values]
  );

  // Скидання форми
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Скидання поля
  const resetField = useCallback(
    (field: keyof T) => {
      setValues(prev => ({ ...prev, [field]: initialValues[field] }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setTouched(prev => {
        const newTouched = { ...prev };
        delete newTouched[field];
        return newTouched;
      });
    },
    [initialValues]
  );

  // Обробка зміни поля
  const handleChange = useCallback(
    (field: keyof T) => (value: T[keyof T]) => {
      setValue(field, value);
    },
    [setValue]
  );

  // Обробка втрати фокусу поля
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(field, true);
      
      // Валідація при втраті фокусу, якщо включено
      if (validateOnBlur) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField, setTouched]
  );

  // Обробка відправки форми
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Встановлюємо всі поля як "торкнуті"
      setTouchedAll(true);

      // Валідація при відправці, якщо включено
      if (validateOnSubmit) {
        const isValid = await validate();
        if (!isValid) return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateOnSubmit, validate, onSubmit, values, setTouchedAll]
  );

  // Отримання пропсів для поля
  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: errors[field],
      touched: touched[field] || false,
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  // Перевірка валідності форми
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setValues: setValuesMultiple,
    setError,
    setErrors: setErrorsMultiple,
    setTouched,
    setTouchedAll,
    reset,
    resetField,
    validate,
    validateField,
    handleSubmit,
    handleChange,
    handleBlur,
    getFieldProps,
  };
}

// Хук для простого управління формою без валідації
export function useSimpleForm<T extends Record<string, any>>(
  initialValues: T
): {
  values: T;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  handleChange: (field: keyof T) => (value: T[keyof T]) => void;
} {
  const [values, setValues] = useState<T>(initialValues);

  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const setValuesMultiple = useCallback(
    (newValues: Partial<T>) => {
      setValues(prev => ({ ...prev, ...newValues }));
    },
    []
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = useCallback(
    (field: keyof T) => (value: T[keyof T]) => {
      setValue(field, value);
    },
    [setValue]
  );

  return {
    values,
    setValue,
    setValues: setValuesMultiple,
    reset,
    handleChange,
  };
}
