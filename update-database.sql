-- Скрипт для оновлення структури бази даних TalentFlow
-- Запустіть цей скрипт через Railway CLI або psql

-- 0. Переключаємося на базу talentflow
\c talentflow;

-- 1. Створюємо enum типи
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('candidate', 'employer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('active', 'inactive', 'closed', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'middle', 'senior', 'lead');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Додаємо нові колонки до таблиці users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'candidate',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS linkedin_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS can_post_jobs BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_search_candidates BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_manage_team BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hiring_manager BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_recruiter BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id);

-- 3. Додаємо нові колонки до таблиці jobs
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;

-- 4. Змінюємо типи колонок на enum
ALTER TABLE users ALTER COLUMN role TYPE user_role USING 
    CASE 
        WHEN role = 'candidate' THEN 'candidate'::user_role
        WHEN role = 'employer' THEN 'employer'::user_role
        WHEN role = 'admin' THEN 'admin'::user_role
        ELSE 'candidate'::user_role
    END;

ALTER TABLE users ALTER COLUMN status TYPE user_status USING 
    CASE 
        WHEN status = 'active' THEN 'active'::user_status
        WHEN status = 'inactive' THEN 'inactive'::user_status
        WHEN status = 'suspended' THEN 'suspended'::user_status
        WHEN status = 'verified' THEN 'verified'::user_status
        ELSE 'active'::user_status
    END;

-- 5. Оновлюємо існуючі дані
UPDATE users 
SET role = 'candidate', 
    status = 'active',
    can_post_jobs = false, 
    can_search_candidates = false,
    can_manage_team = false,
    is_hiring_manager = false,
    is_recruiter = false
WHERE role IS NULL OR role NOT IN ('employer', 'admin');

-- 6. Створюємо індекси для швидкості
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING GIN(skills);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);

-- 7. Перевіряємо результати
SELECT 'Users table updated successfully!' as message;
SELECT 'Enum types created successfully!' as message;
SELECT 'Indexes created successfully!' as message;
