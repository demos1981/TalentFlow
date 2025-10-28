# 🔍 Пошук кандидатів - TalentFlow

## 📋 Опис функціоналу

Система пошуку кандидатів для роботодавців з розширеними фільтрами, статистикою та управлінням результатами.

## 🎯 Основні можливості

### ✅ Для роботодавців
- **Пошук кандидатів** з детальними фільтрами
- **Перегляд профілів** кандидатів
- **Рекомендації** кандидатів для конкретних вакансій
- **Статистика** пошуку та аналітика
- **Закладки** улюблених кандидатів
- **Контактна інформація** кандидатів

### ❌ Для кандидатів
- **НЕ можуть** створювати вакансії
- **НЕ можуть** шукати інших кандидатів
- **НЕ можуть** переглядати статистику найму

## 🏗️ Архітектура

### Backend (Node.js + TypeORM)
```
backend/src/
├── models/
│   ├── User.ts              # Модель користувача з ролями
│   └── CandidateProfile.ts  # Профіль кандидата
├── services/
│   └── CandidateService.ts  # Бізнес-логіка пошуку
├── controllers/
│   └── CandidateController.ts # API контролер
├── routes/
│   └── candidates.ts        # API роути
└── middleware/
    └── roleCheck.ts         # Перевірка прав доступу
```

### Frontend (React + TypeScript)
```
web/src/
├── components/CandidateSearch/
│   ├── CandidateSearch.tsx  # Головний компонент
│   ├── SearchFilters.tsx    # Фільтри пошуку
│   ├── CandidateList.tsx    # Список результатів
│   ├── CandidateCard.tsx    # Картка кандидата
│   └── SearchStats.tsx      # Статистика
├── services/
│   └── candidateService.ts  # API клієнт
└── pages/
    └── CandidateSearchPage.tsx # Сторінка пошуку
```

## 🚀 Швидкий старт

### 1. Backend налаштування

Додайте роути в `server.ts`:
```typescript
import candidateRoutes from './routes/candidates';

// ... existing code ...

app.use('/api/candidates', candidateRoutes);
```

### 2. Frontend інтеграція

Додайте роут в `App.tsx`:
```typescript
import CandidateSearchPage from './pages/CandidateSearchPage';

// ... existing code ...

<Route path="/candidates/search" element={
  <Layout>
    <CandidateSearchPage />
  </Layout>
} />
```

### 3. Навігація

Додайте кнопку в dashboard:
```typescript
<button 
  className="btn btn-secondary"
  onClick={() => navigate('/candidates/search')}
>
  <Users className="icon" />
  Знайти кандидатів
</button>
```

## 🔐 Система прав доступу

### Ролі користувачів
- **`candidate`** - Шукач роботи
- **`employer`** - Роботодавець
- **`admin`** - Адміністратор

### Права роботодавців
- **`canPostJobs`** - Створення вакансій
- **`canSearchCandidates`** - Пошук кандидатів
- **`canManageTeam`** - Управління командою

### Middleware використання
```typescript
import { canSearchCandidates } from '../middleware/roleCheck';

// Захищений роут
router.get('/search', authenticate, canSearchCandidates, searchCandidates);
```

## 📊 API Endpoints

### Публічні (без аутентифікації)
```
GET /api/candidates/skills      # Список навичок
GET /api/candidates/locations   # Список локацій
```

### Захищені (тільки для роботодавців)
```
GET /api/candidates/search                    # Пошук кандидатів
GET /api/candidates/profile/:id              # Профіль кандидата
GET /api/candidates/recommended/:jobId       # Рекомендації для вакансії
GET /api/candidates/stats                    # Статистика пошуку
```

## 🔍 Фільтри пошуку

### Основні фільтри
- **Навички** - Множинний вибір
- **Досвід** - Діапазон років
- **Локація** - Місто, країна
- **Зарплата** - Мін/макс + валюта
- **Тип роботи** - Віддалена, релокація
- **Доступність** - Терміни початку роботи
- **Освіта** - Рівень освіти
- **Мови** - Знання іноземних мов
- **Сертифікати** - Професійні сертифікати

