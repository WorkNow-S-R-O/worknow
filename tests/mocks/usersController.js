import { vi } from 'vitest';

// Mock user service functions
export const mockSyncUserService = vi.fn();
export const mockGetUserByClerkIdService = vi.fn();
export const mockGetUserJobsService = vi.fn();

// Mock console methods
export const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
};

// Mock request and response objects
export const mockRequest = (
	body = {},
	params = {},
	query = {},
	headers = {},
) => ({
	body,
	params,
	query,
	headers,
});

export const mockResponse = () => {
	const res = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
		send: vi.fn().mockReturnThis(),
	};
	return res;
};

// Mock user data
export const mockUserData = {
	validUser: {
		id: 'user_123',
		clerkUserId: 'user_123',
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
		isPremiumDeluxe: false,
		isAutoRenewal: true,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		stripeCustomerId: null,
		isAdmin: false,
		imageUrl: 'https://example.com/avatar.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	},
	premiumUser: {
		id: 'user_456',
		clerkUserId: 'user_456',
		email: 'premium@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		isPremium: true,
		isPremiumDeluxe: false,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2024-12-31'),
		stripeSubscriptionId: 'sub_123456789',
		stripeCustomerId: 'cus_123456789',
		isAdmin: false,
		imageUrl: 'https://example.com/premium-avatar.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-15'),
	},
	syncedUser: {
		id: 'user_789',
		clerkUserId: 'user_789',
		email: 'synced@example.com',
		firstName: 'Synced',
		lastName: 'User',
		isPremium: false,
		isPremiumDeluxe: false,
		isAutoRenewal: false,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		stripeCustomerId: null,
		isAdmin: false,
		imageUrl: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-20'),
	},
};

// Mock job data
export const mockJobData = {
	jobWithTranslation: {
		id: 1,
		title: 'Software Developer',
		salary: '50000-70000',
		phone: '+972501234567',
		description: 'Looking for experienced developer',
		cityId: 1,
		userId: 'user_123',
		categoryId: 1,
		shuttle: true,
		meals: false,
		boostedAt: null,
		createdAt: new Date('2024-01-01'),
		category: {
			id: 1,
			name: 'IT',
			translations: [
				{ id: 1, categoryId: 1, lang: 'ru', name: 'IT' },
				{ id: 2, categoryId: 1, lang: 'en', name: 'Information Technology' },
				{ id: 3, categoryId: 1, lang: 'he', name: 'טכנולוגיית מידע' },
				{ id: 4, categoryId: 1, lang: 'ar', name: 'تكنولوجيا المعلومات' },
			],
		},
	},
	jobWithoutTranslation: {
		id: 2,
		title: 'Designer',
		salary: '40000-60000',
		phone: '+972509876543',
		description: 'Looking for creative designer',
		cityId: 2,
		userId: 'user_456',
		categoryId: 2,
		shuttle: false,
		meals: true,
		boostedAt: new Date('2024-01-15'),
		createdAt: new Date('2024-01-02'),
		category: {
			id: 2,
			name: 'Design',
			translations: [],
		},
	},
	jobWithoutCategory: {
		id: 3,
		title: 'Manager',
		salary: '60000-80000',
		phone: '+972501111111',
		description: 'Looking for project manager',
		cityId: 3,
		userId: 'user_789',
		categoryId: null,
		shuttle: null,
		meals: null,
		boostedAt: null,
		createdAt: new Date('2024-01-03'),
		category: null,
	},
	jobList: [
		{
			id: 1,
			title: 'Software Developer',
			salary: '50000-70000',
			phone: '+972501234567',
			description: 'Looking for experienced developer',
			cityId: 1,
			userId: 'user_123',
			categoryId: 1,
			shuttle: true,
			meals: false,
			boostedAt: null,
			createdAt: new Date('2024-01-01'),
		},
		{
			id: 2,
			title: 'Designer',
			salary: '40000-60000',
			phone: '+972509876543',
			description: 'Looking for creative designer',
			cityId: 2,
			userId: 'user_456',
			categoryId: 2,
			shuttle: false,
			meals: true,
			boostedAt: new Date('2024-01-15'),
			createdAt: new Date('2024-01-02'),
		},
	],
	paginatedJobs: {
		jobs: [
			{
				id: 1,
				title: 'Software Developer',
				salary: '50000-70000',
				phone: '+972501234567',
				description: 'Looking for experienced developer',
				cityId: 1,
				userId: 'user_123',
				categoryId: 1,
				shuttle: true,
				meals: false,
				boostedAt: null,
				createdAt: new Date('2024-01-01'),
			},
		],
		total: 1,
		page: 1,
		limit: 10,
		totalPages: 1,
	},
};

// Mock webhook data
export const mockWebhookData = {
	validWebhookPayload: {
		type: 'user.created',
		data: {
			id: 'user_123',
			email_addresses: [{ email_address: 'user@example.com' }],
			first_name: 'John',
			last_name: 'Doe',
			image_url: 'https://example.com/avatar.jpg',
		},
	},
	userUpdatedPayload: {
		type: 'user.updated',
		data: {
			id: 'user_456',
			email_addresses: [{ email_address: 'premium@example.com' }],
			first_name: 'Jane',
			last_name: 'Smith',
			image_url: 'https://example.com/premium-avatar.jpg',
		},
	},
	userDeletedPayload: {
		type: 'user.deleted',
		data: {
			id: 'user_789',
		},
	},
	invalidWebhookPayload: {
		type: 'invalid.type',
		data: {},
	},
};

