import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockS3Instance,
	mockRekognitionInstance,
	mockMulterUpload,
	mockModerateImage,
	mockValidateRekognitionConfig,
	mockCreateJobService,
	mockSendNewJobNotificationToTelegram,
	mockRequireAuth,
	mockUploadToS3,
	mockUploadToS3WithModeration,
	mockDeleteFromS3,
	mockValidateS3Config,
	mockUserData,
	mockPremiumUserData,
	mockJobData,
	mockFileData,
	mockS3UploadResult,
	mockModerationResult,
	mockRejectedModerationResult,
	mockS3ConfigStatus,
	mockInvalidS3ConfigStatus,
	mockRekognitionConfigStatus,
	mockServiceResponses,
	mockErrors,
	mockMulterErrors,
	resetS3UploadMocks,
} from './mocks/s3Upload-integration.js';

// Import the route after mocking
import s3UploadRoutes from '../apps/api/routes/s3Upload.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/s3-upload', s3UploadRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

describe('S3Upload Integration Tests - Simple', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();
		console.warn = vi.fn();
		
		// Mock environment variables
		process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
		process.env.AWS_REGION = 'us-east-1';
		process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
		process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
		
		// Reset all mocks
		resetS3UploadMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
		console.warn = originalConsoleWarn;
	});

	describe('GET /api/s3-upload/test-config', () => {
		describe('Successful Requests', () => {
			it('should return S3 configuration status', async () => {
				// Arrange
				mockValidateS3Config.mockReturnValue(mockS3ConfigStatus);

				// Act
				const response = await request(app)
					.get('/api/s3-upload/test-config')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.testConfigSuccess);
			});

		});

		describe('Error Handling', () => {
			it('should handle configuration validation errors', async () => {
				// Arrange
				mockValidateS3Config.mockImplementation(() => {
					throw new Error('Configuration error');
				});

				// Act
				const response = await request(app)
					.get('/api/s3-upload/test-config')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Configuration error',
				});
			});
		});
	});

	describe('POST /api/s3-upload/test-upload', () => {
		describe('Successful Requests', () => {
			it('should upload test image to S3', async () => {
				// Arrange
				mockUploadToS3.mockResolvedValue('https://s3.amazonaws.com/bucket/jobs/uuid.jpg');

				// Act
				const response = await request(app)
					.post('/api/s3-upload/test-upload')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
					filename: 'test-image.jpg',
					size: 1024
				});
				expect(mockUploadToS3).toHaveBeenCalledWith(
					expect.any(Buffer),
					'test-image.jpg',
					'image/jpeg',
					'test'
				);
			});
		});

		describe('Error Handling', () => {
			it('should handle S3 upload errors', async () => {
				// Arrange
				mockUploadToS3.mockRejectedValue(new Error('S3 upload failed'));

				// Act
				const response = await request(app)
					.post('/api/s3-upload/test-upload')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.uploadFailed,
					details: 'S3 upload failed',
					code: 'UPLOAD_FAILED',
				});
			});
		});
	});

	describe('POST /api/s3-upload/test-moderation', () => {
		describe('Successful Requests', () => {
			it('should test image moderation', async () => {
				// Arrange
				mockModerateImage.mockResolvedValue(mockModerationResult);

				// Act
				const response = await request(app)
					.post('/api/s3-upload/test-moderation')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.testModerationSuccess);
				expect(mockModerateImage).toHaveBeenCalledWith(expect.any(Buffer));
			});

			it('should handle rejected content', async () => {
				// Arrange
				mockModerateImage.mockResolvedValue(mockRejectedModerationResult);

				// Act
				const response = await request(app)
					.post('/api/s3-upload/test-moderation')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					moderationResult: mockRejectedModerationResult,
					filename: 'test-image.jpg',
					size: expect.any(Number),
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle moderation errors', async () => {
				// Arrange
				mockModerateImage.mockRejectedValue(new Error('Moderation failed'));

				// Act
				const response = await request(app)
					.post('/api/s3-upload/test-moderation')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.moderationFailed,
					details: 'Moderation failed',
					code: 'MODERATION_FAILED',
				});
			});
		});
	});

	describe('POST /api/s3-upload/job-image', () => {
		describe('Successful Requests', () => {
			it('should upload job image with moderation', async () => {
				// Arrange
				mockUploadToS3WithModeration.mockResolvedValue({
					success: true,
					imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
					moderationResult: mockModerationResult,
				});

				// Act
				const response = await request(app)
					.post('/api/s3-upload/job-image')
					.set('Authorization', 'Bearer valid-token')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.jobImageUploadSuccess);
				expect(mockUploadToS3WithModeration).toHaveBeenCalledWith(
					expect.any(Buffer),
					'test-image.jpg',
					'image/jpeg',
					'jobs'
				);
			});

			it('should handle content rejection', async () => {
				// Arrange
				mockUploadToS3WithModeration.mockResolvedValue({
					success: false,
					error: 'Image content violates community guidelines',
					code: 'CONTENT_REJECTED',
					moderationResult: mockRejectedModerationResult,
				});

				// Act
				const response = await request(app)
					.post('/api/s3-upload/job-image')
					.set('Authorization', 'Bearer valid-token')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.contentRejected,
					code: 'CONTENT_REJECTED',
					moderationDetails: mockRejectedModerationResult,
				});
			});
		});

		describe('Error Handling', () => {
			it('should require authentication', async () => {
				// Act
				const response = await request(app)
					.post('/api/s3-upload/job-image')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'No authorization token provided',
				});
			});
		});
	});

	describe('DELETE /api/s3-upload/delete-image', () => {
		describe('Successful Requests', () => {
			it('should delete image from S3', async () => {
				// Arrange
				mockDeleteFromS3.mockResolvedValue(true);

				// Act
				const response = await request(app)
					.delete('/api/s3-upload/delete-image')
					.set('Authorization', 'Bearer valid-token')
					.send({ imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg' })
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.deleteImageSuccess);
				expect(mockDeleteFromS3).toHaveBeenCalledWith('https://s3.amazonaws.com/bucket/jobs/uuid.jpg');
			});
		});

		describe('Error Handling', () => {
			it('should require authentication', async () => {
				// Act
				const response = await request(app)
					.delete('/api/s3-upload/delete-image')
					.send({ imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg' })
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: 'No authorization token provided',
				});
			});

			it('should handle missing image URL', async () => {
				// Act
				const response = await request(app)
					.delete('/api/s3-upload/delete-image')
					.set('Authorization', 'Bearer valid-token')
					.send({})
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.missingUrl,
					code: 'MISSING_URL',
				});
			});

			it('should handle S3 deletion errors', async () => {
				// Arrange
				mockDeleteFromS3.mockResolvedValue(false);

				// Act
				const response = await request(app)
					.delete('/api/s3-upload/delete-image')
					.set('Authorization', 'Bearer valid-token')
					.send({ imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg' })
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.deleteFailed,
					code: 'DELETE_FAILED',
				});
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject GET requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.get('/api/s3-upload/test-upload')
				.expect(404);
		});

		it('should reject PUT requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.put('/api/s3-upload/test-upload')
				.expect(404);
		});

		it('should reject DELETE requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.delete('/api/s3-upload/test-upload')
				.expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Arrange
			mockValidateS3Config.mockReturnValue(mockS3ConfigStatus);

			// Act
			const response = await request(app)
				.get('/api/s3-upload/test-config')
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('success');
		});
	});
});