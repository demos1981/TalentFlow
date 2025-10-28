#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функція для очищення роутів
function cleanRouteFile(routeFile) {
  const filePath = path.join(__dirname, '..', 'src', 'routes', routeFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${routeFile} не знайдено, пропускаємо...`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Видаляємо дублікати імпортів
    const lines = content.split('\n');
    const seenImports = new Set();
    const cleanedLines = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('import')) {
        if (!seenImports.has(line.trim())) {
          seenImports.add(line.trim());
          cleanedLines.push(line);
        }
      } else {
        cleanedLines.push(line);
      }
    }
    
    content = cleanedLines.join('\n');
    
    // Видаляємо дублікати middleware в роутах
    content = content.replace(
      /validateDto\(([^)]+)\),\s*validateDto\(\1\)/g,
      'validateDto($1)'
    );
    
    content = content.replace(
      /validateParams\(([^)]+)\),\s*validateParams\(\1\)/g,
      'validateParams($1)'
    );
    
    content = content.replace(
      /validateQuery\(([^)]+)\),\s*validateQuery\(\1\)/g,
      'validateQuery($1)'
    );
    
    // Виправляємо неправильні структури requireRole
    content = content.replace(
      /requireRole\(\[([^]]+),\s*validateDto\([^)]+\),\s*([^]]+)\]\)/g,
      'requireRole([$1, $2])'
    );
    
    content = content.replace(
      /requireRole\(\[([^]]+),\s*validateParams\([^)]+\),\s*validateDto\([^)]+,\s*true\),\s*([^]]+)\]\)/g,
      'requireRole([$1, $2])'
    );
    
    content = content.replace(
      /requireRole\(\[([^]]+)\],\s*validateParams\([^)]+\)\)/g,
      'requireRole([$1])'
    );
    
    // Виправляємо неправильні структури validateParams
    content = content.replace(
      /validateParams\(([^,]+),\s*validateParams\(\1\)\)/g,
      'validateParams($1)'
    );
    
    // Виправляємо неправильні DTO в verify роутах
    content = content.replace(
      /router\.post\('\/:id\/verify',\s*requireRole\(\[([^]]+)\]\),\s*validateDto\([^)]+\),\s*validateParams\([^)]+\),\s*([^)]+)\)/g,
      'router.post(\'/:id/verify\', requireRole([$1]), validateParams(UuidParamDto), $3)'
    );
    
    // Записуємо очищений файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Очищено ${routeFile}`);
    
  } catch (error) {
    console.error(`❌ Помилка при очищенні ${routeFile}:`, error.message);
  }
}

// Список файлів для очищення
const filesToClean = [
  'jobRoutes.ts',
  'applicationRoutes.ts',
  'interviewRoutes.ts',
  'companyRoutes.ts',
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

console.log('🧹 Очищуємо роути від дублікатів...\n');

filesToClean.forEach(routeFile => {
  cleanRouteFile(routeFile);
});

console.log('\n✨ Очищення завершено!');