// Mock headers
export const mockHeaders = {
	validSvixHeaders: {
		'svix-id': 'msg_123456789',
		'svix-timestamp': '1640995200',
		'svix-signature': 'v1,signature_hash',
	},
	missingSvixId: {
		'svix-timestamp': '1640995200',
		'svix-signature': 'v1,signature_hash',
	},
	missingSvixTimestamp: {
		'svix-id': 'msg_123456789',
		'svix-signature': 'v1,signature_hash',
	},
	missingSvixSignature: {
		'svix-id': 'msg_123456789',
		'svix-timestamp': '1640995200',
	},
	emptyHeaders: {},
};

// Mock errors
export const mockErrors = {
	webhookSecretMissing: new Error('Missing Clerk Webhook Secret'),
	svixHeadersMissing: new Error('Missing Svix headers'),
	webhookVerificationFailed: new Error('Webhook verification failed'),
	userNotFound: new Error('User not found'),
	serviceError: new Error('Service error'),
	databaseError: new Error('Database connection failed'),
	syncError: new Error('User sync failed'),
	jobsError: new Error('Failed to get user jobs'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulSync: {
		success: true,
		user: mockUserData.syncedUser,
	},
	successfulUserLookup: {
		user: mockUserData.validUser,
	},
	successfulJobsLookup: {
		jobs: mockJobData.jobList,
		total: 2,
		page: 1,
		limit: 10,
		totalPages: 1,
	},
	successfulPaginatedJobs: mockJobData.paginatedJobs,
	syncError: {
		error: 'User sync failed',
	},
	userNotFound: {
		error: 'User not found',
	},
	jobsError: {
		error: 'Failed to get user jobs',
	},
};

// Mock user service logic
export const mockUserServiceLogic = {
	syncUserService: async (payload) => {
		if (!payload) {
			throw mockErrors.webhookVerificationFailed;
		}
		if (payload.clerkUserId === 'error_user') {
			throw mockErrors.syncError;
		}
		return mockServiceResponses.successfulSync;
	},
	getUserByClerkIdService: async (clerkUserId) => {
		if (!clerkUserId) {
			return mockServiceResponses.userNotFound;
		}
		if (clerkUserId === 'nonexistent_user') {
			return mockServiceResponses.userNotFound;
		}
		if (clerkUserId === 'error_user') {
			throw mockErrors.serviceError;
		}
		return mockServiceResponses.successfulUserLookup;
	},
	getUserJobsService: async (clerkUserId, query) => {
		if (!clerkUserId) {
			return mockServiceResponses.jobsError;
		}
		if (clerkUserId === 'error_user') {
			throw mockErrors.jobsError;
		}
		if (query.page && query.limit) {
			return mockServiceResponses.successfulPaginatedJobs;
		}
		return mockServiceResponses.successfulJobsLookup;
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processClerkWebhook: async (req, res) => {
		// eslint-disable-next-line no-undef
		const { WEBHOOK_SECRET } = process.env;
		if (!WEBHOOK_SECRET)
			return res.status(500).json({ error: 'Missing Clerk Webhook Secret' });

		const svix_id = req.headers['svix-id'];
		const svix_timestamp = req.headers['svix-timestamp'];
		const svix_signature = req.headers['svix-signature'];

		if (!svix_id || !svix_timestamp || !svix_signature) {
			return res.status(400).json({ error: 'Missing Svix headers' });
		}

		try {
			await mockSyncUserService(req.body);
			res.status(200).json({ success: true });
		} catch (error) {
			res
				.status(400)
				.json({ error: 'Webhook verification failed', details: error.message });
		}
	},
	processSyncUser: async (req, res) => {
		const result = await mockSyncUserService(req.body.clerkUserId);
		if (result.error) return res.status(500).json({ error: result.error });
		res.status(200).json(result);
	},
	processGetUserByClerkId: async (req, res) => {
		try {
			const result = await mockGetUserByClerkIdService(req.params.clerkUserId);
			if (result.error) return res.status(404).json({ error: result.error });
			res.status(200).json(result.user);
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
	},
	processGetUserJobs: async (req, res) => {
		const lang = req.query.lang || 'ru';
		const result = await mockGetUserJobsService(
			req.params.clerkUserId,
			req.query,
		);
		if (result.error) return res.status(500).json({ error: result.error });
		// Формируем ответ с переводом категории
		const jobs = result.jobs.map((job) => {
			let categoryLabel = job.category?.name;
			if (job.category?.translations?.length) {
				const translation = job.category.translations.find(
					(t) => t.lang === lang,
				);
				if (translation) categoryLabel = translation.name;
			}
			return {
				...job,
				category: job.category
					? { ...job.category, label: categoryLabel }
					: null,
			};
		});
		res.status(200).json({ ...result, jobs });
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (body = {}, params = {}, query = {}, headers = {}) => ({
		body,
		params,
		query,
		headers,
	}),
	buildResponse: () => {
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
			send: vi.fn().mockReturnThis(),
		};
		return res;
	},
	validateControllerInput: (req) => {
		// Basic validation logic
		return !!(req.body || req.params || req.query);
	},
};

// Mock environment variables
export const mockEnv = {
	WEBHOOK_SECRET: 'whsec_test_secret',
	CLERK_SECRET_KEY: 'sk_test_key',
	STRIPE_SECRET_KEY: 'sk_test_stripe_key',
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockSyncUserService.mockClear();
	mockGetUserByClerkIdService.mockClear();
	mockGetUserJobsService.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
};

// Mock the services
vi.mock('../../services/userService.js', () => ({
	syncUserService: mockSyncUserService,
	getUserByClerkIdService: mockGetUserByClerkIdService,
	getUserJobsService: mockGetUserJobsService,
}));

// Mock console
Object.assign(console, mockConsole);

// Mock process.env
Object.assign(process.env, mockEnv);
