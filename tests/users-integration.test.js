import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockSyncUserService,
	mockGetUserByClerkIdService,
	mockGetUserJobsService,
	mockUserData,
	mockJobData,
	mockJobsResponse,
	mockServiceResponses,
	mockErrors,
	resetUsersMocks,
} from './mocks/users-integration.js';

// Import the route after mocking
import usersRoutes from '../apps/api/routes/users.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/users', usersRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Users Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();
		
		// Set environment variables for webhook tests
		process.env.WEBHOOK_SECRET = 'test-webhook-secret';
		
		// Reset all mocks
		resetUsersMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('POST /api/users/sync-user', () => {
		describe('Successful Requests', () => {
			it('should sync user successfully', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue(mockServiceResponses.syncUserSuccess);

				// Act
				const response = await request(app)
					.post('/api/users/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.syncUserSuccess);
				expect(mockSyncUserService).toHaveBeenCalledWith('clerk_123456789');
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue({ error: mockErrors.syncUserError });

				// Act
				const response = await request(app)
					.post('/api/users/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.syncUserError });
			});

			it('should handle missing clerkUserId', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue({ error: 'Missing Clerk user ID' });

				// Act
				const response = await request(app)
					.post('/api/users/sync-user')
					.send({})
					.expect(500);

				// Assert
				expect(response.body).toEqual({ error: 'Missing Clerk user ID' });
			});
		});
	});

	describe('GET /api/users/:clerkUserId', () => {
		describe('Successful Requests', () => {
			it('should get user by clerk ID', async () => {
				// Arrange
				mockGetUserByClerkIdService.mockResolvedValue(mockServiceResponses.getUserByClerkIdSuccess);

				// Act
				const response = await request(app)
					.get('/api/users/clerk_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockUserData);
				expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('clerk_123456789');
			});
		});

		describe('Error Handling', () => {
			it('should return 404 when user not found', async () => {
				// Arrange
				mockGetUserByClerkIdService.mockResolvedValue({ error: mockErrors.getUserByClerkIdError });

				// Act
				const response = await request(app)
					.get('/api/users/non-existent-user')
					.expect(404);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.getUserByClerkIdError });
			});
		});
	});

	describe('GET /api/users/user-jobs/:clerkUserId', () => {
		describe('Successful Requests', () => {
			it('should get user jobs with default pagination', async () => {
				// Arrange
				mockGetUserJobsService.mockResolvedValue(mockServiceResponses.getUserJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/users/user-jobs/clerk_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockJobsResponse);
				expect(mockGetUserJobsService).toHaveBeenCalledWith('clerk_123456789', {});
			});

			it('should get user jobs with query parameters', async () => {
				// Arrange
				mockGetUserJobsService.mockResolvedValue(mockServiceResponses.getUserJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/users/user-jobs/clerk_123456789?page=2&limit=10&lang=en')
					.expect(200);

				// Assert
				expect(response.body.jobs[0].category.label).toBe('Information Technology');
				expect(mockGetUserJobsService).toHaveBeenCalledWith('clerk_123456789', {
					page: '2',
					limit: '10',
					lang: 'en',
				});
			});

			it('should handle category translation', async () => {
				// Arrange
				const jobsWithTranslation = {
					...mockJobsResponse,
					jobs: [{
						...mockJobData,
						category: {
							...mockJobData.category,
							label: 'Information Technology', // Translated name
						},
					}],
				};
				mockGetUserJobsService.mockResolvedValue(mockServiceResponses.getUserJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/users/user-jobs/clerk_123456789?lang=en')
					.expect(200);

				// Assert
				expect(response.body.jobs[0].category.label).toBe('Information Technology');
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockGetUserJobsService.mockResolvedValue({ error: mockErrors.getUserJobsError });

				// Act
				const response = await request(app)
					.get('/api/users/user-jobs/clerk_123456789')
					.expect(500);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.getUserJobsError });
			});
		});
	});

	describe('POST /api/users/webhook/clerk', () => {
		describe('Successful Requests', () => {
			it('should handle clerk webhook successfully', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue(mockServiceResponses.syncUserSuccess);

				// Act
				const response = await request(app)
					.post('/api/users/webhook/clerk')
					.set('svix-id', 'test-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send({ id: 'clerk_123456789' })
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.clerkWebhookSuccess);
				expect(mockSyncUserService).toHaveBeenCalledWith({ id: 'clerk_123456789' });
			});
		});

		describe('Error Handling', () => {
			it('should return 500 when webhook secret is missing', async () => {
				// Arrange - Clear WEBHOOK_SECRET
				const originalWebhookSecret = process.env.WEBHOOK_SECRET;
				delete process.env.WEBHOOK_SECRET;

				// Act
				const response = await request(app)
					.post('/api/users/webhook/clerk')
					.set('svix-id', 'test-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send({ id: 'clerk_123456789' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.clerkWebhookError });

				// Restore environment variable
				process.env.WEBHOOK_SECRET = originalWebhookSecret;
			});

			it('should return 400 when svix headers are missing', async () => {
				// Act
				const response = await request(app)
					.post('/api/users/webhook/clerk')
					.send({ id: 'clerk_123456789' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingSvixHeaders });
			});

			it('should handle webhook verification failure', async () => {
				// Arrange
				mockSyncUserService.mockRejectedValue(new Error('Webhook verification failed'));

				// Act
				const response = await request(app)
					.post('/api/users/webhook/clerk')
					.set('svix-id', 'test-id')
					.set('svix-timestamp', '1234567890')
					.set('svix-signature', 'test-signature')
					.send({ id: 'clerk_123456789' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.webhookVerificationFailed,
					details: 'Webhook verification failed',
				});
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject GET requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.get('/api/users/sync-user')
				.expect(404);
		});

		it('should reject POST requests for GET endpoints', async () => {
			// Act & Assert
			await request(app)
				.post('/api/users/clerk_123456789')
				.expect(404);
		});

		it('should reject PUT requests', async () => {
			// Act & Assert
			await request(app)
				.put('/api/users/clerk_123456789')
				.expect(404);
		});

		it('should reject DELETE requests', async () => {
			// Act & Assert
			await request(app)
				.delete('/api/users/clerk_123456789')
				.expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Arrange
			mockGetUserByClerkIdService.mockResolvedValue(mockServiceResponses.getUserByClerkIdSuccess);

			// Act
			const response = await request(app)
				.get('/api/users/clerk_123456789')
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('id');
			expect(response.body).toHaveProperty('clerkUserId');
			expect(response.body).toHaveProperty('email');
		});
	});
});
