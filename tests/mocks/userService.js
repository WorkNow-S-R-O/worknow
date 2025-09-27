import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		findUnique: vi.fn(),
		upsert: vi.fn(),
		delete: vi.fn(),
	},
	job: {
		findMany: vi.fn(),
		count: vi.fn(),
	},
};

// Mock external dependencies
export const mockFetch = vi.fn();
export const mockWebhook = vi.fn();

// Mock console methods
export const mockConsoleLog = vi
	.spyOn(console, 'log')
	.mockImplementation(() => {});
export const mockConsoleError = vi
	.spyOn(console, 'error')
	.mockImplementation(() => {});

// Mock environment variables
export const mockEnvVars = {
	CLERK_SECRET_KEY: 'sk_test_mock_clerk_secret_key_123456789',
	WEBHOOK_SECRET: 'whsec_mock_webhook_secret_123456789',
};

// Mock user data
export const mockUserData = {
	validUser: {
		id: 'user123',
		email: 'john@example.com',
		clerkUserId: 'clerk_user123',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
		isPremium: false,
		isAutoRenewal: true,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-15T10:00:00Z'),
		updatedAt: new Date('2024-01-15T10:00:00Z'),
	},

	premiumUser: {
		id: 'premium456',
		email: 'premium@example.com',
		clerkUserId: 'clerk_premium456',
		firstName: 'Jane',
		lastName: 'Smith',
		imageUrl: 'https://example.com/premium-avatar.jpg',
		isPremium: true,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2025-12-31T23:59:59Z'),
		stripeSubscriptionId: 'sub_premium123',
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-10T09:30:00Z'),
		updatedAt: new Date('2024-01-15T14:20:00Z'),
	},

	newUser: {
		id: 'new789',
		email: 'new@example.com',
		clerkUserId: 'clerk_new789',
		firstName: 'New',
		lastName: 'User',
		imageUrl: 'https://example.com/new-avatar.jpg',
		isPremium: false,
		isAutoRenewal: false,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-20T12:00:00Z'),
		updatedAt: new Date('2024-01-20T12:00:00Z'),
	},
};

// Mock Clerk API responses
export const mockClerkApiResponses = {
	successfulUserFetch: {
		id: 'clerk_user123',
		email_addresses: [
			{
				email_address: 'john@example.com',
				id: 'email123',
			},
		],
		first_name: 'John',
		last_name: 'Doe',
		image_url: 'https://example.com/avatar.jpg',
		created_at: 1640995200000,
		updated_at: 1640995200000,
	},

	premiumUserFetch: {
		id: 'clerk_premium456',
		email_addresses: [
			{
				email_address: 'premium@example.com',
				id: 'email456',
			},
		],
		first_name: 'Jane',
		last_name: 'Smith',
		image_url: 'https://example.com/premium-avatar.jpg',
		created_at: 1640995200000,
		updated_at: 1640995200000,
	},

	newUserFetch: {
		id: 'clerk_new789',
		email_addresses: [
			{
				email_address: 'new@example.com',
				id: 'email789',
			},
		],
		first_name: 'New',
		last_name: 'User',
		image_url: 'https://example.com/new-avatar.jpg',
		created_at: 1640995200000,
		updated_at: 1640995200000,
	},

	userWithMinimalData: {
		id: 'clerk_minimal202',
		email_addresses: [
			{
				email_address: 'minimal@example.com',
				id: 'email202',
			},
		],
		first_name: null,
		last_name: null,
		image_url: null,
		created_at: 1640995200000,
		updated_at: 1640995200000,
	},
};

// Mock job data
export const mockJobData = {
	userJobs: [
		{
			id: 1,
			title: 'Software Engineer',
			description: 'Develop and maintain software applications.',
			salary: 120000,
			cityId: 1,
			categoryId: 2,
			userId: 'user123',
			phone: '123-456-7890',
			status: 'ACTIVE',
			createdAt: new Date('2024-01-15T10:00:00Z'),
			city: { id: 1, name: 'Tel Aviv' },
			user: mockUserData.validUser,
			category: {
				id: 2,
				name: 'IT',
				translations: [
					{ lang: 'ru', name: 'IT' },
					{ lang: 'en', name: 'IT' },
				],
			},
		},
		{
			id: 2,
			title: 'Marketing Manager',
			description: 'Manage marketing campaigns.',
			salary: 80000,
			cityId: 3,
			categoryId: 4,
			userId: 'user123',
			phone: '098-765-4321',
			status: 'ACTIVE',
			createdAt: new Date('2024-01-14T09:00:00Z'),
			city: { id: 3, name: 'Jerusalem' },
			user: mockUserData.validUser,
			category: {
				id: 4,
				name: 'Marketing',
				translations: [
					{ lang: 'ru', name: 'Маркетинг' },
					{ lang: 'en', name: 'Marketing' },
				],
			},
		},
	],

	premiumUserJobs: [
		{
			id: 3,
			title: 'Senior Developer',
			description: 'Lead a team of developers.',
			salary: 150000,
			cityId: 5,
			categoryId: 6,
			userId: 'premium456',
			phone: '111-222-3333',
			status: 'ACTIVE',
			createdAt: new Date('2024-01-13T08:00:00Z'),
			city: { id: 5, name: 'Haifa' },
			user: mockUserData.premiumUser,
			category: {
				id: 6,
				name: 'Engineering',
				translations: [
					{ lang: 'ru', name: 'Инженерия' },
					{ lang: 'en', name: 'Engineering' },
				],
			},
		},
	],
};

