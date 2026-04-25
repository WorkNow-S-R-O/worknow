import stripe from '../utils/stripe.js';
import prisma from '../lib/prisma.js';
import { sendTelegramNotification } from '../utils/telegram.js';
import { CLERK_SECRET_KEY } from '../config/clerkConfig.js';
import {
	sendPremiumDeluxeWelcomeEmail,
	sendProWelcomeEmail,
} from '../services/premiumEmailService.js';
import fetch from 'node-fetch';

export const createCheckoutSession = async (req, res) => {
	const { clerkUserId, priceId } = req.body;

	if (!clerkUserId) {
		return res.status(400).json({ error: 'clerkUserId is required' });
	}

	let user, finalPriceId;

	try {
		// 🔹 Получаем пользователя из базы
		user = await prisma.user.findUnique({
			where: { clerkUserId },
		});

		if (!user || !user.email) {
			return res
				.status(404)
				.json({ error: 'Пользователь не найден или отсутствует email' });
		}

		// ✅ Формируем ссылки для продакшена - FORCE NEW DOMAIN
		const successUrl =
			'https://worknow.co.il/success?session_id={CHECKOUT_SESSION_ID}';
		const cancelUrl = 'https://worknow.co.il/cancel';

		// 🔹 Выбираем нужный priceId
		const defaultPriceId = 'price_1Qt5J0COLiDbHvw1IQNl90uU'; // Pro plan recurring subscription price ID
		finalPriceId = priceId || defaultPriceId;

		// 🔹 Проверяем существование price ID в Stripe
		try {
			await stripe.prices.retrieve(finalPriceId);
		} catch {
			// Fallback to default price ID
			finalPriceId = defaultPriceId;
		}

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

		// Provide more specific error messages
		if (
			error.type === 'StripeInvalidRequestError' &&
			error.message.includes('price')
		) {
			res.status(400).json({
				error: `Неверный price ID: ${priceId}. Пожалуйста, обратитесь к администратору.`,
			});
		} else {
			res.status(500).json({ error: 'Ошибка при создании сессии' });
		}
	}
};

