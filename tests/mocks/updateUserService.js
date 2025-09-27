import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		findUnique: vi.fn(),
	},
};

// Mock console methods
export const mockConsoleLog = vi
	.spyOn(console, 'log')
	.mockImplementation(() => {});
export const mockConsoleError = vi
	.spyOn(console, 'error')
	.mockImplementation(() => {});

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

	premiumDeluxeUser: {
		id: 'deluxe789',
		email: 'deluxe@example.com',
		clerkUserId: 'clerk_deluxe789',
		firstName: 'Bob',
		lastName: 'Johnson',
		imageUrl: 'https://example.com/deluxe-avatar.jpg',
		isPremium: false,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2025-12-31T23:59:59Z'),
		stripeSubscriptionId: 'sub_deluxe456',
		premiumDeluxe: true,
		isAdmin: false,
		createdAt: new Date('2024-01-05T08:15:00Z'),
		updatedAt: new Date('2024-01-15T16:45:00Z'),
	},

	adminUser: {
		id: 'admin101',
		email: 'admin@example.com',
		clerkUserId: 'clerk_admin101',
		firstName: 'Admin',
		lastName: 'User',
		imageUrl: 'https://example.com/admin-avatar.jpg',
		isPremium: true,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2025-12-31T23:59:59Z'),
		stripeSubscriptionId: 'sub_admin789',
		premiumDeluxe: true,
		isAdmin: true,
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-15T18:30:00Z'),
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

	userWithExpiredPremium: {
		id: 'expired303',
		email: 'expired@example.com',
		clerkUserId: 'clerk_expired303',
		firstName: 'Expired',
		lastName: 'User',
		imageUrl: 'https://example.com/expired-avatar.jpg',
		isPremium: false,
		isAutoRenewal: false,
		premiumEndsAt: new Date('2023-12-31T23:59:59Z'),
		stripeSubscriptionId: 'sub_expired123',
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2023-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-01T00:00:00Z'),
	},

	nonExistentUser: null,
};

// Mock clerk user IDs
export const mockClerkUserIds = {
	validClerkId: 'clerk_user123',
	premiumClerkId: 'clerk_premium456',
	deluxeClerkId: 'clerk_deluxe789',
	adminClerkId: 'clerk_admin101',
	minimalClerkId: 'clerk_minimal202',
	expiredClerkId: 'clerk_expired303',
	nonExistentClerkId: 'clerk_nonexistent404',
	invalidClerkId: 'invalid_clerk_id',
	emptyClerkId: '',
	nullClerkId: null,
	undefinedClerkId: undefined,
};

