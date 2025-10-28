-- Оновлення старих значень experienceLevel на нові
-- Спочатку оновлюємо дані в таблиці jobs

-- Мапінг старих значень на нові
UPDATE jobs 
SET "experienceLevel" = 'FROM_1_TO_3' 
WHERE "experienceLevel" = 'JUNIOR';

UPDATE jobs 
SET "experienceLevel" = 'FROM_3_TO_5' 
WHERE "experienceLevel" = 'MIDDLE';

UPDATE jobs 
SET "experienceLevel" = 'FROM_5_TO_10' 
WHERE "experienceLevel" = 'SENIOR';

UPDATE jobs 
SET "experienceLevel" = 'MORE_THAN_10' 
WHERE "experienceLevel" = 'LEAD';

UPDATE jobs 
SET "experienceLevel" = 'MORE_THAN_10' 
WHERE "experienceLevel" = 'EXECUTIVE';

-- Видаляємо старі enum значення
ALTER TYPE jobs_experiencelevel_enum DROP VALUE IF EXISTS 'JUNIOR';
ALTER TYPE jobs_experiencelevel_enum DROP VALUE IF EXISTS 'MIDDLE';
ALTER TYPE jobs_experiencelevel_enum DROP VALUE IF EXISTS 'SENIOR';
ALTER TYPE jobs_experiencelevel_enum DROP VALUE IF EXISTS 'LEAD';
ALTER TYPE jobs_experiencelevel_enum DROP VALUE IF EXISTS 'EXECUTIVE';

-- Додаємо нові enum значення
ALTER TYPE jobs_experiencelevel_enum ADD VALUE IF NOT EXISTS 'NO_EXPERIENCE';
ALTER TYPE jobs_experiencelevel_enum ADD VALUE IF NOT EXISTS 'LESS_THAN_1';
ALTER TYPE jobs_experiencelevel_enum ADD VALUE IF NOT EXISTS 'FROM_1_TO_3';
ALTER TYPE jobs_experiencelevel_enum ADD VALUE IF NOT EXISTS 'FROM_3_TO_5';
ALTER TYPE jobs_experiencelevel_enum ADD VALUE IF NOT EXISTS 'FROM_5_TO_10';
ALTER TYPE jobs_experiencelevel_enum ADD VALUE IF NOT EXISTS 'MORE_THAN_10';

-- Оновлення старих значень jobType
UPDATE jobs 
SET type = 'FULL_TIME' 
WHERE type = 'CONTRACT';

UPDATE jobs 
SET type = 'INTERNSHIP' 
WHERE type = 'INTERNSHIP';

-- Видаляємо старі enum значення для jobType
ALTER TYPE jobs_jobtype_enum DROP VALUE IF EXISTS 'CONTRACT';
ALTER TYPE jobs_jobtype_enum DROP VALUE IF EXISTS 'REMOTE';

-- Додаємо нові enum значення для jobType
ALTER TYPE jobs_jobtype_enum ADD VALUE IF NOT EXISTS 'FULL_TIME';
ALTER TYPE jobs_jobtype_enum ADD VALUE IF NOT EXISTS 'PART_TIME';
ALTER TYPE jobs_jobtype_enum ADD VALUE IF NOT EXISTS 'INTERNSHIP';
ALTER TYPE jobs_jobtype_enum ADD VALUE IF NOT EXISTS 'FREELANCE';
