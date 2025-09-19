import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		findUnique: vi.fn(),
	},
};

// Mock data for testing
export const mockUserData = {
	validClerkUserIds: {
		standard: 'user_123456789',
		withUnderscore: 'user_abc_def',
		withNumbers: 'user_123456',
		withLetters: 'user_abcdef',
		mixed: 'user_123abc456def',
		long: 'user_very_long_clerk_user_id_string',
	},
	
	invalidClerkUserIds: {
		null: null,
		undefined: undefined,
		empty: '',
		whitespace: '   ',
		onlyNumbers: '123456789',
		onlyLetters: 'abcdefgh',
		withSpaces: 'user 123',
		withSpecialChars: 'user@123#',
		boolean: true,
		object: {},
		array: [],
	},
	
	userWithCompleteData: {
		id: 'user-123',
		email: 'john.doe@example.com',
		clerkUserId: 'user_123456789',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
		isPremium: true,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2024-12-31T23:59:59Z'),
		stripeSubscriptionId: 'sub_123456789',
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-01T10:00:00Z'),
		updatedAt: new Date('2024-01-01T12:00:00Z'),
	},
	
	userWithMinimalData: {
		id: 'user-456',
		email: 'jane.smith@example.com',
		clerkUserId: 'user_987654321',
		firstName: null,
		lastName: null,
		imageUrl: null,
		isPremium: false,
		isAutoRenewal: false,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-02T09:00:00Z'),
		updatedAt: new Date('2024-01-02T11:00:00Z'),
	},
	
	premiumUser: {
		id: 'user-789',
		email: 'premium.user@example.com',
		clerkUserId: 'user_premium123',
		firstName: 'Premium',
		lastName: 'User',
		imageUrl: 'https://example.com/premium-avatar.jpg',
		isPremium: true,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2025-01-01T00:00:00Z'),
		stripeSubscriptionId: 'sub_premium123',
		premiumDeluxe: true,
		isAdmin: false,
		createdAt: new Date('2024-01-03T08:00:00Z'),
		updatedAt: new Date('2024-01-03T10:00:00Z'),
	},
	
	adminUser: {
		id: 'user-admin',
		email: 'admin@example.com',
		clerkUserId: 'user_admin123',
		firstName: 'Admin',
		lastName: 'User',
		imageUrl: 'https://example.com/admin-avatar.jpg',
		isPremium: true,
		isAutoRenewal: true,
		premiumEndsAt: new Date('2025-12-31T23:59:59Z'),
		stripeSubscriptionId: 'sub_admin123',
		premiumDeluxe: true,
		isAdmin: true,
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-01T00:00:00Z'),
	},
	
	regularUser: {
		id: 'user-regular',
		email: 'regular@example.com',
		clerkUserId: 'user_regular123',
		firstName: 'Regular',
		lastName: 'User',
		imageUrl: null,
		isPremium: false,
		isAutoRenewal: false,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-04T07:00:00Z'),
		updatedAt: new Date('2024-01-04T09:00:00Z'),
	},
	
	nullUser: null,
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	where: { clerkUserId: 'user_123456789' },
};

// Mock errors
export const mockPrismaError = new Error('Database connection failed');
export const mockNotFoundError = new Error('User not found');
export const mockValidationError = new Error('Invalid clerkUserId format');

// Mock console logging data
export const mockConsoleLogData = {
	errorMessage: 'Ошибка в getUserByClerkIdService:',
	errorDetails: 'Database connection failed',
	serviceError: 'Ошибка получения данных пользователя',
};

// Reset mocks before each test
export const resetGetUserByClerkMocks = () => {
	mockPrisma.user.findUnique.mockClear();
	vi.clearAllMocks();
};
