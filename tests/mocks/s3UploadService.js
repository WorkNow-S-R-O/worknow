import { vi } from 'vitest';

// Mock S3 utilities
export const mockS3Utils = {
	uploadToS3WithModeration: vi.fn(),
	deleteFromS3: vi.fn(),
	validateS3Config: vi.fn(),
};

// Mock Prisma client
export const mockPrisma = {
	user: {
		findUnique: vi.fn(),
	},
	job: {
		count: vi.fn(),
		create: vi.fn(),
		findFirst: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
};

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
export const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Mock file data
export const mockFileData = {
	validImageFile: {
		fieldname: 'image',
		originalname: 'test-image.jpg',
		encoding: '7bit',
		mimetype: 'image/jpeg',
		size: 1024000, // 1MB
		buffer: Buffer.from('fake-image-data'),
	},
	
	largeImageFile: {
		fieldname: 'image',
		originalname: 'large-image.jpg',
		encoding: '7bit',
		mimetype: 'image/jpeg',
		size: 6 * 1024 * 1024, // 6MB
		buffer: Buffer.from('fake-large-image-data'),
	},
	
	invalidFileType: {
		fieldname: 'image',
		originalname: 'test-document.pdf',
		encoding: '7bit',
		mimetype: 'application/pdf',
		size: 1024000,
		buffer: Buffer.from('fake-pdf-data'),
	},
	
	invalidFileExtension: {
		fieldname: 'image',
		originalname: 'test-image.bmp',
		encoding: '7bit',
		mimetype: 'image/bmp',
		size: 1024000,
		buffer: Buffer.from('fake-bmp-data'),
	},
	
	emptyFile: {
		fieldname: 'image',
		originalname: 'empty-image.jpg',
		encoding: '7bit',
		mimetype: 'image/jpeg',
		size: 0,
		buffer: Buffer.from(''),
	},
	
	webpFile: {
		fieldname: 'image',
		originalname: 'test-image.webp',
		encoding: '7bit',
		mimetype: 'image/webp',
		size: 1024000,
		buffer: Buffer.from('fake-webp-data'),
	},
	
	pngFile: {
		fieldname: 'image',
		originalname: 'test-image.png',
		encoding: '7bit',
		mimetype: 'image/png',
		size: 1024000,
		buffer: Buffer.from('fake-png-data'),
	},
	
	gifFile: {
		fieldname: 'image',
		originalname: 'test-image.gif',
		encoding: '7bit',
		mimetype: 'image/gif',
		size: 1024000,
		buffer: Buffer.from('fake-gif-data'),
	},
};

// Mock user data
export const mockUserData = {
	freeUser: {
		id: 'user123',
		email: 'free@example.com',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
		premiumDeluxe: false,
	},
	
	premiumUser: {
		id: 'premium456',
		email: 'premium@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		isPremium: true,
		premiumDeluxe: false,
	},
	
	premiumDeluxeUser: {
		id: 'deluxe789',
		email: 'deluxe@example.com',
		firstName: 'Bob',
		lastName: 'Johnson',
		isPremium: false,
		premiumDeluxe: true,
	},
	
	nonExistentUser: null,
};

// Mock job data
export const mockJobData = {
	validJobData: {
		title: 'Software Developer',
		salary: '120000',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications.',
		cityId: '1',
		categoryId: '2',
		shuttle: 'true',
		meals: 'false',
	},
	
	jobDataWithStringBooleans: {
		title: 'Marketing Manager',
		salary: '80000',
		phone: '098-765-4321',
		description: 'Manage marketing campaigns.',
		cityId: '3',
		categoryId: '4',
		shuttle: 'false',
		meals: 'true',
	},
	
	jobDataWithMissingFields: {
		title: 'Incomplete Job',
		salary: '50000',
		// phone, description, cityId, categoryId are missing
	},
	
	jobDataWithNumericIds: {
		title: 'Designer',
		salary: '75000',
		phone: '111-222-3333',
		description: 'Create visual concepts.',
		cityId: 5,
		categoryId: 6,
		shuttle: 'true',
		meals: 'true',
	},
};

// Mock job objects
export const mockJobObjects = {
	createdJob: {
		id: 1,
		title: 'Software Developer',
		salary: '120000',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications.',
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/image1.jpg',
		shuttle: true,
		meals: false,
		city: { id: 1, name: 'Tel Aviv' },
		category: { id: 2, name: 'IT' },
		user: {
			id: 'user123',
			firstName: 'John',
			lastName: 'Doe',
			email: 'free@example.com',
		},
	},
	
	existingJob: {
		id: 2,
		title: 'Marketing Manager',
		salary: '80000',
		phone: '098-765-4321',
		description: 'Manage marketing campaigns.',
		cityId: 3,
		categoryId: 4,
		userId: 'premium456',
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/image2.jpg',
		shuttle: false,
		meals: true,
	},
	
	jobWithoutImage: {
		id: 3,
		title: 'Designer',
		salary: '75000',
		phone: '111-222-3333',
		description: 'Create visual concepts.',
		cityId: 5,
		categoryId: 6,
		userId: 'user123',
		imageUrl: null,
		shuttle: true,
		meals: true,
	},
	
	jobWithUndefinedImage: {
		id: 4,
		title: 'Undefined Image Job',
		salary: '80000',
		phone: '222-333-4444',
		description: 'Job with undefined image URL.',
		cityId: 2,
		categoryId: 3,
		userId: 'user123',
		imageUrl: undefined,
		shuttle: false,
		meals: false,
	},
	
	updatedJob: {
		id: 2,
		title: 'Marketing Manager',
		salary: '80000',
		phone: '098-765-4321',
		description: 'Manage marketing campaigns.',
		cityId: 3,
		categoryId: 4,
		userId: 'premium456',
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/new-image2.jpg',
		shuttle: false,
		meals: true,
		city: { id: 3, name: 'Jerusalem' },
		category: { id: 4, name: 'Marketing' },
		user: {
			id: 'premium456',
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'premium@example.com',
		},
	},
};

// Mock S3 upload results
export const mockS3UploadResults = {
	success: {
		success: true,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/image1.jpg',
		filename: 'test-image.jpg',
		size: 1024000,
		mimetype: 'image/jpeg',
	},
	
	contentRejected: {
		success: false,
		code: 'CONTENT_REJECTED',
		error: 'Image contains inappropriate content',
	},
	
	uploadFailed: {
		success: false,
		error: 'S3 upload failed',
	},
	
	moderationFailed: {
		success: false,
		code: 'MODERATION_FAILED',
		error: 'Image moderation service unavailable',
	},
};

// Mock S3 delete results
export const mockS3DeleteResults = {
	success: true,
	failure: false,
	imageNotFound: false,
};

// Mock S3 configuration status
export const mockS3ConfigStatus = {
	valid: {
		isValid: true,
		missingVars: [],
		message: 'S3 configuration is valid',
	},
	
	invalid: {
		isValid: false,
		missingVars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
		message: 'S3 configuration is incomplete',
	},
	
	partial: {
		isValid: false,
		missingVars: ['AWS_S3_BUCKET_NAME'],
		message: 'S3 configuration is incomplete',
	},
};

// Mock job counts
export const mockJobCounts = {
	freeUserAtLimit: 5,
	freeUserUnderLimit: 3,
	premiumUserAtLimit: 10,
	premiumUserUnderLimit: 7,
	premiumUserOverLimit: 12,
};

// Mock errors
export const mockErrors = {
	s3NotConfigured: new Error('S3 is not properly configured'),
	noFileProvided: new Error('No file provided'),
	invalidFileType: new Error('Only image files are allowed'),
	fileSizeExceeded: new Error('File size exceeds 5MB limit'),
	contentRejected: new Error('Image content violates community guidelines: Image contains inappropriate content'),
	uploadFailed: new Error('Upload failed: S3 upload failed'),
	missingRequiredFields: new Error('Missing required fields: title, salary'),
	userNotFound: new Error('User not found'),
	jobLimitExceeded: new Error('Вы уже разместили 5 объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.'),
	premiumJobLimitExceeded: new Error('Вы уже разместили 10 объявлений.'),
	jobNotFound: new Error('Job not found or access denied'),
	databaseError: new Error('Database connection failed'),
	s3DeleteError: new Error('S3 delete failed'),
	cleanupError: new Error('Failed to cleanup image'),
};

// Mock error messages
export const mockErrorMessages = {
	s3NotConfigured: 'S3 is not properly configured',
	noFileProvided: 'No file provided',
	invalidFileType: 'Only image files are allowed',
	fileSizeExceeded: 'File size exceeds 5MB limit',
	contentRejected: 'Image content violates community guidelines',
	uploadFailed: 'Upload failed',
	missingRequiredFields: 'Missing required fields',
	userNotFound: 'User not found',
	jobLimitExceeded: 'Вы уже разместили 5 объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.',
	premiumJobLimitExceeded: 'Вы уже разместили 10 объявлений.',
	jobNotFound: 'Job not found or access denied',
	databaseError: 'Database connection failed',
	s3DeleteError: 'S3 delete failed',
	cleanupError: 'Failed to cleanup image',
};

// Mock success messages
export const mockSuccessMessages = {
	imageUploaded: 'Image uploaded successfully',
	jobCreated: 'Job created successfully with image',
	jobImageUpdated: 'Job image updated successfully',
	imageDeleted: 'Image deleted successfully',
	jobDeleted: 'Job and image deleted successfully',
	s3Configured: 'S3 configuration is valid',
};

// Mock console log data
export const mockConsoleLogData = {
	s3NotConfigured: '⚠️ S3UploadService: S3 configuration is incomplete',
	setupGuide: '📖 See SETUP_GUIDE.md for configuration instructions',
	uploadFailed: '❌ S3UploadService: Upload failed:',
	createJobFailed: '❌ S3UploadService: Create job failed:',
	updateJobImageFailed: '❌ S3UploadService: Update job image failed:',
	deleteImageFailed: '❌ S3UploadService: Delete image failed:',
	deleteJobFailed: '❌ S3UploadService: Delete job failed:',
	cleanupFailed: '❌ S3UploadService: Failed to cleanup image:',
	cleanupNewImageFailed: '❌ S3UploadService: Failed to cleanup new image:',
	imageDeletionFailed: '⚠️ S3UploadService: Image deletion failed or image not found',
	imageDeleted: 'Image deleted successfully',
	cleanedUpImage: 'Cleaned up uploaded image after job creation failure',
	cleanedUpNewImage: 'Cleaned up new image after update failure',
	jobCreatedWithImage: 'Job created successfully with image',
	jobImageUpdated: 'Job image updated successfully',
	jobAndImageDeleted: 'Job and image deleted successfully',
};

// Mock environment variables
export const mockEnvironmentVariables = {
	valid: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		AWS_S3_BUCKET_NAME: 'worknow-images',
		AWS_REGION: 'us-east-1',
	},
	
	missingRequired: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		// AWS_SECRET_ACCESS_KEY is missing
		AWS_S3_BUCKET_NAME: 'worknow-images',
	},
	
	missingBucket: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		// AWS_S3_BUCKET_NAME is missing
	},
	
	empty: {},
};

