# 🔐 Налаштування Email Credentials

## ⚠️ ВАЖЛИВО: Безпека
**НІКОЛИ не додавайте credentials в код!** Використовуйте тільки змінні середовища.

## 📝 Додайте до вашого .env файлу:

```bash
# AWS SES Email Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=AKIA6GBMEDGJQGJRDXML
AWS_SECRET_ACCESS_KEY=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
FROM_EMAIL=noreply@talentflow.com
ADMIN_EMAIL=admin@talentflow.com

# SendGrid (як альтернатива)
SENDGRID_API_KEY=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
```

## 🔧 Кроки налаштування:

### 1. Створіть .env файл в папці backend/
```bash
cd backend
cp env.example .env
```

### 2. Відкрийте .env файл і додайте ваші credentials
```bash
nano .env
# або
code .env
```

### 3. Додайте змінні середовища
```bash
# AWS SES
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=AKIA6GBMEDGJQGJRDXML
AWS_SECRET_ACCESS_KEY=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
FROM_EMAIL=noreply@talentflow.com
ADMIN_EMAIL=admin@talentflow.com

# SendGrid
SENDGRID_API_KEY=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
```

### 4. Перезапустіть сервер
```bash
npm start
```

## 🧪 Тестування
```bash
# Перевірка health endpoint
curl http://localhost:3002/api/contact/health

# Тест відправки email
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

## 🔒 Безпека
- ✅ .env файл в .gitignore
- ✅ Credentials тільки в змінних середовища
- ✅ Різні ключі для dev/prod
- ✅ Обмежені IAM права
- ✅ Регулярна ротація ключів
