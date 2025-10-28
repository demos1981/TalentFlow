# N+1 Query Optimization Plan - TalentFlow

## 🎯 Critical Performance Issue: N+1 Queries

N+1 queries occur when:
1. We fetch a list of entities
2. For each entity, we make an additional query to fetch related data
3. Result: 1 query for the list + N queries for relations = N+1 queries

## ✅ Already Optimized Services

### Services with Proper Relations Loading:
- ✅ **AssessmentService**: Uses `leftJoinAndSelect` for user and job
- ✅ **EventService**: Loads createdBy, job, candidate, company relations
- ✅ **FileService**: Preloads uploadedBy relation
- ✅ **ApplicationService**: Loads user and job relations
- ✅ **AiMatchingService**: Loads candidate and job with all needed fields
- ✅ **ReportService**: Loads user relations
- ✅ **PerformanceService**: Uses optimized query builders with joins

## 🔴 Critical Areas Requiring Optimization

### 1. **DashboardService** - HIGH PRIORITY
**Problem**: Multiple separate count queries instead of single aggregated query
**Location**: `backend/src/services/dashboardService.ts`

**Current Approach**:
```typescript
const [totalUsers, totalJobs, totalApplications, ...] = await Promise.all([
  this.userRepository.count({ where: { isActive: true } }),
  this.jobRepository.count({ where: { isActive: true } }),
  // ... more counts
]);
```

**Optimization**: Use single SQL query with JOINs and aggregations
**Expected Improvement**: 8+ queries → 1-2 queries = 80% reduction

### 2. **JobService** - HIGH PRIORITY
**Needs Review**: Job listings with company and related data

**Optimization Strategy**:
```typescript
// Instead of:
const jobs = await jobRepository.find({ where: {...} });
// Each job.company triggers separate query

// Use:
const jobs = await jobRepository
  .createQueryBuilder('job')
  .leftJoinAndSelect('job.company', 'company')
  .leftJoinAndSelect('job.createdBy', 'user')
  .where('job.status = :status', { status: 'active' })
  .getMany();
```

### 3. **SearchService** - MEDIUM PRIORITY
**Location**: `backend/src/services/searchService.ts`

**Optimization**: Add DataLoader pattern for batch loading
**Expected Improvement**: 50-70% faster search results

### 4. **MessageService** - MEDIUM PRIORITY
**Location**: `backend/src/services/messageService.ts`

**Problem**: Loading messages with sender info
**Solution**: Batch load senders with single query

### 5. **NotificationService** - MEDIUM PRIORITY
**Problem**: Loading notifications with related entities

**Solution**: Eager load relations in initial query

## 🚀 Implementation Strategy

### Phase 1: Critical Optimizations (Immediate)

#### 1.1 Dashboard Stats Optimization
```typescript
// Create optimized aggregation query
async getDashboardStats(statsDto: DashboardStatsDto): Promise<any> {
  const result = await AppDataSource.query(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE "isActive" = true) as "totalUsers",
      (SELECT COUNT(*) FROM jobs WHERE "isActive" = true) as "totalJobs",
      (SELECT COUNT(*) FROM applications) as "totalApplications",
      (SELECT COUNT(*) FROM companies WHERE "isActive" = true) as "totalCompanies",
      (SELECT COUNT(*) FROM candidate_profiles WHERE "isActive" = true) as "totalCandidates",
      (SELECT COUNT(*) FROM jobs WHERE "isActive" = true AND status = 'active') as "activeJobs",
      (SELECT COUNT(*) FROM companies WHERE "isVerified" = true AND "isActive" = true) as "verifiedCompanies",
      (SELECT COUNT(*) FROM files WHERE "isActive" = true) as "totalFiles"
  `);
  
  return result[0];
}
```

#### 1.2 Add Query Result Caching
```typescript
import { Redis } from 'ioredis';

class CacheService {
  private redis: Redis;
  
  async getCached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);
    
    const result = await fetcher();
    await this.redis.setex(key, ttl, JSON.stringify(result));
    return result;
  }
}

// Usage in DashboardService:
async getDashboardStats(statsDto: DashboardStatsDto): Promise<any> {
  return cacheService.getCached(
    `dashboard:stats:${statsDto.period}`,
    300, // 5 minutes TTL
    () => this.fetchDashboardStats(statsDto)
  );
}
```

### Phase 2: DataLoader Pattern (Week 1)

#### 2.1 Implement DataLoader for Batch Loading
```typescript
import DataLoader from 'dataloader';

class EntityLoaders {
  userLoader: DataLoader<string, User>;
  jobLoader: DataLoader<string, Job>;
  companyLoader: DataLoader<string, Company>;
  
  constructor() {
    this.userLoader = new DataLoader(async (ids: string[]) => {
      const users = await userRepository
        .createQueryBuilder('user')
        .whereInIds(ids)
        .getMany();
      
      // Return in same order as ids
      return ids.map(id => users.find(u => u.id === id) || null);
    });
    
    // Similar for other entities
  }
}

