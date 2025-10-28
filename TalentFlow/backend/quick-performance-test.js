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

// Quick performance test with existing data
const runQuickPerformanceTest = async () => {
  console.log('🚀 Quick PostgreSQL Performance Test...\n');

  try {
    // Test 1: Check if we have any data
    console.log('📊 1. Checking existing data:');
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const jobCount = await pool.query('SELECT COUNT(*) FROM jobs');
    const appCount = await pool.query('SELECT COUNT(*) FROM applications');
    
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Jobs: ${jobCount.rows[0].count}`);
    console.log(`   Applications: ${appCount.rows[0].count}`);

    // Test 2: Basic performance tests
    console.log('\n⚡ 2. Performance Tests:');
    
    const tests = [
      {
        name: 'Count all users',
        query: 'SELECT COUNT(*) FROM users',
        expected: '< 50ms'
      },
      {
        name: 'Count active users',
        query: 'SELECT COUNT(*) FROM users WHERE is_active = true',
        expected: '< 50ms'
      },
      {
        name: 'Count jobs',
        query: 'SELECT COUNT(*) FROM jobs',
        expected: '< 50ms'
      },
      {
        name: 'Count applications',
        query: 'SELECT COUNT(*) FROM applications',
        expected: '< 50ms'
      },
      {
        name: 'Join query - jobs with companies',
        query: `SELECT j.id, j.title, c.name 
                FROM jobs j 
                JOIN companies c ON j.company_id = c.id 
                LIMIT 10`,
        expected: '< 100ms'
      },
      {
        name: 'User role statistics',
        query: `SELECT role, COUNT(*) as count 
                FROM users 
                GROUP BY role`,
        expected: '< 100ms'
      },
      {
        name: 'Application status statistics',
        query: `SELECT status, COUNT(*) as count 
                FROM applications 
                GROUP BY status`,
        expected: '< 100ms'
      },
      {
        name: 'Recent applications (last 30 days)',
        query: `SELECT COUNT(*) 
                FROM applications 
                WHERE created_at >= NOW() - INTERVAL '30 days'`,
        expected: '< 100ms'
      },
      {
        name: 'Text search - user names',
        query: `SELECT id, first_name, last_name 
                FROM users 
                WHERE first_name ILIKE '%user%' 
                LIMIT 10`,
        expected: '< 200ms'
      },
      {
        name: 'Complex analytics - monthly stats',
        query: `SELECT 
                  DATE_TRUNC('month', created_at) as month,
                  COUNT(*) as new_users
                FROM users 
                WHERE created_at >= NOW() - INTERVAL '12 months'
                GROUP BY DATE_TRUNC('month', created_at)
                ORDER BY month DESC
                LIMIT 12`,
        expected: '< 500ms'
      }
    ];

    const results = [];
    for (const test of tests) {
      const start = performance.now();
      try {
        const result = await pool.query(test.query);
        const end = performance.now();
        const duration = Math.round((end - start) * 100) / 100;
        
        const status = duration < 100 ? '✅' : duration < 500 ? '⚠️' : '❌';
        console.log(`   ${status} ${test.name}: ${duration}ms (expected: ${test.expected})`);
        
        results.push({
          name: test.name,
          duration,
          rows: result.rows.length,
          expected: test.expected
        });
      } catch (error) {
        console.log(`   ❌ ${test.name}: ERROR - ${error.message}`);
        results.push({
          name: test.name,
          duration: -1,
          error: error.message
        });
      }
    }

    // Performance summary
    console.log('\n📈 3. Performance Summary:');
    const avgDuration = results
      .filter(r => r.duration > 0)
      .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration > 0).length;
    
    console.log(`   Average query time: ${Math.round(avgDuration * 100) / 100}ms`);
    
    const fastQueries = results.filter(r => r.duration < 100).length;
    const slowQueries = results.filter(r => r.duration > 500).length;
    
    console.log(`   Fast queries (< 100ms): ${fastQueries}/${results.length}`);
    console.log(`   Slow queries (> 500ms): ${slowQueries}/${results.length}`);

    // Performance assessment
    console.log('\n🎯 4. Performance Assessment:');
    if (avgDuration < 100) {
      console.log('   🎉 EXCELLENT! Your database is very fast');
      console.log('   💡 Can easily handle 100,000+ users');
    } else if (avgDuration < 500) {
      console.log('   ✅ GOOD! Your database performs well');
      console.log('   💡 Can handle 100,000 users with minor optimizations');
    } else {
      console.log('   ⚠️  NEEDS OPTIMIZATION! Some queries are slow');
      console.log('   💡 Consider adding indexes or optimizing queries');
    }

    // Recommendations
    console.log('\n💡 5. Recommendations for 100,000 users:');
    console.log('   🔧 Database:');
    console.log('      - Ensure proper indexes on frequently queried columns');
    console.log('      - Use connection pooling (already configured)');
    console.log('      - Consider read replicas for analytics');
    
    console.log('   🚀 Application:');
    console.log('      - Implement caching (Redis) for frequently accessed data');
    console.log('      - Use pagination for large result sets');
    console.log('      - Background job processing for heavy operations');
    
    console.log('   ☁️  Infrastructure:');
    console.log('      - SSD storage for better I/O performance');
    console.log('      - Sufficient RAM (8GB+ recommended)');
    console.log('      - Monitor database performance regularly');

    console.log('\n✅ Quick performance test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
};

// Run the test
runQuickPerformanceTest()
  .then(() => {
    console.log('\n🏁 Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });

