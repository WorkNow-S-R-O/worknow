import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';

const mockUploadToS3 = vi.fn();
const mockUploadToS3WithModeration = vi.fn();
const mockDeleteFromS3 = vi.fn();
const mockValidateS3Config = vi.fn(() => ({ isValid: true, missing: [] }));
const mockUpload = {
  single: vi.fn(() => (req, res, next) => {
    req.file = {
      buffer: Buffer.from('fake image'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
    };
    next();
  }),
};

vi.mock('../apps/api/utils/s3Upload.js', () => ({
  uploadToS3: mockUploadToS3,
  uploadToS3WithModeration: mockUploadToS3WithModeration,
  deleteFromS3: mockDeleteFromS3,
  validateS3Config: mockValidateS3Config,
  upload: mockUpload,
}));

vi.mock('../apps/api/middlewares/auth.js', () => ({
  requireAuth: (req, res, next) => {
    req.user = { clerkUserId: 'user_test123', id: 1 };
    next();
  },
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    job: {
      create: vi.fn(),
      update: vi.fn(),
    },
  })),
}));

vi.mock('../apps/api/services/imageModerationService.js', () => ({
  moderateImage: vi.fn().mockResolvedValue({ isAcceptable: true, labels: [] }),
}));

let app;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  const { default: s3UploadRouter } = await import('../apps/api/routes/s3Upload.js');
  app.use('/api/s3-upload', s3UploadRouter);
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  mockValidateS3Config.mockReturnValue({ isValid: true, missing: [] });
  mockUpload.single.mockReturnValue((req, res, next) => {
    req.file = {
      buffer: Buffer.from('fake image'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
    };
    next();
  });
});

describe('s3Upload route', () => {
  describe('GET /api/s3-upload/test-config', () => {
    it('returns config status', async () => {
      const response = await request(app).get('/api/s3-upload/test-config');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('handles config error', async () => {
      mockValidateS3Config.mockImplementation(() => { throw new Error('Config error'); });
      const response = await request(app).get('/api/s3-upload/test-config');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/s3-upload/test-upload', () => {
    it('uploads successfully', async () => {
      mockUploadToS3.mockResolvedValue('https://s3.example.com/test/image.jpg');
      const response = await request(app).post('/api/s3-upload/test-upload');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('returns 500 when S3 upload fails', async () => {
      mockUploadToS3.mockRejectedValue(new Error('S3 error'));
      const response = await request(app).post('/api/s3-upload/test-upload');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/s3-upload/test-upload-no-auth', () => {
    it('uploads successfully', async () => {
      mockUploadToS3.mockResolvedValue('https://s3.example.com/test/image.jpg');
      const response = await request(app).post('/api/s3-upload/test-upload-no-auth');
      expect(response.status).toBe(200);
    });

    it('returns 500 when S3 upload fails', async () => {
      mockUploadToS3.mockRejectedValue(new Error('S3 error'));
      const response = await request(app).post('/api/s3-upload/test-upload-no-auth');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/s3-upload/test-moderation', () => {
    it('tests moderation successfully', async () => {
      const response = await request(app).post('/api/s3-upload/test-moderation');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/s3-upload/job-image', () => {
    it('uploads job image successfully', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.example.com/jobs/image.jpg',
        moderationResult: { isAcceptable: true },
      });
      const response = await request(app).post('/api/s3-upload/job-image');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('returns 400 when content rejected', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: false,
        code: 'CONTENT_REJECTED',
        error: 'Content rejected',
        moderationResult: {},
      });
      const response = await request(app).post('/api/s3-upload/job-image');
      expect(response.status).toBe(400);
    });

    it('returns 500 when upload fails with non-rejection error', async () => {
      mockUploadToS3WithModeration.mockResolvedValue({
        success: false,
        code: 'UPLOAD_FAILED',
        error: 'Upload failed',
      });
      const response = await request(app).post('/api/s3-upload/job-image');
      expect(response.status).toBe(500);
    });

    it('returns 500 when exception thrown', async () => {
      mockUploadToS3WithModeration.mockRejectedValue(new Error('S3 error'));
      const response = await request(app).post('/api/s3-upload/job-image');
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/s3-upload/delete-image', () => {
    it('deletes image successfully', async () => {
      mockDeleteFromS3.mockResolvedValue(true);
      const response = await request(app)
        .delete('/api/s3-upload/delete-image')
        .send({ imageUrl: 'https://s3.example.com/jobs/image.jpg' });
      expect(response.status).toBe(200);
    });

    it('returns 400 when no imageUrl', async () => {
      const response = await request(app)
        .delete('/api/s3-upload/delete-image')
        .send({});
      expect(response.status).toBe(400);
    });

    it('returns 404 when image not found (deleteFromS3 returns false)', async () => {
      mockDeleteFromS3.mockResolvedValue(false);
      const response = await request(app)
        .delete('/api/s3-upload/delete-image')
        .send({ imageUrl: 'https://s3.example.com/jobs/nonexistent.jpg' });
      expect(response.status).toBe(404);
    });

    it('returns 500 when delete fails', async () => {
      mockDeleteFromS3.mockRejectedValue(new Error('S3 error'));
      const response = await request(app)
        .delete('/api/s3-upload/delete-image')
        .send({ imageUrl: 'https://s3.example.com/jobs/image.jpg' });
      expect(response.status).toBe(500);
    });
  });
});
