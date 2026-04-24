import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockSendMail = vi.fn();
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}));

let sendEmail;
beforeAll(async () => {
  ({ sendEmail } = await import('../apps/api/utils/mailer.js'));
});

describe('sendEmail', () => {
  beforeEach(() => { mockSendMail.mockReset(); });

  it('calls sendMail with to, subject, html', async () => {
    mockSendMail.mockResolvedValue({ messageId: 'abc' });
    await sendEmail('test@example.com', 'Subject', '<p>Body</p>');
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'test@example.com', subject: 'Subject', html: '<p>Body</p>' })
    );
  });

  it('propagates error from sendMail', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP failure'));
    await expect(sendEmail('a@b.com', 'S', 'H')).rejects.toThrow('SMTP failure');
  });
});
