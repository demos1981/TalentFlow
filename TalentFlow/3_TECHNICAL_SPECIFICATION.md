# ⚙️ TalentMatch Pro - Технічна специфікація

## 🏗️ Архітектура системи

### **Загальна структура**
```
hr_platform/
├── backend/          # Node.js + TypeORM + Express API
├── web/              # React + TypeScript веб-додаток
├── mobile/           # React Native мобільний додаток
├── ai-services/      # AI та ML сервіси
├── docker/           # Docker конфігурації
├── docs/             # Документація
└── scripts/          # Скрипти розгортання
```

### **Мікросервісна архітектура**
- **API Gateway** - маршрутизація запитів
- **User Service** - управління користувачами
- **Job Service** - управління вакансіями
- **Matching Service** - AI матчинг
- **Notification Service** - сповіщення
- **Payment Service** - платіжна система

---

## 🔧 Технологічний стек

### **Backend (Серверна частина)**
- **Node.js 20+** - основна платформа
- **TypeScript 5+** - типізація та безпека
- **Express.js 4.18+** - веб-фреймворк
- **TypeORM 0.3+** - ORM для бази даних
- **PostgreSQL 15+** - основна база даних
- **Redis 7+** - кешування та сесії

### **Frontend (Клієнтська частина)**
- **React 18+** - основний фреймворк
- **TypeScript 5+** - типізація
- **Tailwind CSS 3+** - стилізація
- **React Query 4+** - управління станом
- **React Router 6+** - навігація

### **Мобільний додаток**
- **React Native 0.73+** - крос-платформенна розробка
- **Expo 50+** - платформа розробки
- **TypeScript 5+** - типізація

### **AI та ML**
- **TensorFlow.js 4+** - машинне навчання
- **Natural** - обробка природної мови
- **Recommendation Engine** - система рекомендацій

---

## 🗄️ База даних

### **PostgreSQL схема**

#### **Основні таблиці:**
```sql
-- Користувачі
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('employer', 'candidate', 'admin')),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Профілі кандидатів
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  headline VARCHAR(200),
  summary TEXT,
  experience_years INTEGER DEFAULT 0,
  education_level VARCHAR(50),
  skills TEXT[],
  languages TEXT[],
  certifications TEXT[],
  portfolio_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  expected_salary_min DECIMAL(10, 2),
  expected_salary_max DECIMAL(10, 2),
  preferred_work_type VARCHAR(20) CHECK (preferred_work_type IN ('remote', 'onsite', 'hybrid')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Компанії роботодавців
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  founded_year INTEGER,
  description TEXT,
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Вакансії
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  responsibilities TEXT[],
  skills_required TEXT[],
  experience_level VARCHAR(50),
  employment_type VARCHAR(20) CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  work_type VARCHAR(20) CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Заявки на вакансії
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewing', 'accepted', 'rejected')),
  cover_letter TEXT,
  resume_url VARCHAR(500),
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI матчинг
CREATE TABLE ai_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_score DECIMAL(5, 4) NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
  skills_match DECIMAL(5, 4),
  experience_match DECIMAL(5, 4),
  location_match DECIMAL(5, 4),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Інтерв'ю
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interview_type VARCHAR(20) CHECK (interview_type IN ('phone', 'video', 'onsite', 'ai')),
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Платежі
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_type VARCHAR(20) CHECK (payment_type IN ('subscription', 'commission', 'premium')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Підписки
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Індекси для продуктивності:**
```sql
-- Індекси для швидкого пошуку
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_location ON jobs(location_lat, location_lng);
CREATE INDEX idx_jobs_skills ON jobs USING GIN(skills_required);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_ai_matches_job_id ON ai_matches(job_id);
CREATE INDEX idx_ai_matches_score ON ai_matches(match_score DESC);
```

---

## 🚀 Інструкції по запуску

### **1. Вимоги системи**
```bash
# Node.js 20+
node --version  # має бути v20.0.0 або вище

# Docker та Docker Compose
docker --version
docker-compose --version

# Git
git --version

# PostgreSQL 15+ (опціонально для локальної розробки)
psql --version
```

### **2. Клонування проекту**
```bash
git clone <repository-url>
cd hr_platform
```

### **3. Швидкий запуск (Docker)**
```bash
# Запуск всіх сервісів
./scripts/start.sh

# Або вручну
docker-compose up -d

# Перевірка статусу
docker-compose ps
```

### **4. Ручний запуск (Development)**

#### **Backend:**
```bash
cd backend
npm install
npm run dev
# API доступне на http://localhost:3000
```

#### **Web додаток:**
```bash
cd web
npm install
npm run dev
# Веб-додаток доступний на http://localhost:3001
```

#### **Мобільний додаток:**
```bash
cd mobile
npm install
npx expo start
# Сканувати QR код в Expo Go
```

---

## 🔧 Конфігурація

### **Environment змінні**

#### **Backend (.env):**
```env
# База даних
DB_HOST=localhost
DB_PORT=5432
DB_NAME=talentmatch
DB_USER=talentmatch_user
DB_PASSWORD=talentmatch_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Stripe (платежі)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (SendGrid)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@talentmatch.com

# AI сервіси
OPENAI_API_KEY=sk-...
TENSORFLOW_MODEL_URL=https://...