// Mock webhook data
export const mockWebhookData = {
	userCreated: {
		type: 'user.created',
		data: {
			id: 'clerk_new789',
			email_addresses: [
				{
					email_address: 'new@example.com',
					id: 'email789',
				},
			],
			first_name: 'New',
			last_name: 'User',
			image_url: 'https://example.com/new-avatar.jpg',
		},
	},

	userUpdated: {
		type: 'user.updated',
		data: {
			id: 'clerk_user123',
			email_addresses: [
				{
					email_address: 'john.updated@example.com',
					id: 'email123',
				},
			],
			first_name: 'John',
			last_name: 'Doe Updated',
			image_url: 'https://example.com/updated-avatar.jpg',
		},
	},

	userDeleted: {
		type: 'user.deleted',
		data: {
			id: 'clerk_deleted101',
		},
	},
};

// Mock webhook headers
export const mockWebhookHeaders = {
	validHeaders: {
		'svix-id': 'msg_123456789',
		'svix-timestamp': '1640995200',
		'svix-signature': 'v1,valid_signature_hash',
	},

	missingHeaders: {
		'svix-id': 'msg_123456789',
		'svix-timestamp': '1640995200',
		// Missing svix-signature
	},

	invalidHeaders: {
		'svix-id': '',
		'svix-timestamp': '',
		'svix-signature': '',
	},
};

// Mock service responses
export const mockServiceResponses = {
	syncUserSuccess: {
		success: true,
		user: mockUserData.validUser,
	},

	syncUserError: {
		error: 'Failed to sync user',
		details: 'Database connection failed',
	},

	getUserByClerkIdSuccess: {
		user: mockUserData.validUser,
	},

	getUserByClerkIdNotFound: {
		error: 'Пользователь не найден',
	},

	getUserJobsSuccess: {
		jobs: mockJobData.userJobs,
		totalJobs: 2,
		totalPages: 1,
		currentPage: 1,
	},

	getUserJobsWithPagination: {
		jobs: mockJobData.userJobs.slice(0, 1),
		totalJobs: 2,
		totalPages: 2,
		currentPage: 1,
	},

	webhookSuccess: {
		success: true,
	},

	webhookError: {
		error: 'Webhook verification failed',
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	clerkApiError: new Error('Clerk API request failed'),
	webhookVerificationError: new Error('Webhook verification failed'),
	missingClerkId: new Error('Missing Clerk user ID'),
	missingClerkSecret: new Error('Clerk secret key is not configured'),
	missingWebhookHeaders: new Error('Missing Svix headers'),
	userNotFound: new Error('User not found'),
	syncError: new Error('Failed to sync user'),
	getUserError: new Error('Ошибка получения пользователя'),
	getJobsError: new Error('Ошибка сервера'),
};

// Mock error messages
export const mockErrorMessages = {
	databaseError: 'Database connection failed',
	clerkApiError: 'Clerk API request failed',
	webhookVerificationError: 'Webhook verification failed',
	missingClerkId: 'Missing Clerk user ID',
	missingClerkSecret: 'Clerk secret key is not configured',
	missingWebhookHeaders: 'Missing Svix headers',
	userNotFound: 'Пользователь не найден',
	syncError: 'Failed to sync user',
	getUserError: 'Ошибка получения пользователя',
	getJobsError: 'Ошибка сервера',
	clerkApiErrorStatus: 'Ошибка Clerk API: 404 Not Found',
	syncUserError: 'Ошибка синхронизации пользователя',
};

// Mock success messages
export const mockSuccessMessages = {
	userSynced: 'User synced successfully',
	userFound: 'User found in database',
	userCreated: 'User created successfully',
	userUpdated: 'User updated successfully',
	userDeleted: 'User deleted successfully',
	jobsRetrieved: 'User jobs retrieved successfully',
	webhookProcessed: 'Webhook processed successfully',
	operationCompleted: 'Operation completed successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	userServiceStart: 'UserService - Starting sync for clerkUserId:',
	userServiceKeyAvailable: 'UserService - CLERK_SECRET_KEY available:',
	userServiceKeyLength: 'UserService - CLERK_SECRET_KEY length:',
	userServiceUserNotFound:
		'UserService - User not found in DB, fetching from Clerk...',
	userServiceApiCall: 'UserService - Making API call to Clerk with key:',
	userServiceApiResponse: 'UserService - Clerk API response status:',
	userServiceUserData: 'UserService - Clerk user data received:',
	userServiceUserCreated: 'UserService - User created successfully:',
	userServiceUserFound: 'UserService - User found in DB:',
	userServiceError: 'UserService - Error syncing user:',
	userServiceClerkError: 'UserService - Clerk API error:',
	userServiceMissingKey: 'UserService - CLERK_SECRET_KEY is missing',
	webhookVerificationFailed: 'Webhook verification failed',
	userJobsError: 'Ошибка получения объявлений пользователя:',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		clerkUserId: 'clerk_user123',
		email: 'john@example.com',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
	},

	number: {
		page: 1,
		limit: 5,
		skip: 0,
		totalJobs: 2,
		totalPages: 1,
		currentPage: 1,
	},

	boolean: {
		success: true,
		isPremium: false,
		isAutoRenewal: true,
		premiumDeluxe: false,
		isAdmin: false,
	},

	date: {
		createdAt: new Date('2024-01-15T10:00:00Z'),
		updatedAt: new Date('2024-01-15T10:00:00Z'),
		premiumEndsAt: new Date('2025-12-31T23:59:59Z'),
	},

	object: {
		user: mockUserData.validUser,
		jobs: mockJobData.userJobs,
		response: mockServiceResponses.syncUserSuccess,
		error: mockErrors.databaseError,
	},

	null: {
		firstName: null,
		lastName: null,
		imageUrl: null,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
	},
};

