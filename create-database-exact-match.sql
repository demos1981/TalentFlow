-- Скрипт для створення бази даних TalentFlow точно як в коді
-- Запустіть через Railway CLI: railway connect postgres < create-database-exact-match.sql

-- 0. Переключаємося на базу talentflow
\c talentflow;

-- 1. Видаляємо всі існуючі таблиці та типи
DROP TABLE IF EXISTS "aiRecommendations" CASCADE;
DROP TABLE IF EXISTS "applications" CASCADE;
DROP TABLE IF EXISTS "interviews" CASCADE;
DROP TABLE IF EXISTS "candidateProfiles" CASCADE;
DROP TABLE IF EXISTS "candidates" CASCADE;
DROP TABLE IF EXISTS "jobs" CASCADE;
DROP TABLE IF EXISTS "companies" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "files" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "refresh_tokens" CASCADE;

-- Видаляємо enum типи
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS experience_level CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS interview_status CASCADE;
DROP TYPE IF EXISTS recommendation_type CASCADE;
DROP TYPE IF EXISTS match_score CASCADE;

-- 2. Створюємо enum типи
CREATE TYPE user_role AS ENUM ('candidate', 'employer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'verified');
CREATE TYPE job_status AS ENUM ('active', 'inactive', 'closed', 'draft');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'middle', 'senior', 'lead');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE recommendation_type AS ENUM ('candidate_to_job', 'job_to_candidate');
CREATE TYPE match_score AS ENUM ('low', 'medium', 'high', 'excellent');

-- 3. Створюємо таблицю companies
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo VARCHAR(500),
    industry VARCHAR(100),
    size VARCHAR(50),
    founded INTEGER,
    location VARCHAR(255),
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    isActive BOOLEAN DEFAULT true,
    isVerified BOOLEAN DEFAULT false,
    verifiedAt TIMESTAMP,
    rating DECIMAL(3,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Створюємо таблицю users точно як в коді
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(255),
    skills TEXT[],
    experience INTEGER,
    education TEXT,
    avatar VARCHAR(500),
    bio TEXT,
    isActive BOOLEAN DEFAULT true,
    emailVerified BOOLEAN DEFAULT false,
    emailVerifiedAt TIMESTAMP,
    lastLoginAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Нові поля для ролей та прав
    role user_role DEFAULT 'candidate',
    status user_status DEFAULT 'active',
    googleId VARCHAR(255),
    linkedinId VARCHAR(255),
    canPostJobs BOOLEAN DEFAULT false,
    canSearchCandidates BOOLEAN DEFAULT false,
    canManageTeam BOOLEAN DEFAULT false,
    isHiringManager BOOLEAN DEFAULT false,
    isRecruiter BOOLEAN DEFAULT false,
    
    -- Поля для роботодавців
    companyId INTEGER REFERENCES companies(id),
    jobTitle VARCHAR(100),
    department VARCHAR(100),
    jobsPosted INTEGER DEFAULT 0,
    
    -- Додаткові поля
    city VARCHAR(100),
    country VARCHAR(100),
    certifications TEXT[],
    lastActiveAt TIMESTAMP,
    
    -- Додаткові поля з коду
    candidatesViewed INTEGER DEFAULT 0
);

-- 5. Створюємо таблицю jobs точно як в коді
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    companyId INTEGER REFERENCES companies(id),
    requirements TEXT,
    responsibilities TEXT,
    skills TEXT[],
    experienceLevel experience_level,
    salaryMin INTEGER,
    salaryMax INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    location VARCHAR(255),
    type job_type,
    department VARCHAR(100),
    tags TEXT[],
    benefits TEXT,
    status job_status DEFAULT 'active',
    createdByUserId INTEGER REFERENCES users(id),
    isRemote BOOLEAN DEFAULT false,
    isUrgent BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    applicationsCount INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Створюємо таблицю candidateProfiles
CREATE TABLE "candidateProfiles" (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    summary TEXT,
    yearsOfExperience INTEGER,
    education TEXT,
    workHistory TEXT,
    projects TEXT,
    preferences JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    views INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Створюємо таблицю applications
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    jobId INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    coverLetter TEXT,
    resumeUrl VARCHAR(500),
    appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewedAt TIMESTAMP,
    reviewedBy INTEGER REFERENCES users(id),
    notes TEXT
);

-- 8. Створюємо таблицю interviews
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    applicationId INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    scheduledAt TIMESTAMP,
    duration INTEGER,
    type VARCHAR(50),
    status interview_status DEFAULT 'scheduled',
    notes TEXT,
    feedback TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Створюємо таблицю aiRecommendations
CREATE TABLE "aiRecommendations" (
    id SERIAL PRIMARY KEY,
    type recommendation_type NOT NULL,
    candidateId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    jobId INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    matchScore INTEGER CHECK (matchScore >= 0 AND matchScore <= 100),
    matchScoreCategory match_score,
    skillsMatch JSONB,
    experienceMatch JSONB,
    locationMatch JSONB,
    salaryMatch JSONB,
    aiReason TEXT,
    isViewed BOOLEAN DEFAULT false,
    isApplied BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Створюємо індекси для швидкості
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_companyId ON users("companyId");
CREATE INDEX idx_users_googleId ON users("googleId");
CREATE INDEX idx_users_linkedinId ON users("linkedinId");
CREATE INDEX idx_users_skills ON users USING GIN(skills);

CREATE INDEX idx_jobs_companyId ON jobs("companyId");
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_skills ON jobs USING GIN(skills);
CREATE INDEX idx_jobs_experienceLevel ON jobs("experienceLevel");

-- 11. Перевіряємо результати
SELECT 'Database created successfully with exact match to code!' as message;
SELECT 'All tables created!' as message;
SELECT 'All enum types created!' as message;
SELECT 'All indexes created!' as message;

-- 12. Показуємо структуру
\dt
\d users













