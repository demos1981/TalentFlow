#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Мапінг неправильних назв файлів до правильних
const dtoFileMapping = {
  'userDto': 'UserDto',
  'jobDto': 'JobDto',
  'applicationDto': 'ApplicationDto',
  'interviewDto': 'InterviewDto',
  'assessmentDto': 'AssessmentDto',
  'paymentDto': 'PaymentDto',
  'subscriptionDto': 'SubscriptionDto',
  'companyDto': 'CompanyDto',
  'messageDto': 'MessageDto',
  'notificationDto': 'NotificationDto',
  'fileDto': 'FileDto',
  'settingsDto': 'SettingsDto',
  'helpDto': 'HelpDto',
  'integrationsDto': 'IntegrationsDto',
  'automationDto': 'AutomationDto',
  'eventDto': 'EventDto',
  'reportDto': 'ReportDto',
  'adminDto': 'AdminDto',
  'healthDto': 'HealthDto',
  'statsDto': 'StatsDto',
  'searchDto': 'SearchDto',
  'candidateDto': 'CandidateDto',
  'docsDto': 'DocsDto',
  'aimatchingDto': 'AIMatchingDto',
  'candidateprofileDto': 'CandidateProfileDto'
};

// Функція для виправлення імпортів DTO в роутах
function fixDtoImportsInRoutes(routeFile) {
  const filePath = path.join(__dirname, '..', 'src', 'routes', routeFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${routeFile} не знайдено, пропускаємо...`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Виправляємо імпорти DTO
    for (const [wrongName, correctName] of Object.entries(dtoFileMapping)) {
      const wrongImport = `from '../dto/${wrongName}'`;
      const correctImport = `from '../dto/${correctName}'`;
      
      if (content.includes(wrongImport)) {
        content = content.replace(new RegExp(wrongImport, 'g'), correctImport);
        hasChanges = true;
        console.log(`  ✅ Виправлено імпорт: ${wrongName} -> ${correctName}`);
      }
    }
    
    if (hasChanges) {
      // Записуємо виправлений файл
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Виправлено імпорти в ${routeFile}`);
    } else {
      console.log(`✅ ${routeFile} - імпорти в порядку`);
    }
    
  } catch (error) {
    console.error(`❌ Помилка при виправленні ${routeFile}:`, error.message);
  }
}

// Список файлів роутів для перевірки
const routeFiles = [
  'userRoutes.ts',
  'jobRoutes.ts',
  'applicationRoutes.ts',
  'interviewRoutes.ts',
  'companyRoutes.ts',
  'authRoutes.ts',
  'assessmentRoutes.ts',
  'paymentRoutes.ts',
  'subscriptionRoutes.ts',
  'fileRoutes.ts',
  'settingsRoutes.ts',
  'helpRoutes.ts',
  'integrationsRoutes.ts',
  'automationRoutes.ts',
  'events.ts',
  'reportRoutes.ts',
  'adminRoutes.ts',
  'healthRoutes.ts',
  'statsRoutes.ts',
  'searchRoutes.ts',
  'candidateProfileRoutes.ts',
  'candidates.ts',
  'docsRoutes.ts',
  'messageRoutes.ts',
  'notificationRoutes.ts'
];

console.log('🔧 Виправляємо імпорти DTO в роутах...\n');

routeFiles.forEach(routeFile => {
  fixDtoImportsInRoutes(routeFile);
});

console.log('\n✨ Виправлення імпортів DTO в роутах завершено!');




