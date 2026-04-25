import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockUserFindUnique = vi.fn();
const mockJobFindMany = vi.fn();
const mockJobCount = vi.fn();
const mockJobCreate = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: { findUnique: mockUserFindUnique },
    job: {
      findMany: mockJobFindMany,
      count: mockJobCount,
      create: mockJobCreate,
    },
  })),
}));

const mockSendTelegram = vi.fn();
vi.mock('../apps/api/utils/telegram.js', () => ({
  sendNewJobNotificationToTelegram: mockSendTelegram,
}));

vi.mock('../apps/api/middlewares/validation.js', () => ({
  containsBadWords: vi.fn(() => false),
  containsLinks: vi.fn(() => false),
}));

let createJobService;
let containsBadWords, containsLinks;

beforeAll(async () => {
  ({ createJobService } = await import('../apps/api/services/jobCreateService.js'));
  ({ containsBadWords, containsLinks } = await import('../apps/api/middlewares/validation.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  containsBadWords.mockReturnValue(false);
  containsLinks.mockReturnValue(false);
});

const mockUser = {
  id: 1,
  clerkUserId: 'user-1',
  isPremium: false,
  premiumDeluxe: false,
  jobs: [],
};

const validInput = {
  title: 'Software Developer',
  salary: '50 шек/час',
  cityId: 1,
  categoryId: 2,
  phone: '+972501234567',
  description: 'Looking for experienced developer',
  userId: 'user-1',
  shuttle: false,
  meals: false,
  imageUrl: null,
};

describe('createJobService', () => {
  it('creates a job successfully for free user', async () => {
    mockUserFindUnique.mockResolvedValue(mockUser);
    mockJobFindMany.mockResolvedValue([]);
    mockJobCount.mockResolvedValue(0);
    mockJobCreate.mockResolvedValue({ id: 1, ...validInput, city: {}, user: {}, category: {} });

    const result = await createJobService(validInput);

    expect(result.job).toBeDefined();
    expect(result.job.id).toBe(1);
    expect(mockJobCreate).toHaveBeenCalledOnce();
  });

  it('sends telegram notification for premium user', async () => {
    const premiumUser = { ...mockUser, isPremium: true };
    mockUserFindUnique.mockResolvedValue(premiumUser);
    mockJobFindMany.mockResolvedValue([]);
    mockJobCount.mockResolvedValue(0);
    mockJobCreate.mockResolvedValue({ id: 1, ...validInput, city: {}, user: {}, category: {} });
    mockSendTelegram.mockResolvedValue(undefined);

    const result = await createJobService(validInput);

    expect(result.job).toBeDefined();
    expect(mockSendTelegram).toHaveBeenCalledOnce();
  });

  it('returns error when user not found', async () => {
    mockUserFindUnique.mockResolvedValue(null);

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('error', 'Пользователь не найден');
    expect(mockJobCreate).not.toHaveBeenCalled();
  });

  it('returns error when title contains bad words', async () => {
    containsBadWords.mockReturnValueOnce(true);

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContain('Заголовок содержит нецензурные слова.');
    expect(mockJobCreate).not.toHaveBeenCalled();
  });

  it('returns error when description contains bad words', async () => {
    containsBadWords
      .mockReturnValueOnce(false)  // title
      .mockReturnValueOnce(true);  // description

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContain('Описание содержит нецензурные слова.');
  });

  it('returns error when title contains links', async () => {
    containsLinks.mockReturnValueOnce(true);

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContain('Заголовок содержит запрещенные ссылки.');
  });

  it('returns error when description contains links', async () => {
    containsLinks
      .mockReturnValueOnce(false)  // title
      .mockReturnValueOnce(true);  // description

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContain('Описание содержит запрещенные ссылки.');
  });

  it('returns error for duplicate job', async () => {
    mockUserFindUnique.mockResolvedValue(mockUser);
    mockJobFindMany.mockResolvedValue([
      { title: 'Software Developer', description: 'Looking for experienced developer' },
    ]);

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('error');
    expect(result.error).toContain('похоже на уже существующее');
    expect(mockJobCreate).not.toHaveBeenCalled();
  });

  it('returns upgradeRequired error when free user exceeds limit', async () => {
    mockUserFindUnique.mockResolvedValue(mockUser);
    mockJobFindMany.mockResolvedValue([]);
    mockJobCount.mockResolvedValue(5); // MAX_JOBS_FREE_USER

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('upgradeRequired', true);
    expect(result).toHaveProperty('error');
    expect(mockJobCreate).not.toHaveBeenCalled();
  });

  it('returns error when premium user exceeds limit', async () => {
    const premiumUser = { ...mockUser, isPremium: true };
    mockUserFindUnique.mockResolvedValue(premiumUser);
    mockJobFindMany.mockResolvedValue([]);
    mockJobCount.mockResolvedValue(10); // MAX_JOBS_PREMIUM_USER

    const result = await createJobService(validInput);

    expect(result).toHaveProperty('error');
    expect(result.error).toContain('10 объявлений');
    expect(result.upgradeRequired).toBeUndefined();
  });

  it('allows premiumDeluxe user to post up to 10 jobs', async () => {
    const deluxeUser = { ...mockUser, premiumDeluxe: true };
    mockUserFindUnique.mockResolvedValue(deluxeUser);
    mockJobFindMany.mockResolvedValue([]);
    mockJobCount.mockResolvedValue(9); // one below premium limit
    mockJobCreate.mockResolvedValue({ id: 1, ...validInput, city: {}, user: {}, category: {} });

    const result = await createJobService(validInput);

    expect(result.job).toBeDefined();
  });
});
