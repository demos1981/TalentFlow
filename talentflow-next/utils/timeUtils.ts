// Утиліти для роботи з часом та локалізацією

export interface TimeAgoData {
  value: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
}

/**
 * Парсить рядок часу з бекенду та повертає структуровані дані
 * Підтримує різні формати: "5 minutes ago", "5 хвилин тому", "5 днів тому"
 */
export function parseTimeAgo(timeString: string): TimeAgoData {
  // Видаляємо закінчення "ago", "тому", "назад" тощо
  const cleanString = timeString
    .replace(/\s+(ago|тому|назад)$/i, '')
    .trim();
  
  const parts = cleanString.split(' ');
  
  if (parts.length !== 2) {
    return { value: 0, unit: 'seconds' };
  }
  
  const value = parseInt(parts[0], 10);
  const unit = parts[1].toLowerCase();
  
  // Нормалізуємо одиниці
  const normalizedUnit = normalizeTimeUnit(unit);
  
  return { value, unit: normalizedUnit };
}

/**
 * Нормалізує одиниці часу
 */
function normalizeTimeUnit(unit: string): TimeAgoData['unit'] {
  const unitMap: Record<string, TimeAgoData['unit']> = {
    // Англійські одиниці
    'second': 'seconds',
    'seconds': 'seconds',
    'minute': 'minutes',
    'minutes': 'minutes',
    'hour': 'hours',
    'hours': 'hours',
    'day': 'days',
    'days': 'days',
    'week': 'weeks',
    'weeks': 'weeks',
    'month': 'months',
    'months': 'months',
    'year': 'years',
    'years': 'years',
    
    // Українські одиниці
    'секунд': 'seconds',
    'секунди': 'seconds',
    'секунду': 'seconds',
    'хвилин': 'minutes',
    'хвилини': 'minutes',
    'хвилину': 'minutes',
    'годин': 'hours',
    'години': 'hours',
    'годину': 'hours',
    'днів': 'days',
    'дні': 'days',
    'день': 'days',
    'тижнів': 'weeks',
    'тижні': 'weeks',
    'тиждень': 'weeks',
    'місяців': 'months',
    'місяці': 'months',
    'місяць': 'months',
    'років': 'years',
    'роки': 'years',
    'рік': 'years'
  };
  
  return unitMap[unit] || 'seconds';
}

/**
 * Локалізує час на основі мови
 */
export function localizeTimeAgo(timeData: TimeAgoData, t: (key: string) => string, currentLanguage: string = 'en'): string {
  const { value, unit } = timeData;
  
  // Ключі для локалізації
  const timeKeys: Record<TimeAgoData['unit'], string> = {
    seconds: 'timeAgo.seconds',
    minutes: 'timeAgo.minutes', 
    hours: 'timeAgo.hours',
    days: 'timeAgo.days',
    weeks: 'timeAgo.weeks',
    months: 'timeAgo.months',
    years: 'timeAgo.years'
  };
  
  const key = timeKeys[unit];
  if (!key) {
    return `${value} ${unit}`;
  }
  
  // Використовуємо локалізацію з параметром
  const translation = t(key);
  
  // Якщо переклад не знайдено (повертається ключ), використовуємо fallback
  if (translation === key) {
    // Fallback переклади
    const fallbackTranslations: Record<string, Record<string, string>> = {
      en: {
        'timeAgo.seconds': '{value} seconds ago',
        'timeAgo.minutes': '{value} minutes ago',
        'timeAgo.hours': '{value} hours ago',
        'timeAgo.days': '{value} days ago',
        'timeAgo.weeks': '{value} weeks ago',
        'timeAgo.months': '{value} months ago',
        'timeAgo.years': '{value} years ago'
      },
      uk: {
        'timeAgo.seconds': '{value} секунд тому',
        'timeAgo.minutes': '{value} хвилин тому',
        'timeAgo.hours': '{value} годин тому',
        'timeAgo.days': '{value} днів тому',
        'timeAgo.weeks': '{value} тижнів тому',
        'timeAgo.months': '{value} місяців тому',
        'timeAgo.years': '{value} років тому'
      }
    };
    
    const fallback = fallbackTranslations[currentLanguage] || fallbackTranslations.en;
    const template = fallback[key] || `${value} ${unit}`;
    return template.replace('{value}', value.toString());
  }
  
  return translation.replace('{value}', value.toString());
}

/**
 * Головна функція для локалізації часу
 * Підтримує як старі рядки, так і нові структуровані дані
 */
export function formatTimeAgo(timeData: string | { timeValue: number; timeUnit: string }, t: (key: string) => string, currentLanguage: string = 'en'): string {
  // Якщо передано структуровані дані
  if (typeof timeData === 'object' && timeData.timeValue && timeData.timeUnit) {
    return localizeTimeAgo({
      value: timeData.timeValue,
      unit: timeData.timeUnit as TimeAgoData['unit']
    }, t, currentLanguage);
  }
  
  // Якщо передано рядок (старий формат)
  const timeString = timeData as string;
  
  // Якщо час вже локалізований (містить українські/інші символи), повертаємо як є
  if (/[а-яёіїєґ]/i.test(timeString)) {
    return timeString;
  }
  
  const parsedData = parseTimeAgo(timeString);
  
  // Якщо не вдалося розпарсити, повертаємо оригінальний рядок
  if (parsedData.value === 0 && parsedData.unit === 'seconds') {
    return timeString;
  }
  
  return localizeTimeAgo(parsedData, t, currentLanguage);
}
