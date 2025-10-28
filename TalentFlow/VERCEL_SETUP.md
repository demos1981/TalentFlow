# Vercel Deployment Setup

## Environment Variables для Vercel

Додайте ці змінні середовища в налаштуваннях Vercel:

### Обов'язкові змінні:
```
NEXT_PUBLIC_API_BASE_URL=https://talentflow-production-50cc.up.railway.app/api
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### OAuth налаштування:
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Додаткові змінні:
```
NEXT_PUBLIC_GEOAPIFY_API_KEY=133124c54ccb4da299757320b12813f7
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=false
```

## Налаштування Vercel

1. **Root Directory:** `talentflow-next`
2. **Framework Preset:** Next.js
3. **Build Command:** `npm run build` (залишити порожнім)
4. **Output Directory:** залишити порожнім

## Перевірка

Після деплою перевірте:
- ✅ Сайт завантажується
- ✅ API підключення до Railway бекенду
- ✅ OAuth працює
- ✅ Всі маршрути доступні
