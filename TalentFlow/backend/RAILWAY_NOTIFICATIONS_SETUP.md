# Налаштування таблиці notifications в Railway

## Проблема
В Railway базі даних відсутня таблиця `notifications`, хоча в коді створена entity та всі сервіси.

## Рішення

### Варіант 1: SQL скрипт (Рекомендований)

1. **Відкрийте Railway Dashboard**
2. **Перейдіть до вашого проекту** → **talentflow-backend**
3. **Виберіть PostgreSQL базу даних**
4. **Перейдіть на вкладку "Query"**
5. **Скопіюйте та виконайте SQL скрипт:**

```sql
-- Створення таблиці notifications
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

-- Створення індексів
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications("createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications("userId", "isRead");
```

### Варіант 2: TypeORM Migration

1. **Перейдіть в backend директорію:**
```bash
cd backend
```

2. **Запустіть migration:**
```bash
npm run typeorm migration:run
```

### Варіант 3: Автоматична синхронізація

1. **Переконайтеся, що в `database.ts` додана entity:**
```typescript
import { Notification } from '../models/Notification';

export const AppDataSource = new DataSource({
  // ...
  entities: [
    User,
    Company,
    Job,
    Application,
    Interview,
    CandidateProfile,
    Assessment,
    Payment,
    Subscription,
    Notification // ✅ Додано
  ],
  synchronize: process.env.NODE_ENV === 'development', // true для розробки
});
```

2. **Перезапустіть Railway backend** - TypeORM автоматично створить таблицю

## Перевірка

Після створення таблиці перевірте:

```sql
-- Перевірка таблиці
SELECT * FROM notifications LIMIT 1;

-- Перевірка структури
\d notifications

-- Перевірка індексів
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'notifications';
```

## Важливо

- **Foreign key** до таблиці `users` додається автоматично, якщо таблиця `users` існує
- **JSONB** тип для `metadata` дозволяє зберігати гнучкі дані
- **Індекси** створюються для швидкого пошуку по `userId`, `type`, `isRead`
- **Soft delete** реалізовано через поле `isDeleted`

## Після створення

1. **Перезапустіть Railway backend**
2. **Перевірте логи** - не має бути помилок про відсутню таблицю
3. **Тестуйте notification API** - створення, читання, оновлення сповіщень
