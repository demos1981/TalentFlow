# Documents API Documentation

## Огляд

Documents API дозволяє користувачам завантажувати, керувати та обмінюватися документами через Cloudflare R2 Storage. Підтримуються різні типи файлів: PDF, DOC, DOCX, TXT, RTF, зображення та інші популярні формати.

## Базовий URL

```
https://api.talentflow.com/api/docs
```

## Аутентифікація

Більшість ендпоінтів потребують JWT токен в заголовку `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

## Підтримувані типи файлів

- **PDF**: `application/pdf`
- **Microsoft Word**: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Текстові файли**: `text/plain`, `application/rtf`
- **Зображення**: `image/jpeg`, `image/png`, `image/gif`
- **Microsoft Excel**: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Microsoft PowerPoint**: `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`

## Ендпоінти

### 1. Завантаження документа

**POST** `/upload`

Завантажує новий документ в систему.

**Заголовки:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Параметри:**
- `file` (file, required) - Файл для завантаження
- `type` (string, required) - Тип документа (`resume`, `cover_letter`, `portfolio`, `certificate`, `other`)
- `description` (string, optional) - Опис документа
- `tags` (array, optional) - Теги для пошуку
- `isPublic` (boolean, optional) - Чи є документ публічним

**Приклад запиту:**
```bash
curl -X POST \
  https://api.talentflow.com/api/docs/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf" \
  -F "type=resume" \
  -F "description=Мій резюме для пошуку роботи" \
  -F "tags=[\"frontend\", \"react\", \"typescript\"]" \
  -F "isPublic=false"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "originalName": "resume.pdf",
    "fileName": "uuid.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "r2Key": "documents/userId/resume/uuid.pdf",
    "r2Url": "https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf",
    "type": "resume",
    "status": "ready",
    "description": "Мій резюме для пошуку роботи",
    "tags": ["frontend", "react", "typescript"],
    "isActive": true,
    "isPublic": false,
    "downloadCount": 0,
    "viewCount": 0,
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "processedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Отримання документа за ID

**GET** `/:id`

Отримує деталі документа за його ID.

**Заголовки:**
```
Authorization: Bearer <token>
```

**Параметри шляху:**
- `id` (string, required) - UUID документа

**Приклад запиту:**
```bash
curl -X GET \
  https://api.talentflow.com/api/docs/uuid \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Document retrieved successfully",
  "data": {
    "id": "uuid",
    "originalName": "resume.pdf",
    "fileName": "uuid.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "r2Key": "documents/userId/resume/uuid.pdf",
    "r2Url": "https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf",
    "type": "resume",
    "status": "ready",
    "description": "Мій резюме для пошуку роботи",
    "tags": ["frontend", "react", "typescript"],
    "isActive": true,
    "isPublic": false,
    "downloadCount": 5,
    "viewCount": 12,
    "user": {
      "id": "user-uuid",
      "firstName": "Іван",
      "lastName": "Петренко",
      "email": "ivan@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "processedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Оновлення документа

**PUT** `/:id`

Оновлює інформацію про документ.

**Заголовки:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Параметри шляху:**
- `id` (string, required) - UUID документа

**Тіло запиту:**
```json
{
  "description": "Оновлений опис резюме",
  "tags": ["frontend", "react", "typescript", "nextjs"],
  "isPublic": true,
  "type": "resume"
}
```

**Приклад запиту:**
```bash
curl -X PUT \
  https://api.talentflow.com/api/docs/uuid \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Оновлений опис резюме",
    "tags": ["frontend", "react", "typescript", "nextjs"],
    "isPublic": true,
    "type": "resume"
  }'
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
    "id": "uuid",
    "originalName": "resume.pdf",
    "fileName": "uuid.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "type": "resume",
    "status": "ready",
    "description": "Оновлений опис резюме",
    "tags": ["frontend", "react", "typescript", "nextjs"],
    "isActive": true,
    "isPublic": true,
    "downloadCount": 5,
    "viewCount": 12,
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "processedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Видалення документа

