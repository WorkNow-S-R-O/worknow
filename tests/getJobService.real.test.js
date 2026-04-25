import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFindUnique = vi.fn();
vi.mock('../apps/api/lib/prisma.js', () => ({
  default: {
    job: { findUnique: mockFindUnique },
  },
}));

vi.mock('../apps/api/services/redisService.js', () => ({
  default: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(undefined),
    invalidateJobsCache: vi.fn().mockResolvedValue(undefined),
  },
}));

let getJobByIdService;

beforeAll(async () => {
  ({ getJobByIdService } = await import('../apps/api/services/jobService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const mockJob = {
  id: 1,
  title: 'Developer',
  imageUrl: 'https://example.com/img.jpg',
  city: { id: 1, name: 'TLV' },
  category: { id: 1, name: 'IT' },
  user: { id: 'u1', isPremium: false },
};

describe('getJobByIdService (jobService.js)', () => {
  it('returns wrapped job when found', async () => {
    mockFindUnique.mockResolvedValue(mockJob);

    const result = await getJobByIdService(1);

    expect(result).toEqual({ job: mockJob });
    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
  });

  it('returns error when job not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getJobByIdService(999);

    expect(result).toHaveProperty('error', 'Объявление не найдено');
  });

  it('parses string id to Number', async () => {
    mockFindUnique.mockResolvedValue(mockJob);

    await getJobByIdService('42');

    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 42 } })
    );
  });

  it('returns error object when DB throws', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB down'));

    const result = await getJobByIdService(1);

    expect(result).toHaveProperty('error');
    expect(result.details).toBe('DB down');
  });
});
