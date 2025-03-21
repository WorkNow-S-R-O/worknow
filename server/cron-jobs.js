import cron from 'node-cron';
import stripe from './utils/stripe.js';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

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

    // Группируем объявления по страницам
    const pagedJobs = jobs.reduce((acc, job, index) => {
      const page = Math.floor(index / jobsPerPage) + 1;
      if (page >= minPage) {
        acc.push({ ...job, page });
      }
      return acc;
    }, []);

    console.log(`📩 Готовим к отправке ${pagedJobs.length} уведомлений...`);

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

    // Отправка email
    for (const [email, jobs] of usersToNotify.entries()) {
      const jobTitles = jobs.map((j) => `- ${j.title} (страница ${j.page})`).join('\n');
      
      const mailOptions = {
        from: `"Worknow Notifications" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Ваши объявления опустились вниз',
        text: `Здравствуйте!\n\nВаши объявления опустились на страницу ${minPage} или ниже:\n\n${jobTitles}\n\nРекомендуем поднять их, чтобы привлечь больше откликов.\n\nПоднимите объявления здесь: https://worknowjob.com/my-advertisements\n\nС уважением, Команда Worknow.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📩 Уведомление отправлено пользователю ${email}`);
    }

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

// Запуск cron-задачи каждый день в 08:00
cron.schedule('0 8 * * *', () => {
  console.log("⏰ Запускаем проверку объявлений...");
  checkLowRankedJobs();
}, {
  timezone: "Europe/Moscow",
});

export { checkLowRankedJobs };
