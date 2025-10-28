# 🔧 Змінні середовища для Railway

## **Обов'язкові змінні для Backend:**

### **Database (Railway PostgreSQL)**
```env
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
```

### **JWT Security**
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

### **Cloudflare R2 (File Storage)**
```env
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=search-talant-files
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
```

### **CORS & Security**
```env
CORS_ORIGIN=https://search-talant.net
NODE_ENV=production
PORT=3000
```

---

## **Як додати в Railway:**

1. **Railway Dashboard** → Ваш проект
2. **Variables** → New Variable
3. **Додати кожну змінну** з вище наведеного списку

---

## **Приклад налаштування:**

### **Backend Variables:**
```
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=search-talant-files
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
CORS_ORIGIN=https://search-talant.net
NODE_ENV=production
PORT=3000
```

### **Frontend Variables:**
```
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_NAME=Search Talant
VITE_APP_VERSION=1.0.0
```

---

## **⚠️ Важливо:**

- **JWT_SECRET** та **JWT_REFRESH_SECRET** мають бути **унікальними та безпечними**
- **R2_ACCESS_KEY_ID** та **R2_SECRET_ACCESS_KEY** отримати з Cloudflare R2
- **CORS_ORIGIN** має відповідати вашому домену
- **Database змінні** Railway автоматично генерує при створенні PostgreSQL
