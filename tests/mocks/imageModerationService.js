import { vi } from 'vitest';

// Mock AWS SDK
export const mockAWS = {
	Rekognition: vi.fn(() => ({
		detectModerationLabels: vi.fn(() => ({
			promise: vi.fn(),
		})),
		detectLabels: vi.fn(() => ({
			promise: vi.fn(),
		})),
	})),
};

// Mock image buffers
export const mockImageBuffers = {
	validImageBuffer: Buffer.from('valid-image-data'),
	invalidImageBuffer: Buffer.from('invalid-image-data'),
	emptyBuffer: Buffer.alloc(0),
	largeBuffer: Buffer.alloc(1024 * 1024), // 1MB buffer
	smallBuffer: Buffer.alloc(100), // 100 bytes buffer
};

// Mock AWS Rekognition responses
export const mockRekognitionResponses = {
	cleanImage: {
		moderationLabels: [],
		labels: [
			{ Name: 'Person', Confidence: 99.5 },
			{ Name: 'Clothing', Confidence: 95.2 },
			{ Name: 'Face', Confidence: 98.1 },
		],
	},
	
	inappropriateContent: {
		moderationLabels: [
			{ Name: 'Explicit Nudity', Confidence: 96.5 },
			{ Name: 'Violence', Confidence: 97.2 },
		],
		labels: [
			{ Name: 'Person', Confidence: 99.5 },
			{ Name: 'Adult', Confidence: 95.2 },
			{ Name: 'Nude', Confidence: 98.1 },
		],
	},
	
	potentiallyInappropriate: {
		moderationLabels: [],
		labels: [
			{ Name: 'Person', Confidence: 99.5 },
			{ Name: 'Weapon', Confidence: 95.2 },
			{ Name: 'Gun', Confidence: 98.1 },
			{ Name: 'Knife', Confidence: 96.8 },
		],
	},
	
	hateSymbols: {
		moderationLabels: [
			{ Name: 'Hate Symbols', Confidence: 96.5 },
		],
		labels: [
			{ Name: 'Symbol', Confidence: 99.5 },
			{ Name: 'Text', Confidence: 95.2 },
		],
	},
	
	lowConfidence: {
		moderationLabels: [
			{ Name: 'Explicit Nudity', Confidence: 50.0 },
			{ Name: 'Violence', Confidence: 60.0 },
		],
		labels: [
			{ Name: 'Person', Confidence: 99.5 },
			{ Name: 'Adult', Confidence: 70.0 },
		],
	},
	
	emptyResponse: {
		moderationLabels: [],
		labels: [],
	},
	
	errorResponse: {
		error: 'Invalid image format',
		code: 'InvalidParameterException',
	},
};

// Mock environment variables
export const mockEnvVars = {
	valid: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		AWS_REKOGNITION_REGION: 'us-east-1',
	},
	
	missingAccessKey: {
		AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		AWS_REKOGNITION_REGION: 'us-east-1',
	},
	
	missingSecretKey: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		AWS_REKOGNITION_REGION: 'us-east-1',
	},
	
	missingBoth: {
		AWS_REKOGNITION_REGION: 'us-east-1',
	},
	
	unsupportedRegion: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		AWS_REKOGNITION_REGION: 'us-west-3',
	},
	
	defaultRegion: {
		AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
		AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
	},
};

// Mock supported regions
export const mockSupportedRegions = [
	'us-east-1',
	'us-west-2',
	'eu-west-1',
	'ap-southeast-2',
];

// Mock inappropriate labels
export const mockInappropriateLabels = [
	'Explicit Nudity',
	'Violence',
	'Hate Symbols',
];

// Mock potentially inappropriate labels
export const mockPotentiallyInappropriateLabels = [
	'Weapon',
	'Gun',
	'Knife',
	'Adult',
	'Nude',
];

// Mock confidence thresholds
export const mockConfidenceThresholds = {
	minConfidence: 95,
	veryHighConfidence: 98,
	lowConfidence: 50,
	mediumConfidence: 70,
};

// Mock errors
export const mockErrors = {
	awsError: new Error('AWS Rekognition service error'),
	networkError: new Error('Network connection failed'),
	invalidImageError: new Error('Invalid image format'),
	timeoutError: new Error('Request timeout'),
	permissionError: new Error('Access denied'),
	quotaExceededError: new Error('Quota exceeded'),
};

// Mock console logging data
export const mockConsoleLogData = {
	errorMessage: '❌ Image Moderation - Error during moderation:',
	configError: '❌ Missing Rekognition environment variables:',
	regionError: '❌ Rekognition not available in region:',
	regionSuggestion: '💡 Supported regions:',
};

// Mock moderation results
export const mockModerationResults = {
	approved: {
		isApproved: true,
		confidence: 0,
		detectedIssues: {
			moderationLabels: [],
			potentiallyInappropriateLabels: [],
		},
		analysis: {
			moderationLabels: [],
			detectedLabels: ['Person', 'Clothing', 'Face'],
			moderationConfidence: 0,
		},
	},
	
	rejected: {
		isApproved: false,
		confidence: 96.5,
		detectedIssues: {
			moderationLabels: [
				{ Name: 'Explicit Nudity', Confidence: 96.5 },
			],
			potentiallyInappropriateLabels: ['Adult', 'Nude'],
		},
		analysis: {
			moderationLabels: [
				{ Name: 'Explicit Nudity', Confidence: 96.5 },
			],
			detectedLabels: ['Person', 'Adult', 'Nude'],
			moderationConfidence: 96.5,
		},
	},
	
	errorResult: {
		isApproved: false,
		confidence: 0,
		error: 'AWS Rekognition service error',
		detectedIssues: {
			moderationLabels: [],
			potentiallyInappropriateLabels: [],
		},
		analysis: {
			moderationLabels: [],
			detectedLabels: [],
			moderationConfidence: 0,
		},
	},
};

// Mock configuration validation results
export const mockConfigResults = {
	valid: {
		isValid: true,
		missingVars: [],
		message: 'Rekognition configuration is valid',
	},
	
	missingVars: {
		isValid: false,
		missingVars: ['AWS_ACCESS_KEY_ID'],
		message: 'Missing Rekognition environment variables: AWS_ACCESS_KEY_ID',
	},
	
	unsupportedRegion: {
		isValid: false,
		missingVars: [],
		message: 'Rekognition not available in region: us-west-3. Supported regions: us-east-1, us-west-2, eu-west-1, ap-southeast-2',
	},
};

// Reset mocks before each test
export const resetImageModerationMocks = () => {
	mockAWS.Rekognition.mockClear();
	vi.clearAllMocks();
};
