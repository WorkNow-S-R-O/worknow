import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock aws-sdk
const mockDetectModerationLabels = vi.fn();
const mockDetectLabels = vi.fn();
const mockRekognitionInstance = {
  detectModerationLabels: vi.fn(() => ({ promise: mockDetectModerationLabels })),
  detectLabels: vi.fn(() => ({ promise: mockDetectLabels })),
};

vi.mock('aws-sdk', () => ({
  default: {
    Rekognition: vi.fn(() => mockRekognitionInstance),
  },
}));

vi.mock('dotenv', () => ({ default: { config: vi.fn() } }));

let moderateImage, validateRekognitionConfig;

beforeAll(async () => {
  ({ moderateImage, validateRekognitionConfig } = await import(
    '../apps/api/services/imageModerationService.js'
  ));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  process.env.AWS_ACCESS_KEY_ID = 'test-key';
  process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
  process.env.AWS_REKOGNITION_REGION = 'us-east-1';
});

describe('imageModerationService', () => {
  describe('moderateImage', () => {
    it('approves image when no inappropriate content detected', async () => {
      mockDetectModerationLabels.mockResolvedValue({ ModerationLabels: [] });
      mockDetectLabels.mockResolvedValue({ Labels: [{ Name: 'Building' }, { Name: 'Sky' }] });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(true);
      expect(result.detectedIssues.moderationLabels).toHaveLength(0);
      expect(result.detectedIssues.potentiallyInappropriateLabels).toHaveLength(0);
    });

    it('rejects image with explicit nudity label', async () => {
      mockDetectModerationLabels.mockResolvedValue({
        ModerationLabels: [{ Name: 'Explicit Nudity', Confidence: 98 }],
      });
      mockDetectLabels.mockResolvedValue({ Labels: [] });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(false);
      expect(result.detectedIssues.moderationLabels).toHaveLength(1);
    });

    it('rejects image with violence label', async () => {
      mockDetectModerationLabels.mockResolvedValue({
        ModerationLabels: [{ Name: 'Violence', Confidence: 97 }],
      });
      mockDetectLabels.mockResolvedValue({ Labels: [] });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(false);
    });

    it('approves image with low confidence inappropriate label (below threshold)', async () => {
      mockDetectModerationLabels.mockResolvedValue({
        ModerationLabels: [{ Name: 'Explicit Nudity', Confidence: 80 }], // below 95 threshold
      });
      mockDetectLabels.mockResolvedValue({ Labels: [] });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(true);
    });

    it('rejects image with Gun label detected', async () => {
      mockDetectModerationLabels.mockResolvedValue({ ModerationLabels: [] });
      mockDetectLabels.mockResolvedValue({
        Labels: [{ Name: 'Gun' }, { Name: 'Person' }],
      });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(false);
      expect(result.detectedIssues.potentiallyInappropriateLabels).toContain('Gun');
    });

    it('rejects image with Weapon label detected', async () => {
      mockDetectModerationLabels.mockResolvedValue({ ModerationLabels: [] });
      mockDetectLabels.mockResolvedValue({
        Labels: [{ Name: 'Weapon' }],
      });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(false);
    });

    it('returns error result when rekognition throws', async () => {
      mockDetectModerationLabels.mockRejectedValue(new Error('AWS error'));

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(false);
      expect(result.error).toBe('AWS error');
    });

    it('returns correct confidence value based on detected labels', async () => {
      mockDetectModerationLabels.mockResolvedValue({
        ModerationLabels: [{ Name: 'Violence', Confidence: 99 }],
      });
      mockDetectLabels.mockResolvedValue({ Labels: [] });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.confidence).toBe(99);
    });

    it('handles missing Labels from Rekognition gracefully', async () => {
      mockDetectModerationLabels.mockResolvedValue({ ModerationLabels: null });
      mockDetectLabels.mockResolvedValue({ Labels: null });

      const result = await moderateImage(Buffer.from('fake-image'));

      expect(result.isApproved).toBe(true);
    });
  });

  describe('validateRekognitionConfig', () => {
    it('returns valid when all env vars are set with supported region', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
      process.env.AWS_REKOGNITION_REGION = 'us-east-1';

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(true);
      expect(result.missingVars).toHaveLength(0);
    });

    it('returns invalid when AWS_ACCESS_KEY_ID is missing', () => {
      delete process.env.AWS_ACCESS_KEY_ID;

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toContain('AWS_ACCESS_KEY_ID');
    });

    it('returns invalid when AWS_SECRET_ACCESS_KEY is missing', () => {
      delete process.env.AWS_SECRET_ACCESS_KEY;

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toContain('AWS_SECRET_ACCESS_KEY');
    });

    it('returns invalid for unsupported region', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
      process.env.AWS_REKOGNITION_REGION = 'ap-southeast-1'; // not in supported list

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('not available in region');
    });

    it('defaults to us-east-1 when region not set', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
      delete process.env.AWS_REKOGNITION_REGION;

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(true);
    });

    it('validates us-west-2 as supported region', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
      process.env.AWS_REKOGNITION_REGION = 'us-west-2';

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(true);
    });

    it('validates eu-west-1 as supported region', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
      process.env.AWS_REKOGNITION_REGION = 'eu-west-1';

      const result = validateRekognitionConfig();

      expect(result.isValid).toBe(true);
    });
  });
});
