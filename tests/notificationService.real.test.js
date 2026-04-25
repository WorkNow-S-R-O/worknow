import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockSendEmail = vi.fn();
vi.mock('../apps/api/utils/mailer.js', () => ({
  sendEmail: mockSendEmail,
}));

const mockUserFindMany = vi.fn();
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findMany: mockUserFindMany,
    },
  })),
}));

let sendNewCandidatesNotification, sendSingleCandidateNotification, sendMultipleCandidatesNotification;

beforeAll(async () => {
  ({ sendNewCandidatesNotification, sendSingleCandidateNotification, sendMultipleCandidatesNotification } =
    await import('../apps/api/services/notificationService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const mockSeeker = {
  id: 1,
  name: 'Ivan Petrov',
  city: 'Tel Aviv',
  description: 'Experienced worker',
  category: 'Construction',
  employment: 'full',
  languages: ['Russian', 'Hebrew'],
  isDemanded: false,
};

const mockUsers = [
  { id: 1, email: 'user1@example.com', firstName: 'John', lastName: 'Doe', clerkUserId: 'clerk1' },
  { id: 2, email: 'user2@example.com', firstName: null, lastName: null, clerkUserId: 'clerk2' },
];

describe('notificationService', () => {
  describe('sendNewCandidatesNotification', () => {
    it('sends notifications to all users', async () => {
      mockUserFindMany.mockResolvedValue(mockUsers);
      mockSendEmail.mockResolvedValue(true);

      const result = await sendNewCandidatesNotification([mockSeeker]);

      expect(result.totalUsers).toBe(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.newCandidates).toBe(1);
    });

    it('returns early when no users found', async () => {
      mockUserFindMany.mockResolvedValue([]);
      const result = await sendNewCandidatesNotification([mockSeeker]);
      expect(result).toBeUndefined();
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('handles partial email failures', async () => {
      mockUserFindMany.mockResolvedValue(mockUsers);
      mockSendEmail
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('Email error'));

      const result = await sendNewCandidatesNotification([mockSeeker]);
      // sendEmailToUser catches errors internally, so both resolve
      expect(result.totalUsers).toBe(2);
    });

    it('uses first name in email when available', async () => {
      mockUserFindMany.mockResolvedValue([
        { id: 1, email: 'user@example.com', firstName: 'Alice', lastName: 'Smith', clerkUserId: 'clerk1' },
      ]);
      mockSendEmail.mockResolvedValue(true);

      await sendNewCandidatesNotification([mockSeeker]);
      expect(mockSendEmail).toHaveBeenCalledWith(
        'user@example.com',
        expect.any(String),
        expect.stringContaining('Alice'),
      );
    });

    it('uses Пользователь when no name', async () => {
      mockUserFindMany.mockResolvedValue([
        { id: 2, email: 'user2@example.com', firstName: null, lastName: null, clerkUserId: 'clerk2' },
      ]);
      mockSendEmail.mockResolvedValue(true);

      await sendNewCandidatesNotification([mockSeeker]);
      expect(mockSendEmail).toHaveBeenCalledWith(
        'user2@example.com',
        expect.any(String),
        expect.stringContaining('Пользователь'),
      );
    });

    it('throws when database fails', async () => {
      mockUserFindMany.mockRejectedValue(new Error('DB error'));
      await expect(sendNewCandidatesNotification([mockSeeker])).rejects.toThrow();
    });

    it('includes isDemanded seeker in email', async () => {
      mockUserFindMany.mockResolvedValue([mockUsers[0]]);
      mockSendEmail.mockResolvedValue(true);

      await sendNewCandidatesNotification([{ ...mockSeeker, isDemanded: true }]);
      expect(mockSendEmail).toHaveBeenCalled();
    });

    it('handles seeker without category/employment/languages', async () => {
      const minimalSeeker = { id: 2, name: 'Test', city: 'TLV', description: 'Test', isDemanded: false };
      mockUserFindMany.mockResolvedValue([mockUsers[0]]);
      mockSendEmail.mockResolvedValue(true);

      const result = await sendNewCandidatesNotification([minimalSeeker]);
      expect(result.successful).toBe(1);
    });

    it('handles multiple new candidates', async () => {
      const seekers = [mockSeeker, { ...mockSeeker, id: 2, name: 'Anna' }];
      mockUserFindMany.mockResolvedValue([mockUsers[0]]);
      mockSendEmail.mockResolvedValue(true);

      const result = await sendNewCandidatesNotification(seekers);
      expect(result.newCandidates).toBe(2);
    });
  });

  describe('sendSingleCandidateNotification', () => {
    it('calls sendNewCandidatesNotification with single seeker', async () => {
      mockUserFindMany.mockResolvedValue([mockUsers[0]]);
      mockSendEmail.mockResolvedValue(true);

      const result = await sendSingleCandidateNotification(mockSeeker);
      expect(result.newCandidates).toBe(1);
    });
  });

  describe('sendMultipleCandidatesNotification', () => {
    it('calls sendNewCandidatesNotification with multiple seekers', async () => {
      const seekers = [mockSeeker, { ...mockSeeker, id: 2, name: 'Maria' }];
      mockUserFindMany.mockResolvedValue([mockUsers[0]]);
      mockSendEmail.mockResolvedValue(true);

      const result = await sendMultipleCandidatesNotification(seekers);
      expect(result.newCandidates).toBe(2);
    });
  });
});
