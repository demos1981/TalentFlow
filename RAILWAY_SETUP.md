# 🚂 Налаштування Railway для TalentFlow

## **Крок 1: Створення Railway акаунту**

### 1.1 Реєстрація
- Зайти на [railway.app](https://railway.app)
- Натиснути "Start Deploying"
- Авторизуватися через GitHub

### 1.2 Вибір плану
- **Hobby** ($5/місяць) - для початку
- **Pro** ($20/місяць) - для production з 100,000 користувачів
- **Enterprise** - для великих компаній

## **Крок 2: Створення проекту**

### 2.1 Новий проект
- Dashboard → "New Project"
- "Deploy from GitHub repo"
- Вибрати репозиторій: `MykhailoIlyashDev/TalentFlow`

### 2.2 Структура проекту
```
TalentFlow/
├── backend/          # Backend API
├── web/             # Frontend React
└── database/        # PostgreSQL
```

## **Крок 3: Налаштування PostgreSQL Database**

### 3.1 Додати Database сервіс
- Project → "New Service"
- "Database" → "PostgreSQL"
- **Налаштування:**
  ```
  Name: talentflow-db
  Plan: Pro ($20/місяць)
  Region: Auto (найближчий до користувачів)
  ```

### 3.2 Database конфігурація для 100,000 користувачів
```sql
-- Створення таблиць з правильними індексами
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'candidate',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  last_active_at TIMESTAMP
);

-- Індекси для швидкого пошуку
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Таблиця для компаній
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  size VARCHAR(50),
  location VARCHAR(255),
  website VARCHAR(255),
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблиця для вакансій
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  location VARCHAR(255),
  employment_type VARCHAR(50),
  experience_level VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Індекси для вакансій
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- Таблиця для заявок
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  cover_letter TEXT,
  resume_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Індекси для заявок
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- Таблиця для файлів
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  url VARCHAR(500) NOT NULL,
  bucket_key VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Індекси для файлів
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_mime_type ON files(mime_type);
CREATE INDEX idx_files_created_at ON files(created_at);
```

### 3.3 Connection Pooling
```typescript
// src/config/database.ts
import { DataSource } from 'typeorm';
import { Pool } from 'pg';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Вимикаємо в production
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/models/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
  // Connection pooling для масштабування
  extra: {
    max: 20, // Максимальна кількість з'єднань
    min: 5,  // Мінімальна кількість з'єднань
    idle: 10000, // Час очікування (мс)
    acquire: 30000, // Час отримання з'єднання (мс)
  },
});

// Додатковий connection pool для важких операцій
export const analyticsPool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  min: 2,
  idle: 10000,
  acquire: 30000,
});
```

## **Крок 4: Налаштування Backend Service**

### 4.1 Додати Backend сервіс
- Project → "New Service"
- "GitHub Repo" → вибрати `backend` папку
- **Налаштування:**
  ```
  Name: talentflow-backend
  Plan: Pro ($20/місяць)
  Region: Auto
  ```

### 4.2 Environment Variables для Backend
```env
# Database
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=30d

# Cloudflare R2
R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
R2_BUCKET_NAME=${R2_BUCKET_NAME}
R2_ENDPOINT_URL=${R2_ENDPOINT_URL}
R2_PUBLIC_URL=${R2_PUBLIC_URL}

# CORS
CORS_ORIGIN=${CORS_ORIGIN}

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
NODE_ENV=production
PORT=3000
```

### 4.3 Railway.toml конфігурація
```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[[services]]
name = "backend"
type = "web"
plan = "pro"
region = "auto"

[services.env]
NODE_ENV = "production"
PORT = "3000"

[[services]]
name = "database"
type = "postgresql"
plan = "pro"
region = "auto"

[services.env]
POSTGRES_DB = "talentflow"
POSTGRES_USER = "talentflow_user"
POSTGRES_PASSWORD = "secure_password_here"
```

## **Крок 5: Налаштування Frontend Service**

### 5.1 Додати Frontend сервіс
- Project → "New Service"
- "GitHub Repo" → вибрати `web` папку
- **Налаштування:**
  ```
  Name: talentflow-frontend
  Plan: Pro ($20/місяць)
  Region: Auto
  ```

### 5.2 Environment Variables для Frontend
```env
# API
VITE_API_URL=${BACKEND_URL}
VITE_APP_NAME=TalentFlow
VITE_APP_VERSION=1.0.0

# Cloudflare R2
VITE_R2_PUBLIC_URL=${R2_PUBLIC_URL}

# Analytics
VITE_GA_TRACKING_ID=${GA_TRACKING_ID}
VITE_MIXPANEL_TOKEN=${MIXPANEL_TOKEN}
```

### 5.3 Build конфігурація
```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vite": "^4.5.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

## **Крок 6: Масштабування та Performance**

### 6.1 Auto-scaling налаштування
```yaml
# .railway/scale.yaml
services:
  backend:
    min_instances: 2
    max_instances: 10
    target_cpu_utilization: 70
    target_memory_utilization: 80
    
  database:
    plan: "pro"
    storage: "100GB"
    backup_retention: "30d"
    
  frontend:
    min_instances: 1
    max_instances: 5
    target_cpu_utilization: 60
```

### 6.2 Load Balancing
```typescript
// src/middleware/loadBalancer.ts
import { Request, Response, NextFunction } from 'express';

export const loadBalancer = (req: Request, res: Response, next: NextFunction) => {
  // Додаємо заголовки для load balancer
  res.setHeader('X-Instance-ID', process.env.RAILWAY_REPLICA_ID || 'unknown');
  res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
  
  next();
};

// Health check для load balancer
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    instance: process.env.RAILWAY_REPLICA_ID,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  });
};
```

### 6.3 Caching стратегія
```typescript
// src/services/CacheService.ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }
  
  // Кешування користувачів
  async cacheUser(userId: string, userData: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(`user:${userId}`, ttl, JSON.stringify(userData));
  }
  
  // Кешування вакансій
  async cacheJobs(filters: string, jobs: any[], ttl: number = 1800): Promise<void> {
    await this.redis.setex(`jobs:${filters}`, ttl, JSON.stringify(jobs));
  }
  
  // Кешування пошукових результатів
  async cacheSearch(query: string, results: any[], ttl: number = 900): Promise<void> {
    await this.redis.setex(`search:${query}`, ttl, JSON.stringify(results));
  }
}
```

## **Крок 7: Monitoring та Logging**

### 7.1 Railway Metrics
- **CPU Usage** - моніторинг навантаження
- **Memory Usage** - використання пам'яті
- **Network I/O** - мережева активність
- **Response Time** - час відповіді API

### 7.2 Log Aggregation
```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'talentflow-backend' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Railway автоматично збирає логи
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 7.3 Performance Monitoring
```typescript
// src/middleware/performance.ts
import { Request, Response, NextFunction } from 'express';

export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url, statusCode } = req;
    
    logger.info('Request completed', {
      method,
      url,
      statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    // Метрики для Railway
    if (duration > 1000) {
      logger.warn('Slow request detected', { method, url, duration });
    }
  });
  
  next();
};
```

