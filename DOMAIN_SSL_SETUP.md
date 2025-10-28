# 🌐 Налаштування домену та SSL сертифікатів

## **Крок 1: Купівля домену**

### 1.1 Вибір домену
- **Основний домен**: `search-talant.net`
- **Альтернативи**: `talentflow.pro`, `talentmatch.net`
- **Регіональні**: `search-talant.ua`, `search-talant.eu`

### 1.2 Реєстратори доменів
- **Namecheap** ($12-15/рік) - найкраща ціна
- **GoDaddy** ($15-18/рік) - популярний
- **Google Domains** ($12/рік) - надійний
- **Cloudflare Registrar** ($8-12/рік) - найдешевший

### 1.3 Процес купівлі
```
1. Перевірити доступність домену
2. Вибрати термін реєстрації (1-10 років)
3. Додати privacy protection
4. Налаштувати auto-renewal
5. Оплатити та підтвердити email
```

## **Крок 2: Налаштування DNS**

### 2.1 Основні DNS записи
```dns
# A Record - основний домен
Type: A
Name: @
Value: [Railway IP або CNAME]
TTL: 300

# CNAME - www піддомен
Type: CNAME
Name: www
Value: [Railway URL]
TTL: 300

# CNAME - API піддомен
Type: CNAME
Name: api
Value: [Backend Railway URL]
TTL: 300

# CNAME - файли
Type: CNAME
Name: files
Value: [Cloudflare R2 URL]
TTL: 300
```

### 2.2 Додаткові DNS записи
```dns
# MX Record - пошта
Type: MX
Name: @
Value: mail.search-talant.net
Priority: 10
TTL: 3600

# TXT Record - SPF для пошти
Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"
TTL: 3600

# TXT Record - DKIM (якщо використовуєте пошту)
Type: TXT
Name: default._domainkey
Value: "v=DKIM1; k=rsa; p=[ваш_публічний_ключ]"
TTL: 3600

# TXT Record - DMARC
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@search-talant.net"
TTL: 3600
```

### 2.3 Subdomains для масштабування
```dns
# Admin піддомен
Type: CNAME
Name: admin
Value: [Admin Railway URL]
TTL: 300

# Analytics піддомен
Type: CNAME
Name: analytics
Value: [Analytics Railway URL]
TTL: 300

# CDN піддомен
Type: CNAME
Name: cdn
Value: [Cloudflare CDN URL]
TTL: 300
```

## **Крок 3: Налаштування Cloudflare**

### 3.1 Додавання домену до Cloudflare
- Dashboard → "Add a Site"
- Ввести: `search-talant.net`
- Вибір плану: **Free** (достатньо для початку)

### 3.2 Налаштування DNS через Cloudflare
```dns
# Автоматичне налаштування
Type: A
Name: @
Value: 192.0.2.1 (Cloudflare proxy)
Proxy: ✅ Proxied

Type: CNAME
Name: www
Value: search-talant.net
Proxy: ✅ Proxied
```

### 3.3 SSL/TLS налаштування
```
SSL/TLS Mode: Full (strict)
Edge Certificates: Always Use HTTPS
HSTS: Enabled
Minimum TLS Version: 1.2
Opportunistic Encryption: Enabled
TLS 1.3: Enabled
```

### 3.4 Page Rules для оптимізації
```
# Кешування статичних файлів
URL: *.search-talant.net/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 4 hours
  - Browser Cache TTL: 1 hour

# API кешування
URL: api.search-talant.net/*
Settings:
  - Cache Level: Standard
  - Edge Cache TTL: 1 minute
  - Browser Cache TTL: 1 minute
```

## **Крок 4: SSL сертифікати**

### 4.1 Cloudflare SSL (автоматично)
- **Universal SSL** - безкоштовно
- **Edge Certificates** - автоматично генеруються
- **Origin Certificates** - для backend

### 4.2 Railway SSL (автоматично)
- Railway автоматично генерує SSL
- **Let's Encrypt** сертифікати
- **Auto-renewal** кожні 90 днів

### 4.3 Origin Certificate для Backend
```bash
# Генерація Origin Certificate
# Cloudflare Dashboard → SSL/TLS → Origin Server
# Create Certificate → 15 years validity

# Зберегти в Railway environment variables:
ORIGIN_CERT="-----BEGIN CERTIFICATE-----..."
ORIGIN_KEY="-----BEGIN PRIVATE KEY-----..."
```

## **Крок 5: Налаштування Railway з доменом**

