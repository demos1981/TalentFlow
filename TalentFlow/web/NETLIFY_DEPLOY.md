# 🚀 Деплой TalentFlow на Netlify

## 📋 Передумови

- ✅ Backend деплой на Railway
- ✅ Cloudflare R2 bucket створено
- ✅ GitHub репозиторій налаштовано

## 🔧 Налаштування Netlify

### 1. Створення акаунту

1. Перейдіть на [netlify.com](https://netlify.com)
2. Натисніть **"Sign up"**
3. Виберіть **"Sign up with GitHub"**
4. Авторизуйтесь через GitHub

### 2. Створення сайту

1. Натисніть **"New site from Git"**
2. Виберіть **GitHub**
3. Виберіть репозиторій `MykhailoIlyashDev/TalentFlow`
4. Налаштування:
   - **Base directory:** `web`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### 3. Environment Variables

В **Site settings** → **Environment variables** додайте:

```
VITE_API_URL = https://talentflow-backend-production.up.railway.app/api
VITE_R2_BUCKET_NAME = talentflow-files
VITE_R2_ENDPOINT_URL = https://pub-87e7494e4245f7459697938e56014557.r2.dev
VITE_APP_NAME = TalentFlow
VITE_APP_VERSION = 1.0.0
```

### 4. Build Settings

- **Node.js version:** `20`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 5. Domain Settings

1. Перейдіть в **Domain settings**
2. Натисніть **"Change site name"**
3. Введіть: `talentflow-app` (або інше вільне ім'я)
4. Ваш URL буде: `https://talentflow-app.netlify.app`

## 🚀 Автоматичний деплой

### GitHub Integration

1. Netlify автоматично підключить GitHub
2. При кожному push в `main` гілку буде автоматичний деплой
3. Pull requests створюють preview деплої

### Build Hooks

Якщо потрібно ручний деплой:
1. **Site settings** → **Build & deploy** → **Build hooks**
2. Створіть build hook
3. Використовуйте для ручного деплою

## 📱 Тестування

Після деплою перевірте:

1. **Frontend URL:** `https://your-site-name.netlify.app`
2. **Логін з тестовими обліковими записами:**
   - Адмін: `admin@talentmatch.pro` / `admin123`
   - Роботодавець: `employer@techcorp.ua` / `employer123`
   - Кандидат: `candidate@example.com` / `candidate123`

## 🔍 Troubleshooting

### Build помилки
- Перевірте Node.js версію (має бути 20+)
- Перевірте environment variables
- Перевірте build logs в Netlify

### CORS помилки
- Перевірте `VITE_API_URL` (має закінчуватися на `/api`)
- Перевірте Railway backend CORS налаштування

### Routing помилки
- Перевірте файл `_redirects` або `netlify.toml`
- Переконайтеся, що SPA routing налаштовано

## 💰 Вартість

**Netlify Free Plan:**
- ✅ Безкоштовний
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Form submissions
- ✅ HTTPS/SSL
- ✅ Custom domains
- ✅ Continuous deployment

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте build logs в Netlify
2. Перевірте Railway backend logs
3. Перевірте browser console на помилки
4. Netlify має відмінну документацію та підтримку
