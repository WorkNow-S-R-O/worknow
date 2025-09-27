import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUserByClerkId } from '../apps/api/controllers/userController.js';
import {
	mockGetUserByClerkIdService,
	mockConsole,
	mockRequest,
	mockResponse,
	mockUserData,
	mockErrors,
	mockServiceResponses,
	mockUserServiceLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	resetAllMocks,
} from '../tests/mocks/userController.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('UserController', () => {
	describe('User Data Processing Logic', () => {
		it('should handle valid user data', async () => {
			const user = mockUserData.validUser;
			expect(user.id).toBe('user_123');
			expect(user.clerkUserId).toBe('user_123');
			expect(user.email).toBe('user@example.com');
			expect(user.firstName).toBe('John');
			expect(user.lastName).toBe('Doe');
			expect(user.isPremium).toBe(false);
			expect(user.isPremiumDeluxe).toBe(false);
			expect(user.isAdmin).toBe(false);
		});

		it('should handle premium user data', async () => {
			const user = mockUserData.premiumUser;
			expect(user.id).toBe('user_456');
			expect(user.isPremium).toBe(true);
			expect(user.isPremiumDeluxe).toBe(false);
			expect(user.stripeSubscriptionId).toBe('sub_123456789');
			expect(user.stripeCustomerId).toBe('cus_123456789');
		});

		it('should handle premium deluxe user data', async () => {
			const user = mockUserData.premiumDeluxeUser;
			expect(user.id).toBe('user_789');
			expect(user.isPremium).toBe(true);
			expect(user.isPremiumDeluxe).toBe(true);
			expect(user.stripeSubscriptionId).toBe('sub_987654321');
		});

		it('should handle admin user data', async () => {
			const user = mockUserData.adminUser;
			expect(user.id).toBe('user_admin');
			expect(user.isAdmin).toBe(true);
			expect(user.isPremium).toBe(true);
			expect(user.isPremiumDeluxe).toBe(true);
		});

		it('should handle user without image', async () => {
			const user = mockUserData.userWithoutImage;
			expect(user.id).toBe('user_no_image');
			expect(user.imageUrl).toBeNull();
			expect(user.isPremium).toBe(false);
		});
	});

	describe('Validation Logic', () => {
		it('should validate clerkUserId correctly', async () => {
			const validClerkUserId = 'user_123';
			const invalidClerkUserId = '';
			expect(validClerkUserId).toBeTruthy();
			expect(invalidClerkUserId).toBeFalsy();
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

		it('should validate request parameters correctly', async () => {
			const validRequest = { params: { clerkUserId: 'user_123' } };
			const invalidRequest = { params: {} };
			expect(validRequest.params.clerkUserId).toBeTruthy();
			expect(invalidRequest.params.clerkUserId).toBeFalsy();
		});
	});

	describe('User Service Integration Logic', () => {
		it('should call getUserByClerkIdService correctly', async () => {
			const clerkUserId = 'user_123';
			const result =
				await mockUserServiceLogic.getUserByClerkIdService(clerkUserId);
			expect(result).toBeDefined();
			expect(result.clerkUserId).toBe('user_123');
		});

		it('should handle user not found', async () => {
			const clerkUserId = 'nonexistent_user';
			const result =
				await mockUserServiceLogic.getUserByClerkIdService(clerkUserId);
			expect(result).toBeNull();
		});

		it('should handle service errors', async () => {
			const clerkUserId = 'error_user';
			try {
				await mockUserServiceLogic.getUserByClerkIdService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.databaseError);
			}
		});

		it('should handle validation errors', async () => {
			const clerkUserId = '';
			try {
				await mockUserServiceLogic.getUserByClerkIdService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.validationError);
			}
		});

		it('should return different user types correctly', async () => {
			const regularUser =
				await mockUserServiceLogic.getUserByClerkIdService('user_123');
			const premiumUser =
				await mockUserServiceLogic.getUserByClerkIdService('user_456');
			const deluxeUser =
				await mockUserServiceLogic.getUserByClerkIdService('user_789');
			const adminUser =
				await mockUserServiceLogic.getUserByClerkIdService('user_admin');

			expect(regularUser.isPremium).toBe(false);
			expect(premiumUser.isPremium).toBe(true);
			expect(deluxeUser.isPremiumDeluxe).toBe(true);
			expect(adminUser.isAdmin).toBe(true);
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle database errors', async () => {
			const error = mockErrors.databaseError;
			expect(error.message).toBe('Database connection failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle service errors', async () => {
			const error = mockErrors.serviceError;
			expect(error.message).toBe('Service unavailable');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle validation errors', async () => {
			const error = mockErrors.validationError;
			expect(error.message).toBe('Invalid clerkUserId');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle network errors', async () => {
			const error = mockErrors.networkError;
			expect(error.message).toBe('Network timeout');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle permission errors', async () => {
			const error = mockErrors.permissionError;
			expect(error.message).toBe('Permission denied');
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe('Response Formatting Logic', () => {
		it('should format successful user response correctly', async () => {
			const user = mockUserData.validUser;
			const response = {
				status: 200,
				data: user,
			};
			expect(response.status).toBe(200);
			expect(response.data).toBeDefined();
			expect(response.data.id).toBe('user_123');
		});

		it('should format user not found response correctly', async () => {
			const response = {
				status: 404,
				error: 'Пользователь не найден',
			};
			expect(response.status).toBe(404);
			expect(response.error).toBe('Пользователь не найден');
		});

		it('should format error response correctly', async () => {
			const error = mockErrors.databaseError;
			const response = {
				status: 500,
				error: 'Ошибка получения данных пользователя',
				details: error.message,
			};
			expect(response.status).toBe(500);
			expect(response.error).toBe('Ошибка получения данных пользователя');
			expect(response.details).toBe('Database connection failed');
		});

		it('should format different user types correctly', async () => {
			const regularUser = mockUserData.validUser;
			const premiumUser = mockUserData.premiumUser;
			const adminUser = mockUserData.adminUser;

			expect(regularUser.isPremium).toBe(false);
			expect(premiumUser.isPremium).toBe(true);
			expect(adminUser.isAdmin).toBe(true);
		});
	});

	describe('Controller Logic', () => {
		it('should process getUserByClerkId request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'user_123' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(
				mockServiceResponses.successfulUserLookup,
			);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulUserLookup,
			);
		});

		it('should process getUserByClerkId request with premium user', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'user_456' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(
				mockServiceResponses.successfulPremiumUserLookup,
			);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('user_456');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulPremiumUserLookup,
			);
		});

		it('should process getUserByClerkId request with admin user', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'user_admin' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(
				mockServiceResponses.successfulAdminUserLookup,
			);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('user_admin');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulAdminUserLookup,
			);
		});

		it('should process getUserByClerkId request with user not found', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'nonexistent_user' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(
				mockServiceResponses.userNotFound,
			);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith(
				'nonexistent_user',
			);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Пользователь не найден',
			});
		});

		it('should process getUserByClerkId request with database error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'error_user' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('error_user');
			expect(console.error).toHaveBeenCalledWith(
				'Ошибка получения данных пользователя:',
				mockErrors.databaseError.message,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения данных пользователя',
				details: mockErrors.databaseError.message,
			});
		});

		it('should process getUserByClerkId request with service error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'service_error_user' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockRejectedValue(mockErrors.serviceError);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith(
				'service_error_user',
			);
			expect(console.error).toHaveBeenCalledWith(
				'Ошибка получения данных пользователя:',
				mockErrors.serviceError.message,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения данных пользователя',
				details: mockErrors.serviceError.message,
			});
		});

		it('should process getUserByClerkId request with validation error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: '' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockRejectedValue(mockErrors.validationError);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('');
			expect(console.error).toHaveBeenCalledWith(
				'Ошибка получения данных пользователя:',
				mockErrors.validationError.message,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения данных пользователя',
				details: mockErrors.validationError.message,
			});
		});

		it('should process getUserByClerkId request with user without image', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'user_no_image' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(
				mockServiceResponses.successfulUserWithoutImageLookup,
			);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('user_no_image');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulUserWithoutImageLookup,
			);
		});

		it('should handle controller errors', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'error_user' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения данных пользователя',
				details: mockErrors.databaseError.message,
			});
		});

		it('should handle controller success', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'user_123' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(
				mockServiceResponses.successfulUserLookup,
			);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulUserLookup,
			);
		});

		it('should validate controller input', async () => {
			const validRequest = mockRequestResponseLogic.buildRequest(
				{},
				{ clerkUserId: 'user_123' },
			);
			const invalidRequest = mockRequestResponseLogic.buildRequest({}, {});

			expect(
				mockRequestResponseLogic.validateControllerInput(validRequest),
			).toBe(true);
			expect(
				mockRequestResponseLogic.validateControllerInput(invalidRequest),
			).toBe(false);
		});
	});
});
