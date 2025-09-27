import { vi } from 'vitest';

// Mock Svix Webhook
export const mockWebhook = vi.fn();
export const mockWebhookVerify = vi.fn();

// Mock webhook service function
export const mockProcessClerkWebhookService = vi.fn();

// Mock console methods
export const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
};

// Mock process methods
export const mockProcess = {
	exit: vi.fn(),
};

// Mock request and response objects
export const mockRequest = (
	body = {},
	params = {},
	query = {},
	headers = {},
	rawBody = '',
) => ({
	body,
	params,
	query,
	headers,
	rawBody,
});

export const mockResponse = () => {
	const res = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
		send: vi.fn().mockReturnThis(),
	};
	return res;
};

// Mock webhook event data
export const mockWebhookEventData = {
	userCreated: {
		type: 'user.created',
		data: {
			id: 'user_123',
			email_addresses: [{ email_address: 'user@example.com' }],
			first_name: 'John',
			last_name: 'Doe',
			image_url: 'https://example.com/avatar.jpg',
			created_at: 1640995200,
		},
	},
	userUpdated: {
		type: 'user.updated',
		data: {
			id: 'user_456',
			email_addresses: [{ email_address: 'premium@example.com' }],
			first_name: 'Jane',
			last_name: 'Smith',
			image_url: 'https://example.com/premium-avatar.jpg',
			updated_at: 1640995200,
		},
	},
	userDeleted: {
		type: 'user.deleted',
		data: {
			id: 'user_789',
			deleted_at: 1640995200,
		},
	},
	sessionCreated: {
		type: 'session.created',
		data: {
			id: 'sess_123',
			user_id: 'user_123',
			created_at: 1640995200,
		},
	},
	sessionEnded: {
		type: 'session.ended',
		data: {
			id: 'sess_123',
			user_id: 'user_123',
			ended_at: 1640995200,
		},
	},
	invalidEvent: {
		type: 'invalid.type',
		data: {},
	},
};

// Mock headers
export const mockHeaders = {
	validSvixHeaders: {
		'svix-id': 'msg_123456789',
		'svix-timestamp': '1640995200',
		'svix-signature': 'v1,signature_hash',
	},
	missingSvixId: {
		'svix-timestamp': '1640995200',
		'svix-signature': 'v1,signature_hash',
	},
	missingSvixTimestamp: {
		'svix-id': 'msg_123456789',
		'svix-signature': 'v1,signature_hash',
	},
	missingSvixSignature: {
		'svix-id': 'msg_123456789',
		'svix-timestamp': '1640995200',
	},
	emptyHeaders: {},
	invalidHeaders: {
		'svix-id': '',
		'svix-timestamp': '',
		'svix-signature': '',
	},
};

// Mock raw body data
export const mockRawBodyData = {
	validRawBody: JSON.stringify(mockWebhookEventData.userCreated),
	invalidRawBody: 'invalid json',
	emptyRawBody: '',
	malformedRawBody: '{ invalid json }',
};

