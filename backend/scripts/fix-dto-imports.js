#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функція для виправлення імпортів в DTO файлах
function fixDtoImports(dtoFile) {
  const filePath = path.join(__dirname, '..', 'src', 'dto', dtoFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${dtoFile} не знайдено, пропускаємо...`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Знаходимо поточний імпорт class-validator
    const importMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]class-validator['"];?/);
    
    if (importMatch) {
      const currentImports = importMatch[1].split(',').map(imp => imp.trim());
      
      // Список всіх можливих декораторів
      const allDecorators = [
        'IsString', 'IsOptional', 'IsEnum', 'IsNumber', 'IsDateString', 
        'MinLength', 'MaxLength', 'IsUUID', 'Min', 'Max', 'IsEmail',
        'IsBoolean', 'IsArray', 'IsObject', 'IsUrl', 'IsPhoneNumber',
        'IsNotEmpty', 'IsDefined', 'IsAlpha', 'IsAlphanumeric', 'IsNumeric',
        'IsDecimal', 'IsInt', 'IsPositive', 'IsNegative', 'IsDate',
        'IsISO8601', 'IsJWT', 'IsBase64', 'IsMongoId', 'IsPort',
        'IsIP', 'IsJSON', 'IsLatLong', 'IsPostalCode', 'IsCurrency',
        'IsCreditCard', 'IsIBAN', 'IsBIC', 'IsEAN', 'IsISIN',
        'IsISBN', 'IsISSN', 'IsISRC', 'IsRFC3339', 'IsLocale',
        'IsTimeZone', 'IsUUID', 'IsFirebasePushId', 'IsMimeType',
        'IsDataURI', 'IsHash', 'IsJWT', 'IsJWT', 'IsJWT'
      ];
      
      // Знаходимо які декоратори використовуються в файлі
      const usedDecorators = new Set();
      for (const decorator of allDecorators) {
        if (content.includes(`@${decorator}`)) {
          usedDecorators.add(decorator);
        }
      }
      
      // Додаємо відсутні декоратори
      const missingDecorators = Array.from(usedDecorators).filter(dec => !currentImports.includes(dec));
      
      if (missingDecorators.length > 0) {
        const newImports = [...currentImports, ...missingDecorators].sort();
        const newImportStatement = `import { ${newImports.join(', ')} } from 'class-validator';`;
        
        content = content.replace(importMatch[0], newImportStatement);
        
        // Записуємо оновлений файл
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Додано імпорти в ${dtoFile}: ${missingDecorators.join(', ')}`);
      } else {
        console.log(`✅ ${dtoFile} - імпорти в порядку`);
      }
    } else {
      console.log(`⚠️  ${dtoFile} - не знайдено імпорт class-validator`);
    }
    
  } catch (error) {
    console.error(`❌ Помилка при виправленні ${dtoFile}:`, error.message);
  }
}

// Список DTO файлів для перевірки
const dtoFiles = [
  'UserDto.ts',
  'JobDto.ts',
  'ApplicationDto.ts',
  'InterviewDto.ts',
  'AssessmentDto.ts',
  'PaymentDto.ts',
  'SubscriptionDto.ts',
  'CompanyDto.ts',
  'MessageDto.ts',
  'NotificationDto.ts',
  'FileDto.ts',
  'SettingsDto.ts',
  'HelpDto.ts',
  'IntegrationsDto.ts',
  'AutomationDto.ts',
  'ReportDto.ts',
  'AdminDto.ts',
  'HealthDto.ts',
  'StatsDto.ts',
  'SearchDto.ts',
  'CandidateDto.ts',
  'DocsDto.ts',
  'AIMatchingDto.ts',
  'CommonDto.ts'
];

console.log('🔧 Виправляємо імпорти в DTO файлах...\n');

dtoFiles.forEach(dtoFile => {
  fixDtoImports(dtoFile);
});

console.log('\n✨ Виправлення імпортів DTO завершено!');




