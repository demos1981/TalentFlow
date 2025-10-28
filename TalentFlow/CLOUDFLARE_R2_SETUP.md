# 🌐 Налаштування Cloudflare R2 для файлового сховища

## **Крок 1: Створення Cloudflare акаунту**

### 1.1 Реєстрація
- Зайти на [cloudflare.com](https://cloudflare.com)
- Натиснути "Sign Up"
- Ввести email та пароль
- Підтвердити email

### 1.2 Вибір плану
- **Free Plan** - для початку
- **Pro Plan** ($20/місяць) - для production з 100,000 користувачів
- **Business Plan** ($200/місяць) - для enterprise

## **Крок 2: Створення R2 Bucket**

### 2.1 Перехід до R2
- Dashboard → R2 Object Storage
- Натиснути "Create bucket"

### 2.2 Налаштування bucket
```
Bucket name: search-talant-files
Region: Auto (найближчий до користувачів)
Public bucket: No (безпека)
```

### 2.3 Додаткові налаштування
- **Object lifecycle**: Автоматичне видалення через 30 днів (для тимчасових файлів)
- **Versioning**: Увімкнути для backup
- **Encryption**: Server-side encryption

## **Крок 3: API токени та ключі**

### 3.1 Створення API токена
- R2 → Manage R2 API tokens
- Create API token
- **Permissions:**
  - Object Read
  - Object Write
  - Object Delete
  - Bucket Read

### 3.2 Збереження ключів
```env
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=search-talant-files
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://search-talant-files.your-subdomain.r2.cloudflarestorage.com
```

### 3.3 Custom Domain (опціонально)
- Створити піддомен: `files.search-talant.net`
- Налаштувати CNAME на R2 bucket
- SSL сертифікат автоматично

## **Крок 4: Налаштування CORS**

### 4.1 CORS Policy
```json
{
  "AllowedOrigins": [
    "https://search-talant.net",
    "https://www.search-talant.net",
    "http://localhost:3001"
  ],
  "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

### 4.2 Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::search-talant-files/*"
    }
  ]
}
```

## **Крок 5: Тестування завантаження**

### 5.1 Тестовий файл
```bash
# Завантаження тестового файлу
curl -X PUT \
  -H "Authorization: AWS4-HMAC-SHA256 Credential=..." \
  -H "Content-Type: text/plain" \
  --data-binary "Hello World" \
  "https://search-talant-files.your-subdomain.r2.cloudflarestorage.com/test.txt"
```

### 5.2 Перевірка доступності
```bash
# Завантаження файлу
curl "https://search-talant-files.your-subdomain.r2.cloudflarestorage.com/test.txt"
```

## **Крок 6: Інтеграція з додатком**

### 6.1 Встановлення залежностей
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 6.2 Створення FileService
```typescript
// src/services/FileService.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class FileService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.R2_ENDPOINT_URL,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.R2_BUCKET_NAME!;
  }

  // Завантаження файлу
  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    });
    
    await this.client.send(command);
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  }

  // Отримання файлу
  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    
    const response = await this.client.send(command);
    return Buffer.from(await response.Body!.transformToByteArray());
  }

  // Видалення файлу
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    
    await this.client.send(command);
  }

  // Генерація pre-signed URL для завантаження
  async generateUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    
    return await getSignedUrl(this.client, command, { expiresIn });
  }

  // Генерація pre-signed URL для завантаження
  async generateDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    
    return await getSignedUrl(this.client, command, { expiresIn });
  }
}
```

### 6.3 Middleware для завантаження файлів
```typescript
// src/middleware/upload.ts
import multer from 'multer';
import { FileService } from '../services/FileService';

const fileService = new FileService();

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Дозволяємо тільки певні типи файлів
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Непідтримуваний тип файлу'));
    }
  },
});
```

## **Крок 7: Моніторинг та аналітика**

### 7.1 Cloudflare Analytics
- **Bandwidth usage** - використання трафіку
- **Request count** - кількість запитів
- **Cache hit ratio** - ефективність кешування
- **Error rates** - частота помилок

### 7.2 Cost optimization
- **Storage usage** - використання сховища
- **Bandwidth costs** - вартість трафіку
- **Request costs** - вартість запитів

## **Крок 8: Безпека**

### 8.1 Access Control
- **API ключі** з обмеженими правами
- **IP whitelist** для production
- **Rate limiting** для API запитів

### 8.2 File validation
- **Virus scanning** (опціонально)
- **File type validation**
- **Size limits**
- **Content filtering**

## **Очікувані результати:**
- ✅ Файли завантажуються за 20-50ms
- ✅ Глобальна доступність через CDN
- ✅ Вартість: $0.015/GB/місяць
- ✅ Автоматичне масштабування
- ✅ SSL сертифікати
- ✅ Backup та версіонування

---

**Наступний крок:** Налаштування Railway для backend та database
