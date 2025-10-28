-- Виправлення порядку створення таблиць
\c talentflow;

-- 1. Спочатку створюємо таблицю subscriptions (без залежностей)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,
    "trialEndDate" TIMESTAMP,
    "cancelledAt" TIMESTAMP,
    "cancellationReason" TEXT,
    "autoRenew" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Тепер створюємо таблицю payments (з посиланням на subscriptions)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    "subscriptionId" UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    method VARCHAR(50) NOT NULL,
    "transactionId" VARCHAR(255),
    "paymentDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Створюємо індекси для payments
CREATE INDEX IF NOT EXISTS idx_payments_userId ON payments("userId");
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 4. Перевіряємо результати
SELECT 'Tables created successfully!' as message;
\dt













