import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockCreateJobService,
	mockUpdateJobService,
	mockDeleteJobService,
	mockGetJobsService,
	mockGetJobByIdService,
	mockBoostJobService,
	mockRequireAuth,
	mockJobData,
	mockJobsList,
	mockPagination,
	mockServiceResponses,
	mockErrors,
	mockAuthTokens,
	resetJobsMocks,
} from './mocks/jobs-integration.js';

// Import the route after mocking
import jobsRoutes from '../apps/api/routes/jobs.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/jobs', jobsRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Jobs Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();
		
		// Reset all mocks
		resetJobsMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('GET /api/jobs', () => {
		describe('Successful Requests', () => {
			it('should return jobs list with pagination', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs')
					.expect(200);

				// Assert
				expect(response.body).toHaveProperty('jobs');
				expect(response.body).toHaveProperty('pagination');
				expect(response.body.jobs).toHaveLength(2);
				expect(response.body.pagination).toEqual(mockPagination);
				expect(mockGetJobsService).toHaveBeenCalledWith({
					page: 1,
					limit: 10,
					category: undefined,
					city: undefined,
					salary: undefined,
					shuttle: false,
					meals: false,
				});
			});

			it('should handle query parameters correctly', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs?page=2&limit=5&category=1&city=1&salary=50000&shuttle=true&meals=false&lang=en')
					.expect(200);

				// Assert
				expect(response.body.jobs).toHaveLength(2);
				expect(mockGetJobsService).toHaveBeenCalledWith({
					page: 2,
					limit: 5,
					category: '1',
					city: '1',
					salary: 50000,
					shuttle: true,
					meals: false,
				});
			});

			it('should handle language parameter for category translations', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs?lang=en')
					.expect(200);

				// Assert
				expect(response.body.jobs).toHaveLength(2);
				expect(response.body.jobs[0].category.label).toBe('Information Technology');
				expect(response.body.jobs[1].category.label).toBe('Marketing');
			});

			it('should handle Russian language by default', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs')
					.expect(200);

				// Assert
				expect(response.body.jobs).toHaveLength(2);
				expect(response.body.jobs[0].category.label).toBe('IT');
				expect(response.body.jobs[1].category.label).toBe('Маркетинг');
			});

			it('should handle empty jobs list', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue({
					jobs: [],
					pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
				});

				// Act
				const response = await request(app)
					.get('/api/jobs')
					.expect(200);

				// Assert
				expect(response.body.jobs).toHaveLength(0);
				expect(response.body.pagination.totalItems).toBe(0);
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsError);

				// Act
				const response = await request(app)
					.get('/api/jobs')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Failed to fetch jobs',
				});
			});

			it('should handle service promise rejection', async () => {
				// Arrange
				mockGetJobsService.mockRejectedValue(new Error('Database connection failed'));

				// Act
				const response = await request(app)
					.get('/api/jobs')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Database connection failed',
				});
			});
		});

		describe('HTTP Method Validation', () => {
			it('should reject POST requests', async () => {
				// Act & Assert
				await request(app)
					.post('/api/jobs')
					.expect(401); // Requires authentication
			});

			it('should reject PUT requests', async () => {
				// Act & Assert
				await request(app)
					.put('/api/jobs')
					.expect(404);
			});

			it('should reject DELETE requests', async () => {
				// Act & Assert
				await request(app)
					.delete('/api/jobs')
					.expect(404);
			});

			it('should reject PATCH requests', async () => {
				// Act & Assert
				await request(app)
					.patch('/api/jobs')
					.expect(404);
			});
		});

		describe('Response Format Validation', () => {
			it('should return valid JSON response', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs')
					.expect(200)
					.expect('Content-Type', /json/);

				// Assert
				expect(typeof response.body).toBe('object');
				expect(response.body).toHaveProperty('jobs');
				expect(response.body).toHaveProperty('pagination');
				expect(Array.isArray(response.body.jobs)).toBe(true);
			});
		});
	});

	describe('GET /api/jobs/:id', () => {
		describe('Successful Requests', () => {
			it('should return job by ID', async () => {
				// Arrange
				mockGetJobByIdService.mockResolvedValue(mockServiceResponses.getJobByIdSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs/1')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockJobData);
				expect(mockGetJobByIdService).toHaveBeenCalledWith(1);
			});

			it('should handle numeric job ID', async () => {
				// Arrange
				mockGetJobByIdService.mockResolvedValue(mockServiceResponses.getJobByIdSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs/123')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockJobData);
				expect(mockGetJobByIdService).toHaveBeenCalledWith(123);
			});
		});

		describe('Error Handling', () => {
			it('should handle invalid job ID', async () => {
				// Act
				const response = await request(app)
					.get('/api/jobs/invalid')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'ID вакансии обязателен и должен быть числом',
				});
			});

			it('should handle missing job ID', async () => {
				// Arrange
				mockGetJobsService.mockResolvedValue(mockServiceResponses.getJobsSuccess);

				// Act
				const response = await request(app)
					.get('/api/jobs/')
					.expect(200); // This will hit the GET / route instead

				// Assert
				expect(response.body).toHaveProperty('jobs');
			});

			it('should handle job not found', async () => {
				// Arrange
				mockGetJobByIdService.mockResolvedValue(mockServiceResponses.getJobByIdError);

				// Act
				const response = await request(app)
					.get('/api/jobs/999')
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					error: 'Job not found',
				});
			});

			it('should handle service promise rejection', async () => {
				// Arrange
				mockGetJobByIdService.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/jobs/1')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка получения объявления',
					details: 'Database error',
				});
			});
		});
	});

	describe('POST /api/jobs', () => {
		describe('Successful Requests', () => {
			it('should create a new job with authentication', async () => {
				// Arrange
				const jobData = {
					title: 'Software Developer',
					salary: '50000',
					phone: '+972501234567',
					description: 'Looking for an experienced software developer',
					cityId: 1,
					categoryId: 1,
					shuttle: true,
					meals: false,
					imageUrl: 'https://example.com/job-image.jpg',
				};
				mockCreateJobService.mockResolvedValue(mockServiceResponses.createJobSuccess);

				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.validToken)
					.send(jobData)
					.expect(201);

				// Assert
				expect(response.body).toEqual(mockJobData);
				expect(mockCreateJobService).toHaveBeenCalledWith({
					...jobData,
					userId: 'user_123456789',
				});
			});

			it('should create job without image URL', async () => {
				// Arrange
				const jobData = {
					title: 'Software Developer',
					salary: '50000',
					phone: '+972501234567',
					description: 'Looking for an experienced software developer',
					cityId: 1,
					categoryId: 1,
					shuttle: false,
					meals: true,
				};
				mockCreateJobService.mockResolvedValue(mockServiceResponses.createJobSuccess);

				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.validToken)
					.send(jobData)
					.expect(201);

				// Assert
				expect(response.body).toEqual(mockJobData);
			});
		});

		describe('Authentication', () => {
			it('should require authentication', async () => {
				// Act
				const response = await request(app)
					.post('/api/jobs')
					.send({ title: 'Test Job' })
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'No authorization token provided',
				});
			});

			it('should reject invalid token', async () => {
				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.invalidToken)
					.send({ title: 'Test Job' })
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'Token verification failed',
				});
			});

			it('should reject malformed token', async () => {
				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.malformedToken)
					.send({ title: 'Test Job' })
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'Invalid token format',
				});
			});

			it('should reject token without Bearer prefix', async () => {
				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.noBearerToken)
					.send({ title: 'Test Job' })
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'No authorization token provided',
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle validation errors', async () => {
				// Arrange
				mockCreateJobService.mockResolvedValue(mockServiceResponses.createJobValidationError);

				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.validToken)
					.send({ title: '', salary: 'invalid' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					errors: {
						title: 'Title is required',
						salary: 'Salary must be a number',
					},
				});
			});

			it('should handle service errors', async () => {
				// Arrange
				mockCreateJobService.mockResolvedValue(mockServiceResponses.createJobError);

				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.validToken)
					.send({ title: 'Test Job' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'Job creation failed',
				});
			});

			it('should handle service promise rejection', async () => {
				// Arrange
				mockCreateJobService.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.validToken)
					.send({ title: 'Test Job' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Database error',
				});
			});
		});
	});

	describe('PUT /api/jobs/:id', () => {
		describe('Successful Requests', () => {
			it('should update job with authentication', async () => {
				// Arrange
				const updateData = {
					title: 'Updated Software Developer',
					salary: '60000',
				};
				mockUpdateJobService.mockResolvedValue(mockServiceResponses.updateJobSuccess);

				// Act
				const response = await request(app)
					.put('/api/jobs/1')
					.set('Authorization', mockAuthTokens.validToken)
					.send(updateData)
					.expect(200);

				// Assert
				expect(response.body.title).toBe('Updated Software Developer');
				expect(mockUpdateJobService).toHaveBeenCalledWith('1', {
					...updateData,
					userId: 'user_123456789',
				});
			});
		});

		describe('Authentication', () => {
			it('should require authentication', async () => {
				// Act
				const response = await request(app)
					.put('/api/jobs/1')
					.send({ title: 'Updated Job' })
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'No authorization token provided',
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle update errors', async () => {
				// Arrange
				mockUpdateJobService.mockResolvedValue(mockServiceResponses.updateJobError);

				// Act
				const response = await request(app)
					.put('/api/jobs/1')
					.set('Authorization', mockAuthTokens.validToken)
					.send({ title: 'Updated Job' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'Job update failed',
				});
			});
		});
	});

	describe('DELETE /api/jobs/:id', () => {
		describe('Successful Requests', () => {
			it('should delete job with authentication', async () => {
				// Arrange
				mockDeleteJobService.mockResolvedValue(mockServiceResponses.deleteJobSuccess);

				// Act
				const response = await request(app)
					.delete('/api/jobs/1')
					.set('Authorization', mockAuthTokens.validToken)
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					message: 'Объявление удалено',
				});
				expect(mockDeleteJobService).toHaveBeenCalledWith('1', 'user_123456789');
			});
		});

		describe('Authentication', () => {
			it('should require authentication', async () => {
				// Act
				const response = await request(app)
					.delete('/api/jobs/1')
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'No authorization token provided',
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle delete errors', async () => {
				// Arrange
				mockDeleteJobService.mockResolvedValue(mockServiceResponses.deleteJobError);

				// Act
				const response = await request(app)
					.delete('/api/jobs/1')
					.set('Authorization', mockAuthTokens.validToken)
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'Job deletion failed',
				});
			});
		});
	});

	describe('Performance and Caching', () => {
		it('should handle concurrent GET requests', async () => {
			// Arrange - Set up mock to handle multiple calls
			mockGetJobsService.mockImplementation(() => 
				Promise.resolve(mockServiceResponses.getJobsSuccess)
			);

			// Act - Make multiple concurrent requests
			const promises = Array.from({ length: 5 }).map(() =>
				request(app).get('/api/jobs')
			);

			const responses = await Promise.all(promises);

			// Assert
			responses.forEach((response) => {
				expect(response.status).toBe(200);
				expect(response.body.jobs).toHaveLength(2);
			});
			expect(mockGetJobsService).toHaveBeenCalledTimes(5);
		});

		it('should handle concurrent authenticated requests', async () => {
			// Arrange - Set up mock to handle multiple calls
			mockCreateJobService.mockImplementation(() => 
				Promise.resolve(mockServiceResponses.createJobSuccess)
			);

			// Act - Make multiple concurrent requests
			const promises = Array.from({ length: 3 }).map(() =>
				request(app)
					.post('/api/jobs')
					.set('Authorization', mockAuthTokens.validToken)
					.send({ title: 'Test Job' })
			);

			const responses = await Promise.all(promises);

			// Assert
			responses.forEach((response) => {
				expect(response.status).toBe(201);
				expect(response.body).toEqual(mockJobData);
			});
			expect(mockCreateJobService).toHaveBeenCalledTimes(3);
		});
	});
});
