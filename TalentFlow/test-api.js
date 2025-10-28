// Простий тест API
const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Тестування API...');
    
    // Тест 1: Jobs API
    console.log('\n📝 Тест 1: Jobs API');
    const jobsResponse = await axios.get('http://localhost:3002/api/jobs/my-created?page=1&limit=50&status=active', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Замініть на реальний токен
      }
    });
    console.log('✅ Jobs API працює:', jobsResponse.status);
    
    // Тест 2: Stats API
    console.log('\n📊 Тест 2: Stats API');
    const statsResponse = await axios.get('http://localhost:3002/api/optimized-ai-matching/stats', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Замініть на реальний токен
      }
    });
    console.log('✅ Stats API працює:', statsResponse.status);
    
  } catch (error) {
    console.error('❌ Помилка:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testAPI();
