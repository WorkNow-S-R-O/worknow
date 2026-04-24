import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockFindUnique = vi.fn();
const mockDelete = vi.fn();
const mockFindMany = vi.fn();
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    job: { findUnique: mockFindUnique, delete: mockDelete, findMany: mockFindMany },
  })),
}));
vi.mock('../apps/api/utils/telegram.js', () => ({
  sendUpdatedJobListToTelegram: vi.fn(),
}));
vi.mock('../apps/api/utils/s3Upload.js', () => ({
  deleteFromS3: vi.fn().mockResolvedValue(true),
}));

let deleteJobService;
beforeAll(async () => {
  ({ deleteJobService } = await import('../apps/api/services/jobDeleteService.js'));
});

beforeEach(() => {
  mockFindUnique.mockReset();
  mockDelete.mockReset();
  mockFindMany.mockReset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('deleteJobService', () => {
  const mockUser = { id: 'u1', clerkUserId: 'clerk_1', isPremium: false };

  it('returns error when job not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await deleteJobService('99', 'clerk_1');
    expect(result).toHaveProperty('error', 'Объявление не найдено');
  });

  it('returns auth error when user does not own job', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, imageUrl: null, user: { ...mockUser, clerkUserId: 'clerk_other' } });
    const result = await deleteJobService('1', 'clerk_1');
    expect(result.error).toMatch(/нет прав/);
  });

  it('deletes job successfully', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, imageUrl: null, user: mockUser });
    mockDelete.mockResolvedValue({});
    const result = await deleteJobService('1', 'clerk_1');
    expect(result).toEqual({});
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deletes job and calls telegram for premium user', async () => {
    const { sendUpdatedJobListToTelegram } = await import('../apps/api/utils/telegram.js');
    mockFindUnique.mockResolvedValue({ id: 1, imageUrl: null, user: { ...mockUser, isPremium: true } });
    mockDelete.mockResolvedValue({});
    mockFindMany.mockResolvedValue([]);
    await deleteJobService('1', 'clerk_1');
    expect(sendUpdatedJobListToTelegram).toHaveBeenCalled();
  });

  it('returns error on unexpected prisma failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB'));
    const result = await deleteJobService('1', 'clerk_1');
    expect(result).toHaveProperty('error');
  });
});
