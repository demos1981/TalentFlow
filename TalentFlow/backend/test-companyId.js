// Тестовий файл для перевірки створення вакансії без companyId
const { AppDataSource } = require('./dist/config/database');
const { Job } = require('./dist/models/Job');
const { User } = require('./dist/models/User');

async function testCreateJobWithoutCompany() {
  try {
    console.log('🧪 Testing job creation without company...\n');
    
    // Підключаємося до бази даних
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    // Отримуємо репозиторії
    const jobRepository = AppDataSource.getRepository(Job);
    const userRepository = AppDataSource.getRepository(User);
    
    // Знаходимо користувача
    const user = await userRepository.findOne({
      where: { role: 'employer' }
    });
    
    if (!user) {
      console.log('❌ No employer user found');
      return;
    }
    
    console.log('🔍 Found user:', { id: user.id, email: user.email, companyId: user.companyId });
    
    // Створюємо тестову вакансію
    const testJob = {
      title: 'Test Job Without Company',
      description: 'This is a test job to verify that companyId can be null',
      requirements: 'Test requirements',
      benefits: 'Test benefits',
      location: 'Test location',
      type: 'full_time',
      experienceLevel: 'junior',
      salaryMin: 1000,
      salaryMax: 2000,
      currency: 'USD',
      department: 'IT',
      skills: ['Test'],
      isRemote: false,
      isUrgent: false,
      isFeatured: false,
      deadline: new Date('2025-12-31'),
      companyId: null, // Явно встановлюємо null
      createdByUserId: user.id,
      status: 'draft',
      views: 0,
      applications: 0
    };
    
    console.log('🔍 Creating test job with data:', JSON.stringify(testJob, null, 2));
    
    // Створюємо та зберігаємо вакансію
    const job = jobRepository.create(testJob);
    const savedJob = await jobRepository.save(job);
    
    console.log('✅ Job created successfully!');
    console.log('🔍 Saved job:', { 
      id: savedJob.id, 
      title: savedJob.title, 
      companyId: savedJob.companyId 
    });
    
    // Очищаємо тестову вакансію
    await jobRepository.remove(savedJob);
    console.log('🧹 Test job cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    // Закриваємо з'єднання
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Запускаємо тест
testCreateJobWithoutCompany();