**DELETE** `/:id`

Видаляє документ (soft delete).

**Заголовки:**
```
Authorization: Bearer <token>
```

**Параметри шляху:**
- `id` (string, required) - UUID документа

**Приклад запиту:**
```bash
curl -X DELETE \
  https://api.talentflow.com/api/docs/uuid \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### 5. Пошук документів

**GET** `/search`

Шукає документи за різними критеріями.

**Заголовки:**
```
Authorization: Bearer <token>
```

**Параметри запиту:**
- `search` (string, optional) - Пошуковий запит
- `type` (string, optional) - Тип документа
- `status` (string, optional) - Статус документа
- `isPublic` (boolean, optional) - Чи є документ публічним
- `tags` (array, optional) - Теги для фільтрації
- `page` (number, optional) - Номер сторінки (за замовчуванням: 1)
- `limit` (number, optional) - Кількість елементів на сторінці (за замовчуванням: 20)
- `sortBy` (string, optional) - Поле для сортування (за замовчуванням: createdAt)
- `sortOrder` (string, optional) - Порядок сортування (ASC/DESC, за замовчуванням: DESC)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/docs/search?search=resume&type=resume&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Documents search completed successfully",
  "data": {
    "documents": [
      {
        "id": "uuid1",
        "originalName": "resume.pdf",
        "fileName": "uuid1.pdf",
        "mimeType": "application/pdf",
        "size": 1024000,
        "type": "resume",
        "status": "ready",
        "description": "Мій резюме",
        "tags": ["frontend", "react"],
        "isActive": true,
        "isPublic": true,
        "downloadCount": 5,
        "viewCount": 12,
        "user": {
          "id": "user-uuid",
          "firstName": "Іван",
          "lastName": "Петренко"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 6. Отримання документів користувача

**GET** `/my-documents`

Отримує всі документи поточного користувача.

**Заголовки:**
```
Authorization: Bearer <token>
```

**Параметри запиту:**
- `page` (number, optional) - Номер сторінки (за замовчуванням: 1)
- `limit` (number, optional) - Кількість елементів на сторінці (за замовчуванням: 20)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/docs/my-documents?page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "User documents retrieved successfully",
  "data": {
    "documents": [
      {
        "id": "uuid1",
        "originalName": "resume.pdf",
        "fileName": "uuid1.pdf",
        "mimeType": "application/pdf",
        "size": 1024000,
        "type": "resume",
        "status": "ready",
        "description": "Мій резюме",
        "tags": ["frontend", "react"],
        "isActive": true,
        "isPublic": false,
        "downloadCount": 0,
        "viewCount": 0,
        "userId": "user-uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 7. Статистика документів

**GET** `/stats`

Отримує статистику документів.

**Заголовки:**
```
Authorization: Bearer <token>
```

**Параметри запиту:**
- `userId` (string, optional) - ID користувача для фільтрації
- `type` (string, optional) - Тип документа для фільтрації
- `dateFrom` (string, optional) - Початкова дата (ISO 8601)
- `dateTo` (string, optional) - Кінцева дата (ISO 8601)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/docs/stats?userId=user-uuid&dateFrom=2024-01-01&dateTo=2024-12-31" \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Document statistics retrieved successfully",
  "data": {
    "totalDocuments": 15,
    "documentsByType": {
      "resume": 5,
      "cover_letter": 3,
      "portfolio": 2,
      "certificate": 4,
      "other": 1
    },
    "documentsByStatus": {
      "uploading": 0,
      "processing": 0,
      "ready": 15,
      "error": 0,
      "deleted": 0
    },
    "totalSize": 52428800,
    "averageSize": 3495253,
    "recentUploads": 3
  }
}
```

### 8. Отримання URL для завантаження

**GET** `/:id/download`

Генерує підписаний URL для завантаження документа.

**Заголовки:**
```
Authorization: Bearer <token>
```

**Параметри шляху:**
- `id` (string, required) - UUID документа

