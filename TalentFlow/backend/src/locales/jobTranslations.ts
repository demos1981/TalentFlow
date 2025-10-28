import { JobType, ExperienceLevel } from '../models/Job';

// Переклади для JobType
export const jobTypeTranslations: Record<string, Record<JobType, string>> = {
  uk: {
    [JobType.FULL_TIME]: 'Повна зайнятість',
    [JobType.PART_TIME]: 'Часткова зайнятість',
    [JobType.INTERNSHIP]: 'Стажування',
    [JobType.FREELANCE]: 'Фріланс'
  },
  en: {
    [JobType.FULL_TIME]: 'Full Time',
    [JobType.PART_TIME]: 'Part Time',
    [JobType.INTERNSHIP]: 'Internship',
    [JobType.FREELANCE]: 'Freelance'
  },
  de: {
    [JobType.FULL_TIME]: 'Vollzeit',
    [JobType.PART_TIME]: 'Teilzeit',
    [JobType.INTERNSHIP]: 'Praktikum',
    [JobType.FREELANCE]: 'Freiberuflich'
  },
  fr: {
    [JobType.FULL_TIME]: 'Temps plein',
    [JobType.PART_TIME]: 'Temps partiel',
    [JobType.INTERNSHIP]: 'Stage',
    [JobType.FREELANCE]: 'Freelance'
  },
  es: {
    [JobType.FULL_TIME]: 'Tiempo completo',
    [JobType.PART_TIME]: 'Tiempo parcial',
    [JobType.INTERNSHIP]: 'Prácticas',
    [JobType.FREELANCE]: 'Freelance'
  },
  it: {
    [JobType.FULL_TIME]: 'Tempo pieno',
    [JobType.PART_TIME]: 'Tempo parziale',
    [JobType.INTERNSHIP]: 'Stage',
    [JobType.FREELANCE]: 'Freelance'
  },
  pl: {
    [JobType.FULL_TIME]: 'Pełny etat',
    [JobType.PART_TIME]: 'Część etatu',
    [JobType.INTERNSHIP]: 'Staż',
    [JobType.FREELANCE]: 'Freelance'
  },
  ru: {
    [JobType.FULL_TIME]: 'Полная занятость',
    [JobType.PART_TIME]: 'Частичная занятость',
    [JobType.INTERNSHIP]: 'Стажировка',
    [JobType.FREELANCE]: 'Фриланс'
  },
  cs: {
    [JobType.FULL_TIME]: 'Plný úvazek',
    [JobType.PART_TIME]: 'Částečný úvazek',
    [JobType.INTERNSHIP]: 'Stáž',
    [JobType.FREELANCE]: 'Freelance'
  },
  pt: {
    [JobType.FULL_TIME]: 'Tempo integral',
    [JobType.PART_TIME]: 'Tempo parcial',
    [JobType.INTERNSHIP]: 'Estágio',
    [JobType.FREELANCE]: 'Freelance'
  }
};

// Переклади для ExperienceLevel
export const experienceLevelTranslations: Record<string, Record<ExperienceLevel, string>> = {
  uk: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Без досвіду',
    [ExperienceLevel.LESS_THAN_1]: 'До 1 року',
    [ExperienceLevel.FROM_1_TO_3]: 'Від 1 до 3 років',
    [ExperienceLevel.FROM_3_TO_5]: 'Від 3 до 5 років',
    [ExperienceLevel.FROM_5_TO_10]: 'Від 5 до 10 років',
    [ExperienceLevel.MORE_THAN_10]: '10+ років'
  },
  en: {
    [ExperienceLevel.NO_EXPERIENCE]: 'No experience',
    [ExperienceLevel.LESS_THAN_1]: 'Less than 1 year',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 years',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 years',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 years',
    [ExperienceLevel.MORE_THAN_10]: '10+ years'
  },
  de: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Keine Erfahrung',
    [ExperienceLevel.LESS_THAN_1]: 'Weniger als 1 Jahr',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 Jahre',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 Jahre',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 Jahre',
    [ExperienceLevel.MORE_THAN_10]: '10+ Jahre'
  },
  fr: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Sans expérience',
    [ExperienceLevel.LESS_THAN_1]: 'Moins d\'1 an',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 ans',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 ans',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 ans',
    [ExperienceLevel.MORE_THAN_10]: '10+ ans'
  },
  es: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Sin experiencia',
    [ExperienceLevel.LESS_THAN_1]: 'Menos de 1 año',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 años',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 años',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 años',
    [ExperienceLevel.MORE_THAN_10]: '10+ años'
  },
  it: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Senza esperienza',
    [ExperienceLevel.LESS_THAN_1]: 'Meno di 1 anno',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 anni',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 anni',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 anni',
    [ExperienceLevel.MORE_THAN_10]: '10+ anni'
  },
  pl: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Bez doświadczenia',
    [ExperienceLevel.LESS_THAN_1]: 'Mniej niż 1 rok',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 lata',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 lat',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 lat',
    [ExperienceLevel.MORE_THAN_10]: '10+ lat'
  },
  ru: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Без опыта',
    [ExperienceLevel.LESS_THAN_1]: 'Менее 1 года',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 года',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 лет',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 лет',
    [ExperienceLevel.MORE_THAN_10]: '10+ лет'
  },
  cs: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Bez zkušeností',
    [ExperienceLevel.LESS_THAN_1]: 'Méně než 1 rok',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 roky',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 let',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 let',
    [ExperienceLevel.MORE_THAN_10]: '10+ let'
  },
  pt: {
    [ExperienceLevel.NO_EXPERIENCE]: 'Sem experiência',
    [ExperienceLevel.LESS_THAN_1]: 'Menos de 1 ano',
    [ExperienceLevel.FROM_1_TO_3]: '1-3 anos',
    [ExperienceLevel.FROM_3_TO_5]: '3-5 anos',
    [ExperienceLevel.FROM_5_TO_10]: '5-10 anos',
    [ExperienceLevel.MORE_THAN_10]: '10+ anos'
  }
};

// Функція для отримання перекладу JobType
export function getJobTypeTranslation(language: string, jobType: JobType): string {
  const translations = jobTypeTranslations[language];
  if (!translations) {
    return jobType;
  }
  return translations[jobType] || jobType;
}

// Функція для отримання перекладу ExperienceLevel
export function getExperienceLevelTranslation(language: string, experienceLevel: ExperienceLevel): string {
  const translations = experienceLevelTranslations[language];
  if (!translations) {
    return experienceLevel;
  }
  return translations[experienceLevel] || experienceLevel;
}

// Функція для отримання всіх перекладів JobType для мови
export function getAllJobTypeTranslations(language: string): Record<JobType, string> {
  return jobTypeTranslations[language] || jobTypeTranslations['en'];
}

// Функція для отримання всіх перекладів ExperienceLevel для мови
export function getAllExperienceLevelTranslations(language: string): Record<ExperienceLevel, string> {
  return experienceLevelTranslations[language] || experienceLevelTranslations['en'];
}