// Mock errors
export const mockErrors = {
	webhookSecretMissing: new Error('Missing Clerk Webhook Secret'),
	svixHeadersMissing: new Error('Missing Svix headers'),
	webhookVerificationFailed: new Error('Webhook verification failed'),
	webhookServiceError: new Error('Webhook service error'),
	invalidSignature: new Error('Invalid signature'),
	invalidTimestamp: new Error('Invalid timestamp'),
	invalidEventType: new Error('Invalid event type'),
	processingError: new Error('Error processing webhook'),
	networkError: new Error('Network timeout'),
	permissionError: new Error('Permission denied'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulProcessing: {
		success: true,
		message: 'Webhook processed successfully',
	},
	userCreatedSuccess: {
		success: true,
		message: 'User created successfully',
		user: {
			id: 'user_123',
			clerkUserId: 'user_123',
			email: 'user@example.com',
			firstName: 'John',
			lastName: 'Doe',
		},
	},
	userUpdatedSuccess: {
		success: true,
		message: 'User updated successfully',
		user: {
			id: 'user_456',
			clerkUserId: 'user_456',
			email: 'premium@example.com',
			firstName: 'Jane',
			lastName: 'Smith',
		},
	},
	userDeletedSuccess: {
		success: true,
		message: 'User deleted successfully',
		user: {
			id: 'user_789',
			clerkUserId: 'user_789',
		},
	},
	processingError: {
		error: 'Error processing webhook',
	},
	serviceError: {
		error: 'Webhook service error',
	},
	invalidEventError: {
		error: 'Invalid event type',
	},
};

// Mock webhook service logic
export const mockWebhookServiceLogic = {
	processClerkWebhookService: async (event) => {
		if (!event || !event.type) {
			throw mockErrors.invalidEventType;
		}

		if (event.type === 'user.created') {
			return mockServiceResponses.userCreatedSuccess;
		}
		if (event.type === 'user.updated') {
			return mockServiceResponses.userUpdatedSuccess;
		}
		if (event.type === 'user.deleted') {
			return mockServiceResponses.userDeletedSuccess;
		}
		if (event.type === 'session.created' || event.type === 'session.ended') {
			return mockServiceResponses.successfulProcessing;
		}
		if (event.type === 'invalid.type') {
			throw mockErrors.invalidEventType;
		}
		if (event.type === 'error_event') {
			throw mockErrors.processingError;
		}

		// Default case
		return mockServiceResponses.successfulProcessing;
	},
};

// Mock Svix Webhook logic
export const mockSvixWebhookLogic = {
	createWebhook: (secret) => {
		return {
			verify: mockWebhookVerify,
		};
	},
	verifyWebhook: (rawBody, headers) => {
		if (!rawBody || !headers) {
			throw mockErrors.webhookVerificationFailed;
		}
		if (headers['svix-id'] === 'invalid_id') {
			throw mockErrors.invalidSignature;
		}
		if (headers['svix-timestamp'] === 'invalid_timestamp') {
			throw mockErrors.invalidTimestamp;
		}
		if (headers['svix-signature'] === 'invalid_signature') {
			throw mockErrors.invalidSignature;
		}

		// Return parsed event
		try {
			return JSON.parse(rawBody);
		} catch (error) {
			throw mockErrors.webhookVerificationFailed;
		}
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processClerkWebhook: async (req, res) => {
		const svix_id = req.headers['svix-id'];
		const svix_timestamp = req.headers['svix-timestamp'];
		const svix_signature = req.headers['svix-signature'];

		if (!svix_id || !svix_timestamp || !svix_signature) {
			return res.status(400).json({ error: 'Missing Svix headers' });
		}

		try {
			const wh = mockSvixWebhookLogic.createWebhook(process.env.WEBHOOK_SECRET);
			const evt = wh.verify(req.rawBody, {
				'svix-id': svix_id,
				'svix-timestamp': svix_timestamp,
				'svix-signature': svix_signature,
			});

			const result = await mockProcessClerkWebhookService(evt);
			if (result.error) return res.status(400).json({ error: result.error });

			res.status(200).json({ success: true });
		} catch (error) {
			res.status(400).json({ error: 'Webhook verification failed' });
		}
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (
		body = {},
		params = {},
		query = {},
		headers = {},
		rawBody = '',
	) => ({
		body,
		params,
		query,
		headers,
		rawBody,
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
		return !!(req.headers || req.body || req.rawBody);
	},
};

// Mock environment variables
export const mockEnv = {
	WEBHOOK_SECRET: 'whsec_test_secret',
	CLERK_SECRET_KEY: 'sk_test_key',
	STRIPE_SECRET_KEY: 'sk_test_stripe_key',
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockWebhook.mockClear();
	mockWebhookVerify.mockClear();
	mockProcessClerkWebhookService.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
	mockProcess.exit.mockClear();
};

// Mock the services
vi.mock('svix', () => ({
	Webhook: mockWebhook,
}));

vi.mock('../../services/webhookService.js', () => ({
	processClerkWebhookService: mockProcessClerkWebhookService,
}));

// Mock console
Object.assign(console, mockConsole);

// Mock process
Object.assign(process, mockProcess);

// Mock process.env
Object.assign(process.env, mockEnv);

// Setup mock Webhook constructor
mockWebhook.mockImplementation((secret) => ({
	verify: mockWebhookVerify,
}));
