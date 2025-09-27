import { vi } from 'vitest';

// Mock Stripe
export const mockStripe = {
	prices: {
		retrieve: vi.fn(),
	},
	checkout: {
		sessions: {
			create: vi.fn(),
			retrieve: vi.fn(),
		},
	},
	subscriptions: {
		update: vi.fn(),
	},
	customers: {
		list: vi.fn(),
	},
	invoices: {
		list: vi.fn(),
	},
};

// Mock Prisma
export const mockPrisma = {
	user: {
		findUnique: vi.fn(),
		update: vi.fn(),
	},
	payment: {
		create: vi.fn(),
		findMany: vi.fn(),
	},
	message: {
		create: vi.fn(),
	},
};

// Mock services
export const mockServices = {
	sendTelegramNotification: vi.fn(),
	sendPremiumDeluxeWelcomeEmail: vi.fn(),
	sendProWelcomeEmail: vi.fn(),
};

// Mock fetch
export const mockFetch = vi.fn();

// Mock console methods
export const mockConsoleLog = vi
	.spyOn(console, 'log')
	.mockImplementation(() => {});
export const mockConsoleError = vi
	.spyOn(console, 'error')
	.mockImplementation(() => {});
export const mockConsoleWarn = vi
	.spyOn(console, 'warn')
	.mockImplementation(() => {});

// Mock request and response objects
export const mockRequest = {
	body: {
		clerkUserId: 'user_123',
		priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
		sessionId: 'cs_test_123',
		month: '2024-01',
		amount: 100,
		type: 'subscription',
		date: '2024-01-01',
	},
	query: {
		clerkUserId: 'user_123',
		limit: '10',
		offset: '0',
	},
};

export const mockResponse = {
	json: vi.fn(),
	status: vi.fn().mockReturnThis(),
};

// Mock user data
export const mockUserData = {
	validUser: {
		id: 1,
		clerkUserId: 'user_123',
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
		premiumEndsAt: null,
		isAutoRenewal: false,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		stripeCustomerId: null,
		jobs: [],
	},

	premiumUser: {
		id: 2,
		clerkUserId: 'user_456',
		email: 'premium@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		isPremium: true,
		premiumEndsAt: new Date('2024-02-01'),
		isAutoRenewal: true,
		stripeSubscriptionId: 'sub_123',
		premiumDeluxe: false,
		stripeCustomerId: 'cus_123',
		jobs: [],
	},

	premiumDeluxeUser: {
		id: 3,
		clerkUserId: 'user_789',
		email: 'deluxe@example.com',
		firstName: 'Bob',
		lastName: 'Johnson',
		isPremium: true,
		premiumEndsAt: new Date('2024-02-01'),
		isAutoRenewal: true,
		stripeSubscriptionId: 'sub_456',
		premiumDeluxe: true,
		stripeCustomerId: 'cus_456',
		jobs: [],
	},

	userWithoutEmail: {
		id: 4,
		clerkUserId: 'user_000',
		email: null,
		firstName: 'No',
		lastName: 'Email',
		isPremium: false,
		premiumEndsAt: null,
		isAutoRenewal: false,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		stripeCustomerId: null,
		jobs: [],
	},
};

// Mock Stripe data
export const mockStripeData = {
	validPrice: {
		id: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
		active: true,
		currency: 'usd',
		unit_amount: 1000,
	},

	checkoutSession: {
		id: 'cs_test_123',
		url: 'https://checkout.stripe.com/pay/cs_test_123',
		payment_status: 'paid',
		subscription: 'sub_123',
		metadata: {
			clerkUserId: 'user_123',
			priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
		},
	},

	unpaidSession: {
		id: 'cs_test_456',
		url: 'https://checkout.stripe.com/pay/cs_test_456',
		payment_status: 'unpaid',
		subscription: null,
		metadata: {
			clerkUserId: 'user_123',
			priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
		},
	},

	customer: {
		id: 'cus_123',
		email: 'user@example.com',
	},

	invoice: {
		id: 'in_123',
		amount_paid: 1000,
		currency: 'usd',
		created: 1640995200,
		status: 'paid',
		description: 'Premium subscription',
		period_start: 1640995200,
		lines: {
			data: [
				{
					description: 'Premium subscription',
				},
			],
		},
	},
};

