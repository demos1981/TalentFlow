import { AppDataSource } from './src/config/database';

async function testConnection() {
  try {
    console.log('🔌 Тестування підключення до бази даних...');
    
    await AppDataSource.initialize();
    console.log('✅ База даних успішно підключена!');
    
    // Тестуємо простий запит
    const result = await AppDataSource.query('SELECT NOW() as current_time');
    console.log('⏰ Поточний час сервера:', result[0].current_time);
    
    // Перевіряємо чи існує таблиця users
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Існуючі таблиці:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });
    
    await AppDataSource.destroy();
    console.log('🔌 З\'єднання закрито');
    
  } catch (error) {
    console.error('❌ Помилка підключення до бази даних:', error);
  }
}

testConnection();




