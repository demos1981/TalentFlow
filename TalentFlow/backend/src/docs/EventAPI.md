# Event API Documentation

## Огляд

Event API дозволяє керувати подіями в системі TalentFlow. Підтримує створення, оновлення, видалення та пошук подій різних типів: інтерв'ю, зустрічі, дедлайни, нагадування та інші.

## Базовий URL

```
https://api.talentflow.com/api/events
```

## Аутентифікація

Всі ендпоінти потребують JWT токен в заголовку `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

## Типи подій

- **INTERVIEW** - Інтерв'ю з кандидатами
- **MEETING** - Зустрічі та планерки
- **DEADLINE** - Дедлайни та терміни
- **REMINDER** - Нагадування
- **TRAINING** - Навчання та тренінги
- **CONFERENCE** - Конференції
- **WORKSHOP** - Воркшопи
- **PRESENTATION** - Презентації
- **REVIEW** - Рев'ю та оцінки
- **OTHER** - Інші події

## Статуси подій

- **SCHEDULED** - Запланована
- **IN_PROGRESS** - В процесі
- **COMPLETED** - Завершена
- **CANCELLED** - Скасована
- **POSTPONED** - Відкладена

## Пріоритети подій

- **LOW** - Низький
- **MEDIUM** - Середній
- **HIGH** - Високий
- **URGENT** - Терміновий

## Ендпоінти

### 1. Створення події

**POST** `/`

Створює нову подію в системі.

**Заголовки:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Тіло запиту:**
```json
{
  "title": "Технічне інтерв'ю з кандидатом",
  "description": "Інтерв'ю на позицію Senior Frontend Developer",
  "notes": "Підготувати питання по React та TypeScript",
  "startDate": "2024-01-15T10:00:00.000Z",
  "endDate": "2024-01-15T11:00:00.000Z",
  "type": "interview",
  "priority": "high",
  "isAllDay": false,
  "location": "Офіс, кімната 205",
  "locationDetails": {
    "address": "вул. Хрещатик, 22, Київ",
    "isOnline": false,
    "room": "205"
  },
  "attendees": ["user-uuid-1", "user-uuid-2"],
  "externalAttendees": ["candidate@example.com"],
  "reminders": [
    { "type": "email", "time": 60, "sent": false },
    { "type": "push", "time": 15, "sent": false }
  ],
  "tags": ["interview", "frontend", "senior"],
  "isPrivate": false,
  "jobId": "job-uuid-1",
  "candidateId": "candidate-uuid-1"
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "event-uuid",
    "title": "Технічне інтерв'ю з кандидатом",
    "description": "Інтерв'ю на позицію Senior Frontend Developer",
    "startDate": "2024-01-15T10:00:00.000Z",
    "endDate": "2024-01-15T11:00:00.000Z",
    "type": "interview",
    "status": "scheduled",
    "priority": "high",
    "isAllDay": false,
    "isRecurring": false,
    "recurrenceType": "none",
    "completionPercentage": 0,
    "location": "Офіс, кімната 205",
    "attendees": ["user-uuid-1", "user-uuid-2"],
    "externalAttendees": ["candidate@example.com"],
    "reminders": [
      { "type": "email", "time": 60, "sent": false },
      { "type": "push", "time": 15, "sent": false }
    ],
    "tags": ["interview", "frontend", "senior"],
    "isPrivate": false,
    "isActive": true,
    "createdById": "user-uuid",
    "jobId": "job-uuid-1",
    "candidateId": "candidate-uuid-1",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Отримання всіх подій

**GET** `/`

Отримує список подій з фільтрами та пагінацією.

**Параметри запиту:**
- `search` (string, optional) - Пошуковий запит
- `type` (string, optional) - Тип події
- `status` (string, optional) - Статус події
- `priority` (string, optional) - Пріоритет події
- `startDate` (string, optional) - Початкова дата (ISO 8601)
- `endDate` (string, optional) - Кінцева дата (ISO 8601)
- `location` (string, optional) - Локація
- `jobId` (string, optional) - ID вакансії
- `candidateId` (string, optional) - ID кандидата
- `companyId` (string, optional) - ID компанії
- `tags` (array, optional) - Теги для фільтрації
- `isRecurring` (boolean, optional) - Чи є повторюваною
- `isPrivate` (boolean, optional) - Чи є приватною
- `page` (number, optional) - Номер сторінки (за замовчуванням: 1)
- `limit` (number, optional) - Кількість елементів на сторінці (за замовчуванням: 20)
- `sortBy` (string, optional) - Поле для сортування (за замовчуванням: startDate)
- `sortOrder` (string, optional) - Порядок сортування (ASC/DESC, за замовчуванням: ASC)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events?page=1&limit=20&type=interview&status=scheduled" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "events": [
      {
        "id": "event-uuid-1",
        "title": "Технічне інтерв'ю з кандидатом",
        "startDate": "2024-01-15T10:00:00.000Z",
        "endDate": "2024-01-15T11:00:00.000Z",
        "type": "interview",
        "status": "scheduled",
        "priority": "high",
        "createdBy": {
          "id": "user-uuid",
          "firstName": "Іван",
          "lastName": "Петренко"
        },
        "job": {
          "id": "job-uuid-1",
          "title": "Senior Frontend Developer"
        }
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 3. Отримання події за ID

**GET** `/:id`

Отримує деталі конкретної події.

**Параметри шляху:**
- `id` (string, required) - UUID події

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/event-uuid" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "id": "event-uuid",
    "title": "Технічне інтерв'ю з кандидатом",
    "description": "Інтерв'ю на позицію Senior Frontend Developer",
    "startDate": "2024-01-15T10:00:00.000Z",
    "endDate": "2024-01-15T11:00:00.000Z",
    "type": "interview",
    "status": "scheduled",
    "priority": "high",
    "createdBy": {
      "id": "user-uuid",
      "firstName": "Іван",
      "lastName": "Петренко"
    },
    "job": {
      "id": "job-uuid-1",
      "title": "Senior Frontend Developer"
    },
    "candidate": {
      "id": "candidate-uuid-1",
      "firstName": "Марія",
      "lastName": "Іваненко"
    }
  }
}
```

### 4. Оновлення події

**PUT** `/:id`

Оновлює існуючу подію.

**Параметри шляху:**
- `id` (string, required) - UUID події

**Тіло запиту:**
```json
{
  "title": "Технічне інтерв'ю з кандидатом (оновлено)",
  "description": "Інтерв'ю на позицію Senior Frontend Developer - оновлений опис",
  "priority": "urgent",
  "location": "Офіс, кімната 210",
  "reminders": [
    { "type": "email", "time": 120, "sent": false },
    { "type": "push", "time": 30, "sent": false }
  ]
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": "event-uuid",
    "title": "Технічне інтерв'ю з кандидатом (оновлено)",
    "description": "Інтерв'ю на позицію Senior Frontend Developer - оновлений опис",
    "priority": "urgent",
    "location": "Офіс, кімната 210",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. Видалення події

**DELETE** `/:id`

Видаляє подію (soft delete).

**Параметри шляху:**
- `id` (string, required) - UUID події

**Приклад запиту:**
```bash
curl -X DELETE \
  "https://api.talentflow.com/api/events/event-uuid" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### 6. Отримання подій за день

**GET** `/day/:date`

Отримує всі події за конкретний день.

**Параметри шляху:**
- `date` (string, required) - Дата в форматі YYYY-MM-DD

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/day/2024-01-15" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Events by day retrieved successfully",
  "data": [
    {
      "id": "event-uuid-1",
      "title": "Технічне інтерв'ю з кандидатом",
      "startDate": "2024-01-15T10:00:00.000Z",
      "endDate": "2024-01-15T11:00:00.000Z",
      "type": "interview",
      "status": "scheduled",
      "priority": "high"
    }
  ]
}
```

### 7. Отримання подій за місяць

**GET** `/month/:year/:month`

Отримує всі події за конкретний місяць.

**Параметри шляху:**
- `year` (number, required) - Рік
- `month` (number, required) - Місяць (1-12)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/month/2024/1" \
  -H "Authorization: Bearer <token>"
```

### 8. Отримання подій за тиждень

**GET** `/week/:year/:week`

Отримує всі події за конкретний тиждень.

**Параметри шляху:**
- `year` (number, required) - Рік
- `week` (number, required) - Тиждень (1-53)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/week/2024/3" \
  -H "Authorization: Bearer <token>"
```

### 9. Отримання подій за період

**GET** `/range`

Отримує події за вказаний період.

**Параметри запиту:**
- `startDate` (string, required) - Початкова дата (ISO 8601)
- `endDate` (string, required) - Кінцева дата (ISO 8601)
- `type` (string, optional) - Тип події
- `status` (string, optional) - Статус події
- `userId` (string, optional) - ID користувача

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/range?startDate=2024-01-01&endDate=2024-01-31&type=interview" \
  -H "Authorization: Bearer <token>"
```

### 10. Отримання майбутніх подій

**GET** `/upcoming`

Отримує майбутні події.

**Параметри запиту:**
- `limit` (number, optional) - Кількість подій (за замовчуванням: 10)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/upcoming?limit=10" \
  -H "Authorization: Bearer <token>"
```

### 11. Позначення події як завершеної

**PUT** `/:id/complete`

Позначає подію як завершену.

**Параметри шляху:**
- `id` (string, required) - UUID події

**Тіло запиту:**
```json
{
  "completionPercentage": 100,
  "notes": "Інтерв'ю пройшло успішно, кандидат підходить"
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event marked as completed successfully",
  "data": {
    "id": "event-uuid",
    "status": "completed",
    "completionPercentage": 100,
    "completedAt": "2024-01-15T11:30:00.000Z",
    "notes": "Підготувати питання по React та TypeScript\nCompleted: Інтерв'ю пройшло успішно, кандидат підходить"
  }
}
```

### 12. Скасування події

**PUT** `/:id/cancel`

Скасовує подію.

**Параметри шляху:**
- `id` (string, required) - UUID події

**Тіло запиту:**
```json
{
  "reason": "Кандидат не зміг прийти через хворобу"
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event cancelled successfully",
  "data": {
    "id": "event-uuid",
    "status": "cancelled",
    "cancelledAt": "2024-01-15T09:30:00.000Z",
    "cancellationReason": "Кандидат не зміг прийти через хворобу"
  }
}
```

### 13. Статистика подій

**GET** `/stats`

Отримує статистику подій.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `dateFrom` (string, optional) - Початкова дата (ISO 8601)
- `dateTo` (string, optional) - Кінцева дата (ISO 8601)
- `type` (string, optional) - Тип події
- `status` (string, optional) - Статус події

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/stats?userId=user-uuid&dateFrom=2024-01-01&dateTo=2024-12-31" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Event statistics retrieved successfully",
  "data": {
    "totalEvents": 25,
    "eventsByType": [
      { "type": "interview", "count": 10 },
      { "type": "meeting", "count": 8 },
      { "type": "deadline", "count": 4 }
    ],
    "eventsByStatus": [
      { "status": "scheduled", "count": 15 },
      { "status": "completed", "count": 8 },
      { "status": "cancelled", "count": 2 }
    ],
    "eventsByPriority": [
      { "priority": "medium", "count": 12 },
      { "priority": "high", "count": 8 },
      { "priority": "urgent", "count": 3 }
    ],
    "upcomingEvents": 15,
    "completedEvents": 8,
    "cancelledEvents": 2,
    "averageDuration": 1.5,
    "recentEvents": 5
  }
}
```

### 14. Пошук подій

**GET** `/search`

Шукає події за текстом.

**Параметри запиту:**
- `search` (string, required) - Пошуковий запит
- `type` (string, optional) - Тип події
- `status` (string, optional) - Статус події
- `priority` (string, optional) - Пріоритет події

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/events/search?search=інтерв'ю&type=interview&status=scheduled" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Events search completed successfully",
  "data": [
    {
      "id": "event-uuid-1",
      "title": "Технічне інтерв'ю з кандидатом",
      "description": "Інтерв'ю на позицію Senior Frontend Developer",
      "startDate": "2024-01-15T10:00:00.000Z",
      "endDate": "2024-01-15T11:00:00.000Z",
      "type": "interview",
      "status": "scheduled",
      "priority": "high"
    }
  ]
}
```

## Коди помилок

| Код | Опис |
|-----|------|
| 400 | Bad Request - Невірний запит або параметри |
| 401 | Unauthorized - Необхідна авторизація |
| 404 | Not Found - Подія не знайдена |
| 500 | Internal Server Error - Внутрішня помилка сервера |

## Обмеження

- **Пагінація**: Максимум 100 елементів на сторінку
- **Пошук**: Максимум 50 результатів
- **Нагадування**: Максимум 10 нагадувань на подію
- **Учасники**: Максимум 50 внутрішніх та 50 зовнішніх учасників
- **Теги**: Максимум 20 тегів на подію

## Особливості

- **Soft Delete**: Видалені події не видаляються фізично, а позначаються як неактивні
- **Повторювані події**: Підтримка RRULE формату для створення повторюваних подій
- **Нагадування**: Автоматичне відправлення нагадувань по email, push та SMS
- **Локація**: Підтримка як фізичних, так і онлайн локацій
- **Зв'язки**: Події можуть бути пов'язані з вакансіями, кандидатами та компаніями


