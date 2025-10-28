# 🔑 Налаштування Stripe ключів для TalentFlow

## Ваші Stripe ключі:
- **Publishable Key**: `pk_test_51SGVcgQuS3nOwnlpwS4dcUsKegeehBXsMcktAPxngXy3Da6Dkr22Vy0bMuB4WKI1BajKjGvOu4blVtk2MIYp7zRN00Z57nexx4`
- **Secret Key**: `sk_test_51SGVcgQuS3nOwnlpJfg9KGAophDYlJwB346ZbtsoWC9L8XYRxQ31XrZZiJsVeBZsdEYQzuch43DTeBnuwEaRFDI200epU31tv6`

## 📁 Налаштування файлів:

### 1. Frontend (.env.local або .env):
Створіть файл `talentflow-next/.env.local` або `talentflow-next/.env`:
```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SGVcgQuS3nOwnlpwS4dcUsKegeehBXsMcktAPxngXy3Da6Dkr22Vy0bMuB4WKI1BajKjGvOu4blVtk2MIYp7zRN00Z57nexx4

# Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 2. Backend (.env):
Створіть файл `backend/.env`:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51SGVcgQuS3nOwnlpJfg9KGAophDYlJwB346ZbtsoWC9L8XYRxQ31XrZZiJsVeBZsdEYQzuch43DTeBnuwEaRFDI200epU31tv6
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_51SGVcgQuS3nOwnlpwS4dcUsKegeehBXsMcktAPxngXy3Da6Dkr22Vy0bMuB4WKI1BajKjGvOu4blVtk2MIYp7zRN00Z57nexx4

# Інші налаштування (скопіюйте з env.example)
# ... решта змінних
```

## 🚀 Запуск тестування:

### 1. Запустіть backend:
```bash
cd backend
npm start
```

### 2. Запустіть frontend:
```bash
cd talentflow-next
npm run dev
```

### 3. Відкрийте billing сторінку:
http://localhost:3001/billing

## 🧪 Тестування з тестовими картками:

### Успішні платежі:
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

### Помилки:
- **Відхилений платіж**: 4000 0000 0000 0002
- **Недостатньо коштів**: 4000 0000 0000 9995

### 3D Secure:
- **3D Secure**: 4000 0025 0000 3155

## 📋 Наступні кроки:

1. ✅ Створіть .env файли з ключами
2. ✅ Запустіть обидва сервери
3. ✅ Протестуйте на billing сторінці
4. ⏳ Налаштуйте webhook (опціонально)
5. ⏳ Перейдіть на live ключі для продакшн

## ⚠️ Важливо:
- Це **тестові ключі** - вони не списують реальні гроші
- Для продакшн потрібні **live ключі** (pk_live_... та sk_live_...)
- Webhook secret отримаєте після налаштування webhook endpoint

**Готово до тестування!** 🎉
