import { Resend } from 'resend';
import { sendEmail } from '../utils/mailer.js';
import process from 'process';

// Initialize Resend only if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Send Premium Deluxe welcome email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @returns {Promise<Object>} - Result of email sending
 */
export const sendPremiumDeluxeWelcomeEmail = async (userEmail, userName = '') => {
  const greeting = userName ? `Дорогой ${userName},` : 'Дорогой пользователь,';
  
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Добро пожаловать в Premium Deluxe!</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1976d2;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          line-height: 1.8;
        }
        .highlight {
          background-color: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #1976d2;
          margin: 20px 0;
        }
        .contact-info {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .email-link {
          color: #1976d2;
          text-decoration: none;
          font-weight: bold;
        }
        .email-link:hover {
          text-decoration: underline;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          font-size: 14px;
          color: #6c757d;
          text-align: center;
        }
        .features {
          margin: 20px 0;
        }
        .feature {
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        .feature-icon {
          color: #28a745;
          margin-right: 10px;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">WorkNow</div>
          <div class="title">🎉 Добро пожаловать в Premium Deluxe!</div>
        </div>
        
        <div class="content">
          <p>${greeting}</p>
          
          <p>Спасибо вам за доверие и выбор нашего сервиса! Мы очень рады приветствовать вас в эксклюзивном клубе Premium Deluxe пользователей WorkNow.</p>
          
          <div class="highlight">
            <strong>✨ Ваша подписка Premium Deluxe успешно активирована!</strong>
            <p style="margin: 10px 0 0 0;">Теперь у вас есть доступ ко всем премиум функциям и эксклюзивным возможностям.</p>
          </div>
          
          <div class="features">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">🚀 Ваши новые возможности:</h3>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Все из Pro тарифа</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Персональный менеджер</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Активное продвижение ваших вакансий через Facebook</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Персональная рассылка лучших кандидатов под ваши требования</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Публикации ваших вакансий в телеграм канале</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Личный подбор кандидатов под ваши требования</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Организация собеседований</span>
            </div>
          </div>
          
          <div class="contact-info">
            <h4 style="color: #2c3e50; margin-bottom: 10px;">📧 Активация автопостинга</h4>
            <p>Для активации эксклюзивной функции автопостинга и получения персональной поддержки, напишите вашему персональному менеджеру:</p>
            <p style="margin: 15px 0;">
              <a href="mailto:peterbaikov12@gmail.com" class="email-link">peterbaikov12@gmail.com</a>
            </p>
            <p style="font-size: 14px; color: #6c757d; margin-top: 10px;">
              Наш менеджер поможет настроить автопостинг и ответит на все ваши вопросы.
            </p>
          </div>
          
          <p>Если у вас возникнут любые вопросы или потребуется помощь, не стесняйтесь обращаться к нам. Мы всегда готовы помочь!</p>
          
          <p>Еще раз спасибо за выбор WorkNow. Мы ценим ваше доверие и будем работать над тем, чтобы сделать наш сервис еще лучше для вас.</p>
          
          <p style="margin-top: 25px;">
            С наилучшими пожеланиями,<br>
            <strong>Команда WorkNow</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>© 2025 WorkNow. Все права защищены.</p>
          <p>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Добро пожаловать в Premium Deluxe!

${greeting}

Спасибо вам за доверие и выбор нашего сервиса! Мы очень рады приветствовать вас в эксклюзивном клубе Premium Deluxe пользователей WorkNow.

✨ Ваша подписка Premium Deluxe успешно активирована!
Теперь у вас есть доступ ко всем премиум функциям и эксклюзивным возможностям.

🚀 Ваши новые возможности:
✅ Все из Pro тарифа
✅ Персональный менеджер
✅ Активное продвижение ваших вакансий через Facebook
✅ Эксклюзивная функция автопостинга
✅ Персональная рассылка лучших кандидатов под ваши требования
✅ Публикации ваших вакансий в телеграм канале
✅ Личный подбор кандидатов под ваши требования
✅ Организация собеседований

📧 Активация автопостинга
Для активации эксклюзивной функции автопостинга и получения персональной поддержки, напишите вашему персональному менеджеру: peterbaikov12@gmail.com

Наш менеджер поможет настроить автопостинг и ответит на все ваши вопросы.

Если у вас возникнут любые вопросы или потребуется помощь, не стесняйтесь обращаться к нам. Мы всегда готовы помочь!

Еще раз спасибо за выбор WorkNow. Мы ценим ваше доверие и будем работать над тем, чтобы сделать наш сервис еще лучше для вас.

С наилучшими пожеланиями,
Команда WorkNow

---
© 2025 WorkNow. Все права защищены.
Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.
  `;

  try {
    // Try Resend first (if available)
    const resend = getResend();
    if (resend) {
      console.log('📧 Attempting to send Premium Deluxe welcome email via Resend...');
      
      const result = await resend.emails.send({
        from: 'WorkNow <onboarding@resend.dev>',
        to: userEmail,
        subject: '🎉 Добро пожаловать в Premium Deluxe! - WorkNow',
        html: emailHtml,
        text: emailText,
      });
      
      console.log('✅ Premium Deluxe welcome email sent via Resend:', userEmail);
      return { success: true, messageId: result.id || 'resend-' + Date.now() };
    } else {
      throw new Error('RESEND_API_KEY not available');
    }
  } catch (resendError) {
    console.error('❌ Resend failed, trying Gmail fallback:', resendError);
    
    try {
      // Fallback to Gmail
      console.log('📧 Attempting to send Premium Deluxe welcome email via Gmail...');
      
      await sendEmail({
        to: userEmail,
        subject: '🎉 Добро пожаловать в Premium Deluxe! - WorkNow',
        html: emailHtml,
        text: emailText,
      });
      
      console.log('✅ Premium Deluxe welcome email sent via Gmail:', userEmail);
      return { success: true, messageId: 'gmail-' + Date.now() };
    } catch (gmailError) {
      console.error('❌ Gmail also failed:', gmailError);
      throw new Error(`Failed to send Premium Deluxe welcome email: Resend error - ${resendError.message}, Gmail error - ${gmailError.message}`);
    }
  }
};

/**
 * Send Pro plan welcome email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @returns {Promise<Object>} - Result of email sending
 */
export const sendProWelcomeEmail = async (userEmail, userName = '') => {
  const greeting = userName ? `Дорогой ${userName},` : 'Дорогой пользователь,';
  
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Добро пожаловать в Pro!</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1976d2;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          line-height: 1.8;
        }
        .highlight {
          background-color: #e8f5e8;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #28a745;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          font-size: 14px;
          color: #6c757d;
          text-align: center;
        }
        .features {
          margin: 20px 0;
        }
        .feature {
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        .feature-icon {
          color: #28a745;
          margin-right: 10px;
          font-size: 18px;
        }
        .pro-badge {
          background-color: #1976d2;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">WorkNow</div>
          <div class="pro-badge">PRO</div>
          <div class="title">🚀 Добро пожаловать в Pro!</div>
        </div>
        
        <div class="content">
          <p>${greeting}</p>
          
          <p>Спасибо вам за доверие и выбор нашего сервиса! Мы очень рады приветствовать вас в клубе Pro пользователей WorkNow.</p>
          
          <div class="highlight">
            <strong>✨ Ваша подписка Pro успешно активирована!</strong>
            <p style="margin: 10px 0 0 0;">Теперь у вас есть доступ ко всем профессиональным функциям для эффективного поиска работы.</p>
          </div>
          
          <div class="features">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">🎯 Ваши новые возможности:</h3>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>До 10 объявлений</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Открывать данные соискателей без ограничений</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Вакансии в топе</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Выделение цветом</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Расширенные фильтры для рассылки</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✅</span>
              <span>Приоритетная поддержка</span>
            </div>
          </div>
          
          <p>Теперь вы можете:</p>
          <ul style="margin: 20px 0; padding-left: 20px;">
            <li>Размещать до 10 объявлений о вакансиях</li>
            <li>Получать полную информацию о соискателях</li>
            <li>Ваши вакансии будут отображаться в топе поиска</li>
            <li>Использовать расширенные фильтры для поиска кандидатов</li>
            <li>Получать приоритетную поддержку от нашей команды</li>
          </ul>
          
          <p>Если у вас возникнут любые вопросы или потребуется помощь, не стесняйтесь обращаться к нам. Мы всегда готовы помочь!</p>
          
          <p>Еще раз спасибо за выбор WorkNow. Мы ценим ваше доверие и будем работать над тем, чтобы сделать наш сервис еще лучше для вас.</p>
          
          <p style="margin-top: 25px;">
            С наилучшими пожеланиями,<br>
            <strong>Команда WorkNow</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>© 2025 WorkNow. Все права защищены.</p>
          <p>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Добро пожаловать в Pro!

${greeting}

Спасибо вам за доверие и выбор нашего сервиса! Мы очень рады приветствовать вас в клубе Pro пользователей WorkNow.

✨ Ваша подписка Pro успешно активирована!
Теперь у вас есть доступ ко всем профессиональным функциям для эффективного поиска работы.

🎯 Ваши новые возможности:
✅ До 10 объявлений
✅ Открывать данные соискателей без ограничений
✅ Вакансии в топе
✅ Выделение цветом
✅ Расширенные фильтры для рассылки
✅ Приоритетная поддержка

Теперь вы можете:
• Размещать до 10 объявлений о вакансиях
• Получать полную информацию о соискателях
• Ваши вакансии будут отображаться в топе поиска
• Использовать расширенные фильтры для поиска кандидатов
• Получать приоритетную поддержку от нашей команды

Если у вас возникнут любые вопросы или потребуется помощь, не стесняйтесь обращаться к нам. Мы всегда готовы помочь!

Еще раз спасибо за выбор WorkNow. Мы ценим ваше доверие и будем работать над тем, чтобы сделать наш сервис еще лучше для вас.

С наилучшими пожеланиями,
Команда WorkNow

---
© 2025 WorkNow. Все права защищены.
Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.
  `;

  try {
    // Try Resend first (if available)
    const resend = getResend();
    if (resend) {
      console.log('📧 Attempting to send Pro welcome email via Resend...');
      
      const result = await resend.emails.send({
        from: 'WorkNow <onboarding@resend.dev>',
        to: userEmail,
        subject: '🚀 Добро пожаловать в Pro! - WorkNow',
        html: emailHtml,
        text: emailText,
      });
      
      console.log('✅ Pro welcome email sent via Resend:', userEmail);
      return { success: true, messageId: result.id || 'resend-' + Date.now() };
    } else {
      throw new Error('RESEND_API_KEY not available');
    }
  } catch (resendError) {
    console.error('❌ Resend failed, trying Gmail fallback:', resendError);
    
    try {
      // Fallback to Gmail
      console.log('📧 Attempting to send Pro welcome email via Gmail...');
      
      await sendEmail({
        to: userEmail,
        subject: '🚀 Добро пожаловать в Pro! - WorkNow',
        html: emailHtml,
        text: emailText,
      });
      
      console.log('✅ Pro welcome email sent via Gmail:', userEmail);
      return { success: true, messageId: 'gmail-' + Date.now() };
    } catch (gmailError) {
      console.error('❌ Gmail also failed:', gmailError);
      throw new Error(`Failed to send Pro welcome email: Resend error - ${resendError.message}, Gmail error - ${gmailError.message}`);
    }
  }
}; 