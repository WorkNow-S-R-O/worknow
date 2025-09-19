import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
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

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock services
export const mockSyncUserService = vi.fn();
export const mockGetUserByClerkIdService = vi.fn();
export const mockGetUserJobsService = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/userService.js', () => ({
	syncUserService: mockSyncUserService,
	getUserByClerkIdService: mockGetUserByClerkIdService,
	getUserJobsService: mockGetUserJobsService,
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

vi.mock('svix', () => ({
	Webhook: vi.fn(() => ({
		verify: vi.fn(),
	})),
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

export const mockJobData = {
	id: 1,
	title: 'Software Developer',
	salary: '50000',
	phone: '+1234567890',
	description: 'Great opportunity',
	cityId: 1,
	userId: 'user_123456789',
	categoryId: 1,
	shuttle: true,
	meals: false,
	boostedAt: null,
	createdAt: '2024-01-01T00:00:00.000Z',
	city: {
		id: 1,
		name: 'Tel Aviv',
	},
	category: {
		id: 1,
		name: 'IT',
		translations: [
			{ lang: 'ru', name: 'IT' },
			{ lang: 'en', name: 'Information Technology' },
			{ lang: 'he', name: 'טכנולוגיית מידע' },
		],
	},
	user: mockUserData,
};

export const mockJobsResponse = {
	jobs: [{
		...mockJobData,
		category: {
			...mockJobData.category,
			label: 'IT', // Default label
		},
	}],
	totalJobs: 1,
	totalPages: 1,
	currentPage: 1,
};

export const mockServiceResponses = {
	syncUserSuccess: { success: true, user: mockUserData },
	getUserByClerkIdSuccess: { user: mockUserData },
	getUserJobsSuccess: mockJobsResponse,
	clerkWebhookSuccess: { success: true },
};

export const mockErrors = {
	syncUserError: 'Failed to sync user',
	getUserByClerkIdError: 'Пользователь не найден',
	getUserJobsError: 'Ошибка сервера',
	clerkWebhookError: 'Missing Clerk Webhook Secret',
	missingSvixHeaders: 'Missing Svix headers',
	webhookVerificationFailed: 'Webhook verification failed',
};

// Reset mocks function
export const resetUsersMocks = () => {
	mockPrismaInstance.user.findUnique.mockClear();
	mockPrismaInstance.user.upsert.mockClear();
	mockPrismaInstance.user.delete.mockClear();
	mockPrismaInstance.job.findMany.mockClear();
	mockPrismaInstance.job.count.mockClear();
	mockSyncUserService.mockClear();
	mockGetUserByClerkIdService.mockClear();
	mockGetUserJobsService.mockClear();
	
	vi.clearAllMocks();
};
