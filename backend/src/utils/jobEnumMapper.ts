import { JobType, ExperienceLevel } from '../models/Job';
import { 
  jobTypeTranslations,
  experienceLevelTranslations
} from '../locales/jobTranslations';

// Хелпер функція для пошуку JobType за перекладом
function findJobTypeByTranslation(language: string, translatedValue: string): JobType | null {
  const translations = jobTypeTranslations[language];
  if (!translations) return null;
  
  for (const [key, value] of Object.entries(translations)) {
    if (value.toLowerCase() === translatedValue.toLowerCase()) {
      return key as JobType;
    }
  }
  return null;
}

// Хелпер функція для пошуку ExperienceLevel за перекладом
function findExperienceLevelByTranslation(language: string, translatedValue: string): ExperienceLevel | null {
  const translations = experienceLevelTranslations[language];
  if (!translations) return null;
  
  for (const [key, value] of Object.entries(translations)) {
    if (value.toLowerCase() === translatedValue.toLowerCase()) {
      return key as ExperienceLevel;
    }
  }
  return null;
}

// Функція для мапінгу JobType з будь-якої мови
export function mapJobType(translatedType: string, language: string = 'uk'): JobType {
  console.log('🔍 Mapping job type:', translatedType, 'for language:', language);
  
  // Спочатку шукаємо за перекладом для вказаної мови
  let mappedType = findJobTypeByTranslation(language, translatedType);
  
  // Якщо не знайшли, шукаємо в інших мовах
  if (!mappedType) {
    const supportedLanguages = ['uk', 'en', 'de', 'fr', 'es', 'it', 'pl', 'ru', 'cs', 'pt'];
    for (const lang of supportedLanguages) {
      mappedType = findJobTypeByTranslation(lang, translatedType);
      if (mappedType) {
        console.log(`✅ Found job type in language: ${lang}`);
        break;
      }
    }
  }
  
  if (!mappedType) {
    console.warn(`❌ Unknown job type: ${translatedType}, using default FULL_TIME`);
    return JobType.FULL_TIME;
  }
  
  console.log('✅ Mapped job type:', translatedType, '->', mappedType);
  return mappedType;
}

// Функція для мапінгу ExperienceLevel з будь-якої мови
export function mapExperienceLevel(translatedLevel: string, language: string = 'uk'): ExperienceLevel {
  console.log('🔍 Mapping experience level:', translatedLevel, 'for language:', language);
  
  // Спочатку шукаємо за перекладом для вказаної мови
  let mappedLevel = findExperienceLevelByTranslation(language, translatedLevel);
  
  // Якщо не знайшли, шукаємо в інших мовах
  if (!mappedLevel) {
    const supportedLanguages = ['uk', 'en', 'de', 'fr', 'es', 'it', 'pl', 'ru', 'cs', 'pt'];
    for (const lang of supportedLanguages) {
      mappedLevel = findExperienceLevelByTranslation(lang, translatedLevel);
      if (mappedLevel) {
        console.log(`✅ Found experience level in language: ${lang}`);
        break;
      }
    }
  }
  
  if (!mappedLevel) {
    console.warn(`❌ Unknown experience level: ${translatedLevel}, using default FROM_1_TO_3`);
    return ExperienceLevel.FROM_1_TO_3;
  }
  
  console.log('✅ Mapped experience level:', translatedLevel, '->', mappedLevel);
  return mappedLevel;
}

// Функції для зворотного перетворення
export function reverseMapJobType(jobType: JobType, language: string = 'uk'): string {
  const translations = jobTypeTranslations[language] || jobTypeTranslations['en'];
  return translations[jobType] || jobType;
}

export function reverseMapExperienceLevel(experienceLevel: ExperienceLevel, language: string = 'uk'): string {
  const translations = experienceLevelTranslations[language] || experienceLevelTranslations['en'];
  return translations[experienceLevel] || experienceLevel;
}

// Функція для отримання всіх доступних значень для мови
export function getAvailableJobTypes(language: string = 'uk'): string[] {
  const translations = jobTypeTranslations[language] || jobTypeTranslations['en'];
  return Object.values(translations);
}

export function getAvailableExperienceLevels(language: string = 'uk'): string[] {
  const translations = experienceLevelTranslations[language] || experienceLevelTranslations['en'];
  return Object.values(translations);
}
