# 🌍 AI Matching Localization Guide

## 📋 Підтримувані мови

TalentFlow AI Matching підтримує **8 мов** для міжнародних ринків:

| Код | Мова | Прапорець | Ринки | Населення |
|-----|------|-----------|-------|-----------|
| `en` | English | 🇺🇸 | US/UK/International | ~1.5B |
| `pt` | Português | 🇵🇹 | Portugal/Brazil | ~260M |
| `fr` | Français | 🇫🇷 | France/Canada | ~300M |
| `uk` | Українська | 🇺🇦 | Ukraine | ~40M |
| `ru` | Русский | 🇷🇺 | Russia/CIS | ~260M |
| `de` | Deutsch | 🇩🇪 | Germany/Austria | ~100M |
| `pl` | Polski | 🇵🇱 | Poland | ~40M |
| `cs` | Čeština | 🇨🇿 | Czech Republic | ~10M |

## 🚀 Використання локалізації

### 1. Отримання списку мов

```http
GET /api/ai-matching/languages
```

**Response:**
```json
{
  "success": true,
  "data": {
    "languages": [
      {
        "code": "en",
        "name": "English",
        "flag": "🇺🇸",
        "markets": "US/UK"
      },
      {
        "code": "pt",
        "name": "Português",
        "flag": "🇵🇹",
        "markets": "Portugal/Brazil"
      }
      // ... інші мови
    ],
    "total": 8,
    "default": "en"
  }
}
```

### 2. Генерація рекомендацій з локалізацією

```http
POST /api/ai-matching/generate?lang=pt
```

**Request Body:**
```json
{
  "candidateId": "uuid",
  "type": "candidate_to_job",
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Generated 10 recommendations in pt",
  "language": "pt"
}
```

### 3. Отримання рекомендацій з локалізацією

```http
GET /api/ai-matching/recommendations?lang=de&minMatchScore=80
```

## 🔧 Технічна реалізація

### Структура локалізації

```typescript
export const aiMatchingLocales = {
  en: {
    systemPrompt: 'You are an expert in HR and recruitment...',
    scoreCalculationPrompt: 'You are an expert in HR analytics...',
    suggestionsPrompt: 'You are an HR expert...',
    skillsExtractionPrompt: 'You are an expert in resume analysis...',
    fallbackExplanation: {
      excellent: 'Excellent match!...',
      good: 'Good match...',
      average: 'Average match...',
      poor: 'Low match...'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['skills', 'experience', 'location', 'salary', 'preferences']
    }
  }
  // ... інші мови
};
```

### OpenAI промпти для кожної мови

#### English (en)
- **System Prompt**: "You are an expert in HR and recruitment. Your task is to explain in English why a candidate is suitable or unsuitable for a position. Be objective and professional."
- **Score Calculation**: "You are an expert in HR analytics. Analyze the candidate and job position and provide a detailed matching assessment..."

#### Português (pt)
- **System Prompt**: "Você é um especialista em RH e recrutamento. Sua tarefa é explicar em português por que um candidato é adequado ou inadequado para uma posição..."
- **Score Calculation**: "Você é um especialista em análise de RH. Analise o candidato e a vaga e forneça uma avaliação detalhada de compatibilidade..."

#### Français (fr)
- **System Prompt**: "Vous êtes un expert en RH et recrutement. Votre tâche est d'expliquer en français pourquoi un candidat est adapté ou inadapté pour un poste..."
- **Score Calculation**: "Vous êtes un expert en analyse RH. Analysez le candidat et le poste et fournissez une évaluation détaillée..."

#### Українська (uk)
- **System Prompt**: "Ти експерт з HR та рекрутингу. Твоя задача - пояснити українською мовою, чому кандидат підходить або не підходить для вакансії..."
- **Score Calculation**: "Ти експерт з HR аналітики. Проаналізуй кандидата та вакансію та дай детальну оцінку матчингу..."

#### Русский (ru)
- **System Prompt**: "Ты эксперт по HR и рекрутингу. Твоя задача - объяснить на русском языке, почему кандидат подходит или не подходит для вакансии..."
- **Score Calculation**: "Ты эксперт по HR аналитике. Проанализируй кандидата и вакансию и дай детальную оценку матчинга..."

#### Deutsch (de)
- **System Prompt**: "Sie sind ein Experte für Personalwesen und Rekrutierung. Ihre Aufgabe ist es, auf Deutsch zu erklären, warum ein Kandidat für eine Position geeignet oder ungeeignet ist..."
- **Score Calculation**: "Sie sind ein Experte für Personalanalytik. Analysieren Sie den Kandidaten und die Stelle und geben Sie eine detaillierte Bewertung..."

#### Polski (pl)
- **System Prompt**: "Jesteś ekspertem w dziedzinie HR i rekrutacji. Twoim zadaniem jest wyjaśnienie po polsku, dlaczego kandydat jest odpowiedni lub nieodpowiedni na stanowisko..."
- **Score Calculation**: "Jesteś ekspertem w analizie HR. Przeanalizuj kandydata i ofertę pracy oraz przedstaw szczegółową ocenę dopasowania..."

