import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockGetAllSeekers,
	mockCreateSeeker,
	mockGetSeekerBySlug,
	mockDeleteSeeker,
	mockGetSeekerById,
	mockGetUserByClerkIdService,
	mockCheckAndSendNewCandidatesNotification,
	mockSeekerData,
	mockSeekerListResponse,
	mockUserData,
	mockServiceResponses,
	mockErrors,
	resetSeekersMocks,
} from './mocks/seekers-integration.js';

// Import the route after mocking
import seekersRoutes from '../apps/api/routes/seekers.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/seekers', seekersRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Seekers Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();
		
		// Reset all mocks
		resetSeekersMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('GET /api/seekers', () => {
		describe('Successful Requests', () => {
			it('should get all seekers with default pagination', async () => {
				// Arrange
				mockGetAllSeekers.mockResolvedValue(mockSeekerListResponse);

				// Act
				const response = await request(app)
					.get('/api/seekers')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSeekersSuccess);
				expect(mockGetAllSeekers).toHaveBeenCalledWith({
					lang: 'ru',
				});
			});

			it('should get seekers with query parameters', async () => {
				// Arrange
				mockGetAllSeekers.mockResolvedValue(mockSeekerListResponse);

				// Act
				const response = await request(app)
					.get('/api/seekers?page=2&limit=5&city=Tel Aviv&category=IT&lang=en')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSeekersSuccess);
				expect(mockGetAllSeekers).toHaveBeenCalledWith({
					page: '2',
					limit: '5',
					city: 'Tel Aviv',
					category: 'IT',
					lang: 'en',
				});
			});

			it('should handle languages array parameter', async () => {
				// Arrange
				mockGetAllSeekers.mockResolvedValue(mockSeekerListResponse);

				// Act
				const response = await request(app)
					.get('/api/seekers?languages=English&languages=Hebrew')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSeekersSuccess);
				expect(mockGetAllSeekers).toHaveBeenCalledWith({
					languages: ['English', 'Hebrew'],
					lang: 'ru',
				});
			});

			it('should handle single language parameter', async () => {
				// Arrange
				mockGetAllSeekers.mockResolvedValue(mockSeekerListResponse);

				// Act
				const response = await request(app)
					.get('/api/seekers?languages=English')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSeekersSuccess);
				expect(mockGetAllSeekers).toHaveBeenCalledWith({
					languages: ['English'],
					lang: 'ru',
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockGetAllSeekers.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/seekers')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.getSeekersError,
				});
			});
		});
	});

	describe('POST /api/seekers', () => {
		describe('Successful Requests', () => {
			it('should create a new seeker', async () => {
				// Arrange
				const seekerData = {
					name: 'John Doe',
					contact: '+1234567890',
					city: 'Tel Aviv',
					description: 'Experienced software developer',
					gender: 'Male',
					isDemanded: true,
					facebook: 'https://facebook.com/johndoe',
					languages: ['English', 'Hebrew'],
					nativeLanguage: 'English',
					category: 'IT',
					employment: 'Full-time',
					documents: 'Passport',
					announcement: 'Looking for opportunities',
					note: 'Available immediately',
					documentType: 'Passport',
				};

				mockCreateSeeker.mockResolvedValue(mockSeekerData);
				mockCheckAndSendNewCandidatesNotification.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/seekers')
					.send(seekerData)
					.expect(201);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.createSeekerSuccess);
				expect(mockCreateSeeker).toHaveBeenCalledWith(seekerData);
				expect(mockCheckAndSendNewCandidatesNotification).toHaveBeenCalled();
			});

			it('should create seeker even if notification fails', async () => {
				// Arrange
				const seekerData = {
					name: 'John Doe',
					contact: '+1234567890',
					city: 'Tel Aviv',
					description: 'Experienced software developer',
				};

				mockCreateSeeker.mockResolvedValue(mockSeekerData);
				mockCheckAndSendNewCandidatesNotification.mockRejectedValue(new Error('Notification failed'));

				// Act
				const response = await request(app)
					.post('/api/seekers')
					.send(seekerData)
					.expect(201);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.createSeekerSuccess);
				expect(mockCreateSeeker).toHaveBeenCalledWith(seekerData);
				expect(mockCheckAndSendNewCandidatesNotification).toHaveBeenCalled();
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				const seekerData = {
					name: 'John Doe',
					contact: '+1234567890',
					city: 'Tel Aviv',
					description: 'Experienced software developer',
				};

				mockCreateSeeker.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/seekers')
					.send(seekerData)
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.createSeekerError,
				});
			});
		});
	});

	describe('GET /api/seekers/slug/:slug', () => {
		describe('Successful Requests', () => {
			it('should get seeker by slug', async () => {
				// Arrange
				mockGetSeekerBySlug.mockResolvedValue(mockSeekerData);

				// Act
				const response = await request(app)
					.get('/api/seekers/slug/john-doe-experienced-software-developer')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSeekerBySlugSuccess);
				expect(mockGetSeekerBySlug).toHaveBeenCalledWith('john-doe-experienced-software-developer');
			});
		});

		describe('Error Handling', () => {
			it('should return 404 when seeker not found', async () => {
				// Arrange
				mockGetSeekerBySlug.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.get('/api/seekers/slug/non-existent-slug')
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.notFound,
				});
			});

			it('should handle service errors', async () => {
				// Arrange
				mockGetSeekerBySlug.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/seekers/slug/john-doe-experienced-software-developer')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.getSeekerBySlugError,
				});
			});
		});
	});

	describe('GET /api/seekers/:id', () => {
		describe('Successful Requests', () => {
			it('should get seeker by id without premium check', async () => {
				// Arrange
				mockGetSeekerById.mockResolvedValue(mockSeekerData);

				// Act
				const response = await request(app)
					.get('/api/seekers/1')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					...mockSeekerData,
					isPremium: false,
				});
				expect(mockGetSeekerById).toHaveBeenCalledWith(1);
			});

			it('should get seeker by id with premium check', async () => {
				// Arrange
				mockGetSeekerById.mockResolvedValue(mockSeekerData);
				mockGetUserByClerkIdService.mockResolvedValue(mockUserData);

				// Act
				const response = await request(app)
					.get('/api/seekers/1?clerkUserId=clerk_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSeekerByIdSuccess);
				expect(mockGetSeekerById).toHaveBeenCalledWith(1);
				expect(mockGetUserByClerkIdService).toHaveBeenCalledWith('clerk_123456789');
			});

			it('should handle non-premium user', async () => {
				// Arrange
				const nonPremiumUser = { ...mockUserData, isPremium: false };
				mockGetSeekerById.mockResolvedValue(mockSeekerData);
				mockGetUserByClerkIdService.mockResolvedValue(nonPremiumUser);

				// Act
				const response = await request(app)
					.get('/api/seekers/1?clerkUserId=clerk_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					...mockSeekerData,
					isPremium: false,
				});
			});
		});

		describe('Error Handling', () => {
			it('should return 400 for invalid id', async () => {
				// Act
				const response = await request(app)
					.get('/api/seekers/invalid-id')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.invalidId,
				});
			});

			it('should return 404 when seeker not found', async () => {
				// Arrange
				mockGetSeekerById.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.get('/api/seekers/999')
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.notFound,
				});
			});

			it('should handle service errors', async () => {
				// Arrange
				mockGetSeekerById.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/seekers/1')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.getSeekerByIdError,
				});
			});
		});
	});

	describe('DELETE /api/seekers/:id', () => {
		describe('Successful Requests', () => {
			it('should delete seeker by id', async () => {
				// Arrange
				mockDeleteSeeker.mockResolvedValue(mockSeekerData);

				// Act
				const response = await request(app)
					.delete('/api/seekers/1')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.deleteSeekerSuccess);
				expect(mockDeleteSeeker).toHaveBeenCalledWith('1');
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockDeleteSeeker.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.delete('/api/seekers/1')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.deleteSeekerError,
				});
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject POST requests for GET endpoints', async () => {
			// Act & Assert
			await request(app)
				.post('/api/seekers/slug/test-slug')
				.expect(404);
		});

		it('should reject PUT requests for GET endpoints', async () => {
			// Act & Assert
			await request(app)
				.put('/api/seekers/1')
				.expect(404);
		});

		it('should reject PATCH requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.patch('/api/seekers')
				.expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Arrange
			mockGetAllSeekers.mockResolvedValue(mockSeekerListResponse);

			// Act
			const response = await request(app)
				.get('/api/seekers')
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('seekers');
			expect(response.body).toHaveProperty('pagination');
		});
	});
});
