import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockEmailSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mockEmailSend,
    },
  })),
}));

const mockSendEmail = vi.fn();
vi.mock('../apps/api/utils/mailer.js', () => ({
  sendEmail: mockSendEmail,
}));

const mockPrismaUpsert = vi.fn();
const mockPrismaFindUnique = vi.fn();
const mockPrismaDelete = vi.fn();
const mockPrismaUpdate = vi.fn();
const mockPrismaDeleteMany = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    newsletterVerification: {
      upsert: mockPrismaUpsert,
      findUnique: mockPrismaFindUnique,
      delete: mockPrismaDelete,
      update: mockPrismaUpdate,
      deleteMany: mockPrismaDeleteMany,
    },
  })),
}));

vi.mock('aws-sdk', () => ({
  default: {
    config: { update: vi.fn() },
    SNS: vi.fn(() => ({})),
  },
}));

let generateVerificationCode, sendVerificationCode, storeVerificationCode, verifyCode, cleanupExpiredVerifications;

beforeAll(async () => {
  process.env.RESEND_API_KEY = 'test-key';
  ({ generateVerificationCode, sendVerificationCode, storeVerificationCode, verifyCode, cleanupExpiredVerifications } =
    await import('../apps/api/services/snsService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('snsService', () => {
  describe('generateVerificationCode', () => {
    it('generates a 6-digit string code', () => {
      const code = generateVerificationCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('generates different codes on successive calls', () => {
      const codes = new Set(Array.from({ length: 10 }, () => generateVerificationCode()));
      expect(codes.size).toBeGreaterThan(1);
    });
  });

  describe('sendVerificationCode', () => {
    it('sends via Resend when API key is set', async () => {
      mockEmailSend.mockResolvedValue({ id: 'resend-123' });
      const result = await sendVerificationCode('test@example.com', '123456');
      expect(result.success).toBe(true);
      expect(mockEmailSend).toHaveBeenCalled();
    });

    it('falls back to Gmail when Resend fails', async () => {
      mockEmailSend.mockRejectedValue(new Error('Resend error'));
      mockSendEmail.mockResolvedValue(true);
      const result = await sendVerificationCode('test@example.com', '123456');
      expect(result.success).toBe(true);
      expect(mockSendEmail).toHaveBeenCalled();
    });

    it('falls back to dev simulation when Gmail also fails', async () => {
      vi.useFakeTimers();
      mockEmailSend.mockRejectedValue(new Error('Resend error'));
      mockSendEmail.mockRejectedValue(new Error('Gmail error'));

      const resultPromise = sendVerificationCode('test@example.com', '123456');
      await vi.runAllTimersAsync();
      const result = await resultPromise;
      expect(result.success).toBe(true);
      vi.useRealTimers();
    });

    it('returns success with resend messageId', async () => {
      mockEmailSend.mockResolvedValue({ id: 'resend-abc' });
      const result = await sendVerificationCode('user@test.com', '654321');
      expect(result.messageId).toBe('resend-abc');
    });

    it('returns success with gmail messageId when resend fails', async () => {
      mockEmailSend.mockRejectedValue(new Error('fail'));
      mockSendEmail.mockResolvedValue(true);
      const result = await sendVerificationCode('user@test.com', '654321');
      expect(result.messageId).toMatch(/^gmail-fallback-/);
    });
  });

  describe('storeVerificationCode', () => {
    it('upserts verification code in database', async () => {
      mockPrismaUpsert.mockResolvedValue({ email: 'test@example.com' });
      const result = await storeVerificationCode('test@example.com', '123456');
      expect(result).toBe(true);
      expect(mockPrismaUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'test@example.com' },
        })
      );
    });

    it('throws when database fails', async () => {
      mockPrismaUpsert.mockRejectedValue(new Error('DB error'));
      await expect(storeVerificationCode('test@example.com', '123456')).rejects.toThrow();
    });
  });

  describe('verifyCode', () => {
    it('returns invalid when verification not found', async () => {
      mockPrismaFindUnique.mockResolvedValue(null);
      const result = await verifyCode('test@example.com', '123456');
      expect(result.valid).toBe(false);
    });

    it('returns invalid when code is expired', async () => {
      mockPrismaFindUnique.mockResolvedValue({
        email: 'test@example.com',
        code: '123456',
        expiresAt: new Date(Date.now() - 1000), // 1 second ago
        attempts: 0,
      });
      mockPrismaDelete.mockResolvedValue({});
      const result = await verifyCode('test@example.com', '123456');
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/expired/);
    });

    it('returns invalid when too many attempts', async () => {
      mockPrismaFindUnique.mockResolvedValue({
        email: 'test@example.com',
        code: '123456',
        expiresAt: new Date(Date.now() + 60000), // valid
        attempts: 3,
      });
      mockPrismaDelete.mockResolvedValue({});
      const result = await verifyCode('test@example.com', '123456');
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/attempts/);
    });

    it('returns valid when code matches', async () => {
      mockPrismaFindUnique.mockResolvedValue({
        email: 'test@example.com',
        code: '123456',
        expiresAt: new Date(Date.now() + 60000),
        attempts: 0,
      });
      mockPrismaUpdate.mockResolvedValue({});
      mockPrismaDelete.mockResolvedValue({});
      const result = await verifyCode('test@example.com', '123456');
      expect(result.valid).toBe(true);
    });

    it('returns invalid when code does not match', async () => {
      mockPrismaFindUnique.mockResolvedValue({
        email: 'test@example.com',
        code: '999999',
        expiresAt: new Date(Date.now() + 60000),
        attempts: 0,
      });
      mockPrismaUpdate.mockResolvedValue({});
      const result = await verifyCode('test@example.com', '123456');
      expect(result.valid).toBe(false);
    });

    it('throws when database fails', async () => {
      mockPrismaFindUnique.mockRejectedValue(new Error('DB error'));
      await expect(verifyCode('test@example.com', '123456')).rejects.toThrow();
    });
  });

  describe('cleanupExpiredVerifications', () => {
    it('deletes expired verifications and returns count', async () => {
      mockPrismaDeleteMany.mockResolvedValue({ count: 5 });
      const result = await cleanupExpiredVerifications();
      expect(result).toBe(5);
    });

    it('returns 0 when no expired verifications', async () => {
      mockPrismaDeleteMany.mockResolvedValue({ count: 0 });
      const result = await cleanupExpiredVerifications();
      expect(result).toBe(0);
    });

    it('throws when database fails', async () => {
      mockPrismaDeleteMany.mockRejectedValue(new Error('DB error'));
      await expect(cleanupExpiredVerifications()).rejects.toThrow();
    });
  });
});
