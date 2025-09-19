import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
	newsletterSubscriber: {
		create: vi.fn(),
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	newsletterVerification: {
		upsert: vi.fn(),
		findUnique: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		deleteMany: vi.fn(),
	},
	seeker: {
		findMany: vi.fn(),
	},
};

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock AWS SDK to prevent network calls
vi.mock('aws-sdk', () => ({
	default: {
		SNS: vi.fn(() => ({
			publish: vi.fn().mockReturnValue({
				promise: vi.fn().mockResolvedValue({ MessageId: 'test-message-id' }),
			}),
		})),
		config: {
			update: vi.fn(),
		},
	},
	SNS: vi.fn(() => ({
		publish: vi.fn().mockReturnValue({
			promise: vi.fn().mockResolvedValue({ MessageId: 'test-message-id' }),
		}),
	})),
	config: {
		update: vi.fn(),
	},
}));

// Mock services
export const mockSendInitialCandidatesToNewSubscriber = vi.fn();
export const mockSendVerificationCode = vi.fn();
export const mockStoreVerificationCode = vi.fn();
export const mockVerifyCode = vi.fn();
export const mockSendCandidatesToSubscribers = vi.fn();
export const mockSendFilteredCandidatesToSubscribers = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/candidateNotificationService.js', () => ({
	sendInitialCandidatesToNewSubscriber: mockSendInitialCandidatesToNewSubscriber,
}));

vi.mock('../../apps/api/services/snsService.js', () => ({
	sendVerificationCode: mockSendVerificationCode,
	storeVerificationCode: mockStoreVerificationCode,
	verifyCode: mockVerifyCode,
}));

vi.mock('../../apps/api/services/newsletterService.js', () => ({
	sendCandidatesToSubscribers: mockSendCandidatesToSubscribers,
	sendFilteredCandidatesToSubscribers: mockSendFilteredCandidatesToSubscribers,
}));

