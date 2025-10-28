#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функція для виправлення імпортів
function fixImports(routeFile) {
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
        const importKey = line.trim();
        if (!seenImports.has(importKey)) {
          seenImports.add(importKey);
          cleanedLines.push(line);
        }
      } else {
        cleanedLines.push(line);
      }
    }
    
    content = cleanedLines.join('\n');
    
    // Видаляємо порожні рядки після імпортів
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    // Записуємо виправлений файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Виправлено імпорти в ${routeFile}`);
    
  } catch (error) {
    console.error(`❌ Помилка при виправленні ${routeFile}:`, error.message);
  }
}

// Список файлів для виправлення
const filesToFix = [
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

console.log('🔧 Виправляємо імпорти в роутах...\n');

filesToFix.forEach(routeFile => {
  fixImports(routeFile);
});

console.log('\n✨ Виправлення імпортів завершено!');




