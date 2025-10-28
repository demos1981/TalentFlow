# File API Documentation

Уніфікований API для роботи з усіма типами файлів: документи, зображення, відео, аудіо, архіви та інші файли.

## Огляд

File API забезпечує повну функціональність для:
- Завантаження файлів через multer або pre-signed URLs
- Зберігання файлів у Cloudflare R2 Storage
- Управління метаданими файлів
- Пошук та фільтрацію файлів
- Статистику використання
- Публічні та приватні файли

## Підтримувані типи файлів

### Документи
- PDF, DOC, DOCX, TXT, RTF

### Зображення
- JPG, JPEG, PNG, GIF, WEBP, SVG

### Відео
- MP4, AVI, MOV, WMV

### Аудіо
- MP3, WAV, AAC

### Архіви
- ZIP, RAR, TAR, GZ

## Категорії файлів

- `resume` - Резюме
- `portfolio` - Портфоліо
- `contract` - Контракти
- `certificate` - Сертифікати
- `profile_photo` - Фото профілю
- `company_logo` - Логотип компанії
- `project_image` - Зображення проектів
- `temp` - Тимчасові файли
- `system` - Системні файли
- `backup` - Резервні копії
- `other` - Інші файли

## Статуси файлів

- `uploading` - Завантажується
- `processing` - Обробляється
- `ready` - Готовий
- `error` - Помилка
- `deleted` - Видалений

## Endpoints

### 1. Завантаження файлу

**POST** `/api/files/upload`

Завантаження файлу через multer.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**
```
file: <file-buffer>
fileName: string
mimeType: string
fileSize: number
type: FileType
category: FileCategory
description?: string
tags?: string[]
isPublic?: boolean
folder?: string
metadata?: object
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "file-uuid",
    "fileName": "resume.pdf",
    "originalName": "resume.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "r2Key": "resume/documents/2024-01-15/file-uuid.pdf",
    "r2Url": "https://r2.example.com/resume/documents/2024-01-15/file-uuid.pdf",
    "type": "pdf",
    "category": "resume",
    "status": "ready",
    "description": "Моє резюме",
    "tags": ["resume", "pdf", "job"],
    "isPublic": false,
    "folder": "documents",
    "downloadCount": 0,
    "isActive": true,
    "metadata": {
      "version": "1.0",
      "language": "uk"
    },
    "uploadedBy": {
      "id": "user-uuid",
      "firstName": "Іван",
      "lastName": "Петренко"
    },
    "uploadDate": "2024-01-15T10:00:00.000Z",
    "lastModified": "2024-01-15T10:00:00.000Z"
  }
}
```

### 2. Отримання pre-signed URL

**POST** `/api/files/upload-url`

Отримання pre-signed URL для завантаження файлу.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "fileName": "portfolio.pdf",
  "mimeType": "application/pdf",
  "fileSize": 2048000,
  "type": "pdf",
  "category": "portfolio",
  "description": "Мій портфоліо",
  "tags": ["portfolio", "pdf", "work"],
  "isPublic": true,
  "folder": "portfolio"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Upload URL generated successfully",
  "data": {
    "uploadUrl": "https://r2.example.com/upload-url?signature=...",
    "fileId": "file-uuid",
    "key": "portfolio/portfolio/2024-01-15/file-uuid.pdf",
    "expiresIn": 3600
  }
}
```

### 3. Підтвердження завантаження

**PUT** `/api/files/:id/confirm`

Підтвердження успішного завантаження файлу.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File upload confirmed successfully",
  "data": {
    "id": "file-uuid",
    "status": "ready",
    "lastModified": "2024-01-15T10:05:00.000Z"
  }
}
```

### 4. Отримання всіх файлів

**GET** `/api/files/my-files`

Отримання всіх файлів користувача з фільтрами.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` - Пошук по назві, опису
- `type` - Фільтр по типу файлу
- `category` - Фільтр по категорії
- `status` - Фільтр по статусу
- `folder` - Фільтр по папці
- `isPublic` - Фільтр по публічності
- `tags` - Фільтр по тегах
- `page` - Номер сторінки (за замовчуванням: 1)
- `limit` - Кількість на сторінці (за замовчуванням: 20)
- `sortBy` - Поле для сортування (за замовчуванням: uploadDate)
- `sortOrder` - Порядок сортування (ASC/DESC, за замовчуванням: DESC)

**Response:**
```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": {
    "files": [...],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 5. Отримання файлу за ID

**GET** `/api/files/:id`

