import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFindMany = vi.fn();
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({ city: { findMany: mockFindMany } })),
}));

let getCitiesService;
beforeAll(async () => {
  ({ getCitiesService } = await import('../apps/api/services/cityService.js'));
});

beforeEach(() => {
  mockFindMany.mockReset();
});

describe('getCitiesService', () => {
  it('returns cities mapped to id/name using translation', async () => {
    mockFindMany.mockResolvedValue([
      { id: 1, name: 'Tel Aviv', translations: [{ lang: 'ru', name: 'Тель-Авив' }] },
      { id: 2, name: 'Haifa', translations: [{ lang: 'ru', name: 'Хайфа' }] },
    ]);
    const result = await getCitiesService('ru');
    expect(result.cities).toEqual([
      { id: 1, name: 'Тель-Авив' },
      { id: 2, name: 'Хайфа' },
    ]);
  });

  it('falls back to city.name when no translation exists', async () => {
    mockFindMany.mockResolvedValue([
      { id: 3, name: 'Beersheba', translations: [] },
    ]);
    const result = await getCitiesService('ru');
    expect(result.cities).toEqual([{ id: 3, name: 'Beersheba' }]);
  });

  it('defaults to lang=ru when no lang argument given', async () => {
    mockFindMany.mockResolvedValue([]);
    await getCitiesService();
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ include: { translations: { where: { lang: 'ru' } } } })
    );
  });

  it('returns error object when prisma throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB error'));
    const result = await getCitiesService('ru');
    expect(result).toHaveProperty('error');
  });
});
