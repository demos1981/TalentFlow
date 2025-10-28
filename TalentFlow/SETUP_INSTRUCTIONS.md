# 🚀 Інструкції по налаштуванню функціоналу пошуку кандидатів

## 📋 Передумови

- Node.js 20+ 
- PostgreSQL 14+
- npm або yarn

## 🔧 Backend налаштування

### 1. Встановлення залежностей
```bash
cd TalentFlow/backend
npm install
```

### 2. Налаштування бази даних
Створіть файл `.env` в папці `backend`:
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=talentflow

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Створення бази даних
```sql
CREATE DATABASE talentflow;
```

### 4. Запуск міграцій
```bash
npm run migration:run
```

### 5. Запуск сервера
```bash
npm run dev
```

Сервер буде доступний за адресою: `http://localhost:3000`

## 🎨 Frontend налаштування

### 1. Встановлення залежностей
```bash
cd TalentFlow/web
npm install
```

### 2. Налаштування змінних середовища
Створіть файл `.env` в папці `web`:
```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=TalentFlow
```

### 3. Запуск додатку
```bash
npm run dev
```

Додаток буде доступний за адресою: `http://localhost:5173`

## 🔐 Налаштування користувачів

### 1. Створення роботодавця
```sql
INSERT INTO users (
  id, 
  email, 
  password, 
  firstName, 
  lastName, 
  role, 
  "canPostJobs", 
  "canSearchCandidates", 
  "canManageTeam",
  "isActive"
) VALUES (
  gen_random_uuid(),
  'employer@example.com',
  '$2b$10$...', -- хешований пароль
  'Іван',
  'Петренко',
  'employer',
  true,
  true,
  true,
  true
);
```

### 2. Створення кандидата
```sql
INSERT INTO users (
  id, 
  email, 
  password, 
  firstName, 
  lastName, 
  role, 
  "isActive"
) VALUES (
  gen_random_uuid(),
  'candidate@example.com',
  '$2b$10$...', -- хешований пароль
  'Марія',
  'Іванова',
  'candidate',
  true
);
```

## 🧪 Тестування функціоналу

### 1. Тестування API
```bash
# Пошук кандидатів
curl -X GET "http://localhost:3000/api/candidates/search" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Отримання статистики
curl -X GET "http://localhost:3000/api/candidates/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Список навичок (публічний)
curl -X GET "http://localhost:3000/api/candidates/skills"
```

### 2. Тестування фронтенду
1. Відкрийте `http://localhost:5173`
2. Увійдіть як роботодавець
3. Перейдіть на dashboard
4. Натисніть кнопку "Знайти кандидатів"
5. Протестуйте фільтри та пошук

## 🐛 Розв'язання проблем

### Проблема: "Cannot connect to database"
**Рішення:**
- Перевірте налаштування бази даних в `.env`
- Переконайтеся, що PostgreSQL запущений
- Перевірте права доступу користувача

### Проблема: "JWT token is invalid"
**Рішення:**
- Перевірте `JWT_SECRET` в `.env`
- Очистіть localStorage в браузері
- Перелогіньтесь в додатку

### Проблема: "Access denied for candidates search"
**Рішення:**
- Переконайтеся, що користувач має роль `employer`
- Перевірте права `canSearchCandidates`
- Перевірте middleware `roleCheck`

### Проблема: "Component not found"
**Рішення:**
- Перевірте імпорти компонентів
- Переконайтеся, що всі файли створені
- Перезапустіть dev сервер

## 📱 Тестування на різних пристроях

### Desktop (1200px+)
- Повний функціонал
- Всі фільтри видно одразу
- Бок-о-бок відображення

### Tablet (768px - 1199px)
- Адаптивна сітка
- Згорнуті фільтри
- Оптимізована навігація

### Mobile (480px - 767px)
- Вертикальне розташування
- Touch-friendly інтерфейс
- Спрощені фільтри

### Small Mobile (< 480px)
- Мінімальний інтерфейс
- Великі кнопки
- Оптимізована типографіка

## 🔍 Налагодження

### Backend логи
```bash
# Включення детальних логів
DEBUG=* npm run dev

# Логи в файл
npm run dev > logs/app.log 2>&1
```

### Frontend логи
```bash
# Включення React DevTools
npm run dev

# Логи в консолі браузера
console.log('Debug info:', data);
```

### Network запити
1. Відкрийте DevTools (F12)
2. Перейдіть на вкладку Network
3. Виконайте пошук кандидатів
4. Перевірте запити до API

## 📊 Моніторинг продуктивності

### Backend метрики
- Response time API
- Database query performance
- Memory usage
- CPU usage

### Frontend метрики
- Time to Interactive
- Bundle size
- Lighthouse score
- Core Web Vitals

## 🚀 Продакшн налаштування

### Environment variables
```bash
NODE_ENV=production
DB_HOST=production_db_host
DB_PORT=5432
DB_USER=production_user
DB_PASSWORD=secure_password
DB_NAME=production_db
JWT_SECRET=very_secure_jwt_secret
```

### Build команди
```bash
# Backend
npm run build
npm run start

# Frontend
npm run build
npm run preview
```

### Docker (опціонально)
```bash
# Backend
docker build -t talentflow-backend .
docker run -p 3000:3000 talentflow-backend

# Frontend
docker build -t talentflow-frontend .
docker run -p 80:80 talentflow-frontend
```

## 📚 Додаткові ресурси

### Документація
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Database Schema](./DATABASE_SCHEMA.md)

### Корисні посилання
- [TypeORM Documentation](https://typeorm.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Підтримка

### Контакти
- **Email**: dev@talentflow.com
- **Slack**: #talentflow-dev
- **GitHub**: [Issues](https://github.com/talentflow/issues)

### Часто задавані питання
- [FAQ](./FAQ.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**Успішного налаштування! 🎉**

Якщо у вас виникли питання, звертайтеся до команди розробки.













