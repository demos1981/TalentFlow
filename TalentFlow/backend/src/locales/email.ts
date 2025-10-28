export const emailTranslations = {
  en: {
    // Confirmation email
    confirmRegistrationSubject: 'Confirm your TalentFlow registration',
    confirmRegistrationText: 'Click the link to confirm your registration:',
    confirmRegistrationHtml: {
      welcome: 'Welcome to TalentFlow!',
      thankYou: 'Thank you for registering. Click the button below to confirm your account:',
      confirmButton: 'Confirm Registration',
      fallbackText: 'If the button doesn\'t work, copy and paste this link into your browser:',
    },
    
    // Login confirmation
    loginCodeSubject: 'Login confirmation code',
    loginCodeText: 'Your confirmation code:',
    loginCodeHtml: {
      title: 'Login confirmation code',
      instruction: 'Use this code to log into the system:',
      validFor: 'This code is valid for 10 minutes.',
    },
    
    // Password reset
    passwordResetSubject: 'TalentFlow password reset',
    passwordResetText: 'Click the link to reset your password:',
    passwordResetHtml: {
      title: 'Password Reset',
      instruction: 'You have requested a password reset for your TalentFlow account.',
      resetButton: 'Reset Password',
      ignoreText: 'If you did not request a password reset, please ignore this email.',
      validFor: 'The link is valid for 1 hour.',
    },
    
    // Contact form
    contactForm: {
      adminSubject: 'New message from {{name}} - {{subject}}',
      userSubject: 'Thank you for contacting us - TalentFlow',
      adminText: {
        name: 'Name: {{name}}',
        email: 'Email: {{email}}',
        phone: 'Phone: {{phone}}',
        subject: 'Subject: {{subject}}',
        message: 'Message:',
      },
      userText: {
        greeting: 'Hello {{name}}!',
        thankYou: 'Thank you for contacting TalentFlow. We have received your message and will respond as soon as possible.',
        yourMessage: 'Your message:',
        contactInfo: 'If you have urgent questions, you can contact us directly:',
        email: 'Email: {{adminEmail}}',
        phone: 'Phone: +380 XX XXX XX XX',
        signature: 'Best regards,\nTalentFlow Team',
      },
    },
    
    // Job notifications
    newJobNotification: {
      subject: 'New job: {{jobTitle}} at {{companyName}}',
      text: 'New job matches your criteria: {{jobTitle}} at {{companyName}}. View: {{jobUrl}}',
      html: {
        title: 'New job for you!',
        found: 'We found a job that might interest you:',
        company: 'Company:',
        viewButton: 'View Job',
        unsubscribe: 'You received this message because you subscribed to job notifications.',
        unsubscribeLink: 'Unsubscribe',
      },
    },
    
    // Application notifications
    newApplicationNotification: {
      subject: 'New application for job: {{jobTitle}}',
      text: 'New application from {{candidateName}} for job {{jobTitle}}. View: {{applicationUrl}}',
      html: {
        title: 'New job application!',
        received: 'You received a new application for the job:',
        candidate: 'Candidate:',
        viewButton: 'View Application',
        reminder: 'Don\'t forget to respond to the candidate within 24 hours for the best experience.',
      },
    },
  },
  
  uk: {
    // Confirmation email
    confirmRegistrationSubject: 'Підтвердіть реєстрацію в TalentFlow',
    confirmRegistrationText: 'Натисніть на посилання для підтвердження реєстрації:',
    confirmRegistrationHtml: {
      welcome: 'Ласкаво просимо до TalentFlow!',
      thankYou: 'Дякуємо за реєстрацію. Натисніть на кнопку нижче для підтвердження вашого облікового запису:',
      confirmButton: 'Підтвердити реєстрацію',
      fallbackText: 'Якщо кнопка не працює, скопіюйте та вставте це посилання у браузер:',
    },
    
    // Login confirmation
    loginCodeSubject: 'Код підтвердження входу',
    loginCodeText: 'Ваш код підтвердження:',
    loginCodeHtml: {
      title: 'Код підтвердження входу',
      instruction: 'Використайте цей код для входу в систему:',
      validFor: 'Цей код дійсний протягом 10 хвилин.',
    },
    
    // Password reset
    passwordResetSubject: 'Скидання паролю TalentFlow',
    passwordResetText: 'Натисніть на посилання для скидання паролю:',
    passwordResetHtml: {
      title: 'Скидання паролю',
      instruction: 'Ви запросили скидання паролю для вашого облікового запису TalentFlow.',
      resetButton: 'Скинути пароль',
      ignoreText: 'Якщо ви не запитували скидання паролю, проігноруйте цей email.',
      validFor: 'Посилання дійсне протягом 1 години.',
    },
    
    // Contact form
    contactForm: {
      adminSubject: 'Нове повідомлення від {{name}} - {{subject}}',
      userSubject: 'Дякуємо за звернення - TalentFlow',
      adminText: {
        name: 'Ім\'я: {{name}}',
        email: 'Email: {{email}}',
        phone: 'Телефон: {{phone}}',
        subject: 'Тема: {{subject}}',
        message: 'Повідомлення:',
      },
      userText: {
        greeting: 'Доброго дня, {{name}}!',
        thankYou: 'Дякуємо за ваше звернення до TalentFlow. Ми отримали ваше повідомлення і обов\'язково відповімо найближчим часом.',
        yourMessage: 'Ваше повідомлення:',
        contactInfo: 'Якщо у вас є термінові питання, ви можете зв\'язатися з нами безпосередньо:',
        email: 'Email: {{adminEmail}}',
        phone: 'Телефон: +380 XX XXX XX XX',
        signature: 'З повагою,\nКоманда TalentFlow',
      },
    },
    
    // Job notifications
    newJobNotification: {
      subject: 'Нова вакансія: {{jobTitle}} в {{companyName}}',
      text: 'Нова вакансія відповідає вашим критеріям: {{jobTitle}} в {{companyName}}. Переглянути: {{jobUrl}}',
      html: {
        title: 'Нова вакансія для вас!',
        found: 'Ми знайшли вакансію, яка може вас зацікавити:',
        company: 'Компанія:',
        viewButton: 'Переглянути вакансію',
        unsubscribe: 'Ви отримали це повідомлення тому, що підписалися на сповіщення про нові вакансії.',
        unsubscribeLink: 'Відписатися',
      },
    },
    
    // Application notifications
    newApplicationNotification: {
      subject: 'Нова заявка на вакансію: {{jobTitle}}',
      text: 'Нова заявка від {{candidateName}} на вакансію {{jobTitle}}. Переглянути: {{applicationUrl}}',
      html: {
        title: 'Нова заявка на вакансію!',
        received: 'Ви отримали нову заявку на вакансію:',
        candidate: 'Кандидат:',
        viewButton: 'Переглянути заявку',
        reminder: 'Не забудьте відповісти кандидату протягом 24 годин для кращого досвіду.',
      },
    },
  },
  
  // Додаємо базові переклади для інших мов
  es: {
    confirmRegistrationSubject: 'Confirma tu registro en TalentFlow',
    confirmRegistrationText: 'Haz clic en el enlace para confirmar tu registro:',
    confirmRegistrationHtml: {
      welcome: '¡Bienvenido a TalentFlow!',
      thankYou: 'Gracias por registrarte. Haz clic en el botón de abajo para confirmar tu cuenta:',
      confirmButton: 'Confirmar Registro',
      fallbackText: 'Si el botón no funciona, copia y pega este enlace en tu navegador:',
    },
    loginCodeSubject: 'Código de confirmación de inicio de sesión',
    loginCodeText: 'Tu código de confirmación:',
    loginCodeHtml: {
      title: 'Código de confirmación de inicio de sesión',
      instruction: 'Usa este código para iniciar sesión en el sistema:',
      validFor: 'Este código es válido por 10 minutos.',
    },
  },
  
  de: {
    confirmRegistrationSubject: 'Bestätige deine TalentFlow-Registrierung',
    confirmRegistrationText: 'Klicke auf den Link, um deine Registrierung zu bestätigen:',
    confirmRegistrationHtml: {
      welcome: 'Willkommen bei TalentFlow!',
      thankYou: 'Danke für deine Registrierung. Klicke auf den Button unten, um dein Konto zu bestätigen:',
      confirmButton: 'Registrierung bestätigen',
      fallbackText: 'Falls der Button nicht funktioniert, kopiere und füge diesen Link in deinen Browser ein:',
    },
    loginCodeSubject: 'Anmelde-Bestätigungscode',
    loginCodeText: 'Dein Bestätigungscode:',
    loginCodeHtml: {
      title: 'Anmelde-Bestätigungscode',
      instruction: 'Verwende diesen Code, um dich in das System einzuloggen:',
      validFor: 'Dieser Code ist 10 Minuten gültig.',
    },
  },
  
  fr: {
    confirmRegistrationSubject: 'Confirmez votre inscription TalentFlow',
    confirmRegistrationText: 'Cliquez sur le lien pour confirmer votre inscription:',
    confirmRegistrationHtml: {
      welcome: 'Bienvenue chez TalentFlow!',
      thankYou: 'Merci pour votre inscription. Cliquez sur le bouton ci-dessous pour confirmer votre compte:',
      confirmButton: 'Confirmer l\'inscription',
      fallbackText: 'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur:',
    },
    loginCodeSubject: 'Code de confirmation de connexion',
    loginCodeText: 'Votre code de confirmation:',
    loginCodeHtml: {
      title: 'Code de confirmation de connexion',
      instruction: 'Utilisez ce code pour vous connecter au système:',
      validFor: 'Ce code est valide pendant 10 minutes.',
    },
  },
  
  pl: {
    confirmRegistrationSubject: 'Potwierdź rejestrację w TalentFlow',
    confirmRegistrationText: 'Kliknij link, aby potwierdzić rejestrację:',
    confirmRegistrationHtml: {
      welcome: 'Witamy w TalentFlow!',
      thankYou: 'Dziękujemy za rejestrację. Kliknij przycisk poniżej, aby potwierdzić swoje konto:',
      confirmButton: 'Potwierdź rejestrację',
      fallbackText: 'Jeśli przycisk nie działa, skopiuj i wklej ten link do przeglądarki:',
    },
    loginCodeSubject: 'Kod potwierdzenia logowania',
    loginCodeText: 'Twój kod potwierdzenia:',
    loginCodeHtml: {
      title: 'Kod potwierdzenia logowania',
      instruction: 'Użyj tego kodu, aby zalogować się do systemu:',
      validFor: 'Ten kod jest ważny przez 10 minut.',
    },
  },
  
  ru: {
    confirmRegistrationSubject: 'Подтвердите регистрацию в TalentFlow',
    confirmRegistrationText: 'Нажмите на ссылку для подтверждения регистрации:',
    confirmRegistrationHtml: {
      welcome: 'Добро пожаловать в TalentFlow!',
      thankYou: 'Спасибо за регистрацию. Нажмите на кнопку ниже для подтверждения вашего аккаунта:',
      confirmButton: 'Подтвердить регистрацию',
      fallbackText: 'Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:',
    },
    loginCodeSubject: 'Код подтверждения входа',
    loginCodeText: 'Ваш код подтверждения:',
    loginCodeHtml: {
      title: 'Код подтверждения входа',
      instruction: 'Используйте этот код для входа в систему:',
      validFor: 'Этот код действителен в течение 10 минут.',
    },
  },
};

// Функція для отримання перекладу
export const getEmailTranslation = (language: string, key: string, replacements?: Record<string, string>): string => {
  const lang = language || 'en';
  const translations = emailTranslations[lang as keyof typeof emailTranslations] || emailTranslations.en;
  
  // Рекурсивно отримуємо значення за ключем (підтримуємо nested keys)
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback до англійської мови
      value = emailTranslations.en;
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey];
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key; // Повертаємо ключ, якщо не знайшли переклад
  }
  
  // Замінюємо плейсхолдери
  if (replacements) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
      return replacements[placeholder] || match;
    });
  }
  
  return value;
};
