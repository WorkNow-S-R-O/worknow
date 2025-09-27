import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		upsert: vi.fn(),
		delete: vi.fn(),
	},
};

// Mock console methods
export const mockConsoleLog = vi
	.spyOn(console, 'log')
	.mockImplementation(() => {});
export const mockConsoleError = vi
	.spyOn(console, 'error')
	.mockImplementation(() => {});

// Mock webhook event data
export const mockWebhookEvents = {
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

	userWithMinimalData: {
		type: 'user.created',
		data: {
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
		},
	},

	userWithNoEmail: {
		type: 'user.created',
		data: {
			id: 'clerk_noemail303',
			email_addresses: [],
			first_name: 'NoEmail',
			last_name: 'User',
			image_url: 'https://example.com/noemail-avatar.jpg',
		},
	},

	userWithEmptyEmail: {
		type: 'user.created',
		data: {
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
		},
	},

	invalidEvent: {
		type: 'invalid.event',
		data: {
			id: 'clerk_invalid505',
			email_addresses: [
				{
					email_address: 'invalid@example.com',
					id: 'email505',
				},
			],
			first_name: 'Invalid',
			last_name: 'Event',
			image_url: 'https://example.com/invalid-avatar.jpg',
		},
	},

	eventWithMissingData: {
		type: 'user.created',
		data: {
			id: 'clerk_missing606',
			// Missing email_addresses, first_name, last_name, image_url
		},
	},
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

	updatedUser: {
		id: 'user123',
		email: 'john.updated@example.com',
		clerkUserId: 'clerk_user123',
		firstName: 'John',
		lastName: 'Doe Updated',
		imageUrl: 'https://example.com/updated-avatar.jpg',
		isPremium: false,
		isAutoRenewal: true,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
		premiumDeluxe: false,
		isAdmin: false,
		createdAt: new Date('2024-01-15T10:00:00Z'),
		updatedAt: new Date('2024-01-20T15:30:00Z'),
	},

	minimalUser: {
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

// Mock service responses
export const mockServiceResponses = {
	webhookSuccess: {
		success: true,
	},

	webhookError: {
		error: 'Ошибка обработки вебхука',
		details: 'Database connection failed',
	},

	webhookProcessingError: {
		error: 'Ошибка обработки вебхука',
		details: 'Invalid webhook event',
	},

	webhookDatabaseError: {
		error: 'Ошибка обработки вебхука',
		details: 'Database operation failed',
	},

	webhookUpsertError: {
		error: 'Ошибка обработки вебхука',
		details: 'User upsert failed',
	},

	webhookDeleteError: {
		error: 'Ошибка обработки вебхука',
		details: 'User deletion failed',
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	webhookProcessingError: new Error('Invalid webhook event'),
	databaseOperationError: new Error('Database operation failed'),
	userUpsertError: new Error('User upsert failed'),
	userDeleteError: new Error('User deletion failed'),
	invalidEventError: new Error('Invalid event type'),
	missingDataError: new Error('Missing required data'),
	emailAddressError: new Error('Email address not found'),
	networkError: new Error('Network error'),
	timeoutError: new Error('Operation timeout'),
};

// Mock error messages
export const mockErrorMessages = {
	databaseError: 'Database connection failed',
	webhookProcessingError: 'Invalid webhook event',
	databaseOperationError: 'Database operation failed',
	userUpsertError: 'User upsert failed',
	userDeleteError: 'User deletion failed',
	invalidEventError: 'Invalid event type',
	missingDataError: 'Missing required data',
	emailAddressError: 'Email address not found',
	networkError: 'Network error',
	timeoutError: 'Operation timeout',
	webhookProcessingErrorRussian: 'Ошибка обработки вебхука',
};

// Mock success messages
export const mockSuccessMessages = {
	webhookProcessed: 'Webhook processed successfully',
	userCreated: 'User created successfully',
	userUpdated: 'User updated successfully',
	userDeleted: 'User deleted successfully',
	operationCompleted: 'Operation completed successfully',
	webhookSuccess: 'Webhook processing successful',
};

// Mock console log data
export const mockConsoleLogData = {
	webhookProcessingError: 'Ошибка обработки вебхука:',
	webhookSuccess: 'Webhook processed successfully',
	userCreated: 'User created via webhook',
	userUpdated: 'User updated via webhook',
	userDeleted: 'User deleted via webhook',
	webhookEventReceived: 'Webhook event received',
	webhookEventProcessed: 'Webhook event processed',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		userId: 'clerk_user123',
		email: 'john@example.com',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
		eventType: 'user.created',
	},

	number: {
		userId: 123,
		emailId: 456,
		timestamp: 1640995200000,
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
		response: mockServiceResponses.webhookSuccess,
		error: mockErrors.databaseError,
		event: mockWebhookEvents.userCreated,
	},

	null: {
		firstName: null,
		lastName: null,
		imageUrl: null,
		premiumEndsAt: null,
		stripeSubscriptionId: null,
	},
};

// Mock webhook processing logic
export const mockWebhookProcessingLogic = {
	isValidEventType: (eventType) => {
		return ['user.created', 'user.updated', 'user.deleted'].includes(eventType);
	},

	isUserCreationEvent: (eventType) => {
		return eventType === 'user.created';
	},

	isUserUpdateEvent: (eventType) => {
		return eventType === 'user.updated';
	},

	isUserDeletionEvent: (eventType) => {
		return eventType === 'user.deleted';
	},

	extractUserId: (eventData) => {
		return eventData.id;
	},

	extractUserData: (eventData) => {
		return {
			email: eventData.email_addresses?.[0]?.email_address,
			firstName: eventData.first_name,
			lastName: eventData.last_name,
			imageUrl: eventData.image_url,
		};
	},

	buildUpsertData: (userId, userData) => {
		return {
			where: { clerkUserId: userId },
			update: {
				email: userData.email,
				firstName: userData.firstName || null,
				lastName: userData.lastName || null,
				imageUrl: userData.imageUrl || null,
			},
			create: {
				clerkUserId: userId,
				email: userData.email,
				firstName: userData.firstName || null,
				lastName: userData.lastName || null,
				imageUrl: userData.imageUrl || null,
			},
		};
	},

	buildDeleteData: (userId) => {
		return {
			where: { clerkUserId: userId },
		};
	},

	handleWebhookError: (error) => {
		return {
			error: 'Ошибка обработки вебхука',
			details: error.message,
		};
	},

	handleWebhookSuccess: () => {
		return { success: true };
	},

	validateEventData: (eventData) => {
		return !!(eventData && eventData.id);
	},

	validateUserData: (userData) => {
		return !!(userData && userData.email);
	},
};

// Mock database operations logic
export const mockDatabaseOperationsLogic = {
	buildUserUpsertOperation: (userId, userData) => {
		return {
			where: { clerkUserId: userId },
			update: {
				email: userData.email,
				firstName: userData.firstName || null,
				lastName: userData.lastName || null,
				imageUrl: userData.imageUrl || null,
			},
			create: {
				clerkUserId: userId,
				email: userData.email,
				firstName: userData.firstName || null,
				lastName: userData.lastName || null,
				imageUrl: userData.imageUrl || null,
			},
		};
	},

	buildUserDeleteOperation: (userId) => {
		return {
			where: { clerkUserId: userId },
		};
	},

	handleDatabaseError: (error) => {
		return {
			error: 'Ошибка обработки вебхука',
			details: error.message,
		};
	},

	handleDatabaseSuccess: () => {
		return { success: true };
	},

	validateDatabaseResult: (result) => {
		return !!(result && typeof result === 'object');
	},

	processDatabaseResult: (result) => {
		return result;
	},
};

// Mock event processing logic
export const mockEventProcessingLogic = {
	processUserCreationEvent: async (eventData) => {
		const userId = eventData.id;
		const userData = {
			email: eventData.email_addresses?.[0]?.email_address,
			firstName: eventData.first_name,
			lastName: eventData.last_name,
			imageUrl: eventData.image_url,
		};

		return {
			operation: 'upsert',
			userId,
			userData,
		};
	},

	processUserUpdateEvent: async (eventData) => {
		const userId = eventData.id;
		const userData = {
			email: eventData.email_addresses?.[0]?.email_address,
			firstName: eventData.first_name,
			lastName: eventData.last_name,
			imageUrl: eventData.image_url,
		};

		return {
			operation: 'upsert',
			userId,
			userData,
		};
	},

	processUserDeletionEvent: async (eventData) => {
		const userId = eventData.id;

		return {
			operation: 'delete',
			userId,
		};
	},

	processUnknownEvent: async (eventData) => {
		return {
			operation: 'unknown',
			eventData,
		};
	},

	handleEventProcessingError: (error) => {
		return {
			error: 'Ошибка обработки вебхука',
			details: error.message,
		};
	},
};

// Mock validation logic
export const mockValidationLogic = {
	validateWebhookEvent: (event) => {
		return !!(event && event.type && event.data);
	},

	validateEventType: (eventType) => {
		return ['user.created', 'user.updated', 'user.deleted'].includes(eventType);
	},

	validateEventData: (eventData) => {
		return !!(eventData && eventData.id);
	},

	validateUserData: (userData) => {
		return !!(userData && userData.email);
	},

	validateEmailAddress: (emailAddresses) => {
		return !!(
			emailAddresses &&
			emailAddresses.length > 0 &&
			emailAddresses[0].email_address
		);
	},

	handleValidationError: (error) => {
		return {
			error: 'Ошибка обработки вебхука',
			details: error.message,
		};
	},
};

// Reset mocks before each test
export const resetWebhookServiceMocks = () => {
	mockPrisma.user.upsert.mockClear();
	mockPrisma.user.delete.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	vi.clearAllMocks();
};
