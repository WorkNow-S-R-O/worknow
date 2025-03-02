import stripe from '../utils/stripe.js';
import { PrismaClient } from '@prisma/client';
import { sendTelegramNotification } from '../utils/telegram.js';

const prisma = new PrismaClient();

export const createCheckoutSession = async (req, res) => {
  const { clerkUserId } = req.body;

  try {
    // 🔹 Получаем пользователя из базы
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });
    console.log("🔹 [DEBUG] Данные пользователя:", user);

    if (!user || !user.email) {
      return res.status(404).json({ error: 'Пользователь не найден или отсутствует email' });
    }

    // 🔹 Создаем Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email, // Теперь email берется из БД
      line_items: [
        {
          price: 'price_1Qt5J0COLiDbHvw1IQNl90uU', // Твой Price ID из Stripe
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: { clerkUserId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Ошибка при создании Checkout Session:', error);
    res.status(500).json({ error: 'Ошибка при создании сессии' });
  }
};

export const activatePremium = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const clerkUserId = session.metadata.clerkUserId; // Получаем ID пользователя
    const subscriptionId = session.subscription; // ID подписки в Stripe

    if (session.payment_status === 'paid') {
      const user = await prisma.user.update({
        where: { clerkUserId },
        data: {
          isPremium: true,
          premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней подписки
          isAutoRenewal: !!subscriptionId,
          stripeSubscriptionId: subscriptionId || null,
        },
        include: { jobs: { include: { city: true } } }, // Подгружаем вакансии
      });

      // 🔹 Отправляем уведомление в Telegram
      await sendTelegramNotification(user, user.jobs);

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
  console.log("🔹 [DEBUG] Запрос на отмену автопродления получен:", req.body);

  const { clerkUserId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    console.log("🔹 [DEBUG] Найден пользователь:", user);

    if (!user || !user.stripeSubscriptionId) {
      console.error("❌ Ошибка: подписка не найдена.");
      return res.status(404).json({ error: 'Подписка не найдена' });
    }

    if (!user.isAutoRenewal) {
      console.warn("⚠️ Автопродление уже отключено.");
      return res.status(400).json({ error: 'Автопродление уже отключено' });
    }

    // 🔹 Отключаем автопродление в Stripe
    console.log(`🔹 [DEBUG] Отправляем запрос в Stripe: отмена подписки ${user.stripeSubscriptionId}`);
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // 🔹 Обновляем статус в базе
    await prisma.user.update({
      where: { clerkUserId },
      data: { isAutoRenewal: false },
    });

    console.log("✅ [DEBUG] Автопродление успешно отключено!");

    res.json({ success: true, message: 'Автопродление подписки отключено.' });
  } catch (error) {
    console.error('❌ Ошибка при отключении автообновления:', error);
    res.status(500).json({ error: 'Ошибка при отключении автообновления' });
  }
};

