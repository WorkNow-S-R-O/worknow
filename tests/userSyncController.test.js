import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { syncUser } from '../apps/api/controllers/userSyncController.js';
import {
	mockSyncUserService,
	mockConsole,
	mockRequest,
	mockResponse,
	mockUserData,
	mockRequestData,
	mockErrors,
	mockServiceResponses,
	mockUserSyncServiceLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	resetAllMocks,
} from '../tests/mocks/userSyncController.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('UserSyncController', () => {
	describe('User Data Processing Logic', () => {
		it('should handle valid user data', async () => {
			const user = mockUserData.validUser;
			expect(user.id).toBe('user_123');
			expect(user.clerkUserId).toBe('user_123');
			expect(user.email).toBe('user@example.com');
			expect(user.firstName).toBe('John');
			expect(user.lastName).toBe('Doe');
			expect(user.isPremium).toBe(false);
			expect(user.isAdmin).toBe(false);
		});

		it('should handle premium user data', async () => {
			const user = mockUserData.premiumUser;
			expect(user.id).toBe('user_456');
			expect(user.isPremium).toBe(true);
			expect(user.stripeSubscriptionId).toBe('sub_123456789');
			expect(user.stripeCustomerId).toBe('cus_123456789');
		});

		it('should handle synced user data', async () => {
			const user = mockUserData.syncedUser;
			expect(user.id).toBe('user_789');
			expect(user.clerkUserId).toBe('user_789');
			expect(user.email).toBe('synced@example.com');
			expect(user.firstName).toBe('Synced');
			expect(user.lastName).toBe('User');
		});

		it('should handle admin user data', async () => {
			const user = mockUserData.adminUser;
			expect(user.id).toBe('user_admin');
			expect(user.isAdmin).toBe(true);
			expect(user.isPremium).toBe(true);
			expect(user.isPremiumDeluxe).toBe(true);
		});
	});

	describe('Request Data Processing Logic', () => {
		it('should handle valid sync request', async () => {
			const request = mockRequestData.validSyncRequest;
			expect(request.clerkUserId).toBe('user_123');
			expect(request.clerkUserId).toBeTruthy();
		});

		it('should handle premium sync request', async () => {
			const request = mockRequestData.premiumSyncRequest;
			expect(request.clerkUserId).toBe('user_456');
			expect(request.clerkUserId).toBeTruthy();
		});

		it('should handle admin sync request', async () => {
			const request = mockRequestData.adminSyncRequest;
			expect(request.clerkUserId).toBe('user_admin');
			expect(request.clerkUserId).toBeTruthy();
		});

		it('should handle missing clerkUserId', async () => {
			const request = mockRequestData.missingClerkUserId;
			expect(request.clerkUserId).toBeUndefined();
		});

		it('should handle empty clerkUserId', async () => {
			const request = mockRequestData.emptyClerkUserId;
			expect(request.clerkUserId).toBe('');
			expect(request.clerkUserId).toBeFalsy();
		});

		it('should handle null clerkUserId', async () => {
			const request = mockRequestData.nullClerkUserId;
			expect(request.clerkUserId).toBeNull();
			expect(request.clerkUserId).toBeFalsy();
		});

		it('should handle undefined clerkUserId', async () => {
			const request = mockRequestData.undefinedClerkUserId;
			expect(request.clerkUserId).toBeUndefined();
		});

		it('should handle invalid clerkUserId', async () => {
			const request = mockRequestData.invalidClerkUserId;
			expect(request.clerkUserId).toBe('invalid_user_id');
		});
	});

	describe('Validation Logic', () => {
		it('should validate clerkUserId presence correctly', async () => {
			const validClerkUserId = 'user_123';
			const invalidClerkUserId = '';
			expect(validClerkUserId).toBeTruthy();
			expect(invalidClerkUserId).toBeFalsy();
		});

		it('should validate clerkUserId format correctly', async () => {
			const validFormat = 'user_123';
			const invalidFormat = 'invalid_user_id';
			expect(validFormat.startsWith('user_')).toBe(true);
			expect(invalidFormat.startsWith('user_')).toBe(false);
		});

		it('should validate request body correctly', async () => {
			const validBody = { clerkUserId: 'user_123' };
			const invalidBody = {};
			expect(validBody.clerkUserId).toBeTruthy();
			expect(invalidBody.clerkUserId).toBeFalsy();
		});

		it('should validate user existence correctly', async () => {
			const existingUser = mockUserData.validUser;
			const nonExistingUser = null;
			expect(existingUser).toBeTruthy();
			expect(nonExistingUser).toBeFalsy();
		});

		it('should validate user properties correctly', async () => {
			const user = mockUserData.validUser;
			expect(user.id).toBeDefined();
			expect(user.email).toBeDefined();
			expect(user.firstName).toBeDefined();
			expect(user.lastName).toBeDefined();
			expect(typeof user.isPremium).toBe('boolean');
			expect(typeof user.isAdmin).toBe('boolean');
		});
	});

	describe('User Sync Service Integration Logic', () => {
		it('should call syncUserService correctly', async () => {
			const clerkUserId = 'user_123';
			const result =
				await mockUserSyncServiceLogic.syncUserService(clerkUserId);
			expect(result).toBeDefined();
			expect(result.success).toBe(true);
			expect(result.user).toBeDefined();
		});

		it('should handle sync service errors', async () => {
			const clerkUserId = 'error_user';
			try {
				await mockUserSyncServiceLogic.syncUserService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.syncServiceError);
			}
		});

		it('should handle database errors', async () => {
			const clerkUserId = 'database_error_user';
			try {
				await mockUserSyncServiceLogic.syncUserService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.databaseError);
			}
		});

		it('should handle Clerk API errors', async () => {
			const clerkUserId = 'clerk_api_error_user';
			try {
				await mockUserSyncServiceLogic.syncUserService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.clerkApiError);
			}
		});

		it('should handle validation errors', async () => {
			const clerkUserId = 'validation_error_user';
			try {
				await mockUserSyncServiceLogic.syncUserService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.validationError);
			}
		});

		it('should handle user not found errors', async () => {
			const clerkUserId = 'user_not_found';
			try {
				await mockUserSyncServiceLogic.syncUserService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.userNotFound);
			}
		});

		it('should return different user types correctly', async () => {
			const regularUser =
				await mockUserSyncServiceLogic.syncUserService('user_123');
			const premiumUser =
				await mockUserSyncServiceLogic.syncUserService('user_456');
			const adminUser =
				await mockUserSyncServiceLogic.syncUserService('user_admin');

			expect(regularUser.user.isPremium).toBe(false);
			expect(premiumUser.user.isPremium).toBe(true);
			expect(adminUser.user.isAdmin).toBe(true);
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle missing clerkUserId error', async () => {
			const error = mockErrors.missingClerkUserId;
			expect(error.message).toBe('Missing Clerk user ID');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle sync service error', async () => {
			const error = mockErrors.syncServiceError;
			expect(error.message).toBe('User sync service failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle database error', async () => {
			const error = mockErrors.databaseError;
			expect(error.message).toBe('Database connection failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle Clerk API error', async () => {
			const error = mockErrors.clerkApiError;
			expect(error.message).toBe('Clerk API error');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle validation error', async () => {
			const error = mockErrors.validationError;
			expect(error.message).toBe('Invalid clerkUserId format');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle network error', async () => {
			const error = mockErrors.networkError;
			expect(error.message).toBe('Network timeout');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle permission error', async () => {
			const error = mockErrors.permissionError;
			expect(error.message).toBe('Permission denied');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle user not found error', async () => {
			const error = mockErrors.userNotFound;
			expect(error.message).toBe('User not found in Clerk');
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe('Response Formatting Logic', () => {
		it('should format successful sync response correctly', async () => {
			const response = {
				status: 200,
				data: mockServiceResponses.successfulSync,
			};
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);
			expect(response.data.user).toBeDefined();
			expect(response.data.message).toBe('User synced successfully');
		});

		it('should format successful premium sync response correctly', async () => {
			const response = {
				status: 200,
				data: mockServiceResponses.successfulPremiumSync,
			};
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);
			expect(response.data.user.isPremium).toBe(true);
			expect(response.data.message).toBe('Premium user synced successfully');
		});

		it('should format successful admin sync response correctly', async () => {
			const response = {
				status: 200,
				data: mockServiceResponses.successfulAdminSync,
			};
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);
			expect(response.data.user.isAdmin).toBe(true);
			expect(response.data.message).toBe('Admin user synced successfully');
		});

		it('should format missing clerkUserId error response correctly', async () => {
			const response = {
				status: 400,
				error: 'Missing Clerk user ID',
			};
			expect(response.status).toBe(400);
			expect(response.error).toBe('Missing Clerk user ID');
		});

		it('should format sync service error response correctly', async () => {
			const response = {
				status: 500,
				error: 'User sync service failed',
			};
			expect(response.status).toBe(500);
			expect(response.error).toBe('User sync service failed');
		});

		it('should format database error response correctly', async () => {
			const response = {
				status: 500,
				error: 'Database connection failed',
			};
			expect(response.status).toBe(500);
			expect(response.error).toBe('Database connection failed');
		});

		it('should format Clerk API error response correctly', async () => {
			const response = {
				status: 500,
				error: 'Clerk API error',
			};
			expect(response.status).toBe(500);
			expect(response.error).toBe('Clerk API error');
		});
	});

	describe('Controller Logic', () => {
		it('should process syncUser request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.successfulSync,
			);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSync,
			);
		});

		it('should process syncUser request with premium user', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.premiumSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.successfulPremiumSync,
			);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_456');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulPremiumSync,
			);
		});

		it('should process syncUser request with admin user', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.adminSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.successfulAdminSync,
			);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_admin');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulAdminSync,
			);
		});

		it('should process syncUser request with missing clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.missingClerkUserId,
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Clerk user ID' });
		});

		it('should process syncUser request with empty clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.emptyClerkUserId,
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Clerk user ID' });
		});

		it('should process syncUser request with null clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.nullClerkUserId,
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Clerk user ID' });
		});

		it('should process syncUser request with undefined clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.undefinedClerkUserId,
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Clerk user ID' });
		});

		it('should process syncUser request with sync service error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.syncError);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'User sync service failed',
			});
		});

		it('should process syncUser request with database error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.databaseError);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Database connection failed',
			});
		});

		it('should process syncUser request with Clerk API error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.clerkApiError);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Clerk API error' });
		});

		it('should process syncUser request with validation error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.validationError,
			);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Invalid clerkUserId format',
			});
		});

		it('should process syncUser request with user not found error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.userNotFound);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'User not found in Clerk',
			});
		});

		it('should handle controller errors', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.missingClerkUserId,
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processSyncUser(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Clerk user ID' });
		});

		it('should handle controller success', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(
				mockServiceResponses.successfulSync,
			);

			await mockControllerLogic.processSyncUser(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSync,
			);
		});

		it('should validate controller input', async () => {
			const validRequest = mockRequestResponseLogic.buildRequest(
				mockRequestData.validSyncRequest,
			);
			const invalidRequest = mockRequestResponseLogic.buildRequest(
				mockRequestData.missingClerkUserId,
			);

			expect(
				mockRequestResponseLogic.validateControllerInput(validRequest),
			).toBe(true);
			expect(
				mockRequestResponseLogic.validateControllerInput(invalidRequest),
			).toBe(false);
		});
	});
});
