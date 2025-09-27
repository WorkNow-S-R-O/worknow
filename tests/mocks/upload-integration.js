import { vi } from 'vitest';

// Mock multer
export const mockMulterUpload = {
	single: vi.fn(() => (req, res, next) => {
		// Simulate multer middleware - add file to request
		req.file = {
			filename: 'job-1234567890-123456789.jpg',
			originalname: 'test-image.jpg',
			mimetype: 'image/jpeg',
			size: 1024,
		};
		next();
	}),
};

// Mock multer module
const mockMulter = {
	single: mockMulterUpload.single,
	diskStorage: vi.fn(() => ({})),
};

vi.mock('multer', () => ({
	default: vi.fn(() => mockMulter),
	MulterError: class MulterError extends Error {
		constructor(message, code) {
			super(message);
			this.code = code;
		}
	},
}));

// Mock the upload utility module directly
vi.mock('../../apps/api/utils/upload.js', () => ({
	default: mockMulterUpload,
}));

// Mock requireAuth middleware
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

// Mock auth middleware
vi.mock('../../apps/api/middlewares/auth.js', () => ({
	requireAuth: mockRequireAuth,
}));

// Mock dotenv
vi.mock('dotenv', () => ({
	default: {
		config: vi.fn(),
	},
}));

// Mock Node.js url module
vi.mock('url', () => ({
	fileURLToPath: vi.fn(() => '/mock/path/to/upload.js'),
}));

// Mock Node.js path module
vi.mock('path', () => ({
	default: {
		join: vi.fn((...args) => args.join('/')),
		dirname: vi.fn(() => '/mock/path/to'),
		extname: vi.fn((filename) => {
			const ext = filename.split('.').pop();
			return ext ? `.${ext}` : '';
		}),
	},
}));

// Mock data
export const mockFileData = {
	filename: 'job-1234567890-123456789.jpg',
	originalname: 'test-image.jpg',
	mimetype: 'image/jpeg',
	size: 1024,
};

export const mockServiceResponses = {
	uploadSuccess: {
		success: true,
		imageUrl: 'http://localhost:3001/images/jobs/job-1234567890-123456789.jpg',
		filename: 'job-1234567890-123456789.jpg',
	},
	uploadSuccessProduction: {
		success: true,
		imageUrl: 'https://worknow.co.il/images/jobs/job-1234567890-123456789.jpg',
		filename: 'job-1234567890-123456789.jpg',
	},
};

export const mockErrors = {
	missingFile: 'No image file provided',
	fileTooLarge: 'File too large. Maximum size is 5MB.',
	invalidFileType: 'Only image files are allowed!',
	uploadFailed: 'Failed to upload image',
	noAuthToken: 'No authorization token provided',
	invalidToken: 'Invalid token',
	tokenVerificationFailed: 'Token verification failed',
};

// Reset mocks function
export const resetUploadMocks = () => {
	mockMulterUpload.single.mockClear();
	mockRequireAuth.mockClear();

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

	vi.clearAllMocks();
};
