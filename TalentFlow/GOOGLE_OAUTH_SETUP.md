# 🔑 Google OAuth Setup для TalentFlow

## 📋 Передумови

1. Google Cloud Console аккаунт
2. Налаштований проект в Google Cloud
3. Доступ до TalentFlow backend

---

## 🚀 Крок 1: Налаштування Google Cloud Project

### 1.1 Створення проекту
1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проект або виберіть існуючий
3. Запишіть **Project ID**

### 1.2 Включення Google+ API
1. В меню виберіть **APIs & Services** → **Library**
2. Знайдіть та включіть **Google+ API**
3. Також включіть **Google Identity API**

### 1.3 Створення OAuth 2.0 credentials
1. Перейдіть в **APIs & Services** → **Credentials**
2. Натисніть **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Виберіть тип **Web application**

### 1.4 Налаштування OAuth consent screen
1. Виберіть **External** user type
2. Заповніть обов'язкові поля:
   - **App name**: TalentFlow
   - **User support email**: ваш email
   - **Developer contact information**: ваш email
3. Додайте scope: `email`, `profile`, `openid`

---

## 🔧 Крок 2: Налаштування OAuth Client

### 2.1 Створення OAuth Client ID
1. **Name**: TalentFlow OAuth Client
2. **Authorized JavaScript origins**:
   ```
   http://localhost:3001
   https://golden-malasada-be6126.netlify.app
   ```
3. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/google/callback
   https://talentflow-backend-production.up.railway.app/api/auth/google/callback
   ```

### 2.2 Отримання credentials
Після створення ви отримаєте:
- **Client ID** (наприклад: `123456789-abcdef.apps.googleusercontent.com`)
- **Client Secret** (наприклад: `GOCSPX-abcdefghijklmnop`)

---

## ⚙️ Крок 3: Налаштування Environment Variables

### 3.1 Backend (.env файл)
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 3.2 Frontend (.env файл)
```bash
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🗄️ Крок 4: База даних

### 4.1 Запуск міграції
```bash
cd backend
npm run typeorm migration:run
```

### 4.2 Перевірка структури таблиці
```sql
-- Перевірте, що поле googleId додано
SELECT column_name, data_type, is_nullable, is_unique 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'googleId';
```

---

## 🧪 Крок 5: Тестування

### 5.1 Backend тест
```bash
# Перевірте, що сервер запускається без помилок
npm run dev

# В логах має бути:
# 🔑 Configuring Google OAuth...
# ✅ Google OAuth configured successfully
```

### 5.2 Frontend тест
1. Відкрийте AuthPage
2. Натисніть кнопку "Google"
3. Має відкритися Google OAuth сторінка
4. Після авторизації має перенаправити на callback

---

## 🔍 Крок 6: Troubleshooting

### 6.1 Поширені помилки

#### "Invalid redirect_uri"
- Перевірте, що redirect URI точно співпадає
- Включаючи протокол (http/https) та порт

#### "Client ID not found"
- Перевірте GOOGLE_CLIENT_ID в .env файлі
- Перезапустіть сервер після зміни .env

#### "OAuth consent screen not configured"
- Перевірте, що OAuth consent screen налаштований
- Додайте всі необхідні scope

### 6.2 Логи для діагностики
```bash
# Backend логи
🔑 Configuring Google OAuth...
✅ Google OAuth configured successfully

# Або помилки
❌ Failed to configure Google OAuth: [error details]
```

---

## 📱 Крок 7: Production налаштування

### 7.1 Оновлення redirect URIs
В Google Cloud Console додайте production URL:
```
https://talentflow-backend-production.up.railway.app/api/auth/google/callback
```

### 7.2 Environment variables
Переконайтеся, що в production встановлені:
```bash
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
NODE_ENV=production
```

---

## ✅ Перевірка роботи

### Тестовий сценарій:
1. **Реєстрація нового користувача**:
   - Натисніть "Google" на AuthPage
   - Авторизуйтесь через Google
   - Перевірте, що створено новий запис в БД

2. **Вхід існуючого користувача**:
   - Авторизуйтесь через Google з існуючим email
   - Перевірте, що оновлено googleId в БД

3. **Перевірка JWT токена**:
   - Після успішної авторизації має бути перенаправлення з токеном
   - Токен має містити userId, email, role

---

## 🔐 Безпека

### Рекомендації:
1. **Client Secret** - ніколи не комітьте в код
2. **HTTPS** - використовуйте тільки в production
3. **Scope** - запитуйте мінімально необхідні права
4. **Validation** - завжди валідуйте дані від Google

---

## 📚 Корисні посилання

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Passport Google Strategy](https://github.com/jaredhanson/passport-google-oauth20)

---

## 🎯 Наступні кроки

Після успішного налаштування Google OAuth:

1. **Додайте інші провайдери** (GitHub, Facebook)
2. **Реалізуйте refresh tokens**
3. **Додайте 2FA для OAuth користувачів**
4. **Налаштуйте аналітику авторизацій**

---

*Дата створення: Грудень 2024*  
*Автор: AI Developer*  
*Версія: 1.0*