### Приклад запиту
```typescript
const filters = {
  skills: ['JavaScript', 'React', 'Node.js'],
  experience: { min: 2, max: 5 },
  location: 'Київ',
  remote: true,
  salary: { min: 3000, max: 8000, currency: 'USD' },
  availability: 'immediate'
};
```

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

### Адаптивні компоненти
- Гнучка сітка фільтрів
- Мобільна навігація
- Оптимізовані картки кандидатів
- Touch-friendly інтерфейс

## 🎨 UI/UX Особливості

### Дизайн система
- **Кольори**: Blue (#3b82f6), Gray (#6b7280), Success (#10b981)
- **Типографіка**: Inter font family
- **Тіні**: Subtle shadows для глибини
- **Анімації**: Smooth transitions та hover ефекти

### Компоненти
- **Cards** - Для відображення кандидатів
- **Filters** - Розкриваючі панелі фільтрів
- **Pagination** - Навігація по сторінках
- **Stats** - Візуалізація статистики
- **Loading States** - Індикатори завантаження

## 🧪 Тестування

### Unit тести
```bash
# Backend
npm run test:unit

# Frontend
npm run test:unit
```

### Integration тести
```bash
# API тести
npm run test:integration

# E2E тести
npm run test:e2e
```

## 📈 Продуктивність

### Оптимізації
- **Lazy Loading** - Компоненти завантажуються по потребі
- **Debounced Search** - Пошук з затримкою
- **Pagination** - Обмеження кількості результатів
- **Caching** - Кешування списків навичок та локацій

### Метрики
- **Time to Interactive**: < 2s
- **Search Response**: < 500ms
- **Bundle Size**: < 200KB
- **Lighthouse Score**: > 90

## 🔧 Налаштування

### Environment Variables
```bash
# Backend
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

### Конфігурація
```typescript
// config/database.ts
export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'talentflow'
};
```

## 🚨 Обробка помилок

### Типи помилок
- **Validation Errors** - Невірні параметри запиту
- **Authentication Errors** - Неавторизований доступ
- **Authorization Errors** - Недостатньо прав
- **Server Errors** - Внутрішні помилки сервера

### Логування
```typescript
// Backend
logger.error('Search error:', error);
logger.info('Search query:', { filters, resultsCount });

// Frontend
console.error('Search failed:', error);
```

## 📚 Документація

### Компоненти
- [CandidateSearch](./components/CandidateSearch/README.md)
- [SearchFilters](./components/CandidateSearch/SearchFilters.md)
- [CandidateList](./components/CandidateSearch/CandidateList.md)
- [CandidateCard](./components/CandidateSearch/CandidateCard.md)
- [SearchStats](./components/CandidateSearch/SearchStats.md)

### API
- [Candidate API](./backend/API_DOCUMENTATION.md)
- [Authentication](./backend/AUTH_DOCUMENTATION.md)
- [Error Handling](./backend/ERROR_HANDLING.md)

## 🤝 Внесок

### Розробка
1. Fork репозиторію
2. Створіть feature branch
3. Зробіть коміт з описом змін
4. Push в branch
5. Створіть Pull Request

### Стандарти коду
- **TypeScript** - Строга типізація
- **ESLint** - Лінтер для якості коду
- **Prettier** - Форматування коду
- **Husky** - Pre-commit hooks

## 📞 Підтримка

### Контакти
- **Email**: support@talentflow.com
- **Slack**: #talentflow-support
- **GitHub Issues**: [Create Issue](https://github.com/talentflow/issues)

### Часто задавані питання
- [FAQ](./FAQ.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Migration Guide](./MIGRATION.md)

---

**TalentFlow** - Сучасна платформа для найму та управління талантами 🚀













