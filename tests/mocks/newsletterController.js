import { vi } from 'vitest';

// Mock services
export const mockNewsletterServices = {
	sendInitialCandidatesToNewSubscriber: vi.fn(),
	sendVerificationCode: vi.fn(),
	storeVerificationCode: vi.fn(),
	verifyCode: vi.fn(),
};

// Mock Prisma
export const mockPrisma = {
	newsletterSubscriber: {
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		findMany: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
};

// Mock console methods
export const mockConsoleLog = vi
	.spyOn(console, 'log')
	.mockImplementation(() => {});
export const mockConsoleError = vi
	.spyOn(console, 'error')
	.mockImplementation(() => {});

// Mock request and response objects
export const mockRequest = {
	body: {
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
	params: {
		email: 'user@example.com',
	},
	query: {
		email: 'user@example.com',
	},
};

export const mockResponse = {
	json: vi.fn(),
	status: vi.fn().mockReturnThis(),
};

// Mock subscriber data
export const mockSubscriberData = {
	validSubscriber: {
		id: 1,
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
		createdAt: '2024-01-01T00:00:00Z',
	},

	subscriberWithoutName: {
		id: 2,
		email: 'anonymous@example.com',
		firstName: null,
		lastName: null,
		language: 'en',
		preferences: {},
		isActive: true,
		preferredCities: [],
		preferredCategories: [],
		preferredEmployment: [],
		preferredLanguages: [],
		preferredGender: null,
		preferredDocumentTypes: [],
		onlyDemanded: false,
		createdAt: '2024-01-02T00:00:00Z',
	},

	subscriberWithMinimalData: {
		id: 3,
		email: 'minimal@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		language: 'he',
		preferences: {},
		isActive: true,
		preferredCities: ['Haifa'],
		preferredCategories: ['Sales'],
		preferredEmployment: ['Full-time'],
		preferredLanguages: ['Hebrew'],
		preferredGender: 'Female',
		preferredDocumentTypes: ['Passport'],
		onlyDemanded: true,
		createdAt: '2024-01-03T00:00:00Z',
	},

	existingSubscriber: {
		id: 4,
		email: 'existing@example.com',
		firstName: 'Existing',
		lastName: 'User',
		language: 'ar',
		preferences: {},
		isActive: true,
		preferredCities: ['Tel Aviv'],
		preferredCategories: ['IT'],
		preferredEmployment: ['Full-time'],
		preferredLanguages: ['Arabic'],
		preferredGender: 'Male',
		preferredDocumentTypes: ['ID'],
		onlyDemanded: false,
		createdAt: '2024-01-04T00:00:00Z',
	},

	inactiveSubscriber: {
		id: 5,
		email: 'inactive@example.com',
		firstName: 'Inactive',
		lastName: 'User',
		language: 'ru',
		preferences: {},
		isActive: false,
		preferredCities: [],
		preferredCategories: [],
		preferredEmployment: [],
		preferredLanguages: [],
		preferredGender: null,
		preferredDocumentTypes: [],
		onlyDemanded: false,
		createdAt: '2024-01-05T00:00:00Z',
	},
};

// Mock subscription data
export const mockSubscriptionData = {
	validSubscriptionData: {
		email: 'newuser@example.com',
		firstName: 'New',
		lastName: 'User',
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

	subscriptionDataWithoutName: {
		email: 'anonymous@example.com',
		firstName: null,
		lastName: null,
		language: 'en',
		preferences: {},
		preferredCities: [],
		preferredCategories: [],
		preferredEmployment: [],
		preferredLanguages: [],
		preferredGender: null,
		preferredDocumentTypes: [],
		onlyDemanded: false,
	},

	subscriptionDataWithMinimalPreferences: {
		email: 'minimal@example.com',
		firstName: 'Minimal',
		lastName: 'User',
		language: 'he',
		preferences: {},
		preferredCities: ['Haifa'],
		preferredCategories: ['Sales'],
		preferredEmployment: ['Full-time'],
		preferredLanguages: ['Hebrew'],
		preferredGender: 'Female',
		preferredDocumentTypes: ['Passport'],
		onlyDemanded: true,
	},

	invalidSubscriptionData: {
		// Missing required email field
		firstName: 'Invalid',
		lastName: 'User',
		language: 'ru',
	},

	subscriptionDataWithInvalidEmail: {
		email: 'invalid-email',
		firstName: 'Invalid',
		lastName: 'Email',
		language: 'ru',
	},
};

// Mock verification data
export const mockVerificationData = {
	validVerificationCode: '123456',
	invalidVerificationCode: '000000',
	expiredVerificationCode: '999999',

	verificationRequest: {
		email: 'verify@example.com',
		code: '123456',
		subscriptionData: mockSubscriptionData.validSubscriptionData,
	},

	verificationRequestWithInvalidCode: {
		email: 'verify@example.com',
		code: '000000',
		subscriptionData: mockSubscriptionData.validSubscriptionData,
	},

	verificationRequestMissingFields: {
		email: 'verify@example.com',
		// Missing code field
		subscriptionData: mockSubscriptionData.validSubscriptionData,
	},
};

// Mock service responses
export const mockServiceResponses = {
	successSubscribeResponse: {
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
	},

	successUnsubscribeResponse: {
		success: true,
		message: 'Successfully unsubscribed from newsletter',
	},

	successGetSubscribersResponse: {
		success: true,
		subscribers: [
			mockSubscriberData.validSubscriber,
			mockSubscriberData.subscriberWithoutName,
			mockSubscriberData.subscriberWithMinimalData,
		],
		total: 3,
	},

	successCheckSubscriptionResponse: {
		success: true,
		isSubscribed: true,
		subscriber: mockSubscriberData.validSubscriber,
	},

	successCheckNotSubscribedResponse: {
		success: true,
		isSubscribed: false,
		subscriber: null,
	},

	successUpdatePreferencesResponse: {
		success: true,
		message: 'Newsletter preferences updated successfully',
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
	},

	successSendVerificationCodeResponse: {
		success: true,
		message: 'Verification code sent to your email',
		email: 'verify@example.com',
		subscriptionData: mockSubscriptionData.validSubscriptionData,
	},

	successVerifyCodeResponse: {
		success: true,
		message: 'Successfully subscribed to newsletter',
		subscriber: {
			id: 1,
			email: 'verify@example.com',
			firstName: 'New',
			lastName: 'User',
			preferredCities: ['Tel Aviv', 'Jerusalem'],
			preferredCategories: ['IT', 'Marketing'],
			preferredEmployment: ['Full-time', 'Part-time'],
			preferredLanguages: ['Hebrew', 'English'],
			preferredGender: 'Male',
			preferredDocumentTypes: ['Passport', 'ID'],
			onlyDemanded: false,
		},
	},

	errorEmailRequiredResponse: {
		success: false,
		message: 'Email is required',
	},

	errorInvalidEmailResponse: {
		success: false,
		message: 'Invalid email format',
	},

	errorAlreadySubscribedResponse: {
		success: false,
		message: 'This email is already subscribed to the newsletter',
	},

	errorSubscriberNotFoundResponse: {
		success: false,
		message: 'Subscriber not found',
	},

	errorVerificationCodeRequiredResponse: {
		success: false,
		message: 'Email and verification code are required',
	},

	errorInvalidVerificationCodeResponse: {
		success: false,
		message: 'Invalid verification code',
	},

	errorServerResponse: {
		success: false,
		message: 'Failed to subscribe to newsletter',
	},
};

// Mock errors
export const mockErrors = {
	emailRequiredError: new Error('Email is required'),
	invalidEmailError: new Error('Invalid email format'),
	alreadySubscribedError: new Error(
		'This email is already subscribed to the newsletter',
	),
	subscriberNotFoundError: new Error('Subscriber not found'),
	verificationCodeRequiredError: new Error(
		'Email and verification code are required',
	),
	invalidVerificationCodeError: new Error('Invalid verification code'),
	databaseError: new Error('Database connection failed'),
	emailSendingError: new Error('Failed to send email'),
	verificationError: new Error('Verification process failed'),
	serverError: new Error('Internal server error'),
	networkError: new Error('Network error'),
	timeoutError: new Error('Operation timeout'),
	permissionError: new Error('Permission denied'),
	unknownError: new Error('Unknown error occurred'),
	prismaError: new Error('Prisma operation failed'),
	snsError: new Error('SNS service error'),
	candidateNotificationError: new Error('Candidate notification failed'),
};

// Mock Prisma errors
export const mockPrismaErrors = {
	p2002Error: {
		code: 'P2002',
		message: 'Unique constraint failed',
	},

	p2025Error: {
		code: 'P2025',
		message: 'Record not found',
	},

	p2003Error: {
		code: 'P2003',
		message: 'Foreign key constraint failed',
	},

	p2014Error: {
		code: 'P2014',
		message: 'Required relation missing',
	},
};

// Mock error messages
export const mockErrorMessages = {
	emailRequired: 'Email is required',
	invalidEmailFormat: 'Invalid email format',
	alreadySubscribed: 'This email is already subscribed to the newsletter',
	subscriberNotFound: 'Subscriber not found',
	verificationCodeRequired: 'Email and verification code are required',
	invalidVerificationCode: 'Invalid verification code',
	failedToSubscribe: 'Failed to subscribe to newsletter',
	failedToUnsubscribe: 'Failed to unsubscribe from newsletter',
	failedToGetSubscribers: 'Failed to get newsletter subscribers',
	failedToCheckSubscription: 'Failed to check subscription status',
	failedToUpdatePreferences: 'Failed to update newsletter preferences',
	failedToSendVerificationCode: 'Failed to send verification code',
	failedToVerifyCode: 'Failed to verify code and complete subscription',
};

// Mock success messages
export const mockSuccessMessages = {
	successfullySubscribed: 'Successfully subscribed to newsletter',
	successfullyUnsubscribed: 'Successfully unsubscribed from newsletter',
	successfullyUpdatedPreferences: 'Newsletter preferences updated successfully',
	verificationCodeSent: 'Verification code sent to your email',
	successfullyVerified: 'Successfully subscribed to newsletter',
	operationCompleted: 'Operation completed successfully',
	responseSent: 'Response sent successfully',
	validationPassed: 'Validation passed successfully',
	serviceCalled: 'Service called successfully',
	emailSent: 'Email sent successfully',
	verificationCodeGenerated: 'Verification code generated successfully',
	verificationCodeStored: 'Verification code stored successfully',
	verificationCodeSent: 'Verification code sent successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	newSubscriber: '✅ New newsletter subscriber:',
	successfullyDeletedSubscriber: '✅ Successfully deleted subscriber:',
	updatedNewsletterPreferences: '✅ Updated newsletter preferences for:',
	generatedVerificationCode: '🔢 Generated verification code:',
	storingVerificationCode: '💾 Storing verification code...',
	verificationCodeStored: '✅ Verification code stored successfully',
	sendingVerificationCode: '📧 Sending verification code...',
	verificationCodeSent: '✅ Verification code sent successfully',
	verificationCodeSentTo: '✅ Verification code sent to:',
	newsletterSubscriptionVerified:
		'✅ Newsletter subscription verified and completed:',
	newsletterSubscriptionError: '❌ Newsletter subscription error:',
	newsletterUnsubscribeError: '❌ Newsletter unsubscribe error:',
	errorGettingSubscribers: '❌ Error getting newsletter subscribers:',
	errorCheckingSubscription: '❌ Error checking subscription status:',
	errorUpdatingPreferences: '❌ Error updating newsletter preferences:',
	errorSendingVerificationCode: '❌ Error sending verification code:',
	errorVerifyingCode: '❌ Error verifying newsletter code:',
	errorInVerificationProcess: '❌ Error in verification process:',
	failedToSendCandidatesEmail: '❌ Failed to send candidates email:',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		language: 'ru',
		verificationCode: '123456',
		errorMessage: 'Failed to subscribe to newsletter',
	},

	number: {
		id: 1,
		statusCode: 200,
		errorStatusCode: 500,
		successStatusCode: 201,
		conflictStatusCode: 409,
		notFoundStatusCode: 404,
		badRequestStatusCode: 400,
	},

	boolean: {
		isValid: true,
		isEmpty: false,
		hasError: false,
		success: true,
		isActive: true,
		isSubscribed: true,
		onlyDemanded: false,
		valid: true,
	},

	object: {
		subscriber: mockSubscriberData.validSubscriber,
		subscriptionData: mockSubscriptionData.validSubscriptionData,
		response: mockServiceResponses.successSubscribeResponse,
		error: mockErrors.databaseError,
		preferences: {},
	},

	array: {
		subscribers: [
			mockSubscriberData.validSubscriber,
			mockSubscriberData.subscriberWithoutName,
		],
		preferredCities: ['Tel Aviv', 'Jerusalem'],
		preferredCategories: ['IT', 'Marketing'],
		preferredEmployment: ['Full-time', 'Part-time'],
		preferredLanguages: ['Hebrew', 'English'],
		preferredDocumentTypes: ['Passport', 'ID'],
		errors: [mockErrors.emailRequiredError, mockErrors.databaseError],
	},

	null: {
		subscriber: null,
		firstName: null,
		lastName: null,
		preferredGender: null,
		error: null,
	},
};

// Mock validation logic
export const mockValidationLogic = {
	validateEmail: (email) => {
		if (!email || !email.trim()) {
			return { isValid: false, error: 'Email is required' };
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return { isValid: false, error: 'Invalid email format' };
		}
		return { isValid: true };
	},

	validateSubscriptionData: (data) => {
		const { email, firstName, lastName, language } = data;
		const emailValidation = mockValidationLogic.validateEmail(email);
		if (!emailValidation.isValid) {
			return emailValidation;
		}
		return { isValid: true };
	},

	validateVerificationData: (data) => {
		const { email, code } = data;
		if (!email || !code) {
			return {
				isValid: false,
				error: 'Email and verification code are required',
			};
		}
		return { isValid: true };
	},

	validatePreferencesData: (data) => {
		const {
			preferredCities,
			preferredCategories,
			preferredEmployment,
			preferredLanguages,
			preferredGender,
			preferredDocumentTypes,
			onlyDemanded,
		} = data;
		return { isValid: true };
	},

	validateEmailFormat: (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},

	validateEmailRequired: (email) => {
		return !!(email && email.trim());
	},

	validateVerificationCode: (code) => {
		return !!(code && code.length === 6 && /^\d+$/.test(code));
	},

	validateLanguage: (language) => {
		return ['ru', 'en', 'he', 'ar'].includes(language);
	},

	validateGender: (gender) => {
		return !gender || ['Male', 'Female', 'Other'].includes(gender);
	},

	validateEmployment: (employment) => {
		return (
			Array.isArray(employment) &&
			employment.every((emp) =>
				['Full-time', 'Part-time', 'Contract', 'Freelance'].includes(emp),
			)
		);
	},
};

// Mock email processing logic
export const mockEmailProcessingLogic = {
	processEmail: (email) => {
		return email.trim().toLowerCase();
	},

	validateEmailFormat: (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},

	formatEmailForStorage: (email) => {
		return email.trim().toLowerCase();
	},

	handleEmailError: (error) => {
		console.error('❌ Email processing error:', error);
		return {
			success: false,
			error: error.message,
		};
	},

	handleEmailSuccess: (email) => {
		return {
			success: true,
			email: email,
		};
	},
};

// Mock verification processing logic
export const mockVerificationProcessingLogic = {
	generateVerificationCode: () => {
		return Math.floor(100000 + Math.random() * 900000).toString();
	},

	processVerificationCode: (code) => {
		return code.toString();
	},

	validateVerificationCode: (code) => {
		return !!(code && code.length === 6 && /^\d+$/.test(code));
	},

	handleVerificationError: (error) => {
		console.error('❌ Verification process error:', error);
		return {
			success: false,
			error: error.message,
		};
	},

	handleVerificationSuccess: (code) => {
		return {
			success: true,
			code: code,
		};
	},
};

// Mock subscription processing logic
export const mockSubscriptionProcessingLogic = {
	processSubscriptionData: (data) => {
		const {
			email,
			firstName,
			lastName,
			language,
			preferences,
			preferredCities,
			preferredCategories,
			preferredEmployment,
			preferredLanguages,
			preferredGender,
			preferredDocumentTypes,
			onlyDemanded,
		} = data;
		return {
			email: email.trim().toLowerCase(),
			firstName: firstName?.trim() || null,
			lastName: lastName?.trim() || null,
			language: language || 'ru',
			preferences: preferences || {},
			preferredCities: preferredCities || [],
			preferredCategories: preferredCategories || [],
			preferredEmployment: preferredEmployment || [],
			preferredLanguages: preferredLanguages || [],
			preferredGender: preferredGender || null,
			preferredDocumentTypes: preferredDocumentTypes || [],
			onlyDemanded: onlyDemanded || false,
		};
	},

	processSubscriptionResponse: (subscriber) => {
		return {
			id: subscriber.id,
			email: subscriber.email,
			firstName: subscriber.firstName,
			lastName: subscriber.lastName,
			preferredCities: subscriber.preferredCities,
			preferredCategories: subscriber.preferredCategories,
			preferredEmployment: subscriber.preferredEmployment,
			preferredLanguages: subscriber.preferredLanguages,
			preferredGender: subscriber.preferredGender,
			preferredDocumentTypes: subscriber.preferredDocumentTypes,
			onlyDemanded: subscriber.onlyDemanded,
		};
	},

	handleSubscriptionError: (error) => {
		console.error('❌ Subscription process error:', error);
		return {
			success: false,
			error: error.message,
		};
	},

	handleSubscriptionSuccess: (subscriber) => {
		return {
			success: true,
			subscriber: subscriber,
		};
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processSubscribeRequest: async (req, res) => {
		try {
			const {
				email,
				firstName,
				lastName,
				language = 'ru',
				preferences = {},
				preferredCities = [],
				preferredCategories = [],
				preferredEmployment = [],
				preferredLanguages = [],
				preferredGender = null,
				preferredDocumentTypes = [],
				onlyDemanded = false,
			} = req.body;

			// Validate email
			if (!email || !email.trim()) {
				return res.status(400).json({
					success: false,
					message: 'Email is required',
				});
			}

			// Basic email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid email format',
				});
			}

			// Check if already subscribed
			const existingSubscriber =
				await mockPrisma.newsletterSubscriber.findUnique({
					where: { email: email.trim().toLowerCase() },
				});

			if (existingSubscriber) {
				return res.status(409).json({
					success: false,
					message: 'This email is already subscribed to the newsletter',
				});
			}

			// Create new subscriber
			const subscriber = await mockPrisma.newsletterSubscriber.create({
				data: {
					email: email.trim().toLowerCase(),
					firstName: firstName?.trim() || null,
					lastName: lastName?.trim() || null,
					language,
					preferences,
					isActive: true,
					preferredCities,
					preferredCategories,
					preferredEmployment,
					preferredLanguages,
					preferredGender,
					preferredDocumentTypes,
					onlyDemanded,
				},
			});

			console.log('✅ New newsletter subscriber:', subscriber.email);

			// Send candidates to new subscriber
			try {
				await mockNewsletterServices.sendInitialCandidatesToNewSubscriber(
					subscriber,
				);
			} catch (emailError) {
				console.error('❌ Failed to send candidates email:', emailError);
			}

			res.status(201).json({
				success: true,
				message: 'Successfully subscribed to newsletter',
				subscriber: {
					id: subscriber.id,
					email: subscriber.email,
					firstName: subscriber.firstName,
					lastName: subscriber.lastName,
					preferredCities: subscriber.preferredCities,
					preferredCategories: subscriber.preferredCategories,
					preferredEmployment: subscriber.preferredEmployment,
					preferredLanguages: subscriber.preferredLanguages,
					preferredGender: subscriber.preferredGender,
					preferredDocumentTypes: subscriber.preferredDocumentTypes,
					onlyDemanded: subscriber.onlyDemanded,
				},
			});
		} catch (error) {
			console.error('❌ Newsletter subscription error:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to subscribe to newsletter',
			});
		}
	},

	processUnsubscribeRequest: async (req, res) => {
		try {
			const { email } = req.body;

			if (!email) {
				return res.status(400).json({
					success: false,
					message: 'Email is required',
				});
			}

			const subscriber = await mockPrisma.newsletterSubscriber.findUnique({
				where: { email: email.trim().toLowerCase() },
			});

			if (!subscriber) {
				return res.status(404).json({
					success: false,
					message: 'Subscriber not found',
				});
			}

			await mockPrisma.newsletterSubscriber.delete({
				where: { id: subscriber.id },
			});

			console.log('✅ Successfully deleted subscriber:', subscriber.email);

			res.json({
				success: true,
				message: 'Successfully unsubscribed from newsletter',
			});
		} catch (error) {
			console.error('❌ Newsletter unsubscribe error:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to unsubscribe from newsletter',
			});
		}
	},

	processGetSubscribersRequest: async (req, res) => {
		try {
			const subscribers = await mockPrisma.newsletterSubscriber.findMany({
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

			res.json({
				success: true,
				subscribers,
				total: subscribers.length,
			});
		} catch (error) {
			console.error('❌ Error getting newsletter subscribers:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to get newsletter subscribers',
			});
		}
	},

	processCheckSubscriptionRequest: async (req, res) => {
		try {
			const { email } = req.query;

			if (!email) {
				return res.status(400).json({
					success: false,
					message: 'Email is required',
				});
			}

			const subscriber = await mockPrisma.newsletterSubscriber.findUnique({
				where: { email: email.trim().toLowerCase() },
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

			if (subscriber) {
				res.json({
					success: true,
					isSubscribed: true,
					subscriber,
				});
			} else {
				res.json({
					success: true,
					isSubscribed: false,
					subscriber: null,
				});
			}
		} catch (error) {
			console.error('❌ Error checking subscription status:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to check subscription status',
			});
		}
	},

	processUpdatePreferencesRequest: async (req, res) => {
		try {
			const { email } = req.params;
			const {
				preferredCities = [],
				preferredCategories = [],
				preferredEmployment = [],
				preferredLanguages = [],
				preferredGender = null,
				preferredDocumentTypes = [],
				onlyDemanded = false,
			} = req.body;

			if (!email) {
				return res.status(400).json({
					success: false,
					message: 'Email is required',
				});
			}

			const subscriber = await mockPrisma.newsletterSubscriber.findUnique({
				where: { email: email.trim().toLowerCase() },
			});

			if (!subscriber) {
				return res.status(404).json({
					success: false,
					message: 'Subscriber not found',
				});
			}

			const updatedSubscriber = await mockPrisma.newsletterSubscriber.update({
				where: { id: subscriber.id },
				data: {
					preferredCities,
					preferredCategories,
					preferredEmployment,
					preferredLanguages,
					preferredGender,
					preferredDocumentTypes,
					onlyDemanded,
				},
			});

			console.log(
				'✅ Updated newsletter preferences for:',
				updatedSubscriber.email,
			);

			res.json({
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
		} catch (error) {
			console.error('❌ Error updating newsletter preferences:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to update newsletter preferences',
			});
		}
	},

	processSendVerificationCodeRequest: async (req, res) => {
		try {
			const {
				email,
				firstName,
				lastName,
				language = 'ru',
				preferences = {},
				preferredCities = [],
				preferredCategories = [],
				preferredEmployment = [],
				preferredLanguages = [],
				preferredGender = null,
				preferredDocumentTypes = [],
				onlyDemanded = false,
			} = req.body;

			// Validate email
			if (!email || !email.trim()) {
				return res.status(400).json({
					success: false,
					message: 'Email is required',
				});
			}

			// Basic email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid email format',
				});
			}

			// Check if already subscribed
			const existingSubscriber =
				await mockPrisma.newsletterSubscriber.findFirst({
					where: {
						email: email.trim().toLowerCase(),
						isActive: true,
					},
				});

			if (existingSubscriber) {
				return res.status(409).json({
					success: false,
					message: 'This email is already subscribed to the newsletter',
				});
			}

			// Generate verification code
			const verificationCode = Math.floor(
				100000 + Math.random() * 900000,
			).toString();
			console.log('🔢 Generated verification code:', verificationCode);

			try {
				// Store verification code
				console.log('💾 Storing verification code...');
				await mockNewsletterServices.storeVerificationCode(
					email.trim().toLowerCase(),
					verificationCode,
				);
				console.log('✅ Verification code stored successfully');

				// Send verification code via SNS
				console.log('📧 Sending verification code...');
				await mockNewsletterServices.sendVerificationCode(
					email.trim().toLowerCase(),
					verificationCode,
				);
				console.log('✅ Verification code sent successfully');
			} catch (error) {
				console.error('❌ Error in verification process:', error);
				throw error;
			}

			console.log('✅ Verification code sent to:', email);

			res.json({
				success: true,
				message: 'Verification code sent to your email',
				email: email.trim().toLowerCase(),
				subscriptionData: {
					email: email.trim().toLowerCase(),
					firstName: firstName?.trim() || null,
					lastName: lastName?.trim() || null,
					language,
					preferences,
					preferredCities,
					preferredCategories,
					preferredEmployment,
					preferredLanguages,
					preferredGender,
					preferredDocumentTypes,
					onlyDemanded,
				},
			});
		} catch (error) {
			console.error('❌ Error sending verification code:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to send verification code',
			});
		}
	},

	processVerifyCodeRequest: async (req, res) => {
		try {
			const { email, code, subscriptionData } = req.body;

			if (!email || !code) {
				return res.status(400).json({
					success: false,
					message: 'Email and verification code are required',
				});
			}

			// Verify the code
			const verificationResult = await mockNewsletterServices.verifyCode(
				email.trim().toLowerCase(),
				code,
			);

			if (!verificationResult.valid) {
				return res.status(400).json({
					success: false,
					message: verificationResult.message,
				});
			}

			// Create subscriber
			const subscriber = await mockPrisma.newsletterSubscriber.create({
				data: {
					email: email.trim().toLowerCase(),
					firstName: subscriptionData?.firstName || null,
					lastName: subscriptionData?.lastName || null,
					language: subscriptionData?.language || 'ru',
					preferences: subscriptionData?.preferences || {},
					isActive: true,
					preferredCities: subscriptionData?.preferredCities || [],
					preferredCategories: subscriptionData?.preferredCategories || [],
					preferredEmployment: subscriptionData?.preferredEmployment || [],
					preferredLanguages: subscriptionData?.preferredLanguages || [],
					preferredGender: subscriptionData?.preferredGender || null,
					preferredDocumentTypes:
						subscriptionData?.preferredDocumentTypes || [],
					onlyDemanded: subscriptionData?.onlyDemanded || false,
				},
			});

			console.log(
				'✅ Newsletter subscription verified and completed:',
				subscriber.email,
			);

			// Send candidates to new subscriber
			try {
				await mockNewsletterServices.sendInitialCandidatesToNewSubscriber(
					subscriber,
				);
			} catch (emailError) {
				console.error('❌ Failed to send candidates email:', emailError);
			}

			res.json({
				success: true,
				message: 'Successfully subscribed to newsletter',
				subscriber: {
					id: subscriber.id,
					email: subscriber.email,
					firstName: subscriber.firstName,
					lastName: subscriber.lastName,
					preferredCities: subscriber.preferredCities,
					preferredCategories: subscriber.preferredCategories,
					preferredEmployment: subscriber.preferredEmployment,
					preferredLanguages: subscriber.preferredLanguages,
					preferredGender: subscriber.preferredGender,
					preferredDocumentTypes: subscriber.preferredDocumentTypes,
					onlyDemanded: subscriber.onlyDemanded,
				},
			});
		} catch (error) {
			console.error('❌ Error verifying newsletter code:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to verify code and complete subscription',
			});
		}
	},

	handleControllerError: (error, res, operation = 'operation') => {
		console.error(`❌ Error ${operation}:`, error);
		return res.status(500).json({
			success: false,
			message: `Failed to ${operation}`,
		});
	},

	handleControllerSuccess: (data, res, statusCode = 200) => {
		return res.status(statusCode).json(data);
	},

	validateControllerInput: (req) => {
		return !!(req && req.body && Object.keys(req.body).length > 0);
	},
};

