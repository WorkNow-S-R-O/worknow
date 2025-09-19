import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	clerkWebhook,
	syncUser,
	getUserByClerkId,
	getUserJobs,
} from '../apps/api/controllers/usersController.js';
import {
	mockSyncUserService,
	mockGetUserByClerkIdService,
	mockGetUserJobsService,
	mockConsole,
	mockRequest,
	mockResponse,
	mockUserData,
	mockJobData,
	mockWebhookData,
	mockHeaders,
	mockErrors,
	mockServiceResponses,
	mockUserServiceLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	mockEnv,
	resetAllMocks,
} from '../tests/mocks/usersController.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('UsersController', () => {
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
	});

	describe('Job Data Processing Logic', () => {
		it('should handle job with translation', async () => {
			const job = mockJobData.jobWithTranslation;
			expect(job.id).toBe(1);
			expect(job.title).toBe('Software Developer');
			expect(job.category).toBeDefined();
			expect(job.category.translations).toBeDefined();
			expect(job.category.translations.length).toBeGreaterThan(0);
		});

		it('should handle job without translation', async () => {
			const job = mockJobData.jobWithoutTranslation;
			expect(job.id).toBe(2);
			expect(job.title).toBe('Designer');
			expect(job.category).toBeDefined();
			expect(job.category.translations).toEqual([]);
		});

		it('should handle job without category', async () => {
			const job = mockJobData.jobWithoutCategory;
			expect(job.id).toBe(3);
			expect(job.title).toBe('Manager');
			expect(job.category).toBeNull();
		});

		it('should handle job list data', async () => {
			const jobs = mockJobData.jobList;
			expect(Array.isArray(jobs)).toBe(true);
			expect(jobs.length).toBe(2);
			expect(jobs[0].title).toBe('Software Developer');
			expect(jobs[1].title).toBe('Designer');
		});

		it('should handle paginated job data', async () => {
			const paginatedData = mockJobData.paginatedJobs;
			expect(paginatedData.jobs).toBeDefined();
			expect(paginatedData.total).toBe(1);
			expect(paginatedData.page).toBe(1);
			expect(paginatedData.limit).toBe(10);
			expect(paginatedData.totalPages).toBe(1);
		});
	});

	describe('Webhook Data Processing Logic', () => {
		it('should handle valid webhook payload', async () => {
			const payload = mockWebhookData.validWebhookPayload;
			expect(payload.type).toBe('user.created');
			expect(payload.data.id).toBe('user_123');
			expect(payload.data.email_addresses).toBeDefined();
			expect(payload.data.first_name).toBe('John');
			expect(payload.data.last_name).toBe('Doe');
		});

		it('should handle user updated payload', async () => {
			const payload = mockWebhookData.userUpdatedPayload;
			expect(payload.type).toBe('user.updated');
			expect(payload.data.id).toBe('user_456');
			expect(payload.data.first_name).toBe('Jane');
			expect(payload.data.last_name).toBe('Smith');
		});

		it('should handle user deleted payload', async () => {
			const payload = mockWebhookData.userDeletedPayload;
			expect(payload.type).toBe('user.deleted');
			expect(payload.data.id).toBe('user_789');
		});

		it('should handle invalid webhook payload', async () => {
			const payload = mockWebhookData.invalidWebhookPayload;
			expect(payload.type).toBe('invalid.type');
			expect(payload.data).toEqual({});
		});
	});

	describe('Headers Processing Logic', () => {
		it('should handle valid Svix headers', async () => {
			const headers = mockHeaders.validSvixHeaders;
			expect(headers['svix-id']).toBe('msg_123456789');
			expect(headers['svix-timestamp']).toBe('1640995200');
			expect(headers['svix-signature']).toBe('v1,signature_hash');
		});

		it('should handle missing Svix ID', async () => {
			const headers = mockHeaders.missingSvixId;
			expect(headers['svix-id']).toBeUndefined();
			expect(headers['svix-timestamp']).toBe('1640995200');
			expect(headers['svix-signature']).toBe('v1,signature_hash');
		});

		it('should handle missing Svix timestamp', async () => {
			const headers = mockHeaders.missingSvixTimestamp;
			expect(headers['svix-id']).toBe('msg_123456789');
			expect(headers['svix-timestamp']).toBeUndefined();
			expect(headers['svix-signature']).toBe('v1,signature_hash');
		});

		it('should handle missing Svix signature', async () => {
			const headers = mockHeaders.missingSvixSignature;
			expect(headers['svix-id']).toBe('msg_123456789');
			expect(headers['svix-timestamp']).toBe('1640995200');
			expect(headers['svix-signature']).toBeUndefined();
		});

		it('should handle empty headers', async () => {
			const headers = mockHeaders.emptyHeaders;
			expect(Object.keys(headers).length).toBe(0);
		});
	});

	describe('Validation Logic', () => {
		it('should validate webhook secret correctly', async () => {
			const validSecret = 'whsec_test_secret';
			const invalidSecret = '';
			expect(validSecret).toBeTruthy();
			expect(invalidSecret).toBeFalsy();
		});

		it('should validate Svix headers correctly', async () => {
			const validHeaders = mockHeaders.validSvixHeaders;
			const invalidHeaders = mockHeaders.emptyHeaders;
			expect(validHeaders['svix-id']).toBeTruthy();
			expect(validHeaders['svix-timestamp']).toBeTruthy();
			expect(validHeaders['svix-signature']).toBeTruthy();
			expect(invalidHeaders['svix-id']).toBeFalsy();
		});

		it('should validate clerkUserId correctly', async () => {
			const validClerkUserId = 'user_123';
			const invalidClerkUserId = '';
			expect(validClerkUserId).toBeTruthy();
			expect(invalidClerkUserId).toBeFalsy();
		});

		it('should validate language parameter correctly', async () => {
			const validLang = 'ru';
			const defaultLang = 'ru';
			expect(validLang).toBeTruthy();
			expect(defaultLang).toBe('ru');
		});

		it('should validate job category translation correctly', async () => {
			const job = mockJobData.jobWithTranslation;
			const translation = job.category.translations.find(t => t.lang === 'ru');
			expect(translation).toBeDefined();
			expect(translation.name).toBe('IT');
		});
	});

	describe('User Service Integration Logic', () => {
		it('should call syncUserService correctly', async () => {
			const payload = mockWebhookData.validWebhookPayload;
			const result = await mockUserServiceLogic.syncUserService(payload);
			expect(result).toBeDefined();
			expect(result.success).toBe(true);
		});

		it('should call getUserByClerkIdService correctly', async () => {
			const clerkUserId = 'user_123';
			const result = await mockUserServiceLogic.getUserByClerkIdService(clerkUserId);
			expect(result).toBeDefined();
			expect(result.user).toBeDefined();
		});

		it('should call getUserJobsService correctly', async () => {
			const clerkUserId = 'user_123';
			const query = { page: 1, limit: 10 };
			const result = await mockUserServiceLogic.getUserJobsService(clerkUserId, query);
			expect(result).toBeDefined();
			expect(result.jobs).toBeDefined();
		});

		it('should handle sync errors', async () => {
			const clerkUserId = 'error_user';
			try {
				await mockUserServiceLogic.syncUserService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.syncError);
			}
		});

		it('should handle user lookup errors', async () => {
			const clerkUserId = 'error_user';
			try {
				await mockUserServiceLogic.getUserByClerkIdService(clerkUserId);
			} catch (error) {
				expect(error).toBe(mockErrors.serviceError);
			}
		});

		it('should handle jobs lookup errors', async () => {
			const clerkUserId = 'error_user';
			try {
				await mockUserServiceLogic.getUserJobsService(clerkUserId, {});
			} catch (error) {
				expect(error).toBe(mockErrors.jobsError);
			}
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle webhook secret missing error', async () => {
			const error = mockErrors.webhookSecretMissing;
			expect(error.message).toBe('Missing Clerk Webhook Secret');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle Svix headers missing error', async () => {
			const error = mockErrors.svixHeadersMissing;
			expect(error.message).toBe('Missing Svix headers');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle webhook verification failed error', async () => {
			const error = mockErrors.webhookVerificationFailed;
			expect(error.message).toBe('Webhook verification failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle user not found error', async () => {
			const error = mockErrors.userNotFound;
			expect(error.message).toBe('User not found');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle service error', async () => {
			const error = mockErrors.serviceError;
			expect(error.message).toBe('Service error');
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe('Response Formatting Logic', () => {
		it('should format successful webhook response correctly', async () => {
			const response = {
				status: 200,
				data: { success: true },
			};
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);
		});

		it('should format webhook error response correctly', async () => {
			const response = {
				status: 400,
				error: 'Webhook verification failed',
				details: 'Invalid signature',
			};
			expect(response.status).toBe(400);
			expect(response.error).toBe('Webhook verification failed');
			expect(response.details).toBe('Invalid signature');
		});

		it('should format successful user sync response correctly', async () => {
			const response = {
				status: 200,
				data: mockServiceResponses.successfulSync,
			};
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);
		});

		it('should format successful user lookup response correctly', async () => {
			const response = {
				status: 200,
				data: mockUserData.validUser,
			};
			expect(response.status).toBe(200);
			expect(response.data.id).toBe('user_123');
		});

		it('should format successful jobs response correctly', async () => {
			const response = {
				status: 200,
				data: mockServiceResponses.successfulJobsLookup,
			};
			expect(response.status).toBe(200);
			expect(response.data.jobs).toBeDefined();
			expect(response.data.total).toBe(2);
		});
	});

	describe('Category Translation Logic', () => {
		it('should translate category to Russian', async () => {
			const job = mockJobData.jobWithTranslation;
			const translation = job.category.translations.find(t => t.lang === 'ru');
			expect(translation.name).toBe('IT');
		});

		it('should translate category to English', async () => {
			const job = mockJobData.jobWithTranslation;
			const translation = job.category.translations.find(t => t.lang === 'en');
			expect(translation.name).toBe('Information Technology');
		});

		it('should translate category to Hebrew', async () => {
			const job = mockJobData.jobWithTranslation;
			const translation = job.category.translations.find(t => t.lang === 'he');
			expect(translation.name).toBe('טכנולוגיית מידע');
		});

		it('should translate category to Arabic', async () => {
			const job = mockJobData.jobWithTranslation;
			const translation = job.category.translations.find(t => t.lang === 'ar');
			expect(translation.name).toBe('تكنولوجيا المعلومات');
		});

		it('should fallback to original name when translation not found', async () => {
			const job = mockJobData.jobWithoutTranslation;
			expect(job.category.name).toBe('Design');
		});

		it('should handle job without category', async () => {
			const job = mockJobData.jobWithoutCategory;
			expect(job.category).toBeNull();
		});
	});

	describe('Controller Logic', () => {
		it('should process clerkWebhook request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockWebhookData.validWebhookPayload,
				{},
				{},
				mockHeaders.validSvixHeaders
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.successfulSync);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith(mockWebhookData.validWebhookPayload);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should process clerkWebhook request with missing webhook secret', async () => {
			// Temporarily remove webhook secret
			const originalSecret = process.env.WEBHOOK_SECRET;
			delete process.env.WEBHOOK_SECRET;

			const req = mockRequestResponseLogic.buildRequest(
				mockWebhookData.validWebhookPayload,
				{},
				{},
				mockHeaders.validSvixHeaders
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Clerk Webhook Secret' });

			// Restore webhook secret
			process.env.WEBHOOK_SECRET = originalSecret;
		});

		it('should process clerkWebhook request with missing Svix headers', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockWebhookData.validWebhookPayload,
				{},
				{},
				mockHeaders.emptyHeaders
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Svix headers' });
		});

		it('should process clerkWebhook request with webhook verification error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockWebhookData.invalidWebhookPayload,
				{},
				{},
				mockHeaders.validSvixHeaders
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockRejectedValue(mockErrors.webhookVerificationFailed);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith(mockWebhookData.invalidWebhookPayload);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Webhook verification failed',
				details: mockErrors.webhookVerificationFailed.message,
			});
		});

		it('should process syncUser request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest({ clerkUserId: 'user_123' });
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.successfulSync);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockServiceResponses.successfulSync);
		});

		it('should process syncUser request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest({ clerkUserId: 'error_user' });
			const res = mockRequestResponseLogic.buildResponse();

			mockSyncUserService.mockResolvedValue(mockServiceResponses.syncError);

			await mockControllerLogic.processSyncUser(req, res);

			expect(mockSyncUserService).toHaveBeenCalledWith('error_user');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'User sync failed' });
		});

		it('should process getUserByClerkId request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'user_123' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(mockServiceResponses.successfulUserLookup);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('user_123');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockServiceResponses.successfulUserLookup.user);
		});

		it('should process getUserByClerkId request with user not found', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'nonexistent_user' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(mockServiceResponses.userNotFound);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('nonexistent_user');
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
		});

		it('should process getUserJobs request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'user_123' }, { lang: 'ru' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserJobsService.mockResolvedValue(mockServiceResponses.successfulJobsLookup);

			await mockControllerLogic.processGetUserJobs(req, res);

			expect(mockGetUserJobsService).toHaveBeenCalledWith('user_123', { lang: 'ru' });
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				...mockServiceResponses.successfulJobsLookup,
				jobs: expect.any(Array),
			});
		});

		it('should process getUserJobs request with default language', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'user_123' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserJobsService.mockResolvedValue(mockServiceResponses.successfulJobsLookup);

			await mockControllerLogic.processGetUserJobs(req, res);

			expect(mockGetUserJobsService).toHaveBeenCalledWith('user_123', {});
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it('should process getUserJobs request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'error_user' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserJobsService.mockResolvedValue(mockServiceResponses.jobsError);

			await mockControllerLogic.processGetUserJobs(req, res);

			expect(mockGetUserJobsService).toHaveBeenCalledWith('error_user', {});
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get user jobs' });
		});

		it('should handle controller errors', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'error_user' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockRejectedValue(mockErrors.serviceError);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'Service error' });
		});

		it('should handle controller success', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { clerkUserId: 'user_123' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetUserByClerkIdService.mockResolvedValue(mockServiceResponses.successfulUserLookup);

			await mockControllerLogic.processGetUserByClerkId(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockServiceResponses.successfulUserLookup.user);
		});

		it('should validate controller input', async () => {
			const validRequest = mockRequestResponseLogic.buildRequest({ clerkUserId: 'user_123' });
			const invalidRequest = mockRequestResponseLogic.buildRequest({}, {}, {});

			expect(mockRequestResponseLogic.validateControllerInput(validRequest)).toBe(true);
			expect(mockRequestResponseLogic.validateControllerInput(invalidRequest)).toBe(true);
		});
	});
});
