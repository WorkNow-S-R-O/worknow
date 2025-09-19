import { vi } from 'vitest';

// Mock user service function
export const mockGetUserByClerkIdService = vi.fn();

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
	premiumDeluxeUser: {
		id: 'user_789',
		clerkUserId: 'user_789',
		email: 'deluxe@example.com',
		firstName: 'Bob',
		lastName: 'Johnson',
		isPremium: true,
		isPremiumDeluxe: true,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2024-12-31'),
		stripeSubscriptionId: 'sub_987654321',
		stripeCustomerId: 'cus_987654321',
		isAdmin: false,
		imageUrl: 'https://example.com/deluxe-avatar.jpg',
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
	userWithoutImage: {
		id: 'user_no_image',
		clerkUserId: 'user_no_image',
		email: 'noimage@example.com',
		firstName: 'No',
		lastName: 'Image',
		isPremium: false,
		isPremiumDeluxe: false,
		isAutoRenewal: false,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		stripeCustomerId: null,
		isAdmin: false,
		imageUrl: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	},
};

// Mock errors
export const mockErrors = {
	userNotFound: new Error('User not found'),
	databaseError: new Error('Database connection failed'),
	serviceError: new Error('Service unavailable'),
	validationError: new Error('Invalid clerkUserId'),
	networkError: new Error('Network timeout'),
	permissionError: new Error('Permission denied'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulUserLookup: mockUserData.validUser,
	successfulPremiumUserLookup: mockUserData.premiumUser,
	successfulDeluxeUserLookup: mockUserData.premiumDeluxeUser,
	successfulAdminUserLookup: mockUserData.adminUser,
	successfulUserWithoutImageLookup: mockUserData.userWithoutImage,
	userNotFound: null,
};

// Mock user service logic
export const mockUserServiceLogic = {
	getUserByClerkIdService: async (clerkUserId) => {
		if (!clerkUserId) {
			throw mockErrors.validationError;
		}
		
		if (clerkUserId === 'user_123') {
			return mockServiceResponses.successfulUserLookup;
		}
		if (clerkUserId === 'user_456') {
			return mockServiceResponses.successfulPremiumUserLookup;
		}
		if (clerkUserId === 'user_789') {
			return mockServiceResponses.successfulDeluxeUserLookup;
		}
		if (clerkUserId === 'user_admin') {
			return mockServiceResponses.successfulAdminUserLookup;
		}
		if (clerkUserId === 'user_no_image') {
			return mockServiceResponses.successfulUserWithoutImageLookup;
		}
		if (clerkUserId === 'nonexistent_user') {
			return mockServiceResponses.userNotFound;
		}
		if (clerkUserId === 'error_user') {
			throw mockErrors.databaseError;
		}
		if (clerkUserId === 'service_error_user') {
			throw mockErrors.serviceError;
		}
		
		// Default case
		return mockServiceResponses.userNotFound;
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processGetUserByClerkId: async (req, res) => {
		const { clerkUserId } = req.params;

		try {
			const user = await mockGetUserByClerkIdService(clerkUserId);

			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' });
			}

			res.status(200).json(user);
		} catch (error) {
			console.error('Ошибка получения данных пользователя:', error.message);
			res
				.status(500)
				.json({
					error: 'Ошибка получения данных пользователя',
					details: error.message,
				});
		}
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
		return !!(req.params?.clerkUserId);
	},
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockGetUserByClerkIdService.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
};

// Mock the service
vi.mock('../../services/getUserByClerkService.js', () => ({
	getUserByClerkIdService: mockGetUserByClerkIdService,
}));

// Mock console
Object.assign(console, mockConsole);
