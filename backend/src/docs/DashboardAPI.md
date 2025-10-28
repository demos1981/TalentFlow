# Dashboard API Documentation

## Огляд

Dashboard API надає комплексну аналітику та статистику для платформи TalentFlow. Включає загальну статистику, аналітику за періодами, топ показники та детальну аналітику по різних категоріях.

## Базовий URL

```
https://api.talentflow.com/api/dashboard
```

## Аутентифікація

Всі ендпоінти потребують JWT токен в заголовку `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

## Ендпоінти

### 1. Загальна статистика дашборду

**GET** `/stats`

Отримує загальну статистику платформи з показниками росту та продуктивності.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `period` (string, optional) - Період аналізу (`day`, `week`, `month`, `quarter`, `year`, `all`)
- `dateFrom` (string, optional) - Початкова дата (ISO 8601)
- `dateTo` (string, optional) - Кінцева дата (ISO 8601)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/stats?period=month&dateFrom=2024-01-01&dateTo=2024-12-31" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalJobs": 450,
      "totalApplications": 3200,
      "totalCompanies": 180,
      "totalCandidates": 1100,
      "activeJobs": 380,
      "verifiedCompanies": 150,
      "totalDocuments": 850
    },
    "growth": {
      "usersGrowth": 15.5,
      "jobsGrowth": 8.2,
      "applicationsGrowth": 22.1,
      "companiesGrowth": 12.3
    },
    "recentActivity": {
      "newUsers": 45,
      "newJobs": 18,
      "newApplications": 120,
      "newCompanies": 8
    },
    "performance": {
      "applicationRate": 7.11,
      "interviewRate": 25.5,
      "hireRate": 8.2,
      "averageTimeToHire": 0
    }
  }
}
```

### 2. Швидкий огляд

**GET** `/overview`

Отримує швидкий огляд основних показників для поточного користувача.

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/overview" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Quick overview retrieved successfully",
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalJobs": 450,
      "totalApplications": 3200,
      "totalCompanies": 180,
      "totalCandidates": 1100,
      "activeJobs": 380,
      "verifiedCompanies": 150,
      "totalDocuments": 850
    },
    "recentActivity": {
      "newUsers": 45,
      "newJobs": 18,
      "newApplications": 120,
      "newCompanies": 8
    }
  }
}
```

### 3. Статистика за період

**GET** `/period/:period`

Отримує детальну статистику за вказаний період з розбивкою по датах.

**Параметри шляху:**
- `period` (string, required) - Період аналізу (`day`, `week`, `month`, `quarter`, `year`, `all`)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/period/month" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Period statistics retrieved successfully",
  "data": {
    "period": "month",
    "data": [
      {
        "date": "2024-01-01",
        "users": 15,
        "jobs": 8,
        "applications": 45,
        "companies": 3
      },
      {
        "date": "2024-01-02",
        "users": 12,
        "jobs": 6,
        "applications": 38,
        "companies": 2
      }
    ]
  }
}
```

### 4. Топ статистика

**GET** `/top`

Отримує топ показники по навичкам, локаціях, компаніях та типах робіт.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `period` (string, optional) - Період аналізу
- `limit` (number, optional) - Кількість елементів (1-100, за замовчуванням: 10)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/top?period=month&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Top statistics retrieved successfully",
  "data": {
    "topSkills": [
      { "skill": "JavaScript", "count": 245 },
      { "skill": "React", "count": 198 },
      { "skill": "TypeScript", "count": 156 }
    ],
    "topLocations": [
      { "location": "Remote", "count": 180 },
      { "location": "New York, USA", "count": 95 },
      { "location": "London, UK", "count": 78 }
    ],
    "topCompanies": [
      { "company": "TechCorp Inc.", "jobs": 25, "applications": 180 },
      { "company": "StartupXYZ", "jobs": 18, "applications": 145 }
    ],
    "topJobTypes": [
      { "type": "full_time", "count": 280 },
      { "type": "contract", "count": 95 }
    ]
  }
}
```

### 5. Аналітика

**GET** `/analytics`

Отримує детальну аналітику по різних категоріях з можливістю вибору типу графіка.

**Параметри запиту:**
- `type` (string, required) - Тип аналітики (`users`, `jobs`, `applications`, `companies`, `revenue`, `conversions`, `engagement`)
- `period` (string, optional) - Період аналізу
- `chartType` (string, optional) - Тип графіка (`line`, `bar`, `pie`, `area`, `doughnut`)
- `limit` (number, optional) - Кількість точок даних (1-365, за замовчуванням: 30)
- `filters` (object, optional) - Додаткові фільтри

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/analytics?type=users&period=month&chartType=line&limit=30" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Analytics data retrieved successfully",
  "data": {
    "type": "users",
    "period": "month",
    "chartType": "line",
    "data": [
      { "label": "2024-01-01", "value": 15, "date": "2024-01-01" },
      { "label": "2024-01-02", "value": 12, "date": "2024-01-02" },
      { "label": "2024-01-03", "value": 18, "date": "2024-01-03" }
    ]
  }
}
```

