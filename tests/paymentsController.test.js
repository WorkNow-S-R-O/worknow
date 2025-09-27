import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockPrisma,
	mockStripe,
	mockServices,
	mockFetch,
	mockConsoleLog,
	mockConsoleError,
	mockConsoleWarn,
	mockRequest,
	mockResponse,
	mockUserData,
	mockStripeData,
	mockPaymentData,
	mockServiceResponses,
	mockErrors,
	mockPrismaErrors,
	mockValidationLogic,
	mockStripeIntegrationLogic,
	mockPremiumActivationLogic,
	mockPaymentHistoryLogic,
	mockAutoRenewalLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	resetPaymentsControllerMocks,
} from './mocks/paymentsController.js';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

describe('PaymentsController', () => {
	beforeEach(() => {
		// Reset all mocks
		resetPaymentsControllerMocks();

		// Mock console methods
		console.error = vi.fn();
		console.log = vi.fn();
		console.warn = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.error = originalConsoleError;
		console.log = originalConsoleLog;
		console.warn = originalConsoleWarn;
	});

	describe('User Data Processing Logic', () => {
		it('should handle valid user data', () => {
			const user = mockUserData.validUser;
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('premiumEndsAt');
			expect(user).toHaveProperty('isAutoRenewal');
			expect(user).toHaveProperty('stripeSubscriptionId');
			expect(user).toHaveProperty('premiumDeluxe');
			expect(user).toHaveProperty('stripeCustomerId');
			expect(user).toHaveProperty('jobs');
		});

		it('should handle premium user data', () => {
			const user = mockUserData.premiumUser;
			expect(user.isPremium).toBe(true);
			expect(user.isAutoRenewal).toBe(true);
			expect(user.stripeSubscriptionId).toBe('sub_123');
			expect(user.premiumDeluxe).toBe(false);
		});

		it('should handle premium deluxe user data', () => {
			const user = mockUserData.premiumDeluxeUser;
			expect(user.isPremium).toBe(true);
			expect(user.premiumDeluxe).toBe(true);
			expect(user.stripeSubscriptionId).toBe('sub_456');
		});

		it('should handle user without email', () => {
			const user = mockUserData.userWithoutEmail;
			expect(user.email).toBeNull();
			expect(user.isPremium).toBe(false);
		});
	});

	describe('Stripe Data Processing Logic', () => {
		it('should handle valid price data', () => {
			const price = mockStripeData.validPrice;
			expect(price).toHaveProperty('id');
			expect(price).toHaveProperty('active');
			expect(price).toHaveProperty('currency');
			expect(price).toHaveProperty('unit_amount');
			expect(price.active).toBe(true);
		});

		it('should handle checkout session data', () => {
			const session = mockStripeData.checkoutSession;
			expect(session).toHaveProperty('id');
			expect(session).toHaveProperty('url');
			expect(session).toHaveProperty('payment_status');
			expect(session).toHaveProperty('subscription');
			expect(session).toHaveProperty('metadata');
			expect(session.payment_status).toBe('paid');
		});

		it('should handle unpaid session data', () => {
			const session = mockStripeData.unpaidSession;
			expect(session.payment_status).toBe('unpaid');
			expect(session.subscription).toBeNull();
		});

		it('should handle customer data', () => {
			const customer = mockStripeData.customer;
			expect(customer).toHaveProperty('id');
			expect(customer).toHaveProperty('email');
		});

		it('should handle invoice data', () => {
			const invoice = mockStripeData.invoice;
			expect(invoice).toHaveProperty('id');
			expect(invoice).toHaveProperty('amount_paid');
			expect(invoice).toHaveProperty('currency');
			expect(invoice).toHaveProperty('created');
			expect(invoice).toHaveProperty('status');
			expect(invoice).toHaveProperty('description');
			expect(invoice).toHaveProperty('period_start');
			expect(invoice).toHaveProperty('lines');
		});
	});

	describe('Payment Data Processing Logic', () => {
		it('should handle valid payment data', () => {
			const payment = mockPaymentData.validPayment;
			expect(payment).toHaveProperty('id');
			expect(payment).toHaveProperty('clerkUserId');
			expect(payment).toHaveProperty('month');
			expect(payment).toHaveProperty('amount');
			expect(payment).toHaveProperty('type');
			expect(payment).toHaveProperty('date');
		});

		it('should handle payment history data', () => {
			const history = mockPaymentData.paymentHistory;
			expect(Array.isArray(history)).toBe(true);
			expect(history.length).toBe(2);
			expect(history[0]).toHaveProperty('id');
			expect(history[0]).toHaveProperty('clerkUserId');
		});
	});

	describe('Validation Logic', () => {
		it('should validate clerkUserId correctly', () => {
			expect(mockValidationLogic.validateClerkUserId('user_123')).toBe(true);
			expect(mockValidationLogic.validateClerkUserId('')).toBe(false);
			expect(mockValidationLogic.validateClerkUserId(null)).toBe(false);
		});

		it('should validate sessionId correctly', () => {
			expect(mockValidationLogic.validateSessionId('cs_test_123')).toBe(true);
			expect(mockValidationLogic.validateSessionId('')).toBe(false);
			expect(mockValidationLogic.validateSessionId(null)).toBe(false);
		});

		it('should validate payment data correctly', () => {
			const validData = {
				clerkUserId: 'user_123',
				month: '2024-01',
				amount: 100,
				type: 'subscription',
				date: '2024-01-01',
			};
			const invalidData = {
				clerkUserId: 'user_123',
				// Missing other fields
			};

			expect(mockValidationLogic.validatePaymentData(validData)).toBe(true);
			expect(mockValidationLogic.validatePaymentData(invalidData)).toBe(false);
		});

		it('should validate query params correctly', () => {
			const validQuery = { clerkUserId: 'user_123' };
			const invalidQuery = { clerkUserId: '' };

			expect(mockValidationLogic.validateQueryParams(validQuery)).toBe(true);
			expect(mockValidationLogic.validateQueryParams(invalidQuery)).toBe(false);
		});

		it('should validate priceId correctly', () => {
			expect(mockValidationLogic.validatePriceId('price_123')).toBe(true);
			expect(mockValidationLogic.validatePriceId('invalid_123')).toBe(false);
			expect(mockValidationLogic.validatePriceId('')).toBe(false);
		});

		it('should validate email correctly', () => {
			expect(mockValidationLogic.validateEmail('user@example.com')).toBe(true);
			expect(mockValidationLogic.validateEmail('invalid-email')).toBe(false);
			expect(mockValidationLogic.validateEmail('')).toBe(false);
		});

		it('should validate amount correctly', () => {
			expect(mockValidationLogic.validateAmount(100)).toBe(true);
			expect(mockValidationLogic.validateAmount(0)).toBe(false);
			expect(mockValidationLogic.validateAmount(-10)).toBe(false);
		});

		it('should validate date correctly', () => {
			expect(mockValidationLogic.validateDate('2024-01-01')).toBe(true);
			expect(mockValidationLogic.validateDate('invalid-date')).toBe(false);
			expect(mockValidationLogic.validateDate('')).toBe(false);
		});
	});

	describe('Stripe Integration Logic', () => {
		it('should create checkout session correctly', async () => {
			const user = mockUserData.validUser;
			const priceId = 'price_123';

			mockStripe.checkout.sessions.create.mockResolvedValue(
				mockStripeData.checkoutSession,
			);

			const session = await mockStripeIntegrationLogic.createCheckoutSession(
				user,
				priceId,
			);

			expect(session).toBe(mockStripeData.checkoutSession);
			expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
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
		});

		it('should retrieve checkout session correctly', async () => {
			const sessionId = 'cs_test_123';

			mockStripe.checkout.sessions.retrieve.mockResolvedValue(
				mockStripeData.checkoutSession,
			);

			const session =
				await mockStripeIntegrationLogic.retrieveCheckoutSession(sessionId);

			expect(session).toBe(mockStripeData.checkoutSession);
			expect(mockStripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
				sessionId,
			);
		});

		it('should update subscription correctly', async () => {
			const subscriptionId = 'sub_123';
			const data = { cancel_at_period_end: true };

			mockStripe.subscriptions.update.mockResolvedValue({ id: subscriptionId });

			const subscription = await mockStripeIntegrationLogic.updateSubscription(
				subscriptionId,
				data,
			);

			expect(subscription).toEqual({ id: subscriptionId });
			expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
				subscriptionId,
				data,
			);
		});

		it('should list customers correctly', async () => {
			const email = 'user@example.com';

			mockStripe.customers.list.mockResolvedValue({
				data: [mockStripeData.customer],
			});

			const customers = await mockStripeIntegrationLogic.listCustomers(email);

			expect(customers.data).toEqual([mockStripeData.customer]);
			expect(mockStripe.customers.list).toHaveBeenCalledWith({
				email,
				limit: 1,
			});
		});

		it('should list invoices correctly', async () => {
			const customerId = 'cus_123';
			const limit = 10;

			mockStripe.invoices.list.mockResolvedValue({
				data: [mockStripeData.invoice],
			});

			const invoices = await mockStripeIntegrationLogic.listInvoices(
				customerId,
				limit,
			);

			expect(invoices.data).toEqual([mockStripeData.invoice]);
			expect(mockStripe.invoices.list).toHaveBeenCalledWith({
				customer: customerId,
				limit: Number(limit),
			});
		});

		it('should retrieve price correctly', async () => {
			const priceId = 'price_123';

			mockStripe.prices.retrieve.mockResolvedValue(mockStripeData.validPrice);

			const price = await mockStripeIntegrationLogic.retrievePrice(priceId);

			expect(price).toBe(mockStripeData.validPrice);
			expect(mockStripe.prices.retrieve).toHaveBeenCalledWith(priceId);
		});
	});

	describe('Premium Activation Logic', () => {
		it('should identify premium deluxe correctly', () => {
			const deluxePriceIds = [
				'price_1RfHjiCOLiDbHvw1repgIbnK',
				'price_1Rfli2COLiDbHvw1xdMaguLf',
				'price_1RqXuoCOLiDbHvw1LLew4Mo8',
				'price_1RqXveCOLiDbHvw18RQxj2g6',
			];

			deluxePriceIds.forEach((priceId) => {
				expect(mockPremiumActivationLogic.isPremiumDeluxe(priceId)).toBe(true);
			});

			expect(
				mockPremiumActivationLogic.isPremiumDeluxe(
					'price_1Qt63NCOLiDbHvw13PRhpenX',
				),
			).toBe(false);
		});

		it('should calculate premium end date correctly', () => {
			const endDate = mockPremiumActivationLogic.calculatePremiumEndDate();
			const expectedDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

			expect(endDate.getTime()).toBeCloseTo(expectedDate.getTime(), -2); // Within 100ms
		});

		it('should create deluxe message correctly', () => {
			const clerkUserId = 'user_123';
			const message =
				mockPremiumActivationLogic.createDeluxeMessage(clerkUserId);

			expect(message.clerkUserId).toBe(clerkUserId);
			expect(message.title).toBe('Добро пожаловать в Premium Deluxe!');
			expect(message.type).toBe('system');
			expect(message.body).toContain('peterbaikov12@gmail.com');
		});

		it('should create pro message correctly', () => {
			const clerkUserId = 'user_123';
			const message = mockPremiumActivationLogic.createProMessage(clerkUserId);

			expect(message.clerkUserId).toBe(clerkUserId);
			expect(message.title).toBe('Спасибо за покупку Pro подписки на WorkNow!');
			expect(message.type).toBe('system');
			expect(message.body).toContain('Pro подписку');
		});

		it('should update Clerk metadata correctly', async () => {
			const clerkUserId = 'user_123';
			const isPremium = true;
			const premiumDeluxe = true;

			mockFetch.mockResolvedValue({ ok: true });

			await mockPremiumActivationLogic.updateClerkMetadata(
				clerkUserId,
				isPremium,
				premiumDeluxe,
			);

			expect(mockFetch).toHaveBeenCalledWith(
				`https://api.clerk.com/v1/users/${clerkUserId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
					},
					body: JSON.stringify({
						public_metadata: {
							isPremium,
							premiumDeluxe,
						},
					}),
				},
			);
		});
	});

	describe('Payment History Logic', () => {
		it('should create payment correctly', async () => {
			const data = {
				clerkUserId: 'user_123',
				month: '2024-01',
				amount: 100,
				type: 'subscription',
				date: '2024-01-01',
			};

			mockPrisma.payment.create.mockResolvedValue(mockPaymentData.validPayment);

			const payment = await mockPaymentHistoryLogic.createPayment(data);

			expect(payment).toBe(mockPaymentData.validPayment);
			expect(mockPrisma.payment.create).toHaveBeenCalledWith({
				data: {
					clerkUserId: data.clerkUserId,
					month: data.month,
					amount: data.amount,
					type: data.type,
					date: new Date(data.date),
				},
			});
		});

		it('should get payment history correctly', async () => {
			const clerkUserId = 'user_123';

			mockPrisma.payment.findMany.mockResolvedValue(
				mockPaymentData.paymentHistory,
			);

			const payments =
				await mockPaymentHistoryLogic.getPaymentHistory(clerkUserId);

			expect(payments).toBe(mockPaymentData.paymentHistory);
			expect(mockPrisma.payment.findMany).toHaveBeenCalledWith({
				where: { clerkUserId },
				orderBy: { date: 'desc' },
			});
		});

		it('should format Stripe payment correctly', () => {
			const invoice = mockStripeData.invoice;
			const formattedPayment =
				mockPaymentHistoryLogic.formatStripePayment(invoice);

			expect(formattedPayment.id).toBe(invoice.id);
			expect(formattedPayment.amount).toBe(invoice.amount_paid / 100);
			expect(formattedPayment.currency).toBe(invoice.currency);
			expect(formattedPayment.date).toEqual(new Date(invoice.created * 1000));
			expect(formattedPayment.status).toBe(invoice.status);
			expect(formattedPayment.description).toBe(invoice.description);
			expect(formattedPayment.period).toEqual(
				new Date(invoice.period_start * 1000),
			);
			expect(formattedPayment.type).toBe('Premium subscription');
		});
	});

	describe('Auto-Renewal Logic', () => {
		it('should cancel auto-renewal without Stripe subscription', async () => {
			const user = { ...mockUserData.validUser, stripeSubscriptionId: null };

			mockPrisma.user.update.mockResolvedValue(user);

			const result = await mockAutoRenewalLogic.cancelAutoRenewal(user);

			expect(result.success).toBe(true);
			expect(result.message).toBe(
				'Автопродление подписки отключено (без Stripe).',
			);
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: user.clerkUserId },
				data: { isAutoRenewal: false },
			});
		});

		it('should cancel auto-renewal with Stripe subscription', async () => {
			const user = mockUserData.premiumUser;

			mockStripe.subscriptions.update.mockResolvedValue({
				id: user.stripeSubscriptionId,
			});
			mockPrisma.user.update.mockResolvedValue(user);

			const result = await mockAutoRenewalLogic.cancelAutoRenewal(user);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Автопродление подписки отключено.');
			expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
				user.stripeSubscriptionId,
				{
					cancel_at_period_end: true,
				},
			);
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: user.clerkUserId },
				data: { isAutoRenewal: false },
			});
		});

		it('should renew auto-renewal correctly', async () => {
			const user = mockUserData.validUser;

			mockPrisma.user.update.mockResolvedValue(user);

			const result = await mockAutoRenewalLogic.renewAutoRenewal(user);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Автопродление подписки включено.');
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: user.clerkUserId },
				data: { isAutoRenewal: true },
			});
		});
	});

	describe('Controller Logic', () => {
		it('should process createCheckoutSession request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(mockUserData.validUser);
			mockStripe.prices.retrieve.mockResolvedValue(mockStripeData.validPrice);
			mockStripe.checkout.sessions.create.mockResolvedValue(
				mockStripeData.checkoutSession,
			);

			await mockControllerLogic.processCreateCheckoutSession(req, res);

			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
			});
			expect(mockStripe.prices.retrieve).toHaveBeenCalledWith(
				'price_1Qt5J0COLiDbHvw1IQNl90uU',
			);
			expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
				payment_method_types: ['card'],
				mode: 'subscription',
				customer_email: 'user@example.com',
				line_items: [
					{
						price: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
						quantity: 1,
					},
				],
				success_url:
					'https://worknow.co.il/success?session_id={CHECKOUT_SESSION_ID}',
				cancel_url: 'https://worknow.co.il/cancel',
				metadata: {
					clerkUserId: 'user_123',
					priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
				},
			});
			expect(res.json).toHaveBeenCalledWith({
				url: 'https://checkout.stripe.com/pay/cs_test_123',
			});
		});

		it('should process createCheckoutSession request with missing clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest({ clerkUserId: '' });
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processCreateCheckoutSession(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'clerkUserId is required',
			});
		});

		it('should process createCheckoutSession request with user not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(null);

			await mockControllerLogic.processCreateCheckoutSession(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Пользователь не найден или отсутствует email',
			});
		});

		it('should process createCheckoutSession request with user without email', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(
				mockUserData.userWithoutEmail,
			);

			await mockControllerLogic.processCreateCheckoutSession(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Пользователь не найден или отсутствует email',
			});
		});

		it('should process createCheckoutSession request with invalid priceId', async () => {
			const req = mockRequestResponseLogic.buildRequest({
				priceId: 'invalid_price',
			});
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(mockUserData.validUser);
			mockStripe.prices.retrieve.mockRejectedValue(new Error('Invalid price'));
			mockStripe.checkout.sessions.create.mockResolvedValue(
				mockStripeData.checkoutSession,
			);

			await mockControllerLogic.processCreateCheckoutSession(req, res);

			// The controller should fallback to default priceId when invalid priceId fails
			expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
				payment_method_types: ['card'],
				mode: 'subscription',
				customer_email: 'user@example.com',
				line_items: [
					{
						price: 'price_1Qt5J0COLiDbHvw1IQNl90uU', // Fallback to default
						quantity: 1,
					},
				],
				success_url:
					'https://worknow.co.il/success?session_id={CHECKOUT_SESSION_ID}',
				cancel_url: 'https://worknow.co.il/cancel',
				metadata: {
					clerkUserId: 'user_123',
					priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
				},
			});
		});

		it('should process createCheckoutSession request with Stripe error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(mockUserData.validUser);
			mockStripe.prices.retrieve.mockResolvedValue(mockStripeData.validPrice);
			mockStripe.checkout.sessions.create.mockRejectedValue(
				mockErrors.stripeError,
			);

			await mockControllerLogic.processCreateCheckoutSession(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'❌ Ошибка при создании Checkout Session:',
				mockErrors.stripeError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка при создании сессии',
			});
		});

		it('should process activatePremium request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const userWithJobs = { ...mockUserData.validUser, jobs: [] };
			mockStripe.checkout.sessions.retrieve.mockResolvedValue(
				mockStripeData.checkoutSession,
			);
			mockPrisma.user.update.mockResolvedValue(userWithJobs);
			mockServices.sendTelegramNotification.mockResolvedValue(true);
			mockPrisma.message.create.mockResolvedValue({ id: 1 });
			mockServices.sendProWelcomeEmail.mockResolvedValue(true);
			mockFetch.mockResolvedValue({ ok: true });

			await mockControllerLogic.processActivatePremium(req, res);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 activatePremium called with sessionId:',
				'cs_test_123',
			);
			expect(mockStripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
				'cs_test_123',
			);
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
				data: {
					isPremium: true,
					premiumEndsAt: expect.any(Date),
					isAutoRenewal: true,
					stripeSubscriptionId: 'sub_123',
					premiumDeluxe: false,
				},
				include: { jobs: { include: { city: true } } },
			});
			expect(mockServices.sendTelegramNotification).toHaveBeenCalledWith(
				userWithJobs,
				[],
			);
			expect(mockPrisma.message.create).toHaveBeenCalledWith({
				data: expect.objectContaining({
					clerkUserId: 'user_123',
					title: 'Спасибо за покупку Pro подписки на WorkNow!',
					type: 'system',
				}),
			});
			expect(mockServices.sendProWelcomeEmail).toHaveBeenCalledWith(
				'user@example.com',
				'John Doe',
			);
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should process activatePremium request with unpaid session', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockStripe.checkout.sessions.retrieve.mockResolvedValue(
				mockStripeData.unpaidSession,
			);

			await mockControllerLogic.processActivatePremium(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Платеж не прошел' });
		});

		it('should process activatePremium request with premium deluxe', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const deluxeSession = {
				...mockStripeData.checkoutSession,
				metadata: {
					...mockStripeData.checkoutSession.metadata,
					priceId: 'price_1RfHjiCOLiDbHvw1repgIbnK',
				},
			};

			const userWithJobs = { ...mockUserData.validUser, jobs: [] };
			mockStripe.checkout.sessions.retrieve.mockResolvedValue(deluxeSession);
			mockPrisma.user.update.mockResolvedValue(userWithJobs);
			mockServices.sendTelegramNotification.mockResolvedValue(true);
			mockPrisma.message.create.mockResolvedValue({ id: 1 });
			mockServices.sendPremiumDeluxeWelcomeEmail.mockResolvedValue(true);
			mockFetch.mockResolvedValue({ ok: true });

			await mockControllerLogic.processActivatePremium(req, res);

			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
				data: {
					isPremium: true,
					premiumEndsAt: expect.any(Date),
					isAutoRenewal: true,
					stripeSubscriptionId: 'sub_123',
					premiumDeluxe: true,
				},
				include: { jobs: { include: { city: true } } },
			});
			expect(mockPrisma.message.create).toHaveBeenCalledWith({
				data: expect.objectContaining({
					clerkUserId: 'user_123',
					title: 'Добро пожаловать в Premium Deluxe!',
					type: 'system',
				}),
			});
			expect(mockServices.sendPremiumDeluxeWelcomeEmail).toHaveBeenCalledWith(
				'user@example.com',
				'John Doe',
			);
		});

		it('should process activatePremium request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockStripe.checkout.sessions.retrieve.mockRejectedValue(
				mockErrors.stripeError,
			);

			await mockControllerLogic.processActivatePremium(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'❌ Ошибка активации премиума:',
				mockErrors.stripeError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка активации премиума',
			});
		});

		it('should process cancelAutoRenewal request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const userWithStripe = {
				...mockUserData.validUser,
				stripeSubscriptionId: 'sub_123',
				isAutoRenewal: true,
			};
			mockPrisma.user.findUnique.mockResolvedValue(userWithStripe);
			mockStripe.subscriptions.update.mockResolvedValue({ id: 'sub_123' });
			mockPrisma.user.update.mockResolvedValue(userWithStripe);

			await mockControllerLogic.processCancelAutoRenewal(req, res);

			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
			});
			expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
				cancel_at_period_end: true,
			});
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
				data: { isAutoRenewal: false },
			});
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Автопродление подписки отключено.',
			});
		});

		it('should process cancelAutoRenewal request with user not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(null);

			await mockControllerLogic.processCancelAutoRenewal(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'❌ Ошибка: пользователь не найден.',
			);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Пользователь не найден',
			});
		});

		it('should process cancelAutoRenewal request with already disabled', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const userWithoutAutoRenewal = {
				...mockUserData.validUser,
				isAutoRenewal: false,
			};
			mockPrisma.user.findUnique.mockResolvedValue(userWithoutAutoRenewal);

			await mockControllerLogic.processCancelAutoRenewal(req, res);

			expect(console.warn).toHaveBeenCalledWith(
				'⚠️ Автопродление уже отключено.',
			);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Автопродление уже отключено',
			});
		});

		it('should process cancelAutoRenewal request without Stripe subscription', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const userWithoutStripe = {
				...mockUserData.validUser,
				stripeSubscriptionId: null,
				isAutoRenewal: true,
			};
			mockPrisma.user.findUnique.mockResolvedValue(userWithoutStripe);
			mockPrisma.user.update.mockResolvedValue(userWithoutStripe);

			await mockControllerLogic.processCancelAutoRenewal(req, res);

			expect(console.warn).toHaveBeenCalledWith(
				'⚠️ У пользователя user@example.com нет stripeSubscriptionId, но isAutoRenewal=true. Отключаем только в базе.',
			);
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
				data: { isAutoRenewal: false },
			});
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Автопродление подписки отключено (без Stripe).',
			});
		});

		it('should process addPaymentHistory request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.payment.create.mockResolvedValue(mockPaymentData.validPayment);

			await mockControllerLogic.processAddPaymentHistory(req, res);

			expect(mockPrisma.payment.create).toHaveBeenCalledWith({
				data: {
					clerkUserId: 'user_123',
					month: '2024-01',
					amount: 100,
					type: 'subscription',
					date: new Date('2024-01-01'),
				},
			});
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				payment: mockPaymentData.validPayment,
			});
		});

		it('should process addPaymentHistory request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.payment.create.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processAddPaymentHistory(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'Ошибка при добавлении платежа:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка при добавлении платежа',
			});
		});

		it('should process getPaymentHistory request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.payment.findMany.mockResolvedValue(
				mockPaymentData.paymentHistory,
			);

			await mockControllerLogic.processGetPaymentHistory(req, res);

			expect(mockPrisma.payment.findMany).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
				orderBy: { date: 'desc' },
			});
			expect(res.json).toHaveBeenCalledWith({
				payments: mockPaymentData.paymentHistory,
			});
		});

		it('should process getPaymentHistory request with missing clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: '' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processGetPaymentHistory(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'clerkUserId обязателен',
			});
		});

		it('should process getPaymentHistory request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.payment.findMany.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetPaymentHistory(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'Ошибка при получении истории платежей:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка при получении истории платежей',
			});
		});

		it('should process renewAutoRenewal request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(mockUserData.validUser);
			mockPrisma.user.update.mockResolvedValue(mockUserData.validUser);

			await mockControllerLogic.processRenewAutoRenewal(req, res);

			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
			});
			expect(mockPrisma.user.update).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
				data: { isAutoRenewal: true },
			});
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Автопродление подписки включено.',
			});
		});

		it('should process renewAutoRenewal request with user not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(null);

			await mockControllerLogic.processRenewAutoRenewal(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Пользователь не найден',
			});
		});

		it('should process renewAutoRenewal request with already enabled', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(mockUserData.premiumUser);

			await mockControllerLogic.processRenewAutoRenewal(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Автопродление уже включено',
			});
		});

		it('should process renewAutoRenewal request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processRenewAutoRenewal(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'❌ Ошибка при включении автопродления:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка при включении автопродления',
			});
		});

		it('should process getStripePaymentHistory request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const userWithCustomer = {
				...mockUserData.validUser,
				stripeCustomerId: null,
			};
			mockPrisma.user.findUnique.mockResolvedValue(userWithCustomer);
			mockStripe.customers.list.mockResolvedValue({
				data: [mockStripeData.customer],
			});
			mockStripe.invoices.list.mockResolvedValue({
				data: [mockStripeData.invoice],
			});

			await mockControllerLogic.processGetStripePaymentHistory(req, res);

			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { clerkUserId: 'user_123' },
			});
			expect(mockStripe.customers.list).toHaveBeenCalledWith({
				email: 'user@example.com',
				limit: 1,
			});
			expect(mockStripe.invoices.list).toHaveBeenCalledWith({
				customer: 'cus_123',
				limit: 10,
			});
			expect(res.json).toHaveBeenCalledWith({
				payments: expect.arrayContaining([
					expect.objectContaining({
						id: 'in_123',
						amount: 10,
						currency: 'usd',
						status: 'paid',
						type: 'Premium subscription',
					}),
				]),
				total: 1,
			});
		});

		it('should process getStripePaymentHistory request with user not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockResolvedValue(null);

			await mockControllerLogic.processGetStripePaymentHistory(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Пользователь не найден',
			});
		});

		it('should process getStripePaymentHistory request with no customer', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			const userWithoutCustomer = {
				...mockUserData.validUser,
				stripeCustomerId: null,
			};
			mockPrisma.user.findUnique.mockResolvedValue(userWithoutCustomer);
			mockStripe.customers.list.mockResolvedValue({ data: [] });

			await mockControllerLogic.processGetStripePaymentHistory(req, res);

			expect(res.json).toHaveBeenCalledWith({ payments: [], total: 0 });
		});

		it('should process getStripePaymentHistory request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();

			mockPrisma.user.findUnique.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetStripePaymentHistory(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'Ошибка при получении истории Stripe:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка при получении истории Stripe',
			});
		});

		it('should handle controller errors', () => {
			const error = mockErrors.databaseError;
			const res = mockRequestResponseLogic.buildResponse();

			mockControllerLogic.handleControllerError(
				error,
				res,
				'creating checkout session',
			);

			expect(console.error).toHaveBeenCalledWith(
				'❌ Error creating checkout session:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка при creating checkout session',
			});
		});

		it('should handle controller success', () => {
			const data = mockServiceResponses.successCheckoutResponse;
			const res = mockRequestResponseLogic.buildResponse();

			mockControllerLogic.handleControllerSuccess(data, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(data);
		});

		it('should handle controller success with custom status code', () => {
			const data = mockServiceResponses.successActivationResponse;
			const res = mockRequestResponseLogic.buildResponse();

			mockControllerLogic.handleControllerSuccess(data, res, 201);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(data);
		});

		it('should validate controller input', () => {
			const validRequest = { body: { clerkUserId: 'user_123' }, query: {} };
			const invalidRequest = { body: {}, query: {} };

			expect(mockControllerLogic.validateControllerInput(validRequest)).toBe(
				true,
			);
			expect(mockControllerLogic.validateControllerInput(invalidRequest)).toBe(
				true,
			); // Empty body still has body property
		});
	});
});