**Приклад запиту:**
```bash
curl -X GET \
  https://api.talentflow.com/api/docs/uuid/download \
  -H "Authorization: Bearer <token>"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Download URL generated successfully",
  "data": {
    "downloadUrl": "https://pub-87e7494e4245f7459697938e56014557.r2.dev/documents/userId/resume/uuid.pdf?X-Amz-Algorithm=..."
  }
}
```

### 9. Оновлення метаданих документа

**PUT** `/:id/metadata`

Оновлює метадані документа.

**Заголовки:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Параметри шляху:**
- `id` (string, required) - UUID документа

**Тіло запиту:**
```json
{
  "title": "Senior Frontend Developer Resume",
  "author": "Іван Петренко",
  "subject": "Frontend Development",
  "keywords": "React, TypeScript, Next.js, Frontend",
  "creator": "Microsoft Word",
  "language": "uk",
  "pageCount": 2
}
```

**Приклад запиту:**
```bash
curl -X PUT \
  https://api.talentflow.com/api/docs/uuid/metadata \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Frontend Developer Resume",
    "author": "Іван Петренко",
    "subject": "Frontend Development",
    "keywords": "React, TypeScript, Next.js, Frontend",
    "creator": "Microsoft Word",
    "language": "uk",
    "pageCount": 2
  }'
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Document metadata updated successfully",
  "data": {
    "id": "uuid",
    "originalName": "resume.pdf",
    "fileName": "uuid.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "type": "resume",
    "status": "ready",
    "description": "Мій резюме",
    "tags": ["frontend", "react"],
    "isActive": true,
    "isPublic": false,
    "metadata": {
      "title": "Senior Frontend Developer Resume",
      "author": "Іван Петренко",
      "subject": "Frontend Development",
      "keywords": "React, TypeScript, Next.js, Frontend",
      "creator": "Microsoft Word",
      "language": "uk",
      "pageCount": 2
    },
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 10. Отримання публічних документів

**GET** `/public`

Отримує публічні документи (не потребує авторизації).

**Параметри запиту:**
- `page` (number, optional) - Номер сторінки (за замовчуванням: 1)
- `limit` (number, optional) - Кількість елементів на сторінці (за замовчуванням: 20)

**Приклад запиту:**
```bash
curl -X GET \
  "https://api.talentflow.com/api/docs/public?page=1&limit=20"
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Public documents retrieved successfully",
  "data": {
    "documents": [
      {
        "id": "uuid1",
        "originalName": "portfolio.pdf",
        "fileName": "uuid1.pdf",
        "mimeType": "application/pdf",
        "size": 2048000,
        "type": "portfolio",
        "status": "ready",
        "description": "Портфоліо робіт",
        "tags": ["design", "ui", "ux"],
        "isActive": true,
        "isPublic": true,
        "downloadCount": 25,
        "viewCount": 150,
        "user": {
          "id": "user-uuid",
          "firstName": "Марія",
          "lastName": "Іваненко"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## Коди помилок

| Код | Опис |
|-----|------|
| 400 | Bad Request - Невірний запит |
| 401 | Unauthorized - Необхідна авторизація |
| 403 | Forbidden - Недостатньо прав доступу |
| 404 | Not Found - Документ не знайдено |
| 413 | Payload Too Large - Файл занадто великий |
| 415 | Unsupported Media Type - Непідтримуваний тип файлу |
| 500 | Internal Server Error - Внутрішня помилка сервера |

## Обмеження

- **Максимальний розмір файлу**: 100MB
- **Підтримувані формати**: PDF, DOC, DOCX, TXT, RTF, JPEG, PNG, GIF, XLS, XLSX, PPT, PPTX
- **Пагінація**: Максимум 100 елементів на сторінку
- **Підписаний URL**: Дійсний 1 годину

## Безпека

- Всі файли зберігаються в Cloudflare R2 з унікальними ключами
- Доступ до файлів контролюється через підписані URL
- Soft delete забезпечує відновлення видалених файлів
- Валідація типів файлів запобігає завантаженню небезпечних файлів


