#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Мапінг роутів до їх DTO
const routeDtoMapping = {
  'userRoutes.ts': {
    imports: ['UpdateUserDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'jobRoutes.ts': {
    imports: ['CreateJobDto', 'UpdateJobDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'applicationRoutes.ts': {
    imports: ['CreateApplicationDto', 'UpdateApplicationDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'interviewRoutes.ts': {
    imports: ['CreateInterviewDto', 'UpdateInterviewDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'companyRoutes.ts': {
    imports: ['CreateCompanyDto', 'UpdateCompanyDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'authRoutes.ts': {
    imports: ['CreateUserDto', 'LoginDto', 'RefreshTokenDto', 'ChangePasswordDto', 'UpdateUserDto'],
    commonImports: []
  },
  'assessmentRoutes.ts': {
    imports: ['CreateAssessmentDto', 'UpdateAssessmentDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'paymentRoutes.ts': {
    imports: ['CreatePaymentDto', 'UpdatePaymentDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'subscriptionRoutes.ts': {
    imports: ['CreateSubscriptionDto', 'UpdateSubscriptionDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'fileRoutes.ts': {
    imports: ['UpdateFileDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'settingsRoutes.ts': {
    imports: ['UpdateSettingsDto'],
    commonImports: ['UuidParamDto']
  },
  'helpRoutes.ts': {
    imports: ['CreateHelpDto', 'UpdateHelpDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'integrationsRoutes.ts': {
    imports: ['CreateIntegrationsDto', 'UpdateIntegrationsDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'automationRoutes.ts': {
    imports: ['CreateAutomationDto', 'UpdateAutomationDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'events.ts': {
    imports: ['CreateEventDto', 'UpdateEventDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'reportRoutes.ts': {
    imports: ['CreateReportDto', 'UpdateReportDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'adminRoutes.ts': {
    imports: [],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'healthRoutes.ts': {
    imports: [],
    commonImports: []
  },
  'statsRoutes.ts': {
    imports: [],
    commonImports: ['SearchDto']
  },
  'searchRoutes.ts': {
    imports: [],
    commonImports: ['SearchDto']
  },
  'candidateProfileRoutes.ts': {
    imports: ['CreateCandidateProfileDto', 'UpdateCandidateProfileDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'candidates.ts': {
    imports: ['CreateCandidateDto', 'UpdateCandidateDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'docsRoutes.ts': {
    imports: ['CreateDocsDto', 'UpdateDocsDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'messageRoutes.ts': {
    imports: ['CreateMessageDto', 'UpdateMessageDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  },
  'notificationRoutes.ts': {
    imports: ['CreateNotificationDto', 'UpdateNotificationDto'],
    commonImports: ['UuidParamDto', 'SearchDto']
  }
};

// Функція для оновлення імпортів
function updateImports(content, routeFile) {
  const mapping = routeDtoMapping[routeFile];
  if (!mapping) return content;

  // Додаємо імпорти для валідації
  let newImports = [];
  
  if (mapping.imports.length > 0) {
    newImports.push(`import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';`);
    newImports.push(`import { ${mapping.imports.join(', ')} } from '../dto/${mapping.imports[0].replace(/Create|Update|Dto/g, '').replace(/([A-Z])/g, '$1').toLowerCase()}Dto';`);
  }
  
  if (mapping.commonImports.length > 0) {
    if (newImports.length === 0) {
      newImports.push(`import { validateDto, validateParams, validateQuery } from '../middleware/dtoValidation';`);
    }
    newImports.push(`import { ${mapping.commonImports.join(', ')} } from '../dto/CommonDto';`);
  }

  // Знаходимо останній імпорт
  const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
  const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;

  // Вставляємо нові імпорти
  const beforeImports = content.substring(0, insertIndex);
  const afterImports = content.substring(insertIndex);
  
  return beforeImports + newImports.join('\n') + '\n' + afterImports;
}

// Функція для оновлення роутів
function updateRoutes(content, routeFile) {
  const mapping = routeDtoMapping[routeFile];
  if (!mapping) return content;

  // Прості правила для додавання валідації
  let updatedContent = content;

  // Додаємо валідацію для POST роутів
  if (mapping.imports.some(imp => imp.includes('Create'))) {
    const createDto = mapping.imports.find(imp => imp.includes('Create'));
    updatedContent = updatedContent.replace(
      /router\.post\('([^']+)',\s*([^,]+),\s*([^)]+)\)/g,
      `router.post('$1', $2, validateDto(${createDto}), $3)`
    );
  }

  // Додаємо валідацію для PUT роутів
  if (mapping.imports.some(imp => imp.includes('Update'))) {
    const updateDto = mapping.imports.find(imp => imp.includes('Update'));
    updatedContent = updatedContent.replace(
      /router\.put\('([^']+)',\s*([^,]+),\s*([^)]+)\)/g,
      `router.put('$1', $2, validateParams(UuidParamDto), validateDto(${updateDto}, true), $3)`
    );
  }

  // Додаємо валідацію для GET роутів з параметрами
  if (mapping.commonImports.includes('UuidParamDto')) {
    updatedContent = updatedContent.replace(
      /router\.get\('\/:id',\s*([^)]+)\)/g,
      `router.get('/:id', validateParams(UuidParamDto), $1)`
    );
  }

  // Додаємо валідацію для DELETE роутів
  if (mapping.commonImports.includes('UuidParamDto')) {
    updatedContent = updatedContent.replace(
      /router\.delete\('\/:id',\s*([^)]+)\)/g,
      `router.delete('/:id', $1, validateParams(UuidParamDto))`
    );
  }

  // Додаємо валідацію для GET роутів з query параметрами
  if (mapping.commonImports.includes('SearchDto')) {
    updatedContent = updatedContent.replace(
      /router\.get\('\/',\s*([^)]+)\)/g,
      `router.get('/', validateQuery(SearchDto), $1)`
    );
  }

  return updatedContent;
}

// Основна функція
function updateRouteFile(routeFile) {
  const filePath = path.join(__dirname, '..', 'src', 'routes', routeFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${routeFile} не знайдено, пропускаємо...`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Оновлюємо імпорти
    content = updateImports(content, routeFile);
    
    // Оновлюємо роути
    content = updateRoutes(content, routeFile);
    
    // Записуємо оновлений файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Оновлено ${routeFile}`);
    
  } catch (error) {
    console.error(`❌ Помилка при оновленні ${routeFile}:`, error.message);
  }
}

// Запускаємо оновлення для всіх файлів
console.log('🚀 Починаємо оновлення роутів з валідацією...\n');

Object.keys(routeDtoMapping).forEach(routeFile => {
  updateRouteFile(routeFile);
});

console.log('\n✨ Оновлення завершено!');




