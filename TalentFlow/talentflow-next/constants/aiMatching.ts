// AI Matching Constants and Enums

export enum RecommendationType {
  CANDIDATE = 'candidate',
  JOB = 'job'
}

export enum FilterType {
  ALL = 'all',
  CANDIDATES = 'candidates',
  JOBS = 'jobs'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
  LEAD = 'lead'
}

export enum MatchScoreLevel {
  EXCELLENT = 90,
  GOOD = 80,
  NORMAL = 70,
  NEEDS_ATTENTION = 60
}

export const AI_MATCHING_CONSTANTS = {
  DEFAULT_MATCH_SCORE: 70,
  MIN_MATCH_SCORE: 0,
  MAX_MATCH_SCORE: 100,
  DEFAULT_FILTER_TYPE: FilterType.ALL,
  DEFAULT_RECOMMENDATION_TYPE: RecommendationType.CANDIDATE
} as const;

export const EXPERIENCE_OPTIONS = [
  { value: ExperienceLevel.ENTRY, label: 'Початковий рівень (0-2 роки)' },
  { value: ExperienceLevel.JUNIOR, label: 'Junior (1-3 роки)' },
  { value: ExperienceLevel.MIDDLE, label: 'Middle (3-5 років)' },
  { value: ExperienceLevel.SENIOR, label: 'Senior (5+ років)' },
  { value: ExperienceLevel.LEAD, label: 'Lead/Architect (7+ років)' }
] as const;

export const SALARY_RANGES = [
  { value: '0-30000', label: 'До 30,000 USD' },
  { value: '30000-60000', label: '30,000 - 60,000 USD' },
  { value: '60000-100000', label: '60,000 - 100,000 USD' },
  { value: '100000-150000', label: '100,000 - 150,000 USD' },
  { value: '150000+', label: '150,000+ USD' }
] as const;

export const POPULAR_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'TypeScript'
] as const;

export const MATCH_SCORE_LABELS = {
  [MatchScoreLevel.EXCELLENT]: 'Відмінно',
  [MatchScoreLevel.GOOD]: 'Добре',
  [MatchScoreLevel.NORMAL]: 'Нормально',
  [MatchScoreLevel.NEEDS_ATTENTION]: 'Потребує уваги'
} as const;

export const MATCH_SCORE_COLORS = {
  [MatchScoreLevel.EXCELLENT]: 'text-green-600 bg-green-100',
  [MatchScoreLevel.GOOD]: 'text-blue-600 bg-blue-100',
  [MatchScoreLevel.NORMAL]: 'text-yellow-600 bg-yellow-100',
  [MatchScoreLevel.NEEDS_ATTENTION]: 'text-red-600 bg-red-100'
} as const;
