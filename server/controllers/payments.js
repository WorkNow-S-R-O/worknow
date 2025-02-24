import stripe from '../utils/stripe.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCheckoutSession = async (req, res) => {
  const { clerkUserId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription', // важно: теперь это subscription, а не payment
    line_items: [
      {
        price: 'price_1Qt63NCOLiDbHvw13PRhpenX', // твой Price ID из Stripe
        quantity: 1,
      },
    ],
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel',
    metadata: { clerkUserId },
  });

  res.json({ url: session.url });
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
          premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