### 6. Активність користувачів (тільки для адмінів)

**GET** `/user-activity`

Отримує активність користувачів за період.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `period` (string, optional) - Період аналізу
- `limit` (number, optional) - Кількість користувачів (1-100, за замовчуванням: 20)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/user-activity?period=week&limit=20" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "User activity retrieved successfully",
  "data": {
    "period": "week",
    "activities": [
      {
        "userId": "user-uuid-1",
        "userName": "Іван Петренко",
        "userEmail": "ivan@example.com",
        "activityType": "general",
        "activityCount": 15,
        "lastActivity": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 7. Статистика доходів (тільки для адмінів)

**GET** `/revenue`

Отримує статистику доходів платформи.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `period` (string, optional) - Період аналізу
- `currency` (string, optional) - Валюта (за замовчуванням: USD)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/revenue?period=month&currency=USD" \
  -H "Authorization: Bearer <token>"
```

### 8. Статистика конверсій

**GET** `/conversions`

Отримує статистику конверсій по воронці продажів.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `period` (string, optional) - Період аналізу
- `conversionTypes` (array, optional) - Типи конверсій для аналізу

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/conversions?period=month&conversionTypes=[\"application\",\"interview\",\"hire\"]" \
  -H "Authorization: Bearer <token>"
```

### 9. Статистика залучення

**GET** `/engagement`

Отримує статистику залучення користувачів.

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `period` (string, optional) - Період аналізу
- `engagementTypes` (array, optional) - Типи залучення для аналізу

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/dashboard/engagement?period=week&engagementTypes=[\"views\",\"clicks\",\"shares\"]" \
  -H "Authorization: Bearer <token>"
```

## Типи даних

### DashboardPeriod
```typescript
enum DashboardPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all'
}
```

### AnalyticsType
```typescript
enum AnalyticsType {
  USERS = 'users',
  JOBS = 'jobs',
  APPLICATIONS = 'applications',
  COMPANIES = 'companies',
  REVENUE = 'revenue',
  CONVERSIONS = 'conversions',
  ENGAGEMENT = 'engagement'
}
```

### ChartType
```typescript
enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  DOUGHNUT = 'doughnut'
}
```

## Коди помилок

| Код | Опис |
|-----|------|
| 400 | Bad Request - Невірний запит або параметри |
| 401 | Unauthorized - Необхідна авторизація |
| 403 | Forbidden - Недостатньо прав доступу |
| 500 | Internal Server Error - Внутрішня помилка сервера |

## Обмеження

- **Пагінація**: Максимум 100 елементів на сторінку
- **Період аналізу**: Максимум 365 днів для детальної аналітики
- **Топ статистика**: Максимум 100 елементів
- **Активність користувачів**: Тільки для адміністраторів
- **Статистика доходів**: Тільки для адміністраторів

## Примітки

- Всі дати повертаються в форматі ISO 8601
- Ріст розраховується у відсотках порівняно з попереднім періодом
- Показники продуктивності розраховуються на основі загальних даних
- Аналітика підтримує різні типи графіків для візуалізації


