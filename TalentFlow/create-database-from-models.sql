-- Повний SQL скрипт для створення бази даних TalentFlow на основі всіх моделей
-- Запустіть через Railway CLI: railway connect postgres < create-database-from-models.sql

-- 0. Переключаємося на базу talentflow
\c talentflow;

-- 1. Видаляємо всі існуючі таблиці та типи
DROP TABLE IF EXISTS "job_applications" CASCADE;
DROP TABLE IF EXISTS "aiRecommendations" CASCADE;
DROP TABLE IF EXISTS "applications" CASCADE;
DROP TABLE IF EXISTS "interviews" CASCADE;
DROP TABLE IF EXISTS "candidateProfiles" CASCADE;
DROP TABLE IF EXISTS "assessments" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "payments" CASCADE;
DROP TABLE IF EXISTS "subscriptions" CASCADE;
DROP TABLE IF EXISTS "jobs" CASCADE;
DROP TABLE IF EXISTS "companies" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "files" CASCADE;
DROP TABLE IF EXISTS "refresh_tokens" CASCADE;

-- Видаляємо enum типи
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS experience_level CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS interview_status CASCADE;
DROP TYPE IF EXISTS company_size CASCADE;
DROP TYPE IF EXISTS recommendation_type CASCADE;
DROP TYPE IF EXISTS match_score CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS assessment_status CASCADE;
DROP TYPE IF EXISTS assessment_type CASCADE;

-- 2. Створюємо enum типи на основі моделей
CREATE TYPE user_role AS ENUM ('candidate', 'employer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'verified');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'expired');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance', 'remote', 'full-time', 'part-time');
CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'middle', 'senior', 'lead', 'executive');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'shortlisted', 'interviewing', 'offered', 'hired', 'rejected');
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE recommendation_type AS ENUM ('candidate_to_job', 'job_to_candidate');
CREATE TYPE match_score AS ENUM ('low', 'medium', 'high', 'excellent');
CREATE TYPE notification_type AS ENUM ('application', 'interview', 'offer', 'reminder', 'system');
CREATE TYPE notification_status AS ENUM ('unread', 'read', 'archived');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'paypal', 'bank_transfer', 'crypto');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'expired');
CREATE TYPE subscription_plan AS ENUM ('basic', 'premium', 'enterprise');
CREATE TYPE assessment_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE assessment_type AS ENUM ('technical', 'behavioral', 'coding', 'case_study');

