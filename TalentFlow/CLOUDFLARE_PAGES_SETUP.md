# 🌐 Налаштування Cloudflare Pages для TalentFlow

## **Крок 1: Створення Cloudflare акаунту**

### 1.1 Реєстрація
- Зайти на [cloudflare.com](https://cloudflare.com)
- Натиснути "Sign Up"
- Ввести email та пароль
- Підтвердити email

### 1.2 Перехід до Pages
- Dashboard → "Pages"
- Натиснути "Create a project"

---

## **Крок 2: Підключення GitHub репозиторію**

### 2.1 Connect to Git
- "Connect to Git" → "GitHub"
- Авторизуватися через GitHub
- Вибрати репозиторій: `MykhailoIlyashDev/TalentFlow`

### 2.2 Налаштування проекту
```
Project name: talentflow-frontend
Production branch: main
Root directory: web
Framework preset: Vite
```

---

## **Крок 3: Build налаштування**

### 3.1 Build Configuration
```
Build command: npm run build
Build output directory: dist
Root directory: web
```

### 3.2 Environment Variables
```env
# API URL
VITE_API_URL=https://api.search-talant.net

# App Configuration
VITE_APP_NAME=TalentFlow
VITE_APP_VERSION=1.0.0

# Cloudflare R2
VITE_R2_PUBLIC_URL=https://files.search-talant.net

# Analytics (опціонально)
VITE_GA_TRACKING_ID=your_ga_id
VITE_MIXPANEL_TOKEN=your_mixpanel_token
```

### 3.3 Build Dependencies
```json
// package.json в web папці
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "vite": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## **Крок 4: Vite конфігурація**

### 4.1 vite.config.ts
```typescript
// web/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    }
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### 4.2 TypeScript конфігурація
```json
// web/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## **Крок 5: Оптимізація для production**

### 5.1 Code Splitting
```typescript
// web/src/App.tsx
import { lazy, Suspense } from 'react';
import Loading from './components/Loading';

// Lazy loading для сторінок
const JobsPage = lazy(() => import('./pages/JobsPage'));
const CandidatesPage = lazy(() => import('./pages/CandidatesPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
```

### 5.2 Image Optimization
```typescript
// web/src/components/OptimizedImage.tsx
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export function OptimizedImage({ src, alt, className, placeholder }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return <div className={`${className} bg-gray-200 flex items-center justify-center`}>
      <span className="text-gray-500">Image not found</span>
    </div>;
  }

  return (
    <>
      {!isLoaded && placeholder && (
        <div className={`${className} bg-gray-200 animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'hidden' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </>
  );
}
```

### 5.3 Service Worker для кешування
```typescript
// web/public/sw.js
const CACHE_NAME = 'talentflow-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## **Крок 6: Environment Configuration**

### 6.1 Environment Files
```bash
# web/.env.production
VITE_API_URL=https://api.search-talant.net
VITE_APP_NAME=TalentFlow
VITE_APP_VERSION=1.0.0
VITE_R2_PUBLIC_URL=https://files.search-talant.net

# web/.env.development
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=TalentFlow Dev
VITE_APP_VERSION=1.0.0
VITE_R2_PUBLIC_URL=http://localhost:3000/files
```

### 6.2 Environment Validation
```typescript
// web/src/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME || 'TalentFlow',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  r2PublicUrl: import.meta.env.VITE_R2_PUBLIC_URL || 'http://localhost:3000/files',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV
};

// Валідація обов'язкових змінних
const requiredEnvVars = ['VITE_API_URL'];
requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

---

## **Крок 7: Performance Optimization**

### 7.1 Bundle Analysis
```bash
# Встановити bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Додати до vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
});
```

### 7.2 Preload Critical Resources
```html
<!-- web/index.html -->
<head>
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/critical.css" as="style">
  <link rel="dns-prefetch" href="//api.search-talant.net">
  <link rel="dns-prefetch" href="//files.search-talant.net">
</head>
```

### 7.3 Compression
```typescript
// web/vite.config.ts
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
});
```

---

## **Крок 8: Monitoring та Analytics**

### 8.1 Performance Monitoring
```typescript
// web/src/utils/performance.ts
export function trackPageLoad() {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      windowLoad: navigation.loadEventEnd - navigation.loadEventStart
    };

    // Відправити метрики в analytics
    console.log('Performance metrics:', metrics);
  }
}

export function trackUserInteraction(action: string, label?: string) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: 'user_interaction',
      event_label: label
    });
  }
}
```

### 8.2 Error Tracking
```typescript
// web/src/utils/errorTracking.ts
export function trackError(error: Error, context?: any) {
  console.error('Error tracked:', error, context);
  
  // Відправити в error tracking сервіс
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_parameters: context
    });
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  trackError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  trackError(new Error(event.reason), {
    type: 'unhandled_promise_rejection'
  });
});
```

---

## **Крок 9: Deployment та CI/CD**

### 9.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json
      
      - name: Install dependencies
        run: |
          cd web
          npm ci
      
      - name: Build
        run: |
          cd web
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: talentflow-frontend
          directory: web/dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 9.2 Preview Deployments
```bash
# Створити preview deployment
git push origin feature/new-feature

# Cloudflare Pages автоматично створить preview URL
# https://feature-new-feature.talentflow-frontend.pages.dev
```

---

## **Крок 10: Custom Domain**

### 10.1 Domain налаштування
```bash
# В Cloudflare Pages Dashboard
# Settings → Custom domains → Add custom domain

# Додати домен
search-talant.net
www.search-talant.net
```

### 10.2 DNS налаштування
```dns
# CNAME записи
Type: CNAME
Name: @
Value: talentflow-frontend.pages.dev

Type: CNAME  
Name: www
Value: talentflow-frontend.pages.dev
```

---

## **Очікувані результати:**
- ✅ **Безкоштовний хостинг** для фронтенду
- ✅ **Автоматичний деплой** з GitHub
- ✅ **Global CDN** для швидкого завантаження
- ✅ **SSL сертифікати** автоматично
- ✅ **Custom domains** підтримуються
- ✅ **Preview deployments** для тестування
- ✅ **Performance monitoring** вбудовано

---

**Наступний крок:** Налаштування Railway backend та database
