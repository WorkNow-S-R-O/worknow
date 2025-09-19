import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
	job: {
		findFirst: vi.fn(),
		update: vi.fn(),
	},
	user: {
		findUnique: vi.fn(),
	},
};

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock AWS SDK
export const mockS3Instance = {
	upload: vi.fn(),
	deleteObject: vi.fn(),
};

export const mockRekognitionInstance = {
	detectModerationLabels: vi.fn(),
	detectLabels: vi.fn(),
};

vi.mock('aws-sdk', () => ({
	default: {
		S3: vi.fn(() => mockS3Instance),
		Rekognition: vi.fn(() => mockRekognitionInstance),
	},
}));

// Mock multer
export const mockMulterUpload = {
	single: vi.fn(() => (req, res, next) => {
		// Simulate multer middleware - add file to request
		// Default behavior - add a normal file
		req.file = {
			buffer: Buffer.from('fake-image-data'),
			originalname: 'test-image.jpg',
			mimetype: 'image/jpeg',
			size: 1024,
		};
		next();
	}),
};

vi.mock('multer', () => ({
	default: vi.fn(() => mockMulterUpload),
	memoryStorage: vi.fn(() => ({})),
}));

// Mock the entire s3Upload utility module
export const mockUploadToS3 = vi.fn();
export const mockUploadToS3WithModeration = vi.fn();
export const mockDeleteFromS3 = vi.fn();
export const mockValidateS3Config = vi.fn(() => ({
	isValid: true,
	missingVars: [],
	message: 'S3 configuration is valid',
}));

vi.mock('../../apps/api/utils/s3Upload.js', () => ({
	upload: mockMulterUpload,
	uploadToS3: mockUploadToS3,
	uploadToS3WithModeration: mockUploadToS3WithModeration,
	deleteFromS3: mockDeleteFromS3,
	validateS3Config: mockValidateS3Config,
}));

// Mock services
export const mockModerateImage = vi.fn();
export const mockValidateRekognitionConfig = vi.fn();
export const mockCreateJobService = vi.fn();
export const mockSendNewJobNotificationToTelegram = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/imageModerationService.js', () => ({
	moderateImage: mockModerateImage,
	validateRekognitionConfig: mockValidateRekognitionConfig,
}));

vi.mock('../../apps/api/services/jobCreateService.js', () => ({
	createJobService: mockCreateJobService,
}));

vi.mock('../../apps/api/utils/telegram.js', () => ({
	sendNewJobNotificationToTelegram: mockSendNewJobNotificationToTelegram,
}));

// Mock authentication middleware
export const mockRequireAuth = vi.fn((req, res, next) => {
	const authHeader = req.headers.authorization;
	
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No authorization token provided' });
	}
	
	const token = authHeader.substring(7);
	
	if (token === 'valid-token') {
		req.user = {
			clerkUserId: 'clerk_123456789',
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe',
		};
		next();
	} else if (token === 'invalid-token') {
		return res.status(401).json({ error: 'Invalid token' });
	} else {
		return res.status(401).json({ error: 'Token verification failed' });
	}
});

vi.mock('../../apps/api/middlewares/auth.js', () => ({
	requireAuth: mockRequireAuth,
}));

// Mock data
export const mockUserData = {
	id: 'user_123456789',
	clerkUserId: 'clerk_123456789',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe',
	isPremium: false,
	premiumDeluxe: false,
	jobs: [],
};

export const mockPremiumUserData = {
	...mockUserData,
	isPremium: true,
};

