# Система управління користувачами компанії

## Огляд

Система дозволяє компаніям додавати кількох користувачів до свого кабінету з різними рівнями доступу та правами.

## Ролі користувачів

### 1. **Owner (Власник)**
- Повний доступ до всіх функцій
- Не може бути видалений
- Має всі права за замовчуванням

### 2. **Admin (Адміністратор)**
- Майже повний доступ
- Може керувати користувачами
- Не може керувати платежами

### 3. **Manager (Менеджер)**
- Керування вакансіями
- Перегляд кандидатів
- Не може керувати користувачами

### 4. **Recruiter (Рекрутер)**
- Базовий доступ
- Перегляд вакансій
- Доступ до контактів кандидатів
- Не може публікувати вакансії самостійно (потребує схвалення)

### 5. **Viewer (Переглядач)**
- Тільки перегляд
- Немає прав на редагування

## Права доступу (Permissions)

### Вакансії
- `canPublishJobsSelf` - Публікувати вакансії самостійно
- `canViewOthersJobs` - Переглядати вакансії від відгуків інших користувачів
- `canManageOthersJobs` - Керувати та затверджувати вакансії інших користувачів

### Кандидати
- `canViewCandidateContacts` - Відкривати контакти з бази резюме

### Послуги
- `canActivateServices` - Активувати послуги
- `canMakePayments` - Оплата збереженими картками компанії

### Управління
- `canManageUsers` - Керувати користувачами
- `canManagePaymentCards` - Керувати збереженими картками компанії
- `canEditCompanyInfo` - Редагувати інформацію про компанію
- `canManageJobTemplates` - Керувати макетами дизайну вакансій

## Структура БД

### Таблиця: `company_users`

```sql
- id (UUID) - Первинний ключ
- companyId (UUID) - FK до companies
- userId (UUID) - FK до users
- role (ENUM) - Роль користувача
- status (ENUM) - Статус (active, pending, inactive, suspended)
- permissions (JSONB) - Права доступу
- title (VARCHAR) - Посада
- department (VARCHAR) - Відділ
- invitedAt (TIMESTAMP) - Дата запрошення
- invitedBy (UUID) - Хто запросив
- acceptedAt (TIMESTAMP) - Дата прийняття
- lastAccessAt (TIMESTAMP) - Останній вхід
- notes (TEXT) - Примітки адміністратора
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## API Endpoints

### Отримання користувачів компанії
```
GET /api/company-users/company/:companyId/users
Query params: ?role=recruiter&status=active&search=name
```

### Запрошення користувача
```
POST /api/company-users/company/:companyId/users/invite
Body: {
  email: string,
  firstName?: string,
  lastName?: string,
  title?: string,
  role?: string,
  permissions?: object
}
```

### Оновлення користувача
```
PUT /api/company-users/users/:id
Body: {
  title?: string,
  role?: string,
  status?: string,
  permissions?: object
}
```

### Оновлення прав
```
PATCH /api/company-users/users/:id/permissions
Body: {
  permissions: object
}
```

### Видалення користувача
```
DELETE /api/company-users/users/:id
```

### Прийняття запрошення
```
POST /api/company-users/users/:id/accept
```

### Відхилення запрошення
```
POST /api/company-users/users/:id/reject
```

## Frontend

### Сторінка управління
- `/settings/users` - Список користувачів компанії

### Компоненти
- `CompanyUsersPage` - Основна сторінка
- `InviteUserModal` - Модальне вікно запрошення
- `EditUserModal` - Модальне вікно редагування прав

### API методи (frontend)
```typescript
import { companyUsersApi } from '../services/api';

// Отримання користувачів
const users = await companyUsersApi.getCompanyUsers(companyId);

// Запрошення
await companyUsersApi.inviteUser(companyId, userData);

// Оновлення прав
await companyUsersApi.updatePermissions(userId, permissions);
```

## Workflow

### Запрошення нового користувача

1. Адміністратор натискає "Додати користувача"
2. Заповнює форму з email, ім'ям, посадою
3. Вибирає роль та налаштовує права
4. Система створює користувача (якщо новий) або знаходить існуючого
5. Відправляється запрошення на email (TODO)
6. Користувач приймає запрошення та отримує доступ

### Управління правами

1. Адміністратор обирає користувача зі списку
2. Клікає "Редагувати"
3. Відкривається модальне вікно з правами
4. Змінює потрібні права (чекбокси)
5. Зберігає зміни
6. Права оновлюються миттєво

### Видалення користувача

1. Адміністратор клікає "Видалити"
2. Підтверджує дію
3. Користувач втрачає доступ до кабінету компанії
4. Не може видалити власника (owner)

## Безпека

- Тільки користувачі з правом `canManageUsers` можуть керувати іншими
- Власника (owner) не можна видалити або змінити його роль
- Всі API запити вимагають автентифікації
- Перевірка прав відбувається на backend

## Інтеграція з іншими модулями

- **Jobs** - Перевірка `canPublishJobsSelf` перед публікацією
- **Candidates** - Перевірка `canViewCandidateContacts` перед показом контактів
- **Payments** - Перевірка `canMakePayments` перед оплатою
- **Settings** - Перевірка `canEditCompanyInfo` перед редагуванням

## TODO

- [ ] Email сповіщення про запрошення
- [ ] Email підтвердження прийняття
- [ ] Логування змін прав (audit trail)
- [ ] Історія активності користувачів
- [ ] Групові ролі (templates)
- [ ] Експорт списку користувачів