export const activatePremium = async (req, res) => {
	const { sessionId } = req.body;

	console.log('🔍 activatePremium called with sessionId:', sessionId);

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		const clerkUserId = session.metadata.clerkUserId; // Получаем ID пользователя
		const subscriptionId = session.subscription; // ID подписки в Stripe
		const priceId = session.metadata.priceId;

		console.log('🔍 Activating premium with session data:', {
			sessionId,
			clerkUserId,
			subscriptionId,
			priceId,
			paymentStatus: session.payment_status,
		});

		if (session.payment_status === 'paid') {
			// Set premiumDeluxe flag for Deluxe subscriptions only (not Pro)
			const premiumDeluxe =
				priceId === 'price_1RfHjiCOLiDbHvw1repgIbnK' ||
				priceId === 'price_1Rfli2COLiDbHvw1xdMaguLf' ||
				priceId === 'price_1RqXuoCOLiDbHvw1LLew4Mo8' ||
				priceId === 'price_1RqXveCOLiDbHvw18RQxj2g6';

			console.log('🔍 Updating user with premium data:', {
				clerkUserId,
				priceId,
				premiumDeluxe,
				willSetPremiumDeluxe: premiumDeluxe,
			});

			const user = await prisma.user.update({
				where: { clerkUserId },
				data: {
					isPremium: true,
					premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней подписки
					isAutoRenewal: !!subscriptionId,
					stripeSubscriptionId: subscriptionId || null,
					premiumDeluxe: premiumDeluxe,
				},
				include: { jobs: { include: { city: true } } }, // Подгружаем вакансии
			});

			// User updated successfully

			// 🔹 Отправляем уведомление в Telegram
			await sendTelegramNotification(user, user.jobs);

			// Если deluxe — отправляем автоматическое сообщение и email
			// Deluxe price IDs: price_1RfHjiCOLiDbHvw1repgIbnK, price_1Rfli2COLiDbHvw1xdMaguLf, price_1RqXuoCOLiDbHvw1LLew4Mo8, price_1RqXveCOLiDbHvw18RQxj2g6
			// Pro price ID: price_1Qt63NCOLiDbHvw13PRhpenX (excluded from deluxe condition)
			if (
				priceId === 'price_1RfHjiCOLiDbHvw1repgIbnK' ||
				priceId === 'price_1Rfli2COLiDbHvw1xdMaguLf' ||
				priceId === 'price_1RqXuoCOLiDbHvw1LLew4Mo8' ||
				priceId === 'price_1RqXveCOLiDbHvw18RQxj2g6'
			) {
				// Можно кастомизировать текст и контакты менеджера
				await prisma.message.create({
					data: {
						clerkUserId,
						title: 'Добро пожаловать в Premium Deluxe!',
						body: 'Для активации функции автопостинга напишите вашему персональному менеджеру: <a href="mailto:peterbaikov12@gmail.com">peterbaikov12@gmail.com</a>',
						type: 'system',
					},
				});

				// Send Premium Deluxe welcome email
				try {
					const userName = user.firstName
						? `${user.firstName} ${user.lastName || ''}`.trim()
						: '';
					await sendPremiumDeluxeWelcomeEmail(user.email, userName);
					console.log(
						'✅ Premium Deluxe welcome email sent successfully to:',
						user.email,
					);
				} catch (emailError) {
					console.error(
						'❌ Failed to send Premium Deluxe welcome email:',
						emailError,
					);
					// Don't fail the entire process if email fails
				}
			} else {
				// Pro subscription — поздравительное письмо и сообщение
				const title = 'Спасибо за покупку Pro подписки на WorkNow!';
				const body = `Здравствуйте!<br><br>
          Спасибо, что приобрели Pro подписку на WorkNow.<br>
          Ваша подписка активирована.<br>
          <b>Чек об оплате был отправлен на ваш электронный адрес.</b><br><br>
          Если у вас возникнут вопросы — пишите в поддержку!`;
				await prisma.message.create({
					data: {
						clerkUserId,
						title,
						body,
						type: 'system',
					},
				});

				// Send Pro welcome email
				try {
					const userName = user.firstName
						? `${user.firstName} ${user.lastName || ''}`.trim()
						: '';
					await sendProWelcomeEmail(user.email, userName);
					console.log('✅ Pro welcome email sent successfully to:', user.email);
				} catch (emailError) {
					console.error('❌ Failed to send Pro welcome email:', emailError);
					// Don't fail the entire process if email fails
				}
			}

			// --- Обновляем publicMetadata в Clerk ---
			const publicMetadata = {
				isPremium: true,
				premiumDeluxe:
					priceId === 'price_1RfHjiCOLiDbHvw1repgIbnK' ||
					priceId === 'price_1Rfli2COLiDbHvw1xdMaguLf' ||
					priceId === 'price_1RqXuoCOLiDbHvw1LLew4Mo8' ||
					priceId === 'price_1RqXveCOLiDbHvw18RQxj2g6',
			};
			await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${CLERK_SECRET_KEY}`,
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
			console.error('❌ Ошибка: пользователь не найден.');
			return res.status(404).json({ error: 'Пользователь не найден' });
		}

		if (!user.isAutoRenewal) {
			console.warn('⚠️ Автопродление уже отключено.');
			return res.status(400).json({ error: 'Автопродление уже отключено' });
		}

		if (!user.stripeSubscriptionId) {
			// Нет Stripe-подписки, но автопродление включено — просто отключаем в базе
			console.warn(
				`⚠️ У пользователя ${user.email} нет stripeSubscriptionId, но isAutoRenewal=true. Отключаем только в базе.`,
			);
			await prisma.user.update({
				where: { clerkUserId },
				data: { isAutoRenewal: false },
			});
			return res.json({
				success: true,
				message: 'Автопродление подписки отключено (без Stripe).',
			});
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

export const renewAutoRenewal = async (req, res) => {
	const { clerkUserId } = req.body;
	try {
		const user = await prisma.user.findUnique({ where: { clerkUserId } });
		if (!user) {
			return res.status(404).json({ error: 'Пользователь не найден' });
		}
		if (user.isAutoRenewal) {
			return res.status(400).json({ error: 'Автопродление уже включено' });
		}
		await prisma.user.update({
			where: { clerkUserId },
			data: { isAutoRenewal: true },
		});
		res.json({ success: true, message: 'Автопродление подписки включено.' });
	} catch (error) {
		console.error('❌ Ошибка при включении автопродления:', error);
		res.status(500).json({ error: 'Ошибка при включении автопродления' });
	}
};

export const getStripePaymentHistory = async (req, res) => {
	const { clerkUserId, limit = 10, offset = 0 } = req.query;
	try {
		const user = await prisma.user.findUnique({ where: { clerkUserId } });
		if (!user) {
			return res.status(404).json({ error: 'Пользователь не найден' });
		}
		// Получаем stripeCustomerId или email
		const customerEmail = user.email;
		// Получаем клиента Stripe по email (если нет stripeCustomerId)
		let customerId = user.stripeCustomerId;
		if (!customerId) {
			// Поиск по email
			const customers = await stripe.customers.list({
				email: customerEmail,
				limit: 1,
			});
			if (customers.data.length > 0) {
				customerId = customers.data[0].id;
			}
		}
		if (!customerId) {
			return res.json({ payments: [], total: 0 });
		}
		// Получаем invoices (можно заменить на charges, если нужно)
		const invoices = await stripe.invoices.list({
			customer: customerId,
			limit: Number(limit),
			starting_after: offset ? undefined : undefined, // Stripe не поддерживает offset, нужна своя пагинация через starting_after
		});
		// Для простоты: только limit, без offset (Stripe рекомендует keyset-пагинацию)
		// Можно реализовать пагинацию через last invoice id (starting_after)
		const payments = invoices.data.map((inv) => ({
			id: inv.id,
			amount: inv.amount_paid / 100,
			currency: inv.currency,
			date: new Date(inv.created * 1000),
			status: inv.status,
			description: inv.description,
			period: inv.period_start ? new Date(inv.period_start * 1000) : null,
			type: inv.lines.data[0]?.description || 'Premium',
		}));
		res.json({ payments, total: invoices.data.length });
	} catch (error) {
		console.error('Ошибка при получении истории Stripe:', error);
		res.status(500).json({ error: 'Ошибка при получении истории Stripe' });
	}
};
