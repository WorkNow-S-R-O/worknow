import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFindUnique = vi.fn();
vi.mock('../apps/api/lib/prisma.js', () => ({
  default: { job: { findUnique: mockFindUnique } },
}));

let getJobByIdService;
beforeAll(async () => {
  ({ getJobByIdService } = await import('../apps/api/services/jobService.js'));
});

beforeEach(() => {
  mockFindUnique.mockReset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('getJobByIdService', () => {
  const mockJob = {
    id: 1, title: 'Dev', imageUrl: 'https://example.com/img.jpg',
    city: { id: 1, name: 'TLV' }, category: { id: 1, name: 'IT' },
    user: { id: 'u1', isPremium: false, firstName: 'John', lastName: 'D', clerkUserId: 'c1' },
  };

  it('returns wrapped job object when found', async () => {
    mockFindUnique.mockResolvedValue(mockJob);
    const result = await getJobByIdService('1');
    expect(result).toEqual({ job: mockJob });
  });

  it('returns error object when job not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await getJobByIdService('1');
    expect(result).toHaveProperty('error', 'Объявление не найдено');
  });

  it('returns error object when id is missing', async () => {
    const result = await getJobByIdService(undefined);
    expect(result).toHaveProperty('error');
  });

  it('returns error object when id is not a number', async () => {
    const result = await getJobByIdService('abc');
    expect(result).toHaveProperty('error');
  });

  it('returns error object when prisma throws', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB'));
    const result = await getJobByIdService('1');
    expect(result).toHaveProperty('error');
  });
});
