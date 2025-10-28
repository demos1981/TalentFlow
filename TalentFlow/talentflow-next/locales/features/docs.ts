export const docsTranslations = {
  en: {
    // Docs page main content
    apiDocumentation: 'API Documentation',
    completeApiDocumentationAndGuides: 'Complete TalentFlow API documentation and usage guides',
    searchDocumentation: 'Search documentation...',
    usageExample: 'Usage Example',
    apiEndpoints: 'API Endpoints',
    quickLinks: 'Quick Links',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Health Check',
    github: 'GitHub',
    
    // API sections
    overview: 'API Overview',
    overviewDescription: 'General information about TalentFlow API',
    authentication: 'Authentication',
    authenticationDescription: 'JWT tokens and authorization',
    jobs: 'Jobs',
    jobsDescription: 'Managing job postings and positions',
    candidates: 'Candidates',
    candidatesDescription: 'Managing candidates and profiles',
    applications: 'Applications',
    applicationsDescription: 'Managing job applications',
    interviews: 'Interviews',
    interviewsDescription: 'Planning and managing interviews',
    analytics: 'Analytics',
    analyticsDescription: 'Statistics and reports',
    settings: 'Settings',
    settingsDescription: 'API for managing settings',
    
    // API content
    apiOverviewContent: 'TalentFlow API is a RESTful API for working with the HR platform. The API allows you to manage jobs, candidates, companies and other system entities.',
    apiFeatures: 'Key Features:',
    restfulArchitecture: 'RESTful architecture',
    jsonDataFormat: 'JSON data format',
    jwtAuthentication: 'JWT authentication',
    rateLimiting: 'Rate limiting',
    inputValidation: 'Input validation',
    detailedDocumentation: 'Detailed documentation',
    
    // Authentication content
    authContent: 'All API requests (except public endpoints) require authentication via JWT tokens.',
    authProcess: 'Authentication process:',
    getToken: 'Get token via /auth/login',
    useToken: 'Use token in Authorization header',
    refreshToken: 'Refresh token via /auth/refresh',
    
    // Jobs content
    jobsContent: 'API for creating, editing and managing job postings. Supports advanced filters, search and AI recommendations.',
    jobsFeatures: 'Key features:',
    createEditJobs: 'Creating and editing jobs',
    searchFilter: 'Search and filtering',
    aiRecommendations: 'AI candidate recommendations',
    statisticsAnalytics: 'Statistics and analytics',
    
    // Candidates content
    candidatesContent: 'API for working with candidates, their profiles and applications. Includes AI matching and recommendations.',
    candidatesFunctionality: 'Functionality:',
    manageProfiles: 'Managing candidate profiles',
    aiMatching: 'AI matching with jobs',
    skillAssessment: 'Skill assessment',
    applicationHistory: 'Application history',
    
    // Applications content
    applicationsContent: 'API for working with candidate applications for jobs. Includes statuses, comments and workflow.',
    applicationStatuses: 'Application statuses:',
    new: 'New',
    reviewed: 'Reviewed',
    selected: 'Selected',
    interview: 'Interview',
    acceptedRejected: 'Accepted/Rejected',
    
    // Interviews content
    interviewsContent: 'API for planning and managing interviews with candidates. Supports calendar and reminders.',
    interviewCapabilities: 'Capabilities:',
    planInterview: 'Planning interviews',
    calendarIntegration: 'Calendar integration',
    reminders: 'Reminders',
    interviewAssessment: 'Interview assessment',
    
    // Analytics content
    analyticsContent: 'API for getting analytics and statistics on various aspects of HR work.',
    reportTypes: 'Report types:',
    hiringStatistics: 'Hiring statistics',
    recruitmentEfficiency: 'Recruitment efficiency',
    candidateAnalysis: 'Candidate analysis',
    hrTeamProductivity: 'HR team productivity',
    
    // Settings content
    settingsContent: 'API for working with user, company and system settings.',
    settingTypes: 'Setting types:',
    userProfile: 'User profile',
    notificationSettings: 'Notification settings',
    security: 'Security',
    integrations: 'Integrations',
    
    // API endpoints
    getJobsList: 'Get jobs list',
    createNewJob: 'Create new job',
    getJobDetails: 'Get job details',
    updateJob: 'Update job',
    searchCandidates: 'Search candidates',
    candidateProfile: 'Candidate profile',
    assessCandidate: 'Assess candidate',
    getApplicationsList: 'Get applications list',
    createApplication: 'Create application',
    updateStatus: 'Update status',
    getInterviewsList: 'Get interviews list',
    createInterview: 'Create interview',
    updateInterview: 'Update interview',
    userSettings: 'User settings',
    updateProfile: 'Update profile',
    
    // Authentication endpoints
    login: 'Login',
    
    // Common terms
    method: 'Method',
    path: 'Path',
    description: 'Description',
    example: 'Example',
    copy: 'Copy',
    copied: 'Copied'
  },
  uk: {
    // Docs page main content
    apiDocumentation: 'Документація API',
    completeApiDocumentationAndGuides: 'Повна документація TalentFlow API та гайди використання',
    searchDocumentation: 'Пошук по документації...',
    usageExample: 'Приклад використання',
    apiEndpoints: 'API Ендпоінти',
    quickLinks: 'Швидкі посилання',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Health Check',
    github: 'GitHub',
    
    // API sections
    overview: 'Огляд API',
    overviewDescription: 'Загальна інформація про TalentFlow API',
    authentication: 'Аутентифікація',
    authenticationDescription: 'JWT токени та авторизація',
    jobs: 'Вакансії',
    jobsDescription: 'Управління вакансіями та робочими місцями',
    candidates: 'Кандидати',
    candidatesDescription: 'Управління кандидатами та профілями',
    applications: 'Заявки',
    applicationsDescription: 'Управління заявками на вакансії',
    interviews: 'Інтерв\'ю',
    interviewsDescription: 'Планування та управління інтерв\'ю',
    analytics: 'Аналітика',
    analyticsDescription: 'Статистика та звіти',
    settings: 'Налаштування',
    settingsDescription: 'API для управління налаштуваннями',
    
    // API content
    apiOverviewContent: 'TalentFlow API - це RESTful API для роботи з HR платформою. API дозволяє управляти вакансіями, кандидатами, компаніями та іншими сутностями системи.',
    apiFeatures: 'Основні особливості:',
    restfulArchitecture: 'RESTful архітектура',
    jsonDataFormat: 'JSON формат даних',
    jwtAuthentication: 'JWT аутентифікація',
    rateLimiting: 'Rate limiting',
    inputValidation: 'Валідація вхідних даних',
    detailedDocumentation: 'Детальна документація',
    
    // Authentication content
    authContent: 'Всі API запити (крім публічних ендпоінтів) потребують аутентифікації через JWT токени.',
    authProcess: 'Процес аутентифікації:',
    getToken: 'Отримання токена через /auth/login',
    useToken: 'Використання токена в заголовку Authorization',
    refreshToken: 'Оновлення токена через /auth/refresh',
    
    // Jobs content
    jobsContent: 'API для створення, редагування та управління вакансіями. Підтримує розширені фільтри, пошук та AI-рекомендації.',
    jobsFeatures: 'Основні функції:',
    createEditJobs: 'Створення та редагування вакансій',
    searchFilter: 'Пошук та фільтрація',
    aiRecommendations: 'AI-рекомендації кандидатів',
    statisticsAnalytics: 'Статистика та аналітика',
    
    // Candidates content
    candidatesContent: 'API для роботи з кандидатами, їх профілями та заявками. Включає AI-матчинг та рекомендації.',
    candidatesFunctionality: 'Функціональність:',
    manageProfiles: 'Управління профілями кандидатів',
    aiMatching: 'AI-матчинг з вакансіями',
    skillAssessment: 'Оцінка навичок',
    applicationHistory: 'Історія заявок',
    
    // Applications content
    applicationsContent: 'API для роботи з заявками кандидатів на вакансії. Включає статуси, коментарі та workflow.',
    applicationStatuses: 'Статуси заявок:',
    new: 'Нова',
    reviewed: 'Переглянута',
    selected: 'Відібрана',
    interview: 'Інтерв\'ю',
    acceptedRejected: 'Прийнята/Відхилена',
    
    // Interviews content
    interviewsContent: 'API для планування та управління інтерв\'ю з кандидатами. Підтримує календар та нагадування.',
    interviewCapabilities: 'Можливості:',
    planInterview: 'Планування інтерв\'ю',
    calendarIntegration: 'Інтеграція з календарем',
    reminders: 'Нагадування',
    interviewAssessment: 'Оцінка інтерв\'ю',
    
    // Analytics content
    analyticsContent: 'API для отримання аналітики та статистики по різних аспектах роботи з персоналом.',
    reportTypes: 'Типи звітів:',
    hiringStatistics: 'Статистика найму',
    recruitmentEfficiency: 'Ефективність рекрутингу',
    candidateAnalysis: 'Аналіз кандидатів',
    hrTeamProductivity: 'Продуктивність HR команди',
    
    // Settings content
    settingsContent: 'API для роботи з налаштуваннями користувачів, компаній та системи.',
    settingTypes: 'Типи налаштувань:',
    userProfile: 'Профіль користувача',
    notificationSettings: 'Налаштування сповіщень',
    security: 'Безпека',
    integrations: 'Інтеграції',
    
    // API endpoints
    getJobsList: 'Отримання списку вакансій',
    createNewJob: 'Створення нової вакансії',
    getJobDetails: 'Отримання деталей вакансії',
    updateJob: 'Оновлення вакансії',
    searchCandidates: 'Пошук кандидатів',
    candidateProfile: 'Профіль кандидата',
    assessCandidate: 'Оцінка кандидата',
    getApplicationsList: 'Список заявок',
    createApplication: 'Створення заявки',
    updateStatus: 'Оновлення статусу',
    getInterviewsList: 'Список інтерв\'ю',
    createInterview: 'Створення інтерв\'ю',
    updateInterview: 'Оновлення інтерв\'ю',
    userSettings: 'Налаштування користувача',
    updateProfile: 'Оновлення профілю',
    
    // Authentication endpoints
    login: 'Вхід в систему',
    
    // Common terms
    method: 'Метод',
    path: 'Шлях',
    description: 'Опис',
    example: 'Приклад',
    copy: 'Копіювати',
    copied: 'Скопійовано'
  },
  
  es: {

    // Docs page main content
    apiDocumentation: 'Documentación API',
    completeApiDocumentationAndGuides: 'Documentación completa de la API de TalentFlow y guías de uso',
    searchDocumentation: 'Buscar documentación...',
    usageExample: 'Ejemplo de Uso',
    apiEndpoints: 'Endpoints API',
    quickLinks: 'Enlaces Rápidos',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Verificación de Salud',
    github: 'GitHub',
    
    // API sections
    overview: 'Resumen de la API',
    overviewDescription: 'Información general sobre la API de TalentFlow',
    authentication: 'Autenticación',
    authenticationDescription: 'Tokens JWT y autorización',
    jobs: 'Empleos',
    jobsDescription: 'Gestión de publicaciones y posiciones de empleo',
    candidates: 'Candidatos',
    candidatesDescription: 'Gestión de candidatos y perfiles',
    applications: 'Solicitudes',
    applicationsDescription: 'Gestión de solicitudes de empleo',
    interviews: 'Entrevistas',
    interviewsDescription: 'Planificación y gestión de entrevistas',
    analytics: 'Analíticas',
    analyticsDescription: 'Estadísticas e informes',
    settings: 'Configuración',
    settingsDescription: 'API para gestionar la configuración',
    
    // API content
    apiOverviewContent: 'La API de TalentFlow es una API RESTful para trabajar con la plataforma de RR.HH. La API permite gestionar empleos, candidatos, empresas y otras entidades del sistema.',
    apiFeatures: 'Características Principales:',
    restfulArchitecture: 'Arquitectura RESTful',
    jsonDataFormat: 'Formato de datos JSON',
    jwtAuthentication: 'Autenticación JWT',
    rateLimiting: 'Limitación de velocidad',
    inputValidation: 'Validación de entrada',
    detailedDocumentation: 'Documentación detallada',
    
    // Authentication content
    authContent: 'Todas las solicitudes API (excepto endpoints públicos) requieren autenticación mediante tokens JWT.',
    authProcess: 'Proceso de autenticación:',
    getToken: 'Obtener token mediante /auth/login',
    useToken: 'Usar token en el encabezado Authorization',
    refreshToken: 'Actualizar token mediante /auth/refresh',
    
    // Jobs content
    jobsContent: 'API para crear, editar y gestionar publicaciones de empleo. Admite filtros avanzados, búsqueda y recomendaciones de IA.',
    jobsFeatures: 'Características clave:',
    createEditJobs: 'Crear y editar empleos',
    searchFilter: 'Búsqueda y filtrado',
    aiRecommendations: 'Recomendaciones de candidatos con IA',
    statisticsAnalytics: 'Estadísticas y analíticas',
    
    // Candidates content
    candidatesContent: 'API para trabajar con candidatos, sus perfiles y solicitudes. Incluye coincidencia con IA y recomendaciones.',
    candidatesFunctionality: 'Funcionalidad:',
    manageProfiles: 'Gestión de perfiles de candidatos',
    aiMatching: 'Coincidencia con IA con empleos',
    skillAssessment: 'Evaluación de habilidades',
    applicationHistory: 'Historial de solicitudes',
    
    // Applications content
    applicationsContent: 'API para trabajar con solicitudes de candidatos para empleos. Incluye estados, comentarios y flujo de trabajo.',
    applicationStatuses: 'Estados de solicitud:',
    new: 'Nuevo',
    reviewed: 'Revisado',
    selected: 'Seleccionado',
    interview: 'Entrevista',
    acceptedRejected: 'Aceptado/Rechazado',
    
    // Interviews content
    interviewsContent: 'API para planificar y gestionar entrevistas con candidatos. Admite calendario y recordatorios.',
    interviewCapabilities: 'Capacidades:',
    planInterview: 'Planificar entrevistas',
    calendarIntegration: 'Integración con calendario',
    reminders: 'Recordatorios',
    interviewAssessment: 'Evaluación de entrevista',
    
    // Analytics content
    analyticsContent: 'API para obtener analíticas y estadísticas sobre varios aspectos del trabajo de RR.HH.',
    reportTypes: 'Tipos de informes:',
    hiringStatistics: 'Estadísticas de contratación',
    recruitmentEfficiency: 'Eficiencia de reclutamiento',
    candidateAnalysis: 'Análisis de candidatos',
    hrTeamProductivity: 'Productividad del equipo de RR.HH.',
    
    // Settings content
    settingsContent: 'API para trabajar con configuraciones de usuario, empresa y sistema.',
    settingTypes: 'Tipos de configuración:',
    userProfile: 'Perfil de usuario',
    notificationSettings: 'Configuración de notificaciones',
    security: 'Seguridad',
    integrations: 'Integraciones',
    
    // API endpoints
    getJobsList: 'Obtener lista de empleos',
    createNewJob: 'Crear nuevo empleo',
    getJobDetails: 'Obtener detalles del empleo',
    updateJob: 'Actualizar empleo',
    searchCandidates: 'Buscar candidatos',
    candidateProfile: 'Perfil del candidato',
    assessCandidate: 'Evaluar candidato',
    getApplicationsList: 'Obtener lista de solicitudes',
    createApplication: 'Crear solicitud',
    updateStatus: 'Actualizar estado',
    getInterviewsList: 'Obtener lista de entrevistas',
    createInterview: 'Crear entrevista',
    updateInterview: 'Actualizar entrevista',
    userSettings: 'Configuración de usuario',
    updateProfile: 'Actualizar perfil',
    
    // Authentication endpoints
    login: 'Iniciar Sesión',
    
    // Common terms
    method: 'Método',
    path: 'Ruta',
    description: 'Descripción',
    example: 'Ejemplo',
    copy: 'Copiar',
    copied: 'Copiado'
  },
  
  pl: {

    // Docs page main content
    apiDocumentation: 'Dokumentacja API',
    completeApiDocumentationAndGuides: 'Kompletna dokumentacja API TalentFlow i przewodniki użytkowania',
    searchDocumentation: 'Szukaj dokumentacji...',
    usageExample: 'Przykład Użycia',
    apiEndpoints: 'Endpointy API',
    quickLinks: 'Szybkie Linki',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Sprawdzenie Zdrowia',
    github: 'GitHub',
    
    // API sections
    overview: 'Przegląd API',
    overviewDescription: 'Ogólne informacje o API TalentFlow',
    authentication: 'Uwierzytelnianie',
    authenticationDescription: 'Tokeny JWT i autoryzacja',
    jobs: 'Praca',
    jobsDescription: 'Zarządzanie ofertami pracy i stanowiskami',
    candidates: 'Kandydaci',
    candidatesDescription: 'Zarządzanie kandydatami i profilami',
    applications: 'Aplikacje',
    applicationsDescription: 'Zarządzanie aplikacjami o pracę',
    interviews: 'Rozmowy',
    interviewsDescription: 'Planowanie i zarządzanie rozmowami',
    analytics: 'Analityka',
    analyticsDescription: 'Statystyki i raporty',
    settings: 'Ustawienia',
    settingsDescription: 'API do zarządzania ustawieniami',
    
    // API content
    apiOverviewContent: 'TalentFlow API to RESTful API do pracy z platformą HR. API pozwala zarządzać ofertami pracy, kandydatami, firmami i innymi encjami systemu.',
    apiFeatures: 'Kluczowe Cechy:',
    restfulArchitecture: 'Architektura RESTful',
    jsonDataFormat: 'Format danych JSON',
    jwtAuthentication: 'Uwierzytelnianie JWT',
    rateLimiting: 'Ograniczanie szybkości',
    inputValidation: 'Walidacja danych wejściowych',
    detailedDocumentation: 'Szczegółowa dokumentacja',
    
    // Authentication content
    authContent: 'Wszystkie żądania API (z wyjątkiem publicznych endpointów) wymagają uwierzytelnienia za pomocą tokenów JWT.',
    authProcess: 'Proces uwierzytelniania:',
    getToken: 'Uzyskaj token przez /auth/login',
    useToken: 'Użyj tokenu w nagłówku Authorization',
    refreshToken: 'Odśwież token przez /auth/refresh',
    
    // Jobs content
    jobsContent: 'API do tworzenia, edycji i zarządzania ofertami pracy. Obsługuje zaawansowane filtry, wyszukiwanie i rekomendacje AI.',
    jobsFeatures: 'Kluczowe funkcje:',
    createEditJobs: 'Tworzenie i edycja ofert pracy',
    searchFilter: 'Wyszukiwanie i filtrowanie',
    aiRecommendations: 'Rekomendacje kandydatów AI',
    statisticsAnalytics: 'Statystyki i analityka',
    
    // Candidates content
    candidatesContent: 'API do pracy z kandydatami, ich profilami i aplikacjami. Zawiera dopasowanie AI i rekomendacje.',
    candidatesFunctionality: 'Funkcjonalność:',
    manageProfiles: 'Zarządzanie profilami kandydatów',
    aiMatching: 'Dopasowanie AI z ofertami pracy',
    skillAssessment: 'Ocena umiejętności',
    applicationHistory: 'Historia aplikacji',
    
    // Applications content
    applicationsContent: 'API do pracy z aplikacjami kandydatów na oferty pracy. Zawiera statusy, komentarze i przepływ pracy.',
    applicationStatuses: 'Statusy aplikacji:',
    new: 'Nowa',
    reviewed: 'Sprawdzona',
    selected: 'Wybrana',
    interview: 'Rozmowa',
    acceptedRejected: 'Zaakceptowana/Odrzucona',
    
    // Interviews content
    interviewsContent: 'API do planowania i zarządzania rozmowami z kandydatami. Obsługuje kalendarz i przypomnienia.',
    interviewCapabilities: 'Możliwości:',
    planInterview: 'Planowanie rozmów',
    calendarIntegration: 'Integracja z kalendarzem',
    reminders: 'Przypomnienia',
    interviewAssessment: 'Ocena rozmowy',
    
    // Analytics content
    analyticsContent: 'API do uzyskiwania analityki i statystyk dotyczących różnych aspektów pracy HR.',
    reportTypes: 'Typy raportów:',
    hiringStatistics: 'Statystyki zatrudnienia',
    recruitmentEfficiency: 'Efektywność rekrutacji',
    candidateAnalysis: 'Analiza kandydatów',
    hrTeamProductivity: 'Produktywność zespołu HR',
    
    // Settings content
    settingsContent: 'API do pracy z ustawieniami użytkownika, firmy i systemu.',
    settingTypes: 'Typy ustawień:',
    userProfile: 'Profil użytkownika',
    notificationSettings: 'Ustawienia powiadomień',
    security: 'Bezpieczeństwo',
    integrations: 'Integracje',
    
    // API endpoints
    getJobsList: 'Pobierz listę ofert pracy',
    createNewJob: 'Utwórz nową ofertę pracy',
    getJobDetails: 'Pobierz szczegóły oferty pracy',
    updateJob: 'Zaktualizuj ofertę pracy',
    searchCandidates: 'Szukaj kandydatów',
    candidateProfile: 'Profil kandydata',
    assessCandidate: 'Oceń kandydata',
    getApplicationsList: 'Pobierz listę aplikacji',
    createApplication: 'Utwórz aplikację',
    updateStatus: 'Zaktualizuj status',
    getInterviewsList: 'Pobierz listę rozmów',
    createInterview: 'Utwórz rozmowę',
    updateInterview: 'Zaktualizuj rozmowę',
    userSettings: 'Ustawienia użytkownika',
    updateProfile: 'Zaktualizuj profil',
    
    // Authentication endpoints
    login: 'Zaloguj się',
    
    // Common terms
    method: 'Metoda',
    path: 'Ścieżka',
    description: 'Opis',
    example: 'Przykład',
    copy: 'Kopiuj',
    copied: 'Skopiowano'
  },
  
  de: {

    // Docs page main content
    apiDocumentation: 'API-Dokumentation',
    completeApiDocumentationAndGuides: 'Vollständige TalentFlow API-Dokumentation und Nutzungsleitfäden',
    searchDocumentation: 'Dokumentation durchsuchen...',
    usageExample: 'Nutzungsbeispiel',
    apiEndpoints: 'API-Endpunkte',
    quickLinks: 'Schnelllinks',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Gesundheitsprüfung',
    github: 'GitHub',
    
    // API sections
    overview: 'API-Übersicht',
    overviewDescription: 'Allgemeine Informationen zur TalentFlow-API',
    authentication: 'Authentifizierung',
    authenticationDescription: 'JWT-Tokens und Autorisierung',
    jobs: 'Stellen',
    jobsDescription: 'Verwaltung von Stellenanzeigen und Positionen',
    candidates: 'Kandidaten',
    candidatesDescription: 'Verwaltung von Kandidaten und Profilen',
    applications: 'Bewerbungen',
    applicationsDescription: 'Verwaltung von Stellenbewerbungen',
    interviews: 'Interviews',
    interviewsDescription: 'Planung und Verwaltung von Interviews',
    analytics: 'Analytik',
    analyticsDescription: 'Statistiken und Berichte',
    settings: 'Einstellungen',
    settingsDescription: 'API zur Verwaltung von Einstellungen',
    
    // API content
    apiOverviewContent: 'Die TalentFlow-API ist eine RESTful-API für die Arbeit mit der HR-Plattform. Die API ermöglicht die Verwaltung von Stellen, Kandidaten, Firmen und anderen Systementitäten.',
    apiFeatures: 'Hauptmerkmale:',
    restfulArchitecture: 'RESTful-Architektur',
    jsonDataFormat: 'JSON-Datenformat',
    jwtAuthentication: 'JWT-Authentifizierung',
    rateLimiting: 'Ratenbegrenzung',
    inputValidation: 'Eingabevalidierung',
    detailedDocumentation: 'Detaillierte Dokumentation',
    
    // Authentication content
    authContent: 'Alle API-Anfragen (außer öffentliche Endpunkte) erfordern Authentifizierung über JWT-Tokens.',
    authProcess: 'Authentifizierungsprozess:',
    getToken: 'Token über /auth/login erhalten',
    useToken: 'Token im Authorization-Header verwenden',
    refreshToken: 'Token über /auth/refresh aktualisieren',
    
    // Jobs content
    jobsContent: 'API zum Erstellen, Bearbeiten und Verwalten von Stellenanzeigen. Unterstützt erweiterte Filter, Suche und KI-Empfehlungen.',
    jobsFeatures: 'Hauptfunktionen:',
    createEditJobs: 'Erstellen und Bearbeiten von Stellen',
    searchFilter: 'Suche und Filterung',
    aiRecommendations: 'KI-Kandidatenempfehlungen',
    statisticsAnalytics: 'Statistiken und Analytik',
    
    // Candidates content
    candidatesContent: 'API für die Arbeit mit Kandidaten, ihren Profilen und Bewerbungen. Enthält KI-Matching und Empfehlungen.',
    candidatesFunctionality: 'Funktionalität:',
    manageProfiles: 'Verwaltung von Kandidatenprofilen',
    aiMatching: 'KI-Matching mit Stellen',
    skillAssessment: 'Fähigkeitsbewertung',
    applicationHistory: 'Bewerbungsverlauf',
    
    // Applications content
    applicationsContent: 'API für die Arbeit mit Kandidatenbewerbungen für Stellen. Enthält Status, Kommentare und Workflow.',
    applicationStatuses: 'Bewerbungsstatus:',
    new: 'Neu',
    reviewed: 'Überprüft',
    selected: 'Ausgewählt',
    interview: 'Interview',
    acceptedRejected: 'Angenommen/Abgelehnt',
    
    // Interviews content
    interviewsContent: 'API für die Planung und Verwaltung von Interviews mit Kandidaten. Unterstützt Kalender und Erinnerungen.',
    interviewCapabilities: 'Möglichkeiten:',
    planInterview: 'Planung von Interviews',
    calendarIntegration: 'Kalenderintegration',
    reminders: 'Erinnerungen',
    interviewAssessment: 'Interview-Bewertung',
    
    // Analytics content
    analyticsContent: 'API zum Abrufen von Analytik und Statistiken zu verschiedenen Aspekten der HR-Arbeit.',
    reportTypes: 'Berichtstypen:',
    hiringStatistics: 'Einstellungsstatistiken',
    recruitmentEfficiency: 'Rekrutierungseffizienz',
    candidateAnalysis: 'Kandidatenanalyse',
    hrTeamProductivity: 'HR-Team-Produktivität',
    
    // Settings content
    settingsContent: 'API für die Arbeit mit Benutzer-, Firmen- und Systemeinstellungen.',
    settingTypes: 'Einstellungstypen:',
    userProfile: 'Benutzerprofil',
    notificationSettings: 'Benachrichtigungseinstellungen',
    security: 'Sicherheit',
    integrations: 'Integrationen',
    
    // API endpoints
    getJobsList: 'Stellenliste abrufen',
    createNewJob: 'Neue Stelle erstellen',
    getJobDetails: 'Stellendetails abrufen',
    updateJob: 'Stelle aktualisieren',
    searchCandidates: 'Kandidaten suchen',
    candidateProfile: 'Kandidatenprofil',
    assessCandidate: 'Kandidat bewerten',
    getApplicationsList: 'Bewerbungsliste abrufen',
    createApplication: 'Bewerbung erstellen',
    updateStatus: 'Status aktualisieren',
    getInterviewsList: 'Interviewliste abrufen',
    createInterview: 'Interview erstellen',
    updateInterview: 'Interview aktualisieren',
    userSettings: 'Benutzereinstellungen',
    updateProfile: 'Profil aktualisieren',
    
    // Authentication endpoints
    login: 'Anmelden',
    
    // Common terms
    method: 'Methode',
    path: 'Pfad',
    description: 'Beschreibung',
    example: 'Beispiel',
    copy: 'Kopieren',
    copied: 'Kopiert'
  },
  
  fr: {

    // Docs page main content
    apiDocumentation: 'Documentation API',
    completeApiDocumentationAndGuides: 'Documentation complète de l\'API TalentFlow et guides d\'utilisation',
    searchDocumentation: 'Rechercher la documentation...',
    usageExample: 'Exemple d\'Utilisation',
    apiEndpoints: 'Points de Terminaison API',
    quickLinks: 'Liens Rapides',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Vérification de Santé',
    github: 'GitHub',
    
    // API sections
    overview: 'Aperçu de l\'API',
    overviewDescription: 'Informations générales sur l\'API TalentFlow',
    authentication: 'Authentification',
    authenticationDescription: 'Tokens JWT et autorisation',
    jobs: 'Emplois',
    jobsDescription: 'Gestion des offres d\'emploi et des postes',
    candidates: 'Candidats',
    candidatesDescription: 'Gestion des candidats et des profils',
    applications: 'Candidatures',
    applicationsDescription: 'Gestion des candidatures d\'emploi',
    interviews: 'Entretiens',
    interviewsDescription: 'Planification et gestion des entretiens',
    analytics: 'Analytiques',
    analyticsDescription: 'Statistiques et rapports',
    settings: 'Paramètres',
    settingsDescription: 'API pour gérer les paramètres',
    
    // API content
    apiOverviewContent: 'L\'API TalentFlow est une API RESTful pour travailler avec la plateforme RH. L\'API permet de gérer les emplois, les candidats, les entreprises et autres entités du système.',
    apiFeatures: 'Caractéristiques Principales:',
    restfulArchitecture: 'Architecture RESTful',
    jsonDataFormat: 'Format de données JSON',
    jwtAuthentication: 'Authentification JWT',
    rateLimiting: 'Limitation de débit',
    inputValidation: 'Validation d\'entrée',
    detailedDocumentation: 'Documentation détaillée',
    
    // Authentication content
    authContent: 'Toutes les requêtes API (sauf les points de terminaison publics) nécessitent une authentification via des tokens JWT.',
    authProcess: 'Processus d\'authentification:',
    getToken: 'Obtenir le token via /auth/login',
    useToken: 'Utiliser le token dans l\'en-tête Authorization',
    refreshToken: 'Actualiser le token via /auth/refresh',
    
    // Jobs content
    jobsContent: 'API pour créer, modifier et gérer les offres d\'emploi. Prend en charge les filtres avancés, la recherche et les recommandations IA.',
    jobsFeatures: 'Fonctionnalités clés:',
    createEditJobs: 'Créer et modifier des emplois',
    searchFilter: 'Recherche et filtrage',
    aiRecommendations: 'Recommandations de candidats IA',
    statisticsAnalytics: 'Statistiques et analytiques',
    
    // Candidates content
    candidatesContent: 'API pour travailler avec les candidats, leurs profils et candidatures. Inclut la correspondance IA et les recommandations.',
    candidatesFunctionality: 'Fonctionnalité:',
    manageProfiles: 'Gestion des profils de candidats',
    aiMatching: 'Correspondance IA avec les emplois',
    skillAssessment: 'Évaluation des compétences',
    applicationHistory: 'Historique des candidatures',
    
    // Applications content
    applicationsContent: 'API pour travailler avec les candidatures des candidats aux emplois. Inclut les statuts, commentaires et flux de travail.',
    applicationStatuses: 'Statuts de candidature:',
    new: 'Nouveau',
    reviewed: 'Examiné',
    selected: 'Sélectionné',
    interview: 'Entretien',
    acceptedRejected: 'Accepté/Rejeté',
    
    // Interviews content
    interviewsContent: 'API pour planifier et gérer les entretiens avec les candidats. Prend en charge le calendrier et les rappels.',
    interviewCapabilities: 'Capacités:',
    planInterview: 'Planification d\'entretiens',
    calendarIntegration: 'Intégration calendrier',
    reminders: 'Rappels',
    interviewAssessment: 'Évaluation d\'entretien',
    
    // Analytics content
    analyticsContent: 'API pour obtenir des analytiques et des statistiques sur divers aspects du travail RH.',
    reportTypes: 'Types de rapports:',
    hiringStatistics: 'Statistiques d\'embauche',
    recruitmentEfficiency: 'Efficacité du recrutement',
    candidateAnalysis: 'Analyse des candidats',
    hrTeamProductivity: 'Productivité de l\'équipe RH',
    
    // Settings content
    settingsContent: 'API pour travailler avec les paramètres utilisateur, entreprise et système.',
    settingTypes: 'Types de paramètres:',
    userProfile: 'Profil utilisateur',
    notificationSettings: 'Paramètres de notification',
    security: 'Sécurité',
    integrations: 'Intégrations',
    
    // API endpoints
    getJobsList: 'Obtenir la liste des emplois',
    createNewJob: 'Créer un nouvel emploi',
    getJobDetails: 'Obtenir les détails de l\'emploi',
    updateJob: 'Mettre à jour l\'emploi',
    searchCandidates: 'Rechercher des candidats',
    candidateProfile: 'Profil du candidat',
    assessCandidate: 'Évaluer le candidat',
    getApplicationsList: 'Obtenir la liste des candidatures',
    createApplication: 'Créer une candidature',
    updateStatus: 'Mettre à jour le statut',
    getInterviewsList: 'Obtenir la liste des entretiens',
    createInterview: 'Créer un entretien',
    updateInterview: 'Mettre à jour l\'entretien',
    userSettings: 'Paramètres utilisateur',
    updateProfile: 'Mettre à jour le profil',
    
    // Authentication endpoints
    login: 'Connexion',
    
    // Common terms
    method: 'Méthode',
    path: 'Chemin',
    description: 'Description',
    example: 'Exemple',
    copy: 'Copier',
    copied: 'Copié'
  },
  
  pt: {

    // Docs page main content
    apiDocumentation: 'Documentação da API',
    completeApiDocumentationAndGuides: 'Documentação completa da API TalentFlow e guias de uso',
    searchDocumentation: 'Pesquisar documentação...',
    usageExample: 'Exemplo de Uso',
    apiEndpoints: 'Endpoints da API',
    quickLinks: 'Links Rápidos',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Verificação de Saúde',
    github: 'GitHub',
    
    // API sections
    overview: 'Visão Geral da API',
    overviewDescription: 'Informações gerais sobre a API TalentFlow',
    authentication: 'Autenticação',
    authenticationDescription: 'Tokens JWT e autorização',
    jobs: 'Vagas',
    jobsDescription: 'Gerenciamento de anúncios de vagas e posições',
    candidates: 'Candidatos',
    candidatesDescription: 'Gerenciamento de candidatos e perfis',
    applications: 'Candidaturas',
    applicationsDescription: 'Gerenciamento de candidaturas de emprego',
    interviews: 'Entrevistas',
    interviewsDescription: 'Planejamento e gerenciamento de entrevistas',
    analytics: 'Análises',
    analyticsDescription: 'Estatísticas e relatórios',
    settings: 'Configurações',
    settingsDescription: 'API para gerenciar configurações',
    
    // API content
    apiOverviewContent: 'A API TalentFlow é uma API RESTful para trabalhar com a plataforma de RH. A API permite gerenciar vagas, candidatos, empresas e outras entidades do sistema.',
    apiFeatures: 'Recursos Principais:',
    restfulArchitecture: 'Arquitetura RESTful',
    jsonDataFormat: 'Formato de dados JSON',
    jwtAuthentication: 'Autenticação JWT',
    rateLimiting: 'Limitação de taxa',
    inputValidation: 'Validação de entrada',
    detailedDocumentation: 'Documentação detalhada',
    
    // Authentication content
    authContent: 'Todas as requisições da API (exceto endpoints públicos) requerem autenticação via tokens JWT.',
    authProcess: 'Processo de autenticação:',
    getToken: 'Obter token via /auth/login',
    useToken: 'Usar token no cabeçalho Authorization',
    refreshToken: 'Atualizar token via /auth/refresh',
    
    // Jobs content
    jobsContent: 'API para criar, editar e gerenciar anúncios de vagas. Suporta filtros avançados, pesquisa e recomendações de IA.',
    jobsFeatures: 'Recursos principais:',
    createEditJobs: 'Criar e editar vagas',
    searchFilter: 'Pesquisa e filtragem',
    aiRecommendations: 'Recomendações de candidatos por IA',
    statisticsAnalytics: 'Estatísticas e análises',
    
    // Candidates content
    candidatesContent: 'API para trabalhar com candidatos, seus perfis e candidaturas. Inclui correspondência por IA e recomendações.',
    candidatesFunctionality: 'Funcionalidade:',
    manageProfiles: 'Gerenciamento de perfis de candidatos',
    aiMatching: 'Correspondência por IA com vagas',
    skillAssessment: 'Avaliação de habilidades',
    applicationHistory: 'Histórico de candidaturas',
    
    // Applications content
    applicationsContent: 'API para trabalhar com candidaturas de candidatos para vagas. Inclui status, comentários e fluxo de trabalho.',
    applicationStatuses: 'Status de candidatura:',
    new: 'Nova',
    reviewed: 'Revisada',
    selected: 'Selecionada',
    interview: 'Entrevista',
    acceptedRejected: 'Aceita/Rejeitada',
    
    // Interviews content
    interviewsContent: 'API para planejar e gerenciar entrevistas com candidatos. Suporta calendário e lembretes.',
    interviewCapabilities: 'Capacidades:',
    planInterview: 'Planejamento de entrevistas',
    calendarIntegration: 'Integração com calendário',
    reminders: 'Lembretes',
    interviewAssessment: 'Avaliação de entrevista',
    
    // Analytics content
    analyticsContent: 'API para obter análises e estatísticas sobre vários aspectos do trabalho de RH.',
    reportTypes: 'Tipos de relatórios:',
    hiringStatistics: 'Estatísticas de contratação',
    recruitmentEfficiency: 'Eficiência de recrutamento',
    candidateAnalysis: 'Análise de candidatos',
    hrTeamProductivity: 'Produtividade da equipe de RH',
    
    // Settings content
    settingsContent: 'API para trabalhar com configurações de usuário, empresa e sistema.',
    settingTypes: 'Tipos de configuração:',
    userProfile: 'Perfil de usuário',
    notificationSettings: 'Configurações de notificação',
    security: 'Segurança',
    integrations: 'Integrações',
    
    // API endpoints
    getJobsList: 'Obter lista de vagas',
    createNewJob: 'Criar nova vaga',
    getJobDetails: 'Obter detalhes da vaga',
    updateJob: 'Atualizar vaga',
    searchCandidates: 'Pesquisar candidatos',
    candidateProfile: 'Perfil do candidato',
    assessCandidate: 'Avaliar candidato',
    getApplicationsList: 'Obter lista de candidaturas',
    createApplication: 'Criar candidatura',
    updateStatus: 'Atualizar status',
    getInterviewsList: 'Obter lista de entrevistas',
    createInterview: 'Criar entrevista',
    updateInterview: 'Atualizar entrevista',
    userSettings: 'Configurações de usuário',
    updateProfile: 'Atualizar perfil',
    
    // Authentication endpoints
    login: 'Login',
    
    // Common terms
    method: 'Método',
    path: 'Caminho',
    description: 'Descrição',
    example: 'Exemplo',
    copy: 'Copiar',
    copied: 'Copiado'
  },
  
  ru: {

    // Docs page main content
    apiDocumentation: 'Документация API',
    completeApiDocumentationAndGuides: 'Полная документация API TalentFlow и руководства по использованию',
    searchDocumentation: 'Поиск документации...',
    usageExample: 'Пример Использования',
    apiEndpoints: 'API Endpoints',
    quickLinks: 'Быстрые Ссылки',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Проверка Здоровья',
    github: 'GitHub',
    
    // API sections
    overview: 'Обзор API',
    overviewDescription: 'Общая информация об API TalentFlow',
    authentication: 'Аутентификация',
    authenticationDescription: 'JWT-токены и авторизация',
    jobs: 'Вакансии',
    jobsDescription: 'Управление объявлениями о вакансиях и позициями',
    candidates: 'Кандидаты',
    candidatesDescription: 'Управление кандидатами и профилями',
    applications: 'Заявки',
    applicationsDescription: 'Управление заявками на работу',
    interviews: 'Собеседования',
    interviewsDescription: 'Планирование и управление собеседованиями',
    analytics: 'Аналитика',
    analyticsDescription: 'Статистика и отчеты',
    settings: 'Настройки',
    settingsDescription: 'API для управления настройками',
    
    // API content
    apiOverviewContent: 'API TalentFlow — это RESTful API для работы с HR-платформой. API позволяет управлять вакансиями, кандидатами, компаниями и другими сущностями системы.',
    apiFeatures: 'Основные Возможности:',
    restfulArchitecture: 'RESTful архитектура',
    jsonDataFormat: 'Формат данных JSON',
    jwtAuthentication: 'JWT аутентификация',
    rateLimiting: 'Ограничение скорости',
    inputValidation: 'Валидация ввода',
    detailedDocumentation: 'Подробная документация',
    
    // Authentication content
    authContent: 'Все API-запросы (кроме публичных конечных точек) требуют аутентификации через JWT-токены.',
    authProcess: 'Процесс аутентификации:',
    getToken: 'Получить токен через /auth/login',
    useToken: 'Использовать токен в заголовке Authorization',
    refreshToken: 'Обновить токен через /auth/refresh',
    
    // Jobs content
    jobsContent: 'API для создания, редактирования и управления объявлениями о вакансиях. Поддерживает расширенные фильтры, поиск и рекомендации ИИ.',
    jobsFeatures: 'Основные функции:',
    createEditJobs: 'Создание и редактирование вакансий',
    searchFilter: 'Поиск и фильтрация',
    aiRecommendations: 'Рекомендации кандидатов ИИ',
    statisticsAnalytics: 'Статистика и аналитика',
    
    // Candidates content
    candidatesContent: 'API для работы с кандидатами, их профилями и заявками. Включает соответствие ИИ и рекомендации.',
    candidatesFunctionality: 'Функциональность:',
    manageProfiles: 'Управление профилями кандидатов',
    aiMatching: 'ИИ соответствие с вакансиями',
    skillAssessment: 'Оценка навыков',
    applicationHistory: 'История заявок',
    
    // Applications content
    applicationsContent: 'API для работы с заявками кандидатов на вакансии. Включает статусы, комментарии и рабочий процесс.',
    applicationStatuses: 'Статусы заявок:',
    new: 'Новая',
    reviewed: 'Рассмотрена',
    selected: 'Выбрана',
    interview: 'Собеседование',
    acceptedRejected: 'Принята/Отклонена',
    
    // Interviews content
    interviewsContent: 'API для планирования и управления собеседованиями с кандидатами. Поддерживает календарь и напоминания.',
    interviewCapabilities: 'Возможности:',
    planInterview: 'Планирование собеседований',
    calendarIntegration: 'Интеграция с календарем',
    reminders: 'Напоминания',
    interviewAssessment: 'Оценка собеседования',
    
    // Analytics content
    analyticsContent: 'API для получения аналитики и статистики по различным аспектам работы HR.',
    reportTypes: 'Типы отчетов:',
    hiringStatistics: 'Статистика найма',
    recruitmentEfficiency: 'Эффективность рекрутмента',
    candidateAnalysis: 'Анализ кандидатов',
    hrTeamProductivity: 'Производительность HR-команды',
    
    // Settings content
    settingsContent: 'API для работы с настройками пользователя, компании и системы.',
    settingTypes: 'Типы настроек:',
    userProfile: 'Профиль пользователя',
    notificationSettings: 'Настройки уведомлений',
    security: 'Безопасность',
    integrations: 'Интеграции',
    
    // API endpoints
    getJobsList: 'Получить список вакансий',
    createNewJob: 'Создать новую вакансию',
    getJobDetails: 'Получить детали вакансии',
    updateJob: 'Обновить вакансию',
    searchCandidates: 'Поиск кандидатов',
    candidateProfile: 'Профиль кандидата',
    assessCandidate: 'Оценить кандидата',
    getApplicationsList: 'Получить список заявок',
    createApplication: 'Создать заявку',
    updateStatus: 'Обновить статус',
    getInterviewsList: 'Получить список собеседований',
    createInterview: 'Создать собеседование',
    updateInterview: 'Обновить собеседование',
    userSettings: 'Настройки пользователя',
    updateProfile: 'Обновить профиль',
    
    // Authentication endpoints
    login: 'Вход',
    
    // Common terms
    method: 'Метод',
    path: 'Путь',
    description: 'Описание',
    example: 'Пример',
    copy: 'Копировать',
    copied: 'Скопировано'
  },
  
  kk: {

    // Docs page main content
    apiDocumentation: 'API Құжаттамасы',
    completeApiDocumentationAndGuides: 'TalentFlow API толық құжаттамасы және пайдалану нұсқаулықтары',
    searchDocumentation: 'Құжаттаманы іздеу...',
    usageExample: 'Пайдалану Мысалы',
    apiEndpoints: 'API Endpoints',
    quickLinks: 'Жылдам Сілтемелер',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Денсаулық Тексеруі',
    github: 'GitHub',
    
    // API sections
    overview: 'API Шолу',
    overviewDescription: 'TalentFlow API туралы жалпы ақпарат',
    authentication: 'Аутентификация',
    authenticationDescription: 'JWT токендер және авторизация',
    jobs: 'Жұмыстар',
    jobsDescription: 'Жұмыс орындары мен лауазымдарды басқару',
    candidates: 'Үміткерлер',
    candidatesDescription: 'Үміткерлер мен профильдерді басқару',
    applications: 'Өтінімдер',
    applicationsDescription: 'Жұмысқа өтінімдерді басқару',
    interviews: 'Сұхбаттар',
    interviewsDescription: 'Сұхбаттарды жоспарлау және басқару',
    analytics: 'Талдаулар',
    analyticsDescription: 'Статистика мен есептер',
    settings: 'Параметрлер',
    settingsDescription: 'Параметрлерді басқаруға арналған API',
    
    // API content
    apiOverviewContent: 'TalentFlow API — бұл HR платформасымен жұмыс істеуге арналған RESTful API. API жұмыстарды, үміткерлерді, компанияларды және жүйенің басқа да сутңдерін басқаруға мүмкіндік береді.',
    apiFeatures: 'Негізгі Мүмкіндіктер:',
    restfulArchitecture: 'RESTful архитектура',
    jsonDataFormat: 'JSON деректер форматы',
    jwtAuthentication: 'JWT аутентификация',
    rateLimiting: 'Жылдамдық шектеуі',
    inputValidation: 'Кіру валидациясы',
    detailedDocumentation: 'Толық құжаттама',
    
    // Authentication content
    authContent: 'Барлық API сұраулары (публикалық соңғы нүктелерден басқа) JWT токендері арқылы аутентификацияны талап етеді.',
    authProcess: 'Аутентификация процесі:',
    getToken: '/auth/login арқылы токен алу',
    useToken: 'Authorization тақырыбында токенді пайдалану',
    refreshToken: '/auth/refresh арқылы токенді жаңарту',
    
    // Jobs content
    jobsContent: 'Жұмыс хабарландыруларын жасау, өңдеу және басқаруға арналған API. Кеңейтілген сүзгілерді, іздеуді және AI ұсыныстарын қолдайды.',
    jobsFeatures: 'Негізгі мүмкіндіктер:',
    createEditJobs: 'Жұмыстарды жасау және өңдеу',
    searchFilter: 'Іздеу және сүзгілеу',
    aiRecommendations: 'AI үміткерлер ұсыныстары',
    statisticsAnalytics: 'Статистика және талдау',
    
    // Candidates content
    candidatesContent: 'Үміткерлермен, олардың профильдерімен және өтінімдерімен жұмыс істеуге арналған API. AI сәйкестікті және ұсыныстарды қамтиды.',
    candidatesFunctionality: 'Функционалдық:',
    manageProfiles: 'Үміткерлер профильдерін басқару',
    aiMatching: 'Жұмыстармен AI сәйкестігі',
    skillAssessment: 'Дағдыларды бағалау',
    applicationHistory: 'Өтінімдер тарихы',
    
    // Applications content
    applicationsContent: 'Жұмыстарға үміткерлер өтінімдерімен жұмыс істеуге арналған API. Статустарды, түсініктемелерді және жұмыс процесін қамтиды.',
    applicationStatuses: 'Өтінім статустары:',
    new: 'Жаңа',
    reviewed: 'Қаралды',
    selected: 'Таңдалды',
    interview: 'Сұхбат',
    acceptedRejected: 'Қабылданды/Қабылданбады',
    
    // Interviews content
    interviewsContent: 'Үміткерлермен сұхбаттарды жоспарлау және басқаруға арналған API. Күнтізбе мен еске салғыштарды қолдайды.',
    interviewCapabilities: 'Мүмкіндіктер:',
    planInterview: 'Сұхбаттарды жоспарлау',
    calendarIntegration: 'Күнтізбе интеграциясы',
    reminders: 'Еске салғыштар',
    interviewAssessment: 'Сұхбат бағалауы',
    
    // Analytics content
    analyticsContent: 'HR жұмысының әртүрлі аспектілері бойынша талдау мен статистиканы алуға арналған API.',
    reportTypes: 'Есеп түрлері:',
    hiringStatistics: 'Жалдау статистикасы',
    recruitmentEfficiency: 'Жалдау тиімділігі',
    candidateAnalysis: 'Үміткерлер талдауы',
    hrTeamProductivity: 'HR командасының өнімділігі',
    
    // Settings content
    settingsContent: 'Пайдаланушы, компания және жүйе параметрлерімен жұмыс істеуге арналған API.',
    settingTypes: 'Параметр түрлері:',
    userProfile: 'Пайдаланушы профилі',
    notificationSettings: 'Хабарландыру параметрлері',
    security: 'Қауіпсіздік',
    integrations: 'Интеграциялар',
    
    // API endpoints
    getJobsList: 'Жұмыстар тізімін алу',
    createNewJob: 'Жаңа жұмыс жасау',
    getJobDetails: 'Жұмыс мәліметтерін алу',
    updateJob: 'Жұмысты жаңарту',
    searchCandidates: 'Үміткерлерді іздеу',
    candidateProfile: 'Үміткер профилі',
    assessCandidate: 'Үміткерді бағалау',
    getApplicationsList: 'Өтінімдер тізімін алу',
    createApplication: 'Өтінім жасау',
    updateStatus: 'Статусты жаңарту',
    getInterviewsList: 'Сұхбаттар тізімін алу',
    createInterview: 'Сұхбат жасау',
    updateInterview: 'Сұхбатты жаңарту',
    userSettings: 'Пайдаланушы параметрлері',
    updateProfile: 'Профильді жаңарту',
    
    // Authentication endpoints
    login: 'Кіру',
    
    // Common terms
    method: 'Әдіс',
    path: 'Жол',
    description: 'Сипаттама',
    example: 'Мысал',
    copy: 'Көшіру',
    copied: 'Көшірілді'
  },
  
  cs: {

    // Docs page main content
    apiDocumentation: 'API Dokumentace',
    completeApiDocumentationAndGuides: 'Kompletní dokumentace API TalentFlow a průvodce použitím',
    searchDocumentation: 'Hledat dokumentaci...',
    usageExample: 'Příklad Použití',
    apiEndpoints: 'API Endpointy',
    quickLinks: 'Rychlé Odkazy',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Kontrola Zdraví',
    github: 'GitHub',
    
    // API sections
    overview: 'Přehled API',
    overviewDescription: 'Obecné informace o API TalentFlow',
    authentication: 'Autentizace',
    authenticationDescription: 'JWT tokeny a autorizace',
    jobs: 'Práce',
    jobsDescription: 'Správa nabídek práce a pozic',
    candidates: 'Kandidáti',
    candidatesDescription: 'Správa kandidátů a profilů',
    applications: 'Přihlášky',
    applicationsDescription: 'Správa pracovních přihlášek',
    interviews: 'Pohovory',
    interviewsDescription: 'Plánování a správa pohovorů',
    analytics: 'Analytika',
    analyticsDescription: 'Statistiky a zprávy',
    settings: 'Nastavení',
    settingsDescription: 'API pro správu nastavení',
    
    // API content
    apiOverviewContent: 'TalentFlow API je RESTful API pro práci s HR platformou. API umožňuje spravovat práce, kandidáty, společnosti a další systémové entity.',
    apiFeatures: 'Klíčové Vlastnosti:',
    restfulArchitecture: 'RESTful architektura',
    jsonDataFormat: 'JSON datový formát',
    jwtAuthentication: 'JWT autentizace',
    rateLimiting: 'Omezení rychlosti',
    inputValidation: 'Validace vstupu',
    detailedDocumentation: 'Podrobná dokumentace',
    
    // Authentication content
    authContent: 'Všechny API požadavky (kromě veřejných endpointů) vyžadují autentizaci přes JWT tokeny.',
    authProcess: 'Autentizační proces:',
    getToken: 'Získat token přes /auth/login',
    useToken: 'Použít token v Authorization hlavičce',
    refreshToken: 'Obnovit token přes /auth/refresh',
    
    // Jobs content
    jobsContent: 'API pro vytváření, úpravu a správu nabídek práce. Podporuje pokročilé filtry, vyhledávání a AI doporučení.',
    jobsFeatures: 'Klíčové funkce:',
    createEditJobs: 'Vytváření a úprava prací',
    searchFilter: 'Vyhledávání a filtrování',
    aiRecommendations: 'AI doporučení kandidátů',
    statisticsAnalytics: 'Statistiky a analytika',
    
    // Candidates content
    candidatesContent: 'API pro práci s kandidáty, jejich profily a přihláškami. Zahrnuje AI párování a doporučení.',
    candidatesFunctionality: 'Funkcionalita:',
    manageProfiles: 'Správa profilů kandidátů',
    aiMatching: 'AI párování s pracemi',
    skillAssessment: 'Hodnocení dovedností',
    applicationHistory: 'Historie přihlášek',
    
    // Applications content
    applicationsContent: 'API pro práci s přihláškami kandidátů na práce. Zahrnuje statusy, komentáře a workflow.',
    applicationStatuses: 'Statusy přihlášek:',
    new: 'Nová',
    reviewed: 'Zkontrolována',
    selected: 'Vybrána',
    interview: 'Pohovor',
    acceptedRejected: 'Přijata/Zamítnuta',
    
    // Interviews content
    interviewsContent: 'API pro plánování a správu pohovorů s kandidáty. Podporuje kalendář a připomínky.',
    interviewCapabilities: 'Schopnosti:',
    planInterview: 'Plánování pohovorů',
    calendarIntegration: 'Integrace kalendáře',
    reminders: 'Připomínky',
    interviewAssessment: 'Hodnocení pohovoru',
    
    // Analytics content
    analyticsContent: 'API pro získávání analytiky a statistik o různých aspektech HR práce.',
    reportTypes: 'Typy zpráv:',
    hiringStatistics: 'Statistiky najímání',
    recruitmentEfficiency: 'Efektivita náboru',
    candidateAnalysis: 'Analýza kandidátů',
    hrTeamProductivity: 'Produktivita HR týmu',
    
    // Settings content
    settingsContent: 'API pro práci s uživatelskými, firemními a systémovými nastaveními.',
    settingTypes: 'Typy nastavení:',
    userProfile: 'Uživatelský profil',
    notificationSettings: 'Nastavení oznámení',
    security: 'Bezpečnost',
    integrations: 'Integrace',
    
    // API endpoints
    getJobsList: 'Získat seznam prací',
    createNewJob: 'Vytvořit novou práci',
    getJobDetails: 'Získat detaily práce',
    updateJob: 'Aktualizovat práci',
    searchCandidates: 'Hledat kandidáty',
    candidateProfile: 'Profil kandidáta',
    assessCandidate: 'Ohodnotit kandidáta',
    getApplicationsList: 'Získat seznam přihlášek',
    createApplication: 'Vytvořit přihlášku',
    updateStatus: 'Aktualizovat status',
    getInterviewsList: 'Získat seznam pohovorů',
    createInterview: 'Vytvořit pohovor',
    updateInterview: 'Aktualizovat pohovor',
    userSettings: 'Uživatelská nastavení',
    updateProfile: 'Aktualizovat profil',
    
    // Authentication endpoints
    login: 'Přihlášení',
    
    // Common terms
    method: 'Metoda',
    path: 'Cesta',
    description: 'Popis',
    example: 'Příklad',
    copy: 'Kopírovat',
    copied: 'Zkopírováno'
  },
  
  az: {

    // Docs page main content
    apiDocumentation: 'API Sənədləşməsi',
    completeApiDocumentationAndGuides: 'TalentFlow API tam sənədləşməsi və istifadə bələdçiləri',
    searchDocumentation: 'Sənədləşməni axtar...',
    usageExample: 'İstifadə Nümunəsi',
    apiEndpoints: 'API Endpointləri',
    quickLinks: 'Sürətli Linklər',
    swaggerUI: 'Swagger UI',
    healthCheck: 'Sağlamlıq Yoxlanışı',
    github: 'GitHub',
    
    // API sections
    overview: 'API İcmalı',
    overviewDescription: 'TalentFlow API haqqında ümumi məlumat',
    authentication: 'Autentifikasiya',
    authenticationDescription: 'JWT tokenlər və avtorizasiya',
    jobs: 'İşlər',
    jobsDescription: 'İş elanları və vəzifələrin idarə edilməsi',
    candidates: 'Namizədlər',
    candidatesDescription: 'Namizədlər və profillərin idarə edilməsi',
    applications: 'Müraciətlər',
    applicationsDescription: 'İş müraciətlərinin idarə edilməsi',
    interviews: 'Müsahibələr',
    interviewsDescription: 'Müsahibələrin planlaşdırılması və idarə edilməsi',
    analytics: 'Analitika',
    analyticsDescription: 'Statistika və hesabatlar',
    settings: 'Parametrlər',
    settingsDescription: 'Parametrləri idarə etmək üçün API',
    
    // API content
    apiOverviewContent: 'TalentFlow API HR platforması ilə işləmək üçün RESTful API-dir. API işləri, namizədləri, şirkətləri və digər sistem qurumlarını idarə etməyə imkan verir.',
    apiFeatures: 'Əsas Xüsusiyyətlər:',
    restfulArchitecture: 'RESTful arxitektura',
    jsonDataFormat: 'JSON məlumat formatı',
    jwtAuthentication: 'JWT autentifikasiya',
    rateLimiting: 'Sürət məhdudiyyəti',
    inputValidation: 'Giriş validasiyası',
    detailedDocumentation: 'Ətraflı sənədləşmə',
    
    // Authentication content
    authContent: 'Bütün API sorğuları (ictimai endpointlər istisna olmaqla) JWT tokenləri vasitəsilə autentifikasiya tələb edir.',
    authProcess: 'Autentifikasiya prosesi:',
    getToken: '/auth/login vasitəsilə token əldə et',
    useToken: 'Authorization başlığında token istifadə et',
    refreshToken: '/auth/refresh vasitəsilə token yenilə',
    
    // Jobs content
    jobsContent: 'İş elanlarını yaratmaq, redaktə etmək və idarə etmək üçün API. Qabaqcıl filtrləri, axtarışı və AI tövsiyələrini dəstəkləyir.',
    jobsFeatures: 'Əsas funksiyalar:',
    createEditJobs: 'İşlərin yaradılması və redaktəsi',
    searchFilter: 'Axtarış və filtrləmə',
    aiRecommendations: 'AI namizəd tövsiyələri',
    statisticsAnalytics: 'Statistika və analitika',
    
    // Candidates content
    candidatesContent: 'Namizədlərlə, onların profilləri və müraciətləri ilə işləmək üçün API. AI uyğunlaşdırma və tövsiyələr daxildir.',
    candidatesFunctionality: 'Funksionallıq:',
    manageProfiles: 'Namizəd profilinin idarə edilməsi',
    aiMatching: 'İşlərlə AI uyğunlaşdırma',
    skillAssessment: 'Bacarıqların qiymətləndirilməsi',
    applicationHistory: 'Müraciət tarixçəsi',
    
    // Applications content
    applicationsContent: 'İşlərə namizəd müraciətləri ilə işləmək üçün API. Statusları, şərhləri və iş axını daxildir.',
    applicationStatuses: 'Müraciət statusları:',
    new: 'Yeni',
    reviewed: 'Nəzərdən Keçirildi',
    selected: 'Seçildi',
    interview: 'Müsahibə',
    acceptedRejected: 'Qəbul Edildi/Rədd Edildi',
    
    // Interviews content
    interviewsContent: 'Namizədlərlə müsahibələri planlaşdırmaq və idarə etmək üçün API. Təqvim və xatırlatmaları dəstəkləyir.',
    interviewCapabilities: 'İmkanlar:',
    planInterview: 'Müsahibələrin planlaşdırılması',
    calendarIntegration: 'Təqvim inteqrasiyası',
    reminders: 'Xatırlatmalar',
    interviewAssessment: 'Müsahibənin qiymətləndirilməsi',
    
    // Analytics content
    analyticsContent: 'HR işinin müxtəlif aspektləri üzrə analitika və statistika əldə etmək üçün API.',
    reportTypes: 'Hesabat növləri:',
    hiringStatistics: 'İşə qəbul statistikası',
    recruitmentEfficiency: 'İşəgötürmə effektivliyi',
    candidateAnalysis: 'Namizəd analizi',
    hrTeamProductivity: 'HR komandasının məhsuldarlığı',
    
    // Settings content
    settingsContent: 'İstifadəçi, şirkət və sistem parametrləri ilə işləmək üçün API.',
    settingTypes: 'Parametr növləri:',
    userProfile: 'İstifadəçi profili',
    notificationSettings: 'Bildiriş parametrləri',
    security: 'Təhlükəsizlik',
    integrations: 'İnteqrasiyalar',
    
    // API endpoints
    getJobsList: 'İşlər siyahısını al',
    createNewJob: 'Yeni iş yarat',
    getJobDetails: 'İş təfərrüatlarını al',
    updateJob: 'İşi yenilə',
    searchCandidates: 'Namizəd axtar',
    candidateProfile: 'Namizəd profili',
    assessCandidate: 'Namizədi qiymətləndir',
    getApplicationsList: 'Müraciətlər siyahısını al',
    createApplication: 'Müraciət yarat',
    updateStatus: 'Statusu yenilə',
    getInterviewsList: 'Müsahibələr siyahısını al',
    createInterview: 'Müsahibə yarat',
    updateInterview: 'Müsahibəni yenilə',
    userSettings: 'İstifadəçi parametrləri',
    updateProfile: 'Profili yenilə',
    
    // Authentication endpoints
    login: 'Daxil Ol',
    
    // Common terms
    method: 'Metod',
    path: 'Yol',
    description: 'Təsvir',
    example: 'Nümunə',
    copy: 'Köçür',
    copied: 'Köçürüldü'
  }
};
