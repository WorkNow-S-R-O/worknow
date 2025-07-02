import stripe from '../utils/stripe.js';
import { PrismaClient } from '@prisma/client';
import { sendTelegramNotification } from '../utils/telegram.js';
import { CLERK_SECRET_KEY } from '../config/clerkConfig.js';
import fetch from 'node-fetch';
const prisma = new PrismaClient();

// ✅ URL для продакшена
const FRONTEND_URL = process.env.FRONTEND_URL || "https://worknowjob.com";

export const createCheckoutSession = async (req, res) => {
  const { clerkUserId, priceId } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({ error: 'clerkUserId is required' });
  }

  try {
    // 🔹 Получаем пользователя из базы
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user || !user.email) {
      return res.status(404).json({ error: 'Пользователь не найден или отсутствует email' });
    }

    // ✅ Формируем ссылки для продакшена
    const successUrl = `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${FRONTEND_URL}/cancel`;

    // 🔹 Выбираем нужный priceId
    const defaultPriceId = 'price_1Qt5J0COLiDbHvw1IQNl90uU'; // 99₪
    const finalPriceId = priceId || defaultPriceId;

    // 🔹 Создаем Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { clerkUserId, priceId: finalPriceId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Ошибка при создании Checkout Session:', error);
    res.status(500).json({ error: 'Ошибка при создании сессии' });
  }
};

export const activatePremium = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const clerkUserId = session.metadata.clerkUserId; // Получаем ID пользователя
    const subscriptionId = session.subscription; // ID подписки в Stripe
    const priceId = session.metadata.priceId;

    if (session.payment_status === 'paid') {
      const user = await prisma.user.update({
        where: { clerkUserId },
        data: {
          isPremium: true,
          premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней подписки
          isAutoRenewal: !!subscriptionId,
          stripeSubscriptionId: subscriptionId || null,
          premiumDeluxe: priceId === 'price_1RfHjiCOLiDbHvw1repgIbnK',
        },
        include: { jobs: { include: { city: true } } }, // Подгружаем вакансии
      });

      // 🔹 Отправляем уведомление в Telegram
      await sendTelegramNotification(user, user.jobs);

      // Если deluxe — отправляем автоматическое сообщение
      if (priceId === 'price_1RfHjiCOLiDbHvw1repgIbnK') {
        // Можно кастомизировать текст и контакты менеджера
        await prisma.message.create({
          data: {
            clerkUserId,
            title: 'Добро пожаловать в Premium Deluxe!',
            body: 'Для активации функции автопостинга напишите вашему персональному менеджеру: <a href="mailto:peterbaikov12@gmail.com">peterbaikov12@gmail.com</a>',
            type: 'system',
          }
        });
        // Email отправится автоматически через триггер в контроллере messages.js
      } else {
        // Обычный премиум — поздравительное письмо и сообщение
        const title = 'Спасибо за покупку премиум-подписки на WorkNow!';
        const body = `Здравствуйте!<br><br>
          Спасибо, что приобрели премиум-подписку на WorkNow.<br>
          Ваша подписка активирована.<br>
          <b>Чек об оплате был отправлен на ваш электронный адрес.</b><br><br>
          Если у вас возникнут вопросы — пишите в поддержку!`;
        await prisma.message.create({
          data: {
            clerkUserId,
            title,
            body,
            type: 'system',
          }
        });
        // Email отправится автоматически через триггер в контроллере messages.js
      }

      // --- Обновляем publicMetadata в Clerk ---
      const publicMetadata = {
        isPremium: true,
        premiumDeluxe: priceId === 'price_1RfHjiCOLiDbHvw1repgIbnK',
      };
      await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({ public_metadata: publicMetadata }),
      });
      // --- конец обновления Clerk ---

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Платеж не прошел' });
    }
  } catch (error) {
    console.error('❌ Ошибка активации премиума:', error);
    res.status(500).json({ error: 'Ошибка активации премиума' });
  }
};

export const cancelAutoRenewal = async (req, res) => {

  const { clerkUserId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      console.error("❌ Ошибка: пользователь не найден.");
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (!user.isAutoRenewal) {
      console.warn("⚠️ Автопродление уже отключено.");
      return res.status(400).json({ error: 'Автопродление уже отключено' });
    }

    if (!user.stripeSubscriptionId) {
      // Нет Stripe-подписки, но автопродление включено — просто отключаем в базе
      console.warn(`⚠️ У пользователя ${user.email} нет stripeSubscriptionId, но isAutoRenewal=true. Отключаем только в базе.`);
      await prisma.user.update({
        where: { clerkUserId },
        data: { isAutoRenewal: false },
      });
      return res.json({ success: true, message: 'Автопродление подписки отключено (без Stripe).' });
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

    res.json({ success: true, message: 'Автопродление подписки отключено.' });
  } catch (error) {
    console.error('❌ Ошибка при отключении автообновления:', error);
    res.status(500).json({ error: 'Ошибка при отключении автообновления' });
  }
};

export const addPaymentHistory = async (req, res) => {
  const { clerkUserId, month, amount, type, date } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: {
        clerkUserId,
        month,
        amount,
        type,
        date: new Date(date),
      },
    });
    res.json({ success: true, payment });
  } catch (e) {
    console.error('Ошибка при добавлении платежа:', e);
    res.status(500).json({ error: 'Ошибка при добавлении платежа' });
  }
};

export const getPaymentHistory = async (req, res) => {
  const { clerkUserId } = req.query;

  if (!clerkUserId) {
    return res.status(400).json({ error: 'clerkUserId обязателен' });
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { clerkUserId },
      orderBy: { date: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    console.error('Ошибка при получении истории платежей:', error);
    res.status(500).json({ error: 'Ошибка при получении истории платежей' });
  }
};
