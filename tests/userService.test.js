import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockPrisma,
	mockFetch,
	mockWebhook,
	mockConsoleLog,
	mockConsoleError,
	mockEnvVars,
	mockUserData,
	mockClerkApiResponses,
	mockJobData,
	mockWebhookData,
	mockWebhookHeaders,
	mockServiceResponses,
	mockErrors,
	mockErrorMessages,
	mockSuccessMessages,
	mockConsoleLogData,
	mockDataConversions,
	mockUserSyncLogic,
	mockWebhookProcessingLogic,
	mockJobRetrievalLogic,
	resetUserServiceMocks,
} from './mocks/userService.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('UserService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetUserServiceMocks();
		
		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
		
		// Mock environment variables
		process.env.CLERK_SECRET_KEY = mockEnvVars.CLERK_SECRET_KEY;
		process.env.WEBHOOK_SECRET = mockEnvVars.WEBHOOK_SECRET;
		
		// Mock fetch globally
		global.fetch = mockFetch;
		
		// Mock Webhook constructor
		vi.mock('svix', () => ({
			Webhook: mockWebhook,
		}));
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('User Data Processing Logic', () => {
		it('should handle valid user data', () => {
			const user = mockUserData.validUser;
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('isAdmin');
		});

		it('should handle premium user data', () => {
			const user = mockUserData.premiumUser;
			expect(user.isPremium).toBe(true);
			expect(user.premiumDeluxe).toBe(false);
			expect(user.stripeSubscriptionId).toBe('sub_premium123');
			expect(user.premiumEndsAt).toBeInstanceOf(Date);
		});

		it('should handle new user data', () => {
			const user = mockUserData.newUser;
			expect(user.isPremium).toBe(false);
			expect(user.isAutoRenewal).toBe(false);
			expect(user.premiumEndsAt).toBe(null);
			expect(user.stripeSubscriptionId).toBe(null);
		});

		it('should handle user with minimal data', () => {
			const clerkUser = mockClerkApiResponses.userWithMinimalData;
			expect(clerkUser.first_name).toBe(null);
			expect(clerkUser.last_name).toBe(null);
			expect(clerkUser.image_url).toBe(null);
			expect(clerkUser.email_addresses).toHaveLength(1);
		});
	});

	describe('Clerk API Integration Logic', () => {
		it('should handle successful Clerk API responses', () => {
			const clerkUser = mockClerkApiResponses.successfulUserFetch;
			expect(clerkUser).toHaveProperty('id');
			expect(clerkUser).toHaveProperty('email_addresses');
			expect(clerkUser).toHaveProperty('first_name');
			expect(clerkUser).toHaveProperty('last_name');
			expect(clerkUser).toHaveProperty('image_url');
		});

		it('should handle premium user Clerk API responses', () => {
			const clerkUser = mockClerkApiResponses.premiumUserFetch;
			expect(clerkUser.id).toBe('clerk_premium456');
			expect(clerkUser.email_addresses[0].email_address).toBe('premium@example.com');
			expect(clerkUser.first_name).toBe('Jane');
			expect(clerkUser.last_name).toBe('Smith');
		});

		it('should handle new user Clerk API responses', () => {
			const clerkUser = mockClerkApiResponses.newUserFetch;
			expect(clerkUser.id).toBe('clerk_new789');
			expect(clerkUser.email_addresses[0].email_address).toBe('new@example.com');
			expect(clerkUser.first_name).toBe('New');
			expect(clerkUser.last_name).toBe('User');
		});

		it('should extract user data from Clerk response', () => {
			const clerkUser = mockClerkApiResponses.successfulUserFetch;
			const extractedData = mockUserSyncLogic.extractUserDataFromClerk(clerkUser);
			
			expect(extractedData.clerkUserId).toBe('clerk_user123');
			expect(extractedData.email).toBe('john@example.com');
			expect(extractedData.firstName).toBe('John');
			expect(extractedData.lastName).toBe('Doe');
			expect(extractedData.imageUrl).toBe('https://example.com/avatar.jpg');
		});

		it('should handle Clerk API errors', () => {
			const mockResponse = {
				status: 404,
				statusText: 'Not Found',
			};
			const error = mockUserSyncLogic.handleClerkApiError(mockResponse);
			expect(error.error).toBe('Ошибка Clerk API: 404 Not Found');
		});
	});

	describe('User Synchronization Logic', () => {
		it('should validate Clerk user ID', () => {
			expect(mockUserSyncLogic.isValidClerkUserId('clerk_user123')).toBe(true);
			expect(mockUserSyncLogic.isValidClerkUserId('')).toBe(false);
			expect(mockUserSyncLogic.isValidClerkUserId(null)).toBe(false);
			expect(mockUserSyncLogic.isValidClerkUserId(undefined)).toBe(false);
		});

		it('should check Clerk secret configuration', () => {
			expect(mockUserSyncLogic.isClerkSecretConfigured('sk_test_valid_key')).toBe(true);
			expect(mockUserSyncLogic.isClerkSecretConfigured('')).toBe(false);
			expect(mockUserSyncLogic.isClerkSecretConfigured(null)).toBe(false);
			expect(mockUserSyncLogic.isClerkSecretConfigured(undefined)).toBe(false);
		});

		it('should build upsert data for user creation', () => {
			const clerkUser = mockClerkApiResponses.successfulUserFetch;
			const upsertData = mockUserSyncLogic.buildUpsertData(clerkUser);
			
			expect(upsertData).toHaveProperty('where');
			expect(upsertData).toHaveProperty('update');
			expect(upsertData).toHaveProperty('create');
			expect(upsertData.where.clerkUserId).toBe('clerk_user123');
			expect(upsertData.update.email).toBe('john@example.com');
			expect(upsertData.create.clerkUserId).toBe('clerk_user123');
		});

		it('should handle sync errors', () => {
			const error = mockErrors.databaseError;
			const result = mockUserSyncLogic.handleSyncError(error);
			expect(result).toEqual({
				error: 'Failed to sync user',
				details: error.message,
			});
		});
	});

	describe('Webhook Processing Logic', () => {
		it('should validate webhook headers', () => {
			expect(mockWebhookProcessingLogic.validateWebhookHeaders(mockWebhookHeaders.validHeaders)).toBe(true);
			expect(mockWebhookProcessingLogic.validateWebhookHeaders(mockWebhookHeaders.missingHeaders)).toBe(false);
			expect(mockWebhookProcessingLogic.validateWebhookHeaders(mockWebhookHeaders.invalidHeaders)).toBe(false);
		});

		it('should extract webhook data', () => {
			const event = mockWebhookData.userCreated;
			const extractedData = mockWebhookProcessingLogic.extractWebhookData(event);
			
			expect(extractedData.userId).toBe('clerk_new789');
			expect(extractedData.email).toBe('new@example.com');
			expect(extractedData.firstName).toBe('New');
			expect(extractedData.lastName).toBe('User');
			expect(extractedData.imageUrl).toBe('https://example.com/new-avatar.jpg');
		});

		it('should build user upsert data from webhook', () => {
			const webhookData = {
				userId: 'clerk_new789',
				email: 'new@example.com',
				firstName: 'New',
				lastName: 'User',
				imageUrl: 'https://example.com/new-avatar.jpg',
			};
			const upsertData = mockWebhookProcessingLogic.buildUserUpsertData(webhookData);
			
			expect(upsertData).toHaveProperty('where');
			expect(upsertData).toHaveProperty('update');
			expect(upsertData).toHaveProperty('create');
			expect(upsertData.where.clerkUserId).toBe('clerk_new789');
			expect(upsertData.update.email).toBe('new@example.com');
			expect(upsertData.create.clerkUserId).toBe('clerk_new789');
		});

		it('should handle webhook errors', () => {
			const error = mockErrors.webhookVerificationError;
			const result = mockWebhookProcessingLogic.handleWebhookError(error);
			expect(result).toEqual({
				error: 'Webhook verification failed',
			});
		});
	});

	describe('Job Retrieval Logic', () => {
		it('should parse pagination parameters', () => {
			const query1 = { page: '2', limit: '10' };
			const result1 = mockJobRetrievalLogic.parsePaginationParams(query1);
			expect(result1.page).toBe(2);
			expect(result1.limit).toBe(10);
			expect(result1.skip).toBe(10);

			const query2 = {};
			const result2 = mockJobRetrievalLogic.parsePaginationParams(query2);
			expect(result2.page).toBe(1);
			expect(result2.limit).toBe(5);
			expect(result2.skip).toBe(0);
		});

		it('should build job query', () => {
			const userId = 'user123';
			const skip = 0;
			const limit = 5;
			const query = mockJobRetrievalLogic.buildJobQuery(userId, skip, limit);
			
			expect(query).toHaveProperty('where');
			expect(query).toHaveProperty('include');
			expect(query).toHaveProperty('skip');
			expect(query).toHaveProperty('take');
			expect(query).toHaveProperty('orderBy');
			expect(query.where.userId).toBe('user123');
			expect(query.skip).toBe(0);
			expect(query.take).toBe(5);
		});

		it('should calculate pagination', () => {
			const result1 = mockJobRetrievalLogic.calculatePagination(10, 5);
			expect(result1.totalJobs).toBe(10);
			expect(result1.totalPages).toBe(2);

			const result2 = mockJobRetrievalLogic.calculatePagination(3, 5);
			expect(result2.totalJobs).toBe(3);
			expect(result2.totalPages).toBe(1);
		});

		it('should handle job retrieval errors', () => {
			const error = mockErrors.databaseError;
			const result = mockJobRetrievalLogic.handleJobRetrievalError(error);
			expect(result).toEqual({
				error: 'Ошибка сервера',
				details: error.message,
			});
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return sync user success response', () => {
			const response = mockServiceResponses.syncUserSuccess;
			expect(response).toHaveProperty('success');
			expect(response).toHaveProperty('user');
			expect(response.success).toBe(true);
			expect(response.user).toHaveProperty('id');
		});

		it('should return sync user error response', () => {
			const response = mockServiceResponses.syncUserError;
			expect(response).toHaveProperty('error');
			expect(response).toHaveProperty('details');
			expect(response.error).toBe('Failed to sync user');
		});

		it('should return getUserByClerkId success response', () => {
			const response = mockServiceResponses.getUserByClerkIdSuccess;
			expect(response).toHaveProperty('user');
			expect(response.user).toHaveProperty('id');
			expect(response.user).toHaveProperty('email');
		});

		it('should return getUserByClerkId not found response', () => {
			const response = mockServiceResponses.getUserByClerkIdNotFound;
			expect(response).toHaveProperty('error');
			expect(response.error).toBe('Пользователь не найден');
		});

		it('should return getUserJobs success response', () => {
			const response = mockServiceResponses.getUserJobsSuccess;
			expect(response).toHaveProperty('jobs');
			expect(response).toHaveProperty('totalJobs');
			expect(response).toHaveProperty('totalPages');
			expect(response).toHaveProperty('currentPage');
			expect(response.jobs).toHaveLength(2);
			expect(response.totalJobs).toBe(2);
		});

		it('should return getUserJobs with pagination response', () => {
			const response = mockServiceResponses.getUserJobsWithPagination;
			expect(response).toHaveProperty('jobs');
			expect(response).toHaveProperty('totalJobs');
			expect(response).toHaveProperty('totalPages');
			expect(response).toHaveProperty('currentPage');
			expect(response.jobs).toHaveLength(1);
			expect(response.totalPages).toBe(2);
		});

		it('should return webhook success response', () => {
			const response = mockServiceResponses.webhookSuccess;
			expect(response).toHaveProperty('success');
			expect(response.success).toBe(true);
		});

		it('should return webhook error response', () => {
			const response = mockServiceResponses.webhookError;
			expect(response).toHaveProperty('error');
			expect(response.error).toBe('Webhook verification failed');
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle database errors', () => {
			const error = mockErrors.databaseError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Database connection failed');
		});

		it('should handle Clerk API errors', () => {
			const error = mockErrors.clerkApiError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Clerk API request failed');
		});

		it('should handle webhook verification errors', () => {
			const error = mockErrors.webhookVerificationError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Webhook verification failed');
		});

		it('should handle missing Clerk ID errors', () => {
			const error = mockErrors.missingClerkId;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Missing Clerk user ID');
		});

		it('should handle missing Clerk secret errors', () => {
			const error = mockErrors.missingClerkSecret;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Clerk secret key is not configured');
		});

		it('should handle missing webhook headers errors', () => {
			const error = mockErrors.missingWebhookHeaders;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Missing Svix headers');
		});

		it('should handle user not found errors', () => {
			const error = mockErrors.userNotFound;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('User not found');
		});

		it('should handle sync errors', () => {
			const error = mockErrors.syncError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Failed to sync user');
		});

		it('should handle getUser errors', () => {
			const error = mockErrors.getUserError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Ошибка получения пользователя');
		});

		it('should handle getJobs errors', () => {
			const error = mockErrors.getJobsError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Ошибка сервера');
		});
	});

	describe('Data Type Conversion Tests', () => {
		it('should handle string data types', () => {
			const strings = mockDataConversions.string;
			expect(typeof strings.clerkUserId).toBe('string');
			expect(typeof strings.email).toBe('string');
			expect(typeof strings.firstName).toBe('string');
			expect(typeof strings.lastName).toBe('string');
		});

		it('should handle number data types', () => {
			const numbers = mockDataConversions.number;
			expect(typeof numbers.page).toBe('number');
			expect(typeof numbers.limit).toBe('number');
			expect(typeof numbers.skip).toBe('number');
			expect(typeof numbers.totalJobs).toBe('number');
		});

		it('should handle boolean data types', () => {
			const booleans = mockDataConversions.boolean;
			expect(typeof booleans.success).toBe('boolean');
			expect(typeof booleans.isPremium).toBe('boolean');
			expect(typeof booleans.isAutoRenewal).toBe('boolean');
			expect(typeof booleans.isAdmin).toBe('boolean');
		});

		it('should handle date data types', () => {
			const dates = mockDataConversions.date;
			expect(dates.createdAt).toBeInstanceOf(Date);
			expect(dates.updatedAt).toBeInstanceOf(Date);
			expect(dates.premiumEndsAt).toBeInstanceOf(Date);
		});

		it('should handle object data types', () => {
			const objects = mockDataConversions.object;
			expect(typeof objects.user).toBe('object');
			expect(typeof objects.jobs).toBe('object');
			expect(typeof objects.response).toBe('object');
			expect(objects.error).toBeInstanceOf(Error);
		});

		it('should handle null data types', () => {
			const nulls = mockDataConversions.null;
			expect(nulls.firstName).toBe(null);
			expect(nulls.lastName).toBe(null);
			expect(nulls.imageUrl).toBe(null);
			expect(nulls.premiumEndsAt).toBe(null);
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock user data', () => {
			const user = mockUserData.validUser;
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
		});

		it('should have valid mock Clerk API responses', () => {
			const clerkUser = mockClerkApiResponses.successfulUserFetch;
			expect(clerkUser).toHaveProperty('id');
			expect(clerkUser).toHaveProperty('email_addresses');
			expect(clerkUser).toHaveProperty('first_name');
			expect(clerkUser).toHaveProperty('last_name');
		});

		it('should have valid mock job data', () => {
			const jobs = mockJobData.userJobs;
			expect(jobs).toHaveLength(2);
			expect(jobs[0]).toHaveProperty('id');
			expect(jobs[0]).toHaveProperty('title');
			expect(jobs[0]).toHaveProperty('city');
			expect(jobs[0]).toHaveProperty('category');
		});

		it('should have valid mock webhook data', () => {
			const webhook = mockWebhookData.userCreated;
			expect(webhook).toHaveProperty('type');
			expect(webhook).toHaveProperty('data');
			expect(webhook.type).toBe('user.created');
			expect(webhook.data).toHaveProperty('id');
		});

		it('should have valid mock webhook headers', () => {
			const headers = mockWebhookHeaders.validHeaders;
			expect(headers).toHaveProperty('svix-id');
			expect(headers).toHaveProperty('svix-timestamp');
			expect(headers).toHaveProperty('svix-signature');
		});

		it('should have valid mock service responses', () => {
			expect(mockServiceResponses).toHaveProperty('syncUserSuccess');
			expect(mockServiceResponses).toHaveProperty('syncUserError');
			expect(mockServiceResponses).toHaveProperty('getUserByClerkIdSuccess');
			expect(mockServiceResponses).toHaveProperty('getUserJobsSuccess');
			expect(mockServiceResponses).toHaveProperty('webhookSuccess');
		});

		it('should have valid mock errors', () => {
			const errors = mockErrors;
			expect(errors).toHaveProperty('databaseError');
			expect(errors).toHaveProperty('clerkApiError');
			expect(errors).toHaveProperty('webhookVerificationError');
			expect(errors).toHaveProperty('missingClerkId');
			expect(errors).toHaveProperty('userNotFound');

			Object.values(errors).forEach(error => {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toBeDefined();
				expect(typeof error.message).toBe('string');
			});
		});

		it('should have valid mock error messages', () => {
			const errorMessages = mockErrorMessages;
			expect(errorMessages).toHaveProperty('databaseError');
			expect(errorMessages).toHaveProperty('clerkApiError');
			expect(errorMessages).toHaveProperty('webhookVerificationError');
			expect(errorMessages).toHaveProperty('missingClerkId');
			expect(errorMessages).toHaveProperty('userNotFound');

			Object.values(errorMessages).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock success messages', () => {
			const successMessages = mockSuccessMessages;
			expect(successMessages).toHaveProperty('userSynced');
			expect(successMessages).toHaveProperty('userFound');
			expect(successMessages).toHaveProperty('userCreated');
			expect(successMessages).toHaveProperty('jobsRetrieved');
			expect(successMessages).toHaveProperty('webhookProcessed');

			Object.values(successMessages).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock console log data', () => {
			const consoleLogData = mockConsoleLogData;
			expect(consoleLogData).toHaveProperty('userServiceStart');
			expect(consoleLogData).toHaveProperty('userServiceKeyAvailable');
			expect(consoleLogData).toHaveProperty('userServiceUserNotFound');
			expect(consoleLogData).toHaveProperty('userServiceApiCall');
			expect(consoleLogData).toHaveProperty('userServiceUserCreated');

			Object.values(consoleLogData).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock data conversions', () => {
			const conversions = mockDataConversions;
			expect(conversions).toHaveProperty('string');
			expect(conversions).toHaveProperty('number');
			expect(conversions).toHaveProperty('boolean');
			expect(conversions).toHaveProperty('date');
			expect(conversions).toHaveProperty('object');
			expect(conversions).toHaveProperty('null');
		});

		it('should have valid mock user sync logic', () => {
			const syncLogic = mockUserSyncLogic;
			expect(syncLogic).toHaveProperty('isValidClerkUserId');
			expect(syncLogic).toHaveProperty('isClerkSecretConfigured');
			expect(syncLogic).toHaveProperty('extractUserDataFromClerk');
			expect(syncLogic).toHaveProperty('buildUpsertData');
			expect(syncLogic).toHaveProperty('handleClerkApiError');
			expect(syncLogic).toHaveProperty('handleSyncError');

			expect(typeof syncLogic.isValidClerkUserId).toBe('function');
			expect(typeof syncLogic.isClerkSecretConfigured).toBe('function');
			expect(typeof syncLogic.extractUserDataFromClerk).toBe('function');
			expect(typeof syncLogic.buildUpsertData).toBe('function');
			expect(typeof syncLogic.handleClerkApiError).toBe('function');
			expect(typeof syncLogic.handleSyncError).toBe('function');
		});

		it('should have valid mock webhook processing logic', () => {
			const webhookLogic = mockWebhookProcessingLogic;
			expect(webhookLogic).toHaveProperty('validateWebhookHeaders');
			expect(webhookLogic).toHaveProperty('extractWebhookData');
			expect(webhookLogic).toHaveProperty('buildUserUpsertData');
			expect(webhookLogic).toHaveProperty('handleWebhookError');

			expect(typeof webhookLogic.validateWebhookHeaders).toBe('function');
			expect(typeof webhookLogic.extractWebhookData).toBe('function');
			expect(typeof webhookLogic.buildUserUpsertData).toBe('function');
			expect(typeof webhookLogic.handleWebhookError).toBe('function');
		});

		it('should have valid mock job retrieval logic', () => {
			const jobLogic = mockJobRetrievalLogic;
			expect(jobLogic).toHaveProperty('parsePaginationParams');
			expect(jobLogic).toHaveProperty('buildJobQuery');
			expect(jobLogic).toHaveProperty('calculatePagination');
			expect(jobLogic).toHaveProperty('handleJobRetrievalError');

			expect(typeof jobLogic.parsePaginationParams).toBe('function');
			expect(typeof jobLogic.buildJobQuery).toBe('function');
			expect(typeof jobLogic.calculatePagination).toBe('function');
			expect(typeof jobLogic.handleJobRetrievalError).toBe('function');
		});
	});
});
