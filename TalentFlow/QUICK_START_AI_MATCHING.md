# 🚀 Швидкий старт AI Matching Backend

## ⚡ За 5 хвилин до робочого AI Matching API

### 1. 📋 Перевірка залежностей
```bash
cd TalentFlow/backend
npm install
```

### 2. 🗄️ Запуск бази даних
```bash
# Запустіть PostgreSQL
docker-compose up -d

# Перевірте чи запущений
docker ps | grep postgres
```

### 3. ⚙️ Налаштування змінних середовища
```bash
# Скопіюйте .env.example
cp .env.example .env

# Відредагуйте .env файл
nano .env
```

**Обов'язкові змінні:**
```env
DB_HOST=localhost
DB_PORT=5438
DB_NAME=talentflow
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

### 4. 🗃️ Запуск міграції
```bash
# Зробіть скрипт виконуваним
chmod +x scripts/run-ai-matching-migration.sh

# Запустіть міграцію
./scripts/run-ai-matching-migration.sh
```

### 5. 🔗 Додавання роутів
В `src/server.ts` додайте:

```typescript
// Імпорт AI Matching роутів
import aiMatchingRoutes from './routes/aiMatching';

// ... existing code ...

// Додайте AI Matching роути
app.use('/api/ai-matching', aiMatchingRoutes);
```

### 6. 🚀 Запуск сервера
```bash
npm run dev
```

### 7. ✅ Тестування API
```bash
# Health check
curl http://localhost:3000/api/ai-matching/health

# Отримати статистику
curl http://localhost:3000/api/ai-matching/stats

# Отримати рекомендації
curl http://localhost:3000/api/ai-matching/recommendations
```

## 🎯 Готово!

Ваш AI Matching Backend тепер доступний за адресою:
- **Base URL:** `http://localhost:3000/api/ai-matching`
- **Health Check:** `http://localhost:3000/api/ai-matching/health`
- **Documentation:** `TalentFlow/backend/AI_MATCHING_API_README.md`

## 🔗 Основні ендпоінти

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `GET` | `/recommendations` | Отримати AI рекомендації |
| `POST` | `/generate` | Згенерувати рекомендації |
| `PUT` | `/recommendations/:id` | Оновити рекомендацію |
| `GET` | `/stats` | Статистика матчингу |
| `GET` | `/health` | Перевірка стану |

## 🐛 Якщо щось не працює

### Проблема: "Cannot find module"
```bash
npm install
npm run build
```

### Проблема: "Database connection failed"
```bash
# Перевірте чи запущений Docker
docker ps

# Перезапустіть базу
docker-compose down
docker-compose up -d
```

### Проблема: "Migration failed"
```bash
# Перевірте .env файл
cat .env

# Запустіть міграцію заново
./scripts/run-ai-matching-migration.sh
```

## 📚 Детальна документація

- **API Documentation:** `backend/AI_MATCHING_API_README.md`
- **Implementation Summary:** `AI_MATCHING_BACKEND_SUMMARY.md`
- **Migration Script:** `backend/scripts/run-ai-matching-migration.sh`

---

**TalentFlow AI Matching** - Готовий до роботи за 5 хвилин! 🚀✨
