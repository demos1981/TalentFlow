-- Спрощений SQL скрипт для створення таблиці notifications в Railway
-- Без enum для кращої сумісності

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

-- Створення індексів для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications("createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications("userId", "isRead");

-- Додавання foreign key до таблиці users (якщо таблиця users існує)
-- ALTER TABLE notifications 
-- ADD CONSTRAINT fk_notifications_user 
-- FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- Коментарі до таблиці
COMMENT ON TABLE notifications IS 'Таблиця для зберігання сповіщень користувачів';
COMMENT ON COLUMN notifications.id IS 'Унікальний ідентифікатор сповіщення';
COMMENT ON COLUMN notifications."userId" IS 'ID користувача, якому належить сповіщення';
COMMENT ON COLUMN notifications.type IS 'Тип сповіщення';
COMMENT ON COLUMN notifications.title IS 'Заголовок сповіщення';
COMMENT ON COLUMN notifications.message IS 'Текст сповіщення';
COMMENT ON COLUMN notifications.priority IS 'Пріоритет сповіщення';
COMMENT ON COLUMN notifications."isRead" IS 'Чи прочитане сповіщення';
COMMENT ON COLUMN notifications.metadata IS 'Додаткові дані у форматі JSON';
COMMENT ON COLUMN notifications."isDeleted" IS 'Чи видалене сповіщення (soft delete)';
COMMENT ON COLUMN notifications."createdAt" IS 'Дата створення сповіщення';
COMMENT ON COLUMN notifications."updatedAt" IS 'Дата останнього оновлення';
COMMENT ON COLUMN notifications."readAt" IS 'Дата прочитання сповіщення';
COMMENT ON COLUMN notifications."expiresAt" IS 'Дата закінчення терміну дії сповіщення';
