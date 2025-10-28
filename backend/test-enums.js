// Тестовий файл для перевірки enum мапінгу
const { mapJobType, mapExperienceLevel } = require('./dist/utils/jobEnumMapper');

console.log('🧪 Testing enum mapping...\n');

// Тестуємо JobType мапінг
console.log('📋 JobType Mapping Tests:');
console.log('Ukrainian -> Enum:');
console.log('  "Повна зайнятість" ->', mapJobType('Повна зайнятість', 'uk'));
console.log('  "Часткова зайнятість" ->', mapJobType('Часткова зайнятість', 'uk'));
console.log('  "Контракт" ->', mapJobType('Контракт', 'uk'));

console.log('\nEnglish -> Enum:');
console.log('  "Full Time" ->', mapJobType('Full Time', 'en'));
console.log('  "Part Time" ->', mapJobType('Part Time', 'en'));
console.log('  "Contract" ->', mapJobType('Contract', 'en'));

console.log('\nGerman -> Enum:');
console.log('  "Vollzeit" ->', mapJobType('Vollzeit', 'de'));
console.log('  "Teilzeit" ->', mapJobType('Teilzeit', 'de'));

console.log('\nFrench -> Enum:');
console.log('  "Temps plein" ->', mapJobType('Temps plein', 'fr'));
console.log('  "Temps partiel" ->', mapJobType('Temps partiel', 'fr'));

console.log('\nSpanish -> Enum:');
console.log('  "Tiempo completo" ->', mapJobType('Tiempo completo', 'es'));
console.log('  "Tiempo parcial" ->', mapJobType('Tiempo parcial', 'es'));

console.log('\nItalian -> Enum:');
console.log('  "Tempo pieno" ->', mapJobType('Tempo pieno', 'it'));
console.log('  "Tempo parziale" ->', mapJobType('Tempo parziale', 'it'));

console.log('\nPolish -> Enum:');
console.log('  "Pełny etat" ->', mapJobType('Pełny etat', 'pl'));
console.log('  "Część etatu" ->', mapJobType('Część etatu', 'pl'));

console.log('\nRussian -> Enum:');
console.log('  "Полная занятость" ->', mapJobType('Полная занятость', 'ru'));
console.log('  "Частичная занятость" ->', mapJobType('Частичная занятость', 'ru'));

console.log('\nCzech -> Enum:');
console.log('  "Plný úvazek" ->', mapJobType('Plný úvazek', 'cs'));
console.log('  "Částečný úvazek" ->', mapJobType('Částečný úvazek', 'cs'));

console.log('\nPortuguese -> Enum:');
console.log('  "Tempo integral" ->', mapJobType('Tempo integral', 'pt'));
console.log('  "Tempo parcial" ->', mapJobType('Tempo parcial', 'pt'));

console.log('\n' + '='.repeat(50) + '\n');

// Тестуємо ExperienceLevel мапінг
console.log('👤 ExperienceLevel Mapping Tests:');
console.log('Ukrainian -> Enum:');
console.log('  "Junior" ->', mapExperienceLevel('Junior', 'uk'));
console.log('  "Middle" ->', mapExperienceLevel('Middle', 'uk'));
console.log('  "Senior" ->', mapExperienceLevel('Senior', 'uk'));

console.log('\nEnglish -> Enum:');
console.log('  "Entry" ->', mapExperienceLevel('Entry', 'en'));
console.log('  "Junior" ->', mapExperienceLevel('Junior', 'en'));
console.log('  "Senior" ->', mapExperienceLevel('Senior', 'en'));

console.log('\nGerman -> Enum:');
console.log('  "Einsteiger" ->', mapExperienceLevel('Einsteiger', 'de'));
console.log('  "Mittel" ->', mapExperienceLevel('Mittel', 'de'));
console.log('  "Führungskraft" ->', mapExperienceLevel('Führungskraft', 'de'));

console.log('\nFrench -> Enum:');
console.log('  "Débutant" ->', mapExperienceLevel('Débutant', 'fr'));
console.log('  "Intermédiaire" ->', mapExperienceLevel('Intermédiaire', 'fr'));
console.log('  "Cadre" ->', mapExperienceLevel('Cadre', 'fr'));

console.log('\nSpanish -> Enum:');
console.log('  "Principiante" ->', mapExperienceLevel('Principiante', 'es'));
console.log('  "Intermedio" ->', mapExperienceLevel('Intermedio', 'es'));
console.log('  "Ejecutivo" ->', mapExperienceLevel('Ejecutivo', 'es'));

console.log('\nItalian -> Enum:');
console.log('  "Principiante" ->', mapExperienceLevel('Principiante', 'it'));
console.log('  "Intermedio" ->', mapExperienceLevel('Intermedio', 'it'));
console.log('  "Dirigente" ->', mapExperienceLevel('Dirigente', 'it'));

console.log('\nPolish -> Enum:');
console.log('  "Początkujący" ->', mapExperienceLevel('Początkujący', 'pl'));
console.log('  "Średni" ->', mapExperienceLevel('Średni', 'pl'));
console.log('  "Kierowniczy" ->', mapExperienceLevel('Kierowniczy', 'pl'));

console.log('\nRussian -> Enum:');
console.log('  "Начинающий" ->', mapExperienceLevel('Начинающий', 'ru'));
console.log('  "Middle" ->', mapExperienceLevel('Middle', 'ru'));
console.log('  "Руководящий" ->', mapExperienceLevel('Руководящий', 'ru'));

console.log('\nCzech -> Enum:');
console.log('  "Začátečník" ->', mapExperienceLevel('Začátečník', 'cs'));
console.log('  "Střední" ->', mapExperienceLevel('Střední', 'cs'));
console.log('  "Vedoucí" ->', mapExperienceLevel('Vedoucí', 'cs'));

console.log('\nPortuguese -> Enum:');
console.log('  "Iniciante" ->', mapExperienceLevel('Iniciante', 'pt'));
console.log('  "Intermediário" ->', mapExperienceLevel('Intermediário', 'pt'));
console.log('  "Executivo" ->', mapExperienceLevel('Executivo', 'pt'));

console.log('\n✅ All tests completed!');