// Mock file validation results
export const mockFileValidationResults = {
	valid: {
		isValid: true,
		errors: [],
	},
	
	noFile: {
		isValid: false,
		errors: ['No file provided'],
	},
	
	invalidType: {
		isValid: false,
		errors: ['Only image files are allowed'],
	},
	
	fileSizeExceeded: {
		isValid: false,
		errors: ['File size exceeds 5MB limit'],
	},
	
	invalidExtension: {
		isValid: false,
		errors: ['Invalid file extension. Allowed: jpg, jpeg, png, gif, webp'],
	},
	
	multipleErrors: {
		isValid: false,
		errors: ['Only image files are allowed', 'File size exceeds 5MB limit', 'Invalid file extension. Allowed: jpg, jpeg, png, gif, webp'],
	},
};

// Mock service responses
export const mockServiceResponses = {
	uploadSuccess: {
		success: true,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/image1.jpg',
		filename: 'test-image.jpg',
		size: 1024000,
		mimetype: 'image/jpeg',
	},
	
	createJobSuccess: {
		success: true,
		job: mockJobObjects.createdJob,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/image1.jpg',
	},
	
	updateJobImageSuccess: {
		success: true,
		job: mockJobObjects.updatedJob,
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/new-image2.jpg',
	},
	
	deleteImageSuccess: true,
	
	deleteJobSuccess: true,
	
	configurationStatus: {
		isConfigured: true,
		requiredEnvVars: [
			'AWS_ACCESS_KEY_ID',
			'AWS_SECRET_ACCESS_KEY',
			'AWS_S3_BUCKET_NAME',
		],
		optionalEnvVars: ['AWS_REGION'],
	},
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		title: 'Software Developer',
		salary: '120000',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications.',
		imageUrl: 'https://s3.amazonaws.com/bucket/jobs/image1.jpg',
		filename: 'test-image.jpg',
		mimetype: 'image/jpeg',
	},
	
	number: {
		cityId: 1,
		categoryId: 2,
		jobId: 1,
		fileSize: 1024000,
		jobCount: 5,
		maxJobs: 10,
	},
	
	boolean: {
		shuttle: true,
		meals: false,
		isPremium: true,
		premiumDeluxe: false,
		isConfigured: true,
		success: true,
		isValid: true,
	},
	
	object: {
		file: mockFileData.validImageFile,
		job: mockJobObjects.createdJob,
		user: mockUserData.premiumUser,
		uploadResult: mockS3UploadResults.success,
		configStatus: mockS3ConfigStatus.valid,
	},
};

