-- Додавання відсутніх колонок в таблицю users
\c talentflow;

-- Додаємо колонку avatar якщо її немає
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar') THEN
        ALTER TABLE users ADD COLUMN "avatar" VARCHAR(500);
        RAISE NOTICE 'Колонка avatar додана';
    ELSE
        RAISE NOTICE 'Колонка avatar вже існує';
    END IF;
END $$;

-- Додаємо інші відсутні колонки якщо потрібно
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'firstName') THEN
        ALTER TABLE users ADD COLUMN "firstName" VARCHAR(100);
        RAISE NOTICE 'Колонка firstName додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'lastName') THEN
        ALTER TABLE users ADD COLUMN "lastName" VARCHAR(100);
        RAISE NOTICE 'Колонка lastName додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'googleId') THEN
        ALTER TABLE users ADD COLUMN "googleId" VARCHAR(255);
        RAISE NOTICE 'Колонка googleId додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'linkedinId') THEN
        ALTER TABLE users ADD COLUMN "linkedinId" VARCHAR(255);
        RAISE NOTICE 'Колонка linkedinId додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'canPostJobs') THEN
        ALTER TABLE users ADD COLUMN "canPostJobs" BOOLEAN DEFAULT false;
        RAISE NOTICE 'Колонка canPostJobs додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'canSearchCandidates') THEN
        ALTER TABLE users ADD COLUMN "canSearchCandidates" BOOLEAN DEFAULT false;
        RAISE NOTICE 'Колонка canSearchCandidates додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'canManageTeam') THEN
        ALTER TABLE users ADD COLUMN "canManageTeam" BOOLEAN DEFAULT false;
        RAISE NOTICE 'Колонка canManageTeam додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isHiringManager') THEN
        ALTER TABLE users ADD COLUMN "isHiringManager" BOOLEAN DEFAULT false;
        RAISE NOTICE 'Колонка isHiringManager додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isRecruiter') THEN
        ALTER TABLE users ADD COLUMN "isRecruiter" BOOLEAN DEFAULT false;
        RAISE NOTICE 'Колонка isRecruiter додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'jobTitle') THEN
        ALTER TABLE users ADD COLUMN "jobTitle" VARCHAR(100);
        RAISE NOTICE 'Колонка jobTitle додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'jobsPosted') THEN
        ALTER TABLE users ADD COLUMN "jobsPosted" INTEGER DEFAULT 0;
        RAISE NOTICE 'Колонка jobsPosted додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'candidatesViewed') THEN
        ALTER TABLE users ADD COLUMN "candidatesViewed" INTEGER DEFAULT 0;
        RAISE NOTICE 'Колонка candidatesViewed додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'city') THEN
        ALTER TABLE users ADD COLUMN "city" VARCHAR(100);
        RAISE NOTICE 'Колонка city додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'country') THEN
        ALTER TABLE users ADD COLUMN "country" VARCHAR(100);
        RAISE NOTICE 'Колонка country додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'certifications') THEN
        ALTER TABLE users ADD COLUMN "certifications" TEXT[];
        RAISE NOTICE 'Колонка certifications додана';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'lastActiveAt') THEN
        ALTER TABLE users ADD COLUMN "lastActiveAt" TIMESTAMP;
        RAISE NOTICE 'Колонка lastActiveAt додана';
    END IF;
END $$;

-- Перевіряємо результат
\d users













