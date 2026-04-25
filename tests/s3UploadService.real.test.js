import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock s3Upload utility
const mockUploadToS3WithModeration = vi.fn();
const mockDeleteFromS3 = vi.fn();
const mockValidateS3Config = vi.fn(() => ({ isValid: true, missingVars: [] }));

vi.mock('../apps/api/utils/s3Upload.js', () => ({
  uploadToS3WithModeration: mockUploadToS3WithModeration,
  deleteFromS3: mockDeleteFromS3,
  validateS3Config: mockValidateS3Config,
}));

// Mock Prisma
const mockUserFindUnique = vi.fn();
const mockJobCount = vi.fn();
const mockJobCreate = vi.fn();
const mockJobFindFirst = vi.fn();
const mockJobUpdate = vi.fn();
const mockJobDelete = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: { findUnique: mockUserFindUnique },
    job: {
      count: mockJobCount,
      create: mockJobCreate,
      findFirst: mockJobFindFirst,
      update: mockJobUpdate,
      delete: mockJobDelete,
    },
  })),
}));

let s3UploadServiceInstance;
let S3UploadServiceClass;

beforeAll(async () => {
  // The module exports an instance, not a class
  // We need to mock validateS3Config before importing so the instance is properly configured
  s3UploadServiceInstance = (await import('../apps/api/services/s3UploadService.js')).default;
  // Get the class to create new instances with different configs
  S3UploadServiceClass = s3UploadServiceInstance.constructor;
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

const mockFile = {
  mimetype: 'image/jpeg',
  size: 1024 * 1024, // 1MB
  buffer: Buffer.from('fake-image'),
  originalname: 'test.jpg',
};

const mockUser = {
  id: 'user-1',
  isPremium: false,
  premiumDeluxe: false,
};

const mockJobData = {
  title: 'Dev Job',
  salary: '50 шек/час',
  phone: '+972501234567',
  description: 'Looking for a developer',
  cityId: 1,
  categoryId: 2,
  shuttle: 'false',
  meals: 'false',
};

describe('S3UploadService', () => {
  let service;

  beforeEach(() => {
    service = s3UploadServiceInstance;
    // Force the service to be configured
    service.isConfigured = true;
  });

  describe('uploadJobImage', () => {
    it('throws when S3 is not configured', async () => {
      const unconfiguredService = Object.create(service);
      unconfiguredService.isConfigured = false;

      await expect(unconfiguredService.uploadJobImage(mockFile, 'user-1')).rejects.toThrow(
        'S3 is not properly configured'
      );
    });

    it('throws when no file provided', async () => {
      await expect(service.uploadJobImage(null, 'user-1')).rejects.toThrow('No file provided');
    });

    it('throws when file is not an image', async () => {
      const pdfFile = { ...mockFile, mimetype: 'application/pdf' };
      await expect(service.uploadJobImage(pdfFile, 'user-1')).rejects.toThrow(
        'Only image files are allowed'
      );
    });

    it('throws when file is too large', async () => {
      const bigFile = { ...mockFile, size: 6 * 1024 * 1024 }; // 6MB
      await expect(service.uploadJobImage(bigFile, 'user-1')).rejects.toThrow(
        'File size exceeds 5MB limit'
      );
    });

    it('throws when content is rejected by moderation', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: false,
        code: 'CONTENT_REJECTED',
        error: 'Nudity detected',
      });

      await expect(service.uploadJobImage(mockFile, 'user-1')).rejects.toThrow(
        'community guidelines'
      );
    });

    it('throws when upload fails for non-moderation reason', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: false,
        code: 'UPLOAD_FAILED',
        error: 'S3 error',
      });

      await expect(service.uploadJobImage(mockFile, 'user-1')).rejects.toThrow('Upload failed');
    });

    it('returns image URL on successful upload', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: true,
        imageUrl: 'https://bucket.s3.amazonaws.com/jobs/test.jpg',
      });

      const result = await service.uploadJobImage(mockFile, 'user-1');

      expect(result.success).toBe(true);
      expect(result.imageUrl).toBe('https://bucket.s3.amazonaws.com/jobs/test.jpg');
    });
  });

  describe('deleteImage', () => {
    it('returns false for null imageUrl', async () => {
      const result = await service.deleteImage(null);
      expect(result).toBe(false);
    });

    it('returns delete result from deleteFromS3', async () => {
      mockDeleteFromS3.mockResolvedValue(true);
      const result = await service.deleteImage('https://bucket.s3.amazonaws.com/test.jpg');
      expect(result).toBe(true);
    });

    it('returns false on deletion failure', async () => {
      mockDeleteFromS3.mockRejectedValue(new Error('Delete error'));
      const result = await service.deleteImage('https://bucket.s3.amazonaws.com/test.jpg');
      expect(result).toBe(false);
    });

    it('warns when deletion returns false', async () => {
      mockDeleteFromS3.mockResolvedValue(false);
      await service.deleteImage('https://bucket.s3.amazonaws.com/test.jpg');
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('createJobWithImage', () => {
    it('creates a job without image when no file provided', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockJobCount.mockResolvedValue(0);
      mockJobCreate.mockResolvedValue({ id: 1, ...mockJobData, city: {}, category: {}, user: {} });

      const result = await service.createJobWithImage(mockJobData, null, 'user-1');

      expect(result.success).toBe(true);
      expect(result.job).toBeDefined();
    });

    it('throws when required fields are missing', async () => {
      const incomplete = { title: 'Dev Job' }; // missing many required fields

      await expect(service.createJobWithImage(incomplete, null, 'user-1')).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('throws when user not found', async () => {
      mockUserFindUnique.mockResolvedValue(null);

      await expect(
        service.createJobWithImage(mockJobData, null, 'user-1')
      ).rejects.toThrow('User not found');
    });

    it('throws when free user exceeds job limit', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockJobCount.mockResolvedValue(5);

      await expect(
        service.createJobWithImage(mockJobData, null, 'user-1')
      ).rejects.toThrow('5 объявлений');
    });

    it('throws when premium user exceeds job limit', async () => {
      const premiumUser = { ...mockUser, isPremium: true };
      mockUserFindUnique.mockResolvedValue(premiumUser);
      mockJobCount.mockResolvedValue(10);

      await expect(
        service.createJobWithImage(mockJobData, null, 'user-1')
      ).rejects.toThrow('10 объявлений');
    });

    it('uploads image and creates job', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: true,
        imageUrl: 'https://bucket.s3.amazonaws.com/jobs/test.jpg',
      });
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockJobCount.mockResolvedValue(0);
      mockJobCreate.mockResolvedValue({ id: 1, ...mockJobData, imageUrl: 'https://bucket.s3.amazonaws.com/jobs/test.jpg', city: {}, category: {}, user: {} });

      const result = await service.createJobWithImage(mockJobData, mockFile, 'user-1');

      expect(result.success).toBe(true);
      expect(result.imageUrl).toBeDefined();
    });

    it('cleans up uploaded image when job creation fails', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: true,
        imageUrl: 'https://bucket.s3.amazonaws.com/jobs/test.jpg',
      });
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockJobCount.mockResolvedValue(0);
      mockJobCreate.mockRejectedValue(new Error('DB error'));
      mockDeleteFromS3.mockResolvedValue(true);

      await expect(
        service.createJobWithImage(mockJobData, mockFile, 'user-1')
      ).rejects.toThrow('DB error');

      expect(mockDeleteFromS3).toHaveBeenCalledOnce();
    });
  });

  describe('updateJobImage', () => {
    it('throws when job not found', async () => {
      mockJobFindFirst.mockResolvedValue(null);

      await expect(
        service.updateJobImage(1, mockFile, 'user-1')
      ).rejects.toThrow('Job not found or access denied');
    });

    it('updates job image successfully', async () => {
      mockJobFindFirst.mockResolvedValue({ id: 1, imageUrl: null });
      mockUploadToS3WithModeration.mockResolvedValue({
        success: true,
        imageUrl: 'https://bucket.s3.amazonaws.com/jobs/new.jpg',
      });
      mockJobUpdate.mockResolvedValue({ id: 1, imageUrl: 'https://bucket.s3.amazonaws.com/jobs/new.jpg', city: {}, category: {}, user: {} });

      const result = await service.updateJobImage(1, mockFile, 'user-1');

      expect(result.success).toBe(true);
      expect(result.imageUrl).toBeDefined();
    });

    it('deletes old image when updating', async () => {
      const oldImageUrl = 'https://bucket.s3.amazonaws.com/jobs/old.jpg';
      mockJobFindFirst.mockResolvedValue({ id: 1, imageUrl: oldImageUrl });
      mockUploadToS3WithModeration.mockResolvedValue({
        success: true,
        imageUrl: 'https://bucket.s3.amazonaws.com/jobs/new.jpg',
      });
      mockDeleteFromS3.mockResolvedValue(true);
      mockJobUpdate.mockResolvedValue({ id: 1, imageUrl: 'new.jpg', city: {}, category: {}, user: {} });

      await service.updateJobImage(1, mockFile, 'user-1');

      expect(mockDeleteFromS3).toHaveBeenCalledWith(oldImageUrl);
    });
  });

  describe('deleteJobWithImage', () => {
    it('deletes job and associated image', async () => {
      mockJobFindFirst.mockResolvedValue({ id: 1, imageUrl: 'https://bucket.s3.amazonaws.com/jobs/test.jpg' });
      mockDeleteFromS3.mockResolvedValue(true);
      mockJobDelete.mockResolvedValue({});

      const result = await service.deleteJobWithImage(1, 'user-1');

      expect(result).toBe(true);
      expect(mockDeleteFromS3).toHaveBeenCalledOnce();
      expect(mockJobDelete).toHaveBeenCalledOnce();
    });

    it('deletes job without image', async () => {
      mockJobFindFirst.mockResolvedValue({ id: 1, imageUrl: null });
      mockJobDelete.mockResolvedValue({});

      const result = await service.deleteJobWithImage(1, 'user-1');

      expect(result).toBe(true);
      expect(mockDeleteFromS3).not.toHaveBeenCalled();
    });

    it('throws when job not found', async () => {
      mockJobFindFirst.mockResolvedValue(null);

      await expect(service.deleteJobWithImage(1, 'user-1')).rejects.toThrow(
        'Job not found or access denied'
      );
    });
  });
});
