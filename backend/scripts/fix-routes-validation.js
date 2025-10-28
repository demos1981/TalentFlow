#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функція для виправлення роутів
function fixRouteFile(routeFile) {
  const filePath = path.join(__dirname, '..', 'src', 'routes', routeFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${routeFile} не знайдено, пропускаємо...`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Виправляємо неправильні валідації
    content = content.replace(
      /router\.get\('\/',\s*validateQuery\(SearchDto\),\s*validateDto\([^)]+\),\s*([^)]+)\)/g,
      `router.get('/', validateQuery(SearchDto), $1)`
    );
    
    content = content.replace(
      /router\.delete\('\/:id',\s*validateParams\(UuidParamDto,\s*validateParams\(UuidParamDto\)\),\s*validateDto\([^)]+,\s*true\),\s*requireRole\([^)]+\),\s*([^)]+)\)/g,
      `router.delete('/:id', requireRole(['admin']), validateParams(UuidParamDto), $1)`
    );
    
    content = content.replace(
      /router\.delete\('\/:id',\s*validateParams\(UuidParamDto,\s*validateParams\(UuidParamDto\)\),\s*validateDto\([^)]+,\s*true\),\s*([^)]+)\)/g,
      `router.delete('/:id', $1, validateParams(UuidParamDto))`
    );
    
    // Виправляємо порядок middleware
    content = content.replace(
      /router\.put\('\/:id',\s*validateParams\(UuidParamDto\),\s*validateDto\(([^)]+),\s*true\),\s*([^)]+)\)/g,
      `router.put('/:id', validateParams(UuidParamDto), validateDto($1, true), $2)`
    );
    
    // Виправляємо POST роути
    content = content.replace(
      /router\.post\('\/',\s*([^)]+)\)/g,
      (match, controller) => {
        if (content.includes('CreatePaymentDto')) {
          return `router.post('/', validateDto(CreatePaymentDto), ${controller})`;
        } else if (content.includes('CreateSubscriptionDto')) {
          return `router.post('/', validateDto(CreateSubscriptionDto), ${controller})`;
        } else if (content.includes('CreateHelpDto')) {
          return `router.post('/', validateDto(CreateHelpDto), ${controller})`;
        } else if (content.includes('CreateIntegrationsDto')) {
          return `router.post('/', validateDto(CreateIntegrationsDto), ${controller})`;
        } else if (content.includes('CreateAutomationDto')) {
          return `router.post('/', validateDto(CreateAutomationDto), ${controller})`;
        } else if (content.includes('CreateEventDto')) {
          return `router.post('/', validateDto(CreateEventDto), ${controller})`;
        } else if (content.includes('CreateReportDto')) {
          return `router.post('/', validateDto(CreateReportDto), ${controller})`;
        } else if (content.includes('CreateCandidateProfileDto')) {
          return `router.post('/', validateDto(CreateCandidateProfileDto), ${controller})`;
        } else if (content.includes('CreateCandidateDto')) {
          return `router.post('/', validateDto(CreateCandidateDto), ${controller})`;
        } else if (content.includes('CreateDocsDto')) {
          return `router.post('/', validateDto(CreateDocsDto), ${controller})`;
        } else if (content.includes('CreateMessageDto')) {
          return `router.post('/', validateDto(CreateMessageDto), ${controller})`;
        } else if (content.includes('CreateNotificationDto')) {
          return `router.post('/', validateDto(CreateNotificationDto), ${controller})`;
        }
        return match;
      }
    );
    
    // Записуємо виправлений файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Виправлено ${routeFile}`);
    
  } catch (error) {
    console.error(`❌ Помилка при виправленні ${routeFile}:`, error.message);
  }
}

// Список файлів для виправлення
const filesToFix = [
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

console.log('🔧 Виправляємо роути з валідацією...\n');

filesToFix.forEach(routeFile => {
  fixRouteFile(routeFile);
});

console.log('\n✨ Виправлення завершено!');




