import OpenAI from 'openai';
import { User } from '../models/User';
import { Job } from '../models/Job';

// Підтримувані мови
export const SUPPORTED_LANGUAGES = ['en', 'pt', 'fr', 'uk', 'ru', 'de', 'pl', 'cs'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Мовні налаштування
const LANGUAGE_CONFIG = {
  en: { name: 'English', nativeName: 'English', isRTL: false },
  pt: { name: 'Portuguese', nativeName: 'Português', isRTL: false },
  fr: { name: 'French', nativeName: 'Français', isRTL: false },
  uk: { name: 'Ukrainian', nativeName: 'Українська', isRTL: false },
  ru: { name: 'Russian', nativeName: 'Русский', isRTL: false },
  de: { name: 'German', nativeName: 'Deutsch', isRTL: false },
  pl: { name: 'Polish', nativeName: 'Polski', isRTL: false },
  cs: { name: 'Czech', nativeName: 'Čeština', isRTL: false }
} as const;

export interface AIMatchResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  locationScore: number;
  salaryScore: number;
  reasoning: string;
  confidence: number;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Розрахунок AI матчингу кандидата та вакансії
   */
  async calculateAIMatchScore(candidate: User, job: Job, language: SupportedLanguage = 'en'): Promise<AIMatchResult> {
    try {
      const prompt = this.buildMatchingPrompt(candidate, job, language);

      const response = await this.openai.chat.completions.create({
        model: process.env.AI_DEFAULT_MODEL_GPT || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(language)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const content = response.choices[0].message.content?.trim() || '{}';
      const result = JSON.parse(content);
      
      return {
        overallScore: result.overallScore || 0,
        skillsScore: result.skillsScore || 0,
        experienceScore: result.experienceScore || 0,
        locationScore: result.locationScore || 0,
        salaryScore: result.salaryScore || 0,
        reasoning: result.reasoning || 'No reasoning provided',
        confidence: result.confidence || 0.5
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Fallback: повертаємо базовий скор на основі простих правил
      if (error.status === 429 || error.code === 'insufficient_quota') {
        console.warn('OpenAI quota exceeded, using fallback scoring');
        return this.calculateFallbackScore(candidate, job);
      }
      
      throw new Error('Failed to calculate AI match score');
    }
  }

  /**
   * Fallback розрахунок скору без OpenAI
   */
  private calculateFallbackScore(candidate: User, job: Job): AIMatchResult {
    let skillsScore = 0;
    let experienceScore = 0;
    let locationScore = 0;
    let salaryScore = 0;

    // Отримуємо профіль кандидата
    const candidateProfile = candidate.profiles && candidate.profiles.length > 0 ? candidate.profiles[0] : null;

    // Простий розрахунок скілів
    if (candidateProfile && candidateProfile.skills && job.requirements) {
      const candidateSkills = candidateProfile.skills.map(s => s.toLowerCase());
      const jobSkills = job.requirements.toLowerCase().split(/[,\s]+/);
      const matchingSkills = jobSkills.filter(skill => 
        candidateSkills.some(cSkill => cSkill.includes(skill.toLowerCase()))
      );
      skillsScore = Math.min(100, (matchingSkills.length / jobSkills.length) * 100);
    }

    // Простий розрахунок досвіду
    if (candidateProfile && candidateProfile.yearsOfExperience && job.experienceLevel) {
      const candidateExp = candidateProfile.yearsOfExperience;
      const experienceLevels = {
        'entry': 0,
        'junior': 1,
        'middle': 3,
        'senior': 5,
        'lead': 7,
        'executive': 10
      };
      const requiredExp = experienceLevels[job.experienceLevel] || 3;
      
      if (candidateExp >= requiredExp) {
        experienceScore = 100;
      } else {
        experienceScore = Math.max(0, (candidateExp / requiredExp) * 100);
      }
    }

    // Простий розрахунок локації
    if (candidateProfile && candidateProfile.location && job.location) {
      const candidateLocation = candidateProfile.location.toLowerCase();
      const jobLocation = job.location.toLowerCase();
      if (candidateLocation === jobLocation) {
        locationScore = 100;
      } else if (candidateLocation.includes('remote') || jobLocation.includes('remote')) {
        locationScore = 80;
      } else {
        locationScore = 50;
      }
    }

    // Простий розрахунок зарплати
    if (candidateProfile && candidateProfile.preferences && job.salaryMin) {
      const expectedSalary = candidateProfile.preferences.salaryExpectation || candidateProfile.preferences.desiredSalary;
      if (expectedSalary) {
        if (expectedSalary <= job.salaryMin) {
          salaryScore = 100;
        } else if (expectedSalary <= job.salaryMax) {
          salaryScore = 80;
        } else {
          salaryScore = Math.max(0, 100 - ((expectedSalary - job.salaryMax) / job.salaryMax) * 50);
        }
      } else {
        salaryScore = 70; // Середній скор якщо немає інформації
      }
    }

    const overallScore = (skillsScore + experienceScore + locationScore + salaryScore) / 4;

    return {
      overallScore: Math.round(overallScore),
      skillsScore: Math.round(skillsScore),
      experienceScore: Math.round(experienceScore),
      locationScore: Math.round(locationScore),
      salaryScore: Math.round(salaryScore),
      reasoning: 'Fallback scoring due to OpenAI API unavailability',
      confidence: 0.6
    };
  }

  /**
   * Перевірка здоров'я OpenAI API
   */
  async checkAPIHealth(): Promise<{
    isHealthy: boolean;
    model: string;
    error?: string;
  }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AI_DEFAULT_MODEL_GPT || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello, are you working?'
          }
        ],
        max_tokens: 10,
        temperature: 0,
      });

          return {
        isHealthy: true,
        model: process.env.AI_DEFAULT_MODEL_GPT || 'gpt-3.5-turbo',
      };
    } catch (error) {
      return {
        isHealthy: false,
        model: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Генерація рекомендацій на основі профілю кандидата
   */
  async generateJobRecommendations(candidate: User, jobs: Job[], language: SupportedLanguage = 'en'): Promise<{
    recommendations: Array<{
      jobId: string;
      score: number;
      reasoning: string;
    }>;
  }> {
    try {
      const prompt = this.buildJobRecommendationPrompt(candidate, jobs, language);

      const response = await this.openai.chat.completions.create({
        model: process.env.AI_DEFAULT_MODEL_GPT || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.getJobRecommendationSystemPrompt(language)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.4,
      });

      const content = response.choices[0].message.content?.trim() || '{}';
      const result = JSON.parse(content);
      
      return {
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error('OpenAI API error for job recommendations:', error);
      throw new Error('Failed to generate job recommendations');
    }
  }

  /**
   * Генерація рекомендацій кандидатів для вакансії
   */
  async generateCandidateRecommendations(job: Job, candidates: User[], language: SupportedLanguage = 'en'): Promise<{
    recommendations: Array<{
      candidateId: string;
      score: number;
      reasoning: string;
    }>;
  }> {
    try {
      const prompt = this.buildCandidateRecommendationPrompt(job, candidates, language);

      const response = await this.openai.chat.completions.create({
        model: process.env.AI_DEFAULT_MODEL_GPT || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.getCandidateRecommendationSystemPrompt(language)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.4,
      });

      const content = response.choices[0].message.content?.trim() || '{}';
      const result = JSON.parse(content);
      
      return {
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error('OpenAI API error for candidate recommendations:', error);
      throw new Error('Failed to generate candidate recommendations');
    }
  }

  private buildMatchingPrompt(candidate: User, job: Job, language: SupportedLanguage): string {
    const isUkrainian = language === 'uk';
    const isRussian = language === 'ru';
    const isGerman = language === 'de';
    const isFrench = language === 'fr';
    const isPortuguese = language === 'pt';
    const isPolish = language === 'pl';
    const isCzech = language === 'cs';
    
    const candidateInfo = {
      name: `${candidate.firstName} ${candidate.lastName}`,
      skills: candidate.skills || [],
      experience: candidate.experience || 0,
      location: candidate.location || 'Not specified',
      bio: candidate.bio || 'No bio available',
      education: candidate.education || 'Not specified',
      certifications: candidate.certifications || []
    };

    const jobInfo = {
      title: job.title,
      description: job.description || 'No description available',
      requiredSkills: job.skills || [],
      experienceLevel: job.experienceLevel || 'Not specified',
      location: job.location || 'Not specified',
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      company: job.company?.name || 'Unknown company'
    };

    if (isUkrainian) {
    return `
Проаналізуйте відповідність кандидата та вакансії та надайте оцінку в JSON форматі.
      
      КАНДИДАТ:
- Ім'я: ${candidateInfo.name}
- Навички: ${candidateInfo.skills.join(', ')}
- Досвід: ${candidateInfo.experience} років
- Локація: ${candidateInfo.location}
- Біо: ${candidateInfo.bio}
- Освіта: ${candidateInfo.education}
- Сертифікати: ${candidateInfo.certifications.join(', ')}
      
      ВАКАНСІЯ:
- Посада: ${jobInfo.title}
- Компанія: ${jobInfo.company}
- Опис: ${jobInfo.description}
- Необхідні навички: ${jobInfo.requiredSkills.join(', ')}
- Рівень досвіду: ${jobInfo.experienceLevel}
- Локація: ${jobInfo.location}
- Зарплата: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Надайте оцінку в JSON форматі:
{
  "overallScore": число від 0 до 100,
  "skillsScore": число від 0 до 100,
  "experienceScore": число від 0 до 100,
  "locationScore": число від 0 до 100,
  "salaryScore": число від 0 до 100,
  "reasoning": "детальне пояснення оцінки українською мовою",
  "confidence": число від 0 до 1
}
      `;
    } else if (isRussian) {
      return `
Проанализируйте соответствие кандидата и вакансии и предоставьте оценку в JSON формате.

КАНДИДАТ:
- Имя: ${candidateInfo.name}
- Навыки: ${candidateInfo.skills.join(', ')}
- Опыт: ${candidateInfo.experience} лет
- Локация: ${candidateInfo.location}
- Био: ${candidateInfo.bio}
- Образование: ${candidateInfo.education}
- Сертификаты: ${candidateInfo.certifications.join(', ')}

ВАКАНСИЯ:
- Должность: ${jobInfo.title}
- Компания: ${jobInfo.company}
- Описание: ${jobInfo.description}
- Требуемые навыки: ${jobInfo.requiredSkills.join(', ')}
- Уровень опыта: ${jobInfo.experienceLevel}
- Локация: ${jobInfo.location}
- Зарплата: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Предоставьте оценку в JSON формате:
{
  "overallScore": число от 0 до 100,
  "skillsScore": число от 0 до 100,
  "experienceScore": число от 0 до 100,
  "locationScore": число от 0 до 100,
  "salaryScore": число от 0 до 100,
  "reasoning": "детальное объяснение оценки на русском языке",
  "confidence": число от 0 до 1
}
      `;
    } else if (isGerman) {
      return `
Analysieren Sie die Übereinstimmung zwischen Kandidat und Stellenausschreibung und geben Sie eine Bewertung im JSON-Format.

KANDIDAT:
- Name: ${candidateInfo.name}
- Fähigkeiten: ${candidateInfo.skills.join(', ')}
- Erfahrung: ${candidateInfo.experience} Jahre
- Standort: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}
- Bildung: ${candidateInfo.education}
- Zertifikate: ${candidateInfo.certifications.join(', ')}

STELLE:
- Position: ${jobInfo.title}
- Unternehmen: ${jobInfo.company}
- Beschreibung: ${jobInfo.description}
- Erforderliche Fähigkeiten: ${jobInfo.requiredSkills.join(', ')}
- Erfahrungsniveau: ${jobInfo.experienceLevel}
- Standort: ${jobInfo.location}
- Gehalt: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Geben Sie eine Bewertung im JSON-Format:
{
  "overallScore": Zahl von 0 bis 100,
  "skillsScore": Zahl von 0 bis 100,
  "experienceScore": Zahl von 0 bis 100,
  "locationScore": Zahl von 0 bis 100,
  "salaryScore": Zahl von 0 bis 100,
  "reasoning": "detaillierte Erklärung der Bewertung auf Deutsch",
  "confidence": Zahl von 0 bis 1
}
      `;
    } else if (isFrench) {
      return `
Analysez la correspondance entre le candidat et le poste et fournissez une évaluation au format JSON.

CANDIDAT:
- Nom: ${candidateInfo.name}
- Compétences: ${candidateInfo.skills.join(', ')}
- Expérience: ${candidateInfo.experience} ans
- Localisation: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}
- Éducation: ${candidateInfo.education}
- Certificats: ${candidateInfo.certifications.join(', ')}

POSTE:
- Position: ${jobInfo.title}
- Entreprise: ${jobInfo.company}
- Description: ${jobInfo.description}
- Compétences requises: ${jobInfo.requiredSkills.join(', ')}
- Niveau d'expérience: ${jobInfo.experienceLevel}
- Localisation: ${jobInfo.location}
- Salaire: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Fournissez une évaluation au format JSON:
{
  "overallScore": nombre de 0 à 100,
  "skillsScore": nombre de 0 à 100,
  "experienceScore": nombre de 0 à 100,
  "locationScore": nombre de 0 à 100,
  "salaryScore": nombre de 0 à 100,
  "reasoning": "explication détaillée de l'évaluation en français",
  "confidence": nombre de 0 à 1
}
      `;
    } else if (isPortuguese) {
      return `
Analise a correspondência entre o candidato e a vaga e forneça uma avaliação no formato JSON.

CANDIDATO:
- Nome: ${candidateInfo.name}
- Habilidades: ${candidateInfo.skills.join(', ')}
- Experiência: ${candidateInfo.experience} anos
- Localização: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}
- Educação: ${candidateInfo.education}
- Certificados: ${candidateInfo.certifications.join(', ')}

VAGA:
- Posição: ${jobInfo.title}
- Empresa: ${jobInfo.company}
- Descrição: ${jobInfo.description}
- Habilidades necessárias: ${jobInfo.requiredSkills.join(', ')}
- Nível de experiência: ${jobInfo.experienceLevel}
- Localização: ${jobInfo.location}
- Salário: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Forneça uma avaliação no formato JSON:
{
  "overallScore": número de 0 a 100,
  "skillsScore": número de 0 a 100,
  "experienceScore": número de 0 a 100,
  "locationScore": número de 0 a 100,
  "salaryScore": número de 0 a 100,
  "reasoning": "explicação detalhada da avaliação em português",
  "confidence": número de 0 a 1
}
      `;
    } else if (isPolish) {
      return `
Przeanalizuj dopasowanie kandydata i oferty pracy oraz przedstaw ocenę w formacie JSON.

KANDYDAT:
- Imię: ${candidateInfo.name}
- Umiejętności: ${candidateInfo.skills.join(', ')}
- Doświadczenie: ${candidateInfo.experience} lat
- Lokalizacja: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}
- Edukacja: ${candidateInfo.education}
- Certyfikaty: ${candidateInfo.certifications.join(', ')}

OFERTA PRACY:
- Stanowisko: ${jobInfo.title}
- Firma: ${jobInfo.company}
- Opis: ${jobInfo.description}
- Wymagane umiejętności: ${jobInfo.requiredSkills.join(', ')}
- Poziom doświadczenia: ${jobInfo.experienceLevel}
- Lokalizacja: ${jobInfo.location}
- Wynagrodzenie: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Przedstaw ocenę w formacie JSON:
{
  "overallScore": liczba od 0 do 100,
  "skillsScore": liczba od 0 do 100,
  "experienceScore": liczba od 0 do 100,
  "locationScore": liczba od 0 do 100,
  "salaryScore": liczba od 0 do 100,
  "reasoning": "szczegółowe wyjaśnienie oceny w języku polskim",
  "confidence": liczba od 0 do 1
}
      `;
    } else if (isCzech) {
      return `
Analyzujte shodu mezi kandidátem a pracovní pozicí a poskytněte hodnocení ve formátu JSON.

KANDIDÁT:
- Jméno: ${candidateInfo.name}
- Dovednosti: ${candidateInfo.skills.join(', ')}
- Zkušenosti: ${candidateInfo.experience} let
- Lokalita: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}
- Vzdělání: ${candidateInfo.education}
- Certifikáty: ${candidateInfo.certifications.join(', ')}

PRACOVNÍ POZICE:
- Pozice: ${jobInfo.title}
- Společnost: ${jobInfo.company}
- Popis: ${jobInfo.description}
- Požadované dovednosti: ${jobInfo.requiredSkills.join(', ')}
- Úroveň zkušeností: ${jobInfo.experienceLevel}
- Lokalita: ${jobInfo.location}
- Plat: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Poskytněte hodnocení ve formátu JSON:
{
  "overallScore": číslo od 0 do 100,
  "skillsScore": číslo od 0 do 100,
  "experienceScore": číslo od 0 do 100,
  "locationScore": číslo od 0 do 100,
  "salaryScore": číslo od 0 do 100,
  "reasoning": "podrobné vysvětlení hodnocení v češtině",
  "confidence": číslo od 0 do 1
}
      `;
    } else {
      return `
Analyze the match between candidate and job position and provide a score in JSON format.

CANDIDATE:
- Name: ${candidateInfo.name}
- Skills: ${candidateInfo.skills.join(', ')}
- Experience: ${candidateInfo.experience} years
- Location: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}
- Education: ${candidateInfo.education}
- Certifications: ${candidateInfo.certifications.join(', ')}

JOB:
- Position: ${jobInfo.title}
- Company: ${jobInfo.company}
- Description: ${jobInfo.description}
- Required Skills: ${jobInfo.requiredSkills.join(', ')}
- Experience Level: ${jobInfo.experienceLevel}
- Location: ${jobInfo.location}
- Salary: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

Provide score in JSON format:
{
  "overallScore": number from 0 to 100,
  "skillsScore": number from 0 to 100,
  "experienceScore": number from 0 to 100,
  "locationScore": number from 0 to 100,
  "salaryScore": number from 0 to 100,
  "reasoning": "detailed explanation of the score in English",
  "confidence": number from 0 to 1
}
      `;
    }
  }

  private buildJobRecommendationPrompt(candidate: User, jobs: Job[], language: SupportedLanguage): string {
    const isUkrainian = language === 'uk';
    const isRussian = language === 'ru';
    const isGerman = language === 'de';
    const isFrench = language === 'fr';
    const isPortuguese = language === 'pt';
    const isPolish = language === 'pl';
    const isCzech = language === 'cs';
    
    const candidateInfo = {
      name: `${candidate.firstName} ${candidate.lastName}`,
      skills: candidate.skills || [],
      experience: candidate.experience || 0,
      location: candidate.location || 'Not specified',
      bio: candidate.bio || 'No bio available'
    };

    const jobsInfo = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || 'Unknown company',
      description: job.description || 'No description available',
      requiredSkills: job.skills || [],
      experienceLevel: job.experienceLevel || 'Not specified',
      location: job.location || 'Not specified',
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0
    }));

    if (isUkrainian) {
      return `
Проаналізуйте наступні вакансії для кандидата та надайте рекомендації в JSON форматі.

КАНДИДАТ:
- Ім'я: ${candidateInfo.name}
- Навички: ${candidateInfo.skills.join(', ')}
- Досвід: ${candidateInfo.experience} років
- Локація: ${candidateInfo.location}
- Біо: ${candidateInfo.bio}

ВАКАНСІЇ:
${jobsInfo.map(job => `
- ID: ${job.id}
- Посада: ${job.title}
- Компанія: ${job.company}
- Опис: ${job.description}
- Необхідні навички: ${job.requiredSkills.join(', ')}
- Рівень досвіду: ${job.experienceLevel}
- Локація: ${job.location}
- Зарплата: ${job.salaryMin} - ${job.salaryMax}
`).join('\n')}

Надайте рекомендації в JSON форматі:
{
  "recommendations": [
    {
      "jobId": "job_id",
      "score": число від 0 до 100,
      "reasoning": "пояснення українською мовою"
    }
  ]
}
      `;
    } else {
    return `
Analyze the following job positions for the candidate and provide recommendations in JSON format.
      
      CANDIDATE:
- Name: ${candidateInfo.name}
- Skills: ${candidateInfo.skills.join(', ')}
- Experience: ${candidateInfo.experience} years
- Location: ${candidateInfo.location}
- Bio: ${candidateInfo.bio}

JOBS:
${jobsInfo.map(job => `
- ID: ${job.id}
- Position: ${job.title}
- Company: ${job.company}
- Description: ${job.description}
- Required Skills: ${job.requiredSkills.join(', ')}
- Experience Level: ${job.experienceLevel}
- Location: ${job.location}
- Salary: ${job.salaryMin} - ${job.salaryMax}
`).join('\n')}

Provide recommendations in JSON format:
{
  "recommendations": [
    {
      "jobId": "job_id",
      "score": number from 0 to 100,
      "reasoning": "explanation in English"
    }
  ]
}
      `;
    }
  }

  private buildCandidateRecommendationPrompt(job: Job, candidates: User[], language: SupportedLanguage): string {
    const isUkrainian = language === 'uk';
    const isRussian = language === 'ru';
    const isGerman = language === 'de';
    const isFrench = language === 'fr';
    const isPortuguese = language === 'pt';
    const isPolish = language === 'pl';
    const isCzech = language === 'cs';
    
    const jobInfo = {
      title: job.title,
      description: job.description || 'No description available',
      requiredSkills: job.skills || [],
      experienceLevel: job.experienceLevel || 'Not specified',
      location: job.location || 'Not specified',
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      company: job.company?.name || 'Unknown company'
    };

    const candidatesInfo = candidates.map(candidate => ({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      skills: candidate.skills || [],
      experience: candidate.experience || 0,
      location: candidate.location || 'Not specified',
      bio: candidate.bio || 'No bio available'
    }));

    if (isUkrainian) {
      return `
Проаналізуйте наступних кандидатів для вакансії та надайте рекомендації в JSON форматі.

ВАКАНСІЯ:
- Посада: ${jobInfo.title}
- Компанія: ${jobInfo.company}
- Опис: ${jobInfo.description}
- Необхідні навички: ${jobInfo.requiredSkills.join(', ')}
- Рівень досвіду: ${jobInfo.experienceLevel}
- Локація: ${jobInfo.location}
- Зарплата: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

КАНДИДАТИ:
${candidatesInfo.map(candidate => `
- ID: ${candidate.id}
- Ім'я: ${candidate.name}
- Навички: ${candidate.skills.join(', ')}
- Досвід: ${candidate.experience} років
- Локація: ${candidate.location}
- Біо: ${candidate.bio}
`).join('\n')}

Надайте рекомендації в JSON форматі:
{
  "recommendations": [
    {
      "candidateId": "candidate_id",
      "score": число від 0 до 100,
      "reasoning": "пояснення українською мовою"
    }
  ]
}
      `;
    } else {
    return `
Analyze the following candidates for the job position and provide recommendations in JSON format.

JOB:
- Position: ${jobInfo.title}
- Company: ${jobInfo.company}
- Description: ${jobInfo.description}
- Required Skills: ${jobInfo.requiredSkills.join(', ')}
- Experience Level: ${jobInfo.experienceLevel}
- Location: ${jobInfo.location}
- Salary: ${jobInfo.salaryMin} - ${jobInfo.salaryMax}

CANDIDATES:
${candidatesInfo.map(candidate => `
- ID: ${candidate.id}
- Name: ${candidate.name}
- Skills: ${candidate.skills.join(', ')}
- Experience: ${candidate.experience} years
- Location: ${candidate.location}
- Bio: ${candidate.bio}
`).join('\n')}

Provide recommendations in JSON format:
{
  "recommendations": [
    {
      "candidateId": "candidate_id",
      "score": number from 0 to 100,
      "reasoning": "explanation in English"
    }
  ]
}
      `;
    }
  }

  private getSystemPrompt(language: SupportedLanguage): string {
    const isUkrainian = language === 'uk';
    const isRussian = language === 'ru';
    const isGerman = language === 'de';
    const isFrench = language === 'fr';
    const isPortuguese = language === 'pt';
    const isPolish = language === 'pl';
    const isCzech = language === 'cs';
    
    if (isUkrainian) {
      return `Ви експерт з підбору персоналу та аналізу відповідності кандидатів вакансіям. 
Ваше завдання - проаналізувати профіль кандидата та вимоги вакансії, а потім надати детальну оцінку відповідності.
Враховуйте навички, досвід роботи, локацію, зарплатні очікування та інші фактори.
Надавайте оцінки від 0 до 100, де 100 - ідеальна відповідність.
Завжди надавайте детальне пояснення вашої оцінки.`;
    } else if (isRussian) {
      return `Вы эксперт по подбору персонала и анализу соответствия кандидатов вакансиям.
Ваша задача - проанализировать профиль кандидата и требования вакансии, а затем предоставить детальную оценку соответствия.
Учитывайте навыки, опыт работы, локацию, зарплатные ожидания и другие факторы.
Предоставляйте оценки от 0 до 100, где 100 - идеальное соответствие.
Всегда предоставляйте детальное объяснение вашей оценки.`;
    } else if (isGerman) {
      return `Sie sind ein Experte für Personalbeschaffung und Kandidaten-Stellen-Matching-Analyse.
Ihre Aufgabe ist es, das Profil des Kandidaten und die Stellenanforderungen zu analysieren und dann eine detaillierte Kompatibilitätsbewertung zu erstellen.
Berücksichtigen Sie Fähigkeiten, Berufserfahrung, Standort, Gehaltserwartungen und andere Faktoren.
Geben Sie Bewertungen von 0 bis 100, wobei 100 eine perfekte Übereinstimmung ist.
Geben Sie immer eine detaillierte Begründung für Ihre Bewertung.`;
    } else if (isFrench) {
      return `Vous êtes un expert en acquisition de talents et en analyse de correspondance candidat-poste.
Votre tâche est d'analyser le profil du candidat et les exigences du poste, puis de fournir une évaluation détaillée de la compatibilité.
Considérez les compétences, l'expérience professionnelle, la localisation, les attentes salariales et d'autres facteurs.
Fournissez des scores de 0 à 100, où 100 est une correspondance parfaite.
Fournissez toujours un raisonnement détaillé pour votre évaluation.`;
    } else if (isPortuguese) {
      return `Você é um especialista em aquisição de talentos e análise de correspondência candidato-vaga.
Sua tarefa é analisar o perfil do candidato e os requisitos da vaga, depois fornecer uma avaliação detalhada de compatibilidade.
Considere habilidades, experiência profissional, localização, expectativas salariais e outros fatores.
Forneça pontuações de 0 a 100, onde 100 é uma correspondência perfeita.
Sempre forneça um raciocínio detalhado para sua avaliação.`;
    } else if (isPolish) {
      return `Jesteś ekspertem w zakresie rekrutacji i analizy dopasowania kandydatów do ofert pracy.
Twoim zadaniem jest przeanalizowanie profilu kandydata i wymagań stanowiska, a następnie przedstawienie szczegółowej oceny zgodności.
Uwzględnij umiejętności, doświadczenie zawodowe, lokalizację, oczekiwania płacowe i inne czynniki.
Przedstaw oceny od 0 do 100, gdzie 100 to idealne dopasowanie.
Zawsze przedstaw szczegółowe uzasadnienie swojej oceny.`;
    } else if (isCzech) {
      return `Jste expert na získávání talentů a analýzu shody kandidátů s pracovními pozicemi.
Vaším úkolem je analyzovat profil kandidáta a požadavky pozice, pak poskytnout podrobnou hodnotící kompatibility.
Zvažte dovednosti, pracovní zkušenosti, lokalizaci, platové očekávání a další faktory.
Poskytněte hodnocení od 0 do 100, kde 100 je perfektní shoda.
Vždy poskytněte podrobné zdůvodnění vašeho hodnocení.`;
    } else {
      return `You are an expert in talent acquisition and candidate-job matching analysis.
Your task is to analyze a candidate's profile and job requirements, then provide a detailed compatibility assessment.
Consider skills, work experience, location, salary expectations, and other factors.
Provide scores from 0 to 100, where 100 is a perfect match.
Always provide detailed reasoning for your assessment.`;
    }
  }

  private getJobRecommendationSystemPrompt(language: SupportedLanguage): string {
    const isUkrainian = language === 'uk';
    const isRussian = language === 'ru';
    const isGerman = language === 'de';
    const isFrench = language === 'fr';
    const isPortuguese = language === 'pt';
    const isPolish = language === 'pl';
    const isCzech = language === 'cs';
    
    if (isUkrainian) {
      return `Ви експерт з підбору персоналу. Ваше завдання - проаналізувати список вакансій та надати рекомендації для конкретного кандидата.
Враховуйте профіль кандидата, його навички, досвід та інші фактори.
Надавайте оцінки від 0 до 100 та детальне пояснення для кожної рекомендації.`;
    } else if (isRussian) {
      return `Вы эксперт по подбору персонала. Ваша задача - проанализировать список вакансий и предоставить рекомендации для конкретного кандидата.
Учитывайте профиль кандидата, его навыки, опыт и другие факторы.
Предоставляйте оценки от 0 до 100 и детальное объяснение для каждой рекомендации.`;
    } else if (isGerman) {
      return `Sie sind ein Experte für Personalbeschaffung. Ihre Aufgabe ist es, eine Liste von Stellenausschreibungen zu analysieren und Empfehlungen für einen bestimmten Kandidaten zu geben.
Berücksichtigen Sie das Profil des Kandidaten, seine Fähigkeiten, Erfahrung und andere Faktoren.
Geben Sie Bewertungen von 0 bis 100 und detaillierte Begründungen für jede Empfehlung.`;
    } else if (isFrench) {
      return `Vous êtes un expert en acquisition de talents. Votre tâche est d'analyser une liste de postes et de fournir des recommandations pour un candidat spécifique.
Considérez le profil du candidat, ses compétences, son expérience et d'autres facteurs.
Fournissez des scores de 0 à 100 et un raisonnement détaillé pour chaque recommandation.`;
    } else if (isPortuguese) {
      return `Você é um especialista em aquisição de talentos. Sua tarefa é analisar uma lista de vagas e fornecer recomendações para um candidato específico.
Considere o perfil do candidato, suas habilidades, experiência e outros fatores.
Forneça pontuações de 0 a 100 e raciocínio detalhado para cada recomendação.`;
    } else if (isPolish) {
      return `Jesteś ekspertem w zakresie rekrutacji. Twoim zadaniem jest przeanalizowanie listy ofert pracy i przedstawienie rekomendacji dla konkretnego kandydata.
Uwzględnij profil kandydata, jego umiejętności, doświadczenie i inne czynniki.
Przedstaw oceny od 0 do 100 i szczegółowe uzasadnienie dla każdej rekomendacji.`;
    } else if (isCzech) {
      return `Jste expert na získávání talentů. Vaším úkolem je analyzovat seznam pracovních pozic a poskytnout doporučení pro konkrétního kandidáta.
Zvažte profil kandidáta, jeho dovednosti, zkušenosti a další faktory.
Poskytněte hodnocení od 0 do 100 a podrobné zdůvodnění pro každé doporučení.`;
    } else {
      return `You are an expert in talent acquisition. Your task is to analyze a list of job positions and provide recommendations for a specific candidate.
Consider the candidate's profile, skills, experience, and other factors.
Provide scores from 0 to 100 and detailed reasoning for each recommendation.`;
    }
  }

  private getCandidateRecommendationSystemPrompt(language: SupportedLanguage): string {
    const isUkrainian = language === 'uk';
    const isRussian = language === 'ru';
    const isGerman = language === 'de';
    const isFrench = language === 'fr';
    const isPortuguese = language === 'pt';
    const isPolish = language === 'pl';
    const isCzech = language === 'cs';
    
    if (isUkrainian) {
      return `Ви експерт з підбору персоналу. Ваше завдання - проаналізувати список кандидатів та надати рекомендації для конкретної вакансії.
Враховуйте вимоги вакансії, навички кандидатів, їх досвід та інші фактори.
Надавайте оцінки від 0 до 100 та детальне пояснення для кожної рекомендації.`;
    } else if (isRussian) {
      return `Вы эксперт по подбору персонала. Ваша задача - проанализировать список кандидатов и предоставить рекомендации для конкретной вакансии.
Учитывайте требования вакансии, навыки кандидатов, их опыт и другие факторы.
Предоставляйте оценки от 0 до 100 и детальное объяснение для каждой рекомендации.`;
    } else if (isGerman) {
      return `Sie sind ein Experte für Personalbeschaffung. Ihre Aufgabe ist es, eine Liste von Kandidaten zu analysieren und Empfehlungen für eine bestimmte Stellenausschreibung zu geben.
Berücksichtigen Sie die Stellenanforderungen, die Fähigkeiten der Kandidaten, ihre Erfahrung und andere Faktoren.
Geben Sie Bewertungen von 0 bis 100 und detaillierte Begründungen für jede Empfehlung.`;
    } else if (isFrench) {
      return `Vous êtes un expert en acquisition de talents. Votre tâche est d'analyser une liste de candidats et de fournir des recommandations pour un poste spécifique.
Considérez les exigences du poste, les compétences des candidats, leur expérience et d'autres facteurs.
Fournissez des scores de 0 à 100 et un raisonnement détaillé pour chaque recommandation.`;
    } else if (isPortuguese) {
      return `Você é um especialista em aquisição de talentos. Sua tarefa é analisar uma lista de candidatos e fornecer recomendações para uma vaga específica.
Considere os requisitos da vaga, as habilidades dos candidatos, sua experiência e outros fatores.
Forneça pontuações de 0 a 100 e raciocínio detalhado para cada recomendação.`;
    } else if (isPolish) {
      return `Jesteś ekspertem w zakresie rekrutacji. Twoim zadaniem jest przeanalizowanie listy kandydatów i przedstawienie rekomendacji dla konkretnej oferty pracy.
Uwzględnij wymagania oferty, umiejętności kandydatów, ich doświadczenie i inne czynniki.
Przedstaw oceny od 0 do 100 i szczegółowe uzasadnienie dla każdej rekomendacji.`;
    } else if (isCzech) {
      return `Jste expert na získávání talentů. Vaším úkolem je analyzovat seznam kandidátů a poskytnout doporučení pro konkrétní pracovní pozici.
Zvažte požadavky pozice, dovednosti kandidátů, jejich zkušenosti a další faktory.
Poskytněte hodnocení od 0 do 100 a podrobné zdůvodnění pro každé doporučení.`;
    } else {
      return `You are an expert in talent acquisition. Your task is to analyze a list of candidates and provide recommendations for a specific job position.
Consider the job requirements, candidates' skills, experience, and other factors.
Provide scores from 0 to 100 and detailed reasoning for each recommendation.`;
    }
  }
}

export const openAIService = new OpenAIService();