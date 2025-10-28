# 📧 Налаштування Email Сервісу

## 🎯 AWS SES Налаштування

### 1. Створення AWS аккаунта
1. Перейдіть на [AWS Console](https://console.aws.amazon.com/)
2. Створіть новий аккаунт або увійдіть в існуючий
3. Перейдіть до **SES (Simple Email Service)**

### 2. Налаштування SES
1. У SES Console натисніть **"Get started"**
2. Перейдіть до **"Verified identities"**
3. Натисніть **"Create identity"**
4. Оберіть **"Domain"** або **"Email address"**
5. Введіть ваш домен (наприклад: `talentflow.com`)
6. Підтвердіть домен через DNS записи

### 3. Створення IAM користувача
1. Перейдіть до **IAM Console**
2. Натисніть **"Users"** → **"Create user"**
3. Введіть ім'я користувача: `talentflow-ses-user`
4. Оберіть **"Programmatic access"**
5. Додайте політику: **"AmazonSESFullAccess"** або створіть кастомну:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

### 4. Отримання credentials
1. Після створення користувача натисніть **"Create access key"**
2. Оберіть **"Application running outside AWS"**
3. Скопіюйте **Access Key ID** та **Secret Access Key**

### 5. Додавання до .env файлу
```bash
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
FROM_EMAIL=noreply@talentflow.com
ADMIN_EMAIL=admin@talentflow.com
```

## 🚀 Альтернативні провайдери

### SendGrid
```bash
npm install @sendgrid/mail
```
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@talentflow.com
```

### Mailgun
```bash
npm install mailgun-js
```
```bash
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.talentflow.com
MAILGUN_FROM_EMAIL=noreply@talentflow.com
```

### Nodemailer з Gmail (для тестування)
```bash
npm install nodemailer
```
```bash
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_app_password
```

## 📊 Ліміти та вартість

### AWS SES (рекомендовано)
- **Sandbox**: 200 email/день, 1 email/секунду
- **Production**: 62,000 email/місяць безкоштовно
- **Після ліміту**: $0.10 за 1,000 email

### SendGrid
- **Безкоштовно**: 100 email/день
- **Essentials**: $14.95/місяць за 40,000 email

### Mailgun
- **Безкоштовно**: 5,000 email/місяць (перші 3 місяці)
- **Foundation**: $35/місяць за 50,000 email

## 🧪 Тестування

### Локальне тестування
```bash
# Запустіть сервер
npm start

# В іншому терміналі запустіть тест
node test-email-service.js
```

### Тест через API
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message content"
  }'
```

## 🔒 Безпека

### DNS записи для кращої доставки
```
TXT record: "v=spf1 include:amazonses.com ~all"
DKIM: Додайте DKIM ключі від AWS SES
DMARC: Налаштуйте DMARC політику
```

### Рекомендації
1. **Ніколи не комітьте** credentials в git
2. **Використовуйте** різні ключі для dev/prod
3. **Обмежуйте** права IAM користувача
4. **Моніторьте** bounce rate та complaints
5. **Використовуйте** double opt-in для підписок

## 📈 Моніторинг

### CloudWatch метрики
- `Send` - кількість відправлених email
- `Bounce` - кількість відхилених email
- `Complaint` - кількість скарг на spam
- `Delivery` - кількість доставлених email

### Рекомендовані алерти
- Bounce rate > 5%
- Complaint rate > 0.1%
- Delivery rate < 95%

## 🎯 Production Checklist

- [ ] AWS SES credentials налаштовані
- [ ] Email домен підтверджений
- [ ] DNS записи (SPF, DKIM, DMARC) налаштовані
- [ ] IAM політика обмежена
- [ ] CloudWatch алерти налаштовані
- [ ] Bounce handling реалізований
- [ ] Complaint handling реалізований
- [ ] Rate limiting налаштований
- [ ] Логування всіх email операцій
- [ ] Backup email провайдер готовий
