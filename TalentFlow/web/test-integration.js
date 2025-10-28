#!/usr/bin/env node

import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:3003';

async function testBackend() {
  console.log('🔍 Тестування бекенду...\n');
  
  try {
    // Тест health endpoint
    const health = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check:', health.data.status);
    
    // Тест API overview
    const api = await axios.get(`${BACKEND_URL}/api`);
    console.log('✅ API overview:', api.data.service);
    
    // Тест статистики
    const stats = await axios.get(`${BACKEND_URL}/api/stats`);
    console.log('✅ Stats:', `${stats.data.data.overview.totalUsers} users, ${stats.data.data.overview.totalJobs} jobs`);
    
    // Тест аутентифікації
    const login = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'admin@talentmatch.pro',
      password: 'admin123'
    });
    console.log('✅ Authentication:', login.data.message);
    
    // Тест захищеного endpoint
    const token = login.data.data.token;
    const dashboard = await axios.get(`${BACKEND_URL}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected endpoint:', 'Dashboard stats retrieved');
    
    return true;
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('\n🌐 Тестування фронтенду...\n');
  
  try {
    // Тест доступності фронтенду
    const response = await axios.get(FRONTEND_URL, {
      timeout: 5000,
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });
    console.log('✅ Frontend accessible:', response.status === 200 ? 'OK' : `Status ${response.status}`);
    
    // Перевірка заголовка
    const titleMatch = response.data.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      console.log('✅ Page title:', titleMatch[1]);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function testIntegration() {
  console.log('🚀 Тестування інтеграції TalentMatch Pro\n');
  console.log('=' .repeat(50));
  
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ:');
  console.log('=' .repeat(50));
  
  if (backendOk && frontendOk) {
    console.log('🎉 ВСЕ ПРАЦЮЄ ІДЕАЛЬНО!');
    console.log('✅ Бекенд: http://localhost:3000');
    console.log('✅ Фронтенд: http://localhost:3003');
    console.log('✅ API Docs: http://localhost:3000/api-docs');
    console.log('\n🔑 Тестові облікові записи:');
    console.log('   👨‍💼 Адмін: admin@talentmatch.pro / admin123');
    console.log('   🏢 Роботодавець: employer@techcorp.ua / employer123');
    console.log('   👩‍💻 Кандидат: candidate@example.com / candidate123');
  } else {
    console.log('❌ Є проблеми з інтеграцією');
    if (!backendOk) console.log('   - Бекенд не працює');
    if (!frontendOk) console.log('   - Фронтенд не працює');
  }
  
  console.log('\n' + '=' .repeat(50));
}

// Запуск тестів
testIntegration().catch(console.error);
