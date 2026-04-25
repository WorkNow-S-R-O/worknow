import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock aws-sdk
const mockUploadPromise = vi.fn();
const mockDeleteObjectPromise = vi.fn();
const mockS3Instance = {
  upload: vi.fn(() => ({ promise: mockUploadPromise })),
  deleteObject: vi.fn(() => ({ promise: mockDeleteObjectPromise })),
};

vi.mock('aws-sdk', () => ({
  default: {
    S3: vi.fn(() => mockS3Instance),
    Rekognition: vi.fn(() => ({
      detectModerationLabels: vi.fn(() => ({ promise: vi.fn().mockResolvedValue({ ModerationLabels: [] }) })),
      detectLabels: vi.fn(() => ({ promise: vi.fn().mockResolvedValue({ Labels: [] }) })),
    })),
  },
}));

vi.mock('multer', () => {
  const memoryStorage = vi.fn(() => ({}));
  const multerFn = vi.fn(() => ({ single: vi.fn() }));
  multerFn.memoryStorage = memoryStorage;
  return {
    default: multerFn,
  };
});

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid'),
}));

vi.mock('dotenv', () => ({
  default: { config: vi.fn() },
}));

vi.mock('../apps/api/services/imageModerationService.js', () => ({
  moderateImage: vi.fn(),
  validateRekognitionConfig: vi.fn(() => ({ isValid: true, missingVars: [] })),
}));

let uploadToS3, deleteFromS3, validateS3Config, uploadToS3WithModeration;
let moderateImage;

beforeAll(async () => {
  ({ moderateImage } = await import('../apps/api/services/imageModerationService.js'));
  process.env.AWS_ACCESS_KEY_ID = 'test-key';
  process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
  process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
  process.env.AWS_REGION = 'us-east-1';

  ({ uploadToS3, deleteFromS3, validateS3Config, uploadToS3WithModeration } = await import(
    '../apps/api/utils/s3Upload.js'
  ));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('s3Upload utilities', () => {
  describe('validateS3Config', () => {
    it('returns valid when all vars are set', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
      process.env.AWS_S3_BUCKET_NAME = 'test-bucket';

      const result = validateS3Config();

      expect(result.isValid).toBe(true);
      expect(result.missingVars).toHaveLength(0);
    });

    it('returns invalid when bucket name is missing', () => {
      const originalBucket = process.env.AWS_S3_BUCKET_NAME;
      delete process.env.AWS_S3_BUCKET_NAME;

      const result = validateS3Config();

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toContain('AWS_S3_BUCKET_NAME');

      process.env.AWS_S3_BUCKET_NAME = originalBucket;
    });

    it('returns invalid when access key is missing', () => {
      const originalKey = process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_ACCESS_KEY_ID;

      const result = validateS3Config();

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toContain('AWS_ACCESS_KEY_ID');

      process.env.AWS_ACCESS_KEY_ID = originalKey;
    });
  });

  describe('uploadToS3', () => {
    it('uploads image to S3 and returns URL', async () => {
      mockUploadPromise.mockResolvedValue({
        Location: 'https://test-bucket.s3.amazonaws.com/jobs/test-uuid.jpg',
      });

      const result = await uploadToS3(
        Buffer.from('fake-image'),
        'test.jpg',
        'image/jpeg',
        'jobs'
      );

      expect(result).toBe('https://test-bucket.s3.amazonaws.com/jobs/test-uuid.jpg');
      expect(mockS3Instance.upload).toHaveBeenCalledOnce();
    });

    it('uses default folder when not specified', async () => {
      mockUploadPromise.mockResolvedValue({
        Location: 'https://test-bucket.s3.amazonaws.com/jobs/test-uuid.png',
      });

      await uploadToS3(Buffer.from('fake-image'), 'test.png', 'image/png');

      expect(mockS3Instance.upload).toHaveBeenCalledWith(
        expect.objectContaining({ Key: expect.stringContaining('jobs/') })
      );
    });

    it('throws error on S3 upload failure', async () => {
      mockUploadPromise.mockRejectedValue(new Error('S3 error'));

      await expect(
        uploadToS3(Buffer.from('fake-image'), 'test.jpg', 'image/jpeg')
      ).rejects.toThrow('Failed to upload image to S3');
    });
  });

  describe('deleteFromS3', () => {
    it('returns false for invalid URL', async () => {
      const result = await deleteFromS3('https://other-bucket.s3.amazonaws.com/image.jpg');
      expect(result).toBe(false);
    });

    it('returns false for null URL', async () => {
      const result = await deleteFromS3(null);
      expect(result).toBe(false);
    });

    it('deletes object and returns true for valid URL', async () => {
      process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
      mockDeleteObjectPromise.mockResolvedValue({});

      const result = await deleteFromS3(
        'https://test-bucket.s3.amazonaws.com/jobs/test-image.jpg'
      );

      expect(result).toBe(true);
      expect(mockS3Instance.deleteObject).toHaveBeenCalledOnce();
    });

    it('returns false when delete throws', async () => {
      process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
      mockDeleteObjectPromise.mockRejectedValue(new Error('Delete error'));

      const result = await deleteFromS3(
        'https://test-bucket.s3.amazonaws.com/jobs/test-image.jpg'
      );

      expect(result).toBe(false);
    });
  });

  describe('uploadToS3WithModeration', () => {
    it('rejects upload when moderation fails', async () => {
      moderateImage.mockResolvedValue({
        isApproved: false,
        detectedIssues: { moderationLabels: ['Nudity'] },
      });

      const result = await uploadToS3WithModeration(
        Buffer.from('fake-image'),
        'test.jpg',
        'image/jpeg'
      );

      expect(result.success).toBe(false);
      expect(result.code).toBe('CONTENT_REJECTED');
      expect(mockS3Instance.upload).not.toHaveBeenCalled();
    });

    it('uploads when moderation passes', async () => {
      moderateImage.mockResolvedValue({
        isApproved: true,
        detectedIssues: { moderationLabels: [], potentiallyInappropriateLabels: [] },
      });
      mockUploadPromise.mockResolvedValue({
        Location: 'https://test-bucket.s3.amazonaws.com/jobs/test.jpg',
      });

      const result = await uploadToS3WithModeration(
        Buffer.from('fake-image'),
        'test.jpg',
        'image/jpeg'
      );

      expect(result.success).toBe(true);
      expect(result.imageUrl).toBeDefined();
    });

    it('returns error when upload throws', async () => {
      moderateImage.mockResolvedValue({ isApproved: true });
      mockUploadPromise.mockRejectedValue(new Error('Upload failed'));

      const result = await uploadToS3WithModeration(
        Buffer.from('fake-image'),
        'test.jpg',
        'image/jpeg'
      );

      expect(result.success).toBe(false);
      expect(result.code).toBe('UPLOAD_FAILED');
    });
  });
});
