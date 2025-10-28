// AWS SES (закоментовано - можна повернути пізніше)
// import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
// import nodemailer from 'nodemailer';
import * as brevo from '@getbrevo/brevo';
import { getEmailTranslation } from '../locales/email';

// // Ініціалізація SES клієнта
// const sesClient = new SESClient({
//   region: process.env.AWS_REGION || 'eu-central-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   },
// });

// // Конфігурація email
// const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@libero.exchange';
// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@libero.exchange';

// Ініціалізація Brevo
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

const FROM_EMAIL = 'tech.talentfluent@gmail.com';
const ADMIN_EMAIL = 'tech.talentfluent@gmail.com';

/**
 * Відправка email через Brevo
 */
const sendEmailViaBrevo = async (
  to: string | string[],
  subject: string,
  text: string,
  html: string,
  replyTo?: string
) => {
  const toAddresses = Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }];
  
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.textContent = text;
  sendSmtpEmail.sender = { name: "TalentFluent", email: FROM_EMAIL };
  sendSmtpEmail.to = toAddresses;
  
  if (replyTo) {
    sendSmtpEmail.replyTo = { email: replyTo };
  }

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent via Brevo successfully:', result.body?.messageId);
    return { success: true, messageId: result.body?.messageId, provider: 'Brevo' };
  } catch (error) {
    console.error('❌ Error sending email via Brevo:', error);
    throw new Error('Failed to send email via Brevo.');
  }
};

// /**
//  * Базовий метод для відправки email (AWS SES з SendGrid fallback) - ЗАКОМЕНТОВАНО
//  */
// const sendEmail = async (
//   to: string | string[],
//   subject: string,
//   text: string,
//   html: string,
//   replyTo?: string
// ) => {
//   const toAddresses = Array.isArray(to) ? to : [to];
//   
//   // Спочатку пробуємо AWS SES
//   const params = {
//     Source: FROM_EMAIL,
//     Destination: {
//       ToAddresses: toAddresses,
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: 'UTF-8',
//           Data: html,
//         },
//         Text: {
//           Charset: 'UTF-8',
//           Data: text,
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: subject,
//       },
//     },
//     ReplyToAddresses: replyTo ? [replyTo] : [],
//   };
//
//   try {
//     const command = new SendEmailCommand(params);
//     const data = await sesClient.send(command);
//     console.log('Email sent via AWS SES successfully:', data.MessageId);
//     return { success: true, messageId: data.MessageId, provider: 'AWS SES' };
//   } catch (sesError) {
//     console.error('AWS SES failed, trying SendGrid:', sesError);
//     
//     // Якщо AWS SES не спрацював, пробуємо SendGrid
//     try {
//       return await sendEmailViaSendGrid(to, subject, text, html, replyTo);
//     } catch (sendGridError) {
//       console.error('Both AWS SES and SendGrid failed:', sendGridError);
//       throw new Error('Failed to send email through both providers.');
//     }
//   }
// };

/**
 * Базовий метод для відправки email через Brevo
 */
const sendEmail = async (
  to: string | string[],
  subject: string,
  text: string,
  html: string,
  replyTo?: string
) => {
  return await sendEmailViaBrevo(to, subject, text, html, replyTo);
};

/**
 * Відправка email підтвердження реєстрації
 */
export const sendConfirmationEmail = async (email: string, confirmationUrl: string, language: string = 'en') => {
  const subject = getEmailTranslation(language, 'confirmRegistrationSubject');
  const text = `${getEmailTranslation(language, 'confirmRegistrationText')} ${confirmationUrl}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${getEmailTranslation(language, 'confirmRegistrationHtml.welcome')}</h2>
      <p>${getEmailTranslation(language, 'confirmRegistrationHtml.thankYou')}</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ${getEmailTranslation(language, 'confirmRegistrationHtml.confirmButton')}
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">${getEmailTranslation(language, 'confirmRegistrationHtml.fallbackText')}</p>
      <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${confirmationUrl}</p>
    </div>
  `;

  return await sendEmail(email, subject, text, html);
};

/**
 * Відправка коду підтвердження входу
 */
export const sendLoginConfirmationEmail = async (email: string, confirmationCode: string, language: string = 'en') => {
  const subject = getEmailTranslation(language, 'loginCodeSubject');
  const text = `${getEmailTranslation(language, 'loginCodeText')} ${confirmationCode}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${getEmailTranslation(language, 'loginCodeHtml.title')}</h2>
      <p>${getEmailTranslation(language, 'loginCodeHtml.instruction')}</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
          <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${confirmationCode}</span>
        </div>
      </div>
      <p style="color: #6b7280; font-size: 14px;">${getEmailTranslation(language, 'loginCodeHtml.validFor')}</p>
    </div>
  `;

  return await sendEmail(email, subject, text, html);
};

/**
 * Відправка email для скидання паролю
 */
export const sendPasswordResetEmail = async (email: string, resetUrl: string, language: string = 'en') => {
  const subject = getEmailTranslation(language, 'passwordResetSubject');
  const text = `${getEmailTranslation(language, 'passwordResetText')} ${resetUrl}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${getEmailTranslation(language, 'passwordResetHtml.title')}</h2>
      <p>${getEmailTranslation(language, 'passwordResetHtml.instruction')}</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ${getEmailTranslation(language, 'passwordResetHtml.resetButton')}
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">${getEmailTranslation(language, 'passwordResetHtml.ignoreText')}</p>
      <p style="color: #6b7280; font-size: 14px;">${getEmailTranslation(language, 'passwordResetHtml.validFor')}</p>
    </div>
  `;

  return await sendEmail(email, subject, text, html);
};

