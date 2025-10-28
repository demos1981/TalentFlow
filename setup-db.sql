-- Налаштування бази даних для TalentMatch Pro
-- Запустити: docker exec -i talentmatch_db psql -U talentmatch_user -d talentmatch < setup-db.sql

-- Перевірка поточних таблиць
\dt

-- Перевірка користувачів
\du

-- Перевірка поточного користувача
SELECT current_user, current_database();

-- Перевірка версії PostgreSQL
SELECT version();
