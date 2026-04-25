import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock resend
const mockEmailsSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({ emails: { send: mockEmailsSend } })),
}));

// Mock mailer
const mockSendEmail = vi.fn();
vi.mock('../apps/api/utils/mailer.js', () => ({
  sendEmail: mockSendEmail,
}));

let sendPremiumDeluxeWelcomeEmail, sendProWelcomeEmail;

beforeAll(async () => {
  ({ sendPremiumDeluxeWelcomeEmail, sendProWelcomeEmail } = await import(
    '../apps/api/services/premiumEmailService.js'
  ));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('premiumEmailService', () => {
  describe('sendPremiumDeluxeWelcomeEmail', () => {
    it('sends email via Resend when API key is available', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      const result = await sendPremiumDeluxeWelcomeEmail('test@example.com', 'John');

      expect(result).toEqual({ success: true, messageId: 'msg-123' });
      expect(mockEmailsSend).toHaveBeenCalledOnce();
      const call = mockEmailsSend.mock.calls[0][0];
      expect(call.to).toBe('test@example.com');
      expect(call.subject).toContain('Premium Deluxe');
    });

    it('sends email without userName (uses default greeting)', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockResolvedValue({ id: 'msg-456' });

      const result = await sendPremiumDeluxeWelcomeEmail('user@example.com');

      expect(result.success).toBe(true);
    });

    it('generates messageId with timestamp when result.id is missing', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockResolvedValue({});

      const result = await sendPremiumDeluxeWelcomeEmail('user@example.com', 'Jane');

      expect(result.success).toBe(true);
      expect(result.messageId).toMatch(/^resend-/);
    });

    it('falls back to Gmail when Resend fails', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockRejectedValue(new Error('Resend error'));
      mockSendEmail.mockResolvedValue({ messageId: 'gmail-msg' });

      const result = await sendPremiumDeluxeWelcomeEmail('user@example.com');

      expect(result.success).toBe(true);
      expect(result.messageId).toMatch(/^gmail-/);
      expect(mockSendEmail).toHaveBeenCalledOnce();
    });

    it('throws error when both Resend and Gmail fail', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockRejectedValue(new Error('Resend down'));
      mockSendEmail.mockRejectedValue(new Error('Gmail down'));

      await expect(
        sendPremiumDeluxeWelcomeEmail('user@example.com')
      ).rejects.toThrow('Failed to send Premium Deluxe welcome email');
    });

    it('falls back to Gmail when RESEND_API_KEY is not set', async () => {
      delete process.env.RESEND_API_KEY;
      mockSendEmail.mockResolvedValue({ messageId: 'gmail-123' });

      const result = await sendPremiumDeluxeWelcomeEmail('user@example.com');

      expect(result.success).toBe(true);
      expect(result.messageId).toMatch(/^gmail-/);
    });
  });

  describe('sendProWelcomeEmail', () => {
    it('sends Pro email via Resend when key is available', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockResolvedValue({ id: 'pro-msg-123' });

      const result = await sendProWelcomeEmail('pro@example.com', 'Alice');

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('pro-msg-123');
      const call = mockEmailsSend.mock.calls[0][0];
      expect(call.to).toBe('pro@example.com');
      expect(call.subject).toContain('Pro');
    });

    it('sends Pro email without userName', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockResolvedValue({ id: 'pro-456' });

      const result = await sendProWelcomeEmail('pro2@example.com');

      expect(result.success).toBe(true);
    });

    it('falls back to Gmail when Resend fails for Pro email', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockRejectedValue(new Error('Resend error'));
      mockSendEmail.mockResolvedValue({ messageId: 'gmail-pro-msg' });

      const result = await sendProWelcomeEmail('user@example.com');

      expect(result.success).toBe(true);
      expect(result.messageId).toMatch(/^gmail-/);
    });

    it('throws when both Resend and Gmail fail for Pro email', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      mockEmailsSend.mockRejectedValue(new Error('Resend down'));
      mockSendEmail.mockRejectedValue(new Error('Gmail down'));

      await expect(sendProWelcomeEmail('user@example.com')).rejects.toThrow(
        'Failed to send Pro welcome email'
      );
    });
  });
});
