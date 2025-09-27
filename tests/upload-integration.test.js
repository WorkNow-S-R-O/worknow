import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockMulterUpload,
	mockRequireAuth,
	mockErrors,
} from './mocks/upload-integration.js';

// Import the route after mocking
import uploadRoutes from '../apps/api/routes/upload.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/upload', uploadRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Upload Integration Tests - Simple', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();

		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();

		// Reset multer mock to default behavior
		mockMulterUpload.single.mockImplementation(() => (req, res, next) => {
			req.file = {
				filename: 'job-1234567890-123456789.jpg',
				originalname: 'test-image.jpg',
				mimetype: 'image/jpeg',
				size: 1024,
			};
			next();
		});
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('POST /api/upload/job-image', () => {
		describe('Successful Requests', () => {
			it('should upload job image successfully', async () => {
				// Act
				const response = await request(app)
					.post('/api/upload/job-image')
					.set('Authorization', 'Bearer valid-token')
					.set('Host', 'localhost:3001')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.imageUrl).toContain(
					'http://localhost:3001/images/jobs/',
				);
				expect(response.body.filename).toMatch(/^job-\d+-\d+\.jpg$/);
			});

			it('should generate correct URL for production environment', async () => {
				// Act
				const response = await request(app)
					.post('/api/upload/job-image')
					.set('Authorization', 'Bearer valid-token')
					.set('Host', 'worknow.co.il')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(200);

				// Assert
				expect(response.body.imageUrl).toContain(
					'https://worknow.co.il/images/jobs/',
				);
			});
		});

		describe('Authentication', () => {
			it('should require authentication', async () => {
				// Act
				const response = await request(app)
					.post('/api/upload/job-image')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.noAuthToken,
				});
			});

			it('should reject invalid token', async () => {
				// Act
				const response = await request(app)
					.post('/api/upload/job-image')
					.set('Authorization', 'Bearer invalid-token')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.invalidToken,
				});
			});

			it('should reject malformed authorization header', async () => {
				// Act
				const response = await request(app)
					.post('/api/upload/job-image')
					.set('Authorization', 'invalid-format')
					.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
					.expect(401);

				// Assert
				expect(response.body).toEqual({
					error: mockErrors.noAuthToken,
				});
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject GET requests', async () => {
			// Act & Assert
			await request(app).get('/api/upload/job-image').expect(404);
		});

		it('should reject PUT requests', async () => {
			// Act & Assert
			await request(app).put('/api/upload/job-image').expect(404);
		});

		it('should reject DELETE requests', async () => {
			// Act & Assert
			await request(app).delete('/api/upload/job-image').expect(404);
		});

		it('should reject PATCH requests', async () => {
			// Act & Assert
			await request(app).patch('/api/upload/job-image').expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Act
			const response = await request(app)
				.post('/api/upload/job-image')
				.set('Authorization', 'Bearer valid-token')
				.set('Host', 'localhost:3001')
				.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('success');
			expect(response.body).toHaveProperty('imageUrl');
			expect(response.body).toHaveProperty('filename');
		});
	});

	describe('File Processing', () => {
		it('should generate unique filenames', async () => {
			// Act
			const response = await request(app)
				.post('/api/upload/job-image')
				.set('Authorization', 'Bearer valid-token')
				.set('Host', 'localhost:3001')
				.attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
				.expect(200);

			// Assert
			expect(response.body.filename).toMatch(/^job-\d+-\d+\.jpg$/);
		});
	});
});