### 5.1 Custom Domain в Railway
```bash
# Backend Service
railway domain add talentflow-backend search-talant.net
railway domain add talentflow-backend api.search-talant.net

# Frontend Service  
railway domain add talentflow-frontend search-talant.net
railway domain add talentflow-frontend www.search-talant.net
```

### 5.2 Environment Variables
```env
# Backend
CORS_ORIGIN=https://search-talant.net,https://www.search-talant.net
FRONTEND_URL=https://search-talant.net

# Frontend
VITE_API_URL=https://api.search-talant.net
VITE_APP_URL=https://search-talant.net
```

## **Крок 6: Налаштування CORS**

### 6.1 Backend CORS
```typescript
// src/config/cors.ts
import cors from 'cors';

export const corsOptions = {
  origin: [
    'https://search-talant.net',
    'https://www.search-talant.net',
    'https://api.search-talant.net',
    'http://localhost:3001', // для development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 години
};

export const corsMiddleware = cors(corsOptions);
```

### 6.2 Cloudflare R2 CORS
```json
{
  "AllowedOrigins": [
    "https://search-talant.net",
    "https://www.search-talant.net",
    "https://api.search-talant.net"
  ],
  "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag", "Content-Length"],
  "MaxAgeSeconds": 86400
}
```

## **Крок 7: Налаштування Email**

### 7.1 Google Workspace (рекомендовано)
```
Domain: search-talant.net
Plan: Business Starter ($6/користувача/місяць)
Features:
  - Custom email: admin@search-talant.net
  - Google Drive: 30GB
  - Google Meet: без обмежень
  - Admin controls
```

### 7.2 Zoho Mail (альтернатива)
```
Domain: search-talant.net
Plan: Professional ($1/користувача/місяць)
Features:
  - Custom email
  - 5GB storage
  - Mobile apps
  - Web interface
```

### 7.3 DNS налаштування для пошти
```dns
# Google Workspace
Type: MX
Name: @
Value: aspmx.l.google.com
Priority: 1

Type: MX
Name: @
Value: alt1.aspmx.l.google.com
Priority: 5

Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"

Type: TXT
Name: google._domainkey
Value: "v=DKIM1; k=rsa; p=[google_public_key]"
```

## **Крок 8: Налаштування CDN**

### 8.1 Cloudflare CDN
```
Cache Level: Standard
Edge Cache TTL: 4 hours
Browser Cache TTL: 1 hour
Always Online: Enabled
Auto Minify: CSS, JavaScript, HTML
Brotli: Enabled
```

### 8.2 Image Optimization
```
Polish: Lossless
WebP: Enabled
AVIF: Enabled
Lazy Loading: Enabled
```

### 8.3 Security Features
```
WAF: Enabled
Rate Limiting: Enabled
Bot Management: Enabled
DDoS Protection: Enabled
```

## **Крок 9: Monitoring та Analytics**

### 9.1 Cloudflare Analytics
```
Traffic Analytics:
  - Page views
  - Unique visitors
  - Bandwidth usage
  - Cache hit ratio
  - Geographic distribution
```

### 9.2 Google Analytics 4
```html
<!-- В index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 9.3 Uptime Monitoring
```
Services:
  - Frontend: https://search-talant.net
  - Backend: https://api.search-talant.net
  - Database: Railway health check
  - File Storage: Cloudflare R2 status
```

## **Крок 10: SEO та Performance**

### 10.1 Meta Tags
```html
<!-- В index.html -->
<meta name="description" content="TalentFlow - платформа для пошуку талантів та роботи">
<meta name="keywords" content="робота, вакансії, таланти, HR, рекрутинг">
<meta name="author" content="TalentFlow">
<meta name="robots" content="index, follow">
<meta property="og:title" content="TalentFlow - Пошук талантів">
<meta property="og:description" content="Знайдіть найкращих кандидатів або роботу своєї мрії">
<meta property="og:image" content="https://search-talant.net/og-image.jpg">
<meta property="og:url" content="https://search-talant.net">
```

### 10.2 Sitemap
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://search-talant.net/</loc>
    <lastmod>2025-08-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://search-talant.net/jobs</loc>
    <lastmod>2025-08-22</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 10.3 Robots.txt
```txt
# public/robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://search-talant.net/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
```

## **Очікувані результати:**
- ✅ **Домен** доступний по всьому світу
- ✅ **SSL сертифікати** автоматично оновлюються
- ✅ **CDN** прискорює завантаження
- ✅ **SEO оптимізація** для пошукових систем
- ✅ **Email** з професійним доменом
- ✅ **Monitoring** та analytics
- ✅ **Security** та DDoS захист

---

**Наступний крок:** Тестування та запуск production