// Mock service integration logic
export const mockServiceIntegrationLogic = {
	callSendInitialCandidatesService: async (subscriber) => {
		return await mockNewsletterServices.sendInitialCandidatesToNewSubscriber(
			subscriber,
		);
	},

	callSendVerificationCodeService: async (email, code) => {
		return await mockNewsletterServices.sendVerificationCode(email, code);
	},

	callStoreVerificationCodeService: async (email, code) => {
		return await mockNewsletterServices.storeVerificationCode(email, code);
	},

	callVerifyCodeService: async (email, code) => {
		return await mockNewsletterServices.verifyCode(email, code);
	},

	handleServiceResponse: (result) => {
		if (result.error) {
			return {
				success: false,
				error: result.error,
			};
		}
		return {
			success: true,
			data: result,
		};
	},

	handleServiceError: (error) => {
		return {
			success: false,
			error: error.message,
		};
	},

	validateServiceResult: (result) => {
		return result !== null && result !== undefined;
	},

	processServiceResult: (result) => {
		return result;
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (body = {}, params = {}, query = {}) => {
		return {
			body: {
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
				...body,
			},
			params: {
				email: 'user@example.com',
				...params,
			},
			query: {
				email: 'user@example.com',
				...query,
			},
		};
	},

	buildResponse: () => {
		return {
			json: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	},

	handleSuccessResponse: (res, data, statusCode = 200) => {
		res.status(statusCode).json(data);
	},

	handleErrorResponse: (res, error, statusCode = 500) => {
		res.status(statusCode).json({ error: error.message });
	},

	handleValidationError: (res, error, statusCode = 400) => {
		res.status(statusCode).json({ error });
	},

	handleNotFoundError: (res, error, statusCode = 404) => {
		res.status(statusCode).json({ error });
	},

	handleConflictError: (res, error, statusCode = 409) => {
		res.status(statusCode).json({ error });
	},

	validateRequest: (req) => {
		return !!(req && (req.body || req.params || req.query));
	},

	extractSubscriptionData: (req) => {
		return req.body;
	},

	extractQueryParameters: (req) => {
		return req.query;
	},

	extractParams: (req) => {
		return req.params;
	},
};

// Reset mocks before each test
export const resetNewsletterControllerMocks = () => {
	mockPrisma.newsletterSubscriber.findUnique.mockClear();
	mockPrisma.newsletterSubscriber.findFirst.mockClear();
	mockPrisma.newsletterSubscriber.findMany.mockClear();
	mockPrisma.newsletterSubscriber.create.mockClear();
	mockPrisma.newsletterSubscriber.update.mockClear();
	mockPrisma.newsletterSubscriber.delete.mockClear();
	mockNewsletterServices.sendInitialCandidatesToNewSubscriber.mockClear();
	mockNewsletterServices.sendVerificationCode.mockClear();
	mockNewsletterServices.storeVerificationCode.mockClear();
	mockNewsletterServices.verifyCode.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};
