import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockUserFindUnique = vi.fn();
const mockUserUpsert = vi.fn();
const mockUserDelete = vi.fn();
const mockJobFindMany = vi.fn();
const mockJobCount = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findUnique: mockUserFindUnique,
      upsert: mockUserUpsert,
      delete: mockUserDelete,
    },
    job: {
      findMany: mockJobFindMany,
      count: mockJobCount,
    },
  })),
}));

vi.mock('dotenv', () => ({
  default: { config: vi.fn() },
}));

const mockFetch = vi.fn();
vi.mock('node-fetch', () => ({ default: mockFetch }));

const mockWebhookVerify = vi.fn();
vi.mock('svix', () => ({
  Webhook: vi.fn(() => ({ verify: mockWebhookVerify })),
}));

let syncUserService, getUserByClerkIdService, getUserJobsService, handleClerkWebhookService;

beforeAll(async () => {
  process.env.CLERK_SECRET_KEY = 'sk_test_clerk_secret_key';
  process.env.WEBHOOK_SECRET = 'whsec_test_secret';
  ({ syncUserService, getUserByClerkIdService, getUserJobsService, handleClerkWebhookService } =
    await import('../apps/api/services/userService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const mockUser = {
  id: 1,
  clerkUserId: 'user_123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
};

describe('userService', () => {
  describe('syncUserService', () => {
    it('returns error when no clerkUserId', async () => {
      const result = await syncUserService(null);
      expect(result).toHaveProperty('error', 'Missing Clerk user ID');
    });

    it('returns user when found in DB', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);

      const result = await syncUserService('user_123');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches from Clerk when user not in DB', async () => {
      mockUserFindUnique.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com' }],
          first_name: 'John',
          last_name: 'Doe',
          image_url: null,
        }),
      });
      mockUserUpsert.mockResolvedValue(mockUser);

      const result = await syncUserService('user_123');

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledOnce();
    });

    it('returns error when Clerk API fails', async () => {
      mockUserFindUnique.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: vi.fn().mockResolvedValue('Unauthorized'),
      });

      const result = await syncUserService('user_123');

      expect(result).toHaveProperty('error');
      expect(result.error).toContain('Clerk API');
    });

    it('returns error on exception', async () => {
      mockUserFindUnique.mockRejectedValue(new Error('DB error'));

      const result = await syncUserService('user_123');

      expect(result).toHaveProperty('error', 'Failed to sync user');
    });
  });

  describe('getUserByClerkIdService', () => {
    it('returns user when found', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);

      const result = await getUserByClerkIdService('user_123');

      expect(result.user).toEqual(mockUser);
    });

    it('returns error when user not found', async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const result = await getUserByClerkIdService('user_999');

      expect(result).toHaveProperty('error');
    });

    it('returns error on exception', async () => {
      mockUserFindUnique.mockRejectedValue(new Error('DB error'));

      const result = await getUserByClerkIdService('user_123');

      expect(result).toHaveProperty('error');
    });
  });

  describe('getUserJobsService', () => {
    it('returns jobs for existing user', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockJobFindMany.mockResolvedValue([{ id: 1, title: 'Job 1', city: {}, user: {}, category: { translations: [] } }]);
      mockJobCount.mockResolvedValue(1);

      const result = await getUserJobsService('user_123', { page: 1, limit: 5 });

      expect(result.jobs).toHaveLength(1);
      expect(result.totalJobs).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('uses default pagination', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockJobFindMany.mockResolvedValue([]);
      mockJobCount.mockResolvedValue(0);

      const result = await getUserJobsService('user_123', {});

      expect(result.currentPage).toBe(1);
    });

    it('returns error on exception', async () => {
      mockUserFindUnique.mockRejectedValue(new Error('DB error'));

      const result = await getUserJobsService('user_123', {});

      expect(result).toHaveProperty('error');
    });
  });

  describe('handleClerkWebhookService', () => {
    it('returns error when svix headers are missing', async () => {
      const req = { headers: {}, rawBody: '' };

      const result = await handleClerkWebhookService(req);

      expect(result).toHaveProperty('error', 'Missing Svix headers');
    });

    it('handles user.created event', async () => {
      const evt = {
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'new@example.com' }],
          first_name: 'New',
          last_name: 'User',
          image_url: null,
        },
      };
      mockWebhookVerify.mockReturnValue(evt);
      mockUserUpsert.mockResolvedValue(mockUser);

      const req = {
        headers: {
          'svix-id': 'test-id',
          'svix-timestamp': '1234567890',
          'svix-signature': 'test-sig',
        },
        rawBody: '{}',
      };

      const result = await handleClerkWebhookService(req);

      expect(result.success).toBe(true);
      expect(mockUserUpsert).toHaveBeenCalledOnce();
    });

    it('handles user.deleted event', async () => {
      const evt = {
        type: 'user.deleted',
        data: { id: 'user_123' },
      };
      mockWebhookVerify.mockReturnValue(evt);
      mockUserDelete.mockResolvedValue(mockUser);

      const req = {
        headers: {
          'svix-id': 'test-id',
          'svix-timestamp': '1234567890',
          'svix-signature': 'test-sig',
        },
        rawBody: '{}',
      };

      const result = await handleClerkWebhookService(req);

      expect(result.success).toBe(true);
      expect(mockUserDelete).toHaveBeenCalledOnce();
    });

    it('handles webhook verification failure', async () => {
      mockWebhookVerify.mockImplementation(() => {
        throw new Error('Verification failed');
      });

      const req = {
        headers: {
          'svix-id': 'test-id',
          'svix-timestamp': '1234567890',
          'svix-signature': 'bad-sig',
        },
        rawBody: '{}',
      };

      const result = await handleClerkWebhookService(req);

      expect(result).toHaveProperty('error', 'Webhook verification failed');
    });
  });
});
