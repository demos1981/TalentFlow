# Stripe Integration Guide для TalentFlow

## Чому Stripe?

**Stripe** - це найкращий вибір для TalentFlow з наступних причин:

### ✅ Переваги Stripe:
1. **Простота інтеграції** - найпростіший API для початківців
2. **Безпека** - PCI DSS Level 1 сертифікація
3. **Глобальність** - підтримує 135+ валют та 46 країн
4. **Мобільність** - відмінна підтримка мобільних платежів
5. **Документація** - найкраща документація серед всіх платіжних систем
6. **React/Next.js** - офіційні компоненти для React
7. **Вебхуки** - надійна система повідомлень про події
8. **Тестування** - відмінні тестові картки та симуляція

### 💰 Вартість:
- **2.9% + $0.30** за успішну транзакцію
- **Без щомісячної плати**
- **Без прихованих комісій**

### 🌍 Альтернативи та чому Stripe краще:

| Система | Комісія | Складність | Глобальність | Документація |
|---------|---------|------------|--------------|--------------|
| **Stripe** | 2.9% + $0.30 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| PayPal | 2.9% + $0.30 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Square | 2.9% + $0.30 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Razorpay | 2% + $0.30 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Mollie | 1.4% + $0.30 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

## Інтеграція Stripe

### 1. Встановлення

```bash
# Frontend (Next.js)
npm install @stripe/stripe-js @stripe/react-stripe-js

# Backend (Node.js)
npm install stripe
```

### 2. Налаштування змінних середовища

```env
# Frontend (.env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Backend (.env)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Frontend компонент (Stripe Elements)

```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ planId, price }: { planId: string, price: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    // Створюємо Payment Intent на бекенді
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, price })
    });

    const { clientSecret } = await response.json();

    // Підтверджуємо платіж
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      // Успішний платіж
      console.log('Payment succeeded!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe}>Pay ${price}</button>
    </form>
  );
};

// Використання
const BillingPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm planId="premium" price={299} />
    </Elements>
  );
};
```

### 4. Backend API (Express.js)

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Створення Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { planId, price } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe використовує центи
      currency: 'usd',
      metadata: {
        planId,
        userId: req.user.id
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook для обробки успішних платежів
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Оновлюємо план користувача в базі даних
    updateUserPlan(paymentIntent.metadata.userId, paymentIntent.metadata.planId);
  }

  res.json({received: true});
});
```

### 5. Створення продуктів та цін в Stripe

```typescript
// Створення продуктів (один раз)
const createProducts = async () => {
  const products = [
    {
      name: 'Basic Plan',
      description: 'Up to 10 job postings',
      metadata: { planId: 'basic' }
    },
    {
      name: 'Premium Plan', 
      description: 'Unlimited job postings',
      metadata: { planId: 'premium' }
    },
    {
      name: 'Enterprise Plan',
      description: 'Everything + custom features',
      metadata: { planId: 'enterprise' }
    }
  ];

  for (const product of products) {
    const stripeProduct = await stripe.products.create(product);
    
    // Створюємо ціну
    await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: getPriceForPlan(product.metadata.planId) * 100,
      currency: 'usd',
      recurring: { interval: 'month' }
    });
  }
};
```

## Безпека

### ✅ Рекомендації:
1. **Ніколи не зберігайте** повний номер картки
2. **Використовуйте HTTPS** для всіх платежів
3. **Валідуйте на бекенді** всі дані перед Stripe
4. **Використовуйте Webhooks** для підтвердження платежів
5. **Логуйте всі операції** для аудиту

### 🔒 Приклад безпечної валідації:

```typescript
const validatePayment = (planId: string, userId: string, amount: number) => {
  // Перевіряємо чи існує план
  const validPlans = ['basic', 'premium', 'enterprise'];
  if (!validPlans.includes(planId)) {
    throw new Error('Invalid plan');
  }

  // Перевіряємо користувача
  if (!userId || !isValidUser(userId)) {
    throw new Error('Invalid user');
  }

  // Перевіряємо суму
  const expectedAmount = getPriceForPlan(planId);
  if (amount !== expectedAmount) {
    throw new Error('Amount mismatch');
  }
};
```

## Тестування

### Тестові картки Stripe:
```
# Успішний платіж
4242 4242 4242 4242

# Помилка
4000 0000 0000 0002

# 3D Secure
4000 0025 0000 3155
```

### Тестування Webhooks:
```bash
# Встановлення Stripe CLI
npm install -g stripe

# Логування webhooks
stripe listen --forward-to localhost:3002/api/webhook
```

## Монетизація

### 💡 Стратегія ціноутворення:
1. **Basic ($99/місяць)** - для малих компаній
2. **Premium ($299/місяць)** - для середніх компаній (найпопулярніший)
3. **Enterprise ($599/місяць)** - для великих компаній

### 📊 Прогноз доходів:
- **100 клієнтів Basic** = $9,900/місяць
- **50 клієнтів Premium** = $14,950/місяць  
- **10 клієнтів Enterprise** = $5,990/місяць
- **Загалом** = $30,840/місяць

### 🎯 Рекомендації:
1. **Безкоштовний пробний період** 14 днів
2. **Знижки при річній оплаті** (-20%)
3. **Реферальна програма** (-10% за кожного друга)
4. **Гарантія повернення коштів** 30 днів

## Наступні кроки

1. **Створити Stripe акаунт** та отримати ключі
2. **Інтегрувати Stripe Elements** в billing сторінку
3. **Створити backend API** для обробки платежів
4. **Налаштувати Webhooks** для автоматизації
5. **Додати тестування** та моніторинг
6. **Запустити в продакшн** з реальними картками

## Допомога

- 📚 [Stripe Documentation](https://stripe.com/docs)
- 🎥 [Stripe YouTube Channel](https://youtube.com/stripe)
- 💬 [Stripe Discord](https://discord.gg/stripe)
- 🆘 [Stripe Support](https://support.stripe.com)

---

**Висновок:** Stripe - це найкращий вибір для TalentFlow завдяки простоті, безпеці та глобальній підтримці. Інтеграція займе 1-2 дні, але забезпечить надійну систему монетизації на роки вперед.
