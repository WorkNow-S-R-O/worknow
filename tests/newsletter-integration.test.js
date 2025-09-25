import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockSendInitialCandidatesToNewSubscriber,
	mockSendVerificationCode,
	mockStoreVerificationCode,
	mockVerifyCode,
	mockSendCandidatesToSubscribers,
	mockSendFilteredCandidatesToSubscribers,
	mockSubscriberData,
	mockSubscribersList,
	mockVerificationData,
	mockCandidatesList,
	mockServiceResponses,
	mockErrors,
	mockEmailResponses,
	mockVerificationResponses,
	resetNewsletterMocks,
} from './mocks/newsletter-integration.js';

// Import the route after mocking
import newsletterRoutes from '../apps/api/routes/newsletter.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/newsletter', newsletterRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Newsletter Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();
		
		// Reset all mocks
		resetNewsletterMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('POST /api/newsletter/subscribe', () => {
		describe('Successful Requests', () => {
			it('should subscribe user to newsletter with all preferences', async () => {
				// Arrange
				const subscriptionData = {
					email: 'test@example.com',
					firstName: 'John',
					lastName: 'Doe',
					language: 'ru',
					preferences: { notifications: true },
					preferredCities: ['Tel Aviv', 'Jerusalem'],
					preferredCategories: ['IT', 'Marketing'],
					preferredEmployment: ['Full-time', 'Part-time'],
					preferredLanguages: ['Hebrew', 'English'],
					preferredGender: 'Male',
					preferredDocumentTypes: ['Passport', 'ID'],
					onlyDemanded: false,
				};
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(null);
				mockPrismaInstance.newsletterSubscriber.create.mockResolvedValue(mockSubscriberData);
				mockSendInitialCandidatesToNewSubscriber.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send(subscriptionData)
					.expect(201);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.subscribeSuccess);
				expect(mockPrismaInstance.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
					where: { email: 'test@example.com' },
				});
				expect(mockPrismaInstance.newsletterSubscriber.create).toHaveBeenCalledWith({
					data: {
						email: 'test@example.com',
						firstName: 'John',
						lastName: 'Doe',
						language: 'ru',
						preferences: { notifications: true },
						isActive: true,
						preferredCities: ['Tel Aviv', 'Jerusalem'],
						preferredCategories: ['IT', 'Marketing'],
						preferredEmployment: ['Full-time', 'Part-time'],
						preferredLanguages: ['Hebrew', 'English'],
						preferredGender: 'Male',
						preferredDocumentTypes: ['Passport', 'ID'],
						onlyDemanded: false,
					},
				});
				expect(mockSendInitialCandidatesToNewSubscriber).toHaveBeenCalledWith(mockSubscriberData);
			});

			it('should subscribe user with minimal data', async () => {
				// Arrange
				const subscriptionData = {
					email: 'minimal@example.com',
				};
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(null);
				mockPrismaInstance.newsletterSubscriber.create.mockResolvedValue({
					...mockSubscriberData,
					email: 'minimal@example.com',
					firstName: null,
					lastName: null,
				});
				mockSendInitialCandidatesToNewSubscriber.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send(subscriptionData)
					.expect(201);

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.message).toBe('Successfully subscribed to newsletter');
			});

			it('should handle email sending errors gracefully', async () => {
				// Arrange
				const subscriptionData = {
					email: 'test@example.com',
					firstName: 'John',
					lastName: 'Doe',
				};
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(null);
				mockPrismaInstance.newsletterSubscriber.create.mockResolvedValue(mockSubscriberData);
				mockSendInitialCandidatesToNewSubscriber.mockRejectedValue(new Error('Email service down'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send(subscriptionData)
					.expect(201); // Should still succeed even if email fails

				// Assert
				expect(response.body.success).toBe(true);
				expect(mockSendInitialCandidatesToNewSubscriber).toHaveBeenCalled();
			});
		});

		describe('Error Handling', () => {
			it('should require email field', async () => {
				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send({ firstName: 'John' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Email is required',
				});
			});

			it('should validate email format', async () => {
				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send({ email: 'invalid-email' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Invalid email format',
				});
			});

			it('should handle already subscribed email', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData);

				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send({ email: 'test@example.com' })
					.expect(409);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.subscribeAlreadyExists);
			});

			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/subscribe')
					.send({ email: 'test@example.com' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to subscribe to newsletter',
				});
			});
		});
	});

	describe('POST /api/newsletter/unsubscribe', () => {
		describe('Successful Requests', () => {
			it('should unsubscribe user from newsletter', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData);
				mockPrismaInstance.newsletterSubscriber.delete.mockResolvedValue(mockSubscriberData);

				// Act
				const response = await request(app)
					.post('/api/newsletter/unsubscribe')
					.send({ email: 'test@example.com' })
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.unsubscribeSuccess);
				expect(mockPrismaInstance.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
					where: { email: 'test@example.com' },
				});
				expect(mockPrismaInstance.newsletterSubscriber.delete).toHaveBeenCalledWith({
					where: { id: mockSubscriberData.id },
				});
			});
		});

		describe('Error Handling', () => {
			it('should require email field', async () => {
				// Act
				const response = await request(app)
					.post('/api/newsletter/unsubscribe')
					.send({})
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Email is required',
				});
			});

			it('should handle subscriber not found', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.post('/api/newsletter/unsubscribe')
					.send({ email: 'nonexistent@example.com' })
					.expect(404);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.unsubscribeNotFound);
			});

			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/unsubscribe')
					.send({ email: 'test@example.com' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to unsubscribe from newsletter',
				});
			});
		});
	});

	describe('GET /api/newsletter/subscribers', () => {
		describe('Successful Requests', () => {
			it('should return all newsletter subscribers', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findMany.mockResolvedValue(mockSubscribersList);

				// Act
				const response = await request(app)
					.get('/api/newsletter/subscribers')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.getSubscribersSuccess);
				expect(mockPrismaInstance.newsletterSubscriber.findMany).toHaveBeenCalledWith({
					orderBy: { createdAt: 'desc' },
					select: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
						language: true,
						createdAt: true,
					},
				});
			});

			it('should return empty list when no subscribers', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findMany.mockResolvedValue([]);

				// Act
				const response = await request(app)
					.get('/api/newsletter/subscribers')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					subscribers: [],
					total: 0,
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findMany.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/newsletter/subscribers')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to get newsletter subscribers',
				});
			});
		});
	});

	describe('GET /api/newsletter/check-subscription', () => {
		describe('Successful Requests', () => {
			it('should return subscription status for subscribed user', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData);

				// Act
				const response = await request(app)
					.get('/api/newsletter/check-subscription?email=test@example.com')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.checkSubscriptionSubscribed);
				expect(mockPrismaInstance.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
					where: { email: 'test@example.com' },
					select: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
						language: true,
						createdAt: true,
						preferredCities: true,
						preferredCategories: true,
						preferredEmployment: true,
						preferredLanguages: true,
						preferredGender: true,
						preferredDocumentTypes: true,
						onlyDemanded: true,
					},
				});
			});

			it('should return not subscribed status for non-subscribed user', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.get('/api/newsletter/check-subscription?email=nonexistent@example.com')
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.checkSubscriptionNotSubscribed);
			});
		});

		describe('Error Handling', () => {
			it('should require email parameter', async () => {
				// Act
				const response = await request(app)
					.get('/api/newsletter/check-subscription')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Email is required',
				});
			});

			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/newsletter/check-subscription?email=test@example.com')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to check subscription status',
				});
			});
		});
	});

	describe('PUT /api/newsletter/preferences/:email', () => {
		describe('Successful Requests', () => {
			it('should update newsletter preferences', async () => {
				// Arrange
				const updatedPreferences = {
					preferredCities: ['Haifa'],
					preferredCategories: ['Finance'],
					preferredEmployment: ['Contract'],
					preferredLanguages: ['Arabic'],
					preferredGender: 'Female',
					preferredDocumentTypes: ['Driver License'],
					onlyDemanded: true,
				};
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData);
				mockPrismaInstance.newsletterSubscriber.update.mockResolvedValue({
					...mockSubscriberData,
					...updatedPreferences,
				});

				// Act
				const response = await request(app)
					.put('/api/newsletter/preferences/test@example.com')
					.send(updatedPreferences)
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.message).toBe('Newsletter preferences updated successfully');
				expect(mockPrismaInstance.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
					where: { email: 'test@example.com' },
				});
				expect(mockPrismaInstance.newsletterSubscriber.update).toHaveBeenCalledWith({
					where: { id: mockSubscriberData.id },
					data: updatedPreferences,
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle subscriber not found', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.put('/api/newsletter/preferences/nonexistent@example.com')
					.send({ preferredCities: ['Haifa'] })
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Subscriber not found',
				});
			});

			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findUnique.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.put('/api/newsletter/preferences/test@example.com')
					.send({ preferredCities: ['Haifa'] })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to update newsletter preferences',
				});
			});
		});
	});

	describe('POST /api/newsletter/send-verification', () => {
		describe('Successful Requests', () => {
			it('should send verification code for new subscription', async () => {
				// Arrange
				const subscriptionData = {
					email: 'test@example.com',
					firstName: 'John',
					lastName: 'Doe',
					language: 'ru',
					preferredCities: ['Tel Aviv'],
					preferredCategories: ['IT'],
				};
				mockPrismaInstance.newsletterSubscriber.findFirst.mockResolvedValue(null);
				mockStoreVerificationCode.mockResolvedValue(true);
				mockSendVerificationCode.mockResolvedValue(mockVerificationResponses.success);

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-verification')
					.send(subscriptionData)
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.sendVerificationSuccess);
				expect(mockPrismaInstance.newsletterSubscriber.findFirst).toHaveBeenCalledWith({
					where: {
						email: 'test@example.com',
						isActive: true,
					},
				});
				expect(mockStoreVerificationCode).toHaveBeenCalled();
				expect(mockSendVerificationCode).toHaveBeenCalled();
			});

			it('should handle already subscribed email', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findFirst.mockResolvedValue(mockSubscriberData);

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-verification')
					.send({ email: 'test@example.com' })
					.expect(409);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'This email is already subscribed to the newsletter',
				});
			});
		});

		describe('Error Handling', () => {
			it('should require email field', async () => {
				// Act
				const response = await request(app)
					.post('/api/newsletter/send-verification')
					.send({ firstName: 'John' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Email is required',
				});
			});

			it('should validate email format', async () => {
				// Act
				const response = await request(app)
					.post('/api/newsletter/send-verification')
					.send({ email: 'invalid-email' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Invalid email format',
				});
			});

			it('should handle verification service errors', async () => {
				// Arrange
				mockPrismaInstance.newsletterSubscriber.findFirst.mockResolvedValue(null);
				mockStoreVerificationCode.mockRejectedValue(new Error('Verification service error'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-verification')
					.send({ email: 'test@example.com' })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to send verification code',
				});
			});
		});
	});

	describe('POST /api/newsletter/verify-code', () => {
		describe('Successful Requests', () => {
			it('should verify code and complete subscription', async () => {
				// Arrange
				const verificationData = {
					email: 'test@example.com',
					code: '123456',
					subscriptionData: {
						email: 'test@example.com',
						firstName: 'John',
						lastName: 'Doe',
						language: 'ru',
						preferredCities: ['Tel Aviv'],
						preferredCategories: ['IT'],
					},
				};
				mockVerifyCode.mockResolvedValue(mockServiceResponses.verifyCodeSuccess);
				mockPrismaInstance.newsletterSubscriber.create.mockResolvedValue(mockSubscriberData);
				mockSendInitialCandidatesToNewSubscriber.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/newsletter/verify-code')
					.send(verificationData)
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.message).toBe('Successfully subscribed to newsletter');
				expect(mockVerifyCode).toHaveBeenCalledWith('test@example.com', '123456');
				expect(mockPrismaInstance.newsletterSubscriber.create).toHaveBeenCalled();
				expect(mockSendInitialCandidatesToNewSubscriber).toHaveBeenCalled();
			});
		});

		describe('Error Handling', () => {
			it('should require email and code', async () => {
				// Act
				const response = await request(app)
					.post('/api/newsletter/verify-code')
					.send({ email: 'test@example.com' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Email and verification code are required',
				});
			});

			it('should handle invalid verification code', async () => {
				// Arrange
				mockVerifyCode.mockResolvedValue(mockServiceResponses.verifyCodeInvalid);

				// Act
				const response = await request(app)
					.post('/api/newsletter/verify-code')
					.send({ email: 'test@example.com', code: 'wrong-code' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Invalid verification code',
				});
			});

			it('should handle expired verification code', async () => {
				// Arrange
				mockVerifyCode.mockResolvedValue(mockServiceResponses.verifyCodeExpired);

				// Act
				const response = await request(app)
					.post('/api/newsletter/verify-code')
					.send({ email: 'test@example.com', code: '123456' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Verification code has expired',
				});
			});

			it('should handle too many attempts', async () => {
				// Arrange
				mockVerifyCode.mockResolvedValue(mockServiceResponses.verifyCodeTooManyAttempts);

				// Act
				const response = await request(app)
					.post('/api/newsletter/verify-code')
					.send({ email: 'test@example.com', code: '123456' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Too many attempts. Please request a new code.',
				});
			});

			it('should handle database errors', async () => {
				// Arrange
				mockVerifyCode.mockResolvedValue(mockServiceResponses.verifyCodeSuccess);
				mockPrismaInstance.newsletterSubscriber.create.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/verify-code')
					.send({ email: 'test@example.com', code: '123456', subscriptionData: {} })
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to verify code and complete subscription',
				});
			});
		});
	});

	describe('POST /api/newsletter/send-candidates', () => {
		describe('Successful Requests', () => {
			it('should send candidates to all subscribers', async () => {
				// Arrange
				mockSendCandidatesToSubscribers.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-candidates')
					.send({})
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.sendCandidatesSuccess);
				expect(mockSendCandidatesToSubscribers).toHaveBeenCalledWith(undefined);
			});

			it('should send candidates to specific subscribers', async () => {
				// Arrange
				mockSendCandidatesToSubscribers.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-candidates')
					.send({ subscriberIds: ['sub_123', 'sub_456'] })
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.sendCandidatesSuccess);
				expect(mockSendCandidatesToSubscribers).toHaveBeenCalledWith(['sub_123', 'sub_456']);
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockSendCandidatesToSubscribers.mockRejectedValue(new Error('Service error'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-candidates')
					.send({})
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to send candidates to subscribers',
				});
			});
		});
	});

	describe('POST /api/newsletter/send-filtered-candidates', () => {
		describe('Successful Requests', () => {
			it('should send filtered candidates to subscribers', async () => {
				// Arrange
				mockSendFilteredCandidatesToSubscribers.mockResolvedValue();

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-filtered-candidates')
					.send({})
					.expect(200);

				// Assert
				expect(response.body).toEqual(mockServiceResponses.sendFilteredCandidatesSuccess);
				expect(mockSendFilteredCandidatesToSubscribers).toHaveBeenCalled();
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockSendFilteredCandidatesToSubscribers.mockRejectedValue(new Error('Service error'));

				// Act
				const response = await request(app)
					.post('/api/newsletter/send-filtered-candidates')
					.send({})
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					success: false,
					message: 'Failed to send filtered candidates to subscribers',
				});
			});
		});
	});

	describe('HTTP Method Validation', () => {
		it('should reject GET requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.get('/api/newsletter/subscribe')
				.expect(404);
		});

		it('should reject PUT requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.put('/api/newsletter/subscribe')
				.expect(404);
		});

		it('should reject DELETE requests for POST endpoints', async () => {
			// Act & Assert
			await request(app)
				.delete('/api/newsletter/subscribe')
				.expect(404);
		});
	});

	describe('Response Format Validation', () => {
		it('should return valid JSON responses', async () => {
			// Arrange
			mockPrismaInstance.newsletterSubscriber.findMany.mockResolvedValue(mockSubscribersList);

			// Act
			const response = await request(app)
				.get('/api/newsletter/subscribers')
				.expect(200)
				.expect('Content-Type', /json/);

			// Assert
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('success');
			expect(response.body).toHaveProperty('subscribers');
			expect(response.body).toHaveProperty('total');
		});
	});

	describe('Performance and Caching', () => {
		it('should handle concurrent subscription requests', async () => {
			// Arrange
			mockPrismaInstance.newsletterSubscriber.findUnique.mockImplementation(() => 
				Promise.resolve(null)
			);
			mockPrismaInstance.newsletterSubscriber.create.mockImplementation(() => 
				Promise.resolve(mockSubscriberData)
			);
			mockSendInitialCandidatesToNewSubscriber.mockImplementation(() => 
				Promise.resolve()
			);

			// Act - Make multiple concurrent requests
			const promises = Array.from({ length: 3 }).map((_, index) =>
				request(app)
					.post('/api/newsletter/subscribe')
					.send({ email: `test${index}@example.com` })
			);

			const responses = await Promise.all(promises);

			// Assert
			responses.forEach((response) => {
				expect(response.status).toBe(201);
				expect(response.body.success).toBe(true);
			});
		});

		it('should handle concurrent verification requests', async () => {
			// Arrange
			mockVerifyCode.mockImplementation(() => 
				Promise.resolve(mockServiceResponses.verifyCodeSuccess)
			);
			mockPrismaInstance.newsletterSubscriber.create.mockImplementation(() => 
				Promise.resolve(mockSubscriberData)
			);
			mockSendInitialCandidatesToNewSubscriber.mockImplementation(() => 
				Promise.resolve()
			);

			// Act - Make multiple concurrent requests
			const promises = Array.from({ length: 2 }).map((_, index) =>
				request(app)
					.post('/api/newsletter/verify-code')
					.send({
						email: `test${index}@example.com`,
						code: '123456',
						subscriptionData: {},
					})
			);

			const responses = await Promise.all(promises);

			// Assert
			responses.forEach((response) => {
				expect(response.status).toBe(200);
				expect(response.body.success).toBe(true);
			});
		});
	});
});


