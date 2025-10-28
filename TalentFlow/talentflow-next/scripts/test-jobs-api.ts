#!/usr/bin/env ts-node

/**
 * Тестовий скрипт для перевірки API вакансій
 * 
 * Запуск: npm run test:jobs-api
 */

import { jobsApi } from '../services/api';

async function testJobsApi() {
  console.log('🔍 Тестування API вакансій...\n');

  try {
    // Тест 1: Отримання вакансій користувача
    console.log('📝 Тест 1: Отримання вакансій користувача...');
    
    const startTime = Date.now();
    const jobsResponse = await jobsApi.getMyCreatedJobs({
      page: 1,
      limit: 10,
      status: 'active'
    });
    const responseTime = Date.now() - startTime;

    console.log(`   ✅ Відповідь отримана за ${responseTime}ms`);
    console.log(`   📊 Статус: ${jobsResponse.status}`);
    console.log(`   📋 Структура даних:`, {
      keys: Object.keys(jobsResponse.data),
      hasData: !!jobsResponse.data.data,
      dataType: typeof jobsResponse.data.data,
      isArray: Array.isArray(jobsResponse.data.data)
    });

    if (jobsResponse.data.data) {
      const jobs = Array.isArray(jobsResponse.data.data) 
        ? jobsResponse.data.data 
        : jobsResponse.data.data.jobs || [];
      
      console.log(`   📈 Знайдено вакансій: ${jobs.length}`);
      
      if (jobs.length > 0) {
        console.log(`   🎯 Перша вакансія:`, {
          id: jobs[0].id,
          title: jobs[0].title,
          status: jobs[0].status,
          location: jobs[0].location
        });
      }
    }

    console.log('\n✅ Тест пройдено успішно!');

  } catch (error: any) {
    console.error('❌ Помилка під час тестування:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params
    });
    
    if (error.response?.status === 401) {
      console.log('\n💡 Підказка: Потрібна авторизація. Перевірте токен в localStorage.');
    } else if (error.response?.status === 403) {
      console.log('\n💡 Підказка: Доступ заборонено. Перевірте роль користувача (має бути employer).');
    } else if (error.response?.status === 400) {
      console.log('\n💡 Підказка: Невірні параметри запиту. Перевірте параметри.');
    }
    
    process.exit(1);
  }
}

// Запуск тесту
if (require.main === module) {
  testJobsApi()
    .then(() => {
      console.log('\n🏁 Тестування завершено');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Критична помилка:', error);
      process.exit(1);
    });
}

export { testJobsApi };