// Mock file type validation logic
export const mockFileTypeValidationLogic = {
	isImageFile: (mimetype) => {
		return mimetype.startsWith('image/');
	},
	
	isValidImageType: (mimetype) => {
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		return validTypes.includes(mimetype);
	},
	
	isValidFileExtension: (filename) => {
		const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
		const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
		return allowedExtensions.includes(fileExtension);
	},
	
	isValidFileSize: (size, maxSize = 5 * 1024 * 1024) => {
		return size <= maxSize;
	},
	
	validateFile: (file) => {
		const errors = [];
		
		if (!file) {
			errors.push('No file provided');
			return { isValid: false, errors };
		}
		
		if (!mockFileTypeValidationLogic.isImageFile(file.mimetype)) {
			errors.push('Only image files are allowed');
		}
		
		if (!mockFileTypeValidationLogic.isValidFileSize(file.size)) {
			errors.push('File size exceeds 5MB limit');
		}
		
		if (!mockFileTypeValidationLogic.isValidFileExtension(file.originalname)) {
			errors.push('Invalid file extension. Allowed: jpg, jpeg, png, gif, webp');
		}
		
		return {
			isValid: errors.length === 0,
			errors,
		};
	},
};

// Mock job limit logic
export const mockJobLimitLogic = {
	getMaxJobs: (user) => {
		const isPremium = user.isPremium || user.premiumDeluxe;
		return isPremium ? 10 : 5;
	},
	
	isAtLimit: (jobCount, user) => {
		const maxJobs = mockJobLimitLogic.getMaxJobs(user);
		return jobCount >= maxJobs;
	},
	
	getLimitMessage: (user, jobCount) => {
		const isPremium = user.isPremium || user.premiumDeluxe;
		const maxJobs = isPremium ? 10 : 5;
		
		if (isPremium) {
			return `Вы уже разместили ${maxJobs} объявлений.`;
		} else {
			return `Вы уже разместили ${maxJobs} объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.`;
		}
	},
};

