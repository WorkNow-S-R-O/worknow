import { vi } from 'vitest';

// Mock user sync service function
export const mockSyncUserService = vi.fn();

// Mock console methods
export const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
};

// Mock request and response objects
export const mockRequest = (body = {}, params = {}, query = {}) => ({
	body,
	params,
	query,
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
	adminUser: {
		id: 'user_admin',
		clerkUserId: 'user_admin',
		email: 'admin@example.com',
		firstName: 'Admin',
		lastName: 'User',
		isPremium: true,
		isPremiumDeluxe: true,
		isAutoRenewal: false,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		stripeCustomerId: null,
		isAdmin: true,
		imageUrl: 'https://example.com/admin-avatar.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	},
};

// Mock request data
export const mockRequestData = {
	validSyncRequest: {
		clerkUserId: 'user_123',
	},
	premiumSyncRequest: {
		clerkUserId: 'user_456',
	},
	adminSyncRequest: {
		clerkUserId: 'user_admin',
	},
	missingClerkUserId: {
		// Missing clerkUserId
	},
	emptyClerkUserId: {
		clerkUserId: '',
	},
	nullClerkUserId: {
		clerkUserId: null,
	},
	undefinedClerkUserId: {
		clerkUserId: undefined,
	},
	invalidClerkUserId: {
		clerkUserId: 'invalid_user_id',
	},
};

// Mock errors
export const mockErrors = {
	missingClerkUserId: new Error('Missing Clerk user ID'),
	syncServiceError: new Error('User sync service failed'),
	databaseError: new Error('Database connection failed'),
	clerkApiError: new Error('Clerk API error'),
	validationError: new Error('Invalid clerkUserId format'),
	networkError: new Error('Network timeout'),
	permissionError: new Error('Permission denied'),
	userNotFound: new Error('User not found in Clerk'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulSync: {
		success: true,
		user: mockUserData.syncedUser,
		message: 'User synced successfully',
	},
	successfulPremiumSync: {
		success: true,
		user: mockUserData.premiumUser,
		message: 'Premium user synced successfully',
	},
	successfulAdminSync: {
		success: true,
		user: mockUserData.adminUser,
		message: 'Admin user synced successfully',
	},
	syncError: {
		error: 'User sync service failed',
	},
	databaseError: {
		error: 'Database connection failed',
	},
	clerkApiError: {
		error: 'Clerk API error',
	},
	validationError: {
		error: 'Invalid clerkUserId format',
	},
	userNotFound: {
		error: 'User not found in Clerk',
	},
};

// Mock user sync service logic
export const mockUserSyncServiceLogic = {
	syncUserService: async (clerkUserId) => {
		if (!clerkUserId) {
			throw mockErrors.missingClerkUserId;
		}
		
		if (clerkUserId === 'user_123') {
			return mockServiceResponses.successfulSync;
		}
		if (clerkUserId === 'user_456') {
			return mockServiceResponses.successfulPremiumSync;
		}
		if (clerkUserId === 'user_admin') {
			return mockServiceResponses.successfulAdminSync;
		}
		if (clerkUserId === 'error_user') {
			throw mockErrors.syncServiceError;
		}
		if (clerkUserId === 'database_error_user') {
			throw mockErrors.databaseError;
		}
		if (clerkUserId === 'clerk_api_error_user') {
			throw mockErrors.clerkApiError;
		}
		if (clerkUserId === 'validation_error_user') {
			throw mockErrors.validationError;
		}
		if (clerkUserId === 'user_not_found') {
			throw mockErrors.userNotFound;
		}
		
		// Default case
		return mockServiceResponses.successfulSync;
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processSyncUser: async (req, res) => {
		const { clerkUserId } = req.body;

		if (!clerkUserId) {
			return res.status(400).json({ error: 'Missing Clerk user ID' });
		}

		const result = await mockSyncUserService(clerkUserId);
		if (result.error) return res.status(500).json({ error: result.error });

		res.status(200).json(result);
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (body = {}, params = {}, query = {}) => ({
		body,
		params,
		query,
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
		return !!(req.body?.clerkUserId);
	},
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockSyncUserService.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
};

// Mock the service
vi.mock('../../services/userSyncService.js', () => ({
	syncUserService: mockSyncUserService,
}));

// Mock console
Object.assign(console, mockConsole);
