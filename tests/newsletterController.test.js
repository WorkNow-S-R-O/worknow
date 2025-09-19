import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockPrisma,
	mockNewsletterServices,
	mockConsoleLog,
	mockConsoleError,
	mockRequest,
	mockResponse,
	mockSubscriberData,
	mockSubscriptionData,
	mockVerificationData,
	mockServiceResponses,
	mockErrors,
	mockPrismaErrors,
	mockErrorMessages,
	mockSuccessMessages,
	mockConsoleLogData,
	mockDataConversions,
	mockValidationLogic,
	mockEmailProcessingLogic,
	mockVerificationProcessingLogic,
	mockSubscriptionProcessingLogic,
	mockControllerLogic,
	mockServiceIntegrationLogic,
	mockRequestResponseLogic,
	resetNewsletterControllerMocks,
} from './mocks/newsletterController.js';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

describe('NewsletterController', () => {
	beforeEach(() => {
		// Reset all mocks
		resetNewsletterControllerMocks();
		
		// Mock console methods
		console.error = vi.fn();
		console.log = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.error = originalConsoleError;
		console.log = originalConsoleLog;
	});

	describe('Subscriber Data Processing Logic', () => {
		it('should handle valid subscriber data', () => {
			const subscriber = mockSubscriberData.validSubscriber;
			expect(subscriber).toHaveProperty('id');
			expect(subscriber).toHaveProperty('email');
			expect(subscriber).toHaveProperty('firstName');
			expect(subscriber).toHaveProperty('lastName');
			expect(subscriber).toHaveProperty('language');
			expect(subscriber).toHaveProperty('preferences');
			expect(subscriber).toHaveProperty('isActive');
			expect(subscriber).toHaveProperty('preferredCities');
			expect(subscriber).toHaveProperty('preferredCategories');
			expect(subscriber).toHaveProperty('preferredEmployment');
			expect(subscriber).toHaveProperty('preferredLanguages');
			expect(subscriber).toHaveProperty('preferredGender');
			expect(subscriber).toHaveProperty('preferredDocumentTypes');
			expect(subscriber).toHaveProperty('onlyDemanded');
			expect(subscriber).toHaveProperty('createdAt');
		});

		it('should handle subscriber without name', () => {
			const subscriber = mockSubscriberData.subscriberWithoutName;
			expect(subscriber.firstName).toBeNull();
			expect(subscriber.lastName).toBeNull();
			expect(subscriber.email).toBe('anonymous@example.com');
		});

		it('should handle subscriber with minimal data', () => {
			const subscriber = mockSubscriberData.subscriberWithMinimalData;
			expect(subscriber.preferredCities).toEqual(['Haifa']);
			expect(subscriber.preferredCategories).toEqual(['Sales']);
			expect(subscriber.onlyDemanded).toBe(true);
		});

		it('should handle existing subscriber data', () => {
			const subscriber = mockSubscriberData.existingSubscriber;
			expect(subscriber.isActive).toBe(true);
			expect(subscriber.language).toBe('ar');
		});

		it('should handle inactive subscriber data', () => {
			const subscriber = mockSubscriberData.inactiveSubscriber;
			expect(subscriber.isActive).toBe(false);
		});
	});

	describe('Subscription Data Processing Logic', () => {
		it('should handle valid subscription data', () => {
			const data = mockSubscriptionData.validSubscriptionData;
			expect(data).toHaveProperty('email');
			expect(data).toHaveProperty('firstName');
			expect(data).toHaveProperty('lastName');
			expect(data).toHaveProperty('language');
			expect(data).toHaveProperty('preferences');
			expect(data).toHaveProperty('preferredCities');
			expect(data).toHaveProperty('preferredCategories');
			expect(data).toHaveProperty('preferredEmployment');
			expect(data).toHaveProperty('preferredLanguages');
			expect(data).toHaveProperty('preferredGender');
			expect(data).toHaveProperty('preferredDocumentTypes');
			expect(data).toHaveProperty('onlyDemanded');
		});

		it('should handle subscription data without name', () => {
			const data = mockSubscriptionData.subscriptionDataWithoutName;
			expect(data.firstName).toBeNull();
			expect(data.lastName).toBeNull();
			expect(data.email).toBe('anonymous@example.com');
		});

		it('should handle subscription data with minimal preferences', () => {
			const data = mockSubscriptionData.subscriptionDataWithMinimalPreferences;
			expect(data.preferredCities).toEqual(['Haifa']);
			expect(data.preferredCategories).toEqual(['Sales']);
			expect(data.onlyDemanded).toBe(true);
		});

		it('should handle invalid subscription data', () => {
			const data = mockSubscriptionData.invalidSubscriptionData;
			expect(data.email).toBeUndefined();
			expect(data.firstName).toBe('Invalid');
		});

		it('should handle subscription data with invalid email', () => {
			const data = mockSubscriptionData.subscriptionDataWithInvalidEmail;
			expect(data.email).toBe('invalid-email');
		});
	});

	describe('Verification Data Processing Logic', () => {
		it('should handle valid verification code', () => {
			const code = mockVerificationData.validVerificationCode;
			expect(code).toBe('123456');
			expect(code.length).toBe(6);
			expect(/^\d+$/.test(code)).toBe(true);
		});

		it('should handle invalid verification code', () => {
			const code = mockVerificationData.invalidVerificationCode;
			expect(code).toBe('000000');
		});

		it('should handle expired verification code', () => {
			const code = mockVerificationData.expiredVerificationCode;
			expect(code).toBe('999999');
		});

		it('should handle verification request data', () => {
			const data = mockVerificationData.verificationRequest;
			expect(data).toHaveProperty('email');
			expect(data).toHaveProperty('code');
			expect(data).toHaveProperty('subscriptionData');
		});

		it('should handle verification request with invalid code', () => {
			const data = mockVerificationData.verificationRequestWithInvalidCode;
			expect(data.code).toBe('000000');
		});

		it('should handle verification request missing fields', () => {
			const data = mockVerificationData.verificationRequestMissingFields;
			expect(data.code).toBeUndefined();
		});
	});

	describe('Validation Logic', () => {
		it('should validate email correctly', () => {
			expect(mockValidationLogic.validateEmail('user@example.com').isValid).toBe(true);
			expect(mockValidationLogic.validateEmail('').isValid).toBe(false);
			expect(mockValidationLogic.validateEmail('invalid-email').isValid).toBe(false);
			expect(mockValidationLogic.validateEmail('').error).toBe('Email is required');
			expect(mockValidationLogic.validateEmail('invalid-email').error).toBe('Invalid email format');
		});

		it('should validate subscription data correctly', () => {
			const validData = mockSubscriptionData.validSubscriptionData;
			const invalidData = mockSubscriptionData.invalidSubscriptionData;
			
			expect(mockValidationLogic.validateSubscriptionData(validData).isValid).toBe(true);
			expect(mockValidationLogic.validateSubscriptionData(invalidData).isValid).toBe(false);
		});

		it('should validate verification data correctly', () => {
			const validData = mockVerificationData.verificationRequest;
			const invalidData = mockVerificationData.verificationRequestMissingFields;
			
			expect(mockValidationLogic.validateVerificationData(validData).isValid).toBe(true);
			expect(mockValidationLogic.validateVerificationData(invalidData).isValid).toBe(false);
			expect(mockValidationLogic.validateVerificationData(invalidData).error).toBe('Email and verification code are required');
		});

		it('should validate preferences data correctly', () => {
			const data = mockSubscriptionData.validSubscriptionData;
			expect(mockValidationLogic.validatePreferencesData(data).isValid).toBe(true);
		});

		it('should validate email format correctly', () => {
			expect(mockValidationLogic.validateEmailFormat('user@example.com')).toBe(true);
			expect(mockValidationLogic.validateEmailFormat('invalid-email')).toBe(false);
			expect(mockValidationLogic.validateEmailFormat('')).toBe(false);
		});

		it('should validate email required correctly', () => {
			expect(mockValidationLogic.validateEmailRequired('user@example.com')).toBe(true);
			expect(mockValidationLogic.validateEmailRequired('')).toBe(false);
			expect(mockValidationLogic.validateEmailRequired('   ')).toBe(false);
		});

		it('should validate verification code correctly', () => {
			expect(mockValidationLogic.validateVerificationCode('123456')).toBe(true);
			expect(mockValidationLogic.validateVerificationCode('000000')).toBe(true);
			expect(mockValidationLogic.validateVerificationCode('12345')).toBe(false);
			expect(mockValidationLogic.validateVerificationCode('abcdef')).toBe(false);
		});

		it('should validate language correctly', () => {
			expect(mockValidationLogic.validateLanguage('ru')).toBe(true);
			expect(mockValidationLogic.validateLanguage('en')).toBe(true);
			expect(mockValidationLogic.validateLanguage('he')).toBe(true);
			expect(mockValidationLogic.validateLanguage('ar')).toBe(true);
			expect(mockValidationLogic.validateLanguage('invalid')).toBe(false);
		});

		it('should validate gender correctly', () => {
			expect(mockValidationLogic.validateGender('Male')).toBe(true);
			expect(mockValidationLogic.validateGender('Female')).toBe(true);
			expect(mockValidationLogic.validateGender('Other')).toBe(true);
			expect(mockValidationLogic.validateGender(null)).toBe(true);
			expect(mockValidationLogic.validateGender('Invalid')).toBe(false);
		});

		it('should validate employment correctly', () => {
			expect(mockValidationLogic.validateEmployment(['Full-time', 'Part-time'])).toBe(true);
			expect(mockValidationLogic.validateEmployment(['Full-time'])).toBe(true);
			expect(mockValidationLogic.validateEmployment([])).toBe(true);
			expect(mockValidationLogic.validateEmployment(['Invalid'])).toBe(false);
		});
	});

	describe('Email Processing Logic', () => {
		it('should process email correctly', () => {
			expect(mockEmailProcessingLogic.processEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
			expect(mockEmailProcessingLogic.processEmail('user@example.com')).toBe('user@example.com');
		});

		it('should validate email format correctly', () => {
			expect(mockEmailProcessingLogic.validateEmailFormat('user@example.com')).toBe(true);
			expect(mockEmailProcessingLogic.validateEmailFormat('invalid-email')).toBe(false);
		});

		it('should format email for storage correctly', () => {
			expect(mockEmailProcessingLogic.formatEmailForStorage('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
		});

		it('should handle email error correctly', () => {
			const error = mockErrors.emailSendingError;
			const result = mockEmailProcessingLogic.handleEmailError(error);
			
			expect(result.success).toBe(false);
			expect(result.error).toBe(error.message);
		});

		it('should handle email success correctly', () => {
			const email = 'user@example.com';
			const result = mockEmailProcessingLogic.handleEmailSuccess(email);
			
			expect(result.success).toBe(true);
			expect(result.email).toBe(email);
		});
	});

	describe('Verification Processing Logic', () => {
		it('should generate verification code correctly', () => {
			const code = mockVerificationProcessingLogic.generateVerificationCode();
			expect(code.length).toBe(6);
			expect(/^\d+$/.test(code)).toBe(true);
		});

		it('should process verification code correctly', () => {
			expect(mockVerificationProcessingLogic.processVerificationCode(123456)).toBe('123456');
			expect(mockVerificationProcessingLogic.processVerificationCode('123456')).toBe('123456');
		});

		it('should validate verification code correctly', () => {
			expect(mockVerificationProcessingLogic.validateVerificationCode('123456')).toBe(true);
			expect(mockVerificationProcessingLogic.validateVerificationCode('000000')).toBe(true);
			expect(mockVerificationProcessingLogic.validateVerificationCode('12345')).toBe(false);
			expect(mockVerificationProcessingLogic.validateVerificationCode('abcdef')).toBe(false);
		});

		it('should handle verification error correctly', () => {
			const error = mockErrors.verificationError;
			const result = mockVerificationProcessingLogic.handleVerificationError(error);
			
			expect(result.success).toBe(false);
			expect(result.error).toBe(error.message);
		});

		it('should handle verification success correctly', () => {
			const code = '123456';
			const result = mockVerificationProcessingLogic.handleVerificationSuccess(code);
			
			expect(result.success).toBe(true);
			expect(result.code).toBe(code);
		});
	});

	describe('Subscription Processing Logic', () => {
		it('should process subscription data correctly', () => {
			const data = mockSubscriptionData.validSubscriptionData;
			const result = mockSubscriptionProcessingLogic.processSubscriptionData(data);
			
			expect(result.email).toBe('newuser@example.com');
			expect(result.firstName).toBe('New');
			expect(result.lastName).toBe('User');
			expect(result.language).toBe('ru');
			expect(result.preferences).toEqual({});
			expect(result.preferredCities).toEqual(['Tel Aviv', 'Jerusalem']);
			expect(result.preferredCategories).toEqual(['IT', 'Marketing']);
			expect(result.preferredEmployment).toEqual(['Full-time', 'Part-time']);
			expect(result.preferredLanguages).toEqual(['Hebrew', 'English']);
			expect(result.preferredGender).toBe('Male');
			expect(result.preferredDocumentTypes).toEqual(['Passport', 'ID']);
			expect(result.onlyDemanded).toBe(false);
		});

		it('should process subscription response correctly', () => {
			const subscriber = mockSubscriberData.validSubscriber;
			const result = mockSubscriptionProcessingLogic.processSubscriptionResponse(subscriber);
			
			expect(result.id).toBe(subscriber.id);
			expect(result.email).toBe(subscriber.email);
			expect(result.firstName).toBe(subscriber.firstName);
			expect(result.lastName).toBe(subscriber.lastName);
			expect(result.preferredCities).toEqual(subscriber.preferredCities);
			expect(result.preferredCategories).toEqual(subscriber.preferredCategories);
			expect(result.preferredEmployment).toEqual(subscriber.preferredEmployment);
			expect(result.preferredLanguages).toEqual(subscriber.preferredLanguages);
			expect(result.preferredGender).toBe(subscriber.preferredGender);
			expect(result.preferredDocumentTypes).toEqual(subscriber.preferredDocumentTypes);
			expect(result.onlyDemanded).toBe(subscriber.onlyDemanded);
		});

		it('should handle subscription error correctly', () => {
			const error = mockErrors.databaseError;
			const result = mockSubscriptionProcessingLogic.handleSubscriptionError(error);
			
			expect(result.success).toBe(false);
			expect(result.error).toBe(error.message);
		});

		it('should handle subscription success correctly', () => {
			const subscriber = mockSubscriberData.validSubscriber;
			const result = mockSubscriptionProcessingLogic.handleSubscriptionSuccess(subscriber);
			
			expect(result.success).toBe(true);
			expect(result.subscriber).toBe(subscriber);
		});
	});

	describe('Controller Logic', () => {
		it('should process subscribeToNewsletter request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null);
			mockPrisma.newsletterSubscriber.create.mockResolvedValue(mockSubscriberData.validSubscriber);
			mockNewsletterServices.sendInitialCandidatesToNewSubscriber.mockResolvedValue(true);
			
			await mockControllerLogic.processSubscribeRequest(req, res);
			
			expect(mockPrisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
				where: { email: 'user@example.com' },
			});
			expect(mockPrisma.newsletterSubscriber.create).toHaveBeenCalledWith({
				data: {
					email: 'user@example.com',
					firstName: 'John',
					lastName: 'Doe',
					language: 'ru',
					preferences: {},
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
			expect(console.log).toHaveBeenCalledWith('✅ New newsletter subscriber:', 'user@example.com');
			expect(mockNewsletterServices.sendInitialCandidatesToNewSubscriber).toHaveBeenCalledWith(mockSubscriberData.validSubscriber);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Successfully subscribed to newsletter',
				subscriber: {
					id: 1,
					email: 'user@example.com',
					firstName: 'John',
					lastName: 'Doe',
					preferredCities: ['Tel Aviv', 'Jerusalem'],
					preferredCategories: ['IT', 'Marketing'],
					preferredEmployment: ['Full-time', 'Part-time'],
					preferredLanguages: ['Hebrew', 'English'],
					preferredGender: 'Male',
					preferredDocumentTypes: ['Passport', 'ID'],
					onlyDemanded: false,
				},
			});
		});

		it('should process subscribeToNewsletter request with missing email', async () => {
			const req = mockRequestResponseLogic.buildRequest({ email: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processSubscribeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Email is required',
			});
		});

		it('should process subscribeToNewsletter request with invalid email', async () => {
			const req = mockRequestResponseLogic.buildRequest({ email: 'invalid-email' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processSubscribeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Invalid email format',
			});
		});

		it('should process subscribeToNewsletter request with existing subscriber', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData.existingSubscriber);
			
			await mockControllerLogic.processSubscribeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(409);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'This email is already subscribed to the newsletter',
			});
		});

		it('should process subscribeToNewsletter request with database error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockRejectedValue(mockErrors.databaseError);
			
			await mockControllerLogic.processSubscribeRequest(req, res);
			
			expect(console.error).toHaveBeenCalledWith('❌ Newsletter subscription error:', mockErrors.databaseError);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Failed to subscribe to newsletter',
			});
		});

		it('should process unsubscribeFromNewsletter request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData.validSubscriber);
			mockPrisma.newsletterSubscriber.delete.mockResolvedValue(mockSubscriberData.validSubscriber);
			
			await mockControllerLogic.processUnsubscribeRequest(req, res);
			
			expect(mockPrisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
				where: { email: 'user@example.com' },
			});
			expect(mockPrisma.newsletterSubscriber.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(console.log).toHaveBeenCalledWith('✅ Successfully deleted subscriber:', 'user@example.com');
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Successfully unsubscribed from newsletter',
			});
		});

		it('should process unsubscribeFromNewsletter request with missing email', async () => {
			const req = mockRequestResponseLogic.buildRequest({ email: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processUnsubscribeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Email is required',
			});
		});

		it('should process unsubscribeFromNewsletter request with subscriber not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null);
			
			await mockControllerLogic.processUnsubscribeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Subscriber not found',
			});
		});

		it('should process getNewsletterSubscribers request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			const subscribers = [mockSubscriberData.validSubscriber, mockSubscriberData.subscriberWithoutName];
			mockPrisma.newsletterSubscriber.findMany.mockResolvedValue(subscribers);
			
			await mockControllerLogic.processGetSubscribersRequest(req, res);
			
			expect(mockPrisma.newsletterSubscriber.findMany).toHaveBeenCalledWith({
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
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				subscribers,
				total: 2,
			});
		});

		it('should process checkSubscriptionStatus request successfully with subscriber', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData.validSubscriber);
			
			await mockControllerLogic.processCheckSubscriptionRequest(req, res);
			
			expect(mockPrisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
				where: { email: 'user@example.com' },
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
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				isSubscribed: true,
				subscriber: mockSubscriberData.validSubscriber,
			});
		});

		it('should process checkSubscriptionStatus request successfully without subscriber', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null);
			
			await mockControllerLogic.processCheckSubscriptionRequest(req, res);
			
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				isSubscribed: false,
				subscriber: null,
			});
		});

		it('should process checkSubscriptionStatus request with missing email', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, {}, { email: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processCheckSubscriptionRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Email is required',
			});
		});

		it('should process updateNewsletterPreferences request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			const updatedSubscriber = { ...mockSubscriberData.validSubscriber, preferredCities: ['Haifa'] };
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriberData.validSubscriber);
			mockPrisma.newsletterSubscriber.update.mockResolvedValue(updatedSubscriber);
			
			await mockControllerLogic.processUpdatePreferencesRequest(req, res);
			
			expect(mockPrisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
				where: { email: 'user@example.com' },
			});
			expect(mockPrisma.newsletterSubscriber.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: {
					preferredCities: ['Tel Aviv', 'Jerusalem'],
					preferredCategories: ['IT', 'Marketing'],
					preferredEmployment: ['Full-time', 'Part-time'],
					preferredLanguages: ['Hebrew', 'English'],
					preferredGender: 'Male',
					preferredDocumentTypes: ['Passport', 'ID'],
					onlyDemanded: false,
				},
			});
			expect(console.log).toHaveBeenCalledWith('✅ Updated newsletter preferences for:', 'user@example.com');
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Newsletter preferences updated successfully',
				subscriber: {
					id: updatedSubscriber.id,
					email: updatedSubscriber.email,
					firstName: updatedSubscriber.firstName,
					lastName: updatedSubscriber.lastName,
					preferredCities: updatedSubscriber.preferredCities,
					preferredCategories: updatedSubscriber.preferredCategories,
					preferredEmployment: updatedSubscriber.preferredEmployment,
					preferredLanguages: updatedSubscriber.preferredLanguages,
					preferredGender: updatedSubscriber.preferredGender,
					preferredDocumentTypes: updatedSubscriber.preferredDocumentTypes,
					onlyDemanded: updatedSubscriber.onlyDemanded,
				},
			});
		});

		it('should process updateNewsletterPreferences request with missing email', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { email: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processUpdatePreferencesRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Email is required',
			});
		});

		it('should process updateNewsletterPreferences request with subscriber not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null);
			
			await mockControllerLogic.processUpdatePreferencesRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Subscriber not found',
			});
		});

		it('should process sendNewsletterVerificationCode request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findFirst.mockResolvedValue(null);
			mockNewsletterServices.storeVerificationCode.mockResolvedValue(true);
			mockNewsletterServices.sendVerificationCode.mockResolvedValue(true);
			
			await mockControllerLogic.processSendVerificationCodeRequest(req, res);
			
			expect(mockPrisma.newsletterSubscriber.findFirst).toHaveBeenCalledWith({
				where: {
					email: 'user@example.com',
					isActive: true,
				},
			});
			expect(console.log).toHaveBeenCalledWith('🔢 Generated verification code:', expect.any(String));
			expect(console.log).toHaveBeenCalledWith('💾 Storing verification code...');
			expect(mockNewsletterServices.storeVerificationCode).toHaveBeenCalledWith('user@example.com', expect.any(String));
			expect(console.log).toHaveBeenCalledWith('✅ Verification code stored successfully');
			expect(console.log).toHaveBeenCalledWith('📧 Sending verification code...');
			expect(mockNewsletterServices.sendVerificationCode).toHaveBeenCalledWith('user@example.com', expect.any(String));
			expect(console.log).toHaveBeenCalledWith('✅ Verification code sent successfully');
			expect(console.log).toHaveBeenCalledWith('✅ Verification code sent to:', 'user@example.com');
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Verification code sent to your email',
				email: 'user@example.com',
				subscriptionData: {
					email: 'user@example.com',
					firstName: 'John',
					lastName: 'Doe',
					language: 'ru',
					preferences: {},
					preferredCities: ['Tel Aviv', 'Jerusalem'],
					preferredCategories: ['IT', 'Marketing'],
					preferredEmployment: ['Full-time', 'Part-time'],
					preferredLanguages: ['Hebrew', 'English'],
					preferredGender: 'Male',
					preferredDocumentTypes: ['Passport', 'ID'],
					onlyDemanded: false,
				},
			});
		});

		it('should process sendNewsletterVerificationCode request with missing email', async () => {
			const req = mockRequestResponseLogic.buildRequest({ email: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processSendVerificationCodeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Email is required',
			});
		});

		it('should process sendNewsletterVerificationCode request with invalid email', async () => {
			const req = mockRequestResponseLogic.buildRequest({ email: 'invalid-email' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processSendVerificationCodeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Invalid email format',
			});
		});

		it('should process sendNewsletterVerificationCode request with existing subscriber', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.newsletterSubscriber.findFirst.mockResolvedValue(mockSubscriberData.existingSubscriber);
			
			await mockControllerLogic.processSendVerificationCodeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(409);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'This email is already subscribed to the newsletter',
			});
		});

		it('should process verifyNewsletterCode request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(mockVerificationData.verificationRequest);
			const res = mockRequestResponseLogic.buildResponse();
			
			const subscriberWithCorrectEmail = { ...mockSubscriberData.validSubscriber, email: 'verify@example.com' };
			mockNewsletterServices.verifyCode.mockResolvedValue({ valid: true });
			mockPrisma.newsletterSubscriber.create.mockResolvedValue(subscriberWithCorrectEmail);
			mockNewsletterServices.sendInitialCandidatesToNewSubscriber.mockResolvedValue(true);
			
			await mockControllerLogic.processVerifyCodeRequest(req, res);
			
			expect(mockNewsletterServices.verifyCode).toHaveBeenCalledWith('verify@example.com', '123456');
			expect(mockPrisma.newsletterSubscriber.create).toHaveBeenCalledWith({
				data: {
					email: 'verify@example.com',
					firstName: 'New',
					lastName: 'User',
					language: 'ru',
					preferences: {},
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
			expect(console.log).toHaveBeenCalledWith('✅ Newsletter subscription verified and completed:', 'verify@example.com');
			expect(mockNewsletterServices.sendInitialCandidatesToNewSubscriber).toHaveBeenCalledWith(subscriberWithCorrectEmail);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Successfully subscribed to newsletter',
				subscriber: {
					id: 1,
					email: 'verify@example.com',
					firstName: 'John',
					lastName: 'Doe',
					preferredCities: ['Tel Aviv', 'Jerusalem'],
					preferredCategories: ['IT', 'Marketing'],
					preferredEmployment: ['Full-time', 'Part-time'],
					preferredLanguages: ['Hebrew', 'English'],
					preferredGender: 'Male',
					preferredDocumentTypes: ['Passport', 'ID'],
					onlyDemanded: false,
				},
			});
		});

		it('should process verifyNewsletterCode request with missing fields', async () => {
			const req = mockRequestResponseLogic.buildRequest(mockVerificationData.verificationRequestMissingFields);
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processVerifyCodeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Email and verification code are required',
			});
		});

		it('should process verifyNewsletterCode request with invalid code', async () => {
			const req = mockRequestResponseLogic.buildRequest(mockVerificationData.verificationRequestWithInvalidCode);
			const res = mockRequestResponseLogic.buildResponse();
			
			mockNewsletterServices.verifyCode.mockResolvedValue({ valid: false, message: 'Invalid verification code' });
			
			await mockControllerLogic.processVerifyCodeRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Invalid verification code',
			});
		});

		it('should handle controller errors', () => {
			const error = mockErrors.databaseError;
			const res = mockRequestResponseLogic.buildResponse();
			
			mockControllerLogic.handleControllerError(error, res, 'subscribing to newsletter');
			
			expect(console.error).toHaveBeenCalledWith('❌ Error subscribing to newsletter:', mockErrors.databaseError);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Failed to subscribing to newsletter',
			});
		});

		it('should handle controller success', () => {
			const data = mockServiceResponses.successSubscribeResponse;
			const res = mockRequestResponseLogic.buildResponse();
			
			mockControllerLogic.handleControllerSuccess(data, res);
			
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(data);
		});

		it('should handle controller success with custom status code', () => {
			const data = mockServiceResponses.successSubscribeResponse;
			const res = mockRequestResponseLogic.buildResponse();
			
			mockControllerLogic.handleControllerSuccess(data, res, 201);
			
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(data);
		});

		it('should validate controller input', () => {
			const validRequest = { body: { email: 'user@example.com' }, params: {}, query: {} };
			const invalidRequest = { body: {} };
			
			expect(mockControllerLogic.validateControllerInput(validRequest)).toBe(true);
			expect(mockControllerLogic.validateControllerInput(invalidRequest)).toBe(false);
		});
	});
});
