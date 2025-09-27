import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		upsert: vi.fn(),
	},
};

// Mock external dependencies
export const mockFetch = vi.fn();

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
	CLERK_SECRET_KEY_MISSING: null,
	CLERK_SECRET_KEY_EMPTY: '',
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

	userWithMinimalData: {
		id: 'minimal202',
		email: 'minimal@example.com',
		clerkUserId: 'clerk_minimal202',
		firstName: null,
		lastName: null,
		imageUrl: null,
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

	userWithNoEmail: {
		id: 'clerk_noemail303',
		email_addresses: [],
		first_name: 'NoEmail',
		last_name: 'User',
		image_url: 'https://example.com/noemail-avatar.jpg',
		created_at: 1640995200000,
		updated_at: 1640995200000,
	},

	userWithEmptyEmail: {
		id: 'clerk_emptyemail404',
		email_addresses: [
			{
				email_address: '',
				id: 'email404',
			},
		],
		first_name: 'EmptyEmail',
		last_name: 'User',
		image_url: 'https://example.com/emptyemail-avatar.jpg',
		created_at: 1640995200000,
		updated_at: 1640995200000,
	},
};

// Mock fetch responses
export const mockFetchResponses = {
	successfulResponse: {
		ok: true,
		status: 200,
		statusText: 'OK',
		json: vi.fn().mockResolvedValue(mockClerkApiResponses.successfulUserFetch),
		text: vi.fn().mockResolvedValue('Success'),
	},

	premiumUserResponse: {
		ok: true,
		status: 200,
		statusText: 'OK',
		json: vi.fn().mockResolvedValue(mockClerkApiResponses.premiumUserFetch),
		text: vi.fn().mockResolvedValue('Success'),
	},

	newUserResponse: {
		ok: true,
		status: 200,
		statusText: 'OK',
		json: vi.fn().mockResolvedValue(mockClerkApiResponses.newUserFetch),
		text: vi.fn().mockResolvedValue('Success'),
	},

	minimalDataResponse: {
		ok: true,
		status: 200,
		statusText: 'OK',
		json: vi.fn().mockResolvedValue(mockClerkApiResponses.userWithMinimalData),
		text: vi.fn().mockResolvedValue('Success'),
	},

	notFoundResponse: {
		ok: false,
		status: 404,
		statusText: 'Not Found',
		json: vi.fn().mockResolvedValue({ error: 'User not found' }),
		text: vi.fn().mockResolvedValue('User not found'),
	},

	unauthorizedResponse: {
		ok: false,
		status: 401,
		statusText: 'Unauthorized',
		json: vi.fn().mockResolvedValue({ error: 'Unauthorized' }),
		text: vi.fn().mockResolvedValue('Unauthorized'),
	},

	serverErrorResponse: {
		ok: false,
		status: 500,
		statusText: 'Internal Server Error',
		json: vi.fn().mockResolvedValue({ error: 'Internal Server Error' }),
		text: vi.fn().mockResolvedValue('Internal Server Error'),
	},

	networkErrorResponse: {
		ok: false,
		status: 0,
		statusText: 'Network Error',
		json: vi.fn().mockRejectedValue(new Error('Network Error')),
		text: vi.fn().mockRejectedValue(new Error('Network Error')),
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

	syncUserClerkApiError: {
		error: 'Ошибка Clerk API: 404 Not Found',
	},

	syncUserMissingKeyError: {
		error: 'Clerk secret key is not configured',
	},

	syncUserNetworkError: {
		error: 'Failed to sync user',
		details: 'Network Error',
	},

	syncUserDatabaseError: {
		error: 'Failed to sync user',
		details: 'Database connection failed',
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	clerkApiError: new Error('Clerk API request failed'),
	networkError: new Error('Network Error'),
	missingClerkId: new Error('Missing Clerk user ID'),
	missingClerkSecret: new Error('Clerk secret key is not configured'),
	userNotFound: new Error('User not found'),
	syncError: new Error('Failed to sync user'),
	unauthorizedError: new Error('Unauthorized'),
	serverError: new Error('Internal Server Error'),
	timeoutError: new Error('Request timeout'),
};

// Mock error messages
export const mockErrorMessages = {
	databaseError: 'Database connection failed',
	clerkApiError: 'Clerk API request failed',
	networkError: 'Network Error',
	missingClerkId: 'Missing Clerk user ID',
	missingClerkSecret: 'Clerk secret key is not configured',
	userNotFound: 'User not found',
	syncError: 'Failed to sync user',
	unauthorizedError: 'Unauthorized',
	serverError: 'Internal Server Error',
	timeoutError: 'Request timeout',
	clerkApiErrorStatus: 'Ошибка Clerk API: 404 Not Found',
	clerkApiUnauthorized: 'Ошибка Clerk API: 401 Unauthorized',
	clerkApiServerError: 'Ошибка Clerk API: 500 Internal Server Error',
};

// Mock success messages
export const mockSuccessMessages = {
	userSynced: 'User synced successfully',
	userCreated: 'User created successfully',
	userUpdated: 'User updated successfully',
	operationCompleted: 'Operation completed successfully',
	syncCompleted: 'Sync completed successfully',
	apiCallSuccessful: 'API call successful',
	databaseOperationSuccessful: 'Database operation successful',
};

// Mock console log data
export const mockConsoleLogData = {
	userSyncServiceStart: 'UserSyncService - Starting sync for clerkUserId:',
	userSyncServiceKeyAvailable: 'UserSyncService - CLERK_SECRET_KEY available:',
	userSyncServiceFetchingData:
		'UserSyncService - Fetching user data from Clerk API...',
	userSyncServiceApiResponse: 'UserSyncService - Clerk API response status:',
	userSyncServiceUserData: 'UserSyncService - Clerk user data received:',
	userSyncServiceUpserting: 'UserSyncService - Upserting user in database...',
	userSyncServiceSuccess: 'UserSyncService - User synced successfully:',
	userSyncServiceError: 'UserSyncService - Error syncing user:',
	userSyncServiceClerkError: 'UserSyncService - Clerk API error:',
	userSyncServiceMissingKey: 'UserSyncService - CLERK_SECRET_KEY is missing',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		clerkUserId: 'clerk_user123',
		email: 'john@example.com',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
		clerkSecretKey: 'sk_test_mock_clerk_secret_key_123456789',
	},

	number: {
		status: 200,
		statusCode: 200,
		createdAt: 1640995200000,
		updatedAt: 1640995200000,
	},

	boolean: {
		success: true,
		isPremium: false,
		isAutoRenewal: true,
		premiumDeluxe: false,
		isAdmin: false,
		responseOk: true,
	},

	date: {
		createdAt: new Date('2024-01-15T10:00:00Z'),
		updatedAt: new Date('2024-01-15T10:00:00Z'),
		premiumEndsAt: new Date('2025-12-31T23:59:59Z'),
	},

	object: {
		user: mockUserData.validUser,
		response: mockServiceResponses.syncUserSuccess,
		error: mockErrors.databaseError,
		clerkUser: mockClerkApiResponses.successfulUserFetch,
	},

	null: {
		firstName: null,
		lastName: null,
		imageUrl: null,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		clerkSecretKey: null,
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

	buildUpsertData: (clerkUserId, clerkUser) => {
		return {
			where: { clerkUserId },
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

	handleMissingClerkSecret: () => {
		return {
			error: 'Clerk secret key is not configured',
		};
	},

	buildClerkApiUrl: (clerkUserId) => {
		return `https://api.clerk.com/v1/users/${clerkUserId}`;
	},

	buildClerkApiHeaders: (secretKey) => {
		return {
			Authorization: `Bearer ${secretKey}`,
			'Content-Type': 'application/json',
		};
	},

	validateClerkApiResponse: (response) => {
		return response.ok;
	},

	processClerkUserData: (clerkUser) => {
		return {
			id: clerkUser.id,
			email: clerkUser.email_addresses?.[0]?.email_address,
			firstName: clerkUser.first_name,
			lastName: clerkUser.last_name,
		};
	},
};

// Mock environment variable logic
export const mockEnvVarLogic = {
	isClerkSecretAvailable: (secretKey) => {
		return !!(
			secretKey &&
			typeof secretKey === 'string' &&
			secretKey.length > 0
		);
	},

	getClerkSecretKey: () => {
		return process.env.CLERK_SECRET_KEY;
	},

	validateEnvironmentVariables: () => {
		const clerkSecretKey = process.env.CLERK_SECRET_KEY;
		return {
			clerkSecretKey: !!clerkSecretKey,
			clerkSecretKeyLength: clerkSecretKey ? clerkSecretKey.length : 0,
		};
	},

	handleMissingEnvironmentVariable: (varName) => {
		return {
			error: `${varName} is not configured`,
		};
	},
};

// Mock database operations logic
export const mockDatabaseOperationsLogic = {
	buildUpsertOperation: (clerkUserId, clerkUser) => {
		return {
			where: { clerkUserId },
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

	handleDatabaseError: (error) => {
		return {
			error: 'Failed to sync user',
			details: error.message,
		};
	},

	validateDatabaseResult: (result) => {
		return !!(result && typeof result === 'object' && result.id);
	},

	processDatabaseResult: (user) => {
		return {
			success: true,
			user,
		};
	},
};

// Mock API integration logic
export const mockApiIntegrationLogic = {
	buildApiRequest: (clerkUserId, secretKey) => {
		return {
			url: `https://api.clerk.com/v1/users/${clerkUserId}`,
			options: {
				headers: {
					Authorization: `Bearer ${secretKey}`,
					'Content-Type': 'application/json',
				},
			},
		};
	},

	handleApiResponse: async (response) => {
		if (!response.ok) {
			const errorText = await response.text();
			return {
				error: `Ошибка Clerk API: ${response.status} ${response.statusText}`,
				details: errorText,
			};
		}

		const data = await response.json();
		return { success: true, data };
	},

	handleApiError: (error) => {
		return {
			error: 'Failed to sync user',
			details: error.message,
		};
	},

	validateApiResponse: (response) => {
		return !!(response && typeof response === 'object');
	},

	processApiData: (data) => {
		return {
			id: data.id,
			email: data.email_addresses?.[0]?.email_address,
			firstName: data.first_name,
			lastName: data.last_name,
		};
	},
};

// Reset mocks before each test
export const resetUserSyncServiceMocks = () => {
	mockPrisma.user.upsert.mockClear();
	mockFetch.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	vi.clearAllMocks();
};