#### Čeština (cs)
- **System Prompt**: "Jste expert na HR a nábor. Vaším úkolem je vysvětlit česky, proč je kandidát vhodný nebo nevhodný pro pozici..."
- **Score Calculation**: "Jste expert na HR analýzu. Analyzujte kandidáta a pozici a poskytněte detailní hodnocení shody..."

## 🌐 Міжнародні ринки

### 1. **English (US/UK)** 🇺🇸🇬🇧
- **Ринки**: США, Великобританія, Канада, Австралія, Нова Зеландія
- **Переваги**: Найбільший ринок, висока конкуренція, високі зарплати
- **Особливості**: Строгі вимоги до навичок, детальні технічні інтерв'ю

### 2. **Português (Portugal/Brazil)** 🇵🇹🇧🇷
- **Ринки**: Португалія, Бразилія, Ангола, Мозамбік
- **Переваги**: Швидко зростаючий IT сектор, молоді таланти
- **Особливості**: Важливість особистих зв'язків, менш формальні процеси

### 3. **Français (France/Canada)** 🇫🇷🇨🇦
- **Ринки**: Франція, Канада, Бельгія, Швейцарія
- **Переваги**: Високі стандарти якості, соціальні гарантії
- **Особливості**: Важливість освіти, формальні процеси найму

### 4. **Українська (Ukraine)** 🇺🇦
- **Ринки**: Україна, діаспора
- **Переваги**: Висококваліфіковані розробники, конкурентоспроможні ціни
- **Особливості**: Віддалена робота, гнучкі умови

### 5. **Русский (Russia/CIS)** 🇷🇺
- **Ринки**: Росія, Казахстан, Білорусь, Узбекистан
- **Переваги**: Велика кількість талантів, технічна освіта
- **Особливості**: Регіональні відмінності, бюрократія

### 6. **Deutsch (Germany/Austria)** 🇩🇪🇦🇹
- **Ринки**: Німеччина, Австрія, Швейцарія
- **Переваги**: Високі зарплати, стабільність, якість
- **Особливості**: Сертифікати, формальна освіта, мовні вимоги

### 7. **Polski (Poland)** 🇵🇱
- **Ринки**: Польща, діаспора
- **Переваги**: Близькість до ЄС, конкурентоспроможні ціни
- **Особливості**: Швидко зростаючий ринок, англомовність

### 8. **Čeština (Czech Republic)** 🇨🇿
- **Ринки**: Чехія, Словаччина
- **Переваги**: Центральна Європа, висока якість життя
- **Особливості**: Менший ринок, високі стандарти

## 🔧 Налаштування

### Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=your_key_here
AI_MODEL=gpt-4
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1000

# Localization
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,pt,fr,uk,ru,de,pl,cs
```

### Додавання нової мови

1. **Додати в `aiMatchingLocales`:**
```typescript
it: {
  systemPrompt: 'Sei un esperto di HR e reclutamento...',
  // ... інші переклади
}
```

2. **Додати в `supportedLanguages`:**
```typescript
export const supportedLanguages: SupportedLanguage[] = ['en', 'pt', 'fr', 'uk', 'ru', 'de', 'pl', 'cs', 'it'];
```

3. **Додати в `languageNames`:**
```typescript
export const languageNames = {
  // ... existing
  it: 'Italiano'
};
```

## 📊 Метрики та аналітика

### Відстеження використання мов

```typescript
interface LanguageUsage {
  language: SupportedLanguage;
  requests: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
}
```

### A/B тестування мов

- Порівняння ефективності різних мов
- Аналіз культурних відмінностей
- Оптимізація промптів для кожної мови

## 🚀 Майбутні покращення

### Планується:
- [ ] Автоматине визначення мови користувача
- [ ] Динамічні промпти на основі культурного контексту
- [ ] Локалізація UI/UX
- [ ] Підтримка діалектів та регіональних варіацій
- [ ] Машинне навчання для покращення перекладів

### Розширення ринків:
- [ ] **Азія**: Китайська, Японська, Корейська
- [ ] **Близький Схід**: Арабська, Турецька
- [ ] **Африка**: Суахілі, Арабська
- [ ] **Південна Азія**: Індійські мови

---

## 🎯 Висновок

**TalentFlow AI Matching** тепер підтримує **8 мов** та готовий для міжнародних ринків!

✅ **Готово:**
- Повна локалізація для 8 мов
- Адаптовані промпти для кожної мови
- Підтримка культурних особливостей
- API для роботи з різними мовами

🚀 **Переваги:**
- Вихід на міжнародні ринки
- Покращена точність AI для різних мов
- Культурна адаптація
- Масштабованість

**TalentFlow** - Де талант знаходить свою роботу на будь-якій мові! 🌍✨
