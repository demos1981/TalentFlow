const { Pool } = require('pg');
const { performance } = require('perf_hooks');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'talentmatch_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'talentmatch',
  password: process.env.DB_PASSWORD || 'talentmatch_password',
  port: process.env.DB_PORT || 5438,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test data generation
const generateTestData = () => {
  const users = [];
  const companies = [];
  const jobs = [];
  const applications = [];
  const interviews = [];
  const notifications = [];

  // Generate 100,000 users
  for (let i = 1; i <= 100000; i++) {
    users.push({
      id: `user-${i}`,
      email: `user${i}@test.com`,
      first_name: `User${i}`,
      last_name: `Test${i}`,
      role: i % 10 === 0 ? 'admin' : i % 5 === 0 ? 'hr' : 'candidate',
      is_active: true,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      last_active_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }

  // Generate 1,000 companies
  for (let i = 1; i <= 1000; i++) {
    companies.push({
      id: `company-${i}`,
      name: `Company ${i}`,
      industry: ['tech', 'finance', 'healthcare', 'education', 'retail'][i % 5],
      size: ['startup', 'small', 'medium', 'large', 'enterprise'][i % 5],
      is_active: true,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    });
  }

  // Generate 10,000 jobs
  for (let i = 1; i <= 10000; i++) {
    jobs.push({
      id: `job-${i}`,
      title: `Job Title ${i}`,
      description: `Job description for position ${i}`,
      company_id: `company-${Math.floor(Math.random() * 1000) + 1}`,
      status: ['draft', 'active', 'paused', 'closed'][Math.floor(Math.random() * 4)],
      is_active: true,
      created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    });
  }

  // Generate 50,000 applications
  for (let i = 1; i <= 50000; i++) {
    applications.push({
      id: `app-${i}`,
      user_id: `user-${Math.floor(Math.random() * 100000) + 1}`,
      job_id: `job-${Math.floor(Math.random() * 10000) + 1}`,
      status: ['pending', 'reviewing', 'shortlisted', 'interviewing', 'offered', 'hired', 'rejected'][Math.floor(Math.random() * 7)],
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    });
  }

  // Generate 5,000 interviews
  for (let i = 1; i <= 5000; i++) {
    interviews.push({
      id: `interview-${i}`,
      application_id: `app-${Math.floor(Math.random() * 50000) + 1}`,
      status: ['scheduled', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    });
  }

  // Generate 100,000 notifications
  for (let i = 1; i <= 100000; i++) {
    notifications.push({
      id: `notif-${i}`,
      user_id: `user-${Math.floor(Math.random() * 100000) + 1}`,
      title: `Notification ${i}`,
      message: `Notification message ${i}`,
      type: ['new_application', 'interview_scheduled', 'application_status_changed'][Math.floor(Math.random() * 3)],
      status: ['unread', 'read', 'archived'][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }

  return { users, companies, jobs, applications, interviews, notifications };
};

// Performance test functions
const testQuery = async (name, query, params = []) => {
  const start = performance.now();
  try {
    const result = await pool.query(query, params);
    const end = performance.now();
    const duration = Math.round((end - start) * 100) / 100;
    console.log(`✅ ${name}: ${duration}ms (${result.rows.length} rows)`);
    return { success: true, duration, rows: result.rows.length };
  } catch (error) {
    const end = performance.now();
    const duration = Math.round((end - start) * 100) / 100;
    console.log(`❌ ${name}: ${duration}ms - ERROR: ${error.message}`);
    return { success: false, duration, error: error.message };
  }
};

// Main performance test
const runPerformanceTest = async () => {
  console.log('🚀 Starting PostgreSQL Performance Test with 100,000 users...\n');

  // Test 1: Simple count queries
  console.log('📊 1. Basic Count Queries:');
  await testQuery('Count all users', 'SELECT COUNT(*) FROM users');
  await testQuery('Count active users', 'SELECT COUNT(*) FROM users WHERE is_active = true');
  await testQuery('Count companies', 'SELECT COUNT(*) FROM companies');
  await testQuery('Count jobs', 'SELECT COUNT(*) FROM jobs');
  await testQuery('Count applications', 'SELECT COUNT(*) FROM applications');
  await testQuery('Count interviews', 'SELECT COUNT(*) FROM interviews');
  await testQuery('Count notifications', 'SELECT COUNT(*) FROM notifications');

  console.log('\n📈 2. Complex Analytics Queries:');
  
  // Test 2: Analytics queries (similar to our services)
  await testQuery(
    'User growth by month',
    `SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as new_users
    FROM users 
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC`
  );

  await testQuery(
    'Job applications by status',
    `SELECT 
      status,
      COUNT(*) as count
    FROM applications 
    GROUP BY status
    ORDER BY count DESC`
  );

  await testQuery(
    'Company job statistics',
    `SELECT 
      c.name,
      c.industry,
      COUNT(j.id) as total_jobs,
      COUNT(CASE WHEN j.status = 'active' THEN 1 END) as active_jobs
    FROM companies c
    LEFT JOIN jobs j ON c.id = j.company_id
    GROUP BY c.id, c.name, c.industry
    ORDER BY total_jobs DESC
    LIMIT 20`
  );

  await testQuery(
    'User activity analysis',
    `SELECT 
      role,
      COUNT(*) as total_users,
      COUNT(CASE WHEN last_active_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_last_week,
      COUNT(CASE WHEN last_active_at >= NOW() - INTERVAL '30 days' THEN 1 END) as active_last_month
    FROM users
    GROUP BY role`
  );

  console.log('\n🔍 3. Search and Filter Queries:');
  
  // Test 3: Search queries
  await testQuery(
    'Search users by name',
    `SELECT id, first_name, last_name, email 
    FROM users 
    WHERE first_name ILIKE '%User1%' OR last_name ILIKE '%Test1%'
    LIMIT 100`
  );

  await testQuery(
    'Search jobs by title',
    `SELECT j.id, j.title, c.name as company_name
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.title ILIKE '%Job%'
    LIMIT 100`
  );

  await testQuery(
    'Filter applications by date range',
    `SELECT a.id, a.status, u.first_name, j.title
    FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN jobs j ON a.job_id = j.id
    WHERE a.created_at >= NOW() - INTERVAL '30 days'
    ORDER BY a.created_at DESC
    LIMIT 100`
  );

  console.log('\n📊 4. Dashboard Analytics Queries:');
  
  // Test 4: Dashboard queries (like our services)
  await testQuery(
    'Dashboard overview stats',
    `SELECT 
      (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
      (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_jobs,
      (SELECT COUNT(*) FROM applications) as total_applications,
      (SELECT COUNT(*) FROM companies WHERE is_active = true) as total_companies`
  );

  await testQuery(
    'Performance metrics - hiring speed',
    `SELECT 
      DATE_TRUNC('month', hired_at) as month,
      COUNT(*) as hires_per_month
    FROM applications 
    WHERE status = 'hired' AND hired_at IS NOT NULL
    GROUP BY DATE_TRUNC('month', hired_at)
    ORDER BY month DESC
    LIMIT 12`
  );

  await testQuery(
    'Conversion funnel analysis',
    `SELECT 
      'Applications' as stage,
      COUNT(*) as count
    FROM applications
    UNION ALL
    SELECT 
      'Interviews' as stage,
      COUNT(*) as count
    FROM applications 
    WHERE status IN ('interviewing', 'offered', 'hired')
    UNION ALL
    SELECT 
      'Hired' as stage,
      COUNT(*) as count
    FROM applications 
    WHERE status = 'hired'`
  );

  console.log('\n🔧 5. Index Performance Tests:');
  
  // Test 5: Test with different index scenarios
  await testQuery(
    'Query with date range (should use index)',
    `SELECT COUNT(*) 
    FROM users 
    WHERE created_at >= NOW() - INTERVAL '30 days'`
  );

  await testQuery(
    'Query with multiple filters',
    `SELECT COUNT(*) 
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.status = 'hired' 
    AND j.status = 'active'
    AND a.created_at >= NOW() - INTERVAL '90 days'`
  );

  console.log('\n📈 6. Aggregation Performance:');
  
  // Test 6: Heavy aggregation queries
  await testQuery(
    'Monthly user registration trends',
    `SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as new_users,
      COUNT(CASE WHEN role = 'candidate' THEN 1 END) as candidates,
      COUNT(CASE WHEN role = 'hr' THEN 1 END) as hr_users
    FROM users
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC`
  );

  await testQuery(
    'Company performance ranking',
    `SELECT 
      c.name,
      c.industry,
      COUNT(j.id) as total_jobs,
      COUNT(a.id) as total_applications,
      COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as successful_hires,
      ROUND(
        COUNT(CASE WHEN a.status = 'hired' THEN 1 END)::decimal / 
        NULLIF(COUNT(a.id), 0) * 100, 2
      ) as hire_rate
    FROM companies c
    LEFT JOIN jobs j ON c.id = j.company_id
    LEFT JOIN applications a ON j.id = a.job_id
    GROUP BY c.id, c.name, c.industry
    HAVING COUNT(a.id) > 0
    ORDER BY hire_rate DESC
    LIMIT 50`
  );

  console.log('\n🎯 7. Real-world Scenario Tests:');
  
  // Test 7: Real-world scenarios
  await testQuery(
    'User dashboard data (typical user query)',
    `SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      COUNT(DISTINCT a.id) as total_applications,
      COUNT(DISTINCT CASE WHEN a.status = 'hired' THEN a.id END) as successful_applications,
      COUNT(DISTINCT i.id) as total_interviews
    FROM users u
    LEFT JOIN applications a ON u.id = a.user_id
    LEFT JOIN interviews i ON a.id = i.application_id
    WHERE u.id = 'user-1'
    GROUP BY u.id, u.first_name, u.last_name, u.email`
  );

  await testQuery(
    'HR dashboard data (typical HR query)',
    `SELECT 
      j.id,
      j.title,
      c.name as company_name,
      COUNT(a.id) as total_applications,
      COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as hired_count,
      COUNT(i.id) as total_interviews
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    LEFT JOIN applications a ON j.id = a.job_id
    LEFT JOIN interviews i ON a.id = i.application_id
    WHERE j.company_id = 'company-1'
    GROUP BY j.id, j.title, c.name
    ORDER BY total_applications DESC`
  );

  console.log('\n✅ Performance test completed!');
  console.log('\n📋 Summary:');
  console.log('- All queries should complete under 1000ms for good performance');
  console.log('- Queries under 100ms are excellent');
  console.log('- Queries over 1000ms may need optimization');
  console.log('\n💡 Optimization recommendations:');
  console.log('- Ensure proper indexes on frequently queried columns');
  console.log('- Use EXPLAIN ANALYZE to identify slow queries');
  console.log('- Consider partitioning for very large tables');
  console.log('- Use connection pooling (already configured)');
  console.log('- Consider read replicas for analytics queries');
};

// Run the test
runPerformanceTest()
  .then(() => {
    console.log('\n🏁 Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
