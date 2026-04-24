import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({ job: { findUnique: mockFindUnique, update: mockUpdate } })),
}));

let boostJobService;
beforeAll(async () => {
  ({ boostJobService } = await import('../apps/api/services/jobBoostService.js'));
});

beforeEach(() => {
  mockFindUnique.mockReset();
  mockUpdate.mockReset();
});

describe('boostJobService', () => {
  const mockUser = { id: 'u1', isPremium: true };

  it('returns error when job not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await boostJobService('99');
    expect(result).toHaveProperty('error', 'Объявление не найдено');
  });

  it('returns error when user not found', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, boostedAt: null, user: null });
    const result = await boostJobService('1');
    expect(result).toHaveProperty('error', 'Пользователь не найден');
  });

  it('boosts job when never boosted before', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, boostedAt: null, user: mockUser });
    const boostedJob = { id: 1, boostedAt: new Date() };
    mockUpdate.mockResolvedValue(boostedJob);
    const result = await boostJobService('1');
    expect(result).toHaveProperty('boostedJob');
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('returns time error when boosted less than 24h ago', async () => {
    const recentBoost = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
    mockFindUnique.mockResolvedValue({ id: 1, boostedAt: recentBoost, user: mockUser });
    const result = await boostJobService('1');
    expect(result.error).toMatch(/ч/);
  });

  it('boosts job when last boost was more than 24h ago', async () => {
    const oldBoost = new Date(Date.now() - 1000 * 60 * 60 * 25); // 25h ago
    mockFindUnique.mockResolvedValue({ id: 1, boostedAt: oldBoost, user: mockUser });
    mockUpdate.mockResolvedValue({ id: 1, boostedAt: new Date() });
    const result = await boostJobService('1');
    expect(result).toHaveProperty('boostedJob');
  });

  it('returns error on prisma failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB'));
    const result = await boostJobService('1');
    expect(result).toHaveProperty('error');
  });
});