// Mock user synchronization logic
export const mockUserSyncLogic = {
	isValidClerkUserId: (clerkUserId) => {
		return typeof clerkUserId === 'string' && clerkUserId.length > 0;
	},

	isClerkSecretConfigured: (secretKey) => {
		return typeof secretKey === 'string' && secretKey.length > 0;
	},

	extractUserDataFromClerk: (clerkUser) => {
		return {
			clerkUserId: clerkUser.id,
			email: clerkUser.email_addresses?.[0]?.email_address || null,
			firstName: clerkUser.first_name || null,
			lastName: clerkUser.last_name || null,
			imageUrl: clerkUser.image_url || null,
		};
	},

	buildUpsertData: (clerkUser) => {
		return {
			where: { clerkUserId: clerkUser.id },
			update: {
				email: clerkUser.email_addresses?.[0]?.email_address || null,
				firstName: clerkUser.first_name || null,
				lastName: clerkUser.last_name || null,
				imageUrl: clerkUser.image_url || null,
			},
			create: {
				clerkUserId: clerkUser.id,
				email: clerkUser.email_addresses?.[0]?.email_address || null,
				firstName: clerkUser.first_name || null,
				lastName: clerkUser.last_name || null,
				imageUrl: clerkUser.image_url || null,
			},
		};
	},

	handleClerkApiError: (response) => {
		return {
			error: `Ошибка Clerk API: ${response.status} ${response.statusText}`,
		};
	},

	handleSyncError: (error) => {
		return {
			error: 'Failed to sync user',
			details: error.message,
		};
	},
};

// Mock webhook processing logic
export const mockWebhookProcessingLogic = {
	validateWebhookHeaders: (headers) => {
		return !!(
			headers['svix-id'] &&
			headers['svix-timestamp'] &&
			headers['svix-signature']
		);
	},

	extractWebhookData: (event) => {
		return {
			userId: event.data.id,
			email: event.data.email_addresses?.[0]?.email_address,
			firstName: event.data.first_name,
			lastName: event.data.last_name,
			imageUrl: event.data.image_url,
		};
	},

	buildUserUpsertData: (webhookData) => {
		return {
			where: { clerkUserId: webhookData.userId },
			update: {
				email: webhookData.email,
				firstName: webhookData.firstName || null,
				lastName: webhookData.lastName || null,
				imageUrl: webhookData.imageUrl || null,
			},
			create: {
				clerkUserId: webhookData.userId,
				email: webhookData.email,
				firstName: webhookData.firstName || null,
				lastName: webhookData.lastName || null,
				imageUrl: webhookData.imageUrl || null,
			},
		};
	},

	handleWebhookError: (error) => {
		return {
			error: 'Webhook verification failed',
		};
	},
};

// Mock job retrieval logic
export const mockJobRetrievalLogic = {
	parsePaginationParams: (query) => {
		const page = parseInt(query.page) || 1;
		const limit = parseInt(query.limit) || 5;
		const skip = (page - 1) * limit;
		return { page, limit, skip };
	},

	buildJobQuery: (userId, skip, limit) => {
		return {
			where: { userId },
			include: {
				city: true,
				user: true,
				category: { include: { translations: true } },
			},
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		};
	},

	calculatePagination: (totalJobs, limit) => {
		return {
			totalJobs,
			totalPages: Math.ceil(totalJobs / limit),
		};
	},

	handleJobRetrievalError: (error) => {
		return {
			error: 'Ошибка сервера',
			details: error.message,
		};
	},
};

// Reset mocks before each test
export const resetUserServiceMocks = () => {
	mockPrisma.user.findUnique.mockClear();
	mockPrisma.user.upsert.mockClear();
	mockPrisma.user.delete.mockClear();
	mockPrisma.job.findMany.mockClear();
	mockPrisma.job.count.mockClear();
	mockFetch.mockClear();
	mockWebhook.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	vi.clearAllMocks();
};
