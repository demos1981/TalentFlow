-- Скрипт для перейменування колонок в таблиці users
-- Запустіть через Railway CLI: railway connect postgres < fix-column-names.sql

-- Переключаємося на базу talentflow
\c talentflow;

-- Перейменовуємо колонки щоб вони відповідали коду
ALTER TABLE users RENAME COLUMN firstname TO "firstName";
ALTER TABLE users RENAME COLUMN lastname TO "lastName";
ALTER TABLE users RENAME COLUMN google_id TO "googleId";
ALTER TABLE users RENAME COLUMN linkedin_id TO "linkedinId";
ALTER TABLE users RENAME COLUMN can_post_jobs TO "canPostJobs";
ALTER TABLE users RENAME COLUMN can_search_candidates TO "canSearchCandidates";
ALTER TABLE users RENAME COLUMN can_manage_team TO "canManageTeam";
ALTER TABLE users RENAME COLUMN is_hiring_manager TO "isHiringManager";
ALTER TABLE users RENAME COLUMN is_recruiter TO "isRecruiter";
ALTER TABLE users RENAME COLUMN company_id TO "companyId";
ALTER TABLE users RENAME COLUMN job_title TO "jobTitle";
ALTER TABLE users RENAME COLUMN email_verified TO "emailVerified";
ALTER TABLE users RENAME COLUMN email_verified_at TO "emailVerifiedAt";
ALTER TABLE users RENAME COLUMN last_login_at TO "lastLoginAt";
ALTER TABLE users RENAME COLUMN last_active_at TO "lastActiveAt";
ALTER TABLE users RENAME COLUMN jobs_posted TO "jobsPosted";
ALTER TABLE users RENAME COLUMN profile_picture TO "profilePicture";

-- Перевіряємо результат
SELECT 'Column names updated successfully!' as message;
\d users