/**
 * Відправка email "Зв'язатись з нами"
 */
export const sendContactUsEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string,
  phone?: string,
  language: string = 'en'
) => {
  // Email для адміністратора
  const adminSubject = getEmailTranslation(language, 'contactForm.adminSubject', { name, subject });
  const adminText = `
${getEmailTranslation(language, 'contactForm.adminText.name', { name })}
${getEmailTranslation(language, 'contactForm.adminText.email', { email })}
${phone ? getEmailTranslation(language, 'contactForm.adminText.phone', { phone }) : getEmailTranslation(language, 'contactForm.adminText.phone', { phone: 'Not specified' })}
${getEmailTranslation(language, 'contactForm.adminText.subject', { subject })}

${getEmailTranslation(language, 'contactForm.adminText.message')}
${message}
  `;
  
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${getEmailTranslation(language, 'contactForm.adminText.message')}</h2>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>${getEmailTranslation(language, 'contactForm.adminText.name', { name }).split(':')[0]}:</strong> ${name}</p>
        <p><strong>${getEmailTranslation(language, 'contactForm.adminText.email', { email }).split(':')[0]}:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>${getEmailTranslation(language, 'contactForm.adminText.phone', { phone }).split(':')[0]}:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
        <p><strong>${getEmailTranslation(language, 'contactForm.adminText.subject', { subject }).split(':')[0]}:</strong> ${subject}</p>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563eb;">
        <h3 style="margin-top: 0;">${getEmailTranslation(language, 'contactForm.adminText.message')}</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    </div>
  `;

  // Email підтвердження для користувача
  const userSubject = getEmailTranslation(language, 'contactForm.userSubject');
  const userText = `
${getEmailTranslation(language, 'contactForm.userText.greeting', { name })}

${getEmailTranslation(language, 'contactForm.userText.thankYou')}

${getEmailTranslation(language, 'contactForm.userText.yourMessage')}
${message}

${getEmailTranslation(language, 'contactForm.userText.signature')}
  `;
  
  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${getEmailTranslation(language, 'contactForm.userText.greeting', { name }).replace(',', '').replace('!', '')}!</h2>
      <p>${getEmailTranslation(language, 'contactForm.userText.greeting', { name })}</p>
      <p>${getEmailTranslation(language, 'contactForm.userText.thankYou')}</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">${getEmailTranslation(language, 'contactForm.userText.yourMessage')}</h3>
        <p style="white-space: pre-wrap; color: #6b7280;">${message}</p>
      </div>
      
      <p>${getEmailTranslation(language, 'contactForm.userText.contactInfo')}</p>
      <ul style="color: #6b7280;">
        <li>${getEmailTranslation(language, 'contactForm.userText.email', { adminEmail: ADMIN_EMAIL })}</li>
        <li>${getEmailTranslation(language, 'contactForm.userText.phone')}</li>
      </ul>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #6b7280; font-size: 14px;">
          ${getEmailTranslation(language, 'contactForm.userText.signature')}
        </p>
      </div>
    </div>
  `;

  try {
    // Відправляємо email адміністратору
    await sendEmail(ADMIN_EMAIL, adminSubject, adminText, adminHtml, email);
    
    // Відправляємо підтвердження користувачу
    await sendEmail(email, userSubject, userText, userHtml);
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send contact email.');
  }
};

/**
 * Відправка email з нотифікацією про нову вакансію
 */
export const sendNewJobNotificationEmail = async (
  candidateEmail: string,
  jobTitle: string,
  companyName: string,
  jobUrl: string
) => {
  const subject = `Нова вакансія: ${jobTitle} в ${companyName}`;
  const text = `Нова вакансія відповідає вашим критеріям: ${jobTitle} в ${companyName}. Переглянути: ${jobUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Нова вакансія для вас!</h2>
      <p>Ми знайшли вакансію, яка може вас зацікавити:</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">${jobTitle}</h3>
        <p style="color: #6b7280; font-size: 16px;"><strong>Компанія:</strong> ${companyName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${jobUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Переглянути вакансію
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Ви отримали це повідомлення тому, що підписалися на сповіщення про нові вакансії.
        <a href="#" style="color: #2563eb;">Відписатися</a>
      </p>
    </div>
  `;

  return await sendEmail(candidateEmail, subject, text, html);
};

/**
 * Відправка email з нотифікацією про нову заявку
 */
export const sendNewApplicationNotificationEmail = async (
  employerEmail: string,
  candidateName: string,
  jobTitle: string,
  applicationUrl: string
) => {
  const subject = `Нова заявка на вакансію: ${jobTitle}`;
  const text = `Нова заявка від ${candidateName} на вакансію ${jobTitle}. Переглянути: ${applicationUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Нова заявка на вакансію!</h2>
      <p>Ви отримали нову заявку на вакансію:</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">${jobTitle}</h3>
        <p style="color: #6b7280; font-size: 16px;"><strong>Кандидат:</strong> ${candidateName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${applicationUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Переглянути заявку
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Не забудьте відповісти кандидату протягом 24 годин для кращого досвіду.
      </p>
    </div>
  `;

  return await sendEmail(employerEmail, subject, text, html);
};

export default {
  sendEmail,
  sendConfirmationEmail,
  sendLoginConfirmationEmail,
  sendPasswordResetEmail,
  sendContactUsEmail,
  sendNewJobNotificationEmail,
  sendNewApplicationNotificationEmail,
};
