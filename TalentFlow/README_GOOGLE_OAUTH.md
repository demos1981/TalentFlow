# 🔑 Google OAuth Integration для TalentFlow

## 📋 Огляд

Цей документ описує, як налаштувати та використовувати Google OAuth авторизацію в TalentFlow.

---

## 🚀 Швидкий старт

### 1. Налаштування Google Cloud Console
1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проект або виберіть існуючий
3. Включіть Google+ API та Google Identity API
4. Створіть OAuth 2.0 credentials

### 2. Environment Variables
```bash
# Backend (.env)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Frontend (.env)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Запуск міграції
```bash
cd backend
./scripts/run-migration.sh
```

### 4. Тестування
```bash
cd backend
./scripts/test-google-oauth.sh
```

---

## 🏗️ Архітектура

### Backend компоненти:
- **`/config/googleStrategy.ts`** - Passport Google стратегія
- **`/routes/googleAuth.ts`** - Google OAuth роути
- **`/models/User.ts`** - Модель користувача з googleId
- **`/database/migrations/`** - Міграція для googleId

### Frontend компоненти:
- **`/pages/AuthPage.tsx`** - Кнопка Google авторизації
- **`/pages/AuthCallbackPage.tsx`** - Обробка OAuth callback
- **`/contexts/AuthContext.tsx`** - OAuth токен обробка
- **`/styles/auth-callback.css`** - Стилі для callback

---

## 🔧 Технічні деталі

### OAuth Flow:
1. **Користувач натискає "Google"** → перенаправлення на `/api/auth/google`
2. **Google OAuth сторінка** → користувач авторизується
3. **Callback** → Google перенаправляє на `/api/auth/google/callback`
4. **JWT токен** → генерується та перенаправляється на frontend
5. **Frontend callback** → обробка токена та вхід в систему

### Безпека:
- ✅ JWT токени з терміном дії 7 днів
- ✅ Валідація Google profile даних
- ✅ Унікальні googleId для кожного користувача
- ✅ Автоматичне оновлення існуючих користувачів

---

## 📱 Використання

### Для користувачів:
1. Відкрийте сторінку авторизації
2. Натисніть кнопку "Google"
3. Авторизуйтесь через Google акаунт
4. Автоматичний вхід в систему

### Для розробників:
1. **Додавання нових OAuth провайдерів**:
   ```typescript
   // Створіть нову стратегію в /config/
   // Додайте роути в /routes/
   // Оновіть AuthPage.tsx
   ```

2. **Кастомізація callback**:
   ```typescript
   // Редагуйте AuthCallbackPage.tsx
   // Додайте додаткову логіку
   ```

---

## 🧪 Тестування

### Автоматичні тести:
```bash
# Запуск всіх тестів
./scripts/test-google-oauth.sh

# Ручне тестування
curl http://localhost:3000/api/auth/google
```

### Тестові сценарії:
1. **Новий користувач** - реєстрація через Google
2. **Існуючий користувач** - вхід через Google
3. **Помилки** - невалідні токени, network errors

---

## 🔍 Troubleshooting

### Поширені проблеми:

#### "Invalid redirect_uri"
```bash
# Перевірте Google Cloud Console
# Додайте правильні redirect URIs:
http://localhost:3000/api/auth/google/callback
https://your-domain.com/api/auth/google/callback
```

#### "Client ID not found"
```bash
# Перевірте .env файл
# Перезапустіть сервер
echo $GOOGLE_CLIENT_ID
```

#### "Database error"
```bash
# Запустіть міграцію
./scripts/run-migration.sh

# Перевірте структуру таблиці
npm run typeorm query "SELECT * FROM users LIMIT 1;"
```

---

## 📚 API Endpoints

### Google OAuth:
```http
GET /api/auth/google
# Початок OAuth flow

GET /api/auth/google/callback
# OAuth callback з токеном

GET /api/auth/google/profile
# Профіль користувача (захищений)
```

### Response формати:
```json
// Успішний callback
{
  "redirect": "/auth/callback?token=JWT_TOKEN&provider=google"
}

// Помилка
{
  "redirect": "/auth/callback?error=auth_failed"
}
```

---

## 🔐 Production налаштування

### 1. HTTPS обов'язково
```bash
# В production використовуйте тільки HTTPS
NODE_ENV=production
```

### 2. Environment variables
```bash
# Production .env
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
FRONTEND_URL=https://your-domain.com
```

### 3. Google Cloud Console
- Додайте production redirect URIs
- Налаштуйте OAuth consent screen
- Додайте production domains

---

## 🎯 Наступні кроки

### Планується:
1. **GitHub OAuth** - для розробників
2. **Facebook OAuth** - для соціальних користувачів
3. **2FA для OAuth** - додаткова безпека
4. **Refresh tokens** - автоматичне оновлення

### Розширення:
1. **OAuth аналітика** - статистика входів
2. **Social login** - комбінація провайдерів
3. **Custom scopes** - додаткові права доступу

---

## 📞 Підтримка

### Корисні команди:
```bash
# Перевірка статусу
./scripts/test-google-oauth.sh

# Запуск міграції
./scripts/run-migration.sh

# Логи сервера
npm run dev

# База даних
npm run typeorm query "SELECT * FROM users;"
```

### Логи для діагностики:
```bash
# Backend логи
🔑 Configuring Google OAuth...
✅ Google OAuth configured successfully

# Або помилки
❌ Failed to configure Google OAuth: [details]
```

---

## 📚 Додаткові ресурси

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](https://github.com/jaredhanson/passport-google-oauth20)
- [JWT Token Guide](https://jwt.io/introduction)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

---

*Дата створення: Грудень 2024*  
*Автор: AI Developer*  
*Версія: 1.0*