Отримання детальної інформації про файл.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File retrieved successfully",
  "data": {
    "id": "file-uuid",
    "fileName": "resume.pdf",
    "originalName": "resume.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "r2Key": "resume/documents/2024-01-15/file-uuid.pdf",
    "r2Url": "https://r2.example.com/resume/documents/2024-01-15/file-uuid.pdf",
    "type": "pdf",
    "category": "resume",
    "status": "ready",
    "description": "Моє резюме",
    "tags": ["resume", "pdf", "job"],
    "isPublic": false,
    "folder": "documents",
    "downloadCount": 5,
    "isActive": true,
    "metadata": {
      "version": "1.0",
      "language": "uk"
    },
    "uploadedBy": {
      "id": "user-uuid",
      "firstName": "Іван",
      "lastName": "Петренко",
      "email": "ivan@example.com"
    },
    "uploadDate": "2024-01-15T10:00:00.000Z",
    "lastModified": "2024-01-15T10:00:00.000Z"
  }
}
```

### 6. Оновлення метаданих файлу

**PUT** `/api/files/:id`

Оновлення метаданих файлу.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "fileName": "resume_updated.pdf",
  "description": "Оновлене резюме з новими навичками",
  "tags": ["resume", "pdf", "job", "updated"],
  "isPublic": true,
  "metadata": {
    "version": "2.0",
    "language": "uk",
    "lastUpdated": "2024-01-15"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    "id": "file-uuid",
    "fileName": "resume_updated.pdf",
    "description": "Оновлене резюме з новими навичками",
    "tags": ["resume", "pdf", "job", "updated"],
    "isPublic": true,
    "metadata": {
      "version": "2.0",
      "language": "uk",
      "lastUpdated": "2024-01-15"
    },
    "lastModified": "2024-01-15T12:00:00.000Z"
  }
}
```

### 7. Видалення файлу

**DELETE** `/api/files/:id`

Видалення файлу (soft delete).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 8. Отримання URL для завантаження

**GET** `/api/files/:id/download`

Отримання pre-signed URL для завантаження файлу.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Download URL generated successfully",
  "data": {
    "downloadUrl": "https://r2.example.com/download-url?signature=...",
    "expiresIn": 3600
  }
}
```

### 9. Отримання публічних файлів

**GET** `/api/files/public`

Отримання публічних файлів (не потребує авторизації).

**Query Parameters:** (аналогічно до `/my-files`)

**Response:**
```json
{
  "success": true,
  "message": "Public files retrieved successfully",
  "data": {
    "files": [...],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 10. Пошук файлів

**GET** `/api/files/search`

Пошук файлів по тексту.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` - Пошуковий запит (обов'язковий)
- `type` - Фільтр по типу файлу
- `category` - Фільтр по категорії
- `status` - Фільтр по статусу

**Response:**
```json
{
  "success": true,
  "message": "Files search completed successfully",
  "data": [...]
}
```

### 11. Статистика файлів

**GET** `/api/files/stats`

Отримання статистики файлів.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `userId` - ID користувача (опціонально)
- `type` - Фільтр по типу файлу
- `category` - Фільтр по категорії
- `status` - Фільтр по статусу

**Response:**
```json
{
  "success": true,
  "message": "File statistics retrieved successfully",
  "data": {
    "totalFiles": 15,
    "totalSize": 15728640,
    "filesByType": [
      { "type": "pdf", "count": 8, "size": 8388608 },
      { "type": "jpg", "count": 5, "size": 5242880 },
      { "type": "png", "count": 2, "size": 2097152 }
    ],
    "filesByCategory": [
      { "category": "resume", "count": 5, "size": 5242880 },
      { "category": "portfolio", "count": 3, "size": 3145728 },
      { "category": "profile_photo", "count": 4, "size": 2097152 },
      { "category": "other", "count": 3, "size": 5242880 }
    ],
    "filesByStatus": [
      { "status": "ready", "count": 14, "size": 15728640 },
      { "status": "uploading", "count": 1, "size": 0 }
    ],
    "recentUploads": 3
  }
}
```

## Помилки

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "File not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

## Обмеження

- Максимальний розмір файлу: 50MB
- Підтримувані типи файлів: PDF, DOC, DOCX, TXT, RTF, JPG, JPEG, PNG, GIF, WEBP, SVG, MP4, AVI, MOV, WMV, MP3, WAV, AAC, ZIP, RAR, TAR, GZ
- Pre-signed URLs дійсні 1 годину
- Пагінація: максимум 100 файлів на сторінку


