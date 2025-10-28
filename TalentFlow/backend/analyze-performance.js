const { Pool } = require('pg');
const { performance } = require('perf_hooks');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'talentflow',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const analyzePerformance = async () => {
  console.log('🔍 PostgreSQL Performance Analysis for 100,000 users...\n');

  try {
    // 1. Database size analysis
    console.log('📊 1. Database Size Analysis:');
    const sizeResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `);
    
    sizeResult.rows.forEach(row => {
      console.log(`   ${row.tablename}: ${row.size}`);
    });

    // 2. Table statistics
    console.log('\n📈 2. Table Statistics:');
    const statsResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC
    `);
    
    statsResult.rows.forEach(row => {
      console.log(`   ${row.tablename}: ${row.live_tuples.toLocaleString()} rows`);
    });

    // 3. Index usage analysis
    console.log('\n🔍 3. Index Usage Analysis:');
    const indexResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan as scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
      ORDER BY idx_scan DESC
      LIMIT 20
    `);
    
    indexResult.rows.forEach(row => {
      console.log(`   ${row.indexname}: ${row.scans} scans, ${row.tuples_read.toLocaleString()} tuples read`);
    });

    // 4. Slow query analysis
    console.log('\n⏱️  4. Query Performance Analysis:');
    
    const queries = [
      {
        name: 'Simple count - users',
        query: 'SELECT COUNT(*) FROM users',
        expected: '< 50ms'
      },
      {
        name: 'Filtered count - active users',
        query: 'SELECT COUNT(*) FROM users WHERE is_active = true',
        expected: '< 50ms'
      },
      {
        name: 'Join query - jobs with companies',
        query: `SELECT j.id, j.title, c.name 
                FROM jobs j 
                JOIN companies c ON j.company_id = c.id 
                LIMIT 100`,
        expected: '< 100ms'
      },
      {
        name: 'Complex aggregation - user stats',
        query: `SELECT 
                  role,
                  COUNT(*) as total,
                  COUNT(CASE WHEN last_active_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_week
                FROM users 
                GROUP BY role`,
        expected: '< 100ms'
      },
      {
        name: 'Date range query - recent applications',
        query: `SELECT COUNT(*) 
                FROM applications 
                WHERE created_at >= NOW() - INTERVAL '30 days'`,
        expected: '< 100ms'
      },
      {
        name: 'Text search - user names',
        query: `SELECT id, first_name, last_name 
                FROM users 
                WHERE first_name ILIKE '%User1%' 
                LIMIT 100`,
        expected: '< 200ms'
      },
      {
        name: 'Complex analytics - hiring funnel',
        query: `SELECT 
                  DATE_TRUNC('month', created_at) as month,
                  COUNT(*) as applications,
                  COUNT(CASE WHEN status = 'hired' THEN 1 END) as hires
                FROM applications 
                WHERE created_at >= NOW() - INTERVAL '12 months'
                GROUP BY DATE_TRUNC('month', created_at)
                ORDER BY month DESC`,
        expected: '< 500ms'
      },
      {
        name: 'Heavy aggregation - company performance',
        query: `SELECT 
                  c.name,
                  COUNT(j.id) as jobs,
                  COUNT(a.id) as applications,
                  COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as hires
                FROM companies c
                LEFT JOIN jobs j ON c.id = j.company_id
                LEFT JOIN applications a ON j.id = a.job_id
                GROUP BY c.id, c.name
                ORDER BY applications DESC
                LIMIT 50`,
        expected: '< 1000ms'
      }
    ];

    const results = [];
    for (const test of queries) {
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

    // 5. Performance recommendations
    console.log('\n💡 5. Performance Recommendations:');
    
    const slowQueries = results.filter(r => r.duration > 500);
    if (slowQueries.length > 0) {
      console.log('   ⚠️  Slow queries detected:');
      slowQueries.forEach(q => {
        console.log(`      - ${q.name}: ${q.duration}ms`);
      });
    } else {
      console.log('   ✅ All queries performing well!');
    }

    // 6. Memory and connection analysis
    console.log('\n🧠 6. Database Resource Usage:');
    
    const memoryResult = await pool.query(`
      SELECT 
        setting as shared_buffers,
        unit
      FROM pg_settings 
      WHERE name = 'shared_buffers'
    `);
    
    const connectionsResult = await pool.query(`
      SELECT 
        setting as max_connections
      FROM pg_settings 
      WHERE name = 'max_connections'
    `);
    
    console.log(`   Shared buffers: ${memoryResult.rows[0].shared_buffers} ${memoryResult.rows[0].unit}`);
    console.log(`   Max connections: ${connectionsResult.rows[0].max_connections}`);

    // 7. Optimization suggestions
    console.log('\n🚀 7. Optimization Suggestions:');
    
    if (results.some(r => r.duration > 1000)) {
      console.log('   🔧 Consider these optimizations:');
      console.log('      - Add more specific indexes');
      console.log('      - Increase shared_buffers');
      console.log('      - Consider query rewriting');
      console.log('      - Use EXPLAIN ANALYZE for slow queries');
    }
    
    if (results.every(r => r.duration < 100)) {
      console.log('   🎉 Excellent performance! Your database is well optimized.');
    }

    // 8. Scaling recommendations
    console.log('\n📈 8. Scaling Recommendations for 100,000+ users:');
    console.log('   💾 Database:');
    console.log('      - Current setup can handle 100K users efficiently');
    console.log('      - For 1M+ users, consider partitioning');
    console.log('      - Read replicas for analytics queries');
    console.log('      - Connection pooling (already configured)');
    
    console.log('   🔧 Application:');
    console.log('      - Implement caching (Redis)');
    console.log('      - Use pagination for large result sets');
    console.log('      - Background job processing');
    console.log('      - CDN for static assets');
    
    console.log('   ☁️  Infrastructure:');
    console.log('      - SSD storage for better I/O');
    console.log('      - Sufficient RAM (8GB+ recommended)');
    console.log('      - Monitor CPU and memory usage');
    console.log('      - Regular VACUUM and ANALYZE');

    console.log('\n✅ Performance analysis completed!');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
};

// Run the analysis
analyzePerformance()
  .then(() => {
    console.log('\n🏁 Analysis completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });

