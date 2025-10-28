import { CreateJobDto, UpdateJobDto } from '../dto/JobDto';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateJobData(data: CreateJobDto | UpdateJobDto, isUpdate: boolean = false): ValidationResult {
  console.log('🔍 Starting job validation with data:', JSON.stringify(data, null, 2));
  const errors: string[] = [];

  // Валідація для створення (обов'язкові поля)
  if (!isUpdate) {
    if (!data.title || data.title.trim().length < 3) {
      errors.push('Назва вакансії має бути не менше 3 символів');
    }

    if (!data.description || data.description.trim().length < 20) {
      errors.push('Опис вакансії має бути не менше 20 символів');
    }

    if (!data.type) {
      errors.push('Тип вакансії є обов\'язковим');
    }

    if (!data.experienceLevel) {
      errors.push('Рівень досвіду є обов\'язковим');
    }
  }

  // Валідація для оновлення та створення
  if (data.title && data.title.trim().length < 3) {
    errors.push('Назва вакансії має бути не менше 3 символів');
  }

  if (data.description && data.description.trim().length < 20) {
    errors.push('Опис вакансії має бути не менше 20 символів');
  }

  if (data.salaryMin !== undefined && data.salaryMin < 0) {
    errors.push('Мінімальна зарплата не може бути від\'ємною');
  }

  if (data.salaryMax !== undefined && data.salaryMax < 0) {
    errors.push('Максимальна зарплата не може бути від\'ємною');
  }

  if (data.salaryMin !== undefined && data.salaryMax !== undefined && data.salaryMin > data.salaryMax) {
    errors.push('Мінімальна зарплата не може бути більшою за максимальну');
  }

  if (data.deadline) {
    console.log('🔍 Validating deadline:', data.deadline);
    console.log('🔍 Deadline type:', typeof data.deadline);
    
    const deadlineDate = new Date(data.deadline);
    const now = new Date();
    
    console.log('🔍 Raw deadline string:', data.deadline);
    console.log('🔍 Parsed deadline date:', deadlineDate);
    console.log('🔍 Current date:', now);
    console.log('🔍 Is deadline valid date?', !isNaN(deadlineDate.getTime()));
    
    // Перевіряємо чи дата валідна
    if (isNaN(deadlineDate.getTime())) {
      console.log('❌ Invalid date format');
      errors.push('Невірний формат дати дедлайну');
    } else {
      // Встановлюємо час на початок дня для коректного порівняння
      now.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      
      console.log('🔍 Normalized deadline:', deadlineDate);
      console.log('🔍 Normalized now:', now);
      console.log('🔍 Comparison result:', deadlineDate < now);
      console.log('🔍 Time difference (ms):', deadlineDate.getTime() - now.getTime());
      
      if (deadlineDate < now) {
        console.log('❌ Deadline is in the past');
        errors.push('Дедлайн має бути сьогодні або в майбутньому');
      } else {
        console.log('✅ Deadline is valid');
      }
    }
  }

  if (data.skills && Array.isArray(data.skills)) {
    if (data.skills.some(skill => !skill || skill.trim().length === 0)) {
      errors.push('Навички не можуть бути порожніми');
    }
  }

  if (data.tags && Array.isArray(data.tags)) {
    if (data.tags.some(tag => !tag || tag.trim().length === 0)) {
      errors.push('Теги не можуть бути порожніми');
    }
  }

  console.log('🔍 Validation completed. Errors:', errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
