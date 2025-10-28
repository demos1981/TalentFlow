const { Pool } = require('pg');
const { performance } = require('perf_hooks');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'talentmatch_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'talentmatch',
  password: process.env.DB_PASSWORD || 'talentmatch_password',
  port: process.env.DB_PORT || 5438,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const generateTestData = async () => {
  console.log('🚀 Generating test data for 100,000 users...\n');
  const start = performance.now();

  try {
    // Clear existing test data
    console.log('🧹 Clearing existing test data...');
    await pool.query('DELETE FROM notifications WHERE user_id LIKE \'user-%\'');
    await pool.query('DELETE FROM interviews WHERE application_id LIKE \'app-%\'');
    await pool.query('DELETE FROM applications WHERE user_id LIKE \'user-%\'');
    await pool.query('DELETE FROM jobs WHERE id LIKE \'job-%\'');
    await pool.query('DELETE FROM companies WHERE id LIKE \'company-%\'');
    await pool.query('DELETE FROM users WHERE id LIKE \'user-%\'');

    // Generate users (100,000)
    console.log('👥 Generating 100,000 users...');
    const userBatchSize = 1000;
    for (let i = 0; i < 100000; i += userBatchSize) {
      const users = [];
      for (let j = i; j < Math.min(i + userBatchSize, 100000); j++) {
        users.push([
          `user-${j + 1}`,
          `user${j + 1}@test.com`,
          `User${j + 1}`,
          `Test${j + 1}`,
          j % 10 === 0 ? 'admin' : j % 5 === 0 ? 'hr' : 'candidate',
          true,
          new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          false,
          false,
          'en'
        ]);
      }
      
      await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, role, is_active, created_at, last_active_at, email_verified, two_factor_enabled, language)
        VALUES ${users.map((_, index) => `($${index * 11 + 1}, $${index * 11 + 2}, $${index * 11 + 3}, $${index * 11 + 4}, $${index * 11 + 5}, $${index * 11 + 6}, $${index * 11 + 7}, $${index * 11 + 8}, $${index * 11 + 9}, $${index * 11 + 10}, $${index * 11 + 11})`).join(', ')}
      `, users.flat());
      
      if ((i + userBatchSize) % 10000 === 0) {
        console.log(`   Generated ${i + userBatchSize} users...`);
      }
    }

    // Generate companies (1,000)
    console.log('🏢 Generating 1,000 companies...');
    const companyBatchSize = 100;
    for (let i = 0; i < 1000; i += companyBatchSize) {
      const companies = [];
      for (let j = i; j < Math.min(i + companyBatchSize, 1000); j++) {
        companies.push([
          `company-${j + 1}`,
          `Company ${j + 1}`,
          `Description for company ${j + 1}`,
          ['tech', 'finance', 'healthcare', 'education', 'retail'][j % 5],
          ['startup', 'small', 'medium', 'large', 'enterprise'][j % 5],
          true,
          new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        ]);
      }
      
      await pool.query(`
        INSERT INTO companies (id, name, description, industry, size, is_active, created_at)
        VALUES ${companies.map((_, index) => `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`).join(', ')}
      `, companies.flat());
    }

    // Generate jobs (10,000)
    console.log('💼 Generating 10,000 jobs...');
    const jobBatchSize = 500;
    for (let i = 0; i < 10000; i += jobBatchSize) {
      const jobs = [];
      for (let j = i; j < Math.min(i + jobBatchSize, 10000); j++) {
        jobs.push([
          `job-${j + 1}`,
          `Job Title ${j + 1}`,
          `Job description for position ${j + 1}`,
          `Requirements for job ${j + 1}`,
          `Benefits for job ${j + 1}`,
          `company-${Math.floor(Math.random() * 1000) + 1}`,
          ['draft', 'active', 'paused', 'closed'][Math.floor(Math.random() * 4)],
          ['full_time', 'part_time', 'contract', 'internship'][Math.floor(Math.random() * 4)],
          ['entry', 'junior', 'middle', 'senior'][Math.floor(Math.random() * 4)],
          true,
          new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
        ]);
      }
      
      await pool.query(`
        INSERT INTO jobs (id, title, description, requirements, benefits, company_id, status, type, experience_level, is_active, created_at)
        VALUES ${jobs.map((_, index) => `($${index * 12 + 1}, $${index * 12 + 2}, $${index * 12 + 3}, $${index * 12 + 4}, $${index * 12 + 5}, $${index * 12 + 6}, $${index * 12 + 7}, $${index * 12 + 8}, $${index * 12 + 9}, $${index * 12 + 10}, $${index * 12 + 11})`).join(', ')}
      `, jobs.flat());
    }

    // Generate applications (50,000)
    console.log('📝 Generating 50,000 applications...');
    const appBatchSize = 1000;
    for (let i = 0; i < 50000; i += appBatchSize) {
      const applications = [];
      for (let j = i; j < Math.min(i + appBatchSize, 50000); j++) {
        const statuses = ['pending', 'reviewing', 'shortlisted', 'interviewing', 'offered', 'hired', 'rejected'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const hiredAt = status === 'hired' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null;
        
        applications.push([
          `app-${j + 1}`,
          `user-${Math.floor(Math.random() * 100000) + 1}`,
          `job-${Math.floor(Math.random() * 10000) + 1}`,
          status,
          `Cover letter for application ${j + 1}`,
          Math.random() * 100,
          hiredAt,
          new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        ]);
      }
      
      await pool.query(`
        INSERT INTO applications (id, user_id, job_id, status, cover_letter, match_score, hired_at, created_at)
        VALUES ${applications.map((_, index) => `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${index * 8 + 4}, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${index * 8 + 8})`).join(', ')}
      `, applications.flat());
      
      if ((i + appBatchSize) % 10000 === 0) {
        console.log(`   Generated ${i + appBatchSize} applications...`);
      }
    }

    // Generate interviews (5,000)
    console.log('🎯 Generating 5,000 interviews...');
    const interviewBatchSize = 500;
    for (let i = 0; i < 5000; i += interviewBatchSize) {
      const interviews = [];
      for (let j = i; j < Math.min(i + interviewBatchSize, 5000); j++) {
        interviews.push([
          `interview-${j + 1}`,
          `app-${Math.floor(Math.random() * 50000) + 1}`,
          ['scheduled', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
          new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        ]);
      }
      
      await pool.query(`
        INSERT INTO interviews (id, application_id, status, created_at)
        VALUES ${interviews.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}
      `, interviews.flat());
    }

    // Generate notifications (100,000)
    console.log('🔔 Generating 100,000 notifications...');
    const notifBatchSize = 1000;
    for (let i = 0; i < 100000; i += notifBatchSize) {
      const notifications = [];
      for (let j = i; j < Math.min(i + notifBatchSize, 100000); j++) {
        const types = ['new_application', 'interview_scheduled', 'application_status_changed', 'job_match'];
        const statuses = ['unread', 'read', 'archived'];
        
        notifications.push([
          `notif-${j + 1}`,
          `user-${Math.floor(Math.random() * 100000) + 1}`,
          `Notification ${j + 1}`,
          `Notification message ${j + 1}`,
          types[Math.floor(Math.random() * types.length)],
          statuses[Math.floor(Math.random() * statuses.length)],
          'medium',
          'in_app',
          false,
          new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        ]);
      }
      
      await pool.query(`
        INSERT INTO notifications (id, user_id, title, message, type, status, priority, channel, is_read, created_at)
        VALUES ${notifications.map((_, index) => `($${index * 10 + 1}, $${index * 10 + 2}, $${index * 10 + 3}, $${index * 10 + 4}, $${index * 10 + 5}, $${index * 10 + 6}, $${index * 10 + 7}, $${index * 10 + 8}, $${index * 10 + 9}, $${index * 10 + 10})`).join(', ')}
      `, notifications.flat());
      
      if ((i + notifBatchSize) % 20000 === 0) {
        console.log(`   Generated ${i + notifBatchSize} notifications...`);
      }
    }

    const end = performance.now();
    const duration = Math.round((end - start) / 1000 * 100) / 100;
    
    console.log('\n✅ Test data generation completed!');
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log('\n📊 Generated data:');
    console.log('- 100,000 users');
    console.log('- 1,000 companies');
    console.log('- 10,000 jobs');
    console.log('- 50,000 applications');
    console.log('- 5,000 interviews');
    console.log('- 100,000 notifications');
    
    // Create indexes for better performance
    console.log('\n🔧 Creating performance indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON users(last_active_at)',
      'CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry)',
      'CREATE INDEX IF NOT EXISTS idx_companies_size ON companies(size)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)',
      'CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)',
      'CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)',
    ];
    
    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }
    
    console.log('✅ Indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    throw error;
  }
};

// Run the data generation
generateTestData()
  .then(() => {
    console.log('\n🎉 Test data generation completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Run: node performance-test.js');
    console.log('2. Monitor query performance');
    console.log('3. Check database size and memory usage');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test data generation failed:', error);
    process.exit(1);
  });
