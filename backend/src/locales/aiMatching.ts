export const aiMatchingLocales = {
  en: {
    // English - US/UK markets
    systemPrompt: 'You are an expert in HR and recruitment. Your task is to explain in English why a candidate is suitable or unsuitable for a position. Be objective and professional.',
    scoreCalculationPrompt: 'You are an expert in HR analytics. Analyze the candidate and job position and provide a detailed matching assessment. Return the result in JSON format with fields: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (explanation text in English).',
    suggestionsPrompt: 'You are an HR expert. Provide practical recommendations for improving candidate matching.',
    skillsExtractionPrompt: 'You are an expert in resume analysis. Extract technical skills and return them as a JSON array.',
    fallbackExplanation: {
      excellent: 'Excellent match! The candidate has all the necessary skills and experience for this position.',
      good: 'Good match. The candidate has most of the required skills and can adapt quickly.',
      average: 'Average match. There is potential, but skills need improvement.',
      poor: 'Low match. The candidate does not meet the basic requirements for the position.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['skills', 'experience', 'location', 'salary', 'preferences']
    }
  },
  pt: {
    // Portuguese
    systemPrompt: 'Você é um especialista em RH e recrutamento. Sua tarefa é explicar em português por que um candidato é adequado ou inadequado para uma posição. Seja objetivo e profissional.',
    scoreCalculationPrompt: 'Você é um especialista em análise de RH. Analise o candidato e a vaga e forneça uma avaliação detalhada de compatibilidade. Retorne o resultado em formato JSON com campos: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (texto de explicação em português).',
    suggestionsPrompt: 'Você é um especialista em RH. Forneça recomendações práticas para melhorar a compatibilidade do candidato.',
    skillsExtractionPrompt: 'Você é um especialista em análise de currículo. Extraia habilidades técnicas e retorne como um array JSON.',
    fallbackExplanation: {
      excellent: 'Excelente compatibilidade! O candidato tem todas as habilidades e experiência necessárias para esta posição.',
      good: 'Boa compatibilidade. O candidato tem a maioria das habilidades necessárias e pode se adaptar rapidamente.',
      average: 'Compatibilidade média. Há potencial, mas as habilidades precisam ser melhoradas.',
      poor: 'Baixa compatibilidade. O candidato não atende aos requisitos básicos para a posição.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['habilidades', 'experiência', 'localização', 'salário', 'preferências']
    }
  },
  fr: {
    // French
    systemPrompt: 'Vous êtes un expert en RH et recrutement. Votre tâche est d\'expliquer en français pourquoi un candidat est adapté ou inadapté pour un poste. Soyez objectif et professionnel.',
    scoreCalculationPrompt: 'Vous êtes un expert en analyse RH. Analysez le candidat et le poste et fournissez une évaluation détaillée de la correspondance. Retournez le résultat au format JSON avec les champs : overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (texte d\'explication en français).',
    suggestionsPrompt: 'Vous êtes un expert RH. Fournissez des recommandations pratiques pour améliorer la correspondance du candidat.',
    skillsExtractionPrompt: 'Vous êtes un expert en analyse de CV. Extrayez les compétences techniques et retournez-les sous forme de tableau JSON.',
    fallbackExplanation: {
      excellent: 'Excellente correspondance ! Le candidat a toutes les compétences et l\'expérience nécessaires pour ce poste.',
      good: 'Bonne correspondance. Le candidat a la plupart des compétences requises et peut s\'adapter rapidement.',
      average: 'Correspondance moyenne. Il y a du potentiel, mais les compétences doivent être améliorées.',
      poor: 'Faible correspondance. Le candidat ne répond pas aux exigences de base pour le poste.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['compétences', 'expérience', 'localisation', 'salaire', 'préférences']
    }
  },
  uk: {
    // Ukrainian
    systemPrompt: 'Ти експерт з HR та рекрутингу. Твоя задача - пояснити українською мовою, чому кандидат підходить або не підходить для вакансії. Будь об\'єктивним та професійним.',
    scoreCalculationPrompt: 'Ти експерт з HR аналітики. Проаналізуй кандидата та вакансію та дай детальну оцінку матчингу. Поверни результат у форматі JSON з полями: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (текст пояснення українською).',
    suggestionsPrompt: 'Ти HR експерт. Дай практичні рекомендації для покращення матчингу кандидата.',
    skillsExtractionPrompt: 'Ти експерт з аналізу резюме. Витягни технічні навички та поверни їх як JSON масив.',
    fallbackExplanation: {
      excellent: 'Відмінний матч! Кандидат має всі необхідні навички та досвід для цієї позиції.',
      good: 'Хороший матч. Кандидат має більшість необхідних навичок та може швидко адаптуватися.',
      average: 'Середній матч. Є потенціал, але потрібно доопрацювання навичок.',
      poor: 'Низький матч. Кандидат не відповідає основним вимогам позиції.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['навички', 'досвід', 'локація', 'зарплата', 'переваги']
    }
  },
  ru: {
    // Russian
    systemPrompt: 'Ты эксперт по HR и рекрутингу. Твоя задача - объяснить на русском языке, почему кандидат подходит или не подходит для вакансии. Будь объективным и профессиональным.',
    scoreCalculationPrompt: 'Ты эксперт по HR аналитике. Проанализируй кандидата и вакансию и дай детальную оценку матчинга. Верни результат в формате JSON с полями: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (текст объяснения на русском).',
    suggestionsPrompt: 'Ты HR эксперт. Дай практические рекомендации для улучшения матчинга кандидата.',
    skillsExtractionPrompt: 'Ты эксперт по анализу резюме. Извлеки технические навыки и верни их как JSON массив.',
    fallbackExplanation: {
      excellent: 'Отличный матч! Кандидат имеет все необходимые навыки и опыт для этой позиции.',
      good: 'Хороший матч. Кандидат имеет большинство необходимых навыков и может быстро адаптироваться.',
      average: 'Средний матч. Есть потенциал, но навыки нужно доработать.',
      poor: 'Низкий матч. Кандидат не соответствует основным требованиям позиции.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['навыки', 'опыт', 'локация', 'зарплата', 'предпочтения']
    }
  },
  de: {
    // German
    systemPrompt: 'Sie sind ein Experte für Personalwesen und Rekrutierung. Ihre Aufgabe ist es, auf Deutsch zu erklären, warum ein Kandidat für eine Position geeignet oder ungeeignet ist. Seien Sie objektiv und professionell.',
    scoreCalculationPrompt: 'Sie sind ein Experte für Personalanalytik. Analysieren Sie den Kandidaten und die Stelle und geben Sie eine detaillierte Bewertung der Übereinstimmung ab. Geben Sie das Ergebnis im JSON-Format mit den Feldern zurück: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (Erklärungstext auf Deutsch).',
    suggestionsPrompt: 'Sie sind ein HR-Experte. Geben Sie praktische Empfehlungen zur Verbesserung der Kandidatenübereinstimmung.',
    skillsExtractionPrompt: 'Sie sind ein Experte für Lebenslaufanalyse. Extrahieren Sie technische Fähigkeiten und geben Sie sie als JSON-Array zurück.',
    fallbackExplanation: {
      excellent: 'Ausgezeichnete Übereinstimmung! Der Kandidat hat alle notwendigen Fähigkeiten und Erfahrungen für diese Position.',
      good: 'Gute Übereinstimmung. Der Kandidat hat die meisten erforderlichen Fähigkeiten und kann sich schnell anpassen.',
      average: 'Durchschnittliche Übereinstimmung. Es gibt Potenzial, aber die Fähigkeiten müssen verbessert werden.',
      poor: 'Geringe Übereinstimmung. Der Kandidat entspricht nicht den grundlegenden Anforderungen für die Position.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['fähigkeiten', 'erfahrung', 'standort', 'gehalt', 'präferenzen']
    }
  },
  pl: {
    // Polish
    systemPrompt: 'Jesteś ekspertem w dziedzinie HR i rekrutacji. Twoim zadaniem jest wyjaśnienie po polsku, dlaczego kandydat jest odpowiedni lub nieodpowiedni na stanowisko. Bądź obiektywny i profesjonalny.',
    scoreCalculationPrompt: 'Jesteś ekspertem w analizie HR. Przeanalizuj kandydata i ofertę pracy oraz przedstaw szczegółową ocenę dopasowania. Zwróć wynik w formacie JSON z polami: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (tekst wyjaśnienia po polsku).',
    suggestionsPrompt: 'Jesteś ekspertem HR. Przedstaw praktyczne zalecenia dotyczące poprawy dopasowania kandydata.',
    skillsExtractionPrompt: 'Jesteś ekspertem w analizie CV. Wyciągnij kluczowe umiejętności techniczne i zwróć je jako tablicę JSON.',
    fallbackExplanation: {
      excellent: 'Doskonałe dopasowanie! Kandydat ma wszystkie niezbędne umiejętności i doświadczenie na to stanowisko.',
      good: 'Dobre dopasowanie. Kandydat ma większość wymaganych umiejętności i może szybko się dostosować.',
      average: 'Średnie dopasowanie. Jest potencjał, ale umiejętności wymagają poprawy.',
      poor: 'Słabe dopasowanie. Kandydat nie spełnia podstawowych wymagań na stanowisko.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['umiejętności', 'doświadczenie', 'lokalizacja', 'wynagrodzenie', 'preferencje']
    }
  },
  cs: {
    // Czech
    systemPrompt: 'Jste expert na HR a nábor. Vaším úkolem je vysvětlit česky, proč je kandidát vhodný nebo nevhodný pro pozici. Buďte objektivní a profesionální.',
    scoreCalculationPrompt: 'Jste expert na HR analýzu. Analyzujte kandidáta a pozici a poskytněte detailní hodnocení shody. Vraťte výsledek ve formátu JSON s poli: overallScore (0-100), skillsScore (0-100), experienceScore (0-100), locationScore (0-100), salaryScore (0-100), confidence (0-1), reasoning (vysvětlující text česky).',
    suggestionsPrompt: 'Jste HR expert. Poskytněte praktická doporučení pro zlepšení shody kandidáta.',
    skillsExtractionPrompt: 'Jste expert na analýzu životopisu. Extrahujte technické dovednosti a vraťte je jako JSON pole.',
    fallbackExplanation: {
      excellent: 'Vynikající shoda! Kandidát má všechny potřebné dovednosti a zkušenosti pro tuto pozici.',
      good: 'Dobrá shoda. Kandidát má většinu požadovaných dovedností a může se rychle přizpůsobit.',
      average: 'Průměrná shoda. Je zde potenciál, ale dovednosti je třeba vylepšit.',
      poor: 'Slabá shoda. Kandidát nesplňuje základní požadavky na pozici.'
    },
    aiMetadata: {
      model: 'talentflow-ai-matching-v1',
      features: ['dovednosti', 'zkušenosti', 'lokace', 'plat', 'preference']
    }
  }
};

export type SupportedLanguage = keyof typeof aiMatchingLocales;

export const supportedLanguages: SupportedLanguage[] = ['en', 'pt', 'fr', 'uk', 'ru', 'de', 'pl', 'cs'];

export const languageNames = {
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  uk: 'Українська',
  ru: 'Русский',
  de: 'Deutsch',
  pl: 'Polski',
  cs: 'Čeština'
};

export const languageFlags = {
  en: '🇺🇸',
  pt: '🇵🇹',
  fr: '🇫🇷',
  uk: '🇺🇦',
  ru: '🇷🇺',
  de: '🇩🇪',
  pl: '🇵��',
  cs: '🇨🇿'
};