// Mock S3 configuration logic
export const mockS3ConfigurationLogic = {
	validateConfig: (envVars) => {
		const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET_NAME'];
		const missingVars = requiredVars.filter(varName => !envVars[varName]);
		
		return {
			isValid: missingVars.length === 0,
			missingVars,
			message: missingVars.length === 0 ? 'S3 configuration is valid' : 'S3 configuration is incomplete',
		};
	},
	
	getConfigurationStatus: (isConfigured) => {
		return {
			isConfigured,
			requiredEnvVars: [
				'AWS_ACCESS_KEY_ID',
				'AWS_SECRET_ACCESS_KEY',
				'AWS_S3_BUCKET_NAME',
			],
			optionalEnvVars: ['AWS_REGION'],
		};
	},
};

// Reset mocks before each test
export const resetS3UploadServiceMocks = () => {
	mockS3Utils.uploadToS3WithModeration.mockClear();
	mockS3Utils.deleteFromS3.mockClear();
	mockS3Utils.validateS3Config.mockClear();
	mockPrisma.user.findUnique.mockClear();
	mockPrisma.job.count.mockClear();
	mockPrisma.job.create.mockClear();
	mockPrisma.job.findFirst.mockClear();
	mockPrisma.job.update.mockClear();
	mockPrisma.job.delete.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockConsoleWarn.mockClear();
	vi.clearAllMocks();
};