# AWS S3 (файли)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=talentmatch-files
AWS_REGION=us-east-1
```

#### **Web (.env):**
```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_CLIENT_ID=...
VITE_LINKEDIN_CLIENT_ID=...
```

### **Docker Compose (docker-compose.yml)**
```yaml
version: '3.8'

services:
  # База даних
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: talentmatch
      POSTGRES_USER: talentmatch_user
      POSTGRES_PASSWORD: talentmatch_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Backend API
  backend:
    build: ./backend
    environment:
      NODE_ENV: development
      DB_HOST: db
      REDIS_HOST: redis
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis

  # Web додаток
  web:
    build: ./web
    ports:
      - "3001:3001"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 📱 API Endpoints

### **Аутентифікація**
```http
POST /api/auth/register          # Реєстрація
POST /api/auth/login             # Вхід
POST /api/auth/refresh           # Оновлення токена
POST /api/auth/logout            # Вихід
GET  /api/auth/profile           # Профіль користувача
PUT  /api/auth/profile           # Оновлення профілю
```

### **Вакансії**
```http
GET    /api/jobs                 # Список вакансій
POST   /api/jobs                 # Створення вакансії
GET    /api/jobs/:id             # Деталі вакансії
PUT    /api/jobs/:id             # Оновлення вакансії
DELETE /api/jobs/:id             # Видалення вакансії
GET    /api/jobs/search          # Пошук вакансій
GET    /api/jobs/recommendations # Рекомендовані вакансії
```

### **Кандидати**
```http
GET    /api/candidates           # Список кандидатів
GET    /api/candidates/:id       # Профіль кандидата
PUT    /api/candidates/:id       # Оновлення профілю
GET    /api/candidates/search    # Пошук кандидатів
GET    /api/candidates/matches   # AI матчинг
```

### **Заявки**
```http
POST   /api/applications         # Подача заявки
GET    /api/applications         # Список заявок
PUT    /api/applications/:id     # Оновлення статусу
GET    /api/applications/stats   # Статистика заявок
```

### **AI сервіси**
```http
POST   /api/ai/match             # AI матчинг
POST   /api/ai/assess            # Оцінка навичок
POST   /api/ai/interview         # Автоматичне інтерв'ю
GET    /api/ai/insights          # AI інсайти
```

---

## 🧪 Тестування

### **Backend тести:**
```bash
cd backend
npm test                    # Unit тести
npm run test:integration    # Інтеграційні тести
npm run test:e2e           # E2E тести
npm run test:coverage      # Покриття коду
```

### **Frontend тести:**
```bash
cd web
npm test                   # Unit тести
npm run test:e2e          # E2E тести
npm run test:coverage     # Покриття коду
```

### **API тести:**
```bash
# Використання Postman або curl
curl -X GET http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 📊 Моніторинг та логування

### **Health checks:**
```http
GET /api/health              # Загальний стан
GET /api/health/db          # Стан бази даних
GET /api/health/redis       # Стан Redis
GET /api/health/ai          # Стан AI сервісів
```

### **Метрики:**
```http
GET /api/metrics            # Prometheus метрики
GET /api/analytics          # Бізнес аналітика
GET /api/performance        # Продуктивність API
```

### **Логування:**
```bash
# Перегляд логів
docker-compose logs -f backend
docker-compose logs -f web
docker-compose logs -f db
```

---

## 🚀 Розгортання

### **Development:**
```bash
./scripts/dev.sh
```

### **Staging:**
```bash
./scripts/staging.sh
```

### **Production:**
```bash
./scripts/production.sh
```

### **CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          ./scripts/production.sh
```

---

## 🔐 Безпека

### **JWT токени:**
- **Access token**: 15 хвилин
- **Refresh token**: 7 днів
- **Алгоритм**: HS256

### **Rate limiting:**
- **API**: 100 запитів/хвилину
- **Auth**: 5 спроб/хвилину
- **Upload**: 10 файлів/хвилину

### **Валідація:**
- **Input validation**: Joi схеми
- **SQL injection**: TypeORM параметри
- **XSS protection**: helmet middleware
- **CORS**: налаштований для production

---

## 📈 Масштабування

### **Горизонтальне масштабування:**
```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
    environment:
      NODE_ENV: production
      DB_HOST: ${DB_HOST}
      REDIS_HOST: ${REDIS_HOST}
```

### **Load balancing:**
```nginx
# nginx.conf
upstream backend {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}
```

### **Database scaling:**
- **Read replicas** для пошуку
- **Connection pooling** для продуктивності
- **Sharding** для великих обсягів даних

---

## 🎯 Оптимізація продуктивності

### **Backend:**
- **Caching**: Redis для часто запитуваних даних
- **Database indexing**: оптимізовані запити
- **Compression**: gzip для API відповідей
- **Connection pooling**: ефективне використання БД

### **Frontend:**
- **Code splitting**: lazy loading компонентів
- **Image optimization**: WebP формат, lazy loading
- **Bundle optimization**: Tree shaking, minification
- **CDN**: статичні файли через CDN

---

## 🎉 Висновок

**TalentMatch Pro** має технічно надійну архітектуру для масштабування до **$1M/місяць**:

✅ **Мікросервісна архітектура** для гнучкості
✅ **AI-підсилені сервіси** для унікальності
✅ **Масштабована база даних** для зростання
✅ **Сучасний технологічний стек** для продуктивності
✅ **Готові інструкції** для швидкого запуску

**Технічна основа готова - час будувати майбутнє найму!** 🚀⚙️
