# TalentMatch Pro Frontend

Фронтенд додаток для платформи TalentMatch Pro - інноваційної HR платформи з AI функціями.

## 🚀 Швидкий старт

### Вимоги

- Node.js 20+
- pnpm 8+
- Docker та Docker Compose (опціонально)

### Встановлення

```bash
# Клонування репозиторію
git clone <repository-url>
cd hr_platform/web

# Встановлення залежностей
pnpm install

# Копіювання змінних середовища
cp env.example .env

# Налаштування змінних середовища
# Відредагуйте .env файл згідно з вашими налаштуваннями

# Запуск development сервера
pnpm run dev
```

### Docker (рекомендовано)

```bash
# Запуск development середовища
./scripts/docker.sh start-dev

# Запуск production фронтенду
./scripts/docker.sh start

# Запуск тестів
./scripts/docker.sh start-test

# Перегляд статусу
./scripts/docker.sh status

# Зупинка
./scripts/docker.sh stop
```

## 🏗️ Архітектура

### Структура проекту

```
src/
├── components/          # React компоненти
│   ├── Layout/         # Компоненти макету
│   ├── UI/             # UI компоненти
│   └── Forms/          # Форми
├── contexts/            # React контексти
├── hooks/               # Кастомні хуки
├── pages/               # Сторінки додатку
├── services/            # API сервіси
├── types/               # TypeScript типи
├── utils/               # Утиліти
├── validation/          # Валідація (Zod)
├── constants/           # Константи
└── config/              # Конфігурація
```

### Технології

- **React 18+** - UI бібліотека
- **TypeScript** - типізація
- **Tailwind CSS** - стилізація
- **Vite** - збірник
- **React Router** - маршрутизація
- **React Query** - управління станом
- **Zustand** - глобальний стан
- **React Hook Form** - форми
- **Zod** - валідація
- **Lucide React** - іконки

## ⚙️ Конфігурація

### Змінні середовища

Основні змінні середовища:

```bash
# API
VITE_API_URL=http://localhost:3000/api

# База даних
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_USERNAME=postgres
VITE_DB_PASSWORD=password
VITE_DB_NAME=talentmatch

# JWT
VITE_JWT_SECRET=your-secret-key

# Файли
VITE_STORAGE_TYPE=local
VITE_MAX_FILE_SIZE=10485760

# Email
VITE_EMAIL_PROVIDER=sendgrid
VITE_SENDGRID_API_KEY=your-api-key

# Платежі
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
VITE_PAYPAL_CLIENT_ID=your-paypal-id

# AI
VITE_OPENAI_API_KEY=your-openai-key
VITE_OPENAI_MODEL=gpt-4

# Моніторинг
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-ga-id
```

### Конфігурація за середовищем

- **Development** (`src/config/config.ts`) - для розробки
- **Test** (`src/config/test.ts`) - для тестування
- **Production** (`src/config/production.ts`) - для production

## 🐳 Docker

### Образі

- **production** - Production збірка з nginx
- **development** - Development сервер
- **test** - Тестовий сервер

### Команди Docker

```bash
# Збірка production образу
docker build --target production -t talentmatch-frontend:prod .

# Збірка development образу
docker build --target development -t talentmatch-frontend:dev .

# Збірка тестового образу
docker build --target test -t talentmatch-frontend:test .

# Запуск production
docker run -p 3001:80 talentmatch-frontend:prod

# Запуск development
docker run -p 3002:3001 talentmatch-frontend:dev
```

### Docker Compose

```bash
# Запуск production
docker-compose up -d frontend

# Запуск development середовища
docker-compose --profile dev up -d

# Запуск тестів
docker-compose --profile test up -d
```

## 🧪 Тестування

### Запуск тестів

```bash
# Unit тести
pnpm run test

# Тести з покриттям
pnpm run test:coverage

# E2E тести
pnpm run test:e2e

# Тести в Docker
./scripts/docker.sh start-test
```

### Тестова конфігурація

- Окрема база даних `talentmatch_test`
- Redis база `1`
- Мок email сервіс
- Мінімальне логування

## 🚀 Розгортання

### Production

```bash
# Збірка
pnpm run build

# Docker
./scripts/docker.sh start

# Перевірка
./scripts/docker.sh status
```

### CI/CD

```bash
# Встановлення залежностей
pnpm install --frozen-lockfile

# Тестування
pnpm run test

# Збірка
pnpm run build

# Docker збірка
docker build --target production -t talentmatch-frontend:$VERSION .
```

## 📊 Моніторинг

### Health Checks

- `/health` - Статус фронтенду
- `/nginx_status` - Статус nginx

### Логування

- Логи nginx в `/var/log/nginx/`
- Логи додатку в `logs/` директорії
- Sentry для помилок (production)

### Метрики

- Google Analytics
- Mixpanel
- Nginx статус
- Docker статистика

## 🔒 Безпека

### Заголовки безпеки

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Rate Limiting

- API: 10 запитів/сек
- Логін: 5 запитів/хв

### CORS

- Налаштовано для production доменів
- Обробка preflight запитів

## 📁 Файли

### Завантаження файлів

- Максимальний розмір: 50MB (production), 10MB (development)
- Підтримувані формати: JPEG, PNG, GIF, PDF, DOC, DOCX
- Storage: Local або S3

### Кешування

- Статичні файли: 1 рік
- HTML: 1 година
- API: 5 хвилин

## 🛠️ Розробка

### Команди

```bash
# Development сервер
pnpm run dev

# Збірка
pnpm run build

# Preview збірки
pnpm run preview

# Лінтер
pnpm run lint

# Форматування
pnpm run format

# Типи
pnpm run type-check
```

### Структура компонентів

```typescript
// Приклад компонента
import { Button } from '@/components/UI';
import { useAuth } from '@/hooks';
import { config } from '@/config';

export const MyComponent = () => {
  const { user } = useAuth();
  
  return (
    <Button variant="primary">
      Hello, {user?.first_name}!
    </Button>
  );
};
```

### Кастомні хуки

```typescript
// Приклад використання хуків
import { useLocalStorage, useDebounce, useForm } from '@/hooks';

export const MyForm = () => {
  const [value, setValue] = useLocalStorage('my-key', '');
  const debouncedValue = useDebounce(value, 500);
  const form = useForm({
    initialValues: { name: '' },
    validationSchema: mySchema,
  });
  
  // ...
};
```

## 📚 Документація

- [Конфігурація](./src/config/README.md)
- [Компоненти](./src/components/README.md)
- [Хуки](./src/hooks/README.md)
- [API](./src/services/README.md)

## 🤝 Внесок

### Структура комітів

```
feat: додати нову функцію
fix: виправити помилку
docs: оновити документацію
style: форматування коду
refactor: рефакторинг
test: додати тести
chore: оновити залежності
```

### Pull Request

1. Створіть feature branch
2. Додайте тести
3. Оновіть документацію
4. Перевірте лінтер
5. Створіть PR

## 📄 Ліцензія

MIT License - див. [LICENSE](../LICENSE) файл.

## 🆘 Підтримка

- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Документація: [Wiki](https://github.com/your-repo/wiki)
- Email: support@talentmatch.com

## 🔄 Оновлення

### Залежності

```bash
# Оновлення залежностей
pnpm update

# Оновлення Docker образів
./scripts/docker.sh update

# Перевірка застарілих пакетів
pnpm outdated
```

### Версіонування

- Semantic Versioning (MAJOR.MINOR.PATCH)
- Автоматичне оновлення через Dependabot
- Changelog в [CHANGELOG.md](../CHANGELOG.md)
