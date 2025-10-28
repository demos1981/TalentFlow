# 🔗 Гід по з'єднанню TalentFlow

## 📋 Компоненти системи

### 1. **Frontend (Netlify)**
- **URL:** `https://your-site.netlify.app`
- **Технології:** React + TypeScript + Vite
- **API:** З'єднано з Railway backend

### 2. **Backend (Railway)**
- **URL:** `https://talentflow-backend-production.up.railway.app`
- **Технології:** Node.js + Express + TypeScript + TypeORM
- **Database:** PostgreSQL на Railway

### 3. **File Storage (Cloudflare R2)**
- **Bucket:** `talentflow-files`
- **Endpoint:** `https://your-account-id.r2.cloudflarestorage.com`
- **Public URL:** `https://pub-your-account-id.r2.dev`

## 🔧 Налаштування з'єднань

### Frontend ↔ Backend

✅ **Вже налаштовано!**

```typescript
// web/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

**Environment Variables (Netlify):**
```
VITE_API_URL = https://talentflow-backend-production.up.railway.app/api
```

### Backend ↔ R2 Storage

✅ **Вже налаштовано!**

**Environment Variables (Railway):**
```
R2_ACCESS_KEY_ID = ваш_r2_access_key_id
R2_SECRET_ACCESS_KEY = ваш_r2_secret_access_key
R2_BUCKET_NAME = talentflow-files
R2_ENDPOINT_URL = https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL = https://pub-your-account-id.r2.dev
```

## 🚀 API Endpoints

### Файлові операції

```
POST /files/upload          - Завантаження файлу
POST /files/upload-url      - Отримання pre-signed URL
GET  /files/download-url/:key - Отримання download URL
DELETE /files/:key          - Видалення файлу
GET  /files/list            - Список файлів
```

### Приклад використання

```typescript
import FileService from '../services/fileService';

// Завантаження файлу
const result = await FileService.uploadFile(file, 'resumes');

// Отримання pre-signed URL
const { uploadUrl, key } = await FileService.getUploadUrl(
  'resume.pdf', 
  'application/pdf', 
  'resumes'
);
```

## 📱 Фронтенд компоненти

### FileUpload Component

```typescript
import React, { useState } from 'react';
import FileService from '../services/fileService';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;

    try {
      const result = await FileService.uploadFileWithProgress(
        file, 
        'resumes', 
        (progress) => setProgress(progress)
      );
      
      console.log('Файл завантажено:', result);
    } catch (error) {
      console.error('Помилка завантаження:', error);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button onClick={handleUpload}>Завантажити</button>
      {progress > 0 && <progress value={progress} max="100" />}
    </div>
  );
};
```

## 🔒 Безпека

### CORS налаштування

**Backend (Railway):**
```typescript
app.use(cors({
  origin: [
    'https://your-site.netlify.app',
    'http://localhost:3001'
  ],
  credentials: true
}));
```

### Аутентифікація

Всі файлові операції потребують JWT токен:
```typescript
// Автоматично додається через axios interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🧪 Тестування

### 1. **Тест завантаження файлу**

```bash
# Backend health check
curl https://talentflow-backend-production.up.railway.app/health

# Тест завантаження (з токеном)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "folder=resumes" \
  https://talentflow-backend-production.up.railway.app/files/upload
```

### 2. **Тест R2 bucket**

```bash
# Перевірка доступу до R2
aws s3 ls s3://talentflow-files \
  --endpoint-url https://your-account-id.r2.cloudflarestorage.com \
  --profile r2
```

## 🔍 Troubleshooting

### Помилки CORS
- Перевірте `CORS_ORIGIN` в Railway
- Додайте ваш Netlify domain

### Помилки R2
- Перевірте API ключі
- Перевірте bucket permissions
- Перевірте endpoint URL

### Помилки завантаження
- Перевірте розмір файлу (макс. 10MB)
- Перевірте тип файлу
- Перевірте JWT токен

## 📊 Моніторинг

### Railway Metrics
- CPU, Memory, Network
- Response times
- Error rates

### Cloudflare R2 Analytics
- Storage usage
- Request counts
- Bandwidth

### Netlify Analytics
- Page views
- Build times
- Deploy status

## 🚀 Scaling

### Автоматичне масштабування
- **Railway:** Автоматично масштабується
- **R2:** Необмежена пропускна здатність
- **Netlify:** CDN по всьому світу

### Рекомендації
- Використовуйте pre-signed URLs для великих файлів
- Кешуйте файли на фронтенді
- Використовуйте lazy loading для файлів

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте Railway logs
2. Перевірте Netlify build logs
3. Перевірте R2 bucket permissions
4. Перевірте browser console
5. Перевірте Network tab в DevTools
