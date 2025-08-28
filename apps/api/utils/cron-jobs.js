import cron from 'node-cron';
import stripe from './stripe.js';
import nodemailer from 'nodemailer';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { checkAndSendFilteredNewsletter } from '../services/newsletterService.js';

dotenv.config();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Настраиваем транспорт для отправки email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true для 465, false для 587
      auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

// Функция для проверки объявлений и отправки уведомлений
const checkLowRankedJobs = async () => {
  console.log("🔍 Проверка объявлений, которые опустились низко...");

  try {
    const jobsPerPage = 10; // Количество объявлений на страницу
    const minPage = 3; // Если объявление на 3-й странице или ниже — отправляем уведомление

    // Получаем все объявления с сортировкой
    const jobs = await prisma.job.findMany({
      include: {
        user: true,
      },
      orderBy: [
        { boostedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Проверяем, есть ли вообще объявления
    if (jobs.length === 0) {
      console.log("📩 Нет объявлений для проверки");
      return;
    }

    // Группируем объявления по страницам
    const pagedJobs = jobs.reduce((acc, job, index) => {
      const page = Math.floor(index / jobsPerPage) + 1;
      if (page >= minPage) {
        acc.push({ ...job, page });
      }
      return acc;
    }, []);

    // Проверяем, есть ли объявления на 3-й странице или ниже
    if (pagedJobs.length === 0) {
      console.log("📩 Нет объявлений на 3-й странице или ниже");
      return;
    }

    console.log(`📩 Готовим к отправке ${pagedJobs.length} уведомлений для объявлений на страницах ${minPage}+...`);

    // Собираем пользователей, которым надо отправить уведомления
    const usersToNotify = new Map();

    pagedJobs.forEach((job) => {
      if (job.user?.email) {
        if (!usersToNotify.has(job.user.email)) {
          usersToNotify.set(job.user.email, []);
        }
        usersToNotify.get(job.user.email).push(job);
      }
    });

    // Проверяем, есть ли пользователи для уведомления
    if (usersToNotify.size === 0) {
      console.log("📩 Нет пользователей для отправки уведомлений");
      return;
    }

    console.log(`📩 Отправляем уведомления ${usersToNotify.size} пользователям...`);

    // Отправка email
    for (const [email, jobs] of usersToNotify.entries()) {
      const jobTitles = jobs.map((j) => `- ${j.title} (страница ${j.page})`).join('\n');
      
      const mailOptions = {
        from: `"Worknow Notifications" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Ваши объявления опустились вниз',
        text: `Здравствуйте!\n\nВаши объявления опустились на страницу ${minPage} или ниже:\n\n${jobTitles}\n\nРекомендуем поднять их, чтобы привлечь больше откликов.\n\nПоднимите объявления здесь: https://worknow.co.il/my-advertisements\n\nС уважением, Команда Worknow.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📩 Уведомление отправлено пользователю ${email} (${jobs.length} объявлений)`);
      } catch (emailError) {
        console.error(`❌ Ошибка отправки email пользователю ${email}:`, emailError);
      }
    }

    console.log(`✅ Проверка завершена. Уведомления отправлены ${usersToNotify.size} пользователям`);

  } catch (error) {
    console.error("❌ Ошибка при проверке объявлений:", error);
  }
};

export const cancelAutoRenewal = async (req, res) => {
  const { clerkUserId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({ error: 'Подписка не найдена' });
    }

    if (!user.isAutoRenewal) {
      return res.status(400).json({ error: 'Автопродление уже отключено' });
    }

    // 🔹 Отключаем автопродление в Stripe
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // 🔹 Обновляем статус в базе
    await prisma.user.update({
      where: { clerkUserId },
      data: { isAutoRenewal: false },
    });

    // 🔹 Отправляем email пользователю

    console.log(`📩 [DEBUG] Готовимся отправить письмо на ${user.email}`);


    const mailOptions = {
      // eslint-disable-next-line no-undef
      from: `"Worknow" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Автопродление подписки отключено",
      text: `Здравствуйте, ${user.firstName || "пользователь"}!\n\nВы успешно отключили автопродление подписки. Ваша премиум-подписка останется активной до ${user.premiumEndsAt.toLocaleDateString()}.\n\nСпасибо, что пользуетесь Worknow!`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Письмо об отключении автопродления отправлено на ${user.email}`);

    res.json({ success: true, message: 'Автопродление подписки отключено.' });
  } catch (error) {
    console.error(' Ошибка при отключении автообновления:', error);
    res.status(500).json({ error: 'Ошибка при отключении автообновления' });
  }
};

// Запуск cron-задачи каждые 5 дней в 08:00
cron.schedule('0 8 */5 * *', () => {
  console.log("⏰ Запускаем проверку объявлений (каждые 5 дней)...");
  checkLowRankedJobs();
}, {
  timezone: "Europe/Moscow",
});

// Крон-задача для отключения просроченного премиума
const disableExpiredPremiums = async () => {
  try {
    const result = await prisma.user.updateMany({
      where: {
        isPremium: true,
        isAutoRenewal: false,
        premiumEndsAt: { lt: new Date() }
      },
      data: { isPremium: false }
    });
    if (result.count > 0) {
      console.log(`⏰ Отключено премиумов: ${result.count}`);
    }
  } catch (error) {
    console.error('❌ Ошибка при отключении просроченного премиума:', error);
  }
};

// Запуск каждый час
cron.schedule('0 * * * *', () => {
  console.log('⏰ Проверка просроченных премиумов...');
  disableExpiredPremiums();
}, {
  timezone: 'Europe/Prague',
});

// Newsletter automation function
const checkAndSendNewsletter = async () => {
  try {
    console.log("📧 Проверка новых соискателей для рассылки...");

    // Get candidates created in the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const newCandidates = await prisma.seeker.findMany({
      where: {
        createdAt: {
          gte: yesterday
        },
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📧 Найдено ${newCandidates.length} новых соискателей за последние 24 часа`);

    if (newCandidates.length >= 5) {
      // Get all active subscribers
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true }
      });

      if (subscribers.length === 0) {
        console.log("📧 Нет активных подписчиков для рассылки");
        return;
      }

      console.log(`📧 Отправляем рассылку ${subscribers.length} подписчикам`);

      // Generate email content
      const emailContent = generateNewsletterContent(newCandidates);
      const emailSubject = `Найдено ${newCandidates.length} новых соискателей`;

      // Send emails to all subscribers
      const emailPromises = subscribers.map(subscriber => 
        resend.emails.send({
          from: 'WorkNow <noreply@worknow.com>',
          to: subscriber.email,
          subject: emailSubject,
          html: emailContent
        })
      );

      await Promise.all(emailPromises);

      console.log(`📧 Рассылка успешно отправлена ${subscribers.length} подписчикам`);
    } else {
      console.log(`📧 Недостаточно новых соискателей для автоматической рассылки (${newCandidates.length}/5)`);
    }

  } catch (error) {
    console.error("❌ Ошибка при автоматической рассылке:", error);
  }
};

// Generate newsletter email content
const generateNewsletterContent = (candidates) => {
  const candidatesHtml = candidates.map(candidate => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">
        ${candidate.name} ${candidate.gender ? `(${candidate.gender})` : ''}
      </h3>
      <p style="margin: 5px 0; color: #666;">
        <strong>Телефон:</strong> ${candidate.contact || 'Не указан'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Город:</strong> ${candidate.city || 'Не указан'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Занятость:</strong> ${candidate.employment || 'Не указана'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Категория:</strong> ${candidate.category || 'Не указана'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Опыт:</strong> ${candidate.experience || 'Не указан'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Языки:</strong> ${candidate.languages ? candidate.languages.join(', ') : 'Не указаны'}
      </p>
      <p style="margin: 10px 0 0 0; color: #333; font-style: italic;">
        "${candidate.description || 'Описание не указано'}"
      </p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Новые соискатели</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #1976d2; text-align: center; margin-bottom: 30px;">
          WorkNow - Новые соискатели
        </h1>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1976d2; margin: 0 0 10px 0;">
            Для вас найдено ${candidates.length} новых соискателей
          </h2>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
            Обратите внимание на соискателей:
          </h3>
          ${candidatesHtml}
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 30px;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Наши новости:</h3>
          <p style="margin: 5px 0; color: #666;">
            Открыт вотсапп-чат проекта Авода
          </p>
          <p style="margin: 5px 0; color: #666;">
            Для всех желающих получать максимально оперативно свежую информацию о соискателях, анонсы и новости Системы, открыт вотсапп - чат. Присоединяйтесь !!!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Вы получаете эту рассылку потому, что зарегистрировались на нашем сайте.
          </p>
          <p style="color: #666; font-size: 12px; margin: 5px 0;">
            <a href="https://worknow.com/unsubscribe" style="color: #1976d2; text-decoration: none;">
              Отписаться от рассылки
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Запуск cron-задачи для рассылки каждый день в 10:00
cron.schedule('0 10 * * *', () => {
  console.log("⏰ Запускаем проверку новых соискателей для рассылки...");
  checkAndSendNewsletter();
}, {
  timezone: "Europe/Moscow",
});

// Запуск cron-задачи для отфильтрованной рассылки каждый час
cron.schedule('0 * * * *', () => {
  console.log("⏰ Запускаем проверку отфильтрованных кандидатов...");
  checkAndSendFilteredNewsletter();
}, {
  timezone: "Europe/Moscow",
});

export { disableExpiredPremiums };
export { checkLowRankedJobs };
export { checkAndSendNewsletter };
export { checkAndSendFilteredNewsletter };
