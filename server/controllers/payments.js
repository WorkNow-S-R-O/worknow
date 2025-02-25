import stripe from '../utils/stripe.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCheckoutSession = async (req, res) => {
  const { clerkUserId } = req.body;

  try {
    // 🔹 Получаем пользователя из базы
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

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
          price: 'price_1Qt63NCOLiDbHvw13PRhpenX', // Твой Price ID из Stripe
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
  const { sessionId, clerkUserId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      await prisma.user.update({
        where: { clerkUserId },
        data: {
          isPremium: true,
          premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней подписки
        },
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Платеж не прошел' });
    }
  } catch (error) {
    console.error('Ошибка активации премиума:', error);
    res.status(500).json({ error: 'Ошибка активации премиума' });
  }
};
