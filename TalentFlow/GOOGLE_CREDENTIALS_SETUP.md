# 🔑 Отримання Google OAuth Credentials для TalentFlow

## 📋 Поетапна інструкція

### Крок 1: Створення Google Cloud Project

1. **Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)**
2. **Увійдіть в Google акаунт** (якщо ще не увійшли)
3. **Створіть новий проект**:
   - Натисніть на селектор проектів (зверху зліва)
   - Натисніть "Новий проект"
   - **Назва проекту**: `TalentFlow-OAuth`
   - **Організація**: залиште порожнім
   - Натисніть "Створити"

### Крок 2: Включення необхідних API

1. **В меню зліва виберіть "APIs & Services" → "Library"**
2. **Знайдіть та включіть наступні API**:
   - **Google+ API** (якщо доступний)
   - **Google Identity API**
   - **Google OAuth2 API**

### Крок 3: Налаштування OAuth Consent Screen

1. **В меню зліва виберіть "APIs & Services" → "OAuth consent screen"**
2. **Виберіть тип користувача**: `External`
3. **Заповніть обов'язкові поля**:
   - **App name**: `TalentFlow`
   - **User support email**: ваш email
   - **Developer contact information**: ваш email
4. **Натисніть "Save and Continue"**

### Крок 4: Додавання Scopes

1. **На сторінці "Scopes" натисніть "Add or Remove Scopes"**
2. **Додайте наступні scopes**:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. **Натисніть "Update"**
4. **Натисніть "Save and Continue"**

### Крок 5: Додавання тестових користувачів

1. **На сторінці "Test users" натисніть "Add Users"**
2. **Додайте ваш email** як тестовий користувач
3. **Натисніть "Save and Continue"**

### Крок 6: Створення OAuth 2.0 Client ID

1. **В меню зліва виберіть "APIs & Services" → "Credentials"**
2. **Натисніть "+ CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"**
3. **Заповніть форму**:
   - **Application type**: `Web application`
   - **Name**: `TalentFlow Web Client`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3001
     https://golden-malasada-be6126.netlify.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/google/callback
     https://talentflow-backend-production.up.railway.app/api/auth/google/callback
     ```
4. **Натисніть "Create"**

### Крок 7: Отримання Credentials

Після створення ви отримаєте:
- **Client ID** (наприклад: `123456789-abcdef.apps.googleusercontent.com`)
- **Client Secret** (наприклад: `GOCSPX-abcdefghijklmnop`)

**⚠️ ЗАПИШІТЬ ЦІ ДАНІ! Вони потрібні для налаштування**

---

## ⚙️ Налаштування в TalentFlow

### 1. Оновлення .env файлу

```bash
# Backend .env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Frontend .env (якщо потрібно)
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
```

### 2. Запуск міграції

```bash
cd TalentFlow/backend
./scripts/run-migration.sh
```

### 3. Тестування

```bash
cd TalentFlow/backend
./scripts/test-google-oauth.sh
```

---

## 🔍 Перевірка налаштування

### 1. Google Cloud Console
- ✅ Проект створено
- ✅ API включені
- ✅ OAuth consent screen налаштований
- ✅ OAuth 2.0 Client ID створено
- ✅ Redirect URIs додано

### 2. TalentFlow Backend
- ✅ Environment variables встановлені
- ✅ Google стратегія налаштована
- ✅ Роути створені
- ✅ Міграція запущена

### 3. TalentFlow Frontend
- ✅ Кнопка Google додана
- ✅ Callback сторінка створена
- ✅ AuthContext оновлений

---

## 🧪 Тестування

### 1. Запуск backend
```bash
cd TalentFlow/backend
npm run dev
```

### 2. Запуск frontend
```bash
cd TalentFlow/web
npm run dev
```

### 3. Тест OAuth flow
1. Відкрийте `http://localhost:3001/auth`
2. Натисніть кнопку "Google"
3. Авторизуйтесь через Google
4. Перевірте callback та перенаправлення

---

## ⚠️ Поширені помилки

### "Invalid redirect_uri"
- Перевірте, що redirect URI точно співпадає
- Включаючи протокол (http/https) та порт

### "OAuth consent screen not configured"
- Перевірте, що OAuth consent screen налаштований
- Додайте всі необхідні scopes

### "Client ID not found"
- Перевірте GOOGLE_CLIENT_ID в .env файлі
- Перезапустіть сервер після зміни .env

---

## 📱 Production налаштування

### 1. Оновлення redirect URIs
В Google Cloud Console додайте production URL:
```
https://talentflow-backend-production.up.railway.app/api/auth/google/callback
```

### 2. Environment variables
Переконайтеся, що в production встановлені:
```bash
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
NODE_ENV=production
```

### 3. OAuth consent screen
- Змініть статус на "In production"
- Додайте production domains

---

## 🎯 Наступні кроки

1. **Отримайте credentials** за інструкцією вище
2. **Налаштуйте environment variables**
3. **Запустіть міграцію**
4. **Протестуйте OAuth flow**
5. **Налаштуйте production**

---

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи backend сервера
2. Перевірте Google Cloud Console
3. Запустіть тестовий скрипт: `./scripts/test-google-oauth.sh`

---

*Дата створення: Грудень 2024*  
*Автор: AI Developer*  
*Версія: 1.0*