// Mock data
export const mockSubscriberData = {
	id: 'sub_123456789',
	email: 'test@example.com',
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
	createdAt: '2024-01-01T00:00:00.000Z',
	updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockSubscribersList = [
	{
		id: 'sub_123456789',
		email: 'test@example.com',
		firstName: 'John',
		lastName: 'Doe',
		language: 'ru',
		createdAt: '2024-01-01T00:00:00.000Z',
	},
	{
		id: 'sub_123456790',
		email: 'test2@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		language: 'en',
		createdAt: '2024-01-02T00:00:00.000Z',
	},
];

export const mockVerificationData = {
	email: 'test@example.com',
	code: '123456',
	expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
	attempts: 0,
};

export const mockCandidatesList = [
	{
		id: 1,
		name: 'John Candidate',
		city: 'Tel Aviv',
		employment: 'Full-time',
		category: 'IT',
		languages: ['Hebrew', 'English'],
		gender: 'Male',
		documents: 'Passport',
		isActive: true,
		isDemanded: true,
		description: 'Experienced software developer',
		createdAt: '2024-01-01T00:00:00.000Z',
	},
	{
		id: 2,
		name: 'Jane Candidate',
		city: 'Jerusalem',
		employment: 'Part-time',
		category: 'Marketing',
		languages: ['Hebrew'],
		gender: 'Female',
		documents: 'ID',
		isActive: true,
		isDemanded: false,
		description: 'Marketing specialist',
		createdAt: '2024-01-02T00:00:00.000Z',
	},
];

export const mockServiceResponses = {
	subscribeSuccess: {
		success: true,
		message: 'Successfully subscribed to newsletter',
		subscriber: {
			id: mockSubscriberData.id,
			email: mockSubscriberData.email,
			firstName: mockSubscriberData.firstName,
			lastName: mockSubscriberData.lastName,
			preferredCities: mockSubscriberData.preferredCities,
			preferredCategories: mockSubscriberData.preferredCategories,
			preferredEmployment: mockSubscriberData.preferredEmployment,
			preferredLanguages: mockSubscriberData.preferredLanguages,
			preferredGender: mockSubscriberData.preferredGender,
			preferredDocumentTypes: mockSubscriberData.preferredDocumentTypes,
			onlyDemanded: mockSubscriberData.onlyDemanded,
		},
	},
	subscribeAlreadyExists: {
		success: false,
		message: 'This email is already subscribed to the newsletter',
	},
	unsubscribeSuccess: {
		success: true,
		message: 'Successfully unsubscribed from newsletter',
	},
	unsubscribeNotFound: {
		success: false,
		message: 'Subscriber not found',
	},
	getSubscribersSuccess: {
		success: true,
		subscribers: mockSubscribersList,
		total: mockSubscribersList.length,
	},
	checkSubscriptionSubscribed: {
		success: true,
		isSubscribed: true,
		subscriber: mockSubscriberData,
	},
	checkSubscriptionNotSubscribed: {
		success: true,
		isSubscribed: false,
		subscriber: null,
	},
	updatePreferencesSuccess: {
		success: true,
		message: 'Newsletter preferences updated successfully',
		subscriber: mockSubscriberData,
	},
	sendVerificationSuccess: {
		success: true,
		message: 'Verification code sent to your email',
		email: 'test@example.com',
		subscriptionData: {
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe',
			language: 'ru',
			preferences: {},
			preferredCities: ['Tel Aviv'],
			preferredCategories: ['IT'],
			preferredEmployment: [],
			preferredLanguages: [],
			preferredGender: null,
			preferredDocumentTypes: [],
			onlyDemanded: false,
		},
	},
	verifyCodeSuccess: {
		valid: true,
		message: 'Verification successful',
	},
	verifyCodeInvalid: {
		valid: false,
		message: 'Invalid verification code',
	},
	verifyCodeExpired: {
		valid: false,
		message: 'Verification code has expired',
	},
	verifyCodeTooManyAttempts: {
		valid: false,
		message: 'Too many attempts. Please request a new code.',
	},
	sendCandidatesSuccess: {
		success: true,
		message: 'Candidates sent to subscribers successfully',
	},
	sendFilteredCandidatesSuccess: {
		success: true,
		message: 'Filtered candidates sent to subscribers successfully',
	},
};

export const mockErrors = {
	validationError: 'Validation failed',
	notFoundError: 'Subscriber not found',
	alreadyExistsError: 'This email is already subscribed to the newsletter',
	serverError: 'Internal server error',
	emailError: 'Email sending failed',
	databaseError: 'Database connection failed',
	verificationError: 'Verification failed',
};

export const mockEmailResponses = {
	success: {
		success: true,
		messageId: 'email_123456789',
	},
	error: new Error('SMTP connection failed'),
};

export const mockVerificationResponses = {
	success: {
		success: true,
		messageId: 'verification_123456789',
	},
	error: new Error('Verification service failed'),
};

// Reset mocks function
export const resetNewsletterMocks = () => {
	mockPrismaInstance.newsletterSubscriber.create.mockClear();
	mockPrismaInstance.newsletterSubscriber.findMany.mockClear();
	mockPrismaInstance.newsletterSubscriber.findUnique.mockClear();
	mockPrismaInstance.newsletterSubscriber.findFirst.mockClear();
	mockPrismaInstance.newsletterSubscriber.update.mockClear();
	mockPrismaInstance.newsletterSubscriber.delete.mockClear();
	mockPrismaInstance.newsletterVerification.upsert.mockClear();
	mockPrismaInstance.newsletterVerification.findUnique.mockClear();
	mockPrismaInstance.newsletterVerification.update.mockClear();
	mockPrismaInstance.newsletterVerification.delete.mockClear();
	mockPrismaInstance.newsletterVerification.deleteMany.mockClear();
	mockPrismaInstance.seeker.findMany.mockClear();
	mockSendInitialCandidatesToNewSubscriber.mockClear();
	mockSendVerificationCode.mockClear();
	mockStoreVerificationCode.mockClear();
	mockVerifyCode.mockClear();
	mockSendCandidatesToSubscribers.mockClear();
	mockSendFilteredCandidatesToSubscribers.mockClear();
	vi.clearAllMocks();
};