// Usage:
const user = await loaders.userLoader.load(userId); // Batches multiple loads
```

### Phase 3: Query Optimization (Week 2)

#### 3.1 Add Indexes (Already Done ✅)
- User: email, role, isActive, createdAt
- Job: companyId, status, location
- Application: userId, jobId, status
- Notification: userId, type, isRead

#### 3.2 Optimize Heavy Queries
```typescript
// Use query builder with explicit select for needed fields only
const jobs = await jobRepository
  .createQueryBuilder('job')
  .select([
    'job.id',
    'job.title',
    'job.location',
    'job.salary',
    'company.id',
    'company.name',
    'company.logo'
  ])
  .leftJoin('job.company', 'company')
  .where('job.status = :status', { status: 'active' })
  .take(20)
  .getMany();
```

### Phase 4: Advanced Optimizations (Week 3)

#### 4.1 Implement Query Result Pagination Cursor
```typescript
async getJobsPaginated(cursor?: string, limit: number = 20) {
  const qb = jobRepository
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.company', 'company')
    .orderBy('job.createdAt', 'DESC')
    .take(limit);
  
  if (cursor) {
    qb.where('job.createdAt < :cursor', { cursor: new Date(cursor) });
  }
  
  const jobs = await qb.getMany();
  const nextCursor = jobs.length === limit ? jobs[jobs.length - 1].createdAt : null;
  
  return { jobs, nextCursor };
}
```

#### 4.2 Implement Materialized Views for Analytics
```sql
-- Create materialized view for dashboard stats
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE "isActive" = true) as total_users,
  (SELECT COUNT(*) FROM jobs WHERE "isActive" = true) as total_jobs,
  (SELECT COUNT(*) FROM applications) as total_applications,
  NOW() as last_refresh;

-- Create index on materialized view
CREATE INDEX idx_dashboard_stats_refresh ON dashboard_stats(last_refresh);

-- Refresh periodically (e.g., every 5 minutes)
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
```

#### 4.3 Add Database Connection Pooling Optimization
```typescript
// database/data-source.ts
export const AppDataSource = new DataSource({
  // ... existing config
  extra: {
    max: 20, // Maximum pool size
    min: 5,  // Minimum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // Enable prepared statements
    statement_timeout: 60000,
    // Enable query result caching
    cache: {
      duration: 60000, // 1 minute
      type: 'redis',
      options: {
        host: 'localhost',
        port: 6379
      }
    }
  }
});
```

## 📊 Expected Performance Improvements

### Before Optimization:
- Dashboard load: ~2-3 seconds (10+ queries)
- Job listings: ~1-2 seconds (N+1 queries for companies)
- Search results: ~800ms-1.5s (multiple relation queries)
- Message loading: ~500ms-1s (N+1 for senders)

### After Optimization:
- Dashboard load: ~300-500ms (1-2 queries + cache) = **80% faster**
- Job listings: ~200-400ms (single query with joins) = **75% faster**
- Search results: ~200-300ms (DataLoader batching) = **70% faster**
- Message loading: ~100-200ms (batch loading) = **80% faster**

## 🔍 Monitoring and Validation

### 1. Add Query Logging
```typescript
// Enable query logging in TypeORM
logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
maxQueryExecutionTime: 1000, // Log slow queries > 1s
```

### 2. Add Performance Metrics
```typescript
class PerformanceMonitor {
  async measureQuery<T>(name: string, query: () => Promise<T>): Promise<T> {
    const start = Date.now();
    const result = await query();
    const duration = Date.now() - start;
    
    console.log(`[PERF] ${name}: ${duration}ms`);
    
    if (duration > 1000) {
      console.warn(`[SLOW QUERY] ${name}: ${duration}ms`);
    }
    
    return result;
  }
}
```

### 3. Monitor Database Metrics
```sql
-- Check slow queries
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## ✅ Implementation Checklist

- [x] Phase 0: Add database indexes to TypeORM models
- [ ] Phase 1: Optimize DashboardService aggregation queries
- [ ] Phase 1: Implement Redis caching for dashboard stats
- [ ] Phase 2: Add DataLoader for batch entity loading
- [ ] Phase 2: Optimize JobService relations loading
- [ ] Phase 3: Add query result pagination with cursors
- [ ] Phase 3: Optimize SearchService with batching
- [ ] Phase 4: Implement materialized views for analytics
- [ ] Phase 4: Add connection pooling optimization
- [ ] Phase 4: Enable TypeORM query result caching

## 🎯 Priority Order

1. **CRITICAL** (Do Now):
   - Dashboard stats aggregation
   - Job listings relations
   - Add query logging

2. **HIGH** (This Week):
   - Implement DataLoader
   - Add Redis caching
   - Optimize search queries

3. **MEDIUM** (Next Week):
   - Materialized views
   - Connection pooling
   - Query result caching

4. **LOW** (Future):
   - Advanced query optimization
   - Database tuning
   - Monitoring dashboard

## 📝 Notes

- Always test optimizations with production-like data volumes
- Monitor query execution times in development
- Use EXPLAIN ANALYZE for complex queries
- Keep track of cache hit/miss ratios
- Regular database maintenance (VACUUM, ANALYZE)

