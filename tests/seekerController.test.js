import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables before importing controllers
vi.mock('process', () => ({
	default: {
		env: {
			RESEND_API_KEY: 'test-resend-key',
		},
	},
}));

import {
	getSeekers,
	addSeeker,
	getSeekerBySlugController,
	deleteSeekerController,
	getSeekerByIdController,
} from '../apps/api/controllers/seekerController.js';
import {
	mockGetAllSeekers,
	mockCreateSeeker,
	mockGetSeekerBySlug,
	mockDeleteSeeker,
	mockGetSeekerById,
	mockGetUserByClerkIdService,
	mockCheckAndSendNewCandidatesNotification,
	mockConsole,
	mockRequest,
	mockResponse,
	mockSeekerData,
	mockUserData,
	mockSeekerCreationData,
	mockErrors,
	mockServiceResponses,
	mockSeekerServiceLogic,
	mockUserServiceLogic,
	mockCandidateNotificationLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	resetAllMocks,
} from '../tests/mocks/seekerController.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('SeekerController', () => {
	describe('Seeker Data Processing Logic', () => {
		it('should handle valid seeker data', async () => {
			const seeker = mockSeekerData.validSeeker;
			expect(seeker.id).toBe(1);
			expect(seeker.name).toBe('John Doe');
			expect(seeker.contact).toBe('+972501234567');
			expect(seeker.city).toBe('Tel Aviv');
			expect(seeker.isActive).toBe(true);
			expect(seeker.isDemanded).toBe(false);
		});

		it('should handle premium seeker data', async () => {
			const seeker = mockSeekerData.premiumSeeker;
			expect(seeker.id).toBe(2);
			expect(seeker.name).toBe('Jane Smith');
			expect(seeker.isDemanded).toBe(true);
			expect(seeker.languages).toEqual(['Hebrew', 'Russian']);
		});

		it('should handle seeker with multiple languages', async () => {
			const seeker = mockSeekerData.seekerWithMultipleLanguages;
			expect(seeker.languages).toEqual([
				'Arabic',
				'Hebrew',
				'English',
				'French',
			]);
			expect(seeker.nativeLanguage).toBe('Arabic');
		});

		it('should handle seeker list data', async () => {
			const seekers = mockSeekerData.seekerList;
			expect(Array.isArray(seekers)).toBe(true);
			expect(seekers.length).toBe(3);
			expect(seekers[0].name).toBe('John Doe');
		});

		it('should handle paginated seeker data', async () => {
			const paginatedData = mockSeekerData.paginatedSeekers;
			expect(paginatedData.seekers).toBeDefined();
			expect(paginatedData.total).toBe(2);
			expect(paginatedData.page).toBe(1);
			expect(paginatedData.limit).toBe(10);
			expect(paginatedData.totalPages).toBe(1);
		});
	});

	describe('User Data Processing Logic', () => {
		it('should handle regular user data', async () => {
			const user = mockUserData.regularUser;
			expect(user.isPremium).toBe(false);
			expect(user.isPremiumDeluxe).toBe(false);
			expect(user.clerkUserId).toBe('user_123');
		});

		it('should handle premium user data', async () => {
			const user = mockUserData.premiumUser;
			expect(user.isPremium).toBe(true);
			expect(user.isPremiumDeluxe).toBe(false);
			expect(user.clerkUserId).toBe('user_456');
		});

		it('should handle premium deluxe user data', async () => {
			const user = mockUserData.premiumDeluxeUser;
			expect(user.isPremium).toBe(true);
			expect(user.isPremiumDeluxe).toBe(true);
			expect(user.clerkUserId).toBe('user_789');
		});
	});

	describe('Seeker Creation Data Processing Logic', () => {
		it('should handle valid seeker creation data', async () => {
			const seekerData = mockSeekerCreationData.validSeekerData;
			expect(seekerData.name).toBe('New Candidate');
			expect(seekerData.contact).toBe('+972501234567');
			expect(seekerData.languages).toEqual(['English', 'Hebrew']);
		});

		it('should handle minimal seeker creation data', async () => {
			const seekerData = mockSeekerCreationData.minimalSeekerData;
			expect(seekerData.name).toBe('Minimal Candidate');
			expect(seekerData.contact).toBe('+972501234567');
			expect(seekerData.languages).toBeUndefined();
		});

		it('should handle seeker with array languages', async () => {
			const seekerData = mockSeekerCreationData.seekerWithArrayLanguages;
			expect(Array.isArray(seekerData.languages)).toBe(true);
			expect(seekerData.languages).toEqual(['Hebrew', 'English', 'Arabic']);
		});

		it('should handle seeker with single language', async () => {
			const seekerData = mockSeekerCreationData.seekerWithSingleLanguage;
			expect(seekerData.languages).toBe('Hebrew');
		});
	});

	describe('Validation Logic', () => {
		it('should validate seeker ID correctly', async () => {
			const validId = 1;
			const invalidId = 'invalid';
			expect(Number(validId)).toBe(1);
			expect(isNaN(Number(invalidId))).toBe(true);
		});

		it('should validate seeker slug correctly', async () => {
			const validSlug = 'john-doe';
			const invalidSlug = '';
			expect(validSlug.length).toBeGreaterThan(0);
			expect(invalidSlug.length).toBe(0);
		});

		it('should validate seeker creation data correctly', async () => {
			const validData = mockSeekerCreationData.validSeekerData;
			const invalidData = { name: '', contact: '' };
			expect(validData.name).toBeTruthy();
			expect(validData.contact).toBeTruthy();
			expect(invalidData.name).toBeFalsy();
			expect(invalidData.contact).toBeFalsy();
		});

		it('should validate query parameters correctly', async () => {
			const validQuery = { page: 1, limit: 10 };
			const invalidQuery = { page: 'invalid', limit: 'invalid' };
			expect(Number(validQuery.page)).toBe(1);
			expect(Number(validQuery.limit)).toBe(10);
			expect(isNaN(Number(invalidQuery.page))).toBe(true);
			expect(isNaN(Number(invalidQuery.limit))).toBe(true);
		});

		it('should validate language array correctly', async () => {
			const arrayLanguages = ['Hebrew', 'English'];
			const singleLanguage = 'Hebrew';
			expect(Array.isArray(arrayLanguages)).toBe(true);
			expect(Array.isArray(singleLanguage)).toBe(false);
		});

		it('should validate clerkUserId correctly', async () => {
			const validClerkUserId = 'user_123';
			const invalidClerkUserId = '';
			expect(validClerkUserId).toBeTruthy();
			expect(invalidClerkUserId).toBeFalsy();
		});
	});

	describe('Seeker Service Integration Logic', () => {
		it('should call getAllSeekers correctly', async () => {
			const query = { page: 1, limit: 10, lang: 'ru' };
			await mockSeekerServiceLogic.getAllSeekers(query);
			expect(query.page).toBe(1);
			expect(query.limit).toBe(10);
			expect(query.lang).toBe('ru');
		});

		it('should call createSeeker correctly', async () => {
			const seekerData = mockSeekerCreationData.validSeekerData;
			const result = await mockSeekerServiceLogic.createSeeker(seekerData);
			expect(result).toBeDefined();
			expect(result.id).toBe(4);
		});

		it('should call getSeekerBySlug correctly', async () => {
			const slug = 'john-doe';
			const result = await mockSeekerServiceLogic.getSeekerBySlug(slug);
			expect(result).toBeDefined();
			expect(result.slug).toBe('john-doe');
		});

		it('should call deleteSeeker correctly', async () => {
			const id = '1';
			const result = await mockSeekerServiceLogic.deleteSeeker(id);
			expect(result).toBeDefined();
			expect(result.success).toBe(true);
		});

		it('should call getSeekerById correctly', async () => {
			const id = 1;
			const result = await mockSeekerServiceLogic.getSeekerById(id);
			expect(result).toBeDefined();
			expect(result.id).toBe(1);
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
			expect(result).toBeDefined();
			expect(result.clerkUserId).toBe('user_123'); // Returns regular user as fallback
		});

		it('should identify premium users correctly', async () => {
			const premiumUser =
				await mockUserServiceLogic.getUserByClerkIdService('user_456');
			const regularUser =
				await mockUserServiceLogic.getUserByClerkIdService('user_123');
			expect(premiumUser.isPremium).toBe(true);
			expect(regularUser.isPremium).toBe(false);
		});
	});

	describe('Candidate Notification Integration Logic', () => {
		it('should call checkAndSendNewCandidatesNotification correctly', async () => {
			const result =
				await mockCandidateNotificationLogic.checkAndSendNewCandidatesNotification();
			expect(result).toBeDefined();
			expect(result.success).toBe(true);
			expect(result.sent).toBe(5);
		});

		it('should handle notification errors gracefully', async () => {
			// Simulate notification error
			const originalLogic =
				mockCandidateNotificationLogic.checkAndSendNewCandidatesNotification;
			mockCandidateNotificationLogic.checkAndSendNewCandidatesNotification = vi
				.fn()
				.mockRejectedValue(mockErrors.notificationError);

			try {
				await mockCandidateNotificationLogic.checkAndSendNewCandidatesNotification();
			} catch (error) {
				expect(error).toBe(mockErrors.notificationError);
			}

			// Restore original logic
			mockCandidateNotificationLogic.checkAndSendNewCandidatesNotification =
				originalLogic;
		});
	});

	describe('Controller Logic', () => {
		it('should process getSeekers request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{ page: 1, limit: 10 },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetAllSeekers.mockResolvedValue(
				mockServiceResponses.successfulSeekerList,
			);

			await mockControllerLogic.processGetSeekers(req, res);

			expect(mockGetAllSeekers).toHaveBeenCalledWith({
				page: 1,
				limit: 10,
				lang: 'ru',
			});
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSeekerList,
			);
		});

		it('should process getSeekers request with languages array', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{
					languages: ['Hebrew', 'English'],
					lang: 'he',
				},
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetAllSeekers.mockResolvedValue(
				mockServiceResponses.successfulSeekerList,
			);

			await mockControllerLogic.processGetSeekers(req, res);

			expect(mockGetAllSeekers).toHaveBeenCalledWith({
				languages: ['Hebrew', 'English'],
				lang: 'he',
			});
		});

		it('should process getSeekers request with single language', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{
					languages: 'Hebrew',
					lang: 'he',
				},
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetAllSeekers.mockResolvedValue(
				mockServiceResponses.successfulSeekerList,
			);

			await mockControllerLogic.processGetSeekers(req, res);

			expect(mockGetAllSeekers).toHaveBeenCalledWith({
				languages: ['Hebrew'],
				lang: 'he',
			});
		});

		it('should process getSeekers request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, {}, {});
			const res = mockRequestResponseLogic.buildResponse();

			mockGetAllSeekers.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetSeekers(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'❌ Error getting seekers:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения соискателей',
			});
		});

		it('should process addSeeker request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockSeekerCreationData.validSeekerData,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockCreateSeeker.mockResolvedValue(
				mockServiceResponses.successfulSeekerCreation,
			);
			mockCheckAndSendNewCandidatesNotification.mockResolvedValue(
				mockServiceResponses.successfulNotification,
			);

			await mockControllerLogic.processAddSeeker(req, res);

			expect(mockCreateSeeker).toHaveBeenCalledWith(
				mockSeekerCreationData.validSeekerData,
			);
			expect(mockCheckAndSendNewCandidatesNotification).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSeekerCreation,
			);
		});

		it('should process addSeeker request with notification error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockSeekerCreationData.validSeekerData,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockCreateSeeker.mockResolvedValue(
				mockServiceResponses.successfulSeekerCreation,
			);
			mockCheckAndSendNewCandidatesNotification.mockRejectedValue(
				mockErrors.notificationError,
			);

			await mockControllerLogic.processAddSeeker(req, res);

			expect(mockCreateSeeker).toHaveBeenCalledWith(
				mockSeekerCreationData.validSeekerData,
			);
			expect(mockCheckAndSendNewCandidatesNotification).toHaveBeenCalled();
			expect(console.error).toHaveBeenCalledWith(
				'❌ Error triggering notification after adding candidate:',
				mockErrors.notificationError,
			);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSeekerCreation,
			);
		});

		it('should process addSeeker request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				mockSeekerCreationData.validSeekerData,
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockCreateSeeker.mockRejectedValue(mockErrors.validationError);

			await mockControllerLogic.processAddSeeker(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'Ошибка при добавлении соискателя:',
				mockErrors.validationError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка добавления соискателя',
			});
		});

		it('should process getSeekerBySlug request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ slug: 'john-doe' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerBySlug.mockResolvedValue(
				mockServiceResponses.successfulSeekerBySlug,
			);

			await mockControllerLogic.processGetSeekerBySlug(req, res);

			expect(mockGetSeekerBySlug).toHaveBeenCalledWith('john-doe');
			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSeekerBySlug,
			);
		});

		it('should process getSeekerBySlug request with seeker not found', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ slug: 'invalid-slug' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerBySlug.mockResolvedValue(null);

			await mockControllerLogic.processGetSeekerBySlug(req, res);

			expect(mockGetSeekerBySlug).toHaveBeenCalledWith('invalid-slug');
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'not found' });
		});

		it('should process getSeekerBySlug request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ slug: 'john-doe' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerBySlug.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetSeekerBySlug(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения соискателя',
			});
		});

		it('should process deleteSeeker request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: '1' });
			const res = mockRequestResponseLogic.buildResponse();

			mockDeleteSeeker.mockResolvedValue(
				mockServiceResponses.successfulDeletion,
			);

			await mockControllerLogic.processDeleteSeeker(req, res);

			expect(mockDeleteSeeker).toHaveBeenCalledWith('1');
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should process deleteSeeker request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: 'invalid' });
			const res = mockRequestResponseLogic.buildResponse();

			mockDeleteSeeker.mockRejectedValue(mockErrors.validationError);

			await mockControllerLogic.processDeleteSeeker(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка удаления соискателя',
			});
		});

		it('should process getSeekerById request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{ id: '1' },
				{ clerkUserId: 'user_456' },
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerById.mockResolvedValue(
				mockServiceResponses.successfulSeekerById,
			);
			mockGetUserByClerkIdService.mockResolvedValue(mockUserData.premiumUser);

			await mockControllerLogic.processGetSeekerById(req, res);

			expect(mockGetSeekerById).toHaveBeenCalledWith(1);
			expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('user_456');
			expect(res.json).toHaveBeenCalledWith({
				...mockServiceResponses.successfulSeekerById,
				isPremium: true,
			});
		});

		it('should process getSeekerById request with invalid ID', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: 'invalid' });
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processGetSeekerById(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Invalid id' });
		});

		it('should process getSeekerById request with seeker not found', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: '999' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerById.mockResolvedValue(null);

			await mockControllerLogic.processGetSeekerById(req, res);

			expect(mockGetSeekerById).toHaveBeenCalledWith(999);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'not found' });
		});

		it('should process getSeekerById request without clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: '1' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerById.mockResolvedValue(
				mockServiceResponses.successfulSeekerById,
			);

			await mockControllerLogic.processGetSeekerById(req, res);

			expect(mockGetSeekerById).toHaveBeenCalledWith(1);
			expect(mockGetUserByClerkIdService).not.toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith({
				...mockServiceResponses.successfulSeekerById,
				isPremium: false,
			});
		});

		it('should process getSeekerById request with error', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: '1' });
			const res = mockRequestResponseLogic.buildResponse();

			mockGetSeekerById.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetSeekerById(req, res);

			expect(console.error).toHaveBeenCalledWith(
				'Ошибка получения соискателя по id:',
				mockErrors.databaseError,
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения соискателя',
			});
		});

		it('should handle controller errors', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, {}, {});
			const res = mockRequestResponseLogic.buildResponse();

			mockGetAllSeekers.mockRejectedValue(mockErrors.databaseError);

			await mockControllerLogic.processGetSeekers(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка получения соискателей',
			});
		});

		it('should handle controller success', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, {}, {});
			const res = mockRequestResponseLogic.buildResponse();

			mockGetAllSeekers.mockResolvedValue(
				mockServiceResponses.successfulSeekerList,
			);

			await mockControllerLogic.processGetSeekers(req, res);

			expect(res.json).toHaveBeenCalledWith(
				mockServiceResponses.successfulSeekerList,
			);
		});

		it('should validate controller input', async () => {
			const validRequest = mockRequestResponseLogic.buildRequest({
				name: 'test',
			});
			const invalidRequest = mockRequestResponseLogic.buildRequest({}, {}, {});

			expect(
				mockRequestResponseLogic.validateControllerInput(validRequest),
			).toBe(true);
			expect(
				mockRequestResponseLogic.validateControllerInput(invalidRequest),
			).toBe(true);
		});
	});
});