// Mock service responses
export const mockServiceResponses = {
	getUserByClerkIdSuccess: {
		user: mockUserData.validUser,
	},

	getUserByClerkIdNotFound: {
		error: 'Пользователь не найден',
	},

	getUserByClerkIdError: {
		error: 'Ошибка получения данных пользователя',
		details: 'Database connection failed',
	},

	getPremiumUserSuccess: {
		user: mockUserData.premiumUser,
	},

	getDeluxeUserSuccess: {
		user: mockUserData.premiumDeluxeUser,
	},

	getAdminUserSuccess: {
		user: mockUserData.adminUser,
	},

	getMinimalUserSuccess: {
		user: mockUserData.userWithMinimalData,
	},

	getExpiredUserSuccess: {
		user: mockUserData.userWithExpiredPremium,
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	userNotFound: new Error('User not found'),
	invalidClerkId: new Error('Invalid Clerk ID format'),
	prismaError: new Error('Prisma operation failed'),
	networkError: new Error('Network connection failed'),
	timeoutError: new Error('Operation timeout'),
	validationError: new Error('Validation failed'),
	permissionError: new Error('Permission denied'),
	serviceError: new Error('Service unavailable'),
	unknownError: new Error('Unknown error occurred'),
};

// Mock error messages
export const mockErrorMessages = {
	databaseError: 'Database connection failed',
	userNotFound: 'Пользователь не найден',
	invalidClerkId: 'Invalid Clerk ID format',
	prismaError: 'Prisma operation failed',
	networkError: 'Network connection failed',
	timeoutError: 'Operation timeout',
	validationError: 'Validation failed',
	permissionError: 'Permission denied',
	serviceError: 'Service unavailable',
	unknownError: 'Unknown error occurred',
	userRetrievalError: 'Ошибка получения данных пользователя',
};

// Mock success messages
export const mockSuccessMessages = {
	userRetrieved: 'User retrieved successfully',
	userFound: 'User found',
	userDataLoaded: 'User data loaded successfully',
	operationCompleted: 'Operation completed successfully',
	serviceAvailable: 'Service is available',
	databaseConnected: 'Database connected successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	userRetrieved: 'User retrieved successfully',
	userNotFound: 'User not found',
	databaseError: 'Database error occurred',
	serviceError: 'Service error occurred',
	operationStarted: 'Operation started',
	operationCompleted: 'Operation completed',
	validationPassed: 'Validation passed',
	validationFailed: 'Validation failed',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		id: 'user123',
		email: 'john@example.com',
		clerkUserId: 'clerk_user123',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
		stripeSubscriptionId: 'sub_premium123',
	},

	boolean: {
		isPremium: true,
		isAutoRenewal: true,
		premiumDeluxe: true,
		isAdmin: true,
	},

	date: {
		premiumEndsAt: new Date('2024-12-31T23:59:59Z'),
		createdAt: new Date('2024-01-15T10:00:00Z'),
		updatedAt: new Date('2024-01-15T10:00:00Z'),
	},

	object: {
		user: mockUserData.validUser,
		response: mockServiceResponses.getUserByClerkIdSuccess,
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

// Mock user validation logic
export const mockUserValidationLogic = {
	isValidUser: (user) => {
		return !!(user && user.id && user.email && user.clerkUserId);
	},

	isPremiumUser: (user) => {
		return user && (user.isPremium || user.premiumDeluxe);
	},

	isAdminUser: (user) => {
		return user && user.isAdmin;
	},

	hasActivePremium: (user) => {
		if (!user) return false;
		if (!user.isPremium && !user.premiumDeluxe) return false;
		if (!user.premiumEndsAt) return true;
		return new Date(user.premiumEndsAt) > new Date();
	},

	isExpiredPremium: (user) => {
		if (!user) return false;
		if (!user.premiumEndsAt) return false;
		return new Date(user.premiumEndsAt) < new Date();
	},

	hasStripeSubscription: (user) => {
		return !!(user && user.stripeSubscriptionId);
	},

	isAutoRenewalEnabled: (user) => {
		return user && user.isAutoRenewal;
	},

	getUserDisplayName: (user) => {
		if (!user) return 'Unknown User';
		if (user.firstName && user.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user.firstName) return user.firstName;
		if (user.lastName) return user.lastName;
		return user.email || 'Unknown User';
	},

	getUserStatus: (user) => {
		if (!user) return 'unknown';
		if (user.isAdmin) return 'admin';
		if (user.premiumDeluxe) return 'premium_deluxe';
		if (user.isPremium) return 'premium';
		return 'free';
	},
};

// Mock clerk ID validation logic
export const mockClerkIdValidationLogic = {
	isValidClerkId: (clerkId) => {
		return (
			typeof clerkId === 'string' &&
			clerkId.length > 0 &&
			clerkId.startsWith('clerk_')
		);
	},

	normalizeClerkId: (clerkId) => {
		if (typeof clerkId !== 'string') return null;
		return clerkId.trim();
	},

	extractClerkId: (clerkId) => {
		if (!clerkId) return null;
		const match = clerkId.match(/^clerk_(.+)$/);
		return match ? match[1] : null;
	},

	generateClerkId: (userId) => {
		return `clerk_${userId}`;
	},
};

// Mock database query logic
export const mockDatabaseQueryLogic = {
	buildUserQuery: (clerkUserId) => {
		return {
			where: { clerkUserId },
		};
	},

	validateQueryResult: (result) => {
		return (
			result !== null && result !== undefined && typeof result === 'object'
		);
	},

	handleQueryError: (error) => {
		return {
			error: 'Ошибка получения данных пользователя',
			details: error.message,
		};
	},

	handleNotFound: () => {
		return { error: 'Пользователь не найден' };
	},

	handleSuccess: (user) => {
		return { user };
	},
};

// Mock service logic
export const mockServiceLogic = {
	processUserData: (user) => {
		if (!user) return null;

		return {
			...user,
			displayName: mockUserValidationLogic.getUserDisplayName(user),
			status: mockUserValidationLogic.getUserStatus(user),
			hasActivePremium: mockUserValidationLogic.hasActivePremium(user),
			isExpiredPremium: mockUserValidationLogic.isExpiredPremium(user),
		};
	},

	validateServiceInput: (clerkUserId) => {
		if (!clerkUserId) {
			return { isValid: false, error: 'Clerk ID is required' };
		}

		if (!mockClerkIdValidationLogic.isValidClerkId(clerkUserId)) {
			return { isValid: false, error: 'Invalid Clerk ID format' };
		}

		return { isValid: true };
	},

	handleServiceError: (error) => {
		console.error('Service error:', error);
		return {
			error: 'Ошибка получения данных пользователя',
			details: error.message,
		};
	},

	handleServiceSuccess: (user) => {
		return { user };
	},
};

// Mock response format logic
export const mockResponseFormatLogic = {
	formatSuccessResponse: (user) => {
		return {
			success: true,
			user: mockServiceLogic.processUserData(user),
			timestamp: new Date().toISOString(),
		};
	},

	formatErrorResponse: (error, details = null) => {
		return {
			success: false,
			error: error || 'Ошибка получения данных пользователя',
			details: details || null,
			timestamp: new Date().toISOString(),
		};
	},

	formatNotFoundResponse: () => {
		return {
			success: false,
			error: 'Пользователь не найден',
			timestamp: new Date().toISOString(),
		};
	},

	validateResponse: (response) => {
		return !!(
			response &&
			typeof response === 'object' &&
			('user' in response || 'error' in response)
		);
	},
};

// Mock error handling logic
export const mockErrorHandlingLogic = {
	handleDatabaseError: (error) => {
		return {
			error: 'Ошибка получения данных пользователя',
			details: error.message,
		};
	},

	handleValidationError: (error) => {
		return {
			error: 'Ошибка валидации данных',
			details: error.message,
		};
	},

	handleServiceError: (error) => {
		return {
			error: 'Ошибка сервиса',
			details: error.message,
		};
	},

	handleUnknownError: (error) => {
		return {
			error: 'Неизвестная ошибка',
			details: error.message,
		};
	},

	logError: (error, context = '') => {
		console.error(`Error in ${context}:`, error);
	},

	logSuccess: (message, context = '') => {
		console.log(`Success in ${context}:`, message);
	},
};

// Mock user status logic
export const mockUserStatusLogic = {
	getUserPremiumStatus: (user) => {
		if (!user) return 'unknown';

		if (user.isAdmin) return 'admin';
		if (user.premiumDeluxe) return 'premium_deluxe';
		if (user.isPremium) {
			if (mockUserValidationLogic.hasActivePremium(user)) {
				return 'premium_active';
			} else {
				return 'premium_expired';
			}
		}

		// Check if user has expired premium (has premiumEndsAt but isPremium is false)
		if (user.premiumEndsAt && new Date(user.premiumEndsAt) < new Date()) {
			return 'premium_expired';
		}

		return 'free';
	},

	getUserSubscriptionStatus: (user) => {
		if (!user) return 'none';

		if (user.stripeSubscriptionId) {
			if (mockUserValidationLogic.hasActivePremium(user)) {
				return 'active';
			} else {
				return 'expired';
			}
		}

		return 'none';
	},

	getUserRenewalStatus: (user) => {
		if (!user) return 'unknown';

		if (user.isAutoRenewal) {
			return 'enabled';
		} else {
			return 'disabled';
		}
	},

	getUserAccountStatus: (user) => {
		if (!user) return 'inactive';

		if (user.isAdmin) return 'admin';
		if (user.premiumDeluxe) return 'premium_deluxe';
		if (user.isPremium) return 'premium';

		return 'free';
	},
};

// Reset mocks before each test
export const resetUpdateUserServiceMocks = () => {
	mockPrisma.user.findUnique.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	vi.clearAllMocks();
};
