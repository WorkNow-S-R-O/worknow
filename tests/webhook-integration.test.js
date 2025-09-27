import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockProcessClerkWebhookService,
	mockWebhookEvent,
	mockUserCreatedEvent,
	mockUserUpdatedEvent,
	mockUserDeletedEvent,
	mockServiceResponses,
	mockErrors,
	resetWebhookMocks,
} from './mocks/webhook-integration.js';

// Create Express app for testing
const createTestApp = async () => {
	// Set environment variable before importing
	process.env.WEBHOOK_SECRET = 'test-webhook-secret';

	// Import the route after setting environment variable
	const webhookRoutes = (await import('../apps/api/routes/webhook.js')).default;

	const app = express();
	app.use(express.json());
	app.use('/api/webhook', webhookRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock process.exit to prevent test termination
const originalProcessExit = process.exit;

describe('Webhook Integration Tests', () => {
	let app;
	let mockWebhookVerify;

	beforeEach(async () => {
		// Mock process.exit to prevent test termination
		process.exit = vi.fn();

		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();

		// Reset all mocks
		resetWebhookMocks();

		// Setup webhook verification mock
		mockWebhookVerify = vi.fn();
		const { Webhook } = await import('svix');
		Webhook.mockImplementation(() => ({
			verify: mockWebhookVerify,
		}));

		// Create fresh app instance
		app = await createTestApp();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;

		// Restore process.exit
		process.exit = originalProcessExit;

		// Clean up environment variable
		delete process.env.WEBHOOK_SECRET;
	});

	describe('POST /api/webhook/clerk', () => {
		describe('Successful Requests', () => {
			it('should process user.created webhook successfully', async () => {
				// Arrange
				mockWebhookVerify.mockReturnValue(mockUserCreatedEvent);
				mockProcessClerkWebhookService.mockResolvedValue(
					mockServiceResponses.processWebhookSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send(mockUserCreatedEvent)
					.expect(200);

				// Assert
				expect(response.body).toEqual({ success: true });
				expect(mockWebhookVerify).toHaveBeenCalledWith(
					undefined, // rawBody is undefined in Express by default
					{
						'svix-id': 'test-svix-id',
						'svix-timestamp': '1234567890',
						'svix-signature': 'test-signature',
					},
				);
				expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(
					mockUserCreatedEvent,
				);
			});

			it('should process user.updated webhook successfully', async () => {
				// Arrange
				mockWebhookVerify.mockReturnValue(mockUserUpdatedEvent);
				mockProcessClerkWebhookService.mockResolvedValue(
					mockServiceResponses.processWebhookSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send(mockUserUpdatedEvent)
					.expect(200);

				// Assert
				expect(response.body).toEqual({ success: true });
				expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(
					mockUserUpdatedEvent,
				);
			});

			it('should process user.deleted webhook successfully', async () => {
				// Arrange
				mockWebhookVerify.mockReturnValue(mockUserDeletedEvent);
				mockProcessClerkWebhookService.mockResolvedValue(
					mockServiceResponses.processWebhookSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send(mockUserDeletedEvent)
					.expect(200);

				// Assert
				expect(response.body).toEqual({ success: true });
				expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(
					mockUserDeletedEvent,
				);
			});
		});

		describe('Error Handling', () => {
			it('should return 400 when svix-id header is missing', async () => {
				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingSvixHeaders });
			});

			it('should return 400 when svix-timestamp header is missing', async () => {
				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-signature', 'test-signature')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingSvixHeaders });
			});

			it('should return 400 when svix-signature header is missing', async () => {
				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-timestamp', '1234567890')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingSvixHeaders });
			});

			it('should return 400 when all svix headers are missing', async () => {
				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingSvixHeaders });
			});

			it('should return 400 when webhook verification fails', async () => {
				// Arrange
				mockWebhookVerify.mockImplementation(() => {
					throw new Error('Invalid signature');
				});

				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'invalid-signature')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.webhookVerificationFailed,
				});
			});

			it('should return 400 when service processing fails', async () => {
				// Arrange
				mockWebhookVerify.mockReturnValue(mockWebhookEvent);
				mockProcessClerkWebhookService.mockResolvedValue(
					mockServiceResponses.processWebhookError,
				);

				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'test-svix-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.processWebhookError,
				});
			});
		});

		describe('Header Validation', () => {
			it('should accept valid svix headers', async () => {
				// Arrange
				mockWebhookVerify.mockReturnValue(mockWebhookEvent);
				mockProcessClerkWebhookService.mockResolvedValue(
					mockServiceResponses.processWebhookSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', 'valid-svix-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'valid-signature')
					.send(mockWebhookEvent)
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
			});

			it('should handle empty svix headers', async () => {
				// Act
				const response = await request(app)
					.post('/api/webhook/clerk')
					.set('svix-id', '')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send(mockWebhookEvent)
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingSvixHeaders });
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject GET requests', async () => {
			// Act & Assert
			await request(app).get('/api/webhook/clerk').expect(404);
		});

		it('should reject PUT requests', async () => {
			// Act & Assert
			await request(app).put('/api/webhook/clerk').expect(404);
		});

		it('should reject DELETE requests', async () => {
			// Act & Assert
			await request(app).delete('/api/webhook/clerk').expect(404);
		});

		it('should reject PATCH requests', async () => {
			// Act & Assert
			await request(app).patch('/api/webhook/clerk').expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Arrange
			mockWebhookVerify.mockReturnValue(mockWebhookEvent);
			mockProcessClerkWebhookService.mockResolvedValue(
				mockServiceResponses.processWebhookSuccess,
			);

			// Act
			const response = await request(app)
				.post('/api/webhook/clerk')
				.set('svix-id', 'test-svix-id')
				.set('svix-timestamp', '1234567890')
				.set('svix-signature', 'test-signature')
				.send(mockWebhookEvent)
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('success');
			expect(response.body.success).toBe(true);
		});

		it('should return consistent error format', async () => {
			// Act
			const response = await request(app)
				.post('/api/webhook/clerk')
				.send(mockWebhookEvent)
				.expect(400)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('error');
			expect(typeof response.body.error).toBe('string');
		});
	});

	describe('Service Integration', () => {
		it('should call processClerkWebhookService with verified event', async () => {
			// Arrange
			mockWebhookVerify.mockReturnValue(mockWebhookEvent);
			mockProcessClerkWebhookService.mockResolvedValue(
				mockServiceResponses.processWebhookSuccess,
			);

			// Act
			await request(app)
				.post('/api/webhook/clerk')
				.set('svix-id', 'test-svix-id')
				.set('svix-timestamp', '1234567890')
				.set('svix-signature', 'test-signature')
				.send(mockWebhookEvent)
				.expect(200);

			// Assert
			expect(mockProcessClerkWebhookService).toHaveBeenCalledTimes(1);
			expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(
				mockWebhookEvent,
			);
		});

		it('should handle service response correctly', async () => {
			// Arrange
			const customResponse = {
				success: true,
				message: 'Custom success message',
			};
			mockWebhookVerify.mockReturnValue(mockWebhookEvent);
			mockProcessClerkWebhookService.mockResolvedValue(customResponse);

			// Act
			const response = await request(app)
				.post('/api/webhook/clerk')
				.set('svix-id', 'test-svix-id')
				.set('svix-timestamp', '1234567890')
				.set('svix-signature', 'test-signature')
				.send(mockWebhookEvent)
				.expect(200);

			// Assert
			expect(response.body).toEqual({ success: true });
		});
	});

	describe('Webhook Verification', () => {
		it('should verify webhook with correct parameters', async () => {
			// Arrange
			mockWebhookVerify.mockReturnValue(mockWebhookEvent);
			mockProcessClerkWebhookService.mockResolvedValue(
				mockServiceResponses.processWebhookSuccess,
			);

			// Act
			await request(app)
				.post('/api/webhook/clerk')
				.set('svix-id', 'test-svix-id')
				.set('svix-timestamp', '1234567890')
				.set('svix-signature', 'test-signature')
				.send(mockWebhookEvent)
				.expect(200);

			// Assert
			expect(mockWebhookVerify).toHaveBeenCalledWith(
				undefined, // rawBody is undefined in Express by default
				{
					'svix-id': 'test-svix-id',
					'svix-timestamp': '1234567890',
					'svix-signature': 'test-signature',
				},
			);
		});
	});
});