-- 3. Створюємо таблицю companies на основі Company.ts
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo VARCHAR(500),
    website VARCHAR(255),
    industry VARCHAR(100),
    size company_size DEFAULT 'small',
    founded INTEGER,
    location VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    "socialLinks" JSONB,
    benefits TEXT[],
    culture TEXT,
    mission TEXT,
    vision TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "isVerified" BOOLEAN DEFAULT false,
    "verifiedAt" TIMESTAMP,
    rating DECIMAL(3,2) DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Створюємо таблицю users на основі User.ts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    "linkedinId" VARCHAR(255) UNIQUE,
    "googleId" VARCHAR(255) UNIQUE,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'candidate',
    status user_status DEFAULT 'active',
    phone VARCHAR(20),
    avatar VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    skills TEXT[],
    experience INTEGER,
    education TEXT,
    certifications TEXT[],
    "companyId" UUID REFERENCES companies(id),
    "jobTitle" VARCHAR(100),
    department VARCHAR(100),
    "canPostJobs" BOOLEAN DEFAULT false,
    "canSearchCandidates" BOOLEAN DEFAULT false,
    "canManageTeam" BOOLEAN DEFAULT false,
    "isHiringManager" BOOLEAN DEFAULT false,
    "isRecruiter" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "emailVerified" BOOLEAN DEFAULT false,
    "emailVerifiedAt" TIMESTAMP,
    "lastLoginAt" TIMESTAMP,
    "lastActiveAt" TIMESTAMP,
    "jobsPosted" INTEGER DEFAULT 0,
    "candidatesViewed" INTEGER DEFAULT 0,
    "interviewsConducted" INTEGER DEFAULT 0,
    "successfulHires" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Створюємо таблицю jobs на основі Job.ts
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    location VARCHAR(255),
    remote VARCHAR(255),
    type job_type DEFAULT 'full_time',
    "experienceLevel" experience_level DEFAULT 'middle',
    "salaryMin" DECIMAL(10,2),
    "salaryMax" DECIMAL(10,2),
    currency VARCHAR(10),
    department VARCHAR(255),
    skills TEXT[],
    tags TEXT[],
    status job_status DEFAULT 'draft',
    "isUrgent" BOOLEAN DEFAULT false,
    "isFeatured" BOOLEAN DEFAULT false,
    deadline TIMESTAMP,
    views INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    "companyId" UUID NOT NULL REFERENCES companies(id),
    "createdByUserId" UUID REFERENCES users(id),
    "publishedAt" TIMESTAMP,
    "closedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Створюємо таблицю applications на основі Application.ts
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    "jobId" UUID NOT NULL REFERENCES jobs(id),
    status application_status DEFAULT 'pending',
    "coverLetter" TEXT,
    attachments TEXT[],
    "matchScore" DECIMAL(3,2),
    notes TEXT,
    "reviewedAt" TIMESTAMP,
    "reviewedBy" VARCHAR(255),
    "shortlistedAt" TIMESTAMP,
    "interviewedAt" TIMESTAMP,
    "offeredAt" TIMESTAMP,
    "hiredAt" TIMESTAMP,
    "rejectedAt" TIMESTAMP,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Створюємо таблицю interviews на основі Interview.ts
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "applicationId" UUID NOT NULL REFERENCES applications(id),
    "userId" UUID NOT NULL REFERENCES users(id),
    "scheduledAt" TIMESTAMP NOT NULL,
    duration INTEGER,
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    feedback TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Створюємо таблицю candidateProfiles на основі CandidateProfile.ts
CREATE TABLE "candidateProfiles" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary TEXT,
    "yearsOfExperience" INTEGER,
    education TEXT,
    "workHistory" TEXT,
    projects TEXT,
    preferences JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    views INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Створюємо таблицю assessments на основі Assessment.ts
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidateId" UUID NOT NULL REFERENCES users(id),
    "jobId" UUID NOT NULL REFERENCES jobs(id),
    type assessment_type NOT NULL,
    status assessment_status DEFAULT 'pending',
    "startedAt" TIMESTAMP,
    "completedAt" TIMESTAMP,
    score DECIMAL(5,2),
    feedback TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Створюємо таблицю notifications на основі Notification.ts
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status notification_status DEFAULT 'unread',
    "readAt" TIMESTAMP,
    "actionUrl" VARCHAR(500),
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Створюємо таблицю payments на основі Payment.ts
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    "subscriptionId" UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    method payment_method NOT NULL,
    "transactionId" VARCHAR(255),
    "paymentDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Створюємо таблицю subscriptions на основі Subscription.ts
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    plan subscription_plan NOT NULL,
    status subscription_status DEFAULT 'active',
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,
    "trialEndDate" TIMESTAMP,
    "cancelledAt" TIMESTAMP,
    "cancellationReason" TEXT,
    "autoRenew" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Створюємо таблицю aiRecommendations на основі AiRecommendation.ts
CREATE TABLE "aiRecommendations" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type recommendation_type NOT NULL,
    "candidateId" UUID NOT NULL REFERENCES users(id),
    "jobId" UUID NOT NULL REFERENCES jobs(id),
    "matchScore" INTEGER CHECK ("matchScore" >= 0 AND "matchScore" <= 100),
    "matchScoreCategory" match_score,
    "skillsMatch" JSONB,
    "experienceMatch" JSONB,
    "locationMatch" JSONB,
    "salaryMatch" JSONB,
    "aiReason" TEXT,
    "isViewed" BOOLEAN DEFAULT false,
    "isApplied" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Створюємо таблицю job_applications для Many-to-Many зв'язку
CREATE TABLE "job_applications" (
    "jobId" UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "appliedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("jobId", "userId")
);

-- 15. Створюємо індекси для швидкості
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
CREATE INDEX idx_jobs_type ON jobs(type);

CREATE INDEX idx_applications_userId ON applications("userId");
CREATE INDEX idx_applications_jobId ON applications("jobId");
CREATE INDEX idx_applications_status ON applications(status);

CREATE INDEX idx_interviews_applicationId ON interviews("applicationId");
CREATE INDEX idx_interviews_userId ON interviews("userId");

CREATE INDEX idx_notifications_userId ON notifications("userId");
CREATE INDEX idx_notifications_status ON notifications(status);

CREATE INDEX idx_payments_userId ON payments("userId");
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_subscriptions_userId ON subscriptions("userId");
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 16. Перевіряємо результати
SELECT 'Database created successfully from all models!' as message;
SELECT 'All tables created!' as message;
SELECT 'All enum types created!' as message;
SELECT 'All indexes created!' as message;

-- 17. Показуємо структуру
\dt
\d users













