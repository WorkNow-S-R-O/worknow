import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFindUnique = vi.fn();
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    job: { findUnique: mockFindUnique },
  })),
}));

let getJobByIdService;

beforeAll(async () => {
  ({ getJobByIdService } = await import('../apps/api/services/getJobService.js'));
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

describe('getJobByIdService (getJobService.js)', () => {
  it('returns job when found', async () => {
    mockFindUnique.mockResolvedValue(mockJob);

    const result = await getJobByIdService(1);

    expect(result).toEqual(mockJob);
    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
  });

  it('returns null when job not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getJobByIdService(999);

    expect(result).toBeNull();
  });

  it('parses string id to integer', async () => {
    mockFindUnique.mockResolvedValue(mockJob);

    await getJobByIdService('42');

    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 42 } })
    );
  });

  it('throws when DB throws', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB down'));

    await expect(getJobByIdService(1)).rejects.toThrow('Ошибка получения объявления');
  });
});
