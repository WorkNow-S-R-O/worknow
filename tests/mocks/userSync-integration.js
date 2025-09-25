import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
	user: {
		upsert: vi.fn(),
	},
};

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock services
export const mockSyncUserService = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/userSyncService.js', () => ({
	syncUserService: mockSyncUserService,
}));

// Mock external dependencies
vi.mock('node-fetch', () => ({
	default: vi.fn(),
}));

vi.mock('dotenv', () => ({
	default: {
		config: vi.fn(),
	},
}));

// Mock data
export const mockUserData = {
	id: 'user_123456789',
	clerkUserId: 'clerk_123456789',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe',
	imageUrl: 'https://example.com/avatar.jpg',
	isPremium: false,
	isAutoRenewal: true,
	premiumEndsAt: null,
	stripeSubscriptionId: null,
	premiumDeluxe: false,
	isAdmin: false,
	createdAt: '2024-01-01T00:00:00.000Z',
	updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockServiceResponses = {
	syncUserSuccess: { success: true, user: mockUserData },
};

export const mockErrors = {
	missingClerkUserId: 'Missing Clerk user ID',
	syncUserError: 'Failed to sync user',
	clerkSecretKeyMissing: 'Clerk secret key is not configured',
	clerkApiError: 'Ошибка Clerk API: 404 Not Found',
};

// Reset mocks function
export const resetUserSyncMocks = () => {
	mockPrismaInstance.user.upsert.mockClear();
	mockSyncUserService.mockClear();
	
	vi.clearAllMocks();
};


