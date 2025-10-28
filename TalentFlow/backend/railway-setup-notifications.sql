-- SQL скрипт для створення таблиці notifications в Railway
-- Виконати в Railway PostgreSQL

-- 1. Створення таблиці notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    "isRead" BOOLEAN DEFAULT false,
    metadata JSONB,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP WITH TIME ZONE,
    "expiresAt" TIMESTAMP WITH TIME ZONE
);

-- 2. Створення індексів
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications("createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications("userId", "isRead");

-- 3. Додавання foreign key (якщо таблиця users існує)
-- ALTER TABLE notifications 
-- ADD CONSTRAINT fk_notifications_user 
-- FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 4. Перевірка створення
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- 5. Перевірка індексів
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'notifications';
