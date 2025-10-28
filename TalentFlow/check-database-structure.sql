-- Перевірка поточної структури бази даних
\c talentflow;

-- Показуємо всі таблиці
\dt

-- Показуємо структуру таблиці users
\d users

-- Перевіряємо чи є колонка avatar
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;













