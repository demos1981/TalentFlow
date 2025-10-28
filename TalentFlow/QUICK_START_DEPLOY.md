# 🚀 Швидкий старт деплою TalentFlow за $16-17/місяць

## **⚡ Швидкий старт (30 хвилин):**

### **1. Підготовка (5 хв):**
```bash
# Клонувати проект
git clone https://github.com/MykhailoIlyashDev/TalentFlow.git
cd TalentFlow

# Встановити Railway CLI
npm install -g @railway/cli

# Авторизуватися
railway login
```

### **2. Cloudflare R2 (10 хв):**
1. Зайти на [cloudflare.com](https://cloudflare.com)
2. Створити акаунт
3. Dashboard → R2 Object Storage
4. Create bucket: `talentflow-files`
5. R2 → Manage R2 API tokens → Create API token
6. **Зберегти ключі:**
   ```env
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=talentflow-files
   R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
   ```

### **3. Railway проект (Hobby план) (10 хв):**
```bash
# Створити проект
railway init

# Додати PostgreSQL (Hobby - $5/міс)
railway service add postgresql

# Додати backend
railway service add github MykhailoIlyashDev/TalentFlow backend

# Перевірити план (має бути Hobby)
railway service list
```

### **4. Cloudflare Pages (5 хв):**
1. Cloudflare Dashboard → Pages
2. Create a project → Connect to Git
3. Вибрати репозиторій: `MykhailoIlyashDev/TalentFlow`
4. **Налаштування:**
   ```
   Project name: talentflow-frontend
   Production branch: main
   Root directory: web
   Build command: npm run build
   Build output directory: dist
   ```

---

## **🔧 Детальний деплой:**

### **Phase 1: Backend Setup (Hobby план)**
```bash
cd backend

# Встановити залежності
npm install

# Додати залежності для R2
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Створити .env файл
cp env.example .env

# Оновити .env з R2 ключами
nano .env

# Environment variables в Railway
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_REFRESH_SECRET=$(openssl rand -hex 32)
railway variables set R2_ACCESS_KEY_ID=your_access_key
railway variables set R2_SECRET_ACCESS_KEY=your_secret_key
railway variables set R2_BUCKET_NAME=talentflow-files
railway variables set R2_ENDPOINT_URL=your_endpoint_url

# Деплой
railway up
```

### **Phase 2: Database Setup (Hobby план)**
```bash
# Підключитися до бази
railway connect

# Створити таблиці
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f database/schema.sql

# Заповнити початковими даними
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f database/seed.sql

# Перевірити з'єднання
psql -c "SELECT version();"
```

### **Phase 3: Frontend Setup (Cloudflare Pages)**
```bash
cd ../web

# Встановити залежності
npm install

# Оновити API URL в .env
echo "VITE_API_URL=$(railway variables get BACKEND_URL)" >> .env

# Build та деплой (автоматично через Cloudflare Pages)
npm run build

# Перевірити build
ls -la dist/
```

---

## **🧪 Тестування:**

### **Health Check:**
```bash
# Backend health
curl $(railway variables get BACKEND_URL)/health

# Database connection
railway connect
psql -c "SELECT version();"

# Frontend доступність
curl -I https://talentflow-frontend.pages.dev
```

### **API Testing:**
```bash
# Test authentication
curl -X POST $(railway variables get BACKEND_URL)/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","role":"candidate"}'
```

### **File Upload Test:**
```bash
# Test file upload
curl -X POST $(railway variables get BACKEND_URL)/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg"
```

---

## **📊 Перевірка статусу:**

### **Railway Status (Hobby план):**
```bash
# Перевірити всі сервіси
railway status

# Переглянути логи
railway logs

# Переглянути метрики
railway metrics

# Перевірити план (має бути Hobby)
railway service list
```

### **Cloudflare R2 Status:**
```bash
# Перевірити bucket
aws s3 ls s3://talentflow-files \
  --endpoint-url your_endpoint_url \
  --profile r2
```

### **Cloudflare Pages Status:**
```bash
# Перевірити deployment
# Cloudflare Dashboard → Pages → talentflow-frontend → Deployments
```

---

## **🚨 Troubleshooting:**

### **Common Issues:**
```bash
# Backend не запускається
railway logs talentflow-backend

# Database connection error (Hobby план має обмеження)
railway variables get PGHOST
railway variables get PGPASSWORD

# R2 upload fails
railway variables get R2_ACCESS_KEY_ID
railway variables get R2_SECRET_ACCESS_KEY

# Frontend build fails
cd web && npm run build
```

### **Quick Fixes:**
```bash
# Restart service
railway service restart talentflow-backend

# Rebuild service
railway service rebuild talentflow-backend

# Check environment
railway variables list

# Перевірити план сервісу
railway service list
```

---

## **💰 Вартість перевірка:**

### **Monthly Costs (має бути $16-17):**
```bash
# Railway Backend Hobby: $5
# Railway Database Hobby: $5
# Cloudflare R2: $5
# Domain: $1-2
# Cloudflare Pages: $0
# Cloudflare CDN: $0
# Total: $16-17
```

### **Перевірити плани:**
```bash
# Переконатися що всі сервіси на Hobby плані
railway service list

# Якщо якийсь на Pro - змінити на Hobby
railway service upgrade/downgrade
```

---

## **✅ Checklist деплою за $16-17:**

- [ ] Cloudflare R2 bucket створено
- [ ] Railway проект створено (Hobby план)
- [ ] PostgreSQL додано (Hobby - $5/міс)
- [ ] Backend деплой успішний (Hobby - $5/міс)
- [ ] Cloudflare Pages налаштовано (безкоштовно)
- [ ] Frontend деплой успішний
- [ ] Environment variables налаштовано
- [ ] Database схема створена
- [ ] Health checks проходять
- [ ] API endpoints працюють
- [ ] File upload/download працює
- [ ] Загальна вартість: $16-17/місяць

---

## **🎯 Наступні кроки:**

1. **Купити домен** search-talant.net ($12-15/рік)
2. **Налаштувати DNS** через Cloudflare
3. **Додати SSL сертифікати**
4. **Налаштувати CORS**
5. **Performance тестування**
6. **Monitoring налаштування**

---

## **📈 Масштабування:**

### **Hobby план обмеження:**
- Backend: 1-3 інстанси
- Database: 1GB storage
- Базове масштабування
- До 10,000 користувачів

### **Коли мігрувати на Pro:**
При досягненні 10,000 користувачів:
```
Railway Pro: +$15/місяць
Vercel Pro: +$20/місяць
Total: $51-56/місяць
```

---

**🚀 Готові до деплою за $16-17/місяць! Почнемо з Cloudflare R2 налаштування.**