export const mockJobData = {
	id: 1,
	title: 'Software Developer',
	salary: '50000',
	phone: '+1234567890',
	description: 'Great opportunity',
	imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
	shuttle: true,
	meals: false,
	cityId: 1,
	categoryId: 1,
	userId: 'user_123456789',
	city: { id: 1, name: 'Tel Aviv' },
	category: { id: 1, name: 'IT' },
	user: mockUserData,
	createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockFileData = {
	fieldname: 'image',
	originalname: 'test-image.jpg',
	encoding: '7bit',
	mimetype: 'image/jpeg',
	size: 1024, // 1KB to match mock
	buffer: Buffer.from('fake-image-data'),
};

export const mockS3UploadResult = {
	Location: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
	Bucket: 'test-bucket',
	Key: 'jobs/uuid.jpg',
	ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
};

export const mockModerationResult = {
	isApproved: true,
	confidence: 0,
	detectedIssues: {
		moderationLabels: [],
		potentiallyInappropriateLabels: [],
	},
	analysis: {
		moderationLabels: [],
		detectedLabels: ['Person', 'Building'],
		moderationConfidence: 0,
	},
};

export const mockRejectedModerationResult = {
	isApproved: false,
	confidence: 98,
	detectedIssues: {
		moderationLabels: [
			{
				Name: 'Explicit Nudity',
				Confidence: 98,
			},
		],
		potentiallyInappropriateLabels: [],
	},
	analysis: {
		moderationLabels: [
			{
				Name: 'Explicit Nudity',
				Confidence: 98,
			},
		],
		detectedLabels: ['Person'],
		moderationConfidence: 98,
	},
};

export const mockS3ConfigStatus = {
	isValid: true,
	missingVars: [],
	message: 'S3 configuration is valid',
};

export const mockInvalidS3ConfigStatus = {
	isValid: false,
	missingVars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
	message: 'Missing S3 environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY',
};

export const mockRekognitionConfigStatus = {
	isValid: true,
	missingVars: [],
	message: 'Rekognition configuration is valid',
};

export const mockServiceResponses = {
	testConfigSuccess: {
		success: true,
		config: mockS3ConfigStatus,
		bucket: 'test-bucket',
		region: 'us-east-1',
		hasAccessKey: true,
		hasSecretKey: true,
	},
	testUploadSuccess: {
		success: true,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
		filename: 'test-image.jpg',
		size: 1024,
	},
	testModerationSuccess: {
		success: true,
		moderationResult: mockModerationResult,
		filename: 'test-image.jpg',
		size: 1024,
	},
	jobImageUploadSuccess: {
		success: true,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
		filename: 'test-image.jpg',
		size: 1024,
		moderationResult: mockModerationResult,
	},
	jobWithImageSuccess: {
		success: true,
		job: mockJobData,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
	},
	deleteImageSuccess: {
		success: true,
		message: 'Image deleted successfully',
	},
	updateJobImageSuccess: {
		success: true,
		job: mockJobData,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/uuid.jpg',
	},
};

export const mockErrors = {
	missingFile: 'No image file provided',
	fileTooLarge: 'File too large. Maximum size is 5MB.',
	invalidFileType: 'Only image files are allowed!',
	missingUrl: 'Image URL is required',
	deleteFailed: 'Image not found or could not be deleted',
	jobNotFound: 'Job not found or access denied',
	missingRequiredFields: 'Missing required fields',
	contentRejected: 'Image content violates community guidelines',
	uploadFailed: 'Failed to upload image to S3',
	moderationFailed: 'Failed to moderate image',
	createJobFailed: 'Failed to create job',
	updateJobImageFailed: 'Failed to update job image',
	deleteImageFailed: 'Failed to delete image',
};

export const mockMulterErrors = {
	LIMIT_FILE_SIZE: {
		code: 'LIMIT_FILE_SIZE',
		message: 'File too large',
	},
	INVALID_FILE_TYPE: {
		message: 'Only image files are allowed!',
	},
};

// Reset mocks function
export const resetS3UploadMocks = () => {
	mockPrismaInstance.job.findFirst.mockClear();
	mockPrismaInstance.job.update.mockClear();
	mockPrismaInstance.user.findUnique.mockClear();
	mockS3Instance.upload.mockClear();
	mockS3Instance.deleteObject.mockClear();
	mockRekognitionInstance.detectModerationLabels.mockClear();
	mockRekognitionInstance.detectLabels.mockClear();
	mockModerateImage.mockClear();
	mockValidateRekognitionConfig.mockClear();
	mockCreateJobService.mockClear();
	mockSendNewJobNotificationToTelegram.mockClear();
	mockRequireAuth.mockClear();
	mockUploadToS3.mockClear();
	mockUploadToS3WithModeration.mockClear();
	mockDeleteFromS3.mockClear();
	mockValidateS3Config.mockClear();
	
	// Reset multer mock to default behavior
	mockMulterUpload.single.mockImplementation(() => (req, res, next) => {
		req.file = {
			buffer: Buffer.from('fake-image-data'),
			originalname: 'test-image.jpg',
			mimetype: 'image/jpeg',
			size: 1024,
		};
		next();
	});
	
	vi.clearAllMocks();
};
