# Multi-stage build для оптимізації
FROM node:20-alpine AS builder

WORKDIR /app

# Копіюємо package files для кешування залежностей
COPY package*.json ./

# Встановлюємо всі залежності (включаючи dev) для білду
RUN npm ci --only=production=false

# Копіюємо всі файли необхідні для білду
COPY . .

# Білдимо TypeScript з явним вказівкою файлів
RUN npx tsc --build tsconfig.json

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Встановлюємо dumb-init для правильного shutdown
RUN apk add --no-cache dumb-init

# Створюємо non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Копіюємо package files та встановлюємо тільки production залежності
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Копіюємо збілдену програму
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/swagger.yaml ./

# Створюємо .env файл з базовими налаштуваннями (буде перезаписаний змінними середовища)
RUN echo "NODE_ENV=production" > .env

# Змінюємо власника файлів
RUN chown -R nodejs:nodejs /app
USER nodejs

# Експортуємо порт (використовуємо змінну середовища або 3000 за замовчуванням)
EXPOSE ${PORT:-3000}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-3000}/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Запускаємо додаток з обробкою помилок та діагностикою
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "echo 'Starting server...' && echo 'Environment variables:' && env | grep -E '^(DB_|PORT|NODE_ENV)' && echo 'Checking dist directory:' && ls -la dist/ && echo 'Checking package.json scripts:' && cat package.json | grep -A 10 scripts && echo 'Starting Node.js server...' && node dist/server.js"]