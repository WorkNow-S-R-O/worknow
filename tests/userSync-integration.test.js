import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockSyncUserService,
	mockUserData,
	mockServiceResponses,
	mockErrors,
	resetUserSyncMocks,
} from './mocks/userSync-integration.js';

// Import the route after mocking
import userSyncRoutes from '../apps/api/routes/userSync.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/user-sync', userSyncRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('UserSync Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();

		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();

		// Reset all mocks
		resetUserSyncMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('POST /api/user-sync/sync-user', () => {
		describe('Successful Requests', () => {
			it('should sync user successfully', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue(
					mockServiceResponses.syncUserSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.syncUserSuccess);
				expect(mockSyncUserService).toHaveBeenCalledWith('clerk_123456789');
			});

			it('should handle user creation', async () => {
				// Arrange
				const newUser = { ...mockUserData, id: 'new_user_123' };
				mockSyncUserService.mockResolvedValue({ success: true, user: newUser });

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_new_user' })
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.user.id).toBe('new_user_123');
				expect(mockSyncUserService).toHaveBeenCalledWith('clerk_new_user');
			});

			it('should handle user update', async () => {
				// Arrange
				const updatedUser = { ...mockUserData, firstName: 'Jane' };
				mockSyncUserService.mockResolvedValue({
					success: true,
					user: updatedUser,
				});

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.user.firstName).toBe('Jane');
				expect(mockSyncUserService).toHaveBeenCalledWith('clerk_123456789');
			});
		});

		describe('Error Handling', () => {
			it('should return 400 when clerkUserId is missing', async () => {
				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({})
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingClerkUserId });
			});

			it('should return 400 when clerkUserId is empty string', async () => {
				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: '' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingClerkUserId });
			});

			it('should return 400 when clerkUserId is null', async () => {
				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: null })
					.expect(400);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.missingClerkUserId });
			});

			it('should handle service errors', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue({
					error: mockErrors.syncUserError,
				});

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.syncUserError });
			});

			it('should handle clerk secret key missing error', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue({
					error: mockErrors.clerkSecretKeyMissing,
				});

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.clerkSecretKeyMissing,
				});
			});

			it('should handle clerk API errors', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue({
					error: mockErrors.clerkApiError,
				});

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({ error: mockErrors.clerkApiError });
			});
		});

		describe('Input Validation', () => {
			it('should accept valid clerkUserId', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue(
					mockServiceResponses.syncUserSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({ clerkUserId: 'clerk_123456789' })
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
			});

			it('should handle extra fields in request body', async () => {
				// Arrange
				mockSyncUserService.mockResolvedValue(
					mockServiceResponses.syncUserSuccess,
				);

				// Act
				const response = await request(app)
					.post('/api/user-sync/sync-user')
					.send({
						clerkUserId: 'clerk_123456789',
						extraField: 'should be ignored',
						anotherField: 123,
					})
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(mockSyncUserService).toHaveBeenCalledWith('clerk_123456789');
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject GET requests', async () => {
			// Act & Assert
			await request(app).get('/api/user-sync/sync-user').expect(404);
		});

		it('should reject PUT requests', async () => {
			// Act & Assert
			await request(app).put('/api/user-sync/sync-user').expect(404);
		});

		it('should reject DELETE requests', async () => {
			// Act & Assert
			await request(app).delete('/api/user-sync/sync-user').expect(404);
		});

		it('should reject PATCH requests', async () => {
			// Act & Assert
			await request(app).patch('/api/user-sync/sync-user').expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Arrange
			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.syncUserSuccess,
			);

			// Act
			const response = await request(app)
				.post('/api/user-sync/sync-user')
				.send({ clerkUserId: 'clerk_123456789' })
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('success');
			expect(response.body).toHaveProperty('user');
		});

		it('should return consistent error format', async () => {
			// Act
			const response = await request(app)
				.post('/api/user-sync/sync-user')
				.send({})
				.expect(400)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('error');
			expect(typeof response.body.error).toBe('string');
		});
	});

	describe('Service Integration', () => {
		it('should call syncUserService with correct parameters', async () => {
			// Arrange
			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.syncUserSuccess,
			);

			// Act
			await request(app)
				.post('/api/user-sync/sync-user')
				.send({ clerkUserId: 'clerk_123456789' })
				.expect(200);

			// Assert
			expect(mockSyncUserService).toHaveBeenCalledTimes(1);
			expect(mockSyncUserService).toHaveBeenCalledWith('clerk_123456789');
		});

		it('should handle service response correctly', async () => {
			// Arrange
			const customResponse = {
				success: true,
				user: {
					id: 'custom_user_123',
					clerkUserId: 'clerk_custom_123',
					email: 'custom@example.com',
					firstName: 'Custom',
					lastName: 'User',
				},
			};
			mockSyncUserService.mockResolvedValue(customResponse);

			// Act
			const response = await request(app)
				.post('/api/user-sync/sync-user')
				.send({ clerkUserId: 'clerk_custom_123' })
				.expect(200);

			// Assert
			expect(response.body).toEqual(customResponse);
		});
	});
});
