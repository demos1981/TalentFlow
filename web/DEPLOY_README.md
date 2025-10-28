# 🚀 Деплой TalentFlow на Cloudflare Pages

## 📋 Передумови

- ✅ Backend деплой на Railway
- ✅ Cloudflare R2 bucket створено
- ✅ GitHub репозиторій налаштовано

## 🔧 Налаштування Cloudflare Pages

### 1. Створення проекту

1. Перейдіть на [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Виберіть ваш аккаунт
3. Перейдіть до **Pages** → **Create a project**
4. Виберіть **Connect to Git**
5. Виберіть репозиторій `MykhailoIlyashDev/TalentFlow`
6. Налаштування:
   - **Project name:** `talentflow-frontend`
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `web`

### 2. Environment Variables

Додайте наступні змінні в **Settings** → **Environment variables**:

```
VITE_API_URL = https://talentflow-backend-production.up.railway.app/api
VITE_R2_BUCKET_NAME = talentflow-files
VITE_R2_ENDPOINT_URL = https://pub-87e7494e4245f7459697938e56014557.r2.dev
VITE_APP_NAME = TalentFlow
VITE_APP_VERSION = 1.0.0
```

### 3. Build Settings

- **Node.js version:** `20`
- **Build command:** `npm run build`
- **Output directory:** `dist`

## 🚀 Автоматичний деплой

### GitHub Secrets

Додайте в **Settings** → **Secrets and variables** → **Actions**:

```
CLOUDFLARE_API_TOKEN = ваш_токен_з_Cloudflare
CLOUDFLARE_ACCOUNT_ID = 87e7494e4245f7459697938e56014557
```

### Отримання токену

1. Перейдіть на [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → **Custom token**
3. Permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Zone** → **Zone** → **Edit**
4. **Account Resources** → **Include** → **All accounts**

## 📱 Тестування

Після деплою перевірте:

1. **Frontend URL:** `https://talentflow-frontend.pages.dev`
2. **Логін з тестовими обліковими записами:**
   - Адмін: `admin@talentmatch.pro` / `admin123`
   - Роботодавець: `employer@techcorp.ua` / `employer123`
   - Кандидат: `candidate@example.com` / `candidate123`

## 🔍 Troubleshooting

### Build помилки
- Перевірте Node.js версію (має бути 20+)
- Перевірте environment variables
- Перевірте build logs в Cloudflare Pages

### CORS помилки
- Перевірте `VITE_API_URL` (має закінчуватися на `/api`)
- Перевірте Railway backend CORS налаштування

### R2 помилки
- Перевірте R2 bucket permissions
- Перевірте API токен permissions

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте build logs в Cloudflare Pages
2. Перевірте Railway backend logs
3. Перевірте browser console на помилки