// Mock payment data
export const mockPaymentData = {
	validPayment: {
		id: 1,
		clerkUserId: 'user_123',
		month: '2024-01',
		amount: 100,
		type: 'subscription',
		date: new Date('2024-01-01'),
	},

	paymentHistory: [
		{
			id: 1,
			clerkUserId: 'user_123',
			month: '2024-01',
			amount: 100,
			type: 'subscription',
			date: new Date('2024-01-01'),
		},
		{
			id: 2,
			clerkUserId: 'user_123',
			month: '2023-12',
			amount: 100,
			type: 'subscription',
			date: new Date('2023-12-01'),
		},
	],
};

// Mock service responses
export const mockServiceResponses = {
	successCheckoutResponse: {
		url: 'https://checkout.stripe.com/pay/cs_test_123',
	},

	successActivationResponse: {
		success: true,
	},

	successCancelResponse: {
		success: true,
		message: 'Автопродление подписки отключено.',
	},

	successAddPaymentResponse: {
		success: true,
		payment: mockPaymentData.validPayment,
	},

	successGetPaymentHistoryResponse: {
		payments: mockPaymentData.paymentHistory,
	},

	successRenewResponse: {
		success: true,
		message: 'Автопродление подписки включено.',
	},

	successStripePaymentHistoryResponse: {
		payments: [
			{
				id: 'in_123',
				amount: 10,
				currency: 'usd',
				date: new Date('2024-01-01'),
				status: 'paid',
				description: 'Premium subscription',
				period: new Date('2024-01-01'),
				type: 'Premium',
			},
		],
		total: 1,
	},

	errorResponse: {
		error: 'Ошибка при создании сессии',
	},

	userNotFoundResponse: {
		error: 'Пользователь не найден',
	},

	emailRequiredResponse: {
		error: 'Пользователь не найден или отсутствует email',
	},

	paymentFailedResponse: {
		error: 'Платеж не прошел',
	},

	alreadyDisabledResponse: {
		error: 'Автопродление уже отключено',
	},

	alreadyEnabledResponse: {
		error: 'Автопродление уже включено',
	},
};

// Mock errors
export const mockErrors = {
	stripeError: new Error('Stripe API error'),
	databaseError: new Error('Database connection failed'),
	userNotFoundError: new Error('User not found'),
	emailRequiredError: new Error('Email is required'),
	paymentFailedError: new Error('Payment failed'),
	subscriptionError: new Error('Subscription error'),
	networkError: new Error('Network error'),
	validationError: new Error('Validation error'),
	serverError: new Error('Internal server error'),
};

// Mock Prisma errors
export const mockPrismaErrors = {
	p2002Error: {
		code: 'P2002',
		message: 'Unique constraint failed',
	},

	p2025Error: {
		code: 'P2025',
		message: 'Record not found',
	},

	p2003Error: {
		code: 'P2003',
		message: 'Foreign key constraint failed',
	},
};

// Mock validation logic
export const mockValidationLogic = {
	validateClerkUserId: (clerkUserId) => {
		return !!(clerkUserId && clerkUserId.trim());
	},

	validateSessionId: (sessionId) => {
		return !!(sessionId && sessionId.trim());
	},

	validatePaymentData: (data) => {
		const { clerkUserId, month, amount, type, date } = data;
		return !!(clerkUserId && month && amount && type && date);
	},

	validateQueryParams: (query) => {
		const { clerkUserId } = query;
		return !!(clerkUserId && clerkUserId.trim());
	},

	validatePriceId: (priceId) => {
		return !!(priceId && priceId.startsWith('price_'));
	},

	validateEmail: (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},

	validateAmount: (amount) => {
		return !!(amount && amount > 0);
	},

	validateDate: (date) => {
		return !!(date && !isNaN(new Date(date).getTime()));
	},
};

// Mock Stripe integration logic
export const mockStripeIntegrationLogic = {
	createCheckoutSession: async (user, priceId) => {
		const session = await mockStripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'subscription',
			customer_email: user.email,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url:
				'https://worknow.co.il/success?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'https://worknow.co.il/cancel',
			metadata: { clerkUserId: user.clerkUserId, priceId },
		});
		return session;
	},

	retrieveCheckoutSession: async (sessionId) => {
		const session = await mockStripe.checkout.sessions.retrieve(sessionId);
		return session;
	},

	updateSubscription: async (subscriptionId, data) => {
		const subscription = await mockStripe.subscriptions.update(
			subscriptionId,
			data,
		);
		return subscription;
	},

	listCustomers: async (email) => {
		const customers = await mockStripe.customers.list({
			email,
			limit: 1,
		});
		return customers;
	},

	listInvoices: async (customerId, limit) => {
		const invoices = await mockStripe.invoices.list({
			customer: customerId,
			limit: Number(limit),
		});
		return invoices;
	},

	retrievePrice: async (priceId) => {
		const price = await mockStripe.prices.retrieve(priceId);
		return price;
	},
};

