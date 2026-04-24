import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFetch = vi.fn();
vi.mock('node-fetch', () => ({ default: mockFetch }));

let sendTelegramNotification, sendUpdatedJobListToTelegram, sendNewJobNotificationToTelegram;
beforeAll(async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test_token';
  process.env.TELEGRAM_CHAT_ID = 'test_chat';
  ({ sendTelegramNotification, sendUpdatedJobListToTelegram, sendNewJobNotificationToTelegram } =
    await import('../apps/api/utils/telegram.js'));
});

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({ json: () => Promise.resolve({ ok: true }) });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const mockUser = { firstName: 'Иван', lastName: 'Иванов', email: 'ivan@test.com' };
const mockJob = { title: 'Dev', salary: '5000', phone: '050', description: 'Desc', createdAt: new Date(), city: { name: 'TLV' }, category: { name: 'IT' } };

describe('sendTelegramNotification', () => {
  it('calls fetch with correct URL', async () => {
    await sendTelegramNotification(mockUser, [mockJob]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('test_token'),
      expect.any(Object)
    );
  });

  it('handles empty jobs array', async () => {
    await sendTelegramNotification(mockUser, []);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('does not throw on fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    await expect(sendTelegramNotification(mockUser, [])).resolves.not.toThrow();
  });
});

describe('sendUpdatedJobListToTelegram', () => {
  it('calls fetch when user has jobs', async () => {
    await sendUpdatedJobListToTelegram(mockUser, [mockJob]);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('sends message when job list is empty', async () => {
    await sendUpdatedJobListToTelegram(mockUser, []);
    expect(mockFetch).toHaveBeenCalled();
  });
});

describe('sendNewJobNotificationToTelegram', () => {
  it('calls fetch with job data', async () => {
    await sendNewJobNotificationToTelegram(mockUser, mockJob);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('sends to correct telegram API endpoint', async () => {
    await sendNewJobNotificationToTelegram(mockUser, mockJob);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('api.telegram.org'),
      expect.any(Object)
    );
  });
});
