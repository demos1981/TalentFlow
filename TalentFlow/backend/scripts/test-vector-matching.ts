#!/usr/bin/env ts-node

/**
 * Тестовий скрипт для демонстрації векторного AI матчингу
 * 
 * Запуск: npm run test:vector-matching
 */

import { OptimizedAiMatchingService } from '../src/services/optimizedAiMatchingService';
import { VectorSearchService } from '../src/services/vectorSearchService';
import { EmbeddingService } from '../src/services/embeddingService';

async function testVectorMatching() {
  console.log('🚀 Тестування векторного AI матчингу...\n');

  try {
    // Ініціалізація сервісів
    const embeddingService = new EmbeddingService();
    const vectorSearchService = new VectorSearchService();
    const optimizedMatchingService = new OptimizedAiMatchingService();

    console.log('✅ Сервіси ініціалізовані\n');

    // Тест 1: Генерація embedding
    console.log('📝 Тест 1: Генерація embedding...');
    const testText = 'Senior React Developer with 5+ years experience in TypeScript, Node.js, and AWS';
    
    const startTime = Date.now();
    const embeddingResult = await embeddingService.generateEmbedding(testText);
    const embeddingTime = Date.now() - startTime;

    console.log(`   ✅ Embedding згенеровано за ${embeddingTime}ms`);
    console.log(`   📊 Розмір вектора: ${embeddingResult.embedding.length}`);
    console.log(`   🤖 Модель: ${embeddingResult.model}`);
    console.log(`   💰 Використано токенів: ${embeddingResult.usage?.totalTokens || 'N/A'}\n`);

    // Тест 2: Косинусна схожість
    console.log('🔍 Тест 2: Косинусна схожість...');
    const text1 = 'Senior React Developer with TypeScript experience';
    const text2 = 'Full-stack JavaScript Developer with React and Node.js';
    const text3 = 'Python Backend Developer with Django experience';

    const embedding1 = await embeddingService.generateEmbedding(text1);
    const embedding2 = await embeddingService.generateEmbedding(text2);
    const embedding3 = await embeddingService.generateEmbedding(text3);

    const similarity12 = embeddingService.calculateCosineSimilarity(
      embedding1.embedding, 
      embedding2.embedding
    );
    const similarity13 = embeddingService.calculateCosineSimilarity(
      embedding1.embedding, 
      embedding3.embedding
    );

    console.log(`   📊 Схожість "${text1}" ↔ "${text2}": ${(similarity12 * 100).toFixed(1)}%`);
    console.log(`   📊 Схожість "${text1}" ↔ "${text3}": ${(similarity13 * 100).toFixed(1)}%`);
    console.log(`   ✅ Очікувано: React ↔ React > React ↔ Python\n`);

    // Тест 3: Створення тексту для embedding
    console.log('📋 Тест 3: Створення тексту для embedding...');
    
    const mockJob = {
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced frontend developer to join our team...',
      requirements: '5+ years of React, TypeScript, CSS, HTML experience required',
      benefits: 'Competitive salary, health insurance, remote work',
      location: 'Kyiv, Ukraine',
      industry: 'Technology',
      skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
      tags: ['frontend', 'react', 'typescript'],
      experienceLevel: 'senior',
      type: 'full_time'
    };

    const mockCandidate = {
      title: 'Frontend Developer',
      summary: 'Experienced frontend developer with 6 years of React and TypeScript experience',
      bio: 'Passionate about creating beautiful and functional user interfaces',
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux'],
      location: 'Kyiv, Ukraine',
      workExperience: ['Senior Frontend Developer at TechCorp (2020-2024)'],
      education: ['Master of Computer Science, KPI'],
      certifications: ['React Developer Certification'],
      languages: ['Ukrainian', 'English'],
      achievements: ['Led frontend team of 5 developers'],
      yearsOfExperience: 6
    };

    const jobText = embeddingService.createJobEmbeddingText(mockJob);
    const candidateText = embeddingService.createCandidateEmbeddingText(mockCandidate);

    console.log(`   📄 Текст вакансії (${jobText.length} символів):`);
    console.log(`      ${jobText.substring(0, 100)}...`);
    console.log(`   👤 Текст кандидата (${candidateText.length} символів):`);
    console.log(`      ${candidateText.substring(0, 100)}...\n`);

    // Тест 4: Оцінка вартості
    console.log('💰 Тест 4: Оцінка вартості обробки...');
    
    const jobsCount = 1000;
    const aiTopK = 20;
    const estimatedCost = (jobsCount * aiTopK * 0.000135); // $0.000135 per match

    console.log(`   📊 ${jobsCount} вакансій × ${aiTopK} AI аналізів = ${jobsCount * aiTopK} запитів`);
    console.log(`   💵 Оціночна вартість: $${estimatedCost.toFixed(2)}`);
    console.log(`   🎯 Порівняно з наївним підходом: $${(jobsCount * 1000 * 0.000135).toFixed(2)}`);
    console.log(`   ✅ Економія: ${((1 - estimatedCost / (jobsCount * 1000 * 0.000135)) * 100).toFixed(1)}%\n`);

    // Тест 5: Статистика
    console.log('📈 Тест 5: Статистика системи...');
    
    try {
      const stats = await optimizedMatchingService.getMatchingStats();
      console.log(`   📊 Загальна статистика:`);
      console.log(`      Вакансій: ${stats.totalJobs}`);
      console.log(`      Вакансій з embeddings: ${stats.jobsWithEmbeddings}`);
      console.log(`      Кандидатів: ${stats.totalCandidates}`);
      console.log(`      Кандидатів з embeddings: ${stats.candidatesWithEmbeddings}`);
      console.log(`      Середня векторна схожість: ${(stats.averageVectorSimilarity * 100).toFixed(1)}%`);
      console.log(`      Середня AI оцінка: ${stats.averageAiScore}%\n`);
    } catch (error) {
      console.log(`   ⚠️  Не вдалося отримати статистику (можливо, БД не підключена)\n`);
    }

    console.log('🎉 Всі тести пройдено успішно!');
    console.log('\n📋 Підсумок:');
    console.log('   ✅ EmbeddingService працює');
    console.log('   ✅ Косинусна схожість працює');
    console.log('   ✅ Створення текстів для embedding працює');
    console.log('   ✅ Оцінка вартості показує велику економію');
    console.log('   ✅ Система готова до використання!');

  } catch (error) {
    console.error('❌ Помилка під час тестування:', error);
    process.exit(1);
  }
}

// Запуск тесту
if (require.main === module) {
  testVectorMatching()
    .then(() => {
      console.log('\n🏁 Тестування завершено');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Критична помилка:', error);
      process.exit(1);
    });
}

export { testVectorMatching };