// Mock premium activation logic
export const mockPremiumActivationLogic = {
	isPremiumDeluxe: (priceId) => {
		const deluxePriceIds = [
			'price_1RfHjiCOLiDbHvw1repgIbnK',
			'price_1Rfli2COLiDbHvw1xdMaguLf',
			'price_1RqXuoCOLiDbHvw1LLew4Mo8',
			'price_1RqXveCOLiDbHvw18RQxj2g6',
		];
		return deluxePriceIds.includes(priceId);
	},

	calculatePremiumEndDate: () => {
		return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	},

	createDeluxeMessage: (clerkUserId) => {
		return {
			clerkUserId,
			title: 'Добро пожаловать в Premium Deluxe!',
			body: 'Для активации функции автопостинга напишите вашему персональному менеджеру: <a href="mailto:peterbaikov12@gmail.com">peterbaikov12@gmail.com</a>',
			type: 'system',
		};
	},

	createProMessage: (clerkUserId) => {
		return {
			clerkUserId,
			title: 'Спасибо за покупку Pro подписки на WorkNow!',
			body: `Здравствуйте!<br><br>
          Спасибо, что приобрели Pro подписку на WorkNow.<br>
          Ваша подписка активирована.<br>
          <b>Чек об оплате был отправлен на ваш электронный адрес.</b><br><br>
          Если у вас возникнут вопросы — пишите в поддержку!`,
			type: 'system',
		};
	},

	updateClerkMetadata: async (clerkUserId, isPremium, premiumDeluxe) => {
		const publicMetadata = {
			isPremium,
			premiumDeluxe,
		};

		const response = await mockFetch(
			`https://api.clerk.com/v1/users/${clerkUserId}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
				},
				body: JSON.stringify({ public_metadata: publicMetadata }),
			},
		);

		return response;
	},
};

// Mock payment history logic
export const mockPaymentHistoryLogic = {
	createPayment: async (data) => {
		const { clerkUserId, month, amount, type, date } = data;
		const payment = await mockPrisma.payment.create({
			data: {
				clerkUserId,
				month,
				amount,
				type,
				date: new Date(date),
			},
		});
		return payment;
	},

	getPaymentHistory: async (clerkUserId) => {
		const payments = await mockPrisma.payment.findMany({
			where: { clerkUserId },
			orderBy: { date: 'desc' },
		});
		return payments;
	},

	formatStripePayment: (invoice) => {
		return {
			id: invoice.id,
			amount: invoice.amount_paid / 100,
			currency: invoice.currency,
			date: new Date(invoice.created * 1000),
			status: invoice.status,
			description: invoice.description,
			period: invoice.period_start
				? new Date(invoice.period_start * 1000)
				: null,
			type: invoice.lines.data[0]?.description || 'Premium',
		};
	},
};

// Mock auto-renewal logic
export const mockAutoRenewalLogic = {
	cancelAutoRenewal: async (user) => {
		if (!user.stripeSubscriptionId) {
			// No Stripe subscription, just disable in database
			console.warn(
				`⚠️ У пользователя ${user.email} нет stripeSubscriptionId, но isAutoRenewal=true. Отключаем только в базе.`,
			);
			await mockPrisma.user.update({
				where: { clerkUserId: user.clerkUserId },
				data: { isAutoRenewal: false },
			});
			return {
				success: true,
				message: 'Автопродление подписки отключено (без Stripe).',
			};
		}

		// Cancel in Stripe
		await mockStripe.subscriptions.update(user.stripeSubscriptionId, {
			cancel_at_period_end: true,
		});

		// Update database
		await mockPrisma.user.update({
			where: { clerkUserId: user.clerkUserId },
			data: { isAutoRenewal: false },
		});

		return {
			success: true,
			message: 'Автопродление подписки отключено.',
		};
	},

	renewAutoRenewal: async (user) => {
		await mockPrisma.user.update({
			where: { clerkUserId: user.clerkUserId },
			data: { isAutoRenewal: true },
		});

		return {
			success: true,
			message: 'Автопродление подписки включено.',
		};
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processCreateCheckoutSession: async (req, res) => {
		const { clerkUserId, priceId } = req.body;

		if (!clerkUserId) {
			return res.status(400).json({ error: 'clerkUserId is required' });
		}

		try {
			const user = await mockPrisma.user.findUnique({
				where: { clerkUserId },
			});

			if (!user || !user.email) {
				return res.status(404).json({
					error: 'Пользователь не найден или отсутствует email',
				});
			}

			const defaultPriceId = 'price_1Qt5J0COLiDbHvw1IQNl90uU';
			let finalPriceId = priceId || defaultPriceId;

			try {
				await mockStripe.prices.retrieve(finalPriceId);
			} catch {
				finalPriceId = defaultPriceId;
			}

			const session = await mockStripe.checkout.sessions.create({
				payment_method_types: ['card'],
				mode: 'subscription',
				customer_email: user.email,
				line_items: [
					{
						price: finalPriceId,
						quantity: 1,
					},
				],
				success_url:
					'https://worknow.co.il/success?session_id={CHECKOUT_SESSION_ID}',
				cancel_url: 'https://worknow.co.il/cancel',
				metadata: { clerkUserId, priceId: finalPriceId },
			});

			res.json({ url: session.url });
		} catch (error) {
			console.error('❌ Ошибка при создании Checkout Session:', error);

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
	},

	processActivatePremium: async (req, res) => {
		const { sessionId } = req.body;

		console.log('🔍 activatePremium called with sessionId:', sessionId);

		try {
			const session = await mockStripe.checkout.sessions.retrieve(sessionId);
			const clerkUserId = session.metadata.clerkUserId;
			const subscriptionId = session.subscription;
			const priceId = session.metadata.priceId;

			console.log('🔍 Activating premium with session data:', {
				sessionId,
				clerkUserId,
				subscriptionId,
				priceId,
				paymentStatus: session.payment_status,
			});

			if (session.payment_status === 'paid') {
				const premiumDeluxe =
					mockPremiumActivationLogic.isPremiumDeluxe(priceId);

				console.log('🔍 Updating user with premium data:', {
					clerkUserId,
					priceId,
					premiumDeluxe,
					willSetPremiumDeluxe: premiumDeluxe,
				});

				const user = await mockPrisma.user.update({
					where: { clerkUserId },
					data: {
						isPremium: true,
						premiumEndsAt: mockPremiumActivationLogic.calculatePremiumEndDate(),
						isAutoRenewal: !!subscriptionId,
						stripeSubscriptionId: subscriptionId || null,
						premiumDeluxe: premiumDeluxe,
					},
					include: { jobs: { include: { city: true } } },
				});

				await mockServices.sendTelegramNotification(user, user.jobs);

				if (premiumDeluxe) {
					await mockPrisma.message.create({
						data: mockPremiumActivationLogic.createDeluxeMessage(clerkUserId),
					});

					try {
						const userName = user.firstName
							? `${user.firstName} ${user.lastName || ''}`.trim()
							: '';
						await mockServices.sendPremiumDeluxeWelcomeEmail(
							user.email,
							userName,
						);
						console.log(
							'✅ Premium Deluxe welcome email sent successfully to:',
							user.email,
						);
					} catch (emailError) {
						console.error(
							'❌ Failed to send Premium Deluxe welcome email:',
							emailError,
						);
					}
				} else {
					await mockPrisma.message.create({
						data: mockPremiumActivationLogic.createProMessage(clerkUserId),
					});

					try {
						const userName = user.firstName
							? `${user.firstName} ${user.lastName || ''}`.trim()
							: '';
						await mockServices.sendProWelcomeEmail(user.email, userName);
						console.log(
							'✅ Pro welcome email sent successfully to:',
							user.email,
						);
					} catch (emailError) {
						console.error('❌ Failed to send Pro welcome email:', emailError);
					}
				}

				await mockPremiumActivationLogic.updateClerkMetadata(
					clerkUserId,
					true,
					premiumDeluxe,
				);

				res.json({ success: true });
			} else {
				res.status(400).json({ error: 'Платеж не прошел' });
			}
		} catch (error) {
			console.error('❌ Ошибка активации премиума:', error);
			res.status(500).json({ error: 'Ошибка активации премиума' });
		}
	},

	processCancelAutoRenewal: async (req, res) => {
		const { clerkUserId } = req.body;

		try {
			const user = await mockPrisma.user.findUnique({
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

			const result = await mockAutoRenewalLogic.cancelAutoRenewal(user);
			res.json(result);
		} catch (error) {
			console.error('❌ Ошибка при отключении автообновления:', error);
			res.status(500).json({ error: 'Ошибка при отключении автообновления' });
		}
	},

	processAddPaymentHistory: async (req, res) => {
		const { clerkUserId, month, amount, type, date } = req.body;

		try {
			const payment = await mockPaymentHistoryLogic.createPayment({
				clerkUserId,
				month,
				amount,
				type,
				date,
			});
			res.json({ success: true, payment });
		} catch (error) {
			console.error('Ошибка при добавлении платежа:', error);
			res.status(500).json({ error: 'Ошибка при добавлении платежа' });
		}
	},

	processGetPaymentHistory: async (req, res) => {
		const { clerkUserId } = req.query;

		if (!clerkUserId) {
			return res.status(400).json({ error: 'clerkUserId обязателен' });
		}

		try {
			const payments =
				await mockPaymentHistoryLogic.getPaymentHistory(clerkUserId);
			res.json({ payments });
		} catch (error) {
			console.error('Ошибка при получении истории платежей:', error);
			res.status(500).json({ error: 'Ошибка при получении истории платежей' });
		}
	},

	processRenewAutoRenewal: async (req, res) => {
		const { clerkUserId } = req.body;

		try {
			const user = await mockPrisma.user.findUnique({ where: { clerkUserId } });
			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' });
			}
			if (user.isAutoRenewal) {
				return res.status(400).json({ error: 'Автопродление уже включено' });
			}

			const result = await mockAutoRenewalLogic.renewAutoRenewal(user);
			res.json(result);
		} catch (error) {
			console.error('❌ Ошибка при включении автопродления:', error);
			res.status(500).json({ error: 'Ошибка при включении автопродления' });
		}
	},

	processGetStripePaymentHistory: async (req, res) => {
		const { clerkUserId, limit = 10, offset = 0 } = req.query;

		try {
			const user = await mockPrisma.user.findUnique({ where: { clerkUserId } });
			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' });
			}

			const customerEmail = user.email;
			let customerId = user.stripeCustomerId;

			if (!customerId) {
				const customers = await mockStripe.customers.list({
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

			const invoices = await mockStripe.invoices.list({
				customer: customerId,
				limit: Number(limit),
			});

			const payments = invoices.data.map(
				mockPaymentHistoryLogic.formatStripePayment,
			);
			res.json({ payments, total: invoices.data.length });
		} catch (error) {
			console.error('Ошибка при получении истории Stripe:', error);
			res.status(500).json({ error: 'Ошибка при получении истории Stripe' });
		}
	},

	handleControllerError: (error, res, operation = 'operation') => {
		console.error(`❌ Error ${operation}:`, error);
		return res.status(500).json({ error: `Ошибка при ${operation}` });
	},

	handleControllerSuccess: (data, res, statusCode = 200) => {
		return res.status(statusCode).json(data);
	},

	validateControllerInput: (req) => {
		return !!(req && (req.body || req.query));
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (body = {}, query = {}) => {
		return {
			body: {
				clerkUserId: 'user_123',
				priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
				sessionId: 'cs_test_123',
				month: '2024-01',
				amount: 100,
				type: 'subscription',
				date: '2024-01-01',
				...body,
			},
			query: {
				clerkUserId: 'user_123',
				limit: '10',
				offset: '0',
				...query,
			},
		};
	},

	buildResponse: () => {
		return {
			json: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	},

	handleSuccessResponse: (res, data, statusCode = 200) => {
		res.status(statusCode).json(data);
	},

	handleErrorResponse: (res, error, statusCode = 500) => {
		res.status(statusCode).json({ error: error.message });
	},

	handleValidationError: (res, error, statusCode = 400) => {
		res.status(statusCode).json({ error });
	},

	handleNotFoundError: (res, error, statusCode = 404) => {
		res.status(statusCode).json({ error });
	},

	validateRequest: (req) => {
		return !!(req && (req.body || req.query));
	},

	extractBodyData: (req) => {
		return req.body;
	},

	extractQueryData: (req) => {
		return req.query;
	},
};

// Reset mocks before each test
export const resetPaymentsControllerMocks = () => {
	mockPrisma.user.findUnique.mockClear();
	mockPrisma.user.update.mockClear();
	mockPrisma.payment.create.mockClear();
	mockPrisma.payment.findMany.mockClear();
	mockPrisma.message.create.mockClear();
	mockStripe.prices.retrieve.mockClear();
	mockStripe.checkout.sessions.create.mockClear();
	mockStripe.checkout.sessions.retrieve.mockClear();
	mockStripe.subscriptions.update.mockClear();
	mockStripe.customers.list.mockClear();
	mockStripe.invoices.list.mockClear();
	mockServices.sendTelegramNotification.mockClear();
	mockServices.sendPremiumDeluxeWelcomeEmail.mockClear();
	mockServices.sendProWelcomeEmail.mockClear();
	mockFetch.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockConsoleWarn.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};
