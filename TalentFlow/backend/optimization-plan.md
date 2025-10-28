# 🚀 План оптимізації продуктивності TalentFlow

## 1. 🔍 Додати індекси для швидкого пошуку

### Критичні індекси:
```sql
-- Користувачі
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_active_at ON users(last_active_at);

-- Роботи
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_title_gin ON jobs USING gin(to_tsvector('english', title));

-- Заявки
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- Профілі кандидатів
CREATE INDEX idx_candidate_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX idx_candidate_profiles_skills_gin ON candidate_profiles USING gin(skills);
CREATE INDEX idx_candidate_profiles_location ON candidate_profiles(location);

-- Компанії
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_size ON companies(size);

-- Сповіщення
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## 2. 🎯 Оптимізувати запити

### Замінити N+1 на JOIN:
```typescript
// ❌ Погано - N+1
const users = await this.userRepository.find();
for (const user of users) {
  const profile = await this.candidateProfileRepository.findOne({ where: { userId: user.id } });
}

// ✅ Добре - один запит
const users = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.candidateProfile', 'profile')
  .getMany();
```

### Об'єднати множинні COUNT запити:
```typescript
// ❌ Погано - 7 окремих запитів
const totalUsers = await this.userRepository.count();
const activeUsers = await this.userRepository.count({ where: { isActive: true } });
// ... 5 більше

// ✅ Добре - один запит
const metrics = await this.userRepository
  .createQueryBuilder('user')
  .select([
    'COUNT(*) as totalUsers',
    'COUNT(CASE WHEN is_active = true THEN 1 END) as activeUsers',
    'COUNT(CASE WHEN role = \'candidate\' THEN 1 END) as candidates',
    'COUNT(CASE WHEN created_at >= NOW() - INTERVAL \'30 days\' THEN 1 END) as newUsers'
  ])
  .getRawOne();
```

## 3. 💾 Додати кешування

### Redis кеш для часто використовуваних даних:
```typescript
// Кеш для метрик дашборду (5 хвилин)
const cacheKey = `dashboard_metrics_${companyId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const metrics = await this.calculateMetrics();
await redis.setex(cacheKey, 300, JSON.stringify(metrics)); // 5 хв
```

### Кеш для списків:
```typescript
// Кеш для списку навичок (1 година)
const skillsCache = await redis.get('top_skills');
if (!skillsCache) {
  const skills = await this.getTopSkills();
  await redis.setex('top_skills', 3600, JSON.stringify(skills));
}
```

## 4. 📊 Оптимізувати аналітичні запити

### Використовувати материалізовані представлення:
```sql
-- Матеріалізоване представлення для щоденної статистики
CREATE MATERIALIZED VIEW daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users,
  COUNT(CASE WHEN role = 'candidate' THEN 1 END) as candidates,
  COUNT(CASE WHEN role = 'hr' THEN 1 END) as hr_users
FROM users
GROUP BY DATE(created_at);

-- Оновлення щодня
REFRESH MATERIALIZED VIEW daily_stats;
```

### Пагінація для великих результатів:
```typescript
// ✅ Правильна пагінація
const queryBuilder = this.userRepository
  .createQueryBuilder('user')
  .orderBy('user.createdAt', 'DESC')
  .limit(limit)
  .offset(offset);

// ✅ Cursor-based пагінація для великих даних
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.createdAt < :cursor', { cursor: lastCreatedAt })
  .orderBy('user.createdAt', 'DESC')
  .limit(limit)
  .getMany();
```

## 5. 🔄 Асинхронна обробка

### Фонові завдання для важких операцій:
```typescript
// Аналітика - в фоні
export class AnalyticsJob {
  async processDashboardMetrics(companyId: string) {
    const metrics = await this.calculateHeavyMetrics(companyId);
    await this.cacheService.set(`metrics_${companyId}`, metrics, 3600);
  }
}

// AI рекомендації - в черзі
export class AIRecommendationJob {
  async generateRecommendations(userId: string) {
    const recommendations = await this.aiService.generate(userId);
    await this.saveRecommendations(recommendations);
  }
}
```

## 6. 🗄️ Оптимізація бази даних

### Партиціонування для великих таблиць:
```sql
-- Партиціонування по даті для events
CREATE TABLE events_2024 PARTITION OF events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Партиціонування по company_id для applications
CREATE TABLE applications_company_1 PARTITION OF applications
FOR VALUES IN ('company-1');
```

### Очищення старих даних:
```sql
-- Автоматичне видалення старих логів
DELETE FROM events WHERE created_at < NOW() - INTERVAL '1 year';
DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '6 months';
```

## 7. 📈 Моніторинг продуктивності

### Додати логування повільних запитів:
```typescript
const start = performance.now();
const result = await queryBuilder.getMany();
const duration = performance.now() - start;

if (duration > 1000) {
  console.warn(`Slow query detected: ${duration}ms`, queryBuilder.getSql());
}
```

### Метрики продуктивності:
```typescript
// Prometheus метрики
const queryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['table', 'operation']
});
```

## 8. 🚀 Очікувані результати

### До оптимізації:
- Середній час запиту: 34ms
- Повільні запити: 0
- Пам'ять: ~100MB

### Після оптимізації:
- Середній час запиту: 5-15ms
- Повільні запити: 0
- Пам'ять: ~200MB (з кешем)
- Можливість обслуговувати: 1M+ користувачів

## 9. 📋 Пріоритети впровадження

### Високий пріоритет (негайно):
1. ✅ Додати критичні індекси
2. ✅ Оптимізувати N+1 запити
3. ✅ Додати базове кешування

### Середній пріоритет (1-2 тижні):
4. 🔄 Матеріалізовані представлення
5. 🔄 Фонова обробка
6. 🔄 Моніторинг

### Низький пріоритет (1-2 місяці):
7. 📊 Партиціонування
8. 📊 Розширена аналітика
9. 📊 Мікросервіси