## **Крок 8: Backup та Disaster Recovery**

### 8.1 Database Backup
- **Automatic backups** кожні 24 години
- **Manual backups** перед великими змінами
- **Point-in-time recovery** для критичних даних

### 8.2 Environment Backup
```bash
# Експорт змінних середовища
railway variables export > .env.backup

# Імпорт змінних середовища
railway variables import .env.backup
```

### 8.3 Code Backup
```bash
# Створення release tag
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# Rollback до попередньої версії
git checkout v1.0.0
git push origin main --force
```

## **Крок 9: Security та Compliance**

### 9.1 Environment Security
- **Secrets management** через Railway
- **Environment isolation** між dev/staging/prod
- **Access control** для команди

### 9.2 API Security
```typescript
// src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // максимум 100 запитів
    message: 'Too many requests from this IP'
  }),
  // CORS налаштування
  cors({
    origin: process.env.CORS_ORIGIN?.split(','),
    credentials: true
  })
];
```

## **Очікувані результати:**
- ✅ **Backend** масштабується до 100,000 користувачів
- ✅ **Database** з connection pooling та оптимізованими індексами
- ✅ **Auto-scaling** при навантаженні
- ✅ **Load balancing** між інстансами
- ✅ **Monitoring** та logging
- ✅ **Backup** та disaster recovery
- ✅ **Security** та compliance

---

**Наступний крок:** Налаштування домену та SSL сертифікатів
