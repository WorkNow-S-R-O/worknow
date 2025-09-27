import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
	user: {
		upsert: vi.fn(),
		delete: vi.fn(),
	},
};

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock services
export const mockProcessClerkWebhookService = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/webhookService.js', () => ({
	processClerkWebhookService: mockProcessClerkWebhookService,
}));

// Mock external dependencies
vi.mock('svix', () => ({
	Webhook: vi.fn().mockImplementation(() => ({
		verify: vi.fn(),
	})),
}));

// Mock data
export const mockWebhookEvent = {
	type: 'user.created',
	data: {
		id: 'clerk_123456789',
		email_addresses: [{ email_address: 'test@example.com' }],
		first_name: 'John',
		last_name: 'Doe',
		image_url: 'https://example.com/avatar.jpg',
	},
};

export const mockUserCreatedEvent = {
	type: 'user.created',
	data: {
		id: 'clerk_new_user',
		email_addresses: [{ email_address: 'newuser@example.com' }],
		first_name: 'Jane',
		last_name: 'Smith',
		image_url: 'https://example.com/new-avatar.jpg',
	},
};

export const mockUserUpdatedEvent = {
	type: 'user.updated',
	data: {
		id: 'clerk_123456789',
		email_addresses: [{ email_address: 'updated@example.com' }],
		first_name: 'John Updated',
		last_name: 'Doe Updated',
		image_url: 'https://example.com/updated-avatar.jpg',
	},
};

export const mockUserDeletedEvent = {
	type: 'user.deleted',
	data: {
		id: 'clerk_123456789',
	},
};

export const mockServiceResponses = {
	processWebhookSuccess: { success: true },
	processWebhookError: {
		error: 'Ошибка обработки вебхука',
		details: 'Database error',
	},
};

export const mockErrors = {
	missingSvixHeaders: 'Missing Svix headers',
	webhookVerificationFailed: 'Webhook verification failed',
	processWebhookError: 'Ошибка обработки вебхука',
};

// Reset mocks function
export const resetWebhookMocks = () => {
	mockPrismaInstance.user.upsert.mockClear();
	mockPrismaInstance.user.delete.mockClear();
	mockProcessClerkWebhookService.mockClear();

	vi.clearAllMocks();
};
