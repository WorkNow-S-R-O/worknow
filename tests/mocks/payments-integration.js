import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
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

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock Stripe
export const mockStripeInstance = {
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

vi.mock('../../apps/api/utils/stripe.js', () => ({
	default: mockStripeInstance,
}));

// Mock services
export const mockSendTelegramNotification = vi.fn();
export const mockSendPremiumDeluxeWelcomeEmail = vi.fn();
export const mockSendProWelcomeEmail = vi.fn();

// Mock service modules
vi.mock('../../apps/api/utils/telegram.js', () => ({
	sendTelegramNotification: mockSendTelegramNotification,
}));

vi.mock('../../apps/api/services/premiumEmailService.js', () => ({
	sendPremiumDeluxeWelcomeEmail: mockSendPremiumDeluxeWelcomeEmail,
	sendProWelcomeEmail: mockSendProWelcomeEmail,
}));

// Mock fetch for Clerk API calls
export const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data
export const mockUserData = {
	id: 'user_123456789',
	clerkUserId: 'clerk_123456789',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe',
	isPremium: false,
	isAutoRenewal: false,
	premiumEndsAt: null,
	stripeSubscriptionId: null,
	premiumDeluxe: false,
	stripeCustomerId: null,
	jobs: [
		{
			id: 1,
			title: 'Software Developer',
			salary: '50000',
			phone: '+1234567890',
			description: 'Great opportunity',
			category: { name: 'IT' },
			city: { name: 'Tel Aviv' },
			createdAt: '2024-01-01T00:00:00.000Z',
		},
	],
};

export const mockPremiumUserData = {
	...mockUserData,
	isPremium: true,
	isAutoRenewal: true,
	premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	stripeSubscriptionId: 'sub_123456789',
	premiumDeluxe: false,
};

export const mockPremiumDeluxeUserData = {
	...mockUserData,
	isPremium: true,
	isAutoRenewal: true,
	premiumEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	stripeSubscriptionId: 'sub_123456789',
	premiumDeluxe: true,
};

export const mockPaymentData = {
	id: 'payment_123456789',
	clerkUserId: 'clerk_123456789',
	month: '2024-01',
	amount: 100,
	type: 'premium',
	date: '2024-01-01T00:00:00.000Z',
};

export const mockPaymentHistory = [
	{
		id: 'payment_123456789',
		clerkUserId: 'clerk_123456789',
		month: '2024-01',
		amount: 100,
		type: 'premium',
		date: '2024-01-01T00:00:00.000Z',
	},
	{
		id: 'payment_123456790',
		clerkUserId: 'clerk_123456789',
		month: '2024-02',
		amount: 100,
		type: 'premium',
		date: '2024-02-01T00:00:00.000Z',
	},
];

export const mockStripePriceData = {
	id: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
	object: 'price',
	active: true,
	currency: 'usd',
	unit_amount: 10000,
	recurring: {
		interval: 'month',
	},
};

export const mockStripeCheckoutSessionData = {
	id: 'cs_test_123456789',
	object: 'checkout.session',
	url: 'https://checkout.stripe.com/pay/cs_test_123456789',
	payment_status: 'paid',
	subscription: 'sub_123456789',
	metadata: {
		clerkUserId: 'clerk_123456789',
		priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
	},
};

export const mockStripeCustomerData = {
	id: 'cus_123456789',
	object: 'customer',
	email: 'test@example.com',
};

export const mockStripeInvoiceData = {
	id: 'in_123456789',
	object: 'invoice',
	amount_paid: 10000,
	currency: 'usd',
	status: 'paid',
	description: 'Premium subscription',
	created: 1640995200,
	period_start: 1640995200,
	lines: {
		data: [
			{
				description: 'Premium subscription',
			},
		],
	},
};

export const mockStripePaymentHistory = [
	{
		id: 'in_123456789',
		amount: 100,
		currency: 'usd',
		date: '2022-01-01T00:00:00.000Z',
		status: 'paid',
		description: 'Premium subscription',
		period: '2022-01-01T00:00:00.000Z',
		type: 'Premium subscription',
	},
];

export const mockServiceResponses = {
	createCheckoutSessionSuccess: {
		url: 'https://checkout.stripe.com/pay/cs_test_123456789',
	},
	activatePremiumSuccess: {
		success: true,
	},
	activatePremiumFailed: {
		error: 'Платеж не прошел',
	},
	addPaymentHistorySuccess: {
		success: true,
		payment: mockPaymentData,
	},
	getPaymentHistorySuccess: {
		payments: mockPaymentHistory,
	},
	getStripePaymentHistorySuccess: {
		payments: mockStripePaymentHistory,
		total: mockStripePaymentHistory.length,
	},
	cancelAutoRenewalSuccess: {
		success: true,
		message: 'Автопродление подписки отключено.',
	},
	cancelAutoRenewalNoStripeSuccess: {
		success: true,
		message: 'Автопродление подписки отключено (без Stripe).',
	},
	renewAutoRenewalSuccess: {
		success: true,
		message: 'Автопродление подписки включено.',
	},
};

export const mockErrors = {
	userNotFound: 'Пользователь не найден',
	userNotFoundOrNoEmail: 'Пользователь не найден или отсутствует email',
	clerkUserIdRequired: 'clerkUserId is required',
	clerkUserIdRequiredRu: 'clerkUserId обязателен',
	invalidPriceId: 'Неверный price ID: price_invalid. Пожалуйста, обратитесь к администратору.',
	paymentNotCompleted: 'Платеж не прошел',
	premiumActivationError: 'Ошибка активации премиума',
	checkoutSessionError: 'Ошибка при создании сессии',
	paymentHistoryError: 'Ошибка при добавлении платежа',
	getPaymentHistoryError: 'Ошибка при получении истории платежей',
	getStripePaymentHistoryError: 'Ошибка при получении истории Stripe',
	cancelAutoRenewalError: 'Ошибка при отключении автообновления',
	renewAutoRenewalError: 'Ошибка при включении автопродления',
	autoRenewalAlreadyDisabled: 'Автопродление уже отключено',
	autoRenewalAlreadyEnabled: 'Автопродление уже включено',
};

export const mockEmailResponses = {
	success: {
		success: true,
		messageId: 'email_123456789',
	},
	error: new Error('Email service failed'),
};

export const mockTelegramResponses = {
	success: {
		ok: true,
		result: {
			message_id: 123456789,
		},
	},
	error: new Error('Telegram service failed'),
};

export const mockClerkResponses = {
	success: {
		id: 'clerk_123456789',
		public_metadata: {
			isPremium: true,
			premiumDeluxe: false,
		},
	},
	error: new Error('Clerk API failed'),
};

// Price IDs for different subscription types
export const mockPriceIds = {
	pro: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
	premiumDeluxe1: 'price_1RfHjiCOLiDbHvw1repgIbnK',
	premiumDeluxe2: 'price_1Rfli2COLiDbHvw1xdMaguLf',
	premiumDeluxe3: 'price_1RqXuoCOLiDbHvw1LLew4Mo8',
	premiumDeluxe4: 'price_1RqXveCOLiDbHvw18RQxj2g6',
	invalid: 'price_invalid',
};

// Reset mocks function
export const resetPaymentsMocks = () => {
	mockPrismaInstance.user.findUnique.mockClear();
	mockPrismaInstance.user.update.mockClear();
	mockPrismaInstance.payment.create.mockClear();
	mockPrismaInstance.payment.findMany.mockClear();
	mockPrismaInstance.message.create.mockClear();
	mockStripeInstance.prices.retrieve.mockClear();
	mockStripeInstance.checkout.sessions.create.mockClear();
	mockStripeInstance.checkout.sessions.retrieve.mockClear();
	mockStripeInstance.subscriptions.update.mockClear();
	mockStripeInstance.customers.list.mockClear();
	mockStripeInstance.invoices.list.mockClear();
	mockSendTelegramNotification.mockClear();
	mockSendPremiumDeluxeWelcomeEmail.mockClear();
	mockSendProWelcomeEmail.mockClear();
	mockFetch.mockClear();
	vi.clearAllMocks();
};
