import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockSeekerFindMany = vi.fn();
const mockSeekerFindFirst = vi.fn();
const mockSeekerCount = vi.fn();
const mockNewsletterFindMany = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    seeker: {
      findMany: mockSeekerFindMany,
      findFirst: mockSeekerFindFirst,
      count: mockSeekerCount,
    },
    newsletterSubscriber: {
      findMany: mockNewsletterFindMany,
    },
  })),
}));

const mockEmailsSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({ emails: { send: mockEmailsSend } })),
}));

const mockSendEmail = vi.fn();
vi.mock('../apps/api/utils/mailer.js', () => ({
  sendEmail: mockSendEmail,
}));

let sendInitialCandidatesToNewSubscriber, checkAndSendNewCandidatesNotification;

beforeAll(async () => {
  process.env.RESEND_API_KEY = 'test-key';
  ({ sendInitialCandidatesToNewSubscriber, checkAndSendNewCandidatesNotification } =
    await import('../apps/api/services/candidateNotificationService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const mockCandidate = {
  id: 1,
  name: 'Иван Петров',
  gender: 'мужчина',
  city: 'Тель-Авив',
  employment: 'полная',
  category: 'строительство',
  languages: ['русский', 'иврит'],
  description: 'Опытный рабочий',
  isActive: true,
  isDemanded: false,
  createdAt: new Date(),
};

const mockSubscriber = {
  id: 1,
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isActive: true,
  preferredCities: [],
  preferredCategories: [],
  preferredEmployment: [],
  preferredLanguages: [],
  preferredGender: null,
  preferredDocumentTypes: [],
  onlyDemanded: false,
};

describe('candidateNotificationService', () => {
  describe('sendInitialCandidatesToNewSubscriber', () => {
    it('sends initial candidates to new subscriber via Resend', async () => {
      mockSeekerFindMany.mockResolvedValue([mockCandidate, mockCandidate, mockCandidate]);
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      await sendInitialCandidatesToNewSubscriber(mockSubscriber);

      expect(mockEmailsSend).toHaveBeenCalledOnce();
      expect(mockEmailsSend.mock.calls[0][0].to).toBe('test@example.com');
      expect(mockEmailsSend.mock.calls[0][0].subject).toContain('кандидат');
    });

    it('does nothing when no candidates available', async () => {
      mockSeekerFindMany.mockResolvedValue([]);

      await sendInitialCandidatesToNewSubscriber(mockSubscriber);

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('falls back to Gmail when Resend fails', async () => {
      mockSeekerFindMany.mockResolvedValue([mockCandidate]);
      mockEmailsSend.mockRejectedValue(new Error('Resend error'));
      mockSendEmail.mockResolvedValue(undefined);

      await sendInitialCandidatesToNewSubscriber(mockSubscriber);

      expect(mockSendEmail).toHaveBeenCalledOnce();
    });

    it('throws when DB throws', async () => {
      mockSeekerFindMany.mockRejectedValue(new Error('DB error'));

      await expect(
        sendInitialCandidatesToNewSubscriber(mockSubscriber)
      ).rejects.toThrow('DB error');
    });

    it('handles subscriber with only firstName', async () => {
      const sub = { ...mockSubscriber, lastName: undefined };
      mockSeekerFindMany.mockResolvedValue([mockCandidate]);
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      await sendInitialCandidatesToNewSubscriber(sub);

      expect(mockEmailsSend).toHaveBeenCalledOnce();
    });
  });

  describe('checkAndSendNewCandidatesNotification', () => {
    it('does nothing when no candidates exist', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindFirst.mockResolvedValue(null);

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('does nothing when most recent candidate is older than 5 minutes', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const oldDate = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: oldDate });

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('does nothing when count is not divisible by 3', async () => {
      mockSeekerCount.mockResolvedValue(4); // Not divisible by 3
      const recentDate = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('sends notifications when count is divisible by 3 and candidate is recent', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });
      mockSeekerFindMany.mockResolvedValue([mockCandidate, mockCandidate, mockCandidate]);
      mockNewsletterFindMany.mockResolvedValue([mockSubscriber]);
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).toHaveBeenCalledOnce();
    });

    it('handles no subscribers gracefully', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });
      mockSeekerFindMany.mockResolvedValue([mockCandidate]);
      mockNewsletterFindMany.mockResolvedValue([]);

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('filters candidates by subscriber city preferences', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });
      mockSeekerFindMany.mockResolvedValue([
        { ...mockCandidate, city: 'Тель-Авив' },
        { ...mockCandidate, id: 2, city: 'Хайфа' },
        { ...mockCandidate, id: 3, city: 'Иерусалим' },
      ]);
      const subscriberWithCityPreference = {
        ...mockSubscriber,
        preferredCities: ['Тель-Авив'],
      };
      mockNewsletterFindMany.mockResolvedValue([subscriberWithCityPreference]);
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      await checkAndSendNewCandidatesNotification();

      // Only 1 candidate matches the city preference, so email should be sent
      expect(mockEmailsSend).toHaveBeenCalledOnce();
    });

    it('does not send email when no candidates match subscriber preferences', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });
      mockSeekerFindMany.mockResolvedValue([
        { ...mockCandidate, city: 'Тель-Авив' },
      ]);
      const subscriberNoMatch = {
        ...mockSubscriber,
        preferredCities: ['Эйлат'], // No candidates from Eilat
      };
      mockNewsletterFindMany.mockResolvedValue([subscriberNoMatch]);

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('handles DB error gracefully (no throw)', async () => {
      mockSeekerCount.mockRejectedValue(new Error('DB error'));

      // Should not throw
      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('filters by gender preference', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });
      mockSeekerFindMany.mockResolvedValue([
        { ...mockCandidate, gender: 'мужчина' },
        { ...mockCandidate, id: 2, gender: 'женщина' },
        { ...mockCandidate, id: 3, gender: 'мужчина' },
      ]);
      const subscriberGenderPref = {
        ...mockSubscriber,
        preferredGender: 'мужчина',
      };
      mockNewsletterFindMany.mockResolvedValue([subscriberGenderPref]);
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).toHaveBeenCalledOnce();
    });

    it('filters by onlyDemanded preference', async () => {
      mockSeekerCount.mockResolvedValue(3);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      mockSeekerFindFirst.mockResolvedValue({ ...mockCandidate, createdAt: recentDate });
      mockSeekerFindMany.mockResolvedValue([
        { ...mockCandidate, isDemanded: true },
        { ...mockCandidate, id: 2, isDemanded: false },
        { ...mockCandidate, id: 3, isDemanded: false },
      ]);
      const subscriberDemanded = { ...mockSubscriber, onlyDemanded: true };
      mockNewsletterFindMany.mockResolvedValue([subscriberDemanded]);
      mockEmailsSend.mockResolvedValue({ id: 'msg-123' });

      await checkAndSendNewCandidatesNotification();

      expect(mockEmailsSend).toHaveBeenCalledOnce();
    });
  });
});
